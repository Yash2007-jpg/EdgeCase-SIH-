from rag_engine import RAGEngine


engine = RAGEngine()

questions = [
    "What voltage and current limits does IS 3854:2023 specify?",
    "Does IS 3854:2023 cover switch boxes?",
    "What BIS standard applies to aerospace turbine blades?"
]

for question in questions:
    print("\n" + "=" * 60)
    print("QUESTION:", question)

    result = engine.ask(question)

    print("\nSTATUS:", result["status"])
    print("ANSWER:", result["answer"])

    print("\nCITATIONS:")
    for citation in result["citations"]:
        print(
            f"- {citation['standard']} | "
            f"Clause {citation['clause']} | "
            f"Page {citation['page']}"
        )