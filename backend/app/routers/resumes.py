from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from pydantic import BaseModel

router = APIRouter()

class ResumeGenerateRequest(BaseModel):
    user_id: str
    assessment_id: int
    template_name: str = "modern"

@router.post("/generate")
async def generate_resume(request: ResumeGenerateRequest, db: Session = Depends(get_db)):
    """Generate resume from assessment data"""
    # TODO: Implement resume generation from assessment
    return {
        "resume_id": 1,
        "template": request.template_name,
        "download_url": "/api/resumes/1/download"
    }

@router.get("/{user_id}")
async def get_user_resumes(user_id: str, db: Session = Depends(get_db)):
    """Get all resumes for a user"""
    # Convert string user_id to integer for database
    try:
        user_id_int = int(user_id)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail=f"Invalid user_id: {user_id}")
    
    from app.models.user import Resume
    resumes = db.query(Resume).filter(Resume.user_id == user_id_int).all()
    return {
        "resumes": [
            {
                "id": resume.id,
                "template_name": resume.template_name,
                "is_active": resume.is_active,
                "created_at": resume.created_at.isoformat() if resume.created_at else None
            }
            for resume in resumes
        ]
    }

@router.get("/{resume_id}/download")
async def download_resume(resume_id: int, db: Session = Depends(get_db)):
    """Download resume as PDF/DOCX"""
    # TODO: Implement resume download
    return {"file_url": f"/downloads/resume_{resume_id}.pdf"}
