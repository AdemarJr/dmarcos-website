const Firebird = require('node-firebird');

const host = process.env.DB_HOST;
const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined;
const database = process.env.DB_PATH;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

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

const pool = Firebird.pool(5, options);

function executeQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    pool.get((err, db) => {
      if (err) {
        console.error('Falha ao obter conexão do pool', err);
        return reject(err);
      }

      db.query(query, params, (err, result) => {
        db.detach((detachErr) => {
          if (detachErr) {
            console.error('Falha ao devolver a conexão para o pool', detachErr);
          }
        });

        if (err) {
          console.error('Falha na execução da query', err);
          return reject(err);
        }

        resolve(result);
      });
    });
  });
}

process.on('beforeExit', () => {
  pool.destroy();
});

module.exports = { executeQuery };
