'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const activities = [
  { id: 'dev', label: 'Разработка', count: 24, active: true },
  { id: 'docs', label: 'Документация', count: 18, active: true },
  { id: 'support', label: 'Поддержка', count: 42, active: true },
  { id: 'design', label: 'Дизайн', count: 12, active: false },
  { id: 'marketing', label: 'Маркетинг', count: 8, active: false },
]

const recentActivity = [
  { user: 'Volunteer_01', action: 'Обновил документацию API', time: '2ч назад', type: 'docs' },
  { user: 'Dev_Max', action: 'Исправил баг в ордерах', time: '3ч назад', type: 'dev' },
  { user: 'Support_Anna', action: 'Помог пользователю с выводом', time: '4ч назад', type: 'support' },
  { user: 'Doc_Kirill', action: 'Добавил FAQ раздел', time: '5ч назад', type: 'docs' },
  { user: 'Code_Viktor', action: 'Оптимизировал gas-расходы', time: '6ч назад', type: 'dev' },
]

export function Activity() {
  const [filter, setFilter] = useState<string | null>(null)

  return (
    <section id="activity" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">
              <span className="gradient-text">Активность сообщества</span>
            </h2>
            <p className="text-[var(--text-secondary)]">
              Живая лента вкладов волонтёров в реальном времени
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activities.map((a) => (
              <button
                key={a.id}
                onClick={() => setFilter(filter === a.id ? null : a.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  filter === a.id
                    ? 'bg-gradient-to-r from-evedex-primary to-evedex-secondary text-white'
                    : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10 hover:text-[var(--text-primary)]'
                }`}
              >
                {a.label} ({a.count})
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <div className="divide-y divide-white/5">
            {recentActivity
              .filter((a) => !filter || a.type === filter)
              .map((item, i) => (
                <motion.div
                  key={`${item.user}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-evedex-primary/30 to-evedex-secondary/30 flex items-center justify-center text-sm font-bold">
                      {item.user[0]}
                    </div>
                    <div>
                      <p className="font-medium">
                        <span className="text-evedex-primary">{item.user}</span>
                        {' → '}
                        {item.action}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">{item.time}</p>
                    </div>
                  </div>
                  <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-[var(--text-secondary)]">
                    {activities.find((x) => x.id === item.type)?.label ?? item.type}
                  </span>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
