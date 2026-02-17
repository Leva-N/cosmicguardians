import type { Metadata } from 'next'
import { Space_Grotesk, Outfit } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/components/AuthProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
})

const outfit = Outfit({
  variable: '--font-sans',
  subsets: ['latin'],
})

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
      <body className={`${spaceGrotesk.variable} ${outfit.variable} antialiased min-h-screen flex flex-col`}>
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
