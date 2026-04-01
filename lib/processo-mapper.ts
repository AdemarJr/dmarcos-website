import type { Processo } from "@/lib/mock-processos"
import { formatApiDate } from "@/lib/format-display"

export function mapRowToProcesso(row: any): Processo {
  const pick = (...keys: string[]) => {
    for (const k of keys) {
      if (row?.[k] !== undefined && row?.[k] !== null) return row[k]
    }
    return undefined
  }

  const toNumber = (v: any, fallback = 0) => {
    const n = typeof v === "number" ? v : Number(String(v ?? "").replace(",", "."))
    return Number.isFinite(n) ? n : fallback
  }

  const toString = (v: any) => (v === undefined || v === null ? "" : String(v))

  const trimStr = (v: any) => toString(v).trim()

  /** Converte S/N da API em rótulo Sim/Não para o front */
  const mapSn = (v: any): string | undefined => {
    const s = trimStr(v).toUpperCase()
    if (!s) return undefined
    if (s === "S" || s === "SIM" || s === "Y" || s === "1") return "Sim"
    if (s === "N" || s === "NAO" || s === "NÃO") return "Não"
    return trimStr(v)
  }

  const cdProcesso = pick("CD_PROCESSO", "CODIGO_PROCESSO", "cd_processo", "id")
  const noProcessoRaw = pick("CD_PROCESSO", "CODIGO_PROCESSO", "NO_PROCESSO", "noProcesso", "NR_PROCESSO")

  const nmCanal = trimStr(pick("NM_CANAL", "CANAL", "canal")).toUpperCase().replace(/\s+/g, "")
  const canal: "VERDE" | "VERMELHO" = nmCanal.includes("VERMELH") ? "VERMELHO" : "VERDE"

  const dtRegistro = pick("DT_REGISTRO", "DATA_DA_DI", "DATA_REGISTRO")
  const dtChegadaRaw = pick("DT_CHEGADA", "DATA_CHEGADA", "dataChegada")
  const dtLiberacao = pick("DT_LIBERACAO", "LIBERACAO", "liberacao")
  const dtEmbarque = pick("DT_EMBARQUE", "DATA_EMBARQUE")
  const dtEntrega = pick("DT_ENTREGA", "DATA_ENTREGA")

  const seguroMoeda = pick("VL_SEGURO_MOEDA", "VALOR_SEGURO", "seguro")
  /** API pode vir com typo: VL_SEGURO_MOEDA_NACACIONAL */
  const seguroNac = pick(
    "VL_SEGURO_MOEDA_NACACIONAL",
    "VL_SEGURO_MOEDA_NACIONAL",
    "seguroNacional"
  )

  return {
    id: toString(cdProcesso || noProcessoRaw || pick("NR_DI_DUIMP", "NUMERO_DI") || crypto.randomUUID()),
    canal,
    noProcesso: toNumber(noProcessoRaw, 0),
    embarque: trimStr(pick("IDT_EMBARQUE", "EMBARQUE", "embarque")),
    dataAbertura: formatApiDate(dtRegistro),
    conhecimento: trimStr(pick("HAWB_BL", "NR_DOC_CHEGADA", "NUMERO_DOC_CHEGADA", "conhecimento")),
    dataChegada: formatApiDate(dtChegadaRaw),
    numeroDI: trimStr(pick("NR_DI_DUIMP", "NUMERO_DI", "numeroDI")),
    dataDI: formatApiDate(dtRegistro),
    local: trimStr(pick("NM_ARMAZEM", "ARMAZEM", "local")),
    valorFobUsd: toNumber(pick("VL_FOB_LOCAL_EMBARQUE", "VALOR_FOB_LOC_EMB", "valorFobUsd")),
    valorFobBrl: toNumber(pick("VL_FOB_MOEDA_NACIONAL", "VL_FOB_REAL", "VALOR_FOB_MOEDA_NAC", "valorFobBrl")),
    txSiscomex: toNumber(pick("VL_TX_SISCOMEX", "TAXA_UTILIZACAO_SISCOMEX", "txSiscomex")),
    iiPg: toNumber(pick("VL_II_PAGO", "iiPg")),
    ipiPg: toNumber(pick("VL_IPI_PAGO", "ipiPg")),
    pisPg: toNumber(pick("VL_PIS_PAGO", "pisPg")),
    cofinsPg: toNumber(pick("VL_COFINS_PAGO", "cofinsPg")),
    pbCarga: toNumber(pick("PESO_BRUTO", "PBCARGA", "pbCarga")),
    plCarga: toNumber(pick("PESO_LIQUIDO", "PLCARGA", "plCarga")),
    qtdVol: toNumber(pick("QTD_VOLUMES", "QTDE_VOLUMES", "qtdVol")),
    qtdCont: toNumber(pick("QTD_CONTAINER", "qtdCont")),
    status: trimStr(pick("STATUS_PROCESSO", "STATUS", "status")),
    hawb: trimStr(pick("HAWB_BL", "NUMERO_FILHOTE", "hawb")),
    taxaDolarDI: toNumber(pick("VL_TX_DOLAR_DI", "TAXA_DOLAR_DI", "taxaDolarDI")),
    armazem: trimStr(pick("NM_ARMAZEM", "ARMAZEM", "armazem")),
    ftPrepaid: toNumber(pick("VL_FRETE_PRAPAID_MOEDA", "VALOR_FRETE_PRAPAID", "ftPrepaid")),
    ftCollect: toNumber(pick("VL_FRETE_COLECT_MOEDA", "VALOR_FRETE_COLECT", "ftCollect")),
    seguro: toNumber(seguroMoeda !== undefined ? seguroMoeda : seguroNac),
    dtChegada: formatApiDate(dtChegadaRaw),
    entSefaz: trimStr(pick("INSCRICAO_SEFAZ", "entSefaz")),
    saidaSefaz: toString(pick("DT_SAIDA_SEFAZ", "SAIDA_SEFAZ", "saidaSefaz")),
    liberacao: formatApiDate(dtLiberacao),
    transporte: trimStr(pick("NM_VIA_TRANSPORTE", "VIA_TRANSPORTE", "transporte")),
    valorCif: toNumber(pick("VL_CIF_DOLAR", "VALOR_CIF", "valorCif")),
    armazenagPeriodo: "",
    armazenagDtPagamento: "",
    armazenagDtVencimento: "",
    armazenagVlPagamento: "",
    armazenagCplPagmto: "",
    capataziaDtPagto: "",
    capataziaVlPagto: "",
    capataziaCplPagto: "",
    aftn: "",
    desovaDtPgto: "",
    desovaDtExcl: "",
    desovaValores: "",
    desovaCplPgto: "",
    dataParametrizacao: "",
    dataMantra: "",
    qtdeAdicoes: toNumber(pick("QTD_ADICOES", "QTDE_ADICOES", "qtdeAdicoes")),
    valorFobLocEmbarque: toNumber(pick("VL_FOB_LOCAL_EMBARQUE", "valorFobLocEmbarque")),
    historico: trimStr(pick("HISTORICO", "historico")),

    nmCliente: trimStr(pick("NM_CLIENTE", "nmCliente")) || undefined,
    tpDeclaracao: trimStr(pick("TP_DECLARACAO", "tpDeclaracao")) || undefined,
    tipoProcesso: trimStr(pick("TPO_PROCESSO", "tipoProcesso")) || undefined,
    cdCliente: (() => {
      const v = pick("CD_CLIENTE", "cdCliente")
      return v !== undefined && v !== null ? toNumber(v, 0) : undefined
    })(),
    nrCeMercante: trimStr(pick("NR_CE_MERCANTE", "nrCeMercante")) || undefined,
    nrProtocolo: trimStr(pick("NR_PROTOCOLO", "nrProtocolo")) || undefined,
    dtEmbarque: formatApiDate(dtEmbarque) || undefined,
    dtEntrega: formatApiDate(dtEntrega) || undefined,
    nmLocalEmbarque: trimStr(pick("NM_LOCAL_EMBARQUE", "nmLocalEmbarque")) || undefined,
    nmExportador: trimStr(pick("NM_EXPORTADOR", "nmExportador")) || undefined,
    nmAgenteCarga: trimStr(pick("NM_AGENTE_CARGA", "nmAgenteCarga")) || undefined,
    nmVeiculoTransporte: trimStr(pick("NM_VEICULO_TRANSPORTE", "nmVeiculoTransporte")) || undefined,
    nmAgenteTransportador: trimStr(pick("NM_AGENTE_TRANSPORTADOR", "nmAgenteTransportador")) || undefined,
    vlFreteMoedaNacional: toNumber(pick("VL_FRETE_MOEDA_NACIONAL", "vlFreteMoedaNacional")),
    vlSeguroMoedaNacional: toNumber(pick("VL_SEGURO_MOEDA_NACACIONAL", "VL_SEGURO_MOEDA_NACACIONAL", "vlSeguroMoedaNacional")),
    vlTcif: toNumber(pick("VL_TCIF", "vlTcif")),
    vlIiDevido: toNumber(pick("VL_II_DEVIDO", "vlIiDevido")),
    vlIpiDevido: toNumber(pick("VL_IPI_DEVIDO", "vlIpiDevido")),
    vlPisDevido: toNumber(pick("VL_PIS_DEVIDO", "vlPisDevido")),
    vlCofinsDevido: toNumber(pick("VL_COFINS_DEVIDO", "vlCofinsDevido")),
    vlTaxasRecolher: toNumber(pick("VL_TAXAS_RECOLHER", "vlTaxasRecolher")),
    vlIiRecolher: toNumber(pick("VL_II_RECOLHER", "vlIiRecolher")),
    vlIpiRecolher: toNumber(pick("VL_IPI_RECOLHER", "vlIpiRecolher")),
    vlPisRecolher: toNumber(pick("VL_PIS_RECOLHER", "vlPisRecolher")),
    vlCofinsRecolher: toNumber(pick("VL_COFINS_RECOLHER", "vlCofinsRecolher")),
    bancoAgenciaConta: trimStr(pick("BANCO_AGENCIA_CONTA", "bancoAgenciaConta")) || undefined,
    cdIncoterm: trimStr(pick("CD_INCOTERM", "cdIncoterm")) || undefined,
    cdMoedaFob: trimStr(pick("CD_MOEDA_FOB", "cdMoedaFob")) || undefined,
    nmPendenciaMapa: trimStr(pick("NM_PENDENCIA_MAPA", "nmPendenciaMapa")) || undefined,
    cdRecintoAlfandegado: trimStr(pick("CD_RECINTO_ALFADEGADO", "cdRecintoAlfandegado")) || undefined,
    nmDocChegada: trimStr(pick("NM_DOC_CHEGADA", "nmDocChegada")) || undefined,

    usadoIndustria: mapSn(pick("USADO_INDUSTRIA", "usadoIndustria")),
    usadoAtivoPpb: mapSn(pick("USADO_ATIVO_PPB", "usadoAtivoPpb")),
    usadoAtivoNaoPpb: mapSn(pick("USADO_ATIVO_NAO_PPB", "usadoAtivoNaoPpb")),
    usadoUsoConsumo: mapSn(pick("USADO_USO_CONSUMO", "usadoUsoConsumo")),
    usadoComercializacao: mapSn(pick("USADO_COMERCIALIZACAO", "usadoComercializacao")),
    usadoPexpam: mapSn(pick("USADO_PEXPAM", "usadoPexpam")),
  }
}
