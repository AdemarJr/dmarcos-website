"use client"

import { useState, useMemo, useCallback } from "react"
import type { Processo } from "@/lib/mock-processos"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  X,
  Eye,
} from "lucide-react"
import {
  formatCurrencyBrl,
  formatCurrencyUsd,
  formatDecimalPtBr,
  formatIntegerPtBr,
} from "@/lib/format-display"

interface ProcessTableProps {
  companyName: string
  reportTitle: string
  periodFrom: string
  periodTo: string
  processos: Processo[]
  onSelectProcess: (processo: Processo) => void
  onBack: () => void
  /** Se true, o detalhe só abre pelo botão na linha (evita clique acidental na linha inteira). */
  detailViaButtonOnly?: boolean
}

type SortField = keyof Processo
type SortDirection = "asc" | "desc"

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100]

type ColFormat = "number" | "integer" | "brl" | "usd"

function formatCellValue(
  col: { format?: ColFormat },
  val: unknown
): string {
  if (col.format === "usd") return formatCurrencyUsd(val)
  if (col.format === "brl") return formatCurrencyBrl(val)
  if (col.format === "number") return formatDecimalPtBr(val)
  if (col.format === "integer") return formatIntegerPtBr(val)
  return String(val ?? "")
}

function escapeCsvValue(val: string | number): string {
  const str = String(val)
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

const TABLE_COLUMNS: { key: keyof Processo; label: string; align: "left" | "right"; format?: ColFormat }[] = [
  { key: "canal", label: "Canal", align: "left" },
  { key: "noProcesso", label: "No. Processo", align: "left" },
  { key: "embarque", label: "Embarque", align: "left" },
  { key: "dataAbertura", label: "Dt. Abertura", align: "left" },
  { key: "conhecimento", label: "Conhecimento", align: "left" },
  { key: "dataChegada", label: "Dt. Chegada", align: "left" },
  { key: "numeroDI", label: "Numero DI", align: "left" },
  { key: "dataDI", label: "Data DI", align: "left" },
  { key: "local", label: "Local", align: "left" },
  { key: "valorFobUsd", label: "FOB USD", align: "right", format: "usd" },
  { key: "valorFobBrl", label: "FOB R$", align: "right", format: "brl" },
  { key: "txSiscomex", label: "TX SISCOMEX", align: "right", format: "brl" },
  { key: "iiPg", label: "II PG", align: "right", format: "brl" },
  { key: "ipiPg", label: "IPI PG", align: "right", format: "brl" },
  { key: "pisPg", label: "PIS PG", align: "right", format: "brl" },
  { key: "cofinsPg", label: "COFINS PG", align: "right", format: "brl" },
  { key: "pbCarga", label: "PB Carga", align: "right", format: "number" },
  { key: "plCarga", label: "PL Carga", align: "right", format: "number" },
  { key: "qtdVol", label: "Qtd Vol", align: "right", format: "integer" },
  { key: "qtdCont", label: "Qtd Cont", align: "right", format: "integer" },
]

export function ProcessTable({
  companyName,
  reportTitle,
  periodFrom,
  periodTo,
  processos,
  onSelectProcess,
  onBack,
  detailViaButtonOnly = false,
}: ProcessTableProps) {
  const [searchText, setSearchText] = useState("")
  const [canalFilter, setCanalFilter] = useState<string>("all")
  const [localFilter, setLocalFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [showFilters, setShowFilters] = useState(false)

  /** Valor sentinela — Radix Select não permite `value=""` em SelectItem */
  const LOCAL_VAZIO = "__local_vazio__"

  // Unique values for filters (sem string vazia; vazios entram como opção separada)
  const hasLocalVazio = useMemo(
    () => processos.some((p) => !String(p.local ?? "").trim()),
    [processos]
  )

  const uniqueLocals = useMemo(
    () =>
      [...new Set(processos.map((p) => p.local))]
        .filter((loc) => String(loc ?? "").trim() !== "")
        .sort(),
    [processos]
  )

  // Filtered data
  const filteredData = useMemo(() => {
    let data = [...processos]

    // Text search
    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim()
      data = data.filter(
        (p) =>
          String(p.noProcesso).includes(q) ||
          p.embarque.toLowerCase().includes(q) ||
          p.numeroDI.toLowerCase().includes(q) ||
          p.conhecimento.toLowerCase().includes(q) ||
          p.local.toLowerCase().includes(q)
      )
    }

    // Canal filter
    if (canalFilter !== "all") {
      data = data.filter((p) => p.canal === canalFilter)
    }

    // Local filter
    if (localFilter !== "all") {
      data = data.filter((p) =>
        localFilter === LOCAL_VAZIO ? !String(p.local ?? "").trim() : p.local === localFilter
      )
    }

    // Sorting
    if (sortField) {
      data.sort((a, b) => {
        const aVal = a[sortField]
        const bVal = b[sortField]
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal
        }
        const aStr = String(aVal).toLowerCase()
        const bStr = String(bVal).toLowerCase()
        if (sortDirection === "asc") return aStr.localeCompare(bStr)
        return bStr.localeCompare(aStr)
      })
    }

    return data
  }, [processos, searchText, canalFilter, localFilter, sortField, sortDirection])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage))
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredData.slice(start, start + itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  // Summary counts from original data
  const greenCount = processos.filter((p) => p.canal === "VERDE").length
  const redCount = processos.filter((p) => p.canal === "VERMELHO").length
  const total = processos.length
  const greenPercent = total > 0 ? ((greenCount / total) * 100).toFixed(1) : "0"
  const redPercent = total > 0 ? ((redCount / total) * 100).toFixed(1) : "0"

  // Reset page on filter change
  const handleSearchChange = (val: string) => {
    setSearchText(val)
    setCurrentPage(1)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-30" />
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-accent" />
    ) : (
      <ArrowDown className="w-3 h-3 text-accent" />
    )
  }

  const clearFilters = () => {
    setSearchText("")
    setCanalFilter("all")
    setLocalFilter("all")
    setSortField(null)
    setCurrentPage(1)
  }

  const hasActiveFilters = searchText || canalFilter !== "all" || localFilter !== "all"

  // Export functions
  const generateCsvContent = useCallback(
    (data: Processo[]) => {
      const headers = TABLE_COLUMNS.map((c) => c.label).join(",")
      const rows = data.map((p) =>
        TABLE_COLUMNS.map((col) => {
          const val = p[col.key]
          if (col.format) return escapeCsvValue(formatCellValue(col, val))
          return escapeCsvValue(String(val))
        }).join(",")
      )
      return [headers, ...rows].join("\n")
    },
    []
  )

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const bom = "\uFEFF"
    const blob = new Blob([bom + content], { type: `${mimeType};charset=utf-8` })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    const csv = generateCsvContent(filteredData)
    downloadFile(csv, `processos_${new Date().toISOString().slice(0, 10)}.csv`, "text/csv")
  }

  const exportExcel = () => {
    // Generate a simple Excel-compatible HTML table
    const header = TABLE_COLUMNS.map((c) => `<th>${c.label}</th>`).join("")
    const rows = filteredData
      .map(
        (p) =>
          "<tr>" +
          TABLE_COLUMNS.map((col) => {
            const val = p[col.key]
            if (col.format === "usd" || col.format === "brl" || col.format === "number" || col.format === "integer")
              return `<td style="text-align:right">${formatCellValue(col, val)}</td>`
            return `<td>${String(val)}</td>`
          }).join("") +
          "</tr>"
      )
      .join("")

    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head><meta charset="UTF-8"></head>
        <body>
          <table border="1">
            <thead><tr>${header}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>`

    downloadFile(html, `processos_${new Date().toISOString().slice(0, 10)}.xls`, "application/vnd.ms-excel")
  }

  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <Card className="p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{companyName}</p>
            <h2 className="text-lg font-bold text-foreground">{reportTitle}</h2>
            <p className="text-sm text-muted-foreground">
              Periodo: {periodFrom} a {periodTo}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-2xl font-bold text-foreground">{greenCount}</span>
                </div>
                <span className="text-xs text-muted-foreground">Verde ({greenPercent}%)</span>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                  <span className="text-2xl font-bold text-foreground">{redCount}</span>
                </div>
                <span className="text-xs text-muted-foreground">Vermelho ({redPercent}%)</span>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <span className="text-2xl font-bold text-foreground">{total}</span>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="hidden lg:flex flex-col gap-1 min-w-[120px]">
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${greenPercent}%` }}
                />
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all"
                  style={{ width: `${Math.max(Number(redPercent), 2)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Toolbar: Search, Filters, Export */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          {/* Quick search */}
          <div className="relative flex-1 w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar processo, embarque, DI..."
              className="pl-10 h-9 bg-background"
            />
          </div>

          {/* Toggle filters */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`gap-2 ${showFilters ? "bg-accent/10 border-accent text-accent" : ""}`}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-accent" />
            )}
          </Button>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
              <X className="w-3 h-3" /> Limpar
            </Button>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Export buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2">
              <Download className="w-4 h-4" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportExcel} className="gap-2">
              <Download className="w-4 h-4" />
              Excel
            </Button>
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-end gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Canal</Label>
              <Select value={canalFilter} onValueChange={(v) => { setCanalFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="VERDE">Verde</SelectItem>
                  <SelectItem value="VERMELHO">Vermelho</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Local</Label>
              <Select value={localFilter} onValueChange={(v) => { setLocalFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[200px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {hasLocalVazio && (
                    <SelectItem value={LOCAL_VAZIO}>(Sem local)</SelectItem>
                  )}
                  {uniqueLocals.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Mostrando {filteredData.length} de {total} registros
            </p>
          </div>
        )}
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[1600px]">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-3 py-3 text-left font-semibold text-xs whitespace-nowrap w-[50px]">#</th>
                {TABLE_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={`px-3 py-3 font-semibold text-xs whitespace-nowrap cursor-pointer hover:bg-primary-foreground/10 transition-colors select-none ${
                      col.align === "right" ? "text-right" : "text-left"
                    }`}
                    onClick={() => handleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {getSortIcon(col.key)}
                    </span>
                  </th>
                ))}
                {detailViaButtonOnly && (
                  <th className="px-3 py-3 text-right font-semibold text-xs whitespace-nowrap w-[120px]">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={TABLE_COLUMNS.length + 1 + (detailViaButtonOnly ? 1 : 0)}
                    className="px-3 py-12 text-center text-muted-foreground"
                  >
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                paginatedData.map((processo, index) => {
                  const rowNumber = (currentPage - 1) * itemsPerPage + index + 1
                  return (
                    <tr
                      key={processo.id}
                      className={`border-b border-border last:border-0 even:bg-secondary/30 transition-colors ${
                        detailViaButtonOnly ? "" : "cursor-pointer hover:bg-accent/5"
                      }`}
                      onClick={detailViaButtonOnly ? undefined : () => onSelectProcess(processo)}
                    >
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{rowNumber}</td>
                      {TABLE_COLUMNS.map((col) => {
                        const val = processo[col.key]

                        // Canal badge
                        if (col.key === "canal") {
                          return (
                            <td key={col.key} className="px-3 py-2.5">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  val === "VERDE"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {val === "VERDE" ? "Verde" : "Vermelho"}
                              </span>
                            </td>
                          )
                        }

                        // Moeda / números (pt-BR)
                        if (col.format === "usd" || col.format === "brl" || col.format === "number" || col.format === "integer") {
                          return (
                            <td key={col.key} className="px-3 py-2.5 text-right text-foreground tabular-nums">
                              {formatCellValue(col, val)}
                            </td>
                          )
                        }

                        // No. Processo with accent
                        if (col.key === "noProcesso") {
                          return (
                            <td key={col.key} className="px-3 py-2.5 font-semibold text-accent">
                              {formatIntegerPtBr(val as number)}
                            </td>
                          )
                        }

                        return (
                          <td
                            key={col.key}
                            className={`px-3 py-2.5 text-foreground ${col.align === "right" ? "text-right" : ""}`}
                          >
                            {String(val)}
                          </td>
                        )
                      })}
                      {detailViaButtonOnly && (
                        <td
                          className="px-2 py-2 text-right border-l border-border/40"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="gap-1 h-8 text-xs shrink-0"
                            onClick={() => onSelectProcess(processo)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Detalhar
                          </Button>
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Itens por pagina:</span>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(v) => {
                setItemsPerPage(Number(v))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="w-4 h-4" />
              <span className="sr-only">Primeira pagina</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="sr-only">Pagina anterior</span>
            </Button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce<(number | string)[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...")
                acc.push(p)
                return acc
              }, [])
              .map((item, i) =>
                typeof item === "string" ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-muted-foreground text-sm">...</span>
                ) : (
                  <Button
                    key={item}
                    variant={currentPage === item ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(item)}
                    className={`h-8 w-8 p-0 ${currentPage === item ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}`}
                  >
                    {item}
                  </Button>
                )
              )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
              <span className="sr-only">Proxima pagina</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="w-4 h-4" />
              <span className="sr-only">Ultima pagina</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
