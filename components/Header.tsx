'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from './AuthProvider'
import { GOLD_MEMBER_DISCORD_IDS, MEMBER_DISCORD_IDS } from './Members'
import { useLocale } from './LocaleProvider'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isLoading, logout } = useAuth()
  const { t } = useLocale()

  const navLinks = [
    { href: '/news', labelKey: 'header.nav.news' as const },
    { href: '/translator', labelKey: 'header.nav.translator' as const },
    { href: '/members', labelKey: 'header.nav.members' as const },
    { href: '/horizon', labelKey: 'header.nav.horizon' as const },
    { href: '/games', labelKey: 'header.nav.games' as const },
    { href: '/about', labelKey: 'header.nav.about' as const },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#8A2BE2]/30 bg-transparent backdrop-blur-md pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 sm:py-3.5">
        <div className="flex items-center gap-2.5 shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/hello2.png"
              alt="Cosmic Guardians"
              width={40}
              height={40}
              className="h-8 w-8 sm:h-9 sm:w-9 object-contain rounded-lg"
            />
            <span className="font-display text-lg sm:text-xl font-semibold tracking-tight gradient-text">
              Cosmic Guardians
            </span>
          </Link>
          {user && (GOLD_MEMBER_DISCORD_IDS.has(user.id) || MEMBER_DISCORD_IDS.has(user.id)) && (
            <span
              className={`badge-verified badge-tooltip shrink-0 cursor-default ${GOLD_MEMBER_DISCORD_IDS.has(user.id) ? 'text-[#FFD700]' : 'text-[#00ff00]'}`}
              data-tooltip={GOLD_MEMBER_DISCORD_IDS.has(user.id) ? t('header.verifiedTeam') : t('header.verifiedGuardian')}
              role="img"
              aria-label={GOLD_MEMBER_DISCORD_IDS.has(user.id) ? t('header.verifiedTeam') : t('header.verifiedGuardian')}
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5 9-10" />
              </svg>
            </span>
          )}
        </div>

        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2.5 py-2.5 lg:px-3 text-sm font-medium text-[#8A2BE2] hover:text-[#9B4DE8] hover:bg-[#8A2BE2]/15 border-none shadow-none outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 transition-colors duration-200 min-h-[40px] flex items-center no-underline"
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 rounded-xl bg-[#8A2BE2]/10 pl-2 pr-3 py-2">
                    <img
                      src={
                        user.avatar
                          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=32`
                          : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`
                      }
                      alt=""
                      className="h-6 w-6 rounded-full"
                    />
                    <span className={`text-sm font-medium max-w-[120px] truncate ${GOLD_MEMBER_DISCORD_IDS.has(user.id) ? 'text-[#FFD700]' : MEMBER_DISCORD_IDS.has(user.id) ? 'text-[#00ff00]' : 'text-[var(--text-primary)]'}`}>
                      {user.global_name || user.username}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="rounded-xl px-3 py-2 text-sm font-medium text-[#8A2BE2] bg-[#8A2BE2]/10 hover:text-[#9B4DE8] hover:bg-[#8A2BE2]/20 border-0 shadow-none outline-none focus:outline-none focus:ring-0 transition-colors duration-200"
                  >
                    {t('header.logout')}
                  </button>
                </div>
              ) : (
                <Link
                  href="/api/auth/discord"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#8A2BE2] px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-[#9B4DE8] hover:text-white border-0 shadow-none outline-none focus:outline-none focus:ring-0"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.105 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.105c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  {t('header.connectDiscord')}
                </Link>
              )}
            </>
          )}
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden touch-target min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl p-2.5 text-[#8A2BE2] bg-[#8A2BE2]/10 hover:text-[#9B4DE8] hover:bg-[#8A2BE2]/20 border-0 shadow-none outline-none focus:outline-none focus:ring-0 transition-colors duration-200"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-[var(--bg-secondary)]/95 backdrop-blur-xl animate-in">
            <nav className="flex flex-col px-4 py-4 gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl py-3.5 px-4 min-h-[44px] flex items-center text-[#8A2BE2] bg-[#8A2BE2]/10 hover:text-[#9B4DE8] hover:bg-[#8A2BE2]/20 border-0 shadow-none outline-none focus:outline-none focus:ring-0 transition-colors font-medium"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
              {!isLoading && !user && (
                <Link
                  href="/api/auth/discord"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#8A2BE2] px-4 py-3 text-sm font-semibold text-white border-0 shadow-none outline-none"
                >
                  {t('header.connectDiscord')}
                </Link>
              )}
              {user && (
                <div className="mt-2 flex items-center justify-between rounded-xl bg-[#8A2BE2]/10 p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        user.avatar
                          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=32`
                          : `https://cdn.discordapp.com/embed/avatars/${(parseInt(user.discriminator) || 0) % 5}.png`
                      }
                      alt=""
                      className="h-9 w-9 rounded-full"
                    />
                    <span className={`text-sm font-medium ${GOLD_MEMBER_DISCORD_IDS.has(user.id) ? 'text-[#FFD700]' : MEMBER_DISCORD_IDS.has(user.id) ? 'text-[#00ff00]' : ''}`}>{user.global_name || user.username}</span>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="text-sm font-medium text-[#8A2BE2] bg-[#8A2BE2]/10 px-3 py-2 rounded-xl hover:text-[#9B4DE8] hover:bg-[#8A2BE2]/20 border-0 shadow-none outline-none focus:outline-none focus:ring-0 transition-colors"
                  >
                    {t('header.logout')}
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
    </header>
  )
}
