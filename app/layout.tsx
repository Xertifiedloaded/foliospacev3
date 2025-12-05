import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Analytics } from '@vercel/analytics/next'
import { openSans, nunito, bebas, montserrat } from "@/lib/fonts";
import { GoogleAnalytics } from '@next/third-parties/google'
export const metadata: Metadata = {
  title: "FolioSpace - Multi-CV Manager",
  description: "Create, manage, and export multiple professional CVs with FolioSpace",
  icons: {
    icon: [
      {
        url: "/logo.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/logo.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`
          ${montserrat.variable}
          ${openSans.variable}
          ${nunito.variable}
          ${bebas.variable}
          font-sans antialiased bg-background text-foreground
        `}>{children}
               <GoogleAnalytics gaId={process.env.GoogleAnalytics} />
          <Analytics />
        </body>
    </html>
  )
}
