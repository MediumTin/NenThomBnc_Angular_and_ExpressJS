# from fastapi import FastAPI

# app = FastAPI()

# @app.get("/")
# def root():
#     return {"message": "Hello FastAPI"}

from fastapi import FastAPI
from pydantic import BaseModel

from app.RAG_Chatbot import RAG_Model_ask

app = FastAPI()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    question: str
    chat_history: list[ChatMessage]  # Add this line to include chat history in the request body

@app.post("/chat")
def chat(req: ChatRequest):

    answer = RAG_Model_ask(req.question , req.chat_history)

    return {
        "answer": answer
    }