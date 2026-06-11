const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', requireAdmin, (req, res) => {
  const db = req.app.locals.db;
  const users = db.prepare('SELECT COUNT(*) as c FROM users').get();
  const txTotal = db.prepare('SELECT SUM(amount) as s FROM transactions').get();
  const stakeActive = db.prepare('SELECT SUM(amount) as s FROM stakes WHERE status=?').get('active');
  const noyauOrders = db.prepare('SELECT COUNT(*) as c FROM noyau_orders').get();
  res.json({ users: users.c, txVolume: txTotal.s, staked: stakeActive.s, orders: noyauOrders.c });
});

// GET /api/admin/users
router.get('/users', requireAdmin, (req, res) => {
  const db = req.app.locals.db;
  const users = db.prepare('SELECT id, username, email, kern_balance, noyau_shares, is_admin, created_at FROM users ORDER BY id DESC').all();
  res.json({ users });
});

// POST /api/admin/tasks
router.post('/tasks', requireAdmin, (req, res) => {
  const { title, description, category, reward, difficulty, icon } = req.body;
  if (!title || !category || !reward) return res.status(400).json({ error: 'Champs requis manquants.' });
  const db = req.app.locals.db;
  const result = db.prepare(`INSERT INTO tasks (title, description, category, reward, difficulty, icon) VALUES (?,?,?,?,?,?)`).run(title, description||'', category, parseFloat(reward), difficulty||'easy', icon||'⚡');
  res.json({ ok: true, id: result.lastInsertRowid });
});

// POST /api/admin/governance
router.post('/governance', requireAdmin, (req, res) => {
  const { title, description, duration_days } = req.body;
  if (!title) return res.status(400).json({ error: 'Titre requis.' });
  const db = req.app.locals.db;
  const days = parseInt(duration_days) || 7;
  const endsAt = new Date(Date.now() + days * 86400000).toISOString();
  const result = db.prepare('INSERT INTO governance_proposals (title, description, ends_at) VALUES (?,?,?)').run(title, description||'', endsAt);
  res.json({ ok: true, id: result.lastInsertRowid });
});

// POST /api/admin/reward/:userId
router.post('/reward/:userId', requireAdmin, (req, res) => {
  const { amount, reason } = req.body;
  const db = req.app.locals.db;
  const amt = parseFloat(amount);
  if (isNaN(amt) || amt <= 0) return res.status(400).json({ error: 'Montant invalide.' });
  db.prepare('UPDATE users SET kern_balance=kern_balance+? WHERE id=?').run(amt, req.params.userId);
  db.prepare(`INSERT INTO transactions (type, to_user, amount, description) VALUES ('task_reward', ?, ?, ?)`).run(req.params.userId, amt, reason || 'Bonus admin');
  res.json({ ok: true });
});

module.exports = router;
