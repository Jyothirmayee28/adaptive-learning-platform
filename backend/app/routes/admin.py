from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.student import Student
from app.utils.auth import verify_admin
from fastapi import Depends

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/students", dependencies=[Depends(verify_admin)])
async def get_all_students(db: Session = Depends(get_db)):
    """Get all students with their progress"""
    try:
        students = db.query(Student).filter(Student.role == "student").all()
        
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

@router.get("/analytics", dependencies=[Depends(verify_admin)])
async def get_analytics(db: Session = Depends(get_db)):
    """Get platform-wide analytics for admin dashboard"""
    try:
        students = db.query(Student).filter(Student.role == "student").all()
        
        if not students:
            return {
                "total_students": 0,
                "avg_completion": 0,
                "avg_score": 0,
                "total_hours": 0,
                "recent_activity": [],
                "top_performers": []
            }
        
        total_students = len(students)
        
        # Calculate average completion rate
        completion_rates = []
        for student in students:
            completed = student.completed_topics or []
            # Assuming 14 total topics (adjust as needed)
            completion_rate = (len(completed) / 14) * 100 if completed else 0
            completion_rates.append(completion_rate)
        
        avg_completion = sum(completion_rates) / len(completion_rates) if completion_rates else 0
        
        # Calculate average score
        all_scores = []
        for student in students:
            history = student.performance_history or []
            scores = [h.get("score", 0) for h in history if "score" in h]
            all_scores.extend(scores)
        
        avg_score = sum(all_scores) / len(all_scores) if all_scores else 0
        
        # Calculate total study hours (estimate: 2 hours per completed topic)
        total_hours = 0
        for student in students:
            completed = student.completed_topics or []
            total_hours += len(completed) * 2
        
        # Recent activity (last 5 quiz attempts)
        recent_activity = []
        for student in students:
            history = student.performance_history or []
            if history:
                # Get last quiz for each student
                last_quiz = history[-1] if history else None
                if last_quiz:
                    recent_activity.append({
                        "student_name": student.name,
                        "action": f"Completed quiz on {last_quiz.get('topic', 'Unknown Topic')}",
                        "score": last_quiz.get("score", 0),
                        "timestamp": "Recently"
                    })
        
        # Get last 5 activities
        recent_activity = recent_activity[-5:] if len(recent_activity) > 5 else recent_activity
        
        # Top performers (top 5 by average score)
        student_scores = []
        for student in students:
            history = student.performance_history or []
            scores = [h.get("score", 0) for h in history if "score" in h]
            student_avg = sum(scores) / len(scores) if scores else 0
            completed = student.completed_topics or []
            
            student_scores.append({
                "name": student.name,
                "email": student.email,
                "avg_score": round(student_avg, 1),
                "completed_topics": len(completed)
            })
        
        # Sort by average score and get top 5
        top_performers = sorted(student_scores, key=lambda x: x["avg_score"], reverse=True)[:5]
        
        return {
            "total_students": total_students,
            "avg_completion": round(avg_completion, 1),
            "avg_score": round(avg_score, 1),
            "total_hours": total_hours,
            "recent_activity": recent_activity,
            "top_performers": top_performers
        }
        
    except Exception as e:
        print(f"Error in get_admin_analytics: {e}")
        import traceback
        traceback.print_exc()
        return {
            "total_students": 0,
            "avg_completion": 0,
            "avg_score": 0,
            "total_hours": 0,
            "recent_activity": [],
            "top_performers": []
        }

@router.get("/system-stats")
def get_system_stats(db: Session = Depends(get_db)):
    """Get system-wide statistics"""
    try:
        total_users = db.query(Student).count()
        total_students = db.query(Student).filter(Student.role == "student").count()
        total_teachers = db.query(Student).filter(Student.role == "teacher").count()
        
        return {
            "total_users": total_users,
            "total_students": total_students,
            "total_teachers": total_teachers,
            "active_courses": 14  # Adjust based on your curriculum
        }
    except Exception as e:
        print(f"Error in get_system_stats: {e}")
        return {
            "total_users": 0,
            "total_students": 0,
            "total_teachers": 0,
            "active_courses": 0
        }
@router.get("/analytics")
def get_admin_analytics(db: Session = Depends(get_db)):
    """Get platform-wide analytics for admin dashboard"""
    try:
        students = db.query(Student).filter(Student.role == "student").all()
        
        print(f"\n=== ANALYTICS DEBUG ===")
        print(f"Found {len(students)} students")
        
        if not students:
            print("NO STUDENTS FOUND - Returning zeros")
            return {
                "total_students": 0,
                "avg_completion": 0,
                "avg_score": 0,
                "total_hours": 0,
                "recent_activity": [],
                "top_performers": []
            }
        
        total_students = len(students)
        print(f"Total students: {total_students}")
        
        # Calculate average completion rate
        completion_rates = []
        for student in students:
            completed = student.completed_topics or []
            completion_rate = (len(completed) / 14) * 100 if completed else 0
            completion_rates.append(completion_rate)
            print(f"  {student.name}: {len(completed)} topics = {completion_rate}%")
        
        avg_completion = sum(completion_rates) / len(completion_rates) if completion_rates else 0
        print(f"Avg completion: {avg_completion}")
        
        # Calculate average score
        all_scores = []
        for student in students:
            history = student.performance_history or []
            scores = [h.get("score", 0) for h in history if "score" in h]
            all_scores.extend(scores)
            print(f"  {student.name}: scores = {scores}")
        
        avg_score = sum(all_scores) / len(all_scores) if all_scores else 0
        print(f"Avg score: {avg_score}")
        
        # Calculate total study hours
        total_hours = 0
        for student in students:
            completed = student.completed_topics or []
            total_hours += len(completed) * 2
        
        print(f"Total hours: {total_hours}")
        
        result = {
            "total_students": total_students,
            "avg_completion": round(avg_completion, 1),
            "avg_score": round(avg_score, 1),
            "total_hours": total_hours,
            "recent_activity": [],
            "top_performers": []
        }
        
        print(f"RESULT: {result}")
        print("======================\n")
        
        return result
        
    except Exception as e:
        print(f"ERROR in analytics: {e}")
        import traceback
        traceback.print_exc()
        return {
            "total_students": 0,
            "avg_completion": 0,
            "avg_score": 0,
            "total_hours": 0,
            "recent_activity": [],
            "top_performers": []
        }