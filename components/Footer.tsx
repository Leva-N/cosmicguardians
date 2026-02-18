'use client'

import { useLocale } from './LocaleProvider'

export function Footer() {
  const { t } = useLocale()
  return (
    <footer className="relative border-t border-white/5 bg-[var(--bg-secondary)]/50 py-8">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  )
}
