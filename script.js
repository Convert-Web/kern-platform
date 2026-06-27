'use strict';
/* ═══════════════════════════════════════════════════
   LE TOUAREG — script.js
   Restaurant Pro · Montereau-Fault-Yonne (77130)
   Convert Web Agency
═══════════════════════════════════════════════════ */

/* ── CONFIG ── */
const WA_NUMBER    = '33164248754';
const OPENING_HOUR = 11;
const CLOSING_HOUR = 23;

/* ═══════════════════════════════════════════════════
   AVIS CLIENTS (Google Reviews simulation)
═══════════════════════════════════════════════════ */
const REVIEWS = [
  { name:'Mehdi B.',   initial:'M', color:'#BF1120', stars:5, date:'Il y a 1 semaine',
    text:'Tacos XL vraiment excellent. Double viande bien généreuse, sauce fromagère maison et livraison nickel. Je reviens chaque semaine depuis 2 ans !' },
  { name:'Sarah K.',   initial:'S', color:'#7C3AED', stars:5, date:'Il y a 2 semaines',
    text:'Le meilleur fast food de Montereau sans contestation. La pizza Touareg est délicieuse et les portions sont très généreuses. Personnel sympa.' },
  { name:'Thomas D.',  initial:'T', color:'#0891B2', stars:4, date:'Il y a 3 semaines',
    text:'Bon rapport qualité/prix. Le menu double cheeseburger est bien garni et le service est rapide même le vendredi soir. Je recommande.' },
  { name:'Karim A.',   initial:'K', color:'#D97706', stars:5, date:'Il y a 1 mois',
    text:'Commandé via WhatsApp, livré en 25 minutes top chrono. Tout était chaud, commande correcte. Le tacos XL et les frites étaient parfaits. Bravo !' },
  { name:'Yasmine H.', initial:'Y', color:'#DB2777', stars:4, date:'Il y a 1 mois',
    text:'La pizza 3 Viandes est vraiment bien garnie. Pâte fine et croustillante. On a commandé pour 4 personnes, tout le monde était satisfait. À refaire !' },
  { name:'Lucas M.',   initial:'L', color:'#059669', stars:5, date:'Il y a 2 mois',
    text:'Accueil chaleureux et plats copieux. Le bucket chicken pour partager entre collègues c\'est parfait. On y retourne régulièrement. Super endroit.' },
  { name:'Fatima O.',  initial:'F', color:'#9333EA', stars:4, date:'Il y a 2 mois',
    text:'Bon fast food de quartier. Le sandwich kebab est généreux et bien assaisonné. Livraison dans des délais corrects. Prix cohérents pour la qualité.' },
  { name:'Baptiste R.',initial:'B', color:'#E85510', stars:5, date:'Il y a 3 mois',
    text:'Le sandwich américain avec les 2 steaks et l\'oeuf, c\'est une valeur sûre. Pain bien toasté, frites dorées. Un classique qu\'on ne se lasse pas de commander.' },
];

/* ═══════════════════════════════════════════════════
   CONFIGURATEUR — Règles et options
═══════════════════════════════════════════════════ */
const VIANDES = ['Poulet grillé','Viande hachée','Merguez','Chorizo','Mixte (Poulet + Hachée)'];
const SAUCES  = ['Fromagère maison','Sauce blanche','Harissa','Ketchup','Algérienne','Samouraï','Cocktail'];
const SUPPLEMENTS = [
  { name:'Emmental',   price:0.80 },
  { name:'Oeuf',       price:0.80 },
  { name:'Mozzarella', price:0.80 },
  { name:'Bacon',      price:1.20 },
  { name:'Avocat',     price:1.00 },
];
const CONFIG_RULES = {
  'tacos-s':  { viandes:1, label:'1 viande au choix' },
  'tacos-m':  { viandes:1, label:'1 viande au choix' },
  'tacos-l':  { viandes:1, label:'1 viande au choix' },
  'tacos-xl': { viandes:2, label:'2 viandes au choix' },
  'mixte':    { viandes:4, label:'4 viandes au choix' },
  'sandwich': { viandes:1, label:'1 viande au choix' },
};

/* ═══════════════════════════════════════════════════
   CATÉGORIES
═══════════════════════════════════════════════════ */
const CATEGORIES = [
  { id:'menus-tacos',       label:'Menus Tacos',        emoji:'🌮' },
  { id:'menus-sandwiches',  label:'Menus Sandwiches',   emoji:'🥙' },
  { id:'menus-burgers',     label:'Menus Burgers',      emoji:'🍔' },
  { id:'menus-chicken',     label:'Menus Chicken',      emoji:'🍗' },
  { id:'tacos',             label:'Tacos',              emoji:'🌮' },
  { id:'sandwiches',        label:'Sandwiches',         emoji:'🥙' },
  { id:'burgers',           label:'Burgers',            emoji:'🍔' },
  { id:'chicken',           label:'Chicken',            emoji:'🍗' },
  { id:'pizzas',            label:'Pizzas',             emoji:'🍕' },
  { id:'assiettes',         label:'Assiettes',          emoji:'🍽️' },
  { id:'paninis',           label:'Paninis',            emoji:'🥪' },
  { id:'tacos-box',         label:'Tacos Box',          emoji:'📦' },
  { id:'sides',             label:'Frites & Sides',     emoji:'🍟' },
  { id:'supplements',       label:'Suppléments',        emoji:'➕' },
  { id:'desserts',          label:'Desserts',           emoji:'🍰' },
  { id:'boissons',          label:'Boissons',           emoji:'🥤' },
  { id:'boissons-chaudes',  label:'Boissons Chaudes',   emoji:'☕' },
  { id:'menus-enfants',     label:'Menus Enfants',      emoji:'🧒' },
  { id:'formules',          label:'Formules',           emoji:'📋' },
];

