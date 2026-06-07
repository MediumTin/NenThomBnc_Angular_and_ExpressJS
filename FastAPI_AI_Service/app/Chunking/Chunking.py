from langchain_community.document_loaders import DirectoryLoader, UnstructuredFileLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_experimental.text_splitter import SemanticChunker
from langchain_core.documents import Document
import pandas as pd
from pathlib import Path
import sys
from dotenv import load_dotenv # Import the load_dotenv function to load environment variables from a .env file
load_dotenv() # Load the environment variables from the .env file
from pprint import pprint # Import the pprint function for pretty-printing the splits
APP_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = APP_DIR / "data" / "NenThom_data"
DOCUMENTS_DIR = DATA_DIR
POLICIES_PATH = DATA_DIR / "Policies"
PRODUCTS_CSV_PATH = DATA_DIR / "Product_Catalogs" / "products.csv"
COUPONS_CSV_PATH = DATA_DIR / "Discount_program" / "coupons.csv"
CHUNK_DEBUG_XLSX_PATH = APP_DIR / "Chunking" / "chunk_debug.xlsx"
all_docs = []
# ---------------------------------- Case 1: Loading csv file -----------------------------------

# --------------------- Loading product csv file ---------------------------
product_docs = []
products_df = pd.read_csv(PRODUCTS_CSV_PATH)
for _, row in products_df.iterrows():

    product_docs.append(
        Document(
            page_content=f"""
            Product Name: {row['product_name']}

            Category: {row['product_category']}

            Price: {row['price_unit']}

            Description:
            {row['product_description']}
            """,
            metadata={
                "type": "product",
                "product_id": row["product_id"],
                "source" : PRODUCTS_CSV_PATH
            }
        )
    )

# --------------------- Loading discount csv file ---------------------------
coupon_docs  = []
discounts_df = pd.read_csv(COUPONS_CSV_PATH)
for _, row in discounts_df.iterrows():

    coupon_docs .append(
        Document(
           page_content=f"""
            Coupon Code: {row['code']}

            Discount Type: {row['discount_type']}

            Discount Value: {row['discount_value']}

            Minimum Order: {row['min_order_value']}

            Maximum Discount: {row['max_discount_value']}

            Usage per Customer: {row['per_user_limit']}

            Coupon status: {row['status']}
            """,
             metadata={
                "type": "coupon",
                "coupon_id": row["coupon_id"],
                "source" : COUPONS_CSV_PATH
            }
        )
    )
# ---------------------------------- Case 2: Loading word file -----------------------------------


loader = DirectoryLoader(
    path = str(POLICIES_PATH),
    glob = "**/*",  
    show_progress = True,
    loader_cls=UnstructuredFileLoader,
    use_multithreading=True
)
print("POLICIES_PATH", POLICIES_PATH)
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
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=800, # Adjust the chunk size as needed
    chunk_overlap=150, # Adjust the chunk overlap as needed : This means that each chunk will have 200 characters of overlap with the previous chunk to maintain context.
    add_start_index=True, # This adds a start index to each chunk, which can be useful for tracking the position of the chunk in the original document.
    strip_whitespace=True, # This option will remove any newline characters from the text chunks, which can help in creating cleaner and more consistent chunks.
    separators = MARKDOWN_SEPARATORS, # This specifies the separators to use when splitting the text. In this case, it uses markdown separators to split the text into chunks based on headings, paragraphs, etc.
    is_separator_regex=True
)

# Case 2: Using SemanticChunker to split the documents into semantically meaningful chunks based on the defined separators and specified chunk size and overlap. This method will create chunks of text that are semantically coherent, meaning that they will contain related information together, which can be beneficial for tasks like question-answering or information retrieval. The separators will help in creating more meaningful chunks based on the structure of the text (e.g., headings, paragraphs, etc.).
# text_splitter = SemanticChunker(
#    embeddings=OpenAIEmbeddings(),
#    breakpoint_threshold_amount=0.85 # This parameter controls how the text is split into chunks based on semantic similarity. A higher value means that the text will be split into larger chunks that are more semantically coherent, while a lower value will result in smaller chunks that may be less coherent. Adjust this value as needed to find the right balance for your specific use case.
# )

Doccument_splits = text_splitter.split_documents(docs)
# pprint(splits)

# ---------------------------------- Merging all document splits -----------------------------------
all_docs.extend(Doccument_splits)

all_docs.extend(product_docs)

all_docs.extend(coupon_docs)

print(len(all_docs))

# For checking the splits by excel
rows = []

for i, chunk in enumerate(all_docs):

    rows.append({
        "chunk_id": i + 1,
        "source": chunk.metadata.get("source", ""),
        "length": len(chunk.page_content),
        "content": chunk.page_content
    })

df_testing = pd.DataFrame(rows)

df_testing.to_excel(
    CHUNK_DEBUG_XLSX_PATH,
    index=False
)

print(f"Exported {len(rows)} chunks to {CHUNK_DEBUG_XLSX_PATH}")


