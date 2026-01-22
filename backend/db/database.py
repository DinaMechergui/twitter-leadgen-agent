# backend/db/database.py
# Configuration de la base de données avec SQLAlchemy

# Création du moteur de connexion à la base de données
from sqlalchemy import create_engine

# Gestion des sessions et base des modèles ORM
from sqlalchemy.orm import sessionmaker, declarative_base

# Accès aux variables d’environnement
import os

# Chargement des variables depuis le fichier .env
from dotenv import load_dotenv


# Charge les variables d'environnement (.env)
load_dotenv()

# Récupération de l'URL de la base de données
# Exemple : postgresql://user:password@localhost/dbname
DATABASE_URL = os.getenv("DATABASE_URL")


# Création du moteur SQLAlchemy
# Le moteur gère la connexion avec la base de données
engine = create_engine(DATABASE_URL)


# Création d'une fabrique de sessions
# Chaque requête à la base utilisera une session
SessionLocal = sessionmaker(bind=engine)


# Base commune pour toutes les classes modèles
# Toutes les entités hériteront de cette classe
Base = declarative_base()


# -------------------------------
# Initialisation des tables
# -------------------------------

# Import obligatoire des modèles
# Permet à SQLAlchemy de connaître toutes les tables
from db import models

# Création automatique des tables dans la base de données
# si elles n'existent pas déjà
Base.metadata.create_all(bind=engine)
