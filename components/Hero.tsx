'use client'

import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-evedex-primary/15 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-evedex-accent/12 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-block rounded-full border border-evedex-primary/40 bg-evedex-primary/10 px-4 py-1.5 text-sm font-medium text-evedex-primary">
            Волонтёрское сообщество
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="gradient-text">Сообщество</span>
          <br />
          <span className="text-[var(--text-primary)]">которым гордимся</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg text-[var(--text-secondary)] md:text-xl"
        >
          Cosmic Guardians — это волонтёры, где каждый участник вносит вклад в развитие DEX EVEDEX. Прозрачность, доверие и энергия сообщества — наш фундамент.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="/about"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-evedex-primary to-evedex-accent px-6 py-3 font-semibold text-white shadow-neon transition-all hover:scale-105 hover:shadow-glow"
          >
            Присоединиться
          </a>
          <a
            href="/about#stats"
            className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-[var(--text-primary)] transition-all hover:border-evedex-primary/50 hover:bg-evedex-primary/10"
          >
            Смотреть статистику
          </a>
        </motion.div>
      </div>
    </section>
  )
}
