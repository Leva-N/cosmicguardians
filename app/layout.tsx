import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/components/AuthProvider'
import { LocaleProvider } from '@/components/LocaleProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { GalaxyBackgroundClient } from '@/components/GalaxyBackgroundClient'
import { CustomCursor } from '@/components/CustomCursor'

export const metadata: Metadata = {
  title: 'Cosmic Guardians — Волонтёрское сообщество EVEDEX',
  description: 'Cosmic Guardians — волонтёры, где каждый участник вносит вклад в развитие EVEDEX.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col galaxy-bg text-[var(--text-primary)]">
        <CustomCursor />
        <GalaxyBackgroundClient />
        <ThemeProvider>
          <LocaleProvider>
            <AuthProvider>
              <Header />
              <main className="pt-[calc(3.5rem+env(safe-area-inset-top,0px))] sm:pt-[calc(4rem+env(safe-area-inset-top,0px))] md:pt-[calc(72px+env(safe-area-inset-top,0px))] flex-1 flex flex-col">{children}</main>
              <Footer />
            </AuthProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
