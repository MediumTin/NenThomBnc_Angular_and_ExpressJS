from langchain_community.document_loaders import DirectoryLoader, UnstructuredFileLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_experimental.text_splitter import SemanticChunker
from pathlib import Path
import sys
from dotenv import load_dotenv # Import the load_dotenv function to load environment variables from a .env file
load_dotenv() # Load the environment variables from the .env file
from pprint import pprint # Import the pprint function for pretty-printing the splits
# ----------------------------------Step 1: Load documents from the specified directory-----------------------------------

# Resolve documents path relative to this file so execution is independent of current working directory.
DOCUMENTS_DIR = Path(__file__).resolve().parent / "../data" / "documents"

loader = DirectoryLoader(
    path = str(DOCUMENTS_DIR),
    glob = "**/*.pdf",  
    show_progress = True,
    loader_cls=UnstructuredFileLoader,
    use_multithreading=True
)
print("DOCUMENTS_DIR", DOCUMENTS_DIR)
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


