def extract_patterns(tweets):
    total_len = sum(len(t) for t in tweets)
    emoji = sum(1 for t in tweets for c in t if c in "🚀🤖🔥")
    links = sum(t.count("http") for t in tweets)

    return {
        "avg_length": total_len // len(tweets),
        "emoji_ratio": emoji / len(tweets),
        "link_ratio": links / len(tweets)
    }
