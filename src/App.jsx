import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import NavHeader from "@/components/ui/nav-header"
import QuestionComposer from "@/components/ui/question-composer"
import CapabilitiesSection from "@/components/sections/capabilities-section"
import HowItWorksSection from "@/components/sections/how-it-works-section"
import EvidenceShowcaseSection from "@/components/sections/evidence-showcase-section"
import FinalCtaSection from "@/components/sections/final-cta-section"
import { queryBackend } from "@/services/queryService"
function App() {
  const [question, setQuestion] = useState("")
  const [mode, setMode] = useState("industry")
  const [response, setResponse] = useState(null)
  const [showSource, setShowSource] = useState(false)
  const [abstention, setAbstention] = useState(null)
  const [status, setStatus] = useState("idle")
  const [errorMessage, setErrorMessage] = useState(null)

  const handleAsk = async () => {
    const trimmedQuestion = question.trim()
    if (!trimmedQuestion || status === "loading") return

    setShowSource(false)
    setErrorMessage(null)
    setStatus("loading")

    try {
      const result = await queryBackend(trimmedQuestion, mode)

      if (result.grounded) {
        setResponse(result)
        setAbstention(null)
        setStatus("success")
      } else {
        setResponse(null)
        setAbstention(result)
        setStatus("abstained")
      }
    } catch (error) {
      console.error("Manak Mitra query failed:", error)
      setResponse(null)
      setAbstention(null)
      setErrorMessage(
        error.message ||
          "We couldn't process that question right now. Please try again."
      )
      setStatus("error")
    }
  }

  const handleModeChange = (nextMode) => {
    setMode(nextMode)
    setResponse(null)
    setAbstention(null)
    setShowSource(false)
    setErrorMessage(null)
    setStatus("idle")
  }

  const handleAbstention = () => {
    const dummyQuestion = "What BIS standard applies to a completely unknown product?"
    setQuestion(dummyQuestion)
    setResponse(null)
    setShowSource(false)
    setErrorMessage(null)
    setStatus("abstained")
    setAbstention({
      question: dummyQuestion,
      mode,
      grounded: false,
      abstained: true,
      reason:
        "No matching Indian Standard was found in the current knowledge base for this question.",
      closestEvidence: null,
      nextAction:
        "Visit the official BIS website or BIS Care app for further assistance.",
      nextActionUrl: null,
    })
  }

  const handleNextAction = (actionText, actionUrl) => {
    if (actionUrl) {
      window.open(actionUrl, "_blank", "noopener,noreferrer")
      return
    }
    window.alert(actionText)
  }

  const scrollToComposer = () => {
    document
      .getElementById("question-composer")
      ?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <NavHeader mode={mode} onModeChange={handleModeChange} />
        </div>
      </header>

      {/* Hero + live question experience */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(1100px circle at 50% -10%, rgba(245,158,11,0.085), transparent 60%), #F8FAFC",
        }}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="mb-5 flex items-center justify-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                AI-powered standards assistant
              </p>
              <span className="h-1.5 w-1.5 rounded-full bg-green-700" />
            </div>

            <h2 className="font-display max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Ask anything about Indian Standards and BIS services.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Get grounded answers with exact evidence from relevant standards
              and clear next actions.
            </p>
          </motion.div>

          {/* Loading */}
          {status === "loading" && (
            <div className="mt-8 w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Processing
              </p>

              <p className="mt-2 text-slate-900">
                Looking up the relevant Indian Standard...
              </p>
            </div>
          )}

          {/* Mock Answer */}
          {response && (
            <div className="mt-8 w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                AI Answer
              </p>

              <p className="mt-2 text-slate-900">
                {response.answer}
              </p>
            </div>
          )}

          {/* Evidence */}
          {response && (
            <div className="mt-4 w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Evidence
              </p>

              <div className="mt-3">
                <p className="font-semibold text-slate-900">
                  {response.standard}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {response.edition}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {response.clause} · {response.page}
                </p>
              </div>

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowSource(true)}
              >
                View Source
              </Button>
            </div>
          )}

          {/* Next Action */}
          {response && (
            <div className="mt-4 w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Next Action
              </p>

              <p className="mt-2 text-slate-900">
                {response.nextAction}
              </p>

              <Button
                className="mt-4"
                onClick={() => handleNextAction(response.nextAction, response.nextActionUrl)}
              >
                Continue to BIS
              </Button>
            </div>
          )}

          {/* Abstention */}
          {abstention && (
            <div className="mt-8 w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Insufficient Evidence
              </p>

              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                I don't have sufficient evidence to answer this.
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {abstention.reason}
              </p>

              <Button
                className="mt-5"
                onClick={() => handleNextAction(abstention.nextAction, abstention.nextActionUrl)}
              >
                Visit Official BIS Route
              </Button>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="mt-8 w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Something Went Wrong
              </p>

              <p className="mt-2 text-slate-900">
                {errorMessage ||
                  "We couldn't process that question right now. Please try again."}
              </p>
            </div>
          )}

          {/* Source Viewer */}
          {showSource && response && (
            <div className="mt-6 w-full max-w-5xl rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm">
              <div className="mb-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSource(false)}
                >
                  Close
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">

                {/* AI Answer */}
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    AI Answer
                  </p>

                  <p className="mt-3 text-slate-900">
                    {response.answer}
                  </p>

                  <div className="mt-4 rounded-md bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-700">
                      Citation
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {response.standard} · {response.clause} · {response.page}
                    </p>
                  </div>
                </div>

                {/* Source Document */}
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">
                    Source Document
                  </p>

                  <h3 className="mt-2 font-semibold text-slate-900">
                    {response.standard}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {response.edition}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {response.clause} · {response.page}
                  </p>

                  <div className="mt-5 rounded-md border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium text-slate-500">
                      RELEVANT EVIDENCE
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-900">
                      {response.evidence}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Question Box */}
          <div id="question-composer" className="mt-10 w-full max-w-2xl scroll-mt-24">

            <QuestionComposer
              question={question}
              setQuestion={setQuestion}
              onAsk={handleAsk}
            />

            {/* Development-only Abstention Test */}
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleAbstention}
              >
                Test Abstention
              </Button>
            </div>

          </div>
        </div>
      </section>

      <CapabilitiesSection />
      <HowItWorksSection />
      <EvidenceShowcaseSection />
      <FinalCtaSection onAskClick={scrollToComposer} />
    </div>
  )
}

export default App
