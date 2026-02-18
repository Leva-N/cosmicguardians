'use client'

import { useEffect, useState } from 'react'

type Leader = { id: string; score: number; name: string; avatar: string | null; updatedAt: string }

type Props = {
  gameId: string
  tab?: 'current' | 'weekly' | 'my'
}

export function Leaderboard({ gameId, tab = 'current' }: Props) {
  const [data, setData] = useState<Leader[]>([])
  const [myRecord, setMyRecord] = useState<{ score: number; updatedAt: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (tab === 'my') {
      fetch(`/api/games/${gameId}/my`, { credentials: 'include' })
        .then((r) => r.json())
        .then((d) => {
          setMyRecord(d.record)
          setData([])
        })
        .finally(() => setLoading(false))
    } else if (tab === 'weekly') {
      fetch(`/api/games/${gameId}/weekly`, { credentials: 'include' })
        .then((r) => r.json())
        .then(setData)
        .finally(() => setLoading(false))
    } else {
      fetch(`/api/games/${gameId}/leaders`, { credentials: 'include' })
        .then((r) => r.json())
        .then(setData)
        .finally(() => setLoading(false))
    }
  }, [gameId, tab])

  if (loading) return <p className="text-xs text-[var(--text-secondary)]">Загрузка...</p>
  if (tab === 'my') {
    return myRecord ? (
      <div className="text-sm">
        <p><span className="text-[var(--text-secondary)]">Ваш рекорд:</span> <strong>{myRecord.score}</strong></p>
        <p className="text-xs text-[var(--text-secondary)]">{new Date(myRecord.updatedAt).toLocaleDateString('ru')}</p>
      </div>
    ) : (
      <p className="text-xs text-[var(--text-secondary)]">Нет рекордов</p>
    )
  }
  if (!data.length) return <p className="text-xs text-[var(--text-secondary)]">Пока нет рекордов</p>
  return (
    <ul className="space-y-2">
      {data.map((l, i) => (
        <li key={l.id} className="flex items-center gap-2 text-sm">
          <span className="w-5 font-medium text-evedex-primary">{i + 1}.</span>
          {l.avatar ? (
            <img src={`https://cdn.discordapp.com/avatars/${l.id}/${l.avatar}.png?size=24`} alt="" className="h-6 w-6 rounded-full" />
          ) : (
            <span className="h-6 w-6 rounded-full bg-white/10" />
          )}
          <span className="flex-1 truncate">{l.name}</span>
          <span className="font-semibold text-amber-400">{l.score}</span>
        </li>
      ))}
    </ul>
  )
}
