from rag_engine import RAGEngine


def main():
    engine = RAGEngine()

    question = input("\nAsk a BIS question: ")

    result = engine.ask(question)

    print("\nStatus:")
    print(result["status"])

    print("\nAnswer:")
    print(result["answer"])

    print("\nSources:")

    if result["citations"]:
        for citation in result["citations"]:
            print(
                f"- {citation['standard']} | "
                f"Clause {citation['clause']} | "
                f"Page {citation['page']}"
            )
    else:
        print("- No sources available.")


if __name__ == "__main__":
    main()