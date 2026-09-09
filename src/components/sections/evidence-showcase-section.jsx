import { motion } from "framer-motion"
import { FileText } from "lucide-react"

// Static, illustrative preview only — deliberately not wired to the real
// question/response state. The actual grounded Answer + Evidence + Source
// Viewer experience lives in the hero section above and is untouched here.

function EvidenceShowcaseSection() {
  return (
    <section className="bg-navy py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-400">
            Evidence-first answers
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Answers you can verify.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Every answer points back to the exact standard, clause, and page
            it came from — never a claim without a source.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white p-6 shadow-2xl md:p-8"
        >
          <span className="absolute right-5 top-5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Sample preview
          </span>

          <div className="grid gap-6 text-left md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-slate-500">AI Answer</p>
              <p className="mt-3 text-slate-900">
                Household electrical switches are covered under IS 3854:2007,
                Clause 4.1.
              </p>

              <div className="mt-4 rounded-md bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700">Citation</p>
                <p className="mt-1 text-sm text-slate-600">
                  IS 3854:2007 · Clause 4.1 · Page 7
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-slate-50 p-5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <p className="text-sm font-medium text-slate-500">
                  Source Document
                </p>
              </div>

              <h3 className="mt-2 font-semibold text-slate-900">
                IS 3854:2007
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Clause 4.1 · Page 7
              </p>

              <div className="mt-5 rounded-md border bg-white p-4">
                <p className="text-xs font-medium text-slate-500">
                  RELEVANT EVIDENCE
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-900">
                  The relevant requirements for switches are specified in
                  this section of the standard.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default EvidenceShowcaseSection
