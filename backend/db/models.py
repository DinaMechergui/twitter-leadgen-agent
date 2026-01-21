# db/models.py
import random
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from db.database import Base
from datetime import datetime

from sqlalchemy import Column, Integer, String, Boolean

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    tweet_id = Column(String, nullable=True)
    username = Column(String)
    text = Column(String)
    reply = Column(Boolean, default=False)
    converted = Column(Boolean, default=False)
    score = Column(Integer, default=0)
    likes = Column(Integer, default=0)      # <-- ajouter
    retweets = Column(Integer, default=0)  
    clicks = Column(Integer, default=0)  # <-- ajouter


class TweetIdea(Base):
    __tablename__ = "tweet_ideas"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    source = Column(String, nullable=True)
    created_at = Column(DateTime)