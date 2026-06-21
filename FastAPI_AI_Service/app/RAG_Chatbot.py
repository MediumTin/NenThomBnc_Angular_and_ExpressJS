import os

from langchain_community.document_loaders import DirectoryLoader, UnstructuredFileLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.vectorstores import FAISS
from langchain_community.vectorstores.utils import DistanceStrategy
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_experimental.text_splitter import SemanticChunker
from langchain_core.runnables import RunnableLambda
from re import match
# For FastAPI usage
from app.Prompt.Promtp_Config import get_prompt_template
from app.LLM_Config.LLM_Config import llm_config
from app.Embedding_Model.Embedding_model import embeddings
from langdetect import detect
from deep_translator import GoogleTranslator
from collections import defaultdict

# For run RAG_Chatbot.py directly
# from Prompt.Promtp_Config import get_prompt_template
# from LLM_Config.LLM_Config import llm_config
# from Embedding_Model.Embedding_model import embeddings

from pathlib import Path
from dotenv import load_dotenv # Import the load_dotenv function to load environment variables from a .env file
load_dotenv() # Load the environment variables from the .env file
from pprint import pprint # Import the pprint function for pretty-printing the splits
mode = os.getenv("RETRIEVAL_MODE", "vietnamese")  # Lấy giá trị từ biến môi trường, mặc định là "vietnamese"
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

vectorstore_classification = FAISS.load_local(
    "app/Vector_Store_DB/Built_Vector_Model_Classification",
    embeddings,
    allow_dangerous_deserialization=True
)

retriever_classification = vectorstore_classification.as_retriever(
    search_type = "similarity",
    search_kwargs = {"k":1} # Get the most relevant chunk for classification
)

def get_retriever_classification(question: str):
    Result_classification = retriever_classification.invoke(question)
    print(Result_classification[0].metadata)
    print(f"Classification result: {Result_classification[0].metadata['category']}")
    return Result_classification[0].metadata['category']

def rrf_merge(vi_docs, en_docs, k=60):

    scores = defaultdict(float)
    docs = {}

    for rank, doc in enumerate(vi_docs, start=1):
        key = doc.metadata["source"]

        scores[key] += 1 / (k + rank)
        docs[key] = doc

    for rank, doc in enumerate(en_docs, start=1):
        key = doc.metadata["source"]

        scores[key] += 1 / (k + rank)
        docs[key] = doc

    ranked = sorted(
        scores.items(),
        key=lambda x: x[1],
        reverse=True
    )

    return [docs[key] for key, _ in ranked]

def debug_context(data):
    print("\n========== HISTORY ==========\n")
    print(data["chat_history"])

    print("\n========== CONTEXT ==========\n")

    for i, doc in enumerate(data["context"], start=1):
        print(f"Chunk {i}:")
        print(doc.page_content)
        print("-" * 50)

    return data

def prepare_input(data):
    history_text = "\n".join(
        f"{msg.role}: {msg.content}"
        for msg in data["chat_history"]
    )
    Retrieval_mode = data.get("Retrieval_mode", "english")
    if Retrieval_mode == "english":
        docs_retrieveds = retriever.invoke(data.get("question_en", ""))
    elif Retrieval_mode == "vietnamese":
        docs_retrieveds = retriever.invoke(data.get("question", ""))
    elif Retrieval_mode == "hybrid":
        docs_vietnamese = retriever.invoke(data.get("question", ""))
        docs_english = retriever.invoke(data.get("question_en", ""))
        docs = rrf_merge(
            docs_vietnamese,
            docs_english
        )
        docs_retrieveds = docs[:5]

    return {
        "context": docs_retrieveds,
        "chat_history": history_text, # Add this line to include chat history in the input to the prompt
        "question": data["question"],
        "language": data["language"]
    }

# rag_chain = (
#     {   
#         "context":retriever, 
#         "chat_history" : chat_history, # Add this line to include chat history in the input to the prompt
#         "question":RunnablePassthrough()
#     }
#     | RunnableLambda(debug_context) # Add this line to print the retrieved context
#     | get_prompt_template()
#     | llm_config
#     | StrOutputParser()
# )

rag_chain = (
    RunnableLambda(prepare_input)
    | RunnableLambda(debug_context)
    | get_prompt_template()
    | llm_config
    | StrOutputParser()
)

    # Print the promt


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


def RAG_Model_ask(question: str, chat_history: list = []    ):
    Retrieval_mode = "english"  # Default retrieval mode
    language = detect(question)
    lang_map = {
        "vi": "Vietnamese",
        "en": "English"
    }
    language_name = lang_map.get(language, "English")
    print(f"Detected language: {language_name}")

    Result_classification = get_retriever_classification(question)
    print(f"Classification result: {Result_classification}")

    match (Result_classification):
        case "Candle_Knowledge":
            Retrieval_mode  = "english"
        case "Discount_Program":
            Retrieval_mode  = "english"
        case "User_Guidance":
            Retrieval_mode  = "english"
        case "Policies":
            if (language_name == "Vietnamese"):
                Retrieval_mode  = "vietnamese"
            else:
                Retrieval_mode  = "english"
        case "Product_Catalog":
            Retrieval_mode  = "vietnamese"
    print(f"Retrieval mode for this question: {Retrieval_mode}")

    if Retrieval_mode == "english" or Retrieval_mode == "hybrid":
        question_en = GoogleTranslator(source='vi',target='en').translate(question)
        print(f"Translated question: {question_en}")
    else:
        question_en = ""

    return rag_chain.invoke({"question": question, "chat_history": chat_history, "language": language_name, "question_en": question_en, "Retrieval_mode": Retrieval_mode})