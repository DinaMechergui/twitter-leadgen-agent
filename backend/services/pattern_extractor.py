def extract_patterns(tweets):
    """
    Analyse une liste de tweets pour extraire des statistiques
    utilisées ensuite par l'agent de génération de contenu.
    """

    # Calcul de la longueur totale de tous les tweets
    total_len = sum(len(t) for t in tweets)

    # Comptage du nombre total d'emojis spécifiques utilisés
    # (ici une liste d'emojis ciblés)
    emoji = sum(1 for t in tweets for c in t if c in "🚀🤖🔥")

    # Comptage du nombre de liens (présence de 'http')
    links = sum(t.count("http") for t in tweets)

    # Retour des patterns calculés
    return {
        # Longueur moyenne des tweets
        "avg_length": total_len // len(tweets),

        # Ratio d'utilisation des emojis par tweet
        "emoji_ratio": emoji / len(tweets),

        # Ratio de liens par tweet
        "link_ratio": links / len(tweets)
    }
