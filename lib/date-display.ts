/** Converte valor de `<input type="date">` (YYYY-MM-DD) para exibição dd/mm/aaaa */
export function isoDateToBr(iso: string): string {
  if (!iso?.trim()) return "—"
  const [y, m, d] = iso.split("-")
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}
