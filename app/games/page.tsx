import { motion } from 'framer-motion'
import Link from 'next/link'
import { Footer } from '@/components/Footer'

const games = [
  {
    id: 1,
    title: 'Достижения волонтёра',
    desc: 'Собирайте награды за вклад в разработку, документацию и поддержку сообщества.',
    icon: '🏆',
    badgeClass: 'bg-evedex-achievement/20 text-evedex-achievement',
  },
  {
    id: 2,
    title: 'Рейтинг активности',
    desc: 'Соревнуйтесь с другими участниками и поднимайтесь в топе за полезные действия.',
    icon: '📊',
    badgeClass: 'bg-evedex-primary/20 text-evedex-primary',
  },
  {
    id: 3,
    title: 'Квесты сообщества',
    desc: 'Выполняйте задания и получайте уникальные бейджи за завершённые миссии.',
    icon: '⚡',
    badgeClass: 'bg-evedex-progress/20 text-evedex-progress',
  },
]

export const metadata = {
  title: 'Игры — Cosmic Guardians',
  description: 'Геймификация и достижения сообщества Cosmic Guardians.',
}

export default function GamesPage() {
  return (
    <>
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              <span className="gradient-text">Игры и геймификация</span>
            </h1>
            <p className="mx-auto max-w-2xl text-[var(--text-secondary)]">
              Достижения, рейтинги и квесты для волонтёров Cosmic Guardians
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {games.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card group rounded-2xl p-8"
              >
                <div className="mb-6 text-5xl opacity-90">{game.icon}</div>
                <h2 className="mb-3 text-xl font-semibold">{game.title}</h2>
                <p className="mb-6 text-[var(--text-secondary)]">{game.desc}</p>
                <span className={`inline-block rounded-lg px-4 py-2 text-sm font-medium ${game.badgeClass}`}>
                  Скоро
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <p className="text-[var(--text-secondary)] mb-6">
              Система геймификации находится в разработке. Следите за обновлениями в новостях.
            </p>
            <Link
              href="/news"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-evedex-primary to-evedex-accent px-6 py-3 font-semibold text-white shadow-neon transition-all hover:shadow-glow"
            >
              Смотреть новости
            </Link>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  )
}
