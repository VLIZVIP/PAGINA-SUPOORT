"use client"

import { useState, useEffect } from "react"
import {
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Palette,
  Moon,
  Sun,
  Sparkles,
  Trash2,
  Download,
  RotateCcw,
  Database,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ConnectionStatus } from "./connection-status"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SettingsPanelProps {
  language: "en" | "es"
  theme: "light" | "dark"
  soundEnabled: boolean
  onThemeChange: (theme: "light" | "dark") => void
  onSoundToggle: (enabled: boolean) => void
}

const translations = {
  en: {
    title: "Settings",
    theme: "Theme",
    themeLight: "Light Mode",
    themeDark: "Dark Mode",
    sound: "Sound Effects",
    soundDesc: "Play sound when receiving messages",
    notifications: "Notifications",
    notificationsDesc: "Show desktop notifications",
    appearance: "Appearance & Preferences",
    systemStatus: "System Status",
    chatManagement: "Chat Management",
    clearHistory: "Clear Chat History",
    clearHistoryDesc: "Delete all chat messages and history",
    clearHistoryConfirm: "Are you sure you want to clear all chat history?",
    clearHistoryWarning: "This action cannot be undone. All messages will be permanently deleted.",
    exportChat: "Export Chat History",
    exportChatDesc: "Download all chat messages as a file",
    resetSettings: "Reset All Settings",
    resetSettingsDesc: "Restore default settings",
    resetConfirm: "Are you sure you want to reset all settings?",
    resetWarning: "This will restore all settings to their default values.",
    clearMaintenance: "Clear Maintenance Mode",
    clearMaintenanceDesc: "Reset maintenance mode flag",
    dataManagement: "Data Management",
    messageCount: "Total Messages",
    storageUsed: "Storage Used",
    confirm: "Confirm",
    cancel: "Cancel",
    cleared: "Chat history cleared successfully!",
    exported: "Chat history exported successfully!",
    reset: "Settings reset successfully!",
    maintenanceCleared: "Maintenance mode cleared!",
  },
  es: {
    title: "Configuración",
    theme: "Tema",
    themeLight: "Modo Claro",
    themeDark: "Modo Oscuro",
    sound: "Efectos de Sonido",
    soundDesc: "Reproducir sonido al recibir mensajes",
    notifications: "Notificaciones",
    notificationsDesc: "Mostrar notificaciones de escritorio",
    appearance: "Apariencia y Preferencias",
    systemStatus: "Estado del Sistema",
    chatManagement: "Gestión de Chat",
    clearHistory: "Limpiar Historial",
    clearHistoryDesc: "Eliminar todos los mensajes del chat",
    clearHistoryConfirm: "¿Estás seguro de que quieres limpiar todo el historial?",
    clearHistoryWarning: "Esta acción no se puede deshacer. Todos los mensajes serán eliminados permanentemente.",
    exportChat: "Exportar Historial",
    exportChatDesc: "Descargar todos los mensajes como archivo",
    resetSettings: "Restablecer Configuración",
    resetSettingsDesc: "Restaurar configuración predeterminada",
    resetConfirm: "¿Estás seguro de que quieres restablecer toda la configuración?",
    resetWarning: "Esto restaurará toda la configuración a sus valores predeterminados.",
    clearMaintenance: "Limpiar Modo Mantenimiento",
    clearMaintenanceDesc: "Restablecer bandera de mantenimiento",
    dataManagement: "Gestión de Datos",
    messageCount: "Total de Mensajes",
    storageUsed: "Almacenamiento Usado",
    confirm: "Confirmar",
    cancel: "Cancelar",
    cleared: "¡Historial limpiado exitosamente!",
    exported: "¡Historial exportado exitosamente!",
    reset: "¡Configuración restablecida exitosamente!",
    maintenanceCleared: "¡Modo mantenimiento limpiado!",
  },
}

