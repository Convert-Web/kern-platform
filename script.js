/* ═══════════════════════════════════════════════════
   LE TOUAREG — script.js
   Street Food · Montereau-Fault-Yonne
═══════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════
   1. MENU DATA
══════════════════════════════════════════════ */

const WHATSAPP_NUMBER = '33164248754';

const CATEGORIES = [
  { id: 'menus-sandwiches',    name: 'Menus Sandwiches',    emoji: '🥙' },
  { id: 'menus-tacos',         name: 'Menus Tacos',         emoji: '🌮' },
  { id: 'menus-burgers',       name: 'Menus Burgers',       emoji: '🍔' },
  { id: 'menus-paninis',       name: 'Menus Paninis',       emoji: '🥪' },
  { id: 'menus-pizzas-turques',name: 'Menus Pizzas Turques',emoji: '🥙' },
  { id: 'menus-croques',       name: 'Menus Croques',       emoji: '🥐' },
  { id: 'tex-mex',             name: 'Tex-Mex',             emoji: '🌶️' },
  { id: 'salades',             name: 'Salades',             emoji: '🥗' },
  { id: 'pizzas',              name: 'Pizzas',              emoji: '🍕' },
  { id: 'tacos',               name: 'Tacos',               emoji: '🌮' },
  { id: 'burgers',             name: 'Burgers',             emoji: '🍔' },
  { id: 'sandwiches',         name: 'Sandwiches',          emoji: '🥙' },
  { id: 'assiettes',           name: 'Assiettes',           emoji: '🍽️' },
  { id: 'pizzas-turques',      name: 'Pizzas Turques',      emoji: '🥙' },
  { id: 'paninis',             name: 'Paninis',             emoji: '🥪' },
  { id: 'croques',             name: 'Croques',             emoji: '🥐' },
  { id: 'buckets',             name: 'Buckets',             emoji: '🍟' },
  { id: 'desserts',            name: 'Desserts',            emoji: '🍰' },
  { id: 'boissons',            name: 'Boissons',            emoji: '🥤' },
];

