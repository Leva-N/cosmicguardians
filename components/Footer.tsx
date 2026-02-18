'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from './LocaleProvider'

export function Footer() {
  const { t } = useLocale()
  return (
    <footer className="relative border-t border-white/[0.04] bg-transparent mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <Link href="/" className="flex items-center gap-1.5 w-fit">
            <Image
              src="/images/hello2.png"
              alt="Cosmic Guardians"
              width={20}
              height={20}
              className="h-5 w-5 object-contain rounded-md opacity-90"
            />
            <span className="font-display text-xs font-semibold text-[var(--text-primary)]">
              Cosmic Guardians
            </span>
          </Link>
          <p className="text-xs text-[var(--text-secondary)]/80 font-medium">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
