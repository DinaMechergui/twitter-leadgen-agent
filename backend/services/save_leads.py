# backend/services/save_leads.py
# Service responsable de la sauvegarde des leads extraits de tweets

# Import de la session SQLAlchemy
from db.database import SessionLocal

# Import du modèle Lead (table des leads)
from db.models import Lead


def save_leads(tweets, username):
    """
    Sauvegarde les tweets d'un utilisateur comme "leads" en base.
    
    - tweets : liste de tweets (dictionnaires) récupérés
    - username : nom de l'utilisateur dont proviennent les tweets
    """

    # Création d'une session SQLAlchemy
    session = SessionLocal()

    # Vérification si la liste est vide
    if not tweets:
        print(f"0 tweets enregistrés pour {username}")
        return

    # Parcours de chaque tweet pour créer un Lead
    for t in tweets:
        lead = Lead(
            tweet_id=str(t.get("id", "n/a")),  # ID du tweet ou "n/a" si absent
            username=username,                 # Nom de l'utilisateur
            text=t.get("tweet", ""),           # Texte du tweet (sécurisé)
            score=t.get("score", 0),           # Score calculé pour ce tweet
            reply=False,                       # Par défaut : pas encore répondu
            converted=False,                   # Par défaut : pas encore converti
            clicks=t.get("clicks", 0),         # Nombre de clics simulés ou réels
            likes=t.get("likes", 0),           # Nombre de likes
            retweets=t.get("retweets", 0)      # Nombre de retweets
        )

        # Ajout du lead à la session
        session.add(lead)

    # Validation et enregistrement définitif en base
    session.commit()

    # Fermeture de la session pour libérer les ressources
    session.close()

    # Log de confirmation
    print(f"{len(tweets)} tweets enregistrés pour {username}")
