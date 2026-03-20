import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "")
const faviconUrl = `${basePath}/favicon.png`

export const metadata: Metadata = {
  // <CHANGE> Updated metadata for Dmarcos
  title: "Dmarcos - Desembaraço Aduaneiro",
  description:
    "Mais de 40 anos resolvendo todas as fases da logística de desembaraço nas áreas portuária, armazenamento e expedição de mercadorias.",
  generator: "v0.app",
  /** Favicon em `public/favicon.png` (respeita `NEXT_PUBLIC_BASE_PATH` na Hostinger) */
  icons: {
    icon: [{ url: faviconUrl, type: "image/png" }],
    apple: [{ url: faviconUrl, type: "image/png" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
