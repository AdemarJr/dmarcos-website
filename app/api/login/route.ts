import { NextRequest, NextResponse } from "next/server"

const EXTERNAL_API_BASE =
  process.env.EXTERNAL_API_BASE_URL || "https://untransferable-nita-ungaping.ngrok-free.dev"

// Proxy para o backend externo: POST /login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const upstreamRes = await fetch(`${EXTERNAL_API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await upstreamRes.json().catch(() => null)
    return NextResponse.json(data ?? {}, { status: upstreamRes.status })
  } catch (error) {
    console.error("Erro ao chamar backend externo /login:", error)
    return NextResponse.json({ error: "Erro ao autenticar no servidor." }, { status: 500 })
  }
}
