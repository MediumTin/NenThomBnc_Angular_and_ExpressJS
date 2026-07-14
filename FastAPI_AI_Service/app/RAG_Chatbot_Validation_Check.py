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
from ragas import evaluate
from ragas.llms import LangchainLLMWrapper
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall
)
from datasets import Dataset
import pandas as pd
from pathlib import Path
from tqdm import tqdm
import numpy as np
import time
# For FastAPI usage
from Prompt.Promtp_Config import get_prompt_template
from LLM_Config.LLM_Config import llm_config, llm_for_judge_accuracy, llm_for_ragas
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
ragas_llm = LangchainLLMWrapper(llm_for_ragas, bypass_temperature=True)
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

TEST_REPEAT_COUNT = 1
RETRIEVAL_MODES_TO_TEST = ["vietnamese", "english"]

# Execution mode:
# - "single": run exactly one dataset file one time (default)
# - "batch": run all suites/datasets/retrieval modes with repeat count
RUN_MODE = "single"
# RUN_MODE = "batch"

SINGLE_RUN_CONFIG = {
    "validation_file_path": Test_Discount_program_Vietnamese_PATH,
    "output_results_path": Output_Discount_program_Vietnamese_PATH,
    "retrieval_mode": "vietnamese",
}

TEST_SUITES = [
    # {
    #     "suite_name": "Candle_Knowledge",
    #     "datasets": [
    #         {
    #             "dataset_label": "english",
    #             "validation_file_path": Test_Candle_knowledge_PATH,
    #             "output_results_path": Output_Candle_knowledge_PATH,
    #         },
    #         {
    #             "dataset_label": "vietnamese",
    #             "validation_file_path": Test_Candle_knowledge_Vietnamese_PATH,
    #             "output_results_path": Output_Candle_knowledge_Vietnamese_PATH,
    #         },
    #     ],
    # },
    {
        "suite_name": "Discount_Program",
        "datasets": [
            {
                "dataset_label": "english",
                "validation_file_path": Test_Discount_program_PATH,
                "output_results_path": Output_Discount_program_PATH,
            },
            {
                "dataset_label": "vietnamese",
                "validation_file_path": Test_Discount_program_Vietnamese_PATH,
                "output_results_path": Output_Discount_program_Vietnamese_PATH,
            },
        ],
    },
    # {
    #     "suite_name": "Policies",
    #     "datasets": [
    #         {
    #             "dataset_label": "english",
    #             "validation_file_path": Test_Policies_PATH,
    #             "output_results_path": Output_Policies_PATH,
    #         },
    #         {
    #             "dataset_label": "vietnamese",
    #             "validation_file_path": Test_Policies_Vietnamese_PATH,
    #             "output_results_path": Output_Policies_Vietnamese_PATH,
    #         },
    #     ],
    # }
    # ,
    {
        "suite_name": "Product_Catalog",
        "datasets": [
            {
                "dataset_label": "english",
                "validation_file_path": Test_Product_Catalogs_PATH,
                "output_results_path": Output_Product_Catalogs_PATH,
            },
            {
                "dataset_label": "vietnamese",
                "validation_file_path": Test_Product_Catalogs_Vietnamese_PATH,
                "output_results_path": Output_Product_Catalogs_Vietnamese_PATH,
            },
        ],
    },
    {
        "suite_name": "User_Guidance",
        "datasets": [
            {
                "dataset_label": "english",
                "validation_file_path": Test_User_guidance_PATH,
                "output_results_path": Output_User_guidance_PATH,
            },
            {
                "dataset_label": "vietnamese",
                "validation_file_path": Test_User_guidance_Vietnamese_PATH,
                "output_results_path": Output_User_guidance_Vietnamese_PATH,
            },
        ],
    }
]

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


def reciprocal_rank_with_faq(retrieved_docs, relevant_docs, classification=None, question_text=""):
    relevant_set = set(relevant_docs or [])
    faq_source = CLASSIFICATION_TO_FAQ_SOURCE.get(classification)
    question_keywords = get_question_keywords_for_overlap(question_text)

    for index, doc in enumerate(retrieved_docs, start=1):
        source = doc.get("source")
        if source in relevant_set:
            return 1.0 / index

        if faq_source and source == faq_source and question_keywords:
            preview_tokens = set(
                re.findall(r"[a-z0-9]+", normalize_text_for_tokenize(doc.get("content_preview", "")))
            )
            if question_keywords.intersection(preview_tokens):
                return 1.0 / index

    return 0.0

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


def safe_numeric_mean(values):
    numeric_values = [v for v in values if isinstance(v, (int, float)) and not np.isnan(v)]
    if not numeric_values:
        return None
    return float(np.mean(numeric_values))


