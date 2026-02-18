export function createMeteorDodge(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  onScore: (s: number) => void,
  onGameOver: () => void
) {
  let anim = 0
  let score = 0
  const player = { x: w / 2 - 15, y: h - 50, vx: 0 }
  const meteors: { x: number; y: number; r: number }[] = []
  const keys: Record<string, boolean> = {}
  let lastSpawn = 0

  function loop() {
    ctx.fillStyle = '#0a0a12'
    ctx.fillRect(0, 0, w, h)
    player.x = Math.max(20, Math.min(w - 50, player.x + (keys['ArrowLeft'] ? -6 : keys['ArrowRight'] ? 6 : 0)))
    if (anim - lastSpawn > 25) { meteors.push({ x: Math.random() * (w - 60) + 30, y: -20, r: 15 + Math.random() * 15 }); lastSpawn = anim; score += 1; onScore(score) }
    meteors.forEach((m, i) => {
      m.y += 3 + score / 100
      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
      ctx.fill()
      if (m.y > h) meteors.splice(i, 1)
      const dx = player.x + 15 - m.x, dy = player.y + 25 - m.y
      if (dx * dx + dy * dy < (m.r + 20) ** 2) onGameOver()
    })
    ctx.fillStyle = '#22c55e'
    ctx.fillRect(player.x, player.y, 30, 50)
    anim = requestAnimationFrame(loop)
  }

  return {
    start: () => { score = 0; meteors.length = 0; player.x = w / 2 - 15; lastSpawn = 0; loop() },
    stop: () => cancelAnimationFrame(anim),
    keys: (e: KeyboardEvent, down: boolean) => { keys[e.key] = down; e.preventDefault() },
  }
}
