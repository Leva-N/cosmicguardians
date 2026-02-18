export function createRocketLanding(ctx: CanvasRenderingContext2D, w: number, h: number, onScore: (s: number) => void, onGameOver: () => void) {
  const rocket = { x: w / 2 - 15, y: 50, vx: 0, vy: 0 }
  const platform = { x: w / 2 - 50, y: h - 40, w: 100 }
  const keys: Record<string, boolean> = {}
  const maxV = 8
  function loop() {
    ctx.fillStyle = '#0a0a12'
    ctx.fillRect(0, 0, w, h)
    if (keys['ArrowLeft']) rocket.vx = Math.max(-maxV, rocket.vx - 0.3)
    if (keys['ArrowRight']) rocket.vx = Math.min(maxV, rocket.vx + 0.3)
    if (keys['ArrowUp']) rocket.vy = Math.max(-maxV, rocket.vy - 0.3)
    rocket.vy += 0.1
    rocket.x += rocket.vx
    rocket.y += rocket.vy
    if (rocket.x < 10 || rocket.x > w - 40) onGameOver()
    if (rocket.y + 50 > platform.y && rocket.y < platform.y + 20 && rocket.x + 30 > platform.x && rocket.x < platform.x + platform.w) {
      if (Math.abs(rocket.vx) < 2 && rocket.vy < 3) { onScore(Math.max(100, Math.round(1000 - rocket.vy * 100))); onGameOver() }
      else onGameOver()
    }
    if (rocket.y > h) onGameOver()
    ctx.fillStyle = '#22c55e'
    ctx.fillRect(platform.x, platform.y, platform.w, 20)
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(rocket.x, rocket.y, 30, 50)
    requestAnimationFrame(loop)
  }
  return { start: () => { rocket.x = w / 2 - 15; rocket.y = 50; rocket.vx = 0; rocket.vy = 0; loop() }, stop: () => {}, keys: (e: KeyboardEvent, down: boolean) => { keys[e.key] = down; e.preventDefault() } }
}
