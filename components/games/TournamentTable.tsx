'use client'

import { useEffect, useState } from 'react'

type Leader = { id: string; score: number; name: string; avatar: string | null; updatedAt: string }

type Props = { gameId: string }

export function TournamentTable({ gameId }: Props) {
  const [data, setData] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/games/${gameId}/leaders`, { credentials: 'include' })
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [gameId])

  if (loading) return <p className="text-sm text-[var(--text-secondary)]">Загрузка таблицы...</p>
  if (!data.length) return <p className="text-sm text-[var(--text-secondary)]">Пока нет результатов за неделю</p>

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="px-4 py-3 text-left font-medium text-[var(--text-secondary)]">#</th>
            <th className="px-4 py-3 text-left font-medium text-[var(--text-secondary)]">Никнейм</th>
            <th className="px-4 py-3 text-right font-medium text-[var(--text-secondary)]">Очки</th>
          </tr>
        </thead>
        <tbody>
          {data.map((l, i) => (
            <tr key={l.id} className="border-b border-white/5 hover:bg-white/5">
              <td className="px-4 py-3 font-medium text-evedex-primary">{i + 1}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {l.avatar ? (
                    <img src={`https://cdn.discordapp.com/avatars/${l.id}/${l.avatar}.png?size=28`} alt="" className="h-7 w-7 rounded-full" />
                  ) : (
                    <span className="h-7 w-7 rounded-full bg-white/10" />
                  )}
                  <span className="font-medium">{l.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-amber-400">{l.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