def sanitize_metric_value(value):
    if value is None:
        return None
    try:
        numeric_value = float(value)
    except (TypeError, ValueError):
        return None

    if np.isnan(numeric_value) or np.isinf(numeric_value):
        return None

    return numeric_value


def replace_nan_with_none(data):
    if isinstance(data, dict):
        return {k: replace_nan_with_none(v) for k, v in data.items()}
    if isinstance(data, list):
        return [replace_nan_with_none(item) for item in data]
    if isinstance(data, float) and (np.isnan(data) or np.isinf(data)):
        return None
    return data


def get_english_question(question_text, detected_language):
    if not (question_text or "").strip():
        return ""

    if detected_language == "en":
        return question_text

    try:
        return GoogleTranslator(source="auto", target="en").translate(question_text)
    except Exception as e:
        print(f"Translation failed, fallback to original question: {e}")
        return question_text


def build_output_path(base_output_path, retrieval_mode, run_index):
    output_path = Path(base_output_path)
    return str(
        output_path.with_name(
            f"{output_path.stem}__retrieval_{retrieval_mode}__run_{run_index}{output_path.suffix}"
        )
    )


def compute_ragas_scores(question_text, generated_answer, ground_truth_answer, retrieved_doc_sources, retrieved_contexts=None):
    ragas_result = {
        "faithfulness": None,
        "answer_relevancy": None,
        "context_precision": None,
        "context_recall": None,
        "RAGAS_Avg_4": None,
        "ragas_error": None
    }

    contexts = []
    if retrieved_contexts:
        contexts = [ctx for ctx in retrieved_contexts if (ctx or "").strip()]

    if not contexts:
        contexts = [
            (doc.get("content_preview") or "")
            for doc in retrieved_doc_sources
            if ((doc.get("content_preview") or "").strip())
        ]

    if not question_text or not generated_answer or len(contexts) == 0:
        ragas_result["ragas_error"] = "Missing required inputs for RAGAS (question/answer/contexts)."
        return ragas_result

    # context_precision/context_recall require ground truth answer in the evaluation row.
    if not (ground_truth_answer or "").strip():
        ragas_result["ragas_error"] = "Missing ground_truth_answer for context_precision/context_recall."
        return ragas_result

    try:
        eval_dataset = Dataset.from_dict(
            {
                "question": [question_text],
                "answer": [generated_answer],
                "contexts": [contexts],
                "ground_truth": [ground_truth_answer]
            }
        )

        eval_result = evaluate(
            eval_dataset,
            metrics=[faithfulness, answer_relevancy, context_precision, context_recall],
            llm=ragas_llm
        )

        eval_row = eval_result.to_pandas().iloc[0].to_dict()

        ragas_result["faithfulness"] = sanitize_metric_value(eval_row.get("faithfulness"))
        ragas_result["answer_relevancy"] = sanitize_metric_value(eval_row.get("answer_relevancy"))
        ragas_result["context_precision"] = sanitize_metric_value(eval_row.get("context_precision"))
        ragas_result["context_recall"] = sanitize_metric_value(eval_row.get("context_recall"))

        ragas_result["RAGAS_Avg_4"] = safe_numeric_mean([
            ragas_result["faithfulness"],
            ragas_result["answer_relevancy"],
            ragas_result["context_precision"],
            ragas_result["context_recall"],
        ])

        if (
            ragas_result["faithfulness"] is None
            and ragas_result["answer_relevancy"] is None
            and ragas_result["context_precision"] is None
            and ragas_result["context_recall"] is None
            and ragas_result["ragas_error"] is None
        ):
            ragas_result["ragas_error"] = "RAGAS returned NaN/invalid values for all metrics."

    except Exception as e:
        ragas_result["ragas_error"] = str(e)

    return ragas_result

