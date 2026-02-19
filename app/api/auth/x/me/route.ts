import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const xUser = request.cookies.get('x_user')?.value

  if (!xUser) {
    return NextResponse.json({ user: null })
  }

  try {
    const user = JSON.parse(xUser)
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}
