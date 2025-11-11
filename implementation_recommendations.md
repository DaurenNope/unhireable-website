# Implementation Recommendations for Unhireable Website

This document provides detailed implementation guidance for addressing the issues identified in the codebase analysis.

## 1. Authentication Implementation (High Priority)

### Backend Authentication Service

Create `backend/app/services/auth.py`:

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = "your-secret-key-here"  # Use environment variable in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate password hash."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get current user from JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

def authenticate_user(db: Session, email: str, password: str):
    """Authenticate user with email and password."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user
```

### Update Authentication Router

Update `backend/app/routers/auth.py`:

```python
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.models.user import User
from app.services.auth import (
    authenticate_user, create_access_token, get_password_hash,
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter()

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str = None

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

@router.post("/register", response_model=Token)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        is_active=True,
        is_verified=False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id)}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.post("/login", response_model=Token)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    """Login user and return token"""
    authenticated_user = authenticate_user(db, user.email, user.password)
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(authenticated_user.id)}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified
    }
```

### Frontend Authentication Context

Create `frontend/src/contexts/AuthContext.tsx`:

```typescript
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      // Validate token and get user info
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem('auth_token');
        setToken(null);
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    setToken(data.access_token);
    localStorage.setItem('auth_token', data.access_token);
    
    // Get user info
    const userResponse = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${data.access_token}`
      }
    });
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      setUser(userData);
    }
  };

  const register = async (email: string, password: string, full_name: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, full_name }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    setToken(data.access_token);
    localStorage.setItem('auth_token', data.access_token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

## 2. Fix Navigation Component (High Priority)

### Correct the Navigation Component

Update `frontend/src/components/main-nav.tsx`:

```typescript
"use client";

import Link from "next/link";
import {
  Home,
  FileText,
  Settings,
  User,
  Bell,
  Search,
  Menu,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export function MainNav() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-black/90 backdrop-blur-sm border-b border-neutral-800 sticky top-0 z-50 px-4 py-3">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full w-2 h-2 flex items-center justify-center">
              <span className="text-white font-bold text-xs">UN</span>
            </div>
            <div className="bg-white rounded-full p-1">
              <span className="text-black font-bold text-xs">HIREABLE</span>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link 
            href="/" 
            className="text-white/90 hover:text-white transition-colors flex items-center px-3 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 hover:border-white motion-safe-hover:scale-105"
          >
            <Home className="mr-2 h-4" />
            Dashboard
          </Link>
          
          <Link 
            href="/matches" 
            className="text-white/90 hover:text-white transition-colors flex items-center px-3 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 hover:border-white motion-safe-hover:scale-105"
          >
            <Search className="mr-2 h-4" />
            Matches
          </Link>
          
          <Link 
            href="/demo" 
            className="text-white/90 hover:text-white transition-colors flex items-center px-3 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 hover:border-white motion-safe-hover:scale-105"
          >
            <FileText className="mr-2 h-4" />
            Assessment
          </Link>
          
          <Link 
            href="/learning-paths" 
            className="text-white/90 hover:text-white transition-colors flex items-center px-3 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 hover:border-white motion-safe-hover:scale-105"
          >
            <FileText className="mr-2 h-4" />
            Learning
          </Link>
          
          <Link 
            href="/resume" 
            className="text-white/90 hover:text-white transition-colors flex items-center px-3 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 hover:border-white motion-safe-hover:scale-105"
          >
            <FileText className="mr-2 h-4" />
            Resume
          </Link>
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-white/90 text-sm">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="text-white/90 hover:text-white transition-colors px-3 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="text-cyan-400 hover:text-cyan-300 transition-colors px-4 py-2 rounded-lg border border-cyan-400 hover:bg-cyan-400 hover:text-black font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default MainNav;
```

## 3. Implement Service Layer (High Priority)

### Create Assessment Service

Create `backend/app/services/assessment.py`:

```python
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.assessment import Assessment, UserSkill
from app.models.job import Job
from app.models.user import User
import json

class AssessmentService:
    def __init__(self, db: Session):
        self.db = db

    def start_assessment(self, user_id: str) -> Dict[str, Any]:
        """Start a new assessment or resume existing one"""
        existing_assessment = self.db.query(Assessment).filter(
            Assessment.user_id == user_id
        ).first()
        
        if existing_assessment:
            return {
                "message": "Assessment resumed",
                "current_question": self._get_current_question(existing_assessment),
                "assessment_id": existing_assessment.id
            }
        
        # Create new assessment
        assessment = Assessment(user_id=user_id)
        self.db.add(assessment)
        self.db.commit()
        self.db.refresh(assessment)
        
        return {
            "message": "Assessment started",
            "current_question": 0,
            "assessment_id": assessment.id,
            "total_questions": len(self._get_assessment_questions())
        }

    def save_answer(self, user_id: str, question_id: str, answer: Any) -> Dict[str, Any]:
        """Save an answer to a specific question"""
        assessment = self.db.query(Assessment).filter(
            Assessment.user_id == user_id
        ).first()
        
        if not assessment:
            raise ValueError("Assessment not found")
        
        # Update assessment with answer
        if not assessment.career_interests:
            assessment.career_interests = {}
        
        assessment.career_interests[question_id] = answer
        self.db.commit()
        
        # Generate intelligent follow-up
        followup = self._generate_followup_question(question_id, answer, assessment.career_interests)
        
        return {
            "answer_saved": True,
            "followup_question": followup,
            "next_question": self._get_next_question(assessment)
        }

    def complete_assessment(self, user_id: str, all_answers: Dict[str, Any]) -> Dict[str, Any]:
        """Complete the assessment and save all answers"""
        assessment = self.db.query(Assessment).filter(
            Assessment.user_id == user_id
        ).first()
        
        if not assessment:
            raise ValueError("Assessment not found")
        
        # Save all answers
        assessment.career_interests = all_answers
        
        # Process and save skills separately
        if "technical_skills" in all_answers:
            self._save_user_skills(user_id, all_answers["technical_skills"])
        
        # Mark as completed
        from datetime import datetime, timezone
        assessment.assessment_completed_at = datetime.now(timezone.utc)
        assessment.experience_level = all_answers.get("experience_level")
        assessment.career_goals = all_answers.get("career_goals")
        assessment.location_preferences = all_answers.get("location_preferences", [])
        assessment.learning_preferences = {"preferences": all_answers.get("learning_preferences", [])}
        
        self.db.commit()
        
        return {
            "message": "Assessment completed successfully",
            "assessment_id": assessment.id,
            "next_steps": ["job_matching", "resume_generation", "learning_path"]
        }

    def _get_current_question(self, assessment: Assessment) -> int:
        """Get the current question number for an assessment"""
        if not assessment.career_interests:
            return 0
        return len(assessment.career_interests)

    def _get_assessment_questions(self) -> List[Dict[str, Any]]:
        """Get all assessment questions"""
        # This would typically come from a database or config file
        return [
            {
                "id": "career_interests",
                "type": "multi_select",
                "question": "Which career paths interest you the most?",
                "options": [
                    "Frontend Developer",
                    "Backend Developer", 
                    "Full Stack Developer",
                    "DevOps Engineer",
                    "Data Scientist",
                    "Machine Learning Engineer",
                    "Product Manager",
                    "UI/UX Designer",
                    "Mobile Developer",
                    "Cybersecurity Specialist"
                ],
                "required": True
            },
            # ... more questions
        ]

    def _generate_followup_question(self, current_question_id: str, answer: Any, assessment_context: Dict) -> Optional[Dict[str, Any]]:
        """Generate dynamic follow-up questions based on user answers"""
        # Implementation for intelligent follow-up questions
        if current_question_id == "career_interests" and isinstance(answer, list):
            if "Frontend Developer" in answer:
                return {
                    "id": "frontend_deep_dive",
                    "type": "multi_select",
                    "question": "Nice! Frontend is hot right now. Which frameworks are you into?",
                    "options": ["React", "Vue.js", "Angular", "Svelte", "Next.js", "Gatsby"],
                    "required": True,
                    "followup_to": "career_interests"
                }
        return None

    def _get_next_question(self, assessment: Assessment) -> Optional[Dict[str, Any]]:
        """Get the next question in the assessment"""
        questions = self._get_assessment_questions()
        current_index = self._get_current_question(assessment)
        
        if current_index + 1 < len(questions):
            return questions[current_index + 1]
        return None

    def _save_user_skills(self, user_id: str, skills_data: Dict[str, str]) -> None:
        """Save user skills from assessment"""
        # Delete existing skills for this user
        self.db.query(UserSkill).filter(UserSkill.user_id == user_id).delete()
        
        # Save new skills
        for skill_name, proficiency in skills_data.items():
            if proficiency and proficiency != "None":
                user_skill = UserSkill(
                    user_id=user_id,
                    skill_name=skill_name,
                    proficiency_level=proficiency,
                    skill_category="technical"
                )
                self.db.add(user_skill)
        
        self.db.commit()
```

### Update Assessment Router

Update `backend/app/routers/assessments.py` to use the service:

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.core.database import get_db
from app.services.assessment import AssessmentService
from pydantic import BaseModel

router = APIRouter()

# Pydantic models
class AssessmentStartRequest(BaseModel):
    user_id: str

class AssessmentAnswerRequest(BaseModel):
    user_id: str
    question_id: str
    answer: dict

class AssessmentCompleteRequest(BaseModel):
    user_id: str
    all_answers: dict

def get_assessment_service(db: Session = Depends(get_db)) -> AssessmentService:
    return AssessmentService(db)

@router.post("/start")
async def start_assessment(
    request: AssessmentStartRequest,
    service: AssessmentService = Depends(get_assessment_service)
):
    """Start a new assessment or resume existing one"""
    return service.start_assessment(request.user_id)

@router.post("/answer")
async def save_answer(
    request: AssessmentAnswerRequest,
    service: AssessmentService = Depends(get_assessment_service)
):
    """Save an answer to a specific question"""
    return service.save_answer(request.user_id, request.question_id, request.answer)

@router.post("/complete")
async def complete_assessment(
    request: AssessmentCompleteRequest,
    service: AssessmentService = Depends(get_assessment_service)
):
    """Complete the assessment and save all answers"""
    return service.complete_assessment(request.user_id, request.all_answers)
```

## 4. Database Model Improvements (Medium Priority)

### Standardize User ID Types

Update models to use consistent ID types:

```python
# In backend/app/models/assessment.py
class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)  # Changed from String to Integer
    # ... rest of the model

# Add foreign key relationship
    user = relationship("User", back_populates="assessments")

# In backend/app/models/user.py
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    # ... rest of the model
    
    # Add relationship
    assessments = relationship("Assessment", back_populates="user", cascade="all, delete-orphan")
```

### Add Missing Relationships

Update models to include proper relationships:

```python
# In backend/app/models/assessment.py
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False, index=True)
    # ... rest of the model
    
    # Add relationships
    user = relationship("User", back_populates="resumes")
    assessment = relationship("Assessment", back_populates="resumes")

class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    # ... rest of the model
    
    # Add relationships
    user = relationship("User", back_populates="job_matches")
    job = relationship("Job", back_populates="matches")
```

## 5. Frontend State Management (Medium Priority)

### Create Global Store with Zustand

Create `frontend/src/store/index.ts`:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  full_name: string;
}

interface AssessmentState {
  currentAssessment: any;
  answers: Record<string, any>;
  isCompleted: boolean;
  setAnswer: (questionId: string, answer: any) => void;
  completeAssessment: () => void;
  resetAssessment: () => void;
}

interface JobState {
  matches: any[];
  filters: {
    searchTerm: string;
    difficulty: string;
    type: string;
    sortBy: string;
  };
  setMatches: (matches: any[]) => void;
  setFilters: (filters: Partial<JobState['filters']>) => void;
}

interface AppState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

// Assessment Store
export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      currentAssessment: null,
      answers: {},
      isCompleted: false,
      setAnswer: (questionId, answer) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: answer }
        })),
      completeAssessment: () => set({ isCompleted: true }),
      resetAssessment: () => set({ currentAssessment: null, answers: {}, isCompleted: false })
    }),
    {
      name: 'assessment-storage'
    }
  )
);

// Job Store
export const useJobStore = create<JobState>()(
  persist(
    (set) => ({
      matches: [],
      filters: {
        searchTerm: '',
        difficulty: 'all',
        type: 'all',
        sortBy: 'match'
      },
      setMatches: (matches) => set({ matches }),
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        }))
    }),
    {
      name: 'job-storage'
    }
  )
);

// App Store
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading })
    }),
    {
      name: 'app-storage'
    }
  )
);
```

## 6. Testing Implementation (High Priority)

### Backend Tests

Create `backend/tests/test_auth.py`:

```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import get_db, Base

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def client():
    Base.metadata.create_all(bind=engine)
    yield TestClient(app)
    Base.metadata.drop_all(bind=engine)

def test_register_user(client):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword",
            "full_name": "Test User"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_user(client):
    # First register a user
    client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword",
            "full_name": "Test User"
        }
    )
    
    # Then login
    response = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "testpassword"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_get_current_user(client):
    # Register and login
    register_response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword",
            "full_name": "Test User"
        }
    )
    token = register_response.json()["access_token"]
    
    # Get current user
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"
```

### Frontend Tests

Create `frontend/src/components/__tests__/ChatbotContainer.test.tsx`:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatbotContainer } from '../assessment/ChatbotContainer';
import '@testing-library/jest-dom';

// Mock fetch
global.fetch = jest.fn();

describe('ChatbotContainer', () => {
  const mockOnAssessmentComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(
      <ChatbotContainer 
        userId="test-user" 
        onAssessmentComplete={mockOnAssessmentComplete} 
      />
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders chat interface after loading', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        questions: [
          {
            id: "test-question",
            type: "single_choice",
            question: "Test question?",
            options: ["Option 1", "Option 2"],
            required: true
          }
        ]
      })
    });

    render(
      <ChatbotContainer 
        userId="test-user" 
        onAssessmentComplete={mockOnAssessmentComplete} 
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test question?')).toBeInTheDocument();
    });
  });

  it('handles answer submission', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        questions: [
          {
            id: "test-question",
            type: "single_choice",
            question: "Test question?",
            options: ["Option 1", "Option 2"],
            required: true
          }
        ]
      })
    });

    render(
      <ChatbotContainer 
        userId="test-user" 
        onAssessmentComplete={mockOnAssessmentComplete} 
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test question?')).toBeInTheDocument();
    });

    // Select an option and submit
    fireEvent.click(screen.getByText('Option 1'));
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/assessments/answer',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('test-question')
        })
      );
    });
  });
});
```

## 7. Performance Optimizations (Medium Priority)

### Implement Database Connection Pooling

Update `backend/app/core/database.py`:

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/jobez_web")

# Create engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    pool_size=10,          # Number of connections to keep in pool
    max_overflow=20,        # Number of connections that can be opened beyond pool_size
    pool_pre_ping=True,     # Validate connections before use
    pool_recycle=3600,     # Recycle connections after 1 hour
    echo=False               # Set to True for SQL logging in development
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Implement React Performance Optimizations

Update `frontend/src/app/matches/page.tsx` with optimizations:

```typescript
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ... rest of imports

export default function JobMatchesPage() {
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobMatch[]>([]);
  // ... rest of state

  // Memoize filtered jobs to prevent unnecessary recalculations
  const memoizedFilteredJobs = useMemo(() => {
    let filtered = jobs;

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by difficulty
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(job => job.difficulty === selectedDifficulty);
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(job => job.type === selectedType);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "match":
          return b.matchScore - a.matchScore;
        case "salary":
          return parseInt(b.salary.replace(/\D/g, "")) - parseInt(a.salary.replace(/\D/g, ""));
        case "date":
          return 0; // Would need actual date parsing
        default:
          return 0;
      }
    });

    return filtered;
  }, [jobs, searchTerm, selectedDifficulty, selectedType, sortBy]);

  // Update filtered jobs when memoized value changes
  useEffect(() => {
    setFilteredJobs(memoizedFilteredJobs);
  }, [memoizedFilteredJobs]);

  // Memoize event handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleDifficultyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDifficulty(e.target.value);
  }, []);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  }, []);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as "match" | "salary" | "date");
  }, []);

  // Memoize JobMatchCard component
  const MemoizedJobMatchCard = React.memo(({ job, index }: { job: JobMatch; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white border-4 border-black cursor-pointer hover:border-cyan-400 transition-all"
      onClick={() => setSelectedJob(job)}
    >
      {/* Card content */}
    </motion.div>
  ));

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      {/* ... */}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Job Matches */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-16">
              {/* Loading indicator */}
            </div>
          ) : (
            <AnimatePresence>
              {filteredJobs.map((job, index) => (
                <MemoizedJobMatchCard key={job.id} job={job} index={index} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
```

## 8. Security Hardening (High Priority)

### Implement Rate Limiting

Create `backend/app/middleware/rate_limit.py`:

```python
import time
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, calls: int = 100, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = period
        self.clients = {}

    async def dispatch(self, request: Request, call_next):
        # Get client IP
        client_ip = request.client.host
        current_time = time.time()
        
        # Clean old entries
        self.clients = {
            ip: timestamps for ip, timestamps in self.clients.items()
            if any(timestamp > current_time - self.period for timestamp in timestamps)
        }
        
        # Check if client exists
        if client_ip not in self.clients:
            self.clients[client_ip] = []
        
        # Remove old requests for this client
        self.clients[client_ip] = [
            timestamp for timestamp in self.clients[client_ip]
            if timestamp > current_time - self.period
        ]
        
        # Check rate limit
        if len(self.clients[client_ip]) >= self.calls:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded"
            )
        
        # Add current request
        self.clients[client_ip].append(current_time)
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers
        response.headers["X-RateLimit-Limit"] = str(self.calls)
        response.headers["X-RateLimit-Remaining"] = str(
            max(0, self.calls - len(self.clients[client_ip]))
        )
        response.headers["X-RateLimit-Reset"] = str(
            int(current_time + self.period)
        )
        
        return response
```

### Add Security Headers

Update `backend/main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
import uvicorn

app = FastAPI(
    title="JobEz Assessment Platform API",
    description="API for JobEz career assessment and job matching platform",
    version="1.0.0"
)

# Security middleware (only in production)
if os.getenv("ENVIRONMENT") == "production":
    # Redirect HTTP to HTTPS
    app.add_middleware(HTTPSRedirectMiddleware)
    
    # Only allow trusted hosts
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["yourdomain.com", "www.yourdomain.com"]
    )

# Rate limiting
app.add_middleware(RateLimitMiddleware, calls=100, period=60)

# Configure CORS with specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com", "https://www.yourdomain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    return response
```

## Implementation Priority

1. **Week 1**: Implement authentication system (backend + frontend)
2. **Week 1**: Fix navigation component and basic frontend issues
3. **Week 2**: Implement service layer and move business logic
4. **Week 2**: Add basic error handling and validation
5. **Week 3**: Standardize database models and relationships
6. **Week 3**: Implement state management solution
7. **Week 4**: Add comprehensive testing (backend + frontend)
8. **Week 4**: Implement security hardening measures
9. **Week 5**: Performance optimizations
10. **Week 5**: Code cleanup and documentation

This implementation plan addresses the most critical issues first while building a foundation for a robust, secure, and maintainable application.