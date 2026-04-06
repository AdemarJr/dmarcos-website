/**
 * NM_CANAL no banco (ex.): VERDE, ANALISE FISCAL, SEM PARAMETRIZACAO, VERMELHO.
 * Cores alinhadas ao significado operacional (verde / vermelho / análise / sem parametrização).
 */
export type CanalKind = "verde" | "vermelho" | "analise" | "semParam" | "default"

function norm(s: string): string {
  return s.trim().toUpperCase().replace(/_/g, " ").replace(/\s+/g, " ")
}

export function canalKind(canal: string): CanalKind {
  const n = norm(canal)
  if (!n) return "default"
  if (n.includes("VERMELH")) return "vermelho"
  if (n.includes("ANALISE") && n.includes("FISCAL")) return "analise"
  if (n.includes("PARAMETRIZ") || (n.includes("SEM") && n.includes("PARAM"))) return "semParam"
  if (n.includes("VERDE")) return "verde"
  return "default"
}

/** Fundo + texto + anel: um conjunto por tipo para não misturar visualmente na lista/detalhe. */
export function canalBadgeClassName(canal: string): string {
  switch (canalKind(canal)) {
    case "verde":
      return "bg-emerald-100 text-emerald-950 ring-1 ring-inset ring-emerald-400/90"
    case "vermelho":
      return "bg-red-100 text-red-950 ring-1 ring-inset ring-red-400/90"
    case "analise":
      return "bg-amber-100 text-amber-950 ring-1 ring-inset ring-amber-500/80"
    case "semParam":
      return "bg-purple-100 text-purple-950 ring-1 ring-inset ring-purple-500/85"
    default:
      return "bg-slate-100 text-slate-900 ring-1 ring-inset ring-slate-300"
  }
}

/** Bolinha do resumo — uma cor sólida bem diferente da outra. */
export function canalDotClassName(canal: string): string {
  switch (canalKind(canal)) {
    case "verde":
      return "bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.25)]"
    case "vermelho":
      return "bg-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.25)]"
    case "analise":
      return "bg-amber-400 shadow-[0_0_0_2px_rgba(251,191,36,0.35)]"
    case "semParam":
      return "bg-purple-600 shadow-[0_0_0_2px_rgba(147,51,234,0.3)]"
    default:
      return "bg-slate-400 shadow-[0_0_0_2px_rgba(148,163,184,0.35)]"
  }
}
