from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.student import Student
from app.services.ai_service import get_next_topic_recommendation, get_topic_explanation, analyze_performance, chat_response
from pydantic import BaseModel

router = APIRouter()

class AssessmentResult(BaseModel):
    student_id: int
    topic: str
    score: float
    time_spent: float
    errors: list

class OverrideRequest(BaseModel):
    student_id: int
    new_topic: str
    reason: str
    teacher_name: str

@router.get("/recommendation/{student_id}")
def get_recommendation(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Call with just student object
    recommendation = get_next_topic_recommendation(student)
    
    return {
        "student_id": student_id,
        "student_name": student.name,
        "current_topic": student.current_topic,
        "recommendation": recommendation
    }

@router.get("/explanation/{student_id}")
def get_explanation(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Call with just student object
    explanation = get_topic_explanation(student)
    
    return {
        "student_id": student_id,
        "topic": student.current_topic,
        "explanation": explanation
    }

@router.post("/submit-assessment")
def submit_assessment(result: AssessmentResult, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == result.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Prepare assessment data
    assessment_data = {
        "score": result.score,
        "time_spent": result.time_spent,
        "errors": result.errors
    }
    
    # Call with student object and assessment_data
    analysis = analyze_performance(student, assessment_data)
    
    # Update performance history
    history = student.performance_history or []
    history.append({
        "topic": result.topic,
        "score": result.score,
        "time_spent": result.time_spent,
        "mastery_level": analysis.get("mastery_level", 0.5),
        "feedback": "Assessment completed"
    })
    
    # Update difficulty level
    new_difficulty = student.difficulty_level + analysis.get("recommended_difficulty_change", 0)
    new_difficulty = max(1.0, min(5.0, new_difficulty))
    
    # Update knowledge state
    knowledge = student.knowledge_state or {}
    knowledge[result.topic] = analysis.get("mastery_level", 0.5)
    
    # Save changes
    student.performance_history = history
    student.difficulty_level = new_difficulty
    student.knowledge_state = knowledge
    
    # Move to next topic if ready
    if not analysis.get("should_revisit", False):
        recommendation = get_next_topic_recommendation(student)
        student.current_topic = recommendation.get("next_topic", student.current_topic)
    
    db.commit()
    db.refresh(student)
    
    return {
        "message": "Assessment submitted successfully",
        "analysis": analysis,
        "new_topic": student.current_topic,
        "new_difficulty": student.difficulty_level
    }

@router.post("/override")
def override_path(override: OverrideRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == override.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    old_topic = student.current_topic
    student.current_topic = override.new_topic
    
    # Log override in history
    history = student.performance_history or []
    history.append({
        "topic": f"OVERRIDE by {override.teacher_name}",
        "old_topic": old_topic,
        "new_topic": override.new_topic,
        "reason": override.reason
    })
    student.performance_history = history
    
    db.commit()
    db.refresh(student)
    
    return {
        "message": "Learning path overridden successfully",
        "student_id": student.id,
        "old_topic": old_topic,
        "new_topic": student.current_topic,
        "overridden_by": override.teacher_name
    }

@router.get("/progress/{student_id}")
def get_progress(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    history = student.performance_history or []
    completed_topics = [h["topic"] for h in history if "score" in h]
    avg_score = sum([h["score"] for h in history if "score" in h]) / len(completed_topics) if completed_topics else 0
    
    return {
        "student_id": student_id,
        "student_name": student.name,
        "current_topic": student.current_topic,
        "difficulty_level": student.difficulty_level,
        "completed_topics": completed_topics,
        "total_topics_completed": len(completed_topics),
        "average_score": round(avg_score, 2),
        "knowledge_state": student.knowledge_state or {},
        "performance_history": history
    }

@router.post("/chat")
def chat_with_ai(request: dict, db: Session = Depends(get_db)):
    topic = request.get("topic")
    student_name = request.get("student_name")
    message = request.get("message")
    chat_history = request.get("chat_history", [])
    
    try:
        # Use the chat_response function from ai_service
        response = chat_response(topic, student_name, message, chat_history)
        return {"response": response}
    except Exception as e:
        print(f"Chat error: {e}")
        # Fallback response
        return {
            "response": f"Great question about {topic}! This is an important concept that will help you in your learning journey. Keep asking questions - that's how you learn best!"
        }