export function SettingsPanel({ language, theme, soundEnabled, onThemeChange, onSoundToggle }: SettingsPanelProps) {
  const t = translations[language]
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [messageCount, setMessageCount] = useState(0)
  const [storageSize, setStorageSize] = useState("0 KB")

  useEffect(() => {
    const savedNotifications = localStorage.getItem("notificationsEnabled")
    if (savedNotifications) setNotificationsEnabled(savedNotifications === "true")

    const sentMessages = localStorage.getItem("vliz_sent_messages")
    if (sentMessages) {
      try {
        const messages = JSON.parse(sentMessages)
        setMessageCount(messages.length)
      } catch (e) {
        setMessageCount(0)
      }
    }

    // Calculate approximate storage size
    let totalSize = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith("vliz_")) {
        totalSize += localStorage[key].length + key.length
      }
    }
    setStorageSize(`${(totalSize / 1024).toFixed(2)} KB`)
  }, [])

  const handleNotificationsToggle = (checked: boolean) => {
    setNotificationsEnabled(checked)
    localStorage.setItem("notificationsEnabled", checked.toString())

    if (checked && "Notification" in window) {
      Notification.requestPermission()
    }
  }

  const handleClearHistory = async () => {
    try {
      console.log("Clearing chat history...")

      const response = await fetch("/api/messages/clear", {
        method: "POST",
      })

      if (!response.ok) {
        console.error("Failed to clear messages on server")
      } else {
        console.log("Server messages cleared successfully")
      }

      localStorage.removeItem("vliz_sent_messages")
      localStorage.removeItem("vliz_last_message_count")
      setMessageCount(0)

      console.log("Local storage cleared, reloading page...")

      window.location.reload()
    } catch (error) {
      console.error("Error clearing history:", error)
      localStorage.removeItem("vliz_sent_messages")
      localStorage.removeItem("vliz_last_message_count")
      setMessageCount(0)
      window.location.reload()
    }
  }

  const handleExportChat = async () => {
    try {
      const response = await fetch("/api/messages/get")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()

      const timestamp = new Date().toLocaleString()
      let content = `Vliz Support Chat Export - ${timestamp}\n`
      content += "=".repeat(50) + "\n\n"

      const messages: string[] = data.messages || []
      messages.forEach((msg, index) => {
        content += `[${index + 1}] ${msg}\n\n`
      })

      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `vliz-chat-export-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting chat:", error)
    }
  }

  const handleResetSettings = () => {
    localStorage.removeItem("theme")
    localStorage.removeItem("soundEnabled")
    localStorage.removeItem("notificationsEnabled")
    localStorage.removeItem("vliz_language")
    onThemeChange("dark")
    onSoundToggle(true)
    setNotificationsEnabled(true)
    window.location.reload()
  }

  const handleClearMaintenance = () => {
    localStorage.removeItem("vliz_maintenance")
    localStorage.removeItem("vliz_last_message_count")
    window.location.reload()
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="space-y-2 animate-fade-in">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
            {t.title}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground pl-11">{t.appearance}</p>
      </div>

      {/* System Status */}
      <div className="space-y-3 animate-slide-in-left" style={{ animationDelay: "0.1s" }}>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t.systemStatus}</h3>
        <ConnectionStatus language={language} />
      </div>

      {/* Theme */}
      <div className="space-y-3 animate-slide-in-left" style={{ animationDelay: "0.2s" }}>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t.theme}</h3>
        <Card className="p-6 bg-gradient-to-br from-black/40 to-black/20 border-amber-500/20 backdrop-blur-sm hover:border-amber-500/40 transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-foreground">{t.theme}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className={`h-28 flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                  theme === "light"
                    ? "bg-gradient-to-br from-amber-400 to-amber-600 text-black border-amber-400 shadow-lg shadow-amber-500/50"
                    : "border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/5"
                }`}
                onClick={() => onThemeChange("light")}
              >
                <Sun className={`w-8 h-8 ${theme === "light" ? "animate-spin-slow" : ""}`} />
                <span className="text-sm font-medium">{t.themeLight}</span>
              </Button>

              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className={`h-28 flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-amber-400 to-amber-600 text-black border-amber-400 shadow-lg shadow-amber-500/50"
                    : "border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/5"
                }`}
                onClick={() => onThemeChange("dark")}
              >
                <Moon className={`w-8 h-8 ${theme === "dark" ? "animate-pulse" : ""}`} />
                <span className="text-sm font-medium">{t.themeDark}</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Sound */}
      <div className="space-y-3 animate-slide-in-left" style={{ animationDelay: "0.3s" }}>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t.sound}</h3>
        <Card className="p-6 bg-gradient-to-br from-black/40 to-black/20 border-amber-500/20 backdrop-blur-sm hover:border-amber-500/40 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  soundEnabled
                    ? "bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30"
                    : "bg-gray-700"
                }`}
              >
                {soundEnabled ? (
                  <Volume2 className="w-6 h-6 text-black" />
                ) : (
                  <VolumeX className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <Label
                  htmlFor="sound-toggle"
                  className="text-base font-semibold cursor-pointer group-hover:text-amber-400 transition-colors"
                >
                  {t.sound}
                </Label>
                <p className="text-sm text-muted-foreground">{t.soundDesc}</p>
              </div>
            </div>
            <Switch
              id="sound-toggle"
              checked={soundEnabled}
              onCheckedChange={onSoundToggle}
              className="data-[state=checked]:bg-amber-500"
            />
          </div>
        </Card>
      </div>

      {/* Notifications */}
      <div className="space-y-3 animate-slide-in-left" style={{ animationDelay: "0.4s" }}>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t.notifications}</h3>
        <Card className="p-6 bg-gradient-to-br from-black/40 to-black/20 border-amber-500/20 backdrop-blur-sm hover:border-amber-500/40 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  notificationsEnabled
                    ? "bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30"
                    : "bg-gray-700"
                }`}
              >
                {notificationsEnabled ? (
                  <Bell className="w-6 h-6 text-black" />
                ) : (
                  <BellOff className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <Label
                  htmlFor="notifications-toggle"
                  className="text-base font-semibold cursor-pointer group-hover:text-amber-400 transition-colors"
                >
                  {t.notifications}
                </Label>
                <p className="text-sm text-muted-foreground">{t.notificationsDesc}</p>
              </div>
            </div>
            <Switch
              id="notifications-toggle"
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationsToggle}
              className="data-[state=checked]:bg-amber-500"
            />
          </div>
        </Card>
      </div>

      <div className="space-y-3 animate-slide-in-left" style={{ animationDelay: "0.5s" }}>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t.dataManagement}</h3>
        <Card className="p-6 bg-gradient-to-br from-black/40 to-black/20 border-amber-500/20 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-foreground">{t.dataManagement}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-black/20 rounded-lg">
                <p className="text-muted-foreground">{t.messageCount}</p>
                <p className="text-2xl font-bold text-amber-400">{messageCount}</p>
              </div>
              <div className="p-3 bg-black/20 rounded-lg">
                <p className="text-muted-foreground">{t.storageUsed}</p>
                <p className="text-2xl font-bold text-amber-400">{storageSize}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-3 animate-slide-in-left" style={{ animationDelay: "0.6s" }}>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t.chatManagement}</h3>

        <Card className="p-6 bg-gradient-to-br from-black/40 to-black/20 border-amber-500/20 backdrop-blur-sm hover:border-amber-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <Label className="text-base font-semibold">{t.clearHistory}</Label>
                <p className="text-sm text-muted-foreground">{t.clearHistoryDesc}</p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t.clearHistory}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.clearHistoryConfirm}</AlertDialogTitle>
                  <AlertDialogDescription>{t.clearHistoryWarning}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearHistory} className="bg-red-500 hover:bg-red-600">
                    {t.confirm}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-black/40 to-black/20 border-amber-500/20 backdrop-blur-sm hover:border-amber-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Download className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <Label className="text-base font-semibold">{t.exportChat}</Label>
                <p className="text-sm text-muted-foreground">{t.exportChatDesc}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportChat}>
              <Download className="w-4 h-4 mr-2" />
              {t.exportChat}
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-black/40 to-black/20 border-amber-500/20 backdrop-blur-sm hover:border-amber-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <Label className="text-base font-semibold">{t.resetSettings}</Label>
                <p className="text-sm text-muted-foreground">{t.resetSettingsDesc}</p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t.resetSettings}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.resetConfirm}</AlertDialogTitle>
                  <AlertDialogDescription>{t.resetWarning}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetSettings}>{t.confirm}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-black/40 to-black/20 border-amber-500/20 backdrop-blur-sm hover:border-amber-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <Label className="text-base font-semibold">{t.clearMaintenance}</Label>
                <p className="text-sm text-muted-foreground">{t.clearMaintenanceDesc}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleClearMaintenance}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              {t.clearMaintenance}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
