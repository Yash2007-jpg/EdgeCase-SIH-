import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

function FinalCtaSection({ onAskClick }) {
  return (
    <section className="bg-slate-50 py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Ready to check an Indian Standard?
          </h2>

          <p className="mt-3 text-base leading-7 text-slate-600">
            Ask Manak Mitra and get an evidence-first answer.
          </p>

          <Button
            type="button"
            className="mt-8 rounded-xl px-6"
            onClick={onAskClick}
          >
            Ask Manak Mitra
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default FinalCtaSection
