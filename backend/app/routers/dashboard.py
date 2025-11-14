from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models.assessment import Assessment, UserSkill, LearningPath, JobMatch
from app.services.career_intelligence import CareerIntelligenceService

router = APIRouter()

def get_career_intelligence_service(db: Session = Depends(get_db)) -> CareerIntelligenceService:
    """Dependency to get career intelligence service"""
    return CareerIntelligenceService(db)


@router.get("/{user_id}")
async def get_dashboard(user_id: str, db: Session = Depends(get_db)):
    """Get comprehensive career intelligence dashboard"""
    
    # Convert string user_id to integer
    try:
        user_id_int = int(user_id)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail=f"Invalid user_id: {user_id}")
    
    # Get user assessment
    assessment = db.query(Assessment).filter(Assessment.user_id == user_id_int).first()
    if not assessment:
        # Return empty dashboard data if no assessment exists
        return {
            "user_id": user_id_int,
            "has_assessment": False,
            "market_readiness_score": 0,
            "skill_gaps": {
                "total_gaps": 0,
                "critical_gaps": 0,
                "total_learning_hours": 0,
                "gaps": [],
                "categories_with_gaps": [],
                "skills_covered": 0,
                "skills_required": 0,
            },
            "market_pulse": {
                "trending_skills": [],
                "opportunities": [],
                "market_alignment_score": 0,
                "current_salary_premium": 0,
                "potential_salary_premium": 0,
                "salary_benchmark": {"min": 0, "avg": 0, "max": 0},
                "experience_level": "Entry Level (0-2 years)",
                "demand_signals": {
                    "high_demand_skills_count": 0,
                    "growing_skills_count": 0,
                    "market_opportunities": 0,
                },
            },
            "progress_velocity": {
                "paths_completed": 0,
                "paths_in_progress": 0,
                "paths_total": 0,
                "average_completion_rate": 0,
                "skills_acquired_last_30_days": 0,
                "learning_velocity": 0,
                "hours_learned_last_30_days": 0,
                "total_hours_completed": 0,
                "total_hours_planned": 0,
                "projected_completion_date": None,
            },
            "benchmarks": {
                "experience_level": "Entry Level (0-2 years)",
                "user_metrics": {
                    "skills_count": 0,
                    "avg_match_score": 0,
                    "learning_paths_count": 0,
                    "avg_completion_rate": 0,
                },
                "industry_benchmarks": {
                    "avg_skills": 5,
                    "avg_match_score": 65,
                    "avg_learning_paths": 2,
                    "avg_completion_rate": 45,
                },
                "percentile_rankings": {
                    "skills": 0,
                    "match_score": 0,
                    "learning_paths": 0,
                    "completion_rate": 0,
                    "overall": 0,
                },
                "comparison": {
                    "skills_vs_peers": "below",
                    "match_score_vs_peers": "below",
                    "learning_paths_vs_peers": "below",
                    "completion_rate_vs_peers": "below",
                },
            },
            "skill_trajectories": {},
            "predictive_summary": {
                "promotion_probability": 0,
                "time_to_promotion": "N/A",
                "security_score": 0,
                "automation_risk": 0,
                "pivot_readiness": 0,
                "time_to_pivot": "N/A",
            },
            "last_updated": datetime.now().isoformat(),
        }
    
    # Get user skills
    user_skills_data = db.query(UserSkill).filter(UserSkill.user_id == user_id_int).all()
    user_skills = {skill.skill_name: skill.proficiency_level for skill in user_skills_data}
    
    # Get learning paths
    learning_paths = db.query(LearningPath).filter(LearningPath.user_id == user_id_int).all()
    
    # Get job matches
    job_matches = db.query(JobMatch).filter(JobMatch.user_id == user_id_int).all()
    
    # Initialize career intelligence service
    intelligence_service = CareerIntelligenceService(db)
    
    # Calculate skill gap metrics
    skill_gaps = calculate_skill_gaps(user_skills, assessment)
    
    # Get market pulse
    market_pulse = calculate_market_pulse(user_skills, assessment)
    
    # Calculate progress velocity
    progress_velocity = calculate_progress_velocity(learning_paths, user_skills_data)
    
    # Get benchmarks
    benchmarks = calculate_benchmarks(user_skills, assessment, learning_paths, job_matches)
    
    # Get market readiness score
    market_readiness = intelligence_service.calculate_market_readiness_score(user_id_int)
    
    # Get skill trajectory predictions
    skill_trajectories = intelligence_service.generate_skill_trajectory_predictions(user_id_int)
    
    # Get predictive analytics summary
    promotion = intelligence_service.calculate_promotion_probability(user_id_int)
    security = intelligence_service.calculate_job_security_signals(user_id_int)
    pivot = intelligence_service.calculate_pivot_readiness(user_id_int)
    
    # Extract summary data (handle errors gracefully)
    predictive_summary = {
        "promotion_probability": promotion.get("promotion_probability", 0) if "error" not in promotion else 0,
        "time_to_promotion": promotion.get("time_to_promotion", "N/A") if "error" not in promotion else "N/A",
        "security_score": security.get("security_score", 0) if "error" not in security else 0,
        "automation_risk": security.get("automation_risk", 0) if "error" not in security else 0,
        "pivot_readiness": pivot.get("overall_readiness", 0) if "error" not in pivot else 0,
        "time_to_pivot": pivot.get("time_to_pivot", "N/A") if "error" not in pivot else "N/A",
    }
    
    return {
        "user_id": user_id_int,
        "has_assessment": True,
        "market_readiness_score": market_readiness,
        "skill_gaps": skill_gaps,
        "market_pulse": market_pulse,
        "progress_velocity": progress_velocity,
        "benchmarks": benchmarks,
        "skill_trajectories": skill_trajectories,
        "predictive_summary": predictive_summary,
        "last_updated": datetime.now().isoformat()
    }


