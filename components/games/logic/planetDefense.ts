export function createPlanetDefense(ctx: CanvasRenderingContext2D, w: number, h: number, onScore: (s: number) => void, onGameOver: () => void) {
  let anim = 0, score = 0
  const cx = w / 2, cy = h - 80, planetR = 50
  const bullets: { angle: number; dist: number }[] = []
  const rocks: { angle: number; dist: number; r: number }[] = []
  let gunAngle = -Math.PI / 2
  const keys: Record<string, boolean> = {}
  let lastSpawn = 0
  let lastShot = -99
  function loop() {
    ctx.fillStyle = '#0a0a12'
    ctx.fillRect(0, 0, w, h)
    if (keys['ArrowLeft']) gunAngle -= 0.08
    if (keys['ArrowRight']) gunAngle += 0.08
    if (keys[' '] && anim - lastShot > 10) { bullets.push({ angle: gunAngle, dist: planetR }); lastShot = anim }
    if (anim - lastSpawn > 35) { rocks.push({ angle: Math.random() * Math.PI * 2, dist: Math.min(w, h) + 50, r: 15 }); lastSpawn = anim }
    rocks.forEach((r, i) => {
      r.dist -= 2
      const x = cx + Math.cos(r.angle) * r.dist, y = cy + Math.sin(r.angle) * r.dist
      ctx.fillStyle = '#78716c'
      ctx.beginPath()
      ctx.arc(x, y, r.r, 0, Math.PI * 2)
      ctx.fill()
      if (r.dist < planetR + r.r) onGameOver()
      bullets.forEach((b, j) => {
        const bx = cx + Math.cos(b.angle) * b.dist, by = cy + Math.sin(b.angle) * b.dist
        if ((bx - x) ** 2 + (by - y) ** 2 < (r.r + 5) ** 2) { rocks.splice(i, 1); bullets.splice(j, 1); score += 15 }
      })
    })
    bullets.forEach((b, i) => {
      b.dist += 12
      if (b.dist > Math.max(w, h)) bullets.splice(i, 1)
      ctx.strokeStyle = '#8A2BE2'
      ctx.beginPath()
      ctx.arc(cx + Math.cos(b.angle) * b.dist, cy + Math.sin(b.angle) * b.dist, 3, 0, Math.PI * 2)
      ctx.stroke()
    })
    ctx.fillStyle = '#8A2BE2'
    ctx.beginPath()
    ctx.arc(cx, cy, planetR, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#9B4DE8'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(gunAngle) * 60, cy + Math.sin(gunAngle) * 60)
    ctx.stroke()
    anim = requestAnimationFrame(loop)
  }
  return { start: () => { score = 0; bullets.length = 0; rocks.length = 0; gunAngle = -Math.PI / 2; lastSpawn = 0; loop() }, stop: () => cancelAnimationFrame(anim), keys: (e: KeyboardEvent, down: boolean) => { keys[e.key] = down; e.preventDefault() } }
}
