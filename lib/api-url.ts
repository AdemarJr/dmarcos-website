/**
 * Prefixa rotas da app com `NEXT_PUBLIC_BASE_PATH` (ex.: site em subpasta na Hostinger).
 */
export function apiUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}
