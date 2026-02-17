'use client'

import Link from 'next/link'

const footerLinks = {
  product: [
    { label: 'Торговля', href: '#' },
    { label: 'Ликвидность', href: '#' },
    { label: 'API', href: '#' },
  ],
  community: [
    { label: 'Discord', href: 'https://discord.gg/evedex' },
    { label: 'Telegram', href: 'https://t.me/evedex' },
    { label: 'Twitter', href: 'https://twitter.com/evedex' },
  ],
  pages: [
    { label: 'Новости', href: '/news' },
    { label: 'Участники', href: '/members' },
    { label: 'Игры', href: '/games' },
    { label: 'Об EVEDEX', href: '/about' },
  ],
}

const socials = [
  { name: 'Discord', href: 'https://discord.gg/evedex', icon: 'D' },
  { name: 'Telegram', href: 'https://t.me/evedex', icon: 'T' },
  { name: 'Twitter', href: 'https://twitter.com/evedex', icon: '𝕏' },
  { name: 'GitHub', href: 'https://github.com/evedex', icon: 'G' },
]

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[var(--bg-secondary)]/50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-evedex-primary to-evedex-accent flex items-center justify-center font-bold text-white text-sm shadow-neon">
                CG
              </div>
              <span className="font-display text-xl font-bold gradient-text">Cosmic Guardians</span>
            </Link>
            <p className="max-w-sm text-sm text-[var(--text-secondary)]">
              Волонтёры DEX EVEDEX. Открытая площадка, прозрачность и доверие.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[var(--text-secondary)] transition-colors hover:border-evedex-primary/50 hover:text-evedex-primary hover:bg-evedex-primary/10"
                  aria-label={s.name}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">Продукт</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-evedex-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">Сообщество</h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-evedex-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">Разделы</h4>
            <ul className="space-y-3">
              {footerLinks.pages.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-evedex-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-sm text-[var(--text-secondary)]">
            © {new Date().getFullYear()} Cosmic Guardians. Фан-сайт волонтёров EVEDEX.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-evedex-primary transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="#" className="text-sm text-[var(--text-secondary)] hover:text-evedex-primary transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