/* ═══════════════════════════════════════════════════
   PRODUITS — Catalogue complet (~97 références)
═══════════════════════════════════════════════════ */
const PRODUCTS = [

  /* ── MENUS TACOS ── */
  { id:1,  name:'Menu Tacos S',     desc:'Tacos S + Frites + Boisson au choix',                       price:11.90, cat:'menus-tacos',      emoji:'🌮', config:'tacos-s' },
  { id:2,  name:'Menu Tacos M',     desc:'Tacos M + Frites + Boisson au choix',                       price:13.00, cat:'menus-tacos',      emoji:'🌮', config:'tacos-m' },
  { id:3,  name:'Menu Tacos L',     desc:'Tacos L + Frites + Boisson au choix',                       price:13.50, cat:'menus-tacos',      emoji:'🌮', config:'tacos-l', popular:true },
  { id:4,  name:'Menu Tacos XL',    desc:'Tacos XL (2 viandes) + Frites + Boisson au choix',          price:14.50, cat:'menus-tacos',      emoji:'🌮', config:'tacos-xl', popular:true },
  { id:5,  name:'Menu Assiette Mixte', desc:'Assiette 4 viandes + Frites + Boisson au choix',         price:18.50, cat:'menus-tacos',      emoji:'🍽️', config:'mixte' },

  /* ── MENUS SANDWICHES ── */
  { id:6,  name:'Menu Sandwich Kebab',     desc:'Sandwich Kebab + Frites + Boisson au choix',         price:11.50, cat:'menus-sandwiches', emoji:'🥙', config:'sandwich', popular:true },
  { id:7,  name:'Menu Sandwich Américain', desc:'2 steaks + Oeuf + Frites + Boisson',                 price:12.90, cat:'menus-sandwiches', emoji:'🥙' },
  { id:8,  name:'Menu Sandwich Milanais',  desc:'Escalope milanaise + Frites + Boisson',              price:12.50, cat:'menus-sandwiches', emoji:'🥙' },
  { id:9,  name:'Menu Sandwich Poulet',    desc:'Poulet grillé + Frites + Boisson',                   price:11.50, cat:'menus-sandwiches', emoji:'🥙', config:'sandwich' },
  { id:10, name:'Menu Sandwich Merguez',   desc:'Merguez grillées + Frites + Boisson',                price:11.50, cat:'menus-sandwiches', emoji:'🥙', config:'sandwich' },

  /* ── MENUS BURGERS ── */
  { id:11, name:'Menu Cheeseburger',        desc:'Cheeseburger + Frites + Boisson au choix',          price:7.40,  cat:'menus-burgers',    emoji:'🍔' },
  { id:12, name:'Menu Double Cheeseburger', desc:'Double Cheeseburger + Frites + Boisson',            price:8.45,  cat:'menus-burgers',    emoji:'🍔', popular:true },
  { id:13, name:'Menu Triple Cheeseburger', desc:'Triple Cheeseburger + Frites + Boisson',            price:10.40, cat:'menus-burgers',    emoji:'🍔' },
  { id:14, name:'Menu Burger Poulet',       desc:'Burger Poulet Croustillant + Frites + Boisson',     price:9.90,  cat:'menus-burgers',    emoji:'🍔' },
  { id:15, name:'Menu Burger Texan',        desc:'Burger BBQ, jalapeños, cheddar + Frites + Boisson', price:11.90, cat:'menus-burgers',    emoji:'🍔' },

  /* ── MENUS CHICKEN ── */
  { id:16, name:'Menu Bucket 4 pièces',    desc:'4 pièces de poulet + Frites + Boisson',              price:12.50, cat:'menus-chicken',    emoji:'🍗', popular:true },
  { id:17, name:'Menu Bucket 6 pièces',    desc:'6 pièces de poulet + Frites + Boisson',              price:14.90, cat:'menus-chicken',    emoji:'🍗' },
  { id:18, name:'Menu Chicken Strips 4pc', desc:'4 nuggets croustillants + Frites + Boisson',         price:11.90, cat:'menus-chicken',    emoji:'🍗' },

  /* ── TACOS SEULS ── */
  { id:19, name:'Tacos S',          desc:'1 viande au choix, sauce maison, galette dorée',            price:7.90,  cat:'tacos',            emoji:'🌮', config:'tacos-s' },
  { id:20, name:'Tacos M',          desc:'1 viande au choix, sauce maison, format maxi',              price:8.50,  cat:'tacos',            emoji:'🌮', config:'tacos-m' },
  { id:21, name:'Tacos L',          desc:'1 viande au choix, sauce maison, grand format',             price:9.10,  cat:'tacos',            emoji:'🌮', config:'tacos-l', popular:true },
  { id:22, name:'Tacos XL',         desc:'2 viandes au choix, sauce fromagère maison',                price:10.40, cat:'tacos',            emoji:'🌮', config:'tacos-xl', popular:true },
  { id:23, name:'Assiette Mixte',   desc:'4 viandes au choix, sauce, frites maison',                  price:15.00, cat:'tacos',            emoji:'🍽️', config:'mixte' },

  /* ── SANDWICHES SEULS ── */
  { id:24, name:'Sandwich Kebab',    desc:'Viande kebab, salade, tomates, oignons, sauce',            price:7.80,  cat:'sandwiches',       emoji:'🥙', config:'sandwich', popular:true },
  { id:25, name:'Sandwich Américain',desc:'2 steaks hachés, oeuf, sauce maison',                      price:9.50,  cat:'sandwiches',       emoji:'🥙' },
  { id:26, name:'Sandwich Milanais', desc:'Escalope panée milanaise, salade, tomates',                price:9.00,  cat:'sandwiches',       emoji:'🥙' },
  { id:27, name:'Sandwich Poulet',   desc:'Poulet grillé mariné, crudités, sauce au choix',           price:7.80,  cat:'sandwiches',       emoji:'🥙', config:'sandwich' },
  { id:28, name:'Sandwich Merguez',  desc:'Merguez grillées, poivrons, sauce harissa',                price:7.80,  cat:'sandwiches',       emoji:'🥙', config:'sandwich' },
  { id:29, name:'Sandwich Mixte',    desc:'Poulet + kebab, crudités fraîches, sauce maison',          price:8.50,  cat:'sandwiches',       emoji:'🥙', config:'sandwich' },
  { id:30, name:'Wrap Poulet',       desc:'Tortilla, poulet croustillant, salade, sauce',             price:7.80,  cat:'sandwiches',       emoji:'🌯' },
  { id:31, name:'Sandwich Club',     desc:'Triple déguisé : bacon, oeuf, fromage fondu',              price:8.50,  cat:'sandwiches',       emoji:'🥙' },

  /* ── BURGERS SEULS ── */
  { id:32, name:'Cheeseburger',        desc:'Steak haché, cheddar fondu, sauce burger maison',        price:3.90,  cat:'burgers',          emoji:'🍔' },
  { id:33, name:'Double Cheeseburger', desc:'2 steaks hachés, double cheddar, sauce maison',          price:5.50,  cat:'burgers',          emoji:'🍔', popular:true },
  { id:34, name:'Triple Cheeseburger', desc:'3 steaks hachés, triple fromage, sauce secrète',         price:6.90,  cat:'burgers',          emoji:'🍔' },
  { id:35, name:'Burger Poulet',       desc:'Escalope poulet croustillante, laitue, sauce',           price:4.50,  cat:'burgers',          emoji:'🍔' },
  { id:36, name:'Burger Texan',        desc:'Steak 180g, BBQ fumé, jalapeños, cheddar maison',        price:7.90,  cat:'burgers',          emoji:'🍔' },
  { id:37, name:'Maxi Burger',         desc:'Steak 200g, double fromage, bacon, oignons caramélisés', price:8.50,  cat:'burgers',          emoji:'🍔' },

  /* ── CHICKEN SEUL ── */
  { id:38, name:'Bucket Chicken 4 pièces',    desc:'4 pièces de poulet mariné et croustillant',       price:8.50,  cat:'chicken',          emoji:'🍗', popular:true },
  { id:39, name:'Bucket Chicken 6 pièces',    desc:'6 pièces de poulet mariné et croustillant',       price:11.00, cat:'chicken',          emoji:'🍗' },
  { id:40, name:'Bucket Chicken 8 pièces',    desc:'8 pièces de poulet mariné et croustillant',       price:13.50, cat:'chicken',          emoji:'🍗' },
  { id:41, name:'Chicken Strips 4 pièces',    desc:'4 nuggets de poulet panés, sauce dip',            price:7.50,  cat:'chicken',          emoji:'🍗' },
  { id:42, name:'Chicken Strips 6 pièces',    desc:'6 nuggets de poulet panés, sauce dip',            price:9.50,  cat:'chicken',          emoji:'🍗' },
  { id:43, name:'Chicken Wings 6 pièces',     desc:'6 ailes de poulet marinées, sauce BBQ ou harissa',price:8.00,  cat:'chicken',          emoji:'🍗' },

  /* ── PIZZAS ── */
  { id:44, name:'Margherita',     desc:'Tomate, mozzarella, origan — la classique',                    price:9.75,  cat:'pizzas',           emoji:'🍕' },
  { id:45, name:'Orientale',      desc:'Kebab, poivrons, oignons, mozzarella',                         price:11.50, cat:'pizzas',           emoji:'🍕' },
  { id:46, name:'Touareg',        desc:'Kebab, merguez, oeuf, fromage — notre signature',              price:12.50, cat:'pizzas',           emoji:'🍕', popular:true },
  { id:47, name:'3 Viandes',      desc:'Kebab, merguez, poulet, mozzarella fondue',                    price:13.50, cat:'pizzas',           emoji:'🍕', popular:true },
  { id:48, name:'Reine',          desc:'Jambon de Paris, champignons, mozzarella',                     price:11.00, cat:'pizzas',           emoji:'🍕' },
  { id:49, name:'Régina',         desc:'Jambon, champignons, poivrons, tomate',                        price:11.00, cat:'pizzas',           emoji:'🍕' },
  { id:50, name:'4 Fromages',     desc:'Mozzarella, emmental, chèvre, gorgonzola',                    price:12.00, cat:'pizzas',           emoji:'🍕' },
  { id:51, name:'Campagnarde',    desc:'Lardons, oignons, crème fraîche, emmental',                   price:12.50, cat:'pizzas',           emoji:'🍕' },
  { id:52, name:'Calzone',        desc:'Pizza pliée : kebab, fromage, champignons',                   price:12.00, cat:'pizzas',           emoji:'🍕' },

  /* ── ASSIETTES ── */
  { id:53, name:'Assiette Kebab',        desc:'Viande kebab, salade, tomates, oignons, sauce, frites', price:12.50, cat:'assiettes',        emoji:'🍽️' },
  { id:54, name:'Assiette Mixte',        desc:'4 viandes au choix, crudités, sauce, frites maison',    price:15.00, cat:'assiettes',        emoji:'🍽️', config:'mixte', popular:true },
  { id:55, name:'Assiette Merguez',      desc:'Merguez grillées, salade, oignons, sauce, frites',      price:12.50, cat:'assiettes',        emoji:'🍽️' },
  { id:56, name:'Assiette Poulet',       desc:'Poulet grillé mariné, crudités, sauce, frites',         price:12.00, cat:'assiettes',        emoji:'🍽️' },
  { id:57, name:'Assiette Falafel',      desc:'Falafels maison, houmous, salade, pain pita',           price:11.50, cat:'assiettes',        emoji:'🍽️' },

  /* ── PANINIS ── */
  { id:58, name:'Panini Kebab',          desc:'Pain pressé, kebab, fromage fondu, sauce',              price:6.50,  cat:'paninis',          emoji:'🥪' },
  { id:59, name:'Panini Américain',      desc:'Pain pressé, 2 steaks, oeuf, cheddar',                 price:7.50,  cat:'paninis',          emoji:'🥪' },
  { id:60, name:'Panini Poulet',         desc:'Pain pressé, poulet grillé, mozzarella',               price:6.50,  cat:'paninis',          emoji:'🥪' },
  { id:61, name:'Panini Milanais',       desc:'Pain pressé, escalope panée, tomates, fromage',        price:7.00,  cat:'paninis',          emoji:'🥪' },
  { id:62, name:'Panini Merguez',        desc:'Pain pressé, merguez, poivrons, harissa',              price:6.50,  cat:'paninis',          emoji:'🥪' },

  /* ── TACOS BOX ── */
  { id:63, name:'Box 2 Tacos S',    desc:'2 Tacos S + Frites partagées + 2 Boissons',                 price:14.90, cat:'tacos-box',        emoji:'📦', config:'tacos-s' },
  { id:64, name:'Box 2 Tacos XL',   desc:'2 Tacos XL (2 viandes chacun) + Frites + 2 Boissons',      price:22.90, cat:'tacos-box',        emoji:'📦', config:'tacos-xl' },
  { id:65, name:'Family Box',       desc:'4 Tacos L + Frites XXL + 4 Boissons',                       price:36.00, cat:'tacos-box',        emoji:'📦', config:'tacos-l' },

  /* ── FRITES & SIDES ── */
  { id:66, name:'Frites simples',    desc:'Frites maison, légèrement salées',                          price:3.50,  cat:'sides',            emoji:'🍟' },
  { id:67, name:'Frites Fromage',    desc:'Frites nappées de sauce fromagère maison',                  price:4.50,  cat:'sides',            emoji:'🍟', popular:true },
  { id:68, name:'Frites Kebab',      desc:'Frites, viande kebab, sauce blanche',                      price:5.50,  cat:'sides',            emoji:'🍟' },
  { id:69, name:'Frites Merguez',    desc:'Frites, merguez, harissa',                                  price:5.50,  cat:'sides',            emoji:'🍟' },
  { id:70, name:'Frites Mixte',      desc:'Frites, kebab + merguez, sauce maison',                    price:5.50,  cat:'sides',            emoji:'🍟' },
  { id:71, name:'Salade verte',      desc:'Salade fraîche, tomates, concombres, vinaigrette',          price:3.50,  cat:'sides',            emoji:'🥗' },

  /* ── SUPPLÉMENTS ── */
  { id:72, name:'Supplément Emmental',   desc:'Emmental fondu supplémentaire',                         price:0.80,  cat:'supplements',      emoji:'🧀' },
  { id:73, name:'Supplément Oeuf',       desc:'Oeuf au plat supplémentaire',                           price:0.80,  cat:'supplements',      emoji:'🍳' },
  { id:74, name:'Supplément Mozzarella', desc:'Mozzarella fondante supplémentaire',                    price:0.80,  cat:'supplements',      emoji:'🧀' },
  { id:75, name:'Supplément Bacon',      desc:'Tranches de bacon croustillant',                        price:1.20,  cat:'supplements',      emoji:'🥓' },
  { id:76, name:'Supplément Avocat',     desc:'Avocat frais en supplément',                            price:1.00,  cat:'supplements',      emoji:'🥑' },
  { id:77, name:'Sauce seule',           desc:'Sauce au choix (fromagère, blanche, harissa…)',         price:0.50,  cat:'supplements',      emoji:'🫙' },

  /* ── DESSERTS ── */
  { id:78, name:'Tiramisu maison',   desc:'Tiramisu traditionnel, mascarpone, cacao',                  price:3.50,  cat:'desserts',         emoji:'🍰' },
  { id:79, name:'Coulant chocolat',  desc:'Coulant moelleux au coeur fondant chocolat',                price:3.50,  cat:'desserts',         emoji:'🍫' },
  { id:80, name:'Crème brûlée',      desc:'Crème brûlée à la vanille, caramel croustillant',          price:3.00,  cat:'desserts',         emoji:'🍮' },
  { id:81, name:'Cheese cake',       desc:'Cheese cake new-yorkais, coulis de fruits rouges',          price:3.50,  cat:'desserts',         emoji:'🍰' },
  { id:82, name:'Cookies x2',        desc:'2 cookies moelleux chocolat chips maison',                  price:2.50,  cat:'desserts',         emoji:'🍪' },
  { id:83, name:'Milkshake',         desc:'Chocolat, fraise ou vanille — servi bien frais',            price:4.50,  cat:'desserts',         emoji:'🥛' },

  /* ── BOISSONS ── */
  { id:84, name:'Coca-Cola 33cl',        desc:'Boisson rafraîchissante classique',                     price:2.50,  cat:'boissons',         emoji:'🥤' },
  { id:85, name:'Coca-Cola Zero 33cl',   desc:'Sans sucre, le même goût',                              price:2.50,  cat:'boissons',         emoji:'🥤' },
  { id:86, name:'Orangina 33cl',         desc:'Agrumes, la pétillante',                                price:2.50,  cat:'boissons',         emoji:'🍊' },
  { id:87, name:'Sprite 33cl',           desc:'Citron & citron vert',                                  price:2.50,  cat:'boissons',         emoji:'🥤' },
  { id:88, name:'Lipton Ice Tea 33cl',   desc:'Thé glacé à la pêche',                                  price:2.50,  cat:'boissons',         emoji:'🍑' },
  { id:89, name:'Oasis 33cl',            desc:'Fruits tropicaux, rafraîchissant',                      price:2.50,  cat:'boissons',         emoji:'🥤' },
  { id:90, name:'Eau minérale 50cl',     desc:'Plate ou gazeuse',                                      price:1.50,  cat:'boissons',         emoji:'💧' },
  { id:91, name:'Jus d\'orange frais',   desc:'Pressé à la commande, 100% naturel',                   price:3.00,  cat:'boissons',         emoji:'🍊' },

  /* ── BOISSONS CHAUDES ── */
  { id:92, name:'Café',              desc:'Expresso serré maison',                                     price:1.50,  cat:'boissons-chaudes', emoji:'☕' },
  { id:93, name:'Café au lait',      desc:'Expresso allongé au lait chaud',                            price:2.00,  cat:'boissons-chaudes', emoji:'☕' },
  { id:94, name:'Thé à la menthe',   desc:'Thé vert à la menthe fraîche, traditionnel',                price:2.00,  cat:'boissons-chaudes', emoji:'🍵' },
  { id:95, name:'Cappuccino',        desc:'Expresso, mousse de lait, cacao',                           price:2.50,  cat:'boissons-chaudes', emoji:'☕' },

  /* ── MENUS ENFANTS ── */
  { id:96, name:'Menu Enfant Burger',   desc:'Petit burger + Petites frites + Boisson (< 12 ans)',     price:7.50,  cat:'menus-enfants',    emoji:'🧒' },
  { id:97, name:'Menu Enfant Chicken',  desc:'2 pièces poulet + Petites frites + Boisson',             price:7.50,  cat:'menus-enfants',    emoji:'🧒' },

  /* ── FORMULES ── */
  { id:98, name:'Formule Midi',     desc:'Sandwich/Burger + Frites + Boisson (Lun–Ven)',               price:9.90,  cat:'formules',         emoji:'🕛', config:'sandwich' },
  { id:99, name:'Formule Duo',      desc:'2 Menus Tacos L + 2 Frites + 2 Boissons',                   price:22.00, cat:'formules',         emoji:'👫', config:'tacos-l' },
];

