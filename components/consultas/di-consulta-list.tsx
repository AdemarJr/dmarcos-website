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
import { backendUrl } from "@/lib/backend-api-url"
import { isoDateToBr } from "@/lib/format-display"
import { Label } from "@/components/ui/label"
import { CalendarRange, List } from "lucide-react"

type DiVariant = "registradas" | "liberadas"

const VARIANT = {
  registradas: {
    apiPath: "/api/consultas/di-registradas",
    pageTitle: "DIs registradas",
    intro:
      "Somente declarações importadas registradas. Informe o período (data de registro da DI) e clique em Buscar para carregar a lista.",
    periodCardTitle: "Período — data de registro",
    dateIniId: "di-reg-ini",
    dateFimId: "di-reg-fim",
    labelIni: "Data início",
    labelFim: "Data fim",
    listSectionTitle: "Lista de DIs registradas",
    reportTitle: "DIs Registradas",
  },
  liberadas: {
    apiPath: "/api/consultas/di-liberadas",
    pageTitle: "DIs liberadas",
    intro:
      "Somente declarações já liberadas. Informe o período (data de liberação) e clique em Buscar para carregar a lista.",
    periodCardTitle: "Período — data de liberação",
    dateIniId: "di-lib-ini",
    dateFimId: "di-lib-fim",
    labelIni: "Data início",
    labelFim: "Data fim",
    listSectionTitle: "Lista de DIs liberadas",
    reportTitle: "DIs Liberadas",
  },
} as const

type View = "results" | "detail"

export function DiConsultaList({ variant }: { variant: DiVariant }) {
  const router = useRouter()
  const token = readToken()
  const cliente = readClienteSession()
  const cfg = VARIANT[variant]

  const [currentView, setCurrentView] = useState<View>("results")
  const [selected, setSelected] = useState<Processo | null>(null)
  const [rows, setRows] = useState<Processo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [filtroPeriodoAtivo, setFiltroPeriodoAtivo] = useState(false)

  const companyName = cliente?.nomeEmpresa?.trim() || "Cliente"

  const buscarPorPeriodo = useCallback(async () => {
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
      const qs = new URLSearchParams({
        data_inicio: dataInicio,
        data_fim: dataFim,
      })
      const res = await fetch(backendUrl(`${cfg.apiPath}?${qs.toString()}`), {
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
      setRows((arr as Record<string, unknown>[]).map(mapRowToProcesso))
      setFiltroPeriodoAtivo(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao buscar por período.")
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [router, token, cfg.apiPath, dataInicio, dataFim])

  const limparPeriodo = useCallback(() => {
    setDataInicio("")
    setDataFim("")
    setError(null)
    setRows([])
    setFiltroPeriodoAtivo(false)
  }, [])

  const selectProcess = async (p: Processo) => {
    setSelected(p)
    setCurrentView("detail")
    if (!token) return
    try {
      const res = await fetch(
        backendUrl(`/api/consultas/detalhes/${encodeURIComponent(String(p.id || p.noProcesso))}`),
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

  const detalheVisivel = currentView === "detail" && selected != null

  useEffect(() => {
    if (detalheVisivel) {
      document.body.classList.add("print-processo-only")
    } else {
      document.body.classList.remove("print-processo-only")
    }
    return () => {
      document.body.classList.remove("print-processo-only")
    }
  }, [detalheVisivel])

  return (
    <>
      {currentView === "detail" && selected ? (
        <div className="consultas-list-page-content">
          <div className="processo-print-root">
            <ProcessDetail
              processo={selected}
              companyName={companyName}
              closeLabel="Voltar à lista"
              onClose={() => {
                setCurrentView("results")
                setSelected(null)
              }}
            />
          </div>
        </div>
      ) : (
        <div className="consultas-list-page-content space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{cfg.pageTitle}</h1>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">{cfg.intro}</p>
      </div>

      <section className="space-y-3" aria-labelledby="di-period-heading">
        <h2 id="di-period-heading" className="sr-only">
          Filtro por período
        </h2>
        <Card>
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarRange className="w-5 h-5 text-accent shrink-0" />
              {cfg.periodCardTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
              <div className="space-y-1.5">
                <Label htmlFor={cfg.dateIniId} className="text-xs text-muted-foreground">
                  {cfg.labelIni}
                </Label>
                <Input
                  id={cfg.dateIniId}
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={cfg.dateFimId} className="text-xs text-muted-foreground">
                  {cfg.labelFim}
                </Label>
                <Input id={cfg.dateFimId} type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" onClick={buscarPorPeriodo} disabled={loading}>
                  {loading ? "Buscando..." : "Buscar"}
                </Button>
                <Button type="button" variant="secondary" onClick={limparPeriodo} disabled={loading}>
                  Limpar
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {error && <span className="text-red-500">{error}</span>}
              {!error && !filtroPeriodoAtivo && !loading && (
                <span className="text-muted-foreground">
                  Informe data início, data fim e clique em Buscar para listar os registros.
                </span>
              )}
              {!error && filtroPeriodoAtivo && (
                <span className="text-muted-foreground">
                  {loading ? "Buscando…" : `${rows.length} registro(s)`}
                  <span className="ml-2 text-foreground font-medium">
                    • Período: {isoDateToBr(dataInicio)} a {isoDateToBr(dataFim)}
                  </span>
                </span>
              )}
              {!error && loading && !filtroPeriodoAtivo && (
                <span className="text-muted-foreground">Buscando…</span>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {filtroPeriodoAtivo && (
        <section className="space-y-3" aria-labelledby="di-list-heading">
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-accent shrink-0" aria-hidden />
            <h2 id="di-list-heading" className="text-lg font-semibold text-foreground">
              {cfg.listSectionTitle}
            </h2>
          </div>

          <ProcessTable
            companyName={companyName}
            reportTitle={cfg.reportTitle}
            periodFrom={periodFrom}
            periodTo={periodTo}
            processos={rows}
            onSelectProcess={selectProcess}
            onBack={() => {}}
            detailViaButtonOnly
          />
        </section>
      )}
        </div>
      )}
    </>
  )
}
