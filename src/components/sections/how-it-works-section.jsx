import { motion } from "framer-motion"
import { MessageCircleQuestion, FileSearch, MoveRight, ArrowRight, ArrowDown } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: MessageCircleQuestion,
    title: "Ask",
    description: "Describe your product, requirement, or BIS question.",
  },
  {
    number: "02",
    icon: FileSearch,
    title: "Verify",
    description: "See the relevant standard and supporting evidence.",
  },
  {
    number: "03",
    icon: MoveRight,
    title: "Act",
    description: "Move toward the appropriate next action.",
  },
]

function HowItWorksSection() {
  return (
    <section className="bg-slate-100 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            From question to verified answer.
          </h2>
        </motion.div>

        <div className="mt-14 flex flex-col md:flex-row md:items-start">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-1 flex-col md:flex-row md:items-start">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-1 text-left"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white">
                  <step.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>

                <p className="mt-4 text-xs font-semibold tracking-[0.14em] text-slate-400">
                  {step.number}
                </p>

                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </motion.div>

              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="my-4 flex items-center justify-center text-slate-300 md:mx-6 md:my-0 md:pt-4"
                >
                  <ArrowRight className="hidden h-5 w-5 md:block" />
                  <ArrowDown className="h-5 w-5 md:hidden" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
