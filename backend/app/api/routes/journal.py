from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.journal import JournalCreate, JournalUpdate, JournalResponse
from app.services.journal_service import (
    create_entry,
    get_all_entries,
    get_entry_by_id,
    update_entry,
    delete_entry
)

router = APIRouter(prefix="/journal", tags=["Journal"])

@router.post("/", response_model=JournalResponse)
async def create_journal_entry(
    data: JournalCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await create_entry(db, current_user.id, data)

@router.get("/", response_model=List[JournalResponse])
async def get_journal_entries(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await get_all_entries(db, current_user.id)

@router.get("/{entry_id}", response_model=JournalResponse)
async def get_journal_entry(
    entry_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await get_entry_by_id(db, current_user.id, entry_id)

@router.put("/{entry_id}", response_model=JournalResponse)
async def update_journal_entry(
    entry_id: int,
    data: JournalUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await update_entry(db, current_user.id, entry_id, data)

@router.delete("/{entry_id}")
async def delete_journal_entry(
    entry_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await delete_entry(db, current_user.id, entry_id)