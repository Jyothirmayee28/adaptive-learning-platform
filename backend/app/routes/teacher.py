from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Student
from datetime import datetime

router = APIRouter()

@router.get("/api/teacher/students")
def get_all_students(db: Session = Depends(get_db)):
    """Get all students with their performance data"""
    try:
        students = db.query(Student).all()
        
        students_data = []
        for student in students:
            students_data.append({
                "id": student.id,
                "name": student.name,
                "email": student.email,
                "current_topic": student.current_topic,
                "difficulty_level": student.difficulty_level,
                "completed_topics": student.completed_topics or [],
                "average_score": student.average_score or 0,
                "performance_history": student.performance_history or [],
                "knowledge_state": student.knowledge_state or {}
            })
        
        return {
            "success": True,
            "students": students_data
        }
    except Exception as e:
        print(f"Error fetching students: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/teacher/student/{student_id}/analytics")
def get_student_analytics(student_id: int, db: Session = Depends(get_db)):
    """Get detailed analytics for a specific student"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    performance_history = student.performance_history or []
    
    # Calculate analytics
    total_attempts = len(performance_history)
    passed_attempts = len([p for p in performance_history if p.get('passed', False)])
    failed_attempts = total_attempts - passed_attempts
    pass_rate = round((passed_attempts / total_attempts * 100), 1) if total_attempts > 0 else 0
    
    # Topic performance
    topic_performance = {}
    for attempt in performance_history:
        topic = attempt.get('topic', 'Unknown')
        if topic not in topic_performance:
            topic_performance[topic] = {
                'attempts': 0,
                'scores': [],
                'best_score': 0,
                'average_score': 0,
                'passed': False
            }
        
        topic_performance[topic]['attempts'] += 1
        topic_performance[topic]['scores'].append(attempt.get('score', 0))
        topic_performance[topic]['best_score'] = max(
            topic_performance[topic]['best_score'], 
            attempt.get('score', 0)
        )
        if attempt.get('passed', False):
            topic_performance[topic]['passed'] = True
    
    # Calculate averages
    for topic_data in topic_performance.values():
        if topic_data['scores']:
            topic_data['average_score'] = round(
                sum(topic_data['scores']) / len(topic_data['scores']), 1
            )
    
    # Struggling topics (avg < 70%)
    struggling_topics = [
        topic for topic, data in topic_performance.items() 
        if data['average_score'] < 70
    ]
    
    # Mastered topics (avg >= 85%)
    mastered_topics = [
        topic for topic, data in topic_performance.items() 
        if data['average_score'] >= 85
    ]
    
    # Time analysis
    total_time = sum([p.get('time_spent', 0) for p in performance_history])
    avg_time_per_attempt = round(total_time / total_attempts, 1) if total_attempts > 0 else 0
    
    # Recent trend (last 10 scores)
    recent_scores = [p.get('score', 0) for p in performance_history[-10:]]
    
    analytics = {
        "total_attempts": total_attempts,
        "passed_attempts": passed_attempts,
        "failed_attempts": failed_attempts,
        "pass_rate": pass_rate,
        "topic_performance": topic_performance,
        "struggling_topics": struggling_topics,
        "mastered_topics": mastered_topics,
        "total_time_spent": total_time,
        "avg_time_per_attempt": avg_time_per_attempt,
        "recent_trend": recent_scores
    }
    
    return {
        "success": True,
        "analytics": analytics
    }


@router.get("/api/teacher/class-overview")
def get_class_overview(db: Session = Depends(get_db)):
    """Get class-wide overview and statistics"""
    students = db.query(Student).all()
    
    # Collect all recent activity
    recent_activity = []
    for student in students:
        for attempt in (student.performance_history or [])[-5:]:
            recent_activity.append({
                "student_name": student.name,
                "topic": attempt.get('topic', 'Unknown'),
                "score": attempt.get('score', 0),
                "passed": attempt.get('passed', False),
                "timestamp": attempt.get('timestamp', datetime.now().isoformat())
            })
    
    # Sort by timestamp (most recent first)
    recent_activity.sort(key=lambda x: x['timestamp'], reverse=True)
    
    overview = {
        "total_students": len(students),
        "recent_activity": recent_activity[:20]
    }
    
    return {
        "success": True,
        "overview": overview
    }


@router.get("/api/teacher/topic-analytics")
def get_topic_analytics(db: Session = Depends(get_db)):
    """Get performance analytics grouped by topic"""
    students = db.query(Student).all()
    
    topic_stats = {}
    
    for student in students:
        for attempt in (student.performance_history or []):
            topic = attempt.get('topic', 'Unknown')
            
            if topic not in topic_stats:
                topic_stats[topic] = {
                    'topic': topic,
                    'total_students': 0,
                    'total_attempts': 0,
                    'scores': [],
                    'passed_count': 0
                }
            
            topic_stats[topic]['total_attempts'] += 1
            topic_stats[topic]['scores'].append(attempt.get('score', 0))
            
            if attempt.get('passed', False):
                topic_stats[topic]['passed_count'] += 1
            
            # Count unique students per topic
            if student.id not in topic_stats[topic]:
                topic_stats[topic]['total_students'] += 1
    
    # Calculate averages
    topics_list = []
    for topic_data in topic_stats.values():
        if topic_data['scores']:
            avg_score = round(sum(topic_data['scores']) / len(topic_data['scores']), 1)
            completion_rate = round(
                (topic_data['passed_count'] / topic_data['total_attempts'] * 100), 1
            ) if topic_data['total_attempts'] > 0 else 0
            
            topics_list.append({
                'topic': topic_data['topic'],
                'total_students': topic_data['total_students'],
                'total_attempts': topic_data['total_attempts'],
                'avg_score': avg_score,
                'completion_rate': completion_rate
            })
    
    # Sort by average score (ascending - worst first)
    topics_list.sort(key=lambda x: x['avg_score'])
    
    return {
        "success": True,
        "topics": topics_list
    }


@router.get("/api/teacher/struggling-students")
def get_struggling_students(db: Session = Depends(get_db)):
    """Get students who are struggling (avg score < 60%)"""
    students = db.query(Student).all()
    
    struggling = [
        {
            "id": s.id,
            "name": s.name,
            "email": s.email,
            "current_topic": s.current_topic,
            "average_score": s.average_score or 0,
            "completed_topics": s.completed_topics or []
        }
        for s in students if (s.average_score or 0) < 60
    ]
    
    # Sort by average score (lowest first)
    struggling.sort(key=lambda x: x['average_score'])
    
    return {
        "success": True,
        "students": struggling
    }