import { digitsOnly } from "@/lib/format-display"

/** Alinhado às colunas da base; repassado em `tipo_busca` para a API de detalhes. */
export type ProcessoBuscaCampo = "AUTO" | "CD_PROCESSO" | "NR_DI_DUIMP" | "IDT_EMBARQUE" | "HAWB_BL"

export type ProcessoBuscaCampoResolvido = Exclude<ProcessoBuscaCampo, "AUTO">

/**
 * Heurística quando o usuário escolhe "Automático":
 * - contém "/" → NR_DI_DUIMP (ex.: 26/0497547-4)
 * - letras + hífen (ex.: IMP-AM-26-0108) → IDT_EMBARQUE
 * - só dígitos → CD_PROCESSO (ex.: 365310); use o tipo explícito HAWB_BL se for só conhecimento numérico longo
 * - restante → HAWB_BL
 */
export function inferCampoBuscaProcesso(raw: string): ProcessoBuscaCampoResolvido {
  const t = raw.trim()
  if (!t) return "CD_PROCESSO"
  if (/\//.test(t)) return "NR_DI_DUIMP"
  if (/[A-Za-zÀ-ÿ]/.test(t) && /-/.test(t)) return "IDT_EMBARQUE"
  if (/^\d+$/.test(t)) return "CD_PROCESSO"
  return "HAWB_BL"
}

export function normalizeTermoParaCampo(campo: ProcessoBuscaCampoResolvido, raw: string): string {
  const t = raw.trim()
  if (!t) return ""
  switch (campo) {
    case "CD_PROCESSO":
      return digitsOnly(t)
    case "HAWB_BL":
      return t.replace(/\s/g, "")
    case "NR_DI_DUIMP":
      return t.replace(/\s+/g, "")
    case "IDT_EMBARQUE":
      return t.replace(/\s+/g, "")
  }
}

export function resolverCampoETermo(
  campoUi: ProcessoBuscaCampo,
  raw: string
): { campo: ProcessoBuscaCampoResolvido; termo: string } {
  const campo = campoUi === "AUTO" ? inferCampoBuscaProcesso(raw) : campoUi
  return { campo, termo: normalizeTermoParaCampo(campo, raw) }
}
