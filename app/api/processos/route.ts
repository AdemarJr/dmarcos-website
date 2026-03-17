import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

// Helper to format date from DD/MM/YYYY to YYYY-MM-DD
function formatDateForDB(dateString: string | null): string | null {
  if (!dateString) return null;
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';
  const type = searchParams.get('type');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  console.log('API /processos called with query:', query, 'dateFrom:', dateFrom, 'dateTo:', dateTo, 'type:', type);

  let sql = `
    SELECT
      i.CODIGO_PROCESSO as "id",
      i.CODIGO_PROCESSO as "noProcesso",
      i.CANAL as "canal",
      i.IDT_EMBARQUE as "embarque",
      i.DATA_ABERTURA as "dataAbertura",
      i.NUMERO_DOC_CHEGADA as "conhecimento",
      i.DATA_CHEGADA as "dataChegada",
      i.NUMERO_DI as "numeroDI",
      i.DATA_DA_DI as "dataDI",
      i.RECINTO_ALFADEGADO as "local",
      i.VALOR_FOB_LOC_EMB as "valorFobUsd",
      i.VALOR_FOB_MOEDA_NAC as "valorFobBrl",
      i.TAXA_UTILIZACAO_SISCOMEX as "txSiscomex",
      i.STATUS_PROCESSO as "status",
      i.NUMERO_FILHOTE as "hawb",
      i.TAXA_DOLAR_DI as "taxaDolarDI",
      i.RECINTO_ALFADEGADO as "armazem",
      i.VALOR_FRETE_PRAPAID as "ftPrepaid",
      i.VALOR_FRETE_COLECT as "ftCollect",
      i.VALOR_SEGURO as "seguro",
      i.DATA_ENTRADA_SEFAZ as "entSefaz",
      i.DATA_SAIDA_SEFAZ as "saidaSefaz",
      i.DATA_LIBERACAO as "liberacao",
      i.VIA_TRANSPORTE as "transporte",
      i.VALOR_CIF as "valorCif",
      i.PESO_BRUTO as "pbCarga",
      i.PESO_LIQUIDO as "plCarga",
      i.QTDE_VOLUMES as "qtdVol",
      i.QTDE_ADICOES as "qtdeAdicoes"
      // Campos como iiPg, ipiPg, etc, precisam de JOIN com tabelas de tributos
    FROM IMPORTACAO i
  `;

  const params: any[] = [];
  const whereClauses: string[] = [];

  if (query) {
    const qLower = `%${query.toLowerCase()}%`;
    whereClauses.push(`(
      LOWER(i.NUMERO_DI) LIKE ? OR
      LOWER(i.IDT_EMBARQUE) LIKE ? OR
      CAST(i.CODIGO_PROCESSO AS VARCHAR(20)) LIKE ? OR
      LOWER(i.NUMERO_DOC_CHEGADA) LIKE ?
    )`);
    params.push(qLower, qLower, qLower, qLower);
  }

  const formattedDateFrom = formatDateForDB(dateFrom);
  const formattedDateTo = formatDateForDB(dateTo);

  console.log('Formatted dates:', formattedDateFrom, formattedDateTo);

  if (formattedDateFrom && formattedDateTo) {
    whereClauses.push('i.DATA_DA_DI BETWEEN ? AND ?');
    params.push(formattedDateFrom, formattedDateTo);
  }

  if (type === 'dis_liberadas') {
    whereClauses.push("i.DATA_LIBERACAO IS NOT NULL");
  } else if (type === 'dis_registradas') {
    whereClauses.push("i.DATA_DA_DI IS NOT NULL");
  }

  if (whereClauses.length > 0) {
    sql += ' WHERE ' + whereClauses.join(' AND ');
  }

  sql += ' ORDER BY i.DATA_DA_DI DESC ROWS 100;';

  console.log('Final SQL:', sql);
  console.log('SQL params:', params);

  try {
    const result = await executeQuery(sql, params);
    const processos = result.map((row: any) => ({
      id: row.ID,
      noProcesso: row.NOPROCESSO,
      canal: row.CANAL,
      embarque: row.EMBARQUE,
      dataAbertura: row.DATAABERTURA,
      conhecimento: row.CONHECIMENTO,
      dataChegada: row.DATACHEGADA,
      numeroDI: row.NUMERODI,
      dataDI: row.DATADI,
      local: row.LOCAL,
      valorFobUsd: row.VALORFOBUSD,
      valorFobBrl: row.VALORFOBBRL,
      txSiscomex: row.TXSISCOMEX,
      status: row.STATUS,
      hawb: row.HAWB,
      taxaDolarDI: row.TAXADOLARDI,
      armazem: row.ARMAZEM,
      ftPrepaid: row.FTPREPAID,
      ftCollect: row.FTCOLLECT,
      seguro: row.SEGURO,
      entSefaz: row.ENTSEFAZ,
      saidaSefaz: row.SAIDASEFAZ,
      liberacao: row.LIBERACAO,
      transporte: row.TRANSPORTE,
      valorCif: row.VALORCIF,
      pbCarga: row.PBCARGA,
      plCarga: row.PLCARGA,
      qtdVol: row.QTDVOL,
      qtdeAdicoes: row.QTDEADICOES
    }));

    return NextResponse.json(processos);
  } catch (e) {
    console.error('Error executing query:', e);
    return NextResponse.json({ message: 'Erro na busca de processos', error: e.toString() }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

// Helper para formatar data de DD/MM/YYYY para o formato do Firebird (MM/DD/YYYY ou YYYY-MM-DD)
// Firebird pode ser sensível ao formato, vamos usar YYYY-MM-DD que é mais padrão.
function formatDateForDB(dateString: string | null): string | null {
    if (!dateString) return null;
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get('query') || '';
    const type = searchParams.get('type');


import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

// Helper to format date from DD/MM/YYYY to YYYY-MM-DD
function formatDateForDB(dateString: string | null): string | null {
  if (!dateString) return null;
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
}

        export async function GET(req: NextRequest) {
          const { searchParams } = new URL(req.url);
          const query = searchParams.get('query') || '';
          const type = searchParams.get('type');
          const dateFrom = searchParams.get('dateFrom');
          const dateTo = searchParams.get('dateTo');

          try {
            let sql = `
              SELECT
                i.CODIGO_PROCESSO as "id",
                i.CODIGO_PROCESSO as "noProcesso",
                i.CANAL as "canal",
                i.IDT_EMBARQUE as "embarque",
                i.DATA_ABERTURA as "dataAbertura",
                i.NUMERO_DOC_CHEGADA as "conhecimento",
                i.DATA_CHEGADA as "dataChegada",
                i.NUMERO_DI as "numeroDI",
                i.DATA_DA_DI as "dataDI",
                i.RECINTO_ALFADEGADO as "local",
                i.VALOR_FOB_LOC_EMB as "valorFobUsd",
                i.VALOR_FOB_MOEDA_NAC as "valorFobBrl",
                i.TAXA_UTILIZACAO_SISCOMEX as "txSiscomex",
                i.STATUS_PROCESSO as "status",
                i.NUMERO_FILHOTE as "hawb",
                i.TAXA_DOLAR_DI as "taxaDolarDI",
                i.RECINTO_ALFADEGADO as "armazem",
                i.VALOR_FRETE_PRAPAID as "ftPrepaid",
                i.VALOR_FRETE_COLECT as "ftCollect",
                i.VALOR_SEGURO as "seguro",
                i.DATA_ENTRADA_SEFAZ as "entSefaz",
                i.DATA_SAIDA_SEFAZ as "saidaSefaz",
                i.DATA_LIBERACAO as "liberacao",
                i.VIA_TRANSPORTE as "transporte",
                i.VALOR_CIF as "valorCif",
                i.PESO_BRUTO as "pbCarga",
                i.PESO_LIQUIDO as "plCarga",
                i.QTDE_VOLUMES as "qtdVol",
                i.QTDE_ADICOES as "qtdeAdicoes"
                // Campos como iiPg, ipiPg, etc, precisam de JOIN com tabelas de tributos
              FROM IMPORTACAO i
            `;

            const params: any[] = [];
            const whereClauses: string[] = [];

            if (query) {
              const qLower = `%${query.toLowerCase()}%`;
              whereClauses.push(`(
                LOWER(i.NUMERO_DI) LIKE ? OR
                LOWER(i.IDT_EMBARQUE) LIKE ? OR
                CAST(i.CODIGO_PROCESSO AS VARCHAR(20)) LIKE ? OR
                LOWER(i.NUMERO_DOC_CHEGADA) LIKE ?
              )`);
              params.push(qLower, qLower, qLower, qLower);
            }

            const formattedDateFrom = formatDateForDB(dateFrom);
            const formattedDateTo = formatDateForDB(dateTo);

            if (formattedDateFrom && formattedDateTo) {
              whereClauses.push('i.DATA_DA_DI BETWEEN ? AND ?');
              params.push(formattedDateFrom, formattedDateTo);
            }

            if (type === 'dis_liberadas') {
              whereClauses.push("i.DATA_LIBERACAO IS NOT NULL");
            } else if (type === 'dis_registradas') {
              whereClauses.push("i.DATA_DA_DI IS NOT NULL");
            }

            if (whereClauses.length > 0) {
              sql += ' WHERE ' + whereClauses.join(' AND ');
            }

            sql += ' ORDER BY i.DATA_DA_DI DESC ROWS 100;';

            const result = await executeQuery(sql, params);

            const processos = result.map((row: any) => ({
              id: row.ID,
              noProcesso: row.NOPROCESSO,
              canal: row.CANAL,
              embarque: row.EMBARQUE,
              dataAbertura: row.DATAABERTURA,
              conhecimento: row.CONHECIMENTO,
              dataChegada: row.DATACHEGADA,
              numeroDI: row.NUMERODI,
              dataDI: row.DATADI,
              local: row.LOCAL,
              valorFobUsd: row.VALORFOBUSD,
              valorFobBrl: row.VALORFOBBRL,
              txSiscomex: row.TXSISCOMEX,
              status: row.STATUS,
              hawb: row.HAWB,
              taxaDolarDI: row.TAXADOLARDI,
              armazem: row.ARMAZEM,
              ftPrepaid: row.FTPREPAID,
              ftCollect: row.FTCOLLECT,
              seguro: row.SEGURO,
              entSefaz: row.ENTSEFAZ,
              saidaSefaz: row.SAIDASEFAZ,
              liberacao: row.LIBERACAO,
              transporte: row.TRANSPORTE,
              valorCif: row.VALORCIF,
              pbCarga: row.PBCARGA,
              plCarga: row.PLCARGA,
              qtdVol: row.QTDVOL,
              qtdeAdicoes: row.QTDEADICOES
            }));

            return NextResponse.json(processos);
          } catch (e) {
            return NextResponse.json({ message: 'Erro na busca de processos', error: e.toString() }, { status: 500 });
          }
        }
