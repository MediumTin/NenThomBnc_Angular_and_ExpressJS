from langchain_community.document_loaders import DirectoryLoader, UnstructuredFileLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.vectorstores import FAISS
from langchain_community.vectorstores.utils import DistanceStrategy
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_experimental.text_splitter import SemanticChunker
# For FastAPI usage
from app.Prompt.Promtp_Config import get_prompt_template
from app.LLM_Config.LLM_Config import llm_config
from app.Embedding_Model.Embedding_model import embeddings

# For run RAG_Chatbot.py directly
# from Prompt.Promtp_Config import get_prompt_template
# from LLM_Config.LLM_Config import llm_config
# from Embedding_Model.Embedding_model import embeddings

from pathlib import Path
from dotenv import load_dotenv # Import the load_dotenv function to load environment variables from a .env file
load_dotenv() # Load the environment variables from the .env file
from pprint import pprint # Import the pprint function for pretty-printing the splits

# ----------------------------------Step 1: Load documents from the specified directory-----------------------------------
# Using seperate file
# ----------------------------------Step 2: Split the loaded documents into smaller chunks (chunking)----------------------
# Using seperate file
# ----------------------------------Step 3: Embedding to vector space------------------------------------------
# Using seperate file
# ----------------------------------Step 4: Store into Vector Database------------------------------------------
# Using seperate file
# ----------------------------------Step 5: Define the prompt template------------------------------------------
# Using seperate file
# ----------------------------------Step 6: Initialize the LLM chat model------------------------------------------
# Using seperate file
# ----------------------------------Step 7: Initialize the RAG chain------------------------------------------
vectorstore = FAISS.load_local(
    "app/Vector_Store_DB/Built_Vector_Model",
    embeddings,
    allow_dangerous_deserialization=True
)

retriever = vectorstore.as_retriever(
    search_type = "similarity",
    search_kwargs = {"k":5} 
    # search_type = "similarity_score_threshold", # Specify the search type for the retriever. In this case, it uses a similarity score threshold to determine which chunks are relevant to a given query.
    # search_kwargs = {"k":5, "score_threshold": 0.2} 
) 
rag_chain = (
    {"context":retriever, "question":RunnablePassthrough()}
    | get_prompt_template()
    | llm_config
    | StrOutputParser()
)
# Output of first step is input of next step
# step 1: create input for prompt by retrieving relevant chunks based on the question (question is not change, context come from Vector DB)
# step 2: generate answer based on the retrieved context and the question using the prompt template
# step 3: pass to LLM
# step 4: output to user

# ----------------------------------Step 8: Get question from user and response answer ------------------------------------------

# while True:
#     question = input("Question:")

#     if question.lower() in ["exit", "quit", "q"]:
#         print("Bye!")
#         break

#     # Xử lý câu hỏi ở đây
#     answer = rag_chain.invoke(question)

#     print("AI Chatbot:", answer)


def RAG_Model_ask(question: str):
    return rag_chain.invoke(question)