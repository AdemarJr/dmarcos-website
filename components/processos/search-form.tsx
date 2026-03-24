"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { isoDateToBr } from "@/lib/format-display"
import { Search, FileText, FileCheck, AlertTriangle, Building2 } from "lucide-react"

export type SearchType = "dis_registradas" | "dis_liberadas" | "mapa_pendencias"

export interface SearchParams {
  type: SearchType
  query: string
  dateFrom: string
  dateTo: string
}

interface SearchFormProps {
  companyName: string
  onSearch: (params: SearchParams) => void
}

const searchOptions: { value: SearchType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: "dis_registradas",
    label: "DIs Registradas",
    description: "Consultar DIs registradas no periodo",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    value: "dis_liberadas",
    label: "DIs Liberadas",
    description: "Consultar DIs ja liberadas",
    icon: <FileCheck className="w-5 h-5" />,
  },
  {
    value: "mapa_pendencias",
    label: "Mapa de Pendencias",
    description: "Visualizar pendencias em aberto",
    icon: <AlertTriangle className="w-5 h-5" />,
  },
]

export function SearchForm({ companyName, onSearch }: SearchFormProps) {
  const [searchType, setSearchType] = useState<SearchType>("dis_registradas")
  const [query, setQuery] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({ type: searchType, query, dateFrom, dateTo })
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Company badge */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <Building2 className="w-5 h-5 text-accent" />
        <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          {companyName}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Search type selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {searchOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSearchType(option.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                searchType === option.value
                  ? "border-accent bg-accent/5 text-accent"
                  : "border-border bg-card text-muted-foreground hover:border-accent/40 hover:bg-accent/5"
              }`}
            >
              <div className={`${searchType === option.value ? "text-accent" : "text-muted-foreground"}`}>
                {option.icon}
              </div>
              <span className="text-sm font-semibold">{option.label}</span>
              <span className="text-xs text-muted-foreground text-center leading-tight">
                {option.description}
              </span>
            </button>
          ))}
        </div>

        {/* Search by number */}
        <Card className="border-border">
          <CardContent className="pt-5 pb-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="query" className="text-sm font-medium text-foreground">
                Nro DI / Filhote / IDT Embarque / No. Processo
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 h-11 bg-background border-border"
                  placeholder="Digite para buscar..."
                />
              </div>
            </div>

            {/* Date range */}
            <div>
              <Label className="text-sm font-medium text-foreground mb-2 block">
                Periodo (dd/mm/aaaa)
              </Label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Label htmlFor="dateFrom" className="text-xs text-muted-foreground mb-1 block">De</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="h-10 bg-background border-border text-sm"
                  />
                </div>
                <span className="text-muted-foreground mt-5">-</span>
                <div className="flex-1">
                  <Label htmlFor="dateTo" className="text-xs text-muted-foreground mb-1 block">Ate</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="h-10 bg-background border-border text-sm"
                  />
                </div>
              </div>
              {dateFrom && dateTo && (
                <p className="text-xs text-muted-foreground">
                  Período selecionado: {isoDateToBr(dateFrom)} a {isoDateToBr(dateTo)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base"
        >
          <Search className="w-5 h-5 mr-2" />
          Pesquisar
        </Button>
      </form>
    </div>
  )
}
