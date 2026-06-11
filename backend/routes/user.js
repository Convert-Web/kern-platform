const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');

// GET /api/user/profile
router.get('/profile', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const user = db.prepare(`
    SELECT id, username, email, kern_balance, noyau_shares, avatar_color, is_admin, created_at
    FROM users WHERE id=?
  `).get(req.session.userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
  res.json(user);
});

// GET /api/user/dashboard
router.get('/dashboard', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const user = db.prepare(`
    SELECT id, username, kern_balance, noyau_shares, avatar_color
    FROM users WHERE id=?
  `).get(req.session.userId);

  const recentTx = db.prepare(`
    SELECT t.*, u1.username as from_name, u2.username as to_name
    FROM transactions t
    LEFT JOIN users u1 ON t.from_user = u1.id
    LEFT JOIN users u2 ON t.to_user   = u2.id
    WHERE t.from_user=? OR t.to_user=?
    ORDER BY t.id DESC LIMIT 8
  `).all(req.session.userId, req.session.userId);

  const noyauPrice = db.prepare('SELECT price FROM noyau_prices ORDER BY id DESC LIMIT 1').get();
  const noyauHistory = db.prepare('SELECT price, recorded_at FROM noyau_prices ORDER BY id DESC LIMIT 60').all().reverse();

  const activeStakes = db.prepare(`
    SELECT SUM(amount) as total FROM stakes WHERE user_id=? AND status='active'
  `).get(req.session.userId);

  res.json({
    user,
    recentTransactions: recentTx,
    noyauPrice: noyauPrice?.price || 42.5,
    noyauHistory,
    stakedAmount: activeStakes?.total || 0
  });
});

// GET /api/user/history
router.get('/history', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  const tx = db.prepare(`
    SELECT t.*, u1.username as from_name, u2.username as to_name
    FROM transactions t
    LEFT JOIN users u1 ON t.from_user = u1.id
    LEFT JOIN users u2 ON t.to_user   = u2.id
    WHERE t.from_user=? OR t.to_user=?
    ORDER BY t.id DESC LIMIT ? OFFSET ?
  `).all(req.session.userId, req.session.userId, limit, offset);

  const total = db.prepare(`
    SELECT COUNT(*) as c FROM transactions WHERE from_user=? OR to_user=?
  `).get(req.session.userId, req.session.userId);

  res.json({ transactions: tx, total: total.c, page, pages: Math.ceil(total.c / limit) });
});

// GET /api/user/search?q=
router.get('/search', requireAuth, (req, res) => {
  const q = req.query.q?.trim();
  if (!q || q.length < 2) return res.json({ users: [] });
  const db = req.app.locals.db;
  const users = db.prepare(`
    SELECT id, username, avatar_color FROM users
    WHERE username LIKE ? AND id != ?
    LIMIT 5
  `).all(`%${q}%`, req.session.userId);
  res.json({ users });
});

module.exports = router;
