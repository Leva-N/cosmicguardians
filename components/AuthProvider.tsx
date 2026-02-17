'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type DiscordUser = {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  global_name: string
  email?: string
}

const AuthContext = createContext<{
  user: DiscordUser | null
  isLoading: boolean
  logout: () => Promise<void>
}>({ user: null, isLoading: true, logout: async () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DiscordUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user)
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  const logout = async () => {
    await fetch('/api/auth/discord/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
