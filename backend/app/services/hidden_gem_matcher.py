"""Hidden Gem Job Matcher - Finds unique job opportunities others might miss"""

from typing import Dict, Any, List
from datetime import datetime, timedelta


class HiddenGemMatcher:
    """Finds hidden gem jobs that are perfect matches but might be overlooked"""
    
    def __init__(self):
        self.hidden_gem_signals = {
            "low_competition": 0.3,  # Fewer applicants
            "unique_requirements": 0.4,  # Specific skill combinations
            "growth_opportunity": 0.5,  # High growth potential
            "culture_match": 0.6,  # Perfect culture fit
            "skill_alignment": 0.7,  # Strong skill match
            "personality_fit": 0.8,  # Personality alignment
            "underrated_company": 0.9,  # Great company, less known
            "perfect_timing": 1.0  # Right time, right place
        }
    
    def find_hidden_gems(
        self,
        user_skills: Dict[str, str],
        personality_profile: Dict[str, Any],
        job_matches: List[Dict[str, Any]],
        user_preferences: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Find hidden gem jobs from existing matches"""
        hidden_gems = []
        
        for job in job_matches:
            gem_score = 0
            gem_reasons = []
            
            # Check for unique skill combinations
            if self._has_unique_skill_combination(job, user_skills):
                gem_score += self.hidden_gem_signals["unique_requirements"]
                gem_reasons.append("Unique skill combination that matches your profile")
            
            # Check for low competition
            if job.get("competition_level") == "low" and job.get("match_score", 0) >= 75:
                gem_score += self.hidden_gem_signals["low_competition"]
                gem_reasons.append("Low competition with high match score")
            
            # Check for growth opportunity
            growth_potential = job.get("growth_potential", {})
            if growth_potential.get("score", 0) >= 80:
                gem_score += self.hidden_gem_signals["growth_opportunity"]
                gem_reasons.append("High growth trajectory - rocketship opportunity")
            
            # Check for personality fit
            if personality_profile:
                personality_type = personality_profile.get("personality", {}).get("type", "")
                culture_fit = job.get("culture_fit", {})
                
                if self._personality_culture_match(personality_type, culture_fit):
                    gem_score += self.hidden_gem_signals["personality_fit"]
                    gem_reasons.append("Perfect personality-culture alignment")
            
            # Check for underrated company
            company_stage = job.get("company_stage", "")
            if company_stage in ["Series A", "Series B"] and job.get("match_score", 0) >= 80:
                gem_score += self.hidden_gem_signals["underrated_company"]
                gem_reasons.append("High-growth company with less competition")
            
            # Check for perfect timing
            posted_date = job.get("posted_date", "")
            if self._is_recently_posted(posted_date) and job.get("match_score", 0) >= 85:
                gem_score += self.hidden_gem_signals["perfect_timing"]
                gem_reasons.append("Recently posted - get in early")
            
            # If gem score is high enough, mark as hidden gem
            if gem_score >= 0.5:
                hidden_gems.append({
                    **job,
                    "hidden_gem_score": gem_score,
                    "hidden_gem_reasons": gem_reasons,
                    "is_hidden_gem": True,
                    "urgency": "high" if gem_score >= 0.8 else "medium"
                })
        
        # Sort by hidden gem score
        hidden_gems.sort(key=lambda x: x["hidden_gem_score"], reverse=True)
        
        return hidden_gems[:5]  # Top 5 hidden gems
    
    def _has_unique_skill_combination(self, job: Dict[str, Any], user_skills: Dict[str, str]) -> bool:
        """Check if job requires unique skill combination that user has"""
        required_skills = job.get("required_skills", [])
        preferred_skills = job.get("preferred_skills", [])
        
        user_skill_names = set(user_skills.keys())
        job_skills = set(required_skills + preferred_skills)
        
        # Check if user has rare skill combinations
        rare_combinations = [
            {"React", "Go", "Docker"},  # Frontend + Backend + DevOps
            {"Python", "Machine Learning", "AWS"},  # Data Science + Cloud
            {"TypeScript", "GraphQL", "Kubernetes"},  # Modern stack
            {"React", "Node.js", "PostgreSQL", "AWS"}  # Full stack + Cloud
        ]
        
        for combo in rare_combinations:
            if combo.issubset(user_skill_names) and len(combo.intersection(job_skills)) >= 2:
                return True
        
        return False
    
    def _personality_culture_match(self, personality_type: str, culture_fit: Dict[str, Any]) -> bool:
        """Check if personality matches company culture"""
        if not personality_type or not culture_fit:
            return False
        
        culture_score = culture_fit.get("score", 0)
        culture_summary = culture_fit.get("summary", "").lower()
        
        # Match personality types to culture preferences
        personality_culture_map = {
            "Creative Innovator": ["innovative", "creative", "fast-paced"],
            "Analytical Problem Solver": ["methodical", "structured", "data-driven"],
            "Natural Leader": ["leadership", "collaborative", "growth-focused"],
            "Independent Adaptor": ["remote-first", "autonomous", "flexible"],
            "Collaborative Communicator": ["collaborative", "team-oriented", "communication"]
        }
        
        preferred_cultures = personality_culture_map.get(personality_type, [])
        
        # Check if culture fit is high and aligns with personality
        if culture_score >= 75:
            for culture in preferred_cultures:
                if culture in culture_summary:
                    return True
        
        return False
    
    def _is_recently_posted(self, posted_date: str) -> bool:
        """Check if job was posted recently (within 7 days)"""
        try:
            if not posted_date:
                return False
            
            # Parse date (format: "2024-01-15")
            posted = datetime.strptime(posted_date, "%Y-%m-%d")
            days_ago = (datetime.now() - posted).days
            
            return days_ago <= 7
        except:
            return False


