import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

function QuestionComposer({
  question,
  setQuestion,
  onAsk,
}) {
  return (
    <div className="w-full">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow focus-within:shadow-md">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about an Indian Standard, BIS certification, or compliance requirement..."
          className="min-h-28 resize-none border-0 bg-transparent px-3 py-2 text-base shadow-none focus-visible:ring-0"
        />

        <div className="mt-2 flex items-center justify-between border-t border-slate-100 px-2 pt-3">
          <p className="text-xs text-slate-400">
            Answers are grounded in available evidence
          </p>

          <Button
            type="button"
            onClick={onAsk}
            className="rounded-xl px-5"
          >
            Ask Manak Mitra
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          setQuestion(
            "I manufacture household electrical switches. Which BIS standards apply?"
          )
        }
        className="mt-4 text-left text-sm text-slate-500 transition hover:text-slate-900"
      >
        <span className="font-medium text-slate-700">
          Try asking:
        </span>{" "}
        “I manufacture household electrical switches. Which BIS standards
        apply?”
      </button>

      <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
        BIS-focused
        <span className="text-slate-300">•</span>
        Evidence-first
        <span className="text-slate-300">•</span>
        Prototype
      </div>
    </div>
  )
}

export default QuestionComposer