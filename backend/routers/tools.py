from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from openai import OpenAI
import schemas, models, database, auth
import wikipedia

router = APIRouter(
    prefix="/tools",
    tags=["tools"],
    dependencies=[Depends(auth.get_current_user)],
)

# Use dummy key fallback
client = OpenAI(api_key=os.getenv("LLM_API_KEY") or "dummy_key")

class FAQRequest(BaseModel):
    url: Optional[str] = None
    topic: Optional[str] = None

class FAQResponse(BaseModel):
    faqs: List[dict]
    json_ld: str

@router.post("/generate-faq", response_model=FAQResponse)
def generate_faq(request: FAQRequest, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    if not request.url and not request.topic:
        raise HTTPException(status_code=400, detail="Must provide either url or topic")
    
    query = request.url if request.url else request.topic
    
    # 1. Fetch Wikipedia context first (for RAG)
    entity_name = query
    if "http" in query or "." in query:
        entity_name = query.replace("https://", "").replace("http://", "").replace("www.", "").split(".")[0].capitalize()
    else:
        entity_name = query.capitalize()

    try:
        wiki_summary = wikipedia.summary(entity_name, sentences=2)
        wiki_url = wikipedia.page(entity_name).url
    except Exception:
        wiki_summary = f"No direct Wikipedia entry found for {entity_name}. Grounding details in general web optimization patterns."
        wiki_url = None

    if not os.getenv("LLM_API_KEY"):
        # Dynamic Wikipedia-powered fallback if no API key is provided
        mock_faqs = [
            {
                "question": f"What is {entity_name}?",
                "answer": wiki_summary
            },
            {
                "question": f"How is {entity_name} optimized for AI search engines like ChatGPT and Gemini?",
                "answer": f"{entity_name} optimization leverages structured semantic HTML, clean content maps, and exact Q&A entries so that Answer Engine agents can easily index key company services."
            },
            {
                "question": f"Where can users find official references for {entity_name}?",
                "answer": f"You can explore details on the official site {request.url or ''} or read public references at {wiki_url or 'Wikipedia'}."
            }
        ]
        
        mock_json_ld = f"""<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {{
      "@type": "Question",
      "name": "What is {entity_name}?",
      "acceptedAnswer": {{
        "@type": "Answer",
        "text": "{wiki_summary}"
      }}
    }},
    {{
      "@type": "Question",
      "name": "How is {entity_name} optimized for AI search engines like ChatGPT and Gemini?",
      "acceptedAnswer": {{
        "@type": "Answer",
        "text": "{entity_name} optimization leverages structured semantic HTML, clean content maps, and exact Q&A entries so that Answer Engine agents can easily index key company services."
      }}
    }},
    {{
      "@type": "Question",
      "name": "Where can users find official references for {entity_name}?",
      "acceptedAnswer": {{
        "@type": "Answer",
        "text": "You can explore details on the official site {request.url or ''} or read public references at {wiki_url or 'Wikipedia'}."
      }}
    }}
  ]
}}
</script>"""
        return FAQResponse(faqs=mock_faqs, json_ld=mock_json_ld.strip())

    prompt = f"""
    You are an Answer Engine Optimization (AEO) expert. 
    Generate a set of 3 highly optimized FAQs for the following topic or URL: {query}
    
    Ground your generation in the following real-time background context retrieved from Wikipedia:
    Context: {wiki_summary}
    Wikipedia URL: {wiki_url}
    
    If a valid Wikipedia URL is present, list it as a reference in your answers if appropriate.
    
    Provide a JSON response with the following keys EXACTLY:
    "faqs": A list of objects, each containing "question" and "answer" strings.
    "json_ld": A valid JSON-LD string representing the FAQPage schema markup. Include the <script type="application/ld+json"> tags.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        response_json = json.loads(response.choices[0].message.content)
        
        # Save usage to database
        db_usage = models.ToolUsage(
            owner_id=current_user.id,
            tool_name="faq_generator",
            target_url=request.url,
            output_data=json.dumps(response_json)
        )
        db.add(db_usage)
        db.commit()
        
        return FAQResponse(
            faqs=response_json.get("faqs", []),
            json_ld=response_json.get("json_ld", "")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class SchemaRequest(BaseModel):
    url: str
    business_type: str
    name: str
    description: str

class SchemaResponse(BaseModel):
    json_ld: str

@router.post("/generate-schema", response_model=SchemaResponse)
def generate_schema(request: SchemaRequest, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    # 1. Fetch Wikipedia context first (for sameAs connection)
    wiki_summary = ""
    wiki_url = None
    try:
        page = wikipedia.page(request.name)
        wiki_summary = page.summary[:400]
        wiki_url = page.url
    except Exception:
        wiki_summary = "No direct Wikipedia entry found for entity."
        
    if not os.getenv("LLM_API_KEY"):
        # Dynamic Wikipedia-powered Schema fallback
        same_as_line = f',\n  "sameAs": [\n    "{wiki_url}"\n  ]' if wiki_url else ""
        
        mock_schema = f"""<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "{request.business_type}",
  "name": "{request.name}",
  "url": "{request.url}",
  "description": "{request.description}"{same_as_line}
}}
</script>"""
        return SchemaResponse(json_ld=mock_schema)

    prompt = f"""
    You are an SEO and Schema Markup expert.
    Generate valid JSON-LD schema markup for the following business:
    URL: {request.url}
    Type: {request.business_type}
    Name: {request.name}
    Description: {request.description}
    
    Wikipedia grounding context for entity tracking:
    Context: {wiki_summary}
    Wikipedia URL: {wiki_url}
    
    If a valid Wikipedia URL is present, include it in the "sameAs" array of the schema markup.
    
    Provide a JSON response with the EXACT key "json_ld" containing the schema string WITH the <script type="application/ld+json"> tags.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        response_json = json.loads(response.choices[0].message.content)
        
        # Save usage to database
        db_usage = models.ToolUsage(
            owner_id=current_user.id,
            tool_name="schema_generator",
            target_url=request.url,
            output_data=json.dumps(response_json)
        )
        db.add(db_usage)
        db.commit()
        
        return SchemaResponse(json_ld=response_json.get("json_ld", ""))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
