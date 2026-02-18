export function createUfoCatcher(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  onScore: (s: number) => void,
  onGameOver: () => void
) {
  let anim = 0
  let score = 0
  const ship = { x: w / 2 - 25, vx: 0 }
  const aliens: { x: number; y: number; caught: boolean }[] = []
  const traps: { x: number; y: number }[] = []
  const keys: Record<string, boolean> = {}
  let lastAlien = 0
  let lastTrap = 0

  function loop() {
    ctx.fillStyle = '#0a0a12'
    ctx.fillRect(0, 0, w, h)
    ship.x = Math.max(30, Math.min(w - 80, ship.x + (keys['ArrowLeft'] ? -5 : keys['ArrowRight'] ? 5 : 0)))
    if (anim - lastAlien > 50) { aliens.push({ x: Math.random() * (w - 40) + 20, y: -20, caught: false }); lastAlien = anim }
    if (anim - lastTrap > 80) { traps.push({ x: Math.random() * (w - 30) + 15, y: -15 }); lastTrap = anim }
    aliens.forEach((a, i) => {
      a.y += 2
      if (!a.caught) {
        ctx.fillStyle = '#22c55e'
        ctx.beginPath()
        ctx.arc(a.x, a.y, 15, 0, Math.PI * 2)
        ctx.fill()
        if (a.x > ship.x - 10 && a.x < ship.x + 60 && a.y > h - 70) { a.caught = true; score += 10; onScore(score) }
        traps.forEach(t => { if ((a.x - t.x) ** 2 + (a.y - t.y) ** 2 < 400) onGameOver() })
      }
      if (a.y > h) aliens.splice(i, 1)
    })
    traps.forEach((t, i) => {
      t.y += 2
      ctx.fillStyle = '#ef4444'
      ctx.fillRect(t.x, t.y, 20, 20)
      if (t.y > h) traps.splice(i, 1)
    })
    ctx.fillStyle = '#818cf8'
    ctx.fillRect(ship.x, h - 60, 60, 30)
    anim = requestAnimationFrame(loop)
  }

  return {
    start: () => { score = 0; aliens.length = 0; traps.length = 0; ship.x = w / 2 - 25; lastAlien = lastTrap = 0; loop() },
    stop: () => cancelAnimationFrame(anim),
    keys: (e: KeyboardEvent, down: boolean) => { keys[e.key] = down; e.preventDefault() },
  }
}
