'use client'

import { useLocale } from './LocaleProvider'

const valueKeys = [
  { icon: '◈', titleKey: 'mission.transparency' as const, descKey: 'mission.transparencyDesc' as const },
  { icon: '◇', titleKey: 'mission.trust' as const, descKey: 'mission.trustDesc' as const },
  { icon: '○', titleKey: 'mission.contribution' as const, descKey: 'mission.contributionDesc' as const },
]

export function Mission() {
  const { t } = useLocale()
  return (
    <section id="mission" className="relative py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 sm:mb-16 text-center animate-in">
          <h2 className="mb-4 text-2xl sm:text-3xl font-bold md:text-4xl">
            <span className="gradient-text">{t('mission.title')}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-[var(--text-secondary)]">
            {t('mission.subtitle')}
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {valueKeys.map((item, i) => (
            <div
              key={item.titleKey}
              className={`glass-card group rounded-2xl p-5 sm:p-6 md:p-8 animate-in ${i === 0 ? 'animate-in-delay-1' : i === 1 ? 'animate-in-delay-2' : 'animate-in-delay-3'}`}
            >
              <div className="mb-4 text-3xl font-bold text-evedex-primary opacity-80 group-hover:opacity-100 transition-opacity">
                {item.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{t(item.titleKey)}</h3>
              <p className="text-[var(--text-secondary)]">{t(item.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
