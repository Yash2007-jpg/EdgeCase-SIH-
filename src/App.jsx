import { useState } from "react"
import { Button } from "@/components/ui/button"
import NavHeader from "@/components/ui/nav-header"
import QuestionComposer from "@/components/ui/question-composer"
import { findMockResponse } from "@/data/mockResponses"
function App() {
  const [question, setQuestion] = useState("")
  const [mode, setMode] = useState("industry")
  const [response, setResponse] = useState(null)
  const [showSource, setShowSource] = useState(false)
  const [abstained, setAbstained] = useState(false)

  const handleAsk = () => {
    setShowSource(false)

    const match = findMockResponse(question, mode)

    if (match) {
      setResponse(match)
      setAbstained(false)
    } else {
      setResponse(null)
      setAbstained(true)
    }
  }

  const handleModeChange = (nextMode) => {
    setMode(nextMode)
    setResponse(null)
    setAbstained(false)
    setShowSource(false)
  }

  const handleAbstention = () => {
    setQuestion("What BIS standard applies to a completely unknown product?")
    setAbstained(true)
    setResponse(null)
    setShowSource(false)
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">

        {/* Header */}
        <header className="border-b border-slate-200 pb-6">
  <NavHeader mode={mode} onModeChange={handleModeChange} />
</header>

        {/* Main content */}
        <section className="flex flex-1 flex-col items-center justify-center text-center">

          <p className="mb-3 text-sm font-medium text-blue-700">
            AI-powered standards assistant
          </p>

          <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900">
            Ask anything about Indian Standards and BIS services.
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Get grounded answers with exact evidence from relevant standards
            and clear next actions.
          </p>

          {/* Mock Answer */}
          {response && (
            <div className="mt-8 w-full max-w-2xl rounded-lg border bg-white p-6 text-left shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Mock AI Answer
              </p>

              <p className="mt-2 text-slate-900">
                {response.answer}
              </p>
            </div>
          )}

          {/* Evidence */}
          {response && (
            <div className="mt-4 w-full max-w-2xl rounded-lg border bg-white p-6 text-left shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Evidence
              </p>

              <div className="mt-3">
                <p className="font-semibold text-slate-900">
                  {response.standard.number}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {response.standard.edition}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {response.standard.clause} · {response.standard.page}
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
            <div className="mt-4 w-full max-w-2xl rounded-lg border bg-white p-6 text-left shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Next Action
              </p>

              <p className="mt-2 text-slate-900">
                {response.nextAction}
              </p>

              <Button className="mt-4">
                Continue to BIS
              </Button>
            </div>
          )}

          {/* Abstention */}
          {abstained && (
            <div className="mt-8 w-full max-w-2xl rounded-lg border bg-white p-6 text-left shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Insufficient Evidence
              </p>

              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                I don't have sufficient evidence to answer this.
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                I found related information, but there isn't enough verified
                evidence to provide a reliable answer.
              </p>

              <Button className="mt-5">
                Visit Official BIS Route
              </Button>
            </div>
          )}

          {/* Source Viewer */}
          {showSource && response && (
            <div className="mt-6 w-full max-w-5xl rounded-xl border bg-white p-6 text-left shadow-sm">
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
                      {response.standard.number} · {response.standard.clause} · {response.standard.page}
                    </p>
                  </div>
                </div>

                {/* Source Document */}
                <div className="rounded-lg border bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">
                    Source Document
                  </p>

                  <h3 className="mt-2 font-semibold text-slate-900">
                    {response.standard.number}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {response.standard.edition}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {response.standard.clause} · {response.standard.page}
                  </p>

                  <div className="mt-5 rounded-md border bg-white p-4">
                    <p className="text-xs font-medium text-slate-500">
                      RELEVANT EVIDENCE
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-900">
                      {response.evidenceText}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Question Box */}
          <div className="mt-8 w-full max-w-2xl">

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

        </section>

      </div>
    </main>
  )
}

export default App