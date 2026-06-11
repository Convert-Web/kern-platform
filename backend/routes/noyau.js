const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');

// GET /api/noyau/price
router.get('/price', (req, res) => {
  const db = req.app.locals.db;
  const current = db.prepare('SELECT price, btc_ref, recorded_at FROM noyau_prices ORDER BY id DESC LIMIT 1').get();
  const history = db.prepare('SELECT price, recorded_at FROM noyau_prices ORDER BY id DESC LIMIT 120').all().reverse();
  res.json({ current, history });
});

// GET /api/noyau/portfolio
router.get('/portfolio', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const user = db.prepare('SELECT kern_balance, noyau_shares FROM users WHERE id=?').get(req.session.userId);
  const price = db.prepare('SELECT price FROM noyau_prices ORDER BY id DESC LIMIT 1').get();
  const orders = db.prepare(`
    SELECT * FROM noyau_orders WHERE user_id=? ORDER BY id DESC LIMIT 20
  `).all(req.session.userId);

  res.json({
    shares: user.noyau_shares,
    kernBalance: user.kern_balance,
    currentPrice: price?.price || 42.5,
    portfolioValue: (user.noyau_shares * (price?.price || 42.5)).toFixed(2),
    orders
  });
});

// POST /api/noyau/buy
router.post('/buy', requireAuth, (req, res) => {
  const { amount_kern } = req.body;
  const db = req.app.locals.db;
  const amt = parseFloat(amount_kern);
  if (isNaN(amt) || amt <= 0) return res.status(400).json({ error: 'Montant invalide.' });

  const user = db.prepare('SELECT * FROM users WHERE id=?').get(req.session.userId);
  if (user.kern_balance < amt) return res.status(400).json({ error: 'Solde Kern insuffisant.' });

  const price = db.prepare('SELECT price FROM noyau_prices ORDER BY id DESC LIMIT 1').get();
  const currentPrice = price?.price || 42.5;
  const sharesBought = amt / currentPrice;

  const txn = db.transaction(() => {
    db.prepare('UPDATE users SET kern_balance=kern_balance-?, noyau_shares=noyau_shares+? WHERE id=?').run(amt, sharesBought, user.id);
    db.prepare('INSERT INTO noyau_orders (user_id, type, shares, price, kern_amount) VALUES (?,?,?,?,?)').run(user.id, 'buy', sharesBought, currentPrice, amt);
    db.prepare(`INSERT INTO transactions (type, from_user, amount, description) VALUES ('buy_noyau', ?, ?, ?)`).run(user.id, amt, `Achat Noyau: ${sharesBought.toFixed(4)} parts à ${currentPrice} K`);
    return db.prepare('SELECT kern_balance, noyau_shares FROM users WHERE id=?').get(user.id);
  });

  const updated = txn();
  res.json({ ok: true, sharesBought, price: currentPrice, ...updated });
});

// POST /api/noyau/sell
router.post('/sell', requireAuth, (req, res) => {
  const { shares } = req.body;
  const db = req.app.locals.db;
  const sharesToSell = parseFloat(shares);
  if (isNaN(sharesToSell) || sharesToSell <= 0) return res.status(400).json({ error: 'Montant invalide.' });

  const user = db.prepare('SELECT * FROM users WHERE id=?').get(req.session.userId);
  if (user.noyau_shares < sharesToSell) return res.status(400).json({ error: 'Parts insuffisantes.' });

  const price = db.prepare('SELECT price FROM noyau_prices ORDER BY id DESC LIMIT 1').get();
  const currentPrice = price?.price || 42.5;
  const kernReceived = sharesToSell * currentPrice;

  const txn = db.transaction(() => {
    db.prepare('UPDATE users SET kern_balance=kern_balance+?, noyau_shares=noyau_shares-? WHERE id=?').run(kernReceived, sharesToSell, user.id);
    db.prepare('INSERT INTO noyau_orders (user_id, type, shares, price, kern_amount) VALUES (?,?,?,?,?)').run(user.id, 'sell', sharesToSell, currentPrice, kernReceived);
    db.prepare(`INSERT INTO transactions (type, to_user, amount, description) VALUES ('sell_noyau', ?, ?, ?)`).run(user.id, kernReceived, `Vente Noyau: ${sharesToSell.toFixed(4)} parts à ${currentPrice} K`);
    return db.prepare('SELECT kern_balance, noyau_shares FROM users WHERE id=?').get(user.id);
  });

  const updated = txn();
  res.json({ ok: true, sharesToSell, kernReceived, price: currentPrice, ...updated });
});

module.exports = router;
