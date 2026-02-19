'use client'

import Link from 'next/link'
import { useLocale } from './LocaleProvider'

const BLOCKS = [
  {
    href: '/news',
    titleKey: 'header.nav.news' as const,
    descKey: 'home.blocks.news.desc' as const,
    accent: '#8A2BE2',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
  {
    href: '/translator',
    titleKey: 'header.nav.translator' as const,
    descKey: 'home.blocks.translator.desc' as const,
    accent: '#8A2BE2',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
  {
    href: '/members',
    titleKey: 'header.nav.members' as const,
    descKey: 'home.blocks.members.desc' as const,
    accent: '#8A2BE2',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: '/horizon',
    titleKey: 'header.nav.horizon' as const,
    descKey: 'home.blocks.horizon.desc' as const,
    accent: '#8A2BE2',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20" />
        <path d="M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    href: '/games',
    titleKey: 'header.nav.games' as const,
    descKey: 'home.blocks.games.desc' as const,
    accent: '#8A2BE2',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 12h4m-2-2v4" />
        <path d="M14 10h.01M14 14h.01M18 10h.01M18 14h.01" />
        <rect x="2" y="6" width="20" height="12" rx="2" />
      </svg>
    ),
  },
  {
    href: '/about',
    titleKey: 'header.nav.about' as const,
    descKey: 'home.blocks.evedex.desc' as const,
    accent: '#8A2BE2',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
] as const

export function HomeBlocks() {
  const { t } = useLocale()

  return (
    <section className="relative py-16 sm:py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {BLOCKS.map((block) => (
            <Link
              key={block.href}
              href={block.href}
              className="home-block group relative flex flex-col items-center text-center rounded-2xl border border-[#9B4DE8]/30 bg-[#9B4DE8]/12 backdrop-blur-sm p-6 sm:p-8 min-h-[180px] sm:min-h-[220px] w-[min(100%,300px)] min-w-[240px] max-w-[320px] transition-all duration-300 hover:scale-[1.03] hover:border-[#9B4DE8]/45 hover:bg-[#9B4DE8]/18"
              style={
                {
                  '--block-accent': block.accent,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)',
                } as React.CSSProperties
              }
            >
              <div
                className="mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-[#9B4DE8]/20 transition-all duration-300 group-hover:shadow-[0_0_28px_var(--block-accent)]"
                style={{ color: block.accent }}
              >
                <span className="[&>svg]:h-8 [&>svg]:w-8 sm:[&>svg]:h-9 sm:[&>svg]:w-9">{block.icon}</span>
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--block-accent)]">
                {t(block.titleKey)}
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                {t(block.descKey)}
              </p>
              <div
                className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  boxShadow: `inset 0 0 40px ${block.accent}18`,
                  pointerEvents: 'none',
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
