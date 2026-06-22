from fastapi import APIRouter
from pydantic import BaseModel

from app.services.groq_client import client

router = APIRouter()


# Initialize chat history with only the system message. Do not access request at import time.
chat_history = [
    {
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
]


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
async def chat(request: ChatRequest):

    # append user message to chat history
    chat_history.append({"role": "user", "content": request.message})

    # create a completion via the client
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=chat_history
    )

    # extract reply content
    reply = response.choices[0].message.content

    # append assistant reply
    chat_history.append({"role": "assistant", "content": reply})

    return {"reply": reply}


@router.post("/new-chat")
async def new_chat():
    global chat_history
    chat_history = [chat_history[0]]
    return {"message": "Chat reset successfully"}