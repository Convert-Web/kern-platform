/* ============================================================================
   BAZAR AL MADINA — commun.js
   ============================================================================
   Logique partagée par toutes les pages : panier, favoris, comparateur,
   header/footer injectés, toasts, helpers. Chargé APRÈS donnees.js sur
   chaque page.
   ============================================================================ */

/* ----------------------------------------------------------------------
   1. CLÉS DE STOCKAGE (localStorage)
   ---------------------------------------------------------------------- */
const CLE_PANIER = "bazar-al-madina-panier";
const CLE_FAVORIS = "bazar-al-madina-favoris";
const CLE_COMPARATEUR = "bazar-al-madina-comparateur";

/* ----------------------------------------------------------------------
   2. ÉTAT — chargé depuis localStorage au démarrage de chaque page
   ---------------------------------------------------------------------- */
let panier = {};          // { idProduit: quantite }
let favoris = [];         // [idProduit, ...]
let comparateur = [];     // [idProduit, ...] — max 3

function chargerEtatDepuisStockage() {
  try { panier = JSON.parse(localStorage.getItem(CLE_PANIER)) || {}; } catch (e) { panier = {}; }
  try { favoris = JSON.parse(localStorage.getItem(CLE_FAVORIS)) || []; } catch (e) { favoris = []; }
  try { comparateur = JSON.parse(localStorage.getItem(CLE_COMPARATEUR)) || []; } catch (e) { comparateur = []; }
}

function sauvegarderPanier() { localStorage.setItem(CLE_PANIER, JSON.stringify(panier)); }
function sauvegarderFavoris() { localStorage.setItem(CLE_FAVORIS, JSON.stringify(favoris)); }
function sauvegarderComparateur() { localStorage.setItem(CLE_COMPARATEUR, JSON.stringify(comparateur)); }

/* ----------------------------------------------------------------------
   3. UTILITAIRES GÉNÉRAUX
   ---------------------------------------------------------------------- */
