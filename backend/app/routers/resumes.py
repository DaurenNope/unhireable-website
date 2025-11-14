from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from pydantic import BaseModel
from app.models.user import User, Resume, UserProfile
from app.models.assessment import Assessment, UserSkill
from datetime import datetime
from typing import Dict, Any, Optional, List
from app.services.resume_analyzer import analyze_resume

router = APIRouter()

class ResumeGenerateRequest(BaseModel):
    user_id: str
    assessment_id: Optional[int] = None
    template_name: str = "modern"
    resume_data: Optional[Dict[str, Any]] = None  # Optional: provide resume data directly


class ResumeAnalyzeRequest(BaseModel):
    user_id: str
    resume_data: Optional[Dict[str, Any]] = None
    target_role: Optional[str] = None
    target_keywords: Optional[List[str]] = None

@router.post("/generate")
async def generate_resume(request: ResumeGenerateRequest, db: Session = Depends(get_db)):
    """Generate resume from assessment data"""
    try:
        user_id_int = int(request.user_id)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail=f"Invalid user_id: {request.user_id}")
    
    # Get user
    user = db.query(User).filter(User.id == user_id_int).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get assessment if provided
    assessment = None
    if request.assessment_id:
        assessment = db.query(Assessment).filter(
            Assessment.id == request.assessment_id,
            Assessment.user_id == user_id_int
        ).first()
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Get user profile
    user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id_int).first()
    
    # Get user skills
    user_skills = db.query(UserSkill).filter(UserSkill.user_id == user_id_int).all()
    technical_skills = [s.skill_name for s in user_skills if s.proficiency_level in ["Intermediate", "Advanced", "Expert"]]
    soft_skills = []  # Could be extracted from assessment personality traits if available
    
    # Build resume content from available data
    resume_content = {}
    
    # Personal info
    resume_content["personal_info"] = {
        "name": user.full_name or user.email.split("@")[0],
        "email": user.email,
        "phone": user_profile.phone if user_profile else "",
        "location": user_profile.location if user_profile else "",
        "linkedin": user_profile.linkedin_url if user_profile else "",
        "github": user_profile.github_url if user_profile else "",
        "portfolio": user_profile.portfolio_url if user_profile else "",
    }
    
    # Summary
    if user_profile and user_profile.summary:
        resume_content["summary"] = user_profile.summary
    elif assessment and assessment.career_goals:
        resume_content["summary"] = f"Career-focused professional with experience in {', '.join(technical_skills[:5])}. {assessment.career_goals}"
    else:
        resume_content["summary"] = f"Experienced professional with expertise in {', '.join(technical_skills[:5])}."
    
    # Skills
    resume_content["skills"] = {
        "technical": technical_skills,
        "soft": soft_skills
    }
    
    # Experience
    if user_profile and user_profile.work_experience:
        resume_content["experience"] = user_profile.work_experience
    else:
        resume_content["experience"] = []
    
    # Education
    if user_profile and user_profile.education:
        resume_content["education"] = user_profile.education
    else:
        resume_content["education"] = []
    
    # Projects
    if user_profile and user_profile.projects:
        resume_content["projects"] = user_profile.projects
    else:
        resume_content["projects"] = []
    
    # Certifications
    if user_profile and user_profile.certifications:
        resume_content["certifications"] = user_profile.certifications
    else:
        resume_content["certifications"] = []
    
    # Use provided resume data if available (from frontend builder)
    if request.resume_data:
        resume_content.update(request.resume_data)
    
    # Create or update resume
    existing_resume = db.query(Resume).filter(
        Resume.user_id == user_id_int,
        Resume.template_name == request.template_name,
        Resume.is_active == True
    ).first()
    
    if existing_resume:
        # Update existing resume
        existing_resume.content = resume_content
        existing_resume.assessment_id = request.assessment_id
        existing_resume.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_resume)
        resume = existing_resume
    else:
        # Create new resume
        resume = Resume(
            user_id=user_id_int,
            assessment_id=request.assessment_id,
            template_name=request.template_name,
            content=resume_content,
            is_active=True
        )
        db.add(resume)
        db.commit()
        db.refresh(resume)
    
    return {
        "resume_id": resume.id,
        "template": resume.template_name,
        "download_url": f"/api/resumes/{resume.id}/download",
        "content": resume_content
    }


