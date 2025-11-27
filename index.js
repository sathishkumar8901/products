require("dotenv").config(); // load env variables
const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//  GET /products 
app.get("/products", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM products");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//frontend screen
app.get("/", async (req, res) => {
    try {
        const [products] = await db.query("SELECT * FROM products");
        res.render("index", { 
            products, 
            invalidFields: [],  
            noProducts: false   
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


const PORT = process.env.PORT || 3000;

// POST /segments/evaluate 
app.post("/segments/evaluate", async (req, res) => {
    const input = req.body.conditions || "";
    const lines = input.split("\n").map(s => s.trim()).filter(Boolean);

    const allowedFields = ["price", "category", "stock_status", "on_sale", "title"];
    let invalidFields = [];
    let query = "SELECT * FROM products WHERE 1=1";
    const params = [];

    lines.forEach(rule => {
        const match = rule.match(/^(\w+)\s*(=|!=|>|<|>=|<=)\s*(.+)$/);
        if (!match) return;

        let field = match[1];
        const operator = match[2];
        let value = match[3].replace(/"/g, "").replace(/'/g, "");

        if (!allowedFields.includes(field)) {
            invalidFields.push(field);
            return;
        }

        if (field === "price") {
            query += ` AND price ${operator} ?`;
            params.push(Number(value));
        } else if (field === "on_sale") {
            query += ` AND on_sale = ?`;
            params.push(value === "true" ? 1 : 0);
        } else {
            query += ` AND ${field} ${operator} ?`;
            params.push(value);
        }
    });

    try {
        let rows = [];
        if (invalidFields.length === 0) {
            [rows] = await db.query(query, params);
        }

        const noProducts = rows.length === 0;

        res.render("products", { 
            products: rows, 
            noProducts, 
            invalidFields,
            appliedFilters: lines  
        });

    } catch (err) {
        res.render("products", { 
            products: [], 
            noProducts: true, 
            invalidFields: [], 
            appliedFilters: [] 
        });
    }
});





app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
