from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.mood import MoodLog
from app.schemas.mood import MoodCreate
from datetime import datetime, timedelta

async def log_mood(db: AsyncSession, user_id: int, data: MoodCreate):
    mood = MoodLog(
        user_id=user_id,
        mood_score=data.mood_score,
        mood_label=data.mood_label,
        note=data.note
    )
    db.add(mood)
    await db.commit()
    await db.refresh(mood)
    return mood

async def get_mood_history(db: AsyncSession, user_id: int, days: int = 30):
    since = datetime.utcnow() - timedelta(days=days)
    result = await db.execute(
        select(MoodLog)
        .where(MoodLog.user_id == user_id, MoodLog.logged_at >= since)
        .order_by(MoodLog.logged_at.asc())
    )
    return result.scalars().all()