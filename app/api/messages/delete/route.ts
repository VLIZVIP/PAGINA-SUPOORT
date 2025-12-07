import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { promises as fs } from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { index, chatType } = body

    console.log("Delete request received:", { index, chatType })

    if (typeof index !== "number" || index < 0) {
      return NextResponse.json({ error: "Invalid message index" }, { status: 400 })
    }

    // Verify user is authenticated
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("discord_session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dataDir = path.join(process.cwd(), "data")
    const messagesFile = path.join(dataDir, "messages.json")

    // Ensure data directory exists
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }

    // Read messages from file
    let messages: string[] = []
    try {
      const fileContent = await fs.readFile(messagesFile, "utf-8")
      messages = JSON.parse(fileContent)
    } catch (error) {
      console.log("No messages file found or error reading:", error)
      return NextResponse.json({ success: true })
    }

    if (!Array.isArray(messages)) {
      messages = []
    }

    console.log("Total messages before delete:", messages.length)

    let filteredMessages: string[] = []
    let messageToDelete: string | null = null

    if (chatType === "public") {
      // Get public messages only
      filteredMessages = messages.filter((msg) => msg.startsWith("[PUBLIC]"))
      if (index < filteredMessages.length) {
        messageToDelete = filteredMessages[index]
      }
    } else {
      // Get support messages (non-public, excluding maintenance commands)
      filteredMessages = messages.filter(
        (msg) =>
          !msg.startsWith("[PUBLIC]") && msg.trim() !== "!mantenimiento on" && msg.trim() !== "!mantenimiento off",
      )
      if (index < filteredMessages.length) {
        messageToDelete = filteredMessages[index]
      }
    }

    console.log("Filtered messages count:", filteredMessages.length)
    console.log("Message to delete:", messageToDelete)

    if (!messageToDelete) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    // Find and remove this message from the original array
    const actualIndex = messages.indexOf(messageToDelete)
    if (actualIndex !== -1) {
      messages.splice(actualIndex, 1)
      console.log("Message deleted at index:", actualIndex)
    } else {
      console.log("Message not found in original array")
      return NextResponse.json({ error: "Message not found in original array" }, { status: 404 })
    }

    // Write updated messages back to file
    await fs.writeFile(messagesFile, JSON.stringify(messages, null, 2), "utf-8")
    console.log("Messages file updated. New total:", messages.length)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}
