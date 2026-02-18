export function createSpaceMining(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  onScore: (s: number) => void,
  onGameOver: () => void
) {
  let anim = 0
  let score = 0
  const ship = { x: w / 2 - 25, y: h - 60, vx: 0 }
  const asteroids: { x: number; y: number; r: number; value: number }[] = []
  const keys: Record<string, boolean> = {}
  let lastSpawn = 0
  let fuel = 100
  let fuelTick = 0

  function loop() {
    ctx.fillStyle = '#0a0a12'
    ctx.fillRect(0, 0, w, h)
    ship.x = Math.max(20, Math.min(w - 70, ship.x + (keys['ArrowLeft'] ? -4 : keys['ArrowRight'] ? 4 : 0)))
    fuelTick++
    if (fuelTick > 30) { fuel = Math.max(0, fuel - 0.5); fuelTick = 0 }
    if (fuel <= 0) onGameOver()
    if (anim - lastSpawn > 40) { asteroids.push({ x: Math.random() * (w - 80) + 40, y: -30, r: 15 + Math.random() * 15, value: 5 + Math.floor(Math.random() * 15) }); lastSpawn = anim }
    asteroids.forEach((a, i) => {
      a.y += 1.5
      ctx.fillStyle = '#78716c'
      ctx.beginPath()
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2)
      ctx.fill()
      if (a.y > h) asteroids.splice(i, 1)
      if (a.x - a.r < ship.x + 50 && a.x + a.r > ship.x && a.y + a.r > ship.y && a.y - a.r < ship.y + 40) {
        asteroids.splice(i, 1)
        score += a.value
        onScore(score)
        fuel = Math.min(100, fuel + 5)
      }
    })
    ctx.fillStyle = '#818cf8'
    ctx.fillRect(ship.x, ship.y, 50, 40)
    ctx.fillStyle = '#22c55e'
    ctx.fillRect(10, 10, fuel * 2, 10)
    ctx.strokeStyle = '#333'
    ctx.strokeRect(10, 10, 200, 10)
    anim = requestAnimationFrame(loop)
  }

  return {
    start: () => { score = 0; asteroids.length = 0; ship.x = w / 2 - 25; fuel = 100; lastSpawn = 0; loop() },
    stop: () => cancelAnimationFrame(anim),
    keys: (e: KeyboardEvent, down: boolean) => { keys[e.key] = down; e.preventDefault() },
  }
}
