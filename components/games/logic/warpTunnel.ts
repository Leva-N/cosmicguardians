export function createWarpTunnel(ctx: CanvasRenderingContext2D, w: number, h: number, onScore: (s: number) => void, onGameOver: () => void) {
  let anim = 0, score = 0, lane = 1
  const lanes = [w * 0.25, w * 0.5, w * 0.75]
  const obstacles: { lane: number; y: number }[] = []
  const keys: Record<string, boolean> = {}
  let lastSpawn = 0, speed = 5
  function loop() {
    ctx.fillStyle = '#0a0a12'
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 20; i++) {
      const t = (anim * 0.02 + i * 0.3) % 1
      ctx.strokeStyle = `rgba(99,102,241,${0.3 - t * 0.2})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(w / 2 - w * t * 0.3, 0)
      ctx.lineTo(w / 2 - w * t * 0.3, h)
      ctx.moveTo(w / 2 + w * t * 0.3, 0)
      ctx.lineTo(w / 2 + w * t * 0.3, h)
      ctx.stroke()
    }
    if (keys['ArrowLeft'] && lane > 0) lane--
    if (keys['ArrowRight'] && lane < 2) lane++
    if (anim - lastSpawn > 30) { obstacles.push({ lane: Math.floor(Math.random() * 3), y: -40 }); lastSpawn = anim }
    obstacles.forEach((o, i) => {
      o.y += speed
      ctx.fillStyle = '#ef4444'
      ctx.fillRect(lanes[o.lane] - 30, o.y, 60, 50)
      if (o.y > h) { obstacles.splice(i, 1); score += 8; onScore(score); speed = Math.min(10, 5 + score / 40) }
      if (o.lane === lane && o.y + 50 > h - 70 && o.y < h - 20) onGameOver()
    })
    ctx.fillStyle = '#8A2BE2'
    ctx.fillRect(lanes[lane] - 25, h - 80, 50, 60)
    anim = requestAnimationFrame(loop)
  }
  return { start: () => { score = 0; obstacles.length = 0; lane = 1; speed = 5; lastSpawn = 0; loop() }, stop: () => cancelAnimationFrame(anim), keys: (e: KeyboardEvent, down: boolean) => { keys[e.key] = down; e.preventDefault() } }
}
