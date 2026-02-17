import { News } from '@/components/News'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Новости — Cosmic Guardians',
  description: 'Новости и обновления сообщества Cosmic Guardians и DEX EVEDEX.',
}

export default function NewsPage() {
  return (
    <>
      <News />
      <Footer />
    </>
  )
}
