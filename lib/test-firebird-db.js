const firebird = require('firebird');
require('dotenv').config({ path: '.env.local' });

const options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_PATH,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  lowercase_keys: false,
  role: null,
  pageSize: 4096,
};

console.log('[FIREBIRD ALT TEST] ENV:', options);

firebird.attach(options, function(err, db) {
  if (err) {
    console.error('[FIREBIRD ALT TEST] Falha ao conectar:', err);
    process.exit(1);
  } else {
    console.log('[FIREBIRD ALT TEST] Conexão bem-sucedida!');
    db.detach();
    process.exit(0);
  }
});
