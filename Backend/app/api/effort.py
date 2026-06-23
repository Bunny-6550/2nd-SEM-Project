from fastapi import APIRouter, Request
from app.services.effort_service import evaluate_effort
from app.database.db import SessionLocal
from app.database.db_model import StudentAttempt
from app.services.guidance_service import generate_guidance

router = APIRouter()


@router.post("/effort")
async def analyze_effort(request: Request):
    data = await request.json()
    question = data.get("question", "")
    answer = data.get("answer", "")

    score, level = evaluate_effort(question, answer)

    # generate tailored guidance text
    try:
        guidance = generate_guidance(question, answer, level)
    except Exception:
        guidance = None

    # persist
    db = SessionLocal()
    try:
        attempt = StudentAttempt(
            student_name=data.get("student_name", "Student"),
            subject=data.get("subject", "General"),
            question=question,
            response=answer,
            effort_score=score,
            hint_level=level,
        )
        db.add(attempt)
        db.commit()
    finally:
        db.close()

    return {"score": score, "level": level, "guidance": guidance}