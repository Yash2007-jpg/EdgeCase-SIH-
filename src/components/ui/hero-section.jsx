function HeroSection() {
  return (
    <div className="text-center">
      <div className="mb-5 flex items-center justify-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          AI-powered standards assistant
        </p>
        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
      </div>

      <h2 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
        Understand Indian Standards.
        <br />
        <span className="text-slate-500">
          Act with confidence.
        </span>
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
        Get grounded answers about BIS standards, certification, and
        compliance — with evidence you can verify.
      </p>
    </div>
  )
}

export default HeroSection