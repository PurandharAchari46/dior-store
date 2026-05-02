# DIOR Luxury Store

Static ecommerce frontend with an Express backend and product data imported from `codewithzosh/ecommerce-products-data`.

## Run locally

```bash
npm install
npm run import:products
npm start
```

Open `http://localhost:3000`.

`npm run import:products` saves a local cache at `backend/data/products.json`. If that file is not present on a fresh deploy, the backend imports the catalog automatically on first API request.

## API

- `GET /api/health`
- `GET /api/products?category=men&search=shirt&sort=price-asc`
- `GET /api/products/:id`
- `GET /api/categories`
- `POST /api/orders`
