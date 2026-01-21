from db.database import SessionLocal
from db.models import Lead
import random

session = SessionLocal()

leads = session.query(Lead).all()
for lead in leads:
    lead.likes = random.randint(10, 500)
    lead.retweets = random.randint(5, 200)
    lead.replies = random.randint(0, 100)
    lead.converted = random.randint(0, 1)
    lead.score = random.randint(50, 1000)
    lead.engagement = lead.likes + lead.retweets + lead.replies + lead.converted

session.commit()
session.close()
print("✅ Base de données mise à jour avec des données simulées")
