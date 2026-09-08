// Mock/prototype data only. Not real BIS compliance advice.
// Replace `findMockResponse` with a real API call when the backend is ready —
// keep the same return shape (a scenario object or null) so callers don't change.

export const mockScenarios = [
  {
    id: "household-switches",
    mode: "industry",
    matchQuestion:
      "I manufacture household electrical switches. Which BIS standards apply?",
    keywords: ["switch", "switches", "electrical switch"],
    answer:
      "Household electrical switches may be covered by relevant Indian Standards such as IS 3854. This is mock data for the prototype.",
    standard: {
      number: "IS 3854:2007",
      edition: "Second Revision",
      clause: "Clause 4.1",
      page: "Page 7",
    },
    evidenceText:
      "The relevant requirements for switches are specified in this section of the standard.",
    nextAction:
      "Review the applicable BIS requirements and certification route before manufacturing or selling the product.",
  },
  {
    id: "packaged-drinking-water",
    mode: "industry",
    matchQuestion:
      "I sell packaged drinking water. What BIS certification do I need?",
    keywords: ["drinking water", "packaged water", "mineral water"],
    answer:
      "Packaged drinking water is covered under mandatory BIS certification such as IS 14543. This is mock data for the prototype.",
    standard: {
      number: "IS 14543:2004",
      edition: "First Revision",
      clause: "Clause 5.2",
      page: "Page 12",
    },
    evidenceText:
      "The relevant quality and packaging requirements for drinking water are specified in this section of the standard.",
    nextAction:
      "Apply for the mandatory BIS certification (ISI mark) before packaging or selling the product.",
  },
  {
    id: "verify-isi-mark",
    mode: "consumer",
    matchQuestion:
      "How do I check if a product has a genuine BIS certification?",
    keywords: ["genuine", "fake", "verify", "isi mark", "check certification"],
    answer:
      "You can verify a product's BIS certification by checking its ISI mark and licence number against BIS records. This is mock data for the prototype.",
    standard: {
      number: "BIS/CMS/2018",
      edition: "Conformity Assessment (Certification) Regulations, 2018",
      clause: "Regulation 4",
      page: "Page 3",
    },
    evidenceText:
      "The relevant requirements for displaying and verifying the ISI mark are specified in this section of the regulations.",
    nextAction:
      "Verify the certification and licence number using the BIS Care mobile app or website before purchasing.",
  },
];

// Case-insensitive match against a scenario's canonical question or keywords,
// scoped to the given mode. Returns the matching scenario, or null when
// there's insufficient evidence for that mode.
export function findMockResponse(question, mode) {
  const normalized = question.trim().toLowerCase();
  if (!normalized) return null;

  const scenariosForMode = mockScenarios.filter(
    (scenario) => scenario.mode === mode
  );

  return (
    scenariosForMode.find((scenario) => {
      if (normalized === scenario.matchQuestion.toLowerCase()) return true;
      return scenario.keywords.some((keyword) =>
        normalized.includes(keyword.toLowerCase())
      );
    }) ?? null
  );
}
