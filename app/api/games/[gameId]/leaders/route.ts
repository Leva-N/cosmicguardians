import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const GAMES_DIR = path.join(process.cwd(), 'data', 'games')
const GAME_IDS = ['space-shooter','alien-invaders','meteor-dodge','galaxy-runner','planet-defense','ufo-catcher','rocket-landing','star-collector','warp-tunnel','space-mining']

function getLastMondayUTC(): Date {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  const day = d.getUTCDay()
  const diff = day === 0 ? 6 : day - 1
  d.setUTCDate(d.getUTCDate() - diff)
  return d
}

async function runWeeklyResetIfNeeded(gameId: string) {
  const metaFile = path.join(GAMES_DIR, `${gameId}.meta.json`)
  const scoresFile = path.join(GAMES_DIR, `${gameId}.json`)
  const weeklyFile = path.join(GAMES_DIR, `${gameId}.weekly.json`)

  let lastReset = ''
  try {
    const meta = JSON.parse(await fs.readFile(metaFile, 'utf8'))
    lastReset = meta.lastReset || ''
  } catch {}

  const thisMonday = getLastMondayUTC().toISOString().slice(0, 10)
  if (lastReset === thisMonday) return

  let scores: Record<string, { score: number; name: string; avatar: string | null; updatedAt: string }> = {}
  try {
    scores = JSON.parse(await fs.readFile(scoresFile, 'utf8'))
  } catch {}

  const entries = Object.entries(scores)
  const top = entries
    .sort(([, a], [, b]) => b.score - a.score)
    .slice(0, 10)
    .map(([id, d]) => ({ id, ...d }))

  let weekly: Array<{ id: string; score: number; name: string; avatar: string | null; updatedAt: string; week: string }> = []
  try {
    weekly = JSON.parse(await fs.readFile(weeklyFile, 'utf8'))
  } catch {}
  const weekLabel = lastReset || thisMonday
  weekly.push(...top.map((e) => ({ ...e, week: weekLabel })))
  await fs.writeFile(weeklyFile, JSON.stringify(weekly.slice(-100), null, 2))
  await fs.writeFile(scoresFile, '{}')
  await fs.writeFile(metaFile, JSON.stringify({ lastReset: thisMonday }))
}

type ScoreEntry = { score: number; name: string; avatar: string | null; updatedAt: string }

async function getScores(gameId: string): Promise<Record<string, ScoreEntry>> {
  const file = path.join(GAMES_DIR, `${gameId}.json`)
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'))
  } catch {
    return {}
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params
  if (!GAME_IDS.includes(gameId)) {
    return NextResponse.json({ error: 'Invalid game' }, { status: 400 })
  }

  await runWeeklyResetIfNeeded(gameId)
  const scores = await getScores(gameId)
  const entries = Object.entries(scores)
    .map(([id, d]) => ({
      id,
      score: d.score,
      name: d.name,
      avatar: d.avatar,
      updatedAt: d.updatedAt,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  return NextResponse.json(entries)
}
