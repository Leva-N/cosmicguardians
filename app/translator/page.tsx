'use client'

import { useState, useEffect } from 'react'
import { useLocale } from '@/components/LocaleProvider'
import { TranslatorPosts } from '@/components/TranslatorPosts'

interface XUser {
  id: string
  username: string
  name: string
}

export default function TranslatorPage() {
  const { t } = useLocale()
  const [xUser, setXUser] = useState<XUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/x/me')
      .then((res) => res.json())
      .then((data) => setXUser(data.user))
      .catch(() => setXUser(null))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/x/logout', { method: 'POST', credentials: 'include' })
    setXUser(null)
  }

  return (
    <section className="relative py-12 md:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="text-center sm:text-left">
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">
              <span className="gradient-text">{t('translator.title')}</span>
            </h1>
            <p className="text-[var(--text-secondary)]">{t('translator.subtitle')}</p>
          </div>
          {!loading && (
            <div className="flex justify-center sm:justify-end shrink-0">
              {xUser ? (
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 pl-3 pr-2 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-[#1DA1F2]/20 flex items-center justify-center shrink-0">
                      <svg className="h-4 w-4 text-[#1DA1F2]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm text-[var(--text-primary)]">{xUser.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">@{xUser.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-red-500 hover:bg-white/5 transition-colors"
                  >
                    {t('translator.disconnect')}
                  </button>
                </div>
              ) : (
                <a
                  href="/api/auth/x"
                  className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#333] border border-white/20"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  {t('translator.connectX')}
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <TranslatorPosts xUser={xUser} />
    </section>
  )
}
