import { NextResponse } from "next/server"

export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://theo.hidencloud.com:24642"

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

    const response = await fetch(`${backendUrl}/get`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",
          connected: false,
          message: `Backend server responded with status: ${response.status}`,
          backendUrl,
        },
        { status: 200 },
      )
    }

    return NextResponse.json({
      status: "online",
      connected: true,
      message: "Backend server is reachable",
      backendUrl,
    })
  } catch (error: any) {
    console.error("Health check failed:", error)

    let message = "Backend server is not reachable"
    if (error.name === "AbortError") {
      message = "Connection timeout - server not responding"
    }

    return NextResponse.json(
      {
        status: "offline",
        connected: false,
        message,
        backendUrl: process.env.BACKEND_URL || "http://theo.hidencloud.com:24642",
      },
      { status: 200 },
    )
  }
}
