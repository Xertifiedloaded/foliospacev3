import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import { openSans, nunito, bebas, montserrat } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "FolioSpace - Multi-CV Manager",
  description: "Create, manage, and export multiple professional CVs with FolioSpace",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
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
        `}>{children}</body>
    </html>
  )
}
