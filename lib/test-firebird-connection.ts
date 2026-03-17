

require('dotenv').config({ path: '.env.local' });
const Firebird = require('node-firebird');

const host = process.env.DB_HOST;
const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined;
const database = process.env.DB_PATH;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

console.log('[FIREBIRD TEST] ENV:', {
  DB_HOST: host,
  DB_PORT: port,
  DB_PATH: database,
  DB_USER: user,
  DB_PASSWORD: password ? '***' : undefined
});

if (!host || !port || !database || !user || !password) {
  throw new Error('As variáveis de ambiente DB_HOST, DB_PORT, DB_PATH, DB_USER e DB_PASSWORD devem ser definidas.');
}

const options = {
  host,
  port,
  database,
  user,
  password,
  role: undefined,
  pageSize: 16384,
};

Firebird.attach(options, (err, db) => {
  if (err) {
    console.error('[FIREBIRD TEST] Falha ao conectar:', err);
    process.exit(1);
  } else {
    console.log('[FIREBIRD TEST] Conexão bem-sucedida!');
    db.detach();
    process.exit(0);
  }
});
