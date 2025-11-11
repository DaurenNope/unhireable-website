from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter()

@router.get("/profile/{user_id}")
async def get_user_profile(user_id: str, db: Session = Depends(get_db)):
    """Get user profile"""
    # Convert string user_id to integer for database
    try:
        user_id_int = int(user_id)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail=f"Invalid user_id: {user_id}")
    
    from app.models.user import UserProfile
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id_int).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return {
        "user_id": user_id_int,
        "first_name": profile.first_name,
        "last_name": profile.last_name,
        "email": profile.email,
        "phone": profile.phone,
        "location": profile.location,
        "linkedin_url": profile.linkedin_url,
        "github_url": profile.github_url,
        "portfolio_url": profile.portfolio_url,
        "summary": profile.summary,
        "experience_years": profile.experience_years
    }

@router.put("/profile/{user_id}")
async def update_user_profile(user_id: str, profile_data: dict, db: Session = Depends(get_db)):
    """Update user profile"""
    # Convert string user_id to integer for database
    try:
        user_id_int = int(user_id)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail=f"Invalid user_id: {user_id}")
    
    from app.models.user import UserProfile
    from fastapi import HTTPException
    
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id_int).first()
    if not profile:
        # Create new profile if it doesn't exist
        profile = UserProfile(user_id=user_id_int)
        db.add(profile)
    
    # Update profile fields
    for key, value in profile_data.items():
        if hasattr(profile, key):
            setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    
    return {"message": "Profile updated successfully", "profile_id": profile.id}
