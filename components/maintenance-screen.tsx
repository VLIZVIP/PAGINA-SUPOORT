"use client"

import type React from "react"
import { Instagram, MessageCircle, Send } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef } from "react"

const translations = {
  en: {
    title: "Under Maintenance",
    description: "We're currently performing scheduled maintenance. Please check back soon!",
    followUs: "Follow us on social media for updates:",
    discord: "Join Discord",
    instagram: "Follow on Instagram",
    whatsapp: "Contact on WhatsApp",
    adminChat: "Admin Commands",
    placeholder: "Enter command...",
  },
  es: {
    title: "En Mantenimiento",
    description: "Estamos realizando mantenimiento programado. ¡Vuelve pronto!",
    followUs: "Síguenos en redes sociales para actualizaciones:",
    discord: "Únete a Discord",
    instagram: "Síguenos en Instagram",
    whatsapp: "Contacta por WhatsApp",
    adminChat: "Comandos de Admin",
    placeholder: "Ingresa comando...",
  },
}

interface MaintenanceScreenProps {
  language: "en" | "es"
}

export function MaintenanceScreen({ language }: MaintenanceScreenProps) {
  const t = translations[language]
  const [command, setCommand] = useState("")
  const [lastMessageCount, setLastMessageCount] = useState(0)
  const processingRef = useRef(false)

  useEffect(() => {
    const checkForMaintenanceOff = async () => {
      if (processingRef.current) return

      try {
        const response = await fetch("/api/messages/get")
        if (!response.ok) return

        const data = await response.json()
        const messages = data.messages || []

        // Only check if we have new messages
        if (messages.length > lastMessageCount) {
          // Check only the newest messages
          const newMessages = messages.slice(lastMessageCount)

          for (const message of newMessages) {
            if (message.trim() === "!mantenimiento off") {
              console.log("Maintenance OFF command detected, exiting maintenance mode")
              processingRef.current = true
              localStorage.setItem("vliz_maintenance", "false")
              window.location.reload()
              return
            }
          }

          setLastMessageCount(messages.length)
        }
      } catch (error) {
        console.error("Error checking for maintenance off:", error)
      }
    }

    // Poll every 2 seconds
    const interval = setInterval(checkForMaintenanceOff, 2000)
    // Check immediately on mount
    checkForMaintenanceOff()

    return () => clearInterval(interval)
  }, [lastMessageCount])

  const handleSendCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim()) return

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg: command.trim() }),
      })

      if (response.ok) {
        setCommand("")
        if (command.trim() === "!mantenimiento off") {
          console.log("Sent maintenance OFF command, waiting for detection...")
        }
      }
    } catch (error) {
      console.error("Error sending command:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative h-24 w-24 animate-pulse">
            <Image src="/logo.png" alt="Vliz" fill className="object-contain" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground animate-slide-in-left">{t.title}</h1>
          <p className="text-lg text-muted-foreground animate-slide-in-right">{t.description}</p>
        </div>

        {/* Social Media Links */}
        <div className="space-y-6 pt-8">
          <p className="text-sm text-muted-foreground">{t.followUs}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Discord */}
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white border-[#5865F2] hover:border-[#4752C4] transition-all duration-300 hover:scale-105"
            >
              <a href="https://discord.gg/vlizvip" target="_blank" rel="noopener noreferrer">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                {t.discord}
              </a>
            </Button>

            {/* Instagram */}
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white border-0 transition-all duration-300 hover:scale-105"
            >
              <a
                href="https://www.instagram.com/vliz_vip?igsh=MTRwcWtrcnBxM2oybw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
                {t.instagram}
              </a>
            </Button>

            {/* WhatsApp */}
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white border-[#25D366] hover:border-[#20BA5A] transition-all duration-300 hover:scale-105"
            >
              <a
                href="https://api.whatsapp.com/send/?phone=%2B18296922040&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" />
                {t.whatsapp}
              </a>
            </Button>
          </div>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-2 pt-8">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>

        <div className="pt-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-3">{t.adminChat}</p>
          <form onSubmit={handleSendCommand} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 bg-background/50 border-border/50"
            />
            <Button type="submit" size="icon" variant="outline" className="shrink-0 bg-transparent">
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground/70 mt-2">Send !mantenimiento off to exit maintenance mode</p>
        </div>
      </div>
    </div>
  )
}
