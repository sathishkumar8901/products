// testConnection.js
const mysql = require("mysql2/promise");
require("dotenv").config();

async function testConnection() {
    const db = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
        ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : null
    });

    try {
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS products (
            id INT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            stock_status ENUM('instock', 'outofstock') NOT NULL DEFAULT 'instock',
            stock_quantity INT DEFAULT 0,
            category VARCHAR(100),
            tags VARCHAR(255),
            on_sale TINYINT(1) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    await db.query(createTableQuery);
    console.log("Products table created (if not exists)");
    db.end();

    } catch (err) {
        console.error("❌ Connection failed:", err.message);
    }
}

testConnection();
