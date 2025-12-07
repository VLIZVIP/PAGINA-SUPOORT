import { type NextRequest, NextResponse } from "next/server"
import { exchangeCodeForToken, getDiscordUser } from "@/lib/discord-auth"
import { isUserAllowed } from "@/lib/allowed-users"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${error}`, request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url))
  }

  try {
    const accessToken = await exchangeCodeForToken(code)
    const user = await getDiscordUser(accessToken)

    if (!isUserAllowed(user.id)) {
      return NextResponse.redirect(
        new URL("/?error=not_verified&message=Your account is not verified to access this dashboard", request.url),
      )
    }

    const isAnimated = user.avatar?.startsWith("a_")
    const avatarExtension = isAnimated ? "gif" : "png"
    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${avatarExtension}?size=256`
      : null

    // Create a session token
    const sessionToken = Buffer.from(
      JSON.stringify({
        userId: user.id,
        username: user.username,
        avatar: avatarUrl,
        timestamp: Date.now(),
      }),
    ).toString("base64")

    const response = NextResponse.redirect(new URL("/dashboard", request.url))
    response.cookies.set("discord_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Discord OAuth error:", error)
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url))
  }
}
