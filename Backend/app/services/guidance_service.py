from app.services.prompt_builder import build_guidance_prompt
from app.services.groq_client import ask_groq
import os


def generate_guidance(question: str, student_response: str, effort_level: str):
    """Generate tailored guidance using Groq if available; otherwise fallback to a heuristic."""

    prompt = build_guidance_prompt(question, student_response, effort_level)

    # Try remote model if key present
    if os.getenv('GROQ_API_KEY'):
        try:
            resp = ask_groq(prompt)
            # ask_groq returns string
            return resp
        except Exception:
            pass

    # Fallback heuristics
    lvl = (effort_level or 'MEDIUM').upper()
    if lvl == 'LOW':
        return "Concept reminder: Review the core definitions and formulas related to this problem. Try breaking the problem into smaller parts and identify what is being asked. Ask yourself: what information is given and what is unknown?"
    if lvl == 'MEDIUM':
        return "Hint 1: Identify the target (what to find).\nHint 2: Write down known formulas or relationships.\nHint 3: Try one small algebraic step and check if it simplifies the problem."
    return "Detailed explanation: Your approach is on the right track. Show intermediate steps systematically, annotate why each step follows, and compare results at the end. Consider a related example: change one parameter and see how the solution adapts."
