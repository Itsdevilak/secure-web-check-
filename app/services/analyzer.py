import requests
from bs4 import BeautifulSoup
import time
from urllib.parse import urlparse

def analyze_website(url: str):
    if not url.startswith("http"):
        url = "https://" + url

    start_time = time.time()
    result = {
        "url": url,
        "https": False,
        "status_code": None,
        "response_time": 0,
        "headers": {},
        "seo": {"title": None, "description": None},
        "score": 0,
        "error": None
    }

    try:
        if url.startswith("https"):
             result["https"] = True
             
        response = requests.get(url, timeout=5)
        result["status_code"] = response.status_code
        result["response_time"] = round((time.time() - start_time) * 1000, 2)
        
        # Security Headers
        security_headers = [
            "Content-Security-Policy",
            "X-Frame-Options",
            "Strict-Transport-Security",
            "X-XSS-Protection",
            "X-Content-Type-Options"
        ]
        
        present_headers = 0
        for header in security_headers:
            val = response.headers.get(header)
            result["headers"][header] = val if val else "Missing"
            if val:
                present_headers += 1

        # SEO
        soup = BeautifulSoup(response.content, "html.parser")
        result["seo"]["title"] = soup.title.string.strip() if soup.title else "No Title"
        meta_desc = soup.find("meta", attrs={"name": "description"})
        result["seo"]["description"] = meta_desc["content"].strip() if meta_desc else "No Description"

        # Simple scoring logic
        score = 50 # Base score
        if result["https"]: score += 10
        if result["status_code"] == 200: score += 10
        
        # Add points for headers
        score += (present_headers * 6) # Max 30 points

        result["score"] = min(100, max(0, score))

    except requests.exceptions.RequestException as e:
        result["error"] = str(e)
        result["score"] = 0

    return result
