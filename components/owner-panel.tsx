"use client"

import { Instagram, MessageCircle, Crown, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"

interface OwnerPanelProps {
  language: "en" | "es"
}

const translations = {
  en: {
    title: "Owner",
    subtitle: "Connect with us on social media",
    instagram: "Instagram",
    discord: "Discord",
    whatsapp: "WhatsApp",
    footer: "Developed by vliz_vip",
    followUs: "Follow us",
    joinServer: "Join our server",
    chatWithUs: "Chat with us",
  },
  es: {
    title: "Propietario",
    subtitle: "Conéctate con nosotros en redes sociales",
    instagram: "Instagram",
    discord: "Discord",
    whatsapp: "WhatsApp",
    footer: "Desarrollado por vliz_vip",
    followUs: "Síguenos",
    joinServer: "Únete a nuestro servidor",
    chatWithUs: "Chatea con nosotros",
  },
}

export function OwnerPanel({ language }: OwnerPanelProps) {
  const t = translations[language]

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="space-y-2 animate-fade-in">
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-amber-400 animate-pulse" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
            {t.title}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground pl-11">{t.subtitle}</p>
      </div>

      <div className="space-y-4">
        <Card className="p-6 bg-gradient-to-br from-black/40 to-black/20 border-amber-500/20 backdrop-blur-sm hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 group animate-slide-in-left">
          <a
            href="https://www.instagram.com/vliz_vip?igsh=MTRwcWtrcnBxM2oybw%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
              <Instagram className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-amber-400 transition-colors">
                  {t.instagram}
                </h3>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-muted-foreground">@vliz_vip</p>
              <p className="text-xs text-amber-400/70 mt-1">{t.followUs}</p>
            </div>
          </a>
        </Card>

        <Card
          className="p-6 bg-gradient-to-br from-black/40 to-black/20 border-amber-500/20 backdrop-blur-sm hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 group animate-slide-in-left"
          style={{ animationDelay: "0.1s" }}
        >
          <a
            href="https://discord.gg/vlizvip"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#5865F2] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-amber-400 transition-colors">
                  {t.discord}
                </h3>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-muted-foreground">Vliz VIP Server</p>
              <p className="text-xs text-amber-400/70 mt-1">{t.joinServer}</p>
            </div>
          </a>
        </Card>

        <Card
          className="p-6 bg-gradient-to-br from-black/40 to-black/20 border-amber-500/20 backdrop-blur-sm hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 group animate-slide-in-left"
          style={{ animationDelay: "0.2s" }}
        >
          <a
            href="https://api.whatsapp.com/send/?phone=%2B18296922040&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#25D366] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-amber-400 transition-colors">
                  {t.whatsapp}
                </h3>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-muted-foreground">+1 (829) 692-2040</p>
              <p className="text-xs text-amber-400/70 mt-1">{t.chatWithUs}</p>
            </div>
          </a>
        </Card>
      </div>

      <div className="pt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <Card className="p-6 bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-red-500/20 border-amber-500/40 backdrop-blur-sm">
          <p className="text-center text-sm font-medium bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            {t.footer}
          </p>
        </Card>
      </div>
    </div>
  )
}