/* ═══════════════════════════════════════════════════
   ÉTAT DU PANIER
═══════════════════════════════════════════════════ */
let cart = {}; // clé → { product, qty, config, name, price }

/* ═══════════════════════════════════════════════════
   UTILITAIRES
═══════════════════════════════════════════════════ */
const $ = id => document.getElementById(id);
const $q = sel => document.querySelector(sel);
const $qa = sel => document.querySelectorAll(sel);

function formatPrice(n) {
  return n.toFixed(2).replace('.', ',') + ' €';
}

function cartKey(productId, config) {
  if (!config) return `p${productId}`;
  const v = (config.viandes || []).join('+');
  const s = config.sauce || '';
  const sup = (config.supplements || []).join('+');
  return `p${productId}-${v}-${s}-${sup}`;
}

function cartItemLabel(product, config) {
  if (!config) return product.name;
  const parts = [];
  if (config.viandes?.length) parts.push(config.viandes.join(', '));
  if (config.sauce) parts.push(config.sauce);
  if (config.supplements?.length) parts.push(config.supplements.join(', '));
  return parts.length ? `${product.name} (${parts.join(' · ')})` : product.name;
}

function showToast(msg, duration = 2600) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), duration);
}

/* ═══════════════════════════════════════════════════
   PANIER — Logique
═══════════════════════════════════════════════════ */
function addToCart(product, config = null) {
  const key = cartKey(product.id, config);
  const itemPrice = product.price + ((config?.supplements || []).reduce((s, name) => {
    const sup = SUPPLEMENTS.find(x => x.name === name);
    return s + (sup ? sup.price : 0);
  }, 0));
  if (cart[key]) {
    cart[key].qty++;
  } else {
    cart[key] = {
      product,
      config: config ? { ...config } : null,
      qty: 1,
      unitPrice: itemPrice,
      name: cartItemLabel(product, config),
    };
  }
  renderCart();
  updateBadges();
  showToast(`✅ ${product.name} ajouté au panier`);
  bumpBadge();
}

