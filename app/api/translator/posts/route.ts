import { NextRequest, NextResponse } from 'next/server'
import { loadPosts, savePosts, type TranslatorPost } from '@/lib/translator-storage'

export type { TranslatorPost }

function getXUserFromRequest(request: NextRequest): { id: string; username: string } | null {
  const xUser = request.cookies.get('x_user')?.value
  if (!xUser) return null
  try {
    const user = JSON.parse(xUser)
    if (!user.id || !user.username) return null
    return { id: user.id, username: user.username }
  } catch {
    return null
  }
}

function parsePostUrl(input: string): { url: string; username: string } | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  const match = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/([^/]+)\/status\/(\d+)/
  )
  if (!match || match[1] === 'i') return null
  const username = match[1]
  const id = match[2]
  return { url: `https://twitter.com/${username}/status/${id}`, username }
}

const MAX_POSTS_PER_USER = 50
const MAX_DISPLAY = 100

export async function GET() {
  try {
    const posts = await loadPosts()
    const sorted = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return NextResponse.json({ posts: sorted.slice(0, MAX_DISPLAY) })
  } catch (error) {
    console.error('Translator posts GET error:', error)
    return NextResponse.json({ posts: [] })
  }
}

export async function POST(request: NextRequest) {
  const xUser = getXUserFromRequest(request)
  if (!xUser) {
    return NextResponse.json({ error: 'Подключите X, чтобы добавлять посты' }, { status: 401 })
  }

  let body: { url?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Некорректный JSON' }, { status: 400 })
  }

  const input = typeof body.url === 'string' ? body.url : ''
  const parsed = parsePostUrl(input)
  if (!parsed) {
    return NextResponse.json({ error: 'Некорректная ссылка на пост' }, { status: 400 })
  }

  if (parsed.username.toLowerCase() !== xUser.username.toLowerCase()) {
    return NextResponse.json(
      { error: `Можно добавлять только посты со своего канала (@${xUser.username})` },
      { status: 400 }
    )
  }

  try {
    const posts = await loadPosts()
    if (posts.some((p) => p.url === parsed.url)) {
      return NextResponse.json({ error: 'Этот пост уже добавлен' }, { status: 400 })
    }

    const userPosts = posts.filter((p) => p.xUserId === xUser.id)
    if (userPosts.length >= MAX_POSTS_PER_USER) {
      const oldest = userPosts.reduce((a, b) =>
        new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime() ? a : b
      )
      posts.splice(posts.findIndex((p) => p.id === oldest.id), 1)
    }

    const post: TranslatorPost = {
      id: crypto.randomUUID(),
      url: parsed.url,
      xUsername: xUser.username,
      xUserId: xUser.id,
      createdAt: new Date().toISOString(),
    }
    posts.unshift(post)
    await savePosts(posts)
    return NextResponse.json({ ok: true, post })
  } catch (error) {
    console.error('Translator posts POST error:', error)
    return NextResponse.json({ error: 'Не удалось сохранить пост' }, { status: 500 })
  }
}
