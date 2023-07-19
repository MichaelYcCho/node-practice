const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    database: 'node_sql',
    password: 'node_sql'
});

module.exports = pool.promise();