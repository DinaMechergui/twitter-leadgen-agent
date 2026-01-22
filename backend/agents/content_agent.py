# Import de la fonction qui génère des idées de tweets
# en utilisant LangChain et un modèle de langage (LLM)
from agents.langchain_content_agent import generate_with_langchain

# Import de la fonction responsable de sauvegarder
# les idées de tweets générées (ex: base de données)
from services.save_content import save_tweet_ideas


def run_content_agent(tweets, source):
    """
    Agent de génération de contenu.
    - tweets : liste de tweets analysés
    - source : origine des tweets (username, campagne, agent, etc.)
    """

    # Vérification : si aucun tweet n'est fourni,
    # on arrête l'exécution pour éviter des erreurs
    if not tweets:
        return

    # Génération d'idées de tweets à partir des tweets existants
    # via LangChain et un modèle de langage (LLM)
    ideas = generate_with_langchain(tweets)

    # Sauvegarde des idées générées avec leur source
    # pour un usage futur (dashboard, statistiques, etc.)
    save_tweet_ideas(ideas, source)
