"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Processo } from "@/lib/mock-processos"
import { ProcessDetail } from "@/components/processos/process-detail"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { readClienteSession, readToken, clearSession } from "@/lib/client-session"
import { mapRowToProcesso } from "@/lib/processo-mapper"
import { backendUrl } from "@/lib/backend-api-url"
import {
  type ProcessoBuscaCampo,
  resolverCampoETermo,
} from "@/lib/processo-search"
import { FileSearch } from "lucide-react"

const BUSCA_CAMPO_LABEL: Record<ProcessoBuscaCampo, string> = {
  AUTO: "Automático",
  CD_PROCESSO: "Código do processo",
  NR_DI_DUIMP: "Número DI / DUIMP",
  IDT_EMBARQUE: "ID embarque",
  HAWB_BL: "HAWB / BL",
}

export default function ProcessosPage() {
  const router = useRouter()
  const token = readToken()
  const cliente = readClienteSession()
  const companyName = cliente?.nomeEmpresa?.trim() || "Cliente"

  const [nrProcesso, setNrProcesso] = useState("")
  const [tipoBusca, setTipoBusca] = useState<ProcessoBuscaCampo>("AUTO")
  const [buscaLoading, setBuscaLoading] = useState(false)
  const [buscaError, setBuscaError] = useState<string | null>(null)
  const [processoBusca, setProcessoBusca] = useState<Processo | null>(null)

  const detalheVisivel = Boolean(processoBusca)

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

  const buscarPorNumero = async () => {
    if (!token) {
      router.push("/")
      return
    }
    const { campo, termo } = resolverCampoETermo(tipoBusca, nrProcesso)
    if (!termo) {
      setBuscaError("Informe um valor para buscar.")
      return
    }
    setBuscaLoading(true)
    setBuscaError(null)
    setProcessoBusca(null)
    try {
      const qs = new URLSearchParams()
      qs.set("tipo_busca", campo)
      const res = await fetch(
        backendUrl(`/api/consultas/detalhes/${encodeURIComponent(termo)}?${qs.toString()}`),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
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
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao buscar detalhes."
      setBuscaError(msg)
    } finally {
      setBuscaLoading(false)
    }
  }

  return (
    <div className="processos-page-content space-y-4">
      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-accent" />
            Buscar por Processos
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Digite o Número de Processos, Di-Duimp, Embarque e Conhecimento.
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="grid gap-2 sm:max-w-xs">
              <Label htmlFor="tipo-busca-processo">Tipo de busca</Label>
              <Select
                value={tipoBusca}
                onValueChange={(v) => setTipoBusca(v as ProcessoBuscaCampo)}
              >
                <SelectTrigger id="tipo-busca-processo" className="w-full">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(BUSCA_CAMPO_LABEL) as ProcessoBuscaCampo[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {BUSCA_CAMPO_LABEL[k]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="grid gap-2 flex-1">
                <Label htmlFor="valor-busca-processo">Valor</Label>
                <Input
                  id="valor-busca-processo"
                  value={nrProcesso}
                  autoComplete="off"
                  onChange={(e) => setNrProcesso(e.target.value)}
                  placeholder="Número de Processos, Di-Duimp, Embarque e Conhecimento"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") buscarPorNumero()
                  }}
                />
              </div>
              <div className="flex items-end">
                <Button type="button" onClick={buscarPorNumero} disabled={buscaLoading} className="w-full sm:w-auto">
                  {buscaLoading ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </div>
          </div>
          {buscaError && <p className="text-sm text-red-500 mt-2">{buscaError}</p>}
        </CardContent>
      </Card>

      {processoBusca && (
        <div className="processo-print-root">
          <ProcessDetail
            processo={processoBusca}
            companyName={companyName}
            onClose={() => setProcessoBusca(null)}
          />
        </div>
      )}
    </div>
  )
}
