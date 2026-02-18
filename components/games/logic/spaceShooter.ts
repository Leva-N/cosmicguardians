export function createSpaceShooter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  onScore: (s: number) => void,
  onGameOver: () => void
) {
  let anim = 0
  let score = 0
  const ship = { x: w / 2 - 15, y: h - 50, vx: 0 }
  const bullets: { x: number; y: number }[] = []
  const rocks: { x: number; y: number; r: number }[] = []
  const keys: Record<string, boolean> = {}
  let lastSpawn = 0
  let lastShot = -99
  const shoot = () => bullets.push({ x: ship.x + 12, y: ship.y })
  const coll = (a: { x: number; y: number; r?: number }, b: { x: number; y: number; r?: number }, ar = 0, br = 0) => {
    const r = (ar || 10) + (br || 10)
    return (a.x - b.x) ** 2 + (a.y - b.y) ** 2 < r * r
  }

  function loop() {
    ctx.fillStyle = '#0a0a12'
    ctx.fillRect(0, 0, w, h)
    if (keys['ArrowLeft']) ship.vx = -5
    else if (keys['ArrowRight']) ship.vx = 5
    else ship.vx = 0
    ship.x = Math.max(10, Math.min(w - 40, ship.x + ship.vx))
    if (keys[' '] && anim - lastShot > 12) { shoot(); lastShot = anim }
    rocks.forEach((r, i) => {
      r.y += 2
      ctx.fillStyle = '#666'
      ctx.beginPath()
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2)
      ctx.fill()
      if (r.y > h) rocks.splice(i, 1)
      if (coll(ship, r, 15, r.r)) onGameOver()
      bullets.forEach((b, j) => {
        if (coll(b, r, 2, r.r)) { rocks.splice(i, 1); bullets.splice(j, 1); score += 10; onScore(score) }
      })
    })
    if (anim - lastSpawn > 30) { rocks.push({ x: Math.random() * (w - 40) + 20, y: -20, r: 12 + Math.random() * 10 }); lastSpawn = anim }
    bullets.forEach((b, i) => {
      b.y -= 8
      ctx.fillStyle = '#8A2BE2'
      ctx.fillRect(b.x, b.y, 4, 8)
      if (b.y < 0) bullets.splice(i, 1)
    })
    ctx.fillStyle = '#8A2BE2'
    ctx.beginPath()
    ctx.moveTo(ship.x + 15, ship.y)
    ctx.lineTo(ship.x + 30, ship.y + 40)
    ctx.lineTo(ship.x + 15, ship.y + 32)
    ctx.lineTo(ship.x, ship.y + 40)
    ctx.closePath()
    ctx.fill()
    anim = requestAnimationFrame(loop)
  }

  return {
    start: () => { score = 0; onScore(0); bullets.length = 0; rocks.length = 0; ship.x = w / 2 - 15; lastSpawn = 0; loop() },
    stop: () => cancelAnimationFrame(anim),
    keys: (e: KeyboardEvent, down: boolean) => { keys[e.key] = down; e.preventDefault() },
  }
}
