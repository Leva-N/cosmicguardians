'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Locale } from '@/lib/i18n/types'
import { TRANSLATIONS } from '@/lib/i18n/translations'

const STORAGE_KEY = 'evedex-locale'

type TranslationKey = keyof typeof TRANSLATIONS.ru

const LocaleContext = createContext<{
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}>({
  locale: 'ru',
  setLocale: () => {},
  t: (key) => key,
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ru')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
      if (stored && TRANSLATIONS[stored]) setLocaleState(stored)
    } catch {}
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
      document.documentElement.lang = next === 'zh' ? 'zh-CN' : next === 'ar' ? 'ar' : next
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
    } catch {}
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale === 'ar' ? 'ar' : locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [mounted, locale])

  const t = useCallback(
    (key: TranslationKey): string => {
      const messages = TRANSLATIONS[locale]
      return (messages[key] ?? TRANSLATIONS.ru[key] ?? key) as string
    },
    [locale]
  )

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