def calculate_skill_gaps(user_skills: Dict[str, str], assessment: Assessment) -> Dict[str, Any]:
    """Calculate skill gap metrics"""
    
    # In-demand skills by category (mock data - would come from market APIs)
    in_demand_skills = {
        "Frontend": ["React", "TypeScript", "Next.js", "Vue.js", "Angular"],
        "Backend": ["Python", "Node.js", "Go", "Java", "Rust"],
        "DevOps": ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
        "Data": ["Python", "SQL", "MongoDB", "PostgreSQL", "Redis"],
        "AI/ML": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Data Science"],
        "Mobile": ["React Native", "Flutter", "Swift", "Kotlin"],
        "Security": ["Cybersecurity", "Encryption", "Penetration Testing"]
    }
    
    # Get user's career interests to prioritize relevant skills
    career_interests = assessment.career_interests or {}
    interest_categories = career_interests.get("career_interests", [])
    
    # Determine priority categories based on interests
    priority_categories = []
    if any("Frontend" in interest for interest in interest_categories):
        priority_categories.append("Frontend")
    if any("Backend" in interest for interest in interest_categories):
        priority_categories.append("Backend")
    if any("DevOps" in interest for interest in interest_categories):
        priority_categories.append("DevOps")
    if any("Data" in interest or "Data Science" in interest for interest in interest_categories):
        priority_categories.extend(["Data", "AI/ML"])
    
    # If no specific interests, use all categories
    if not priority_categories:
        priority_categories = list(in_demand_skills.keys())
    
    # Find gaps
    gaps = []
    user_skill_names = set(user_skills.keys())
    
    for category in priority_categories:
        category_skills = in_demand_skills.get(category, [])
        for skill in category_skills:
            if skill not in user_skill_names:
                # Calculate market value for this skill
                market_value = calculate_skill_market_value(skill, category)
                gaps.append({
                    "skill": skill,
                    "category": category,
                    "market_value": market_value,
                    "priority": "high" if market_value > 80 else "medium" if market_value > 60 else "low",
                    "estimated_learning_hours": estimate_learning_hours(skill),
                    "salary_impact": estimate_salary_impact(skill, category)
                })
    
    # Sort by market value and priority
    gaps.sort(key=lambda x: (x["market_value"], x["priority"] == "high"), reverse=True)
    
    # Calculate gap metrics
    total_gaps = len(gaps)
    critical_gaps = len([g for g in gaps if g["priority"] == "high"])
    total_learning_hours = sum(g["estimated_learning_hours"] for g in gaps[:5])  # Top 5 gaps
    
    return {
        "total_gaps": total_gaps,
        "critical_gaps": critical_gaps,
        "total_learning_hours": total_learning_hours,
        "gaps": gaps[:10],  # Top 10 gaps
        "categories_with_gaps": list(set(g["category"] for g in gaps)),
        "skills_covered": len(user_skill_names),
        "skills_required": len(set().union(*[in_demand_skills.get(cat, []) for cat in priority_categories]))
    }


