'use client'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-evedex-primary/15 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-evedex-accent/12 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <div className="mb-6 animate-in">
          <span className="inline-block rounded-full border border-evedex-primary/40 bg-evedex-primary/10 px-4 py-1.5 text-sm font-medium text-evedex-primary">
            Волонтёрское сообщество
          </span>
        </div>

        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-in animate-in-delay-1">
          <span className="gradient-text">Сообщество</span>
          <br />
          <span className="text-[var(--text-primary)]">которым гордимся</span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-[var(--text-secondary)] md:text-xl animate-in animate-in-delay-2">
          Cosmic Guardians — это волонтёры, где каждый участник вносит вклад в развитие DEX EVEDEX. Прозрачность, доверие и энергия сообщества — наш фундамент.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-in animate-in-delay-3">
          <a
            href="/about"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-evedex-primary to-evedex-accent px-6 py-3 font-semibold text-white shadow-neon transition-all hover:scale-105 hover:shadow-glow"
          >
            Присоединиться
          </a>
        </div>
      </div>
    </section>
  )
}
