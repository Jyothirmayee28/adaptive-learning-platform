PYTHON_CURRICULUM = {
    "Python Basics": {
        "difficulty": 1.0,
        "estimated_time": "2 hours",
        "prerequisites": [],
        "next_topics": ["Variables and Data Types"],
        "description": "Introduction to Python programming",
        "category": "Fundamentals"
    },
    "Variables and Data Types": {
        "difficulty": 1.2,
        "estimated_time": "1.5 hours",
        "prerequisites": ["Python Basics"],
        "next_topics": ["Functions"],
        "description": "Understanding variables and data types",
        "category": "Fundamentals"
    },
    "Functions": {
        "difficulty": 2.3,
        "estimated_time": "3 hours",
        "prerequisites": ["Variables and Data Types"],
        "next_topics": ["Lists and Tuples"],
        "description": "Defining and using functions",
        "category": "Functions"
    },
    "Lists and Tuples": {
        "difficulty": 2.0,
        "estimated_time": "2 hours",
        "prerequisites": ["Functions"],
        "next_topics": ["Dictionaries"],
        "description": "Working with lists and tuples",
        "category": "Data Structures"
    },
    "Dictionaries": {
        "difficulty": 2.2,
        "estimated_time": "2 hours",
        "prerequisites": ["Lists and Tuples"],
        "next_topics": [],
        "description": "Understanding dictionaries",
        "category": "Data Structures"
    }
}

def get_curriculum():
    return PYTHON_CURRICULUM

def get_topic_info(topic_name):
    return PYTHON_CURRICULUM.get(topic_name)

def get_next_recommended_topic(completed_topics, current_difficulty):
    available = []
    for topic, info in PYTHON_CURRICULUM.items():
        if topic in completed_topics:
            continue
        prereqs = info.get("prerequisites", [])
        if all(p in completed_topics for p in prereqs):
            if abs(info["difficulty"] - current_difficulty) <= 0.8:
                available.append({"topic": topic, "difficulty": info["difficulty"], "info": info})
    
    if not available:
        for topic, info in PYTHON_CURRICULUM.items():
            if topic not in completed_topics:
                prereqs = info.get("prerequisites", [])
                if all(p in completed_topics for p in prereqs):
                    available.append({"topic": topic, "difficulty": info["difficulty"], "info": info})
    
    available.sort(key=lambda x: abs(x["difficulty"] - current_difficulty))
    
    if available:
        best = available[0]
        return {
            "next_topic": best["topic"],
            "difficulty": best["difficulty"],
            "estimated_time": best["info"]["estimated_time"],
            "description": best["info"]["description"],
            "category": best["info"]["category"]
        }
    
    return {
        "next_topic": "Python Basics",
        "difficulty": 1.0,
        "estimated_time": "2 hours",
        "description": "Start your Python journey",
        "category": "Fundamentals"
    }

def get_learning_path(completed_topics):
    path = []
    for topic, info in PYTHON_CURRICULUM.items():
        status = "completed" if topic in completed_topics else "available"
        prereqs = info.get("prerequisites", [])
        if status == "available" and not all(p in completed_topics for p in prereqs):
            status = "locked"
        path.append({
            "topic": topic,
            "status": status,
            "difficulty": info["difficulty"],
            "estimated_time": info["estimated_time"],
            "category": info["category"],
            "prerequisites": prereqs
        })
    return path