import { Mission } from '@/components/Mission'
import { Activity } from '@/components/Activity'
import { Stats } from '@/components/Stats'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Об EVEDEX — Cosmic Guardians',
  description: 'О децентрализованной бирже EVEDEX и волонтёрском сообществе Cosmic Guardians.',
}

export default function AboutPage() {
  return (
    <>
      <Mission />
      <Activity />
      <Stats />
      <Footer />
    </>
  )
}
