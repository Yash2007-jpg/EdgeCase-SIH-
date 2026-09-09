from fastapi import FastAPI
from pydantic import BaseModel

from rag_engine import RAGEngine


app = FastAPI(
    title="Manak Mitra API",
    description="BIS Standards RAG API",
    version="1.0.0"
)


# Create the RAG engine once when the API starts.
engine = RAGEngine()


class QuestionRequest(BaseModel):
    question: str


@app.get("/")
def root():
    return {
        "message": "Manak Mitra BIS RAG API is running"
    }


@app.post("/ask")
def ask_question(request: QuestionRequest):
    result = engine.ask(request.question)

    return {
        "status": result["status"],
        "answer": result["answer"],
        "citations": result["citations"]
    }