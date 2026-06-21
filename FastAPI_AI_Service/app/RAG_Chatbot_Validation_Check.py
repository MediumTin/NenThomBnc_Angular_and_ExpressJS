import json
import os
import re
import unicodedata
from re import match
from unittest import case, result

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
import pandas as pd
from pathlib import Path
from tqdm import tqdm
import numpy as np
import time
# For FastAPI usage
from Prompt.Promtp_Config import get_prompt_template
from LLM_Config.LLM_Config import llm_config, llm_for_judge_accuracy
from Embedding_Model.Embedding_model import embeddings
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
retrieved_docs_list = []
# 1. Định nghĩa đường dẫn tới file câu hỏi kiểm thử

mode = os.getenv("RETRIEVAL_MODE", "vietnamese")  # Lấy giá trị từ biến môi trường, mặc định là "vietnamese"
# Test for Candle knowledge
Test_Candle_knowledge_PATH = "app/data/NenThom_data/Candles_Knowledge/Tests/Test_Candle_knowledge.json"
Output_Candle_knowledge_PATH = "app/data/NenThom_data/Candles_Knowledge/Tests/Results/Result_Test_Candle_knowledge.json"    
Test_Candle_knowledge_Vietnamese_PATH = "app/data/NenThom_data/Candles_Knowledge/Tests/Test_Candle_knowledge_Vietnamese.json"
Output_Candle_knowledge_Vietnamese_PATH = "app/data/NenThom_data/Candles_Knowledge/Tests/Results/Result_Test_Candle_knowledge_Vietnamese.json"   

# Test for Discount program
Test_Discount_program_PATH = "app/data/NenThom_data/Discount_program/Tests/Test_Discount_program.json"
Output_Discount_program_PATH = "app/data/NenThom_data/Discount_program/Tests/Results/Result_Test_Discount_program.json"
Test_Discount_program_Vietnamese_PATH = "app/data/NenThom_data/Discount_program/Tests/Test_Discount_program_Vietnamese.json"
Output_Discount_program_Vietnamese_PATH = "app/data/NenThom_data/Discount_program/Tests/Results/Result_Test_Discount_program_Vietnamese.json"

# Test for Policies
Test_Policies_PATH = "app/data/NenThom_data/Policies/Tests/Test_Policies.json"
Output_Policies_PATH = "app/data/NenThom_data/Policies/Tests/Results/Result_Test_Policies.json"
Test_Policies_Vietnamese_PATH = "app/data/NenThom_data/Policies/Tests/Test_Policies_Vietnamese.json"
Output_Policies_Vietnamese_PATH = "app/data/NenThom_data/Policies/Tests/Results/Result_Test_Policies_Vietnamese.json"

# Test for Product Catalogs
Test_Product_Catalogs_PATH = "app/data/NenThom_data/Product_Catalogs/Tests/Test_Product_Catalog.json"
Output_Product_Catalogs_PATH = "app/data/NenThom_data/Product_Catalogs/Tests/Results/Result_Test_Product_Catalog.json"
Test_Product_Catalogs_Vietnamese_PATH = "app/data/NenThom_data/Product_Catalogs/Tests/Test_Product_Catalog_Vietnamese.json"
Output_Product_Catalogs_Vietnamese_PATH = "app/data/NenThom_data/Product_Catalogs/Tests/Results/Result_Test_Product_Catalog_Vietnamese.json"

# Test for Accessories Catalogs
Test_Accessories_Catalogs_PATH = "app/data/NenThom_data/Product_Catalogs/Tests/Test_Accesories_product_only.json"
Output_Accessories_Catalogs_PATH = "app/data/NenThom_data/Product_Catalogs/Tests/Results/Result_Test_Accesories_product_only.json"
Test_Accessories_Catalogs_Vietnamese_PATH = "app/data/NenThom_data/Product_Catalogs/Tests/Test_Accesories_product_only_Vietnamese.json"
Output_Accessories_Catalogs_Vietnamese_PATH = "app/data/NenThom_data/Product_Catalogs/Tests/Results/Result_Test_Accesories_product_only_Vietnamese.json"

