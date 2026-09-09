from generator import AnswerGenerator


generator = AnswerGenerator()

test_results = [
    {
        "standard": "IS 3854:2023",
        "clause": "1.1",
        "page": 3,
        "text": (
            "This standard applies to manually operated general-purpose "
            "switches for alternating currents only, with a rated voltage "
            "not exceeding 440 V and a rated current not exceeding 63 A, "
            "intended for household and similar fixed-electrical installations."
        )
    }
]

question = "What voltage and current limits does IS 3854:2023 specify?"

answer = generator.generate(question, test_results)

print("Generated answer:")
print(answer["answer"])

print("\nCitations:")

for citation in answer["citations"]:
    print(
        f"{citation['standard']} | "
        f"Clause {citation['clause']} | "
        f"Page {citation['page']}"
    )