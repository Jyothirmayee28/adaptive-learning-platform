from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import students, learning_path, teacher, content_library  # Add content_library
from app.database import engine, Base

from app.routes import students, learning_path, teacher, content_library, admin



# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="LearnAI Platform")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(students.router)
app.include_router(learning_path.router)
app.include_router(teacher.router)
app.include_router(content_library.router)  # Add this line
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "LearnAI Platform API - Running"}