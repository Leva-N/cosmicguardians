'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { ADMIN_DISCORD_IDS } from '@/components/Members'
import { useLocale } from '@/components/LocaleProvider'
import type { Locale } from '@/lib/i18n/types'

interface NewsItem {
  id: string
  title: string
  shortDescription: string
  text: string
  translations?: Partial<Record<Locale, { title?: string; shortDescription?: string; text?: string }>>
  author: string
  authorId?: string
  authorAvatar: string | null
  createdAt: string
  image?: string
}

const LOCALE_TO_BCP47: Record<Locale, string> = {
  en: 'en-GB',
  ru: 'ru-RU',
  uk: 'uk-UA',
  lv: 'lv-LV',
  es: 'es-ES',
  fr: 'fr-FR',
  ar: 'ar-SA',
  zh: 'zh-CN',
  ja: 'ja-JP',
  de: 'de-DE',
  tr: 'tr-TR',
}

function formatDate(iso: string, locale: Locale) {
  const d = new Date(iso)
  return d.toLocaleDateString(LOCALE_TO_BCP47[locale] || 'ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function NewsDetail({ id }: { id: string }) {
  const { user } = useAuth()
  const { t, locale } = useLocale()
  const [item, setItem] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/news/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data.item || null))
      .catch(() => setItem(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!user || !item) return
    if (!ADMIN_DISCORD_IDS.has(user.id) && item.authorId !== user.id) return
    if (!confirm(t('news.deleteConfirm'))) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE', credentials: 'include' })
      if (res.ok) {
        window.location.href = '/news'
      }
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <section className="relative py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="py-20 text-center text-[var(--text-secondary)]">{t('news.loading')}</p>
        </div>
      </section>
    )
  }

  if (!item) {
    return (
      <section className="relative py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <p className="mb-6 text-[var(--text-secondary)]">Новость не найдена</p>
          <Link href="/news" className="text-evedex-primary hover:underline">
            ← Назад к новостям
          </Link>
        </div>
      </section>
    )
  }

  const tr = item.translations?.[locale]
  const title = typeof tr === 'object' && tr?.title ? tr.title : item.title
  const shortDescription =
    typeof tr === 'object' && tr?.shortDescription ? tr.shortDescription : item.shortDescription
  const text = typeof tr === 'object' && tr?.text ? tr.text : (typeof tr === 'string' ? tr : item.text)
  const canDelete = user && (ADMIN_DISCORD_IDS.has(user.id) || (item.authorId && item.authorId === user.id))

  return (
    <section className="relative py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link href="/news" className="mb-8 inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-evedex-primary transition-colors">
          ← {t('header.nav.news')}
        </Link>

        <article>
          <h1 className="mb-4 text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            {title}
          </h1>
          <div className="mb-6 flex items-center gap-3 text-sm text-[var(--text-secondary)]">
            <div className="h-9 w-9 rounded-full overflow-hidden bg-gradient-to-br from-evedex-primary/30 to-evedex-accent/30 flex items-center justify-center shrink-0">
              {item.authorAvatar ? (
                <img src={item.authorAvatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-evedex-primary">
                  {item.author?.charAt(0)?.toUpperCase() || '?'}
                </span>
              )}
            </div>
            <span className="font-semibold text-evedex-achievement">{item.author}</span>
            <span>·</span>
            <time dateTime={item.createdAt}>{formatDate(item.createdAt, locale)}</time>
            {canDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="ml-auto text-red-500/80 hover:text-red-500 text-xs disabled:opacity-50"
              >
                {deleting ? '…' : t('news.delete')}
              </button>
            )}
          </div>

          {item.image && (
            <img
              src={item.image}
              alt=""
              className="mb-6 w-full rounded-xl max-h-[400px] object-cover"
            />
          )}

          <div className="prose prose-invert max-w-none">
            <p className="text-[var(--text-secondary)] text-lg mb-6">{shortDescription}</p>
            <div className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
              {text}
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
