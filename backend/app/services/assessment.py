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
from app.services.personality_analyzer import PersonalityAnalyzer
from app.services.contextual_messages import (
    get_contextual_message,
    get_encouragement_message,
    get_answer_acknowledgment
)
import json

class AssessmentService:
    def __init__(self, db: Session):
        self.db = db
        # Store personality analyzers per user session
        self._personality_analyzers: Dict[int, PersonalityAnalyzer] = {}

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
        
        # Auto-generate learning path after assessment completion
        try:
            self._auto_generate_learning_path(user_id_int, all_answers)
        except Exception as e:
            # Don't fail assessment completion if learning path generation fails
            print(f"Warning: Failed to auto-generate learning path: {e}")
        
        # Get final personality profile if analyzer exists
        final_personality_profile = None
        if user_id_int in self._personality_analyzers:
            final_personality_profile = self._personality_analyzers[user_id_int].get_full_profile()
            # Clean up analyzer after completion
            del self._personality_analyzers[user_id_int]
        
        return {
            "message": "Assessment completed successfully",
            "assessment_id": assessment.id,
            "next_steps": ["job_matching", "resume_generation", "learning_path"],
            "learning_path_generated": True,
            "final_personality_profile": final_personality_profile
        }
    
    def _auto_generate_learning_path(self, user_id: int, all_answers: Dict[str, Any]) -> None:
        """Auto-generate a learning path after assessment completion"""
        # Import here to avoid circular dependencies
        from app.models.learning import LearningPath
        from app.routers.learning import (
            select_best_resources,
            calculate_learning_timeline,
            generate_milestones,
            create_daily_schedule,
            prioritize_skill_gaps
        )
        
        try:
            # Get user skills
            user_skills_data = self.db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
            user_skills = {skill.skill_name: skill.proficiency_level for skill in user_skills_data}
            
            # Get career interests to determine skill gaps
            career_interests = all_answers.get("career_interests", [])
            
            # Determine skill gaps based on career interests
            # For Frontend: React, TypeScript, Next.js
            # For Backend: Python, Node.js, Go
            # For Full Stack: All of the above
            required_skills_map = {
                "Frontend Developer": ["React", "TypeScript", "Next.js", "CSS", "HTML"],
                "Backend Developer": ["Python", "Node.js", "SQL", "AWS"],
                "Full Stack Developer": ["React", "TypeScript", "Node.js", "Python", "SQL", "AWS"],
                "DevOps Engineer": ["AWS", "Docker", "Kubernetes", "Terraform"],
                "Data Scientist": ["Python", "SQL", "Machine Learning", "Data Science"],
                "Machine Learning Engineer": ["Python", "Machine Learning", "TensorFlow", "AWS"]
            }
            
            # Get required skills for career interests
            required_skills = set()
            for interest in career_interests:
                if interest in required_skills_map:
                    required_skills.update(required_skills_map[interest])
            
            # If no specific interests, use common skills
            if not required_skills:
                required_skills = {"React", "TypeScript", "Node.js", "Python", "SQL"}
            
            # Find skill gaps
            user_skill_names = set(user_skills.keys())
            skill_gaps_list = [skill for skill in required_skills if skill not in user_skill_names]
            
            if not skill_gaps_list:
                # User has all required skills, skip learning path generation
                return
            
            # Analyze learning style - inline version since function expects nested dict
            learning_preferences = all_answers.get("learning_preferences", [])
            hours_per_day = all_answers.get("time_availability", 5)
            learning_style = {
                "preferences": learning_preferences,
                "hours_per_day": hours_per_day,
                "preferred_pace": "intensive" if hours_per_day >= 7 else "moderate" if hours_per_day >= 3 else "relaxed",
                "format_preference": "hands_on" if "Online Courses" in learning_preferences else "self_paced",
                "budget_conscious": "Free resources" in learning_preferences if isinstance(learning_preferences, list) else False
            }
            
            # Prioritize skill gaps
            prioritized_gaps = prioritize_skill_gaps(skill_gaps_list, user_skills, "")
            
            # Select resources for each skill gap
            skills_with_resources = []
            for gap in prioritized_gaps[:10]:  # Top 10 skill gaps
                skill = gap["skill"]
                best_resources = select_best_resources(skill, learning_style)
                
                if best_resources:
                    skills_with_resources.append({
                        "skill": skill,
                        "priority": gap.get("priority", "medium"),
                        "urgency_score": gap.get("urgency_score", 50),
                        "resources": best_resources,
                        "estimated_impact": gap.get("estimated_impact", 5),
                        "dependencies_met": gap.get("prerequisites_met", True)
                    })
            
            if not skills_with_resources:
                return
            
            # Calculate learning timeline
            timeline = calculate_learning_timeline(skills_with_resources, hours_per_day)
            
            # Generate milestones
            milestones = generate_milestones(timeline.get("skill_timelines", []))
            
            # Create daily schedule
            daily_schedule = create_daily_schedule(skills_with_resources, hours_per_day)
            
            # Create learning path
            learning_path = LearningPath(
                user_id=user_id,
                skill_gaps=skill_gaps_list[:10],
                resources={
                    "title": f"Learning Path for {', '.join(career_interests[:2]) if career_interests else 'Career Development'}",
                    "skills_with_resources": skills_with_resources,
                    "timeline": timeline,
                    "milestones": milestones,
                    "learning_style": learning_style,
                    "daily_schedule": daily_schedule,
                },
                estimated_completion_weeks=timeline.get("total_weeks", 8),
                hours_per_day=hours_per_day,
                status="not_started",
                progress_percentage=0
            )
            
            self.db.add(learning_path)
            self.db.commit()
        except Exception as e:
            # Log error but don't fail assessment completion
            import traceback
            print(f"Warning: Failed to auto-generate learning path: {e}")
            print(traceback.format_exc())

    def _get_current_question(self, assessment: Assessment) -> int:
        """Get current question number for an assessment"""
        if not assessment.career_interests:
            return 0
        return len(assessment.career_interests)

    def _get_assessment_questions(self) -> List[Dict[str, Any]]:
        """Get all assessment questions - now using deep psychological questions"""
        from app.services.deep_assessment_questions import get_deep_assessment_questions
        return get_deep_assessment_questions()

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
        
        # Get or create personality analyzer for this user
        if user_id_int not in self._personality_analyzers:
            self._personality_analyzers[user_id_int] = PersonalityAnalyzer()
        
        personality_analyzer = self._personality_analyzers[user_id_int]
        
        # Real-time personality analysis
        personality_analysis = personality_analyzer.analyze_answer(
            question_id,
            answer,
            assessment.career_interests
        )
        
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
            "trajectory_analysis": trajectory_analysis,
            "personality_analysis": personality_analysis  # Add real-time personality insights
        }
        
        # Add final personality profile if assessment is complete
        if response.get("assessment_complete"):
            response["final_personality_profile"] = personality_analyzer.get_full_profile()
        
        # If no follow-up, get next standard question
        if not followup_question:
            current_index = self._get_current_question(assessment)
            next_index = current_index + 1
            questions = self._get_assessment_questions()
            
            if next_index < len(questions):
                next_question = questions[next_index]
                response["next_standard_question"] = next_question
                response["question_number"] = next_index + 1
                response["total_questions"] = len(questions)
                
                # Add contextual message before next question
                contextual_msg = get_contextual_message(
                    next_question.get("id", ""),
                    assessment.career_interests or {},
                    next_index + 1,
                    len(questions)
                )
                if contextual_msg:
                    response["contextual_message"] = contextual_msg
                
                # Add encouragement message
                encouragement = get_encouragement_message(
                    next_index + 1,
                    len(questions)
                )
                if encouragement:
                    response["encouragement_message"] = encouragement
                
                # Add answer acknowledgment if applicable
                acknowledgment = get_answer_acknowledgment(
                    question_id,
                    answer,
                    assessment.career_interests or {}
                )
                if acknowledgment:
                    response["answer_acknowledgment"] = acknowledgment
            else:
                response["assessment_complete"] = True
        
        return response
    
    def _get_current_question_index(self, assessment: Assessment) -> int:
        """Get the current question index"""
        if not assessment.career_interests:
            return 0
        return len(assessment.career_interests)