# Test for Candle Catalogs
Test_Candle_Catalogs_PATH = "app/data/NenThom_data/Product_Catalogs/Tests/Test_Candle_product_only.json"
Output_Candle_Catalogs_PATH = "app/data/NenThom_data/Product_Catalogs/Tests/Results/Result_Test_Candle_product_only.json"
Test_Candle_Catalogs_Vietnamese_PATH = "app/data/NenThom_data/Product_Catalogs/Tests/Test_Candle_product_only_Vietnamese.json"
Output_Candle_Catalogs_Vietnamese_PATH = "app/data/NenThom_data/Product_Catalogs/Tests/Results/Result_Test_Candle_product_only_Vietnamese.json"

# Test for Lumos Catalogs
Test_Lumos_Catalogs_PATH = "app/data/NenThom_data/Product_Catalogs/Tests/Test_Lumos_product_only.json"
Output_Lumos_Catalogs_PATH = "app/data/NenThom_data/Product_Catalogs/Tests/Results/Result_Test_Lumos_product_only.json"
Test_Lumos_Catalogs_Vietnamese_PATH = "app/data/NenThom_data/Product_Catalogs/Tests/Test_Lumos_product_only_Vietnamese.json"
Output_Lumos_Catalogs_Vietnamese_PATH = "app/data/NenThom_data/Product_Catalogs/Tests/Results/Result_Test_Lumos_product_only_Vietnamese.json"

# Test for User guidance
Test_User_guidance_PATH = "app/data/NenThom_data/User_guidance/Tests/Test_User_guidance.json"
Output_User_guidance_PATH = "app/data/NenThom_data/User_guidance/Tests/Results/Result_Test_User_guidance.json"
Test_User_guidance_Vietnamese_PATH = "app/data/NenThom_data/User_guidance/Tests/Test_User_guidance_Vietnamese.json"
Output_User_guidance_Vietnamese_PATH = "app/data/NenThom_data/User_guidance/Tests/Results/Result_Test_User_guidance_Vietnamese.json"

# Select which test to run by setting the validation_file_path and output_results_path variables
validation_file_path = Test_User_guidance_PATH
output_results_path = Output_User_guidance_PATH

# Kiểm tra đảm bảo thư mục lưu kết quả tồn tại
os.makedirs(os.path.dirname(output_results_path), exist_ok=True)

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
        print(doc.metadata.get("source", "No source metadata"))
        print(doc.page_content)
        print("-" * 50)

    return data

def prepare_input_updated(data):
    history_text = "\n".join(
        f"{msg.role}: {msg.content}"
        for msg in data["chat_history"]
    )
    return {
        "context": data["context"], # Add this line to include retrieved context in the input to the prompt
        "chat_history": history_text, # Add this line to include chat history in the input to the prompt
        "question": data["question"],
        "language": data["language"]
    }

rag_chain = (
    RunnableLambda(prepare_input_updated)
    # | RunnableLambda(debug_context)
    | get_prompt_template()
    | llm_config
    | StrOutputParser()
)

    # Print the promt

def recall_at_k(retrieved_docs, relevant_docs, k):

    retrieved_sources = {
        doc["source"]
        for doc in retrieved_docs[:k]
    }

    return bool(
        retrieved_sources.intersection(
            set(relevant_docs)
        )
    )


CLASSIFICATION_TO_FAQ_SOURCE = {
    "Candle_Knowledge": "FAQ_Candle_knowledge.json",
    "Business_Rule": "FAQ_Discount_program.json",
    "Discount_Program": "FAQ_Discount_program.json",
    "User_Guidance": "FAQ_User_guidance.json",
    "Policies": "FAQ_Policies.json",
    "Product_Catalog": "FAQ_Product_Catalog.json",
}


QUESTION_KEYWORD_STOPWORDS = {
    "what", "which", "where", "when", "why", "how", "is", "are", "in", "the", "a", "an", "of", "for", "to",
    "thuoc", "nhom", "huong", "nao", "huongthom", "thom", "cua", "la", "gi",
    "fragrance", "family", "product", "products", "question", "answer", "belongs", "belong", "category",
    "candle", "lumos"
}


QUESTION_KEYWORD_CACHE = {}


def extract_question_keywords(question_text):
    tokens = re.findall(r"[a-z0-9]+", normalize_text_for_tokenize(question_text))
    return {
        token
        for token in tokens
        if len(token) >= 3 and token not in QUESTION_KEYWORD_STOPWORDS
    }


