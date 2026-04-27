from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.journal_service import get_all_entries
from app.services.mood_service import get_mood_history
from app.services.ai_service import generate_insight

router = APIRouter(prefix="/insights", tags=["Insights"])

@router.get("/summary")
async def get_insights_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entries = await get_all_entries(db, current_user.id)
    mood_logs = await get_mood_history(db, current_user.id, days=30)

    if not entries and not mood_logs:
        return {"summary": "Start writing journal entries and logging your mood to get personalised insights."}

    recent_entries = entries[:5]
    combined_text = "\n\n".join([
        f"Entry: {e.title}\n{e.content}" for e in recent_entries
    ])

    avg_mood = None
    if mood_logs:
        avg_mood = round(sum(m.mood_score for m in mood_logs) / len(mood_logs), 1)

    prompt = f"""Based on these recent journal entries and an average mood score 
    of {avg_mood}/10 over the last 30 days, provide a warm and encouraging 
    wellness summary in 4 to 5 sentences. Highlight emotional patterns, 
    progress, and one actionable tip.

    Recent entries:
    {combined_text}"""

    summary = await generate_insight(prompt)
    return {
        "summary": summary,
        "average_mood": avg_mood,
        "total_entries": len(entries),
        "total_mood_logs": len(mood_logs)
    }