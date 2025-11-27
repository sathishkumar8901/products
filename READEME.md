# Fetch Products from WooCommerce (REST API)
GET /wp-json/wc/v3/products
with Basic Authentication via query parameters.
# Store Products in Local Database

# Backend REST API
| Method   | Endpoint             | Description                                                 |
| -------- | -------------------- | ----------------------------------------------------------- |
| **GET**  | `/products`          | Returns all products                                        |
| **POST** | `/segments/evaluate` | Accepts multi-line conditions and returns matching products |


# Supported Conditions
price > 1000
stock_status = instock
on_sale = true

# Fields allowed in filtering
price, category, stock_status, on_sale, title

# Frontend Requirements
Display product list (cards with title, price, stock status…)
Textarea
Shows evaluated filtered result in UI

# Project Structure

├── index.js          
├── migration.js          
├── saveProducts.js
├── views/   
    index.ejs
    products.ejs         
├── public/
    style.css           
├── Dockerfile        
├── package.json
└── README.md

# Database Schema
CREATE TABLE products (
  id INT PRIMARY KEY,
  title VARCHAR(255),
  price DECIMAL(10,2),
  stock_status VARCHAR(50),
  stock_quantity INT,
  category VARCHAR(255),
  tags JSON,
  on_sale BOOLEAN,
  created_at VARCHAR(100)
);

# Installation & Setup (Local)
git clone https://github.com/sathishkumar8901/products.git
cd products

# Install dependencies
npm install

# Run the server
node index.js

# Visit
http://localhost:3000

# Ingesting WooCommerce Products
axios.get(`${WC_URL}?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`);


# API Usage
GET /products

Response :
[
  {
    "id": 10,
    "title": "T-shirt",
    "price": "19.99",
    "stock_status": "instock",
    "tags": ["summer", "cotton"],
    "category": "Apparel"
  }
]

POST /segments/evaluate
Request :
price > 100
on_sale = true
category = Electronics

Response :
{
  "products": [...],
  "invalidFields": [],
  "appliedFilters": ["price > 100", "on_sale = true"]
}

# Docker Deployment
docker build -t product-app .
Run : docker run -p 3000:3000 --env-file .env product-app

Live URL : https://products-production-0655.up.railway.app/








