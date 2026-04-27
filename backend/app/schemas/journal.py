from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class JournalCreate(BaseModel):
    title: str
    content: str
    mood_score: Optional[int] = None

class JournalUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    mood_score: Optional[int] = None

class JournalResponse(BaseModel):
    id: int
    user_id: int
    title: str
    content: str
    mood_score: Optional[int]
    ai_insight: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True