'use client'

import { useLocale } from '@/components/LocaleProvider'
import { GamesSection } from './GamesSection'

export function GamesPageContent() {
  const { t } = useLocale()
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center animate-in">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">
            <span className="gradient-text">{t('games.title')}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-[var(--text-secondary)]">
            {t('games.subtitle')}
          </p>
        </div>
        <GamesSection />
      </div>
    </section>
  )
}
