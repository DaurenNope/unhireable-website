from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, JSON, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.ext.mutable import MutableDict, MutableList
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


class QuestionStatus(str, enum.Enum):
    PENDING = "pending"
    ANSWERED = "answered"
    RESOLVED = "resolved"
    ARCHIVED = "archived"


class CohortRole(str, enum.Enum):
    MEMBER = "member"
    MODERATOR = "moderator"
    ADMIN = "admin"


class SquadRole(str, enum.Enum):
    MEMBER = "member"
    LEADER = "leader"


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(100))  # e.g., "career", "technical", "interview", "learning"
    tags = Column(MutableList.as_mutable(JSON), default=list)  # Array of tags
    status = Column(Enum(QuestionStatus), default=QuestionStatus.PENDING, index=True)
    views_count = Column(Integer, default=0)
    upvotes_count = Column(Integer, default=0)
    answers_count = Column(Integer, default=0)
    ai_answer = Column(Text)  # AI-generated answer
    ai_answer_confidence = Column(Integer)  # 0-100 confidence score
    ai_answer_metadata = Column(MutableDict.as_mutable(JSON), default=dict)  # Additional AI metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    resolved_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")
    upvotes = relationship("QuestionUpvote", back_populates="question", cascade="all, delete-orphan")


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    is_ai_generated = Column(Boolean, default=False)
    is_accepted = Column(Boolean, default=False)
    upvotes_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    question = relationship("Question", back_populates="answers")
    user = relationship("User", back_populates="answers")
    upvotes = relationship("AnswerUpvote", back_populates="answer", cascade="all, delete-orphan")


class QuestionUpvote(Base):
    __tablename__ = "question_upvotes"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    question = relationship("Question", back_populates="upvotes")
    user = relationship("User")
    
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )


class AnswerUpvote(Base):
    __tablename__ = "answer_upvotes"

    id = Column(Integer, primary_key=True, index=True)
    answer_id = Column(Integer, ForeignKey("answers.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    answer = relationship("Answer", back_populates="upvotes")
    user = relationship("User")
    
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )


class Cohort(Base):
    __tablename__ = "cohorts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    role_category = Column(String(100), index=True)  # e.g., "Frontend Developer", "Data Scientist"
    skill_level = Column(String(50))  # e.g., "Entry", "Mid", "Senior"
    max_members = Column(Integer, default=100)
    current_members_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    is_public = Column(Boolean, default=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    creator = relationship("User", foreign_keys=[created_by])
    members = relationship("CohortMembership", back_populates="cohort", cascade="all, delete-orphan")
    posts = relationship("CohortPost", back_populates="cohort", cascade="all, delete-orphan")


class CohortMembership(Base):
    __tablename__ = "cohort_memberships"

    id = Column(Integer, primary_key=True, index=True)
    cohort_id = Column(Integer, ForeignKey("cohorts.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    role = Column(Enum(CohortRole), default=CohortRole.MEMBER)
    joined_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    last_active_at = Column(DateTime(timezone=True))
    
    # Relationships
    cohort = relationship("Cohort", back_populates="members")
    user = relationship("User", back_populates="cohort_memberships")
    
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )


class CohortPost(Base):
    __tablename__ = "cohort_posts"

    id = Column(Integer, primary_key=True, index=True)
    cohort_id = Column(Integer, ForeignKey("cohorts.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(500))
    content = Column(Text, nullable=False)
    post_type = Column(String(50), default="discussion")  # e.g., "discussion", "resource", "announcement"
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    cohort = relationship("Cohort", back_populates="posts")
    user = relationship("User", back_populates="cohort_posts")
    comments = relationship("CohortPostComment", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("CohortPostLike", back_populates="post", cascade="all, delete-orphan")


class CohortPostComment(Base):
    __tablename__ = "cohort_post_comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("cohort_posts.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    likes_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    post = relationship("CohortPost", back_populates="comments")
    user = relationship("User")


class CohortPostLike(Base):
    __tablename__ = "cohort_post_likes"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("cohort_posts.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    post = relationship("CohortPost", back_populates="likes")
    user = relationship("User")
    
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )


class StudySquad(Base):
    __tablename__ = "study_squads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    learning_path_id = Column(Integer, ForeignKey("learning_paths.id"), nullable=True, index=True)
    skill_focus = Column(String(100))  # e.g., "React", "Python", "AWS"
    max_members = Column(Integer, default=5)
    current_members_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    is_public = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    scheduled_study_time = Column(String(100))  # e.g., "Monday 7pm", "Weekends"
    timezone = Column(String(50), default="UTC")
    
    # Relationships
    creator = relationship("User", foreign_keys=[created_by])
    learning_path = relationship("LearningPath", foreign_keys=[learning_path_id])
    members = relationship("SquadMembership", back_populates="squad", cascade="all, delete-orphan")
    sessions = relationship("StudySession", back_populates="squad", cascade="all, delete-orphan")


class SquadMembership(Base):
    __tablename__ = "squad_memberships"

    id = Column(Integer, primary_key=True, index=True)
    squad_id = Column(Integer, ForeignKey("study_squads.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    role = Column(Enum(SquadRole), default=SquadRole.MEMBER)
    joined_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    last_active_at = Column(DateTime(timezone=True))
    progress_shared = Column(Boolean, default=True)  # Whether user shares progress with squad
    
    # Relationships
    squad = relationship("StudySquad", back_populates="members")
    user = relationship("User", back_populates="squad_memberships")
    
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )


class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    squad_id = Column(Integer, ForeignKey("study_squads.id"), nullable=False, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    scheduled_at = Column(DateTime(timezone=True), index=True)
    started_at = Column(DateTime(timezone=True))
    ended_at = Column(DateTime(timezone=True))
    duration_minutes = Column(Integer)
    topic = Column(String(255))
    resources = Column(MutableList.as_mutable(JSON), default=list)  # Array of resource URLs
    attendees_count = Column(Integer, default=0)
    status = Column(String(50), default="scheduled")  # e.g., "scheduled", "in_progress", "completed", "cancelled"
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    squad = relationship("StudySquad", back_populates="sessions")
    creator = relationship("User", foreign_keys=[created_by])
    attendees = relationship("StudySessionAttendance", back_populates="session", cascade="all, delete-orphan")


class StudySessionAttendance(Base):
    __tablename__ = "study_session_attendances"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("study_sessions.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    left_at = Column(DateTime(timezone=True))
    participation_score = Column(Integer)  # 0-100 based on engagement
    notes = Column(Text)
    
    # Relationships
    session = relationship("StudySession", back_populates="attendees")
    user = relationship("User")
    
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )


