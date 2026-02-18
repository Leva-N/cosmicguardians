'use client'

import Link from 'next/link'
import { useLocale } from '@/components/LocaleProvider'
import { GamePageClient } from './GamePageClient'

type Game = { id: string; name: string; desc: string; icon: string; about: string }

export function GamePageInner({ game }: { game: Game }) {
  const { t } = useLocale()
  return (
    <section className="relative py-8">
      <div className="mx-auto max-w-4xl px-6">
        <Link
          href="/games"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('games.allGames')}
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{game.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{game.name}</h1>
              <p className="mt-1 text-[var(--text-secondary)]">{game.desc}</p>
            </div>
          </div>
        </header>

        <div className="mb-6 rounded-xl border border-white/10 bg-black/20 p-6">
          <h2 className="mb-2 text-lg font-semibold">{t('games.about')}</h2>
          <p className="text-[var(--text-secondary)]">{game.about}</p>
        </div>

        <GamePageClient gameId={game.id} gameName={game.name} />
      </div>
    </section>
  )
}
