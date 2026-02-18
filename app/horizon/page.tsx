'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useLocale } from '@/components/LocaleProvider'
import Link from 'next/link'

interface HorizonCard {
  id: string
  userId: string
  nickname: string
  avatar: string | null
  createdAt: string
}

export default function HorizonPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { t } = useLocale()
  const [cards, setCards] = useState<HorizonCard[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchCards = useCallback(async () => {
    try {
      const res = await fetch('/api/horizon')
      const data = await res.json()
      setCards(data.cards || [])
    } catch {
      setCards([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  const hasUserCard = user ? cards.some((c) => c.userId === user.id) : false

  const handlePublish = async () => {
    if (!user) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/horizon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('horizon.errorPublish'))
        return
      }
      setCards((prev) => [data.card, ...prev])
    } catch {
      setError(t('horizon.errorNetwork'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user) return
    setDeletingId(id)
    setError(null)
    try {
      const res = await fetch(`/api/horizon/${id}`, { method: 'DELETE', credentials: 'include' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('horizon.errorDelete'))
        return
      }
      setCards((prev) => prev.filter((c) => c.id !== id))
    } catch {
      setError(t('horizon.errorNetwork'))
    } finally {
      setDeletingId(null)
    }
  }

  const canDelete = (card: HorizonCard) => user && card.userId === user.id

  return (
    <>
      <section className="relative min-h-screen overflow-hidden">
        {/* Фон бесконечной стены — повторяющаяся сетка */}
        <div
          className="absolute inset-0 grid-pattern opacity-40"
          style={{
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-primary)]/80 to-[var(--bg-primary)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-24">
          <div className="mb-10 sm:mb-16 text-center animate-in">
            <h1 className="mb-4 text-2xl sm:text-3xl font-bold md:text-4xl">
              <span className="gradient-text">{t('horizon.title')}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-[var(--text-secondary)]">
              {t('horizon.subtitle')}
            </p>
          </div>

          {!authLoading && (
            <div className="mb-12 flex flex-col items-center gap-4 animate-in animate-in-delay-1">
              {!user ? (
                <Link
                  href="/api/auth/discord"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#8A2BE2] px-6 py-3 font-semibold text-white transition-all hover:bg-[#9B4DE8]"
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.105 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.105c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  {t('horizon.connectToLeave')}
                </Link>
              ) : hasUserCard ? (
                <p className="text-[var(--text-secondary)] text-sm">
                  {t('horizon.yourCardOnWall')}
                </p>
              ) : (
                <button
                  onClick={handlePublish}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-evedex-primary to-evedex-accent px-6 py-3 font-semibold text-white shadow-neon transition-all hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? t('news.publishing') : t('horizon.leaveCard')}
                </button>
              )}
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>
          )}

          {/* Бесконечная стена карточек — masonry-подобная сетка */}
          <div className="relative">
            {loading ? (
              <p className="py-20 text-center text-[var(--text-secondary)]">{t('horizon.loadingWall')}</p>
            ) : cards.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-[var(--text-secondary)] mb-2">{t('horizon.wallEmpty')}</p>
                <p className="text-sm text-[var(--text-secondary)]/80">
                  {t('horizon.beFirst')}
                </p>
              </div>
            ) : (
              <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 justify-items-center"
                style={{ animation: 'fadeIn 0.5s ease-out' }}
              >
                {cards.map((card, i) => (
                  <div
                    key={card.id}
                    className="star-card group flex flex-col items-center justify-center animate-in relative"
                    style={{
                      animationDelay: `${Math.min(i * 0.05, 1)}s`,
                      backgroundImage: card.avatar ? `url(${card.avatar})` : undefined,
                    }}
                  >
                    {canDelete(card) && (
                      <button
                        type="button"
                        onClick={() => handleDelete(card.id)}
                        disabled={deletingId === card.id}
                        className="absolute top-1 right-1 sm:top-2 sm:right-2 rounded-lg p-1.5 sm:p-2 min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center bg-black/50 text-white hover:bg-red-500/80 hover:text-white transition-colors disabled:opacity-50 z-10 border border-white/20"
                        title={t('horizon.deleteCard')}
                        aria-label={t('horizon.deleteCard')}
                      >
                        <svg className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}

                    {/* Ник по центру звезды */}
                    <p className="relative z-[1] font-semibold text-white text-center text-xs sm:text-sm md:text-base px-2 truncate max-w-full drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                      {card.nickname || 'Anonymous'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
