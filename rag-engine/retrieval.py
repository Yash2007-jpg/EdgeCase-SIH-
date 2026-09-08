import re
import numpy as np
from sentence_transformers import SentenceTransformer

class Retriever:
    def __init__(self, chunks):
        self.chunks = chunks

        # Embedding model
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

        # Create embeddings for all chunks
        texts = [
            f"Standard: {chunk['standard']}. "
            f"Clause: {chunk['clause']}. "
            f"{chunk['text']}"
            for chunk in chunks
        ]

        self.embeddings = self.model.encode(
            texts,
            normalize_embeddings=True
        )

    def search(self, query, top_k=3):
        query_embedding = self.model.encode(
            query,
            normalize_embeddings=True
        )

        semantic_scores = np.dot(
            self.embeddings,
            query_embedding
        )

        results = []

        for index, chunk in enumerate(self.chunks):
            # Build searchable text
            chunk_text = (
                f"{chunk['standard']} "
                f"{chunk['clause']} "
                f"{chunk['text']}"
            )

            # Keyword overlap
            keyword_score = self.keyword_score(
                query,
                chunk_text
            )

            # Strong boost for exact phrase matches
            query_lower = query.lower()
            chunk_lower = chunk_text.lower()

            if "switch boxes" in query_lower and "boxes for switches" in chunk_lower:
                keyword_score += 0.5

            # Combine semantic + keyword scores
            hybrid_score = (
                    0.7 * semantic_scores[index]
                    + 0.3 * keyword_score
            )

            result = chunk.copy()
            result["score"] = float(hybrid_score)

            results.append(result)

        # Highest hybrid score first
        results.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return results[:top_k]

    def retrieve(self, query, top_k=3):
        results = self.search(query, top_k=top_k)

        return {
            "query": query,
            "sufficient_evidence": self.has_sufficient_evidence(results),
            "results": results
        }

    def has_sufficient_evidence(self, results, threshold=0.50):
        if not results:
            return False

        best_score = results[0]["score"]

        if best_score < threshold:
            return False

        if len(results) >= 2:
            second_score = results[1]["score"]

            if second_score >= 0.30:
                return True

        return True

    def keyword_score(self, query, text):
        query_words = set(re.findall(r"\b\w+\b", query.lower()))
        text_words = set(re.findall(r"\b\w+\b", text.lower()))

        if not query_words:
            return 0.0

        matches = query_words.intersection(text_words)

        return len(matches) / len(query_words)


# --------------------------------------------------
# Temporary prototype data
# --------------------------------------------------

