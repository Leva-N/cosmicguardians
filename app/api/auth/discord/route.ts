import { NextRequest, NextResponse } from 'next/server'

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function GET(request: NextRequest) {
  if (!DISCORD_CLIENT_ID) {
    return NextResponse.json(
      { error: 'Discord OAuth не настроен. Добавьте DISCORD_CLIENT_ID в .env.local' },
      { status: 500 }
    )
  }

  const state = crypto.randomUUID()
  const redirectUri = `${NEXT_PUBLIC_APP_URL}/api/auth/discord/callback`
  const scope = 'identify email'
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    state,
  })

  const url = `https://discord.com/api/oauth2/authorize?${params.toString()}`

  const response = NextResponse.redirect(url)

  response.cookies.set('discord_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })

  return response
}
