export function createAlienInvaders(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  onScore: (s: number) => void,
  onGameOver: () => void
) {
  let anim = 0
  let score = 0
  const ship = { x: w / 2 - 20, vx: 0 }
  const bullets: { x: number; y: number }[] = []
  let aliens: { x: number; y: number }[] = []
  const keys: Record<string, boolean> = {}
  let lastShot = -99
  let dir = 1
  for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) aliens.push({ x: 40 + c * 45, y: 40 + r * 35 })
  const shoot = () => bullets.push({ x: ship.x + 18, y: h - 60 })

  function loop() {
    ctx.fillStyle = '#0a0a12'
    ctx.fillRect(0, 0, w, h)
    ship.x = Math.max(20, Math.min(w - 60, ship.x + (keys['ArrowLeft'] ? -6 : keys['ArrowRight'] ? 6 : 0)))
    if (keys[' '] && anim - lastShot > 15) { shoot(); lastShot = anim }
    bullets.forEach((b, i) => {
      b.y -= 10
      ctx.fillStyle = '#22c55e'
      ctx.fillRect(b.x, b.y, 6, 12)
      aliens.forEach((a, j) => {
        if (b.x > a.x - 15 && b.x < a.x + 15 && b.y > a.y - 10 && b.y < a.y + 20) { aliens.splice(j, 1); bullets.splice(i, 1); score += 20 }
      })
      if (b.y < 0) bullets.splice(i, 1)
    })
    if (anim % 20 === 0) aliens.forEach(a => { a.x += dir * 8 })
    if (aliens.some(a => a.x < 20 || a.x > w - 40)) dir *= -1
    aliens.forEach(a => {
      a.y += 0.2
      ctx.fillStyle = '#ef4444'
      ctx.fillRect(a.x - 12, a.y - 8, 24, 16)
      if (a.y + 8 > h - 70) onGameOver()
    })
    ctx.fillStyle = '#8A2BE2'
    ctx.fillRect(ship.x, h - 60, 40, 20)
    if (aliens.length === 0) { score += 500; onScore(score); onGameOver() }
    anim = requestAnimationFrame(loop)
  }

  return {
    start: () => { score = 0; aliens = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) aliens.push({ x: 40 + c * 45, y: 40 + r * 35 }); bullets.length = 0; dir = 1; loop() },
    stop: () => cancelAnimationFrame(anim),
    keys: (e: KeyboardEvent, down: boolean) => { keys[e.key] = down; e.preventDefault() },
  }
}