function trouverProduitParId(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

function formaterPrix(nombre) {
  return nombre.toLocaleString("fr-FR");
}

function classeEtat(etat) {
  const correspondance = { "Neuf": "etat-neuf", "Très bon": "etat-tres-bon", "Bon": "etat-bon", "Occasion": "etat-occasion" };
  return correspondance[etat] || "etat-bon";
}

function echapperHtml(texte) {
  const div = document.createElement("div");
  div.textContent = String(texte);
  return div.innerHTML;
}

function obtenirAvisProduit(idProduit) {
  return REVIEWS.filter(r => r.idProduit === Number(idProduit));
}

function noteMoyenne(idProduit) {
  const avis = obtenirAvisProduit(idProduit);
  if (avis.length === 0) return null;
  const somme = avis.reduce((t, a) => t + a.note, 0);
  return Math.round((somme / avis.length) * 10) / 10;
}

function construireEtoilesHtml(note, taille) {
  taille = taille || 14;
  let html = '<span class="etoiles" style="font-size:' + taille + 'px" aria-hidden="true">';
  for (let i = 1; i <= 5; i++) {
    html += i <= Math.round(note) ? "★" : "☆";
  }
  html += "</span>";
  return html;
}

// Slug de page courante, pour marquer le lien actif dans la nav
function pageCourante() {
  const chemin = window.location.pathname.split("/").pop() || "index.html";
  return chemin.replace(".html", "") || "index";
}


/* ----------------------------------------------------------------------
   4. PANIER — logique
   ---------------------------------------------------------------------- */
function ajouterAuPanier(idProduit, quantite) {
  quantite = quantite || 1;
  panier[idProduit] = (panier[idProduit] || 0) + quantite;
  sauvegarderPanier();
  rafraichirBadges();
  afficherToast("Article ajouté au panier", "panier");
}

function modifierQuantitePanier(idProduit, delta) {
  const q = (panier[idProduit] || 0) + delta;
  if (q <= 0) delete panier[idProduit];
  else panier[idProduit] = q;
  sauvegarderPanier();
  rafraichirBadges();
}

function supprimerDuPanier(idProduit) {
  delete panier[idProduit];
  sauvegarderPanier();
  rafraichirBadges();
}

function nombreArticlesPanier() {
  return Object.values(panier).reduce((t, q) => t + q, 0);
}

function totalPanier() {
  let total = 0;
  Object.entries(panier).forEach(([id, q]) => {
    const p = trouverProduitParId(id);
    if (p) total += p.prix * q;
  });
  return total;
}


/* ----------------------------------------------------------------------
   5. FAVORIS — logique
   ---------------------------------------------------------------------- */
function estFavori(idProduit) {
  return favoris.includes(Number(idProduit));
}

function basculerFavori(idProduit) {
  idProduit = Number(idProduit);
  const index = favoris.indexOf(idProduit);
  if (index === -1) {
    favoris.push(idProduit);
    afficherToast("Ajouté aux favoris ❤️", "favoris");
  } else {
    favoris.splice(index, 1);
    afficherToast("Retiré des favoris", "favoris");
  }
  sauvegarderFavoris();
  rafraichirBadges();
  // Mettre à jour visuellement tous les boutons cœur de ce produit sur la page
  document.querySelectorAll(`[data-favori-id="${idProduit}"]`).forEach(bouton => {
    bouton.classList.toggle("actif", estFavori(idProduit));
    bouton.setAttribute("aria-pressed", estFavori(idProduit) ? "true" : "false");
  });
}


/* ----------------------------------------------------------------------
   6. COMPARATEUR — logique (max 3 produits)
   ---------------------------------------------------------------------- */
const MAX_COMPARATEUR = 3;

function estEnComparaison(idProduit) {
  return comparateur.includes(Number(idProduit));
}

function basculerComparaison(idProduit) {
  idProduit = Number(idProduit);
  const index = comparateur.indexOf(idProduit);
  if (index === -1) {
    if (comparateur.length >= MAX_COMPARATEUR) {
      afficherToast(`Vous pouvez comparer ${MAX_COMPARATEUR} articles maximum`, "attention");
      return;
    }
    comparateur.push(idProduit);
    afficherToast("Ajouté au comparateur ⚖️", "comparateur");
  } else {
    comparateur.splice(index, 1);
    afficherToast("Retiré du comparateur", "comparateur");
  }
  sauvegarderComparateur();
  rafraichirBadges();
  document.querySelectorAll(`[data-comparer-id="${idProduit}"]`).forEach(bouton => {
    bouton.classList.toggle("actif", estEnComparaison(idProduit));
    bouton.setAttribute("aria-pressed", estEnComparaison(idProduit) ? "true" : "false");
  });
}


/* ----------------------------------------------------------------------
   7. TOAST DE CONFIRMATION
   ---------------------------------------------------------------------- */
let minuteurToast = null;

function afficherToast(message, type) {
  let toast = document.getElementById("toast-partage");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-partage";
    toast.className = "toast";
    toast.innerHTML = '<span class="icone-toast" aria-hidden="true"></span><span class="texte-toast"></span>';
    document.body.appendChild(toast);
  }
  const icones = { panier: "🛒", favoris: "❤️", comparateur: "⚖️", attention: "⚠️", succes: "✅" };
  toast.querySelector(".icone-toast").textContent = icones[type] || "✅";
  toast.querySelector(".texte-toast").textContent = message;
  toast.classList.add("visible");
  clearTimeout(minuteurToast);
  minuteurToast = setTimeout(() => toast.classList.remove("visible"), 2400);
}


/* ----------------------------------------------------------------------
   8. HEADER + FOOTER — injectés dynamiquement pour éviter la duplication
   ---------------------------------------------------------------------- */
