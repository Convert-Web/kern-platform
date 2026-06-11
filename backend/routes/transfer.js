const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');

// POST /api/transfer
router.post('/', requireAuth, (req, res) => {
  const { to_username, amount, note } = req.body;
  const db = req.app.locals.db;

  if (!to_username || !amount) return res.status(400).json({ error: 'Destinataire et montant requis.' });
  const amt = parseFloat(amount);
  if (isNaN(amt) || amt <= 0) return res.status(400).json({ error: 'Montant invalide.' });
  if (amt < 1) return res.status(400).json({ error: 'Montant minimum : 1 Kern.' });
  if (to_username === req.session.username) return res.status(400).json({ error: 'Vous ne pouvez pas vous envoyer des Kern.' });

  const sender = db.prepare('SELECT * FROM users WHERE id=?').get(req.session.userId);
  if (sender.kern_balance < amt) return res.status(400).json({ error: 'Solde insuffisant.' });

  const recipient = db.prepare('SELECT * FROM users WHERE username=?').get(to_username);
  if (!recipient) return res.status(404).json({ error: 'Utilisateur introuvable.' });

  const txn = db.transaction(() => {
    db.prepare('UPDATE users SET kern_balance = kern_balance - ? WHERE id=?').run(amt, sender.id);
    db.prepare('UPDATE users SET kern_balance = kern_balance + ? WHERE id=?').run(amt, recipient.id);
    db.prepare(`INSERT INTO transactions (type, from_user, to_user, amount, description) VALUES ('transfer', ?, ?, ?, ?)`).run(
      sender.id, recipient.id, amt, note || `Transfert vers ${recipient.username}`
    );
    return db.prepare('SELECT kern_balance FROM users WHERE id=?').get(sender.id);
  });

  const updated = txn();
  res.json({ ok: true, newBalance: updated.kern_balance, recipient: recipient.username, amount: amt });
});

// GET /api/transfer/link/:username/:amount
router.get('/link/:username/:amount', (req, res) => {
  const { username, amount } = req.params;
  res.json({ link: `/pay?to=${username}&amount=${amount}`, username, amount });
});

module.exports = router;
