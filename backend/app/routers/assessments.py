from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.core.database import get_db
from app.services.assessment import AssessmentService
from app.models.assessment import Assessment
from app.services.assessment_intelligence import (
    get_intelligent_followup_question,
    validate_skill_combination,
    analyze_career_trajectory
)
from pydantic import BaseModel

router = APIRouter()

# Pydantic models for request/response
class AssessmentStartRequest(BaseModel):
    user_id: str

class AssessmentAnswerRequest(BaseModel):
    user_id: str
    question_id: str
    answer: Any

class AssessmentCompleteRequest(BaseModel):
    user_id: str
    all_answers: dict

def get_assessment_service(db: Session = Depends(get_db)) -> AssessmentService:
    return AssessmentService(db)

@router.post("/start")
async def start_assessment(
    request: AssessmentStartRequest,
    service: AssessmentService = Depends(get_assessment_service)
):
    """Start a new assessment or resume existing one"""
    return service.start_assessment(request.user_id)

@router.get("/questions")
async def get_assessment_questions(
    service: AssessmentService = Depends(get_assessment_service)
):
    """Get all assessment questions"""
    return {
        "questions": service._get_assessment_questions(),
        "total_questions": len(service._get_assessment_questions())
    }

@router.get("/questions/{question_id}")
async def get_question(
    question_id: str,
    service: AssessmentService = Depends(get_assessment_service)
):
    """Get a specific question by ID"""
    questions = service._get_assessment_questions()
    for i, question in enumerate(questions):
        if question["id"] == question_id:
            return {
                "question": question,
                "question_number": i + 1,
                "total_questions": len(questions)
            }
    
    from fastapi import HTTPException, status
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

@router.post("/answer")
async def save_answer(
    request: AssessmentAnswerRequest,
    service: AssessmentService = Depends(get_assessment_service)
):
    """Save an answer to a specific question"""
    return service.save_answer(request.user_id, request.question_id, request.answer)

@router.post("/complete")
async def complete_assessment(
    request: AssessmentCompleteRequest,
    service: AssessmentService = Depends(get_assessment_service)
):
    """Complete assessment and save all answers"""
    return service.complete_assessment(request.user_id, request.all_answers)

@router.get("/{user_id}")
async def get_assessment(
    user_id: str,
    service: AssessmentService = Depends(get_assessment_service)
):
    """Get assessment status and progress"""
    try:
    return service.get_assessment_status(user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/intelligent-answer")
async def save_intelligent_answer(
    request: AssessmentAnswerRequest,
    service: AssessmentService = Depends(get_assessment_service)
):
    """Save answer and generate intelligent follow-ups"""
    return service.save_intelligent_answer(request.user_id, request.question_id, request.answer)
