"use strict";

const WHATSAPP_NUMBER = "33164248754";

const CATEGORIES = [
  { id: 'menus', name: 'NOS MENUS', emoji: '🥤' },
  { id: 'tacos', name: 'TACOS', emoji: '🌮' },
  { id: 'burgers', name: 'BURGERS', emoji: '🍔' },
  { id: 'pizzas', name: 'PIZZAS', emoji: '🍕' },
  { id: 'sandwiches', name: 'SANDWICHES', emoji: '🥙' },
  { id: 'texmex', name: 'TEX-MEX', emoji: '🌶️' },
  { id: 'desserts', name: 'DESSERTS', emoji: '🍰' },
  { id: 'boissons', name: 'BOISSONS', emoji: '🥤' }
];

const PRODUCTS = [
  // MENUS
  { id: 1, cat: 'menus', name: 'Menu Tacos L', price: 11.05, desc: '1 viande au choix + Frites + Boisson' },
  { id: 2, cat: 'menus', name: 'Menu Tacos XL', price: 13.00, desc: '2 viandes au choix + Frites + Boisson' },
  { id: 3, cat: 'menus', name: 'Menu Burger Maison', price: 9.10, desc: 'Steak 100g, raclette, frites, boisson' },
  { id: 4, cat: 'menus', name: 'Menu Kebab', price: 10.40, desc: 'Le classique de Montereau' },
  
  // PIZZAS
  { id: 5, cat: 'pizzas', name: 'Pizza Touareg', price: 9.75, desc: 'Poulet, sauce fromagère, pdt' },
  { id: 6, cat: 'pizzas', name: 'Pizza Chèvre Miel', price: 9.75, desc: 'La douceur ultime' },
  { id: 7, cat: 'pizzas', name: 'Pizza 3 Viandes', price: 9.75, desc: 'Pour les gros appétits' },
  
  // TACOS
  { id: 8, cat: 'tacos', name: 'Tacos L seul', price: 9.10, desc: '1 viande au choix' },
  { id: 9, cat: 'tacos', name: 'Tacos XL seul', price: 10.40, desc: '2 viandes au choix' },
  
  // TEX MEX
  { id: 10, cat: 'texmex', name: 'Tenders x3', price: 5.20, desc: 'Poulet croustillant' },
  { id: 11, cat: 'texmex', name: 'Nuggets x3', price: 2.60, desc: 'Classique' },

  // DESSERTS
  { id: 12, cat: 'desserts', name: 'Tiramisu Maison', price: 3.90, desc: 'Daim ou Spéculoos' },
  { id: 13, cat: 'desserts', name: 'Tarte au Daim', price: 3.90, desc: 'L\'indémodable' }
  // Rajoute ici le reste des 97 produits en suivant le même schéma id, cat, name, price, desc
];

let cart = [];
let activeCategory = 'all';

// --- INITIALISATION ---
window.onload = () => {
  renderCategories();
  renderProducts();
  setupListeners();
  
  // Fermer le loader après 1s
  setTimeout(() => {
    document.getElementById('loader').style.transform = "translateY(-100%)";
  }, 1000);

  // Animation au scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

// --- RENDU ---
function renderCategories() {
  const nav = document.getElementById('catNav');
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-link';
    btn.textContent = `${cat.emoji} ${cat.name}`;
    btn.onclick = () => {
      document.querySelectorAll('.cat-link').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = cat.id;
      renderProducts();
    };
    nav.appendChild(btn);
  });
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const search = document.getElementById('searchInput').value.toLowerCase();
  
  const filtered = PRODUCTS.filter(p => {
    const matchesCat = activeCategory === 'all' || p.cat === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(search);
    return matchesCat && matchesSearch;
  });

  grid.innerHTML = filtered.map(p => `
    <div class="product-card reveal active">
      <div class="p-body">
        <h3 class="p-title">${p.name}</h3>
        <p class="p-desc">${p.desc || ''}</p>
        <span class="p-price">${p.price.toFixed(2)} €</span>
        <button class="add-btn" onclick="addToCart(${p.id})">AJOUTER AU PANIER +</button>
      </div>
    </div>
  `).join('');
}

// --- PANIER ---
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if(existing) existing.qty++;
  else cart.push({...product, qty: 1});
  
  updateCartUI();
  openCart();
}

function updateCartUI() {
  const list = document.getElementById('cartItems');
  const totalDisplay = document.getElementById('cartTotalPrice');
  const badge = document.getElementById('cartBadge');
  
  const count = cart.reduce((acc, i) => acc + i.qty, 0);
  const total = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
  
  badge.textContent = count;
  totalDisplay.textContent = total.toFixed(2) + " €";
  
  list.innerHTML = cart.map(i => `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid #eee; padding-bottom:10px;">
      <div>
        <div style="font-family:'Bebas Neue'; font-size:1.5rem;">${i.name}</div>
        <div style="font-weight:bold; color:red;">${i.qty} x ${i.price.toFixed(2)}€</div>
      </div>
      <button onclick="removeItem(${i.id})" style="background:none; border:none; color:red; font-weight:bold; cursor:pointer;">SUPPRIMER</button>
    </div>
  `).join('');
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

// --- WHATSAPP ---
function sendWhatsApp() {
  const name = document.getElementById('customerName').value;
  const mode = document.querySelector('input[name="orderMode"]:checked').value;
  const address = document.getElementById('customerAddress').value;

  if(!name || cart.length === 0) return alert("Nom et Panier obligatoires !");

  let msg = `Salut Le Touareg 👋\n\n*COMMANDE DE :* ${name.toUpperCase()}\n*MODE :* ${mode}\n`;
  if(address) msg += `*ADRESSE :* ${address}\n`;
  msg += `\n----------\n`;
  cart.forEach(i => msg += `• ${i.qty}x ${i.name} (${(i.price*i.qty).toFixed(2)}€)\n`);
  msg += `----------\n*TOTAL : ${document.getElementById('cartTotalPrice').textContent}*`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
}

// --- LISTENERS ---
function setupListeners() {
  document.getElementById('cartToggle').onclick = openCart;
  document.getElementById('cartClose').onclick = closeCart;
  document.getElementById('cartOverlay').onclick = closeCart;
  document.getElementById('searchInput').oninput = renderProducts;
  document.getElementById('whatsappOrderBtn').onclick = sendWhatsApp;
}

function openCart() {
  document.getElementById('cartPanel').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}

function closeCart() {
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}
