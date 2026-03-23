# Ideias de melhorias — Área do cliente / consultas

## Já alinhado com o fluxo atual

- **Filtro por período** nas telas de DIs (registro vs liberação) usando a mesma API de período.
- **Detalhar** explícito por linha, reduzindo clique acidental na tabela larga.

## Próximos passos sugeridos

1. **Performance**
   - Paginação ou cursor no **backend** para listas muito grandes (a UI já pagina no cliente).
   - Cache curto (ex.: 30–60 s) no proxy Next para listas idênticas no mesmo usuário.

2. **UX**
   - Presets de período: “Este mês”, “Mês anterior”, “Últimos 90 dias”.
   - Indicador de carregamento na tabela (skeleton) em vez de só no card.
   - Lembrar último período usado em `sessionStorage` (opcional).

3. **Acessibilidade**
   - Foco ao fechar o painel de detalhe (voltar para a linha).
   - `aria-label` nos botões “Detalhar” com número do processo.

4. **Dados**
   - Export CSV/Excel respeitando **apenas linhas filtradas** (já ocorre) + coluna com período aplicado no nome do arquivo.
   - Tratamento de fuso horário se o backend enviar datas sem timezone.

5. **Segurança**
   - Refresh token ou sessão com expiração visível (“Sessão expira em …”).
   - Rate limit nas rotas `/api/consultas/*` no edge/hosting.

6. **Observabilidade**
   - Log estruturado no servidor quando o upstream retorna não-JSON ou 5xx (sem dados sensíveis).
