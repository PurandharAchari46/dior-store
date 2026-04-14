// ================= PRODUCTS =================
const products = [

{id:1,name:"Men Black Shirt",price:2500,cat:"boys",rating:4.2,img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf"},
{id:2,name:"Men Casual T-Shirt",price:1800,cat:"boys",rating:4.1,img:"https://images.unsplash.com/photo-1523381210434-271e8be1f52b"},
{id:3,name:"Men Denim Jacket",price:4200,cat:"boys",rating:4.5,img:"https://images.unsplash.com/photo-1542060748-10c28b62716b"},
{id:4,name:"Men Formal Shirt",price:2700,cat:"boys",rating:4.0,img:"https://images.unsplash.com/photo-1603252109303-2751441dd157"},
{id:5,name:"Men Hoodie",price:3500,cat:"boys",rating:4.3,img:"https://images.unsplash.com/photo-1556821840-3a9c6b8d41a6"},

{id:6,name:"Women Red Dress",price:4500,cat:"girls",rating:4.6,img:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b"},
{id:7,name:"Women Party Gown",price:6500,cat:"girls",rating:4.7,img:"https://images.unsplash.com/photo-1520975922071-a0a5fdfbb3b3"},
{id:8,name:"Women Casual Top",price:2000,cat:"girls",rating:4.2,img:"https://images.unsplash.com/photo-1495121605193-b116b5b09a5c"},
{id:9,name:"Women Floral Dress",price:3800,cat:"girls",rating:4.4,img:"https://images.unsplash.com/photo-1521334884684-d80222895322"},
{id:10,name:"Women Designer Dress",price:5200,cat:"girls",rating:4.5,img:"https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03"},

{id:11,name:"Nike Sneakers",price:5500,cat:"shoes",rating:4.6,img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff"},
{id:12,name:"Running Shoes",price:3200,cat:"shoes",rating:4.3,img:"https://images.unsplash.com/photo-1528701800489-20be0f9f7d1c"},
{id:13,name:"Casual Shoes",price:2800,cat:"shoes",rating:4.2,img:"https://images.unsplash.com/photo-1588361861040-ac9b1018f6d5"},
{id:14,name:"Formal Shoes",price:4000,cat:"shoes",rating:4.4,img:"https://images.unsplash.com/photo-1539185441755-769473a23570"},
{id:15,name:"Sport Shoes",price:4700,cat:"shoes",rating:4.5,img:"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"},

{id:16,name:"Leather Handbag",price:8500,cat:"bags",rating:4.7,img:"https://images.unsplash.com/photo-1584917865442-de89df76afd3"},
{id:17,name:"Luxury Purse",price:6200,cat:"bags",rating:4.5,img:"https://images.unsplash.com/photo-1591561954557-26941169b49e"},
{id:18,name:"Travel Bag",price:5000,cat:"bags",rating:4.3,img:"https://images.unsplash.com/photo-1514474959185-1472d4c4e0d3"},
{id:19,name:"Backpack",price:3000,cat:"bags",rating:4.2,img:"https://images.unsplash.com/photo-1509762774605-f07235a08f1f"},
{id:20,name:"Designer Bag",price:9000,cat:"bags",rating:4.8,img:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa"}
];

// ================= STORAGE =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// ================= LOAD PRODUCTS =================
function loadProducts(list = products){
let html = "";

list.forEach(p=>{
html += `
<div class="card">
<div class="badge">NEW</div>

<div class="heart" onclick="addWish(${p.id})">❤️</div>

<img src="${p.img}">

<div class="info">
<h4>${p.name}</h4>
<p>⭐ ${p.rating}</p>
<p class="price">₹${p.price}</p>
</div>

<div class="overlay">
<button onclick="addToCart(${p.id})">Add to Cart</button>
</div>

</div>`;
});

document.getElementById("products").innerHTML = html;
}

// ================= SEARCH =================
function searchProducts(){
let v = document.getElementById("search").value.toLowerCase();
loadProducts(products.filter(p=>p.name.toLowerCase().includes(v)));
}

// ================= FILTER =================
function filterCategory(cat){
if(cat==="all") loadProducts(products);
else loadProducts(products.filter(p=>p.cat===cat));
}

// ================= SORT =================
function sortPrice(){
products.sort((a,b)=>a.price-b.price);
loadProducts(products);
}

// ================= CART =================
function addToCart(id){
let item = cart.find(i=>i.id===id);

if(item) item.qty++;
else cart.push({...products.find(p=>p.id===id), qty:1});

saveCart();
updateCart();
toast("Added to cart");
}

function saveCart(){
localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCart(){
let total = cart.reduce((sum,i)=>sum + (i.qty||1),0);
document.getElementById("cartCount").innerText = total;
}

// ================= CART UI (FIXED) =================
function openCart(){
let html = "", total = 0;

cart.forEach((i,index)=>{
let qty = i.qty || 1;
total += i.price * qty;

html += `
<div>
${i.name} x${qty} - ₹${i.price * qty}
<button onclick="changeQty(${index},1)">+</button>
<button onclick="changeQty(${index},-1)">-</button>
</div>`;
});

document.getElementById("cartItems").innerHTML = html || "Cart Empty";
document.getElementById("total").innerText = total;
document.getElementById("orderStatus").innerHTML = "";
document.getElementById("cartModal").style.display = "block";
}

// ================= FIXED QTY =================
function changeQty(i,val){
if(!cart[i]) return;

cart[i].qty = (cart[i].qty||1) + val;

if(cart[i].qty <= 0){
cart.splice(i,1);
}

saveCart();
updateCart();
openCart();
}

// ================= CLOSE CART =================
function closeCart(){
document.getElementById("cartModal").style.display = "none";
}

// ================= WISHLIST =================
function addWish(id){
if(wishlist.find(p=>p.id===id)){
toast("Already in wishlist");
return;
}

wishlist.push(products.find(p=>p.id===id));
localStorage.setItem("wishlist", JSON.stringify(wishlist));

document.getElementById("wishCount").innerText = wishlist.length;
toast("Added to wishlist");
}

// ✅ FIXED WISHLIST OPEN
function openWishlist(){
let html = "";

wishlist.forEach(i=>{
html += `<p>${i.name} - ₹${i.price}</p>`;
});

document.getElementById("wishItems").innerHTML = html || "Wishlist Empty";
document.getElementById("wishModal").style.display = "block";
}

// ================= CLOSE WISHLIST =================
function closeWishlist(){
document.getElementById("wishModal").style.display = "none";
}

// ================= ORDER =================
function placeOrder(){

const name = document.getElementById("cname").value;
const address = document.getElementById("caddress").value;
const phone = document.getElementById("cphone").value;

if(!name || !address || !phone){
toast("Fill details");
return;
}

if(cart.length===0){
toast("Cart empty");
return;
}

let total = cart.reduce((sum,i)=>sum+i.price*(i.qty||1),0);
let id = "DIOR"+Math.floor(Math.random()*100000);

orders.push({id,items:[...cart],total,status:"Processing"});
localStorage.setItem("orders", JSON.stringify(orders));

document.getElementById("orderStatus").innerHTML = `
<h3>Order Confirmed 🎉</h3>
<p>ID: ${id}</p>
<p>Total ₹${total}</p>
`;

cart=[];
saveCart();
updateCart();
}

// ================= ORDERS =================
function openOrders(){
let html = "";

orders.forEach(o=>{
html += `
<div>
<b>Order ID:</b> ${o.id}<br>
Total: ₹${o.total}<br>
Items: ${o.items.map(i=>i.name + " x" + (i.qty||1)).join(", ")}
<hr>
</div>`;
});

document.getElementById("ordersList").innerHTML = html || "No Orders";
document.getElementById("ordersModal").style.display = "block";
}

function closeOrders(){
document.getElementById("ordersModal").style.display = "none";
}

// ================= THEME =================
function toggleTheme(){
document.body.classList.toggle("dark");
}

// ================= TOAST =================
function toast(msg){
let t = document.getElementById("toast");
t.innerText = msg;
t.style.display = "block";
setTimeout(()=>t.style.display="none",2000);
}

// ================= INIT =================
window.onload = ()=>{
loadProducts();
updateCart();
document.getElementById("wishCount").innerText = wishlist.length;
};