def calculate_skill_market_value(skill: str, category: str) -> int:
    """Calculate market value score for a skill (0-100)"""
    # Mock market value data
    high_value_skills = {
        "React": 95, "TypeScript": 92, "Python": 90, "AWS": 88, "Docker": 85,
        "Kubernetes": 87, "Machine Learning": 94, "TensorFlow": 91, "Node.js": 86,
        "Go": 84, "Rust": 83, "GraphQL": 82, "Next.js": 89
    }
    
    return high_value_skills.get(skill, 70)


def estimate_learning_hours(skill: str) -> int:
    """Estimate learning hours for a skill"""
    # Mock estimates based on skill complexity
    estimates = {
        "React": 80, "TypeScript": 60, "Python": 100, "AWS": 120, "Docker": 40,
        "Kubernetes": 80, "Machine Learning": 150, "TensorFlow": 100, "Node.js": 60,
        "Go": 70, "Rust": 90, "GraphQL": 40, "Next.js": 50
    }
    
    return estimates.get(skill, 60)


def estimate_salary_impact(skill: str, category: str) -> int:
    """Estimate salary impact in dollars"""
    # Mock salary impact data
    impact_map = {
        "React": 8000, "TypeScript": 10000, "Python": 12000, "AWS": 15000,
        "Docker": 8000, "Kubernetes": 12000, "Machine Learning": 20000,
        "TensorFlow": 18000, "Node.js": 7000, "Go": 10000, "Rust": 12000,
        "GraphQL": 6000, "Next.js": 9000
    }
    
    return impact_map.get(skill, 5000)


def calculate_market_pulse(user_skills: Dict[str, str], assessment: Assessment) -> Dict[str, Any]:
    """Calculate market pulse - trending skills, salary insights, demand signals"""
    
    # Mock market data (would come from real market APIs)
    trending_skills = [
        {"skill": "React", "growth": 0.15, "demand": 95, "salary_premium": 8000},
        {"skill": "TypeScript", "growth": 0.18, "demand": 92, "salary_premium": 10000},
        {"skill": "Python", "growth": 0.12, "demand": 88, "salary_premium": 12000},
        {"skill": "AWS", "growth": 0.25, "demand": 90, "salary_premium": 15000},
        {"skill": "Docker", "growth": 0.20, "demand": 85, "salary_premium": 8000},
        {"skill": "Kubernetes", "growth": 0.22, "demand": 87, "salary_premium": 12000},
        {"skill": "Machine Learning", "growth": 0.35, "demand": 94, "salary_premium": 20000},
        {"skill": "GraphQL", "growth": 0.14, "demand": 82, "salary_premium": 6000}
    ]
    
    user_skill_names = set(user_skills.keys())
    
    # Filter trending skills user doesn't have
    opportunities = [s for s in trending_skills if s["skill"] not in user_skill_names]
    opportunities.sort(key=lambda x: x["demand"], reverse=True)
    
    # Calculate user's market alignment
    user_trending_skills = [s for s in trending_skills if s["skill"] in user_skill_names]
    market_alignment_score = (len(user_trending_skills) / len(trending_skills)) * 100 if trending_skills else 0
    
    # Salary insights
    total_salary_premium = sum(s["salary_premium"] for s in user_trending_skills)
    potential_premium = sum(s["salary_premium"] for s in opportunities[:3])  # Top 3 opportunities
    
    # Market trends
    experience_level = (assessment.career_interests or {}).get("experience_level", "Entry Level")
    salary_benchmarks = {
        "Entry Level (0-2 years)": {"min": 60000, "avg": 70000, "max": 85000},
        "Mid Level (2-5 years)": {"min": 80000, "avg": 100000, "max": 120000},
        "Senior Level (5+ years)": {"min": 120000, "avg": 150000, "max": 180000},
        "Lead/Principal Level": {"min": 160000, "avg": 200000, "max": 250000}
    }
    
    salary_benchmark = salary_benchmarks.get(experience_level, salary_benchmarks["Entry Level (0-2 years)"])
    
    return {
        "trending_skills": trending_skills[:8],
        "opportunities": opportunities[:5],
        "market_alignment_score": round(market_alignment_score, 1),
        "current_salary_premium": total_salary_premium,
        "potential_salary_premium": potential_premium,
        "salary_benchmark": salary_benchmark,
        "experience_level": experience_level,
        "demand_signals": {
            "high_demand_skills_count": len([s for s in user_trending_skills if s["demand"] > 85]),
            "growing_skills_count": len([s for s in user_trending_skills if s["growth"] > 0.15]),
            "market_opportunities": len(opportunities)
        }
    }


