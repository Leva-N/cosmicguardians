'use client'

import { useEffect, useState } from 'react'

function getNextMondayUTC(): Date {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  const day = d.getUTCDay()
  const diff = day === 0 ? 7 : 8 - day
  d.setUTCDate(d.getUTCDate() + diff)
  return d
}

export function CountdownToReset() {
  const [left, setLeft] = useState<{ days: number; hours: number; minutes: number } | null>(null)

  useEffect(() => {
    const next = getNextMondayUTC()
    const update = () => {
      const ms = next.getTime() - Date.now()
      if (ms <= 0) {
        setLeft({ days: 0, hours: 0, minutes: 0 })
        return
      }
      const totalM = Math.floor(ms / 60000)
      setLeft({
        days: Math.floor(totalM / 1440),
        hours: Math.floor((totalM % 1440) / 60),
        minutes: totalM % 60,
      })
    }
    update()
    const t = setInterval(update, 60000)
    return () => clearInterval(t)
  }, [])

  if (!left) return null
  return (
    <p className="text-sm text-[var(--text-secondary)]">
      До сброса рейтинга: <span className="font-medium text-white">{left.days} дн. {left.hours} ч. {left.minutes} мин.</span>
    </p>
  )
}
