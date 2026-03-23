"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Processo } from "@/lib/mock-processos"
import { ProcessTable } from "@/components/processos/process-table"
import { ProcessDetail } from "@/components/processos/process-detail"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { readClienteSession, readToken, clearSession } from "@/lib/client-session"
import { mapRowToProcesso } from "@/lib/processo-mapper"
import { apiUrl } from "@/lib/api-url"
import { isoDateToBr } from "@/lib/date-display"
import { Label } from "@/components/ui/label"

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
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  /** true quando há filtro por intervalo de datas (data de registro) */
  const [filtroPeriodoAtivo, setFiltroPeriodoAtivo] = useState(false)

  const companyName = cliente?.nomeEmpresa?.trim() || "Cliente"

  const loadListaCompleta = useCallback(async () => {
    if (!token) {
      router.push("/")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(apiUrl("/api/consultas/di-registradas"), {
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
      setFiltroPeriodoAtivo(false)
    } catch (e: any) {
      setError(e?.message || "Erro ao buscar DIs registradas.")
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [router, token])

  const aplicarPeriodo = useCallback(async () => {
    if (!token) {
      router.push("/")
      return
    }
    if (!dataInicio || !dataFim) {
      setError("Informe data início e data fim para filtrar por período.")
      return
    }
    if (dataInicio > dataFim) {
      setError("A data início não pode ser posterior à data fim.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      // Mesmo endpoint da lista completa: traz todos os tipos; o período filtra por data de registro (backend).
      const qs = new URLSearchParams({
        data_inicio: dataInicio,
        data_fim: dataFim,
      })
      const res = await fetch(apiUrl(`/api/consultas/di-registradas?${qs.toString()}`), {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        clearSession()
        router.push("/")
        return
      }
      if (!res.ok) {
        const e = await res.json().catch(() => null)
        throw new Error(e?.error || "Falha ao buscar por período.")
      }
      const data = await res.json()
      const arr = Array.isArray(data) ? data : data?.data || data?.processos || []
      setRows((arr as any[]).map(mapRowToProcesso))
      setFiltroPeriodoAtivo(true)
    } catch (e: any) {
      setError(e?.message || "Erro ao buscar por período.")
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [router, token, dataInicio, dataFim])

  const limparPeriodo = useCallback(async () => {
    setDataInicio("")
    setDataFim("")
    setError(null)
    await loadListaCompleta()
  }, [loadListaCompleta])

  useEffect(() => {
    if (rows.length === 0 && !loading && !error) loadListaCompleta()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectProcess = async (p: Processo) => {
    setSelected(p)
    setCurrentView("detail")
    if (!token) return
    try {
      const res = await fetch(
        apiUrl(`/api/consultas/detalhes/${encodeURIComponent(String(p.id || p.noProcesso))}`),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (!res.ok) return
      const data = await res.json()
      const row = Array.isArray(data) ? data[0] : data
      if (!row) return
      setSelected({ ...p, ...mapRowToProcesso(row) })
    } catch {
      // mantém resumo da linha
    }
  }

  const periodFrom = filtroPeriodoAtivo ? isoDateToBr(dataInicio) : "—"
  const periodTo = filtroPeriodoAtivo ? isoDateToBr(dataFim) : "—"

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-lg">DIs registradas</CardTitle>
          <p className="text-sm text-muted-foreground">
            Lista <strong>completa</strong> (todos os tipos conforme o cadastro). Use o <strong>período</strong> para
            filtrar por intervalo de datas de registro, ou deixe em branco para carregar tudo. A busca por texto fica na
            tabela abaixo.
          </p>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="di-reg-ini" className="text-xs text-muted-foreground">
                Data início (registro)
              </Label>
              <Input
                id="di-reg-ini"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="di-reg-fim" className="text-xs text-muted-foreground">
                Data fim (registro)
              </Label>
              <Input id="di-reg-fim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={aplicarPeriodo} disabled={loading}>
                Aplicar período
              </Button>
              <Button type="button" variant="secondary" onClick={limparPeriodo} disabled={loading}>
                Limpar período
              </Button>
            </div>
            <div className="flex justify-start lg:justify-end">
              <Button type="button" variant="outline" onClick={() => (filtroPeriodoAtivo ? aplicarPeriodo() : loadListaCompleta())} disabled={loading}>
                {loading ? "Carregando..." : "Atualizar lista"}
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {error && <span className="text-red-500">{error}</span>}
            {!error && (
              <span className="text-muted-foreground">
                {loading ? "Atualizando…" : `${rows.length} registro(s)`}
                {filtroPeriodoAtivo && (
                  <span className="ml-2 text-foreground font-medium">
                    • Período: {isoDateToBr(dataInicio)} a {isoDateToBr(dataFim)}
                  </span>
                )}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {currentView === "results" && (
        <ProcessTable
          companyName={companyName}
          reportTitle="DIs Registradas"
          periodFrom={periodFrom}
          periodTo={periodTo}
          processos={rows}
          onSelectProcess={selectProcess}
          onBack={() => {}}
          detailViaButtonOnly
        />
      )}

      {currentView === "detail" && selected && (
        <ProcessDetail processo={selected} companyName={companyName} onClose={() => setCurrentView("results")} />
      )}
    </div>
  )
}
