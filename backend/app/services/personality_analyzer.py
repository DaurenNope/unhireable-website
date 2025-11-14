"""Real-time personality analysis based on assessment answers"""

from typing import Dict, Any, List
import json


class PersonalityAnalyzer:
    """Analyzes user personality traits from assessment answers in real-time"""
    
    def __init__(self):
        self.personality_traits = {
            "problem_solver": 0,
            "collaborative": 0,
            "innovative": 0,
            "detail_oriented": 0,
            "leadership": 0,
            "autonomous": 0,
            "communication": 0,
            "adaptability": 0,
            "creativity": 0,
            "analytical": 0
        }
        
        self.work_style = {
            "prefers_structure": 0,
            "thrives_in_chaos": 0,
            "early_adopter": 0,
            "prefers_stable": 0,
            "team_player": 0,
            "independent": 0,
            "fast_paced": 0,
            "methodical": 0
        }
        
        self.culture_fit_indicators = {
            "startup": 0,
            "enterprise": 0,
            "remote_first": 0,
            "office_collaboration": 0,
            "innovation_driven": 0,
            "process_driven": 0
        }
    
    def analyze_answer(self, question_id: str, answer: Any, current_context: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze a single answer and update personality profile"""
        insights = []
        personality_updates = {}
        work_style_updates = {}
        culture_updates = {}
        
        # Analyze career interests
        if question_id == "career_interests" and isinstance(answer, list):
            if "Frontend Developer" in answer:
                personality_updates["creativity"] = 8
                personality_updates["detail_oriented"] = 7
                work_style_updates["early_adopter"] = 9
                insights.append("🎨 Creative problem-solver - you enjoy building visual experiences")
            
            if "Backend Developer" in answer:
                personality_updates["analytical"] = 9
                personality_updates["problem_solver"] = 8
                work_style_updates["methodical"] = 7
                insights.append("🧠 Systems thinker - you love solving complex problems")
            
            if "Full Stack Developer" in answer:
                personality_updates["adaptability"] = 9
                personality_updates["problem_solver"] = 9
                work_style_updates["thrives_in_chaos"] = 8
                insights.append("🚀 Versatile builder - you can handle anything thrown at you")
            
            if "DevOps Engineer" in answer:
                personality_updates["analytical"] = 9
                personality_updates["autonomous"] = 8
                work_style_updates["methodical"] = 8
                culture_updates["innovation_driven"] = 9
                insights.append("⚙️ Automation wizard - you optimize everything")
            
            if "Data Scientist" in answer:
                personality_updates["analytical"] = 10
                personality_updates["detail_oriented"] = 9
                work_style_updates["methodical"] = 9
                insights.append("📊 Data-driven decision maker - you find patterns others miss")
        
        # Analyze experience level
        elif question_id == "experience_level":
            if "Senior" in str(answer) or "Lead" in str(answer):
                personality_updates["leadership"] = 9
                personality_updates["communication"] = 8
                work_style_updates["independent"] = 7
                insights.append("👔 Leadership potential - you're ready to guide others")
            elif "Entry" in str(answer):
                personality_updates["adaptability"] = 8
                work_style_updates["early_adopter"] = 8
                insights.append("🌟 Growth mindset - you're eager to learn and adapt")
        
        # Analyze technical skills
        elif question_id == "technical_skills" and isinstance(answer, dict):
            skills_with_proficiency = {k: v for k, v in answer.items() if v and v != "None"}
            advanced_skills = [k for k, v in skills_with_proficiency.items() if v in ["Advanced", "Expert"]]
            
            if len(advanced_skills) >= 5:
                personality_updates["detail_oriented"] = 9
                personality_updates["problem_solver"] = 9
                insights.append("🔥 Deep expertise - you've mastered multiple technologies")
            
            if "React" in skills_with_proficiency or "Vue.js" in skills_with_proficiency:
                personality_updates["creativity"] = 7
                work_style_updates["early_adopter"] = 8
            
            if "Python" in skills_with_proficiency or "Node.js" in skills_with_proficiency:
                personality_updates["analytical"] = 8
                personality_updates["problem_solver"] = 8
            
            if "AWS" in skills_with_proficiency or "Docker" in skills_with_proficiency:
                personality_updates["innovative"] = 8
                culture_updates["innovation_driven"] = 9
                insights.append("☁️ Cloud-native thinker - you're ahead of the curve")
        
        # Analyze soft skills
        elif question_id == "soft_skills" and isinstance(answer, list):
            if "Leadership" in answer:
                personality_updates["leadership"] = 9
                personality_updates["communication"] = 8
                insights.append("👥 Natural leader - you inspire and guide teams")
            
            if "Communication" in answer:
                personality_updates["communication"] = 9
                work_style_updates["team_player"] = 8
                insights.append("💬 Strong communicator - you bridge gaps between teams")
            
            if "Problem Solving" in answer:
                personality_updates["problem_solver"] = 9
                personality_updates["analytical"] = 8
                insights.append("🧩 Problem-solving genius - you see solutions others don't")
            
            if "Creativity" in answer:
                personality_updates["creativity"] = 9
                work_style_updates["innovative"] = 8
                insights.append("✨ Creative innovator - you think outside the box")
        
        # Analyze time availability
        elif question_id == "time_availability":
            hours = int(answer) if isinstance(answer, (int, str)) else 5
            if hours >= 7:
                personality_updates["autonomous"] = 9
                work_style_updates["fast_paced"] = 8
                insights.append("⚡ High commitment - you're serious about growth")
            elif hours >= 5:
                personality_updates["adaptability"] = 8
                insights.append("📚 Balanced learner - you manage time effectively")
            else:
                work_style_updates["prefers_stable"] = 7
                insights.append("🎯 Focused approach - quality over quantity")
        
        # Analyze learning preferences
        elif question_id == "learning_preferences" and isinstance(answer, list):
            if "Online Courses" in answer:
                personality_updates["autonomous"] = 8
                work_style_updates["independent"] = 7
                insights.append("🎓 Self-directed learner - you take initiative")
            
            if "Mentorship" in answer:
                personality_updates["collaborative"] = 9
                work_style_updates["team_player"] = 8
                insights.append("🤝 Collaborative learner - you value connections")
            
            if "Bootcamps" in answer:
                work_style_updates["fast_paced"] = 9
                personality_updates["adaptability"] = 8
                insights.append("🚀 Intensive learner - you thrive under pressure")
        
        # Analyze location preferences
        elif question_id == "location_preferences" and isinstance(answer, list):
            if "Remote" in answer:
                personality_updates["autonomous"] = 9
                culture_updates["remote_first"] = 10
                work_style_updates["independent"] = 8
                insights.append("🏠 Remote-first - you value flexibility and autonomy")
            
            if "On-site" in answer:
                personality_updates["collaborative"] = 8
                culture_updates["office_collaboration"] = 9
                work_style_updates["team_player"] = 8
                insights.append("🏢 Office collaborator - you thrive in person-to-person interaction")
            
            if "Hybrid" in answer:
                personality_updates["adaptability"] = 9
                insights.append("🔄 Flexible worker - you adapt to different work styles")
        
        # Analyze new deep psychological questions
        elif question_id == "energy_source":
            if "Being around people" in str(answer):
                personality_updates["collaborative"] = 9
                personality_updates["communication"] = 8
                insights.append("⚡ Extraverted - you get energy from people")
            elif "Solo deep work" in str(answer):
                personality_updates["autonomous"] = 9
                work_style_updates["independent"] = 9
                insights.append("🔋 Introverted - you recharge with solo time")
            elif "mix" in str(answer).lower():
                personality_updates["adaptability"] = 9
                insights.append("🔄 Ambivert - you need both social and solo time")
        
        elif question_id == "decision_making":
            if "Analyze all the data" in str(answer):
                personality_updates["analytical"] = 9
                work_style_updates["methodical"] = 8
                insights.append("📊 Data-driven decision maker")
            elif "gut" in str(answer).lower():
                personality_updates["creativity"] = 8
                work_style_updates["fast_paced"] = 7
                insights.append("🎯 Intuitive decision maker - you trust your instincts")
            elif "Talk it through" in str(answer):
                personality_updates["collaborative"] = 9
                personality_updates["communication"] = 8
                insights.append("💬 Collaborative decision maker")
        
        elif question_id == "conflict_style":
            if "Call it out immediately" in str(answer):
                personality_updates["communication"] = 9
                insights.append("🗣️ Direct communicator - you address issues head-on")
            elif "Pull them aside privately" in str(answer):
                personality_updates["collaborative"] = 9
                insights.append("🤝 Diplomatic - you handle conflict with care")
            elif "Fix it yourself" in str(answer):
                personality_updates["problem_solver"] = 9
                personality_updates["autonomous"] = 8
                insights.append("🔧 Problem solver - you take action")
        
        elif question_id == "stress_response":
            if "hyper-focused" in str(answer).lower():
                personality_updates["problem_solver"] = 9
                work_style_updates["fast_paced"] = 8
                insights.append("⚡ High performer under pressure")
            elif "delegate" in str(answer).lower():
                personality_updates["leadership"] = 9
                personality_updates["communication"] = 8
                insights.append("👔 Natural leader - you coordinate under pressure")
            elif "walk" in str(answer).lower() or "breathe" in str(answer).lower():
                personality_updates["adaptability"] = 8
                insights.append("🧘 Calm under pressure - you manage stress well")
        
        elif question_id == "work_philosophy":
            if "all in" in str(answer).lower():
                work_style_updates["fast_paced"] = 9
                insights.append("🔥 High commitment - you're all in")
            elif "smart, not hard" in str(answer).lower():
                personality_updates["analytical"] = 8
                work_style_updates["methodical"] = 8
                insights.append("🧠 Efficiency-focused - you work smart")
            elif "balance" in str(answer).lower():
                insights.append("⚖️ Work-life balance advocate")
        
        elif question_id == "problem_approach":
            if "Break it down" in str(answer):
                personality_updates["analytical"] = 9
                work_style_updates["methodical"] = 9
                insights.append("🧩 Systematic problem solver")
            elif "Jump in and start coding" in str(answer):
                personality_updates["creativity"] = 8
                work_style_updates["fast_paced"] = 8
                insights.append("🚀 Action-oriented - you learn by doing")
            elif "Research" in str(answer):
                personality_updates["analytical"] = 8
                insights.append("📚 Research-first approach")
        
        elif question_id == "ideal_team_size":
            if "Solo" in str(answer):
                personality_updates["autonomous"] = 10
                work_style_updates["independent"] = 10
                insights.append("🎯 Solo worker - you do your best work alone")
            elif "2-3" in str(answer):
                personality_updates["collaborative"] = 8
                insights.append("👥 Small team preference - intimate collaboration")
            elif "10+" in str(answer):
                personality_updates["collaborative"] = 9
                insights.append("👨‍👩‍👧‍👦 Large team lover - you thrive in groups")
        
        elif question_id == "work_pace":
            if "Fast-paced" in str(answer):
                work_style_updates["fast_paced"] = 10
                work_style_updates["thrives_in_chaos"] = 8
                insights.append("⚡ Fast-paced environment - you move quickly")
            elif "Steady" in str(answer):
                work_style_updates["methodical"] = 9
                work_style_updates["prefers_structure"] = 8
                insights.append("🐢 Steady pace - quality over speed")
            elif "Chaotic" in str(answer):
                work_style_updates["thrives_in_chaos"] = 10
                personality_updates["adaptability"] = 9
                insights.append("🌪️ Organized chaos - you thrive in it")
        
        elif question_id == "primary_motivation":
            if "Money" in str(answer):
                insights.append("💰 Financial security is your driver")
            elif "Impact" in str(answer):
                personality_updates["problem_solver"] = 8
                insights.append("🌍 Impact-driven - you want to make a difference")
            elif "Learning" in str(answer):
                personality_updates["adaptability"] = 9
                insights.append("📚 Growth-oriented - you value learning")
            elif "Freedom" in str(answer):
                personality_updates["autonomous"] = 9
                insights.append("🕊️ Autonomy seeker - freedom is key")
        
        elif question_id == "imposter_syndrome":
            if "Never" in str(answer):
                personality_updates["confidence"] = 9
                insights.append("💪 High confidence - you know your worth")
            elif "Sometimes" in str(answer):
                insights.append("🤔 Self-aware - you recognize it but push through")
            elif "Often" or "Constantly" in str(answer):
                insights.append("💭 Self-reflective - you're aware of your growth areas")
        
        elif question_id == "code_review_scenario":
            if "Argue your case" in str(answer):
                personality_updates["communication"] = 8
                insights.append("💬 You stand up for your work")
            elif "Accept the feedback" in str(answer):
                personality_updates["collaborative"] = 8
                insights.append("🤝 You're open to feedback")
            elif "Request a discussion" in str(answer):
                personality_updates["communication"] = 9
                insights.append("🗣️ You seek understanding")
        
        elif question_id == "deadline_scenario":
            if "Work nights and weekends" in str(answer):
                work_style_updates["fast_paced"] = 9
                insights.append("🔥 High commitment - you'll do what it takes")
            elif "Push back" in str(answer):
                personality_updates["communication"] = 9
                insights.append("🛡️ You set boundaries and communicate")
            elif "Ship a minimal version" in str(answer):
                personality_updates["problem_solver"] = 9
                insights.append("🎯 Pragmatic - you ship what works")
        
        elif question_id == "biggest_fear":
            if "stuck" in str(answer).lower():
                personality_updates["adaptability"] = 8
                insights.append("🚀 Growth-focused - you fear stagnation")
            elif "good enough" in str(answer).lower():
                insights.append("💭 Self-aware - you're aware of imposter feelings")
            elif "burning out" in str(answer).lower():
                insights.append("⚖️ Balance-conscious - you protect your energy")
        
        elif question_id == "deal_breakers":
            if isinstance(answer, list):
                if "Toxic culture" in answer:
                    insights.append("🚫 You won't tolerate toxic environments")
                if "No work-life balance" in answer:
                    insights.append("⚖️ Work-life balance is non-negotiable")
                if "No growth opportunities" in answer:
                    personality_updates["adaptability"] = 8
                    insights.append("📈 Growth opportunities are essential")
        
        elif question_id == "coffee_vs_tea":
            if "Coffee" in str(answer):
                work_style_updates["fast_paced"] = 7
                insights.append("☕ Coffee person - you're wired for productivity")
            elif "Tea" in str(answer):
                work_style_updates["methodical"] = 7
                insights.append("🍵 Tea person - you prefer a calmer approach")
        
        elif question_id == "tabs_vs_spaces":
            if "Tabs" in str(answer):
                personality_updates["problem_solver"] = 7
                insights.append("😄 You have strong opinions (tabs are correct)")
            elif "Spaces" in str(answer):
                personality_updates["detail_oriented"] = 7
                insights.append("😄 You have strong opinions (spaces are correct)")
            elif "project uses" in str(answer).lower():
                personality_updates["adaptability"] = 8
                insights.append("🔄 Pragmatic - you adapt to team standards")
        
        # Update personality profile
        for trait, value in personality_updates.items():
            if trait in self.personality_traits:
                self.personality_traits[trait] = max(self.personality_traits[trait], value)
        
        for style, value in work_style_updates.items():
            if style in self.work_style:
                self.work_style[style] = max(self.work_style[style], value)
        
        for culture, value in culture_updates.items():
            if culture in self.culture_fit_indicators:
                self.culture_fit_indicators[culture] = max(self.culture_fit_indicators[culture], value)
        
        # Calculate personality profile summary
        personality_profile = self._calculate_personality_profile()
        work_style_profile = self._calculate_work_style_profile()
        culture_fit_profile = self._calculate_culture_fit_profile()
        
        return {
            "insights": insights,
            "personality_profile": personality_profile,
            "work_style_profile": work_style_profile,
            "culture_fit_profile": culture_fit_profile,
            "traits": self.personality_traits.copy(),
            "work_style": self.work_style.copy(),
            "culture_fit": self.culture_fit_indicators.copy()
        }
    
    def _calculate_personality_profile(self) -> Dict[str, Any]:
        """Calculate personality profile summary"""
        top_traits = sorted(
            self.personality_traits.items(),
            key=lambda x: x[1],
            reverse=True
        )[:3]
        
        personality_type = self._determine_personality_type()
        
        return {
            "type": personality_type,
            "top_traits": [{"trait": k, "score": v} for k, v in top_traits],
            "average_score": sum(self.personality_traits.values()) / len(self.personality_traits),
            "strengths": [k for k, v in top_traits if v >= 7]
        }
    
    def _determine_personality_type(self) -> str:
        """Determine personality type based on traits"""
        if self.personality_traits["problem_solver"] >= 8 and self.personality_traits["analytical"] >= 8:
            return "Analytical Problem Solver"
        elif self.personality_traits["creativity"] >= 8 and self.personality_traits["innovative"] >= 8:
            return "Creative Innovator"
        elif self.personality_traits["leadership"] >= 8 and self.personality_traits["communication"] >= 8:
            return "Natural Leader"
        elif self.personality_traits["autonomous"] >= 8 and self.personality_traits["adaptability"] >= 8:
            return "Independent Adaptor"
        elif self.personality_traits["collaborative"] >= 8 and self.personality_traits["communication"] >= 8:
            return "Collaborative Communicator"
        else:
            return "Balanced Professional"
    
    def _calculate_work_style_profile(self) -> Dict[str, Any]:
        """Calculate work style profile"""
        top_styles = sorted(
            self.work_style.items(),
            key=lambda x: x[1],
            reverse=True
        )[:3]
        
        work_style_type = self._determine_work_style_type()
        
        return {
            "type": work_style_type,
            "top_styles": [{"style": k, "score": v} for k, v in top_styles],
            "preferences": [k for k, v in top_styles if v >= 7]
        }
    
    def _determine_work_style_type(self) -> str:
        """Determine work style type"""
        if self.work_style["fast_paced"] >= 8 and self.work_style["thrives_in_chaos"] >= 7:
            return "Fast-Paced Chaos Navigator"
        elif self.work_style["methodical"] >= 8 and self.work_style["prefers_structure"] >= 7:
            return "Methodical Planner"
        elif self.work_style["team_player"] >= 8:
            return "Collaborative Team Player"
        elif self.work_style["independent"] >= 8:
            return "Independent Operator"
        else:
            return "Adaptable Professional"
    
    def _calculate_culture_fit_profile(self) -> Dict[str, Any]:
        """Calculate culture fit profile"""
        top_cultures = sorted(
            self.culture_fit_indicators.items(),
            key=lambda x: x[1],
            reverse=True
        )[:3]
        
        culture_type = self._determine_culture_type()
        
        return {
            "type": culture_type,
            "top_cultures": [{"culture": k, "score": v} for k, v in top_cultures],
            "best_fits": [k for k, v in top_cultures if v >= 7]
        }
    
    def _determine_culture_type(self) -> str:
        """Determine culture type"""
        if self.culture_fit_indicators["startup"] >= 8:
            return "Startup Culture"
        elif self.culture_fit_indicators["enterprise"] >= 8:
            return "Enterprise Culture"
        elif self.culture_fit_indicators["remote_first"] >= 9:
            return "Remote-First Culture"
        elif self.culture_fit_indicators["innovation_driven"] >= 8:
            return "Innovation-Driven Culture"
        else:
            return "Balanced Culture"
    
    def get_full_profile(self) -> Dict[str, Any]:
        """Get complete personality profile"""
        return {
            "personality": self._calculate_personality_profile(),
            "work_style": self._calculate_work_style_profile(),
            "culture_fit": self._calculate_culture_fit_profile(),
            "raw_traits": self.personality_traits.copy(),
            "raw_work_style": self.work_style.copy(),
            "raw_culture_fit": self.culture_fit_indicators.copy()
        }

