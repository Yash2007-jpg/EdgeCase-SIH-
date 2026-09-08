from retrieval import Retriever, chunks
from generator import AnswerGenerator


def main():
    retriever = Retriever(chunks)
    generator = AnswerGenerator()

    question = input("\nAsk a BIS question: ")

    results = retriever.search(question, top_k=2)

    if not retriever.has_sufficient_evidence(results):
        print("\nI don't have sufficient evidence in the available BIS documents.")
        return

    answer = generator.generate(question, results)

    print("\nAnswer:")
    print(answer["answer"])

    print("\nSources:")

    for citation in answer["citations"]:
        print(
            f"- {citation['standard']} | "
            f"Clause {citation['clause']} | "
            f"Page {citation['page']}"
        )


if __name__ == "__main__":
    main()