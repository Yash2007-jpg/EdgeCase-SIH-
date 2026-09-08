// Query service boundary between the UI and the answer source.
//
// Today, queryBackend(question, mode) looks up a local mock scenario.
// When the real FastAPI/RAG backend is ready, replace the body of
// queryBackend with something like:
//
//   export async function queryBackend(question, mode) {
//     const res = await fetch("/api/query", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ question, mode }),
//     })
//     if (!res.ok) throw new Error(`Query failed: ${res.status}`)
//     return res.json()
//   }
//
// The rest of the frontend only ever calls queryBackend(question, mode) and
// reads the response contract below — nothing else needs to change when the
// real backend is wired in.
//
// Response contract (grounded answer):
//   { question, mode, grounded: true, abstained: false, answer, standard,
//     standardName, edition, clause, page, evidence, sourceDocument,
//     nextAction, nextActionUrl }
//
// Response contract (abstention):
//   { question, mode, grounded: false, abstained: true, reason,
//     closestEvidence, nextAction, nextActionUrl }

import { findMockResponse } from "@/data/mockResponses";

export async function queryBackend(question, mode) {
  const scenario = findMockResponse(question, mode);

  if (scenario) {
    return {
      question,
      mode,
      grounded: true,
      abstained: false,
      answer: scenario.answer,
      standard: scenario.standard,
      standardName: scenario.standardName,
      edition: scenario.edition,
      clause: scenario.clause,
      page: scenario.page,
      evidence: scenario.evidence,
      sourceDocument: scenario.sourceDocument,
      nextAction: scenario.nextAction,
      nextActionUrl: scenario.nextActionUrl ?? null,
    };
  }

  return {
    question,
    mode,
    grounded: false,
    abstained: true,
    reason: `No matching Indian Standard was found for this question in ${
      mode === "consumer" ? "Consumer" : "Industry"
    } mode.`,
    closestEvidence: null,
    nextAction:
      "Visit the official BIS website or BIS Care app for further assistance.",
    nextActionUrl: null,
  };
}
