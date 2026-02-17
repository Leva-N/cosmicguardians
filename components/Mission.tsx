'use client'

import { motion } from 'framer-motion'

const values = [
  {
    icon: '◈',
    title: 'Прозрачность',
    desc: 'Все процессы открыты для сообщества. Никаких скрытых решений.',
  },
  {
    icon: '◇',
    title: 'Доверие',
    desc: 'Честная работа и взаимная поддержка между волонтёрами.',
  },
  {
    icon: '○',
    title: 'Вклад',
    desc: 'Каждое действие имеет значение. Вместе мы сильнее.',
  },
]

export function Mission() {
  return (
    <section id="mission" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            <span className="gradient-text">Миссия волонтёров</span>
          </h2>
          <p className="mx-auto max-w-2xl text-[var(--text-secondary)]">
            Мы создаём инфраструктуру, которой можно доверять. Децентрализация — это не только технология, 
            это культура открытости и сотрудничества.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {values.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card group rounded-2xl p-8"
            >
              <div className="mb-4 text-3xl font-bold text-evedex-primary opacity-80 group-hover:opacity-100 transition-opacity">
                {item.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-[var(--text-secondary)]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
