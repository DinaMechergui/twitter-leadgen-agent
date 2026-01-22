# Import du pipeline Hugging Face pour utiliser un modèle NLP
from transformers import pipeline

# Import du système de prompt LangChain
from langchain_core.prompts import PromptTemplate

# Wrapper LangChain pour utiliser un pipeline Hugging Face comme LLM
from langchain_community.llms import HuggingFacePipeline

# Import de la fonction qui extrait des patterns à partir des tweets
from services.pattern_extractor import extract_patterns


# -------------------------------
# Initialisation du modèle LLM local
# -------------------------------

# Création d’un pipeline de génération de texte
# distilgpt2 est un modèle léger et rapide
hf_pipeline = pipeline(
    "text-generation",          # Tâche NLP : génération de texte
    model="distilgpt2",          # Modèle utilisé
    max_new_tokens=80,           # Nombre maximum de tokens générés
    temperature=0.8              # Créativité du modèle
)

# Adaptation du pipeline Hugging Face pour LangChain
llm = HuggingFacePipeline(pipeline=hf_pipeline)


# -------------------------------
# Définition du prompt LangChain
# -------------------------------

# Template de prompt avec variables dynamiques
prompt = PromptTemplate(
    input_variables=["avg_length", "emoji_ratio", "link_ratio"],
    template="""
You are a growth marketer for an AI startup.

Rules:
- Average tweet length: {avg_length} characters
- Emoji usage ratio: {emoji_ratio}
- Link usage ratio: {link_ratio}

Generate 5 engaging tweets, each on a new line.
"""
)

# Création de la chaîne LangChain (nouvelle syntaxe Runnable)
# Le prompt est envoyé au LLM automatiquement
chain = prompt | llm


# -------------------------------
# Fonction principale de génération
# -------------------------------

def generate_with_langchain(tweets):
    """
    Génère des idées de tweets à partir de tweets existants
    en utilisant LangChain et un LLM.
    """

    # Extraction des patterns depuis les tweets d'entrée
    # (longueur moyenne, emojis, liens, etc.)
    patterns = extract_patterns(tweets)

    # Exécution de la chaîne LangChain avec les valeurs calculées
    result = chain.invoke({
        "avg_length": patterns["avg_length"],
        "emoji_ratio": patterns["emoji_ratio"],
        "link_ratio": patterns["link_ratio"]
    })

    # Nettoyage du résultat :
    # - séparation par ligne
    # - suppression des lignes vides
    return [t.strip() for t in result.split("\n") if t.strip()]
