from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import students, learning_path, teacher, content_library, admin
from app.database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="LearnAI Platform")

# CORS - Update after getting Vercel URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://adaptive-learning-platform-r6da.vercel.app", 
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(students.router)
app.include_router(learning_path.router)
app.include_router(teacher.router)
app.include_router(content_library.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "LearnAI Platform API - Running"}

@app.get("/initialize-db")
def initialize_database():
    """One-time database setup"""
    from app.models.student import Student
    from app.database import SessionLocal
    
    try:
        db = SessionLocal()
        
        # Check if already initialized
        existing = db.query(Student).first()
        if existing:
            db.close()
            return {"message": "Database already initialized", "accounts_exist": True}
        
        # Create test accounts
        accounts = [
            {
                "name": "Demo Student",
                "email": "student@demo.com",
                "password": "student123",
                "role": "student",
                "current_topic": "Python Basics",
                "difficulty_level": 1.5,
                "completed_topics": ["Python Basics", "Variables and Data Types"],
                "knowledge_state": {"Python Basics": 0.9},
                "performance_history": [
                    {"topic": "Python Basics", "score": 88, "timestamp": "2024-05-01"},
                    {"topic": "Variables and Data Types", "score": 92, "timestamp": "2024-05-05"}
                ],
                "average_score": 90.0
            },
            {
                "name": "Alice Johnson",
                "email": "alice@demo.com",
                "password": "student123",
                "role": "student",
                "current_topic": "Loops - For and While",
                "difficulty_level": 2.0,
                "completed_topics": ["Python Basics", "Variables and Data Types", "Control Flow - If Statements"],
                "knowledge_state": {"Python Basics": 0.95},
                "performance_history": [
                    {"topic": "Python Basics", "score": 95, "timestamp": "2024-04-28"},
                    {"topic": "Variables and Data Types", "score": 90, "timestamp": "2024-05-02"},
                    {"topic": "Control Flow - If Statements", "score": 88, "timestamp": "2024-05-06"}
                ],
                "average_score": 91.0
            },
            {
                "name": "Bob Smith",
                "email": "bob@demo.com",
                "password": "student123",
                "role": "student",
                "current_topic": "Lists and Tuples",
                "difficulty_level": 2.5,
                "completed_topics": ["Python Basics", "Variables and Data Types", "Control Flow - If Statements", "Loops - For and While"],
                "knowledge_state": {"Python Basics": 0.92},
                "performance_history": [
                    {"topic": "Python Basics", "score": 85, "timestamp": "2024-04-25"},
                    {"topic": "Variables and Data Types", "score": 88, "timestamp": "2024-04-29"},
                    {"topic": "Control Flow - If Statements", "score": 90, "timestamp": "2024-05-03"},
                    {"topic": "Loops - For and While", "score": 92, "timestamp": "2024-05-08"}
                ],
                "average_score": 88.75
            },
            {
                "name": "Teacher Demo",
                "email": "teacher@demo.com",
                "password": "teacher123",
                "role": "teacher",
                "current_topic": "",
                "difficulty_level": 0,
                "completed_topics": [],
                "knowledge_state": {},
                "performance_history": [],
                "average_score": 0
            }
        ]
        
        for acc in accounts:
            student = Student(
                name=acc["name"],
                email=acc["email"],
                password=acc["password"],
                role=acc["role"],
                current_topic=acc["current_topic"],
                difficulty_level=acc["difficulty_level"],
                completed_topics=acc["completed_topics"],
                knowledge_state=acc["knowledge_state"],
                performance_history=acc["performance_history"],
                average_score=acc["average_score"]
            )
            db.add(student)
        
        db.commit()
        db.close()
        
        return {
            "success": True,
            "message": "Database initialized with test data!",
            "test_accounts": [
                {"role": "teacher", "email": "teacher@demo.com", "password": "teacher123"},
                {"role": "student", "email": "student@demo.com", "password": "student123"},
                {"role": "student", "email": "alice@demo.com", "password": "student123"},
                {"role": "student", "email": "bob@demo.com", "password": "student123"}
            ]
        }
    except Exception as e:
        import traceback
        return {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }