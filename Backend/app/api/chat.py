from fastapi import APIRouter
from pydantic import BaseModel

from app.services.groq_client import client

router = APIRouter()


# Initialize chat history with only the system message. Do not access request at import time.
system_message = {
    "role": "system",
    "content": """
You are a Socratic educational AI tutor.
If anything other than education is asked,
politely refuse and redirect the conversation
back to learning.

Your goals:
- Encourage deep thinking
- Avoid direct answers initially
- Improve conceptual understanding
- Guide students step-by-step

Rules:
1. Do NOT immediately provide final answers.
2. Ask reflective questions.
3. Give adaptive hints.
4. Encourage reasoning.
5. Be educational and supportive.

If the student's latest message already contains a correct final answer,
do NOT continue tutoring.

Instead:

1. Confirm the answer.
2. Give a one-sentence explanation.
3. Ask:

"Is there anything else you'd like help with?"

Then stop.
"""
}

# store histories per student name
chat_histories: dict[str, list] = {}


class ChatRequest(BaseModel):
    message: str
    student_name: str | None = None


@router.post("/chat")
async def chat(request: ChatRequest):

    name = (request.student_name or "default").strip() or "default"

    # ensure history for this user
    if name not in chat_histories:
        chat_histories[name] = [system_message.copy()]

    history = chat_histories[name]

    # append user message
    history.append({"role": "user", "content": request.message})

    # detect repeated user attempts
    consecutive_user = 0
    for msg in reversed(history):
        if msg.get('role') == 'user':
            consecutive_user += 1
        elif msg.get('role') == 'assistant':
            break

    messages_for_model = list(history)
    if consecutive_user >= 3:
        messages_for_model.append({
            "role": "system",
            "content": (
                "The user has asked multiple times. Now provide a concise, clear final answer up front, "
                "followed by a one-sentence explanation (if needed). Keep the response short and easily understandable. "
                "Then ask if they want further details. Do not continue the normal Socratic avoidance of direct answers."
            )
        })

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages_for_model
    )

    reply = response.choices[0].message.content

    # append assistant reply to the user's history
    history.append({"role": "assistant", "content": reply})

    return {"reply": reply}


@router.post("/new-chat")
async def new_chat(payload: dict | None = None):
    # payload may include {'student_name': 'Alice'} to reset only that user's chat
    name = None
    if payload and isinstance(payload, dict):
        name = (payload.get('student_name') or '').strip() or None

    if name:
        chat_histories[name] = [system_message.copy()]
    else:
        # reset all
        chat_histories.clear()

    return {"message": "Chat reset successfully"}


@router.get('/history')
async def get_history(student_name: str | None = None):
    name = (student_name or 'default').strip() or 'default'
    if name not in chat_histories:
        chat_histories[name] = [system_message.copy()]
    # return history without system messages (don't expose the system prompt to the UI)
    history = chat_histories[name]
    visible = [m for m in history if m.get('role') != 'system']
    # if no visible messages, return a friendly assistant greeting instead
    if not visible:
        visible = [{"role": "assistant", "content": "Hello! I'm your AI Cognitive Tutor."}]
    return {"history": visible}