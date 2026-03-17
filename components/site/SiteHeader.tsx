"use client"

import Link from "next/link"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader({ onLoginClick }: { onLoginClick?: () => void }) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 sticky top-0 z-50">
      <div className="page-container h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <img src="/images/logo-color.png" alt="Dmarcos - Desde 1986" className="h-10 w-auto" />
          <span className="sr-only">Dmarcos</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="tel:+559221213100"
            className="hidden sm:inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm font-semibold">+55 92 2121.3100</span>
          </a>
          {onLoginClick && (
            <Button onClick={onLoginClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Área do Cliente
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

