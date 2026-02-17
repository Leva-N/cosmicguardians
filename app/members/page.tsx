import { Members } from '@/components/Members'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Участники — Cosmic Guardians',
  description: 'Участники волонтёрского сообщества Cosmic Guardians и их вклад в EVEDEX.',
}

export default function MembersPage() {
  return (
    <>
      <Members />
      <Footer />
    </>
  )
}
