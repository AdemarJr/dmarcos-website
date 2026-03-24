/** @type {import('next').NextConfig} */

/**
 * Mesmo valor que NEXT_PUBLIC_BASE_PATH na build (sem barra final).
 * Se o site roda numa subpasta na Hostinger (ex.: /meu-app), defina ambos como "/meu-app".
 * Sem isso, o HTML pode apontar para /_next/static/... na raiz e o CSS quebra (404).
 */
const rawBase = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
const basePath = rawBase.replace(/\/$/, "") || undefined

const nextConfig = {
  ...(basePath ? { basePath } : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  /**
   * Reduz cache de páginas HTML após deploy: evita o navegador/CDN servir HTML antigo
   * que referencia arquivos _next/*.css com hash que já não existe no servidor.
   * Assets em /_next/static/* continuam com hash + immutable (cache longo).
   */
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ]
  },
}

export default nextConfig