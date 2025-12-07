"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getDiscordAuthUrl } from "@/lib/discord-auth"
import { Loader2, Globe } from "lucide-react"
import Image from "next/image"

const translations = {
  en: {
    title: "Vliz Support ",
    titleChat: "Chat",
    description: "Sign in to access your support dashboard",
    signInWithDiscord: "Sign in with Discord",
    signingIn: "Signing in...",
    connectWithUs: "Connect with us",
    poweredBy: "Powered by vliz_vip",
    language: "Language",
    english: "English",
    spanish: "Español",
    authError: "Authentication failed. Please try again.",
    genericError: "An error occurred.",
    notVerified: "Your Discord account is not verified to access this dashboard. Please contact an administrator.",
  },
  es: {
    title: "Vliz Support ",
    titleChat: "Chat",
    description: "Inicia sesión para acceder a tu panel de soporte",
    signInWithDiscord: "Iniciar sesión con Discord",
    signingIn: "Iniciando sesión...",
    connectWithUs: "Conéctate con nosotros",
    poweredBy: "Desarrollado por vliz_vip",
    language: "Idioma",
    english: "English",
    spanish: "Español",
    authError: "Error de autenticación. Por favor intenta de nuevo.",
    genericError: "Ocurrió un error.",
    notVerified:
      "Tu cuenta de Discord no está verificada para acceder a este panel. Por favor contacta a un administrador.",
  },
}

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState<"en" | "es">("es")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("vliz_language") as "en" | "es"
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session")
        if (response.ok) {
          router.replace("/dashboard")
          return
        }
      } catch (err) {
        console.error("Session check error:", err)
      }
      setIsLoading(false)
    }

    const errorParam = searchParams.get("error")
    const messageParam = searchParams.get("message")
    if (errorParam) {
      if (errorParam === "not_verified") {
        setError(
          messageParam ||
            (language === "en"
              ? "Your Discord account is not verified to access this dashboard. Please contact an administrator."
              : "Tu cuenta de Discord no está verificada para acceder a este panel. Por favor contacta a un administrador."),
        )
      } else if (errorParam === "auth_failed") {
        setError(
          language === "en"
            ? "Authentication failed. Please try again."
            : "Error de autenticación. Por favor intenta de nuevo.",
        )
      } else {
        setError(language === "en" ? "An error occurred." : "Ocurrió un error.")
      }
    }

    checkSession()
  }, [router, searchParams, language])

  const handleLanguageChange = (newLang: "en" | "es") => {
    setLanguage(newLang)
    localStorage.setItem("vliz_language", newLang)
  }

  const handleDiscordLogin = () => {
    setIsSigningIn(true)
    setTimeout(() => {
      window.location.href = getDiscordAuthUrl()
    }, 2000)
  }

  const t = translations[language]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-black border-zinc-800">
        <CardHeader className="text-center space-y-4 relative">
          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="h-4 w-4 text-yellow-500" />
                  <span className="text-yellow-500">{language.toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleLanguageChange("en")} className="cursor-pointer">
                  {language === "en" && "✓ "}
                  {t.english}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("es")} className="cursor-pointer">
                  {language === "es" && "✓ "}
                  {t.spanish}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex justify-center">
            <div className="relative h-20 w-20 rounded-2xl border border-zinc-800 p-3 bg-zinc-900/50">
              <Image src="/logo.png" alt="Vliz" fill className="object-contain p-2" />
            </div>
          </div>

          <div>
            <CardTitle className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                {t.title}
                {t.titleChat}
              </span>
            </CardTitle>
            <CardDescription className="text-zinc-400 mt-2">{t.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleDiscordLogin}
            disabled={isSigningIn}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {isSigningIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t.signingIn}
              </>
            ) : (
              <>
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                {t.signInWithDiscord}
              </>
            )}
          </Button>

          <div className="pt-4 border-t border-zinc-800">
            <p className="text-center text-sm text-zinc-400 mb-4">{t.connectWithUs}</p>
            <div className="flex justify-center gap-4">
              <a
                href="https://discord.gg/vlizvip"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-12 w-12 rounded-full bg-[#5865F2] hover:bg-[#4752C4] transition-colors"
              >
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=%2B18296922040&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-12 w-12 rounded-full bg-[#25D366] hover:bg-[#20BA5A] transition-colors"
              >
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-500">{t.poweredBy}</p>
        </CardContent>
      </Card>
    </div>
  )
}
