# backend/services/save_content.py
# Service responsable de la sauvegarde des idées de tweets en base de données

# Import de la session SQLAlchemy
from db.database import SessionLocal

# Import du modèle ORM TweetIdea
from db.models import TweetIdea

# Utilisé pour enregistrer la date de création
from datetime import datetime


def save_tweet_ideas(ideas, source):
    """
    Sauvegarde une liste d'idées de tweets dans la base de données.

    - ideas : liste de textes générés par l'IA
    - source : origine des tweets (compte, campagne, agent, etc.)
    """

    # Ouverture d'une session avec la base de données
    session = SessionLocal()

    # Parcours de chaque idée générée
    for text in ideas:
        # Création d'un nouvel objet TweetIdea
        idea = TweetIdea(
            text=text,                     # Contenu du tweet
            source=source,                 # Source de génération
            created_at=datetime.now()       # Date de création
        )

        # Ajout de l'objet à la session
        session.add(idea)

    # Validation et enregistrement définitif en base
    session.commit()

    # Fermeture de la session pour libérer les ressources
    session.close()

    # Log de confirmation (debug / suivi)
    print(f"{len(ideas)} idées de tweets enregistrées pour {source}")