const PRODUCTS = [
  /* ── MENUS SANDWICHES ── */
  { id: 1,  category: 'menus-sandwiches', name: 'Menu Sandwich Chicken Curry',      price: 10.40, desc: 'Poulet mariné, sauce curry et fromage.',                                            popular: false },
  { id: 2,  category: 'menus-sandwiches', name: 'Menu Sandwich Kebab',              price: 10.40, desc: 'Viande kebab, salade, tomates et oignons.',                                         popular: false },
  { id: 3,  category: 'menus-sandwiches', name: 'Menu Sandwich Paprika',            price: 10.40, desc: 'Poulet mariné, paprika et crème fraîche.',                                          popular: false },
  { id: 4,  category: 'menus-sandwiches', name: 'Menu Sandwich Mixte',              price: 10.40, desc: '2 viandes au choix et fromage.',                                                    popular: false },
  { id: 5,  category: 'menus-sandwiches', name: 'Menu Sandwich Cordon Bleu',        price: 8.45,  desc: 'Poulet mariné, sauce curry et fromage.',                                            popular: false },
  { id: 6,  category: 'menus-sandwiches', name: 'Menu Sandwich Double Croc',        price: 10.40, desc: '2 steaks 45 g, cordon bleu et fromage.',                                           popular: false },
  { id: 7,  category: 'menus-sandwiches', name: 'Menu Sandwich Boursin',            price: 10.40, desc: 'Poulet mariné, sauce curry et fromage.',                                            popular: false },
  { id: 8,  category: 'menus-sandwiches', name: 'Menu Sandwich Shempa',             price: 10.40, desc: 'Chicken, crème fraîche, fromage râpé et champignons.',                             popular: false },
  { id: 9,  category: 'menus-sandwiches', name: 'Menu Sandwich Touareg',            price: 10.40, desc: 'Steak viande hachée, œuf, fromage, olives, oignons et tomates.',                  popular: false },
  { id: 10, category: 'menus-sandwiches', name: 'Menu Sandwich Kefta',              price: 10.40, desc: '2 steaks, viande hachée et fromage.',                                              popular: false },
  { id: 11, category: 'menus-sandwiches', name: 'Menu Sandwich Brochette d\'Agneau',price: 10.40, desc: 'Brochette d\'agneau et fromage.',                                                  popular: false },
  { id: 12, category: 'menus-sandwiches', name: 'Menu Sandwich Américain',          price: 10.40, desc: '2 steaks 45 g, œuf et fromage.',                                                   popular: true  },
  { id: 13, category: 'menus-sandwiches', name: 'Menu Sandwich Forma',              price: 11.05, desc: 'Viande au choix, crème fraîche, fromage râpé, lardons, œuf et frites.',           popular: false },
  { id: 14, category: 'menus-sandwiches', name: 'Menu Sandwich Zinger Rolo',        price: 11.05, desc: 'Pita poulet façon KFC, bacon de dinde, steak 45 g et fromage.',                   popular: false },
  { id: 15, category: 'menus-sandwiches', name: 'Menu Sandwich Spécial',            price: 11.05, desc: 'Pita, viande marinée au choix, oignons frits, borcha et cordon bleu.',            popular: false },

  /* ── MENUS PANINIS ── */
  { id: 16, category: 'menus-paninis', name: 'Menu Panini Thon',             price: 8.45, desc: 'Panini grillé garni de thon.',                              popular: false },
  { id: 17, category: 'menus-paninis', name: 'Menu Panini Fromage',          price: 8.45, desc: 'Panini garni de fromage fondu.',                            popular: true  },
  { id: 18, category: 'menus-paninis', name: 'Menu Panini Saumon',           price: 8.45, desc: 'Panini garni de saumon.',                                   popular: false },
  { id: 19, category: 'menus-paninis', name: 'Menu Panini Bolognaise',       price: 8.45, desc: 'Panini garni de sauce bolognaise, pain pressé et chaud.',   popular: false },
  { id: 20, category: 'menus-paninis', name: 'Menu Panini 1 Viande au Choix',price: 8.45, desc: 'Panini garni d\'1 viande au choix. Formule menu.',          popular: false },

  /* ── MENUS TACOS ── */
  { id: 21, category: 'menus-tacos', name: 'Menu Tacos L',  price: 11.05, desc: '1 viande au choix.',  popular: false },
  { id: 22, category: 'menus-tacos', name: 'Menu Tacos XL', price: 13.00, desc: '2 viandes au choix.', popular: true, badge: '🧨 Lourd' },

  /* ── MENUS BURGERS ── */
  { id: 23, category: 'menus-burgers', name: 'Menu Double Big Burger',      price: 13.00, desc: '2 steaks 180 g, 2 fromages, salade et tomates.',          popular: false, badge: '🧨 Lourd' },
  { id: 24, category: 'menus-burgers', name: 'Menu Big Burger',             price: 10.40, desc: '1 steak 180 g, 2 fromages, salade et tomates.',           popular: false },
  { id: 25, category: 'menus-burgers', name: 'Menu Double Big Burger Plus', price: 15.60, desc: '2 steaks 180 g, œuf et 2 fromages.',                      popular: false, badge: '🧨 Lourd' },
  { id: 26, category: 'menus-burgers', name: 'Menu Cheese Burger',          price: 7.15,  desc: '1 steak et fromage.',                                     popular: true  },
  { id: 27, category: 'menus-burgers', name: 'Menu Double Cheeseburger',    price: 8.45,  desc: '2 steaks et 2 fromages.',                                 popular: true  },
  { id: 28, category: 'menus-burgers', name: 'Menu Chicken Burger',         price: 7.80,  desc: 'Chicken pané et fromage.',                                popular: false },
  { id: 29, category: 'menus-burgers', name: 'Menu Zinger Burger',          price: 8.45,  desc: 'Poulet façon KFC et fromage.',                            popular: false },
  { id: 30, category: 'menus-burgers', name: 'Menu Fish Burger',            price: 7.15,  desc: 'Poisson pané, salade, oignons et fromage.',               popular: false },
  { id: 31, category: 'menus-burgers', name: 'Menu Burger Maison',          price: 9.10,  desc: 'Steak viande hachée 100 g, fromage, raclette, salade, tomates et oignons.', popular: false },
  { id: 32, category: 'menus-burgers', name: 'Menu Burger Végétarien',      price: 7.80,  desc: 'Steak de pommes de terre, œuf et fromage.',               popular: false },

  /* ── MENUS PIZZAS TURQUES ── */
  { id: 33, category: 'menus-pizzas-turques', name: 'Menu Pizza Turque', price: 7.80, desc: 'Spécialité turque de pâte garnie façon pizza. Formule menu.', popular: false },

  /* ── MENUS CROQUES ── */
  { id: 34, category: 'menus-croques', name: 'Menu Croque Monsieur', price: 6.50, desc: 'Pain de mie, jambon et fromage.', popular: false },

  /* ── TEX-MEX ── */
  { id: 35, category: 'tex-mex', name: 'Nuggets',      price: 2.60, desc: '3 pièces.',  popular: false },
  { id: 36, category: 'tex-mex', name: 'Tenders',      price: 5.20, desc: '3 pièces.',  popular: false },
  { id: 37, category: 'tex-mex', name: 'Camembert',    price: 2.60, desc: '3 pièces.',  popular: true  },
  { id: 38, category: 'tex-mex', name: 'Jalapeños',    price: 3.90, desc: '3 pièces.',  popular: false },
  { id: 39, category: 'tex-mex', name: 'Onion Rings',  price: 2.60, desc: '3 pièces.',  popular: false },

  /* ── SALADES ── */
  { id: 40, category: 'salades', name: 'Salade César',  price: 7.80, desc: 'Salade, tomates, poulet frit, copeaux de fromage et maïs.', popular: false },
  { id: 41, category: 'salades', name: 'Salade Niçoise',price: 6.50, desc: 'Salade, tomates, olives, maïs et thon.',                    popular: false },
  { id: 42, category: 'salades', name: 'Salade Mixte',  price: 5.20, desc: 'Salade, tomates et olives.',                                popular: false },

  /* ── PIZZAS ── */
  { id: 43, category: 'pizzas', name: 'Pizza Margherita',   price: 9.75, desc: 'Base au choix, fromage et oignons. Taille sénior.',                                              popular: true  },
  { id: 44, category: 'pizzas', name: 'Pizza Touareg',      price: 9.75, desc: 'Base au choix, fromage, poulet, sauce fromagère et pommes de terre. Taille sénior.',             popular: false },
  { id: 45, category: 'pizzas', name: 'Pizza Combine',      price: 9.75, desc: 'Base au choix, fromage, viande hachée, champignons et œuf. Taille sénior.',                     popular: false },
  { id: 46, category: 'pizzas', name: 'Pizza Orientale',    price: 9.75, desc: 'Base au choix, fromage, oignons, olives, merguez et œuf. Taille sénior.',                       popular: false },
  { id: 47, category: 'pizzas', name: 'Pizza Saisons',      price: 9.75, desc: 'Base au choix, fromage, jambon dinde, olives, poivrons et champignons. Taille sénior.',         popular: false },
  { id: 48, category: 'pizzas', name: 'Pizza Végétarien',   price: 9.75, desc: 'Base au choix, fromage, olives, poivrons, champignons et oignons. Taille sénior.',              popular: false },
  { id: 49, category: 'pizzas', name: 'Pizza Chèvre Miel',  price: 9.75, desc: 'Base au choix, fromage, chèvre et miel. Taille sénior.',                                        popular: false },
  { id: 50, category: 'pizzas', name: 'Pizza Chicken',      price: 9.75, desc: 'Base au choix, fromage, chicken et pommes de terre. Taille sénior.',                            popular: false },
  { id: 51, category: 'pizzas', name: 'Pizza Saumon',       price: 9.75, desc: 'Base au choix, fromage, saumon et pommes de terre. Taille sénior.',                             popular: false },
  { id: 52, category: 'pizzas', name: 'Pizza Thon',         price: 9.75, desc: 'Base au choix, fromage, thon et olives. Taille sénior.',                                        popular: false },
  { id: 53, category: 'pizzas', name: 'Pizza 3 Viandes',    price: 9.75, desc: 'Base et 3 viandes au choix et fromage. Taille sénior.',                                         popular: false },

  /* ── TACOS ── */
  { id: 54, category: 'tacos', name: 'Tacos L',  price: 9.10,  desc: '1 viande au choix.',  popular: false, badge: '👑 Classique' },
  { id: 55, category: 'tacos', name: 'Tacos XL', price: 10.40, desc: '2 viandes au choix.', popular: false, badge: '🧨 Lourd' },

  /* ── BURGERS ── */
  { id: 56, category: 'burgers', name: 'Double Big Burger',       price: 10.40, desc: '2 steaks 180 g, 2 fromages, salade et tomates.',                           popular: false, badge: '🧨 Lourd' },
  { id: 57, category: 'burgers', name: 'Big Burger',              price: 7.80,  desc: '1 steak 180 g, 2 fromages, salade et tomates.',                            popular: false, badge: '👑 Classique' },
  { id: 58, category: 'burgers', name: 'Double Big Burger Plus',  price: 13.00, desc: '2 steaks 180 g, œuf et 2 fromages.',                                       popular: false, badge: '🧨 Lourd' },
  { id: 59, category: 'burgers', name: 'Cheese Burger',           price: 3.90,  desc: '1 steak et fromage.',                                                      popular: true  },
  { id: 60, category: 'burgers', name: 'Double Cheeseburger',     price: 5.20,  desc: '2 steaks et 2 fromages.',                                                  popular: true  },
  { id: 61, category: 'burgers', name: 'Chicken Burger',          price: 5.20,  desc: 'Chicken pané et fromage.',                                                 popular: false },
  { id: 62, category: 'burgers', name: 'Zinger Burger',           price: 5.85,  desc: 'Poulet façon KFC et fromage.',                                             popular: false },
  { id: 63, category: 'burgers', name: 'Fish Burger',             price: 4.55,  desc: 'Poisson pané, salade, oignons et fromage.',                                popular: false },
  { id: 64, category: 'burgers', name: 'Burger Maison',           price: 7.15,  desc: 'Steak viande hachée 100 g, fromage, raclette, salade, tomates et oignons.',popular: false },
  { id: 65, category: 'burgers', name: 'Burger Végétarien',       price: 5.20,  desc: 'Steak de pommes de terre, œuf et fromage.',                                popular: false },

  /* ── SANDWICHES ── */
  { id: 66, category: 'sandwiches', name: 'Sandwich Chicken Curry',      price: 7.80, desc: 'Poulet mariné, sauce curry et fromage.',                                          popular: false },
  { id: 67, category: 'sandwiches', name: 'Sandwich Kebab',              price: 7.80, desc: 'Viande kebab, salade, tomates et oignons.',                                       popular: false, badge: '👑 Classique' },
  { id: 68, category: 'sandwiches', name: 'Sandwich Paprika',            price: 7.80, desc: 'Poulet mariné, paprika et crème fraîche.',                                        popular: false },
  { id: 69, category: 'sandwiches', name: 'Sandwich Mixte',              price: 7.80, desc: '2 viandes au choix et fromage.',                                                  popular: false },
  { id: 70, category: 'sandwiches', name: 'Sandwich Cordon Bleu',        price: 6.50, desc: 'Poulet mariné, sauce curry et fromage.',                                          popular: true  },
  { id: 71, category: 'sandwiches', name: 'Sandwich Double Croc',        price: 7.80, desc: '2 steaks 45 g, cordon bleu et fromage.',                                         popular: false },
  { id: 72, category: 'sandwiches', name: 'Sandwich Boursin',            price: 7.80, desc: 'Poulet mariné, sauce curry et fromage.',                                          popular: false },
  { id: 73, category: 'sandwiches', name: 'Sandwich Shempa',             price: 7.80, desc: 'Chicken, crème fraîche, fromage râpé et champignons.',                           popular: false },
  { id: 74, category: 'sandwiches', name: 'Sandwich Touareg',            price: 7.80, desc: 'Steak viande hachée, œuf, fromage, olives, oignons et tomates.',                popular: false },
  { id: 75, category: 'sandwiches', name: 'Sandwich Kefta',              price: 7.80, desc: '2 steaks, viande hachée et fromage.',                                            popular: false },
  { id: 76, category: 'sandwiches', name: 'Sandwich Brochette d\'Agneau',price: 7.80, desc: 'Brochette d\'agneau et fromage.',                                                popular: false },
  { id: 77, category: 'sandwiches', name: 'Sandwich Américain',          price: 9.10, desc: '2 steaks 45 g, œuf et fromage.',                                                 popular: true  },
  { id: 78, category: 'sandwiches', name: 'Sandwich Forma',              price: 9.10, desc: 'Viande au choix, crème fraîche, fromage râpé, lardons, œuf et frites.',         popular: false },
  { id: 79, category: 'sandwiches', name: 'Sandwich Zinger Rolo',        price: 9.10, desc: 'Pita poulet façon KFC, bacon de dinde, steak 45 g et fromage.',                popular: false },
  { id: 80, category: 'sandwiches', name: 'Sandwich Spécial',            price: 9.10, desc: 'Pita, viande marinée au choix, oignons frits, borcha et cordon bleu.',          popular: false },

  /* ── ASSIETTES ── */
  { id: 81, category: 'assiettes', name: 'Assiette Classique', price: 13.00, desc: '1 viande au choix.',  popular: false },
  { id: 82, category: 'assiettes', name: 'Assiette Mixte',     price: 14.30, desc: '4 viandes au choix.', popular: false },

  /* ── PIZZAS TURQUES ── */
  { id: 83, category: 'pizzas-turques', name: 'Pizza Turque', price: 5.85, desc: 'Pâte fine façon turque, garniture et assaisonnement traditionnels.', popular: false },

  /* ── PANINIS ── */
  { id: 84, category: 'paninis', name: 'Panini Thon',          price: 5.85, desc: 'Panini pressé, garni de thon.',                              popular: false },
  { id: 85, category: 'paninis', name: 'Panini Fromage',       price: 5.85, desc: 'Panini grillé, fromage fondu.',                              popular: false },
  { id: 86, category: 'paninis', name: 'Panini Saumon',        price: 5.85, desc: 'Pain panini pressé garni de saumon.',                        popular: false },
  { id: 87, category: 'paninis', name: 'Panini Bolognaise',    price: 5.85, desc: 'Panini garni de sauce bolognaise, pain pressé et chaud.',    popular: false },
  { id: 88, category: 'paninis', name: 'Panini 1 Viande',      price: 5.85, desc: '1 viande au choix.',                                         popular: false },

  /* ── CROQUES ── */
  { id: 89, category: 'croques', name: 'Croque Monsieur', price: 3.90, desc: 'Sandwich chaud au jambon et fromage.', popular: true  },

  /* ── BUCKETS ── */
  { id: 90, category: 'buckets', name: 'Bucket Frites',   price: 2.60, desc: 'Seau de frites, format à partager.',                popular: false },
  { id: 91, category: 'buckets', name: 'Bucket Kebab',    price: 9.10, desc: 'Viande kebab, format bucket.',                      popular: false },
  { id: 92, category: 'buckets', name: 'Bucket Chicken',  price: 9.10, desc: 'Morceaux de poulet servis en bucket, à partager.',  popular: false },

  /* ── DESSERTS ── */
  { id: 93, category: 'desserts', name: 'Tiramisu',       price: 3.90, desc: 'Classique italien au café, biscuits imbibés et crème mascarpone, saupoudré de cacao.', popular: false },
  { id: 94, category: 'desserts', name: 'Tarte au Daim',  price: 3.90, desc: '',                                                                                     popular: true  },

  /* ── BOISSONS ── */
  { id: 95, category: 'boissons', name: 'Pepsi',          price: 1.95, desc: '', popular: false },
  { id: 96, category: 'boissons', name: 'Lipton Ice Tea', price: 1.95, desc: '', popular: false },
  { id: 97, category: 'boissons', name: 'Coca-Cola',      price: 1.95, desc: '', popular: false },
];

