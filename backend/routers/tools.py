from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import datetime
from openai import OpenAI
import schemas, models, database, auth
import wikipedia

router = APIRouter(
    prefix="/tools",
    tags=["tools"],
    dependencies=[Depends(auth.get_current_user)],
)

API_KEY = os.getenv("LLM_API_KEY") or os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=API_KEY or "dummy_key")

class FAQRequest(BaseModel):
    url: Optional[str] = None
    topic: Optional[str] = None
    count: Optional[int] = 5

class FAQResponse(BaseModel):
    faqs: List[dict]
    json_ld: str

@router.post("/generate-faq", response_model=FAQResponse)
def generate_faq(request: FAQRequest, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    if not request.url and not request.topic:
        raise HTTPException(status_code=400, detail="Must provide either url or topic")
    
    query = request.url if request.url else request.topic
    requested_count = request.count or 5
    # Fully free and unlocked up to 1000 FAQs for all users
    count = min(requested_count, 1000)

    # 1. Scraping / Crawling site content if a URL is provided
    scraped_content = ""
    if request.url:
        import httpx
        from bs4 import BeautifulSoup
        try:
            with httpx.Client(timeout=8.0, follow_redirects=True) as client:
                headers = {"User-Agent": "CitexaBot/1.0 (Answer Engine Optimization Crawler)"}
                response = client.get(request.url, headers=headers)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    for element in soup(["script", "style", "nav", "footer", "header"]):
                        element.extract()
                    text = soup.get_text(separator=' ')
                    lines = (line.strip() for line in text.splitlines())
                    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
                    scraped_content = '\n'.join(chunk for chunk in chunks if chunk)[:3000]
                    print(f"CRAWLER SUCCESS: Scraped {len(scraped_content)} chars from {request.url}")
        except Exception as e:
            print(f"CRAWLER WARNING: Failed to scrape {request.url}: {e}")

    # 2. Fetch Wikipedia context fallback (for RAG index)
    entity_name = query
    if "http" in query or "." in query:
        entity_name = query.replace("https://", "").replace("http://", "").replace("www.", "").split(".")[0].capitalize()
    else:
        entity_name = query.capitalize()

    try:
        wiki_summary = wikipedia.summary(entity_name, sentences=2)
        wiki_url = wikipedia.page(entity_name).url
    except Exception:
        wiki_summary = f"No direct Wikipedia entry found for {entity_name}."
        wiki_url = None

    # Merge grounding context (Prioritize actual website crawl content)
    if scraped_content:
        grounding_context = f"Scraped Website Content from {request.url}:\n{scraped_content}"
    else:
        grounding_context = f"Wikipedia Grounding Summary:\n{wiki_summary}\nWikipedia URL: {wiki_url}"

    if not API_KEY:
        # Dynamic RAG-powered fallback if no API key is provided
        mock_faqs = []
        base_templates = [
            ("What is {entity_name}?", wiki_summary),
            ("What are the core features and services of {entity_name}?", "{entity_name} provides optimized tools, digital accessibility, and robust structured schemas to increase search index visibility."),
            ("How is {entity_name} optimized for AI search engines like ChatGPT and Gemini?", "{entity_name} optimization leverages structured semantic HTML, clean content maps, and exact Q&A entries so that Answer Engine agents can easily index key company services."),
            ("Why is Answer Engine Optimization (AEO) important for {entity_name}?", "AEO ensures that AI search engines and LLM models can accurately retrieve, synthesize, and cite {entity_name} content in answer summaries."),
            ("Where can users find official references for {entity_name}?", "You can explore details on the official site {url} or read public references at {wiki_url}.")
        ]

        if scraped_content:
            import re
            sentences = [s.strip() for s in re.split(r'\. |\n', scraped_content) if len(s.strip()) > 35]
            if len(sentences) >= 3:
                base_templates = [
                    (f"What does the website of {entity_name} focus on?", f"According to site content: {sentences[0]}."),
                    (f"What key information is highlighted on {entity_name}?", f"The page details: {sentences[1]}."),
                    (f"How is {entity_name} optimized for search engines?", f"{entity_name} structures its content ({sentences[2][:100]}...) with clean metadata schemas."),
                    (f"Why is AEO important for {entity_name}?", f"AEO allows generative search engines to directly extract details such as: {sentences[0][:150]}..."),
                    (f"Where can users find references for {entity_name}?", f"Check out the official website {request.url} or community guides.")
                ]
        
        for i in range(count):
            t_idx = i % len(base_templates)
            q, a = base_templates[t_idx]
            suffix = f" (Ref #{i // len(base_templates) + 1})" if i >= len(base_templates) else ""
            mock_faqs.append({
                "question": q.format(entity_name=entity_name) + suffix,
                "answer": a.format(entity_name=entity_name, url=request.url or "domain", wiki_url=wiki_url or "Wikipedia")
            })

        main_entities = []
        for faq in mock_faqs:
            main_entities.append({
                "@type": "Question",
                "name": faq["question"],
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq["answer"]
                }
            })
        faq_schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": main_entities
        }
        mock_json_ld = f"""<script type="application/ld+json">
{json.dumps(faq_schema, indent=2)}
</script>"""
        return FAQResponse(faqs=mock_faqs, json_ld=mock_json_ld.strip())

    all_faqs = []
    batch_size = 50
    total_batches = (count + batch_size - 1) // batch_size

    try:
        for b in range(total_batches):
            current_batch_count = min(batch_size, count - len(all_faqs))
            if current_batch_count <= 0:
                break
                
            existing_questions = [f["question"] for f in all_faqs]
            existing_questions_str = ", ".join(existing_questions) if existing_questions else "None"
            
            prompt = f"""
            You are an Answer Engine Optimization (AEO) expert.
            Generate a set of {current_batch_count} highly optimized FAQ questions and answers for: {query}
            
            Ground your generation in the following real-time background context (scraped from the website or retrieved from Wikipedia):
            Context: {grounding_context}
            
            CRITICAL: Do NOT duplicate or repeat any of these existing questions:
            [{existing_questions_str}]
            
            Provide a JSON response with the EXACT key "faqs" containing a list of objects, each with "question" and "answer" strings.
            """
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={ "type": "json_object" }
            )
            response_json = json.loads(response.choices[0].message.content)
            batch_faqs = response_json.get("faqs", [])
            for faq in batch_faqs:
                if faq.get("question") and faq.get("answer"):
                    if faq["question"] not in [f["question"] for f in all_faqs]:
                        all_faqs.append(faq)
            
            if not batch_faqs:
                break

        # Save usage to database
        db_usage = models.ToolUsage(
            owner_id=current_user.id,
            tool_name="faq_generator",
            target_url=request.url,
            output_data=json.dumps(all_faqs)
        )
        db.add(db_usage)
        db.commit()

        # Build schema script programmatically
        main_entities = []
        for faq in all_faqs:
            main_entities.append({
                "@type": "Question",
                "name": faq["question"],
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq["answer"]
                }
            })
        faq_schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": main_entities
        }
        json_ld_string = f"""<script type="application/ld+json">
{json.dumps(faq_schema, indent=2)}
</script>"""

        return FAQResponse(
            faqs=all_faqs,
            json_ld=json_ld_string.strip()
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
        
    if not API_KEY:
        # Rich Dynamic Schema fallback generator
        same_as_links = [
            f"https://www.facebook.com/{request.name.lower().replace(' ', '')}",
            f"https://twitter.com/{request.name.lower().replace(' ', '')}",
            f"https://www.linkedin.com/company/{request.name.lower().replace(' ', '')}"
        ]
        if wiki_url:
            same_as_links.insert(0, wiki_url)
            
        mock_schema_data = {
            "@context": "https://schema.org",
            "@type": request.business_type if request.business_type else "Organization",
            "name": request.name,
            "url": request.url,
            "logo": f"{request.url.rstrip('/')}/logo.png",
            "description": request.description,
            "sameAs": same_as_links,
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-800-555-0199",
                "contactType": "customer support",
                "areaServed": "US",
                "availableLanguage": "English"
            },
            "potentialAction": {
                "@type": "SearchAction",
                "target": f"{request.url.rstrip('/')}/search?q={{search_term_string}}",
                "query-input": "required name=search_term_string"
            }
        }
        
        mock_schema = f"""<script type="application/ld+json">
{json.dumps(mock_schema_data, indent=2)}
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

class BulkSchemaItem(BaseModel):
    url: str
    name: str
    description: Optional[str] = ""

class BulkSchemaRequest(BaseModel):
    platform: str
    schema_type: str
    items: List[BulkSchemaItem]

class BulkSchemaResponse(BaseModel):
    schemas: List[dict]

@router.post("/generate-bulk-schema", response_model=BulkSchemaResponse)
def generate_bulk_schema(request: BulkSchemaRequest, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    # Generate schemas for up to 1000 items
    items = request.items[:1000]
    generated = []
    
    for idx, item in enumerate(items):
        logo_url = f"{item.url.rstrip('/')}/logo.png"
        
        # Build base dynamic schema layout depending on selected type
        schema_block = {
            "@context": "https://schema.org",
            "@type": request.schema_type,
            "name": item.name,
            "url": item.url,
            "description": item.description or f"AEO optimized entity for {item.name}."
        }
        
        if request.schema_type == "Product":
            schema_block.update({
                "image": f"{item.url.rstrip('/')}/product.jpg",
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "USD",
                    "price": "99.00",
                    "availability": "https://schema.org/InStock"
                }
            })
        elif request.schema_type == "Article":
            schema_block.update({
                "headline": item.name,
                "datePublished": datetime.date.today().isoformat(),
                "author": {
                    "@type": "Person",
                    "name": current_user.name or "Staff Writer"
                }
            })
        elif request.schema_type == "LocalBusiness":
            schema_block.update({
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": f"{100 + idx} Main St",
                    "addressLocality": "Silicon Valley",
                    "addressRegion": "CA",
                    "postalCode": "94025",
                    "addressCountry": "US"
                },
                "telephone": "+1-800-555-0199"
            })
        elif request.schema_type == "Organization":
            schema_block.update({
                "logo": logo_url,
                "sameAs": [
                    f"https://www.facebook.com/{item.name.lower().replace(' ', '')}",
                    f"https://twitter.com/{item.name.lower().replace(' ', '')}"
                ]
            })
            
        generated.append({
            "url": item.url,
            "json_ld": f"""<script type="application/ld+json">
{json.dumps(schema_block, indent=2)}
</script>"""
        })
        
    return BulkSchemaResponse(schemas=generated)
