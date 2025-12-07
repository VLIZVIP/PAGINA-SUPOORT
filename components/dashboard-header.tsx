"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Globe, Check } from "lucide-react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const translations = {
  en: {
    title: "Vliz Support Chat",
    welcome: "Welcome",
    logout: "Logout",
    language: "Language",
    english: "English",
    spanish: "Español",
  },
  es: {
    title: "Vliz Support Chat",
    welcome: "Bienvenido",
    logout: "Cerrar Sesión",
    language: "Idioma",
    english: "English",
    spanish: "Español",
  },
}

interface DashboardHeaderProps {
  username: string
  language: "en" | "es"
  onLanguageChange: (lang: "en" | "es") => void
}

export function DashboardHeader({ username, language, onLanguageChange }: DashboardHeaderProps) {
  const router = useRouter()
  const t = translations[language]

  const handleLogout = () => {
    localStorage.removeItem("vliz_auth")
    localStorage.removeItem("vliz_username")
    localStorage.removeItem("vliz_language")
    router.push("/login")
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50 shadow-lg animate-slide-in-left">
      <div className="container mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 rounded-xl overflow-hidden shadow-md ring-2 ring-primary/20">
            <Image src="/logo.png" alt="Vliz Logo" fill className="object-contain p-1" />
          </div>
          <div key={language} className="animate-fade-in">
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">{t.title}</h1>
            <p className="text-sm text-muted-foreground">
              {t.welcome}, <span className="text-primary font-medium">{username}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 gap-2"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{t.language}</span>
                <span className="sm:hidden font-semibold">{language.toUpperCase()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-card/95 backdrop-blur-xl border-border animate-fade-in">
              <DropdownMenuItem
                onClick={() => onLanguageChange("en")}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
              >
                <span className="flex-1">{t.english}</span>
                {language === "en" && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onLanguageChange("es")}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
              >
                <span className="flex-1">{t.spanish}</span>
                {language === "es" && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t.logout}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
