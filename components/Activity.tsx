'use client'

import { useState } from 'react'
import { useLocale } from '@/components/LocaleProvider'

const activityIds = [
  { id: 'dev', labelKey: 'activity.dev' as const, count: 24, active: true },
  { id: 'docs', labelKey: 'activity.docs' as const, count: 18, active: true },
  { id: 'support', labelKey: 'activity.support' as const, count: 42, active: true },
  { id: 'design', labelKey: 'activity.design' as const, count: 12, active: false },
  { id: 'marketing', labelKey: 'activity.marketing' as const, count: 8, active: false },
]

const recentActivity = [
  { user: 'Volunteer_01', action: 'Обновил документацию API', time: '2ч назад', type: 'docs' },
  { user: 'Dev_Max', action: 'Исправил баг в ордерах', time: '3ч назад', type: 'dev' },
  { user: 'Support_Anna', action: 'Помог пользователю с выводом', time: '4ч назад', type: 'support' },
  { user: 'Doc_Kirill', action: 'Добавил FAQ раздел', time: '5ч назад', type: 'docs' },
  { user: 'Code_Viktor', action: 'Оптимизировал gas-расходы', time: '6ч назад', type: 'dev' },
]

export function Activity() {
  const { t } = useLocale()
  const [filter, setFilter] = useState<string | null>(null)

  return (
    <section id="activity" className="relative py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 animate-in">
          <div>
            <h2 className="mb-2 text-2xl sm:text-3xl font-bold md:text-4xl">
              <span className="gradient-text">{t('activity.title')}</span>
            </h2>
            <p className="text-[var(--text-secondary)]">
              {t('activity.subtitle')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activityIds.map((a) => (
              <button
                key={a.id}
                onClick={() => setFilter(filter === a.id ? null : a.id)}
                className={`rounded-lg px-4 py-2.5 min-h-[40px] text-sm font-medium transition-all ${
                  filter === a.id
                    ? 'bg-gradient-to-r from-evedex-primary to-evedex-secondary text-white'
                    : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10 hover:text-[var(--text-primary)]'
                }`}
              >
                {t(a.labelKey)} ({a.count})
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden animate-in animate-in-delay-1">
          <div className="divide-y divide-white/5">
            {recentActivity
              .filter((a) => !filter || a.type === filter)
              .map((item, i) => (
<div
                key={`${item.user}-${i}`}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-white/5 transition-colors"
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
                    {(() => {
                      const act = activityIds.find((x) => x.id === item.type)
                      return act ? t(act.labelKey) : item.type
                    })()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
