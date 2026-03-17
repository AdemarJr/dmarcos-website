export function SiteFooter() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="page-container py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="space-y-3">
            <img src="/images/logo-white.png" alt="Dmarcos" className="h-9 w-auto" />
            <p className="text-sm text-primary-foreground/80 max-w-md">
              Desembaraço aduaneiro, logística internacional e regimes especiais com atendimento próximo e
              acompanhamento operacional.
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="font-semibold">MARCOS DESPACHOS ADUANEIROS LTDA</p>
            <p className="text-primary-foreground/80">Rua Costa Azevedo, 250, Centro, Manaus, AM, 69010-230</p>
            <p className="text-primary-foreground/80">TEL: +55 92 2121.3100</p>
            <p className="text-primary-foreground/80">CNPJ: 10.198.034/0001-96</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-primary-foreground/70">
          <p>© 2025 Dmarcos. Todos os direitos reservados.</p>
          <p>Feito para performance, segurança e clareza.</p>
        </div>
      </div>
    </footer>
  )
}

