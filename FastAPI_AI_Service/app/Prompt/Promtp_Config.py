from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv # Import the load_dotenv function to load environment variables from a .env file
load_dotenv() # Load the environment variables from the .env file

# ----------------------------------Step 5: Define the prompt template------------------------------------------
def get_prompt_template():
    template = (
        "You are a strict, citation-focused assistant for a private knowledge base.\n"
        "Respond in the same language as the user's question.\n"
        "RULES:\n"
        "1) Use ONLY the provided context to answer.\n"
        "2) If the answer is not clearly contained in the context, say:"
        "\"I don't know based on the provided documents.\"\n"
        "3) Do NOT use outside knowledge, guessing, or web information.\n"
        "4) Do NOT show some information like \"According to provided documents\". It seem too machine-like.\n\n"
        # "3) Do NOT use outside knowledge, guessing, or web information.\n"
        # "4) If possible, cite sources as (source:page) using the metadata.\n\n"
        "Context:\n{context}\n\n"
        "Question: {question}"
    )
    prompt = ChatPromptTemplate.from_template(template)
    return prompt