from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.student import Student
import bcrypt

router = APIRouter()

class StudentCreate(BaseModel):
    name: str
    email: str
    password: str

class StudentLogin(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/api/students/register")
def register_student(student_data: StudentCreate, db: Session = Depends(get_db)):
    existing = db.query(Student).filter(Student.email == student_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = bcrypt.hashpw(
        student_data.password.encode('utf-8'), 
        bcrypt.gensalt()
    )
    
    new_student = Student(
        name=student_data.name,
        email=student_data.email,
        password=hashed_password.decode('utf-8'),  # Changed from password_hash to password
        role="student",  # Set role as student
        current_topic="Python Basics",
        difficulty_level=1.0,
        completed_topics=[],
        knowledge_state={},
        performance_history=[],
        average_score=0.0
    )
    
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    return {
        "message": "Student registered successfully",
        "student_id": new_student.id,
        "starting_topic": "Python Basics"
    }

@router.post("/api/students/login")
def login_student(credentials: StudentLogin, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.email == credentials.email).first()
    
    if not student:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not bcrypt.checkpw(
        credentials.password.encode('utf-8'),
        student.password.encode('utf-8')  # Changed from password_hash to password
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "student_id": student.id,
        "name": student.name,
        "email": student.email,
        "role": student.role,  # Return role
        "current_topic": student.current_topic,
        "difficulty_level": student.difficulty_level
    }

@router.get("/api/students/{student_id}")
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return {
        "id": student.id,
        "name": student.name,
        "email": student.email,
        "role": student.role,  # Return role
        "current_topic": student.current_topic,
        "difficulty_level": student.difficulty_level,
        "completed_topics": student.completed_topics,
        "average_score": student.average_score
    }

@router.post("/api/students/{student_id}/reset-progress")
def reset_student_progress(student_id: int, db: Session = Depends(get_db)):
    """Reset student to start of curriculum"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    student.current_topic = "Python Basics"
    student.difficulty_level = 1.0
    student.completed_topics = []
    student.knowledge_state = {}
    student.performance_history = []
    student.average_score = 0.0
    
    db.commit()
    
    return {
        "success": True,
        "message": "Progress reset successfully",
        "current_topic": "Python Basics"
    }

@router.get("/api/students/")
def list_students(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    
    return [
        {
            "id": s.id,
            "name": s.name,
            "email": s.email,
            "role": s.role,  # Return role
            "current_topic": s.current_topic,
            "difficulty_level": s.difficulty_level,
            "completed_topics": s.completed_topics,
            "average_score": s.average_score
        }
        for s in students
    ]