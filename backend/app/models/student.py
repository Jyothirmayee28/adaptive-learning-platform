from sqlalchemy import Column, Integer, String, Float, JSON
from app.database import Base

class Student(Base):
    __tablename__ = "students"
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)  # Changed back to password
    role = Column(String, default="student")  # ADDED role field
    current_topic = Column(String, default="Python Basics")
    difficulty_level = Column(Float, default=1.0)
    completed_topics = Column(JSON, default=list)
    knowledge_state = Column(JSON, default=dict)
    performance_history = Column(JSON, default=list)
    average_score = Column(Float, default=0.0)