/* ══════════════════════════════════════════════
   2. STATE
══════════════════════════════════════════════ */

let cart     = [];          // [{ product, qty }]
let activeCategory = 'all';
let searchQuery    = '';
let orderMode      = 'emporter'; // 'emporter' | 'livraison'

/* ══════════════════════════════════════════════
   3. HELPERS
══════════════════════════════════════════════ */

/** Format price to French locale: 10,40 € */
function formatPrice(price) {
  return price.toFixed(2).replace('.', ',') + ' €';
}

/** Get the emoji for a product based on its category */
function getEmoji(categoryId) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  return cat ? cat.emoji : '🍽️';
}

/** Get category display name */
function getCatName(categoryId) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  return cat ? cat.name : '';
}

/** Sanitize a string for safe HTML insertion */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ══════════════════════════════════════════════
   4. CART LOGIC
══════════════════════════════════════════════ */

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.product.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ product, qty: 1 });
  }
  updateCartUI();
  showToast(`${product.name} ajouté au panier ✓`);
  bumpBadge();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.product.id !== productId);
  updateCartUI();
  renderCartItems();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.product.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  updateCartUI();
  renderCartItems();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartUI() {
  const count = getCartCount();
  const total = getCartTotal();

  /* Badges */
  ['cartBadge', 'fabBadge'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = count;
  });

  /* FAB badge visibility */
  const fabBadge = document.getElementById('fabBadge');
  if (fabBadge) {
    fabBadge.classList.toggle('visible', count > 0);
  }

  /* Total */
  const totalEl = document.getElementById('cartTotalPrice');
  if (totalEl) totalEl.textContent = formatPrice(total);

  /* Footer visibility */
  const footer = document.getElementById('cartFooter');
  const empty  = document.getElementById('cartEmpty');
  const items  = document.getElementById('cartItems');
  if (footer && empty && items) {
    const hasItems = cart.length > 0;
    footer.style.display  = hasItems ? 'flex'  : 'none';
    footer.style.flexDirection = 'column';
    empty.style.display   = hasItems ? 'none'  : 'flex';
    items.style.display   = hasItems ? 'flex'  : 'none';
    if (hasItems) renderCartItems();
  }
}

