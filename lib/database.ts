import Firebird from 'node-firebird';

// ATENÇÃO: As credenciais do banco de dados devem ser configuradas via variáveis de ambiente.
// O sistema irá lançar erro se alguma estiver faltando para evitar insegurança.

// Log das variáveis de ambiente para debug
console.log('[FIREBIRD DEBUG] ENV:', {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_PATH: process.env.DB_PATH,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD ? '***' : undefined
});

const host = process.env.DB_HOST;
const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined;
const database = process.env.DB_PATH;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

if (!host || !port || !database || !user || !password) {
    throw new Error('As variáveis de ambiente DB_HOST, DB_PORT, DB_PATH, DB_USER e DB_PASSWORD devem ser definidas.');
}

const options: Firebird.Options = {
    host,
    port,
    database,
    user,
    password,
    role: undefined,
    pageSize: 16384,
};

// Cria um pool de conexões para otimizar a performance.

// Testa conexão simples ao inicializar
Firebird.attach(options, (err, db) => {
    if (err) {
        console.error('[FIREBIRD DEBUG] Falha ao conectar (attach):', err);
    } else {
        console.log('[FIREBIRD DEBUG] Conexão attach bem-sucedida!');
        db.detach();
    }
});

const pool = Firebird.pool(5, options);

/**
 * Executa uma query no banco de dados Firebird.
 * @param query A query SQL a ser executada.
 * @param params Parâmetros opcionais para a query.
 * @returns Uma Promise que resolve com o resultado da query.
 */
export function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
        pool.get((err, db) => {
            if (err) {
                console.error('Falha ao obter conexão do pool', err);
                return reject(err);
            }

            db.query(query, params, (err, result) => {
                db.detach((detachErr) => {
                    if (detachErr) {
                        // Log o erro de detach mas continue o fluxo
                        console.error('Falha ao devolver a conexão para o pool', detachErr);
                    }
                });

                if (err) {
                    console.error('Falha na execução da query', err);
                    return reject(err);
                }

                resolve(result as T[]);
            });
        });
    });
}

// Garante que o pool seja destruído quando a aplicação for encerrada.
process.on('beforeExit', () => {
    pool.destroy();
});