def get_question_keywords_for_overlap(question_text):
    cache_key = (question_text or "").strip()
    if cache_key in QUESTION_KEYWORD_CACHE:
        return QUESTION_KEYWORD_CACHE[cache_key]

    keywords = set(extract_question_keywords(cache_key))

    should_translate = False
    try:
        detected_lang = detect(cache_key) if cache_key else "en"
        should_translate = detected_lang != "en"
    except Exception:
        # Fall back to translation only when we cannot extract meaningful local tokens.
        should_translate = len(keywords) <= 1

    if should_translate and cache_key:
        try:
            translated_question = GoogleTranslator(source="auto", target="en").translate(cache_key)
            keywords.update(extract_question_keywords(translated_question))
        except Exception:
            pass

    QUESTION_KEYWORD_CACHE[cache_key] = keywords
    return keywords


def normalize_text_for_tokenize(text):
    normalized = unicodedata.normalize("NFD", (text or "").lower())
    without_accents = "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")
    return without_accents.replace("đ", "d")


def faq_has_question_keyword_overlap(retrieved_docs, k, faq_source, question_text):
    question_keywords = get_question_keywords_for_overlap(question_text)
    if not question_keywords:
        return False

    for doc in retrieved_docs[:k]:
        if doc.get("source") != faq_source:
            continue

        preview_tokens = set(re.findall(r"[a-z0-9]+", normalize_text_for_tokenize(doc.get("content_preview", ""))))
        if question_keywords.intersection(preview_tokens):
            return True

    return False


def recall_at_k_with_faq(retrieved_docs, relevant_docs, k, classification=None, question_text=""):
    # Accept canonical relevant docs (.md); allow FAQ hits only when question keywords overlap.
    if recall_at_k(retrieved_docs, relevant_docs, k):
        return True

    faq_source = CLASSIFICATION_TO_FAQ_SOURCE.get(classification)
    if not faq_source:
        return False

    return faq_has_question_keyword_overlap(retrieved_docs, k, faq_source, question_text)

def estimate_answer_accuracy(question: str, ground_truth_answer: str,generated_answer: str,llm) -> int:
        """
        Return:
            1 = Correct
            0 = Incorrect
        """

        # prompt = ChatPromptTemplate.from_template(
        #     """
        #     You are an evaluation judge.

        #     Task:
        #     Compare the generated answer against the ground truth answer.

        #     Question:
        #     {question}

        #     Ground Truth Answer:
        #     {ground_truth_answer}

        #     Generated Answer:
        #     {generated_answer}

        #     Rules:
        #     - Focus on semantic correctness.
        #     - Ignore formatting differences.
        #     - Ignore markdown formatting.
        #     - Ignore wording differences if meaning is equivalent.
        #     - Return 1 if the generated answer is correct.
        #     - Return 0 if it is incorrect, misleading, or missing critical information.

        #     Output ONLY:
        #     1
        #     or
        #     0
        #     """
        # )
        
        prompt = ChatPromptTemplate.from_template(
            """
            You are an evaluation judge.

            Task:
            Compare the generated answer against the ground truth answer.

            Question:
            {question}

            Ground Truth Answer:
            {ground_truth_answer}

            Generated Answer:
            {generated_answer}

            Rules:
            Scoring:
                1 = Semantically correct.
                - Paraphrasing is allowed.
                - Reordering is allowed.
                - Additional non-contradictory details are allowed.
                - Minor omissions are allowed if the main meaning is preserved.

                0 = Incorrect.
                - Contradicts the ground truth.
                - Omits key facts that change the meaning.
                - Contains fabricated facts that change the meaning.

                Return ONLY:
                1
                or
                0
            """
        )

        chain = (
            prompt
            | llm
            | StrOutputParser()
        )

        result = chain.invoke({
            "question": question,
            "ground_truth_answer": ground_truth_answer,
            "generated_answer": generated_answer
        })

        result = result.strip()

        return 1 if result == "1" else 0

# Output of first step is input of next step
# step 1: create input for prompt by retrieving relevant chunks based on the question (question is not change, context come from Vector DB)
# step 2: generate answer based on the retrieved context and the question using the prompt template
# step 3: pass to LLM
# step 4: output to user

