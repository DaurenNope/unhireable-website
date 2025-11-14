from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os

# Import routers
from app.routers import (
    assessments,
    auth,
    users,
    resumes,
    jobs,
    learning,
    dashboard,
    predictive,
    community as community_router,
    linkedin,
)
from app.core.database import engine, Base
from app.models import user, assessment, job, community  # Import all models to register them

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Seed initial community data
    try:
        from app.core.database import SessionLocal
        from app.services.seed_data import seed_community_data
        db = SessionLocal()
        try:
            result = seed_community_data(db)
            print(f"✅ Seeded community data: {result}")
        except Exception as e:
            print(f"⚠️  Warning: Failed to seed community data: {e}")
        finally:
            db.close()
    except Exception as e:
        print(f"⚠️  Warning: Could not seed community data: {e}")
    
    yield
    # Shutdown

app = FastAPI(
    title="JobEz Assessment Platform API",
    description="API for JobEz career assessment and job matching platform",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
# Get allowed origins from environment variable or use defaults
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001,https://unhireable-website.vercel.app"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(assessments.router, prefix="/api/assessments", tags=["assessments"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(resumes.router, prefix="/api/resumes", tags=["resumes"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(learning.router, prefix="/api/learning", tags=["learning"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(predictive.router, prefix="/api/predictive", tags=["predictive"])
app.include_router(community_router.router, prefix="/api/community", tags=["community"])
app.include_router(linkedin.router, prefix="/api/linkedin", tags=["linkedin"])

@app.get("/")
async def root():
    return {"message": "JobEz Assessment Platform API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
