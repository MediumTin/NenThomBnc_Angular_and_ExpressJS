
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv # Import the load_dotenv function to load environment variables from a .env file
load_dotenv() # Load the environment variables from the .env file
# ----------------------------------Step 3: Embedding to vector space------------------------------------------
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small", 
    dimensions=1024
)

# For testing
# vector = embeddings.embed_query("What is the capital of France?")
# print(vector)
# print(len(vector))