def calculate_progress_velocity(learning_paths: List[LearningPath], user_skills: List[UserSkill]) -> Dict[str, Any]:
    """Calculate progress velocity - learning path completion, skill acquisition speed"""
    
    if not learning_paths:
        return {
            "paths_completed": 0,
            "paths_in_progress": 0,
            "paths_total": 0,
            "average_completion_rate": 0,
            "skills_acquired_last_30_days": 0,
            "learning_velocity": 0,
            "hours_learned_last_30_days": 0,
            "projected_completion_date": None
        }
    
    # Calculate path metrics
    completed_paths = [p for p in learning_paths if p.status == "completed"]
    in_progress_paths = [p for p in learning_paths if p.status == "in_progress"]
    
    total_progress = sum(p.progress_percentage for p in learning_paths) / len(learning_paths) if learning_paths else 0
    
    # Calculate skill acquisition (mock - would track actual skill additions)
    skills_acquired_last_30_days = 0  # Would track from user_skills.created_at
    for skill in user_skills:
        if skill.created_at and skill.created_at >= datetime.now() - timedelta(days=30):
            skills_acquired_last_30_days += 1
    
    # Calculate learning velocity (skills per month)
    if user_skills:
        oldest_skill = min(skill.created_at for skill in user_skills if skill.created_at)
        if oldest_skill:
            months_active = (datetime.now() - oldest_skill).days / 30
            learning_velocity = len(user_skills) / months_active if months_active > 0 else len(user_skills)
        else:
            learning_velocity = len(user_skills)
    else:
        learning_velocity = 0
    
    # Calculate hours learned (mock - would track from learning path progress)
    total_hours = sum(p.total_hours or 0 for p in learning_paths)
    completed_hours = sum((p.total_hours or 0) * (p.progress_percentage / 100) for p in learning_paths)
    hours_learned_last_30_days = completed_hours * 0.1  # Mock: 10% of completed hours in last 30 days
    
    # Projected completion date (for in-progress paths)
    projected_completion = None
    if in_progress_paths:
        avg_hours_per_day = 5  # Default
        remaining_hours = sum((p.total_hours or 0) * (1 - p.progress_percentage / 100) for p in in_progress_paths)
        days_to_complete = remaining_hours / avg_hours_per_day if avg_hours_per_day > 0 else 0
        projected_completion = (datetime.now() + timedelta(days=days_to_complete)).isoformat()
    
    return {
        "paths_completed": len(completed_paths),
        "paths_in_progress": len(in_progress_paths),
        "paths_total": len(learning_paths),
        "average_completion_rate": round(total_progress, 1),
        "skills_acquired_last_30_days": skills_acquired_last_30_days,
        "learning_velocity": round(learning_velocity, 1),
        "hours_learned_last_30_days": round(hours_learned_last_30_days, 1),
        "total_hours_completed": round(completed_hours, 1),
        "total_hours_planned": round(total_hours, 1),
        "projected_completion_date": projected_completion
    }


