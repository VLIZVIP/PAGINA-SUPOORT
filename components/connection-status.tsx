"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, AlertTriangle, Activity } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ConnectionStatusProps {
  language: "en" | "es"
}

const translations = {
  en: {
    title: "System Status",
    online: "Online",
    offline: "Offline",
    error: "Connection Error",
    checking: "Checking...",
    serverConnected: "Server Connected",
    serverDisconnected: "Server Disconnected",
    lastCheck: "Last check",
    backendUrl: "Backend",
    backendNotRunning: "Backend server not responding",
  },
  es: {
    title: "Estado del Sistema",
    online: "En Línea",
    offline: "Desconectado",
    error: "Error de Conexión",
    checking: "Verificando...",
    serverConnected: "Servidor Conectado",
    serverDisconnected: "Servidor Desconectado",
    lastCheck: "Última verificación",
    backendUrl: "Backend",
    backendNotRunning: "Servidor backend no responde",
  },
}

export function ConnectionStatus({ language }: ConnectionStatusProps) {
  const [status, setStatus] = useState<"online" | "offline" | "error" | "checking">("checking")
  const [lastCheck, setLastCheck] = useState<Date>(new Date())
  const [backendUrl, setBackendUrl] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const t = translations[language]

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch("/api/health")
        const data = await response.json()

        if (data.connected && data.status === "online") {
          setStatus("online")
          setErrorMessage("")
        } else if (data.status === "error") {
          setStatus("error")
          setErrorMessage(data.error || t.backendNotRunning)
        } else {
          setStatus("offline")
          setErrorMessage(t.backendNotRunning)
        }

        setBackendUrl(data.backendUrl || "")
      } catch (error) {
        setStatus("offline")
        setErrorMessage(t.backendNotRunning)
      }
      setLastCheck(new Date())
    }

    checkConnection()
    const interval = setInterval(checkConnection, 5000)
    return () => clearInterval(interval)
  }, [t.backendNotRunning])

  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return {
          icon: <Wifi className="w-5 h-5" />,
          text: t.online,
          color: "text-green-400",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30",
          pulseColor: "bg-green-400",
        }
      case "offline":
        return {
          icon: <WifiOff className="w-5 h-5" />,
          text: t.offline,
          color: "text-red-400",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          pulseColor: "bg-red-400",
        }
      case "error":
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          text: t.error,
          color: "text-orange-400",
          bgColor: "bg-orange-500/10",
          borderColor: "border-orange-500/30",
          pulseColor: "bg-orange-400",
        }
      default:
        return {
          icon: <Activity className="w-5 h-5 animate-pulse" />,
          text: t.checking,
          color: "text-amber-400",
          bgColor: "bg-amber-500/10",
          borderColor: "border-amber-500/30",
          pulseColor: "bg-amber-400",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Card
      className={`p-4 ${config.bgColor} border ${config.borderColor} backdrop-blur-sm transition-all duration-500 ease-out`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={`${config.color} transition-all duration-500`}>{config.icon}</div>
          {status === "online" && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.pulseColor} opacity-75`}
              ></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${config.pulseColor}`}></span>
            </span>
          )}
        </div>
        <div className="flex-1">
          <p className={`font-semibold ${config.color} transition-all duration-500`}>{config.text}</p>
          <p className="text-xs text-muted-foreground">
            {t.lastCheck}: {lastCheck.toLocaleTimeString(language === "es" ? "es-ES" : "en-US")}
          </p>
          {backendUrl && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {t.backendUrl}: {backendUrl}
            </p>
          )}
          {errorMessage && status !== "online" && <p className="text-xs text-red-400 mt-1">{errorMessage}</p>}
        </div>
      </div>
    </Card>
  )
}
