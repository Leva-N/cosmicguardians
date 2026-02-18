'use client'

import { useLocale } from '@/components/LocaleProvider'

const OFFICIAL_LINKS = [
  { labelKey: 'about.linkWebsite' as const, href: 'https://evedex.com/' },
  { labelKey: 'about.linkX' as const, href: 'https://x.com/evedex' },
  { labelKey: 'about.linkTelegram' as const, href: 'https://t.me/OfficialEveDex' },
  { labelKey: 'about.linkDiscord' as const, href: 'https://discord.com/invite/evedex' },
  { labelKey: 'about.linkYouTube' as const, href: 'https://www.youtube.com/@EVEDEX' },
  {
    labelKey: 'about.linkWhitepaper' as const,
    href: 'https://docs.evedex.com/?_gl=1*1o8kfzx*_gcl_au*NTY4ODAyMzA2LjE3Njk5OTU1NDM.*_ga*MTQ5NDYwNTExOS4xNzY5OTk1NTQz*_ga_DMJF0EW1TP*czE3NzE0NDczOTEkbzEwOCRnMSR0MTc3MTQ1MDMzOSRqNjAkbDAkaDA.',
  },
]

export function AboutPageContent() {
  const { t } = useLocale()
  return (
    <section className="relative py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-12 text-center animate-in">
          <h1 className="mb-6 text-3xl font-bold md:text-4xl">
            <span className="gradient-text">{t('about.title')}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[var(--text-secondary)] mb-4">
            {t('about.subtitle')}
          </p>
          <p className="mx-auto max-w-2xl text-[var(--text-secondary)]">
            {t('about.subtitle2')}
          </p>
        </div>

        <div className="animate-in animate-in-delay-1">
          <h2 className="mb-4 text-lg font-semibold text-center">
            {t('about.links')}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {OFFICIAL_LINKS.map((link) => (
              <a
                key={link.labelKey}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 min-h-[44px] text-sm font-medium text-[var(--text-secondary)] hover:text-evedex-primary hover:border-evedex-primary/30 hover:bg-evedex-primary/10 transition-colors"
              >
                {t(link.labelKey)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
