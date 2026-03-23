import { redirect } from "next/navigation"

/** A consulta por período foi unificada nas telas DIs Registradas e DIs Liberadas. */
export default function PeriodoRedirectPage() {
  redirect("/consultas/di-registradas")
}
