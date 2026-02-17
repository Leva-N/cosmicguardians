export const metadata = {
  title: 'Статьи — Cosmic Guardians',
  description: 'Статьи сообщества Cosmic Guardians и EVEDEX.',
}

export default function ArticlesPage() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">
          <span className="gradient-text">Статьи</span>
        </h1>
        <p className="text-[var(--text-secondary)]">
          Скоро здесь появятся статьи
        </p>
      </div>
    </section>
  )
}
