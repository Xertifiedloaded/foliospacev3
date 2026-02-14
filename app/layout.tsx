import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

import { openSans, nunito, bebas, montserrat } from "@/lib/fonts"
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from "@next/third-parties/google"

export const metadata: Metadata = {
  metadataBase: new URL("https://foliospace.live"), 

  title: {
    default: "FolioSpace - Portfolio Manager",
    template: "%s | FolioSpace",
  },

  description:
    "Create, manage, and export multiple professional CVs with FolioSpace.",

  keywords: [
    "CV builder",
    "Resume builder",
    "Professional CV",
    "Online resume",
    "FolioSpace",
  ],

  authors: [{ name: "FolioSpace" }],
  creator: "FolioSpace",
  publisher: "FolioSpace",


  icons: {
    icon: [
      { url: "/logo.svg", sizes: "48x48", type: "image/x-icon" },
    ],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },

  openGraph: {
    title: "FolioSpace - Portfolio Manager",
    description:
      "Create, manage, and export multiple professional CVs with FolioSpace.",
    url: "https://foliospace.live",
    siteName: "FolioSpace",
    images: [
      {
        url: "https://foliospace.live/og-image.svg",
        width: 1200,
        height: 630,
        alt: "FolioSpace - Portfolio Manager",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "FolioSpace - Portfolio Manager",
    description:
      "Create, manage, and export multiple professional CVs with FolioSpace.",
    images: ["/logo.svg"],
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${montserrat.variable}
          ${openSans.variable}
          ${nunito.variable}
          ${bebas.variable}
          font-sans antialiased bg-background text-foreground
        `}
      >
        {children}
        {process.env.GoogleAnalytics && (
          <GoogleAnalytics gaId={process.env.GoogleAnalytics} />
        )}
        <Analytics />
      </body>
    </html>
  )
}


