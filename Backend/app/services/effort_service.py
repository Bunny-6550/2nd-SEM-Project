from fastapi import APIRouter
from app.services.groq_client import ask_groq
import re
from app.database.db import SessionLocal
from app.database.db_model import StudentAttempt

router = APIRouter()

@router.post("/effort")
async def evaluate_effort(data: dict):

    question = data.get("question", "")
    answer = data.get("answer", "")

    prompt = f"""
Question: {question}
Answer: {answer}

Evaluate the student's effort.

Consider:
- Relevance to the question
- Whether they attempted solving
- Logical reasoning
- Use of formulas
- Explanation quality

Grade ONLY the effort shown.

Return EXACTLY in this format:

Score: 85
Level: HIGH

Do not explain.
Do not ask questions.
Do not give hints.
Do not solve the problem.
Only output Score and Level.
"""

    result = ask_groq(prompt)

    score = int(score.group(1)) if score else 50
    level = level.group(1) if level else "MEDIUM"

    score_value = int(score.group(1)) if score else 50
    level_value = level.group(1) if level else "MEDIUM"
    db = SessionLocal()

    attempt = StudentAttempt(
    student_name=data.get("student_name", "Student"),
    subject=data.get("subject", "General"),
    question=question,
    response=answer,
    effort_score=score_value,
    hint_level=level_value
)

    db.add(attempt)
    db.commit()
    db.close()

    return {
    "score": score_value,
    "level": level_value
}