function construireHeaderHtml() {
  const page = pageCourante();
  const lien = (cible, texte) =>
    `<a href="${cible}.html" class="lien-nav ${page === cible ? "actif" : ""}">${texte}</a>`;

  return `
    <div class="barre-info">🛍️ Retrait uniquement en boutique · Commande envoyée directement sur WhatsApp</div>
    <header class="entete">
      <div class="entete-interieure">
        <a href="index.html" class="logo" aria-label="${SHOP_NAME} — accueil">
          <svg class="logo-etoile" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M20 2 L24 16 L38 20 L24 24 L20 38 L16 24 L2 20 L16 16 Z" fill="#7A2E2E" stroke="#C98A2E" stroke-width="1.5"/>
          </svg>
          <span>${SHOP_NAME}<small>${SHOP_CITY} · Maroc</small></span>
        </a>
        <nav class="nav-principale" aria-label="Navigation principale">
          ${lien("index", "Accueil")}
          ${lien("catalogue", "Catalogue")}
          ${lien("favoris", "Favoris")}
        </nav>
        <div class="actions-entete">
          <a href="favoris.html" class="bouton-icone-entete" aria-label="Voir mes favoris">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
            <span class="badge-compteur" id="badge-favoris" hidden>0</span>
          </a>
          <button class="bouton-panier" id="bouton-ouvrir-panier" aria-label="Ouvrir le panier">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span>Panier</span>
            <span class="badge-compteur" id="badge-compteur" hidden>0</span>
          </button>
        </div>
      </div>
    </header>
    <div class="barre-comparateur" id="barre-comparateur" hidden>
      <div class="barre-comparateur-interieure">
        <span class="barre-comparateur-titre">⚖️ Comparateur (<span id="nombre-comparaison">0</span>/${MAX_COMPARATEUR})</span>
        <div class="barre-comparateur-items" id="barre-comparateur-items"></div>
        <a href="comparateur.html" class="bouton-voir-comparaison" id="bouton-voir-comparaison">Comparer</a>
      </div>
    </div>
  `;
}

function construireFooterHtml() {
  return `
    <div class="separateur-zellige" aria-hidden="true"></div>
    <footer class="pied-page">
      <div class="pied-page-interieur">
        <div class="pied-colonne">
          <strong>${SHOP_NAME}</strong>
          <p>${SHOP_CITY}, Maroc<br>Retrait en boutique uniquement<br>Commandes via WhatsApp</p>
        </div>
        <div class="pied-colonne">
          <span class="pied-titre-colonne">Navigation</span>
          <a href="index.html">Accueil</a>
          <a href="catalogue.html">Catalogue</a>
          <a href="favoris.html">Mes favoris</a>
        </div>
        <div class="pied-colonne">
          <span class="pied-titre-colonne">Catégories</span>
          ${CATEGORIES.slice(0, 4).map(c => `<a href="catalogue.html?categorie=${encodeURIComponent(c.nom)}">${c.icone} ${c.nom}</a>`).join("")}
        </div>
      </div>
      <p class="pied-mention">© ${new Date().getFullYear()} ${SHOP_NAME} — Site vitrine, aucun paiement en ligne.</p>
    </footer>
  `;
}

function injecterHeaderFooter() {
  const zoneHeader = document.getElementById("zone-header");
  const zoneFooter = document.getElementById("zone-footer");
  if (zoneHeader) zoneHeader.innerHTML = construireHeaderHtml();
  if (zoneFooter) zoneFooter.innerHTML = construireFooterHtml();
}


/* ----------------------------------------------------------------------
   9. BADGES (panier / favoris / comparateur) — mise à jour globale
   ---------------------------------------------------------------------- */
function rafraichirBadges() {
  const badgePanier = document.getElementById("badge-compteur");
  if (badgePanier) {
    const n = nombreArticlesPanier();
    badgePanier.textContent = n;
    badgePanier.hidden = n === 0;
    if (n > 0) {
      badgePanier.classList.remove("pulse-badge");
      void badgePanier.offsetWidth; // relance l'animation
      badgePanier.classList.add("pulse-badge");
    }
  }

  const badgeFavoris = document.getElementById("badge-favoris");
  if (badgeFavoris) {
    badgeFavoris.textContent = favoris.length;
    badgeFavoris.hidden = favoris.length === 0;
  }

  rafraichirBarreComparateur();
}

