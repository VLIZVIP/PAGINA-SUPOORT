import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("discord_session")

  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  try {
    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString())

    // Check if session is expired (7 days)
    const sessionAge = Date.now() - sessionData.timestamp
    if (sessionAge > 7 * 24 * 60 * 60 * 1000) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: sessionData.userId,
        username: sessionData.username,
        avatar: sessionData.avatar,
      },
    })
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("discord_session")
  return response
}
