from db.database import SessionLocal
from db.models import Lead
import random

# Ouvre la session DB
session = SessionLocal()

# Récupère tous les leads
leads = session.query(Lead).all()
print(f"Nombre de leads: {len(leads)}")

# Mettre des valeurs factices
for lead in leads:
    # 50% de chance qu'un lead ait répondu
    lead.reply = random.choice([True, False])
    # 30% de chance qu'un lead soit converti
    lead.converted = random.choice([True, False, False])

# Sauvegarde
session.commit()
session.close()
print("Leads mis à jour avec replies et conversions factices !")
