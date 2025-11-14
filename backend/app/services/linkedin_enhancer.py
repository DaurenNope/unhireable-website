from typing import Dict, Any, List, Optional
from datetime import datetime


def _extract_primary_role(career_interests: Dict[str, Any]) -> Optional[str]:
    interests = career_interests.get("career_interests")
    if isinstance(interests, list) and interests:
        return interests[0]
    if isinstance(interests, dict):
        # handle case where stored as dict of scores
        sorted_interests = sorted(
            interests.items(), key=lambda item: item[1] if isinstance(item[1], (int, float)) else 0, reverse=True
        )
        if sorted_interests:
            return sorted_interests[0][0]
    return None


def _extract_personality_profile(career_interests: Dict[str, Any]) -> Dict[str, Any]:
    profile = career_interests.get("personality_profile")
    if isinstance(profile, dict):
        return profile
    return {}


def _extract_top_skills(career_interests: Dict[str, Any], limit: int = 6) -> List[str]:
    technical_skills = career_interests.get("technical_skills")
    collected: List[str] = []

    if isinstance(technical_skills, dict):
        for skill, proficiency in technical_skills.items():
            if proficiency and proficiency != "None":
                collected.append(f"{skill} ({proficiency})")
    elif isinstance(technical_skills, list):
        collected.extend([str(skill) for skill in technical_skills])

    # Fallback to general skills if available
    general_skills = career_interests.get("skills")
    if not collected and isinstance(general_skills, list):
        collected.extend([str(skill) for skill in general_skills])

    return collected[:limit]


def _extract_career_goals(career_interests: Dict[str, Any], fallback_goal: Optional[str]) -> str:
    goal = career_interests.get("career_goals")
    if isinstance(goal, str) and goal.strip():
        return goal.strip()
    if fallback_goal:
        return fallback_goal
    return "Build products that have meaningful impact while growing into a leadership role."


def _build_headline_suggestions(primary_role: Optional[str], top_skills: List[str], personality: Dict[str, Any]) -> List[str]:
    default_role = primary_role or "Product-Focused Software Engineer"
    skills_fragment = ", ".join(skill.split(" (")[0] for skill in top_skills[:3]) if top_skills else "React • TypeScript • Node.js"
    personality_type = personality.get("type") or "Human-Centered Builder"

    return [
        f"{default_role} • {skills_fragment} • {personality_type}",
        f"{default_role} | {skills_fragment} | Shipping delightful experiences",
        f"{default_role} | {skills_fragment} | Turning insights into impact",
    ]


def _build_summary_highlights(primary_role: Optional[str], career_goals: str, personality: Dict[str, Any]) -> Dict[str, Any]:
    headline = f"I help teams deliver {primary_role.lower() if primary_role else 'impactful products'} faster without sacrificing quality."
    traits = [
        trait.get("trait")
        for trait in (personality.get("top_traits") or [])
        if isinstance(trait, dict) and trait.get("score", 0) >= 7
    ]

    core_strengths = [
        "⚡ Translating ambiguous ideas into ship-ready plans",
        "🤝 Building trust across engineering, product, and design",
        "📈 Using data to prioritize what actually moves the needle",
    ]

    if traits:
        core_strengths.insert(0, f"🔍 Known for: {', '.join(traits[:3])}")

    future_focus = f"Today, I'm focused on {career_goals.lower() if career_goals else 'work that blends technical depth with product intuition'}."

    return {
        "headline": headline,
        "strengths": core_strengths,
        "future_focus": future_focus,
    }


def _build_profile_checklist(primary_role: Optional[str], personality: Dict[str, Any]) -> List[Dict[str, Any]]:
    checklist = [
        {
            "item": "Refresh your headline to show role + differentiator + proof points",
            "status": "pending",
        },
        {
            "item": "Add a Featured section showcasing 1-2 flagship projects",
            "status": "pending",
        },
        {
            "item": "Ask for a recommendation that highlights your collaboration style",
            "status": "pending",
        },
        {
            "item": "Activate Open-To-Work with custom targeting (if actively searching)",
            "status": "pending",
        },
    ]

    if personality.get("type"):
        checklist.append(
            {
                "item": f"Highlight how your {personality['type']} strengths show up on teams",
                "status": "pending",
            }
        )

    if primary_role:
        checklist.append(
            {
                "item": f"Add a banner image aligned with {primary_role} storytelling",
                "status": "pending",
            }
        )

    return checklist


def generate_linkedin_suggestions(assessment: Any) -> Dict[str, Any]:
    """
    Generate LinkedIn profile enhancement suggestions based on assessment data.
    """
    career_interests = assessment.career_interests or {}
    primary_role = _extract_primary_role(career_interests)
    personality = _extract_personality_profile(career_interests)
    top_skills = _extract_top_skills(career_interests)
    career_goals = _extract_career_goals(career_interests, assessment.career_goals)

    headline_suggestions = _build_headline_suggestions(primary_role, top_skills, personality)
    summary_highlights = _build_summary_highlights(primary_role, career_goals, personality)
    profile_checklist = _build_profile_checklist(primary_role, personality)

    skill_keywords = [
        skill.split(" (")[0]
        for skill in top_skills
    ]

    return {
        "generated_at": datetime.utcnow().isoformat(),
        "primary_role": primary_role or "Product-Focused Engineer",
        "headline_suggestions": headline_suggestions,
        "summary_highlights": summary_highlights,
        "skills_to_feature": skill_keywords[:6] or ["Product Strategy", "Cross-Functional Collaboration", "Delivery Excellence"],
        "profile_checklist": profile_checklist,
        "tone": personality.get("type") if personality else "High-Impact Builder",
    }


def generate_default_linkedin_suggestions() -> Dict[str, Any]:
    """
    Provide default suggestions when we do not have assessment data.
    """
    return {
        "generated_at": datetime.utcnow().isoformat(),
        "primary_role": "Modern Software Engineer",
        "headline_suggestions": [
            "Software Engineer • React & TypeScript • Shipping delightful user experiences",
            "Full-Stack Developer | Next.js • Node.js • Product Strategy",
            "Human-centered Engineer | Turning ideas into shipped products",
        ],
        "summary_highlights": {
            "headline": "I blend product intuition with technical depth to ship high-impact features.",
            "strengths": [
                "⚡ Translating ambiguous ideas into ship-ready plans",
                "🤝 Building trust across engineering, product, and design",
                "📈 Using data to prioritize what actually moves the needle",
            ],
            "future_focus": "Today, I'm focused on work that blends technical depth with product intuition.",
        },
        "skills_to_feature": [
            "React",
            "TypeScript",
            "Node.js",
            "Product Strategy",
            "Design Systems",
            "Delivery Excellence",
        ],
        "profile_checklist": [
            {
                "item": "Refresh your headline to show role + differentiator + proof points",
                "status": "pending",
            },
            {
                "item": "Add a Featured section showcasing 1-2 flagship projects",
                "status": "pending",
            },
            {
                "item": "Ask for a recommendation that highlights your collaboration style",
                "status": "pending",
            },
            {
                "item": "Activate Open-To-Work with custom targeting (if actively searching)",
                "status": "pending",
            },
        ],
        "tone": "Impact-Driven",
    }

