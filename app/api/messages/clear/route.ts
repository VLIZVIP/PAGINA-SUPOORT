import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const MESSAGES_FILE = path.join(process.cwd(), "data", "messages.txt")

export async function POST() {
  try {
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "data")
    await fs.mkdir(dataDir, { recursive: true })

    // Clear the messages file
    await fs.writeFile(MESSAGES_FILE, "", "utf-8")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error clearing messages:", error)
    return NextResponse.json({ error: "Failed to clear messages" }, { status: 500 })
  }
}