# ----------------------------------Step 8: Get question from user and response answer ------------------------------------------

# 1. Đọc dữ liệu từ file JSON đầu vào
print(f"--> Đang tải dữ liệu kiểm thử từ: {validation_file_path}")
with open(validation_file_path, "r", encoding="utf-8") as f:
    dataset = json.load(f)

print(f"--> Tìm thấy {len(dataset)} câu hỏi. Bắt đầu chạy thử nghiệm qua RAG Chain...")

# Danh sách chứa kết quả sau khi đối chiếu
test_results = []

# Calculate accuracy, recall@5, recall@3, average latency, and P95 latency based on the generated answers and the ground truth answers in the dataset. Store the results in a JSON file for analysis.
print("\n Mode is ",mode)
# 2. Vòng lặp chạy và tính toán thời gian phản hồi
for item in tqdm(dataset, desc="Evaluating RAG Chain"):
    Retrieval_mode = ""  # Default retrieval mode
    # Hỗ trợ cả trường hợp file input là list chuỗi hoặc list chứa dict câu hỏi
    question_text = item.get("question") if isinstance(item, dict) else item
    language = detect(question_text)
    lang_map = {
        "vi": "Vietnamese",
        "en": "English"
    }
    language_name = lang_map.get(language, "English")
    Result_classification = get_retriever_classification(question_text)
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
        question_en = GoogleTranslator(source='vi',target='en').translate(question_text)
        # question_en = GoogleTranslator(source='en',target='en').translate(question_text)
        print(f"question_text question: {question_text}")
        print(f"Translated question: {question_en}")
    # Bấm giờ: Bắt đầu
    start_time = time.perf_counter()
    
    try:
        # Kích hoạt RAG Chain
        # docs_retrieveds = retriever.invoke(question_en) if Using_Transation_model else retriever.invoke(question_text)
        if Retrieval_mode == "english":
            docs_retrieveds = retriever.invoke(question_en)
        elif Retrieval_mode == "vietnamese":
            docs_retrieveds = retriever.invoke(question_text)
        elif Retrieval_mode == "hybrid":
            docs_vietnamese = retriever.invoke(question_text)
            docs_english = retriever.invoke(question_en)
            docs = rrf_merge(
                docs_vietnamese,
                docs_english
            )
            docs_retrieveds = docs[:5]
        
        # print("docs_retrieveds is ",docs_retrieveds)
        # print(f"Retrieved {len(docs_retrieveds)} documents for the question.")


        retrieved_doc_sources = [
            {
                "source": Path(docs_retrieved.metadata.get("source")).name,
                "chunk_id": docs_retrieved.metadata.get("chunk_id", "N/A"),
                "content_preview": docs_retrieved.page_content[:200]
            }
            for docs_retrieved in docs_retrieveds
        ]
        response = rag_chain.invoke({
            "question": question_text,
            "classification": Result_classification,
            "retrieval_mode": Retrieval_mode,
            "chat_history": [],
            "context": docs_retrieveds,
            "language": language_name    
        })
        
        # Bấm giờ: Kết thúc
        end_time = time.perf_counter()
        response_time = round(end_time - start_time, 2) # Làm tròn 2 chữ số thập phân
        answer_text = response

    except Exception as e:
        end_time = time.perf_counter()
        response_time = round(end_time - start_time, 2)
        answer_text = f"ERROR: {str(e)}"
        retrieved_doc_sources = []
    
    start_judge = time.perf_counter()
    try:
        accuracy = estimate_answer_accuracy(question_text,item.get("ground_truth_answer"), answer_text,llm_for_judge_accuracy)
        end_judge = time.perf_counter()
        judge_time = round(end_judge - start_judge, 2) # Làm tròn 2 chữ số thập phân
    except Exception as e:
        print(e)
        accuracy = None

    # accuracy = estimate_answer_accuracy(question_text,item.get("ground_truth_answer"), answer_text,llm_config)
    # 3. Định dạng dữ liệu đầu ra chính xác theo format yêu cầu
    test_results.append({
        "question": question_text,
        "classification": Result_classification,
        "retrieval_mode": Retrieval_mode,
        "response_time": response_time,
        "Judge_time": judge_time,
        "retrieved_docs": retrieved_doc_sources,
        "ground_truth_answer": item.get("ground_truth_answer"),
        "answer": answer_text,
        "Accuracy": accuracy, # Placeholder, to be calculated after all responses are collected
        "Recall@5": recall_at_k_with_faq(retrieved_doc_sources, item.get("relevant_docs", []), 5, Result_classification, question_text), # Placeholder, to be calculated after all responses are collected
        "Recall@3": recall_at_k_with_faq(retrieved_doc_sources, item.get("relevant_docs", []), 3, Result_classification, question_text),  # Placeholder, to be calculated after all responses are collected
    })
    retrieved_doc_sources = [] # Reset the retrieved_doc_sources for the next iteration