function removeFromCart(key) {
  delete cart[key];
  renderCart();
  updateBadges();
}

function changeQty(key, delta) {
  if (!cart[key]) return;
  cart[key].qty += delta;
  if (cart[key].qty <= 0) delete cart[key];
  renderCart();
  updateBadges();
}

function getCartTotal() {
  return Object.values(cart).reduce((s, item) => s + item.unitPrice * item.qty, 0);
}

function getCartCount() {
  return Object.values(cart).reduce((s, item) => s + item.qty, 0);
}

function updateBadges() {
  const count = getCartCount();
  const badge = $('cartBadge');
  const fab = $('fabBadge');
  if (badge) badge.textContent = count;
  if (fab) {
    fab.textContent = count;
    fab.classList.toggle('visible', count > 0);
  }
}

function bumpBadge() {
  const badge = $('cartBadge');
  const fab = $('fabBadge');
  [badge, fab].forEach(el => {
    if (!el) return;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
    el.addEventListener('animationend', () => el.classList.remove('bump'), { once: true });
  });
}

/* ═══════════════════════════════════════════════════
   RENDU DU PANIER
═══════════════════════════════════════════════════ */
function renderCart() {
  const empty  = $('cartEmpty');
  const items  = $('cartItems');
  const footer = $('cartFooter');
  const total  = $('cartTotalPrice');
  const keys   = Object.keys(cart);

  if (!empty || !items || !footer) return;

  const hasItems = keys.length > 0;
  empty.style.display  = hasItems ? 'none' : 'flex';
  items.style.display  = hasItems ? 'flex'  : 'none';
  footer.style.display = hasItems ? 'flex'  : 'none';

  if (total) total.textContent = formatPrice(getCartTotal());

  if (!hasItems) return;

  items.innerHTML = keys.map(key => {
    const { product, name, qty, unitPrice } = cart[key];
    return `
      <li class="cart-item" data-key="${key}">
        <div class="cart-item-emoji" aria-hidden="true">${product.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name" title="${name}">${name}</div>
          <div class="cart-item-price">${formatPrice(unitPrice * qty)}</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn remove" data-key="${key}" data-delta="-1" aria-label="Retirer un ${product.name}">−</button>
          <span class="qty-value" aria-label="Quantité">${qty}</span>
          <button class="qty-btn" data-key="${key}" data-delta="1" aria-label="Ajouter un ${product.name}">+</button>
        </div>
      </li>`;
  }).join('');
}

