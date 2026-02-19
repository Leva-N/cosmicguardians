import { NextRequest, NextResponse } from 'next/server'
import { loadPosts, savePosts } from '@/lib/translator-storage'

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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const xUser = getXUserFromRequest(_request)
  if (!xUser) {
    return NextResponse.json({ error: 'Подключите X' }, { status: 401 })
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
    if (post.xUserId !== xUser.id) {
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
