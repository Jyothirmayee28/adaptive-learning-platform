from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.student import Student
from pydantic import BaseModel
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class StudentCreate(BaseModel):
    name: str
    email: str
    password: str

class StudentLogin(BaseModel):
    email: str
    password: str

@router.post("/register")
def register_student(student: StudentCreate, db: Session = Depends(get_db)):
    existing = db.query(Student).filter(Student.email == student.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(student.password)
    
    new_student = Student(
        name=student.name,
        email=student.email,
        password=hashed_password,
        knowledge_state={},
        performance_history=[],
        difficulty_level=1.0,
        current_topic="Introduction to Learning"
    )
    
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    return {
        "message": "Student registered successfully",
        "student_id": new_student.id,
        "name": new_student.name
    }

@router.post("/login")
def login_student(credentials: StudentLogin, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.email == credentials.email).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    if not pwd_context.verify(credentials.password, student.password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    return {
        "message": "Login successful",
        "student_id": student.id,
        "name": student.name,
        "current_topic": student.current_topic,
        "difficulty_level": student.difficulty_level
    }

@router.get("/{student_id}")
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return {
        "id": student.id,
        "name": student.name,
        "email": student.email,
        "current_topic": student.current_topic,
        "difficulty_level": student.difficulty_level,
        "knowledge_state": student.knowledge_state,
        "performance_history": student.performance_history
    }

@router.get("/")
def get_all_students(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "email": s.email,
            "current_topic": s.current_topic,
            "difficulty_level": s.difficulty_level
        }
        for s in students
    ]