import os
import re
from dotenv import load_dotenv
from google import genai

load_dotenv()


class AnswerGenerator:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env")

        self.client = genai.Client(api_key=api_key)

    def generate(self, question, results):
        context = "\n\n".join(
            [
                f"Standard: {result['standard']}\n"
                f"Clause: {result['clause']}\n"
                f"Page: {result['page']}\n"
                f"Evidence: {result['text']}"
                for result in results
            ]
        )

        prompt = f"""
You are Manak Mitra, a BIS standards assistant.

Answer the user's question ONLY using the provided BIS evidence.

If the evidence does not contain enough information to answer the question,
say exactly:

"Insufficient evidence in the available BIS documents."

Do not use outside knowledge.
Do not invent standards, clauses, requirements, or values.

User question:
{question}

BIS evidence:
{context}

Give a concise, factual answer.

Include all important requirements from the evidence that are relevant
to the user's question, especially numerical limits, ratings,
conditions, exceptions, and applicability.

Mention the exact BIS standard and clause supporting each important
requirement.

Do not omit relevant numerical values present in the evidence.
"""

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        answer_text = response.text

        # Only return citations whose clause is explicitly mentioned
        # in the generated answer.
        citations = []

        for result in results:
            clause = str(result["clause"])

            clause_patterns = [
                f"Clause {clause}",
                f"clause {clause}",
                f"Clause: {clause}",
                f"clause: {clause}",
            ]

            if any(pattern in answer_text for pattern in clause_patterns):
                citations.append(
                    {
                        "standard": result["standard"],
                        "clause": result["clause"],
                        "page": result["page"],
                        "id": result.get(
                            "id",
                            f"{result['standard']}-{result['clause']}"
                        )
                    }
                )

        return {
            "answer": answer_text,
            "citations": citations
        }