"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { useState, useEffect } from "react"
import InitialLoadingScreen from "@/components/initial-loading-screen"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/context/theme-provider"
import ChatWidget from "@/components/ChatWidget"
import "./globals.css"


const inter = Inter({ subsets: ["latin"] })



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Hide loading screen after a delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000) // Adjust time as needed
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="techinsight-theme">
          {mounted && <InitialLoadingScreen onLoadingComplete={() => setLoading(false)} />}
          <div className={loading ? 'invisible' : 'visible'}>
            {children}
          </div>
          <Toaster />
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  )
}

// Metadata needs to be in a separate file in app router when using client components
// in the root layout - you can add this in a separate file called metadata.ts