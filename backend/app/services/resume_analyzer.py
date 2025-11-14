import re
from typing import Dict, Any, List, Tuple, Optional
from collections import Counter


ACTION_VERBS = {
    "accelerated",
    "achieved",
    "built",
    "coordinated",
    "created",
    "delivered",
    "designed",
    "developed",
    "drove",
    "executed",
    "improved",
    "launched",
    "led",
    "optimized",
    "shipped",
    "scaled",
    "spearheaded",
    "streamlined",
}

METRIC_PATTERN = re.compile(r"(\d+%|\d+\+\s|[\$€£]\d+|\d+\s?(?:k|m|million|billion)|\d+\.\d+)")


def _normalize_resume(resume_content: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize keys so we can handle both snake_case (backend) and camelCase (frontend builder).
    """
    if not resume_content:
        return {
            "personal_info": {},
            "summary": "",
            "experience": [],
            "education": [],
            "skills": {"technical": [], "soft": []},
        }

    normalized = {}

    personal_info = resume_content.get("personal_info") or resume_content.get("personalInfo") or {}
    normalized["personal_info"] = {
        "name": personal_info.get("name") or personal_info.get("full_name", ""),
        "email": personal_info.get("email", ""),
        "phone": personal_info.get("phone", ""),
        "location": personal_info.get("location", ""),
        "linkedin": personal_info.get("linkedin") or personal_info.get("linkedin_url", ""),
    }

    normalized["summary"] = (
        resume_content.get("summary")
        or resume_content.get("personalInfo", {}).get("summary")
        or personal_info.get("summary")
        or ""
    )

    normalized["experience"] = resume_content.get("experience", [])
    normalized["education"] = resume_content.get("education", [])
    normalized["projects"] = resume_content.get("projects", [])
    normalized["certifications"] = resume_content.get("certifications", [])
    normalized["skills"] = resume_content.get("skills") or {"technical": [], "soft": []}

    return normalized


def _count_bullets(experience: List[Dict[str, Any]]) -> Tuple[int, int, int]:
    total_bullets = 0
    bullets_with_metrics = 0
    bullets_with_action_verbs = 0

    for exp in experience:
        description = exp.get("description", "") or ""
        lines = [
            line.strip("•- ").strip()
            for line in description.split("\n")
            if line.strip()
        ]
        total_bullets += len(lines)
        for line in lines:
            if METRIC_PATTERN.search(line):
                bullets_with_metrics += 1
            first_word = line.split(" ", 1)[0].lower()
            if first_word in ACTION_VERBS:
                bullets_with_action_verbs += 1

    return total_bullets, bullets_with_metrics, bullets_with_action_verbs


def _aggregate_text(resume: Dict[str, Any]) -> str:
    parts = []
    parts.append(resume.get("summary", ""))

    for exp in resume.get("experience", []):
        parts.extend(
            [
                exp.get("title", ""),
                exp.get("company", ""),
                exp.get("description", ""),
            ]
        )

    for proj in resume.get("projects", []):
        parts.extend([proj.get("name", ""), proj.get("description", "")])

    parts.extend(resume.get("skills", {}).get("technical", []))
    parts.extend(resume.get("skills", {}).get("soft", []))

    return " ".join(parts)


def _score_contact_info(personal_info: Dict[str, Any]) -> Tuple[int, Dict[str, Any]]:
    required_fields = ["name", "email"]
    optional_fields = ["phone", "location", "linkedin"]

    missing_required = [field for field in required_fields if not personal_info.get(field)]
    missing_optional = [field for field in optional_fields if not personal_info.get(field)]

    if missing_required:
        score = 0
        status = "fail"
    elif missing_optional:
        score = 15
        status = "warn"
    else:
        score = 20
        status = "pass"

    return score, {
        "name": "Contact Information",
        "status": status,
        "missing": missing_required + missing_optional,
        "details": "Include name, email, phone, location, and LinkedIn for best ATS results.",
    }


def _score_summary(summary: str) -> Tuple[int, Dict[str, Any]]:
    summary_length = len(summary.strip())
    has_metrics = bool(METRIC_PATTERN.search(summary))

    if summary_length == 0:
        return 0, {
            "name": "Professional Summary",
            "status": "fail",
            "details": "Add a 2-3 sentence summary that signals role, scope, and key wins.",
        }

    if summary_length < 100:
        return 10, {
            "name": "Professional Summary",
            "status": "warn",
            "details": "Great start. Expand to 2-3 sentences and highlight tangible outcomes.",
        }

    status = "pass" if has_metrics else "warn"
    details = (
        "Strong summary with measurable impact."
        if has_metrics
        else "Summary reads well. Add one quantified win to make it pop."
    )
    return (15 if has_metrics else 12), {
        "name": "Professional Summary",
        "status": status,
        "details": details,
    }


def _score_experience(experience: List[Dict[str, Any]]) -> Tuple[int, Dict[str, Any], Dict[str, Any]]:
    if not experience:
        return 5, {
            "name": "Experience Section",
            "status": "fail",
            "details": "Add at least one role with a title, company, and impact-focused bullets.",
        }, {
            "total_bullets": 0,
            "bullets_with_metrics": 0,
            "bullets_with_action_verbs": 0,
            "recommendations": [
                "Add 3-5 bullets per role.",
                "Lead with strong action verbs.",
                "Quantify outcomes wherever possible.",
            ],
        }

    total_bullets, bullets_with_metrics, bullets_with_action_verbs = _count_bullets(experience)

    # Score calculations
    bullet_coverage = min(total_bullets / (len(experience) * 3 + 1e-5), 1.0)
    metric_ratio = bullets_with_metrics / total_bullets if total_bullets else 0
    verb_ratio = bullets_with_action_verbs / total_bullets if total_bullets else 0

    score = int(15 * bullet_coverage + 5 * metric_ratio + 5 * verb_ratio)
    score = min(score, 25)

    if total_bullets == 0:
        status = "warn"
        details = "Add bullet points that capture scope, action, and measurable results."
    elif metric_ratio < 0.3:
        status = "warn"
        details = "Good structure. Boost credibility by quantifying more outcomes."
    else:
        status = "pass"
        details = "Experience section is impact-oriented and ATS-friendly."

    recommendations = []
    if total_bullets < len(experience) * 3:
        recommendations.append("Add at least 3 impact bullets per role.")
    if metric_ratio < 0.3:
        recommendations.append("Quantify wins (%, $, time saved, volume handled).")
    if verb_ratio < 0.6:
        recommendations.append("Start more bullets with decisive action verbs.")

    impact_review = {
        "total_bullets": total_bullets,
        "bullets_with_metrics": bullets_with_metrics,
        "bullets_with_action_verbs": bullets_with_action_verbs,
        "recommendations": recommendations,
    }

    return score, {
        "name": "Experience Section",
        "status": status,
        "details": details,
    }, impact_review


def _score_structure(resume: Dict[str, Any]) -> Tuple[int, Dict[str, Any]]:
    present_sections = []
    missing_sections = []

    for section_name, key in [
        ("Education", "education"),
        ("Skills", "skills"),
        ("Projects", "projects"),
    ]:
        section_value = resume.get(key)
        if isinstance(section_value, list) and section_value:
            present_sections.append(section_name)
        elif isinstance(section_value, dict) and any(section_value.values()):
            present_sections.append(section_name)
        else:
            missing_sections.append(section_name)

    if missing_sections and len(missing_sections) >= 2:
        score = 8
        status = "warn"
    elif missing_sections:
        score = 12
        status = "warn"
    else:
        score = 20
        status = "pass"

    details = (
        "Complete resume structure detected."
        if status == "pass"
        else f"Add or flesh out: {', '.join(missing_sections)}."
    )

    return score, {
        "name": "Structure & Sections",
        "status": status,
        "details": details,
    }


def _keyword_analysis(resume_text: str, target_keywords: List[str]) -> Dict[str, Any]:
    if not target_keywords:
        return {
            "coverage_score": 60,
            "target_keywords": [],
            "matched_keywords": [],
            "missing_keywords": [],
        }

    matched = []
    missing = []
    lower_text = resume_text.lower()

    for keyword in target_keywords:
        normalized_keyword = keyword.strip()
        if not normalized_keyword:
            continue
        pattern = re.escape(normalized_keyword.lower())
        if re.search(rf"\b{pattern}\b", lower_text):
            matched.append(normalized_keyword)
        else:
            missing.append(normalized_keyword)

    coverage_score = int((len(matched) / max(len(target_keywords), 1)) * 100)

    return {
        "coverage_score": coverage_score,
        "target_keywords": target_keywords,
        "matched_keywords": matched,
        "missing_keywords": missing,
    }


def analyze_resume(
    resume_content: Dict[str, Any],
    target_role: Optional[str] = None,
    target_keywords: Optional[List[str]] = None,
) -> Dict[str, Any]:
    resume = _normalize_resume(resume_content)
    target_keywords = list(dict.fromkeys(target_keywords or []))  # deduplicate preserving order

    contact_score, contact_check = _score_contact_info(resume["personal_info"])
    summary_score, summary_check = _score_summary(resume["summary"])
    experience_score, experience_check, impact_review = _score_experience(resume["experience"])
    structure_score, structure_check = _score_structure(resume)

    resume_text = _aggregate_text(resume)
    keyword_analysis = _keyword_analysis(resume_text, target_keywords)
    keyword_score = min(keyword_analysis["coverage_score"], 100) * 0.2  # 20% weight

    ats_readiness_score = int(
        contact_score
        + summary_score
        + experience_score
        + structure_score
        + keyword_score
    )
    ats_readiness_score = min(max(ats_readiness_score, 0), 100)

    gaps = []
    next_actions = []

    if contact_check["status"] != "pass":
        gaps.append("Complete your contact header (name, email, phone, location, LinkedIn).")
    if summary_check["status"] != "pass":
        next_actions.append("Rewrite summary to highlight role, scope, and a quantified outcome.")
    if experience_check["status"] != "pass":
        next_actions.append("Refresh experience bullets with action verbs + metrics.")
    if keyword_analysis["coverage_score"] < 70:
        next_actions.append("Mirror more role-specific keywords from job descriptions.")
    if structure_check["status"] != "pass":
        missing_sections = structure_check["details"]
        next_actions.append(f"Add missing sections to align with ATS templates. {missing_sections}")

    if not resume["experience"]:
        gaps.append("Add professional experience or relevant projects.")

    if not resume["skills"].get("technical"):
        gaps.append("List 6-8 technical skills aligned with your target role.")

    return {
        "ats_readiness_score": ats_readiness_score,
        "target_role": target_role,
        "section_checks": [
            contact_check,
            summary_check,
            experience_check,
            structure_check,
        ],
        "keyword_analysis": keyword_analysis,
        "impact_review": impact_review,
        "gaps": gaps,
        "next_actions": next_actions,
    }

