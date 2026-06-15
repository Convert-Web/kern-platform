"use strict";

/* --- CONFIGURATION & DATA --- */
const WHATSAPP_NUMBER = "33164248754";

const CATEGORIES = [
    { id: 'tacos', name: 'TACOS', emoji: '🌮' },
    { id: 'burgers', name: 'BURGERS', emoji: '🍔' },
    { id: 'pizzas', name: 'PIZZAS', emoji: '🍕' },
    { id: 'sandwiches', name: 'SANDWICHES', emoji: '🥙' },
    { id: 'assiettes', name: 'ASSIETTES', emoji: '🍽️' },
    { id: 'boissons', name: 'BOISSONS', emoji: '🥤' }
];

const PRODUCTS = [
    { id: 1, cat: 'tacos', name: 'TACOS L (1 VIANDE)', price: 9.10, sticker: 'POPULAIRE' },
    { id: 2, cat: 'tacos', name: 'TACOS XL (2 VIANDES)', price: 10.40, sticker: '🔥 LE FAT' },
    { id: 3, cat: 'burgers', name: 'LE BOSS BURGER (180G)', price: 7.80, sticker: 'MAISON' },
    { id: 4, cat: 'burgers', name: 'CHEESEBURGER DOUBLE', price: 5.20, sticker: 'CLASSIC' },
    { id: 5, cat: 'pizzas', name: 'PIZZA TOUAREG', price: 9.75, sticker: 'SIGNATURE' },
    { id: 6, cat: 'pizzas', name: 'PIZZA 4 FROMAGES', price: 9.75, sticker: null },
    { id: 7, cat: 'sandwiches', name: 'SANDWICH KEBAB', price: 7.80, sticker: 'VRAI GOÛT' },
    { id: 8, cat: 'sandwiches', name: 'SANDWICH CHICKEN CURRY', price: 7.80, sticker: null },
    { id: 9, cat: 'boissons', name: 'COCA-COLA 33CL', price: 1.95, sticker: null },
    { id: 10, cat: 'boissons', name: 'TROPICO', price: 1.95, sticker: null }
];

/* --- STATE --- */
let cart = [];
let activeCategory = 'all';

/* --- CORE FUNCTIONS --- */

function init() {
    renderFilters();
    renderProducts();
    setupEventListeners();
    updateCartUI();
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Animation au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function renderFilters() {
    const track = document.getElementById('filtersTrack');
    CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.category = cat.id;
        btn.textContent = `${cat.emoji} ${cat.name}`;
        btn.onclick = () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = cat.id;
            renderProducts();
        };
        track.appendChild(btn);
    });
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const search = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = PRODUCTS.filter(p => {
        const matchesCat = activeCategory === 'all' || p.cat === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(search);
        return matchesCat && matchesSearch;
    });

    grid.innerHTML = filtered.map(p => `
        <div class="product-card reveal visible">
            ${p.sticker ? `<div class="sticker">${p.sticker}</div>` : ''}
            <div class="product-card-body">
                <h3 class="product-card-name">${p.name}</h3>
                <span class="product-card-price">${p.price.toFixed(2)} €</span>
                <button class="btn btn-primary btn-full" onclick="addToCart(${p.id})">AJOUTER +</button>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = PRODUCTS.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    updateCartUI();
    // Feedback visuel rapide
    document.getElementById('cartBadge').style.transform = 'scale(1.3)';
    setTimeout(() => document.getElementById('cartBadge').style.transform = 'scale(1)', 200);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const badge = document.getElementById('cartBadge');
    const itemsList = document.getElementById('cartItems');
    const totalDisplay = document.getElementById('cartTotalPrice');
    
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    
    badge.textContent = count;
    totalDisplay.textContent = total.toFixed(2) + " €";
    
    itemsList.innerHTML = cart.map(item => `
        <li style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #222; padding-bottom:10px;">
            <div>
                <div style="font-family:'Bebas Neue'; font-size:1.2rem;">${item.name}</div>
                <div style="color:var(--red); font-weight:bold;">${item.qty} x ${item.price.toFixed(2)}€</div>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background:none; border:1px solid var(--red); color:var(--red); padding:5px 10px; cursor:pointer;">X</button>
        </li>
    `).join('');
}

function sendWhatsApp() {
    const name = document.getElementById('customerName').value.trim();
    const mode = document.querySelector('input[name="orderMode"]:checked').value;
    const address = document.getElementById('customerAddress').value.trim();

    if (!name) {
        alert("Poto, donne ton prénom pour la commande !");
        return;
    }
    if (cart.length === 0) {
        alert("Ton panier est vide, tu vas manger du vent ?");
        return;
    }
    if (mode === "Livraison" && !address) {
        alert("Il me faut ton adresse pour la livraison !");
        return;
    }

    let msg = `Salut Le Touareg 👋\n\n`;
    msg += `*COMMANDE DE :* ${name.toUpperCase()}\n`;
    msg += `*MODE :* ${mode}\n`;
    if(address) msg += `*ADRESSE :* ${address}\n`;
    msg += `\n--------------------------\n`;
    
    cart.forEach(item => {
        msg += `• ${item.qty}x ${item.name} (${(item.price * item.qty).toFixed(2)}€)\n`;
    });
    
    msg += `--------------------------\n`;
    msg += `*TOTAL À RÉGLER : ${document.getElementById('cartTotalPrice').textContent}*`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

/* --- LISTENERS --- */
function setupEventListeners() {
    document.getElementById('cartToggle').onclick = () => {
        document.getElementById('cartPanel').classList.add('open');
        document.getElementById('cartOverlay').classList.add('visible');
    };
    
    document.getElementById('cartClose').onclick = closeCart;
    document.getElementById('cartOverlay').onclick = closeCart;
    
    document.getElementById('searchInput').oninput = renderProducts;
    document.getElementById('whatsappOrderBtn').onclick = sendWhatsApp;
}

function closeCart() {
    document.getElementById('cartPanel').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('visible');
}

// Lancement
init();
