import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE, externalFetch, externalHeaders } from "@/lib/server-external-api"

// Proxy para o backend externo: POST /login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const cnpjRaw = body?.cnpj
    const senha = body?.senha ?? body?.password

    const normalized = {
      ...body,
      cnpj: typeof cnpjRaw === "string" ? cnpjRaw.replace(/\D/g, "") : cnpjRaw,
      senha,
    }

    const upstreamRes = await externalFetch(`${EXTERNAL_API_BASE}/login`, {
      method: "POST",
      headers: externalHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(normalized),
    })

    const raw = await upstreamRes.text()
    let parsed: Record<string, unknown> | null = null
    try {
      parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : null
    } catch {
      console.error("[login] Resposta não-JSON do upstream:", raw.slice(0, 400))
      return NextResponse.json(
        {
          error:
            "Não foi possível conectar ao servidor de autenticação. Verifique EXTERNAL_API_BASE_URL e se o backend está no ar.",
        },
        { status: 502 }
      )
    }

    return NextResponse.json(parsed ?? {}, { status: upstreamRes.status })
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    const cause = err.cause instanceof Error ? err.cause.message : ""
    const blob = `${err.message} ${cause}`.toLowerCase()
    console.error("Erro ao chamar backend externo /login:", err.message, cause || "")

    const tlsOrSsl =
      blob.includes("certificate") ||
      blob.includes("ssl") ||
      blob.includes("tls") ||
      blob.includes("self signed") ||
      blob.includes("unable to verify")

    const msg = tlsOrSsl
      ? "Falha de certificado HTTPS. Defina EXTERNAL_API_TLS_INSECURE=true no servidor Next, ou use EXTERNAL_API_BASE_URL=http://...:3001 se a API só expuser HTTP, ou TLS válido no backend."
      : `Não foi possível conectar ao servidor de autenticação em ${EXTERNAL_API_BASE}. Verifique firewall, se a API está no ar e se EXTERNAL_API_BASE_URL está correto.`

    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
