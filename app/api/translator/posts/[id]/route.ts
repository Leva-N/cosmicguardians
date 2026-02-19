import { NextRequest, NextResponse } from 'next/server'
import { loadPosts, savePosts } from '@/lib/translator-storage'
import { isAdmin } from '@/lib/admin-ids'

function getXUserFromRequest(request: NextRequest): { id: string } | null {
  const xUser = request.cookies.get('x_user')?.value
  if (!xUser) return null
  try {
    const user = JSON.parse(xUser)
    return user?.id ? { id: user.id } : null
  } catch {
    return null
  }
}

function getDiscordUserFromRequest(request: NextRequest): { id: string } | null {
  const discordUser = request.cookies.get('discord_user')?.value
  if (!discordUser) return null
  try {
    const user = JSON.parse(discordUser)
    return user?.id ? { id: user.id } : null
  } catch {
    return null
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const xUser = getXUserFromRequest(request)
  const discordUser = getDiscordUserFromRequest(request)
  const canDeleteOwn = xUser
  const isAdminUser = discordUser && isAdmin(discordUser.id)
  if (!canDeleteOwn && !isAdminUser) {
    return NextResponse.json({ error: 'Подключите X или войдите через Discord' }, { status: 401 })
  }

  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'ID не указан' }, { status: 400 })
  }

  try {
    const posts = await loadPosts()
    const index = posts.findIndex((p: { id: string; xUserId: string }) => p.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Пост не найден' }, { status: 404 })
    }

    const post = posts[index]
    const ownPost = xUser && post.xUserId === xUser.id
    if (!ownPost && !isAdminUser) {
      return NextResponse.json({ error: 'Удалять можно только свои посты' }, { status: 403 })
    }

    posts.splice(index, 1)
    await savePosts(posts)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Translator post DELETE error:', error)
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 })
  }
}
