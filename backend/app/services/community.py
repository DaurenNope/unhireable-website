from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.models.community import (
    Question, Answer, QuestionUpvote, AnswerUpvote,
    Cohort, CohortMembership, CohortPost, CohortPostComment, CohortPostLike,
    StudySquad, SquadMembership, StudySession, StudySessionAttendance,
    QuestionStatus, CohortRole, SquadRole
)
from app.models.user import User
from app.models.assessment import Assessment, LearningPath


class AIQAService:
    """Service for AI-guided Q&A"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def ask_question(self, user_id: int, title: str, content: str, category: Optional[str] = None, tags: Optional[List[str]] = None) -> Dict[str, Any]:
        """Create a new question and generate AI answer"""
        question = Question(
            user_id=user_id,
            title=title,
            content=content,
            category=category or "general",
            tags=tags or [],
            status=QuestionStatus.PENDING
        )
        self.db.add(question)
        self.db.commit()
        self.db.refresh(question)
        
        # Generate AI answer
        ai_answer = self._generate_ai_answer(question, user_id)
        
        if ai_answer:
            question.ai_answer = ai_answer["answer"]
            question.ai_answer_confidence = ai_answer.get("confidence", 75)
            question.ai_answer_metadata = ai_answer.get("metadata", {})
            question.status = QuestionStatus.ANSWERED
            question.answers_count = 1
            self.db.commit()
        
        return self._serialize_question(question)
    
    def _generate_ai_answer(self, question: Question, user_id: int) -> Optional[Dict[str, Any]]:
        """Generate AI answer based on question and user context"""
        # Get user context
        user = self.db.query(User).filter(User.id == user_id).first()
        assessment = self.db.query(Assessment).filter(Assessment.user_id == user_id).first()
        
        # Build context
        context = {
            "question": question.content,
            "category": question.category,
            "tags": question.tags,
        }
        
        if assessment:
            user = self.db.query(User).filter(User.id == user_id).first()
            if user and user.skills:
                context["user_skills"] = [s.skill_name for s in user.skills]
            context["experience_level"] = assessment.experience_level
            context["career_goals"] = assessment.career_goals
        
        # Generate answer based on category
        answer = self._generate_answer_by_category(context)
        
        return {
            "answer": answer,
            "confidence": 75,
            "metadata": {
                "model": "neural-career-system",
                "context_used": True,
                "generated_at": datetime.now().isoformat()
            }
        }
    
    def _generate_answer_by_category(self, context: Dict[str, Any]) -> str:
        """Generate answer based on question category"""
        question = context["question"].lower()
        category = context.get("category", "general").lower()
        
        # Career-related questions
        if "career" in category or "career" in question:
            return self._generate_career_answer(context)
        
        # Technical questions
        if "technical" in category or any(tag in ["technical", "coding", "programming"] for tag in context.get("tags", [])):
            return self._generate_technical_answer(context)
        
        # Interview questions
        if "interview" in category or "interview" in question:
            return self._generate_interview_answer(context)
        
        # Learning questions
        if "learning" in category or "learn" in question:
            return self._generate_learning_answer(context)
        
        # Default answer
        return self._generate_default_answer(context)
    
    def _generate_career_answer(self, context: Dict[str, Any]) -> str:
        """Generate career-related answer"""
        return """Based on your profile and career goals, here's my recommendation:

1. **Skill Development**: Focus on building skills that align with your career goals. Consider taking courses or working on projects that demonstrate these skills.

2. **Networking**: Connect with professionals in your target field. Attend meetups, join online communities, and engage with industry leaders.

3. **Experience**: Gain relevant experience through projects, internships, or freelance work. Build a portfolio that showcases your abilities.

4. **Continuous Learning**: Stay updated with industry trends and technologies. Consider certifications or advanced training.

5. **Career Path**: Based on your experience level and goals, you're on the right track. Continue building your skills and expanding your network.

