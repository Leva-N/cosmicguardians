import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/components/AuthProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { GalaxyBackgroundClient } from '@/components/GalaxyBackgroundClient'

export const metadata: Metadata = {
  title: 'Cosmic Guardians — Волонтёрское сообщество EVEDEX',
  description: 'Cosmic Guardians — волонтёры DEX EVEDEX. Прозрачность, доверие и энергия сообщества.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col galaxy-bg">
        <GalaxyBackgroundClient />
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main className="pt-[72px] flex-1 flex flex-col">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
