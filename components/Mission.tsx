'use client'

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
        <div className="mb-16 text-center animate-in">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            <span className="gradient-text">Миссия волонтёров</span>
          </h2>
          <p className="mx-auto max-w-2xl text-[var(--text-secondary)]">
            Мы создаём инфраструктуру, которой можно доверять. Децентрализация — это не только технология, 
            это культура открытости и сотрудничества.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {values.map((item, i) => (
            <div
              key={item.title}
              className={`glass-card group rounded-2xl p-8 animate-in ${i === 0 ? 'animate-in-delay-1' : i === 1 ? 'animate-in-delay-2' : 'animate-in-delay-3'}`}
            >
              <div className="mb-4 text-3xl font-bold text-evedex-primary opacity-80 group-hover:opacity-100 transition-opacity">
                {item.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-[var(--text-secondary)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
