from transformers import pipeline
from langchain_core.prompts import PromptTemplate
from langchain_community.llms import HuggingFacePipeline

from services.pattern_extractor import extract_patterns

# LLM local gratuit
hf_pipeline = pipeline(
    "text-generation",
    model="distilgpt2",
    max_new_tokens=80,
    temperature=0.8
)

llm = HuggingFacePipeline(pipeline=hf_pipeline)

prompt = PromptTemplate(
    input_variables=["avg_length", "emoji_ratio", "link_ratio"],
    template="""
You are a growth marketer for an AI startup.

Rules:
- Average tweet length: {avg_length} characters
- Emoji usage ratio: {emoji_ratio}
- Link usage ratio: {link_ratio}

Generate 5 engaging tweets, each on a new line.
"""
)

# ✅ NEW LANGCHAIN STYLE (Runnable)
chain = prompt | llm


def generate_with_langchain(tweets):
    patterns = extract_patterns(tweets)

    result = chain.invoke({
        "avg_length": patterns["avg_length"],
        "emoji_ratio": patterns["emoji_ratio"],
        "link_ratio": patterns["link_ratio"]
    })

    return [t.strip() for t in result.split("\n") if t.strip()]
