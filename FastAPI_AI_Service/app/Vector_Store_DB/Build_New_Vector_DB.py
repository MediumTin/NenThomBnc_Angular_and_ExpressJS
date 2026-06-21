import pandas as pd

from langchain_community.document_loaders import DirectoryLoader, UnstructuredFileLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.vectorstores import FAISS
from langchain_community.vectorstores.utils import DistanceStrategy
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_experimental.text_splitter import SemanticChunker
from pathlib import Path
import sys

try:
    from app.Embedding_Model.Embedding_model import embeddings
    from app.Chunking.Chunking import all_docs, KnowledgeBase_for_Classification
except ModuleNotFoundError:
    # Allow direct execution: python app/Vector_Store_DB/Build_New_Vector_DB.py
    PROJECT_ROOT = Path(__file__).resolve().parents[2]
    if str(PROJECT_ROOT) not in sys.path:
        sys.path.insert(0, str(PROJECT_ROOT))
    from app.Embedding_Model.Embedding_model import embeddings
    from app.Chunking.Chunking import all_docs, KnowledgeBase_for_Classification

from dotenv import load_dotenv # Import the load_dotenv function to load environment variables from a .env file
load_dotenv() # Load the environment variables from the .env file
from pprint import pprint # Import the pprint function for pretty-printing the splits

# ----------------------------------Step 1: Load documents from the specified directory-----------------------------------
# Using seperate file
#  ----------------------------------Step 2: Split the loaded documents into smaller chunks (chunking)----------------------
# Using seperate file
# ----------------------------------Step 3: Embedding to vector space------------------------------------------
# Using seperate file
# ----------------------------------Step 4: Store into Vector Database------------------------------------------
vectorstore = FAISS.from_documents(
    documents=all_docs,# The documents to be stored in the vector database, which are the chunks created from the original documents.
    embedding=embeddings, # The embedding model to be used for converting the documents into vector representations. In this case, it uses the OpenAIEmbeddings model defined earlier.
    distance_strategy=DistanceStrategy.COSINE, # Use cosine similarity for distance calculation
)

vectorstore.save_local("app/Vector_Store_DB/Built_Vector_Model")

vectorstore_classification = FAISS.from_documents(
    documents=[doc for docs in KnowledgeBase_for_Classification.values() for doc in docs], # Flatten the list of documents from the classification knowledge base
    embedding=embeddings, # The embedding model to be used for converting the documents into vector representations. In this case, it uses the OpenAIEmbeddings model defined earlier.
    distance_strategy=DistanceStrategy.COSINE, # Use cosine similarity for distance calculation
)

vectorstore_classification.save_local("app/Vector_Store_DB/Built_Vector_Model_Classification")

# Print embedding results for all_docs
# Lấy nội dung các chunk
texts = [doc.page_content for doc in all_docs]

# Sinh embedding cho toàn bộ chunk
vectors = embeddings.embed_documents(texts)

rows = []

for i, (doc, vector) in enumerate(zip(all_docs, vectors), start=1):
    rows.append({
        "chunk_id": i,
        "content": doc.page_content,
        "embedding": str(vector)  # lưu nguyên vector thành chuỗi
    })

df = pd.DataFrame(rows)

df.to_excel(
    "app/Vector_Store_DB/chunk_embeddings.xlsx",
    index=False
)

print("Đã xuất file Excel thành công")
