from fastapi import APIRouter
from groq import Groq
import json
import re

router = APIRouter()
client = Groq(
    api_key="GROQ_API_KEY"
)

def generate_ai_quiz(topic):

    prompt = f"""
    Generate 5 unique multiple choice questions about {topic}.

    Requirements:
    - Make questions practical and conceptual
    - Make options realistic
    - Only ONE correct answer
    - Mix beginner and intermediate difficulty
    - Return ONLY valid JSON

    Format:
    [
      {{
        "question": "Question text",
        "options": [
          "Option A",
          "Option B",
          "Option C",
          "Option D"
        ],
        "correct": 0
      }}
    ]
    """

    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.8
    )

    text = response.choices[0].message.content

    text = re.sub(r"```json|```", "", text).strip()

    return json.loads(text)