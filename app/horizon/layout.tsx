import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Горизонт Событий — Cosmic Guardians',
  description: 'Галактическая стена EVEDEX. Подключите Discord и оставьте свой след в галактике',
}

export default function HorizonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
