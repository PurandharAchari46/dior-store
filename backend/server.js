import express from "express";
import cors from "cors";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { importProducts } from "./scripts/importProducts.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataFile = path.join(__dirname, "data", "products.json");
const frontendDir = path.join(rootDir, "frontend");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(frontendDir));

let productsCache;

async function getProducts() {
  if (!productsCache) {
    try {
      const raw = await readFile(dataFile, "utf8");
      productsCache = JSON.parse(raw);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      productsCache = await importProducts();
    }
  }
  return productsCache;
}

function includes(value, query) {
  return String(value || "").toLowerCase().includes(query);
}

function matchesCategory(product, category) {
  if (!category || category === "all") return true;

  const gender = String(product.gender || "").toLowerCase();
  const productCategory = String(product.category || "").toLowerCase();
  const section = String(product.section || "").toLowerCase();
  const source = String(product.source || "").toLowerCase();
  const title = String(product.title || "").toLowerCase();

  if (category === "men" || category === "women") return gender === category;
  if (category === "shoes") return productCategory.includes("shoes") || source.includes("shoes") || title.includes("shoes");
  if (category === "saree") return productCategory.includes("saree") || source.includes("saree") || title.includes("saree");

  return productCategory === category || section === category || source.includes(category);
}

app.get("/api/health", async (_req, res) => {
  const products = await getProducts();
  res.json({ ok: true, products: products.length });
});

app.get("/api/products", async (req, res) => {
  const products = await getProducts();
  const search = String(req.query.search || "").trim().toLowerCase();
  const category = String(req.query.category || "").trim().toLowerCase();
  const sort = String(req.query.sort || "featured");
  const limit = Number(req.query.limit || 0);

  let result = products.filter((product) => {
    const matchesSearch =
      !search ||
      includes(product.title, search) ||
      includes(product.brand, search) ||
      includes(product.category, search) ||
      includes(product.gender, search) ||
      includes(product.color, search);
    return matchesSearch && matchesCategory(product, category);
  });

  result = [...result].sort((a, b) => {
    if (sort === "price-asc") return a.sellingPrice - b.sellingPrice;
    if (sort === "price-desc") return b.sellingPrice - a.sellingPrice;
    if (sort === "name-asc") return a.title.localeCompare(b.title);
    if (sort === "discount-desc") return b.discountPercent - a.discountPercent;
    return b.rating - a.rating;
  });

  if (limit > 0) {
    result = result.slice(0, limit);
  }

  res.json({
    count: result.length,
    products: result
  });
});

app.get("/api/products/:id", async (req, res) => {
  const products = await getProducts();
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  res.json(product);
});

app.get("/api/categories", async (_req, res) => {
  const products = await getProducts();
  const categories = [...new Set(products.map((product) => product.category))].sort();
  const genders = [...new Set(products.map((product) => product.gender).filter(Boolean))].sort();
  res.json({ categories, genders });
});

app.post("/api/orders", async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];

  if (items.length === 0) {
    res.status(400).json({ message: "Cart is empty" });
    return;
  }

  res.status(201).json({
    orderId: `DOR-${Date.now().toString(36).toUpperCase()}`,
    status: "confirmed",
    items: items.length
  });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Dior store running at http://localhost:${port}`);
});
