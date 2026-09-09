from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from rag_engine import RAGEngine


app = FastAPI(
    title="Manak Mitra API",
    description="BIS Standards RAG API",
    version="1.0.0"
)

# Allow the local Vite dev server to call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5736",
        "http://127.0.0.1:5736",
        "http://localhost:5175",
"http://127.0.0.1:5175",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
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
        "citations": result["citations"],
        # Already computed by RAGEngine.ask() but previously dropped here —
        # the frontend needs the underlying chunk text to populate its
        # Evidence / Source Viewer panels without inventing content.
        "evidence": result.get("evidence", [])
    }