def evaluate_single_dataset(validation_file_path, output_results_path, retrieval_mode):
    os.makedirs(os.path.dirname(output_results_path), exist_ok=True)

    print(f"--> Đang tải dữ liệu kiểm thử từ: {validation_file_path}")
    with open(validation_file_path, "r", encoding="utf-8") as f:
        dataset = json.load(f)

    print(f"--> Tìm thấy {len(dataset)} câu hỏi. Bắt đầu chạy thử nghiệm qua RAG Chain...")
    print(f"\n Retrieval mode is {retrieval_mode}")

    test_results = []

    for item in tqdm(dataset, desc=f"Evaluating RAG Chain [{retrieval_mode}]"):
        docs_retrieveds = []
        question_en = ""
        question_text = item.get("question") if isinstance(item, dict) else item
        language = detect(question_text)
        lang_map = {
            "vi": "Vietnamese",
            "en": "English"
        }
        language_name = lang_map.get(language, "English")
        Result_classification = get_retriever_classification(question_text)
        print(f"Classification result: {Result_classification}")
        print(f"Retrieval mode for this question: {retrieval_mode}")

        if retrieval_mode == "english" or retrieval_mode == "hybrid":
            question_en = get_english_question(question_text, language)
            print(f"question_text question: {question_text}")
            print(f"Translated question: {question_en}")

        start_time = time.perf_counter()

        try:
            if retrieval_mode == "english":
                docs_retrieveds = retriever.invoke(question_en)
            elif retrieval_mode == "vietnamese":
                docs_retrieveds = retriever.invoke(question_text)
            elif retrieval_mode == "hybrid":
                docs_vietnamese = retriever.invoke(question_text)
                docs_english = retriever.invoke(question_en)
                docs = rrf_merge(
                    docs_vietnamese,
                    docs_english
                )
                docs_retrieveds = docs[:5]

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
                "retrieval_mode": retrieval_mode,
                "chat_history": [],
                "context": docs_retrieveds,
                "language": language_name
            })

            end_time = time.perf_counter()
            response_time = round(end_time - start_time, 2)
            answer_text = response

        except Exception as e:
            end_time = time.perf_counter()
            response_time = round(end_time - start_time, 2)
            answer_text = f"ERROR: {str(e)}"
            retrieved_doc_sources = []

        start_judge = time.perf_counter()
        try:
            accuracy = estimate_answer_accuracy(
                question_text,
                item.get("ground_truth_answer"),
                answer_text,
                llm_for_judge_accuracy
            )
            end_judge = time.perf_counter()
            judge_time = round(end_judge - start_judge, 2)
        except Exception as e:
            print(e)
            accuracy = None
            end_judge = time.perf_counter()
            judge_time = round(end_judge - start_judge, 2)

        ragas_scores = compute_ragas_scores(
            question_text=question_text,
            generated_answer=answer_text,
            ground_truth_answer=item.get("ground_truth_answer", ""),
            retrieved_doc_sources=retrieved_doc_sources,
            retrieved_contexts=[doc.page_content for doc in docs_retrieveds],
        )

        test_results.append({
            "question": question_text,
            "classification": Result_classification,
            "retrieval_mode": retrieval_mode,
            "response_time": response_time,
            "Judge_time": judge_time,
            "retrieved_docs": retrieved_doc_sources,
            "ground_truth_answer": item.get("ground_truth_answer"),
            "answer": answer_text,
            "Accuracy": accuracy,
            "Recall@5": recall_at_k_with_faq(retrieved_doc_sources, item.get("relevant_docs", []), 5, Result_classification, question_text),
            "Recall@3": recall_at_k_with_faq(retrieved_doc_sources, item.get("relevant_docs", []), 3, Result_classification, question_text),
            "Reciprocal_Rank": reciprocal_rank_with_faq(retrieved_doc_sources, item.get("relevant_docs", []), Result_classification, question_text),
            "faithfulness": ragas_scores["faithfulness"],
            "answer_relevancy": ragas_scores["answer_relevancy"],
            "context_precision": ragas_scores["context_precision"],
            "context_recall": ragas_scores["context_recall"],
            "RAGAS_Avg_4": ragas_scores["RAGAS_Avg_4"],
            "ragas_error": ragas_scores["ragas_error"],
        })

    total_questions = len(test_results)

    sum_accuracy = safe_numeric_mean([item.get("Accuracy") for item in test_results])
    recall_at_5 = sum(item["Recall@5"] for item in test_results) / total_questions
    recall_at_3 = sum(item["Recall@3"] for item in test_results) / total_questions
    mrr = sum(item["Reciprocal_Rank"] for item in test_results) / total_questions

    latencies = [item["response_time"] for item in test_results]
    judge_latencies = [item["Judge_time"] for item in test_results]

    avg_latency = np.mean(latencies)
    avg_judge_latency = np.mean(judge_latencies)
    p95_latency = np.percentile(latencies, 95)
    p95_judge_latency = np.percentile(judge_latencies, 95)

    avg_faithfulness = safe_numeric_mean([item.get("faithfulness") for item in test_results])
    avg_answer_relevancy = safe_numeric_mean([item.get("answer_relevancy") for item in test_results])
    avg_context_precision = safe_numeric_mean([item.get("context_precision") for item in test_results])
    avg_context_recall = safe_numeric_mean([item.get("context_recall") for item in test_results])
    avg_ragas_avg_4 = safe_numeric_mean([item.get("RAGAS_Avg_4") for item in test_results])

    summary = {
        "Accuracy": round(sum_accuracy, 4) if sum_accuracy is not None else None,
        "Recall@5": round(recall_at_5, 4),
        "Recall@3": round(recall_at_3, 4),
        "MRR": round(mrr, 4),
        "faithfulness": round(avg_faithfulness, 4) if avg_faithfulness is not None else None,
        "answer_relevancy": round(avg_answer_relevancy, 4) if avg_answer_relevancy is not None else None,
        "context_precision": round(avg_context_precision, 4) if avg_context_precision is not None else None,
        "context_recall": round(avg_context_recall, 4) if avg_context_recall is not None else None,
        "RAGAS_Avg_4": round(avg_ragas_avg_4, 4) if avg_ragas_avg_4 is not None else None,
        "Avg_Latency": round(avg_latency, 2),
        "P95_Latency": round(p95_latency, 2),
        "Avg_Judge_Latency": round(avg_judge_latency, 2),
        "P95_Judge_Latency": round(p95_judge_latency, 2)
    }

    output_data = {
        "summary": summary,
        "test_results": test_results,
    }

    output_data = replace_nan_with_none(output_data)

    with open(output_results_path, "w", encoding="utf-8") as out_f:
        json.dump(output_data, out_f, ensure_ascii=False, indent=4, allow_nan=False)

    print(f"\n[Hoàn thành] Kết quả kiểm thử đã được ghi nhận tại: {output_results_path}")

    excel_output_path = output_results_path.replace(".json", ".xlsx")
    summary_df = pd.DataFrame([
        {
            "Metric": k,
            "Value": v
        }
        for k, v in output_data["summary"].items()
    ])

    results_df = pd.DataFrame([
        {
            "Question": item["question"],
            "Ground Truth": item["ground_truth_answer"],
            "Answer": item["answer"],
            "Accuracy": item["Accuracy"],
            "Recall@3": item["Recall@3"],
            "Recall@5": item["Recall@5"],
            "Reciprocal Rank": item["Reciprocal_Rank"],
            "faithfulness": item.get("faithfulness"),
            "answer_relevancy": item.get("answer_relevancy"),
            "context_precision": item.get("context_precision"),
            "context_recall": item.get("context_recall"),
            "RAGAS_Avg_4": item.get("RAGAS_Avg_4"),
            "ragas_error": item.get("ragas_error"),
            "Response Time": item["response_time"],
            "Judge Time": item["Judge_time"]
        }
        for item in output_data["test_results"]
    ])

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


