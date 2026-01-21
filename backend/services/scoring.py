# services/scoring.py

def score_tweet(tweet_text, likes=0, retweets=0, keywords=None):
    """
    Score basé sur :
    - longueur du tweet
    - likes et retweets
    - présence de mots-clés
    """
    score = len(tweet_text)  # longueur de base

    # pondération des likes et retweets
    score += likes * 2
    score += retweets * 3

    # bonus mots-clés
    if keywords:
        for word in keywords:
            if word.lower() in tweet_text.lower():
                score += 10  # chaque mot clé trouvé

    return score