Remember: Career growth is a journey. Focus on continuous improvement and stay persistent."""
    
    def _generate_technical_answer(self, context: Dict[str, Any]) -> str:
        """Generate technical answer"""
        user_skills = context.get("user_skills", [])
        
        return f"""Here's a technical answer to your question:

**Understanding the Problem**: Your question touches on important technical concepts that are relevant to modern development.

**Best Practices**:
1. Follow industry standards and best practices
2. Write clean, maintainable code
3. Use appropriate design patterns
4. Test thoroughly
5. Document your code

**Resources**:
- Official documentation
- Community forums and discussions
- Online courses and tutorials
- Hands-on practice projects

**Next Steps**:
1. Break down the problem into smaller parts
2. Research similar solutions
3. Implement and test
4. Refactor and optimize
5. Share your solution with the community

Based on your skills ({', '.join(user_skills[:5]) if user_skills else 'general'}), I recommend focusing on practical implementation and hands-on learning."""
    
    def _generate_interview_answer(self, context: Dict[str, Any]) -> str:
        """Generate interview-related answer"""
        return """Here's advice for your interview preparation:

**Preparation**:
1. Research the company and role thoroughly
2. Prepare answers to common questions
3. Practice technical skills and problem-solving
4. Prepare questions to ask the interviewer
5. Review your resume and be ready to discuss it

**During the Interview**:
1. Be confident and authentic
2. Listen carefully and ask clarifying questions
3. Show your problem-solving process
4. Demonstrate your communication skills
5. Show enthusiasm and interest

**Technical Interviews**:
1. Practice coding problems regularly
2. Explain your thought process
3. Consider edge cases
4. Optimize your solution
5. Ask for feedback

**Behavioral Interviews**:
1. Use the STAR method (Situation, Task, Action, Result)
2. Provide specific examples
3. Show your impact and results
4. Demonstrate your soft skills
5. Be honest and authentic

**After the Interview**:
1. Send a thank-you note
2. Follow up appropriately
3. Continue learning and improving
4. Stay positive and persistent

Remember: Interviews are a two-way street. Use them to evaluate if the role and company are a good fit for you."""
    
    def _generate_learning_answer(self, context: Dict[str, Any]) -> str:
        """Generate learning-related answer"""
        return """Here's guidance for your learning journey:

**Learning Strategy**:
1. Set clear learning goals
2. Break down complex topics into smaller parts
3. Use multiple learning resources
4. Practice regularly
5. Build projects to apply your knowledge

**Resources**:
- Online courses and tutorials
- Books and documentation
- Practice platforms
- Community forums and discussions
- Mentorship and study groups

**Best Practices**:
1. Learn by doing - hands-on practice is key
2. Teach others - explaining concepts helps you understand better
3. Join communities - learn from others and share knowledge
4. Stay consistent - regular practice is more effective than cramming
5. Track your progress - monitor your learning and adjust as needed

**Study Groups**:
- Join or create study groups with similar goals
- Collaborate on projects
- Share resources and insights
- Hold each other accountable
- Celebrate achievements together

**Next Steps**:
1. Identify your learning objectives
2. Find relevant resources
3. Create a study schedule
4. Start practicing and building
5. Join a study group or community

Remember: Learning is a continuous process. Stay curious, stay persistent, and enjoy the journey."""
    
    def _generate_default_answer(self, context: Dict[str, Any]) -> str:
        """Generate default answer"""
        return """Thank you for your question. Here's my response:

**Key Points**:
1. Your question is important and worth exploring
2. Consider multiple perspectives and approaches
3. Research and gather information
4. Practice and apply your knowledge
5. Seek feedback and iterate

**Resources**:
- Community forums and discussions
- Online courses and tutorials
- Books and documentation
- Mentorship and guidance
- Hands-on practice

**Next Steps**:
1. Research the topic thoroughly
2. Practice and apply what you learn
3. Seek feedback from others
4. Continue learning and improving
5. Share your knowledge with the community