def calculate_benchmarks(user_skills: Dict[str, str], assessment: Assessment, learning_paths: List[LearningPath], job_matches: List[JobMatch]) -> Dict[str, Any]:
    """Calculate benchmarks - peer comparisons, industry standards"""
    
    experience_level = (assessment.career_interests or {}).get("experience_level", "Entry Level")
    
    # Industry benchmarks (mock data)
    industry_benchmarks = {
        "Entry Level (0-2 years)": {
            "avg_skills": 5,
            "avg_match_score": 45,
            "avg_learning_paths": 1,
            "avg_completion_rate": 30
        },
        "Mid Level (2-5 years)": {
            "avg_skills": 12,
            "avg_match_score": 65,
            "avg_learning_paths": 2,
            "avg_completion_rate": 50
        },
        "Senior Level (5+ years)": {
            "avg_skills": 20,
            "avg_match_score": 80,
            "avg_learning_paths": 3,
            "avg_completion_rate": 70
        },
        "Lead/Principal Level": {
            "avg_skills": 25,
            "avg_match_score": 90,
            "avg_learning_paths": 4,
            "avg_completion_rate": 85
        }
    }
    
    benchmark = industry_benchmarks.get(experience_level, industry_benchmarks["Entry Level (0-2 years)"])
    
    # Calculate user metrics
    user_skills_count = len(user_skills)
    avg_match_score = sum(m.match_score for m in job_matches) / len(job_matches) if job_matches else 0
    learning_paths_count = len(learning_paths)
    avg_completion_rate = sum(p.progress_percentage for p in learning_paths) / len(learning_paths) if learning_paths else 0
    
    # Calculate percentile rankings
    skills_percentile = min(100, (user_skills_count / benchmark["avg_skills"]) * 50) if benchmark["avg_skills"] > 0 else 50
    match_score_percentile = min(100, (avg_match_score / benchmark["avg_match_score"]) * 50) if benchmark["avg_match_score"] > 0 else 50
    learning_paths_percentile = min(100, (learning_paths_count / benchmark["avg_learning_paths"]) * 50) if benchmark["avg_learning_paths"] > 0 else 50
    completion_percentile = min(100, (avg_completion_rate / benchmark["avg_completion_rate"]) * 50) if benchmark["avg_completion_rate"] > 0 else 50
    
    # Overall percentile
    overall_percentile = (skills_percentile + match_score_percentile + learning_paths_percentile + completion_percentile) / 4
    
    return {
        "experience_level": experience_level,
        "user_metrics": {
            "skills_count": user_skills_count,
            "avg_match_score": round(avg_match_score, 1),
            "learning_paths_count": learning_paths_count,
            "avg_completion_rate": round(avg_completion_rate, 1)
        },
        "industry_benchmarks": benchmark,
        "percentile_rankings": {
            "skills": round(skills_percentile, 1),
            "match_score": round(match_score_percentile, 1),
            "learning_paths": round(learning_paths_percentile, 1),
            "completion_rate": round(completion_percentile, 1),
            "overall": round(overall_percentile, 1)
        },
        "comparison": {
            "skills_vs_peers": "above" if user_skills_count > benchmark["avg_skills"] else "below" if user_skills_count < benchmark["avg_skills"] else "average",
            "match_score_vs_peers": "above" if avg_match_score > benchmark["avg_match_score"] else "below" if avg_match_score < benchmark["avg_match_score"] else "average",
            "learning_paths_vs_peers": "above" if learning_paths_count > benchmark["avg_learning_paths"] else "below" if learning_paths_count < benchmark["avg_learning_paths"] else "average",
            "completion_rate_vs_peers": "above" if avg_completion_rate > benchmark["avg_completion_rate"] else "below" if avg_completion_rate < benchmark["avg_completion_rate"] else "average"
        }
    }

