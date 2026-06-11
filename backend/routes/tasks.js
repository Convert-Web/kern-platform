const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');

// GET /api/tasks
router.get('/', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const { category } = req.query;

  let query = `
    SELECT t.*, 
      CASE WHEN tc.id IS NOT NULL THEN 1 ELSE 0 END as completed
    FROM tasks t
    LEFT JOIN task_completions tc ON tc.task_id=t.id AND tc.user_id=?
    WHERE t.is_active=1
  `;
  const params = [req.session.userId];

  if (category && ['micro','qualified','community'].includes(category)) {
    query += ' AND t.category=?';
    params.push(category);
  }
  query += ' ORDER BY t.reward DESC';

  const tasks = db.prepare(query).all(...params);
  res.json({ tasks });
});

// POST /api/tasks/:id/complete
router.post('/:id/complete', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const taskId = parseInt(req.params.id);

  const task = db.prepare('SELECT * FROM tasks WHERE id=? AND is_active=1').get(taskId);
  if (!task) return res.status(404).json({ error: 'Tâche introuvable.' });

  const alreadyDone = db.prepare(
    'SELECT id FROM task_completions WHERE user_id=? AND task_id=?'
  ).get(req.session.userId, taskId);
  if (alreadyDone) return res.status(409).json({ error: 'Tâche déjà accomplie.' });

  // Simulate task completion (random success/challenge for qualified tasks)
  if (task.difficulty === 'hard' && Math.random() < 0.1) {
    return res.status(400).json({ error: 'Tâche échouée. Réessayez dans quelques instants.' });
  }

  const txn = db.transaction(() => {
    db.prepare('INSERT INTO task_completions (user_id, task_id) VALUES (?, ?)').run(req.session.userId, taskId);
    db.prepare('UPDATE users SET kern_balance = kern_balance + ? WHERE id=?').run(task.reward, req.session.userId);
    db.prepare(`INSERT INTO transactions (type, to_user, amount, description) VALUES ('task_reward', ?, ?, ?)`).run(
      req.session.userId, task.reward, `Tâche accomplie : ${task.title}`
    );
    return db.prepare('SELECT kern_balance FROM users WHERE id=?').get(req.session.userId);
  });

  const updated = txn();
  res.json({ ok: true, reward: task.reward, newBalance: updated.kern_balance });
});

module.exports = router;
