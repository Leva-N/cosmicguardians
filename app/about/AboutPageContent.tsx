'use client'

import { useLocale } from '@/components/LocaleProvider'

const featureKeys = [
  { titleKey: 'about.noHotWallets' as const, descKey: 'about.noHotWalletsDesc' as const },
  { titleKey: 'about.instantTrade' as const, descKey: 'about.instantTradeDesc' as const },
  { titleKey: 'about.lowFees' as const, descKey: 'about.lowFeesDesc' as const },
  { titleKey: 'about.cashback' as const, descKey: 'about.cashbackDesc' as const },
  { titleKey: 'about.affiliate' as const, descKey: 'about.affiliateDesc' as const },
]

const linkKeys = [
  { labelKey: 'about.startTrading' as const, href: 'https://evedex.com/ru-RU/', primary: true },
  { labelKey: 'about.whitepaper' as const, href: 'https://evedex.com/ru-RU/' },
  { labelKey: 'about.blog' as const, href: 'https://evedex.com/ru-RU/' },
  { labelKey: 'about.contracts' as const, href: 'https://evedex.com/ru-RU/' },
  { labelKey: 'about.jobs' as const, href: 'https://evedex.com/ru-RU/' },
  { labelKey: 'about.faq' as const, href: 'https://evedex.com/ru-RU/' },
]

export function AboutPageContent() {
  const { t } = useLocale()
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-16 text-center animate-in">
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

        <div className="mb-16">
          <h2 className="mb-8 text-xl font-semibold">{t('about.unifiedDex')}</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {featureKeys.map((item, i) => (
              <div
                key={item.titleKey}
                className={`glass-card rounded-2xl p-6 animate-in ${i < 2 ? 'animate-in-delay-1' : i < 4 ? 'animate-in-delay-2' : 'animate-in-delay-3'}`}
              >
                <h3 className="mb-2 font-semibold">{t(item.titleKey)}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-in animate-in-delay-4">
          <h2 className="mb-6 text-xl font-semibold">{t('about.links')}</h2>
          <div className="flex flex-wrap gap-3">
            {linkKeys.map((link) =>
              link.primary ? (
                <a
                  key={link.labelKey}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-evedex-primary to-evedex-accent px-6 py-3 font-semibold text-white shadow-neon transition-all hover:shadow-glow"
                >
                  {t(link.labelKey)}
                </a>
              ) : (
                <a
                  key={link.labelKey}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/5 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-evedex-primary hover:bg-evedex-primary/10 transition-colors"
                >
                  {t(link.labelKey)}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
