import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { LocationAccess } from "@/components/location-access"
import { AlertNotification } from "@/components/alert-notification"
import { AayuChatbot } from "@/components/aayu-chatbot"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pollution Monitoring System",
  description: "Real-time monitoring of air quality, water quality, UV index, and traffic pollution",
    generator: 'Green Tech Warriors'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
          <LocationAccess />
          <AlertNotification />
          <AayuChatbot />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'