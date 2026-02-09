"use client"

import type { Processo } from "@/lib/mock-processos"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Printer, Ship, Building2, FileText, Calendar, DollarSign, Package, Warehouse } from "lucide-react"

interface ProcessDetailProps {
  processo: Processo
  companyName: string
  onClose: () => void
}

function DetailField({ label, value, bold = false }: { label: string; value: string | number; bold?: boolean }) {
  const displayValue =
    typeof value === "number"
      ? value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 4 })
      : value

  if (!displayValue && displayValue !== 0) return null

  return (
    <div className="flex items-baseline justify-between gap-2 py-1.5 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className={`text-sm text-right ${bold ? "font-bold text-foreground" : "text-foreground"}`}>
        {displayValue}
      </span>
    </div>
  )
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-accent">{icon}</span>
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">{title}</h3>
    </div>
  )
}

export function ProcessDetail({ processo, companyName, onClose }: ProcessDetailProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between print:hidden">
        <Button variant="outline" size="sm" onClick={onClose} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar aos Resultados
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" />
          Imprimir
        </Button>
      </div>

      {/* Header card */}
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{companyName}</p>
              <h1 className="text-xl font-bold text-foreground">
                Processo #{processo.noProcesso}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Detalhes do processo - On-line</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${
                  processo.canal === "VERDE"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {processo.canal === "VERDE" ? "Canal Verde" : "Canal Vermelho"}
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-secondary text-foreground">
                {processo.status}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main content grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Process info */}
        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <SectionTitle icon={<FileText className="w-4 h-4" />} title="Dados do Processo" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <DetailField label="Embarque" value={processo.embarque} bold />
            <DetailField label="Abertura" value={processo.dataAbertura} />
            <DetailField label="HAWB" value={processo.hawb} />
            <DetailField label="Numero DI" value={processo.numeroDI} bold />
            <DetailField label="Data DI" value={processo.dataDI} />
            <DetailField label="Transporte" value={processo.transporte} />
          </CardContent>
        </Card>

        {/* Financial info */}
        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <SectionTitle icon={<DollarSign className="w-4 h-4" />} title="Valores e Taxas" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <DetailField label="Taxa Dolar DI" value={processo.taxaDolarDI} bold />
            <DetailField label="Tx. SISCOMEX" value={processo.txSiscomex} />
            <DetailField label="Valor CIF" value={processo.valorCif} bold />
            <DetailField label="Valor FOB (USD)" value={processo.valorFobUsd} />
            <DetailField label="Valor FOB (R$)" value={processo.valorFobBrl} />
            <DetailField label="Valor FOB Loc. Embarque" value={processo.valorFobLocEmbarque} />
          </CardContent>
        </Card>

        {/* Logistics */}
        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <SectionTitle icon={<Ship className="w-4 h-4" />} title="Frete e Seguro" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <DetailField label="Ft Prepaid" value={processo.ftPrepaid} />
            <DetailField label="Ft Collect" value={processo.ftCollect} />
            <DetailField label="Seguro" value={processo.seguro} />
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <SectionTitle icon={<Calendar className="w-4 h-4" />} title="Datas" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <DetailField label="Dt Chegada" value={processo.dtChegada} />
            <DetailField label="Ent SEFAZ" value={processo.entSefaz} />
            <DetailField label="Saida SEFAZ" value={processo.saidaSefaz} />
            <DetailField label="Liberacao" value={processo.liberacao} />
            <DetailField label="Data Parametrizacao" value={processo.dataParametrizacao} />
            <DetailField label="Data Mantra" value={processo.dataMantra} />
          </CardContent>
        </Card>

        {/* Storage / Armazenagem */}
        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <SectionTitle icon={<Warehouse className="w-4 h-4" />} title="Armazenagem" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <DetailField label="Armazem" value={processo.armazem} bold />
            <DetailField label="Periodo" value={processo.armazenagPeriodo} />
            <DetailField label="Dt Pagamento" value={processo.armazenagDtPagamento} />
            <DetailField label="Dt Vencimento" value={processo.armazenagDtVencimento} />
            <DetailField label="Vl Pagamento" value={processo.armazenagVlPagamento} />
            <DetailField label="Cpl. Pagmto" value={processo.armazenagCplPagmto} />
          </CardContent>
        </Card>

        {/* Capatazia & Desova */}
        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <SectionTitle icon={<Package className="w-4 h-4" />} title="Capatazia / Desova" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <DetailField label="Capatazia Dt. Pagto" value={processo.capataziaDtPagto} />
            <DetailField label="Capatazia Vl Pagto" value={processo.capataziaVlPagto} />
            <DetailField label="Capatazia Cpl Pagto" value={processo.capataziaCplPagto} />
            <DetailField label="AFTN" value={processo.aftn} />
            <DetailField label="Desova Dt Pgto" value={processo.desovaDtPgto} />
            <DetailField label="Desova Dt Excl" value={processo.desovaDtExcl} />
            <DetailField label="Desova Valores" value={processo.desovaValores} />
            <DetailField label="Desova Cpl Pgto" value={processo.desovaCplPgto} />
            <DetailField label="Qtde de Adicoes" value={processo.qtdeAdicoes} />
          </CardContent>
        </Card>
      </div>

      {/* Historico */}
      <Card>
        <CardHeader className="pb-3 pt-5 px-5">
          <SectionTitle icon={<Building2 className="w-4 h-4" />} title="Historico" />
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {processo.historico ? (
            <p className="text-sm text-foreground leading-relaxed">{processo.historico}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">Nenhum historico registrado.</p>
          )}
        </CardContent>
      </Card>

      {/* Bottom actions */}
      <div className="flex items-center justify-between print:hidden pb-8">
        <Button variant="outline" size="sm" onClick={onClose} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" />
          Imprimir
        </Button>
      </div>
    </div>
  )
}
