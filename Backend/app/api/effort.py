from fastapi import APIRouter

router = APIRouter()

@router.post("/effort")
async def analyze_effort():
    return {
        "score": 75,
        "level": "MEDIUM"
    }