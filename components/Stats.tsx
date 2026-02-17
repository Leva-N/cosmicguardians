'use client'

const stats = [
  { label: 'Торговый объём (24ч)', value: '$2.4M', change: '+12%', positive: true },
  { label: 'Активных пользователей', value: '4,821', change: '+8%', positive: true },
  { label: 'Волонтёров в команде', value: '104', change: '+5', positive: true },
  { label: 'Завершённых сделок', value: '18.2K', change: '+24%', positive: true },
]

export function Stats() {
  return (
    <section id="stats" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center animate-in">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            <span className="gradient-text">Статистика биржи</span>
          </h2>
          <p className="mx-auto max-w-2xl text-[var(--text-secondary)]">
            Прозрачные данные в реальном времени
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl p-6 neon-border animate-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <p className="mb-2 text-sm text-[var(--text-secondary)]">{stat.label}</p>
              <p className="mb-1 text-2xl font-bold md:text-3xl">{stat.value}</p>
              <span className={`text-sm font-medium ${stat.positive ? 'text-evedex-achievement' : 'text-red-400'}`}>
                {stat.change}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-white/5 border border-white/10 p-8 text-center animate-in animate-in-delay-4">
          <p className="text-[var(--text-secondary)] mb-2">Визуализация в разработке</p>
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="h-24 w-full max-w-xs rounded-lg bg-gradient-to-t from-evedex-primary/20 to-transparent" />
            <div className="h-32 w-full max-w-xs rounded-lg bg-gradient-to-t from-evedex-secondary/20 to-transparent" style={{ marginTop: '1rem' }} />
            <div className="h-20 w-full max-w-xs rounded-lg bg-gradient-to-t from-evedex-accent/20 to-transparent" />
            <div className="h-28 w-full max-w-xs rounded-lg bg-gradient-to-t from-evedex-primary/20 to-transparent" style={{ marginTop: '0.5rem' }} />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Графики объёма торгов и активности — скоро
          </p>
        </div>
      </div>
    </section>
  )
}
