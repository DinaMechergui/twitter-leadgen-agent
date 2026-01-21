#AGENTS/content_generator.py
from transformers import pipeline

generator = pipeline(
    "text-generation",
    model="distilgpt2",

    device=-1
)

def generate_tweet_ideas(tweets, patterns, num_ideas=3):
    ideas = []

    emoji = "Use emojis." if patterns["emoji_ratio"] > 0.3 else "No emojis."
    link = "Include a link." if patterns["link_ratio"] > 0.2 else "No links."

    prompt = f"""
    Write a professional tweet for an AI startup.
    Average length: {patterns["avg_length"]} characters.
    {emoji}
    {link}
    Be engaging and concise.
    Tweet:
    """

    outputs = generator(
        prompt,
        max_new_tokens=40,
        do_sample=True,
        temperature=0.8,
        return_full_text=False
    )

    for out in outputs:
        text = out["generated_text"].strip()
        if text:
            ideas.append(text)

    return ideas[:num_ideas]
