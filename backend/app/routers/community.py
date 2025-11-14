from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel
from app.core.database import get_db
from app.services.community import AIQAService, CohortService, StudySquadService

router = APIRouter()


# Pydantic models for request/response
class QuestionCreate(BaseModel):
    title: str
    content: str
    category: Optional[str] = None
    tags: Optional[List[str]] = None


class AnswerCreate(BaseModel):
    content: str
    is_ai_generated: bool = False


class CohortCreate(BaseModel):
    name: str
    description: Optional[str] = None
    role_category: Optional[str] = None
    skill_level: Optional[str] = None
    max_members: int = 100
    is_public: bool = True


class CohortPostCreate(BaseModel):
    title: Optional[str] = None
    content: str
    post_type: str = "discussion"


class StudySquadCreate(BaseModel):
    name: str
    description: Optional[str] = None
    learning_path_id: Optional[int] = None
    skill_focus: Optional[str] = None
    max_members: int = 5
    is_public: bool = False
    scheduled_study_time: Optional[str] = None


class StudySessionCreate(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_at: Optional[str] = None
    topic: Optional[str] = None
    resources: Optional[List[str]] = None


# Questions endpoints
@router.post("/questions/{user_id}")
async def ask_question(
    user_id: int,
    question: QuestionCreate,
    db: Session = Depends(get_db)
):
    """Ask a question and get AI answer"""
    try:
        service = AIQAService(db)
        result = service.ask_question(
            user_id=user_id,
            title=question.title,
            content=question.content,
            category=question.category,
            tags=question.tags
        )
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/questions")
async def get_questions(
    user_id: Optional[int] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Get questions with filters"""
    service = AIQAService(db)
    return service.get_questions(user_id=user_id, category=category, status=status, limit=limit, offset=offset)


@router.get("/questions/{question_id}")
async def get_question(
    question_id: int,
    db: Session = Depends(get_db)
):
    """Get a single question with answers"""
    service = AIQAService(db)
    result = service.get_question(question_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.post("/questions/{question_id}/answers/{user_id}")
async def add_answer(
    question_id: int,
    user_id: int,
    answer: AnswerCreate,
    db: Session = Depends(get_db)
):
    """Add an answer to a question"""
    service = AIQAService(db)
    result = service.add_answer(
        question_id=question_id,
        user_id=user_id,
        content=answer.content,
        is_ai_generated=answer.is_ai_generated
    )
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.post("/questions/{question_id}/upvote/{user_id}")
async def upvote_question(
    question_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Upvote a question"""
    service = AIQAService(db)
    result = service.upvote_question(question_id, user_id)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.post("/answers/{answer_id}/upvote/{user_id}")
async def upvote_answer(
    answer_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Upvote an answer"""
    service = AIQAService(db)
    result = service.upvote_answer(answer_id, user_id)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


# Cohorts endpoints
@router.post("/cohorts/{user_id}")
async def create_cohort(
    user_id: int,
    cohort: CohortCreate,
    db: Session = Depends(get_db)
):
    """Create a new cohort"""
    service = CohortService(db)
    result = service.create_cohort(
        user_id=user_id,
        name=cohort.name,
        description=cohort.description,
        role_category=cohort.role_category,
        skill_level=cohort.skill_level,
        max_members=cohort.max_members,
        is_public=cohort.is_public
    )
    return result


@router.get("/cohorts")
async def get_cohorts(
    user_id: Optional[int] = None,
    role_category: Optional[str] = None,
    skill_level: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Get cohorts with filters"""
    service = CohortService(db)
    return service.get_cohorts(
        user_id=user_id,
        role_category=role_category,
        skill_level=skill_level,
        limit=limit,
        offset=offset
    )


@router.get("/cohorts/{cohort_id}")
async def get_cohort(
    cohort_id: int,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get a single cohort with members"""
    service = CohortService(db)
    result = service.get_cohort(cohort_id, user_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.post("/cohorts/{cohort_id}/join/{user_id}")
async def join_cohort(
    cohort_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Join a cohort"""
    service = CohortService(db)
    result = service.join_cohort(cohort_id, user_id)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.post("/cohorts/{cohort_id}/leave/{user_id}")
async def leave_cohort(
    cohort_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Leave a cohort"""
    service = CohortService(db)
    result = service.leave_cohort(cohort_id, user_id)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.post("/cohorts/{cohort_id}/posts/{user_id}")
async def create_post(
    cohort_id: int,
    user_id: int,
    post: CohortPostCreate,
    db: Session = Depends(get_db)
):
    """Create a post in a cohort"""
    service = CohortService(db)
    result = service.create_post(
        cohort_id=cohort_id,
        user_id=user_id,
        content=post.content,
        title=post.title,
        post_type=post.post_type
    )
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.get("/cohorts/{cohort_id}/posts")
async def get_posts(
    cohort_id: int,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Get posts for a cohort"""
    service = CohortService(db)
    return service.get_posts(cohort_id, limit=limit, offset=offset)


# Study squads endpoints
@router.post("/squads/{user_id}")
async def create_squad(
    user_id: int,
    squad: StudySquadCreate,
    db: Session = Depends(get_db)
):
    """Create a new study squad"""
    service = StudySquadService(db)
    result = service.create_squad(
        user_id=user_id,
        name=squad.name,
        description=squad.description,
        learning_path_id=squad.learning_path_id,
        skill_focus=squad.skill_focus,
        max_members=squad.max_members,
        is_public=squad.is_public,
        scheduled_study_time=squad.scheduled_study_time
    )
    return result


@router.get("/squads")
async def get_squads(
    user_id: Optional[int] = None,
    skill_focus: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Get study squads with filters"""
    service = StudySquadService(db)
    return service.get_squads(
        user_id=user_id,
        skill_focus=skill_focus,
        limit=limit,
        offset=offset
    )


@router.get("/squads/{squad_id}")
async def get_squad(
    squad_id: int,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get a single study squad with members"""
    service = StudySquadService(db)
    result = service.get_squad(squad_id, user_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.post("/squads/{squad_id}/join/{user_id}")
async def join_squad(
    squad_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Join a study squad"""
    service = StudySquadService(db)
    result = service.join_squad(squad_id, user_id)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.post("/squads/{squad_id}/leave/{user_id}")
async def leave_squad(
    squad_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Leave a study squad"""
    service = StudySquadService(db)
    result = service.leave_squad(squad_id, user_id)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.post("/squads/{squad_id}/sessions/{user_id}")
async def create_session(
    squad_id: int,
    user_id: int,
    session: StudySessionCreate,
    db: Session = Depends(get_db)
):
    """Create a study session"""
    service = StudySquadService(db)
    
    # Parse scheduled_at if provided
    scheduled_at = None
    if session.scheduled_at:
        try:
            scheduled_at = datetime.fromisoformat(session.scheduled_at.replace('Z', '+00:00'))
        except:
            scheduled_at = None
    
    result = service.create_session(
        squad_id=squad_id,
        user_id=user_id,
        title=session.title,
        description=session.description,
        scheduled_at=scheduled_at,
        topic=session.topic,
        resources=session.resources
    )
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.get("/squads/{squad_id}/sessions")
async def get_sessions(
    squad_id: int,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Get study sessions for a squad"""
    service = StudySquadService(db)
    return service.get_sessions(squad_id, limit=limit, offset=offset)

