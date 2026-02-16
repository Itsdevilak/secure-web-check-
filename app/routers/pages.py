from fastapi import APIRouter, Request, Form
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@router.get("/test")
async def test_page(request: Request):
    return templates.TemplateResponse("result.html", {"request": request})

@router.get("/learn")
async def learn_page(request: Request):
    return templates.TemplateResponse("learn.html", {"request": request})
