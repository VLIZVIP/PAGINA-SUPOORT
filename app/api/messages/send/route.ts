import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const msg = body.msg || body.message

    if (!msg || typeof msg !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("discord_session")
    let userInfo = null

    if (sessionCookie) {
      try {
        const session = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString())
        userInfo = {
          userId: session.userId,
          username: session.username,
          avatar: session.avatar,
        }
      } catch (e) {
        console.error("Error parsing session:", e)
      }
    }

    const backendUrl = process.env.BACKEND_URL || "http://theo.hidencloud.com:24642"

    console.log("Attempting to send message to:", `${backendUrl}/send`)
    console.log("Message:", msg)

    const messageWithUser = userInfo ? `[USER:${JSON.stringify(userInfo)}]${msg}` : msg

    const response = await fetch(`${backendUrl}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ msg: messageWithUser }),
    })

    console.log("Send response status:", response.status)
    console.log("Send response ok:", response.ok)

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Send response data:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error sending message:", error)
    console.error("Full error details:", error instanceof Error ? error.stack : error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
