import type React from "react"
import type { Metadata } from "next"
import { Open_Sans, Anton } from "next/font/google"
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { AuthProvider } from "@/contexts/AuthContext"
import { QueryProvider } from "@/lib/providers/QueryProvider"
import { GoogleAuthProvider } from "@/components/auth/GoogleAuthProvider"
import { MobileNavigation } from "@/components/MobileNavigation"
import { Toaster } from "sonner"
import "./globals.css"

const openSans = Open_Sans({ 
  subsets: ["latin"],
  display: 'swap',
})
const anton = Anton({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: 'swap',
})

export const metadata: Metadata = {
  title: "MOTIV - Discover Lagos Events",
  description: "Unfiltered Lagos events. Curated events, no tickets lost.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openSans.className} ${anton.variable} ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <GoogleAuthProvider>
              {children}
              <MobileNavigation />
              <Toaster 
                position="top-right" 
                theme="dark"
                richColors
              />
            </GoogleAuthProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