/* ═══════════════════════════════════════════════════
   WHATSAPP — Générateur de message
═══════════════════════════════════════════════════ */
function buildOrderMessage() {
  const name     = ($('customerName')?.value.trim()) || 'Client';
  const mode     = document.querySelector('input[name="orderMode"]:checked')?.value || 'emporter';
  const address  = ($('customerAddress')?.value.trim()) || '';
  const modeIcon = mode === 'livraison' ? '🛵' : '🛍️';
  const modeText = mode === 'livraison' ? `Livraison${address ? ` → ${address}` : ''}` : 'À emporter';
  const keys     = Object.keys(cart);

  const lines = keys.map(key => {
    const { name: n, qty, unitPrice } = cart[key];
    return `  • ${n} ×${qty} — ${formatPrice(unitPrice * qty)}`;
  });

  const total = getCartTotal();

  return (
    `Bonjour 👋\n` +
    `*COMMANDE LE TOUAREG*\n` +
    `──────────────────────\n` +
    lines.join('\n') + '\n' +
    `──────────────────────\n` +
    `💰 *Total : ${formatPrice(total)}*\n` +
    `👤 Nom : ${name}\n` +
    `${modeIcon} Mode : ${modeText}\n\n` +
    `Merci, j'attends votre confirmation ! 😊`
  );
}

/* ═══════════════════════════════════════════════════
   CONFIGURATEUR — Modal bottom sheet
═══════════════════════════════════════════════════ */
let configuratorProduct = null;
let configuratorModal   = null;

function injectConfiguratorModal() {
  if ($('configuratorModal')) return;
  const el = document.createElement('div');
  el.id = 'configuratorModal';
  el.className = 'configurator-overlay';
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Personnaliser votre produit');
  el.innerHTML = `
    <div class="configurator-sheet" id="configuratorSheet" role="document">
      <div class="configurator-handle" aria-hidden="true"></div>
      <div class="configurator-header">
        <h3 class="configurator-title" id="configuratorTitle">Personnaliser</h3>
        <button class="configurator-close" id="configuratorClose" aria-label="Fermer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="configurator-body" id="configuratorBody"></div>
      <div class="configurator-footer">
        <div class="configurator-total">
          <span>Total</span>
          <strong id="configuratorTotal">0,00 €</strong>
        </div>
        <button class="btn btn-primary btn-lg btn-full" id="configuratorConfirm">
          Ajouter au panier
        </button>
      </div>
    </div>`;
  document.body.appendChild(el);
  configuratorModal = el;

  el.addEventListener('click', e => { if (e.target === el) closeConfigurator(); });
  $('configuratorClose').addEventListener('click', closeConfigurator);
  $('configuratorConfirm').addEventListener('click', confirmConfigurator);
}

