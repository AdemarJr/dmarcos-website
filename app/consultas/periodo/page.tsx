import { redirect } from "next/navigation"

/** Rota legada: período é usado em DIs registradas / liberadas (menu Consultas). */
export default function PeriodoRedirectPage() {
  redirect("/consultas/processos")
}
