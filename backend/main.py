from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models.student import Student
from app.routes import students, admin, quiz, learning_path, teacher, content_library

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS - Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(students.router, tags=["students"])
app.include_router(admin.router, tags=["admin"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["quiz"])
app.include_router(learning_path.router, prefix="/api/learning", tags=["learning"])
app.include_router(teacher.router, tags=["teacher"])
app.include_router(content_library.router, tags=["content_library"])

@app.get("/")
async def root():
    return {"message": "Adaptive Learning Platform API"}

@app.get("/initialize-db")
def initialize_database():
    """Initialize database with tables"""
    Base.metadata.create_all(bind=engine)
    return {"message": "Database initialized successfully"}