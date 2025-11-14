from typing import Dict, List, Any, Optional
from sqlalchemy.orm import Session
from app.models.assessment import Assessment, UserSkill, LearningResource, LearningPath
from app.models.job import Job
from datetime import datetime, timedelta
import json

class CareerIntelligenceService:
    """AI-powered career intelligence and enhancement service"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def generate_skill_trajectory_predictions(self, user_id: int) -> Dict[str, Any]:
        """Generate 5-year career trajectory predictions based on current skills"""
        user_skills = self.db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
        
        # Mock market data (in production, this would come from real market APIs)
        market_trends = {
            "AI/ML": {"growth_rate": 0.35, "demand": 95, "salary_premium": 25000},
            "Cloud/DevOps": {"growth_rate": 0.28, "demand": 88, "salary_premium": 18000},
            "Frontend": {"growth_rate": 0.15, "demand": 82, "salary_premium": 8000},
            "Backend": {"growth_rate": 0.12, "demand": 78, "salary_premium": 7000},
            "Data Science": {"growth_rate": 0.32, "demand": 92, "salary_premium": 22000},
            "Cybersecurity": {"growth_rate": 0.41, "demand": 96, "salary_premium": 28000}
        }
        
        predictions = {}
        current_year = datetime.now().year
        
        for skill in user_skills:
            skill_category = self._categorize_skill(skill.skill_name)
            trend = market_trends.get(skill_category, {"growth_rate": 0.1, "demand": 50, "salary_premium": 5000})
            
            # Calculate future value based on market trends and skill decay
            skill_trajectory = []
            current_value = skill.proficiency_level in ["Advanced", "Expert"]
            
            for year in range(5):
                year_offset = year + 1
                # Skills compound in value when combined with complementary skills
                synergy_bonus = self._calculate_skill_synergy_bonus(skill.skill_name, user_skills)
                year_value = current_value * (1 + trend["growth_rate"] + synergy_bonus) ** year_offset
                year_demand = min(100, trend["demand"] * (1 + year_offset * 0.05))
                
                skill_trajectory.append({
                    "year": current_year + year_offset,
                    "market_value": min(100, year_value * 100),
                    "demand_score": min(100, year_demand),
                    "salary_impact": trend["salary_premium"] * year_offset,
                    "automation_risk": self._calculate_automation_risk(skill.skill_name, year_offset)
                })
            
            predictions[skill.skill_name] = {
                "current_level": skill.proficiency_level,
                "category": skill_category,
                "trajectory": skill_trajectory,
                "recommendations": self._generate_skill_recommendations(skill, trend)
            }
        
        return predictions
    
    def calculate_market_readiness_score(self, user_id: int) -> int:
        """Calculate overall market readiness score (0-100)"""
        assessment = self.db.query(Assessment).filter(Assessment.user_id == user_id).first()
        if not assessment:
            return 0
        
        user_skills = self.db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
        
        # Base score from skills and experience
        skill_score = min(40, len([s for s in user_skills if s.proficiency_level in ["Advanced", "Expert"]]) * 10)
        career_interests = assessment.career_interests or {}
        experience_level = assessment.experience_level or career_interests.get("experience_level", "Entry Level (0-2 years)")
        experience_score = self._experience_level_to_score(experience_level)
        
        # Market alignment bonus
        market_alignment = self._calculate_market_alignment(user_skills)
        
        # Learning velocity bonus
        learning_bonus = min(20, assessment.learning_velocity or 0 * 2)
        
        total_score = skill_score + experience_score + market_alignment + learning_bonus
        return min(100, total_score)
    
    def generate_micro_learning_recommendations(self, user_id: int) -> List[Dict[str, Any]]:
        """Generate 15-30 minute micro-learning sessions"""
        user_skills = self.db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
        skill_gaps = self._identify_critical_skill_gaps(user_skills)
        
        micro_sessions = []
        
        for skill_gap in skill_gaps[:3]:  # Top 3 priority gaps
            # Find resources with micro-learning segments
            resources = self.db.query(LearningResource).filter(
                LearningResource.skill_name == skill_gap,
                LearningResource.micro_learning_segments.isnot(None)
            ).all()
            
            for resource in resources[:2]:  # Top 2 resources per skill
                segments = resource.micro_learning_segments or []
                for segment in segments[:3]:  # Top 3 segments per resource
                    micro_sessions.append({
                        "skill": skill_gap,
                        "title": segment.get("title", f"Learn {skill_gap}"),
                        "duration_minutes": segment.get("duration", 20),
                        "format": segment.get("format", "interactive"),
                        "difficulty": segment.get("difficulty", "beginner"),
                        "resource_id": resource.id,
                        "segment_id": segment.get("id"),
                        "prerequisites_met": self._check_prerequisites(segment.get("prerequisites", []), user_skills),
                        "estimated_completion": datetime.now() + timedelta(minutes=segment.get("duration", 20))
                    })
        
        return sorted(micro_sessions, key=lambda x: (x["prerequisites_met"], -x["duration_minutes"]))
    
    def analyze_cultural_fit(self, user_id: int, job_id: int) -> Dict[str, Any]:
        """Analyze cultural fit between user and company"""
        assessment = self.db.query(Assessment).filter(Assessment.user_id == user_id).first()
        job = self.db.query(Job).filter(Job.id == job_id).first()
        
        if not assessment or not job:
            return {"error": "User assessment or job not found"}
        
        # Extract user preferences from assessment
        user_preferences = {
            "work_style": self._extract_work_style(assessment.career_interests or {}),
            "environment": self._extract_environment_preference(assessment.learning_preferences or {}),
            "growth_focus": self._extract_growth_focus(assessment.career_goals or ""),
            "team_preference": self._extract_team_preference(assessment.career_interests or {})
        }
        
        # Analyze job description for cultural indicators
        job_culture = self._analyze_job_culture(job.description or "")
        
        # Calculate compatibility scores
        compatibility_scores = {}
        for aspect, user_pref in user_preferences.items():
            job_aspect = job_culture.get(aspect, {})
            if user_pref and job_aspect:
                compatibility_scores[aspect] = self._calculate_cultural_compatibility(user_pref, job_aspect)
        
        # Generate insights and recommendations
        overall_score = sum(compatibility_scores.values()) / len(compatibility_scores) if compatibility_scores else 50
        
        return {
            "overall_compatibility": round(overall_score, 1),
            "aspect_scores": compatibility_scores,
            "strengths": self._identify_cultural_strengths(compatibility_scores),
            "potential_challenges": self._identify_cultural_challenges(compatibility_scores),
            "recommendations": self._generate_cultural_recommendations(compatibility_scores, job_culture),
            "similar_companies": self._find_similar_cultural_companies(job_culture)
        }
    
    def generate_salary_negotiation_intelligence(self, user_id: int, job_id: int) -> Dict[str, Any]:
        """Generate data-backed salary negotiation strategies"""
        user_skills = self.db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
        assessment = self.db.query(Assessment).filter(Assessment.user_id == user_id).first()
        job = self.db.query(Job).filter(Job.id == job_id).first()
        
        if not assessment or not job:
            return {"error": "Data not available"}
        
        # Calculate user's market value
        user_market_value = self._calculate_user_market_value(user_skills, assessment)
        
        # Extract job salary range
        job_salary_range = self._parse_salary_range(job.salary_range or "")
        
        # Market analysis for this role
        market_analysis = self._get_job_market_analysis(job.title, job.location)
        
        # Negotiation strategy based on user's leverage
        negotiation_leverage = self._calculate_negotiation_leverage(user_skills, assessment, job)
        
        return {
            "user_market_value": user_market_value,
            "job_salary_range": job_salary_range,
            "market_analysis": market_analysis,
            "negotiation_leverage": negotiation_leverage,
            "recommended_strategy": self._generate_negotiation_strategy(negotiation_leverage),
            "talking_points": self._generate_negotiation_talking_points(user_skills, job),
            "alternative_compensation": self._suggest_alternative_compensation(job),
            "success_probability": negotiation_leverage.get("success_probability", 50)
        }
    
    def _categorize_skill(self, skill_name: str) -> str:
        """Categorize skills into market segments"""
        ai_ml_skills = ["Python", "TensorFlow", "PyTorch", "Machine Learning", "AI", "Data Science"]
        cloud_devops_skills = ["AWS", "Azure", "Docker", "Kubernetes", "DevOps", "CI/CD"]
        frontend_skills = ["React", "Vue", "Angular", "JavaScript", "TypeScript", "HTML", "CSS"]
        backend_skills = ["Node.js", "Python", "Java", "C#", "Go", "Ruby", "PHP"]
        data_skills = ["SQL", "MongoDB", "PostgreSQL", "Redis", "Data Analysis", "Big Data"]
        security_skills = ["Cybersecurity", "Security", "Encryption", "Penetration Testing"]
        
        skill_lower = skill_name.lower()
        if any(skill.lower() in skill_lower for skill in ai_ml_skills):
            return "AI/ML"
        elif any(skill.lower() in skill_lower for skill in cloud_devops_skills):
            return "Cloud/DevOps"
        elif any(skill.lower() in skill_lower for skill in frontend_skills):
            return "Frontend"
        elif any(skill.lower() in skill_lower for skill in backend_skills):
            return "Backend"
        elif any(skill.lower() in skill_lower for skill in data_skills):
            return "Data Science"
        elif any(skill.lower() in skill_lower for skill in security_skills):
            return "Cybersecurity"
        else:
            return "General"
    
    def _calculate_skill_synergy_bonus(self, skill_name: str, all_skills: List[UserSkill]) -> float:
        """Calculate bonus for complementary skills"""
        synergies = {
            "React": ["JavaScript", "TypeScript", "HTML", "CSS"],
            "Python": ["Machine Learning", "Data Science", "Django", "Flask"],
            "AWS": ["Docker", "Kubernetes", "DevOps"],
            "Docker": ["Kubernetes", "DevOps", "CI/CD"]
        }
        
        user_skill_names = [s.skill_name for s in all_skills]
        complementary_skills = synergies.get(skill_name, [])
        
        synergy_count = len([skill for skill in complementary_skills if skill in user_skill_names])
        return min(0.3, synergy_count * 0.1)  # Max 30% bonus
    
    def _calculate_automation_risk(self, skill_name: str, years_ahead: int) -> float:
        """Calculate automation risk for a skill"""
        risk_factors = {
            "Manual Testing": 0.8,
            "Basic HTML/CSS": 0.3,
            "Data Entry": 0.9,
            "React": 0.1,
            "Machine Learning": 0.05,
            "Cloud Architecture": 0.1,
            "Cybersecurity": 0.05
        }
        
        base_risk = risk_factors.get(skill_name, 0.2)
        # Risk increases over time for routine skills
        time_factor = 1 + (years_ahead * 0.1)
        return min(0.95, base_risk * time_factor)
    
    def _generate_skill_recommendations(self, skill: UserSkill, market_trend: Dict) -> List[str]:
        """Generate personalized skill recommendations"""
        recommendations = []
        
        if skill.proficiency_level in ["Beginner", "Intermediate"]:
            recommendations.append(f"Focus on advancing {skill.skill_name} - {market_trend['growth_rate']*100:.0f}% market growth")
        
        if market_trend["demand"] > 85:
            recommendations.append(f"{skill.skill_name} is in high demand - prioritize mastery")
        
        if market_trend["salary_premium"] > 15000:
            recommendations.append(f"{skill.skill_name} offers significant salary premium - worth investment")
        
        return recommendations
    
    def _experience_level_to_score(self, level: str) -> int:
        """Convert experience level to score"""
        level_scores = {
            "Entry Level (0-2 years)": 10,
            "Mid Level (2-5 years)": 20,
            "Senior Level (5+ years)": 30,
            "Lead/Principal Level": 35
        }
        return level_scores.get(level, 10)
    
    def _calculate_market_alignment(self, user_skills: List[UserSkill]) -> int:
        """Calculate how well user skills align with market demand"""
        in_demand_skills = ["React", "Python", "AWS", "Machine Learning", "TypeScript", "Docker"]
        user_skill_names = [s.skill_name for s in user_skills]
        
        aligned_skills = len([skill for skill in in_demand_skills if skill in user_skill_names])
        return min(20, aligned_skills * 4)
    
    def _identify_critical_skill_gaps(self, user_skills: List[UserSkill]) -> List[str]:
        """Identify most critical skill gaps based on market demand"""
        all_skills = [s.skill_name for s in user_skills]
        critical_skills = ["React", "TypeScript", "AWS", "Python", "Machine Learning", "Docker"]
        
        gaps = [skill for skill in critical_skills if skill not in all_skills]
        return gaps[:5]  # Top 5 critical gaps
    
    def _check_prerequisites(self, prerequisites: List[str], user_skills: List[UserSkill]) -> bool:
        """Check if user meets prerequisites for learning segment"""
        user_skill_names = [s.skill_name for s in user_skills]
        return all(prereq in user_skill_names for prereq in prerequisites)
    
    def _extract_work_style(self, career_interests: Dict) -> str:
        """Extract work style preferences from assessment"""
        interests = career_interests.get("career_interests", [])
        if any("Frontend" in interest for interest in interests):
            return "creative_visual"
        elif any("Backend" in interest for interest in interests):
            return "analytical_systematic"
        elif any("DevOps" in interest for interest in interests):
            return "process_oriented"
        else:
            return "balanced"
    
    def _extract_environment_preference(self, learning_preferences: Dict) -> str:
        """Extract work environment preferences"""
        preferences = learning_preferences.get("preferences", [])
        if "Online Courses" in preferences:
            return "remote_flexible"
        elif "Local Classes" in preferences:
            return "collaborative_structured"
        else:
            return "adaptive"
    
    def _extract_growth_focus(self, career_goals: str) -> str:
        """Extract growth focus from career goals"""
        goals_lower = career_goals.lower()
        if "lead" in goals_lower or "manage" in goals_lower:
            return "leadership"
        elif "expert" in goals_lower or "specialist" in goals_lower:
            return "technical_mastery"
        else:
            return "general_growth"
    
    def _extract_team_preference(self, career_interests: Dict) -> str:
        """Extract team size preference"""
        interests = career_interests.get("career_interests", [])
        if "Product Manager" in interests:
            return "large_collaborative"
        elif any("Developer" in interest for interest in interests):
            return "small_agile"
        else:
            return "flexible"
    
    def _analyze_job_culture(self, job_description: str) -> Dict[str, Any]:
        """Analyze company culture from job description"""
        description_lower = job_description.lower()
        
        culture_indicators = {
            "work_style": {
                "fast_paced": ["fast-paced", "dynamic", "rapidly", "quickly"],
                "structured": ["process", "methodology", "established", "formal"],
                "innovative": ["innovative", "cutting-edge", "creative", "disrupt"]
            },
            "environment": {
                "remote_friendly": ["remote", "flexible", "work from home"],
                "collaborative": ["team", "collaborative", "together"],
                "independent": ["autonomous", "self-motivated", "independent"]
            },
            "growth_focus": {
                "leadership": ["lead", "manage", "mentor", "guide"],
                "technical_mastery": ["expert", "specialist", "deep", "advanced"],
                "general_growth": ["learn", "develop", "grow", "training"]
            },
            "team_preference": {
                "large_collaborative": ["large team", "multiple teams", "cross-functional"],
                "small_agile": ["small team", "startup", "agile"],
                "flexible": ["team", "group"]  # Generic
            }
        }
        
        culture_analysis = {}
        for aspect, indicators in culture_indicators.items():
            scores = {}
            for style, keywords in indicators.items():
                score = sum(1 for keyword in keywords if keyword in description_lower)
                if score > 0:
                    scores[style] = score
            
            culture_analysis[aspect] = max(scores.items(), key=lambda x: x[1])[0] if scores else "balanced"
        
        return culture_analysis
    
    def _calculate_cultural_compatibility(self, user_preference: str, job_culture: Dict) -> float:
        """Calculate compatibility score for a cultural aspect"""
        compatibility_matrix = {
            ("creative_visual", "innovative"): 0.9,
            ("creative_visual", "structured"): 0.4,
            ("analytical_systematic", "structured"): 0.9,
            ("analytical_systematic", "fast_paced"): 0.6,
            ("process_oriented", "structured"): 0.9,
            ("remote_flexible", "remote_friendly"): 0.9,
            ("collaborative_structured", "collaborative"): 0.9,
            ("leadership", "leadership"): 0.9,
            ("technical_mastery", "technical_mastery"): 0.9,
            ("large_collaborative", "large_collaborative"): 0.9,
            ("small_agile", "small_agile"): 0.9
        }
        
        job_style = job_culture.get("style", "balanced")
        return compatibility_matrix.get((user_preference, job_style), 0.5)
    
    def _identify_cultural_strengths(self, scores: Dict[str, float]) -> List[str]:
        """Identify cultural compatibility strengths"""
        strengths = []
        for aspect, score in scores.items():
            if score >= 0.8:
                strengths.append(f"Strong alignment in {aspect}")
        return strengths
    
    def _identify_cultural_challenges(self, scores: Dict[str, float]) -> List[str]:
        """Identify potential cultural challenges"""
        challenges = []
        for aspect, score in scores.items():
            if score <= 0.4:
                challenges.append(f"Potential mismatch in {aspect}")
        return challenges
    
    def _generate_cultural_recommendations(self, scores: Dict[str, float], job_culture: Dict) -> List[str]:
        """Generate cultural fit recommendations"""
        recommendations = []
        for aspect, score in scores.items():
            if score < 0.6:
                job_style = job_culture.get(aspect, "balanced")
                recommendations.append(f"Consider discussing {aspect} expectations - company tends toward {job_style}")
        return recommendations
    
    def _find_similar_cultural_companies(self, job_culture: Dict) -> List[str]:
        """Find companies with similar cultural profiles"""
        # Mock data - in production, this would query a real database
        similar_companies = {
            "innovative_remote": ["GitLab", "Automattic", "Mozilla"],
            "structured_collaborative": ["Google", "Microsoft", "IBM"],
            "fast_paced_agile": ["Stripe", "Square", "Twilio"],
            "process_oriented": ["Oracle", "SAP", "IBM"]
        }
        
        # Simplified matching logic
        if job_culture.get("environment") == "remote_friendly" and job_culture.get("work_style") == "innovative":
            return similar_companies["innovative_remote"]
        elif job_culture.get("environment") == "collaborative" and job_culture.get("work_style") == "structured":
            return similar_companies["structured_collaborative"]
        elif job_culture.get("work_style") == "fast_paced":
            return similar_companies["fast_paced_agile"]
        elif job_culture.get("work_style") == "structured":
            return similar_companies["process_oriented"]
        else:
            return ["Varies by team and role"]
    
    def _calculate_user_market_value(self, user_skills: List[UserSkill], assessment: Assessment) -> int:
        """Calculate user's market value based on skills and experience"""
        base_salary = 60000  # Entry level base
        
        # Skill premium
        skill_premium = sum(self._get_skill_market_value(s.skill_name) for s in user_skills)
        
        # Experience premium
        experience_premium = self._experience_level_to_score(assessment.experience_level or "Entry Level") * 1000
        
        return base_salary + skill_premium + experience_premium
    
    def _get_skill_market_value(self, skill_name: str) -> int:
        """Get market value for a specific skill"""
        skill_values = {
            "React": 8000,
            "Python": 10000,
            "AWS": 12000,
            "Machine Learning": 15000,
            "TypeScript": 7000,
            "Docker": 9000,
            "Kubernetes": 11000,
            "JavaScript": 5000,
            "Node.js": 7000,
            "SQL": 4000
        }
        return skill_values.get(skill_name, 2000)
    
    def _parse_salary_range(self, salary_range: str) -> Dict[str, int]:
        """Parse salary range string"""
        if not salary_range:
            return {"min": 0, "max": 0}
        
        import re
        numbers = re.findall(r'\d+', salary_range.replace('k', '000'))
        if len(numbers) >= 2:
            return {"min": int(numbers[0]), "max": int(numbers[1])}
        elif len(numbers) == 1:
            return {"min": int(numbers[0]), "max": int(numbers[0])}
        else:
            return {"min": 0, "max": 0}
    
    def _get_job_market_analysis(self, job_title: str, location: str) -> Dict[str, Any]:
        """Get market analysis for a specific job"""
        # Mock market data
        return {
            "market_demand": 85,
            "average_salary": 95000,
            "competition_level": "medium",
            "growth_rate": 0.15,
            "location_adjustment": 1.2 if "Remote" in location else 1.0
        }
    
    def _calculate_negotiation_leverage(self, user_skills: List[UserSkill], assessment: Assessment, job: Job) -> Dict[str, Any]:
        """Calculate user's negotiation leverage"""
        # Calculate skill match
        required_skills_match = 0.8  # Mock calculation
        
        # Calculate experience level match
        experience_match = 0.7  # Mock calculation
        
        # Calculate market demand for user's skills
        market_demand = 0.9  # Mock calculation
        
        leverage_score = (required_skills_match + experience_match + market_demand) / 3
        
        return {
            "leverage_score": leverage_score,
            "success_probability": min(90, leverage_score * 100),
            "key_strengths": ["Strong technical skills", "Relevant experience", "High market demand"],
            "potential_concerns": ["Limited negotiation history", "Company budget constraints"]
        }
    
    def _generate_negotiation_strategy(self, leverage: Dict[str, Any]) -> str:
        """Generate negotiation strategy based on leverage"""
        score = leverage.get("leverage_score", 0.5)
        
        if score >= 0.8:
            return "aggressive - aim for top of range plus additional benefits"
        elif score >= 0.6:
            return "moderate - target midpoint with strong arguments for higher"
        elif score >= 0.4:
            return "conservative - focus on base salary with potential for review"
        else:
            return "defensive - prioritize offer acceptance with future growth discussion"
    
    def _generate_negotiation_talking_points(self, user_skills: List[UserSkill], job: Job) -> List[str]:
        """Generate specific talking points for negotiation"""
        points = [
            f"Strong alignment with required technical skills",
            f"Proven ability to deliver results in similar environments",
            f"Market research shows competitive rates for this role"
        ]
        
        # Add skill-specific points
        high_value_skills = [s for s in user_skills if s.skill_name in ["React", "Python", "AWS", "Machine Learning"]]
        for skill in high_value_skills:
            points.append(f"Expertise in {skill.skill_name} adds significant value to team")
        
        return points[:5]  # Top 5 points
    
    def _suggest_alternative_compensation(self, job: Job) -> List[str]:
        """Suggest alternative compensation options"""
        return [
            "Performance bonuses tied to project milestones",
            "Additional vacation days or flexible work arrangements",
            "Professional development budget and training opportunities",
            "Equity or stock options (if available)",
            "Remote work stipend and home office budget"
        ]
    
    def calculate_promotion_probability(self, user_id: int, target_role: str = None) -> Dict[str, Any]:
        """Calculate promotion probability based on skills, performance, and market conditions"""
        assessment = self.db.query(Assessment).filter(Assessment.user_id == user_id).first()
        if not assessment:
            return {"error": "Assessment not found"}
        
        user_skills = self.db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
        learning_paths = self.db.query(LearningPath).filter(LearningPath.user_id == user_id).all()
        job_matches = self.db.query(JobMatch).filter(JobMatch.user_id == user_id).all()
        
        # Calculate base score from skills
        advanced_skills = [s for s in user_skills if s.proficiency_level in ["Advanced", "Expert"]]
        skill_score = min(30, len(advanced_skills) * 3)
        
        # Calculate experience score
        career_interests = assessment.career_interests or {}
        experience_level = assessment.experience_level or career_interests.get("experience_level", "Entry Level (0-2 years)")
        experience_score = self._experience_level_to_score(experience_level)
        
        # Calculate learning velocity score
        learning_paths_completed = len([p for p in learning_paths if p.status == "completed"])
        learning_score = min(20, learning_paths_completed * 5)
        
        # Calculate market alignment score
        market_alignment = self._calculate_market_alignment(user_skills)
        
        # Calculate performance score (based on job match scores)
        if job_matches:
            avg_match_score = sum(m.match_score for m in job_matches) / len(job_matches)
            performance_score = min(20, avg_match_score / 5)
        else:
            performance_score = 10
        
        # Calculate base promotion probability
        base_probability = skill_score + experience_score + learning_score + market_alignment + performance_score
        base_probability = min(95, max(20, base_probability))
        
        # Adjust for target role if specified
        role_adjustment = 0
        if target_role:
            # Check if user has skills for target role
            target_role_skills = self._get_skills_for_role(target_role)
            user_skill_names = [s.skill_name for s in user_skills]
            matching_skills = len([s for s in target_role_skills if s in user_skill_names])
            role_adjustment = (matching_skills / len(target_role_skills)) * 10 if target_role_skills else 0
        
        promotion_probability = min(95, base_probability + role_adjustment)
        
        # Calculate time to promotion
        time_to_promotion = self._calculate_time_to_promotion(base_probability, experience_level)
        
        # Identify key factors
        key_factors = self._identify_promotion_factors(
            skill_score, experience_score, learning_score, market_alignment, performance_score
        )
        
        # Identify blockers
        blockers = self._identify_promotion_blockers(user_skills, assessment, learning_paths)
        
        # Generate recommendations
        recommendations = self._generate_promotion_recommendations(
            blockers, key_factors, promotion_probability
        )
        
        return {
            "promotion_probability": round(promotion_probability, 1),
            "base_probability": round(base_probability, 1),
            "role_adjustment": round(role_adjustment, 1),
            "time_to_promotion": time_to_promotion,
            "key_factors": key_factors,
            "blockers": blockers,
            "recommendations": recommendations,
            "score_breakdown": {
                "skill_score": skill_score,
                "experience_score": experience_score,
                "learning_score": learning_score,
                "market_alignment": market_alignment,
                "performance_score": performance_score
            },
            "target_role": target_role,
            "confidence_level": "high" if promotion_probability > 70 else "medium" if promotion_probability > 50 else "low"
        }
    
    def calculate_job_security_signals(self, user_id: int) -> Dict[str, Any]:
        """Calculate job security signals based on skills, market demand, and industry trends"""
        assessment = self.db.query(Assessment).filter(Assessment.user_id == user_id).first()
        if not assessment:
            return {"error": "Assessment not found"}
        
        user_skills = self.db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
        
        # Calculate automation risk
        automation_risk = self._calculate_overall_automation_risk(user_skills)
        
        # Calculate market demand for skills
        market_demand_score = self._calculate_market_demand_score(user_skills)
        
        # Calculate skill obsolescence risk
        obsolescence_risk = self._calculate_skill_obsolescence_risk(user_skills)
        
        # Calculate industry stability
        industry_stability = self._calculate_industry_stability(assessment)
        
        # Calculate overall security score
        security_score = (
            (100 - automation_risk) * 0.3 +
            market_demand_score * 0.3 +
            (100 - obsolescence_risk) * 0.2 +
            industry_stability * 0.2
        )
        security_score = min(100, max(0, security_score))
        
        # Identify risk factors
        risk_factors = self._identify_security_risk_factors(
            automation_risk, market_demand_score, obsolescence_risk, industry_stability
        )
        
        # Identify security strengths
        security_strengths = self._identify_security_strengths(
            automation_risk, market_demand_score, obsolescence_risk, industry_stability
        )
        
        # Generate recommendations
        recommendations = self._generate_security_recommendations(risk_factors, security_score)
        
        # Calculate risk timeline
        risk_timeline = self._calculate_risk_timeline(automation_risk, obsolescence_risk)
        
        return {
            "security_score": round(security_score, 1),
            "automation_risk": round(automation_risk, 1),
            "market_demand_score": round(market_demand_score, 1),
            "obsolescence_risk": round(obsolescence_risk, 1),
            "industry_stability": round(industry_stability, 1),
            "risk_factors": risk_factors,
            "security_strengths": security_strengths,
            "recommendations": recommendations,
            "risk_timeline": risk_timeline,
            "security_level": "high" if security_score > 70 else "medium" if security_score > 50 else "low"
        }
    
    def calculate_pivot_readiness(self, user_id: int, target_roles: List[str] = None) -> Dict[str, Any]:
        """Calculate readiness to pivot to new roles or industries"""
        assessment = self.db.query(Assessment).filter(Assessment.user_id == user_id).first()
        if not assessment:
            return {"error": "Assessment not found"}
        
        user_skills = self.db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
        learning_paths = self.db.query(LearningPath).filter(LearningPath.user_id == user_id).all()
        
        # Get user's current role/category
        current_category = self._determine_current_category(user_skills, assessment)
        
        # If no target roles specified, suggest likely pivots
        if not target_roles:
            target_roles = self._suggest_pivot_targets(current_category, user_skills)
        
        # Calculate pivot readiness for each target role
        pivot_analyses = []
        for target_role in target_roles:
            pivot_analysis = self._analyze_pivot_to_role(
                user_skills, current_category, target_role, learning_paths
            )
            pivot_analyses.append(pivot_analysis)
        
        # Sort by readiness score
        pivot_analyses.sort(key=lambda x: x["readiness_score"], reverse=True)
        
        # Calculate overall pivot readiness
        overall_readiness = sum(a["readiness_score"] for a in pivot_analyses) / len(pivot_analyses) if pivot_analyses else 0
        
        # Identify transferable skills
        transferable_skills = self._identify_transferable_skills(user_skills, target_roles)
        
        # Identify skill gaps for pivot
        skill_gaps_for_pivot = self._identify_pivot_skill_gaps(user_skills, target_roles)
        
        # Calculate time to pivot
        time_to_pivot = self._calculate_time_to_pivot(skill_gaps_for_pivot, learning_paths)
        
        # Generate pivot strategy
        pivot_strategy = self._generate_pivot_strategy(
            transferable_skills, skill_gaps_for_pivot, overall_readiness
        )
        
        return {
            "overall_readiness": round(overall_readiness, 1),
            "current_category": current_category,
            "target_roles": target_roles,
            "pivot_analyses": pivot_analyses[:5],  # Top 5 pivots
            "transferable_skills": transferable_skills,
            "skill_gaps": skill_gaps_for_pivot[:10],  # Top 10 gaps
            "time_to_pivot": time_to_pivot,
            "pivot_strategy": pivot_strategy,
            "readiness_level": "high" if overall_readiness > 70 else "medium" if overall_readiness > 50 else "low"
        }
    
    def _get_skills_for_role(self, role: str) -> List[str]:
        """Get required skills for a specific role"""
        role_skills_map = {
            "Senior Developer": ["React", "TypeScript", "Node.js", "AWS", "Docker"],
            "Tech Lead": ["Leadership", "Architecture", "System Design", "AWS", "Kubernetes"],
            "Engineering Manager": ["Leadership", "Project Management", "Agile", "System Design"],
            "Product Manager": ["Product Strategy", "User Research", "Data Analysis", "Agile"],
            "Data Scientist": ["Python", "Machine Learning", "SQL", "Statistics", "Data Analysis"],
            "DevOps Engineer": ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
            "Full Stack Developer": ["React", "Node.js", "Python", "SQL", "AWS"],
            "Frontend Lead": ["React", "TypeScript", "Next.js", "System Design", "Leadership"],
            "Backend Lead": ["Python", "Node.js", "AWS", "System Design", "Leadership"],
        }
        return role_skills_map.get(role, [])
    
    def _calculate_time_to_promotion(self, probability: float, experience_level: str) -> str:
        """Calculate estimated time to promotion"""
        if probability > 80:
            return "3-6 months"
        elif probability > 60:
            return "6-12 months"
        elif probability > 40:
            return "12-18 months"
        else:
            return "18-24 months"
    
    def _identify_promotion_factors(self, skill_score: int, experience_score: int, learning_score: int, market_alignment: int, performance_score: int) -> List[str]:
        """Identify key factors affecting promotion probability"""
        factors = []
        if skill_score > 20:
            factors.append("Strong technical skills portfolio")
        if experience_score > 15:
            factors.append("Relevant experience level")
        if learning_score > 10:
            factors.append("Active learning and skill development")
        if market_alignment > 10:
            factors.append("Skills aligned with market demand")
        if performance_score > 15:
            factors.append("Strong job match performance")
        return factors[:5]
    
    def _identify_promotion_blockers(self, user_skills: List[UserSkill], assessment: Assessment, learning_paths: List[LearningPath]) -> List[str]:
        """Identify blockers to promotion"""
        blockers = []
        
        # Check for skill gaps
        advanced_skills = [s for s in user_skills if s.proficiency_level in ["Advanced", "Expert"]]
        if len(advanced_skills) < 3:
            blockers.append("Limited advanced skills - need 3+ expert-level skills")
        
        # Check for learning velocity
        completed_paths = len([p for p in learning_paths if p.status == "completed"])
        if completed_paths < 1:
            blockers.append("No completed learning paths - demonstrate commitment to growth")
        
        # Check for leadership skills
        leadership_skills = [s for s in user_skills if "leadership" in s.skill_name.lower() or "management" in s.skill_name.lower()]
        if not leadership_skills:
            blockers.append("Missing leadership/management skills for senior roles")
        
        return blockers[:5]
    
    def _generate_promotion_recommendations(self, blockers: List[str], key_factors: List[str], probability: float) -> List[str]:
        """Generate recommendations to improve promotion probability"""
        recommendations = []
        
        if probability < 50:
            recommendations.append("Focus on building advanced skills in your current domain")
            recommendations.append("Complete at least 2-3 learning paths to demonstrate growth")
        
        if "leadership" in str(blockers).lower():
            recommendations.append("Develop leadership skills through mentorship or team lead opportunities")
        
        if probability < 70:
            recommendations.append("Seek out stretch assignments to demonstrate capability")
            recommendations.append("Build cross-functional collaboration skills")
        
        return recommendations[:5]
    
    def _calculate_overall_automation_risk(self, user_skills: List[UserSkill]) -> float:
        """Calculate overall automation risk for user's skills"""
        if not user_skills:
            return 50.0
        
        risk_factors = {
            "Manual Testing": 0.8,
            "Data Entry": 0.9,
            "Basic HTML/CSS": 0.3,
            "React": 0.1,
            "Python": 0.15,
            "Machine Learning": 0.05,
            "AWS": 0.1,
            "Docker": 0.12,
            "Kubernetes": 0.08,
            "TypeScript": 0.1,
            "Node.js": 0.12,
            "GraphQL": 0.1,
        }
        
        total_risk = 0
        for skill in user_skills:
            skill_risk = risk_factors.get(skill.skill_name, 0.2)
            # Weight by proficiency level
            if skill.proficiency_level in ["Advanced", "Expert"]:
                skill_risk *= 0.7  # Advanced skills have lower automation risk
            total_risk += skill_risk
        
        avg_risk = (total_risk / len(user_skills)) * 100 if user_skills else 50
        return min(100, max(0, avg_risk))
    
    def _calculate_market_demand_score(self, user_skills: List[UserSkill]) -> float:
        """Calculate market demand score for user's skills"""
        in_demand_skills = ["React", "TypeScript", "Python", "AWS", "Docker", "Kubernetes", "Machine Learning", "Node.js"]
        user_skill_names = [s.skill_name for s in user_skills]
        matching_skills = len([s for s in in_demand_skills if s in user_skill_names])
        return (matching_skills / len(in_demand_skills)) * 100 if in_demand_skills else 0
    
    def _calculate_skill_obsolescence_risk(self, user_skills: List[UserSkill]) -> float:
        """Calculate risk of skills becoming obsolete"""
        obsolete_risk_factors = {
            "jQuery": 0.7,
            "AngularJS": 0.6,
            "PHP": 0.4,
            "Flash": 0.9,
            "React": 0.05,
            "TypeScript": 0.03,
            "Python": 0.05,
            "AWS": 0.03,
        }
        
        if not user_skills:
            return 30.0
        
        total_risk = 0
        for skill in user_skills:
            skill_risk = obsolete_risk_factors.get(skill.skill_name, 0.1)
            total_risk += skill_risk
        
        avg_risk = (total_risk / len(user_skills)) * 100 if user_skills else 30
        return min(100, max(0, avg_risk))
    
    def _calculate_industry_stability(self, assessment: Assessment) -> float:
        """Calculate industry stability based on career interests"""
        # Mock calculation - in production, would use real industry data
        stable_industries = ["Technology", "Healthcare", "Finance"]
        career_interests = assessment.career_interests or {}
        interests = career_interests.get("career_interests", [])
        
        # Check if interests align with stable industries
        stability_score = 75  # Base score
        if any("tech" in str(interest).lower() for interest in interests):
            stability_score = 85
        elif any("health" in str(interest).lower() or "finance" in str(interest).lower() for interest in interests):
            stability_score = 80
        
        return stability_score
    
    def _identify_security_risk_factors(self, automation_risk: float, market_demand: float, obsolescence_risk: float, industry_stability: float) -> List[str]:
        """Identify risk factors affecting job security"""
        risk_factors = []
        
        if automation_risk > 50:
            risk_factors.append(f"High automation risk ({automation_risk:.0f}%) - skills vulnerable to automation")
        if market_demand < 50:
            risk_factors.append("Low market demand for current skill set")
        if obsolescence_risk > 40:
            risk_factors.append(f"Skill obsolescence risk ({obsolescence_risk:.0f}%) - some skills becoming outdated")
        if industry_stability < 70:
            risk_factors.append("Industry volatility - consider diversifying")
        
        return risk_factors[:5]
    
    def _identify_security_strengths(self, automation_risk: float, market_demand: float, obsolescence_risk: float, industry_stability: float) -> List[str]:
        """Identify strengths contributing to job security"""
        strengths = []
        
        if automation_risk < 30:
            strengths.append("Low automation risk - skills are future-proof")
        if market_demand > 70:
            strengths.append("High market demand for your skill set")
        if obsolescence_risk < 20:
            strengths.append("Skills are modern and in-demand")
        if industry_stability > 80:
            strengths.append("Stable industry with strong growth prospects")
        
        return strengths[:5]
    
    def _generate_security_recommendations(self, risk_factors: List[str], security_score: float) -> List[str]:
        """Generate recommendations to improve job security"""
        recommendations = []
        
        if security_score < 60:
            recommendations.append("Diversify skill set to reduce automation risk")
            recommendations.append("Focus on learning high-demand, future-proof skills")
        
        if "automation" in str(risk_factors).lower():
            recommendations.append("Develop skills in areas less vulnerable to automation (AI, ML, architecture)")
        
        if "obsolescence" in str(risk_factors).lower():
            recommendations.append("Modernize skill set - learn current technologies and frameworks")
        
        recommendations.append("Build a strong professional network for career resilience")
        recommendations.append("Stay updated with industry trends and emerging technologies")
        
        return recommendations[:5]
    
    def _calculate_risk_timeline(self, automation_risk: float, obsolescence_risk: float) -> Dict[str, str]:
        """Calculate risk timeline for job security threats"""
        avg_risk = (automation_risk + obsolescence_risk) / 2
        
        if avg_risk > 60:
            return {
                "short_term": "3-6 months",
                "medium_term": "6-12 months",
                "long_term": "12-24 months"
            }
        elif avg_risk > 40:
            return {
                "short_term": "6-12 months",
                "medium_term": "12-24 months",
                "long_term": "24-36 months"
            }
        else:
            return {
                "short_term": "12-24 months",
                "medium_term": "24-36 months",
                "long_term": "36+ months"
            }
    
    def _determine_current_category(self, user_skills: List[UserSkill], assessment: Assessment) -> str:
        """Determine user's current role category"""
        user_skill_names = [s.skill_name for s in user_skills]
        
        frontend_skills = ["React", "Vue", "Angular", "JavaScript", "TypeScript", "HTML", "CSS"]
        backend_skills = ["Python", "Node.js", "Java", "Go", "Ruby", "PHP"]
        devops_skills = ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"]
        data_skills = ["Python", "SQL", "MongoDB", "PostgreSQL", "Data Science", "Machine Learning"]
        
        frontend_count = len([s for s in user_skill_names if s in frontend_skills])
        backend_count = len([s for s in user_skill_names if s in backend_skills])
        devops_count = len([s for s in user_skill_names if s in devops_skills])
        data_count = len([s for s in user_skill_names if s in data_skills])
        
        counts = {
            "Frontend": frontend_count,
            "Backend": backend_count,
            "DevOps": devops_count,
            "Data": data_count
        }
        
        max_category = max(counts, key=counts.get)
        return max_category if counts[max_category] > 0 else "General"
    
    def _suggest_pivot_targets(self, current_category: str, user_skills: List[UserSkill]) -> List[str]:
        """Suggest target roles for pivot based on current category"""
        pivot_map = {
            "Frontend": ["Full Stack Developer", "Frontend Lead", "Product Manager", "UX Engineer"],
            "Backend": ["Full Stack Developer", "Backend Lead", "DevOps Engineer", "Tech Lead"],
            "DevOps": ["Platform Engineer", "SRE", "Tech Lead", "Engineering Manager"],
            "Data": ["Data Scientist", "ML Engineer", "Data Engineer", "Analytics Engineer"],
            "General": ["Full Stack Developer", "Product Manager", "Tech Lead", "Engineering Manager"]
        }
        return pivot_map.get(current_category, ["Full Stack Developer", "Tech Lead", "Product Manager"])
    
    def _analyze_pivot_to_role(self, user_skills: List[UserSkill], current_category: str, target_role: str, learning_paths: List[LearningPath]) -> Dict[str, Any]:
        """Analyze readiness to pivot to a specific role"""
        target_skills = self._get_skills_for_role(target_role)
        user_skill_names = [s.skill_name for s in user_skills]
        
        # Calculate skill overlap
        matching_skills = [s for s in target_skills if s in user_skill_names]
        skill_overlap = (len(matching_skills) / len(target_skills)) * 100 if target_skills else 0
        
        # Calculate learning velocity
        completed_paths = len([p for p in learning_paths if p.status == "completed"])
        learning_velocity_score = min(30, completed_paths * 10)
        
        # Calculate readiness score
        readiness_score = (skill_overlap * 0.7) + learning_velocity_score
        
        # Identify skill gaps
        skill_gaps = [s for s in target_skills if s not in user_skill_names]
        
        # Calculate time to pivot
        time_to_pivot = self._calculate_time_to_pivot_for_role(skill_gaps, completed_paths)
        
        # Calculate difficulty
        difficulty = "easy" if readiness_score > 70 else "medium" if readiness_score > 50 else "hard"
        
        return {
            "target_role": target_role,
            "readiness_score": round(readiness_score, 1),
            "skill_overlap": round(skill_overlap, 1),
            "matching_skills": matching_skills,
            "skill_gaps": skill_gaps[:5],
            "time_to_pivot": time_to_pivot,
            "difficulty": difficulty,
            "learning_velocity_score": learning_velocity_score
        }
    
    def _identify_transferable_skills(self, user_skills: List[UserSkill], target_roles: List[str]) -> List[str]:
        """Identify skills that transfer across roles"""
        transferable_skills = [
            "Problem Solving", "Communication", "Collaboration", "Project Management",
            "Agile", "System Design", "Architecture", "Leadership", "Mentorship"
        ]
        user_skill_names = [s.skill_name for s in user_skills]
        return [s for s in transferable_skills if s in user_skill_names]
    
    def _identify_pivot_skill_gaps(self, user_skills: List[UserSkill], target_roles: List[str]) -> List[Dict[str, Any]]:
        """Identify skill gaps for pivot to target roles"""
        user_skill_names = [s.skill_name for s in user_skills]
        all_target_skills = set()
        
        for role in target_roles:
            role_skills = self._get_skills_for_role(role)
            all_target_skills.update(role_skills)
        
        gaps = []
        for skill in all_target_skills:
            if skill not in user_skill_names:
                market_value = self._calculate_skill_market_value(skill, "General")
                gaps.append({
                    "skill": skill,
                    "market_value": market_value,
                    "priority": "high" if market_value > 80 else "medium" if market_value > 60 else "low"
                })
        
        gaps.sort(key=lambda x: x["market_value"], reverse=True)
        return gaps
    
    def _calculate_time_to_pivot(self, skill_gaps: List[Dict[str, Any]], learning_paths: List[LearningPath]) -> str:
        """Calculate estimated time to pivot"""
        if not skill_gaps:
            return "Ready now"
        
        critical_gaps = len([g for g in skill_gaps if g["priority"] == "high"])
        completed_paths = len([p for p in learning_paths if p.status == "completed"])
        
        if critical_gaps == 0:
            return "3-6 months"
        elif critical_gaps <= 2:
            return "6-12 months"
        elif critical_gaps <= 4:
            return "12-18 months"
        else:
            return "18-24 months"
    
    def _calculate_time_to_pivot_for_role(self, skill_gaps: List[str], completed_paths: int) -> str:
        """Calculate time to pivot for a specific role"""
        if not skill_gaps:
            return "Ready now"
        
        if len(skill_gaps) <= 2:
            return "3-6 months"
        elif len(skill_gaps) <= 4:
            return "6-12 months"
        else:
            return "12-18 months"
    
    def _generate_pivot_strategy(self, transferable_skills: List[str], skill_gaps: List[Dict[str, Any]], readiness: float) -> Dict[str, Any]:
        """Generate strategy for successful pivot"""
        strategy = {
            "leverage_transferable_skills": transferable_skills[:5],
            "focus_areas": [g["skill"] for g in skill_gaps[:3] if g["priority"] == "high"],
            "learning_path": "Build targeted learning paths for high-priority skill gaps",
            "networking": "Connect with professionals in target role for insights and opportunities",
            "timeline": "Plan 6-12 month transition with skill development milestones"
        }
        
        if readiness > 70:
            strategy["approach"] = "Aggressive - target immediate transition opportunities"
        elif readiness > 50:
            strategy["approach"] = "Gradual - build skills while maintaining current role"
        else:
            strategy["approach"] = "Long-term - focus on skill development before transition"
        
        return strategy
    
    def _calculate_skill_market_value(self, skill_name: str, category: str) -> int:
        """Calculate market value for a skill (0-100)"""
        high_value_skills = {
            "React": 95, "TypeScript": 92, "Python": 90, "AWS": 88, "Docker": 85,
            "Kubernetes": 87, "Machine Learning": 94, "TensorFlow": 91, "Node.js": 86,
            "Go": 84, "Rust": 83, "GraphQL": 82, "Next.js": 89, "Leadership": 85,
            "System Design": 90, "Architecture": 92, "Product Strategy": 88
        }
        return high_value_skills.get(skill_name, 70)