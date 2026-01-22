# backend/main.py
# Fichier principal FastAPI pour le backend

from fastapi import BackgroundTasks, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import desc, func
from pydantic import BaseModel

# Import des services et agents
from services.save_leads import save_leads
from db.database import SessionLocal
from db.models import Lead, TweetIdea
from agents.tweet_monitor import monitor_account, get_tweets
from agents.content_agent import run_content_agent


# -------------------------------
# INITIALISATION FASTAPI
# -------------------------------
app = FastAPI()

# Définition des schémas Pydantic pour les requêtes POST
class GenerateRequest(BaseModel):
    username: str

class AddUsernameRequest(BaseModel):
    username: str


# CORS pour autoriser le frontend React
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------
# ROUTE : STATS GÉNÉRALES
# -------------------------------
@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    """
    Retourne les statistiques globales du dashboard :
    - total leads
    - réponses reçues
    - taux de conversion
    """
    session = SessionLocal()

    total_leads = session.query(Lead).count()
    total_replies = session.query(Lead).filter(Lead.reply == True).count()
    total_conversions = session.query(Lead).filter(Lead.converted == True).count()
    ctr = round((total_replies / total_leads) * 100, 2) if total_leads else 0

    session.close()
    return {
        "leadsContacted": total_leads,
        "repliesReceived": total_replies,
        "clickThroughRate": ctr,
        "conversions": total_conversions
    }


# -------------------------------
# ROUTE : LEADS CHART
# -------------------------------
@app.get("/api/dashboard/leads_chart")
def get_leads_chart():
    """
    Retourne les données pour le graphique des leads par utilisateur
    """
    session = SessionLocal()
    leads = session.query(Lead.username).all()
    session.close()

    chart_data = {}
    for (username,) in leads:
        chart_data[username] = chart_data.get(username, 0) + 1

    return {
        "labels": list(chart_data.keys()),
        "datasets": [
            {
                "label": "Leads Contacted",
                "data": list(chart_data.values()),
                "backgroundColor": ["#1E90FF", "#32CD32", "#FFA500", "#FF6347"]
            }
        ]
    }


# -------------------------------
# ROUTE : ENGAGEMENT
# -------------------------------
@app.get("/api/dashboard/engagement")
def get_engagement():
    """
    Retourne l'engagement des leads :
    - username
    - tweet
    - réponses reçues
    - conversions
    """
    session = SessionLocal()
    leads = session.query(Lead).all()
    session.close()

    return [
        {
            "username": l.username,
            "tweet": l.text,
            "replies": int(l.reply),
            "conversions": int(l.converted)
        }
        for l in leads
    ]


# -------------------------------
# ROUTE : TOP TWEETS
# -------------------------------
@app.get("/api/dashboard/top_tweets")
def get_top_tweets():
    """
    Retourne les 10 tweets les mieux scorés pour le dashboard
    """
    session = SessionLocal()
    tweets = session.query(Lead)\
        .order_by(desc(func.coalesce(Lead.score, 0)))\
        .limit(10)\
        .all()
    session.close()

    return [
        {
            "tweet": t.text,
            "username": t.username,
            "score": t.score or 0,
            "likes": t.likes or 0,
            "retweets": t.retweets or 0,
            "replies": t.reply or 0,
            "converted": t.converted or 0,
            "engagement": (t.likes or 0) + (t.retweets or 0) + (t.reply or 0) + (t.converted or 0)
        }
        for t in tweets
    ]


# -------------------------------
# ROUTE : TWEET IDEAS
# -------------------------------
@app.get("/api/dashboard/tweet_ideas")
def get_tweet_ideas_route():
    """
    Retourne les 10 dernières idées de tweets générées
    """
    session = SessionLocal()
    ideas = session.query(TweetIdea)\
        .order_by(TweetIdea.created_at.desc())\
        .limit(10)\
        .all()
    session.close()

    return [{"text": t.text, "source": t.source} for t in ideas]


# -------------------------------
# ROUTE : GENERER DES TWEETS
# -------------------------------
@app.post("/api/dashboard/generate_tweets")
def generate_tweets(request: GenerateRequest, background_tasks: BackgroundTasks):
    """
    Génère des idées de tweets pour un username donné
    et lance la tâche en arrière-plan
    """
    # Récupération de 5 tweets simulés de l'utilisateur
    tweets_data = monitor_account(request.username, limit=5)
    tweets = [t["tweet"] for t in tweets_data]

    # Lancement de l'agent de génération de contenu en background
    background_tasks.add_task(run_content_agent, tweets, request.username)

    return {"status": "generation started"}


# -------------------------------
# ROUTE : AJOUTER UN UTILISATEUR
# -------------------------------
@app.post("/api/dashboard/add_username")
def add_username(request: AddUsernameRequest):
    """
    Récupère des tweets réels via Nitter et les enregistre comme leads
    """
    username = request.username
    tweets_data = get_tweets(username, limit=5)
    save_leads(tweets_data, username)

    return {"message": f"{len(tweets_data)} tweets ajoutés pour {username}"}
