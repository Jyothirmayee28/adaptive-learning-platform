from fastapi import APIRouter, HTTPException

router = APIRouter()

# Complete Course Content
COURSE_CONTENT = {
    "Python Basics": {
        "difficulty": 1.0,
        "prerequisites": [],
        "category": "Fundamentals",
        "estimated_time": "2 hours",
        "description": "Introduction to Python programming language, syntax, and basic concepts.",
        "key_concepts": [
            "Python installation and setup",
            "Interactive Python shell and IDLE",
            "Writing and running Python scripts",
            "Basic syntax and indentation rules",
            "Comments and documentation"
        ],
        "why_matters": "Python is one of the most popular programming languages in the world, used in web development, data science, AI, and automation. Learning Python basics is the foundation for all advanced topics.",
        "learning_objectives": [
            "Understand what Python is and why it's useful",
            "Set up Python development environment",
            "Write and execute simple Python programs",
            "Understand Python syntax and conventions"
        ],
        "content": {
            "introduction": """
Python is a high-level, interpreted programming language known for its simplicity and readability. 
Created by Guido van Rossum in 1991, Python emphasizes code readability with its use of significant indentation.

Key Features:
- Easy to learn and read
- Extensive standard library
- Cross-platform compatibility
- Large and active community
- Versatile for multiple domains (web, data science, AI, automation)
            """,
            "syntax_basics": """
# This is a comment in Python
print("Hello, World!")  # This prints text to console

# Variables don't need type declaration
name = "Alice"
age = 25
is_student = True

# Indentation is crucial in Python
if age >= 18:
    print("Adult")
else:
    print("Minor")
            """,
            "examples": [
                {
                    "title": "Hello World",
                    "code": 'print("Hello, World!")',
                    "output": "Hello, World!"
                },
                {
                    "title": "Simple Calculator",
                    "code": """a = 10
b = 5
print(f"Sum: {a + b}")
print(f"Difference: {a - b}")
print(f"Product: {a * b}")
print(f"Division: {a / b}")""",
                    "output": "Sum: 15\nDifference: 5\nProduct: 50\nDivision: 2.0"
                }
            ]
        },
        "resources": [
            "Official Python Tutorial: https://docs.python.org/3/tutorial/",
            "Python for Beginners: https://www.python.org/about/gettingstarted/",
            "Real Python Tutorials: https://realpython.com/"
        ]
    },
    
    "Variables and Data Types": {
        "difficulty": 1.2,
        "prerequisites": ["Python Basics"],
        "category": "Fundamentals",
        "estimated_time": "3 hours",
        "description": "Understanding variables, data types, and type conversion in Python.",
        "key_concepts": [
            "Variable declaration and naming rules",
            "Numeric types (int, float, complex)",
            "Strings and string operations",
            "Boolean values",
            "Type conversion and casting",
            "None type"
        ],
        "why_matters": "Data types are fundamental to programming. Understanding how Python handles different types of data is essential for writing effective programs and avoiding common errors.",
        "learning_objectives": [
            "Declare and use variables effectively",
            "Understand different data types in Python",
            "Perform type conversion when needed",
            "Work with strings and numbers"
        ],
        "content": {
            "introduction": """
Variables are containers for storing data values. Python is dynamically typed, meaning you don't need to 
declare the type of a variable explicitly. The type is inferred from the value assigned.

Python has several built-in data types:
- Numeric: int, float, complex
- Text: str
- Boolean: bool
- Sequence: list, tuple, range
- Mapping: dict
- Set: set, frozenset
            """,
            "examples": [
                {
                    "title": "Variable Declaration",
                    "code": """# Integer
age = 25

# Float
price = 99.99

# String
name = "Alice"

# Boolean
is_active = True

# Multiple assignment
x, y, z = 1, 2, 3"""
                },
                {
                    "title": "Type Checking and Conversion",
                    "code": """# Check type
x = 10
print(type(x))  # <class 'int'>

# Type conversion
num_str = "123"
num_int = int(num_str)
num_float = float(num_str)"""
                }
            ]
        }
    },

    "Control Flow - If Statements": {
        "difficulty": 1.5,
        "prerequisites": ["Variables and Data Types"],
        "category": "Fundamentals",
        "estimated_time": "2.5 hours",
        "description": "Learn conditional logic and decision-making in Python programs.",
        "key_concepts": [
            "if, elif, else statements",
            "Comparison operators",
            "Logical operators (and, or, not)",
            "Nested conditionals",
            "Ternary operator"
        ],
        "why_matters": "Control flow allows programs to make decisions and execute different code based on conditions. This is essential for creating dynamic, responsive programs.",
        "content": {
            "introduction": """
Control flow statements allow you to control the execution path of your program based on conditions.
The if statement is the most fundamental control flow statement.

Syntax:
if condition:
    # code block
elif another_condition:
    # code block
else:
    # code block
            """,
            "examples": [
                {
                    "title": "Basic If Statement",
                    "code": """age = 18

if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")"""
                },
                {
                    "title": "Multiple Conditions",
                    "code": """score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
    
print(f"Grade: {grade}")"""
                }
            ]
        }
    },

    "Loops - For and While": {
        "difficulty": 1.6,
        "prerequisites": ["Control Flow - If Statements"],
        "category": "Fundamentals",
        "estimated_time": "3 hours",
        "description": "Master iteration and repetition using for and while loops.",
        "key_concepts": [
            "For loops and range()",
            "While loops",
            "Loop control (break, continue)",
            "Nested loops",
            "Loop else clause"
        ],
        "why_matters": "Loops are fundamental for automation and processing collections of data. They allow you to perform repetitive tasks efficiently.",
        "content": {
            "introduction": """
Loops allow you to execute a block of code repeatedly. Python has two main types of loops:
- for loops: iterate over sequences
- while loops: repeat while a condition is true
            """,
            "examples": [
                {
                    "title": "For Loop Examples",
                    "code": """# Loop through range
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# Loop through list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)"""
                },
                {
                    "title": "While Loop Examples",
                    "code": """# Basic while loop
count = 0
while count < 5:
    print(count)
    count += 1"""
                }
            ]
        }
    },

    "Lists and Tuples": {
        "difficulty": 2.0,
        "prerequisites": ["Loops - For and While"],
        "category": "Data Structures",
        "estimated_time": "3 hours",
        "description": "Work with ordered collections of data using lists and tuples.",
        "key_concepts": [
            "List creation and indexing",
            "List methods (append, extend, insert, remove)",
            "List slicing",
            "List comprehensions",
            "Tuples and immutability"
        ],
        "why_matters": "Lists and tuples are essential data structures for storing and manipulating collections of data.",
        "content": {
            "introduction": """
Lists and tuples are sequence data types that can store multiple items.

Lists: Ordered, mutable (can be changed)
Tuples: Ordered, immutable (cannot be changed)
            """,
            "examples": [
                {
                    "title": "List Operations",
                    "code": """# Create list
numbers = [1, 2, 3, 4, 5]

# Modify
numbers.append(6)
numbers.insert(0, 0)

# List comprehension
squares = [x**2 for x in range(5)]"""
                }
            ]
        }
    },

    "Dictionaries": {
        "difficulty": 2.2,
        "prerequisites": ["Lists and Tuples"],
        "category": "Data Structures",
        "estimated_time": "3 hours",
        "description": "Master key-value pair data structures for efficient data lookup.",
        "key_concepts": [
            "Dictionary creation and access",
            "Dictionary methods",
            "Adding and removing items",
            "Dictionary comprehensions"
        ],
        "why_matters": "Dictionaries are one of Python's most powerful data structures, providing fast lookups and flexible data organization.",
        "content": {
            "introduction": """
Dictionaries store key-value pairs.
Syntax: {key: value, key2: value2}
            """,
            "examples": [
                {
                    "title": "Dictionary Basics",
                    "code": """student = {
    "name": "Alice",
    "age": 20,
    "major": "CS"
}

# Access
name = student["name"]
age = student.get("age", 0)"""
                }
            ]
        }
    },

    "Functions": {
        "difficulty": 2.3,
        "prerequisites": ["Dictionaries"],
        "category": "Programming Concepts",
        "estimated_time": "4 hours",
        "description": "Create reusable code blocks with functions, arguments, and return values.",
        "key_concepts": [
            "Function definition and calling",
            "Parameters and arguments",
            "Return values",
            "Lambda functions"
        ],
        "why_matters": "Functions are the building blocks of modular, reusable code.",
        "content": {
            "introduction": """
Functions are reusable blocks of code that perform specific tasks.

Syntax:
def function_name(parameters):
    # code block
    return value
            """,
            "examples": [
                {
                    "title": "Basic Functions",
                    "code": """def greet(name):
    return f"Hello, {name}!"

def add(a, b):
    return a + b

message = greet("Alice")"""
                }
            ]
        }
    },

    "File Handling": {
        "difficulty": 2.8,
        "prerequisites": ["Functions"],
        "category": "Programming Concepts",
        "estimated_time": "3 hours",
        "description": "Read from and write to files, work with file paths.",
        "key_concepts": [
            "Opening and closing files",
            "Reading files",
            "Writing to files",
            "File modes",
            "Context managers"
        ],
        "why_matters": "File handling is essential for data persistence and working with external data.",
        "content": {
            "introduction": """
File handling allows programs to store and retrieve data permanently.

File modes:
- 'r': Read
- 'w': Write (overwrites)
- 'a': Append
            """,
            "examples": [
                {
                    "title": "Reading Files",
                    "code": """with open('file.txt', 'r') as f:
    content = f.read()
    print(content)"""
                }
            ]
        }
    },

    "Error Handling": {
        "difficulty": 3.0,
        "prerequisites": ["File Handling"],
        "category": "Programming Concepts",
        "estimated_time": "3 hours",
        "description": "Handle exceptions and errors gracefully in your programs.",
        "key_concepts": [
            "try-except blocks",
            "Multiple except clauses",
            "Raising exceptions",
            "Custom exceptions"
        ],
        "why_matters": "Error handling makes programs robust and user-friendly.",
        "content": {
            "introduction": """
Errors (exceptions) occur during program execution.
Python provides mechanisms to catch and handle them.
            """,
            "examples": [
                {
                    "title": "Basic Exception Handling",
                    "code": """try:
    number = int(input("Enter: "))
    result = 10 / number
except ValueError:
    print("Invalid number!")
except ZeroDivisionError:
    print("Cannot divide by zero!")"""
                }
            ]
        }
    },

    "Object-Oriented Programming": {
        "difficulty": 3.2,
        "prerequisites": ["Error Handling"],
        "category": "Advanced Python",
        "estimated_time": "5 hours",
        "description": "Master classes, objects, inheritance, and OOP principles.",
        "key_concepts": [
            "Classes and objects",
            "Attributes and methods",
            "Constructor (__init__)",
            "Inheritance",
            "Polymorphism"
        ],
        "why_matters": "OOP helps organize complex programs and promote code reuse.",
        "content": {
            "introduction": """
Object-Oriented Programming organizes code around objects.

Four pillars:
1. Encapsulation
2. Abstraction
3. Inheritance
4. Polymorphism
            """,
            "examples": [
                {
                    "title": "Basic Class",
                    "code": """class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        return f"Hi, I'm {self.name}"

alice = Student("Alice", 20)"""
                }
            ]
        }
    },

    "NumPy Basics": {
        "difficulty": 3.5,
        "prerequisites": ["Object-Oriented Programming"],
        "category": "Data Science",
        "estimated_time": "4 hours",
        "description": "Master numerical computing with NumPy arrays.",
        "key_concepts": [
            "NumPy arrays",
            "Array operations",
            "Mathematical functions",
            "Array reshaping"
        ],
        "why_matters": "NumPy is the foundation of scientific computing in Python.",
        "content": {
            "introduction": """
NumPy (Numerical Python) provides multi-dimensional arrays.

Why NumPy?
- 50x faster than Python lists
- Less memory usage
- Convenient mathematical operations
            """,
            "examples": [
                {
                    "title": "Array Creation",
                    "code": """import numpy as np

arr = np.array([1, 2, 3, 4, 5])
zeros = np.zeros((3, 4))
ones = np.ones((2, 3))"""
                }
            ]
        }
    },

    "Pandas Basics": {
        "difficulty": 3.8,
        "prerequisites": ["NumPy Basics"],
        "category": "Data Science",
        "estimated_time": "5 hours",
        "description": "Data manipulation and analysis with pandas.",
        "key_concepts": [
            "Series and DataFrames",
            "Reading data",
            "Data selection",
            "Data aggregation"
        ],
        "why_matters": "Pandas is the standard library for data analysis in Python.",
        "content": {
            "introduction": """
Pandas provides powerful data manipulation tools.

Key structures:
- Series: 1D labeled array
- DataFrame: 2D table
            """,
            "examples": [
                {
                    "title": "Creating DataFrames",
                    "code": """import pandas as pd

data = {
    'name': ['Alice', 'Bob'],
    'age': [25, 30]
}
df = pd.DataFrame(data)"""
                }
            ]
        }
    },

    "Data Visualization": {
        "difficulty": 4.2,
        "prerequisites": ["Pandas Basics"],
        "category": "Data Science",
        "estimated_time": "4 hours",
        "description": "Create visualizations with Matplotlib and Seaborn.",
        "key_concepts": [
            "Line plots",
            "Bar charts",
            "Scatter plots",
            "Customizing plots"
        ],
        "why_matters": "Data visualization is crucial for exploring and communicating insights.",
        "content": {
            "introduction": """
Transform data into visual representations.

Main libraries:
- Matplotlib: Flexible plotting
- Seaborn: Statistical plots
            """,
            "examples": [
                {
                    "title": "Basic Plot",
                    "code": """import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]

plt.plot(x, y)
plt.show()"""
                }
            ]
        }
    },

    "Machine Learning Basics": {
        "difficulty": 4.5,
        "prerequisites": ["Data Visualization"],
        "category": "Machine Learning & AI",
        "estimated_time": "6 hours",
        "description": "Introduction to machine learning with scikit-learn.",
        "key_concepts": [
            "Supervised learning",
            "Linear regression",
            "Classification",
            "Model evaluation"
        ],
        "why_matters": "Machine learning enables computers to learn from data.",
        "content": {
            "introduction": """
Machine Learning enables computers to learn patterns from data.

Types:
1. Supervised Learning
2. Unsupervised Learning
3. Reinforcement Learning
            """,
            "examples": [
                {
                    "title": "Linear Regression",
                    "code": """from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)"""
                }
            ]
        }
    }
}