function renderCartItems() {
  const el = document.getElementById('cartItems');
  if (!el) return;
  el.innerHTML = cart.map(item => `
    <li class="cart-item" data-id="${item.product.id}">
      <div class="cart-item-emoji">${getEmoji(item.product.category)}</div>
      <div class="cart-item-info">
        <div class="cart-item-name" title="${esc(item.product.name)}">${esc(item.product.name)}</div>
        <div class="cart-item-price">${formatPrice(item.product.price * item.qty)}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn remove" onclick="updateQty(${item.product.id}, -1)" aria-label="Retirer un">−</button>
        <span class="qty-value" aria-label="${item.qty} article${item.qty > 1 ? 's' : ''}">${item.qty}</span>
        <button class="qty-btn" onclick="updateQty(${item.product.id}, 1)" aria-label="Ajouter un">+</button>
      </div>
    </li>
  `).join('');
}

/* ══════════════════════════════════════════════
   5. WHATSAPP ORDER
══════════════════════════════════════════════ */

function buildOrderMessage() {
  const name    = (document.getElementById('customerName')?.value  || '').trim();
  const address = (document.getElementById('customerAddress')?.value || '').trim();
  const mode    = document.querySelector('input[name="orderMode"]:checked')?.value || orderMode;

  if (!name) {
    showToast('⚠️ Merci d\'indiquer votre prénom');
    document.getElementById('customerName')?.focus();
    return null;
  }

  if (mode === 'livraison' && !address) {
    showToast('⚠️ Merci d\'indiquer votre adresse de livraison');
    document.getElementById('customerAddress')?.focus();
    return null;
  }

  const lines = cart.map(item => `• ${item.product.name} x${item.qty} — ${formatPrice(item.product.price * item.qty)}`);
  const total = formatPrice(getCartTotal());
  const modeLabel = mode === 'livraison' ? 'Livraison 🛵' : 'À emporter 🛍️';

  const msgParts = [
    'Salut Le Touareg 👋',
    '',
    'Commande :',
    ...lines,
    '',
    `Nom : ${name}`,
    `Mode : ${modeLabel}`,
  ];

  if (mode === 'livraison' && address) {
    msgParts.push(`Adresse : ${address}`);
  }

  msgParts.push('', `Total : ${total}`, '', 'Merci.');

  return msgParts.join('\n');
}

