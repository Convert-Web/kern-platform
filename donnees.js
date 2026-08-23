/* ============================================================================
   BAZAR AL MADINA — donnees.js
   ============================================================================
   Ce fichier contient TOUTES les données du site : configuration boutique,
   catégories, produits, avis clients.

   🛠️ C'EST ICI QUE VOUS PERSONNALISEZ LE SITE :

   1. NUMÉRO WHATSAPP → constante WHATSAPP_NUMBER ci-dessous
   2. NOM / VILLE DE LA BOUTIQUE → SHOP_NAME / SHOP_CITY
   3. AJOUTER UN PRODUIT → copiez un objet dans le tableau PRODUCTS
   4. AJOUTER UN AVIS CLIENT → copiez un objet dans le tableau REVIEWS
      (le champ "idProduit" doit correspondre à l'id d'un produit existant)

   Ce fichier est chargé par TOUTES les pages du site (index, catalogue,
   produit, favoris, panier). Le modifier une fois suffit à mettre à jour
   l'ensemble du site.
   ============================================================================ */

// 📱 Numéro WhatsApp du vendeur (format international, SANS "+" ni espaces)
const WHATSAPP_NUMBER = "212600000000";

// 🏪 Identité de la boutique
const SHOP_NAME = "Bazar Al Madina";
const SHOP_CITY = "Ouarzazate";
const SHOP_TAGLINE = "Le bazar de votre quartier, maintenant à portée de main";

// Catégories affichées dans les filtres (doivent correspondre aux valeurs
// "categorie" utilisées dans PRODUCTS ci-dessous)
const CATEGORIES = [
  { nom: "Vêtements", icone: "👕" },
  { nom: "Électroménager", icone: "🔌" },
  { nom: "Ustensiles", icone: "🍽️" },
  { nom: "Décoration", icone: "🏺" },
  { nom: "Jouets", icone: "🧸" },
  { nom: "Bijoux & Accessoires", icone: "💍" },
  { nom: "Maison & Rangement", icone: "🧺" }
];

/* --------------------------------------------------------------------
   CATALOGUE PRODUITS
   Champs : id (unique), titre, description, descriptionLongue, categorie,
   prix (MAD), prixAvant (optionnel, pour afficher une promo barrée),
   etat ("Neuf" | "Très bon" | "Bon" | "Occasion"), image (URL),
   nouveau (bool, affiche un badge "Nouveau"), stock (texte libre).
   -------------------------------------------------------------------- */
