'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const news = [
  {
    id: 1,
    title: 'Новая версия контракта ликвидности',
    excerpt: 'Обновление снижает комиссии и улучшает исполнение ордеров для всех участников.',
    date: '15 фев 2025',
    tag: 'Обновление',
  },
  {
    id: 2,
    title: 'Приглашаем волонтёров в команду документации',
    excerpt: 'Ищем активных участников для перевода и улучшения руководств.',
    date: '12 фев 2025',
    tag: 'Сообщество',
  },
  {
    id: 3,
    title: 'AMA с основателями — 20 февраля',
    excerpt: 'Прямой эфир с ответами на вопросы сообщества. Присоединяйтесь!',
    date: '10 фев 2025',
    tag: 'События',
  },
]

export function News() {
  return (
    <section id="news" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">
              <span className="gradient-text">Новости и обновления</span>
            </h2>
            <p className="text-[var(--text-secondary)]">
              Будьте в курсе последних изменений
            </p>
          </div>
          <Link
            href="#"
            className="text-sm font-medium text-evedex-primary hover:underline"
          >
            Все новости →
          </Link>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {news.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href="#" className="glass-card block rounded-2xl p-6 h-full hover:border-evedex-primary/40">
                <span className="mb-4 inline-block rounded-md bg-evedex-primary/15 px-2 py-1 text-xs font-medium text-evedex-primary">
                  {item.tag}
                </span>
                <h3 className="mb-2 font-semibold leading-tight hover:text-evedex-primary transition-colors">
                  {item.title}
                </h3>
                <p className="mb-4 text-sm text-[var(--text-secondary)] line-clamp-2">
                  {item.excerpt}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">{item.date}</p>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