function openWhatsApp() {
  if (cart.length === 0) {
    showToast('⚠️ Votre panier est vide');
    return;
  }
  const msg = buildOrderMessage();
  if (!msg) return;

  const encoded = encodeURIComponent(msg);
  const url     = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/* ══════════════════════════════════════════════
   6. RENDER MENU
══════════════════════════════════════════════ */

function renderCategories() {
  const track = document.getElementById('filtersTrack');
  if (!track) return;

  /* Only show categories that have products */
  const usedCats = [...new Set(PRODUCTS.map(p => p.category))];

  CATEGORIES
    .filter(c => usedCats.includes(c.id))
    .forEach(cat => {
      const btn = document.createElement('button');
      btn.className   = 'filter-btn';
      btn.dataset.category = cat.id;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', 'false');
      btn.textContent = `${cat.emoji} ${cat.name}`;
      track.appendChild(btn);
    });
}

function filterProducts() {
  let results = [...PRODUCTS];

  if (activeCategory !== 'all') {
    results = results.filter(p => p.category === activeCategory);
  }

  if (searchQuery.length > 0) {
    const q = searchQuery.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      getCatName(p.category).toLowerCase().includes(q)
    );
  }

  return results;
}

function getBadgeHtml(product) {
  if (product.badge === '🧨 Lourd')     return '<span class="product-pop-badge badge-lourd" aria-label="Lourd">🧨 Lourd</span>';
  if (product.badge === '👑 Classique') return '<span class="product-pop-badge badge-classique" aria-label="Classique">👑 Classique</span>';
  if (product.popular)                   return '<span class="product-pop-badge badge-pop" aria-label="Populaire">🔥 Populaire</span>';
  return '';
}

