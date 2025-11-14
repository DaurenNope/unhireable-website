"""Seed data service for populating initial community data"""

from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.community import (
    Question, Answer, QuestionUpvote, AnswerUpvote,
    Cohort, CohortMembership, CohortPost, CohortPostComment,
    StudySquad, SquadMembership, StudySession,
    QuestionStatus, CohortRole, SquadRole
)
from app.models.user import User


def seed_community_data(db: Session):
    """Seed initial community data"""
    
    # Get or create a demo user for seed data
    demo_user = db.query(User).filter(User.email == "demo@unhireable.com").first()
    if not demo_user:
        # Create demo user if doesn't exist
        demo_user = User(
            email="demo@unhireable.com",
            full_name="Demo User",
            is_active=True
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
    
    # Seed sample questions
    existing_questions = db.query(Question).count()
    if existing_questions == 0:
        sample_questions = [
            {
                "title": "How do I transition from frontend to full-stack?",
                "content": "I've been working as a frontend developer for 2 years. I want to transition to full-stack development. What should I learn first?",
                "category": "career",
                "tags": ["career-transition", "full-stack", "frontend"],
                "status": QuestionStatus.ANSWERED
            },
            {
                "title": "Best resources for learning React in 2024?",
                "content": "What are the best courses, tutorials, or resources for learning React in 2024? Looking for up-to-date content.",
                "category": "learning",
                "tags": ["react", "learning", "resources"],
                "status": QuestionStatus.ANSWERED
            },
            {
                "title": "How to prepare for senior developer interviews?",
                "content": "I'm preparing for senior developer interviews. What topics should I focus on? Any specific areas that are commonly tested?",
                "category": "career",
                "tags": ["interview", "senior", "career"],
                "status": QuestionStatus.PENDING
            },
            {
                "title": "Is TypeScript worth learning in 2024?",
                "content": "I'm a JavaScript developer. Should I learn TypeScript? What are the benefits?",
                "category": "technology",
                "tags": ["typescript", "javascript", "learning"],
                "status": QuestionStatus.ANSWERED
            },
            {
                "title": "How to build a portfolio project that stands out?",
                "content": "I'm looking to build a portfolio project that will help me stand out to employers. What kind of project should I build?",
                "category": "portfolio",
                "tags": ["portfolio", "projects", "career"],
                "status": QuestionStatus.PENDING
            }
        ]
        
        for q_data in sample_questions:
            question = Question(
                user_id=demo_user.id,
                title=q_data["title"],
                content=q_data["content"],
                category=q_data["category"],
                tags=q_data["tags"],
                status=q_data["status"],
                upvotes_count=0,
                answers_count=0
            )
            db.add(question)
        
        db.commit()
        
        # Add sample answers to answered questions
        answered_questions = db.query(Question).filter(Question.status == QuestionStatus.ANSWERED).all()
        for question in answered_questions:
            if "transition" in question.title.lower():
                answer = Answer(
                    question_id=question.id,
                    user_id=demo_user.id,
                    content="Start by learning a backend language (Node.js is great if you already know JavaScript). Focus on databases (SQL), APIs, and authentication. Build a full-stack project to practice.",
                    upvotes_count=5,
                    is_accepted=True
                )
                db.add(answer)
                question.answers_count = 1
            elif "react" in question.title.lower():
                answer = Answer(
                    question_id=question.id,
                    user_id=demo_user.id,
                    content="The React documentation is excellent. Also check out: React - The Complete Guide on Udemy, freeCodeCamp's React course, and the official React docs with the new beta docs.",
                    upvotes_count=8,
                    is_accepted=True
                )
                db.add(answer)
                question.answers_count = 1
            elif "typescript" in question.title.lower():
                answer = Answer(
                    question_id=question.id,
                    user_id=demo_user.id,
                    content="Yes! TypeScript is increasingly important. It helps catch errors early, improves code maintainability, and many companies require it. Start with the official TypeScript Handbook.",
                    upvotes_count=12,
                    is_accepted=True
                )
                db.add(answer)
                question.answers_count = 1
    
    # Seed sample cohorts
    existing_cohorts = db.query(Cohort).count()
    if existing_cohorts == 0:
        sample_cohorts = [
            {
                "name": "React Developers 2024",
                "description": "A community for React developers to learn, share, and grow together.",
                "role_focus": "Frontend Developer",
                "experience_level": "Mid Level",
                "max_members": 50,
                "is_private": False
            },
            {
                "name": "Full Stack Bootcamp",
                "description": "Learn full-stack development from scratch. We're building projects together and helping each other grow.",
                "role_focus": "Full Stack Developer",
                "experience_level": "Entry Level",
                "max_members": 30,
                "is_private": False
            },
            {
                "name": "Senior Engineers Circle",
                "description": "A private group for senior engineers to discuss architecture, leadership, and career growth.",
                "role_focus": "Senior Developer",
                "experience_level": "Senior Level",
                "max_members": 20,
                "is_private": True
            }
        ]
        
        for c_data in sample_cohorts:
            cohort = Cohort(
                created_by_id=demo_user.id,
                name=c_data["name"],
                description=c_data["description"],
                role_focus=c_data["role_focus"],
                experience_level=c_data["experience_level"],
                max_members=c_data["max_members"],
                is_private=c_data["is_private"],
                members_count=1
            )
            db.add(cohort)
            db.flush()
            
            # Add creator as admin
            membership = CohortMembership(
                cohort_id=cohort.id,
                user_id=demo_user.id,
                role=CohortRole.ADMIN,
                joined_at=datetime.utcnow()
            )
            db.add(membership)
        
        db.commit()
    
    # Seed sample study squads
    existing_squads = db.query(StudySquad).count()
    if existing_squads == 0:
        sample_squads = [
            {
                "name": "TypeScript Study Group",
                "description": "Weekly study sessions to master TypeScript together.",
                "focus_skill": "TypeScript",
                "max_members": 10,
                "meeting_frequency": "weekly"
            },
            {
                "name": "AWS Certification Prep",
                "description": "Studying for AWS certifications together. Weekly practice sessions.",
                "focus_skill": "AWS",
                "max_members": 8,
                "meeting_frequency": "weekly"
            }
        ]
        
        for s_data in sample_squads:
            squad = StudySquad(
                created_by_id=demo_user.id,
                name=s_data["name"],
                description=s_data["description"],
                focus_skill=s_data["focus_skill"],
                max_members=s_data["max_members"],
                meeting_frequency=s_data["meeting_frequency"],
                members_count=1
            )
            db.add(squad)
            db.flush()
            
            # Add creator as leader
            membership = SquadMembership(
                squad_id=squad.id,
                user_id=demo_user.id,
                role=SquadRole.LEADER,
                joined_at=datetime.utcnow()
            )
            db.add(membership)
        
        db.commit()
    
    return {
        "questions_seeded": db.query(Question).count(),
        "cohorts_seeded": db.query(Cohort).count(),
        "squads_seeded": db.query(StudySquad).count()
    }


