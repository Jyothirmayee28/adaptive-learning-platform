import os
import json
from dotenv import load_dotenv
from groq import Groq
from app.curriculum import get_next_recommended_topic, get_topic_info

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)


def call_groq_api(prompt: str, max_tokens: int = 500, temperature: float = 0.7):
    """Call GROQ API with error handling"""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not found in environment variables")

    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful, friendly AI tutor."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            max_tokens=max_tokens,
            temperature=temperature
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"GROQ API error: {e}")
        raise Exception(f"AI service error: {str(e)}")


def get_next_topic_recommendation(student):
    """
    Generate next topic recommendation based on curriculum and student performance
    """
    from app.curriculum import get_next_recommended_topic as get_next_rec, get_topic_info
    
    completed_topics = student.completed_topics or []
    current_difficulty = student.difficulty_level
    
    # Get next topic from curriculum
    recommendation = get_next_rec(completed_topics, current_difficulty)
    
    next_topic = recommendation["next_topic"]
    topic_info = get_topic_info(next_topic)
    
    # Generate AI explanation for WHY this topic now
    try:
        prompt = f"""You are an adaptive learning AI. Explain why the student should learn "{next_topic}" now.

Student has completed: {len(completed_topics)} topics
Current difficulty level: {current_difficulty}/5
Next topic difficulty: {recommendation['difficulty']}/5

Write a motivating 2-3 sentence explanation about why this topic is important and timely.
Be encouraging and specific."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=200
        )
        
        why_this_now = response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"AI explanation error: {e}")
        why_this_now = f"You've completed the prerequisites and are ready to learn {next_topic}!"
    
    return {
        "next_topic": next_topic,
        "difficulty": recommendation["difficulty"],
        "reason": topic_info.get("description", "Important Python concept"),
        "why_this_now": why_this_now,
        "estimated_time": recommendation["estimated_time"],
        "confidence": 0.95,
        "category": recommendation.get("category", "Python"),
        "prerequisites": topic_info.get("prerequisites", [])
    }


def get_topic_explanation(student):
    """Generate explanation for current topic"""
    prompt = f"""Explain why learning {student.current_topic} is important. 2-3 sentences, encouraging."""
    try:
        return call_groq_api(prompt, max_tokens=200, temperature=0.8)
    except:
        return f"You're learning {student.current_topic} because it's fundamental for your journey!"


def analyze_performance(student, assessment_data):
    """Analyze student performance"""
    score = assessment_data.get('score', 0)
    
    if score >= 90:
        return {"mastery_level": 0.9, "weak_areas": [], "strong_areas": ["Excellent understanding"], "should_revisit": False, "recommended_difficulty_change": 0.3}
    elif score >= 75:
        return {"mastery_level": 0.75, "weak_areas": ["Minor gaps"], "strong_areas": ["Good grasp"], "should_revisit": False, "recommended_difficulty_change": 0.1}
    elif score >= 60:
        return {"mastery_level": 0.6, "weak_areas": ["Some concepts"], "strong_areas": ["Basic understanding"], "should_revisit": False, "recommended_difficulty_change": 0.0}
    else:
        return {"mastery_level": 0.4, "weak_areas": ["Fundamentals"], "strong_areas": ["Trying hard"], "should_revisit": True, "recommended_difficulty_change": -0.2}


def chat_response(topic: str, student_name: str, message: str, chat_history: list = None):
    """Generate AI tutor chat response"""
    system_prompt = f"You are a friendly AI tutor helping {student_name} with {topic}."
    messages = [{"role": "system", "content": system_prompt}]
    
    if chat_history:
        for msg in chat_history[-10:]:
            if msg.get("role") in ["user", "assistant"]:
                messages.append({"role": msg["role"], "content": msg["content"]})
    
    messages.append({"role": "user", "content": message})
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=400,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except:
        return f"Great question about {topic}! Let me help you understand this better."


def generate_quiz_questions(topic: str, difficulty_level: float, attempt_number: int = 1):
    """Generate 5 quiz questions"""
    if difficulty_level <= 2:
        difficulty_desc = "beginner level"
    elif difficulty_level <= 3.5:
        difficulty_desc = "intermediate level"
    else:
        difficulty_desc = "advanced level"
    
    prompt = f"""Generate 5 MCQ questions about "{topic}" - {difficulty_desc}.

