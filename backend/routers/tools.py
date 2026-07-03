from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from openai import OpenAI
import schemas, models, database, auth

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
    
    if not os.getenv("LLM_API_KEY"):
        # Dynamic fallback if no API key is provided
        entity_name = query
        if request.url:
            entity_name = request.url.replace("https://", "").replace("http://", "").replace("www.", "").split(".")[0].capitalize()
        
        mock_faqs = [
            {
                "question": f"What services does {entity_name} offer?",
                "answer": f"{entity_name} specializes in high-quality digital solutions, structured layout optimization, and target content visibility to drive optimal engagement."
            },
            {
                "question": f"How is {entity_name} optimized for AI search engines like ChatGPT and Gemini?",
                "answer": f"{entity_name} leverages clean structured schema markup, semantic formatting, and direct Q&A entities to ensure LLM crawl agents can easily index its content."
            },
            {
                "question": f"How can users find more information about {entity_name}?",
                "answer": f"You can explore comprehensive details, platform tools, and support contact channels directly on the official website or checking out {entity_name} pages."
            }
        ]
        
        mock_json_ld = f"""<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {{
      "@type": "Question",
      "name": "What services does {entity_name} offer?",
      "acceptedAnswer": {{
        "@type": "Answer",
        "text": "{entity_name} specializes in high-quality digital solutions, structured layout optimization, and target content visibility to drive optimal engagement."
      }}
    }},
    {{
      "@type": "Question",
      "name": "How is {entity_name} optimized for AI search engines like ChatGPT and Gemini?",
      "acceptedAnswer": {{
        "@type": "Answer",
        "text": "{entity_name} leverages clean structured schema markup, semantic formatting, and direct Q&A entities to ensure LLM crawl agents can easily index its content."
      }}
    }},
    {{
      "@type": "Question",
      "name": "How can users find more information about {entity_name}?",
      "acceptedAnswer": {{
        "@type": "Answer",
        "text": "You can explore comprehensive details, platform tools, and support contact channels directly on the official website or checking out {entity_name} pages."
      }}
    }}
  ]
}}
</script>"""
        return FAQResponse(faqs=mock_faqs, json_ld=mock_json_ld.strip())

    prompt = f"""
    You are an Answer Engine Optimization (AEO) expert. 
    Generate a set of 3 highly optimized FAQs for the following topic or URL: {query}
    
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
    if not os.getenv("LLM_API_KEY"):
        mock_schema = f"""<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "{request.business_type}",
  "name": "{request.name}",
  "url": "{request.url}",
  "description": "{request.description}"
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
