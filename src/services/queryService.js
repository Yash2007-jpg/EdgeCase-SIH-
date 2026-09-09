// Query service boundary between the UI and the answer source.
//
// queryBackend(question, mode) calls the real FastAPI/RAG backend at
// `${VITE_API_URL}/ask` and adapts its response into the frontend contract
// below. The backend endpoint only accepts { question } — it does not (yet)
// accept mode — so `mode` is never sent over the wire, only echoed back into
// the returned object for the UI's own state.
//
// Response contract (grounded answer):
//   { question, mode, grounded: true, abstained: false, answer, standard,
//     standardName, edition, clause, page, evidence, sourceDocument,
//     nextAction, nextActionUrl, citations }
//
// Response contract (abstention):
//   { question, mode, grounded: false, abstained: true, reason,
//     closestEvidence, nextAction, nextActionUrl }
//
// The backend's actual /ask response shape is:
//   { status: "success" | "abstain", answer, citations: [{ standard, clause,
//     page, id }], evidence: [{ standard, clause, page, text, ... }] }
// It does not provide a standard's descriptive title, edition/revision, or
// any destination URL — those are left null/empty here rather than invented.

const GENERIC_NEXT_ACTION =
  "Review the cited BIS standard and clause for full requirements.";
const ABSTENTION_NEXT_ACTION =
  "Visit the official BIS website or BIS Care app for further assistance.";

function findEvidenceText(evidenceList, citation) {
  if (!citation) return null;

  const match = evidenceList.find(
    (item) =>
      String(item?.clause ?? "") === String(citation.clause ?? "") &&
      String(item?.standard ?? "") === String(citation.standard ?? "")
  );

  return match?.text ?? null;
}

function adaptBackendResponse(data, question, mode) {
  const status = data?.status;
  const citations = Array.isArray(data?.citations) ? data.citations : [];
  const evidenceList = Array.isArray(data?.evidence) ? data.evidence : [];

  if (status === "abstain") {
    const closest = evidenceList[0] ?? null;

    return {
      question,
      mode,
      grounded: false,
      abstained: true,
      reason:
        data?.answer ??
        "Insufficient evidence in the available BIS documents.",
      closestEvidence: closest
        ? {
            standard: closest.standard ?? null,
            clause: closest.clause ?? null,
            page: closest.page ?? null,
            text: closest.text ?? null,
          }
        : null,
      nextAction: ABSTENTION_NEXT_ACTION,
      nextActionUrl: null,
    };
  }

  if (status !== "success") {
    throw new Error("Unexpected response from the Manak Mitra backend.");
  }

  const primaryCitation = citations[0] ?? null;

  return {
    question,
    mode,
    grounded: true,
    abstained: false,
    answer: data?.answer ?? "",
    standard: primaryCitation?.standard ?? null,
    // Not provided by the backend — left null rather than invented.
    standardName: null,
    // Not provided by the backend — left null rather than invented.
    edition: null,
    clause: primaryCitation?.clause ?? null,
    page: primaryCitation?.page ?? null,
    evidence: findEvidenceText(evidenceList, primaryCitation),
    sourceDocument: primaryCitation?.standard ?? null,
    nextAction: GENERIC_NEXT_ACTION,
    nextActionUrl: null,
    // Preserved for future UI use — not read by the current components.
    citations,
  };
}

export async function queryBackend(question, mode) {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error(
      "VITE_API_URL is not configured. Set it in your .env file."
    );
  }

  let response;

  try {
    response = await fetch(`${apiUrl}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
  } catch (networkError) {
    throw new Error(
      "Could not reach the Manak Mitra backend. Check your connection and that the server is running."
    );
  }

  if (!response.ok) {
    throw new Error(
      `Manak Mitra backend returned an error (HTTP ${response.status}).`
    );
  }

  let data;

  try {
    data = await response.json();
  } catch (parseError) {
    throw new Error(
      "Received an invalid response from the Manak Mitra backend."
    );
  }

  return adaptBackendResponse(data, question, mode);
}