If you need more specific guidance, feel free to ask follow-up questions or provide more context."""
    
    def add_answer(self, question_id: int, user_id: int, content: str, is_ai_generated: bool = False) -> Dict[str, Any]:
        """Add an answer to a question"""
        question = self.db.query(Question).filter(Question.id == question_id).first()
        if not question:
            return {"error": "Question not found"}
        
        answer = Answer(
            question_id=question_id,
            user_id=user_id,
            content=content,
            is_ai_generated=is_ai_generated
        )
        self.db.add(answer)
        
        # Update question
        question.answers_count += 1
        if question.status == QuestionStatus.PENDING:
            question.status = QuestionStatus.ANSWERED
        self.db.commit()
        self.db.refresh(answer)
        
        return self._serialize_answer(answer)
    
    def upvote_question(self, question_id: int, user_id: int) -> Dict[str, Any]:
        """Upvote a question"""
        # Check if already upvoted
        existing = self.db.query(QuestionUpvote).filter(
            QuestionUpvote.question_id == question_id,
            QuestionUpvote.user_id == user_id
        ).first()
        
        if existing:
            return {"error": "Already upvoted"}
        
        upvote = QuestionUpvote(
            question_id=question_id,
            user_id=user_id
        )
        self.db.add(upvote)
        
        # Update question upvotes count
        question = self.db.query(Question).filter(Question.id == question_id).first()
        if question:
            question.upvotes_count += 1
            self.db.commit()
            return {"success": True, "upvotes_count": question.upvotes_count}
        
        return {"error": "Question not found"}
    
    def upvote_answer(self, answer_id: int, user_id: int) -> Dict[str, Any]:
        """Upvote an answer"""
        # Check if already upvoted
        existing = self.db.query(AnswerUpvote).filter(
            AnswerUpvote.answer_id == answer_id,
            AnswerUpvote.user_id == user_id
        ).first()
        
        if existing:
            return {"error": "Already upvoted"}
        
        upvote = AnswerUpvote(
            answer_id=answer_id,
            user_id=user_id
        )
        self.db.add(upvote)
        
        # Update answer upvotes count
        answer = self.db.query(Answer).filter(Answer.id == answer_id).first()
        if answer:
            answer.upvotes_count += 1
            self.db.commit()
            return {"success": True, "upvotes_count": answer.upvotes_count}
        
        return {"error": "Answer not found"}
    
    def get_questions(self, user_id: Optional[int] = None, category: Optional[str] = None, status: Optional[str] = None, limit: int = 20, offset: int = 0) -> Dict[str, Any]:
        """Get questions with filters"""
        query = self.db.query(Question)
        
        if user_id:
            query = query.filter(Question.user_id == user_id)
        if category:
            query = query.filter(Question.category == category)
        if status:
            query = query.filter(Question.status == QuestionStatus[status.upper()])
        
        total = query.count()
        questions = query.order_by(Question.created_at.desc()).offset(offset).limit(limit).all()
        
        return {
            "questions": [self._serialize_question(q) for q in questions],
            "total": total,
            "limit": limit,
            "offset": offset
        }
    
    def get_question(self, question_id: int) -> Dict[str, Any]:
        """Get a single question with answers"""
        question = self.db.query(Question).filter(Question.id == question_id).first()
        if not question:
            return {"error": "Question not found"}
        
        # Increment views
        question.views_count += 1
        self.db.commit()
        
        # Get answers
        answers = self.db.query(Answer).filter(Answer.question_id == question_id).order_by(Answer.created_at.desc()).all()
        
        result = self._serialize_question(question)
        result["answers"] = [self._serialize_answer(a) for a in answers]
        
        return result
    
    def _serialize_question(self, question: Question) -> Dict[str, Any]:
        """Serialize question to dict"""
        return {
            "id": question.id,
            "user_id": question.user_id,
            "title": question.title,
            "content": question.content,
            "category": question.category,
            "tags": question.tags,
            "status": question.status.value if question.status else None,
            "views_count": question.views_count,
            "upvotes_count": question.upvotes_count,
            "answers_count": question.answers_count,
            "ai_answer": question.ai_answer,
            "ai_answer_confidence": question.ai_answer_confidence,
            "created_at": question.created_at.isoformat() if question.created_at else None,
            "updated_at": question.updated_at.isoformat() if question.updated_at else None,
        }
    
    def _serialize_answer(self, answer: Answer) -> Dict[str, Any]:
        """Serialize answer to dict"""
        return {
            "id": answer.id,
            "question_id": answer.question_id,
            "user_id": answer.user_id,
            "content": answer.content,
            "is_ai_generated": answer.is_ai_generated,
            "is_accepted": answer.is_accepted,
            "upvotes_count": answer.upvotes_count,
            "created_at": answer.created_at.isoformat() if answer.created_at else None,
            "updated_at": answer.updated_at.isoformat() if answer.updated_at else None,
        }


class CohortService:
    """Service for role-based cohorts"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_cohort(self, user_id: int, name: str, description: Optional[str] = None, role_category: Optional[str] = None, skill_level: Optional[str] = None, max_members: int = 100, is_public: bool = True) -> Dict[str, Any]:
        """Create a new cohort"""
        cohort = Cohort(
            name=name,
            description=description,
            role_category=role_category,
            skill_level=skill_level,
            max_members=max_members,
            is_public=is_public,
            created_by=user_id,
            current_members_count=0
        )
        self.db.add(cohort)
        self.db.commit()
        self.db.refresh(cohort)
        
        # Add creator as admin
        membership = CohortMembership(
            cohort_id=cohort.id,
            user_id=user_id,
            role=CohortRole.ADMIN
        )
        self.db.add(membership)
        cohort.current_members_count = 1
        self.db.commit()
        
        return self._serialize_cohort(cohort)
    
    def join_cohort(self, cohort_id: int, user_id: int) -> Dict[str, Any]:
        """Join a cohort"""
        cohort = self.db.query(Cohort).filter(Cohort.id == cohort_id).first()
        if not cohort:
            return {"error": "Cohort not found"}
        
        # Check if already a member
        existing = self.db.query(CohortMembership).filter(
            CohortMembership.cohort_id == cohort_id,
            CohortMembership.user_id == user_id
        ).first()
        
        if existing:
            return {"error": "Already a member"}
        
        # Check if cohort is full
        if cohort.current_members_count >= cohort.max_members:
            return {"error": "Cohort is full"}
        
        # Add membership
        membership = CohortMembership(
            cohort_id=cohort_id,
            user_id=user_id,
            role=CohortRole.MEMBER
        )
        self.db.add(membership)
        cohort.current_members_count += 1
        self.db.commit()
        
        return {"success": True, "cohort": self._serialize_cohort(cohort)}
    
    def leave_cohort(self, cohort_id: int, user_id: int) -> Dict[str, Any]:
        """Leave a cohort"""
        membership = self.db.query(CohortMembership).filter(
            CohortMembership.cohort_id == cohort_id,
            CohortMembership.user_id == user_id
        ).first()
        
        if not membership:
            return {"error": "Not a member"}
        
        # Remove membership
        self.db.delete(membership)
        
        # Update cohort members count
        cohort = self.db.query(Cohort).filter(Cohort.id == cohort_id).first()
        if cohort:
            cohort.current_members_count = max(0, cohort.current_members_count - 1)
            self.db.commit()
        
        return {"success": True}
    
    def get_cohorts(self, user_id: Optional[int] = None, role_category: Optional[str] = None, skill_level: Optional[str] = None, limit: int = 20, offset: int = 0) -> Dict[str, Any]:
        """Get cohorts with filters"""
        query = self.db.query(Cohort).filter(Cohort.is_active == True)
        
        if role_category:
            query = query.filter(Cohort.role_category == role_category)
        if skill_level:
            query = query.filter(Cohort.skill_level == skill_level)
        
        # Filter by user membership if user_id provided
        if user_id:
            user_cohort_ids = [m.cohort_id for m in self.db.query(CohortMembership).filter(CohortMembership.user_id == user_id).all()]
            query = query.filter((Cohort.id.in_(user_cohort_ids)) | (Cohort.is_public == True))
        
        total = query.count()
        cohorts = query.order_by(Cohort.created_at.desc()).offset(offset).limit(limit).all()
        
        return {
            "cohorts": [self._serialize_cohort(c) for c in cohorts],
            "total": total,
            "limit": limit,
            "offset": offset
        }
    
    def get_cohort(self, cohort_id: int, user_id: Optional[int] = None) -> Dict[str, Any]:
        """Get a single cohort with members"""
        cohort = self.db.query(Cohort).filter(Cohort.id == cohort_id).first()
        if not cohort:
            return {"error": "Cohort not found"}
        
        # Check if user is a member (if user_id provided)
        is_member = False
        if user_id:
            membership = self.db.query(CohortMembership).filter(
                CohortMembership.cohort_id == cohort_id,
                CohortMembership.user_id == user_id
            ).first()
            is_member = membership is not None
        
        # Get members
        members = self.db.query(CohortMembership).filter(CohortMembership.cohort_id == cohort_id).all()
        
        result = self._serialize_cohort(cohort)
        result["is_member"] = is_member
        result["members"] = [self._serialize_membership(m) for m in members]
        
        return result
    
    def create_post(self, cohort_id: int, user_id: int, content: str, title: Optional[str] = None, post_type: str = "discussion") -> Dict[str, Any]:
        """Create a post in a cohort"""
        # Check if user is a member
        membership = self.db.query(CohortMembership).filter(
            CohortMembership.cohort_id == cohort_id,
            CohortMembership.user_id == user_id
        ).first()
        
        if not membership:
            return {"error": "Not a member of this cohort"}
        
        post = CohortPost(
            cohort_id=cohort_id,
            user_id=user_id,
            title=title,
            content=content,
            post_type=post_type
        )
        self.db.add(post)
        self.db.commit()
        self.db.refresh(post)
        
        return self._serialize_post(post)
    
    def get_posts(self, cohort_id: int, limit: int = 20, offset: int = 0) -> Dict[str, Any]:
        """Get posts for a cohort"""
        query = self.db.query(CohortPost).filter(CohortPost.cohort_id == cohort_id)
        total = query.count()
        posts = query.order_by(CohortPost.created_at.desc()).offset(offset).limit(limit).all()
        
        return {
            "posts": [self._serialize_post(p) for p in posts],
            "total": total,
            "limit": limit,
            "offset": offset
        }
    
    def _serialize_cohort(self, cohort: Cohort) -> Dict[str, Any]:
        """Serialize cohort to dict"""
        return {
            "id": cohort.id,
            "name": cohort.name,
            "description": cohort.description,
            "role_category": cohort.role_category,
            "skill_level": cohort.skill_level,
            "max_members": cohort.max_members,
            "current_members_count": cohort.current_members_count,
            "is_active": cohort.is_active,
            "is_public": cohort.is_public,
            "created_by": cohort.created_by,
            "created_at": cohort.created_at.isoformat() if cohort.created_at else None,
            "updated_at": cohort.updated_at.isoformat() if cohort.updated_at else None,
        }
    
    def _serialize_membership(self, membership: CohortMembership) -> Dict[str, Any]:
        """Serialize membership to dict"""
        return {
            "id": membership.id,
            "cohort_id": membership.cohort_id,
            "user_id": membership.user_id,
            "role": membership.role.value if membership.role else None,
            "joined_at": membership.joined_at.isoformat() if membership.joined_at else None,
            "last_active_at": membership.last_active_at.isoformat() if membership.last_active_at else None,
        }
    
    def _serialize_post(self, post: CohortPost) -> Dict[str, Any]:
        """Serialize post to dict"""
        return {
            "id": post.id,
            "cohort_id": post.cohort_id,
            "user_id": post.user_id,
            "title": post.title,
            "content": post.content,
            "post_type": post.post_type,
            "likes_count": post.likes_count,
            "comments_count": post.comments_count,
            "created_at": post.created_at.isoformat() if post.created_at else None,
            "updated_at": post.updated_at.isoformat() if post.updated_at else None,
        }


