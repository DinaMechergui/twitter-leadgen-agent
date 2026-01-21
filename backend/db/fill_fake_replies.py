# db/fill_fake_replies.py
from db.database import SessionLocal
from db.models import Lead
import random

session = SessionLocal()
leads = session.query(Lead).all()

for lead in leads:
    lead.reply = random.choice([True, False])
    lead.converted = random.choice([True, False])
session.commit()
session.close()
print("Réponses et conversions simulées ✅")
