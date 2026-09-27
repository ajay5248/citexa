"""Rule-based AI-readiness checks for a public website's homepage.

Everything here is deterministic: the same page gives the same score. It measures whether a site
is *technically ready* for AI search engines; it does not measure whether they recommend it.
"""
import ipaddress
import json
import socket
from dataclasses import dataclass, asdict
from typing import List, Optional
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser

import httpx
from bs4 import BeautifulSoup

USER_AGENT = "Citexa-AI-Checker/1.0 (+https://www.citexa.online)"
MAX_BYTES = 2_000_000
MAX_REDIRECTS = 5
TIMEOUT = 10.0

# Crawlers used by the main AI assistants and AI search features
AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Google-Extended", "Bingbot"]


class CheckError(Exception):
    """A problem with the URL or the site that we can explain to the visitor."""


def _assert_public_host(hostname: str) -> None:
    # Block requests to internal networks (SSRF), e.g. localhost, 10.x, 169.254.169.254
    try:
        infos = socket.getaddrinfo(hostname, None)
    except socket.gaierror:
        raise CheckError("We couldn't find that website. Please check the address.")
    for info in infos:
        ip = ipaddress.ip_address(info[4][0])
        if not ip.is_global:
            raise CheckError("That address isn't a public website.")


def normalize_url(raw: str) -> str:
    url = raw.strip()
    if not url.lower().startswith(("http://", "https://")):
        url = "https://" + url
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https") or not parsed.hostname or "." not in parsed.hostname:
        raise CheckError("Please enter a valid website address, like example.com.")
    if parsed.port not in (None, 80, 443):
        raise CheckError("Please enter a standard website address.")
    return f"{parsed.scheme}://{parsed.hostname}{parsed.path or '/'}"


def safe_get(client: httpx.Client, url: str) -> httpx.Response:
    """GET that follows redirects manually, re-checking every hop is a public host, with a size cap."""
    for _ in range(MAX_REDIRECTS + 1):
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https") or not parsed.hostname:
            raise CheckError("The website redirected to an unsupported address.")
        _assert_public_host(parsed.hostname)
        with client.stream("GET", url) as response:
            if response.is_redirect:
                url = urljoin(url, response.headers.get("location", ""))
                continue
            body = b""
            for chunk in response.iter_bytes():
                body += chunk
                if len(body) > MAX_BYTES:
                    break
            # The body is already decompressed, so drop encoding headers before rebuilding the response
            headers = {k: v for k, v in response.headers.items() if k.lower() not in ("content-encoding", "content-length", "transfer-encoding")}
            return httpx.Response(response.status_code, headers=headers, content=body, request=httpx.Request("GET", url))
    raise CheckError("The website redirected too many times.")


@dataclass
class Check:
    id: str
    title: str
    passed: bool
    weight: int
    detail: str
    fix: str


def _schema_types(soup: BeautifulSoup) -> List[str]:
    types: List[str] = []

    def collect(node):
        if isinstance(node, dict):
            t = node.get("@type")
            if isinstance(t, str):
                types.append(t)
            elif isinstance(t, list):
                types.extend(x for x in t if isinstance(x, str))
            for value in node.values():
                collect(value)
        elif isinstance(node, list):
            for item in node:
                collect(item)

    for tag in soup.find_all("script", type="application/ld+json"):
        try:
            collect(json.loads(tag.string or ""))
        except (ValueError, TypeError):
            continue
    return types


