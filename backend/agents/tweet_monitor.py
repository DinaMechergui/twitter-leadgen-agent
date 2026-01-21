import random

from bs4 import BeautifulSoup
import requests  # <- assure-toi que c'est bien ça

KEYWORDS = ["ai", "startup", "automation", "saas"]

def get_tweets(username, limit=5):
    url = f"https://nitter.net/{username}"
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "en-US,en;q=0.9"
    }

    try:
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code != 200:
            print(f"Erreur {r.status_code} pour {username}")
            return []

        soup = BeautifulSoup(r.text, "html.parser")
        tweets_html = soup.find_all("div", class_="timeline-item")  # Chaque tweet est dans cette div

        tweets = []
        for tweet_html in tweets_html[:limit]:
            content = tweet_html.find("div", class_="tweet-content")
            if content:
                text = content.get_text(separator=" ", strip=True)
                tweets.append({
                    "tweet": text,
                    "score": 0,       # tu peux calculer un score plus tard
                    "likes": 0,
                    "retweets": 0,
                    "clicks": 0
                })
        return tweets

    except Exception as e:
        print("Erreur get_tweets:", e)
        return []

def monitor_account(username, limit=8):
    tweets = []
    for i in range(limit):
        likes = random.randint(10, 500)
        retweets = random.randint(5, 200)
        replies = random.randint(0, 100)
        converted = random.randint(0, 1)
        engagement = likes + retweets + replies + converted

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
    return tweets