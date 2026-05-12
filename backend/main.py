from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.database import engine, Base
from app.routes import students, learning_path
import traceback

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Adaptive Learning Path Engine",
    description="AI-powered personalized learning system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_detail = traceback.format_exc()
    print("FULL ERROR:", error_detail)
    return JSONResponse(status_code=500, content={"detail": error_detail})

app.include_router(
    students.router,
    prefix="/api/students",
    tags=["Students"]
)

app.include_router(
    learning_path.router,
    prefix="/api/learning",
    tags=["Learning Path"]
)

@app.get("/")
def root():
    return {
        "message": "Adaptive Learning Path Engine is running",
        "status": "active",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}