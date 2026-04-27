from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class MoodLog(Base):
    __tablename__ = "mood_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mood_score = Column(Integer, nullable=False)
    mood_label = Column(String(50), nullable=False)
    note = Column(String(500), nullable=True)
    logged_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="mood_logs")