from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.mood import MoodCreate, MoodResponse
from app.services.mood_service import log_mood, get_mood_history

router = APIRouter(prefix="/mood", tags=["Mood"])

@router.post("/", response_model=MoodResponse)
async def create_mood_log(
    data: MoodCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await log_mood(db, current_user.id, data)

@router.get("/history", response_model=List[MoodResponse])
async def get_mood_logs(
    days: int = Query(default=30, ge=1, le=90),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await get_mood_history(db, current_user.id, days)