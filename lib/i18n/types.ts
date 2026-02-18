export const LOCALES = ['en', 'ru', 'uk', 'lv', 'es', 'fr', 'ar', 'zh', 'ja', 'de'] as const
export type Locale = (typeof LOCALES)[number]

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  uk: 'Українська',
  lv: 'Latviešu',
  es: 'Español',
  fr: 'Français',
  ar: 'العربية',
  zh: '中文',
  ja: '日本語',
  de: 'Deutsch',
}

