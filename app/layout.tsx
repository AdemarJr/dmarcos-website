import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  // <CHANGE> Updated metadata for Dmarcos
  title: "Dmarcos - Desembaraço Aduaneiro",
  description:
    "Mais de 40 anos resolvendo todas as fases da logística de desembaraço nas áreas portuária, armazenamento e expedição de mercadorias.",
  generator: "v0.app",
  /**
   * Favicon: `app/icon.png` (logo Dmarcos) — gerado automaticamente pelo Next.js.
   * Apple Touch: `app/apple-icon.png`.
   * SVG extra em `public/icon.svg` (opcional).
   */
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/apple-icon.png",
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
