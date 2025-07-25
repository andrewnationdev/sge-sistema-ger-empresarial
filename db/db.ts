import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,      
  user: process.env.DATABASE_USER, 
  //Se não houver porta, a padrão será usada
  port: Number(process.env.DATABASE_PORT) || 3306,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000
});

export default pool;
