import { NextResponse } from "next/server"
import { EXTERNAL_API_BASE, externalFetch, externalHeaders } from "@/lib/server-external-api"

export const dynamic = "force-dynamic"

/**
 * Diagnóstico: testa se o processo Node do Next consegue alcançar EXTERNAL_API_BASE (mesma rede que /api/login).
 * GET /api/health — use após deploy para ver se firewall/hosting bloqueia saída para a API.
 */
export async function GET() {
  const started = Date.now()
  const url = `${EXTERNAL_API_BASE}/`
  try {
    const res = await externalFetch(url, {
      method: "GET",
      headers: externalHeaders(),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    })
    const ms = Date.now() - started
    return NextResponse.json({
      ok: true,
      externalApiBase: EXTERNAL_API_BASE,
      probeUrl: url,
      reachable: true,
      upstreamStatus: res.status,
      latencyMs: ms,
      hint:
        "Se reachable=true mas o login falhar, o problema costuma ser só no POST /login ou no banco na API.",
    })
  } catch (e) {
    const ms = Date.now() - started
    const err = e instanceof Error ? e : new Error(String(e))
    return NextResponse.json(
      {
        ok: false,
        externalApiBase: EXTERNAL_API_BASE,
        probeUrl: url,
        reachable: false,
        error: err.message,
        latencyMs: ms,
        hint:
          "O Next.js no servidor não conseguiu conectar a essa URL. Em hospedagem compartilhada, saída para IP:porta costuma ser bloqueada — confirme com o provedor ou use VPS. No servidor da API, confira firewall e se o serviço escuta em 0.0.0.0:3001 (não só 127.0.0.1).",
      },
      { status: 503 }
    )
  }
}
