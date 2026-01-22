# services/scoring.py
# Service pour calculer un score d'importance ou d'engagement d'un tweet

def score_tweet(tweet_text, likes=0, retweets=0, keywords=None):
    """
    Calcule un score pour un tweet en fonction de :
    - longueur du texte
    - nombre de likes et retweets
    - présence de mots-clés pertinents

    Arguments :
    - tweet_text : texte du tweet
    - likes : nombre de likes
    - retweets : nombre de retweets
    - keywords : liste de mots-clés à rechercher dans le tweet
    """

    # Score de base : longueur du tweet
    score = len(tweet_text)

    # Ajout de pondération pour les likes et retweets
    score += likes * 2       # chaque like compte double
    score += retweets * 3    # chaque retweet compte triple

    # Bonus si le tweet contient des mots-clés
    if keywords:
        for word in keywords:
            if word.lower() in tweet_text.lower():
                score += 10  # +10 points par mot-clé trouvé

    # Retourne le score final
    return score
