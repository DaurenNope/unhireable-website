from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.assessment import Assessment
from app.services.linkedin_enhancer import (
    generate_linkedin_suggestions,
    generate_default_linkedin_suggestions,
)

router = APIRouter()


@router.get("/{user_id}")
async def get_linkedin_enhancements(user_id: str, db: Session = Depends(get_db)):
    """
    Generate LinkedIn profile enhancement suggestions for a user.
    """
    try:
        user_id_int = int(user_id)
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail=f"Invalid user_id: {user_id}")

    assessment = (
        db.query(Assessment)
        .filter(Assessment.user_id == user_id_int)
        .order_by(Assessment.updated_at.desc())
        .first()
    )

    if not assessment:
        # Return default suggestions so the UI still has something to show
        return {
            "has_assessment": False,
            "suggestions": generate_default_linkedin_suggestions(),
        }

    suggestions = generate_linkedin_suggestions(assessment)
    return {
        "has_assessment": True,
        "suggestions": suggestions,
    }

