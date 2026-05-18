import sqlite3
import json
from datetime import datetime

conn = sqlite3.connect('adaptive_learning.db')
cursor = conn.cursor()

# Create test student
test_student = {
    "name": "John Doe",
    "email": "john@student.com",
    "password": "password123",
    "role": "student",
    "current_topic": "Variables and Data Types",
    "difficulty_level": 1.2,
    "completed_topics": json.dumps(["Python Basics"]),
    "knowledge_state": json.dumps({}),
    "performance_history": json.dumps([
        {
            "topic": "Python Basics",
            "score": 85,
            "correct": 4,
            "total": 5,
            "passed": True,
            "time_spent": 12,
            "attempt_number": 1,
            "timestamp": datetime.now().isoformat(),
            "errors": []
        },
        {
            "topic": "Python Basics",
            "score": 90,
            "correct": 5,
            "total": 5,
            "passed": True,
            "time_spent": 10,
            "attempt_number": 2,
            "timestamp": datetime.now().isoformat(),
            "errors": []
        }
    ]),
    "average_score": 87.5
}

cursor.execute("""
    INSERT INTO students 
    (name, email, password, role, current_topic, difficulty_level, 
     completed_topics, knowledge_state, performance_history, average_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    test_student["name"],
    test_student["email"],
    test_student["password"],
    test_student["role"],
    test_student["current_topic"],
    test_student["difficulty_level"],
    test_student["completed_topics"],
    test_student["knowledge_state"],
    test_student["performance_history"],
    test_student["average_score"]
))

# Create another struggling student
struggling_student = {
    "name": "Jane Smith",
    "email": "jane@student.com",
    "password": "password123",
    "role": "student",
    "current_topic": "Python Basics",
    "difficulty_level": 1.0,
    "completed_topics": json.dumps([]),
    "knowledge_state": json.dumps({}),
    "performance_history": json.dumps([
        {
            "topic": "Python Basics",
            "score": 45,
            "correct": 2,
            "total": 5,
            "passed": False,
            "time_spent": 15,
            "attempt_number": 1,
            "timestamp": datetime.now().isoformat(),
            "errors": ["Question 1", "Question 3", "Question 4"]
        },
        {
            "topic": "Python Basics",
            "score": 55,
            "correct": 3,
            "total": 5,
            "passed": False,
            "time_spent": 18,
            "attempt_number": 2,
            "timestamp": datetime.now().isoformat(),
            "errors": ["Question 2", "Question 5"]
        }
    ]),
    "average_score": 50.0
}

cursor.execute("""
    INSERT INTO students 
    (name, email, password, role, current_topic, difficulty_level, 
     completed_topics, knowledge_state, performance_history, average_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    struggling_student["name"],
    struggling_student["email"],
    struggling_student["password"],
    struggling_student["role"],
    struggling_student["current_topic"],
    struggling_student["difficulty_level"],
    struggling_student["completed_topics"],
    struggling_student["knowledge_state"],
    struggling_student["performance_history"],
    struggling_student["average_score"]
))

conn.commit()
conn.close()

print("✅ Test data created successfully!")
print("Students created:")
print("1. John Doe (john@student.com) - Excellent student (87.5% avg)")
print("2. Jane Smith (jane@student.com) - Struggling student (50% avg)")