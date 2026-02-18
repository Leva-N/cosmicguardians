export function createGalaxyRunner(ctx: CanvasRenderingContext2D, w: number, h: number, onScore: (s: number) => void, onGameOver: () => void) {
  let anim = 0, score = 0, lane = 1
  const lanes = [w * 0.2, w * 0.5, w * 0.8]
  const obstacles: { lane: number; y: number }[] = []
  const keys: Record<string, boolean> = {}
  let lastSpawn = 0, speed = 4
  function loop() {
    ctx.fillStyle = '#0a0a12'
    ctx.fillRect(0, 0, w, h)
    if (keys['ArrowLeft'] && lane > 0) lane--
    if (keys['ArrowRight'] && lane < 2) lane++
    if (anim - lastSpawn > 40) { obstacles.push({ lane: Math.floor(Math.random() * 3), y: -30 }); lastSpawn = anim }
    obstacles.forEach((o, i) => {
      o.y += speed
      ctx.fillStyle = '#ef4444'
      ctx.fillRect(lanes[o.lane] - 25, o.y, 50, 40)
      if (o.y > h) { obstacles.splice(i, 1); score += 5; onScore(score); speed = Math.min(8, 4 + score / 50) }
      if (o.lane === lane && o.y + 40 > h - 80 && o.y < h - 40) onGameOver()
    })
    ctx.fillStyle = '#818cf8'
    ctx.fillRect(lanes[lane] - 20, h - 90, 40, 50)
    anim = requestAnimationFrame(loop)
  }
  return { start: () => { score = 0; obstacles.length = 0; lane = 1; speed = 4; lastSpawn = 0; loop() }, stop: () => cancelAnimationFrame(anim), keys: (e: KeyboardEvent, down: boolean) => { keys[e.key] = down; e.preventDefault() } }
}