class StudySquadService:
    """Service for study squads"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_squad(self, user_id: int, name: str, description: Optional[str] = None, learning_path_id: Optional[int] = None, skill_focus: Optional[str] = None, max_members: int = 5, is_public: bool = False, scheduled_study_time: Optional[str] = None) -> Dict[str, Any]:
        """Create a new study squad"""
        squad = StudySquad(
            name=name,
            description=description,
            learning_path_id=learning_path_id,
            skill_focus=skill_focus,
            max_members=max_members,
            is_public=is_public,
            created_by=user_id,
            current_members_count=0,
            scheduled_study_time=scheduled_study_time
        )
        self.db.add(squad)
        self.db.commit()
        self.db.refresh(squad)
        
        # Add creator as leader
        membership = SquadMembership(
            squad_id=squad.id,
            user_id=user_id,
            role=SquadRole.LEADER
        )
        self.db.add(membership)
        squad.current_members_count = 1
        self.db.commit()
        
        return self._serialize_squad(squad)
    
    def join_squad(self, squad_id: int, user_id: int) -> Dict[str, Any]:
        """Join a study squad"""
        squad = self.db.query(StudySquad).filter(StudySquad.id == squad_id).first()
        if not squad:
            return {"error": "Study squad not found"}
        
        # Check if already a member
        existing = self.db.query(SquadMembership).filter(
            SquadMembership.squad_id == squad_id,
            SquadMembership.user_id == user_id
        ).first()
        
        if existing:
            return {"error": "Already a member"}
        
        # Check if squad is full
        if squad.current_members_count >= squad.max_members:
            return {"error": "Study squad is full"}
        
        # Add membership
        membership = SquadMembership(
            squad_id=squad_id,
            user_id=user_id,
            role=SquadRole.MEMBER
        )
        self.db.add(membership)
        squad.current_members_count += 1
        self.db.commit()
        
        return {"success": True, "squad": self._serialize_squad(squad)}
    
    def leave_squad(self, squad_id: int, user_id: int) -> Dict[str, Any]:
        """Leave a study squad"""
        membership = self.db.query(SquadMembership).filter(
            SquadMembership.squad_id == squad_id,
            SquadMembership.user_id == user_id
        ).first()
        
        if not membership:
            return {"error": "Not a member"}
        
        # Remove membership
        self.db.delete(membership)
        
        # Update squad members count
        squad = self.db.query(StudySquad).filter(StudySquad.id == squad_id).first()
        if squad:
            squad.current_members_count = max(0, squad.current_members_count - 1)
            self.db.commit()
        
        return {"success": True}
    
    def get_squads(self, user_id: Optional[int] = None, skill_focus: Optional[str] = None, limit: int = 20, offset: int = 0) -> Dict[str, Any]:
        """Get study squads with filters"""
        query = self.db.query(StudySquad).filter(StudySquad.is_active == True)
        
        if skill_focus:
            query = query.filter(StudySquad.skill_focus == skill_focus)
        
        # Filter by user membership if user_id provided
        if user_id:
            user_squad_ids = [m.squad_id for m in self.db.query(SquadMembership).filter(SquadMembership.user_id == user_id).all()]
            query = query.filter((StudySquad.id.in_(user_squad_ids)) | (StudySquad.is_public == True))
        
        total = query.count()
        squads = query.order_by(StudySquad.created_at.desc()).offset(offset).limit(limit).all()
        
        return {
            "squads": [self._serialize_squad(s) for s in squads],
            "total": total,
            "limit": limit,
            "offset": offset
        }
    
    def get_squad(self, squad_id: int, user_id: Optional[int] = None) -> Dict[str, Any]:
        """Get a single study squad with members"""
        squad = self.db.query(StudySquad).filter(StudySquad.id == squad_id).first()
        if not squad:
            return {"error": "Study squad not found"}
        
        # Check if user is a member (if user_id provided)
        is_member = False
        if user_id:
            membership = self.db.query(SquadMembership).filter(
                SquadMembership.squad_id == squad_id,
                SquadMembership.user_id == user_id
            ).first()
            is_member = membership is not None
        
        # Get members
        members = self.db.query(SquadMembership).filter(SquadMembership.squad_id == squad_id).all()
        
        # Get sessions
        sessions = self.db.query(StudySession).filter(StudySession.squad_id == squad_id).order_by(StudySession.scheduled_at.desc()).all()
        
        result = self._serialize_squad(squad)
        result["is_member"] = is_member
        result["members"] = [self._serialize_membership(m) for m in members]
        result["sessions"] = [self._serialize_session(s) for s in sessions]
        
        return result
    
    def create_session(self, squad_id: int, user_id: int, title: str, description: Optional[str] = None, scheduled_at: Optional[datetime] = None, topic: Optional[str] = None, resources: Optional[List[str]] = None) -> Dict[str, Any]:
        """Create a study session"""
        # Check if user is a member
        membership = self.db.query(SquadMembership).filter(
            SquadMembership.squad_id == squad_id,
            SquadMembership.user_id == user_id
        ).first()
        
        if not membership:
            return {"error": "Not a member of this study squad"}
        
        session = StudySession(
            squad_id=squad_id,
            created_by=user_id,
            title=title,
            description=description,
            scheduled_at=scheduled_at,
            topic=topic,
            resources=resources or [],
            status="scheduled"
        )
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        
        return self._serialize_session(session)
    
    def get_sessions(self, squad_id: int, limit: int = 20, offset: int = 0) -> Dict[str, Any]:
        """Get study sessions for a squad"""
        query = self.db.query(StudySession).filter(StudySession.squad_id == squad_id)
        total = query.count()
        sessions = query.order_by(StudySession.scheduled_at.desc()).offset(offset).limit(limit).all()
        
        return {
            "sessions": [self._serialize_session(s) for s in sessions],
            "total": total,
            "limit": limit,
            "offset": offset
        }
    
    def _serialize_squad(self, squad: StudySquad) -> Dict[str, Any]:
        """Serialize squad to dict"""
        return {
            "id": squad.id,
            "name": squad.name,
            "description": squad.description,
            "learning_path_id": squad.learning_path_id,
            "skill_focus": squad.skill_focus,
            "max_members": squad.max_members,
            "current_members_count": squad.current_members_count,
            "is_active": squad.is_active,
            "is_public": squad.is_public,
            "created_by": squad.created_by,
            "scheduled_study_time": squad.scheduled_study_time,
            "timezone": squad.timezone,
            "created_at": squad.created_at.isoformat() if squad.created_at else None,
            "updated_at": squad.updated_at.isoformat() if squad.updated_at else None,
        }
    
    def _serialize_membership(self, membership: SquadMembership) -> Dict[str, Any]:
        """Serialize membership to dict"""
        return {
            "id": membership.id,
            "squad_id": membership.squad_id,
            "user_id": membership.user_id,
            "role": membership.role.value if membership.role else None,
            "joined_at": membership.joined_at.isoformat() if membership.joined_at else None,
            "last_active_at": membership.last_active_at.isoformat() if membership.last_active_at else None,
            "progress_shared": membership.progress_shared,
        }
    
    def _serialize_session(self, session: StudySession) -> Dict[str, Any]:
        """Serialize session to dict"""
        return {
            "id": session.id,
            "squad_id": session.squad_id,
            "created_by": session.created_by,
            "title": session.title,
            "description": session.description,
            "scheduled_at": session.scheduled_at.isoformat() if session.scheduled_at else None,
            "started_at": session.started_at.isoformat() if session.started_at else None,
            "ended_at": session.ended_at.isoformat() if session.ended_at else None,
            "duration_minutes": session.duration_minutes,
            "topic": session.topic,
            "resources": session.resources,
            "attendees_count": session.attendees_count,
            "status": session.status,
            "created_at": session.created_at.isoformat() if session.created_at else None,
            "updated_at": session.updated_at.isoformat() if session.updated_at else None,
        }

