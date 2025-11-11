from typing import Dict, Any, Optional, List

def get_intelligent_followup_question(current_question_id: str, answer: Any, assessment_context: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Generate dynamic follow-up questions based on user answers"""
    
    if current_question_id == "career_interests" and isinstance(answer, list):
        # Follow up based on career interests
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
    
    elif current_question_id == "technical_skills" and isinstance(answer, dict):
        # Validate skill combinations and ask follow-ups
        skills_with_proficiency = {k: v for k, v in answer.items() if v and v != "None"}
        
        if "React" in skills_with_proficiency and skills_with_proficiency["React"] in ["Advanced", "Expert"]:
            if "Redux" not in skills_with_proficiency:
                return {
                    "id": "react_state_management",
                    "type": "single_choice",
                    "question": "You're solid with React! What about state management?",
                    "options": [
                        "Redux (classic choice)",
                        "Context API", 
                        "Zustand/Jotai (modern stuff)",
                        "State management is overrated"
                    ],
                    "required": True,
                    "followup_to": "technical_skills"
                }
        
        if "Python" in skills_with_proficiency and "Django" not in skills_with_proficiency and "Flask" not in skills_with_proficiency:
            return {
                "id": "python_web_frameworks",
                "type": "single_choice", 
                "question": "Python skills noted! Any web framework experience?",
                "options": [
                    "Django (batteries included)",
                    "Flask (minimalist)",
                    "FastAPI (modern async)",
                    "Just pure Python scripts"
                ],
                "required": True,
                "followup_to": "technical_skills"
            }
    
    elif current_question_id == "experience_level" and answer in ["Senior Level (5+ years)", "Lead/Principal Level"]:
        return {
            "id": "leadership_experience",
            "type": "multi_select",
            "question": "Experience like that deserves some leadership questions. What's your vibe?",
            "options": [
                "I've led teams directly",
                "I mentor junior devs",
                "I architect systems", 
                "I make the big decisions",
                "I just want to code in peace"
            ],
            "required": True,
            "followup_to": "experience_level"
        }
    
    return None

def validate_skill_combination(skills: Dict[str, str]) -> List[str]:
    """Validate skill combinations and provide insights"""
    insights = []
    skills_with_proficiency = {k: v for k, v in skills.items() if v and v != "None"}
    
    # Frontend stack analysis
    frontend_skills = ["React", "Vue.js", "Angular", "JavaScript", "TypeScript", "HTML", "CSS"]
    has_frontend = any(skill in skills_with_proficiency for skill in frontend_skills)
    
    if has_frontend:
        frontend_count = len([s for s in frontend_skills if s in skills_with_proficiency])
        if frontend_count >= 4:
            insights.append("Solid frontend foundation! You're basically a UI wizard.")
        elif "JavaScript" in skills_with_proficiency and "TypeScript" not in skills_with_proficiency:
            insights.append("JavaScript skills are solid! Have you considered TypeScript? Most companies expect it now.")
    
    # Backend stack analysis  
    backend_skills = ["Node.js", "Python", "Java", "C#", "Go", "Django", "Flask"]
    has_backend = any(skill in skills_with_proficiency for skill in backend_skills)
    
    if has_backend and has_frontend:
        insights.append("Full stack potential! Companies love developers who can do both.")
    
    # Cloud/DevOps analysis
    cloud_skills = ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"]
    cloud_count = len([s for s in cloud_skills if s in skills_with_proficiency])
    
    if cloud_count >= 2:
        insights.append("Cloud skills are in high demand! You're positioning yourself well.")
    elif cloud_count == 0:
        insights.append("Consider learning some cloud basics. Even basic AWS knowledge opens doors.")
    
    # Database analysis
    db_skills = ["SQL", "MongoDB", "PostgreSQL", "Redis"]
    if not any(skill in skills_with_proficiency for skill in db_skills):
        insights.append("Database skills are essential. Even basic SQL knowledge helps a lot.")
    
    return insights

def analyze_career_trajectory(assessment_data: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze user's career trajectory and provide insights"""
    analysis = {
        "trajectory_score": 0,
        "insights": [],
        "recommendations": [],
        "missing_skills": [],
        "growth_potential": "medium"
    }
    
    career_interests = assessment_data.get("career_interests", [])
    experience_level = assessment_data.get("experience_level", "")
    technical_skills = assessment_data.get("technical_skills", {})
    career_goals = assessment_data.get("career_goals", "").lower()
    
    # Calculate trajectory score based on alignment
    score = 0
    
    # Interest-Skill Alignment (30 points)
    if isinstance(career_interests, list) and isinstance(technical_skills, dict):
        skills_with_proficiency = {k: v for k, v in technical_skills.items() if v and v != "None"}
        
        if "Frontend Developer" in career_interests:
            frontend_skills = ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Vue.js", "Angular"]
            frontend_match = len([s for s in frontend_skills if s in skills_with_proficiency])
            score += min(30, frontend_match * 6)
        
        elif "Backend Developer" in career_interests:
            backend_skills = ["Node.js", "Python", "Django", "Flask", "Java", "C#", "Go"]
            backend_match = len([s for s in backend_skills if s in skills_with_proficiency])
            score += min(30, backend_match * 6)
        
        elif "Data Scientist" in career_interests:
            data_skills = ["Python", "SQL", "Machine Learning", "Deep Learning"]
            data_match = len([s for s in data_skills if s in skills_with_proficiency])
            score += min(30, data_match * 7.5)
    
    # Experience Level Alignment (20 points)
    experience_years = 0
    if "Entry Level" in experience_level:
        experience_years = 1
    elif "Mid Level" in experience_level:
        experience_years = 3.5
    elif "Senior Level" in experience_level:
        experience_years = 7
    elif "Lead" in experience_level:
        experience_years = 10
    
    # Count advanced/expert skills
    if isinstance(technical_skills, dict):
        skills_with_proficiency = {k: v for k, v in technical_skills.items() if v and v != "None"}
        advanced_skills = len([s for s, v in technical_skills.items() if v in ["Advanced", "Expert"] and v != "None"])
        score += min(20, advanced_skills * 5)
        
        # Bonus points for skill diversity
        skill_categories = set()
        for skill in skills_with_proficiency.keys():
            if skill in ["React", "Vue.js", "Angular"]:
                skill_categories.add("frontend")
            elif skill in ["Node.js", "Python", "Django", "Flask", "Java", "C#", "Go"]:
                skill_categories.add("backend")
            elif skill in ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"]:
                skill_categories.add("cloud")
            elif skill in ["SQL", "MongoDB", "PostgreSQL", "Redis"]:
                skill_categories.add("database")
        
        score += min(20, len(skill_categories) * 5)
    
    # Career Goals Alignment (10 points)
    if career_goals:
        if "senior" in career_goals or "lead" in career_goals or "principal" in career_goals:
            if experience_years >= 3:
                score += 10
            else:
                analysis["recommendations"].append("Your goals show ambition! Focus on building more experience to reach senior roles faster.")
        
        if "remote" in career_goals or "flexible" in career_goals:
            analysis["recommendations"].append("Remote work opportunities are abundant - especially with your skill set!")
        
        if "startup" in career_goals:
            analysis["recommendations"].append("Startup experience can accelerate your career. Consider early-stage companies for rapid growth.")
    
    analysis["trajectory_score"] = min(100, score)
    
    # Determine growth potential
    if analysis["trajectory_score"] >= 80:
        analysis["growth_potential"] = "high"
        analysis["insights"].append("Excellent trajectory! You're positioning yourself for senior roles and high growth.")
    elif analysis["trajectory_score"] >= 60:
        analysis["growth_potential"] = "medium-high"
        analysis["insights"].append("Good foundation! With focused skill development, you could reach senior levels quickly.")
    elif analysis["trajectory_score"] >= 40:
        analysis["growth_potential"] = "medium"
        analysis["insights"].append("Solid start! Focus on building depth in your core skills and expanding your toolkit.")
    else:
        analysis["growth_potential"] = "developing"
        analysis["insights"].append("Every expert was once a beginner! Focus on fundamentals and consistent learning.")
    
    # Identify missing skills based on career interests
    if isinstance(career_interests, list) and isinstance(technical_skills, dict):
        skills_with_proficiency = {k: v for k, v in technical_skills.items() if v and v != "None"}
        
        if "Frontend Developer" in career_interests:
            missing_frontend = ["TypeScript", "React", "Next.js", "TailwindCSS"]
            analysis["missing_skills"].extend([s for s in missing_frontend if s not in skills_with_proficiency])
        
        if "Backend Developer" in career_interests:
            missing_backend = ["Docker", "AWS", "PostgreSQL", "Redis"]
            analysis["missing_skills"].extend([s for s in missing_backend if s not in skills_with_proficiency])
        
        if "Data Scientist" in career_interests:
            missing_data = ["Machine Learning", "Deep Learning", "SQL", "AWS"]
            analysis["missing_skills"].extend([s for s in missing_data if s not in skills_with_proficiency])
    
    return analysis

