# backend/services/save_content.py
from db.database import SessionLocal
from db.models import TweetIdea
from datetime import datetime

def save_tweet_ideas(ideas, source):
    session = SessionLocal()
    for text in ideas:
        idea = TweetIdea(
            text=text,
            source=source,
            created_at=datetime.now()
        )
        session.add(idea)
    session.commit()
    session.close()
    print(f"{len(ideas)} idées de tweets enregistrées pour {source}")
