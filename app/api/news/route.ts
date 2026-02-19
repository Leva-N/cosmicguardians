import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { canPublishContent } from '@/lib/can-publish'
import { translateToAllLocales } from '@/lib/translate'
import { LOCALES, type Locale } from '@/lib/i18n/types'

const DATA_DIR = path.join(process.cwd(), 'data')
const NEWS_FILE = path.join(DATA_DIR, 'news.json')

export interface NewsItem {
  id: string
  title: string
  shortDescription: string
  text: string
  /** Переводы: locale -> { title?, shortDescription?, text? } */
  translations?: Partial<Record<Locale, { title?: string; shortDescription?: string; text?: string }>>
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

export async function GET() {
  try {
    const raw = await loadNews()
    const news = raw.map((r) => normalizeItem(r as unknown as Record<string, unknown>))
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
  if (!canPublishContent(user.id)) {
    return NextResponse.json({ error: 'Публиковать новости могут только волонтёры и команда проекта' }, { status: 403 })
  }

  let body: { title?: string; shortDescription?: string; text?: string; image?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Некорректный JSON' }, { status: 400 })
  }

  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const shortDescription = typeof body.shortDescription === 'string' ? body.shortDescription.trim() : ''
  const text = typeof body.text === 'string' ? body.text.trim() : ''

  if (title.length < 40 || title.length > 80) {
    return NextResponse.json({ error: 'Заголовок: 40–80 символов' }, { status: 400 })
  }
  if (shortDescription && (shortDescription.length < 100 || shortDescription.length > 160)) {
    return NextResponse.json({ error: 'Краткое описание (если указано): 100–160 символов' }, { status: 400 })
  }
  if (!text || text.length > 1500) {
    return NextResponse.json({ error: 'Основной текст обязателен (макс. 1 500 символов)' }, { status: 400 })
  }

  let image: string | undefined
  if (typeof body.image === 'string' && body.image.startsWith('data:image/')) {
    if (body.image.length > 2_000_000) {
      return NextResponse.json({ error: 'Изображение слишком большое (макс. ~1.5 МБ)' }, { status: 400 })
    }
    image = body.image
  } else {
    return NextResponse.json({ error: 'Фотография обязательна' }, { status: 400 })
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
      title,
      shortDescription: shortDescription || text.slice(0, 160),
      text,
      author: user.username,
      authorId: user.id,
      authorAvatar,
      createdAt,
      image,
    }

    try {
      const descToTranslate = shortDescription || text.slice(0, 160)
      const [titleTrans, descTrans, textTrans] = await Promise.all([
        translateToAllLocales(title),
        translateToAllLocales(descToTranslate),
        translateToAllLocales(text),
      ])
      const hasAny =
        Object.keys(titleTrans).length > 0 || Object.keys(descTrans).length > 0 || Object.keys(textTrans).length > 0
      if (hasAny) {
        item.translations = {}
        for (const loc of LOCALES) {
          const t = titleTrans[loc]
          const d = descTrans[loc]
          const x = textTrans[loc]
          if (t || d || x) item.translations[loc] = { title: t, shortDescription: d, text: x }
        }
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
