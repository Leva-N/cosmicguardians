/**
 * Перевод текста через MyMemory API (бесплатно, без ключа, лимит ~1000 слов/день).
 * Для продакшена можно добавить LIBRETRANSLATE_API_URL в .env и использовать LibreTranslate.
 */
import type { Locale } from '@/lib/i18n/types'
import { LOCALES } from '@/lib/i18n/types'

const MYMEMORY_LANG: Record<Locale, string> = {
  en: 'en',
  ru: 'ru',
  uk: 'uk',
  lv: 'lv',
  es: 'es',
  fr: 'fr',
  ar: 'ar',
  zh: 'zh-CN',
  ja: 'ja',
  de: 'de',
}

const MAX_TEXT_LENGTH = 3000
const REQUEST_DELAY_MS = 300

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

/**
 * Переводит текст на целевой язык. Источник определяется автоматически (auto).
 */
export async function translateToLocale(
  text: string,
  targetLocale: Locale
): Promise<string | null> {
  if (!text || text.length > MAX_TEXT_LENGTH) return null
  const target = MYMEMORY_LANG[targetLocale]
  const encoded = encodeURIComponent(text.slice(0, MAX_TEXT_LENGTH))
  const url = `https://api.mymemory.translated.net/get?q=${encoded}&langpair=auto|${target}`

  try {
    const res = await fetch(url, { next: { revalidate: 0 } })
    const data = await res.json()
    const translated = data?.responseData?.translatedText
    if (typeof translated === 'string' && translated.trim()) return translated.trim()
  } catch {
    // ignore
  }
  return null
}

/**
 * Переводит текст на все доступные языки. Возвращает объект locale -> переведённый текст.
 * Оригинал сохраняется под ключом первого подходящего перевода или оставляется как fallback.
 */
export async function translateToAllLocales(
  originalText: string
): Promise<Partial<Record<Locale, string>>> {
  const result: Partial<Record<Locale, string>> = {}

  for (const locale of LOCALES) {
    const translated = await translateToLocale(originalText, locale)
    if (translated) result[locale] = translated
    await delay(REQUEST_DELAY_MS)
  }

  return result
}