function buildProductCard(product) {
  return `
    <article class="product-card" aria-label="${esc(product.name)}">
      <div class="product-card-visual">
        <span aria-hidden="true">${getEmoji(product.category)}</span>
        ${getBadgeHtml(product)}
      </div>
      <div class="product-card-body">
        <h3 class="product-card-name">${esc(product.name)}</h3>
        ${product.desc ? `<p class="product-card-desc">${esc(product.desc)}</p>` : '<div class="product-card-desc"></div>'}
        <div class="product-card-footer">
          <span class="product-card-price" aria-label="Prix : ${formatPrice(product.price)}">${formatPrice(product.price)}</span>
          <button
            class="product-add-btn"
            onclick="addToCart(${product.id})"
            aria-label="Ajouter ${esc(product.name)} au panier"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Ajouter
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const grid  = document.getElementById('productsGrid');
  const empty = document.getElementById('menuEmpty');
  if (!grid || !empty) return;

  const results = filterProducts();

  if (results.length === 0) {
    grid.innerHTML = '';
    empty.hidden   = false;
    const termEl = document.getElementById('emptySearchTerm');
    if (termEl) termEl.textContent = searchQuery;
    return;
  }

  empty.hidden   = true;
  grid.innerHTML = results.map((p, i) => {
    /* Staggered animation delay */
    const delay = Math.min(i * 40, 400);
    return `<div style="animation-delay:${delay}ms">${buildProductCard(p)}</div>`;
  }).join('');
}

/* ══════════════════════════════════════════════
   7. POPULAIRES SECTION
══════════════════════════════════════════════ */

function renderPopulaires() {
  const grid = document.getElementById('populairesGrid');
  if (!grid) return;

  const popular = PRODUCTS.filter(p => p.popular);

  grid.innerHTML = popular.map(product => `
    <div class="pop-card" onclick="addToCart(${product.id})" role="button" tabindex="0"
         aria-label="Ajouter ${esc(product.name)} au panier — ${formatPrice(product.price)}"
         onkeydown="if(event.key==='Enter'||event.key===' ')addToCart(${product.id})">
      <div class="pop-card-visual">
        <span aria-hidden="true">${getEmoji(product.category)}</span>
        <span class="pop-badge" aria-hidden="true">★ Populaire</span>
      </div>
      <div class="pop-card-body">
        <div class="pop-card-name" title="${esc(product.name)}">${esc(product.name)}</div>
        <div class="pop-card-cat">${esc(getCatName(product.category))}</div>
        <div class="pop-card-footer">
          <span class="pop-card-price">${formatPrice(product.price)}</span>
          <button class="pop-card-add" aria-label="Ajouter" tabindex="-1">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════════
   8. CART PANEL
══════════════════════════════════════════════ */

function openCart() {
  const panel   = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  if (!panel || !overlay) return;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  overlay.classList.add('visible');
  document.body.classList.add('cart-open');
  renderCartItems();
  /* Focus first focusable element */
  setTimeout(() => panel.querySelector('button')?.focus(), 300);
}

function closeCart() {
  const panel   = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  if (!panel || !overlay) return;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('visible');
  document.body.classList.remove('cart-open');
}

/* ══════════════════════════════════════════════
   9. MOBILE MENU
══════════════════════════════════════════════ */

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });

  /* Close on nav link click */
  mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    });
  });
}

