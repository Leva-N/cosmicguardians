import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const NEWS_FILE = path.join(DATA_DIR, 'news.json')

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

async function loadNews() {
  try {
    const data = await readFile(NEWS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveNews(items: unknown[]) {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(NEWS_FILE, JSON.stringify(items, null, 2), 'utf-8')
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(_request)
  if (!user) {
    return NextResponse.json({ error: 'Войдите через Discord' }, { status: 401 })
  }

  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'ID не указан' }, { status: 400 })
  }

  try {
    const news = await loadNews()
    const index = news.findIndex((item: { id: string; authorId?: string }) => item.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Новость не найдена' }, { status: 404 })
    }

    const item = news[index]
    if (item.authorId !== user.id) {
      return NextResponse.json({ error: 'Удалять можно только свои новости' }, { status: 403 })
    }

    news.splice(index, 1)
    await saveNews(news)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('News DELETE error:', error)
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 })
  }
}
