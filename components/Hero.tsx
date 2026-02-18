'use client'

import { useLocale } from './LocaleProvider'

export function Hero() {
  const { t } = useLocale()
  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <div className="mb-6 animate-in">
          <span className="inline-block rounded-full border border-evedex-primary/40 bg-evedex-primary/10 px-4 py-1.5 text-sm font-medium text-evedex-primary">
            {t('hero.badge')}
          </span>
        </div>

        <h1 className="mb-6 text-3xl sm:text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl animate-in animate-in-delay-1">
          <span className="gradient-text">{t('hero.title1')}</span>
          <br />
          <span className="text-[var(--text-primary)]">{t('hero.title2')}</span>
        </h1>

        <p className="mx-auto max-w-2xl text-base sm:text-lg text-[var(--text-secondary)] md:text-xl px-2 animate-in animate-in-delay-2">
          {t('hero.subtitle')}
        </p>
      </div>
    </section>
  )
}