function openConfigurator(product) {
  injectConfiguratorModal();
  configuratorProduct = product;
  const rule   = CONFIG_RULES[product.config];
  const title  = $('configuratorTitle');
  const body   = $('configuratorBody');

  if (title) title.textContent = product.name;

  const maxViandes = rule.viandes;
  let html = '';

  /* Viandes */
  html += `
    <div class="config-section">
      <p class="config-section-title">
        Viande${maxViandes > 1 ? 's' : ''}
        <span>(${rule.label})</span>
        <span class="config-viande-count" id="viandeCount">0/${maxViandes}</span>
      </p>
      <div class="config-options" id="viandeOptions">
        ${VIANDES.map((v, i) => `
          <label class="config-option" id="viandeOpt_${i}">
            <input type="checkbox" name="viande" value="${v}" />
            <span class="config-option-label">${v}</span>
          </label>`).join('')}
      </div>
    </div>`;

  /* Sauce */
  html += `
    <div class="config-section">
      <p class="config-section-title">Sauce <span>(1 au choix)</span></p>
      <div class="config-options">
        ${SAUCES.map((s, i) => `
          <label class="config-option">
            <input type="radio" name="sauce" value="${s}" ${i === 0 ? 'checked' : ''} />
            <span class="config-option-label">${s}</span>
          </label>`).join('')}
      </div>
    </div>`;

  /* Supplements (not for mixte) */
  if (product.config !== 'mixte') {
    html += `
      <div class="config-section">
        <p class="config-section-title">Suppléments <span>(optionnels)</span></p>
        <div class="config-supplements">
          ${SUPPLEMENTS.map(sup => `
            <label class="config-supplement">
              <input type="checkbox" name="supplement" value="${sup.name}" />
              <span class="config-supplement-label">
                <span class="config-supplement-name">${sup.name}</span>
                <span class="config-supplement-price">+${formatPrice(sup.price)}</span>
              </span>
            </label>`).join('')}
        </div>
      </div>`;
  }

  if (body) body.innerHTML = html;

  /* Gestion viandes : max selection */
  const viandeInputs = body.querySelectorAll('input[name="viande"]');
  const viandeCount  = $('viandeCount');

  function updateViandeState() {
    const checked = [...viandeInputs].filter(i => i.checked);
    const count   = checked.length;
    if (viandeCount) viandeCount.textContent = `${count}/${maxViandes}`;
    viandeInputs.forEach(inp => {
      const label = inp.closest('.config-option');
      if (count >= maxViandes && !inp.checked) {
        label.classList.add('disabled');
        inp.disabled = true;
      } else {
        label.classList.remove('disabled');
        inp.disabled = false;
      }
    });
    updateConfigTotal();
  }

  viandeInputs.forEach(inp => {
    inp.addEventListener('change', updateViandeState);
  });

  body.querySelectorAll('input[name="sauce"]').forEach(inp => {
    inp.addEventListener('change', updateConfigTotal);
  });

  body.querySelectorAll('input[name="supplement"]').forEach(inp => {
    inp.addEventListener('change', updateConfigTotal);
  });

  updateConfigTotal();

  configuratorModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  $('configuratorConfirm')?.focus();
}

function updateConfigTotal() {
  if (!configuratorProduct) return;
  const supInputs = $q('#configuratorBody')?.querySelectorAll('input[name="supplement"]:checked') || [];
  const supExtra  = [...supInputs].reduce((s, inp) => {
    const sup = SUPPLEMENTS.find(x => x.name === inp.value);
    return s + (sup ? sup.price : 0);
  }, 0);
  const total = configuratorProduct.price + supExtra;
  const el = $('configuratorTotal');
  if (el) el.textContent = formatPrice(total);
}

function confirmConfigurator() {
  if (!configuratorProduct) return;
  const rule = CONFIG_RULES[configuratorProduct.config];

  const viandes = [...($q('#configuratorBody')?.querySelectorAll('input[name="viande"]:checked') || [])].map(i => i.value);
  const sauce   = $q('#configuratorBody input[name="sauce"]:checked')?.value || SAUCES[0];
  const sups    = [...($q('#configuratorBody')?.querySelectorAll('input[name="supplement"]:checked') || [])].map(i => i.value);

  if (viandes.length !== rule.viandes) {
    showToast(`⚠️ Sélectionnez ${rule.viandes} viande${rule.viandes > 1 ? 's' : ''}`);
    return;
  }

  addToCart(configuratorProduct, { viandes, sauce, supplements: sups });
  closeConfigurator();
  openCart();
}

function closeConfigurator() {
  configuratorModal?.classList.remove('open');
  document.body.style.overflow = '';
  configuratorProduct = null;
}

/* ═══════════════════════════════════════════════════
   PANIER — Ouverture / Fermeture
═══════════════════════════════════════════════════ */
function openCart() {
  $('cartPanel')?.classList.add('open');
  $('cartOverlay')?.classList.add('visible');
  $('cartPanel')?.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cart-open');
}

function closeCart() {
  $('cartPanel')?.classList.remove('open');
  $('cartOverlay')?.classList.remove('visible');
  $('cartPanel')?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cart-open');
}

/* ═══════════════════════════════════════════════════
   RENDU — Populaires
═══════════════════════════════════════════════════ */
function renderPopulaires() {
  const grid = $('populairesGrid');
  if (!grid) return;
  const pops = PRODUCTS.filter(p => p.popular).slice(0, 8);
  grid.innerHTML = pops.map(p => `
    <article class="pop-card" data-id="${p.id}" tabindex="0" role="button" aria-label="Commander ${p.name} — ${formatPrice(p.price)}">
      <div class="pop-card-visual" aria-hidden="true">
        ${p.emoji}
        <span class="pop-badge">★ Populaire</span>
      </div>
      <div class="pop-card-body">
        <p class="pop-card-name">${p.name}</p>
        <p class="pop-card-cat">${CATEGORIES.find(c => c.id === p.cat)?.label || ''}</p>
        <div class="pop-card-footer">
          <span class="pop-card-price">${formatPrice(p.price)}</span>
          <button class="pop-card-add" aria-label="Ajouter ${p.name} au panier">+</button>
        </div>
      </div>
    </article>`).join('');

  grid.querySelectorAll('.pop-card').forEach(card => {
    const handler = () => {
      const p = PRODUCTS.find(x => x.id === +card.dataset.id);
      if (!p) return;
      if (p.config) openConfigurator(p);
      else { addToCart(p); openCart(); }
    };
    card.querySelector('.pop-card-add').addEventListener('click', e => { e.stopPropagation(); handler(); });
    card.addEventListener('click', handler);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
  });
}

/* ═══════════════════════════════════════════════════
   RENDU — Catégories (filtres)
═══════════════════════════════════════════════════ */
function renderCategories() {
  const track = $('filtersTrack');
  if (!track) return;
  const existing = CATEGORIES.filter(c => PRODUCTS.some(p => p.cat === c.id));
  const btns = existing.map(c => {
    const count = PRODUCTS.filter(p => p.cat === c.id).length;
    return `<button class="filter-btn" data-category="${c.id}" role="tab" aria-selected="false">
      ${c.emoji} ${c.label} <span style="opacity:.5;font-weight:400;font-size:10px">${count}</span>
    </button>`;
  }).join('');
  track.insertAdjacentHTML('beforeend', btns);
}

