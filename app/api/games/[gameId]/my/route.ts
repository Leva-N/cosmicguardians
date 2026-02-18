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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params
  if (!GAME_IDS.includes(gameId)) {
    return NextResponse.json({ error: 'Invalid game' }, { status: 400 })
  }

  const user = getCookieUser(req)
  if (!user?.id) {
    return NextResponse.json({ record: null })
  }

  const file = path.join(GAMES_DIR, `${gameId}.json`)
  let scores: Record<string, { score: number; name: string; avatar: string | null; updatedAt: string }> = {}
  try {
    scores = JSON.parse(await fs.readFile(file, 'utf8'))
  } catch {}

  const record = scores[user.id]
  return NextResponse.json(record ? { record } : { record: null })
}
