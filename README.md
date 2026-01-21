# twitter-leadgen-agent
Ce projet permet de récupérer les tweets d’utilisateurs Twitter via Nitter, de les stocker dans une base de données PostgreSQL, et d’afficher des statistiques et graphiques via un dashboard React.
Il inclut également un agent de génération de contenus basé sur LangChain pour créer des idées de tw (ReactJS Dashboard).

---
## 📂 Technologies utilisées
Backend : Python, FastAPI, SQLAlchemy, PostgreSQL

Frontend : React, Material UI

Scraping : Nitter (mirrors pour éviter le blocage)

IA : LangChain, HuggingFacePipeline

Autres : Axios pour les requêtes API, CORS configuré pour React

---
## 📂 Structure du projet
twitter-leadgen-agent/
├── backend/ # API FastAPI, agents et services
│ ├── agents/ # Agents d'analyse et génération de contenu
│ ├── db/ # Modèles et scripts PostgreSQL
│ ├── services/ # Services utilitaires
│ ├── main.py # Entrée principale FastAPI
│ └── .env # Variables d'environnement (API keys)
├── frontend/twitter-ai-dashboard/ # Dashboard ReactJS
└── README.md
---

## ⚙️ Prérequis
- Python 3.11+  
- Node.js 18+  
- Git  
- PostgreSQL  
---

##  Backend – Installation et lancement

1. **Cloner le projet**
bash
git clone https://github.com/DinaMechergui/twitter-leadgen-agent.git
cd twitter-leadgen-agent
2.Créer et activer l'environnement virtuel
# Windows
python -m venv venv311
.\venv311\Scripts\activate

# Linux/macOS
python -m venv venv311
source venv311/bin/activate
---
3.Installer les dépendances
pip install -r requirements.txt

---
4.Configurer les variables d'environnement
DATABASE_URL=postgresql://postgres:dina1234*@localhost:5432/genie
TWITTER_BEARER_TOKEN=
---
5.Lancer le backend
cd backend
uvicorn main:app --reload
---
## Frontend
Depuis le dossier frontend/twitter-ai-dashboard 
npm install
npm start
## Notes importantes
Nitter peut renvoyer une erreur 429 si trop de requêtes sont envoyées.
⚡ Solutions : ajouter un délai, utiliser différents miroirs Nitter, ou passer à l’API Twitter officielle.

Les colonnes likes, retweets, clicks, score sont initialisées à 0 si les données réelles ne sont pas disponibles.


