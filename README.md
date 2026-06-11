# kern — Plateforme d'Économie Numérique Fermée

> Une plateforme financière haut de gamme avec sa propre monnaie interne **Kern**, un actif d'investissement **Noyau**, du staking avec gouvernance, et le service **Sanctuaire Numérique**.

![Design premium dark mode](https://img.shields.io/badge/design-premium%20dark-7C6FF7)
![Stack](https://img.shields.io/badge/stack-Node.js%20%2B%20SQLite-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Fonctionnalités

- **Authentification** sécurisée (bcrypt + sessions)
- **Dashboard** avec solde animé, graphique en temps réel, transactions récentes
- **Tâches rémunérées** en Kern (micro / qualifiées / communauté)
- **Transfert de Kern** instantané avec recherche d'utilisateur et QR simulé
- **Bourse Noyau** : graphique canvas temps réel, achat/vente de parts
- **Staking** 7/30/90 jours avec APY, barre de progression et annulation anticipée
- **Gouvernance** : votes sur propositions réservés aux stakers
- **Profil** : historique paginé, statistiques personnelles
- **Admin** : gestion des tâches, propositions, récompenses manuelles
- **Prix Noyau** : dérivé du BTC réel (CoinGecko), mis à jour toutes les 60 secondes

---

## 🚀 Installation rapide

### Prérequis
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### 1. Cloner / Décompresser le projet

```bash
cd kern-platform
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Initialiser la base de données

```bash
npm run init-db
```

Cette commande crée `backend/kern.db` et insère les données de démonstration :
- Utilisateur admin : `admin` / `admin123`
- Utilisateur démo  : `demo` / `demo123`
- 12 tâches prédéfinies
- 3 propositions de gouvernance
- Un prix Noyau initial

### 4. Lancer le serveur

```bash
npm start
```

ou en mode développement avec rechargement automatique :

```bash
npm run dev
```

### 5. Ouvrir dans le navigateur

```
http://localhost:3000
```

---

## 🗂 Structure du projet

```
kern-platform/
├── backend/
│   ├── server.js          # Point d'entrée Express
│   ├── initDb.js          # Script d'initialisation BDD
│   ├── kern.db            # Base SQLite (créée au runtime)
│   ├── middleware/
│   │   └── auth.js        # Middleware d'authentification
│   └── routes/
│       ├── auth.js        # POST /api/auth/*
│       ├── user.js        # GET /api/user/*
│       ├── tasks.js       # GET/POST /api/tasks/*
│       ├── transfer.js    # POST /api/transfer
│       ├── noyau.js       # GET/POST /api/noyau/*
│       ├── staking.js     # GET/POST /api/staking/*
│       ├── governance.js  # GET/POST /api/governance/*
│       └── admin.js       # /api/admin/* (protégé)
├── frontend/
│   ├── index.html         # SPA shell
│   ├── css/
│   │   ├── main.css       # Design system, layout, composants
│   │   ├── components.css # Composants spécifiques
│   │   └── animations.css # Keyframes et effets
│   └── js/
│       ├── api.js         # Client API fetch
│       ├── charts.js      # Graphiques canvas maison
│       ├── ui.js          # Helpers UI (toasts, animations…)
│       ├── app.js         # Contrôleur principal SPA
│       └── pages/
│           ├── dashboard.js
│           ├── tasks.js
│           ├── transfer.js
│           ├── noyau.js
│           ├── staking.js
│           └── profile.js
├── package.json
├── .gitignore
└── README.md
```

---

## 🔌 API Reference

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | /api/auth/register | — | Créer un compte |
| POST | /api/auth/login | — | Se connecter |
| POST | /api/auth/logout | — | Se déconnecter |
| GET  | /api/auth/me | — | Vérifier la session |
| GET  | /api/user/dashboard | ✓ | Données dashboard complètes |
| GET  | /api/user/profile | ✓ | Profil utilisateur |
| GET  | /api/user/history | ✓ | Historique paginé |
| GET  | /api/user/search?q= | ✓ | Recherche d'utilisateurs |
| GET  | /api/tasks | ✓ | Liste des tâches |
| POST | /api/tasks/:id/complete | ✓ | Accomplir une tâche |
| POST | /api/transfer | ✓ | Envoyer des Kern |
| GET  | /api/noyau/price | — | Prix actuel + historique |
| GET  | /api/noyau/portfolio | ✓ | Portfolio de l'utilisateur |
| POST | /api/noyau/buy | ✓ | Acheter des parts |
| POST | /api/noyau/sell | ✓ | Vendre des parts |
| GET  | /api/staking | ✓ | Positions de staking |
| POST | /api/staking/stake | ✓ | Créer une position |
| POST | /api/staking/:id/cancel | ✓ | Annuler (pénalité 10%) |
| GET  | /api/governance | ✓ | Propositions + votes |
| POST | /api/governance/:id/vote | ✓ | Voter (requis: staking ≥10K) |
| GET  | /api/admin/stats | Admin | Statistiques globales |
| GET  | /api/admin/users | Admin | Liste utilisateurs |
| POST | /api/admin/tasks | Admin | Créer une tâche |
| POST | /api/admin/governance | Admin | Créer une proposition |
| POST | /api/admin/reward/:id | Admin | Récompense manuelle |

---

## 💰 Modèle économique Kern

| Action | Gain/Coût |
|--------|-----------|
| Inscription | +100 K |
| Tâche micro | +5 à +20 K |
| Tâche qualifiée | +25 à +75 K |
| Tâche communauté | +20 à +50 K |
| Transfert | 0 frais |
| Sanctuaire Numérique | 250 K |
| Staking 7j | +5% APY |
| Staking 30j | +8% APY |
| Staking 90j | +14% APY |
| Annulation staking | -10% pénalité |

---

## ⚙️ Configuration

Variables d'environnement optionnelles :

```bash
PORT=3000               # Port du serveur (défaut: 3000)
SESSION_SECRET=xxx      # Secret de session (défaut: valeur en dur, à changer en prod)
```

---

## 🔒 Sécurité

- Mots de passe hachés avec **bcrypt** (salt rounds: 12)
- Sessions sécurisées via **express-session**
- Validation des entrées côté serveur sur toutes les routes
- Rate limiting : 200 requêtes / 15 minutes par IP
- Headers de sécurité via **helmet**
- Protection CSRF implicite (cookie SameSite)
- Prévention des doublons de tâches (UNIQUE constraint)
- Transactions SQLite atomiques pour les opérations financières

---

## 📦 Créer le ZIP pour GitHub

```bash
# Depuis le dossier parent
zip -r kern-platform.zip kern-platform/ \
  --exclude "kern-platform/node_modules/*" \
  --exclude "kern-platform/backend/kern.db" \
  --exclude "kern-platform/.DS_Store"
```

---

## 🛠 Développement

```bash
# Réinitialiser la BDD
rm backend/kern.db && npm run init-db

# Lancer en mode dev (nodemon)
npm run dev
```

---

## 📄 Licence

MIT — Libre d'utilisation et de modification.
