import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const GAMES_DIR = path.join(process.cwd(), 'data', 'games')
const GAME_IDS = ['space-shooter','alien-invaders','meteor-dodge','galaxy-runner','planet-defense','ufo-catcher','rocket-landing','star-collector','warp-tunnel','space-mining']

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params
  if (!GAME_IDS.includes(gameId)) {
    return NextResponse.json({ error: 'Invalid game' }, { status: 400 })
  }

  const file = path.join(GAMES_DIR, `${gameId}.weekly.json`)
  let data: Array<{ id: string; score: number; name: string; avatar: string | null; updatedAt: string; week: string }> = []
  try {
    data = JSON.parse(await fs.readFile(file, 'utf8'))
  } catch {}

  const { searchParams } = new URL(req.url)
  const week = searchParams.get('week') || ''
  const filtered = week ? data.filter((r) => r.week === week) : data.slice(-10)
  const sorted = [...filtered].sort((a, b) => b.score - a.score).slice(0, 10)
  return NextResponse.json(sorted)
}
