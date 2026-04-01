"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Processo } from "@/lib/mock-processos"
import { ProcessDetail } from "@/components/processos/process-detail"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { readClienteSession, readToken, clearSession } from "@/lib/client-session"
import { mapRowToProcesso } from "@/lib/processo-mapper"
import { backendUrl } from "@/lib/backend-api-url"
import { digitsOnly } from "@/lib/format-display"
import { FileSearch } from "lucide-react"

export default function ProcessosPage() {
  const router = useRouter()
  const token = readToken()
  const cliente = readClienteSession()
  const companyName = cliente?.nomeEmpresa?.trim() || "Cliente"

  const [nrProcesso, setNrProcesso] = useState("")
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
    const id = digitsOnly(nrProcesso)
    if (!id) {
      setBuscaError("Informe o número do processo.")
      return
    }
    setBuscaLoading(true)
    setBuscaError(null)
    setProcessoBusca(null)
    try {
      const res = await fetch(backendUrl(`/api/consultas/detalhes/${encodeURIComponent(id)}`), {
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
            Buscar por Número de Processos, Di-Duimp, Embarque e Conhecimento
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Digite o número do processo (apenas algarismos; pontos, barras e outros símbolos são ignorados).
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
            <Input
              value={nrProcesso}
              inputMode="numeric"
              autoComplete="off"
              onChange={(e) => setNrProcesso(digitsOnly(e.target.value))}
              placeholder="Digite o número do processo, Di-Duimp, Embarque e Conhecimento"
              onKeyDown={(e) => {
                if (e.key === "Enter") buscarPorNumero()
              }}
            />
            <Button type="button" onClick={buscarPorNumero} disabled={buscaLoading}>
              {buscaLoading ? "Buscando..." : "Buscar"}
            </Button>
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