Return JSON:
{{
  "questions": [
    {{"id": 1, "question": "...", "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}}, "correct_answer": "A", "explanation": "..."}}
  ]
}}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9,
            max_tokens=2500
        )
        
        response_text = response.choices[0].message.content.strip()
        response_text = response_text.replace("```json", "").replace("```", "").strip()
        quiz_data = json.loads(response_text)
        
        return {
            "success": True,
            "topic": topic,
            "difficulty_level": difficulty_level,
            "attempt_number": attempt_number,
            "total_questions": len(quiz_data["questions"]),
            "questions": quiz_data["questions"]
        }
    except Exception as e:
        print(f"Quiz generation error: {e}")
        return {"success": False, "error": str(e), "questions": []}


def get_topic_content(topic: str):
    """Get topic content overview"""
    try:
        prompt = f"""Overview of {topic} in Python.

Return JSON:
{{"description": "2-3 sentences", "key_concepts": ["c1", "c2", "c3"], "why_matters": "importance", "prerequisites": "what to know"}}"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1500
        )
        
        content = response.choices[0].message.content.strip()
        content = content.replace("```json", "").replace("```", "").strip()
        content_data = json.loads(content)
        
        return {"success": True, "topic": topic, **content_data}
    except Exception as e:
        print(f"Topic content error: {e}")
        return {
            "success": False,
            "description": f"Learn {topic}",
            "key_concepts": ["Core concepts", "Applications", "Best practices"],
            "why_matters": "Essential for Python",
            "prerequisites": "Basic Python"
        }


def generate_practice_questions(topic: str, count: int = 6):
    """Generate practice questions"""
    all_questions = []
    question_id = 1
    
    # MCQ Questions
    mcq_prompt = f"""Generate 2 MCQ questions about {topic}.
Return JSON array: [{{"question": "...", "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}}, "correct_answer": "A", "explanation": "..."}}]"""
    
    try:
        mcq_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": mcq_prompt}],
            temperature=0.9,
            max_tokens=2000
        )
        
        mcq_content = mcq_response.choices[0].message.content.strip()
        mcq_content = mcq_content.replace("```json", "").replace("```", "").strip()
        mcq_questions = json.loads(mcq_content)
        
        for q in mcq_questions:
            all_questions.append({
                "id": question_id,
                "type": "mcq",
                "question": q["question"],
                "options": q["options"],
                "correct_answer": q["correct_answer"],
                "explanation": q.get("explanation", "")
            })
            question_id += 1
    except Exception as e:
        print(f"MCQ error: {e}")
    
    # Coding Questions
    coding_prompt = f"""Generate 2 Python coding problems about {topic}.
Return JSON array: [{{"question": "...", "hint": "...", "explanation": "..."}}]"""
    
    try:
        coding_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": coding_prompt}],
            temperature=0.9,
            max_tokens=2000
        )
        
        coding_content = coding_response.choices[0].message.content.strip()
        coding_content = coding_content.replace("```json", "").replace("```", "").strip()
        coding_questions = json.loads(coding_content)
        
        for q in coding_questions:
            all_questions.append({
                "id": question_id,
                "type": "coding",
                "question": q["question"],
                "hint": q.get("hint", "Think step by step"),
                "explanation": q.get("explanation", "")
            })
            question_id += 1
    except Exception as e:
        print(f"Coding error: {e}")
    
    # Theory Questions
    theory_prompt = f"""Generate 2 theory questions about {topic}.
Return JSON array: [{{"question": "...", "explanation": "..."}}]"""
    
    try:
        theory_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": theory_prompt}],
            temperature=0.9,
            max_tokens=2000
        )
        
        theory_content = theory_response.choices[0].message.content.strip()
        theory_content = theory_content.replace("```json", "").replace("```", "").strip()
        theory_questions = json.loads(theory_content)
        
        for q in theory_questions:
            all_questions.append({
                "id": question_id,
                "type": "theory",
                "question": q["question"],
                "explanation": q.get("explanation", "")
            })
            question_id += 1
    except Exception as e:
        print(f"Theory error: {e}")
    
    print(f"Generated {len(all_questions)} practice questions")
    return all_questions