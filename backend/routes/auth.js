const router = require('express').Router();
const bcrypt = require('bcryptjs');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  if (username.length < 3 || username.length > 20)
    return res.status(400).json({ error: 'Pseudo : 3 à 20 caractères.' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Mot de passe : 6 caractères minimum.' });
  if (!/^[a-zA-Z0-9_.-]+$/.test(username))
    return res.status(400).json({ error: 'Pseudo : caractères alphanumériques uniquement.' });

  const db = req.app.locals.db;
  try {
    const exists = db.prepare('SELECT id FROM users WHERE username=? OR email=?').get(username, email);
    if (exists) return res.status(409).json({ error: 'Pseudo ou email déjà utilisé.' });

    const hash = await bcrypt.hash(password, 12);
    const colors = ['#6C63FF','#FF6B6B','#4ECDC4','#FFD93D','#6BCB77','#FF8B94'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const result = db.prepare(
      `INSERT INTO users (username, email, password, avatar_color) VALUES (?, ?, ?, ?)`
    ).run(username, email.toLowerCase(), hash, color);

    // Welcome bonus
    db.prepare(`INSERT INTO transactions (type, to_user, amount, description) VALUES ('task_reward', ?, ?, ?)`).run(result.lastInsertRowid, 100, 'Bonus de bienvenue');

    req.session.userId = result.lastInsertRowid;
    req.session.username = username;
    req.session.isAdmin = 0;

    res.json({ ok: true, username });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Identifiants requis.' });

  const db = req.app.locals.db;
  try {
    const user = db.prepare('SELECT * FROM users WHERE username=?').get(username);
    if (!user) return res.status(401).json({ error: 'Identifiants incorrects.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Identifiants incorrects.' });

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.isAdmin = user.is_admin;

    res.json({ ok: true, username: user.username, isAdmin: user.is_admin });
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (!req.session?.userId) return res.json({ authenticated: false });
  res.json({ authenticated: true, username: req.session.username, isAdmin: req.session.isAdmin });
});

module.exports = router;
