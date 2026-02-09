"use client"

import type React from "react"
import { MapPin, Building2, Handshake, Award } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ChevronDown, Phone } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useRouter } from "next/navigation"

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Login attempt with:", email)
    // Simple demo authentication - save to localStorage
    if (email && password) {
      localStorage.setItem("dmarcos_auth", "true")
      console.log("[v0] Auth saved to localStorage, navigating to /processos")
      router.push("/processos")
    }
  }

  const scrollToServices = () => {
    const servicesSection = document.getElementById("servicos")
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Dmarcos - Desde 1986" className="h-10" />
          </div>

          <a
            href="tel:+559221213100"
            className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span className="font-semibold">+55 92 2121.3100</span>
          </a>
        </div>
      </header>

      {/* Hero Section with Login */}
      <section className="bg-gradient-to-br from-primary via-primary to-accent/20 text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left side - Tagline and description */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                Dmarcos, <span className="text-accent">A EMPRESA QUE RESOLVE</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 leading-relaxed">
                A 40 anos atuando em Despachos Aduaneiros na área de Importação, Exportação e Internação com expertise
                nos regimes especiais ZFM / ALC e demais, assim como na Logística Internacional de toda e para qualquer
                parte do mundo.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={scrollToServices}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  Conheça Nossos Serviços
                </Button>
                <Button
                  size="lg"
                  onClick={() => setShowLogin(!showLogin)}
                  variant="outline"
                  className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold"
                >
                  Faça Login 
                </Button>
              </div>
            </div>

            {/* Right side - Login form (conditional) */}
            {showLogin && (
              <div className="flex justify-center md:justify-end">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Login do Sistema</CardTitle>
                    <CardDescription>Acesse a consulta de processos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        Entrar
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">A Dmarcos</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Conheça nossa estrutura e compromisso com a excelência em serviços aduaneiros
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Localização */}
              <div className="group relative rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="/images/teatro-amazonas.jpg" 
                    alt="Teatro Amazonas - Manaus" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-accent transition-colors">
                    Localização Privilegiada
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Situada em uma área própria de 1.200 m², no coração de Manaus, em frente ao Teatro Amazonas, cartão
                    postal da Cidade.
                  </p>
                </div>
              </div>

              {/* Estrutura */}
              <div className="group relative rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="/images/modern-office-technology.jpg" 
                    alt="Escritório moderno com tecnologia" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    Estrutura Moderna
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    A Dmarcos se mantém equipada com o que há de mais moderno em tecnologia de informação e ferramentas
                    de IA para maior velocidade dos processos.
                  </p>
                </div>
              </div>

              {/* Compromisso */}
              <div className="group relative rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="/images/port-workers-cargo.jpg" 
                    alt="Equipe acompanhando cargas no porto" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-accent transition-colors">
                    Compromisso Total
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Para resolver os problemas, mantém seus funcionários acompanhando de perto a liberação de documentos
                    e cargas nos portos, aeroportos e terminais, junto aos órgãos governamentais de controle fiscal.
                  </p>
                </div>
              </div>

              {/* Diferencial */}
              <div className="group relative rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="/images/business-handshake-partnership.jpg" 
                    alt="Parceria e assessoria empresarial" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    Diferencial Competitivo
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    A Dmarcos oferece assessoria e acompanhamento operacional on line aos seus Clientes, mantendo
                    orientações sobre a melhor forma de realizar as transações aduaneiras, garantindo o que realmente
                    importa na liberação de suas cargas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Nossos Serviços</h2>

          <div className="max-w-4xl mx-auto space-y-4">
            {/* IMPORTAÇÃO */}
            <Collapsible>
              <CollapsibleTrigger className="w-full flex items-center gap-4 p-6 rounded-lg border bg-card hover:bg-secondary/50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <img src="/import-customs-shipping-container.jpg" alt="" className="w-8 h-8" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground text-lg">IMPORTAÇÃO | Diferencial é a palavra-chave</h3>
                </div>
                <ChevronDown className="w-5 h-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pt-4 pb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src="/cargo-containers-port-shipping-logistics.jpg"
                    alt="Importação"
                    className="w-full md:w-64 h-48 object-cover rounded-lg"
                  />
                  <p className="text-muted-foreground leading-relaxed flex-1">
                    A Dmarcos criou o SCI - Sistema de Controle de Importação, um recurso de informática próprio, mais
                    rápido e confiável para os serviços de importação, ligado 24h com o SISCOMEX e PLI/SUFRAMA, e
                    integrando a Dmarcos ainda mais com seus clientes, utilizando os dados adquiridos independentemente
                    dos sistemas adotados. Além disso, os clientes acompanham o status de seus processos pelo site
                    www.dmarcos.com.br.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* EXPORTAÇÃO */}
            <Collapsible>
              <CollapsibleTrigger className="w-full flex items-center gap-4 p-6 rounded-lg border bg-card hover:bg-secondary/50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <img src="/airplane-cargo-export-flight.jpg" alt="" className="w-8 h-8" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground text-lg">EXPORTAÇÃO | Atendimento 24h</h3>
                </div>
                <ChevronDown className="w-5 h-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pt-4 pb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src="/cargo-airplane-airport-export-international-shippi.jpg"
                    alt="Exportação"
                    className="w-full md:w-64 h-48 object-cover rounded-lg"
                  />
                  <p className="text-muted-foreground leading-relaxed flex-1">
                    A Dmarcos se especializou em exportações de mercadorias de carga geral, perecíveis e vivas, com
                    assessoria, orientação e preparação da documentação necessária com acompanhamento da carga do início
                    ao fim de todo o processo.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* AG. DE CARGA */}
            <Collapsible>
              <CollapsibleTrigger className="w-full flex items-center gap-4 p-6 rounded-lg border bg-card hover:bg-secondary/50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <img src="/truck-logistics-delivery.jpg" alt="" className="w-8 h-8" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground text-lg">AG. DE CARGA | Solução do início ao fim</h3>
                </div>
                <ChevronDown className="w-5 h-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pt-4 pb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src="/warehouse-logistics-cargo-management-distribution.jpg"
                    alt="Agenciamento de Carga"
                    className="w-full md:w-64 h-48 object-cover rounded-lg"
                  />
                  <p className="text-muted-foreground leading-relaxed flex-1">
                    A Dmarcos possui uma equipe especializada em desconsolidação que acompanha constantemente a carga no
                    CCT (carga de controle e trânsito), dentro do Portal único, até torná-la disponível, com processos
                    mais eficazes e reduzindo o tempo de armazenagem dos produtos, abrangendo todo o trâmite
                    burocrático. Atua como elo estratégico entre importadores/exportadores e os operadores logísticos
                    internacionais, oferecendo soluções completas para o transporte de mercadorias, da origem ao
                    destino, junto às companhias de transporte aéreo e marítimo.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* INTERNAÇÃO */}
            <Collapsible>
              <CollapsibleTrigger className="w-full flex items-center gap-4 p-6 rounded-lg border bg-card hover:bg-secondary/50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <img src="/world-map-global-network.jpg" alt="" className="w-8 h-8" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground text-lg">INTERNAÇÃO | Experiência e envolvimento</h3>
                </div>
                <ChevronDown className="w-5 h-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pt-4 pb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src="/customs-documents-paperwork-international-trade.jpg"
                    alt="Internação"
                    className="w-full md:w-64 h-48 object-cover rounded-lg"
                  />
                  <p className="text-muted-foreground leading-relaxed flex-1">
                    Outro processo que a Dmarcos resolve com excelência é a internação, analisando, elaborando e
                    monitorando a liberação dos processos sobre os produtos saídos da ZFM, envolvendo DCR-E, DCI Mensal,
                    DCI Individual, Declaração de Saída Temporária – DST, Devoluções e Transferências.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* CONSULTORIA */}
            <Collapsible>
              <CollapsibleTrigger className="w-full flex items-center gap-4 p-6 rounded-lg border bg-card hover:bg-secondary/50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <img src="/document-checklist-clipboard.jpg" alt="" className="w-8 h-8" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground text-lg">CONSULTORIA TÉCNICA E CLASSIFICAÇÃO FISCAL</h3>
                </div>
                <ChevronDown className="w-5 h-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pt-4 pb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src="/business-consultation-meeting-professional-advisor.jpg"
                    alt="Consultoria"
                    className="w-full md:w-64 h-48 object-cover rounded-lg"
                  />
                  <p className="text-muted-foreground leading-relaxed flex-1">
                    Oferecemos consultoria técnica especializada e classificação fiscal precisa para garantir a
                    conformidade de suas operações de comércio exterior, reduzindo riscos e otimizando processos
                    aduaneiros.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-bold text-lg mb-2">MARCOS DESPACHOS ADUANEIROS LTDA</h3>
          <p className="text-sm text-primary-foreground/80 mb-1">
            Rua Costa Azevedo, 250, Centro, Manaus, AM, Brasil, 69010-230
          </p>
          <p className="text-sm text-primary-foreground/80">TEL: +55 92 2121.3100 | CNPJ: 10.198.034/0001-96</p>
          <p className="text-xs text-primary-foreground/60 mt-6">© 2025 Dmarcos - Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
