/**
 * Base URL do backend (API real). Configure em produção com `EXTERNAL_API_BASE_URL`.
 */
export const EXTERNAL_API_BASE =
  process.env.EXTERNAL_API_BASE_URL || "https://untransferable-nita-ungaping.ngrok-free.dev"

/**
 * Cabeçalhos para chamadas server-side ao backend atrás do ngrok.
 * Sem isso, o túnel pode devolver HTML (página de aviso) em vez de JSON.
 */
export function externalHeaders(init?: HeadersInit): Headers {
  const h = new Headers(init)
  if (!h.has("ngrok-skip-browser-warning")) {
    h.set("ngrok-skip-browser-warning", "69420")
  }
  return h
}
