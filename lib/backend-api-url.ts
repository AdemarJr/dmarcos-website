import { apiUrl } from "@/lib/api-url"

/**
 * Monta a URL do backend para chamadas `fetch` no browser.
 *
 * - **Padrão:** usa o proxy do Next (`/api/...` + `NEXT_PUBLIC_BASE_PATH`), que chama o servidor
 *   configurado em `EXTERNAL_API_BASE_URL` no Node.
 * - **Direto (`NEXT_PUBLIC_DIRECT_API_BASE_URL`):** o navegador chama o mesmo host/porta da API,
 *   sem passar pelo Node. Use quando o hosting **bloqueia saída** do servidor para o IP da API.
 *
 * A API precisa liberar **CORS** para o domínio do site. Se o site for **HTTPS**, a API também
 * deve ser **HTTPS** (ou o browser bloqueia conteúdo misto ao usar HTTP).
 */
export function backendUrl(pathWithApiPrefix: string): string {
  const direct =
    typeof process.env.NEXT_PUBLIC_DIRECT_API_BASE_URL === "string"
      ? process.env.NEXT_PUBLIC_DIRECT_API_BASE_URL.trim().replace(/\/$/, "")
      : ""

  const raw = pathWithApiPrefix.startsWith("/") ? pathWithApiPrefix : `/${pathWithApiPrefix}`

  if (direct) {
    if (raw.startsWith("/api")) {
      return `${direct}${raw.slice(4)}`
    }
    return `${direct}${raw}`
  }

  if (raw.startsWith("/api")) {
    return apiUrl(raw)
  }
  return apiUrl(`/api${raw}`)
}