def run_all_test_suites():
    batch_results = []

    for suite in TEST_SUITES:
        suite_name = suite["suite_name"]
        for dataset_config in suite["datasets"]:
            dataset_label = dataset_config["dataset_label"]
            validation_file_path = dataset_config["validation_file_path"]
            base_output_results_path = dataset_config["output_results_path"]

            for retrieval_mode in RETRIEVAL_MODES_TO_TEST:
                for run_index in range(1, TEST_REPEAT_COUNT + 1):
                    output_results_path = build_output_path(
                        base_output_results_path,
                        retrieval_mode,
                        run_index
                    )

                    print("\n" + "=" * 120)
                    print(
                        f"Running suite={suite_name} dataset={dataset_label} retrieval={retrieval_mode} run={run_index}"
                    )
                    print("=" * 120)

                    evaluate_single_dataset(
                        validation_file_path=validation_file_path,
                        output_results_path=output_results_path,
                        retrieval_mode=retrieval_mode,
                    )

                    batch_results.append({
                        "suite_name": suite_name,
                        "dataset_label": dataset_label,
                        "retrieval_mode": retrieval_mode,
                        "run_index": run_index,
                        "output_results_path": output_results_path,
                    })

    batch_manifest_path = "app/data/NenThom_data/Batch_Test_Run_Manifest.json"
    with open(batch_manifest_path, "w", encoding="utf-8") as manifest_f:
        json.dump(batch_results, manifest_f, ensure_ascii=False, indent=4)

    print(f"\n[Hoàn thành] Batch manifest đã được ghi tại: {batch_manifest_path}")


def run_single_test():
    validation_file_path = SINGLE_RUN_CONFIG["validation_file_path"]
    output_results_path = SINGLE_RUN_CONFIG["output_results_path"]
    retrieval_mode = SINGLE_RUN_CONFIG["retrieval_mode"]

    print("\n" + "=" * 120)
    print(
        f"Running single test file={validation_file_path} retrieval={retrieval_mode}"
    )
    print("=" * 120)

    evaluate_single_dataset(
        validation_file_path=validation_file_path,
        output_results_path=output_results_path,
        retrieval_mode=retrieval_mode,
    )


def count_batch_jobs():
    dataset_count = sum(len(suite["datasets"]) for suite in TEST_SUITES)
    return dataset_count * len(RETRIEVAL_MODES_TO_TEST) * TEST_REPEAT_COUNT


if __name__ == "__main__":
    if RUN_MODE == "single":
        run_single_test()
    elif RUN_MODE == "batch":
        print(
            f"Batch mode planned jobs: {count_batch_jobs()} "
            f"(datasets x retrieval_modes x repeats)"
        )
        run_all_test_suites()
    else:
        raise ValueError(
            f"Invalid RUN_MODE={RUN_MODE}. Use 'single' or 'batch'."
        )
