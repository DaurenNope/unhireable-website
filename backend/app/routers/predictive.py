from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
from app.core.database import get_db
from app.services.career_intelligence import CareerIntelligenceService

router = APIRouter()

def get_career_intelligence_service(db: Session = Depends(get_db)) -> CareerIntelligenceService:
    """Dependency to get career intelligence service"""
    return CareerIntelligenceService(db)


@router.get("/promotion/{user_id}")
async def get_promotion_probability(
    user_id: str,
    target_role: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get promotion probability for a user"""
    try:
        user_id_int = int(user_id)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail=f"Invalid user_id: {user_id}")
    
    intelligence_service = CareerIntelligenceService(db)
    result = intelligence_service.calculate_promotion_probability(user_id_int, target_role)
    
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    
    return result


@router.get("/security/{user_id}")
async def get_job_security_signals(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Get job security signals for a user"""
    try:
        user_id_int = int(user_id)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail=f"Invalid user_id: {user_id}")
    
    intelligence_service = CareerIntelligenceService(db)
    result = intelligence_service.calculate_job_security_signals(user_id_int)
    
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    
    return result


@router.get("/pivot/{user_id}")
async def get_pivot_readiness(
    user_id: str,
    target_roles: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get pivot readiness for a user"""
    try:
        user_id_int = int(user_id)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail=f"Invalid user_id: {user_id}")
    
    # Parse target_roles if provided (comma-separated)
    target_roles_list = None
    if target_roles:
        target_roles_list = [role.strip() for role in target_roles.split(",")]
    
    intelligence_service = CareerIntelligenceService(db)
    result = intelligence_service.calculate_pivot_readiness(user_id_int, target_roles_list)
    
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    
    return result


@router.get("/analytics/{user_id}")
async def get_all_predictive_analytics(
    user_id: str,
    target_role: Optional[str] = None,
    target_roles: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all predictive analytics for a user"""
    try:
        user_id_int = int(user_id)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail=f"Invalid user_id: {user_id}")
    
    intelligence_service = CareerIntelligenceService(db)
    
    # Parse target_roles if provided
    target_roles_list = None
    if target_roles:
        target_roles_list = [role.strip() for role in target_roles.split(",")]
    
    # Get all analytics
    promotion = intelligence_service.calculate_promotion_probability(user_id_int, target_role)
    security = intelligence_service.calculate_job_security_signals(user_id_int)
    pivot = intelligence_service.calculate_pivot_readiness(user_id_int, target_roles_list)
    
    # Check for errors - if assessment not found, return empty data instead of error
    has_assessment = "error" not in promotion and "error" not in security and "error" not in pivot
    
    if not has_assessment:
        # Return empty analytics data if no assessment exists
        return {
            "user_id": user_id_int,
            "has_assessment": False,
            "promotion": {
                "promotion_probability": 0,
                "base_probability": 0,
                "role_adjustment": 0,
                "time_to_promotion": "N/A",
                "key_factors": [],
                "blockers": ["Complete an assessment to see promotion probability"],
                "recommendations": ["Take the free assessment to get started"],
                "score_breakdown": {
                    "skill_score": 0,
                    "experience_score": 0,
                    "learning_score": 0,
                    "market_alignment": 0,
                    "performance_score": 0
                },
                "target_role": target_role,
                "confidence_level": "low"
            },
            "security": {
                "security_score": 0,
                "automation_risk": 0,
                "market_demand_score": 0,
                "obsolescence_risk": 0,
                "industry_stability": 0,
                "risk_factors": ["Complete an assessment to see job security signals"],
                "security_strengths": [],
                "recommendations": ["Take the free assessment to get started"],
                "risk_timeline": {
                    "short_term": "N/A",
                    "medium_term": "N/A",
                    "long_term": "N/A"
                },
                "security_level": "low"
            },
            "pivot": {
                "overall_readiness": 0,
                "current_category": "General",
                "target_roles": [],
                "pivot_analyses": [],
                "transferable_skills": [],
                "skill_gaps": [],
                "time_to_pivot": "N/A",
                "pivot_strategy": {
                    "leverage_transferable_skills": [],
                    "focus_areas": [],
                    "learning_path": "Complete an assessment to see pivot strategy",
                    "networking": "Complete an assessment to see networking recommendations",
                    "timeline": "Complete an assessment to see timeline",
                    "approach": "Complete an assessment to see approach"
                },
                "readiness_level": "low"
            }
        }
    
    return {
        "user_id": user_id_int,
        "has_assessment": True,
        "promotion": promotion,
        "security": security,
        "pivot": pivot
    }

