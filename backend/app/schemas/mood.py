from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class MoodCreate(BaseModel):
    mood_score: int = Field(..., ge=1, le=10)
    mood_label: str
    note: Optional[str] = None

class MoodResponse(BaseModel):
    id: int
    user_id: int
    mood_score: int
    mood_label: str
    note: Optional[str]
    logged_at: datetime

    class Config:
        from_attributes = True