const pgp = require('pg-promise')();

const connectionString = 'postgres://postgres:postgres@localhost:5432/postgres';
const db = pgp(connectionString);

module.exports = db;