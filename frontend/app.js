const API_BASE = window.DIOR_API_BASE || "";
const state = {
  products: [],
  category: "all",
  search: "",
  sort: "featured",
  cart: JSON.parse(localStorage.getItem("diorCart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("diorWishlist") || "[]")
};

const grid = document.querySelector("#productGrid");
const template = document.querySelector("#productCardTemplate");
const productCount = document.querySelector("#productCount");
const collectionTitle = document.querySelector("#collectionTitle");
const cartCount = document.querySelector("#cartCount");
const wishlistCount = document.querySelector("#wishlistCount");
const drawer = document.querySelector("#drawer");
const drawerTitle = document.querySelector("#drawerTitle");
const drawerContent = document.querySelector("#drawerContent");
const drawerTotal = document.querySelector("#drawerTotal");

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value || 0);
}

function saveState() {
  localStorage.setItem("diorCart", JSON.stringify(state.cart));
  localStorage.setItem("diorWishlist", JSON.stringify(state.wishlist));
  cartCount.textContent = state.cart.length;
  wishlistCount.textContent = state.wishlist.length;
}

async function loadProducts() {
  const params = new URLSearchParams({
    category: state.category,
    search: state.search,
    sort: state.sort
  });

  grid.innerHTML = '<p class="status">Loading the collection...</p>';
  const response = await fetch(`${API_BASE}/api/products?${params}`);

  if (!response.ok) {
    throw new Error("Could not load products from backend");
  }

  const data = await response.json();
  state.products = data.products;
  renderProducts();
}

function renderProducts() {
  grid.innerHTML = "";
  collectionTitle.textContent = state.category === "all" ? "All Products" : `${state.category} Collection`;
  productCount.textContent = `${state.products.length} pieces`;

  if (state.products.length === 0) {
    grid.innerHTML = '<p class="status">No products found.</p>';
    return;
  }

  state.products.forEach((product) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const image = card.querySelector("img");
    const heart = card.querySelector(".heart");

    image.src = product.image;
    image.alt = product.title;
    card.querySelector(".brand-name").textContent = product.brand;
    card.querySelector("h3").textContent = product.title;
    card.querySelector(".price").textContent = money(product.sellingPrice);
    card.querySelector(".mrp").textContent = money(product.mrp);
    card.querySelector(".discount").textContent = `${product.discountPercent}% off`;
    const tagRow = card.querySelector(".tag-row");
    [product.gender, product.category, `${product.rating} star`].forEach((label) => {
      const tag = document.createElement("span");
      tag.textContent = label;
      tagRow.appendChild(tag);
    });

    if (state.wishlist.some((item) => item.id === product.id)) {
      heart.classList.add("active");
      heart.textContent = "Saved";
    }

    heart.addEventListener("click", () => toggleWishlist(product));
    card.querySelector(".add-button").addEventListener("click", () => addToCart(product));
    grid.appendChild(card);
  });
}

function addToCart(product) {
  state.cart.push(product);
  saveState();
  showDrawer("cart");
}

function toggleWishlist(product) {
  const exists = state.wishlist.some((item) => item.id === product.id);
  state.wishlist = exists
    ? state.wishlist.filter((item) => item.id !== product.id)
    : [...state.wishlist, product];
  saveState();
  renderProducts();
}

function removeFromCart(index) {
  state.cart.splice(index, 1);
  saveState();
  showDrawer("cart");
}

function showDrawer(mode) {
  const items = mode === "wishlist" ? state.wishlist : state.cart;
  drawerTitle.textContent = mode === "wishlist" ? "Wishlist" : "Shopping Bag";
  drawerContent.innerHTML = "";

  if (items.length === 0) {
    drawerContent.innerHTML = `<p class="status">Your ${mode === "wishlist" ? "wishlist" : "bag"} is empty.</p>`;
    drawerTotal.innerHTML = "";
  } else {
    items.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "drawer-item";
      const image = document.createElement("img");
      const details = document.createElement("div");
      const title = document.createElement("strong");
      const brand = document.createElement("span");
      const price = document.createElement("b");

      image.src = item.image;
      image.alt = "";
      title.textContent = item.title;
      brand.textContent = item.brand;
      price.textContent = money(item.sellingPrice);
      details.append(title, brand, price);
      row.append(image, details);

      let remove;
      if (mode === "cart") {
        remove = document.createElement("button");
        remove.type = "button";
        remove.setAttribute("aria-label", "Remove item");
        remove.textContent = "x";
        row.appendChild(remove);
      }

      if (remove) remove.addEventListener("click", () => removeFromCart(index));
      drawerContent.appendChild(row);
    });

    const total = items.reduce((sum, item) => sum + item.sellingPrice, 0);
    drawerTotal.innerHTML =
      mode === "cart"
        ? `<span>Total</span><strong>${money(total)}</strong><button id="checkoutButton">Checkout</button>`
        : "";
    document.querySelector("#checkoutButton")?.addEventListener("click", checkout);
  }

  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}

async function checkout() {
  const response = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: state.cart.map((item) => item.id) })
  });
  const data = await response.json();

  if (!response.ok) {
    alert(data.message || "Checkout failed");
    return;
  }

  state.cart = [];
  saveState();
  drawerTotal.innerHTML = "";
  drawerContent.innerHTML = `<p class="status">Order confirmed: ${data.orderId}</p>`;
}

document.querySelectorAll("[data-category]").forEach((button) => {
  button.addEventListener("click", () => {
    state.category = button.dataset.category;
    document.querySelectorAll("[data-category]").forEach((item) => item.classList.toggle("active", item === button));
    loadProducts().catch(showError);
  });
});

document.querySelector("#searchInput").addEventListener("input", (event) => {
  state.search = event.target.value;
  window.clearTimeout(window.searchTimer);
  window.searchTimer = window.setTimeout(() => loadProducts().catch(showError), 250);
});

document.querySelector("#sortSelect").addEventListener("change", (event) => {
  state.sort = event.target.value;
  loadProducts().catch(showError);
});

document.querySelector("#cartButton").addEventListener("click", () => showDrawer("cart"));
document.querySelector("#wishlistButton").addEventListener("click", () => showDrawer("wishlist"));
document.querySelector("#closeDrawer").addEventListener("click", () => {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
});
drawer.addEventListener("click", (event) => {
  if (event.target === drawer) {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  }
});

function showError(error) {
  grid.innerHTML = `<p class="status">${error.message}</p>`;
  productCount.textContent = "Backend offline";
}

document.querySelector('[data-category="all"]').classList.add("active");
saveState();
loadProducts().catch(showError);
