import { NextRequest, NextResponse } from "next/server"

const EXTERNAL_API_BASE =
  process.env.EXTERNAL_API_BASE_URL || "https://untransferable-nita-ungaping.ngrok-free.dev"

// Proxy GET /consultas/periodo para o backend externo
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")
  if (!auth) {
    return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
  }

  const url = new URL(req.url)
  const search = url.search

  try {
    const upstreamRes = await fetch(`${EXTERNAL_API_BASE}/consultas/periodo${search}`, {
      headers: { Authorization: auth },
    })
    const data = await upstreamRes.json().catch(() => null)
    return NextResponse.json(data ?? {}, { status: upstreamRes.status })
  } catch (error) {
    console.error("Erro ao chamar backend externo /consultas/periodo:", error)
    return NextResponse.json({ error: "Erro ao buscar processos por período." }, { status: 500 })
  }
}