function rafraichirBarreComparateur() {
  const barre = document.getElementById("barre-comparateur");
  if (!barre) return;

  const nombreEl = document.getElementById("nombre-comparaison");
  const itemsEl = document.getElementById("barre-comparateur-items");

  if (comparateur.length === 0) {
    barre.hidden = true;
    return;
  }

  barre.hidden = false;
  nombreEl.textContent = comparateur.length;
  itemsEl.innerHTML = comparateur.map(id => {
    const p = trouverProduitParId(id);
    if (!p) return "";
    return `<span class="mini-item-comparateur">
      <img src="${p.image}" alt="">
      <button aria-label="Retirer ${echapperHtml(p.titre)} du comparateur" data-action="retirer-comparaison" data-id="${p.id}">×</button>
    </span>`;
  }).join("");

  itemsEl.querySelectorAll('[data-action="retirer-comparaison"]').forEach(btn => {
    btn.addEventListener("click", () => basculerComparaison(btn.dataset.id));
  });
}


/* ----------------------------------------------------------------------
   10. PANIER COULISSANT — construit une fois par page (si présent)
   ---------------------------------------------------------------------- */
function construirePanierCoulissantHtml() {
  return `
    <div class="panier-superposition" id="panier-superposition"></div>
    <aside class="panneau-panier" id="panneau-panier" role="dialog" aria-modal="true" aria-labelledby="titre-panier">
      <div class="entete-panier">
        <h2 id="titre-panier">🛒 Votre panier</h2>
        <button class="bouton-fermer-panier" id="bouton-fermer-panier" aria-label="Fermer le panier">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="corps-panier" id="corps-panier"></div>
      <div class="pied-panier" id="pied-panier" hidden>
        <div class="ligne-total">
          <span>Total de la commande</span>
          <span class="montant-total" id="montant-total-panier">0 MAD</span>
        </div>
        <button class="bouton-commander" id="bouton-commander">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
          Commander sur WhatsApp
        </button>
      </div>
    </aside>

    <div class="superposition" id="superposition-formulaire" role="dialog" aria-modal="true" aria-labelledby="titre-formulaire">
      <div class="modale-formulaire">
        <h2 id="titre-formulaire">📋 Presque terminé !</h2>
        <p class="sous-titre">Indiquez vos coordonnées pour que le bazar puisse préparer votre commande.</p>
        <div class="champ-formulaire" id="groupe-champ-nom">
          <label for="champ-nom-client">Votre nom complet</label>
          <input type="text" id="champ-nom-client" placeholder="ex : Yassine El Amrani" autocomplete="name">
          <span class="message-erreur-champ">Merci de saisir votre nom.</span>
        </div>
        <div class="champ-formulaire" id="groupe-champ-telephone">
          <label for="champ-telephone-client">Votre numéro de téléphone</label>
          <input type="tel" id="champ-telephone-client" placeholder="ex : 06 12 34 56 78" autocomplete="tel">
          <span class="message-erreur-champ">Merci de saisir un numéro de téléphone valide.</span>
        </div>
        <div class="actions-formulaire">
          <button class="bouton-secondaire" id="bouton-annuler-formulaire">Retour</button>
          <button class="bouton-whatsapp" id="bouton-envoyer-whatsapp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39c1.45.79 3.08 1.21 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.81 14.11c-.24.68-1.4 1.32-1.94 1.4-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.89-1.25-4.78-4.16-4.92-4.35-.14-.19-1.18-1.57-1.18-3 0-1.43.75-2.13 1.02-2.43.27-.29.58-.36.78-.36l.55.01c.18 0 .41-.02.64.49.24.55.81 1.9.88 2.04.07.14.11.3.02.49-.09.19-.13.3-.27.46-.14.16-.28.36-.4.49-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.07.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.68-.79.86-1.07.18-.28.36-.23.6-.14.24.09 1.55.73 1.81.86.26.13.44.19.5.3.07.11.07.63-.17 1.31z"/></svg>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  `;
}

