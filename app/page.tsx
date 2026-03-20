"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LoginDialog } from "@/components/login-dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { SiteHeader } from "@/components/site/SiteHeader"
import { SiteFooter } from "@/components/site/SiteFooter"

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)

  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "")
  const assetUrl = (path: string) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`
    return basePath ? `${basePath}${normalizedPath}` : normalizedPath
  }

  /** Todas as imagens da home vêm de `public/images/` */
  const img = {
    teatroAmazonas: "/images/imagens-aereas-do-teatro-amazonas-em-4k-uhd.jpg",
    desembaraco: "/images/desembaraco-aduaneiro-capa.jpg",
    porto: "/images/port-workers-cargo.png",
    aviao: "/images/transporte-aduaneiro-aviao.jpeg",
    armazenamento: "/images/aduana-amazenamento.jpeg",
    galeria1: "/images/images01.jpeg",
    galeria2: "/images/images02.jpeg",
    galeria3: "/images/images03.jpeg",
    /** Fundo suave do hero (abaixo do header) */
    heroArtigo: "/images/Artigo_Desembaraco_Aduaneiro-01.jpg",
  } as const

  // O login agora é feito pelo LoginDialog

  const scrollToServices = () => {
    const servicesSection = document.getElementById("servicos")
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader onLoginClick={() => setShowLogin(true)} />

      {/* Hero: imagem de fundo suave + gradiente (texto legível) */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        {/* Imagem de fundo “transparente” (opacidade baixa; JPG não tem alpha — o efeito é pelo overlay) */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.22]"
          style={{ backgroundImage: `url(${assetUrl(img.heroArtigo)})` }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/93 via-primary/88 to-accent/25" />
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary-foreground/20 blur-3xl" />
        </div>

        <div className="page-container relative z-10 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left side - Tagline and description */}
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-primary-foreground/80 mb-4">
                Desde 1986 • Manaus/AM
              </p>
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
                  className="border-primary text-primary hover:bg-primary hover:text-white font-semibold transition-colors"
                >
                  Área do Cliente
                </Button>
              </div>
            </div>

            {/* Right side - Hero visuals + Login */}

          </div>
        </div>
      </section>

      <section className="section bg-background">
        <div className="page-container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h2 className="section-title">A Dmarcos</h2>
              <p className="section-subtitle mb-12 max-w-2xl mx-auto">
              Conheça nossa estrutura e compromisso com a excelência em serviços aduaneiros
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Localização */}
              <div className="group relative rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={assetUrl(img.teatroAmazonas)} 
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
                    src={assetUrl(img.galeria1)} 
                    alt="Estrutura e operação" 
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
                    src={assetUrl(img.porto)} 
                    alt="Acompanhamento em portos e terminais" 
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
                    src={assetUrl(img.galeria2)} 
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
        <div className="page-container">
          <h2 className="section-title mb-12 text-center">Nossos Serviços</h2>

          <div className="max-w-4xl mx-auto space-y-4">
            {/* IMPORTAÇÃO */}
            <Collapsible>
              <CollapsibleTrigger className="w-full flex items-center gap-4 p-6 rounded-lg border bg-card hover:bg-secondary/50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <img src={assetUrl(img.desembaraco)} alt="" className="w-8 h-8 object-cover rounded" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground text-lg">IMPORTAÇÃO | Diferencial é a palavra-chave</h3>
                </div>
                <ChevronDown className="w-5 h-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pt-4 pb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={assetUrl(img.porto)}
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
                  <img src={assetUrl(img.aviao)} alt="" className="w-8 h-8 object-cover rounded" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground text-lg">EXPORTAÇÃO | Atendimento 24h</h3>
                </div>
                <ChevronDown className="w-5 h-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pt-4 pb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={assetUrl(img.aviao)}
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
                  <img src={assetUrl(img.armazenamento)} alt="" className="w-8 h-8 object-cover rounded" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground text-lg">AG. DE CARGA | Solução do início ao fim</h3>
                </div>
                <ChevronDown className="w-5 h-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pt-4 pb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={assetUrl(img.armazenamento)}
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
                  <img src={assetUrl(img.galeria3)} alt="" className="w-8 h-8 object-cover rounded" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground text-lg">INTERNAÇÃO | Experiência e envolvimento</h3>
                </div>
                <ChevronDown className="w-5 h-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pt-4 pb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={assetUrl(img.desembaraco)}
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
                  <img src={assetUrl(img.galeria1)} alt="" className="w-8 h-8 object-cover rounded" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground text-lg">CONSULTORIA TÉCNICA E CLASSIFICAÇÃO FISCAL</h3>
                </div>
                <ChevronDown className="w-5 h-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pt-4 pb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={assetUrl(img.galeria3)}
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

      <SiteFooter />
    </div>
  )
}
