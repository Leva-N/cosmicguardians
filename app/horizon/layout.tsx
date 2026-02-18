import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Горизонт Событий — Cosmic Guardians',
  description: 'Подключите Discord, чтобы оставить свой след в галактике',
}

export default function HorizonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
