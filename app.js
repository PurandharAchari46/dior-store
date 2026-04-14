let products = [];
let cart = [];

// ✅ Load products from JSON
fetch('products.json')
  .then(response => response.json())
  .then(data => {
    products = data;
    displayProducts(products);
  })
  .catch(error => console.log("Error loading products:", error));

// ✅ Display Products
function displayProducts(items) {
  const container = document.getElementById('product-container');
  container.innerHTML = '';

  items.forEach(product => {
    const div = document.createElement('div');
    div.classList.add('product');

    div.innerHTML = `
      <img src="${product.image}" width="150">
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;

    container.appendChild(div);
  });
}

// ✅ Add to Cart
function addToCart(id) {
  const item = products.find(p => p.id === id);
  cart.push(item);
  updateCartCount();
}

// ✅ Update Cart Count
function updateCartCount() {
  document.getElementById('cart-count').innerText = cart.length;
}

// ✅ Open Cart
function openCart() {
  document.getElementById('cart-modal').classList.remove('hidden');
  renderCart();
}

// ✅ Close Cart
function closeCart() {
  document.getElementById('cart-modal').classList.add('hidden');
}

// ✅ Render Cart Items
function renderCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  cartItemsDiv.innerHTML = '';

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const div = document.createElement('div');
    div.innerHTML = `
      ${item.name} - ₹${item.price}
      <button onclick="removeItem(${index})">Remove</button>
    `;

    cartItemsDiv.appendChild(div);
  });

  document.getElementById('total').innerText = total;
}

// ✅ Remove Item
function removeItem(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCart();
}

// ✅ Search Function
const searchInput = document.getElementById('search');

searchInput.addEventListener('input', function () {
  const value = this.value.toLowerCase();

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(value) ||
    product.category.toLowerCase().includes(value)
  );

  displayProducts(filtered);
});

// ✅ Checkout
function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const trackingId = "TRK" + Math.floor(Math.random() * 100000);

  alert("Order placed successfully!\nTracking ID: " + trackingId);

  cart = [];
  updateCartCount();
  closeCart();
}