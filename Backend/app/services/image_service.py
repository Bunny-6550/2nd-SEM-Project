from app.services.groq_client import client
import base64
def extract_question_from_image(image_path):

    with open(image_path, "rb") as img:
        image_b64 = base64.b64encode(
            img.read()
        ).decode("utf-8")

    response = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text":
                        "Extract only the question from this image. Do not solve it."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url":
                            f"data:image/jpeg;base64,{image_b64}"
                        }
                    }
                ]
            }
        ]
    )

    return response.choices[0].message.content