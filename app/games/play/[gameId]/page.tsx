import { notFound } from 'next/navigation'
import { getGameById } from '@/data/games/list'
import { GamePageInner } from './GamePageInner'

type Props = { params: Promise<{ gameId: string }> }

export async function generateMetadata({ params }: Props) {
  const { gameId } = await params
  const game = getGameById(gameId)
  if (!game) return { title: 'Игра не найдена' }
  return {
    title: `${game.name} — Игры | Cosmic Guardians`,
    description: game.desc,
  }
}

export async function generateStaticParams() {
  const { GAMES_LIST } = await import('@/data/games/list')
  return GAMES_LIST.map((g) => ({ gameId: g.id }))
}

export default async function GamePage({ params }: Props) {
  const { gameId } = await params
  const game = getGameById(gameId)
  if (!game) notFound()
  return <GamePageInner game={game} />
}
