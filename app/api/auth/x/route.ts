import { NextResponse } from 'next/server'
import crypto from 'crypto'

const X_CLIENT_ID = process.env.X_CLIENT_ID
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

function base64UrlEncode(buffer: Buffer): string {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export async function GET() {
  if (!X_CLIENT_ID) {
    return NextResponse.json(
      { error: 'X OAuth не настроен. Добавьте X_CLIENT_ID в .env.local' },
      { status: 500 }
    )
  }

  const state = crypto.randomUUID()
  const codeVerifier = base64UrlEncode(crypto.randomBytes(32))
  const codeChallenge = base64UrlEncode(
    crypto.createHash('sha256').update(codeVerifier).digest()
  )
  const redirectUri = `${NEXT_PUBLIC_APP_URL}/api/auth/x/callback`
  const scope = 'tweet.read users.read offline.access'
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: X_CLIENT_ID,
    redirect_uri: redirectUri,
    scope,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  const url = `https://x.com/i/oauth2/authorize?${params.toString()}`

  const response = NextResponse.redirect(url)
  response.cookies.set('x_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })
  response.cookies.set('x_oauth_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })

  return response
}
