import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getAllowedUsers, saveAllowedUsers, isUserAdmin, type AllowedUser } from "@/lib/allowed-users"

async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("discord_session")

  if (!sessionCookie) {
    return null
  }

  try {
    const sessionData = Buffer.from(sessionCookie.value, "base64").toString("utf-8")
    const session = JSON.parse(sessionData)
    return { id: session.userId, username: session.username, avatar: session.avatar }
  } catch (error) {
    console.error("Error parsing session:", error)
    return null
  }
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    console.log("Current user:", currentUser)

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    if (!isUserAdmin(currentUser.id)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    const users = getAllowedUsers()
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching allowed users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !isUserAdmin(currentUser.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { userId } = await request.json()

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const users = getAllowedUsers()

    // Check if user already exists
    if (users.some((user) => user.id === userId)) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const newUser: AllowedUser = {
      id: userId,
      isDefault: false,
      addedAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveAllowedUsers(users)

    return NextResponse.json({ success: true, user: newUser })
  } catch (error) {
    console.error("Error adding user:", error)
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !isUserAdmin(currentUser.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { userId } = await request.json()

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const users = getAllowedUsers()
    const userToDelete = users.find((user) => user.id === userId)

    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (userToDelete.isDefault) {
      return NextResponse.json({ error: "Cannot delete default user" }, { status: 403 })
    }

    const updatedUsers = users.filter((user) => user.id !== userId)
    saveAllowedUsers(updatedUsers)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
