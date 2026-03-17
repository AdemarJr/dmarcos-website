export type ClienteSession = { nomeEmpresa?: string; cnpj?: string }

export function readToken(): string | null {
  try {
    return localStorage.getItem("dmarcos_token")
  } catch {
    return null
  }
}

export function readClienteSession(): ClienteSession | null {
  try {
    const raw = localStorage.getItem("dmarcos_cliente")
    if (!raw) return null
    return JSON.parse(raw) as ClienteSession
  } catch {
    return null
  }
}

export function clearSession() {
  try {
    localStorage.removeItem("dmarcos_auth")
    localStorage.removeItem("dmarcos_token")
    localStorage.removeItem("dmarcos_cliente")
  } catch {
    // ignore
  }
}

