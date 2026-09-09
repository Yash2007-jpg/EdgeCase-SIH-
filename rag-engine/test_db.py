import os
import psycopg2
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

load_dotenv()

conn = psycopg2.connect(os.getenv("DATABASE_URL"))

model = SentenceTransformer("all-MiniLM-L6-v2")

question = "I manufacture household electrical switches. Which BIS standards apply?"

query_embedding = model.encode(
    question,
    normalize_embeddings=True
)

cursor = conn.cursor()

cursor.execute(
    """
    SELECT
        c.chunk_id,
        c.chunk_text,
        c.document_id,
        c.page_number,
        c.clause_number,
        c.section_title
    FROM chunks c
    JOIN embeddings e
        ON c.chunk_id = e.chunk_id
    ORDER BY e.embedding <=> %s::vector
    LIMIT 5;
    """,
    (query_embedding.tolist(),)
)

results = cursor.fetchall()

print("\nTop results:\n")

for result in results:
    print(
        f"Chunk: {result[0]}\n"
        f"Document: {result[2]}\n"
        f"Page: {result[3]}\n"
        f"Clause: {result[4]}\n"
        f"Section: {result[5]}\n"
        f"Text: {result[1]}\n"
        + "-" * 60
    )

cursor.close()
conn.close()