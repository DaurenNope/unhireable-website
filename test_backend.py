#!/usr/bin/env python3
"""
Simple test script to verify backend functionality
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

def test_imports():
    """Test that all modules can be imported"""
    try:
        print("Testing imports...")
        
        # Test main app
        from main import app
        print("✓ Main app imported successfully")
        
        # Test auth service
        from app.services.auth import AuthService
        print("✓ AuthService imported successfully")
        
        # Test assessment service
        from app.services.assessment import AssessmentService
        print("✓ AssessmentService imported successfully")
        
        # Test auth router
        from app.routers.auth import router as auth_router
        print("✓ Auth router imported successfully")
        
        # Test assessment router
        from app.routers.assessments import router as assessment_router
        print("✓ Assessment router imported successfully")
        
        return True
        
    except Exception as e:
        print(f"✗ Import failed: {e}")
        return False

def test_basic_functionality():
    """Test basic functionality without database"""
    try:
        print("\nTesting basic functionality...")
        
        # Test FastAPI app
        from main import app
        from fastapi.testclient import TestClient
        
        client = TestClient(app)
        
        # Test root endpoint
        response = client.get("/")
        if response.status_code == 200:
            print("✓ Root endpoint works")
        else:
            print(f"✗ Root endpoint failed: {response.status_code}")
            return False
            
        # Test auth endpoints exist
        response = client.post("/api/auth/register")
        # Should fail with validation error, but endpoint should exist
        if response.status_code in [400, 422]:
            print("✓ Auth registration endpoint exists")
        else:
            print(f"✗ Auth registration endpoint unexpected status: {response.status_code}")
            
        return True
        
    except Exception as e:
        print(f"✗ Basic functionality test failed: {e}")
        return False

if __name__ == "__main__":
    print("=== Backend Test Script ===\n")
    
    success = True
    
    # Test imports
    if not test_imports():
        success = False
    
    # Test basic functionality
    if not test_basic_functionality():
        success = False
    
    if success:
        print("\n✓ All tests passed! Backend appears to be working correctly.")
        sys.exit(0)
    else:
        print("\n✗ Some tests failed. Please check the errors above.")
        sys.exit(1)