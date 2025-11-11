from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.assessment import Assessment, UserSkill
from app.models.job import Job
from app.models.user import User
from app.services.assessment_intelligence import (
    get_intelligent_followup_question,
    validate_skill_combination,
    analyze_career_trajectory
)
import json

class AssessmentService:
    def __init__(self, db: Session):
        self.db = db

    def start_assessment(self, user_id: str) -> Dict[str, Any]:
        """Start a new assessment or resume existing one"""
        # Convert string user_id to integer for database
        try:
            user_id_int = int(user_id)
        except (ValueError, TypeError):
            raise ValueError(f"Invalid user_id: {user_id}")
        
        existing_assessment = self.db.query(Assessment).filter(
            Assessment.user_id == user_id_int
        ).first()
        
        if existing_assessment:
            return {
                "message": "Assessment resumed",
                "current_question": self._get_current_question(existing_assessment),
                "assessment_id": existing_assessment.id
            }
        
        # Create new assessment
        assessment = Assessment(user_id=user_id_int)
        self.db.add(assessment)
        self.db.commit()
        self.db.refresh(assessment)
        
        return {
            "message": "Assessment started",
            "current_question": 0,
            "assessment_id": assessment.id,
            "total_questions": len(self._get_assessment_questions())
        }

    def save_answer(self, user_id: str, question_id: str, answer: Any) -> Dict[str, Any]:
        """Save an answer to a specific question"""
        # Convert string user_id to integer for database
        try:
            user_id_int = int(user_id)
        except (ValueError, TypeError):
            raise ValueError(f"Invalid user_id: {user_id}")
        
        assessment = self.db.query(Assessment).filter(
            Assessment.user_id == user_id_int
        ).first()
        
        if not assessment:
            raise ValueError("Assessment not found")
        
        # Update assessment with answer
        if not assessment.career_interests:
            assessment.career_interests = {}
        
        assessment.career_interests[question_id] = answer
        self.db.commit()
        
        # Generate intelligent follow-up
        followup = self._generate_followup_question(question_id, answer, assessment.career_interests)
        
        return {
            "answer_saved": True,
            "followup_question": followup,
            "next_question": self._get_next_question(assessment)
        }

    def complete_assessment(self, user_id: str, all_answers: Dict[str, Any]) -> Dict[str, Any]:
        """Complete assessment and save all answers"""
        # Convert string user_id to integer for database
        try:
            user_id_int = int(user_id)
        except (ValueError, TypeError):
            raise ValueError(f"Invalid user_id: {user_id}")
        
        assessment = self.db.query(Assessment).filter(
            Assessment.user_id == user_id_int
        ).first()
        
        if not assessment:
            raise ValueError("Assessment not found")
        
        # Save all answers
        assessment.career_interests = all_answers
        
        # Process and save skills separately
        if "technical_skills" in all_answers:
            self._save_user_skills(user_id_int, all_answers["technical_skills"])
        
        # Mark as completed
        from datetime import datetime, timezone
        assessment.assessment_completed_at = datetime.now(timezone.utc)
        assessment.experience_level = all_answers.get("experience_level")
        assessment.career_goals = all_answers.get("career_goals")
        assessment.location_preferences = all_answers.get("location_preferences", [])
        assessment.learning_preferences = {"preferences": all_answers.get("learning_preferences", [])}
        
        self.db.commit()
        
        return {
            "message": "Assessment completed successfully",
            "assessment_id": assessment.id,
            "next_steps": ["job_matching", "resume_generation", "learning_path"]
        }

    def _get_current_question(self, assessment: Assessment) -> int:
        """Get current question number for an assessment"""
        if not assessment.career_interests:
            return 0
        return len(assessment.career_interests)

    def _get_assessment_questions(self) -> List[Dict[str, Any]]:
        """Get all assessment questions"""
        # This would typically come from a database or config file
        return [
            {
                "id": "career_interests",
                "type": "multi_select",
                "question": "Which career paths interest you the most?",
                "options": [
                    "Frontend Developer",
                    "Backend Developer", 
                    "Full Stack Developer",
                    "DevOps Engineer",
                    "Data Scientist",
                    "Machine Learning Engineer",
                    "Product Manager",
                    "UI/UX Designer",
                    "Mobile Developer",
                    "Cybersecurity Specialist"
                ],
                "required": True
            },
            {
                "id": "experience_level",
                "type": "single_choice",
                "question": "What is your experience level?",
                "options": [
                    "Entry Level (0-2 years)",
                    "Mid Level (2-5 years)",
                    "Senior Level (5+ years)",
                    "Lead/Principal Level"
                ],
                "required": True
            },
            {
                "id": "technical_skills",
                "type": "skill_selector",
                "question": "What are your technical skills? (Select all that apply and rate your proficiency)",
                "skills": [
                    "JavaScript", "TypeScript", "Python", "Java", "C#", "Go", "Rust",
                    "React", "Vue.js", "Angular", "Node.js", "Django", "Flask",
                    "HTML", "CSS", "TailwindCSS", "SASS", "Bootstrap",
                    "SQL", "MongoDB", "PostgreSQL", "Redis",
                    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes",
                    "Git", "Linux", "Agile/Scrum"
                ],
                "proficiency_levels": ["Beginner", "Intermediate", "Advanced", "Expert"],
                "required": True
            },
            {
                "id": "soft_skills",
                "type": "multi_select",
                "question": "What are your soft skills?",
                "options": [
                    "Communication", "Leadership", "Problem Solving", "Teamwork",
                    "Time Management", "Critical Thinking", "Creativity", "Adaptability",
                    "Project Management", "Mentoring", "Public Speaking", "Negotiation"
                ],
                "required": False
            },
            {
                "id": "time_availability",
                "type": "slider",
                "question": "How many hours per day can you dedicate to learning?",
                "min": 1,
                "max": 10,
                "default": 5,
                "required": True
            },
            {
                "id": "learning_preferences",
                "type": "multi_select",
                "question": "How do you prefer to learn?",
                "options": [
                    "Online Courses", "Local Classes", "Bootcamps", "Self-study",
                    "Certifications", "Workshops", "Mentorship", "Video Tutorials"
                ],
                "required": True
            },
            {
                "id": "career_goals",
                "type": "text_input",
                "question": "Describe your career goals (optional)",
                "placeholder": "What do you want to achieve in your career?",
                "required": False
            },
            {
                "id": "location_preferences",
                "type": "multi_select",
                "question": "What are your location preferences?",
                "options": [
                    "Remote", "On-site", "Hybrid"
                ],
                "required": True
            }
        ]

    def _generate_followup_question(self, current_question_id: str, answer: Any, assessment_context: Dict) -> Optional[Dict[str, Any]]:
        """Generate dynamic follow-up questions based on user answers"""
        # Implementation for intelligent follow-up questions
        if current_question_id == "career_interests" and isinstance(answer, list):
            if "Frontend Developer" in answer:
                return {
                    "id": "frontend_deep_dive",
                    "type": "multi_select",
                    "question": "Nice! Frontend is hot right now. Which frameworks are you into?",
                    "options": ["React", "Vue.js", "Angular", "Svelte", "Next.js", "Gatsby"],
                    "required": True,
                    "followup_to": "career_interests"
                }
            elif "Backend Developer" in answer:
                return {
                    "id": "backend_deep_dive", 
                    "type": "multi_select",
                    "question": "Backend wizard! What's your stack?",
                    "options": ["Node.js", "Python/Django", "Java/Spring", "C#/.NET", "Go", "Ruby/Rails"],
                    "required": True,
                    "followup_to": "career_interests"
                }
            elif "Data Scientist" in answer:
                return {
                    "id": "data_science_deep_dive",
                    "type": "multi_select", 
                    "question": "Data science! ML or more traditional analytics?",
                    "options": ["Machine Learning", "Deep Learning", "Statistical Analysis", "Data Visualization", "Big Data"],
                    "required": True,
                    "followup_to": "career_interests"
                }
        return None

    def _get_next_question(self, assessment: Assessment) -> Optional[Dict[str, Any]]:
        """Get next question in assessment"""
        questions = self._get_assessment_questions()
        current_index = self._get_current_question(assessment)
        
        if current_index + 1 < len(questions):
            return questions[current_index + 1]
        return None

    def get_assessment_status(self, user_id: str) -> Dict[str, Any]:
        """Get assessment status and progress"""
        # Convert string user_id to integer for database
        try:
            user_id_int = int(user_id)
        except (ValueError, TypeError):
            raise ValueError(f"Invalid user_id: {user_id}")
        
        assessment = self.db.query(Assessment).filter(
            Assessment.user_id == user_id_int
        ).first()
        
        if not assessment:
            raise ValueError("Assessment not found")
        
        current_question = self._get_current_question(assessment)
        total_questions = len(self._get_assessment_questions())
        
        return {
            "assessment_id": assessment.id,
            "user_id": assessment.user_id,
            "current_question": current_question,
            "total_questions": total_questions,
            "progress_percentage": (current_question / total_questions) * 100,
            "is_completed": assessment.assessment_completed_at is not None,
            "completed_at": assessment.assessment_completed_at
        }

    def _save_user_skills(self, user_id: int, skills_data: Dict[str, str]) -> None:
        """Save user skills from assessment"""
        # Delete existing skills for this user
        self.db.query(UserSkill).filter(UserSkill.user_id == user_id).delete()
        
        # Save new skills
        for skill_name, proficiency in skills_data.items():
            if proficiency and proficiency != "None":
                user_skill = UserSkill(
                    user_id=user_id,
                    skill_name=skill_name,
                    proficiency_level=proficiency,
                    skill_category="technical"
                )
                self.db.add(user_skill)
        
        self.db.commit()
    
    def save_intelligent_answer(self, user_id: str, question_id: str, answer: Any) -> Dict[str, Any]:
        """Save answer and generate intelligent follow-ups"""
        # Convert string user_id to integer for database
        try:
            user_id_int = int(user_id)
        except (ValueError, TypeError):
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail=f"Invalid user_id: {user_id}")
        
        assessment = self.db.query(Assessment).filter(
            Assessment.user_id == user_id_int
        ).first()
        
        if not assessment:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Assessment not found")
        
        # Get current assessment context
        if not assessment.career_interests:
            assessment.career_interests = {}
        
        assessment.career_interests[question_id] = answer
        self.db.commit()
        
        # Generate intelligent follow-up
        followup_question = get_intelligent_followup_question(
            question_id,
            answer,
            assessment.career_interests
        )
        
        # Generate skill insights for technical skills
        skill_insights = []
        if question_id == "technical_skills" and isinstance(answer, dict):
            skill_insights = validate_skill_combination(answer)
        
        # Generate career trajectory insights
        trajectory_analysis = None
        all_answers = assessment.career_interests
        if len(all_answers) >= 3:  # Have enough data for analysis
            trajectory_analysis = analyze_career_trajectory(all_answers)
        
        response = {
            "answer_saved": True,
            "followup_question": followup_question,
            "skill_insights": skill_insights,
            "trajectory_analysis": trajectory_analysis
        }
        
        # If no follow-up, get next standard question
        if not followup_question:
            current_index = self._get_current_question(assessment)
            next_index = current_index + 1
            questions = self._get_assessment_questions()
            
            if next_index < len(questions):
                response["next_standard_question"] = questions[next_index]
                response["question_number"] = next_index + 1
                response["total_questions"] = len(questions)
            else:
                response["assessment_complete"] = True
        
        return response
    
    def _get_current_question_index(self, assessment: Assessment) -> int:
        """Get the current question index"""
        if not assessment.career_interests:
            return 0
        return len(assessment.career_interests)