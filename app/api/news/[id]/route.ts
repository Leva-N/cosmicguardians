import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import type { NewsItem } from '../route'

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

function normalizeItem(raw: Record<string, unknown>): NewsItem {
  const item = raw as Partial<NewsItem> & Record<string, unknown>
  const text = typeof item.text === 'string' ? item.text : ''
  return {
    id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
    title: typeof item.title === 'string' ? item.title : text.slice(0, 80) || 'Новость',
    shortDescription:
      typeof item.shortDescription === 'string' ? item.shortDescription : text.slice(0, 200) || text,
    text,
    translations: item.translations as NewsItem['translations'],
    author: typeof item.author === 'string' ? item.author : 'Anonymous',
    authorId: typeof item.authorId === 'string' ? item.authorId : '',
    authorAvatar: item.authorAvatar ?? null,
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
    image: typeof item.image === 'string' ? item.image : undefined,
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'ID не указан' }, { status: 400 })
  }
  try {
    const news = await loadNews()
    const raw = news.find((item: { id: string }) => item.id === id)
    if (!raw) {
      return NextResponse.json({ error: 'Новость не найдена' }, { status: 404 })
    }
    return NextResponse.json({ item: normalizeItem(raw as Record<string, unknown>) })
  } catch (error) {
    console.error('News GET [id] error:', error)
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 })
  }
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
