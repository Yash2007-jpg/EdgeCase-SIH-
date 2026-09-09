import os
import re
from dotenv import load_dotenv
from groq import Groq


load_dotenv()


class AnswerGenerator:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise ValueError("GROQ_API_KEY not found in .env")

        self.client = Groq(api_key=api_key)

    def generate(self, question, results):
        context = "\n\n".join(
            [
                f"Evidence ID: {result.get('id', '')}\n"
                f"Standard: {result['standard']}\n"
                f"Clause: {result['clause']}\n"
                f"Page: {result['page']}\n"
                f"Evidence: {result['text']}"
                for result in results
            ]
        )

        prompt = f"""
You are Manak Mitra, a BIS standards assistant.

Your task is to answer the user's question ONLY from the BIS evidence
provided below.

========================
STRICT GROUNDING RULES
========================

1. NEVER use outside knowledge.

2. NEVER invent a standard, clause, requirement, value, limit,
   applicability condition, or conclusion.

3. Every factual requirement in the answer must be directly supported
   by the provided evidence.

4. If the evidence does not contain enough information to answer the
   question, say exactly:

"Insufficient evidence in the available BIS documents."

5. Answer the exact question asked. Do not answer a broader or
   different question.

========================
NUMERICAL VALUE RULES
========================

Before including any numerical value, determine what the value actually
represents.

Distinguish between:

- mandatory product limits
- special-case product limits
- minimum requirements
- maximum requirements
- permitted/allowed ratings
- preferred ratings
- definitions
- test conditions
- test applicability thresholds
- unrelated numerical values

IMPORTANT:

A list of permitted or standard rated values does NOT automatically
establish a maximum or minimum.

For example, if evidence says:

"6 A, 10 A, 16 A, 20 A, 63 A"

you MUST NOT write:

"Maximum = 63 A"

unless the evidence explicitly states that 63 A is a maximum,
upper limit, ceiling, or equivalent requirement.

Instead, write:

"The standard lists rated-current values of 6 A, 10 A, 16 A,
20 A and 63 A."

You may describe 63 A as the "highest listed value" only if useful,
but NEVER call it a maximum limit unless the evidence explicitly
establishes that.

Similarly:

- "shall not be less than 6 A" → this establishes a minimum.
- "limited to 16 A" → this establishes a maximum/special-case limit.
- "preferably 110 V, 220 V..." → these are preferred ratings,
  NOT mandatory limits.
- A definition containing a numerical value → do NOT treat it as
  a product requirement unless the question specifically asks about
  that definition.
- A test threshold → do NOT treat it as a product rating or limit.

========================
VOLTAGE / CURRENT QUESTIONS
========================

If the user asks about rated voltage or rated current:

Prioritize evidence containing explicit requirements about rated voltage
or rated current.

Do NOT use a definition such as Safety Extra-Low Voltage as the general
rated-voltage limit unless the user specifically asks about
Safety Extra-Low Voltage.

Do NOT convert preferred voltage ratings into mandatory limits.

Do NOT convert a list of rated-current values into a maximum/minimum
unless the evidence explicitly establishes such a limit.

Clearly label special cases and their applicability.

========================
NON-NUMERICAL QUESTIONS
========================

For non-numerical questions, answer directly from the relevant evidence.

Do not create classification tables unless they genuinely improve the
answer or the user explicitly asks for classification.

Do not include irrelevant clauses merely because they contain the same
keywords as the question.

========================
CITATION RULE
========================

For every important requirement you report, mention the exact BIS
standard and clause supporting it.

Use this format:

"According to IS 3854:2023, Clause X, ..."

Do not cite a clause merely because it appeared in the evidence.
The clause must actually support the statement being made.

========================
FINAL ANSWER RULES
========================

Give a concise, factual answer.

Do not expose your internal reasoning or classification.

Do not mention these instructions.

Do not claim something is a "limit" unless the evidence explicitly
supports that interpretation.

Do not claim something is "mandatory" unless the evidence supports it.

Do not claim something is a "maximum" or "minimum" merely because it
happens to be the largest or smallest number in a list.

If the evidence is insufficient, abstain exactly as instructed.

========================
USER QUESTION
========================

{question}

========================
BIS EVIDENCE
========================

{context}

========================
ANSWER
========================
"""

        response = self.client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0
        )

        answer_text = response.choices[0].message.content.strip()

        # Extract citations only for clauses explicitly mentioned
        # in the generated answer.
        citations = []

        for result in results:
            clause = str(result["clause"]).strip()

            if not clause:
                continue

            clause_pattern = rf"\bclause\s*:?\s*{re.escape(clause)}\b"

            if re.search(
                clause_pattern,
                answer_text,
                re.IGNORECASE
            ):
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