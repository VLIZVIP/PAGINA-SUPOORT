import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NoContextMenu } from "@/components/no-context-menu"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vliz Support",
  description: "Professional support chat system by vliz_vip",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NoContextMenu>{children}</NoContextMenu>
      </body>
    </html>
  )
}
