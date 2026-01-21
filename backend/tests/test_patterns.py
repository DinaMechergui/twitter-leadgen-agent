from services.pattern_extractor import extract_patterns

tweets = [
    "Launching our new AI tool 🚀",
    "Big update coming soon",
    "Read more here https://example.com"
]

patterns = extract_patterns(tweets)
print(patterns)
