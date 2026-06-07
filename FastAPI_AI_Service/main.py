# from fastapi import FastAPI

# app = FastAPI()

# @app.get("/")
# def root():
#     return {"message": "Hello FastAPI"}

from fastapi import FastAPI
from pydantic import BaseModel

from app.RAG_Chatbot import RAG_Model_ask

app = FastAPI()

class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
def chat(req: ChatRequest):

    answer = RAG_Model_ask(req.question)

    return {
        "answer": answer
    }