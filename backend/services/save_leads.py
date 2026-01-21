# backend/services/save_leads.py
from db.database import SessionLocal
from db.models import Lead

def save_leads(tweets, username):
    session = SessionLocal()
    if not tweets:
        print(f"0 tweets enregistrés pour {username}")
        return

    for t in tweets:
        lead = Lead(
            tweet_id=str(t.get("id", "n/a")),  # <-- utilise t, pas tweet
            username=username,
            text=t.get("tweet", ""),           # <-- sécurisé si tweet absent
            score=t.get("score", 0),
            reply=False,       # valeur par défaut
            converted=False,   # valeur par défaut
            clicks=t.get("clicks", 0),        # tu peux remplir si dispo
            likes=t.get("likes", 0),
            retweets=t.get("retweets", 0)
        )
        session.add(lead)

    session.commit()
    session.close()
    print(f"{len(tweets)} tweets enregistrés pour {username}")