@router.post("/analyze")
async def analyze_resume_endpoint(request: ResumeAnalyzeRequest, db: Session = Depends(get_db)):
    """Analyze resume content and return ATS readiness insights."""
    try:
        user_id_int = int(request.user_id)
    except (ValueError, TypeError):
        user_id_int = None

    resume_content: Dict[str, Any] = {}
    source = "empty"
    assessment: Optional[Assessment] = None
    user_skills: List[UserSkill] = []

    if request.resume_data:
        resume_content = request.resume_data
        source = "provided"
    elif user_id_int is not None:
        active_resume = (
            db.query(Resume)
            .filter(Resume.user_id == user_id_int)
            .order_by(Resume.updated_at.desc())
            .first()
        )
        if active_resume and active_resume.content:
            resume_content = active_resume.content
            source = "stored"

    target_role = request.target_role
    collected_keywords: List[str] = []
    if request.target_keywords:
        collected_keywords.extend(request.target_keywords)

    if user_id_int is not None:
        assessment = (
            db.query(Assessment)
            .filter(Assessment.user_id == user_id_int)
            .order_by(Assessment.updated_at.desc())
            .first()
        )
        user_skills = db.query(UserSkill).filter(UserSkill.user_id == user_id_int).all()

    if assessment:
        career_interests = assessment.career_interests or {}
        if not target_role:
            interests = career_interests.get("career_interests")
            if isinstance(interests, list) and interests:
                target_role = interests[0]
            elif isinstance(interests, dict) and interests:
                sorted_interests = sorted(
                    interests.items(),
                    key=lambda item: item[1] if isinstance(item[1], (int, float)) else 0,
                    reverse=True,
                )
                if sorted_interests:
                    target_role = sorted_interests[0][0]

        technical_skills = career_interests.get("technical_skills")
        if isinstance(technical_skills, dict):
            collected_keywords.extend(
                [
                    skill
                    for skill, level in technical_skills.items()
                    if level and level != "None"
                ]
            )
        elif isinstance(technical_skills, list):
            collected_keywords.extend(technical_skills)

        personality_profile = career_interests.get("personality_profile") or {}
        work_styles = personality_profile.get("work_style")
        if isinstance(work_styles, list):
            collected_keywords.extend(
                [
                    style.get("preference")
                    for style in work_styles
                    if isinstance(style, dict) and style.get("preference")
                ]
            )

    if user_skills:
        collected_keywords.extend(
            [
                skill.skill_name
                for skill in user_skills
                if skill.skill_name and skill.proficiency_level in {"Intermediate", "Advanced", "Expert"}
            ]
        )

    # Deduplicate keywords while preserving order
    seen = set()
    deduped_keywords: List[str] = []
    for keyword in collected_keywords:
        normalized = keyword.strip()
        if normalized and normalized.lower() not in seen:
            deduped_keywords.append(normalized)
            seen.add(normalized.lower())

    analysis = analyze_resume(
        resume_content or {},
        target_role=target_role,
        target_keywords=deduped_keywords,
    )

    return {
        "source": source,
        "has_resume": bool(resume_content),
        "target_role": analysis.get("target_role"),
        "analysis": analysis,
    }

@router.get("/{resume_id}/download")
async def download_resume(resume_id: int, db: Session = Depends(get_db)):
    """Download resume as PDF/DOCX"""
    from fastapi.responses import Response
    import json
    
    # Get resume
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # For now, return JSON resume data that frontend can use to generate PDF
    # In production, you would use a library like reportlab, weasyprint, or xhtml2pdf
    # to generate actual PDF files
    
    resume_data = {
        "resume_id": resume.id,
        "template": resume.template_name,
        "content": resume.content,
        "created_at": resume.created_at.isoformat() if resume.created_at else None,
        "updated_at": resume.updated_at.isoformat() if resume.updated_at else None
    }
    
    # Return JSON response that frontend can use to generate PDF
    return Response(
        content=json.dumps(resume_data, indent=2),
        media_type="application/json",
        headers={
            "Content-Disposition": f"attachment; filename=resume_{resume_id}.json"
        }
    )

@router.get("/user/{user_id}")
async def get_user_resumes(user_id: str, db: Session = Depends(get_db)):
    """Get all resumes for a user"""
    # Convert string user_id to integer for database
    try:
        user_id_int = int(user_id)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail=f"Invalid user_id: {user_id}")
    
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

@router.get("/{resume_id}/pdf")
async def download_resume_pdf(resume_id: int, db: Session = Depends(get_db)):
    """Download resume as PDF (returns JSON for now - PDF generation can be added later)"""
    from fastapi.responses import Response
    import json
    
    # Get resume
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # TODO: Implement actual PDF generation using reportlab, weasyprint, or xhtml2pdf
    # For now, return JSON that frontend can convert to PDF using jsPDF or similar
    
    resume_data = resume.content or {}
    
    # Generate simple text resume
    personal_info = resume_data.get('personal_info', {})
    name = personal_info.get('name', '')
    email = personal_info.get('email', '')
    phone = personal_info.get('phone', '')
    location = personal_info.get('location', '')
    summary = resume_data.get('summary', '')
    
    # Build experience section
    experience_lines = []
    for exp in resume_data.get('experience', []):
        exp_line = f"{exp.get('title', '')} - {exp.get('company', '')}\n{exp.get('location', '')} | {exp.get('startDate', '')} - {exp.get('endDate', '')}\n{exp.get('description', '')}"
        experience_lines.append(exp_line)
    experience_text = '\n\n'.join(experience_lines)
    
    # Build education section
    education_lines = []
    for edu in resume_data.get('education', []):
        edu_line = f"{edu.get('degree', '')} - {edu.get('school', '')}\n{edu.get('location', '')} | {edu.get('graduationDate', '')}"
        education_lines.append(edu_line)
    education_text = '\n\n'.join(education_lines)
    
    # Build skills section
    technical_skills = ', '.join(resume_data.get('skills', {}).get('technical', []))
    soft_skills = ', '.join(resume_data.get('skills', {}).get('soft', []))
    
    text_resume = f"""{name}
{email} | {phone} | {location}

{summary}

EXPERIENCE
{experience_text}

EDUCATION
{education_text}

SKILLS
Technical: {technical_skills}
Soft Skills: {soft_skills}
    """.strip()
    
    # Return text response (frontend can convert to PDF)
    return Response(
        content=text_resume,
        media_type="text/plain",
        headers={
            "Content-Disposition": f"attachment; filename=resume_{resume_id}.txt"
        }
    )
