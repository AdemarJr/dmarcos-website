"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { Processo } from "@/lib/mock-processos"
import { ProcessTable } from "@/components/processos/process-table"
import { ProcessDetail } from "@/components/processos/process-detail"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { clearSession, readClienteSession, readToken } from "@/lib/client-session"
import { mapRowToProcesso } from "@/lib/processo-mapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type View = "search" | "results" | "detail"
type TipoPeriodo = "registro" | "liberacao"

export default function PeriodoPage() {
  const router = useRouter()
  const token = readToken()
  const cliente = readClienteSession()
  const companyName = cliente?.nomeEmpresa?.trim() || "Cliente"

  const [view, setView] = useState<View>("search")
  const [tipo, setTipo] = useState<TipoPeriodo>("registro")
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [rows, setRows] = useState<Processo[]>([])
  const [selected, setSelected] = useState<Processo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reportTitle = tipo === "registro" ? "Processos por Período (Registro)" : "Processos por Período (Liberação)"

  const search = async () => {
    if (!token) {
      router.push("/")
      return
    }
    if (!dataInicio || !dataFim) {
      setError("Informe data início e data fim.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const qs = new URLSearchParams({
        data_inicio: dataInicio,
        data_fim: dataFim,
        tipo,
      })
      const res = await fetch(`/api/consultas/periodo?${qs.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        clearSession()
        router.push("/")
        return
      }
      if (!res.ok) {
        const e = await res.json().catch(() => null)
        throw new Error(e?.error || "Falha ao buscar período.")
      }
      const data = await res.json()
      const arr = Array.isArray(data) ? data : data?.data || data?.processos || []
      setRows((arr as any[]).map(mapRowToProcesso))
      setView("results")
    } catch (e: any) {
      setError(e?.message || "Erro ao buscar período.")
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  const selectProcess = async (p: Processo) => {
    setSelected(p)
    setView("detail")
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

  const periodFrom = dataInicio || "-"
  const periodTo = dataFim || "-"

  const results = useMemo(() => rows, [rows])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-lg">Consulta por período</CardTitle>
          <p className="text-sm text-muted-foreground">
            Filtre por data de registro ou data de liberação. O sistema retorna os processos do seu cliente no período.
          </p>
        </CardHeader>
        <CardContent className="pt-4">
      {view === "search" && (
        <div className="space-y-4">
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <Select value={tipo} onValueChange={(v) => setTipo(v as TipoPeriodo)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="registro">Registro</SelectItem>
                  <SelectItem value="liberacao">Liberação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-1">
              <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </div>
            <div className="sm:col-span-1">
              <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>
          </div>
          <Button onClick={search} disabled={loading} className="w-full">
            {loading ? "Pesquisando..." : "Pesquisar"}
          </Button>
        </div>
      )}
        </CardContent>
      </Card>

      {view === "results" && (
        <div className="space-y-4">
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setView("search")}>
              Nova pesquisa
            </Button>
          </div>
          <ProcessTable
            companyName={companyName}
            reportTitle={reportTitle}
            periodFrom={periodFrom}
            periodTo={periodTo}
            processos={results}
            onSelectProcess={selectProcess}
            onBack={() => setView("search")}
          />
        </div>
      )}

      {view === "detail" && selected && (
        <ProcessDetail processo={selected} companyName={companyName} onClose={() => setView("results")} />
      )}
    </div>
  )
}

