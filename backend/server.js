const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Database ──────────────────────────────────────────────────────────────────
const DB_PATH = path.join(__dirname, 'kern.db');
let db;
try {
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
} catch (e) {
  console.error('DB not found. Run: npm run init-db');
  process.exit(1);
}
app.locals.db = db;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'kern-secret-2025-xK9mL#pQ',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

// Rate limiting
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', apiLimiter);

// Static files
app.use(express.static(path.join(__dirname, '../frontend')));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/user',       require('./routes/user'));
app.use('/api/tasks',      require('./routes/tasks'));
app.use('/api/transfer',   require('./routes/transfer'));
app.use('/api/noyau',      require('./routes/noyau'));
app.use('/api/staking',    require('./routes/staking'));
app.use('/api/governance', require('./routes/governance'));
app.use('/api/admin',      require('./routes/admin'));

// ── SPA fallback ──────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── Noyau price updater ───────────────────────────────────────────────────────
const fetch = require('node-fetch');

async function updateNoyauPrice() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', { timeout: 5000 });
    const data = await res.json();
    const btcPrice = data?.bitcoin?.usd;
    if (!btcPrice) return;

    const last = db.prepare('SELECT price FROM noyau_prices ORDER BY id DESC LIMIT 1').get();
    const lastPrice = last ? last.price : 42.50;

    // Noyau is BTC/1000 + random noise, capped at +5% per update
    const btcDerivedBase = btcPrice / 1000;
    const noise = (Math.random() - 0.48) * 0.02; // slight upward bias
    let newPrice = lastPrice * (1 + noise);

    // Cap daily change at +5%
    const maxUp = lastPrice * 1.05;
    const maxDown = lastPrice * 0.90;
    newPrice = Math.max(maxDown, Math.min(maxUp, newPrice));

    // Blend with BTC reference (30% BTC, 70% momentum)
    newPrice = 0.3 * btcDerivedBase + 0.7 * newPrice;
    newPrice = Math.max(0.01, +newPrice.toFixed(4));

    db.prepare('INSERT INTO noyau_prices (price, btc_ref) VALUES (?, ?)').run(newPrice, btcPrice);

    // Keep only last 500 price points
    db.prepare('DELETE FROM noyau_prices WHERE id NOT IN (SELECT id FROM noyau_prices ORDER BY id DESC LIMIT 500)').run();

  } catch (e) {
    // Fallback: random walk
    const last = db.prepare('SELECT price FROM noyau_prices ORDER BY id DESC LIMIT 1').get();
    const lastPrice = last ? last.price : 42.50;
    const noise = (Math.random() - 0.48) * 0.015;
    const newPrice = Math.max(0.01, +(lastPrice * (1 + noise)).toFixed(4));
    db.prepare('INSERT INTO noyau_prices (price, btc_ref) VALUES (?, NULL)').run(newPrice);
  }
}

// Update every 60 seconds
setInterval(updateNoyauPrice, 60000);
updateNoyauPrice(); // initial call

// ── Staking rewards cron ──────────────────────────────────────────────────────
function processStakingRewards() {
  const now = new Date().toISOString();
  const expired = db.prepare(`SELECT * FROM stakes WHERE status='active' AND ends_at <= ?`).all(now);
  
  expired.forEach(stake => {
    const reward = stake.amount * (stake.apy / 100) * (stake.duration / 365);
    const total = stake.amount + reward;

    db.prepare('UPDATE users SET kern_balance = kern_balance + ? WHERE id = ?').run(total, stake.user_id);
    db.prepare('UPDATE stakes SET status=?, reward_paid=? WHERE id=?').run('completed', reward, stake.id);
    db.prepare(`INSERT INTO transactions (type, to_user, amount, description) VALUES ('unstake', ?, ?, ?)`).run(stake.user_id, total, `Staking terminé – principal + récompense`);
  });
}

setInterval(processStakingRewards, 60000);
processStakingRewards();

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🔐 Kern Platform running at http://localhost:${PORT}`);
  console.log(`   Admin: admin / admin123`);
  console.log(`   Demo:  demo  / demo123\n`);
});
