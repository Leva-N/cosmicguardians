export const metadata = {
  title: 'Об EVEDEX — Cosmic Guardians',
  description: 'EVEDEX — гибридная криптовалютная биржа: дневная торговля, P2P, копитрейдинг и фьючерсы.',
}

const features = [
  {
    title: 'Нет горячих кошельков',
    desc: 'Все средства хранятся в смарт-контрактах — кошелёк всегда под вашим контролем.',
  },
  {
    title: 'Мгновенная торговля',
    desc: 'Подключите кошелёк и начните торговать за 30 секунд.',
  },
  {
    title: 'Низкие комиссии DEX',
    desc: 'Торговля без платы за газ благодаря L3-сети на базе Arbitrum Orbit.',
  },
  {
    title: 'Высокий кэшбэк',
    desc: 'Торгуйте, повышайте уровень и получайте до 50% кэшбэка с комиссий.',
  },
  {
    title: 'Аффилиатная программа',
    desc: 'До 60% пожизненных комиссий с рефералов — одна из самых выгодных программ на рынке DEX.',
  },
]

const links = [
  { label: 'Начать торговлю', href: 'https://evedex.com/ru-RU/', primary: true },
  { label: 'Whitepaper', href: 'https://evedex.com/ru-RU/' },
  { label: 'Блог', href: 'https://evedex.com/ru-RU/' },
  { label: 'Контракты', href: 'https://evedex.com/ru-RU/' },
  { label: 'Вакансии', href: 'https://evedex.com/ru-RU/' },
  { label: 'FAQ', href: 'https://evedex.com/ru-RU/' },
]

export default function AboutPage() {
  return (
    <>
      <section className="relative py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-16 text-center animate-in">
            <h1 className="mb-6 text-3xl font-bold md:text-4xl">
              <span className="gradient-text">EVEDEX</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-[var(--text-secondary)] mb-4">
              Гибридная криптовалютная биржа. Дневная торговля, P2P, копитрейдинг и фьючерсы.
            </p>
            <p className="mx-auto max-w-2xl text-[var(--text-secondary)]">
              EVEDEX сочетает быстроту транзакций и удобство CEX с децентрализацией, безопасностью и некастодиальностью DEX.
            </p>
          </div>

          <div className="mb-16">
            <h2 className="mb-8 text-xl font-semibold">Единое DEX-решение</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {features.map((item, i) => (
                <div
                  key={item.title}
                  className={`glass-card rounded-2xl p-6 animate-in ${i < 2 ? 'animate-in-delay-1' : i < 4 ? 'animate-in-delay-2' : 'animate-in-delay-3'}`}
                >
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-in animate-in-delay-4">
            <h2 className="mb-6 text-xl font-semibold">Ссылки</h2>
            <div className="flex flex-wrap gap-3">
              {links.map((link) =>
                link.primary ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-xl bg-gradient-to-r from-evedex-primary to-evedex-accent px-6 py-3 font-semibold text-white shadow-neon transition-all hover:shadow-glow"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-white/5 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-evedex-primary hover:bg-evedex-primary/10 transition-colors"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
