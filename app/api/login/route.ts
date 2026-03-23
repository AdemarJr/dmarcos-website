import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE, externalHeaders } from "@/lib/server-external-api"

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

    const upstreamRes = await fetch(`${EXTERNAL_API_BASE}/login`, {
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
    console.error("Erro ao chamar backend externo /login:", error)
    return NextResponse.json({ error: "Erro ao autenticar no servidor." }, { status: 500 })
  }
}
