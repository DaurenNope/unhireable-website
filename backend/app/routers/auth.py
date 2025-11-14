from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.models.user import User
from app.services.auth import (
    authenticate_user, create_access_token, get_password_hash,
    get_current_user as get_current_user_service, ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter()

# Pydantic models
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str = None

class UserLogin(BaseModel):
    email: str
    password: str

class OAuthRequest(BaseModel):
    email: str
    name: str = None
    provider: str = None

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
async def get_current_user_info(current_user: User = Depends(get_current_user_service)):
    """Get current user info"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified
    }

@router.post("/oauth", response_model=Token)
async def oauth_login_or_register(
    oauth_data: OAuthRequest,
    db: Session = Depends(get_db)
):
    """OAuth login or register - creates user if doesn't exist, returns token"""
    # Check if user exists
    db_user = db.query(User).filter(User.email == oauth_data.email).first()
    
    if db_user:
        # User exists, create token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(db_user.id)}, expires_delta=access_token_expires
        )
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }
    else:
        # Create new user with OAuth
        # Generate a random password (user will never use it)
        import secrets
        random_password = secrets.token_urlsafe(32)
        hashed_password = get_password_hash(random_password)
        
        db_user = User(
            email=oauth_data.email,
            hashed_password=hashed_password,
            full_name=oauth_data.name,
            is_active=True,
            is_verified=True  # OAuth emails are verified
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
