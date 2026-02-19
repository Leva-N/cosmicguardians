'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Script from 'next/script'
import { useLocale } from '@/components/LocaleProvider'

const MAX_DISPLAY = 50

interface ApiPost {
  id: string
  url: string
  xUsername: string
  xUserId: string
  createdAt: string
}

interface ParsedPost {
  url: string
  username: string
}

function parsePostUrl(input: string): ParsedPost | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  // x.com/username/status/ID или twitter.com/username/status/ID (username не должен быть "i")
  const match = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/([^/]+)\/status\/(\d+)/
  )
  if (!match || match[1] === 'i') return null
  const username = match[1]
  const id = match[2]
  return { url: `https://twitter.com/${username}/status/${id}`, username }
}

/** Нормализует URL для embed — twitter.com лучше поддерживается виджетами X */
function normalizeForDisplay(url: string): string {
  const m = url.match(/(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/([^/]+)\/status\/(\d+)/)
  if (m) return `https://twitter.com/${m[1]}/status/${m[2]}`
  const m2 = url.match(/(?:https?:\/\/)?(?:www\.)?x\.com\/i\/status\/(\d+)/)
  if (m2) return `https://twitter.com/i/status/${m2[1]}` // старый формат
  return url
}

export interface TranslatorPostsProps {
  xUser?: { id: string; username: string } | null
}

export function TranslatorPosts({ xUser = null }: TranslatorPostsProps) {
  const { t } = useLocale()
  const [posts, setPosts] = useState<ApiPost[]>([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const feedRef = useRef<HTMLDivElement>(null)

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/translator/posts')
      const data = await res.json()
      setPosts(Array.isArray(data.posts) ? data.posts : [])
    } catch {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    if (posts.length === 0) return
    const twttr = (window as unknown as { twttr?: { widgets?: { load: (el?: HTMLElement) => void } } }).twttr
    const load = twttr?.widgets?.load
    if (load) {
      const timer = setTimeout(() => {
        load(feedRef.current ?? undefined)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [posts])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!xUser) {
      setError(t('translator.errorConnectFirst'))
      return
    }
    const parsed = parsePostUrl(input)
    if (!parsed) {
      setError(t('translator.errorInvalidLink'))
      return
    }
    if (parsed.username.toLowerCase() !== xUser.username.toLowerCase()) {
      setError(t('translator.errorNotYourPost').replace('{username}', xUser.username))
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/translator/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ url: input.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? t('translator.errorInvalidLink'))
        return
      }
      if (data.post) {
        setPosts((prev) => [data.post, ...prev])
        setInput('')
      }
    } catch {
      setError(t('news.errorNetwork'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (post: ApiPost) => {
    if (!xUser || post.xUserId !== xUser.id) return
    try {
      const res = await fetch(`/api/translator/posts/${post.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id))
      }
    } catch {
      // ignore
    }
  }

  const displayPosts = posts.slice(0, MAX_DISPLAY)

  return (
    <>
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== 'undefined') {
            const twttr = (window as unknown as { twttr?: { widgets?: { load: (el?: HTMLElement) => void } } }).twttr
            if (twttr?.widgets?.load) {
              requestAnimationFrame(() => {
                setTimeout(() => twttr.widgets!.load(feedRef.current ?? undefined), 150)
              })
            }
          }
        }}
      />
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <form onSubmit={handleAdd} className="mb-8">
          {!xUser && (
            <p className="mb-3 text-sm text-[var(--text-secondary)]">
              {t('translator.errorConnectFirst')}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              disabled={!xUser}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setError(null)
              }}
              placeholder={t('translator.linkPlaceholder')}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 focus:border-evedex-primary/50 focus:outline-none focus:ring-2 focus:ring-evedex-primary/20"
            />
            <button
              type="submit"
              disabled={!xUser || submitting}
              className="shrink-0 rounded-xl bg-[#00ff00] px-5 py-3 font-semibold text-black transition-all hover:bg-[#00dd00] disabled:opacity-50"
            >
              {submitting ? t('news.publishing') : t('translator.addPost')}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </form>

        <div ref={feedRef} className="space-y-6">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-[var(--text-secondary)]">{t('news.loading')}</p>
            </div>
          ) : displayPosts.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-[var(--text-secondary)]">{t('translator.noPosts')}</p>
            </div>
          ) : (
            displayPosts.map((post) => (
              <div key={post.id} className="relative group">
                <div className="[&_.twitter-tweet]:!max-w-full [&_.twitter-tweet]:!mx-auto">
                  <blockquote className="twitter-tweet" data-dnt="true" data-theme="dark">
                    <a href={normalizeForDisplay(post.url)}>Post from X</a>
                  </blockquote>
                </div>
                {xUser && post.xUserId === xUser.id && (
                  <button
                    type="button"
                    onClick={() => handleDelete(post)}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 rounded-lg p-2 min-h-[36px] min-w-[36px] flex items-center justify-center bg-black/70 text-white/90 hover:text-red-500 hover:bg-red-500/20 transition-colors"
                    title={t('translator.deletePost')}
                    aria-label={t('translator.deletePost')}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {!loading && displayPosts.length > 0 && posts.length > MAX_DISPLAY && (
          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            {t('translator.showingLatest')}
          </p>
        )}
      </div>
    </>
  )
}