/* ═══════════════════════════════════════════════════
   RENDU — Grille Produits
═══════════════════════════════════════════════════ */
let activeFilter = 'all';
let activeSearch = '';

function getProductBadge(p) {
  if (p.popular) return `<span class="product-pop-badge badge-pop">★ Populaire</span>`;
  if (p.config === 'mixte') return `<span class="product-pop-badge badge-lourd">Signature</span>`;
  return '';
}

function renderProducts() {
  const grid  = $('productsGrid');
  const empty = $('menuEmpty');
  const term  = $('emptySearchTerm');
  if (!grid) return;

  let filtered = PRODUCTS;
  if (activeFilter !== 'all') filtered = filtered.filter(p => p.cat === activeFilter);
  if (activeSearch) {
    const q = activeSearch.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.desc || '').toLowerCase().includes(q) ||
      (CATEGORIES.find(c => c.id === p.cat)?.label || '').toLowerCase().includes(q)
    );
  }

  if (!filtered.length) {
    grid.innerHTML = '';
    if (empty) { empty.hidden = false; if (term) term.textContent = activeSearch || activeFilter; }
    return;
  }
  if (empty) empty.hidden = true;

  grid.innerHTML = filtered.map((p, i) => `
    <article class="product-card" data-id="${p.id}" style="animation-delay:${Math.min(i * 30, 300)}ms" tabindex="0" role="button" aria-label="${p.name} — ${formatPrice(p.price)}">
      <div class="product-card-visual" aria-hidden="true">
        ${p.emoji}
        ${getProductBadge(p)}
      </div>
      <div class="product-card-body">
        <h3 class="product-card-name">${p.name}</h3>
        <p class="product-card-desc">${p.desc || ''}</p>
        <div class="product-card-footer">
          <span class="product-card-price">${formatPrice(p.price)}</span>
          <button class="product-add-btn" data-id="${p.id}" aria-label="Ajouter ${p.name} au panier">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Ajouter
          </button>
        </div>
      </div>
    </article>`).join('');

  grid.querySelectorAll('.product-card').forEach(card => {
    const handleAdd = () => {
      const p = PRODUCTS.find(x => x.id === +card.dataset.id);
      if (!p) return;
      if (p.config) openConfigurator(p);
      else { addToCart(p); openCart(); }
    };
    card.querySelector('.product-add-btn').addEventListener('click', e => { e.stopPropagation(); handleAdd(); });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAdd(); } });
    if (window.innerWidth >= 1024) init3DTilt(card);
  });
}

/* ═══════════════════════════════════════════════════
   RENDU — Marquee Avis Google
═══════════════════════════════════════════════════ */
function renderReviews() {
  const track = $('reviewsMarqueeTrack');
  if (!track) return;

  const googleSVG = `<svg class="review-google-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>`;

  function reviewCard(r) {
    const stars = '★'.repeat(r.stars) + (r.stars < 5 ? `<span class="star-dim">${'★'.repeat(5 - r.stars)}</span>` : '');
    return `
      <article class="review-card" aria-label="Avis de ${r.name} : ${r.stars} étoiles">
        <div class="review-card-header">
          <div class="review-avatar" style="background:${r.color}" aria-hidden="true">${r.initial}</div>
          <div class="review-meta">
            <div class="review-name">${r.name}</div>
            <div class="review-date">${r.date}</div>
          </div>
          ${googleSVG}
        </div>
        <div class="review-stars" aria-label="${r.stars} étoiles sur 5">${stars}</div>
        <p class="review-text">${r.text}</p>
      </article>`;
  }

  /* Doubler pour boucle infinie sans saut */
  track.innerHTML = [...REVIEWS, ...REVIEWS].map(reviewCard).join('');
}

/* ═══════════════════════════════════════════════════
   TILT 3D (desktop uniquement)
═══════════════════════════════════════════════════ */
function init3DTilt(card) {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width / 2;
    const cy     = rect.top + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(600px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateZ(4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform .5s ease';
    card.style.transform  = '';
    setTimeout(() => card.style.transition = '', 500);
  });
  card.addEventListener('mouseenter', () => { card.style.transition = 'transform .08s ease'; });
}

/* ═══════════════════════════════════════════════════
   INIT — Barre d'annonce
═══════════════════════════════════════════════════ */
function initAnnounceBar() {
  if (sessionStorage.getItem('announce-closed') === '1') {
    document.documentElement.classList.add('no-announce');
  }
  $('announceClose')?.addEventListener('click', () => {
    document.documentElement.classList.add('no-announce');
    sessionStorage.setItem('announce-closed', '1');
  });
}

/* ═══════════════════════════════════════════════════
   INIT — Header : scroll & mobile nav
═══════════════════════════════════════════════════ */
function initHeader() {
  const header    = $('header');
  const hamburger = $('hamburger');
  const mobileNav = $('mobileNav');

  /* Scrolled class */
  const onScroll = () => {
    const threshold = window.innerHeight * 0.1;
    header?.classList.toggle('scrolled', window.scrollY > threshold);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav toggle */
  hamburger?.addEventListener('click', () => {
    const open = !mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileNav.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
  });

  /* Close nav on link click */
  mobileNav?.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });
  });

  /* Close nav on outside click */
  document.addEventListener('click', e => {
    if (mobileNav?.classList.contains('open') && !header?.contains(e.target)) {
      mobileNav.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  });
}

/* ═══════════════════════════════════════════════════
   INIT — Barre de progression scroll
═══════════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = $('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total  = document.documentElement.scrollHeight - window.innerHeight;
    const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════
   INIT — Reveal au scroll (Intersection Observer)
═══════════════════════════════════════════════════ */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) { target.classList.add('visible'); io.unobserve(target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  $qa('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 4 * 80, 240)}ms`;
    io.observe(el);
  });
}

/* ═══════════════════════════════════════════════════
   INIT — Statut ouvert / fermé
═══════════════════════════════════════════════════ */
function initOpenStatus() {
  const pill = $('openStatusPill');
  const text = $('openStatusText');
  if (!pill || !text) return;

  function update() {
    const now  = new Date();
    const h    = now.getHours();
    const m    = now.getMinutes();
    const mins = h * 60 + m;
    const open = mins >= OPENING_HOUR * 60 && mins < CLOSING_HOUR * 60;
    pill.className = `hero-pill pill-status${open ? '' : ' pill-closed'}`;
    if (open) {
      const close    = CLOSING_HOUR * 60 - mins;
      const closeH   = Math.floor(close / 60);
      const closeM   = close % 60;
      text.textContent = close <= 60
        ? `Ferme dans ${closeH > 0 ? closeH + 'h' : ''}${closeM}min`
        : 'Ouvert maintenant';
    } else {
      text.textContent = `Ouvert à ${OPENING_HOUR}h00`;
    }
  }
  update();
  setInterval(update, 60 * 1000);
}