/* ══════════════════════════════════════════════
   10. STICKY HEADER
══════════════════════════════════════════════ */

function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
}

/* ══════════════════════════════════════════════
   11. CATEGORY FILTER
══════════════════════════════════════════════ */

function initFilters() {
  const track = document.getElementById('filtersTrack');
  if (!track) return;

  track.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    track.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    activeCategory = btn.dataset.category;
    renderProducts();

    /* Scroll filter into view on mobile */
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });
}

/* ══════════════════════════════════════════════
   12. SEARCH
══════════════════════════════════════════════ */

function initSearch() {
  const input  = document.getElementById('searchInput');
  const clear  = document.getElementById('searchClear');
  if (!input) return;

  input.addEventListener('input', () => {
    searchQuery = input.value.trim();
    clear.hidden = searchQuery.length === 0;
    renderProducts();
  });

  clear?.addEventListener('click', () => {
    input.value = '';
    searchQuery = '';
    clear.hidden = true;
    input.focus();
    renderProducts();
  });

  /* Keyboard shortcut: "/" focuses search */
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
}

/* ══════════════════════════════════════════════
   13. SCROLL ANIMATIONS
══════════════════════════════════════════════ */

function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    /* Fallback: show everything */
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════
   14. TOAST NOTIFICATION
══════════════════════════════════════════════ */

