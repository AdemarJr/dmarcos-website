"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { Processo } from "@/lib/mock-processos"
import { ProcessTable } from "@/components/processos/process-table"
import { ProcessDetail } from "@/components/processos/process-detail"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { readClienteSession, readToken, clearSession } from "@/lib/client-session"
import { mapRowToProcesso } from "@/lib/processo-mapper"

type View = "results" | "detail"

export default function DiRegistradasPage() {
  const router = useRouter()
  const token = readToken()
  const cliente = readClienteSession()

  const [currentView, setCurrentView] = useState<View>("results")
  const [selected, setSelected] = useState<Processo | null>(null)
  const [rows, setRows] = useState<Processo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const companyName = cliente?.nomeEmpresa?.trim() || "Cliente"

  const load = async () => {
    if (!token) {
      router.push("/")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/consultas/di-registradas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        clearSession()
        router.push("/")
        return
      }
      const data = await res.json()
      const arr = Array.isArray(data) ? data : data?.data || data?.processos || []
      setRows((arr as any[]).map(mapRowToProcesso))
    } catch (e: any) {
      setError(e?.message || "Erro ao buscar DIs registradas.")
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (rows.length === 0 && !loading && !error) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (p) =>
        String(p.noProcesso).toLowerCase().includes(q) ||
        p.embarque.toLowerCase().includes(q) ||
        p.numeroDI.toLowerCase().includes(q) ||
        p.conhecimento.toLowerCase().includes(q) ||
        p.local.toLowerCase().includes(q)
    )
  }, [rows, query])

  const selectProcess = async (p: Processo) => {
    setSelected(p)
    setCurrentView("detail")
    if (!token) return
    try {
      const res = await fetch(`/api/consultas/detalhes/${encodeURIComponent(String(p.id || p.noProcesso))}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      const data = await res.json()
      const row = Array.isArray(data) ? data[0] : data
      if (!row) return
      setSelected({ ...p, ...mapRowToProcesso(row) })
    } catch {
      // keep summary
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-lg">DIs registradas</CardTitle>
          <p className="text-sm text-muted-foreground">
            Lista de processos com registro no sistema para o seu cliente. Use o filtro para localizar rapidamente.
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filtrar (DI, embarque, processo...)"
              />
              <Button variant="outline" onClick={load} disabled={loading}>
                {loading ? "Carregando..." : "Atualizar"}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {error && <span className="text-sm text-red-500">{error}</span>}
              {!error && (
                <span className="text-sm text-muted-foreground">
                  {loading ? "Atualizando…" : `${filtered.length} registro(s)`}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {currentView === "results" && (
        <ProcessTable
          companyName={companyName}
          reportTitle="DIs Registradas"
          periodFrom="-"
          periodTo="-"
          processos={filtered}
          onSelectProcess={selectProcess}
          onBack={() => {}}
        />
      )}

      {currentView === "detail" && selected && (
        <ProcessDetail processo={selected} companyName={companyName} onClose={() => setCurrentView("results")} />
      )}
    </div>
  )
}

