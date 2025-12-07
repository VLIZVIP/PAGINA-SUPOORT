// Admin Discord user IDs who can manage users
export const ADMIN_USER_IDS = ["998836610516914236", "452244710350782515"]

// Default allowed Discord user IDs
export const DEFAULT_ALLOWED_USERS = [
  { id: "998836610516914236", isDefault: true },
  { id: "452244710350782515", isDefault: true },
]

export interface AllowedUser {
  id: string
  isDefault: boolean
  addedAt?: string
}

export function getAllowedUsers(): AllowedUser[] {
  if (typeof window === "undefined") {
    // Server-side: read from file system
    const fs = require("fs")
    const path = require("path")
    const filePath = path.join(process.cwd(), "data", "allowed-users.json")

    try {
      const dataDir = path.join(process.cwd(), "data")
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }

      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf-8")
        return JSON.parse(data)
      } else {
        fs.writeFileSync(filePath, JSON.stringify(DEFAULT_ALLOWED_USERS, null, 2))
        return DEFAULT_ALLOWED_USERS
      }
    } catch (error) {
      console.error("Error reading allowed users:", error)
    }
  }

  return DEFAULT_ALLOWED_USERS
}

export function saveAllowedUsers(users: AllowedUser[]): void {
  const fs = require("fs")
  const path = require("path")
  const dataDir = path.join(process.cwd(), "data")
  const filePath = path.join(dataDir, "allowed-users.json")

  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error("Error saving allowed users:", error)
    throw error
  }
}

export function isUserAllowed(userId: string): boolean {
  const allowedUsers = getAllowedUsers()
  return allowedUsers.some((user) => user.id === userId)
}

export function isUserAdmin(userId: string): boolean {
  return ADMIN_USER_IDS.includes(userId)
}
