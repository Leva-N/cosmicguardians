'use client'

import { useLocale } from '@/components/LocaleProvider'

export function ArticlesPageContent() {
  const { t } = useLocale()
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">
          <span className="gradient-text">{t('articles.title')}</span>
        </h1>
        <p className="text-[var(--text-secondary)]">
          {t('articles.subtitle')}
        </p>
      </div>
    </section>
  )
}
