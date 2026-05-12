import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def call_groq_api(prompt: str, max_tokens: int = 500, temperature: float = 0.7):
    """
    Call Groq API with error handling
    """
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not found in environment variables")
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful, friendly AI tutor. Provide clear, concise, and encouraging explanations. Keep answers to 2-3 sentences unless more detail is specifically requested."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": max_tokens,
        "temperature": temperature
    }
    
    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        return result["choices"][0]["message"]["content"].strip()
        
    except requests.exceptions.Timeout:
        print("Groq API timeout")
        raise Exception("AI service timeout - please try again")
    except requests.exceptions.RequestException as e:
        print(f"Groq API request error: {e}")
        raise Exception(f"AI service error: {str(e)}")
    except (KeyError, IndexError) as e:
        print(f"Groq API response parsing error: {e}")
        raise Exception("Invalid AI response format")


def get_next_topic_recommendation(student):
    """
    Generate next topic recommendation based on student performance
    """
    prompt = f"""You are an adaptive learning AI. Based on this student's data, recommend the next topic.

Current topic: {student.current_topic}
Difficulty level: {student.difficulty_level}/5
Knowledge state: {student.knowledge_state}

Provide a JSON response with:
- next_topic: string (name of next topic)
- difficulty: float (1-5 scale)
- reason: string (why this topic)
- why_this_now: string (explain timing)
- estimated_time: string (e.g., "30 minutes")
- confidence: float (0-1, how confident in this recommendation)

Return ONLY valid JSON, no other text."""

    try:
        response = call_groq_api(prompt, max_tokens=400, temperature=0.7)
        
        # Try to parse JSON from response
        # Sometimes AI adds markdown formatting, so strip it
        response_clean = response.strip()
        if response_clean.startswith("```json"):
            response_clean = response_clean[7:]
        if response_clean.startswith("```"):
            response_clean = response_clean[3:]
        if response_clean.endswith("```"):
            response_clean = response_clean[:-3]
        response_clean = response_clean.strip()
        
        recommendation = json.loads(response_clean)
        
        # Validate required fields
        required_fields = ["next_topic", "difficulty", "reason", "why_this_now", "estimated_time", "confidence"]
        for field in required_fields:
            if field not in recommendation:
                raise ValueError(f"Missing required field: {field}")
        
        return recommendation
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"AI Response was: {response}")
        
        # Fallback recommendation
        return {
            "next_topic": "Learning Strategies",
            "difficulty": min(student.difficulty_level + 0.3, 5.0),
            "reason": "This builds on your current knowledge",
            "why_this_now": "Your performance indicates readiness for this topic",
            "estimated_time": "30 minutes",
            "confidence": 0.7
        }
    except Exception as e:
        print(f"Recommendation error: {e}")
        
        # Fallback recommendation
        return {
            "next_topic": "Next Steps in Learning",
            "difficulty": student.difficulty_level,
            "reason": "Continuing your learning journey",
            "why_this_now": "Natural progression from current topic",
            "estimated_time": "25 minutes",
            "confidence": 0.65
        }


def get_topic_explanation(student):
    """
    Generate explanation for why student is learning current topic
    """
    prompt = f"""You are an encouraging AI tutor. Explain why the student is learning their current topic.

Student is learning: {student.current_topic}
Their difficulty level: {student.difficulty_level}/5
Their knowledge state: {student.knowledge_state}

Write a motivating 2-3 sentence explanation that:
1. Explains the importance of this topic
2. Connects it to their learning goals
3. Encourages them to keep going

Be warm, supportive, and specific to this topic."""

    try:
        explanation = call_groq_api(prompt, max_tokens=200, temperature=0.8)
        return explanation
        
    except Exception as e:
        print(f"Explanation error: {e}")
        
        # Fallback explanation
        return f"You're learning {student.current_topic} because it's a fundamental building block for your educational journey. This topic will help you develop critical thinking skills and prepare you for more advanced concepts ahead. Keep up the great work!"


