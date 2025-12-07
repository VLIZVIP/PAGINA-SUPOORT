"use client"

import { MessageSquare, Settings, Info, LogOut, Globe, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const translations = {
  en: {
    chat: "Chat",
    settings: "Settings",
    owner: "Owner",
    profile: "Profile",
    logout: "Logout",
    language: "Language",
    english: "English",
    spanish: "Spanish",
    userManagement: "User Management",
  },
  es: {
    chat: "Chat",
    settings: "Configuración",
    owner: "Propietario",
    profile: "Perfil",
    logout: "Cerrar Sesión",
    language: "Idioma",
    english: "Inglés",
    spanish: "Español",
    userManagement: "Gestión de Usuarios",
  },
}

const ADMIN_USER_IDS = ["998836610516914236", "452244710350782515"]

interface DashboardSidebarProps {
  username: string
  avatar: string | null
  userId: string // Added userId prop
  language: "en" | "es"
  activeView: "chat" | "settings" | "owner" | "profile" | "users"
  onViewChange: (view: "chat" | "settings" | "owner" | "profile" | "users") => void
  onLanguageChange: (lang: "en" | "es") => void
}

export function DashboardSidebar({
  username,
  avatar,
  userId, // Added userId
  language,
  activeView,
  onViewChange,
  onLanguageChange,
}: DashboardSidebarProps) {
  const router = useRouter()
  const t = translations[language]

  const handleLogout = async () => {
    await fetch("/api/auth/session", { method: "DELETE" })
    router.push("/")
  }

  const isAdmin = ADMIN_USER_IDS.includes(userId)

  const menuItems = [
    { id: "chat" as const, icon: MessageSquare, label: t.chat },
    { id: "profile" as const, icon: User, label: t.profile },
    ...(isAdmin ? [{ id: "users" as const, icon: Users, label: t.userManagement }] : []),
    { id: "settings" as const, icon: Settings, label: t.settings },
    { id: "owner" as const, icon: Info, label: t.owner },
  ]

  const avatarUrl = avatar || "/logo.png"

  return (
    <aside className="w-20 lg:w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-4 lg:p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 lg:h-12 lg:w-12 flex-shrink-0">
            <Image src="/logo.png" alt="Vliz" fill className="object-contain" />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-lg font-bold text-sidebar-foreground">Vliz Support</h1>
            <p className="text-xs text-muted-foreground">by vliz_vip</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 lg:p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? "default" : "ghost"}
            className={`w-full justify-start gap-3 ${
              activeView === item.id
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="hidden lg:inline">{item.label}</span>
          </Button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 lg:p-4 border-t border-sidebar-border space-y-2">
        {/* Language selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground">
              <Globe className="h-5 w-5 flex-shrink-0" />
              <span className="hidden lg:inline">{t.language}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onLanguageChange("en")} className="cursor-pointer">
              {language === "en" && "✓ "}
              {t.english}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLanguageChange("es")} className="cursor-pointer">
              {language === "es" && "✓ "}
              {t.spanish}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User info & logout */}
        <div className="hidden lg:flex items-center gap-3 p-3 bg-sidebar-accent rounded-lg">
          <div className="relative h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
            <Image src={avatarUrl || "/placeholder.svg"} alt={`${username} avatar`} fill className="object-cover" />
          </div>
          <p className="text-sm font-medium text-sidebar-foreground truncate">{username}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className="hidden lg:inline">{t.logout}</span>
        </Button>
      </div>
    </aside>
  )
}
