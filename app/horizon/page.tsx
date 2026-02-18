'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/AuthProvider'
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
        setError(data.error || 'Ошибка публикации')
        return
      }
      setCards((prev) => [data.card, ...prev])
    } catch {
      setError('Ошибка сети')
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
        setError(data.error || 'Ошибка удаления')
        return
      }
      setCards((prev) => prev.filter((c) => c.id !== id))
    } catch {
      setError('Ошибка сети')
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

        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="mb-16 text-center animate-in">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              <span className="gradient-text">Горизонт Событий</span>
            </h1>
            <p className="mx-auto max-w-2xl text-[var(--text-secondary)]">
              Бесконечная стена участников Cosmic Guardians. Подключите Discord и оставьте свою карточку — один раз, навсегда.
            </p>
          </div>

          {!authLoading && (
            <div className="mb-12 flex flex-col items-center gap-4 animate-in animate-in-delay-1">
              {!user ? (
                <Link
                  href="/api/auth/discord"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#5865F2] px-6 py-3 font-semibold text-white transition-all hover:bg-[#4752C4]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.105 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.105c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                  </svg>
                  Подключить Discord, чтобы оставить карточку
                </Link>
              ) : hasUserCard ? (
                <p className="text-[var(--text-secondary)] text-sm">
                  Ваша карточка на стене. Вы можете удалить её и опубликовать заново.
                </p>
              ) : (
                <button
                  onClick={handlePublish}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-evedex-primary to-evedex-accent px-6 py-3 font-semibold text-white shadow-neon transition-all hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Публикация...' : 'Оставить свою карточку'}
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
              <p className="py-20 text-center text-[var(--text-secondary)]">Загрузка стены...</p>
            ) : cards.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-[var(--text-secondary)] mb-2">Стена пока пуста</p>
                <p className="text-sm text-[var(--text-secondary)]/80">
                  Станьте первым — подключите Discord и оставьте свою карточку
                </p>
              </div>
            ) : (
              <div
                className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                style={{ animation: 'fadeIn 0.5s ease-out' }}
              >
                {cards.map((card, i) => (
                  <div
                    key={card.id}
                    className="glass-card group rounded-2xl p-6 flex flex-col items-center text-center animate-in relative"
                    style={{ animationDelay: `${Math.min(i * 0.05, 1)}s` }}
                  >
                    {canDelete(card) && (
                      <button
                        type="button"
                        onClick={() => handleDelete(card.id)}
                        disabled={deletingId === card.id}
                        className="absolute top-3 right-3 rounded-lg p-1.5 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        title="Удалить карточку"
                        aria-label="Удалить карточку"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                    <div className="mb-4 h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-evedex-primary/30 ring-2 ring-evedex-primary/10 transition-all group-hover:ring-evedex-primary/30">
                      {card.avatar ? (
                        <img
                          src={card.avatar}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-evedex-primary/30 to-evedex-accent/30 flex items-center justify-center">
                          <span className="text-3xl font-bold text-evedex-primary">
                            {card.nickname?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-[var(--text-primary)] truncate w-full">
                      {card.nickname}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Astronaut
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
