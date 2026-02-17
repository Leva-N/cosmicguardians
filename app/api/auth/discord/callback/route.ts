import { NextRequest, NextResponse } from 'next/server'

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const redirectUrl = new URL('/', NEXT_PUBLIC_APP_URL)

  if (error) {
    redirectUrl.searchParams.set('error', 'discord_auth_cancelled')
    return NextResponse.redirect(redirectUrl)
  }

  const storedState = request.cookies.get('discord_oauth_state')?.value
  if (!state || state !== storedState) {
    redirectUrl.searchParams.set('error', 'invalid_state')
    return NextResponse.redirect(redirectUrl)
  }

  if (!code || !DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
    redirectUrl.searchParams.set('error', 'auth_config_error')
    return NextResponse.redirect(redirectUrl)
  }

  const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${NEXT_PUBLIC_APP_URL}/api/auth/discord/callback`,
    }),
  })

  if (!tokenResponse.ok) {
    const err = await tokenResponse.text()
    console.error('Discord token exchange failed:', err)
    redirectUrl.searchParams.set('error', 'token_exchange_failed')
    return NextResponse.redirect(redirectUrl)
  }

  const { access_token } = await tokenResponse.json()

  const userResponse = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  if (!userResponse.ok) {
    redirectUrl.searchParams.set('error', 'user_fetch_failed')
    return NextResponse.redirect(redirectUrl)
  }

  const user = await userResponse.json()
  const userData = {
    id: user.id,
    username: user.username,
    discriminator: user.discriminator || '0',
    avatar: user.avatar,
    global_name: user.global_name || user.username,
    email: user.email,
  }

  const response = NextResponse.redirect(redirectUrl)

  response.cookies.set('discord_oauth_state', '', { maxAge: 0, path: '/' })
  response.cookies.set('discord_user', JSON.stringify(userData), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return response
}
