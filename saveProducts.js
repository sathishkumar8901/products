require("dotenv").config(); 
const axios = require('axios');
const mysql = require('mysql2/promise');


const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : null 
});


const apiURL = "https://wp-multisite.convertcart.com/wp-json/wc/v3/products";


const config = {
    auth: {
        username: "ck_af82ae325fbee1c13f31eb26148f4dea473bXXXX",
        password: "cs_2d8cc467c5b91a80f5ed18dd3c282ee8299cXXXX"
    }
};

async function saveProducts() {
    try {
        
        const { data } = await axios.get(apiURL, config);

        for (const product of data) {
            const record = {
                id: product.id,
                title: product.name,
                
                price: product.price ? parseFloat(product.price) : 0.00,
                stock_status: product.stock_status,
                stock_quantity: product.stock_quantity ?? 0,
                category: product.categories.length > 0 ? product.categories[0].name : null,
                tags: JSON.stringify(product.tags.map(t => t.name)),
                on_sale: product.on_sale ? 1 : 0,
                created_at: product.date_created
            };
            

            await db.query(
                `REPLACE INTO products 
                (id, title, price, stock_status, stock_quantity, category, tags, on_sale, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    record.id,
                    record.title,
                    record.price,
                    record.stock_status,
                    record.stock_quantity,
                    record.category,
                    record.tags,
                    record.on_sale,
                    record.created_at
                ]
            );

            console.log(`Saved product → ${record.title}`);
        }

        console.log("All products saved successfully!");

    } catch (error) {
        console.error("Error:", error);
    }
}

saveProducts();
