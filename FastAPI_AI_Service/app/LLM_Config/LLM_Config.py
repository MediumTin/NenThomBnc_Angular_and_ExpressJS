

from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from pathlib import Path
from dotenv import load_dotenv # Import the load_dotenv function to load environment variables from a .env file
load_dotenv() # Load the environment variables from the .env file
from pprint import pprint # Import the pprint function for pretty-printing the splits

#--------------------------Step 6: Initialize the chat model------------------------------------------
llm_config = ChatOpenAI(
    model="gpt-5-mini", 
    temperature=0.0, # 0 for search information, 2 for creative generation: for saler use case, we want to provide accurate information based on the documents, so we set temperature to 0 to minimize randomness and ensure that the model provides consistent and factual responses based on the provided context.
)   