/* ═══════════════════════════════════════════════════
   INIT — Compteur de commandes live (simulé)
═══════════════════════════════════════════════════ */
function initLiveCounter() {
  const el = $('liveOrderCount');
  if (!el) return;

  function isOpen() {
    const h = new Date().getHours();
    return h >= OPENING_HOUR && h < CLOSING_HOUR;
  }

  if (!isOpen()) { el.closest('.stat-item')?.style.setProperty('display', 'none'); return; }

  const h = new Date().getHours();
  const base = h >= 12 && h < 14 ? 18 :
               h >= 19 && h < 22 ? 27 :
               h >= 18 && h < 23 ? 20 : 8;

  let count = base + Math.floor(Math.random() * 6);
  el.textContent = count;

  setInterval(() => {
    if (!isOpen()) return;
    const rng = Math.random();
    if (rng > 0.55) {
      count += Math.floor(Math.random() * 2) + 1;
      el.textContent = count;
      el.classList.remove('bump');
      void el.offsetWidth;
      el.classList.add('bump');
    }
  }, 28000 + Math.random() * 22000);
}

/* ═══════════════════════════════════════════════════
   INIT — Recherche dans le menu
═══════════════════════════════════════════════════ */
function initSearch() {
  const input  = $('searchInput');
  const clear  = $('searchClear');
  if (!input) return;

  let timeout;
  input.addEventListener('input', () => {
    clearTimeout(timeout);
    const val = input.value.trim();
    activeSearch = val;
    clear.hidden = !val;
    timeout = setTimeout(renderProducts, 200);
    if (val) {
      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      resetFilters();
    }
  });

  clear?.addEventListener('click', () => {
    input.value = '';
    activeSearch = '';
    clear.hidden = true;
    renderProducts();
    input.focus();
  });
}

/* ═══════════════════════════════════════════════════
   INIT — Filtres catégories
═══════════════════════════════════════════════════ */
function resetFilters() {
  activeFilter = 'all';
  $qa('.filter-btn').forEach(btn => {
    const isAll = btn.dataset.category === 'all';
    btn.classList.toggle('active', isAll);
    btn.setAttribute('aria-selected', String(isAll));
  });
}

function initFilters() {
  $('filtersTrack')?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    activeFilter = btn.dataset.category;
    activeSearch = '';
    const input = $('searchInput');
    if (input) { input.value = ''; const clear = $('searchClear'); if (clear) clear.hidden = true; }
    $qa('.filter-btn').forEach(b => {
      const active = b === btn;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', String(active));
    });
    renderProducts();

    /* Scroll filtre actif en vue */
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });
}

/* ═══════════════════════════════════════════════════
   INIT — Panier & Commande
═══════════════════════════════════════════════════ */
function initCart() {
  /* Ouverture / fermeture */
  $('cartToggle')?.addEventListener('click', openCart);
  $('cartClose')?.addEventListener('click', closeCart);
  $('cartOverlay')?.addEventListener('click', closeCart);

  /* Quantités (délégation) */
  $('cartItems')?.addEventListener('click', e => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;
    changeQty(btn.dataset.key, +btn.dataset.delta);
  });

  /* Livraison vs emporter */
  document.querySelectorAll('input[name="orderMode"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const wrap = $('addressWrap');
      if (wrap) wrap.style.display = radio.value === 'livraison' ? 'flex' : 'none';
    });
  });

  /* Bouton WhatsApp */
  $('whatsappOrderBtn')?.addEventListener('click', () => {
    const keys = Object.keys(cart);
    if (!keys.length) { showToast('🛒 Votre panier est vide'); return; }
    const name = $('customerName')?.value.trim();
    if (!name) { showToast('⚠️ Indiquez votre prénom'); $('customerName')?.focus(); return; }
    const mode    = document.querySelector('input[name="orderMode"]:checked')?.value;
    const address = $('customerAddress')?.value.trim();
    if (mode === 'livraison' && !address) { showToast('⚠️ Indiquez votre adresse'); $('customerAddress')?.focus(); return; }
    const msg = encodeURIComponent(buildOrderMessage());
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener');
  });

  /* Bouton panier vide → menu */
  $('goToMenuBtn')?.addEventListener('click', () => {
    closeCart();
    setTimeout(() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }), 200);
  });

  /* Raccourcis hero & location */
  $('heroOrderBtn')?.addEventListener('click', () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  });
  $('locationOrderBtn')?.addEventListener('click', openCart);
}

/* ═══════════════════════════════════════════════════
   INIT — FAB (boutons flottants)
═══════════════════════════════════════════════════ */
function initFab() {
  $('fabCart')?.addEventListener('click', openCart);
  $('fabCommander')?.addEventListener('click', openCart);
}

/* ═══════════════════════════════════════════════════
   INIT — Liens footer (catégorie)
═══════════════════════════════════════════════════ */
function initFooterLinks() {
  document.querySelectorAll('[data-cat-link]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const catId = link.dataset.catLink;
      activeFilter = catId;
      activeSearch = '';
      $qa('.filter-btn').forEach(btn => {
        const active = btn.dataset.category === catId;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', String(active));
        if (active) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
      renderProducts();
      setTimeout(() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
  });
}

/* ═══════════════════════════════════════════════════
   INIT — FAQ (accessible)
═══════════════════════════════════════════════════ */
function initFaq() {
  $qa('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      /* Ferme les autres */
      $qa('.faq-item').forEach(other => {
        if (other !== item && other.open) other.open = false;
      });
    });
  });
}

/* ═══════════════════════════════════════════════════
   INIT — Année courante dans le footer
═══════════════════════════════════════════════════ */
function initYear() {
  const el = $('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ═══════════════════════════════════════════════════
   INIT — Escape key handlers
═══════════════════════════════════════════════════ */
function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if ($('configuratorModal')?.classList.contains('open')) { closeConfigurator(); return; }
    if ($('cartPanel')?.classList.contains('open')) { closeCart(); return; }
  });
}

/* ═══════════════════════════════════════════════════
   ENTRÉE PRINCIPALE
═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initAnnounceBar();
  initScrollProgress();
  initHeader();
  initReveal();
  initOpenStatus();
  initLiveCounter();
  renderPopulaires();
  renderCategories();
  renderProducts();
  renderReviews();
  initSearch();
  initFilters();
  initCart();
  initFab();
  initFooterLinks();
  initFaq();
  initKeyboard();
});
