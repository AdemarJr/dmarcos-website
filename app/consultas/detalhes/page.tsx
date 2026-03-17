"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Processo } from "@/lib/mock-processos"
import { ProcessDetail } from "@/components/processos/process-detail"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { clearSession, readClienteSession, readToken } from "@/lib/client-session"
import { mapRowToProcesso } from "@/lib/processo-mapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DetalhesPage() {
  const router = useRouter()
  const token = readToken()
  const cliente = readClienteSession()
  const companyName = cliente?.nomeEmpresa?.trim() || "Cliente"

  const [nrProcesso, setNrProcesso] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processo, setProcesso] = useState<Processo | null>(null)

  const buscar = async () => {
    if (!token) {
      router.push("/")
      return
    }
    const id = nrProcesso.trim()
    if (!id) {
      setError("Informe o número do processo.")
      return
    }
    setLoading(true)
    setError(null)
    setProcesso(null)
    try {
      const res = await fetch(`/api/consultas/detalhes/${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        clearSession()
        router.push("/")
        return
      }
      if (!res.ok) {
        const e = await res.json().catch(() => null)
        throw new Error(e?.error || "Falha ao buscar detalhes.")
      }
      const data = await res.json()
      const row = Array.isArray(data) ? data[0] : data
      if (!row) throw new Error("Processo não encontrado.")
      setProcesso(mapRowToProcesso(row))
    } catch (e: any) {
      setError(e?.message || "Erro ao buscar detalhes.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-lg">Detalhes do processo</CardTitle>
          <p className="text-sm text-muted-foreground">
            Consulte um processo específico pelo número (CD_PROCESSO) e visualize todos os dados disponíveis.
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="max-w-2xl space-y-3">
            <div className="flex gap-2">
              <Input
                value={nrProcesso}
                onChange={(e) => setNrProcesso(e.target.value)}
                placeholder="Número do processo (CD_PROCESSO)"
              />
              <Button onClick={buscar} disabled={loading}>
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </div>
            {error && <div className="text-sm text-red-500">{error}</div>}
          </div>
        </CardContent>
      </Card>

      {processo && (
        <div className="mt-6">
          <ProcessDetail processo={processo} companyName={companyName} onClose={() => setProcesso(null)} />
        </div>
      )}
    </div>
  )
}

