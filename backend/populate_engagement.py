from db.database import SessionLocal
from db.models import Lead
import random

session = SessionLocal()
leads = session.query(Lead).all()

for lead in leads:
    lead.reply = random.choice([True, False])
    lead.converted = random.choice([True, False])
    lead.clicks = random.randint(0,5)
session.commit()
session.close()
print("Engagement mis à jour")
