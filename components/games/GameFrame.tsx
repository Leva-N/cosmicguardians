'use client'

import { useAuth } from '@/components/AuthProvider'
import Link from 'next/link'

type Props = {
  gameId: string
  gameName: string
  children: React.ReactNode
}

export function GameFrame({ gameId, gameName, children }: Props) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-white/10 bg-black/20">
        <p className="text-[var(--text-secondary)]">Загрузка...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl border border-white/10 bg-black/20 p-8">
        <p className="text-center text-[var(--text-secondary)]">
          Чтобы играть, войдите через Discord
        </p>
        <Link
          href="/api/auth/discord"
          className="rounded-lg bg-[#8A2BE2] px-6 py-3 font-semibold text-white hover:bg-[#9B4DE8]"
        >
          Войти через Discord
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
      <div className="border-b border-white/10 bg-white/5 px-4 py-2 text-sm font-medium">
        {gameName}
      </div>
      {children}
    </div>
  )
}
