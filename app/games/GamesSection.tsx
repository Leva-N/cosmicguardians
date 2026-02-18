'use client'

import Link from 'next/link'
import { GAMES_LIST } from '@/data/games/list'
import { useLocale } from '@/components/LocaleProvider'

export function GamesSection() {
  const { t } = useLocale()
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {GAMES_LIST.map((g) => (
        <Link
          key={g.id}
          href={`/games/play/${g.id}`}
          className="glass-card group flex flex-col items-start gap-3 rounded-2xl p-4 sm:p-5 md:p-6 text-left transition-all hover:border-evedex-primary/30 hover:shadow-lg min-h-[120px]"
        >
          <span className="text-4xl opacity-90">{g.icon}</span>
          <div>
            <h2 className="text-lg font-semibold">{g.name}</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{g.desc}</p>
          </div>
          <span className="mt-auto text-sm font-medium text-evedex-primary">{t('games.play')} →</span>
        </Link>
      ))}
    </div>
  )
}
