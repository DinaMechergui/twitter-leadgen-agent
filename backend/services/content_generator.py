# AGENTS/content_generator.py
# Agent responsable de la génération d'idées de tweets
# à l'aide d'un modèle de langage (LLM)

from transformers import pipeline


# -------------------------------
# Initialisation du modèle NLP
# -------------------------------

# Création d'un pipeline de génération de texte
# distilgpt2 est un modèle léger, rapide et gratuit
generator = pipeline(
    "text-generation",          # Tâche : génération de texte
    model="distilgpt2",          # Modèle utilisé
    device=-1                    # Exécution sur CPU
)


# -------------------------------
# Fonction de génération de tweets
# -------------------------------

def generate_tweet_ideas(tweets, patterns, num_ideas=3):
    """
    Génère des idées de tweets à partir de patterns analysés.
    
    - tweets : tweets d'entrée (non utilisés directement ici)
    - patterns : statistiques extraites (longueur, emojis, liens)
    - num_ideas : nombre d'idées à retourner
    """

    ideas = []

    # Règles dynamiques basées sur l'analyse des tweets existants
    emoji = "Use emojis." if patterns["emoji_ratio"] > 0.3 else "No emojis."
    link = "Include a link." if patterns["link_ratio"] > 0.2 else "No links."

    # Construction du prompt envoyé au modèle
    prompt = f"""
    Write a professional tweet for an AI startup.
    Average length: {patterns["avg_length"]} characters.
    {emoji}
    {link}
    Be engaging and concise.
    Tweet:
    """

    # Appel au modèle de génération de texte
    outputs = generator(
        prompt,
        max_new_tokens=40,        # Longueur maximale du tweet généré
        do_sample=True,           # Génération non déterministe
        temperature=0.8,          # Niveau de créativité
        return_full_text=False    # Retourne uniquement le texte généré
    )

    # Nettoyage et récupération des tweets générés
    for out in outputs:
        text = out["generated_text"].strip()
        if text:
            ideas.append(text)

    # Retourne le nombre d'idées demandé
    return ideas[:num_ideas]
