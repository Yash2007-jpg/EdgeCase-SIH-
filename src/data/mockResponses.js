// Mock/prototype data only. Not real BIS compliance advice.
//
// Each scenario's public fields (everything except id/mode/matchQuestion/keywords,
// which are mock-matching internals) mirror the response contract the real
// FastAPI/RAG backend is expected to return. See src/services/queryService.js
// for where this gets assembled into that contract and where the real request
// will eventually replace the mock lookup.

export const mockScenarios = [
  {
    id: "household-switches",
    mode: "industry",
    matchQuestion:
      "I manufacture household electrical switches. Which BIS standards apply?",
    keywords: ["switch", "switches", "electrical switch"],
    answer:
      "Household electrical switches may be covered by relevant Indian Standards such as IS 3854. This is mock data for the prototype.",
    standard: "IS 3854:2007",
    standardName:
      "Electrical Switches for Household and Similar Purposes — Specification",
    edition: "Second Revision",
    clause: "Clause 4.1",
    page: "Page 7",
    evidence:
      "The relevant requirements for switches are specified in this section of the standard.",
    sourceDocument: "IS 3854:2007",
    nextAction:
      "Review the applicable BIS requirements and certification route before manufacturing or selling the product.",
    nextActionUrl: null,
  },
  {
    id: "packaged-drinking-water",
    mode: "industry",
    matchQuestion:
      "I sell packaged drinking water. What BIS certification do I need?",
    keywords: ["drinking water", "packaged water", "mineral water"],
    answer:
      "Packaged drinking water is covered under mandatory BIS certification such as IS 14543. This is mock data for the prototype.",
    standard: "IS 14543:2004",
    standardName:
      "Packaged Drinking Water (Other than Packaged Natural Mineral Water) — Specification",
    edition: "First Revision",
    clause: "Clause 5.2",
    page: "Page 12",
    evidence:
      "The relevant quality and packaging requirements for drinking water are specified in this section of the standard.",
    sourceDocument: "IS 14543:2004",
    nextAction:
      "Apply for the mandatory BIS certification (ISI mark) before packaging or selling the product.",
    nextActionUrl: null,
  },
  {
    id: "verify-isi-mark",
    mode: "consumer",
    matchQuestion:
      "How do I check if a product has a genuine BIS certification?",
    keywords: ["genuine", "fake", "verify", "isi mark", "check certification"],
    answer:
      "You can verify a product's BIS certification by checking its ISI mark and licence number against BIS records. This is mock data for the prototype.",
    standard: "BIS/CMS/2018",
    standardName: "Conformity Assessment (Certification) Regulations",
    edition: "Conformity Assessment (Certification) Regulations, 2018",
    clause: "Regulation 4",
    page: "Page 3",
    evidence:
      "The relevant requirements for displaying and verifying the ISI mark are specified in this section of the regulations.",
    sourceDocument: "BIS/CMS/2018",
    nextAction:
      "Verify the certification and licence number using the BIS Care mobile app or website before purchasing.",
    nextActionUrl: null,
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
