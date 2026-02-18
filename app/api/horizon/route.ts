import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const HORIZON_FILE = path.join(DATA_DIR, 'horizon.json')

export interface HorizonCard {
  id: string
  userId: string
  nickname: string
  avatar: string | null
  createdAt: string
}

async function loadCards(): Promise<HorizonCard[]> {
  try {
    const data = await readFile(HORIZON_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveCards(cards: HorizonCard[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(HORIZON_FILE, JSON.stringify(cards, null, 2), 'utf-8')
}

function getUserFromRequest(request: NextRequest): { id: string; nickname: string; avatar: string | null; discriminator: string } | null {
  const discordUser = request.cookies.get('discord_user')?.value
  if (!discordUser) return null
  try {
    const user = JSON.parse(discordUser)
    const nickname = user.global_name || user.username || 'Anonymous'
    return {
      id: user.id || '',
      nickname,
      avatar: user.avatar || null,
      discriminator: user.discriminator || '0',
    }
  } catch {
    return null
  }
}

const MAX_STARS = 5000

export async function GET() {
  try {
    const cards = await loadCards()
    const sorted = cards.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return NextResponse.json({ cards: sorted.slice(0, MAX_STARS) })
  } catch (error) {
    console.error('Horizon GET error:', error)
    return NextResponse.json({ cards: [] })
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Подключите Discord, чтобы оставить свою карточку' }, { status: 401 })
  }

  try {
    const cards = await loadCards()
    if (cards.length >= MAX_STARS) {
      return NextResponse.json({ error: 'Стена достигла максимального количества звёзд (5000).' }, { status: 400 })
    }
    const existingIndex = cards.findIndex((c) => c.userId === user.id)
    if (existingIndex !== -1) {
      return NextResponse.json({ error: 'Вы уже опубликовали свою карточку. Каждый пользователь может оставить карточку только один раз.' }, { status: 400 })
    }

    const avatarUrl = user.avatar && user.id
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
      : `https://cdn.discordapp.com/embed/avatars/${(parseInt(user.discriminator, 10) || 0) % 5}.png`

    const card: HorizonCard = {
      id: crypto.randomUUID(),
      userId: user.id,
      nickname: user.nickname,
      avatar: avatarUrl,
      createdAt: new Date().toISOString(),
    }
    cards.unshift(card)
    await saveCards(cards)
    return NextResponse.json({ ok: true, card })
  } catch (error) {
    console.error('Horizon POST error:', error)
    return NextResponse.json(
      { error: 'Не удалось сохранить карточку.' },
      { status: 500 }
    )
  }
}
