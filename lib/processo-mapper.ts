import type { Processo } from "@/lib/mock-processos"

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

  const cdProcesso = pick("CD_PROCESSO", "CODIGO_PROCESSO", "cd_processo", "id")
  const noProcessoRaw = pick("CD_PROCESSO", "CODIGO_PROCESSO", "NO_PROCESSO", "noProcesso", "NR_PROCESSO")

  return {
    id: toString(cdProcesso || noProcessoRaw || pick("NR_DI_DUIMP", "NUMERO_DI") || crypto.randomUUID()),
    canal: (toString(pick("NM_CANAL", "CANAL", "canal")).toUpperCase() === "VERMELHO" ? "VERMELHO" : "VERDE") as
      | "VERDE"
      | "VERMELHO",
    noProcesso: toNumber(noProcessoRaw, 0),
    embarque: toString(pick("IDT_EMBARQUE", "EMBARQUE", "embarque")),
    dataAbertura: toString(pick("DT_REGISTRO", "DATA_ABERTURA", "dataAbertura")),
    conhecimento: toString(pick("NR_DOC_CHEGADA", "NUMERO_DOC_CHEGADA", "conhecimento")),
    dataChegada: toString(pick("DT_CHEGADA", "DATA_CHEGADA", "dataChegada")),
    numeroDI: toString(pick("NR_DI_DUIMP", "NUMERO_DI", "numeroDI")),
    dataDI: toString(pick("DT_REGISTRO", "DATA_DA_DI", "dataDI")),
    local: toString(pick("NM_ARMAZEM", "ARMAZEM", "local")),
    valorFobUsd: toNumber(pick("VL_FOB_LOCAL_EMBARQUE", "VALOR_FOB_LOC_EMB", "valorFobUsd")),
    valorFobBrl: toNumber(pick("VL_FOB_MOEDA_NACIONAL", "VALOR_FOB_MOEDA_NAC", "valorFobBrl")),
    txSiscomex: toNumber(pick("VL_TX_SISCOMEX", "TAXA_UTILIZACAO_SISCOMEX", "txSiscomex")),
    iiPg: toNumber(pick("VL_II_PAGO", "iiPg")),
    ipiPg: toNumber(pick("VL_IPI_PAGO", "ipiPg")),
    pisPg: toNumber(pick("VL_PIS_PAGO", "pisPg")),
    cofinsPg: toNumber(pick("VL_COFINS_PAGO", "cofinsPg")),
    pbCarga: toNumber(pick("PESO_BRUTO", "PBCARGA", "pbCarga")),
    plCarga: toNumber(pick("PESO_LIQUIDO", "PLCARGA", "plCarga")),
    qtdVol: toNumber(pick("QTD_VOLUMES", "QTDE_VOLUMES", "qtdVol")),
    qtdCont: toNumber(pick("QTD_CONTAINER", "qtdCont")),
    status: toString(pick("STATUS_PROCESSO", "STATUS", "status")),
    hawb: toString(pick("HAWB_BL", "NUMERO_FILHOTE", "hawb")),
    taxaDolarDI: toNumber(pick("VL_TX_DOLAR_DI", "TAXA_DOLAR_DI", "taxaDolarDI")),
    armazem: toString(pick("NM_ARMAZEM", "ARMAZEM", "armazem")),
    ftPrepaid: toNumber(pick("VL_FRETE_PRAPAID_MOEDA", "VALOR_FRETE_PRAPAID", "ftPrepaid")),
    ftCollect: toNumber(pick("VL_FRETE_COLECT_MOEDA", "VALOR_FRETE_COLECT", "ftCollect")),
    seguro: toNumber(pick("VL_SEGURO_MOEDA", "VALOR_SEGURO", "seguro")),
    dtChegada: toString(pick("DT_CHEGADA", "DATACHEGADA", "dtChegada")),
    entSefaz: toString(pick("INSCRICAO_SEFAZ", "entSefaz")),
    saidaSefaz: toString(pick("DT_LIBERACAO", "saidaSefaz")),
    liberacao: toString(pick("DT_LIBERACAO", "LIBERACAO", "liberacao")),
    transporte: toString(pick("NM_VIA_TRANSPORTE", "VIA_TRANSPORTE", "transporte")),
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
    historico: "",
  }
}

