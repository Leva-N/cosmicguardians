'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from './LocaleProvider'
import { LOCALES, LOCALE_NAMES, LOCALE_FLAG_COUNTRY } from '@/lib/i18n/types'
import type { Locale } from '@/lib/i18n/types'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 min-h-[40px] text-sm text-[var(--text-secondary)] hover:text-evedex-primary hover:bg-white/5 transition-all border border-white/10"
        aria-label="Language"
        aria-expanded={open}
      >
        <img
          src={`https://flagcdn.com/w40/${LOCALE_FLAG_COUNTRY[locale]}.png`}
          alt=""
          width={20}
          height={14}
          className="w-5 h-[14px] object-cover rounded-sm shrink-0"
        />
        <svg className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 py-1 min-w-[180px] rounded-xl border border-white/10 bg-[var(--bg-secondary)] shadow-xl z-50 max-h-[70vh] overflow-y-auto scrollbar-dark">
          {LOCALES.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                setLocale(loc)
                setOpen(false)
              }}
              className={`w-full text-left px-4 py-3 min-h-[44px] text-sm transition-colors flex items-center gap-2 ${
                loc === locale
                  ? 'text-evedex-primary font-medium'
                  : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
              }`}
            >
              <img
                src={`https://flagcdn.com/w40/${LOCALE_FLAG_COUNTRY[loc]}.png`}
                alt=""
                width={24}
                height={18}
                className="w-6 h-4 object-cover rounded-sm shrink-0"
              />
              <span className="flex-1 min-w-0">{LOCALE_NAMES[loc]}</span>
              {loc === locale && (
                <span className="h-2 w-2 rounded-full bg-evedex-primary shrink-0" aria-hidden />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
