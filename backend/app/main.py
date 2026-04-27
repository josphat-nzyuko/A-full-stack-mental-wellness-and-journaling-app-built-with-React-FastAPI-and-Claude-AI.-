from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api.routes import auth, journal, mood, insights

# Import all models so SQLAlchemy knows about them
from app.models import user, journal as journal_model, mood as mood_model

app = FastAPI(
    title="Mental Wellness API",
    description="Backend for the Mental Wellness and Journaling app",
    version="1.0.0"
)

# Allows the React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Registers all route groups
app.include_router(auth.router)
app.include_router(journal.router)
app.include_router(mood.router)
app.include_router(insights.router)

# Creates all database tables on startup
#Bridge to the database setup, ensuring that the necessary tables are created before handling any requests.
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {"message": "Mental Wellness API is running"}