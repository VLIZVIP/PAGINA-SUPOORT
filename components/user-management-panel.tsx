"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Shield, Loader2 } from "lucide-react"

const translations = {
  en: {
    title: "User Management",
    description: "Manage Discord users who can access the dashboard",
    addUser: "Add User",
    userId: "Discord User ID",
    userIdPlaceholder: "Enter Discord user ID",
    add: "Add",
    delete: "Delete",
    defaultUser: "Default User (Cannot be deleted)",
    addedAt: "Added",
    noUsers: "No users added yet",
    userAdded: "User added successfully",
    userDeleted: "User deleted successfully",
    errorAdding: "Error adding user",
    errorDeleting: "Error deleting user",
    errorFetching: "Error fetching users",
    userExists: "User already exists",
    invalidId: "Invalid user ID",
  },
  es: {
    title: "Gestión de Usuarios",
    description: "Gestiona los usuarios de Discord que pueden acceder al dashboard",
    addUser: "Agregar Usuario",
    userId: "ID de Usuario de Discord",
    userIdPlaceholder: "Ingresa el ID de usuario de Discord",
    add: "Agregar",
    delete: "Eliminar",
    defaultUser: "Usuario Predeterminado (No se puede eliminar)",
    addedAt: "Agregado",
    noUsers: "No hay usuarios agregados aún",
    userAdded: "Usuario agregado exitosamente",
    userDeleted: "Usuario eliminado exitosamente",
    errorAdding: "Error al agregar usuario",
    errorDeleting: "Error al eliminar usuario",
    errorFetching: "Error al obtener usuarios",
    userExists: "El usuario ya existe",
    invalidId: "ID de usuario inválido",
  },
}

interface AllowedUser {
  id: string
  isDefault: boolean
  addedAt?: string
}

interface UserManagementPanelProps {
  language: "en" | "es"
  onShowToast: (message: string, type: "success" | "error" | "info") => void
}

export function UserManagementPanel({ language, onShowToast }: UserManagementPanelProps) {
  const [users, setUsers] = useState<AllowedUser[]>([])
  const [newUserId, setNewUserId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const t = translations[language]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/allowed-users")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error("Error fetching users:", error)
      onShowToast(t.errorFetching, "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddUser = async () => {
    if (!newUserId.trim()) {
      onShowToast(t.invalidId, "error")
      return
    }

    setIsAdding(true)
    try {
      const response = await fetch("/api/allowed-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: newUserId.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to add user")
      }

      onShowToast(t.userAdded, "success")
      setNewUserId("")
      fetchUsers()
    } catch (error) {
      console.error("Error adding user:", error)
      onShowToast(error instanceof Error ? error.message : t.errorAdding, "error")
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch("/api/allowed-users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete user")
      }

      onShowToast(t.userDeleted, "success")
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      onShowToast(error instanceof Error ? error.message : t.errorDeleting, "error")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
        <p className="text-muted-foreground mt-1">{t.description}</p>
      </div>

      {/* Add User Form */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {t.addUser}
        </h3>
        <div className="space-y-2">
          <Label htmlFor="userId">{t.userId}</Label>
          <div className="flex gap-2">
            <Input
              id="userId"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              placeholder={t.userIdPlaceholder}
              className="flex-1"
              disabled={isAdding}
            />
            <Button onClick={handleAddUser} disabled={isAdding || !newUserId.trim()}>
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span className="ml-2">{t.add}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Allowed Users</h3>
        {users.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">{t.noUsers}</p>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-background border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {user.isDefault && <Shield className="h-5 w-5 text-primary" />}
                  <div>
                    <p className="font-mono text-sm font-medium text-foreground">{user.id}</p>
                    {user.isDefault && <p className="text-xs text-muted-foreground">{t.defaultUser}</p>}
                    {user.addedAt && (
                      <p className="text-xs text-muted-foreground">
                        {t.addedAt}: {new Date(user.addedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                {!user.isDefault && (
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