@router.get("/api/content-library/all")
def get_all_content():
    """Get all course content"""
    return {
        "success": True,
        "content": COURSE_CONTENT
    }


@router.get("/api/content-library/topics")
def get_all_topics():
    """Get list of all topics"""
    topics = []
    for topic_name, info in COURSE_CONTENT.items():
        topics.append({
            "name": topic_name,
            "category": info["category"],
            "difficulty": info["difficulty"],
            "estimated_time": info["estimated_time"],
            "description": info["description"]
        })
    
    # Sort by difficulty
    topics.sort(key=lambda x: x["difficulty"])
    
    return {
        "success": True,
        "topics": topics
    }


@router.get("/api/content-library/topic/{topic_name}")
def get_topic_content(topic_name: str):
    """Get detailed content for a specific topic"""
    if topic_name not in COURSE_CONTENT:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    return {
        "success": True,
        "topic": topic_name,
        "content": COURSE_CONTENT[topic_name]
    }


@router.get("/api/content-library/categories")
def get_categories():
    """Get all categories"""
    categories = {}
    
    for topic_name, info in COURSE_CONTENT.items():
        category = info["category"]
        if category not in categories:
            categories[category] = []
        
        categories[category].append({
            "name": topic_name,
            "difficulty": info["difficulty"],
            "estimated_time": info["estimated_time"]
        })
    
    # Sort topics within each category by difficulty
    for category in categories:
        categories[category].sort(key=lambda x: x["difficulty"])
    
    return {
        "success": True,
        "categories": categories
    }


@router.get("/api/content-library/search")
def search_content(query: str):
    """Search topics by keyword"""
    results = []
    query_lower = query.lower()
    
    for topic_name, info in COURSE_CONTENT.items():
        # Search in topic name, description, and key concepts
        if (query_lower in topic_name.lower() or
            query_lower in info["description"].lower() or
            any(query_lower in concept.lower() for concept in info["key_concepts"])):
            results.append({
                "name": topic_name,
                "category": info["category"],
                "difficulty": info["difficulty"],
                "description": info["description"]
            })
    
    return {
        "success": True,
        "query": query,
        "results": results,
        "count": len(results)
    }