let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ══════════════════════════════════════════════
   15. BADGE BUMP ANIMATION
══════════════════════════════════════════════ */

function bumpBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  badge.classList.remove('bump');
  void badge.offsetWidth; /* reflow to restart */
  badge.classList.add('bump');
}

/* ══════════════════════════════════════════════
   16. FOOTER LINKS → CATEGORY FILTER
══════════════════════════════════════════════ */

function initFooterCatLinks() {
  document.querySelectorAll('[data-cat-link]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const catId = link.dataset.catLink;
      activeCategory = catId;
      searchQuery = '';

      /* Update filter buttons */
      const track = document.getElementById('filtersTrack');
      if (track) {
        track.querySelectorAll('.filter-btn').forEach(btn => {
          const active = btn.dataset.category === catId;
          btn.classList.toggle('active', active);
          btn.setAttribute('aria-selected', String(active));
        });
      }

      /* Re-render */
      renderProducts();

      /* Scroll to menu section */
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ══════════════════════════════════════════════
   17. KEYBOARD / ACCESSIBILITY
══════════════════════════════════════════════ */

function initAccessibility() {
  /* Close cart on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const cartPanel = document.getElementById('cartPanel');
      if (cartPanel?.classList.contains('open')) {
        closeCart();
      }
    }
  });

  /* Trap focus in cart panel */
  const cartPanel = document.getElementById('cartPanel');
  if (cartPanel) {
    cartPanel.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const focusable = cartPanel.querySelectorAll(
        'button, input, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }
}

/* ══════════════════════════════════════════════
   18. MISC
══════════════════════════════════════════════ */

function initCurrentYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ══════════════════════════════════════════════
   19. EVENT LISTENERS
══════════════════════════════════════════════ */

function initEventListeners() {
  /* Cart open */
  document.getElementById('cartToggle')?.addEventListener('click', openCart);
  document.getElementById('fabCart')?.addEventListener('click', openCart);

  /* Cart close */
  document.getElementById('cartClose')?.addEventListener('click', closeCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
  document.getElementById('cartEmpty')
    ?.querySelector('#goToMenuBtn')
    ?.addEventListener('click', closeCart);

  /* WhatsApp order */
  document.getElementById('whatsappOrderBtn')?.addEventListener('click', openWhatsApp);

  /* Order mode toggle */
  document.querySelectorAll('input[name="orderMode"]').forEach(radio => {
    radio.addEventListener('change', () => {
      orderMode = radio.value;
      const addrWrap = document.getElementById('addressWrap');
      if (addrWrap) {
        addrWrap.style.display = orderMode === 'livraison' ? 'block' : 'none';
      }
    });
  });
}

/* ══════════════════════════════════════════════
   20. INIT
══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initCurrentYear();
  renderCategories();
  renderPopulaires();
  renderProducts();
  initHeader();
  initMobileMenu();
  initFilters();
  initSearch();
  initScrollAnimations();
  initFooterCatLinks();
  initEventListeners();
  initAccessibility();
  updateCartUI();
});
