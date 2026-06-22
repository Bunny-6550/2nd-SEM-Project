from fastapi import APIRouter, UploadFile, File
import shutil
import os
import time

from app.services.groq_client import extract_from_image

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):

    file_path = f"{UPLOAD_DIR}/{time.time()}_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = extract_from_image(
    file_path,
    """
    Extract the question, topic, or text from this image.
    Do not explain it.
    Return only the extracted text.
    """
)

    return {
        "filename": file.filename,
        "question": extracted_text
    }