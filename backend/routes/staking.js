const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');

const APY = { 7: 5, 30: 8, 90: 14 }; // APY by duration

// GET /api/staking
router.get('/', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const stakes = db.prepare(`SELECT * FROM stakes WHERE user_id=? ORDER BY id DESC`).all(req.session.userId);
  const user = db.prepare('SELECT kern_balance FROM users WHERE id=?').get(req.session.userId);
  res.json({ stakes, kernBalance: user.kern_balance, apy: APY });
});

// POST /api/staking/stake
router.post('/stake', requireAuth, (req, res) => {
  const { amount, duration } = req.body;
  const db = req.app.locals.db;
  const amt = parseFloat(amount);
  const dur = parseInt(duration);

  if (isNaN(amt) || amt < 10) return res.status(400).json({ error: 'Minimum 10 Kern.' });
  if (![7, 30, 90].includes(dur)) return res.status(400).json({ error: 'Durée invalide.' });

  const user = db.prepare('SELECT * FROM users WHERE id=?').get(req.session.userId);
  if (user.kern_balance < amt) return res.status(400).json({ error: 'Solde insuffisant.' });

  const apy = APY[dur];
  const endsAt = new Date(Date.now() + dur * 24 * 60 * 60 * 1000).toISOString();

  const txn = db.transaction(() => {
    db.prepare('UPDATE users SET kern_balance=kern_balance-? WHERE id=?').run(amt, user.id);
    db.prepare('INSERT INTO stakes (user_id, amount, duration, apy, ends_at) VALUES (?,?,?,?,?)').run(user.id, amt, dur, apy, endsAt);
    db.prepare(`INSERT INTO transactions (type, from_user, amount, description) VALUES ('stake', ?, ?, ?)`).run(user.id, amt, `Staking de ${amt} Kern — ${dur} jours @ ${apy}% APY`);
    return db.prepare('SELECT kern_balance FROM users WHERE id=?').get(user.id);
  });

  const updated = txn();
  const estimatedReward = amt * (apy / 100) * (dur / 365);
  res.json({ ok: true, amount: amt, duration: dur, apy, estimatedReward: +estimatedReward.toFixed(4), newBalance: updated.kern_balance, endsAt });
});

// POST /api/staking/:id/cancel
router.post('/:id/cancel', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const stake = db.prepare('SELECT * FROM stakes WHERE id=? AND user_id=? AND status=?').get(req.params.id, req.session.userId, 'active');
  if (!stake) return res.status(404).json({ error: 'Position introuvable.' });

  // 10% penalty for early cancellation
  const penalty = stake.amount * 0.1;
  const returned = stake.amount - penalty;

  const txn = db.transaction(() => {
    db.prepare('UPDATE users SET kern_balance=kern_balance+? WHERE id=?').run(returned, req.session.userId);
    db.prepare('UPDATE stakes SET status=? WHERE id=?').run('cancelled', stake.id);
    db.prepare(`INSERT INTO transactions (type, to_user, amount, description) VALUES ('unstake', ?, ?, ?)`).run(req.session.userId, returned, `Staking annulé (pénalité 10%): ${returned.toFixed(2)} Kern récupérés`);
    return db.prepare('SELECT kern_balance FROM users WHERE id=?').get(req.session.userId);
  });

  const updated = txn();
  res.json({ ok: true, returned, penalty, newBalance: updated.kern_balance });
});

module.exports = router;