# 4. Summarize the results and calculate overall metrics
total_questions = len(test_results)

sum_accuracy = sum(item["Accuracy"] for item in test_results) / total_questions

recall_at_5 = (
    sum(item["Recall@5"] for item in test_results)
    / total_questions
)

recall_at_3 = (
    sum(item["Recall@3"] for item in test_results)
    / total_questions
)

latencies = [
    item["response_time"]
    for item in test_results
]

Jugde_latencies = [
    item["Judge_time"]
    for item in test_results
]

avg_latency = np.mean(latencies)
avg_judge_latency = np.mean(Jugde_latencies)

p95_latency = np.percentile(latencies, 95)
p95_judge_latency = np.percentile(Jugde_latencies, 95)

summary = {
    "Accuracy": round(sum_accuracy, 4),
    "Recall@5": round(recall_at_5, 4),
    "Recall@3": round(recall_at_3, 4),
    "Avg_Latency": round(avg_latency, 2),
    "P95_Latency": round(p95_latency, 2),
    "Avg_Judge_Latency": round(avg_judge_latency, 2),
    "P95_Judge_Latency": round(p95_judge_latency, 2)
}

output_data = {
    "summary": summary,
    "test_results": test_results,
}

# 5. Lưu kết quả ra file JSON
with open(output_results_path, "w", encoding="utf-8") as out_f:
    json.dump(output_data, out_f, ensure_ascii=False, indent=4)

print(f"\n[Hoàn thành] Kết quả kiểm thử đã được ghi nhận tại: {output_results_path}")


# 6. Export kết quả ra file Excel để dễ dàng phân tích
df = pd.DataFrame(test_results)
excel_output_path = output_results_path.replace(".json", ".xlsx")
# df.to_excel(excel_output_path, index=False)
# ---------------- First sheet : Summary ----------------
summary_df = pd.DataFrame([
    {
        "Metric": k,
        "Value": v
    }
    for k, v in output_data["summary"].items()
])

# ---------------- Second sheet : Detailed Results ----------------
results_df = pd.DataFrame([
    {
        "Question": item["question"],
        "Ground Truth": item["ground_truth_answer"],
        "Answer": item["answer"],
        "Accuracy": item["Accuracy"],
        "Recall@3": item["Recall@3"],
        "Recall@5": item["Recall@5"],
        "Response Time": item["response_time"],
        "Judge Time": item["Judge_time"]
    }
    for item in output_data["test_results"]
])

# ---------------- Third sheet : Retrieval Details ----------------
retrieval_rows = []

for item in output_data["test_results"]:

    for rank, doc in enumerate(item["retrieved_docs"], start=1):

        retrieval_rows.append({
            "Question": item["question"],
            "Rank": rank,
            "Source": doc["source"],
            "Chunk ID": doc["chunk_id"],
            "Content Preview": doc["content_preview"]
        })

retrieval_df = pd.DataFrame(retrieval_rows)

# ---------------- Export ----------------
with pd.ExcelWriter(
    excel_output_path,
    engine="openpyxl"
) as writer:

    summary_df.to_excel(
        writer,
        sheet_name="Summary",
        index=False
    )

    results_df.to_excel(
        writer,
        sheet_name="Results",
        index=False
    )

    retrieval_df.to_excel(
        writer,
        sheet_name="Retrieval",
        index=False
    )


print(f"[Hoàn thành] Kết quả kiểm thử đã được xuất ra file Excel tại: {excel_output_path}")
