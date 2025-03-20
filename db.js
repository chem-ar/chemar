const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

let poolPromise;

async function connect() {
    try {
        if (!poolPromise) {
            poolPromise = sql.connect(config);
            console.log('Connected to Azure SQL Database');
        }
        return poolPromise;
    } catch (err) {
        console.error('Error connecting to Azure SQL Database:', err);
        throw err;
    }
}

module.exports = { sql, connect };
