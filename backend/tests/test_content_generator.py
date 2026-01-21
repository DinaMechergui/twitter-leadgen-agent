from services.pattern_extractor import extract_patterns
from services.content_generator import generate_tweet_ideas

tweets = [
    "Check out our new AI startup! 🚀",
    "Our platform helps automate workflows.",
    "Genie is transforming team collaboration! 🌟"
]

patterns = extract_patterns(tweets)
ideas = generate_tweet_ideas(tweets, patterns, num_ideas=3)

print("Idées de tweets générées :")
for i, idea in enumerate(ideas, 1):
    print(f"{i}. {idea}")
