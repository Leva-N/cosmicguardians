import { NextRequest, NextResponse } from 'next/server'

const X_CLIENT_ID = process.env.X_CLIENT_ID
const X_CLIENT_SECRET = process.env.X_CLIENT_SECRET
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const redirectUrl = new URL('/translator', NEXT_PUBLIC_APP_URL)

  if (error) {
    redirectUrl.searchParams.set('error', 'x_auth_cancelled')
    return NextResponse.redirect(redirectUrl)
  }

  const storedState = request.cookies.get('x_oauth_state')?.value
  const codeVerifier = request.cookies.get('x_oauth_code_verifier')?.value

  if (!state || state !== storedState || !codeVerifier) {
    redirectUrl.searchParams.set('error', 'invalid_state')
    return NextResponse.redirect(redirectUrl)
  }

  if (!code || !X_CLIENT_ID) {
    redirectUrl.searchParams.set('error', 'auth_config_error')
    return NextResponse.redirect(redirectUrl)
  }

  const tokenBody = new URLSearchParams({
    code,
    grant_type: 'authorization_code',
    redirect_uri: `${NEXT_PUBLIC_APP_URL}/api/auth/x/callback`,
    code_verifier: codeVerifier,
  })

  const tokenHeaders: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  if (X_CLIENT_SECRET) {
    tokenHeaders['Authorization'] = `Basic ${Buffer.from(`${X_CLIENT_ID}:${X_CLIENT_SECRET}`).toString('base64')}`
  } else {
    tokenBody.append('client_id', X_CLIENT_ID)
  }

  const tokenResponse = await fetch('https://api.x.com/2/oauth2/token', {
    method: 'POST',
    headers: tokenHeaders,
    body: tokenBody.toString(),
  })

  if (!tokenResponse.ok) {
    const err = await tokenResponse.text()
    console.error('X token exchange failed:', err)
    redirectUrl.searchParams.set('error', 'token_exchange_failed')
    return NextResponse.redirect(redirectUrl)
  }

  const { access_token } = await tokenResponse.json()

  const userResponse = await fetch('https://api.x.com/2/users/me', {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  if (!userResponse.ok) {
    redirectUrl.searchParams.set('error', 'user_fetch_failed')
    return NextResponse.redirect(redirectUrl)
  }

  const userData = await userResponse.json()
  const user = userData.data
  const xUser = {
    id: user.id,
    username: user.username,
    name: user.name,
  }

  const response = NextResponse.redirect(redirectUrl)
  response.cookies.set('x_oauth_state', '', { maxAge: 0, path: '/' })
  response.cookies.set('x_oauth_code_verifier', '', { maxAge: 0, path: '/' })
  response.cookies.set('x_user', JSON.stringify(xUser), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return response
}
