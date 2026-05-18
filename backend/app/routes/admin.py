from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.student import Student

router = APIRouter()

@router.get("/students")
def get_all_students(db: Session = Depends(get_db)):
    """Get all students with their progress"""
    try:
        students = db.query(Student).all()
        
        result = []
        for student in students:
            history = student.performance_history or []
            scores = [h.get("score", 0) for h in history if "score" in h]
            avg_score = sum(scores) / len(scores) if scores else 0
            
            completed = [h["topic"] for h in history if h.get("score", 0) >= 70]
            
            result.append({
                "id": student.id,
                "name": student.name,
                "email": student.email,
                "completed_topics": len(set(completed)),
                "avg_score": round(avg_score, 1),
                "status": "active" if len(completed) > 0 else "inactive",
                "current_topic": student.current_topic
            })
        
        return result
    except Exception as e:
        print(f"Error in get_all_students: {e}")
        return []

@router.get("/analytics")
def get_admin_analytics(db: Session = Depends(get_db)):
    """Get platform-wide analytics"""
    try:
        students = db.query(Student).all()
        
        if not students:
            return {
                "total_students": 0,
                "avg_completion": 0,
                "avg_score": 0,
                "total_hours": 0,
                "recent_activities": [],
                "top_students": []
            }
        
        total_students = len(students)
        total_completions = 0
        total_scores = []
        total_hours = 0
        
        for student in students:
            history = student.performance_history or []
            completed = [h for h in history if h.get("score", 0) >= 70]
            total_completions += len(completed)
            
            scores = [h.get("score", 0) for h in history if "score" in h]
            total_scores.extend(scores)
            
            times = [h.get("time_spent", 0) for h in history if "time_spent" in h]
            total_hours += sum(times) / 60
        
        avg_completion = (total_completions / (total_students * 55)) * 100 if total_students > 0 else 0
        avg_score = sum(total_scores) / len(total_scores) if total_scores else 0
        
        recent_activities = [
            {"icon": "✅", "text": f"{total_students} students enrolled", "time": "Today"},
            {"icon": "🎯", "text": f"{total_completions} topics completed", "time": "This week"},
            {"icon": "⭐", "text": f"Average score: {round(avg_score, 1)}%", "time": "Overall"}
        ]
        
        # Top 5 students
        student_list = []
        for student in students:
            history = student.performance_history or []
            completed = [h for h in history if h.get("score", 0) >= 70]
            scores = [h.get("score", 0) for h in history if "score" in h]
            avg = sum(scores) / len(scores) if scores else 0
            
            student_list.append({
                "name": student.name,
                "completed_topics": len(completed),
                "avg_score": round(avg, 1)
            })
        
        top_students_data = sorted(student_list, key=lambda x: x["completed_topics"], reverse=True)[:5]
        
        return {
            "total_students": total_students,
            "avg_completion": round(avg_completion, 1),
            "avg_score": round(avg_score, 1),
            "total_hours": round(total_hours, 1),
            "recent_activities": recent_activities,
            "top_students": top_students_data
        }
    except Exception as e:
        print(f"Error in get_admin_analytics: {e}")
        return {
            "total_students": 0,
            "avg_completion": 0,
            "avg_score": 0,
            "total_hours": 0,
            "recent_activities": [],
            "top_students": []
        }