def run_checks(raw_url: str) -> dict:
    url = normalize_url(raw_url)
    headers = {"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml"}
    with httpx.Client(timeout=TIMEOUT, headers=headers, follow_redirects=False) as client:
        try:
            page = safe_get(client, url)
        except httpx.HTTPError:
            raise CheckError("We couldn't load that website. It may be down or blocking automated visits.")
        if page.status_code >= 400:
            raise CheckError(f"The website returned an error (HTTP {page.status_code}).")
        if "html" not in page.headers.get("content-type", "html"):
            raise CheckError("That address doesn't point to a web page.")

        final_url = str(page.request.url)
        origin = f"{urlparse(final_url).scheme}://{urlparse(final_url).hostname}"

        def fetch_text(path: str) -> Optional[str]:
            try:
                response = safe_get(client, origin + path)
            except (httpx.HTTPError, CheckError):
                return None
            return response.text if response.status_code == 200 else None

        robots_txt = fetch_text("/robots.txt")
        llms_txt = fetch_text("/llms.txt")
        sitemap_xml = None
        if not (robots_txt and "sitemap:" in robots_txt.lower()):
            sitemap_xml = fetch_text("/sitemap.xml")

    soup = BeautifulSoup(page.text, "html.parser")
    title = (soup.title.string or "").strip() if soup.title else ""
    description_tag = soup.find("meta", attrs={"name": "description"})
    description = (description_tag.get("content") or "").strip() if description_tag else ""
    h1s = soup.find_all("h1")
    types = _schema_types(soup)
    lower_types = [t.lower() for t in types]
    business_types = {"organization", "localbusiness", "corporation", "professionalservice", "store", "restaurant",
                      "medicalbusiness", "dentist", "physician", "legalservice", "realestateagent", "educationalorganization"}
    has_business_schema = any(t in business_types or t.endswith("business") for t in lower_types)
    question_headings = [h for h in soup.find_all(["h2", "h3", "h4", "summary", "button", "dt"]) if h.get_text(strip=True).endswith("?")]
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    word_count = len(soup.get_text(" ", strip=True).split())

    blocked = []
    if robots_txt:
        parser = RobotFileParser()
        parser.parse(robots_txt.splitlines())
        blocked = [bot for bot in AI_CRAWLERS if not parser.can_fetch(bot, final_url)]

    checks = [
        Check("ai_crawlers", "AI crawlers are allowed", not blocked, 15,
              f"robots.txt blocks: {', '.join(blocked)}." if blocked else "robots.txt doesn't block the main AI crawlers.",
              "Remove Disallow rules for GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot and Google-Extended in robots.txt, unless you deliberately want to be excluded."),
        Check("business_schema", "Business schema markup", has_business_schema, 15,
              "Found Organization or LocalBusiness schema." if has_business_schema else "No Organization or LocalBusiness schema found.",
              "Add Organization or LocalBusiness JSON-LD with your name, address, phone, opening hours and social profiles."),
        Check("structured_data", "Structured data (JSON-LD)", bool(types), 10,
              f"Found {len(types)} schema types: {', '.join(sorted(set(types))[:6])}." if types else "No JSON-LD structured data found.",
              "Add JSON-LD structured data to the page <head> so AI engines can read facts about your business."),
        Check("faq_schema", "FAQ schema", "faqpage" in lower_types, 10,
              "Found FAQPage schema." if "faqpage" in lower_types else "No FAQPage schema found.",
              "Add a FAQ section answering the questions customers ask, with matching FAQPage JSON-LD."),
        Check("question_content", "Answers real questions", len(question_headings) >= 2, 5,
              f"Found {len(question_headings)} question-style headings." if question_headings else "No question-style headings found.",
              "Add headings phrased as customer questions (for example 'How much does a root canal cost in Noida?') with direct answers."),
        Check("https", "Secure connection (HTTPS)", final_url.startswith("https://"), 5,
              "The site loads over HTTPS." if final_url.startswith("https://") else "The site doesn't use HTTPS.",
              "Install an SSL certificate and redirect all traffic to HTTPS."),
        Check("title", "Page title", 10 <= len(title) <= 70, 5,
              f"Title: \"{title[:80]}\" ({len(title)} characters)." if title else "No page title found.",
              "Write a 10-70 character title that says what you do and where, e.g. 'Dental Clinic in Sector 62, Noida | Brand'."),
        Check("meta_description", "Meta description", 50 <= len(description) <= 170, 5,
              f"Description is {len(description)} characters." if description else "No meta description found.",
              "Add a 50-160 character description summarising what you offer and who it's for."),
        Check("h1", "One clear main heading", len(h1s) == 1, 5,
              f"Found {len(h1s)} H1 headings.",
              "Use exactly one H1 heading that states what your business does."),
        Check("canonical", "Canonical URL", soup.find("link", rel="canonical") is not None, 5,
              "Canonical tag found." if soup.find("link", rel="canonical") else "No canonical tag found.",
              "Add <link rel=\"canonical\"> pointing to the preferred address of each page."),
        Check("open_graph", "Social sharing tags", soup.find("meta", property="og:title") is not None, 5,
              "Open Graph tags found." if soup.find("meta", property="og:title") else "No Open Graph tags found.",
              "Add og:title, og:description and og:image tags so links show a proper preview."),
        Check("content_depth", "Enough readable content", word_count >= 300, 5,
              f"About {word_count} words of text on the page.",
              "Add more plain-text content describing your services, location, prices and FAQs. Text inside images can't be read."),
        Check("sitemap", "Sitemap", bool(sitemap_xml) or bool(robots_txt and "sitemap:" in robots_txt.lower()), 5,
              "Sitemap found." if (sitemap_xml or (robots_txt and "sitemap:" in robots_txt.lower())) else "No sitemap found.",
              "Publish /sitemap.xml and reference it in robots.txt."),
        Check("llms_txt", "llms.txt file", bool(llms_txt), 5,
              "llms.txt found." if llms_txt else "No /llms.txt file found.",
              "Add a /llms.txt file summarising your business and key pages for AI tools. It's a new, optional convention."),
    ]

    total = sum(c.weight for c in checks)
    score = round(100 * sum(c.weight for c in checks if c.passed) / total)
    failed = sorted((c for c in checks if not c.passed), key=lambda c: -c.weight)
    return {
        "url": final_url,
        "score": score,
        "grade": "Good" if score >= 80 else "Needs work" if score >= 50 else "Poor",
        "passed_count": sum(c.passed for c in checks),
        "total_count": len(checks),
        "top_issues": [c.title for c in failed[:3]],
        "checks": [asdict(c) for c in checks],
    }


# Groups of checks used for the dashboard's sub-scores
CATEGORIES = {
    "schema": ["business_schema", "structured_data", "faq_schema"],
    "content": ["question_content", "title", "meta_description", "h1", "content_depth"],
    "access": ["ai_crawlers", "https", "canonical", "open_graph", "sitemap", "llms_txt"],
}


def category_score(result: dict, category: str) -> float:
    checks = [c for c in result["checks"] if c["id"] in CATEGORIES[category]]
    total = sum(c["weight"] for c in checks)
    return round(100 * sum(c["weight"] for c in checks if c["passed"]) / total, 1)


def failed_checks(result: dict) -> list:
    return sorted((c for c in result["checks"] if not c["passed"]), key=lambda c: -c["weight"])
