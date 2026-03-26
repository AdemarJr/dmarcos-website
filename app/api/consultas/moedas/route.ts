import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE, externalFetch, externalHeaders } from "@/lib/server-external-api"

function pickErrorMessage(data: unknown, status: number): string {
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>
    const s = (v: unknown) => (typeof v === "string" ? v : v != null ? String(v) : "")
    const msg =
      s(o.error) ||
      s(o.message) ||
      s(o.mensagem) ||
      s(o.detail) ||
      (Array.isArray(o.errors) && o.errors.length ? String(o.errors[0]) : "")
    if (msg.trim()) return msg.trim()
  }
  return `Servidor retornou status ${status}.`
}

/** Proxy GET /consultas/moedas — cotações do dia (backend externo). */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")

  try {
    const headersWithAuth = externalHeaders(
      auth ? { Authorization: auth } : undefined
    )

    let upstreamRes = await externalFetch(`${EXTERNAL_API_BASE}/consultas/moedas`, {
      headers: headersWithAuth,
      cache: "no-store",
    })

    // Alguns backends expõem cotações sem Bearer; tenta de novo só com headers mínimos.
    if (upstreamRes.status === 401 && auth) {
      upstreamRes = await externalFetch(`${EXTERNAL_API_BASE}/consultas/moedas`, {
        headers: externalHeaders(),
        cache: "no-store",
      })
    }

    const text = await upstreamRes.text()
    let data: unknown
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      return NextResponse.json(
        {
          error:
            "Resposta inválida do servidor de cotações (não é JSON). Verifique se o backend está no ar e se EXTERNAL_API_BASE_URL está correto.",
        },
        { status: 502 }
      )
    }

    if (!upstreamRes.ok) {
      return NextResponse.json(
        { error: pickErrorMessage(data, upstreamRes.status) },
        { status: upstreamRes.status >= 400 && upstreamRes.status < 600 ? upstreamRes.status : 502 }
      )
    }

    return NextResponse.json(data ?? [], { status: 200 })
  } catch (error) {
    console.error("Erro ao chamar backend externo /consultas/moedas:", error)
    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor de cotações." },
      { status: 500 }
    )
  }
}
