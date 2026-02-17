'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from './ThemeProvider'
import { useAuth } from './AuthProvider'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user, isLoading, logout } = useAuth()

  const navLinks = [
    { href: '/news', label: 'Новости' },
    { href: '/articles', label: 'Статьи' },
    { href: '/members', label: 'Участники' },
    { href: '/games', label: 'Игры' },
    { href: '/about', label: 'Об EVEDEX' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-transparent backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-evedex-primary to-evedex-accent flex items-center justify-center font-bold text-white text-sm shadow-neon">
            CG
          </div>
          <span className="font-display text-xl font-bold tracking-tight gradient-text">
            Cosmic Guardians
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-evedex-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 pl-2 pr-3 py-1.5">
                    <img
                      src={
                        user.avatar
                          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=32`
                          : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`
                      }
                      alt=""
                      className="h-7 w-7 rounded-full"
                    />
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {user.global_name || user.username}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-evedex-primary hover:bg-white/5 transition-all"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <Link
                  href="/api/auth/discord"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#4752C4]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.105 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.105c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Подключить Discord
                </Link>
              )}
            </>
          )}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-[var(--text-secondary)] hover:text-evedex-primary hover:bg-white/5 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-lg p-2 text-[var(--text-primary)] hover:bg-white/5"
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
          <div className="md:hidden border-t border-white/5 bg-[var(--bg-secondary)] animate-in">
            <nav className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-[var(--text-secondary)] hover:text-evedex-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!isLoading && !user && (
                <Link
                  href="/api/auth/discord"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-4 py-3 font-semibold text-white"
                >
                  Подключить Discord
                </Link>
              )}
              {user && (
                <div className="mt-2 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        user.avatar
                          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=32`
                          : `https://cdn.discordapp.com/embed/avatars/${(parseInt(user.discriminator) || 0) % 5}.png`
                      }
                      alt=""
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="text-sm font-medium">{user.global_name || user.username}</span>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="text-sm text-[var(--text-secondary)] hover:text-evedex-primary"
                  >
                    Выйти
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
    </header>
  )
}
