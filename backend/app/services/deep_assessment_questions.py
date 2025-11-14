"""Deep, psychological, well-thought-out assessment questions"""

from typing import List, Dict, Any


def get_deep_assessment_questions() -> List[Dict[str, Any]]:
    """
    Comprehensive assessment with deep psychological questions
    that explore personality, vibes, preferences, and work style
    """
    
    return [
        # SECTION 1: PERSONALITY & VIBES
        {
            "id": "energy_source",
            "type": "single_choice",
            "question": "Where do you get your energy from?",
            "options": [
                "Being around people and collaborating",
                "Solo deep work sessions",
                "A mix - I need both to function",
                "I'm an energy vampire, I drain others"
            ],
            "category": "personality",
            "required": True,
            "psychological_trait": "introversion_extraversion"
        },
        {
            "id": "decision_making",
            "type": "single_choice",
            "question": "When making a big decision, you:",
            "options": [
                "Analyze all the data, create spreadsheets, then decide",
                "Go with your gut and figure it out as you go",
                "Talk it through with trusted people first",
                "Flip a coin and commit fully to whatever it says"
            ],
            "category": "personality",
            "required": True,
            "psychological_trait": "decision_style"
        },
        {
            "id": "conflict_style",
            "type": "single_choice",
            "question": "Someone on your team ships broken code to production. You:",
            "options": [
                "Call it out immediately in the team chat",
                "Pull them aside privately to discuss",
                "Fix it yourself and mention it later",
                "Document it and bring it up in retro"
            ],
            "category": "personality",
            "required": True,
            "psychological_trait": "conflict_handling"
        },
        {
            "id": "stress_response",
            "type": "single_choice",
            "question": "When everything is on fire and deadlines are tight, you:",
            "options": [
                "Become hyper-focused and get shit done",
                "Panic but somehow still deliver",
                "Delegate and coordinate like a boss",
                "Take a walk, breathe, then tackle it systematically"
            ],
            "category": "personality",
            "required": True,
            "psychological_trait": "stress_management"
        },
        {
            "id": "work_philosophy",
            "type": "single_choice",
            "question": "Your work philosophy is closest to:",
            "options": [
                "Work hard, play hard - I'm all in",
                "Work smart, not hard - efficiency is key",
                "Work-life balance is non-negotiable",
                "Work is just a means to fund my real passions"
            ],
            "category": "values",
            "required": True,
            "psychological_trait": "work_values"
        },
        
        # SECTION 2: COMMUNICATION & COLLABORATION
        {
            "id": "communication_style",
            "type": "multi_select",
            "question": "How do you prefer to communicate? (Select all that apply)",
            "options": [
                "Slack/Discord - async, written, searchable",
                "Video calls - face-to-face, real-time",
                "In-person - nothing beats being there",
                "Documentation - write it down, read it later",
                "Pair programming - live collaboration",
                "I prefer to communicate through code comments"
            ],
            "category": "communication",
            "required": True,
            "psychological_trait": "communication_preference"
        },
        {
            "id": "feedback_preference",
            "type": "single_choice",
            "question": "You prefer feedback that is:",
            "options": [
                "Direct and honest, even if it hurts",
                "Constructive and wrapped in kindness",
                "Written down so I can process it",
                "Given in real-time as we work together"
            ],
            "category": "communication",
            "required": True,
            "psychological_trait": "feedback_style"
        },
        {
            "id": "meeting_vibe",
            "type": "single_choice",
            "question": "Your ideal meeting is:",
            "options": [
                "Quick standup, 15 min max, action items only",
                "Deep dive session, 2+ hours, whiteboard everything",
                "Social check-in, build relationships",
                "Could this have been an email? Yes, always"
            ],
            "category": "communication",
            "required": True,
            "psychological_trait": "meeting_preference"
        },
        
        # SECTION 3: PROBLEM-SOLVING & THINKING
        {
            "id": "problem_approach",
            "type": "single_choice",
            "question": "When faced with a complex problem, you:",
            "options": [
                "Break it down into smaller pieces and solve systematically",
                "Jump in and start coding, figure it out as you go",
                "Research similar solutions first, then adapt",
                "Ask for help - no shame in collaboration"
            ],
            "category": "problem_solving",
            "required": True,
            "psychological_trait": "problem_solving_style"
        },
        {
            "id": "debugging_philosophy",
            "type": "single_choice",
            "question": "Your debugging philosophy:",
            "options": [
                "Print statements everywhere until it works",
                "Read the error message carefully, then Google",
                "Use a debugger and step through line by line",
                "Rewrite it from scratch - the old code was cursed"
            ],
            "category": "problem_solving",
            "required": True,
            "psychological_trait": "debugging_style"
        },
        {
            "id": "innovation_vs_stability",
            "type": "slider",
            "question": "On a scale of 1-10, how much do you value innovation vs stability?",
            "min": 1,
            "max": 10,
            "default": 5,
            "labels": {
                "1": "Stability - proven solutions only",
                "10": "Innovation - let's try the new thing"
            },
            "category": "values",
            "required": True,
            "psychological_trait": "innovation_preference"
        },
        
        # SECTION 4: WORK ENVIRONMENT & CULTURE
        {
            "id": "ideal_team_size",
            "type": "single_choice",
            "question": "Your ideal team size is:",
            "options": [
                "Solo - I work best alone",
                "2-3 people - small, tight-knit",
                "5-7 people - perfect balance",
                "10+ people - the more the merrier"
            ],
            "category": "work_environment",
            "required": True,
            "psychological_trait": "team_size_preference"
        },
        {
            "id": "work_pace",
            "type": "single_choice",
            "question": "You thrive in environments that are:",
            "options": [
                "Fast-paced, ship fast, break things",
                "Steady and methodical, quality over speed",
                "Chaotic but fun - organized chaos",
                "Structured with clear processes"
            ],
            "category": "work_environment",
            "required": True,
            "psychological_trait": "work_pace_preference"
        },
        {
            "id": "company_stage",
            "type": "multi_select",
            "question": "What company stages excite you?",
            "options": [
                "Pre-seed/Seed - build from scratch",
                "Series A/B - product-market fit, scaling",
                "Series C+ - established, optimizing",
                "Enterprise - big company, big problems",
                "I don't care about stage, just the work"
            ],
            "category": "work_environment",
            "required": True,
            "psychological_trait": "company_stage_preference"
        },
        {
            "id": "remote_vibe",
            "type": "single_choice",
            "question": "Your ideal remote setup:",
            "options": [
                "Fully remote, never see anyone",
                "Remote with quarterly team meetups",
                "Hybrid - 2-3 days in office",
                "Fully in-office - I need the energy"
            ],
            "category": "work_environment",
            "required": True,
            "psychological_trait": "remote_preference"
        },
        
        # SECTION 5: LEARNING & GROWTH
        {
            "id": "learning_style",
            "type": "multi_select",
            "question": "How do you learn best?",
            "options": [
                "Hands-on - build something real",
                "Reading docs and tutorials",
                "Video courses with projects",
                "Pair programming with someone better",
                "Trial and error - break things to learn",
                "Formal education - structured courses"
            ],
            "category": "learning",
            "required": True,
            "psychological_trait": "learning_style"
        },
        {
            "id": "skill_prioritization",
            "type": "single_choice",
            "question": "When learning new skills, you prioritize:",
            "options": [
                "Depth - master one thing completely",
                "Breadth - know a little about everything",
                "Market demand - what's hot right now",
                "Personal interest - what excites me"
            ],
            "category": "learning",
            "required": True,
            "psychological_trait": "learning_priority"
        },
        {
            "id": "failure_response",
            "type": "single_choice",
            "question": "When you fail at something, you:",
            "options": [
                "Analyze what went wrong and try again",
                "Feel bad for a bit, then move on",
                "Ask for help and learn from others",
                "Pivot to something else - maybe it wasn't meant to be"
            ],
            "category": "learning",
            "required": True,
            "psychological_trait": "failure_response"
        },
        
        # SECTION 6: MOTIVATION & VALUES
        {
            "id": "primary_motivation",
            "type": "single_choice",
            "question": "What motivates you most?",
            "options": [
                "Money and financial security",
                "Impact and making a difference",
                "Learning and personal growth",
                "Recognition and career advancement",
                "Freedom and autonomy",
                "Solving interesting problems"
            ],
            "category": "motivation",
            "required": True,
            "psychological_trait": "primary_motivation"
        },
        {
            "id": "work_life_balance",
            "type": "slider",
            "question": "How important is work-life balance to you?",
            "min": 1,
            "max": 10,
            "default": 7,
            "labels": {
                "1": "Work is life",
                "10": "Work stays at work"
            },
            "category": "values",
            "required": True,
            "psychological_trait": "work_life_balance"
        },
        {
            "id": "risk_tolerance",
            "type": "single_choice",
            "question": "Your risk tolerance:",
            "options": [
                "High - I'll take a chance on a startup",
                "Medium - established company with growth",
                "Low - I need stability and security",
                "Depends on the opportunity"
            ],
            "category": "values",
            "required": True,
            "psychological_trait": "risk_tolerance"
        },
        
        # SECTION 7: CAREER INTERESTS (Enhanced)
        {
            "id": "career_interests",
            "type": "multi_select",
            "question": "Which career paths genuinely interest you? (Be honest, not what you think you should say)",
            "options": [
                "Frontend Developer - building beautiful UIs",
                "Backend Developer - systems and APIs",
                "Full Stack Developer - everything",
                "DevOps Engineer - infrastructure and automation",
                "Data Scientist - insights from data",
                "Machine Learning Engineer - AI and models",
                "Product Manager - strategy and vision",
                "UI/UX Designer - user experience",
                "Mobile Developer - iOS/Android",
                "Cybersecurity Specialist - security first",
                "Technical Writer - documentation and clarity",
                "Engineering Manager - leading teams"
            ],
            "category": "career",
            "required": True,
            "psychological_trait": "career_interests"
        },
        {
            "id": "experience_level",
            "type": "single_choice",
            "question": "What's your actual experience level? (Be real with yourself)",
            "options": [
                "Entry Level (0-2 years) - still learning",
                "Mid Level (2-5 years) - getting comfortable",
                "Senior Level (5+ years) - I know things",
                "Lead/Principal Level - I architect solutions"
            ],
            "category": "career",
            "required": True,
            "psychological_trait": "experience_level"
        },
        
        # SECTION 8: TECHNICAL SKILLS (Enhanced with context)
        {
            "id": "technical_skills",
            "type": "skill_selector",
            "question": "What are your technical skills? Rate your proficiency honestly (we'll know if you're lying)",
            "skills": [
                "JavaScript", "TypeScript", "Python", "Java", "C#", "Go", "Rust",
                "React", "Vue.js", "Angular", "Next.js", "Svelte",
                "Node.js", "Django", "Flask", "FastAPI", "Express",
                "HTML", "CSS", "TailwindCSS", "SASS", "Styled Components",
                "SQL", "MongoDB", "PostgreSQL", "Redis", "GraphQL",
                "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes",
                "Git", "Linux", "CI/CD", "Terraform", "Ansible",
                "Agile/Scrum", "TDD", "Microservices", "REST APIs"
            ],
            "proficiency_levels": ["Beginner", "Intermediate", "Advanced", "Expert"],
            "category": "technical",
            "required": True,
            "psychological_trait": "technical_skills"
        },
        
        # SECTION 9: SOFT SKILLS & PERSONALITY
        {
            "id": "soft_skills",
            "type": "multi_select",
            "question": "What soft skills do you actually have? (Not what you put on LinkedIn)",
            "options": [
                "Communication - I can explain complex things simply",
                "Leadership - people follow my lead",
                "Problem Solving - I see solutions others miss",
                "Teamwork - I make teams better",
                "Time Management - I ship on time",
                "Critical Thinking - I question everything",
                "Creativity - I think outside the box",
                "Adaptability - I roll with changes",
                "Project Management - I get things done",
                "Mentoring - I help others grow",
                "Public Speaking - I can present",
                "Negotiation - I get what I want"
            ],
            "category": "personality",
            "required": False,
            "psychological_trait": "soft_skills"
        },
        {
            "id": "imposter_syndrome",
            "type": "single_choice",
            "question": "How often do you experience imposter syndrome?",
            "options": [
                "Never - I know I'm good",
                "Sometimes - but I push through",
                "Often - but I'm working on it",
                "Constantly - it's part of my identity"
            ],
            "category": "personality",
            "required": True,
            "psychological_trait": "imposter_syndrome"
        },
        
        # SECTION 10: SCENARIOS & SITUATIONS
        {
            "id": "code_review_scenario",
            "type": "single_choice",
            "question": "Someone requests changes on your PR that you disagree with. You:",
            "options": [
                "Argue your case with data and examples",
                "Accept the feedback and move on",
                "Request a discussion to understand their perspective",
                "Merge anyway and deal with it later (jk, don't do this)"
            ],
            "category": "scenarios",
            "required": True,
            "psychological_trait": "conflict_resolution"
        },
        {
            "id": "deadline_scenario",
            "type": "single_choice",
            "question": "Your manager asks you to ship a feature in 2 days that normally takes 2 weeks. You:",
            "options": [
                "Work nights and weekends to make it happen",
                "Push back and negotiate a realistic timeline",
                "Ship a minimal version and iterate",
                "Explain the trade-offs and let them decide"
            ],
            "category": "scenarios",
            "required": True,
            "psychological_trait": "boundary_setting"
        },
        {
            "id": "legacy_code_scenario",
            "type": "single_choice",
            "question": "You inherit a codebase that's a mess. Your approach:",
            "options": [
                "Refactor everything immediately",
                "Understand it first, then refactor incrementally",
                "Work around it and build new features properly",
                "Document it and move on"
            ],
            "category": "scenarios",
            "required": True,
            "psychological_trait": "code_quality_philosophy"
        },
        
        # SECTION 11: PREFERENCES & VIBES
        {
            "id": "time_availability",
            "type": "slider",
            "question": "How many hours per day can you realistically dedicate to learning?",
            "min": 0,
            "max": 10,
            "default": 2,
            "category": "preferences",
            "required": True,
            "psychological_trait": "learning_commitment"
        },
        {
            "id": "learning_preferences",
            "type": "multi_select",
            "question": "How do you prefer to learn? (Select all that apply)",
            "options": [
                "Online Courses - structured learning",
                "Local Classes - in-person community",
                "Bootcamps - intensive immersion",
                "Self-study - books and docs",
                "Certifications - official credentials",
                "Workshops - hands-on sessions",
                "Mentorship - learn from experts",
                "Video Tutorials - YouTube and courses",
                "Building Projects - learn by doing",
                "Open Source - contribute and learn"
            ],
            "category": "preferences",
            "required": True,
            "psychological_trait": "learning_preferences"
        },
        {
            "id": "location_preferences",
            "type": "multi_select",
            "question": "Where do you want to work?",
            "options": [
                "Remote - anywhere in the world",
                "On-site - I need the office vibe",
                "Hybrid - best of both worlds",
                "I'm flexible - whatever works"
            ],
            "category": "preferences",
            "required": True,
            "psychological_trait": "location_preference"
        },
        {
            "id": "salary_vs_other",
            "type": "single_choice",
            "question": "What matters more to you?",
            "options": [
                "Salary - money talks",
                "Equity - I want a piece of the pie",
                "Work-life balance - time is money",
                "Learning opportunities - invest in growth",
                "Company culture - I need to fit in",
                "Impact - I want to make a difference"
            ],
            "category": "preferences",
            "required": True,
            "psychological_trait": "compensation_priority"
        },
        
        # SECTION 12: DEEP REFLECTION
        {
            "id": "career_goals",
            "type": "text_input",
            "question": "What do you actually want from your career? (Be honest, no one's judging)",
            "placeholder": "e.g., I want to build products that millions use, or I want financial freedom, or I want to learn everything...",
            "category": "reflection",
            "required": False,
            "psychological_trait": "career_goals"
        },
        {
            "id": "biggest_fear",
            "type": "single_choice",
            "question": "Your biggest career fear is:",
            "options": [
                "Being stuck in a dead-end job",
                "Not being good enough",
                "Missing out on opportunities",
                "Burning out",
                "Not making enough money",
                "Being replaced by AI"
            ],
            "category": "reflection",
            "required": True,
            "psychological_trait": "career_fears"
        },
        {
            "id": "ideal_day",
            "type": "text_input",
            "question": "Describe your ideal work day (be specific)",
            "placeholder": "e.g., Wake up at 8am, coffee, code for 4 hours, lunch with team, review PRs, ship something, done by 5pm...",
            "category": "reflection",
            "required": False,
            "psychological_trait": "ideal_workday"
        },
        {
            "id": "deal_breakers",
            "type": "multi_select",
            "question": "What are your deal breakers? (Things that would make you quit)",
            "options": [
                "Toxic culture or bad management",
                "No work-life balance",
                "Outdated tech stack",
                "No growth opportunities",
                "Low pay",
                "No remote option",
                "Micromanagement",
                "No clear product vision",
                "Nothing - I'm flexible"
            ],
            "category": "reflection",
            "required": True,
            "psychological_trait": "deal_breakers"
        },
        
        # SECTION 13: FUN & PERSONALITY
        {
            "id": "coffee_vs_tea",
            "type": "single_choice",
            "question": "Coffee or tea? (This is important)",
            "options": [
                "Coffee - black, no sugar, maximum efficiency",
                "Tea - sophisticated and calming",
                "Both - depends on the mood",
                "Neither - I'm powered by pure will"
            ],
            "category": "fun",
            "required": True,
            "psychological_trait": "beverage_preference"
        },
        {
            "id": "music_while_coding",
            "type": "single_choice",
            "question": "Do you listen to music while coding?",
            "options": [
                "Yes - lo-fi beats or electronic",
                "Yes - metal/rock for focus",
                "Yes - podcasts or audiobooks",
                "No - I need silence",
                "Depends on the task"
            ],
            "category": "fun",
            "required": True,
            "psychological_trait": "focus_style"
        },
        {
            "id": "tabs_vs_spaces",
            "type": "single_choice",
            "question": "Tabs or spaces? (The eternal question)",
            "options": [
                "Tabs - obviously",
                "Spaces - 2 or 4, I'm flexible",
                "Whatever the project uses",
                "I use both and cause chaos"
            ],
            "category": "fun",
            "required": True,
            "psychological_trait": "code_style_preference"
        },
        {
            "id": "favorite_thing_about_coding",
            "type": "text_input",
            "question": "What's your favorite thing about coding? (One sentence)",
            "placeholder": "e.g., The moment when everything clicks and works, or solving puzzles, or building something from nothing...",
            "category": "fun",
            "required": False,
            "psychological_trait": "coding_motivation"
        }
    ]


