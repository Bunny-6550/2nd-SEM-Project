from fastapi import APIRouter
from sqlalchemy import func

from app.database.db import SessionLocal
from app.database.db_model import StudentAttempt

router = APIRouter()

@router.get("/analytics")
async def analytics():

    db = SessionLocal()

    total_attempts = db.query(StudentAttempt).count()

    avg_effort = (
        db.query(func.avg(StudentAttempt.effort_score))
        .scalar()
    )

    high = (
        db.query(StudentAttempt)
        .filter(StudentAttempt.hint_level == "HIGH")
        .count()
    )

    medium = (
        db.query(StudentAttempt)
        .filter(StudentAttempt.hint_level == "MEDIUM")
        .count()
    )

    low = (
        db.query(StudentAttempt)
        .filter(StudentAttempt.hint_level == "LOW")
        .count()
    )

    db.close()

    return {
        "total_attempts": total_attempts,
        "average_effort": round(avg_effort or 0, 2),
        "high_effort": high,
        "medium_effort": medium,
        "low_effort": low
    }