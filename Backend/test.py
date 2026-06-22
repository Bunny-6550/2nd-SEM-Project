from app.services.groq_client import ask_groq

print(
    ask_groq(
        "Say hello in one sentence."
    )
)