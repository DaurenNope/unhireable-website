from pathlib import Path
import sys

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

from app.core.database import Base
from app.models.assessment import Assessment


def get_test_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    return Session()


def test_assessment_json_mutation_persists():
    session = get_test_session()
    try:
        assessment = Assessment(user_id="test-user", career_interests={})
        session.add(assessment)
        session.commit()
        session.refresh(assessment)

        assessment.career_interests["question_1"] = {"answer": "value"}
        session.commit()
        session.expire_all()

        stored = session.query(Assessment).filter(Assessment.id == assessment.id).one()

        assert stored.career_interests.get("question_1") == {"answer": "value"}
    finally:
        session.close()