const PRODUCTS = [
  {
    id: 1,
    titre: "Veste en jean délavé",
    description: "Veste en jean coupe classique, doublure chaude.",
    descriptionLongue: "Veste en jean coupe classique avec une doublure chaude idéale pour les soirées fraîches d'Ouarzazate. Boutons pression solides, poches intérieures et extérieures en bon état, coloris délavé intemporel. Convient aussi bien au quotidien qu'à une sortie décontractée.",
    categorie: "Vêtements",
    prix: 180,
    etat: "Très bon",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    stock: "2 pièces disponibles"
  },
  {
    id: 2,
    titre: "Djellaba homme brodée",
    description: "Djellaba traditionnelle en coton, broderies fines.",
    descriptionLongue: "Djellaba traditionnelle en coton épais, avec broderies fines faites main au niveau du col et des poignets. Idéale pour l'hiver ou les journées fraîches. Coupe ample confortable, capuche assortie. Pièce neuve, jamais portée.",
    categorie: "Vêtements",
    prix: 320,
    etat: "Neuf",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
    nouveau: true,
    stock: "3 pièces disponibles"
  },
  {
    id: 3,
    titre: "Pull en laine col rond",
    description: "Pull chaud et confortable, coloris beige, taille M.",
    descriptionLongue: "Pull en laine mélangée, col rond, coloris beige neutre facile à assortir. Taille M, très peu porté et conservé dans un environnement non-fumeur. Tricot serré qui tient bien chaud sans être épais.",
    categorie: "Vêtements",
    prix: 95,
    etat: "Bon",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
    stock: "1 pièce disponible"
  },
  {
    id: 4,
    titre: "Mini-four électrique 20L",
    description: "Four compact, fonctions grill et chaleur tournante.",
    descriptionLongue: "Mini-four électrique de 20 litres, parfait pour les petites cuisines ou en complément d'un four classique. Fonctions grill et chaleur tournante, minuterie mécanique fiable, plaque et grille incluses. Testé et fonctionnel.",
    categorie: "Électroménager",
    prix: 450,
    etat: "Bon",
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&q=80",
    stock: "1 pièce disponible"
  },
  {
    id: 5,
    titre: "Bouilloire électrique inox",
    description: "Bouilloire 1.7L, arrêt automatique, chauffe rapide.",
    descriptionLongue: "Bouilloire électrique en inox brossé, capacité 1.7L, arrêt automatique et protection contre le fonctionnement à sec. Chauffe rapide, socle rotatif à 360°. Très peu utilisée, aucune trace de calcaire.",
    categorie: "Électroménager",
    prix: 130,
    etat: "Très bon",
    image: "https://images.unsplash.com/photo-1585659722983-1a675dabf30d?w=600&q=80",
    stock: "2 pièces disponibles"
  },
  {
    id: 6,
    titre: "Mixeur plongeant 3 vitesses",
    description: "Mixeur puissant avec fouet et bol mesureur inclus.",
    descriptionLongue: "Mixeur plongeant 3 vitesses avec accessoire fouet et bol mesureur gradué inclus. Pied en inox amovible et lavable. Fonctionne parfaitement, idéal pour soupes, sauces et pâtisseries.",
    categorie: "Électroménager",
    prix: 165,
    etat: "Bon",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80",
    stock: "1 pièce disponible"
  },
  {
    id: 7,
    titre: "Service à thé marocain complet",
    description: "Plateau en laiton, théière et 6 verres décorés.",
    descriptionLongue: "Service à thé traditionnel complet : plateau rond en laiton finement ciselé, théière authentique et 6 verres décorés de motifs dorés. Pièce artisanale idéale pour recevoir ou pour offrir. Très bon état général.",
    categorie: "Ustensiles",
    prix: 380,
    prixAvant: 450,
    etat: "Très bon",
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80",
    stock: "1 pièce disponible"
  },
  {
    id: 8,
    titre: "Set de tajines en terre cuite (x2)",
    description: "Deux tajines de tailles différentes, cuisson traditionnelle.",
    descriptionLongue: "Lot de deux tajines en terre cuite véritable, une petite taille individuelle et une grande taille familiale. Idéales pour une cuisson traditionnelle authentique. Vernissage intact, jamais fendues.",
    categorie: "Ustensiles",
    prix: 220,
    etat: "Bon",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
    stock: "1 lot disponible"
  },
  {
    id: 9,
    titre: "Couteaux de cuisine (lot de 5)",
    description: "Lot de couteaux professionnels avec bloc en bois.",
    descriptionLongue: "Lot de 5 couteaux de cuisine professionnels avec bloc de rangement en bois massif. Lames en acier inoxydable aiguisées, manches ergonomiques antidérapants. Jamais utilisés, encore sous emballage d'origine.",
    categorie: "Ustensiles",
    prix: 140,
    etat: "Neuf",
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&q=80",
    nouveau: true,
    stock: "4 lots disponibles"
  },
  {
    id: 10,
    titre: "Lanterne marocaine en fer forgé",
    description: "Lanterne artisanale avec verre coloré.",
    descriptionLongue: "Lanterne artisanale en fer forgé noir avec panneaux de verre coloré (bleu, ambre, vert). Parfaite pour une terrasse, un salon ou une entrée. Livrée avec support pour bougie. Pièce neuve.",
    categorie: "Décoration",
    prix: 210,
    etat: "Neuf",
    image: "https://images.unsplash.com/photo-1573575155376-b5010099301b?w=600&q=80",
    nouveau: true,
    stock: "5 pièces disponibles"
  },
  {
    id: 11,
    titre: "Tapis berbère fait main",
    description: "Tapis en laine 150x100cm, motifs géométriques.",
    descriptionLongue: "Authentique tapis berbère tissé à la main en laine naturelle, dimensions 150x100cm. Motifs géométriques traditionnels aux couleurs chaudes. Pièce unique avec un léger signe d'usage qui témoigne de son authenticité.",
    categorie: "Décoration",
    prix: 650,
    etat: "Très bon",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&q=80",
    stock: "1 pièce disponible"
  },
  {
    id: 12,
    titre: "Coussins brodés (lot de 4)",
    description: "Housses de coussin en velours brodé, coloris assortis.",
    descriptionLongue: "Lot de 4 housses de coussin en velours brodé main, coloris assortis dans des tons chauds. Fermeture zip invisible, tissu épais et doux. Très bon état, lavées et repassées.",
    categorie: "Décoration",
    prix: 160,
    etat: "Bon",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80",
    stock: "2 lots disponibles"
  },
  {
    id: 13,
    titre: "Miroir mosaïque zellige",
    description: "Miroir rond encadré de mosaïque colorée.",
    descriptionLongue: "Miroir rond encadré d'une mosaïque zellige colorée réalisée à la main par des artisans locaux. Pièce décorative unique qui apporte une touche traditionnelle à n'importe quelle pièce. État neuf, jamais accroché.",
    categorie: "Décoration",
    prix: 290,
    etat: "Neuf",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80",
    stock: "2 pièces disponibles"
  },
  {
    id: 14,
    titre: "Camion en bois pour enfant",
    description: "Jouet artisanal en bois peint, roues mobiles.",
    descriptionLongue: "Camion jouet artisanal en bois peint à la main, roues mobiles solides, sans petites pièces détachables. Idéal dès 3 ans. Peinture non toxique, angles arrondis pour la sécurité.",
    categorie: "Jouets",
    prix: 85,
    etat: "Neuf",
    image: "https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=600&q=80",
    stock: "3 pièces disponibles"
  },
  {
    id: 15,
    titre: "Poupée de collection habit traditionnel",
    description: "Poupée artisanale en tenue traditionnelle marocaine.",
    descriptionLongue: "Poupée de collection habillée d'une tenue traditionnelle marocaine cousue à la main, avec accessoires (bijoux miniatures, foulard). Pièce à la fois décorative et ludique. Très bon état, aucune pièce manquante.",
    categorie: "Jouets",
    prix: 110,
    etat: "Très bon",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80",
    stock: "1 pièce disponible"
  },
  {
    id: 16,
    titre: "Puzzle 500 pièces paysage",
    description: "Puzzle complet vérifié, toutes les pièces présentes.",
    descriptionLongue: "Puzzle de 500 pièces représentant un paysage. Toutes les pièces ont été vérifiées une à une avant la mise en vente, aucune manquante. Boîte d'origine en bon état avec l'image de référence.",
    categorie: "Jouets",
    prix: 45,
    etat: "Bon",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80",
    stock: "1 pièce disponible"
  },
  {
    id: 17,
    titre: "Bracelet argent berbère",
    description: "Bracelet artisanal en argent massif, gravures.",
    descriptionLongue: "Bracelet artisanal en argent massif orné de gravures berbères traditionnelles réalisées au poinçon. Fermoir solide, taille ajustable. Pièce unique fabriquée par un artisan de la région.",
    categorie: "Bijoux & Accessoires",
    prix: 240,
    etat: "Neuf",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
    nouveau: true,
    stock: "2 pièces disponibles"
  },
  {
    id: 18,
    titre: "Sac à main en cuir tressé",
    description: "Sac artisanal en cuir véritable, fermeture zip.",
    descriptionLongue: "Sac à main artisanal en cuir véritable tressé, fermeture zip robuste, doublure intérieure en tissu résistant. Très peu utilisé, cuir souple sans craquelures. Bandoulière ajustable incluse.",
    categorie: "Bijoux & Accessoires",
    prix: 195,
    etat: "Très bon",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    stock: "1 pièce disponible"
  },
  {
    id: 19,
    titre: "Ceinture cuir gravée",
    description: "Ceinture en cuir véritable avec boucle artisanale.",
    descriptionLongue: "Ceinture en cuir véritable avec boucle artisanale gravée à la main. Taille ajustable par découpe, cuir épais et résistant. Bon état général, quelques signes d'usage discrets sur le cuir.",
    categorie: "Bijoux & Accessoires",
    prix: 75,
    etat: "Bon",
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80",
    stock: "2 pièces disponibles"
  },
  {
    id: 20,
    titre: "Panier de rangement en osier (x3)",
    description: "Lot de 3 paniers tressés à la main, tailles différentes.",
    descriptionLongue: "Lot de 3 paniers de rangement en osier tressé à la main, tailles S/M/L qui s'emboîtent pour un rangement optimal. Idéal pour le linge, les jouets ou la décoration. État neuf.",
    categorie: "Maison & Rangement",
    prix: 130,
    etat: "Neuf",
    image: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=600&q=80",
    stock: "3 lots disponibles"
  },
  {
    id: 21,
    titre: "Coffre en bois sculpté",
    description: "Coffre de rangement en bois massif, fermeture à clé.",
    descriptionLongue: "Coffre de rangement en bois massif avec sculptures artisanales sur les faces et le couvercle. Fermeture à clé fonctionnelle, charnières métalliques solides. Idéal pour ranger bijoux, papiers ou souvenirs.",
    categorie: "Maison & Rangement",
    prix: 380,
    etat: "Très bon",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600&q=80",
    stock: "1 pièce disponible"
  },
  {
    id: 22,
    titre: "Étagère murale suspendue",
    description: "Étagère en bois et corde, style bohème.",
    descriptionLongue: "Étagère murale suspendue en bois naturel et corde tressée, style bohème. Montage facile avec kit de fixation inclus. Supporte jusqu'à 5kg par plateau. Très bon état.",
    categorie: "Maison & Rangement",
    prix: 105,
    etat: "Bon",
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&q=80",
    stock: "2 pièces disponibles"
  },
  {
    id: 23,
    titre: "Grille-pain 2 fentes",
    description: "Grille-pain compact, 6 niveaux de brunissage.",
    descriptionLongue: "Grille-pain compact 2 fentes larges, 6 niveaux de brunissage réglables, fonction décongélation et réchauffage. Ramasse-miettes amovible pour un nettoyage facile. Fonctionne comme neuf.",
    categorie: "Électroménager",
    prix: 120,
    etat: "Très bon",
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&q=80",
    stock: "1 pièce disponible"
  },
  {
    id: 24,
    titre: "Robe kaftan brodée main",
    description: "Kaftan en tissu fluide, broderies dorées, taille L.",
    descriptionLongue: "Robe kaftan en tissu fluide de qualité, broderies dorées faites main sur le buste et les manches. Taille L, portée une seule fois pour une occasion spéciale. Nettoyée à sec, comme neuve.",
    categorie: "Vêtements",
    prix: 420,
    prixAvant: 480,
    etat: "Occasion",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    stock: "1 pièce disponible"
  }
];

