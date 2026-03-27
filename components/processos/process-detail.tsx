"use client"

import type { Processo } from "@/lib/mock-processos"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  ArrowLeft,
  Printer,
  Ship,
  Building2,
  FileText,
  Calendar,
  DollarSign,
  Package,
  Warehouse,
  User,
  Scale,
} from "lucide-react"
import {
  formatCurrencyBrl,
  formatCurrencyUsd,
  formatDecimalPtBr,
  formatIntegerPtBr,
  formatRatePtBr,
  formatWeightKg,
} from "@/lib/format-display"

interface ProcessDetailProps {
  processo: Processo
  companyName: string
  onClose: () => void
  /** Texto do botão para fechar o detalhe (ex.: lista de DIs vs. busca por número). */
  closeLabel?: string
}

type DetailFormat = "text" | "integer" | "decimal" | "brl" | "usd" | "rate" | "weight"

function DetailField({
  label,
  value,
  format = "text",
  bold = false,
}: {
  label: string
  value: string | number
  format?: DetailFormat
  bold?: boolean
}) {
  let display = ""
  if (format === "text") {
    display = typeof value === "string" ? value.trim() : String(value)
  } else if (format === "integer") {
    display = formatIntegerPtBr(value)
  } else if (format === "decimal") {
    display = formatDecimalPtBr(value)
  } else if (format === "brl") {
    display = formatCurrencyBrl(value)
  } else if (format === "usd") {
    display = formatCurrencyUsd(value)
  } else if (format === "rate") {
    display = formatRatePtBr(value)
  } else if (format === "weight") {
    display = formatWeightKg(value)
  }

  if (display === "") return null
  if (format !== "text" && typeof value === "number" && !Number.isFinite(value)) return null

  return (
    <div className="flex items-baseline justify-between gap-2 py-1.5 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className={`text-sm text-right ${bold ? "font-bold text-foreground" : "text-foreground"}`}>
        {display}
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

export function ProcessDetail({ processo, companyName, onClose, closeLabel = "Nova busca" }: ProcessDetailProps) {
  const handlePrint = () => {
    window.print()
  }

  const statusLabel = (processo.status || "").trim() || "—"
  const canalLabel = processo.canal === "VERDE" ? "Canal Verde" : "Canal Vermelho"

  return (
    <div className="processo-print-document max-w-5xl mx-auto space-y-4 print:max-w-none print:space-y-3">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="outline" size="sm" onClick={onClose} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          {closeLabel}
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" />
          Imprimir
        </Button>
      </div>

      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{companyName}</p>
              <h1 className="text-xl font-bold text-foreground">
                Processo #{formatIntegerPtBr(processo.noProcesso)}
              </h1>
              {processo.nmCliente && (
                <p className="text-sm text-foreground mt-2 font-medium leading-snug">{processo.nmCliente}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1 print:hidden">Detalhes do processo</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${
                  processo.canal === "VERDE" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                }`}
              >
                {canalLabel}
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-secondary text-foreground">
                {statusLabel}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <SectionTitle icon={<User className="w-4 h-4" />} title="Cliente e documento" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <DetailField label="DI / DUIMP" value={processo.numeroDI} bold />
            <DetailField label="Incoterm" value={processo.cdIncoterm ?? ""} />
            <DetailField label="Moeda FOB (cód.)" value={processo.cdMoedaFob ?? ""} />
            <DetailField label="NR CE Mercante" value={processo.nrCeMercante ?? ""} />
            <DetailField label="NR Protocolo" value={processo.nrProtocolo ?? ""} />
            <DetailField label="Recinto alfandegado" value={processo.cdRecintoAlfandegado ?? ""} />
            <DetailField label="Pendência MAPA" value={processo.nmPendenciaMapa ?? ""} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <SectionTitle icon={<FileText className="w-4 h-4" />} title="Dados do processo" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <DetailField label="Embarque (ID)" value={processo.embarque} bold />
            <DetailField label="Doc. chegada" value={processo.conhecimento} />
            <DetailField label="Nome doc. chegada" value={processo.nmDocChegada ?? ""} />
            <DetailField label="HAWB / BL" value={processo.hawb} />
            <DetailField label="Data registro (DI)" value={processo.dataDI} />
            <DetailField label="Transporte" value={processo.transporte} />
            <DetailField label="Local embarque" value={processo.nmLocalEmbarque ?? ""} />
            <DetailField label="Exportador" value={processo.nmExportador ?? ""} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <SectionTitle icon={<DollarSign className="w-4 h-4" />} title="Valores e taxas" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <DetailField label="Taxa dólar DI" value={processo.taxaDolarDI} bold format="rate" />
            <DetailField label="Tx. SISCOMEX" value={processo.txSiscomex} format="brl" />
            <DetailField label="VL TCIF" value={processo.vlTcif ?? ""} format="brl" />
            <DetailField label="Valor CIF (US$)" value={processo.valorCif} bold format="usd" />
            <DetailField label="Valor FOB (moeda origem)" value={processo.valorFobUsd} format="usd" />
            <DetailField label="Valor FOB (R$)" value={processo.valorFobBrl} format="brl" />
            <DetailField label="Valor FOB local embarque" value={processo.valorFobLocEmbarque} format="usd" />
            <DetailField label="Frete (R$ nacional)" value={processo.vlFreteMoedaNacional ?? ""} format="brl" />
            <DetailField label="Seguro (R$ nacional)" value={processo.vlSeguroMoedaNacional ?? ""} format="brl" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <SectionTitle icon={<Scale className="w-4 h-4" />} title="Impostos (devido / recolher / pago)" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <DetailField label="II devido" value={processo.vlIiDevido ?? ""} format="brl" />
            <DetailField label="IPI devido" value={processo.vlIpiDevido ?? ""} format="brl" />
            <DetailField label="PIS devido" value={processo.vlPisDevido ?? ""} format="brl" />
            <DetailField label="COFINS devido" value={processo.vlCofinsDevido ?? ""} format="brl" />
            <DetailField label="Taxas a recolher" value={processo.vlTaxasRecolher ?? ""} format="brl" />
            <DetailField label="II recolher" value={processo.vlIiRecolher ?? ""} format="brl" />
            <DetailField label="IPI recolher" value={processo.vlIpiRecolher ?? ""} format="brl" />
            <DetailField label="PIS recolher" value={processo.vlPisRecolher ?? ""} format="brl" />
            <DetailField label="COFINS recolher" value={processo.vlCofinsRecolher ?? ""} format="brl" />
            <DetailField label="II pago" value={processo.iiPg} format="brl" />
            <DetailField label="IPI pago" value={processo.ipiPg} format="brl" />
            <DetailField label="PIS pago" value={processo.pisPg} format="brl" />
            <DetailField label="COFINS pago" value={processo.cofinsPg} format="brl" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <SectionTitle icon={<Ship className="w-4 h-4" />} title="Frete e seguro" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <DetailField label="Frete prepaid" value={processo.ftPrepaid} format="usd" />
            <DetailField label="Frete collect" value={processo.ftCollect} format="usd" />
            <DetailField label="Seguro (moeda)" value={processo.seguro} format="usd" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <SectionTitle icon={<Calendar className="w-4 h-4" />} title="Datas" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <DetailField label="Embarque" value={processo.dtEmbarque ?? ""} />
            <DetailField label="Chegada" value={processo.dtChegada} />
            <DetailField label="Liberação" value={processo.liberacao} />
            <DetailField label="Entrega" value={processo.dtEntrega ?? ""} />
            <DetailField label="Saída SEFAZ" value={processo.saidaSefaz} />
            <DetailField label="Data parametrização" value={processo.dataParametrizacao} />
            <DetailField label="Data Mantra" value={processo.dataMantra} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <SectionTitle icon={<Warehouse className="w-4 h-4" />} title="Armazém e transporte" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <DetailField label="Armazém" value={processo.armazem} bold />
            <DetailField label="Local (lista)" value={processo.local} />
            <DetailField label="Agente de carga" value={processo.nmAgenteCarga ?? ""} />
            <DetailField label="Veículo / viagem" value={processo.nmVeiculoTransporte ?? ""} />
            <DetailField label="Agente transportador" value={processo.nmAgenteTransportador ?? ""} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <SectionTitle icon={<Package className="w-4 h-4" />} title="Carga e adições" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <DetailField label="Peso bruto (kg)" value={processo.pbCarga} format="weight" />
            <DetailField label="Peso líquido (kg)" value={processo.plCarga} format="weight" />
            <DetailField label="Qtd. volumes" value={processo.qtdVol} format="integer" />
            <DetailField label="Qtd. containers" value={processo.qtdCont} format="integer" />
            <DetailField label="Qtd. adições" value={processo.qtdeAdicoes} format="integer" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <SectionTitle icon={<Building2 className="w-4 h-4" />} title="Armazenagem / capatazia / desova" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <DetailField label="Período" value={processo.armazenagPeriodo} />
            <DetailField label="Dt. pagamento" value={processo.armazenagDtPagamento} />
            <DetailField label="Dt. vencimento" value={processo.armazenagDtVencimento} />
            <DetailField label="Vl. pagamento" value={processo.armazenagVlPagamento} />
            <DetailField label="Cpl. pagamento" value={processo.armazenagCplPagmto} />
            <DetailField label="Capatazia dt. pagto" value={processo.capataziaDtPagto} />
            <DetailField label="Capatazia vl. pagto" value={processo.capataziaVlPagto} />
            <DetailField label="Capatazia cpl. pagto" value={processo.capataziaCplPagto} />
            <DetailField label="AFTN" value={processo.aftn} />
            <DetailField label="Desova dt. pgto" value={processo.desovaDtPgto} />
            <DetailField label="Desova dt. excl." value={processo.desovaDtExcl} />
            <DetailField label="Desova valores" value={processo.desovaValores} />
            <DetailField label="Desova cpl. pgto" value={processo.desovaCplPgto} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 pt-5 px-5">
          <SectionTitle icon={<Building2 className="w-4 h-4" />} title="Histórico" />
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {processo.historico ? (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{processo.historico}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">Nenhum histórico registrado.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between print:hidden pb-8">
        <Button variant="outline" size="sm" onClick={onClose} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          {closeLabel}
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" />
          Imprimir
        </Button>
      </div>
    </div>
  )
}
