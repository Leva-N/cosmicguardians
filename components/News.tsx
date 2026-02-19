'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { GOLD_MEMBER_DISCORD_IDS, MEMBER_DISCORD_IDS } from '@/components/Members'
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
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function News() {
  const { user, isLoading: authLoading } = useAuth()
  const { t, locale } = useLocale()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [text, setText] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch('/api/news')
      const data = await res.json()
      setNews(data.news || [])
    } catch {
      setNews([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError(t('news.errorImage'))
      return
    }
    if (file.size > 1_500_000) {
      setError(t('news.errorSize'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const resetModal = () => {
    setTitle('')
    setShortDescription('')
    setText('')
    setImage(null)
    setError(null)
    setModalOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !text.trim() || !image || !user) return
    if (title.trim().length < 40 || title.trim().length > 80) return
    if (shortDescription.trim() && (shortDescription.trim().length < 100 || shortDescription.trim().length > 160)) return
    if (text.trim().length > 1500) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: title.trim(),
          shortDescription: shortDescription.trim() || undefined,
          text: text.trim(),
          image,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('news.errorPublish'))
        return
      }
      resetModal()
      setNews((prev) => [data.item, ...prev])
    } catch {
      setError(t('news.errorNetwork'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    if (!confirm(t('news.deleteConfirm'))) return
    setDeletingId(id)
    setError(null)
    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE', credentials: 'include' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('news.errorPublish'))
        return
      }
      setNews((prev) => prev.filter((n) => n.id !== id))
    } catch {
      setError(t('news.errorNetwork'))
    } finally {
      setDeletingId(null)
    }
  }

  const canDelete = (item: NewsItem) => user && item.authorId && item.authorId === user.id
  const canPublish = user && (GOLD_MEMBER_DISCORD_IDS.has(user.id) || MEMBER_DISCORD_IDS.has(user.id))
  const titleValid = title.trim().length >= 40 && title.trim().length <= 80
  const shortDescValid = !shortDescription.trim() || (shortDescription.trim().length >= 100 && shortDescription.trim().length <= 160)
  const textValid = text.trim().length > 0 && text.trim().length <= 1500
  const allFilled = title.trim() && text.trim() && image && titleValid && shortDescValid && textValid

  return (
    <section className="relative py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <p className="text-[var(--text-secondary)]">{t('news.intro')}</p>
          {canPublish && !authLoading && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="shrink-0 rounded-lg bg-[#00ff00] px-3 py-1.5 text-sm font-medium text-black transition-all hover:bg-[#00dd00]"
            >
              {t('news.addNews')}
            </button>
          )}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => !submitting && resetModal()}
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-[var(--bg-secondary)] border border-white/10 p-6 shadow-xl animate-in"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="mb-6 text-xl font-bold text-[var(--text-primary)]">
                {t('news.modalTitle')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                    {t('news.fieldTitle')}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('news.fieldTitle')}
                    minLength={40}
                    maxLength={80}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 focus:border-evedex-primary/50 focus:outline-none focus:ring-2 focus:ring-evedex-primary/20"
                    disabled={submitting}
                  />
                  <span className={`mt-1 block text-xs ${title.length >= 40 && title.length <= 80 ? 'text-[var(--text-secondary)]' : 'text-amber-500'}`}>
                    {title.length} / 40–80
                  </span>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                    {t('news.fieldShortDesc')}
                  </label>
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder={`${t('news.fieldShortDesc')} (${t('news.optional')})`}
                    rows={2}
                    maxLength={160}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 focus:border-evedex-primary/50 focus:outline-none focus:ring-2 focus:ring-evedex-primary/20 resize-none"
                    disabled={submitting}
                  />
                  <span className={`mt-1 block text-xs ${!shortDescription || (shortDescription.length >= 100 && shortDescription.length <= 160) ? 'text-[var(--text-secondary)]' : 'text-amber-500'}`}>
                    {shortDescription.length} / 100–160 ({t('news.optional')})
                  </span>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                    {t('news.fieldText')}
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t('news.placeholder')}
                    rows={5}
                    maxLength={1500}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 focus:border-evedex-primary/50 focus:outline-none focus:ring-2 focus:ring-evedex-primary/20 resize-none"
                    disabled={submitting}
                  />
                  <span className={`mt-1 block text-xs ${text.length <= 1500 ? 'text-[var(--text-secondary)]' : 'text-amber-500'}`}>{text.length} / 1 500</span>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                    {t('news.fieldPhoto')}
                  </label>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-6 text-[var(--text-secondary)] hover:border-evedex-primary/50 hover:text-evedex-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                      disabled={submitting}
                    />
                    {image ? (
                      <div className="relative">
                        <img src={image} alt="" className="h-24 w-auto max-w-full rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); setImage(null); }}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <>📷 {t('news.addPhoto')}</>
                    )}
                  </label>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetModal}
                    disabled={submitting}
                    className="flex-1 rounded-xl border border-white/20 px-4 py-3 font-medium text-[var(--text-secondary)] hover:bg-white/5 disabled:opacity-50"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={!allFilled || submitting}
                    className="flex-1 rounded-xl bg-[#00ff00] px-4 py-3 font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00dd00]"
                  >
                    {submitting ? t('news.publishing') : t('news.publish')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <p className="py-8 text-center text-[var(--text-secondary)]">{t('news.loading')}</p>
          ) : news.length === 0 ? (
            <p className="py-8 text-center text-[var(--text-secondary)]">{t('news.noNews')}</p>
          ) : (
            news.map((item) => {
              const tr = item.translations?.[locale]
              const displayTitle =
                typeof tr === 'object' && tr?.title ? tr.title : item.title
              const displayDesc =
                typeof tr === 'object' && tr?.shortDescription ? tr.shortDescription : item.shortDescription
              return (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="group block rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-evedex-primary/30 hover:bg-white/[0.07] transition-all"
                >
                  <div className="flex flex-col sm:flex-row">
                    {item.image && (
                      <div className="sm:w-48 shrink-0 h-40 sm:h-auto sm:min-h-[180px]">
                        <img
                          src={item.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-4 sm:p-5">
                      <h3 className="mb-2 font-semibold text-lg text-[var(--text-primary)] group-hover:text-evedex-primary transition-colors">
                        {displayTitle}
                      </h3>
                      <p className="mb-3 text-sm text-[var(--text-secondary)] line-clamp-2">
                        {displayDesc}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                          <div className="h-6 w-6 rounded-full overflow-hidden bg-gradient-to-br from-evedex-primary/30 to-evedex-accent/30 flex items-center justify-center shrink-0">
                            {item.authorAvatar ? (
                              <img src={item.authorAvatar} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-xs font-bold text-evedex-primary">
                                {item.author?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            )}
                          </div>
                          <span className="font-medium text-evedex-achievement">{item.author}</span>
                          <span>·</span>
                          <time>{formatDate(item.createdAt, locale)}</time>
                        </div>
                        {canDelete(item) && (
                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, item.id)}
                            disabled={deletingId === item.id}
                            className="shrink-0 text-xs text-red-500/80 hover:text-red-500 disabled:opacity-50 py-1 px-2"
                          >
                            {deletingId === item.id ? '…' : t('news.delete')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
