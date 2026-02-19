import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { isAdmin } from '@/lib/admin-ids'

const DATA_DIR = path.join(process.cwd(), 'data')
const HORIZON_FILE = path.join(DATA_DIR, 'horizon.json')

function getUserFromRequest(request: NextRequest): { id: string } | null {
  const discordUser = request.cookies.get('discord_user')?.value
  if (!discordUser) return null
  try {
    const user = JSON.parse(discordUser)
    const id = user.id || ''
    return id ? { id } : null
  } catch {
    return null
  }
}

async function loadCards() {
  try {
    const data = await readFile(HORIZON_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveCards(cards: unknown[]) {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(HORIZON_FILE, JSON.stringify(cards, null, 2), 'utf-8')
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(_request)
  if (!user) {
    return NextResponse.json({ error: 'Подключите Discord' }, { status: 401 })
  }

  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'ID не указан' }, { status: 400 })
  }

  try {
    const cards = await loadCards()
    const index = cards.findIndex((c: { id: string; userId: string }) => c.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Карточка не найдена' }, { status: 404 })
    }

    const card = cards[index]
    if (card.userId !== user.id && !isAdmin(user.id)) {
      return NextResponse.json({ error: 'Удалять можно только свою карточку' }, { status: 403 })
    }

    cards.splice(index, 1)
    await saveCards(cards)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Horizon DELETE error:', error)
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 })
  }
}
