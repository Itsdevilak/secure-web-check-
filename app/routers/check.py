from fastapi import APIRouter, Form
from app.services.analyzer import analyze_website

router = APIRouter()

@router.post("/analyze")
async def analyze_url(url: str = Form(...)): # Use Form mostly because HTML forms send data this way
    return analyze_website(url)
