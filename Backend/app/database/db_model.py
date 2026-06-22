from sqlalchemy import Column, Integer, String, Float, Text
from app.database.db import Base

class StudentAttempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True)

    student_name = Column(String)
    subject = Column(String)

    question = Column(String)
    response = Column(String)

    effort_score = Column(Float)
    hint_level = Column(String)