"""
Service for generating thoughtful, natural contextual messages between assessment questions.
Makes the structured assessment feel more like a conversation with a career counselor.
"""

from typing import Dict, Any, Optional, List


def get_contextual_message(
    current_question_id: str,
    previous_answers: Dict[str, Any],
    question_number: int,
    total_questions: int
) -> Optional[str]:
    """
    Generate a thoughtful contextual message before showing the next question.
    Makes the assessment feel more conversational and less robotic.
    """
    
    # Progress-based messages
    progress = (question_number / total_questions) * 100
    
    if question_number == 1:
        return None  # First question, no context needed
    
    # Early stage (0-25%)
    if progress <= 25:
        if current_question_id == "energy_source":
            return "Great start! Now I want to understand something deeper about you - where you get your energy from. This tells me a lot about your work style."
        elif current_question_id == "decision_making":
            return "Interesting! Let's dive deeper. When you face a big decision, what's your process? This helps me understand how you think."
        elif current_question_id == "conflict_style":
            return "I'm getting a good picture of you. Now, let's talk about how you handle disagreements - this is crucial for finding the right team culture."
        elif current_question_id == "stress_response":
            return "Everyone handles pressure differently. When everything's on fire, what's your go-to move? This helps me understand your resilience."
        elif current_question_id == "work_philosophy":
            return "We're getting somewhere. What's your core philosophy when it comes to work? This is about what drives you beyond the paycheck."
    
    # Mid stage (25-50%)
    elif progress <= 50:
        if current_question_id == "problem_approach":
            return "You're doing great. Now, when you encounter a complex problem, what's your first instinct? I want to understand your problem-solving style."
        elif current_question_id == "ideal_team_size":
            return "Let's talk about your ideal team. How many people are in your perfect squad? This helps me match you with the right company culture."
        elif current_question_id == "work_pace":
            return "What kind of work pace makes you thrive? Some people love the chaos, others need structure. Where do you fall?"
        elif current_question_id == "primary_motivation":
            return "Beyond a paycheck, what truly motivates you in a role? This is about finding work that actually matters to you."
        elif current_question_id == "imposter_syndrome":
            return "Be honest with me - how often do you feel like an imposter? This is super common, and I want to understand how it affects you."
    
    # Late stage (50-75%)
    elif progress <= 75:
        if current_question_id == "code_review_scenario":
            return "We're in the home stretch. Let's talk about a real scenario: your code gets heavily criticized in a review. How do you react?"
        elif current_question_id == "deadline_scenario":
            return "Almost there! Here's another scenario: a critical deadline is approaching and you're behind. What's your move?"
        elif current_question_id == "biggest_fear":
            return "Let's get real for a moment. What's your biggest career fear? Understanding this helps me find opportunities that address it."
        elif current_question_id == "deal_breakers":
            return "What are your absolute deal-breakers in a job or company? These are non-negotiables, and I need to know them."
        elif current_question_id == "coffee_vs_tea":
            return "Alright, let's lighten things up. Quick one: Coffee or Tea? (This actually tells me about your work style preferences!)"
    
    # Final stage (75-100%)
    else:
        if current_question_id == "tabs_vs_spaces":
            return "We're almost done! The age-old debate: Tabs or Spaces? (I'm not judging... much.)"
        elif current_question_id == "music_while_coding":
            return "Final questions! Do you listen to music while coding? If so, what's your go-to genre? This tells me about your focus style."
        elif current_question_id == "favorite_thing_about_coding":
            return "Last one! What's your absolute favorite thing about coding? I want to end on a positive note."
    
    # Fallback: Generic contextual messages based on question category
    if "energy" in current_question_id or "source" in current_question_id:
        return "Let's talk about what energizes you. This is important for finding the right work environment."
    elif "decision" in current_question_id or "making" in current_question_id:
        return "I want to understand how you make decisions. This helps me see your thinking process."
    elif "conflict" in current_question_id or "disagreement" in current_question_id:
        return "How you handle conflict says a lot about your communication style. Let's explore this."
    elif "stress" in current_question_id or "pressure" in current_question_id:
        return "Everyone handles stress differently. I want to understand your approach."
    elif "philosophy" in current_question_id or "values" in current_question_id:
        return "What drives you beyond the technical work? Let's talk about your values."
    elif "team" in current_question_id or "collaboration" in current_question_id:
        return "Team dynamics matter. Let's understand your ideal working environment."
    elif "motivation" in current_question_id or "drive" in current_question_id:
        return "What gets you excited about work? This is about finding roles that align with your passions."
    elif "fear" in current_question_id or "worry" in current_question_id:
        return "Let's be honest about what worries you. Understanding fears helps me find opportunities that address them."
    elif "deal" in current_question_id or "breaker" in current_question_id:
        return "What are your non-negotiables? These are crucial for finding the right fit."
    elif "scenario" in current_question_id or "situation" in current_question_id:
        return "Let's talk about a real scenario. How would you handle this situation?"
    
    # Very generic fallback
    if question_number < total_questions / 2:
        return "Great progress! Let's continue."
    else:
        return "We're getting close to the end. Just a few more questions."


def get_encouragement_message(
    question_number: int,
    total_questions: int,
    answer_quality: Optional[str] = None
) -> Optional[str]:
    """
    Generate encouraging messages based on progress.
    Makes users feel supported throughout the assessment.
    """
    progress = (question_number / total_questions) * 100
    
    if progress <= 20:
        return "You're doing great! These early questions help me understand the foundation of who you are."
    elif progress <= 40:
        return "Keep going! I'm getting a really clear picture of your work style and preferences."
    elif progress <= 60:
        return "Halfway there! Your answers are helping me build a comprehensive profile."
    elif progress <= 80:
        return "Almost done! These final questions will help me fine-tune your perfect matches."
    else:
        return "Final stretch! You're almost there. These last questions are crucial for accuracy."
    
    return None


def get_answer_acknowledgment(
    question_id: str,
    answer: Any,
    previous_answers: Dict[str, Any]
) -> Optional[str]:
    """
    Generate brief acknowledgments of user answers.
    Makes the assessment feel more conversational.
    """
    # Only acknowledge certain types of answers to avoid being repetitive
    if question_id == "career_interests":
        if isinstance(answer, list) and len(answer) > 0:
            if "Frontend" in str(answer):
                return "Frontend development - nice! You're into the user experience side of things."
            elif "Backend" in str(answer):
                return "Backend development - you're the one building the systems that power everything."
            elif "Full Stack" in str(answer):
                return "Full stack - you like seeing the whole picture. That's valuable."
    
    elif question_id == "energy_source":
        if "people" in str(answer).lower() or "collaborat" in str(answer).lower():
            return "You get energy from people - that's great for team environments."
        elif "solo" in str(answer).lower() or "quiet" in str(answer).lower():
            return "You recharge with solo time - that's important for finding the right work setup."
        elif "mix" in str(answer).lower():
            return "You need both - that's actually really balanced and adaptable."
    
    elif question_id == "decision_making":
        if "data" in str(answer).lower() or "analyze" in str(answer).lower():
            return "You're analytical - you like to think things through carefully."
        elif "gut" in str(answer).lower() or "intuition" in str(answer).lower():
            return "You trust your intuition - that's a valuable skill in fast-moving environments."
        elif "talk" in str(answer).lower() or "advisor" in str(answer).lower():
            return "You seek input from others - that shows strong collaboration skills."
    
    return None

