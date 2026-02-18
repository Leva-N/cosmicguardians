'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from './LocaleProvider'

export function Footer() {
  const { t } = useLocale()
  return (
    <footer className="relative border-t border-white/[0.06] bg-[var(--bg-secondary)]/60 backdrop-blur-sm mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <Image
              src="/images/hello2.png"
              alt="Cosmic Guardians"
              width={28}
              height={28}
              className="h-7 w-7 object-contain rounded-md opacity-90"
            />
            <span className="font-display text-sm font-semibold text-[var(--text-primary)]">
              Cosmic Guardians
            </span>
          </Link>
          <p className="text-sm text-[var(--text-secondary)]/90 font-medium">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