def analyze_performance(student, assessment_data):
    """
    Analyze student performance and provide insights
    """
    prompt = f"""You are an educational AI analyzing student performance.

Student: {student.name}
Current topic: {student.current_topic}
Current difficulty: {student.difficulty_level}/5
Recent score: {assessment_data.get('score')}%
Time spent: {assessment_data.get('time_spent')} minutes
Errors: {assessment_data.get('errors', [])}

Provide a JSON response with:
- mastery_level: float (0-1, how well they know this topic)
- weak_areas: list of strings (what needs improvement)
- strong_areas: list of strings (what they're good at)
- should_revisit: boolean (should they review this topic?)
- recommended_difficulty_change: float (-1 to +1, how much to adjust difficulty)

Return ONLY valid JSON."""

    try:
        response = call_groq_api(prompt, max_tokens=300, temperature=0.5)
        
        # Clean and parse JSON
        response_clean = response.strip()
        if response_clean.startswith("```json"):
            response_clean = response_clean[7:]
        if response_clean.startswith("```"):
            response_clean = response_clean[3:]
        if response_clean.endswith("```"):
            response_clean = response_clean[:-3]
        response_clean = response_clean.strip()
        
        analysis = json.loads(response_clean)
        return analysis
        
    except Exception as e:
        print(f"Performance analysis error: {e}")
        
        # Fallback analysis based on score
        score = assessment_data.get('score', 0)
        
        if score >= 90:
            mastery = 0.9
            difficulty_change = 0.3
            should_revisit = False
        elif score >= 75:
            mastery = 0.75
            difficulty_change = 0.1
            should_revisit = False
        elif score >= 60:
            mastery = 0.6
            difficulty_change = 0.0
            should_revisit = False
        else:
            mastery = 0.4
            difficulty_change = -0.2
            should_revisit = True
        
        return {
            "mastery_level": mastery,
            "weak_areas": ["Review fundamental concepts"],
            "strong_areas": ["Active participation"],
            "should_revisit": should_revisit,
            "recommended_difficulty_change": difficulty_change
        }


def chat_response(topic: str, student_name: str, message: str, chat_history: list = None):
    """
    Generate AI tutor response for student questions
    """
    # Build conversation context
    system_prompt = f"""You are a friendly, patient AI tutor helping {student_name} understand {topic}.

Guidelines:
- Answer questions clearly and concisely
- Use simple language appropriate for students
- Be encouraging and supportive
- If unsure, admit it and guide them to resources
- Keep responses to 2-4 sentences unless more detail is needed
- Use examples when helpful
"""

    # Build message history
    messages = [
        {"role": "system", "content": system_prompt}
    ]
    
    # Add chat history if provided (last 5 messages for context)
    if chat_history:
        recent_history = chat_history[-10:]  # Last 10 messages (5 exchanges)
        for msg in recent_history:
            if msg.get("role") in ["user", "assistant"]:
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
    
    # Add current message
    messages.append({
        "role": "user",
        "content": message
    })
    
    # Make API call with conversation context
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages,
        "max_tokens": 400,
        "temperature": 0.7
    }
    
    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        ai_response = result["choices"][0]["message"]["content"].strip()
        return ai_response
        
    except Exception as e:
        print(f"Chat response error: {e}")
        
        # Fallback responses based on keywords
        message_lower = message.lower()
        
        if "what" in message_lower and "is" in message_lower:
            return f"Great question about {topic}! This concept is fundamental to your learning. It helps you understand how different ideas connect and build upon each other. Would you like me to explain any specific part in more detail?"
        elif "how" in message_lower:
            return f"To understand this aspect of {topic}, let's break it down step by step. The key is to start with the basics and gradually build up your knowledge. Practice is essential - try applying what you learn to real examples!"
        elif "why" in message_lower:
            return f"You're learning this because it forms an important foundation for more advanced topics. Understanding {topic} will help you solve problems more effectively and think critically about complex situations."
        else:
            return f"That's an interesting question about {topic}! This topic has many important applications. Keep asking questions - that's how you learn best. Is there a specific aspect you'd like me to clarify?"