/**
 * Formatação centralizada para exibição no front (pt-BR).
 * Use em visualizações; em inputs de CNPJ use `maskCnpjInput` + `digitsOnly` no envio.
 */

const LOCALE = "pt-BR" as const

export function digitsOnly(s: string): string {
  return String(s ?? "").replace(/\D/g, "")
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  let s = String(value ?? "")
    .trim()
    .replace(/\s/g, "")
  if (s === "") return null
  if (s.includes(",") && s.includes(".")) {
    s = s.replace(/\./g, "").replace(",", ".")
  } else if (s.includes(",")) {
    s = s.replace(",", ".")
  }
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

/** Número decimal com casas configuráveis (valores monetários genéricos, peso, etc.) */
export function formatDecimalPtBr(
  value: unknown,
  opts?: { min?: number; max?: number }
): string {
  const n = toFiniteNumber(value)
  if (n === null) return ""
  return n.toLocaleString(LOCALE, {
    minimumFractionDigits: opts?.min ?? 2,
    maximumFractionDigits: opts?.max ?? 4,
  })
}

export function formatIntegerPtBr(value: unknown): string {
  const n = toFiniteNumber(value)
  if (n === null) return ""
  return n.toLocaleString(LOCALE, { maximumFractionDigits: 0 })
}

export function formatCurrencyBrl(value: unknown): string {
  const n = toFiniteNumber(value)
  if (n === null) return ""
  return n.toLocaleString(LOCALE, { style: "currency", currency: "BRL" })
}

export function formatCurrencyUsd(value: unknown): string {
  const n = toFiniteNumber(value)
  if (n === null) return ""
  return n.toLocaleString(LOCALE, { style: "currency", currency: "USD" })
}

/** Taxas / câmbio (ex.: VL_TX_DOLAR_DI) */
export function formatRatePtBr(value: unknown): string {
  return formatDecimalPtBr(value, { min: 2, max: 6 })
}

/** Peso em kg */
export function formatWeightKg(value: unknown): string {
  return formatDecimalPtBr(value, { min: 2, max: 3 })
}

/** Datas ISO ou string da API → dd/mm/aaaa (UTC) */
export function formatApiDate(value: unknown): string {
  if (value === undefined || value === null || value === "") return ""
  const s = String(value).trim()
  if (!s) return ""
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return s
  return d.toLocaleDateString(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  })
}

/** Valor de `<input type="date">` (YYYY-MM-DD) → dd/mm/aaaa */
export function isoDateToBr(iso: string): string {
  if (!iso?.trim()) return "—"
  const [y, m, d] = iso.split("-")
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}

/** CNPJ apenas para leitura (14 dígitos); senão devolve texto original trimado */
export function formatCnpjDisplay(value: unknown): string {
  const raw = String(value ?? "").trim()
  const d = digitsOnly(raw)
  if (d.length !== 14) return raw
  return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
}

/** Máscara progressiva CNPJ no formulário (máx. 14 dígitos) */
export function maskCnpjInput(raw: string): string {
  const d = digitsOnly(raw).slice(0, 14)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

/** Telefone BR com DDI 55 (exibição) */
export function formatPhoneBr(value: unknown): string {
  const d = digitsOnly(String(value ?? ""))
  if (d.length < 10) return String(value ?? "").trim()
  if (d.length === 11 && d.startsWith("55")) {
    return `+${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4, 9)}-${d.slice(9)}`
  }
  if (d.length === 13 && d.startsWith("55")) {
    return `+${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4, 8)}-${d.slice(8)}`
  }
  if (d.length === 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  }
  if (d.length === 11) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  }
  return String(value ?? "").trim()
}
