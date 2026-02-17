import { NextResponse } from 'next/server'

const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('discord_user', '', { maxAge: 0, path: '/' })
  return response
}

export async function GET() {
  const response = NextResponse.redirect(new URL('/', NEXT_PUBLIC_APP_URL))
  response.cookies.set('discord_user', '', { maxAge: 0, path: '/' })
  return response
}
