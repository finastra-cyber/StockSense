import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Create a connection pool for reuse across the app
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
});

const DBconnect2 = async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Connected to MySQL database successfully!");

    // Create users table if it doesn't exist
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    conn.release();
    console.log("Users table ready.");
  } catch (error) {
    console.error("MySQL connection error:", error.message);
    process.exit(1);
  }
};

export { pool };
export default DBconnect2;
