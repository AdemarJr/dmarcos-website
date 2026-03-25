"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { readToken } from "@/lib/client-session"
import { apiUrl } from "@/lib/api-url"
import { formatDecimalPtBr } from "@/lib/format-display"
import { Banknote, Loader2 } from "lucide-react"

export type MoedaCotacao = {
  CODIGO?: string
  codigo?: string
  DESCRICAO?: string
  descricao?: string
  TAXA_CONVERSAO?: number
  taxa_conversao?: number
}

function normalizeList(data: unknown): MoedaCotacao[] {
  if (Array.isArray(data)) return data as MoedaCotacao[]
  if (data && typeof data === "object" && "data" in data && Array.isArray((data as { data: unknown }).data)) {
    return (data as { data: MoedaCotacao[] }).data
  }
  if (data && typeof data === "object" && "moedas" in data && Array.isArray((data as { moedas: unknown }).moedas)) {
    return (data as { moedas: MoedaCotacao[] }).moedas
  }
  return []
}

/** Botão no header + modal no canto superior direito (não sobrepõe o fluxo da página até abrir). */
export function CotacaoMoedasPanel() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [moedas, setMoedas] = useState<MoedaCotacao[]>([])

  const load = useCallback(async () => {
    const token = readToken()
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(apiUrl("/api/consultas/moedas"), {
        headers: { Authorization: `Bearer ${token}` },
      })
      const payload = await res.json().catch(() => null)
      if (!res.ok) {
        const msg =
          payload && typeof payload === "object" && "error" in payload
            ? String((payload as { error: unknown }).error)
            : `Erro HTTP ${res.status}`
        throw new Error(msg || "Não foi possível carregar as cotações.")
      }
      const data = payload
      setMoedas(normalizeList(data))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao carregar cotações.")
      setMoedas([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      load()
    }
  }, [open, load])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 shrink-0 border-border/80 text-muted-foreground hover:text-foreground"
          aria-label="Abrir cotações do dia"
        >
          <Banknote className="h-4 w-4 text-accent" />
          <span className="hidden sm:inline">Cotações</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={
          "flex max-h-[min(85vh,520px)] w-[min(22rem,calc(100vw-1.5rem))] flex-col gap-0 overflow-hidden p-0 " +
          /* Navbar = h-14 (3.5rem); modal colado à direita, logo abaixo do header */
          "!fixed !left-auto !right-3 !top-[calc(3.5rem+0.5rem)] !translate-x-0 !translate-y-0 sm:!right-4 " +
          "md:!max-w-md"
        }
      >
        <DialogHeader className="border-b border-border/80 px-4 py-3 text-left space-y-1">
          <DialogTitle className="text-base font-semibold flex items-center gap-2 pr-8">
            <Banknote className="h-4 w-4 text-accent shrink-0" />
            Cotação do dia
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Taxas de conversão (referência do dia)
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
              Carregando…
            </div>
          )}
          {error && !loading && <p className="text-sm text-red-600 py-2">{error}</p>}
          {!loading && !error && moedas.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma cotação disponível.</p>
          )}
          {!loading && moedas.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="py-2 pr-2 font-medium">Cód.</th>
                  <th className="py-2 pr-2 font-medium">Moeda</th>
                  <th className="py-2 text-right font-medium whitespace-nowrap">Taxa (R$)</th>
                </tr>
              </thead>
              <tbody>
                {moedas.map((m, i) => {
                  const cod = m.CODIGO ?? m.codigo
                  const desc = m.DESCRICAO ?? m.descricao
                  const taxa = m.TAXA_CONVERSAO ?? m.taxa_conversao
                  return (
                    <tr key={`${cod ?? i}-${i}`} className="border-b border-border/50 last:border-0">
                      <td className="py-2 pr-2 text-muted-foreground tabular-nums align-top">{cod ?? "—"}</td>
                      <td className="py-2 pr-2 text-foreground leading-snug align-top">{desc ?? "—"}</td>
                      <td className="py-2 text-right font-medium tabular-nums align-top whitespace-nowrap">
                        {formatDecimalPtBr(taxa, { min: 2, max: 6 })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="border-t border-border/80 px-4 py-2 flex justify-end gap-2 bg-muted/20">
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
            Fechar
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={load} disabled={loading}>
            Atualizar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
