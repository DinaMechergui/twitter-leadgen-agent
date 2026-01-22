# Module pour générer des valeurs aléatoires (simulation)
import random

# BeautifulSoup permet d'analyser du HTML (scraping)
from bs4 import BeautifulSoup

# Requests permet d'envoyer des requêtes HTTP
import requests


# Mots-clés utilisés plus tard pour filtrer ou analyser les tweets
KEYWORDS = ["ai", "startup", "automation", "saas"]


def get_tweets(username, limit=5):
    """
    Récupère les tweets publics d'un utilisateur Twitter
    via l'instance Nitter (sans utiliser l'API Twitter).
    """

    # URL du profil Nitter de l'utilisateur
    url = f"https://nitter.net/{username}"

    # Headers pour simuler un navigateur réel
    # (évite d'être bloqué par le site)
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "en-US,en;q=0.9"
    }

    try:
        # Envoi de la requête HTTP vers Nitter
        r = requests.get(url, headers=headers, timeout=10)

        # Vérification du code HTTP
        if r.status_code != 200:
            print(f"Erreur {r.status_code} pour {username}")
            return []

        # Analyse du HTML retourné par Nitter
        soup = BeautifulSoup(r.text, "html.parser")

        # Chaque tweet est contenu dans une div "timeline-item"
        tweets_html = soup.find_all("div", class_="timeline-item")

        tweets = []

        # Parcours des tweets trouvés (limité par "limit")
        for tweet_html in tweets_html[:limit]:

            # Extraction du contenu texte du tweet
            content = tweet_html.find("div", class_="tweet-content")

            if content:
                # Nettoyage du texte du tweet
                text = content.get_text(separator=" ", strip=True)

                # Ajout du tweet sous forme de dictionnaire
                tweets.append({
                    "tweet": text,
                    "score": 0,        # Score calculé plus tard
                    "likes": 0,        # Placeholder
                    "retweets": 0,     # Placeholder
                    "clicks": 0        # Placeholder
                })

        # Retourne la liste des tweets récupérés
        return tweets

    except Exception as e:
        # Gestion des erreurs (connexion, parsing, etc.)
        print("Erreur get_tweets:", e)
        return []


def monitor_account(username, limit=8):
    """
    Simule la surveillance d'un compte Twitter.
    Utile pour les tests sans dépendre de Twitter ou Nitter.
    """

    tweets = []

    # Génération de tweets simulés
    for i in range(limit):

        # Simulation des métriques d'engagement
        likes = random.randint(10, 500)
        retweets = random.randint(5, 200)
        replies = random.randint(0, 100)
        converted = random.randint(0, 1)

        # Calcul de l'engagement total
        engagement = likes + retweets + replies + converted

        # Ajout du tweet simulé
        tweets.append({
            "tweet": f"Tweet simulé {i+1} de {username}",
            "username": username,
            "likes": likes,
            "retweets": retweets,
            "replies": replies,
            "converted": converted,
            "engagement": engagement,
            "score": random.randint(50, 1000)
        })

    # Retourne la liste des tweets simulés
    return tweets
