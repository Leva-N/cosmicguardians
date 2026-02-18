import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const GAMES_DIR = path.join(process.cwd(), 'data', 'games')
const GAME_IDS = ['space-shooter','alien-invaders','meteor-dodge','galaxy-runner','planet-defense','ufo-catcher','rocket-landing','star-collector','warp-tunnel','space-mining']

function getCookieUser(req: NextRequest) {
  const v = req.cookies.get('discord_user')?.value
  if (!v) return null
  try { return JSON.parse(v) } catch { return null }
}

async function getScores(gameId: string): Promise<Record<string, { score: number; name: string; avatar: string | null; updatedAt: string }>> {
  const file = path.join(GAMES_DIR, `${gameId}.json`)
  try {
    const data = await fs.readFile(file, 'utf8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

async function saveScores(gameId: string, scores: Record<string, { score: number; name: string; avatar: string | null; updatedAt: string }>) {
  const file = path.join(GAMES_DIR, `${gameId}.json`)
  await fs.writeFile(file, JSON.stringify(scores, null, 2))
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params
  if (!GAME_IDS.includes(gameId)) {
    return NextResponse.json({ error: 'Invalid game' }, { status: 400 })
  }

  const user = getCookieUser(req)
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { score: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const score = Number(body?.score)
  if (!Number.isFinite(score) || score < 0) {
    return NextResponse.json({ error: 'Invalid score' }, { status: 400 })
  }

  const scores = await getScores(gameId)
  const existing = scores[user.id]
  if (existing && existing.score >= score) {
    return NextResponse.json({ ok: true, updated: false })
  }

  const name = (user.global_name || user.username || '').slice(0, 50)
  const avatar = user.avatar ?? null
  scores[user.id] = { score, name, avatar, updatedAt: new Date().toISOString() }
  await saveScores(gameId, scores)
  return NextResponse.json({ ok: true, updated: true })
}
