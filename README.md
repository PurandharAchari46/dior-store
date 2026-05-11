# DIOR Luxury Store

A Dior-inspired ecommerce storefront with a live Express backend, searchable product catalog, wishlist, cart, and checkout confirmation flow.

## Highlights

- Premium responsive storefront in `frontend/`
- Express API in `backend/server.js`
- Product import pipeline from `codewithzosh/ecommerce-products-data`
- Server-side filtering, search, sorting, category navigation, and order creation
- Production metadata for Node hosts through `Procfile` and `render.yaml`
- GitHub Actions CI for backend syntax validation

## Run Locally

```bash
npm install
npm run import:products
npm start
```

Open `http://localhost:3000`.

The frontend is served by Express, so API calls use the same origin:

```js
fetch("/api/products")
fetch("/api/orders", { method: "POST" })
```

`npm run import:products` saves a local cache at `backend/data/products.json`. If that file is not present on a fresh deploy, the backend imports the catalog automatically on the first API request.

## API

- `GET /api/health`
- `GET /api/products?category=men&search=shirt&sort=price-asc`
- `GET /api/products/:id`
- `GET /api/categories`
- `POST /api/orders`

## Deploy

GitHub Pages can host only static files, so this project should be deployed to a Node-capable host while the source lives on GitHub.

Recommended flow:

1. Push this repository to `https://github.com/PurandharAchari46/dior-store`.
2. Connect the repo to Render, Railway, Fly.io, or another Node hosting platform.
3. Use `npm install` as the build command and `npm start` as the start command.
4. Set the health check path to `/api/health`.

Render can detect `render.yaml` and create the web service automatically.