def get_question_categories() -> List[str]:
    """Get all question categories"""
    return [
        "personality",
        "communication",
        "problem_solving",
        "work_environment",
        "learning",
        "motivation",
        "career",
        "technical",
        "scenarios",
        "preferences",
        "reflection",
        "fun"
    ]


def get_psychological_traits() -> List[str]:
    """Get all psychological traits being measured"""
    return [
        "introversion_extraversion",
        "decision_style",
        "conflict_handling",
        "stress_management",
        "work_values",
        "communication_preference",
        "feedback_style",
        "meeting_preference",
        "problem_solving_style",
        "debugging_style",
        "innovation_preference",
        "team_size_preference",
        "work_pace_preference",
        "company_stage_preference",
        "remote_preference",
        "learning_style",
        "learning_priority",
        "failure_response",
        "primary_motivation",
        "work_life_balance",
        "risk_tolerance",
        "career_interests",
        "experience_level",
        "technical_skills",
        "soft_skills",
        "imposter_syndrome",
        "conflict_resolution",
        "boundary_setting",
        "code_quality_philosophy",
        "learning_commitment",
        "learning_preferences",
        "location_preference",
        "compensation_priority",
        "career_goals",
        "career_fears",
        "ideal_workday",
        "deal_breakers",
        "beverage_preference",
        "focus_style",
        "code_style_preference",
        "coding_motivation"
    ]


