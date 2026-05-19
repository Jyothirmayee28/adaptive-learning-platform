from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
from pydantic import BaseModel
from typing import Dict, List, Optional
from app.database import get_db
from app.models.student import Student
from app.services.ai_service import (
    get_next_topic_recommendation, 
    get_topic_explanation, 
    analyze_performance, 
    chat_response,
    generate_quiz_questions,
    get_topic_content,
    generate_practice_questions
)
from datetime import datetime

from app.curriculum import get_learning_path, get_curriculum

router = APIRouter()

# Pydantic models for request validation
class QuizSubmission(BaseModel):
    student_id: int
    topic: str
    answers: dict
    time_spent: int

class AssessmentResult(BaseModel):
    student_id: int
    topic: str
    score: float
    time_spent: int
    errors: list

class ChatRequest(BaseModel):
    student_id: int
    message: str
    chat_history: list = []

# ============================================
# BASIC LEARNING ENDPOINTS
# ============================================

@router.get("/recommendation/{student_id}")
async def get_recommendation(student_id: int, db: Session = Depends(get_db)):
    """Get AI-powered learning recommendation"""
    try:
        student = db.query(Student).filter(Student.id == student_id).first()
        
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Return a simple recommendation
        return {
            "recommended_topic": student.current_topic or "Python Basics",
            "reason": "Continue with your current learning path",
            "difficulty": student.difficulty_level or 1,
            "estimated_time": "30 minutes"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/learning/explanation/{student_id}")
def get_explanation(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    explanation = get_topic_explanation(student)
    return {"explanation": explanation}

@router.get("/progress/{student_id}")
async def get_progress_endpoint(student_id: int, db: Session = Depends(get_db)):
    """Get student progress"""
    try:
        student = db.query(Student).filter(Student.id == student_id).first()
        
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        return {
            "current_topic": student.current_topic or "Python Basics",
            "difficulty_level": student.difficulty_level or 1,
            "completed_topics": student.completed_topics or [],
            "average_score": student.average_score or 0,
            "performance_history": student.performance_history or []
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/learning/submit-assessment")
def submit_assessment(result: AssessmentResult, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == result.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    analysis = analyze_performance(student, {
        "score": result.score,
        "time_spent": result.time_spent,
        "errors": result.errors
    })
    
    history = student.performance_history or []
    history.append({
        "topic": result.topic,
        "score": result.score,
        "time_spent": result.time_spent,
        "timestamp": str(datetime.now()),
        "errors": result.errors
    })
    student.performance_history = history
    flag_modified(student, "performance_history")
    
    knowledge = student.knowledge_state or {}
    knowledge[result.topic] = {
        "mastery": analysis.get("mastery_level", 0.5),
        "last_reviewed": str(datetime.now())
    }
    student.knowledge_state = knowledge
    flag_modified(student, "knowledge_state")
    
    if result.score >= 70:
        if result.topic not in student.completed_topics:
            student.completed_topics.append(result.topic)
        
        recommendation = get_next_topic_recommendation(student)
        student.current_topic = recommendation.get("next_topic", student.current_topic)
    
    scores = [h.get("score", 0) for h in history]
    student.average_score = sum(scores) / len(scores) if scores else 0
    
    new_difficulty = student.difficulty_level + analysis.get("recommended_difficulty_change", 0)
    student.difficulty_level = max(1.0, min(5.0, new_difficulty))
    
    db.commit()
    
    message = "Great job! Moving to next topic." if result.score >= 70 else "Keep practicing! You'll get there."
    return {
        "message": message,
        "analysis": analysis,
        "new_difficulty": student.difficulty_level
    }

@router.post("/api/learning/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == request.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    response = chat_response(
        topic=student.current_topic,
        student_name=student.name,
        message=request.message,
        chat_history=request.chat_history
    )
    
    return {"response": response}

# ============================================
# AI QUIZ ENDPOINTS
# ============================================

@router.post("/api/learning/generate-quiz")
async def generate_quiz_endpoint(
    topic: str,
    student_id: int,
    db: Session = Depends(get_db)
):
    """
    Generate AI-powered quiz questions for a specific topic
    """
    try:
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Count previous attempts for this topic (only count completed quizzes with 5 questions)
        history = student.performance_history or []
        topic_attempts = [h for h in history if h.get("topic") == topic and h.get("total") == 5]
        attempt_number = len(topic_attempts) + 1
        
        print(f"Generating quiz for {topic}, attempt #{attempt_number}, difficulty {student.difficulty_level}")
        
        # Generate questions using AI
        quiz_result = generate_quiz_questions(
            topic=topic,
            difficulty_level=student.difficulty_level,
            attempt_number=attempt_number
        )
        
        if not quiz_result.get("success"):
            raise HTTPException(
                status_code=500, 
                detail=quiz_result.get("error", "Failed to generate quiz")
            )
        
        # Store quiz questions with correct answers in student's knowledge state temporarily
        # This ensures we verify against the SAME questions
        quiz_cache_key = f"quiz_{topic}_attempt_{attempt_number}"
        knowledge = student.knowledge_state or {}
        knowledge[quiz_cache_key] = {
            "questions": quiz_result["questions"],
            "generated_at": str(datetime.now()),
            "topic": topic,
            "attempt_number": attempt_number
        }
        student.knowledge_state = knowledge
        flag_modified(student, "knowledge_state")
        db.commit()
        
        # Return questions WITHOUT correct answers to frontend
        questions_for_frontend = []
        for q in quiz_result["questions"]:
            questions_for_frontend.append({
                "id": q["id"],
                "question": q["question"],
                "options": q["options"]
                # Don't send correct_answer or explanation yet
            })
        
        return {
            "success": True,
            "topic": topic,
            "attempt_number": attempt_number,
            "difficulty_level": student.difficulty_level,
            "total_questions": len(questions_for_frontend),
            "questions": questions_for_frontend
        }
        
    except Exception as e:
        print(f"Error in generate_quiz: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/api/learning/submit-quiz")
async def submit_quiz_endpoint(
    submission: QuizSubmission,
    db: Session = Depends(get_db)
):
    """
    Submit quiz answers and calculate score
    """
    try:
        student_id = submission.student_id
        topic = submission.topic
        answers = submission.answers
        time_spent = submission.time_spent
        
        if not student_id or not topic or not answers:
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Count attempts to get the correct attempt number
        history = student.performance_history or []
        topic_attempts = [h for h in history if h.get("topic") == topic and h.get("total") == 5]
        attempt_number = len(topic_attempts) + 1
        
        print(f"Submitting quiz for {topic}, attempt #{attempt_number}")
        print(f"Answers received: {answers}")
        
        # Retrieve the STORED quiz questions from knowledge state
        quiz_cache_key = f"quiz_{topic}_attempt_{attempt_number}"
        knowledge = student.knowledge_state or {}
        
        if quiz_cache_key not in knowledge:
            raise HTTPException(
                status_code=400, 
                detail="Quiz not found. Please generate a new quiz."
            )
        
        stored_quiz = knowledge[quiz_cache_key]
        questions = stored_quiz["questions"]
        
        print(f"Retrieved {len(questions)} stored questions for verification")
        
        # Calculate score by comparing with stored correct answers
        correct_count = 0
        total_questions = len(questions)
        detailed_results = []
        
        for q in questions:
            q_id = str(q["id"])
            user_answer = answers.get(q_id, "")
            correct_answer = q["correct_answer"]
            is_correct = user_answer == correct_answer
            
            print(f"Q{q_id}: User={user_answer}, Correct={correct_answer}, Match={is_correct}")
            
            if is_correct:
                correct_count += 1
            
            detailed_results.append({
                "question_id": q["id"],
                "question": q["question"],
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "is_correct": is_correct,
                "explanation": q.get("explanation", "")
            })
        
        score = round((correct_count / total_questions) * 100) if total_questions > 0 else 0
        passed = score >= 70
        
        print(f"Score: {score}%, Passed: {passed}")
        
        # Save to performance history
        performance_entry = {
            "topic": topic,
            "score": score,
            "time_spent": time_spent,
            "correct": correct_count,
            "total": total_questions,
            "attempt_number": attempt_number,
            "passed": passed,
            "timestamp": str(datetime.now()),
            "errors": [r["question"] for r in detailed_results if not r["is_correct"]]
        }
        
        history.append(performance_entry)
        student.performance_history = history
        flag_modified(student, "performance_history")
        
        # Clean up the cached quiz from knowledge state
        if quiz_cache_key in knowledge:
            del knowledge[quiz_cache_key]
            student.knowledge_state = knowledge
            flag_modified(student, "knowledge_state")
        
        # ===== CRITICAL FIX: Update completed topics and average score =====
        if passed:
            # Update knowledge state
            knowledge = student.knowledge_state or {}
            knowledge[topic] = {
                "mastery": score / 100,
                "last_reviewed": str(datetime.now()),
                "attempts": attempt_number
            }
            student.knowledge_state = knowledge
            flag_modified(student, "knowledge_state")
            
            # Add to completed topics if not already there
            completed_topics = student.completed_topics or []
            if topic not in completed_topics:
                completed_topics.append(topic)
                student.completed_topics = completed_topics
                flag_modified(student, "completed_topics")
                print(f"✅ Added {topic} to completed topics. Total: {len(completed_topics)}")
            
            # Update difficulty level
            student.difficulty_level = min(student.difficulty_level + 0.3, 5.0)
            
            # Get next topic recommendation
            from app.services.ai_service import get_next_topic_recommendation
            next_topic_data = get_next_topic_recommendation(student)
            student.current_topic = next_topic_data.get("next_topic", student.current_topic)
            print(f"📚 Next topic: {student.current_topic}")
        
        # Calculate and update average score
        all_scores = [h.get("score", 0) for h in history]
        if all_scores:
            student.average_score = round(sum(all_scores) / len(all_scores), 1)
            print(f"📊 Updated average score: {student.average_score}%")
        
        # Commit all changes to database
        db.commit()
        db.refresh(student)
        
        message = f"🎉 Excellent! You scored {score}%! Moving to next topic: {student.current_topic}" if passed else f"You scored {score}%. Need 70% to pass. Keep practicing!"
        
        return {
            "success": True,
            "score": score,
            "passed": passed,
            "correct": correct_count,
            "total": total_questions,
            "attempt_number": attempt_number,
            "message": message,
            "next_topic": student.current_topic,
            "completed_topics": student.completed_topics,
            "average_score": student.average_score
        }
        
    except Exception as e:
        db.rollback()
        print(f"Error submitting quiz: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# TOPIC CONTENT & PRACTICE ENDPOINTS
# ============================================

@router.get("/api/learning/topic-content")
async def get_topic_content_endpoint(topic: str):
    """
    Get AI-generated content for a topic including overview, key concepts, etc.
    """
    try:
        print(f"Getting topic content for: {topic}")
        content = get_topic_content(topic)
        return content
    except Exception as e:
        print(f"Error getting topic content: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/learning/practice-questions")
async def get_practice_questions_endpoint(topic: str, count: int = 6):
    """
    Get AI-generated practice questions (MCQ, coding, theory)
    """
    try:
        print(f"Generating {count} practice questions for: {topic}")
        questions = generate_practice_questions(topic, count)
        
        return {
            "success": True,
            "topic": topic,
            "questions": questions,
            "total": len(questions)
        }
    except Exception as e:
        print(f"Error getting practice questions: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    from app.curriculum import get_curriculum, get_learning_path

@router.get("/api/learning/curriculum")
def get_full_curriculum():
    """Get the complete curriculum structure"""
    from app.curriculum import get_curriculum
    curriculum = get_curriculum()
    return {
        "success": True,
        "curriculum": curriculum,
        "total_topics": len(curriculum)
    }

@router.get("/api/learning/learning-path/{student_id}")
def get_student_learning_path(student_id: int, db: Session = Depends(get_db)):
    """Get personalized learning path for a student"""
    from app.curriculum import get_learning_path
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    completed = student.completed_topics or []
    path = get_learning_path(completed)
    
    return {
        "success": True,
        "student_id": student_id,
        "completed_count": len(completed),
        "completed_topics": completed,
        "current_topic": student.current_topic,
        "learning_path": path
    }


@router.get("/api/learning/progress/{student_id}")
async def get_progress_endpoint(student_id: int, db: Session = Depends(get_db)):
    """Get student's learning progress"""
    try:
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        return {
            "success": True,
            "student_id": student.id,
            "current_topic": student.current_topic,
            "difficulty_level": student.difficulty_level,
            "completed_topics": student.completed_topics or [],
            "knowledge_state": student.knowledge_state or {},
            "performance_history": student.performance_history or [],
            "average_score": student.average_score or 0
        }
    except Exception as e:
        print(f"Error fetching progress: {e}")
        raise HTTPException(status_code=500, detail=str(e))