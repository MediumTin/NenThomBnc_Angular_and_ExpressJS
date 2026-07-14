import os

from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from pathlib import Path
from dotenv import load_dotenv # Import the load_dotenv function to load environment variables from a .env file
load_dotenv() # Load the environment variables from the .env file
from pprint import pprint # Import the pprint function for pretty-printing the splits

#--------------------------Step 6: Initialize the chat model------------------------------------------
RAG_MODEL = os.getenv("RAG_MODEL", "gpt-5-mini") # Default model is "gpt-5-mini" if the environment variable is not set
RAG_TEMPERATURE = float(os.getenv("RAG_TEMPERATURE", "0.0"))

RAGAS_MODEL = os.getenv("RAGAS_MODEL", "gpt-5-mini") # Default model is "gpt-5-mini" if the environment variable is not set
RAGAS_TEMPERATURE = float(os.getenv("RAGAS_TEMPERATURE", "1.0"))

JUDGE_MODEL = os.getenv("JUDGE_MODEL", "gpt-5-nano") # Default model is "gpt-5-nano" if the environment variable is not set
JUDGE_TEMPERATURE = float(os.getenv("JUDGE_TEMPERATURE", "0.0"))

llm_config = ChatOpenAI(
    model=RAG_MODEL,
    temperature=RAG_TEMPERATURE,
)   

llm_for_ragas = ChatOpenAI(
    model=RAGAS_MODEL,
    temperature=RAGAS_TEMPERATURE,
)

llm_for_judge_accuracy = ChatOpenAI(
    model=JUDGE_MODEL,
    temperature=JUDGE_TEMPERATURE
)
