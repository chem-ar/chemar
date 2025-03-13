const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, 
    options: {
        encrypt: true, 
        trustServerCertificate: false 
    }
};


async function connect() {
    try {
        await sql.connect(config);
        console.log('Connected to Azure SQL Database');
    } catch (err) {
        console.error('Error connecting to Azure SQL Database:', err);
    }
}

module.exports = { sql, connect };