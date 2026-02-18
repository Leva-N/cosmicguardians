'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
type Phase = 'start' | 'playing' | 'over'

type Props = {
  gameId: string
  gameName: string
  width?: number
  height?: number
  runGame: (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    onScore: (s: number) => void,
    onGameOver: () => void
  ) => { start: () => void; stop: () => void; keys: (e: KeyboardEvent, down: boolean) => void }
}

export function GameCanvas({ gameId, gameName, width = 400, height = 600, runGame }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<ReturnType<typeof runGame> | null>(null)
  const [phase, setPhase] = useState<Phase>('start')
  const [score, setScore] = useState(0)

  const handleScore = useCallback((s: number) => setScore(s), [])
  const handleGameOver = useCallback(() => {
    gameRef.current?.stop()
    setPhase('over')
  }, [])

  // Canvas всегда в DOM, чтобы ref был доступен при первом эффекте
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    gameRef.current = runGame(ctx, width, height, handleScore, handleGameOver)
    return () => {
      gameRef.current?.stop()
      gameRef.current = null
    }
  }, [runGame, width, height, handleScore, handleGameOver])

  useEffect(() => {
    const k = (e: KeyboardEvent, down: boolean) => gameRef.current?.keys(e, down)
    const down = (e: KeyboardEvent) => k(e, true)
    const up = (e: KeyboardEvent) => k(e, false)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  const start = () => {
    setScore(0)
    setPhase('playing')
    setTimeout(() => gameRef.current?.start(), 50)
  }

  const submitScore = async () => {
    const res = await fetch(`/api/games/${gameId}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ score }),
    })
    if (res.ok) {
      const data = await res.json()
      if (data.updated) alert('Результат отправлен!')
    } else {
      alert('Ошибка отправки')
    }
  }

  return (
    <div className="relative flex justify-center bg-[#0a0a12] p-4" style={{ minHeight: height + 32 }}>
      <canvas ref={canvasRef} width={width} height={height} className="border border-white/10" />
      {phase === 'start' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#0a0a12]/95 p-4 sm:p-8">
          <p className="text-[var(--text-secondary)]">Нажмите чтобы начать</p>
          <button
            onClick={start}
            className="rounded-lg bg-evedex-primary px-8 py-3 min-h-[44px] font-semibold text-white hover:opacity-90"
          >
            Играть
          </button>
        </div>
      )}
      {phase === 'over' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#0a0a12]/95 p-4 sm:p-8">
          <h3 className="text-xl font-bold text-red-400">Game Over</h3>
          <p className="text-lg">Счёт: {score}</p>
          <div className="flex gap-3">
            <button
              onClick={submitScore}
              className="rounded-lg border border-evedex-primary px-6 py-3 min-h-[44px] text-sm font-medium text-evedex-primary hover:bg-evedex-primary/10"
            >
              Отправить результат
            </button>
            <button
              onClick={start}
              className="rounded-lg bg-evedex-primary px-6 py-3 min-h-[44px] text-sm font-semibold text-white hover:opacity-90"
            >
              Играть снова
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
