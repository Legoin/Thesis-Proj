var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1', // 18.158.238.175
    user: 'root',
    password: 'root',
    database: 'xTown',
  },
});

module.exports = knex;
