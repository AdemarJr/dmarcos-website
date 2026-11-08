import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "")
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://dmarcos.com.br").replace(/\/$/, "")
const faviconUrl = `${basePath}/favicon.png`

const siteDescription =
  "Mais de 40 anos resolvendo todas as fases da logística de desembaraço nas áreas portuária, armazenamento e expedição de mercadorias. Importação, exportação e internação em Manaus/AM."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dmarcos — Desembaraço Aduaneiro em Manaus",
    template: "%s | Dmarcos",
  },
  description: siteDescription,
  applicationName: "Dmarcos",
  keywords: [
    "desembaraço aduaneiro",
    "importação",
    "exportação",
    "Manaus",
    "ZFM",
    "SUFRAMA",
    "SISCOMEX",
    "logística internacional",
    "Dmarcos",
  ],
  authors: [{ name: "Dmarcos" }],
  creator: "Dmarcos",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Dmarcos",
    title: "Dmarcos — Desembaraço Aduaneiro em Manaus",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Dmarcos — Desembaraço Aduaneiro em Manaus",
    description: siteDescription,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: faviconUrl, type: "image/png" }],
    apple: [{ url: faviconUrl, type: "image/png" }],
  },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dmarcos",
  url: siteUrl,
  description: siteDescription,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Manaus",
    addressRegion: "AM",
    addressCountry: "BR",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
