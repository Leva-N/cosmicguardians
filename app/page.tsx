import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { Mission } from '@/components/Mission'
import { Stats } from '@/components/Stats'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/news" className="glass-card block rounded-2xl p-6 text-center transition-all hover:scale-[1.02]">
              <span className="text-3xl mb-4 block">📰</span>
              <h3 className="font-semibold mb-2">Новости</h3>
              <p className="text-sm text-[var(--text-secondary)]">Обновления и события сообщества</p>
            </Link>
            <Link href="/members" className="glass-card block rounded-2xl p-6 text-center transition-all hover:scale-[1.02]">
              <span className="text-3xl mb-4 block">👥</span>
              <h3 className="font-semibold mb-2">Участники</h3>
              <p className="text-sm text-[var(--text-secondary)]">Волонтёры и их вклад</p>
            </Link>
            <Link href="/games" className="glass-card block rounded-2xl p-6 text-center transition-all hover:scale-[1.02]">
              <span className="text-3xl mb-4 block">🎮</span>
              <h3 className="font-semibold mb-2">Игры</h3>
              <p className="text-sm text-[var(--text-secondary)]">Достижения и геймификация</p>
            </Link>
            <Link href="/about" className="glass-card block rounded-2xl p-6 text-center transition-all hover:scale-[1.02]">
              <span className="text-3xl mb-4 block">ℹ️</span>
              <h3 className="font-semibold mb-2">Об EVEDEX</h3>
              <p className="text-sm text-[var(--text-secondary)]">Миссия, активность, статистика</p>
            </Link>
          </div>
        </div>
      </section>
      <Stats />
      <Footer />
    </>
  )
}