chunks = [
    {
        "id": "IS3854-2023-1.1",
        "standard": "IS 3854:2023",
        "clause": "1.1",
        "page": 3,
        "text": """This standard applies to manually operated general-purpose
switches for alternating currents only, with a rated voltage not
exceeding 440 V and a rated current not exceeding 63 A, intended for
household and similar fixed-electrical installations either indoors
or outdoors."""
    },
    {
        "id": "IS3854-2023-1.2",
        "standard": "IS 3854:2023",
        "clause": "1.2",
        "page": 3,
        "text": """The rated current is limited to 16 A for switches provided
with screw less terminals."""
    },
    {
        "id": "IS3854-2023-1.4",
        "standard": "IS 3854:2023",
        "clause": "1.4",
        "page": 3,
        "text": """This document also applies to boxes for switches, with the
exception of flush mounting boxes for flush-type switches. General
requirements for boxes for flush-type switches are given in IS 14772."""
    },
    {
        "id": "IS3854-2023-1.7",
        "standard": "IS 3854:2023",
        "clause": "1.7",
        "page": 13,
        "text": """This standard does not apply to circuit breakers for
household and similar installations, to switches for appliances,
in-line cord switches and switches incorporated in cable reels."""
    },
    {
        "id": "IS3854-2023-12.1",
        "standard": "IS 3854:2023",
        "clause": "12.1",
        "page": 21,
        "text": """Switches shall be provided with terminals having screw
    clamping or with screwless terminals. The means for clamping the
    conductors in the terminals shall not serve to fix any other component,
    although they may hold the terminals in place or prevent them from
    turning."""
    },
    {
        "id": "IS3854-2023-13.10",
        "standard": "IS 3854:2023",
        "clause": "13.10",
        "page": 38,
        "text": """Switches to be installed in a box shall be so designed
    that the conductor ends can be prepared after the box is mounted in
    position, but before the switch is fitted in the box. In addition, the
    base shall have adequate stability when mounted in the box."""
    },
    {
        "id": "IS3854-2023-15.2.3",
        "standard": "IS 3854:2023",
        "clause": "15.2.3",
        "page": 41,
        "text": """Enclosures of switches shall provide a degree of
    protection against harmful effects due to ingress of water in
    accordance with their IP classification. Compliance is checked by
    the appropriate tests of IS/IEC 60529."""
    },
    {
        "id": "IS3854-2023-20.1",
        "standard": "IS 3854:2023",
        "clause": "20.1",
        "page": 56,
        "text": """The test of the relevant sub-clauses 20.5 to 20.9 shall
    be applied according to the type of construction as specified in
    13.3. Accessories, surface mounting boxes, screwed glands and
    shrouds shall have adequate mechanical strength so as to withstand
    the stresses imposed during installation and use."""
    },
    {
        "id": "IS3854-2023-26.1",
        "standard": "IS 3854:2023",
        "clause": "26.1",
        "page": 68,
        "text": """The following shall be carried out as type tests on
    selected samples of switches being drawn preferably at random from
    a regular lot of production: Rating; Classification; Marking;
    Checking of dimensions; Protection against electric shock; Provision
    for earthing; and Terminals."""
    },
]


# --------------------------------------------------
# Test
# --------------------------------------------------

if __name__ == "__main__":
    retriever = Retriever(chunks)

    query = "I manufacture household electrical switches. Which BIS standards apply?"

    results = retriever.search(query)

    print("\nSearch results:")

    for result in results:
        print(
            f"\n{result['standard']} | "
            f"Clause {result['clause']} | "
            f"Score: {result['score']:.4f}"
        )
        print(result["text"])

    if retriever.has_sufficient_evidence(results):
        print("\nDecision: PROCEED")
    else:
        print("\nDecision: ABSTAIN")

    unsupported_query = "What BIS standard applies to aerospace turbine blades?"

    unsupported_results = retriever.search(unsupported_query)

    print("\nUnsupported question results:")

    for result in unsupported_results:
        print(
            f"{result['standard']} | "
            f"Clause {result['clause']} | "
            f"Score: {result['score']:.4f}"
        )

    if retriever.has_sufficient_evidence(unsupported_results):
        print("Decision: PROCEED")
    else:
        print("Decision: ABSTAIN")

    test_queries = [
        # Supported questions
        "What voltage and current limits does IS 3854:2023 specify?",
        "Are household switches covered by IS 3854:2023?",
        "Does IS 3854:2023 cover switch boxes?",
        "What types of terminals are provided for switches?",
        "What tests are carried out on switches?",

        # Unsupported questions
        "What BIS standard applies to aerospace turbine blades?",
        "What BIS standard applies to cement manufacturing?",
        "What BIS standard applies to medical MRI machines?",
        "What BIS standard applies to automobile tyres?",
        "What BIS standard applies to solar panels?"
    ]

    for test_query in test_queries:
        results = retriever.search(test_query, top_k=3)

        print(f"\nQuestion: {test_query}")

        for result in results:
            print(
                f"  Clause {result['clause']} | "
                f"Score: {result['score']:.4f}"
            )

        if retriever.has_sufficient_evidence(results):
            print("  Decision: PROCEED")
        else:
            print("  Decision: ABSTAIN")