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
from dotenv import load_dotenv # Import the load_dotenv function to load environment variables from a .env file
load_dotenv() # Load the environment variables from the .env file
from pprint import pprint # Import the pprint function for pretty-printing the splits
# ----------------------------------Step 1: Load documents from the specified directory-----------------------------------

# Resolve documents path relative to this file so execution is independent of current working directory.
DOCUMENTS_DIR = Path(__file__).resolve().parent / "data" / "documents"

loader = DirectoryLoader(
    path = str(DOCUMENTS_DIR),
    glob = "**/*.pdf",  
    show_progress = True,
    loader_cls=UnstructuredFileLoader,
    use_multithreading=True
)
docs = loader.load()
#print(docs)
#print(len(docs))

# ----------------------------------Step 2: Split the loaded documents into smaller chunks (chunking)----------------------
MARKDOWN_SEPARATORS = [
    "\n#{1,6}",  # Regular exprerssion to match markdown headings (e.g., #, ##, ###, etc.)
    "```\n",  # split code blocks in markdown
    "\n\\*\\*\\*+\n",  # Horizontal rules in markdown
    "\n---+\n",  # Another type of horizontal rule in markdown
    "\n___+\n",  # Another type of horizontal rule in markdown
    "\n\n",  # Double newlines to separate paragraphs
    "\n",  # Single newline to separate lines
    " ",  # Space to separate words
    "",  # Empty string to split on any character (fallback)
] # Define the separators to use for splitting the text

# Case 1: Using RecursiveCharacterTextSplitter to split the documents into chunks based on the defined separators and specified chunk size and overlap. This method will create chunks of text that maintain context by overlapping with the previous chunk, and it will also add a start index to each chunk for tracking purposes. The separators will help in creating more meaningful chunks based on the structure of the text (e.g., headings, paragraphs, etc.).
# text_splitter = RecursiveCharacterTextSplitter(
#     chunk_size=1200, # Adjust the chunk size as needed
#     chunk_overlap=200, # Adjust the chunk overlap as needed : This means that each chunk will have 200 characters of overlap with the previous chunk to maintain context.
#     add_start_index=True, # This adds a start index to each chunk, which can be useful for tracking the position of the chunk in the original document.
#     strip_whitespace=True, # This option will remove any newline characters from the text chunks, which can help in creating cleaner and more consistent chunks.
#     separators = MARKDOWN_SEPARATORS # This specifies the separators to use when splitting the text. In this case, it uses markdown separators to split the text into chunks based on headings, paragraphs, etc.
# )

# Case 2: Using SemanticChunker to split the documents into semantically meaningful chunks based on the defined separators and specified chunk size and overlap. This method will create chunks of text that are semantically coherent, meaning that they will contain related information together, which can be beneficial for tasks like question-answering or information retrieval. The separators will help in creating more meaningful chunks based on the structure of the text (e.g., headings, paragraphs, etc.).
text_splitter = SemanticChunker(
   embeddings=OpenAIEmbeddings(),
   breakpoint_threshold_amount=0.85 # This parameter controls how the text is split into chunks based on semantic similarity. A higher value means that the text will be split into larger chunks that are more semantically coherent, while a lower value will result in smaller chunks that may be less coherent. Adjust this value as needed to find the right balance for your specific use case.
)

splits = text_splitter.split_documents(docs)
#pprint(splits)

# ----------------------------------Step 3: Embedding to vector space------------------------------------------
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small", 
    dimensions=1024
)

#vector = embeddings.embed_query("What is the capital of France?")
#print(vector)
#print(len(vector))

# ----------------------------------Step 4: Store into Vector Database------------------------------------------
vectorstore = FAISS.from_documents(
    documents=splits,# The documents to be stored in the vector database, which are the chunks created from the original documents.
    embedding=embeddings, # The embedding model to be used for converting the documents into vector representations. In this case, it uses the OpenAIEmbeddings model defined earlier.
    distance_strategy=DistanceStrategy.COSINE, # Use cosine similarity for distance calculation
)

retriever = vectorstore.as_retriever(
    search_type = "similarity",
    search_kwargs = {"k":5} 
    # search_type = "similarity_score_threshold", # Specify the search type for the retriever. In this case, it uses a similarity score threshold to determine which chunks are relevant to a given query.
    # search_kwargs = {"k":5, "score_threshold": 0.2} 
) # Convert the vector store into a retriever with a specified number of results to return (k=3 in this case). This means that when a query is made, the retriever will return the top 3 most relevant chunks from the vector store based on cosine similarity.

# ----------------------------------Step 5: Define the prompt template------------------------------------------
template = (
    "You are a strict, citation-focused assistant for a private knowledge base.\n"
    "Respond in the same language as the user's question.\n"
    "RULES:\n"
    "1) Use ONLY the provided context to answer.\n"
    "2) If the answer is not clearly contained in the context, say:"
    "\"I don't know based on the provided documents.\"\n"
    "3) Do NOT use outside knowledge, guessing, or web information.\n"
    "4) If possible, cite sources as (source:page) using the metadata.\n\n"
    "Context:\n{context}\n\n"
    "Question: {question}"
)
prompt = ChatPromptTemplate.from_template(template)

# ----------------------------------Step 6: Initialize the chat model------------------------------------------

llm = ChatOpenAI(
    model="gpt-5-mini", 
    temperature=0.0, # 0 for search information, 2 for creative generation: for saler use case, we want to provide accurate information based on the documents, so we set temperature to 0 to minimize randomness and ensure that the model provides consistent and factual responses based on the provided context.
)   
# ----------------------------------Step 7: Initialize the RAG chain------------------------------------------
rag_chain = (
    {"context":retriever, "question":RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)
# Output of first step is input of next step
# step 1: create input for prompt by retrieving relevant chunks based on the question (question is not change, context come from Vector DB)
# step 2: generate answer based on the retrieved context and the question using the prompt template
# step 3: pass to LLM
# step 4: output to user

# ----------------------------------Step 8: Get question from user and response answer ------------------------------------------
# Case 1: Ask one time
# question = input("Question:")
# answer = rag_chain.invoke(question)
# print(answer)

# Case 2: Ask contuneously
# while True:
#     question = input("Question:")

#     if question.lower() in ["exit", "quit", "q"]:
#         print("Bye!")
#         break

#     # Xử lý câu hỏi ở đây
#     answer = rag_chain.invoke(question)

#     print("AI Chatbot:", answer)

# Case 3: Create a function to other place call
def RAG_Model_ask(question: str):
    return rag_chain.invoke(question)