from retrieval import Retriever, chunks
from generator import AnswerGenerator


class RAGEngine:
    def __init__(self):
        self.retriever = Retriever(chunks)
        self.generator = AnswerGenerator()

    def ask(self, question):
        # Retrieve evidence
        results = self.retriever.search(question, top_k=3)

        # Abstain if evidence is insufficient
        if not self.retriever.has_sufficient_evidence(results):
            return {
                "status": "abstain",
                "answer": "I don't have sufficient evidence in the available BIS documents.",
                "citations": [],
                "evidence": results
            }

        # Generate grounded answer
        answer = self.generator.generate(question, results)

        return {
            "status": "success",
            "answer": answer["answer"],
            "citations": answer["citations"],
            "evidence": results
        }