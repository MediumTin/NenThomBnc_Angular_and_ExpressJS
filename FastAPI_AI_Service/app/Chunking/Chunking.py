import json

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
Candle_Knowledge_DIR = DATA_DIR / "Candles_Knowledge"
User_Guidance_DIR = DATA_DIR / "User_guidance"
POLICIES_PATH = DATA_DIR / "Policies"
PRODUCTS_CSV_PATH = DATA_DIR / "Product_Catalogs" / "products.csv"
COUPONS_CSV_PATH = DATA_DIR / "Discount_program" / "coupons.csv"
CHUNK_DEBUG_XLSX_PATH = APP_DIR / "Chunking" / "chunk_debug.xlsx"
Report_Data_for_Classification_XLSX_PATH = APP_DIR / "Chunking" / "report_data_for_classification.xlsx"
all_docs = []
all_candle_knowledge_questions = []
all_discount_questions = []
all_guidance_questions = []
all_policy_questions = []
all_product_questions = []

FAQ_Candle_Knowledge_PATH = DATA_DIR / "Candles_Knowledge" / "FAQs" / "FAQ_Candle_knowledge.json"
FAQ_Discount_Program_PATH = DATA_DIR / "Discount_program" / "FAQs" / "FAQ_Discount_program.json"
FAQ_Policies_PATH = DATA_DIR / "Policies" / "FAQs" / "FAQ_Policies.json"
FAQ_Product_Catalogs_PATH = DATA_DIR / "Product_Catalogs" / "FAQs" / "FAQ_Product_Catalog.json"
FAQ_Accesories_products_PATH = DATA_DIR / "Product_Catalogs" / "FAQs" / "FAQ_Accesories_product.json"
FAQ_Candle_products_PATH = DATA_DIR / "Product_Catalogs" / "FAQs" / "FAQ_Candle_product.json"
FAQ_Lumos_products_PATH = DATA_DIR / "Product_Catalogs" / "FAQs" / "FAQ_Lumos_product.json"
FAQ_User_guidance_PATH = DATA_DIR / "User_guidance" / "FAQs" / "FAQ_User_guidance.json"

FAQ_FILES = [
    FAQ_Candle_Knowledge_PATH,
    FAQ_Discount_Program_PATH,
    FAQ_Policies_PATH,
    FAQ_Product_Catalogs_PATH,
    FAQ_User_guidance_PATH,
    FAQ_Accesories_products_PATH,
    FAQ_Candle_products_PATH,
    FAQ_Lumos_products_PATH
]
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
                "source" : COUPONS_CSV_PATH,
                "category": "Discount_Program"
            }
        )
    )

all_discount_questions = coupon_docs
# ---------------------------------- Case 2: Loading word file -----------------------------------


loader = DirectoryLoader(
    path = str(DATA_DIR),
    glob = "**/*.docx", # Adjust the glob pattern to match the file types you want to load (e.g., .txt, .pdf, etc.)
    show_progress = True,
    loader_cls=UnstructuredFileLoader,
    use_multithreading=True
)
print("DATA_DIR", DATA_DIR)
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

# Call only for Candle knowledge base
loader_CandleKnowledge = DirectoryLoader(
    path = str(Candle_Knowledge_DIR),
    glob = "**/*.docx", # Adjust the glob pattern to match the file types you want to load (e.g., .txt, .pdf, etc.)
    show_progress = True,
    loader_cls=UnstructuredFileLoader,
    use_multithreading=True
)
print("Candle_Knowledge_DIR", Candle_Knowledge_DIR)
docs_CandleKnowledge = loader_CandleKnowledge.load()
Doccument_splits_CandleKnowledge = text_splitter.split_documents(docs_CandleKnowledge)
for doc in Doccument_splits_CandleKnowledge:
    doc.metadata["category"] = "Candle_Knowledge"
all_candle_knowledge_questions = Doccument_splits_CandleKnowledge

# Call only for User guidance base
loader_UserGuidance = DirectoryLoader(
    path = str(User_Guidance_DIR),
    glob = "**/*.docx", # Adjust the glob pattern to match the file types you want to load (e.g., .txt, .pdf, etc.)
    show_progress = True,
    loader_cls=UnstructuredFileLoader,
    use_multithreading=True
)
print("User_Guidance_DIR", User_Guidance_DIR)
docs_UserGuidance = loader_UserGuidance.load()
Doccument_splits_UserGuidance = text_splitter.split_documents(docs_UserGuidance)
for doc in Doccument_splits_UserGuidance:
    doc.metadata["category"] = "User_Guidance"
all_user_guidance_questions = Doccument_splits_UserGuidance

# Call only for Policies base
loader_Policies = DirectoryLoader(
    path = str(POLICIES_PATH),
    glob = "**/*.docx", # Adjust the glob pattern to match the file types you want to load (e.g., .txt, .pdf, etc.)
    show_progress = True,
    loader_cls=UnstructuredFileLoader,
    use_multithreading=True
)
print("Policies_PATH", POLICIES_PATH)
docs_Policies = loader_Policies.load()
Doccument_splits_Policies = text_splitter.split_documents(docs_Policies)
for doc in Doccument_splits_Policies:
    doc.metadata["category"] = "Policies"
