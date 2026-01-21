from agents.langchain_content_agent import generate_with_langchain
from services.save_content import save_tweet_ideas

def run_content_agent(tweets, source):
    if not tweets:
        return

    ideas = generate_with_langchain(tweets)
    save_tweet_ideas(ideas, source)
