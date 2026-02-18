import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { translateToAllLocales } from '@/lib/translate'
import type { Locale } from '@/lib/i18n/types'

const DATA_DIR = path.join(process.cwd(), 'data')
const NEWS_FILE = path.join(DATA_DIR, 'news.json')

export interface NewsItem {
  id: string
  text: string
  /** Переводы на языки сайта: locale -> текст */
  translations?: Partial<Record<Locale, string>>
  author: string
  authorId: string
  authorAvatar: string | null
  createdAt: string
  image?: string
}

async function loadNews(): Promise<NewsItem[]> {
  try {
    const data = await readFile(NEWS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveNews(items: NewsItem[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(NEWS_FILE, JSON.stringify(items, null, 2), 'utf-8')
}

function getUserFromRequest(request: NextRequest): { username: string; avatar: string | null; id: string } | null {
  const discordUser = request.cookies.get('discord_user')?.value
  if (!discordUser) return null
  try {
    const user = JSON.parse(discordUser)
    const username = user.global_name || user.username || 'Anonymous'
    const avatar = user.avatar || null
    const id = user.id || ''
    return { username, avatar, id }
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const news = await loadNews()
    return NextResponse.json({ news: news.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) })
  } catch (error) {
    console.error('News GET error:', error)
    return NextResponse.json({ news: [] })
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Войдите через Discord, чтобы публиковать новости' }, { status: 401 })
  }

  let body: { text?: string; image?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Некорректный JSON' }, { status: 400 })
  }

  const text = typeof body.text === 'string' ? body.text.trim() : ''
  if (!text || text.length > 10000) {
    return NextResponse.json({ error: 'Текст новости обязателен (макс. 10 000 символов)' }, { status: 400 })
  }

  let image: string | undefined
  if (typeof body.image === 'string' && body.image.startsWith('data:image/')) {
    if (body.image.length > 2_000_000) {
      return NextResponse.json({ error: 'Изображение слишком большое (макс. ~1.5 МБ)' }, { status: 400 })
    }
    image = body.image
  }

  try {
    const news = await loadNews()
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const authorAvatar = user.avatar && user.id
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : null

    const item: NewsItem = {
      id,
      text,
      author: user.username,
      authorId: user.id,
      authorAvatar,
      createdAt,
      ...(image && { image }),
    }

    try {
      const translations = await translateToAllLocales(text)
      if (Object.keys(translations).length > 0) {
        item.translations = translations
      }
    } catch (translateErr) {
      console.warn('News translation skipped:', translateErr)
    }

    news.unshift(item)
    await saveNews(news)
    return NextResponse.json({ ok: true, item })
  } catch (error) {
    console.error('News POST error:', error)
    return NextResponse.json(
      { error: 'Не удалось сохранить новость. Проверьте настройки хранения (data/news.json).' },
      { status: 500 }
    )
  }
}
