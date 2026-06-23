import re
import os
from app.services.groq_client import ask_groq


def _parse_groq_response(text: str):
    # Expect lines like: Score: 85  Level: HIGH
    score_match = re.search(r"Score:\s*(\d{1,3})", text)
    level_match = re.search(r"Level:\s*([A-Za-z]+)", text)
    score = int(score_match.group(1)) if score_match else None
    level = level_match.group(1).upper() if level_match else None
    return score, level


def evaluate_effort(question: str, answer: str):
    """Evaluate effort using Groq if available, otherwise a local heuristic.

    Returns: (score:int, level:str)
    """

    # Try remote model if API key present
    if os.getenv("GROQ_API_KEY"):
        try:
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

Score: <integer 0-100>
Level: LOW|MEDIUM|HIGH

Do not explain. Do not ask questions. Only output Score and Level.
"""

            resp = ask_groq(prompt)
            score, level = _parse_groq_response(resp)
            if score is not None and level is not None:
                return max(0, min(100, score)), level
        except Exception:
            # fallthrough to heuristic
            pass

    # Heuristic fallback
    text = (answer or "").strip()
    length = len(text)
    score = min(100, int(length * 1.5))

    if re.search(r"\d", text):
        score += 10
    if re.search(r"=|\+|\-|\/|\\\*|integral|derivative|solve|step|calculate", text, re.I):
        score += 15
    if re.search(r"because|therefore|thus|hence|so that", text, re.I):
        score += 10

    score = max(0, min(100, score))

    if score < 35:
        level = "LOW"
    elif score < 70:
        level = "MEDIUM"
    else:
        level = "HIGH"

    return score, level
