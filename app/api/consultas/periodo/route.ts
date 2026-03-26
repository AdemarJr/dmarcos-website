import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE, externalFetch, externalHeaders } from "@/lib/server-external-api"

// Proxy GET /consultas/periodo para o backend externo
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")
  if (!auth) {
    return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
  }

  const url = new URL(req.url)
  const search = url.search

  try {
    const upstreamRes = await externalFetch(`${EXTERNAL_API_BASE}/consultas/periodo${search}`, {
      headers: externalHeaders({ Authorization: auth }),
    })
    const data = await upstreamRes.json().catch(() => null)
    return NextResponse.json(data ?? {}, { status: upstreamRes.status })
  } catch (error) {
    console.error("Erro ao chamar backend externo /consultas/periodo:", error)
    return NextResponse.json({ error: "Erro ao buscar processos por período." }, { status: 500 })
  }
}

