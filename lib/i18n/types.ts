export const LOCALES = ['en', 'ru', 'uk', 'lv', 'es', 'fr', 'ar', 'zh', 'ja', 'de', 'tr'] as const
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
  tr: 'Türkçe',
}

/** Коды стран для отображения флагов (ISO 3166-1 alpha-2) */
export const LOCALE_FLAG_COUNTRY: Record<Locale, string> = {
  en: 'gb',
  ru: 'ru',
  uk: 'ua',
  lv: 'lv',
  es: 'es',
  fr: 'fr',
  ar: 'sa',
  zh: 'cn',
  ja: 'jp',
  de: 'de',
  tr: 'tr',
}

