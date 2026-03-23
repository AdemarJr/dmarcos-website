import { NextRequest, NextResponse } from "next/server"
import { EXTERNAL_API_BASE, externalHeaders } from "@/lib/server-external-api"

// Proxy GET /consultas/detalhes/:nr_processo para o backend externo
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ nr_processo: string }> }
) {
  const auth = req.headers.get("authorization")
  if (!auth) {
    return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
  }

  const { nr_processo: raw } = await ctx.params
  const nr_processo = String(raw ?? "")
    .trim()
    .replace(/^\/+|\/+$/g, "")
  if (!nr_processo) {
    return NextResponse.json({ error: "Número do processo é obrigatório." }, { status: 400 })
  }

  const url = new URL(req.url)
  const search = url.search

  try {
    const upstreamRes = await fetch(
      `${EXTERNAL_API_BASE}/consultas/detalhes/${encodeURIComponent(nr_processo)}${search}`,
      {
        headers: externalHeaders({ Authorization: auth }),
      }
    )
    const data = await upstreamRes.json().catch(() => null)
    return NextResponse.json(data ?? {}, { status: upstreamRes.status })
  } catch (error) {
    console.error("Erro ao chamar backend externo /consultas/detalhes:", error)
    return NextResponse.json({ error: "Erro ao buscar detalhes do processo." }, { status: 500 })
  }
}

