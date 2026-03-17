"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Building2, LogOut, Menu } from "lucide-react"
import { clearSession, readClienteSession, readToken, type ClienteSession } from "@/lib/client-session"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link
      href={href}
      className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
        active ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      }`}
    >
      {label}
    </Link>
  )
}

export function ConsultasLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [cliente, setCliente] = useState<ClienteSession | null>(null)

  useEffect(() => {
    const token = readToken()
    if (!token) {
      router.push("/")
      return
    }
    setCliente(readClienteSession())
  }, [router])

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  const companyName = cliente?.nomeEmpresa?.trim() || "Cliente"
  const companyCnpj = cliente?.cnpj?.trim() || ""

  const mobileNavValue =
    pathname?.startsWith("/consultas/di-registradas")
      ? "/consultas/di-registradas"
      : pathname?.startsWith("/consultas/di-liberadas")
        ? "/consultas/di-liberadas"
        : pathname?.startsWith("/consultas/periodo")
          ? "/consultas/periodo"
          : pathname?.startsWith("/consultas/detalhes")
            ? "/consultas/detalhes"
            : "/consultas/di-registradas"

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm print:hidden">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/images/logo-color.png" alt="Dmarcos" className="h-9 w-auto" />
            <div className="h-6 w-px bg-border hidden sm:block" />
            <div className="hidden sm:flex flex-col leading-tight min-w-0">
              <span className="text-sm font-medium text-foreground">Consultas</span>
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1 truncate">
                <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">
                  {companyName}
                  {companyCnpj ? ` • ${companyCnpj}` : ""}
                </span>
              </span>
            </div>
          </div>

          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-2 min-w-[140px]">
            <Menu className="w-4 h-4 text-muted-foreground" />
            <Select
              value={mobileNavValue}
              onValueChange={(v) => {
                router.push(v)
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Consultas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="/consultas/di-registradas">DIs registradas</SelectItem>
                <SelectItem value="/consultas/di-liberadas">DIs liberadas</SelectItem>
                <SelectItem value="/consultas/periodo">Período</SelectItem>
                <SelectItem value="/consultas/detalhes">Detalhes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/consultas/di-registradas" label="DIs registradas" />
            <NavLink href="/consultas/di-liberadas" label="DIs liberadas" />
            <NavLink href="/consultas/periodo" label="Período" />
            <NavLink href="/consultas/detalhes" label="Detalhes" />
          </nav>

          <div className="flex items-center gap-2">
            <Button onClick={handleLogout} variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>
    </div>
  )
}

