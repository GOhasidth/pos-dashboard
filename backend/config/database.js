const sql = require('mssql');
const config = {
  server: 'SMSLABBOS',        // or the server's LAN IP, e.g. '192.168.1.50'
  port: 1433,
  database: 'STORESQL',
  user: 'pos_dashboard_user',
  password: 'StrongPass#2025',
  options: { encrypt: false, trustServerCertificate: true, enableArithAbort: true }
};

let pool = null;

async function connectToDatabase() {
    try {
        if (pool) return pool;
        
        pool = await sql.connect(config);
        console.log('Connected to SQL Server successfully with SQL Login');
        return pool;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

module.exports = { connectToDatabase, sql };
