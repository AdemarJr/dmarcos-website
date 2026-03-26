/**
 * Base URL do backend (API real).
 * Em produção, sobrescreva com `EXTERNAL_API_BASE_URL` (sem barra no final).
 */
import { Agent, fetch as undiciFetch } from "undici"

function normalizeExternalBase(url: string): string {
  return url.trim().replace(/\/$/, "")
}

/** API em produção (HTTPS :443 no IP informado). Sobrescreva com EXTERNAL_API_BASE_URL se mudar. */
export const EXTERNAL_API_BASE = normalizeExternalBase(
  process.env.EXTERNAL_API_BASE_URL || "https://201.90.253.226:443"
)

let insecureDispatcher: Agent | undefined

/** Host é IPv4 (HTTPS em IP costuma usar certificado não confiável pelo Node). */
function isIpv4Host(hostname: string): boolean {
  return /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname)
}

/**
 * Aceita TLS "inseguro" (certificado autofirmado / inválido) quando:
 * - `EXTERNAL_API_TLS_INSECURE=true`, ou
 * - **automático:** URL é `https://` e o host é um **IP** (comum em produção interna).
 * Para desligar com HTTPS em IP + certificado válido: `EXTERNAL_API_TLS_INSECURE=false`.
 */
function shouldUseInsecureTls(): boolean {
  const e = process.env.EXTERNAL_API_TLS_INSECURE
  if (e === "false" || e === "0") return false
  if (e === "true" || e === "1") return true
  try {
    const raw = EXTERNAL_API_BASE.includes("://") ? EXTERNAL_API_BASE : `https://${EXTERNAL_API_BASE}`
    const u = new URL(raw)
    if (u.protocol === "https:" && isIpv4Host(u.hostname)) return true
  } catch {
    // ignore
  }
  return false
}

function getInsecureDispatcher(): Agent | undefined {
  if (!shouldUseInsecureTls()) return undefined
  if (!insecureDispatcher) {
    insecureDispatcher = new Agent({
      connect: {
        rejectUnauthorized: false,
      },
    })
  }
  return insecureDispatcher
}

/**
 * `fetch` ao backend externo (rotas /api no Next).
 * TLS relaxado para HTTPS em IP ou quando EXTERNAL_API_TLS_INSECURE=true.
 */
export async function externalFetch(input: string | URL, init?: RequestInit): Promise<Response> {
  const dispatcher = getInsecureDispatcher()
  if (dispatcher) {
    return undiciFetch(input, {
      ...init,
      dispatcher,
    })
  }
  return fetch(input, init)
}

/**
 * Cabeçalhos para chamadas server-side ao backend.
 * `ngrok-skip-browser-warning` é ignorado por servidores que não são ngrok.
 */
export function externalHeaders(init?: HeadersInit): Headers {
  const h = new Headers(init)
  if (!h.has("ngrok-skip-browser-warning")) {
    h.set("ngrok-skip-browser-warning", "69420")
  }
  return h
}