function construireLignePanierHtml(produit, quantite) {
  return `
    <div class="ligne-panier" data-id-produit="${produit.id}">
      <img class="image-ligne-panier" src="${produit.image}" alt="${echapperHtml(produit.titre)}">
      <div class="details-ligne-panier">
        <a href="produit.html?id=${produit.id}" class="titre-ligne-panier">${echapperHtml(produit.titre)}</a>
        <span class="prix-unitaire-ligne">${formaterPrix(produit.prix)} MAD / unité</span>
        <div class="controles-ligne-panier">
          <div class="stepper-quantite">
            <button class="bouton-stepper" data-action="diminuer" data-id-produit="${produit.id}" aria-label="Diminuer la quantité">−</button>
            <span class="valeur-quantite">${quantite}</span>
            <button class="bouton-stepper" data-action="augmenter" data-id-produit="${produit.id}" aria-label="Augmenter la quantité">+</button>
          </div>
          <button class="bouton-supprimer-ligne" data-action="supprimer" data-id-produit="${produit.id}">Retirer</button>
        </div>
      </div>
    </div>
  `;
}

function rafraichirContenuPanier() {
  const corps = document.getElementById("corps-panier");
  const pied = document.getElementById("pied-panier");
  if (!corps) return;
  const montantTotal = document.getElementById("montant-total-panier");
  const entrees = Object.entries(panier);

  if (entrees.length === 0) {
    corps.innerHTML = `
      <div class="panier-vide">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <strong>Votre panier est vide</strong>
        Parcourez le catalogue et ajoutez vos articles préférés.
      </div>
    `;
    pied.hidden = true;
    return;
  }

  corps.innerHTML = entrees.map(([id, q]) => {
    const p = trouverProduitParId(id);
    return p ? construireLignePanierHtml(p, q) : "";
  }).join("");

  pied.hidden = false;
  montantTotal.textContent = formaterPrix(totalPanier()) + " MAD";
}

function ouvrirPanier() {
  rafraichirContenuPanier();
  document.getElementById("panier-superposition").classList.add("visible");
  document.getElementById("panneau-panier").classList.add("visible");
  document.body.style.overflow = "hidden";
}

function fermerPanier() {
  const sup = document.getElementById("panier-superposition");
  const pan = document.getElementById("panneau-panier");
  if (sup) sup.classList.remove("visible");
  if (pan) pan.classList.remove("visible");
  document.body.style.overflow = "";
}


/* ----------------------------------------------------------------------
   11. FORMULAIRE COMMANDE + ENVOI WHATSAPP
   ---------------------------------------------------------------------- */
function ouvrirFormulaireCommande() {
  if (nombreArticlesPanier() === 0) return;
  document.getElementById("superposition-formulaire").classList.add("visible");
}
function fermerFormulaireCommande() {
  document.getElementById("superposition-formulaire").classList.remove("visible");
}
function validerChampFormulaire(idGroupe, estValide) {
  const groupe = document.getElementById(idGroupe);
  groupe.classList.toggle("en-erreur", !estValide);
  return estValide;
}
function validerNumeroTelephone(numero) {
  const nettoye = numero.replace(/[\s.-]/g, "");
  return /^(0[5-7]\d{8}|(\+?212)[5-7]\d{8})$/.test(nettoye);
}

function construireMessageWhatsapp(nomClient, telephoneClient) {
  let lignes = [];
  lignes.push(`🛍️ *Nouvelle commande — ${SHOP_NAME}*`);
  lignes.push("");
  lignes.push(`👤 *Client :* ${nomClient}`);
  lignes.push(`📞 *Téléphone :* ${telephoneClient}`);
  lignes.push("");
  lignes.push("🧾 *Articles commandés :*");
  Object.entries(panier).forEach(([id, q]) => {
    const p = trouverProduitParId(id);
    if (!p) return;
    lignes.push(`• ${p.titre} — ${q} x ${formaterPrix(p.prix)} MAD = ${formaterPrix(p.prix * q)} MAD`);
  });
  lignes.push("");
  lignes.push(`💰 *Total : ${formaterPrix(totalPanier())} MAD*`);
  lignes.push("");
  lignes.push("📍 *Retrait en boutique*");
  lignes.push(`(${SHOP_NAME} — ${SHOP_CITY})`);
  lignes.push("");
  lignes.push("Merci pour votre commande ! 🙏");
  return lignes.join("\n");
}

