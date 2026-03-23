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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileSearch } from "lucide-react"

type ListaView = "results" | "detail"
type FonteLista = "registradas" | "liberadas"

export default function ProcessosPage() {
  const router = useRouter()
  const token = readToken()
  const cliente = readClienteSession()
  const companyName = cliente?.nomeEmpresa?.trim() || "Cliente"

  const [listaView, setListaView] = useState<ListaView>("results")
  const [selectedLista, setSelectedLista] = useState<Processo | null>(null)
  const [rows, setRows] = useState<Processo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fonte, setFonte] = useState<FonteLista>("registradas")
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [filtroPeriodoAtivo, setFiltroPeriodoAtivo] = useState(false)

  const [nrProcesso, setNrProcesso] = useState("")
  const [buscaLoading, setBuscaLoading] = useState(false)
  const [buscaError, setBuscaError] = useState<string | null>(null)
  const [processoBusca, setProcessoBusca] = useState<Processo | null>(null)

  const apiListaPath = fonte === "registradas" ? "/api/consultas/di-registradas" : "/api/consultas/di-liberadas"
  const tituloLista = fonte === "registradas" ? "DIs registradas (todos os tipos)" : "DIs liberadas"

  const loadListaCompleta = useCallback(async () => {
    if (!token) {
      router.push("/")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(apiUrl(apiListaPath), {
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
      setError(e?.message || "Erro ao carregar lista.")
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [router, token, apiListaPath])

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
      const qs = new URLSearchParams({ data_inicio: dataInicio, data_fim: dataFim })
      const res = await fetch(apiUrl(`${apiListaPath}?${qs.toString()}`), {
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
  }, [router, token, apiListaPath, dataInicio, dataFim])

  const limparPeriodo = useCallback(async () => {
    setDataInicio("")
    setDataFim("")
    setError(null)
    await loadListaCompleta()
  }, [loadListaCompleta])

  useEffect(() => {
    if (!token) return
    loadListaCompleta()
  }, [fonte, token, loadListaCompleta])

  const selectProcessFromList = async (p: Processo) => {
    setProcessoBusca(null)
    setSelectedLista(p)
    setListaView("detail")
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
      setSelectedLista({ ...p, ...mapRowToProcesso(row) })
    } catch {
      // mantém resumo da linha
    }
  }

  const buscarPorNumero = async () => {
    if (!token) {
      router.push("/")
      return
    }
    const id = nrProcesso.trim()
    if (!id) {
      setBuscaError("Informe o número do processo.")
      return
    }
    setListaView("results")
    setSelectedLista(null)
    setBuscaLoading(true)
    setBuscaError(null)
    setProcessoBusca(null)
    try {
      const res = await fetch(apiUrl(`/api/consultas/detalhes/${encodeURIComponent(id)}`), {
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
      setProcessoBusca(mapRowToProcesso(row))
    } catch (e: any) {
      setBuscaError(e?.message || "Erro ao buscar detalhes.")
    } finally {
      setBuscaLoading(false)
    }
  }

  const periodFrom = filtroPeriodoAtivo ? isoDateToBr(dataInicio) : "—"
  const periodTo = filtroPeriodoAtivo ? isoDateToBr(dataFim) : "—"

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-accent" />
            Busca direta (endpoint detalhes)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Consulta um processo pelo número e carrega o retorno completo de{" "}
            <code className="text-xs bg-muted px-1 rounded">/consultas/detalhes/:nr</code>.
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
            <Input
              value={nrProcesso}
              onChange={(e) => setNrProcesso(e.target.value)}
              placeholder="Número do processo (ex.: CD_PROCESSO)"
            />
            <Button type="button" onClick={buscarPorNumero} disabled={buscaLoading}>
              {buscaLoading ? "Buscando..." : "Buscar detalhes"}
            </Button>
          </div>
          {buscaError && <p className="text-sm text-red-500 mt-2">{buscaError}</p>}
        </CardContent>
      </Card>

      {processoBusca && (
        <ProcessDetail
          processo={processoBusca}
          companyName={companyName}
          onClose={() => setProcessoBusca(null)}
        />
      )}

      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-lg">Lista de processos + detalhes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Escolha a <strong>fonte</strong> da lista, use <strong>período</strong> (datas) e refine na tabela com
            filtros. Em cada linha, <strong>Detalhar</strong> chama o mesmo endpoint de detalhes do processo.
          </p>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Fonte da lista</Label>
              <Select
                value={fonte}
                onValueChange={(v) => {
                  setFonte(v as FonteLista)
                  setDataInicio("")
                  setDataFim("")
                  setFiltroPeriodoAtivo(false)
                  setListaView("results")
                  setSelectedLista(null)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="registradas">DIs registradas (todos os tipos)</SelectItem>
                  <SelectItem value="liberadas">DIs liberadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proc-ini" className="text-xs text-muted-foreground">
                Data início
              </Label>
              <Input id="proc-ini" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proc-fim" className="text-xs text-muted-foreground">
                Data fim
              </Label>
              <Input id="proc-fim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
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
              <Button
                type="button"
                variant="outline"
                onClick={() => (filtroPeriodoAtivo ? aplicarPeriodo() : loadListaCompleta())}
                disabled={loading}
              >
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

      {listaView === "results" && (
        <ProcessTable
          companyName={companyName}
          reportTitle={tituloLista}
          periodFrom={periodFrom}
          periodTo={periodTo}
          processos={rows}
          onSelectProcess={selectProcessFromList}
          onBack={() => {}}
          detailViaButtonOnly
        />
      )}

      {listaView === "detail" && selectedLista && (
        <ProcessDetail
          processo={selectedLista}
          companyName={companyName}
          onClose={() => {
            setListaView("results")
            setSelectedLista(null)
          }}
        />
      )}
    </div>
  )
}
