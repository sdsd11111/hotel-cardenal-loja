import mysql from 'mysql2/promise';

// Configuración de conexión a MySQL
const dbConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 20,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
};

// Pool de conexiones (reutilizable)
let pool: mysql.Pool | null = null;

export async function getConnection() {
    if (!pool) {
        pool = mysql.createPool(dbConfig);
    }
    return pool;
}

// Función helper para ejecutar queries
export async function query(sql: string, params?: any[]) {
    const connection = await getConnection();
    const [results] = await connection.execute(sql, params);
    return results;
}

export default { getConnection, query };
