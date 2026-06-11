const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'kern.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ────────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    username   TEXT    UNIQUE NOT NULL,
    email      TEXT    UNIQUE NOT NULL,
    password   TEXT    NOT NULL,
    kern_balance REAL  DEFAULT 100,
    noyau_shares REAL  DEFAULT 0,
    is_admin   INTEGER DEFAULT 0,
    avatar_color TEXT  DEFAULT '#6C63FF',
    created_at TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    type        TEXT NOT NULL,  -- 'transfer','task_reward','buy_noyau','sell_noyau','stake','unstake','stake_reward'
    from_user   INTEGER REFERENCES users(id),
    to_user     INTEGER REFERENCES users(id),
    amount      REAL NOT NULL,
    description TEXT,
    metadata    TEXT,           -- JSON blob for extra data
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT,
    category    TEXT NOT NULL,  -- 'micro','qualified','community'
    reward      REAL NOT NULL,
    difficulty  TEXT DEFAULT 'easy', -- easy / medium / hard
    icon        TEXT DEFAULT '⚡',
    is_active   INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS task_completions (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id   INTEGER NOT NULL REFERENCES users(id),
    task_id   INTEGER NOT NULL REFERENCES tasks(id),
    completed_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, task_id)
  );

  CREATE TABLE IF NOT EXISTS noyau_prices (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    price     REAL NOT NULL,
    btc_ref   REAL,
    recorded_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS noyau_orders (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id   INTEGER NOT NULL REFERENCES users(id),
    type      TEXT NOT NULL,  -- 'buy' | 'sell'
    shares    REAL NOT NULL,
    price     REAL NOT NULL,
    kern_amount REAL NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS stakes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    amount      REAL NOT NULL,
    duration    INTEGER NOT NULL,   -- days: 7, 30, 90
    apy         REAL NOT NULL,
    status      TEXT DEFAULT 'active',  -- active | completed | cancelled
    started_at  TEXT DEFAULT (datetime('now')),
    ends_at     TEXT NOT NULL,
    reward_paid REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS governance_proposals (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT,
    status      TEXT DEFAULT 'active',  -- active | passed | rejected
    votes_for   INTEGER DEFAULT 0,
    votes_against INTEGER DEFAULT 0,
    ends_at     TEXT NOT NULL,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS governance_votes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    proposal_id INTEGER NOT NULL REFERENCES governance_proposals(id),
    vote        INTEGER NOT NULL,  -- 1 = for, 0 = against
    created_at  TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, proposal_id)
  );
`);

// ── Seed data ─────────────────────────────────────────────────────────────────
async function seed() {
  const existing = db.prepare('SELECT COUNT(*) as c FROM users').get();
  if (existing.c > 0) {
    console.log('Database already seeded.');
    return;
  }

  // Admin user
  const adminHash = await bcrypt.hash('admin123', 12);
  db.prepare(`INSERT INTO users (username, email, password, kern_balance, is_admin, avatar_color)
              VALUES (?, ?, ?, ?, 1, '#FF6B35')`).run('admin', 'admin@kern.io', adminHash, 9999);

  // Demo user
  const demoHash = await bcrypt.hash('demo123', 12);
  db.prepare(`INSERT INTO users (username, email, password, kern_balance, noyau_shares, avatar_color)
              VALUES (?, ?, ?, ?, ?, ?)`).run('demo', 'demo@kern.io', demoHash, 500, 10, '#6C63FF');

  // Seed tasks
  const tasks = [
    { title: 'Vérifier votre adresse email', description: 'Confirmez votre adresse email pour sécuriser votre compte.', category: 'micro', reward: 5, difficulty: 'easy', icon: '📧' },
    { title: 'Compléter votre profil', description: 'Ajoutez une photo et une bio à votre profil.', category: 'micro', reward: 10, difficulty: 'easy', icon: '👤' },
    { title: 'Activer 2FA', description: 'Activez l\'authentification à deux facteurs pour protéger votre compte.', category: 'micro', reward: 20, difficulty: 'easy', icon: '🔐' },
    { title: 'Inviter un ami', description: 'Invitez un ami à rejoindre la plateforme Kern.', category: 'community', reward: 50, difficulty: 'medium', icon: '🤝' },
    { title: 'Premier transfert', description: 'Effectuez votre premier transfert de Kern vers un autre utilisateur.', category: 'micro', reward: 15, difficulty: 'easy', icon: '💸' },
    { title: 'Staker des Kern', description: 'Mettez en staking au moins 50 Kern pendant 7 jours.', category: 'qualified', reward: 30, difficulty: 'medium', icon: '🔒' },
    { title: 'Acheter du Noyau', description: 'Achetez votre première part de l\'actif Noyau.', category: 'qualified', reward: 25, difficulty: 'medium', icon: '💎' },
    { title: 'Voter sur une proposition', description: 'Participez à la gouvernance en votant sur une proposition.', category: 'community', reward: 20, difficulty: 'easy', icon: '🗳️' },
    { title: 'Écrire une revue', description: 'Rédigez un avis sur le Sanctuaire Numérique.', category: 'community', reward: 40, difficulty: 'medium', icon: '✍️' },
    { title: 'Étude de marché', description: 'Répondez à 10 questions sur vos habitudes numériques.', category: 'qualified', reward: 75, difficulty: 'hard', icon: '📊' },
    { title: 'Test de sécurité', description: 'Effectuez un test de simulation de phishing et obtenez 100%.', category: 'qualified', reward: 60, difficulty: 'hard', icon: '🛡️' },
    { title: 'Partager sur les réseaux', description: 'Partagez Kern sur au moins un réseau social.', category: 'community', reward: 35, difficulty: 'medium', icon: '📣' },
  ];

  const insertTask = db.prepare(`INSERT INTO tasks (title, description, category, reward, difficulty, icon) VALUES (?, ?, ?, ?, ?, ?)`);
  tasks.forEach(t => insertTask.run(t.title, t.description, t.category, t.reward, t.difficulty, t.icon));

  // Seed governance proposals
  const proposals = [
    { title: 'Augmenter le rendement du staking 30j à 12% APY', description: 'Proposition d\'augmenter le rendement annuel pour les stakes de 30 jours de 8% à 12% APY, afin de stimuler la participation à long terme.', ends_at: new Date(Date.now() + 7 * 86400000).toISOString() },
    { title: 'Intégrer le paiement Kern pour Sanctuaire Pro', description: 'Permettre aux utilisateurs d\'accéder au niveau "Sanctuaire Pro" directement avec des Kern, sans conversion nécessaire.', ends_at: new Date(Date.now() + 14 * 86400000).toISOString() },
    { title: 'Créer un fonds communautaire de 10 000 Kern', description: 'Allouer 10 000 Kern à un fonds communautaire géré par les détenteurs de Kern stakés, pour financer des projets open-source.', ends_at: new Date(Date.now() + 10 * 86400000).toISOString() },
  ];

  const insertProposal = db.prepare(`INSERT INTO governance_proposals (title, description, ends_at, votes_for, votes_against) VALUES (?, ?, ?, ?, ?)`);
  proposals.forEach((p, i) => insertProposal.run(p.title, p.description, p.ends_at, Math.floor(Math.random() * 150) + 20, Math.floor(Math.random() * 80)));

  // Seed initial Noyau price
  db.prepare(`INSERT INTO noyau_prices (price, btc_ref) VALUES (?, ?)`).run(42.50, 43000);

  console.log('✅ Database seeded successfully.');
}

seed().then(() => {
  db.close();
  console.log('Database initialization complete.');
}).catch(e => {
  console.error('Seed error:', e);
  db.close();
});

module.exports = db;
