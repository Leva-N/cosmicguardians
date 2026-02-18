export const metadata = {
  title: 'Игры — Cosmic Guardians',
  description: 'Геймификация и достижения сообщества Cosmic Guardians.',
}

export default function GamesPage() {
  return (
    <>
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center animate-in">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              <span className="gradient-text">Игры и геймификация</span>
            </h1>
            <p className="mx-auto max-w-2xl text-[var(--text-secondary)]">
              Игры и геймификация от Cosmic Guardians!
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
