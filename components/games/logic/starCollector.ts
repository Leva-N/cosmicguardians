export function createStarCollector(ctx: CanvasRenderingContext2D, w: number, h: number, onScore: (s: number) => void, onGameOver: () => void) {
  let anim = 0, score = 0
  const ship: { x: number; y: number } = { x: w / 2 - 15, y: h / 2 - 25 }
  const stars: { x: number; y: number }[] = []
  const holes: { x: number; y: number; r: number }[] = []
  const keys: Record<string, boolean> = {}
  let lastStar = 0, lastHole = 0
  function loop() {
    ctx.fillStyle = '#0a0a12'
    ctx.fillRect(0, 0, w, h)
    ship.x = Math.max(20, Math.min(w - 50, ship.x + (keys['ArrowLeft'] ? -4 : keys['ArrowRight'] ? 4 : 0)))
    ship.y = Math.max(20, Math.min(h - 70, ship.y + (keys['ArrowUp'] ? -4 : keys['ArrowDown'] ? 4 : 0)))
    if (anim - lastStar > 60) { stars.push({ x: Math.random() * (w - 60) + 30, y: Math.random() * (h - 100) + 50 }); lastStar = anim }
    if (anim - lastHole > 90) { holes.push({ x: Math.random() * (w - 40) + 20, y: Math.random() * (h - 80) + 40, r: 25 }); lastHole = anim }
    stars.forEach((s, i) => {
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      for (let k = 0; k < 5; k++) ctx.lineTo(s.x + 12 * Math.cos(k * 1.26), s.y + 12 * Math.sin(k * 1.26))
      ctx.closePath()
      ctx.fill()
      if (Math.abs(ship.x + 15 - s.x) < 25 && Math.abs(ship.y + 25 - s.y) < 35) { stars.splice(i, 1); score += 10; onScore(score) }
    })
    holes.forEach(h => {
      ctx.fillStyle = '#1f2937'
      ctx.beginPath()
      ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2)
      ctx.fill()
      const dx = ship.x + 15 - h.x, dy = ship.y + 25 - h.y
      if (dx * dx + dy * dy < (h.r + 20) ** 2) onGameOver()
    })
    ctx.fillStyle = '#8A2BE2'
    ctx.fillRect(ship.x, ship.y, 30, 50)
    anim = requestAnimationFrame(loop)
  }
  return { start: () => { score = 0; stars.length = 0; holes.length = 0; ship.x = w / 2 - 15; ship.y = h / 2 - 25; lastStar = lastHole = 0; loop() }, stop: () => cancelAnimationFrame(anim), keys: (e: KeyboardEvent, down: boolean) => { keys[e.key] = down; e.preventDefault() } }
}
