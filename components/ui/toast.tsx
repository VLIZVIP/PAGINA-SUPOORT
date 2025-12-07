"use client"

import * as React from "react"
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  id: string
  message: string
  type?: "success" | "error" | "info"
  duration?: number
}

export function Toast({
  message,
  type = "info",
  onClose,
}: { message: string; type?: "success" | "error" | "info"; onClose: () => void }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const Icon = type === "success" ? CheckCircle2 : type === "error" ? AlertCircle : Info

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-xl border animate-slide-in-right min-w-[320px] max-w-[420px]",
        type === "success" && "bg-primary/95 border-primary/50 text-primary-foreground",
        type === "error" && "bg-destructive/95 border-destructive/50 text-destructive-foreground",
        type === "info" && "bg-card/95 border-border text-foreground",
      )}
    >
      <div className="flex-shrink-0">
        <Icon className="h-5 w-5 animate-pulse" />
      </div>
      <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, removeToast }: { toasts: ToastProps[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <div className="pointer-events-auto flex flex-col gap-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </div>
  )
}