function envoyerCommandeWhatsapp() {
  const champNom = document.getElementById("champ-nom-client");
  const champTelephone = document.getElementById("champ-telephone-client");
  const nomClient = champNom.value.trim();
  const telephoneClient = champTelephone.value.trim();

  const nomValide = validerChampFormulaire("groupe-champ-nom", nomClient.length >= 2);
  const telephoneValide = validerChampFormulaire("groupe-champ-telephone", validerNumeroTelephone(telephoneClient));
  if (!nomValide || !telephoneValide) return;

  const message = construireMessageWhatsapp(nomClient, telephoneClient);
  const lienWhatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(lienWhatsapp, "_blank");

  fermerFormulaireCommande();
  fermerPanier();
  panier = {};
  sauvegarderPanier();
  rafraichirBadges();
  champNom.value = "";
  champTelephone.value = "";
  afficherToast("Commande envoyée sur WhatsApp 🎉", "succes");
}


/* ----------------------------------------------------------------------
   12. ÉCOUTEURS PARTAGÉS (panier coulissant + formulaire)
   Appelé par chaque page après injection du header/panier dans le DOM.
   ---------------------------------------------------------------------- */
function initialiserEcouteursPartages() {
  const boutonOuvrirPanier = document.getElementById("bouton-ouvrir-panier");
  if (boutonOuvrirPanier) boutonOuvrirPanier.addEventListener("click", ouvrirPanier);

  const boutonFermerPanier = document.getElementById("bouton-fermer-panier");
  if (boutonFermerPanier) boutonFermerPanier.addEventListener("click", fermerPanier);

  const superpositionPanier = document.getElementById("panier-superposition");
  if (superpositionPanier) superpositionPanier.addEventListener("click", fermerPanier);

  const corpsPanier = document.getElementById("corps-panier");
  if (corpsPanier) {
    corpsPanier.addEventListener("click", (e) => {
      const bouton = e.target.closest("[data-action]");
      if (!bouton) return;
      const id = Number(bouton.dataset.idProduit);
      const action = bouton.dataset.action;
      if (action === "augmenter") modifierQuantitePanier(id, 1);
      else if (action === "diminuer") modifierQuantitePanier(id, -1);
      else if (action === "supprimer") supprimerDuPanier(id);
      rafraichirContenuPanier();
    });
  }

  const boutonCommander = document.getElementById("bouton-commander");
  if (boutonCommander) boutonCommander.addEventListener("click", ouvrirFormulaireCommande);

  const boutonAnnulerFormulaire = document.getElementById("bouton-annuler-formulaire");
  if (boutonAnnulerFormulaire) boutonAnnulerFormulaire.addEventListener("click", fermerFormulaireCommande);

  const boutonEnvoyerWhatsapp = document.getElementById("bouton-envoyer-whatsapp");
  if (boutonEnvoyerWhatsapp) boutonEnvoyerWhatsapp.addEventListener("click", envoyerCommandeWhatsapp);

  const superpositionFormulaire = document.getElementById("superposition-formulaire");
  if (superpositionFormulaire) {
    superpositionFormulaire.addEventListener("click", (e) => {
      if (e.target.id === "superposition-formulaire") fermerFormulaireCommande();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    fermerFormulaireCommande();
    fermerPanier();
    const supDetail = document.getElementById("superposition-detail");
    if (supDetail) supDetail.classList.remove("visible");
  });
}


/* ----------------------------------------------------------------------
   13. INITIALISATION COMMUNE — à appeler au DOMContentLoaded de CHAQUE page
   ---------------------------------------------------------------------- */
function initialiserCommun() {
  chargerEtatDepuisStockage();
  injecterHeaderFooter();

  // Injecter le panier coulissant + formulaire si la page a une zone prévue
  const zonePanier = document.getElementById("zone-panier-coulissant");
  if (zonePanier) zonePanier.innerHTML = construirePanierCoulissantHtml();

  rafraichirBadges();
  initialiserEcouteursPartages();
}
