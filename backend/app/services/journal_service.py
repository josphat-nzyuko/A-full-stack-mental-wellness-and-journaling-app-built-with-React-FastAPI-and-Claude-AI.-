from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.journal import JournalEntry
from app.schemas.journal import JournalCreate, JournalUpdate
from app.services.ai_service import generate_insight
from fastapi import HTTPException, status

async def create_entry(db: AsyncSession, user_id: int, data: JournalCreate):
    insight = await generate_insight(data.content)

    entry = JournalEntry(
        user_id=user_id,
        title=data.title,
        content=data.content,
        mood_score=data.mood_score,
        ai_insight=insight
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry

async def get_all_entries(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(JournalEntry)
        .where(JournalEntry.user_id == user_id)
        .order_by(JournalEntry.created_at.desc())
    )
    return result.scalars().all()

async def get_entry_by_id(db: AsyncSession, user_id: int, entry_id: int):
    result = await db.execute(
        select(JournalEntry)
        .where(JournalEntry.id == entry_id, JournalEntry.user_id == user_id)
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    return entry

async def update_entry(db: AsyncSession, user_id: int, entry_id: int, data: JournalUpdate):
    entry = await get_entry_by_id(db, user_id, entry_id)

    if data.title is not None:
        entry.title = data.title
    if data.content is not None:
        entry.content = data.content
        entry.ai_insight = await generate_insight(data.content)
    if data.mood_score is not None:
        entry.mood_score = data.mood_score

    await db.commit()
    await db.refresh(entry)
    return entry

async def delete_entry(db: AsyncSession, user_id: int, entry_id: int):
    entry = await get_entry_by_id(db, user_id, entry_id)
    await db.delete(entry)
    await db.commit()
    return {"message": "Entry deleted successfully"}