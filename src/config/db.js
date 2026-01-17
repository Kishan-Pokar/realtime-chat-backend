const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'chat-backend',
    password: 'kishan',
    port: 5432,
});

module.exports = pool;