/* --------------------------------------------------------------------
   AVIS CLIENTS
   Champs : idProduit (correspond à l'id d'un produit), auteur, note (1-5),
   commentaire, date (texte libre, ex : "Il y a 2 semaines").
   -------------------------------------------------------------------- */
const REVIEWS = [
  { idProduit: 1, auteur: "Karim B.", note: 5, commentaire: "Très bonne surprise, la veste est comme neuve et taille bien. Je recommande le bazar !", date: "Il y a 2 semaines" },
  { idProduit: 1, auteur: "Nadia M.", note: 4, commentaire: "Belle qualité de jean, juste un peu grande pour moi mais je la garde quand même.", date: "Il y a 1 mois" },
  { idProduit: 2, auteur: "Hassan T.", note: 5, commentaire: "Broderie magnifique, exactement comme sur la photo. Achetée pour l'Aid, parfait timing.", date: "Il y a 3 semaines" },
  { idProduit: 2, auteur: "Youssef A.", note: 5, commentaire: "Qualité au top, tissu épais et chaud. Le vendeur a été très sympa au retrait.", date: "Il y a 1 mois" },
  { idProduit: 7, auteur: "Fatima Z.", note: 5, commentaire: "Le service à thé est magnifique, le laiton brille vraiment. Idéal pour recevoir la famille.", date: "Il y a 1 semaine" },
  { idProduit: 7, auteur: "Rachid E.", note: 4, commentaire: "Très joli plateau, un petit verre était légèrement ébréché mais rien de grave.", date: "Il y a 2 mois" },
  { idProduit: 11, auteur: "Amina L.", note: 5, commentaire: "Le tapis est encore plus beau en vrai, les couleurs sont chaudes et authentiques.", date: "Il y a 3 jours" },
  { idProduit: 13, auteur: "Omar S.", note: 5, commentaire: "Le miroir zellige est superbe, il a transformé mon salon. Emballage soigné pour le transport.", date: "Il y a 2 semaines" },
  { idProduit: 17, auteur: "Salma K.", note: 5, commentaire: "Bracelet magnifique, gravures très fines. Je l'ai offert à ma mère qui l'adore.", date: "Il y a 5 jours" },
  { idProduit: 8, auteur: "Mustapha R.", note: 4, commentaire: "Bons tajines pour cuisiner au quotidien, la petite taille est parfaite pour un repas seul.", date: "Il y a 1 mois" },
  { idProduit: 4, auteur: "Khadija N.", note: 4, commentaire: "Le four fonctionne très bien, un peu bruyant au démarrage mais rien de gênant.", date: "Il y a 3 semaines" },
  { idProduit: 20, auteur: "Ilyas D.", note: 5, commentaire: "Exactement ce qu'il me fallait pour ranger la chambre des enfants, très solides.", date: "Il y a 1 semaine" }
];
