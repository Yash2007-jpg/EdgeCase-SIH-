import { motion } from "framer-motion"
import { Search, ShieldCheck, ArrowUpRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const capabilities = [
  {
    number: "01",
    icon: Search,
    title: "Find Standards",
    description:
      "Discover relevant Indian Standards for your product or requirement.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Verify Requirements",
    description:
      "Understand requirements using grounded evidence from relevant standards.",
  },
  {
    number: "03",
    icon: ArrowUpRight,
    title: "Take the Next Step",
    description:
      "Move from an answer to the appropriate BIS service or action.",
  },
]

function CapabilitiesSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
            What Manak Mitra does
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            What can Manak Mitra help you do?
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {capabilities.map((item, index) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full border border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-navy">
                      <item.icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                      {item.number}
                    </span>
                  </div>
                  <CardTitle className="mt-4 text-slate-900">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="mt-1 leading-6">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CapabilitiesSection
