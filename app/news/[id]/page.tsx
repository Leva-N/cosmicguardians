import { NewsDetail } from './NewsDetailClient'

export const metadata = {
  title: 'Новость — Cosmic Guardians',
  description: 'Новости сообщества Cosmic Guardians',
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <NewsDetail id={id} />
}
