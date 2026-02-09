"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Search, ArrowLeft } from "lucide-react"
import { SearchForm, type SearchParams } from "@/components/processos/search-form"
import { ProcessTable } from "@/components/processos/process-table"
import { ProcessDetail } from "@/components/processos/process-detail"
import { mockProcessos, type Processo } from "@/lib/mock-processos"

type View = "search" | "results" | "detail"

const COMPANY_NAME = "VALGROUP AM INDUSTRIA DE EMBALAGENS FLEXIVEIS LTDA"

export default function ProcessosPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentView, setCurrentView] = useState<View>("search")
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null)
  const [selectedProcess, setSelectedProcess] = useState<Processo | null>(null)
  const [filteredProcessos, setFilteredProcessos] = useState<Processo[]>([])

  useEffect(() => {
    setMounted(true)
    const auth = localStorage.getItem("dmarcos_auth")
    if (!auth) {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("dmarcos_auth")
    router.push("/")
  }

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params)

    let results = [...mockProcessos]

    if (params.query.trim()) {
      const q = params.query.toLowerCase().trim()
      results = results.filter(
        (p) =>
          p.numeroDI.toLowerCase().includes(q) ||
          p.embarque.toLowerCase().includes(q) ||
          String(p.noProcesso).includes(q) ||
          p.conhecimento.toLowerCase().includes(q)
      )
    }

    setFilteredProcessos(results)
    setCurrentView("results")
  }

  const handleSelectProcess = (processo: Processo) => {
    setSelectedProcess(processo)
    setCurrentView("detail")
  }

  const handleBackToResults = () => {
    setSelectedProcess(null)
    setCurrentView("results")
  }

  const handleBackToSearch = () => {
    setCurrentView("search")
    setFilteredProcessos([])
    setSearchParams(null)
  }

  if (!mounted) return null

  const getReportTitle = () => {
    if (!searchParams) return ""
    switch (searchParams.type) {
      case "dis_registradas":
        return "DIs Registradas: Importacao"
      case "dis_liberadas":
        return "DIs Liberadas: Importacao"
      case "mapa_pendencias":
        return "Mapa de Pendencias"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm print:hidden">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Dmarcos" className="h-9" />
            <div className="h-6 w-px bg-border hidden sm:block" />
            <span className="text-sm font-medium text-foreground hidden sm:inline">
              Consulta de Processos
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentView === "results" && (
              <Button
                onClick={handleBackToSearch}
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Nova Pesquisa</span>
              </Button>
            )}
            {currentView === "detail" && (
              <Button
                onClick={handleBackToResults}
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Resultados</span>
              </Button>
            )}
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {currentView === "search" && (
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <Search className="w-4 h-4" />
                Consulta Online
              </div>
              <h1 className="text-3xl font-bold text-foreground text-balance">
                Consulta de Processos
              </h1>
              <p className="text-muted-foreground mt-2 text-balance">
                Pesquise por DIs registradas, liberadas ou consulte o mapa de pendencias.
              </p>
            </div>
            <SearchForm companyName={COMPANY_NAME} onSearch={handleSearch} />
          </div>
        )}

        {currentView === "results" && (
          <div className="container mx-auto px-4 py-6">
            <ProcessTable
              companyName={COMPANY_NAME}
              reportTitle={getReportTitle()}
              periodFrom={searchParams?.dateFrom || "01/12/2025"}
              periodTo={searchParams?.dateTo || "31/12/2025"}
              processos={filteredProcessos}
              onSelectProcess={handleSelectProcess}
              onBack={handleBackToSearch}
            />
          </div>
        )}

        {currentView === "detail" && selectedProcess && (
          <div className="container mx-auto px-4 py-6">
            <ProcessDetail
              processo={selectedProcess}
              companyName={COMPANY_NAME}
              onClose={handleBackToResults}
            />
          </div>
        )}
      </main>
    </div>
  )
}
