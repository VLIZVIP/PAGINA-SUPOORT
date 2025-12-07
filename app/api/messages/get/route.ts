import { NextResponse } from "next/server"

export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://theo.hidencloud.com:24642"

    console.log("Attempting to fetch messages from:", `${backendUrl}/get`)

    const response = await fetch(`${backendUrl}/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    console.log("Response status:", response.status)
    console.log("Response ok:", response.ok)

    if (!response.ok) {
      console.error(`Backend error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        {
          messages: [],
          error: `Backend server returned ${response.status}`,
        },
        { status: 200 },
      )
    }

    const contentType = response.headers.get("content-type")
    console.log("Content-Type:", contentType)

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error("Backend did not return JSON:", text.substring(0, 100))
      return NextResponse.json(
        {
          messages: [],
          error: "Backend server is not returning JSON",
        },
        { status: 200 },
      )
    }

    const messages = await response.json()
    console.log("Received messages count:", Array.isArray(messages) ? messages.length : "not an array")

    if (!Array.isArray(messages)) {
      console.error("Backend returned non-array:", messages)
      return NextResponse.json({ messages: [] }, { status: 200 })
    }

    return NextResponse.json({ messages })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Error fetching messages:", errorMessage)
    console.error("Full error:", error)
    return NextResponse.json(
      {
        messages: [],
        error: errorMessage,
      },
      { status: 200 },
    )
  }
}