all_policy_questions = Doccument_splits_Policies

# ------ For reading markdown file directly ---------------
load_markdown = DirectoryLoader(
    path = str(DATA_DIR),
    glob="**/*.md"
)
docs_markdown = load_markdown.load()
for doc in docs_markdown:
    doc.metadata["category"] = "Product_Catalog"

all_product_questions = docs_markdown

# Loading FAQ files and creating Document objects for each FAQ entry
faq_docs = []

faq_id = 1

for faq_file in FAQ_FILES:

    with open(faq_file, "r", encoding="utf-8") as f:
        faq_data = json.load(f)
    for faq in faq_data:
        faq_docs.append(
            Document(
                page_content=f"""
                    Question:
                    {faq["question"]}

                    Answer:
                    {faq["answer"]}
                    """.strip(),
                    metadata={
                        "type": "faq",
                        "faq_id": faq_id,
                        "source": faq_file.name,
                        "category": faq_file.parent.parent.name
                    }
                )
            )

        faq_id += 1
        if faq_file.name == "FAQ_Candle_knowledge.json":
            all_candle_knowledge_questions.append(
                Document(
                    page_content=f"""
                        {faq["question"]}
                        """.strip(),
                    metadata={
                        "type": "faq",
                        "faq_id": faq_id,
                        "source": faq_file.name,
                        "category": "Candle_Knowledge"
                    }
                )
            )
        if faq_file.name == "FAQ_User_guidance.json":
            all_user_guidance_questions.append(
                Document(
                    page_content=f"""
                        {faq["question"]}
                        """.strip(),
                    metadata={
                        "type": "faq",
                        "faq_id": faq_id,
                        "source": faq_file.name,
                        "category": "User_Guidance"
                    }
                )
            )
        if faq_file.name == "FAQ_Policies.json":
            all_policy_questions.append(
                Document(
                    page_content=f"""
                        {faq["question"]}
                        """.strip(),
                    metadata={
                        "type": "faq",
                        "faq_id": faq_id,
                        "source": faq_file.name,
                        "category": "Policies"
                    }
                )
            )
        if faq_file.name == "FAQ_Product_Catalog.json":
            all_product_questions.append(
                Document(
                    page_content=f"""
                        {faq["question"]}
                        """.strip(),
                    metadata={
                        "type": "faq",
                        "faq_id": faq_id,
                        "source": faq_file.name,
                        "category": "Product_Catalog"
                    }
                )
            )
        if faq_file.name == "FAQ_Discount_program.json":
            all_discount_questions.append(
                Document(
                    page_content=f"""
                        {faq["question"]}
                        """.strip(),
                    metadata={
                        "type": "faq",
                        "faq_id": faq_id,
                        "source": faq_file.name,
                        "category": "Discount_Program"
                    }
                )
            )
        print(f"Loaded {len(faq_docs)} FAQ documents")

# ---------------------------------- Merging all document splits -----------------------------------
all_docs.extend(Doccument_splits)

# all_docs.extend(product_docs)

all_docs.extend(coupon_docs)

all_docs.extend(docs_markdown)  

all_docs.extend(faq_docs)

KnowledgeBase_for_Classification = {
    "Candle_Knowledge": all_candle_knowledge_questions,
    "Business_Rule": all_discount_questions,
    "User_Guidance": all_user_guidance_questions,
    "Policies": all_policy_questions,
    "Product_Catalog": all_product_questions,
}

# Assign chunk_id to each document in all_docs
for i, doc in enumerate(all_docs):
    doc.metadata["chunk_id"] = i

print(len(all_docs))

# For checking the splits by excel
rows = []
rows_Classification = []

for chunk in all_docs:
    rows.append({
        "chunk_id": chunk.metadata.get("chunk_id"),
        "source": chunk.metadata.get("source", ""),
        "length": len(chunk.page_content),
        "content": chunk.page_content
    })

for category, docs in KnowledgeBase_for_Classification.items():
    for doc in docs:
        rows_Classification.append({
            "category": category,
            "source": doc.metadata.get("source", ""),
            "length": len(doc.page_content),
            "content": doc.page_content
        })

df_testing = pd.DataFrame(rows)
df_classification = pd.DataFrame(rows_Classification)

df_testing.to_excel(
    CHUNK_DEBUG_XLSX_PATH,
    index=False
)

df_classification.to_excel(
    Report_Data_for_Classification_XLSX_PATH,
    index=False
)

print(f"Exported {len(rows)} chunks to {CHUNK_DEBUG_XLSX_PATH}")
print(f"Exported {len(rows_Classification)} classification data to {Report_Data_for_Classification_XLSX_PATH}")

