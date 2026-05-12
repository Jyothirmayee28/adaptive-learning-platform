from sqlalchemy import Column, Integer, String, Float, JSON
from app.database import Base

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    difficulty = Column(Float, default=1.0)
    prerequisites = Column(JSON, default=[])
    learning_outcomes = Column(JSON, default=[])
    content_url = Column(String, nullable=True)
    order_index = Column(Integer, default=0)

    def __repr__(self):
        return f"<Topic {self.name}>"