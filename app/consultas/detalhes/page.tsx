import { redirect } from "next/navigation"

/** Unificado em `/consultas/processos` (busca por número + lista com período e detalhes). */
export default function DetalhesRedirectPage() {
  redirect("/consultas/processos")
}
