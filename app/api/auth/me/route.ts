import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const discordUser = request.cookies.get('discord_user')?.value

  if (!discordUser) {
    return NextResponse.json({ user: null })
  }

  try {
    const user = JSON.parse(discordUser)
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}
