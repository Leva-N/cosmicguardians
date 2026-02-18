import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Горизонт Событий — Cosmic Guardians',
  description: 'Бесконечная стена участников Cosmic Guardians. Подключите Discord и оставьте свою карточку.',
}

export default function HorizonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
