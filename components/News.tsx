'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useLocale } from '@/components/LocaleProvider'

interface NewsItem {
  id: string
  text: string
  author: string
  authorId?: string
  authorAvatar: string | null
  createdAt: string
  image?: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function News() {
  const { user, isLoading: authLoading } = useAuth()
  const { t } = useLocale()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !user) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: text.trim(), ...(image && { image }) }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('news.errorPublish'))
        return
      }
      setText('')
      setImage(null)
      setNews((prev) => [data.item, ...prev])
    } catch {
      setError(t('news.errorNetwork'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user) return
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

  return (
    <section className="relative py-12 md:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <p className="text-[var(--text-secondary)]">{t('news.intro')}</p>
        </div>

        {user && !authLoading && (
          <form onSubmit={handleSubmit} className="mb-10 animate-in">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('news.placeholder')}
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 focus:border-evedex-primary/50 focus:outline-none focus:ring-2 focus:ring-evedex-primary/20"
              maxLength={10000}
              disabled={submitting}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <label className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text-secondary)] hover:border-evedex-primary/50 hover:text-evedex-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                    disabled={submitting}
                  />
                  📷 {t('news.addPhoto')}
                </label>
                {image && (
                  <div className="relative inline-block">
                    <img src={image} alt="" className="h-20 w-20 rounded-lg object-cover border border-white/10" />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-secondary)]">
                  {text.length} / 10 000
                </span>
                <button
                  type="submit"
                  disabled={!text.trim() || submitting}
                  className="rounded-lg bg-gradient-to-r from-evedex-primary to-evedex-accent px-5 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? t('news.publishing') : t('news.publish')}
                </button>
              </div>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </form>
        )}

        <div className="space-y-0 divide-y divide-white/5">
          {loading ? (
            <p className="py-8 text-center text-[var(--text-secondary)]">{t('news.loading')}</p>
          ) : news.length === 0 ? (
            <p className="py-8 text-center text-[var(--text-secondary)]">{t('news.noNews')}</p>
          ) : (
            news.map((item) => (
              <article key={item.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex gap-3">
                  <div className="mt-1 h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-evedex-primary/30 to-evedex-accent/30 flex items-center justify-center">
                    {item.authorAvatar ? (
                      <img
                        src={item.authorAvatar}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-evedex-primary">
                        {item.author?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-xs text-[var(--text-secondary)]">
                        <span className="text-sm font-semibold text-evedex-achievement">{item.author}</span>
                        {' · '}
                        {formatDate(item.createdAt)}
                      </p>
                      {canDelete(item) && (
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="shrink-0 text-xs text-red-500/80 hover:text-red-500 disabled:opacity-50"
                        >
                          {deletingId === item.id ? '…' : t('news.delete')}
                        </button>
                      )}
                    </div>
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        className="mb-3 rounded-xl max-w-full max-h-80 object-contain"
                      />
                    )}
                    <p className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                      {item.text}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
