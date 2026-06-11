const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');

// GET /api/governance
router.get('/', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const proposals = db.prepare(`
    SELECT p.*,
      CASE WHEN v.id IS NOT NULL THEN v.vote ELSE NULL END as my_vote
    FROM governance_proposals p
    LEFT JOIN governance_votes v ON v.proposal_id=p.id AND v.user_id=?
    ORDER BY p.id DESC
  `).all(req.session.userId);

  // Check if user has staking power (required to vote)
  const stakeTotal = db.prepare(`SELECT SUM(amount) as total FROM stakes WHERE user_id=? AND status='active'`).get(req.session.userId);
  res.json({ proposals, stakingPower: stakeTotal?.total || 0 });
});

// POST /api/governance/:id/vote
router.post('/:id/vote', requireAuth, (req, res) => {
  const { vote } = req.body;
  const db = req.app.locals.db;

  if (![0, 1].includes(parseInt(vote))) return res.status(400).json({ error: 'Vote invalide.' });

  const stakeTotal = db.prepare(`SELECT SUM(amount) as total FROM stakes WHERE user_id=? AND status='active'`).get(req.session.userId);
  if (!stakeTotal?.total || stakeTotal.total < 10) {
    return res.status(403).json({ error: 'Vous devez staker au moins 10 Kern pour voter.' });
  }

  const proposal = db.prepare('SELECT * FROM governance_proposals WHERE id=? AND status=?').get(req.params.id, 'active');
  if (!proposal) return res.status(404).json({ error: 'Proposition introuvable ou clôturée.' });

  const existing = db.prepare('SELECT id FROM governance_votes WHERE user_id=? AND proposal_id=?').get(req.session.userId, proposal.id);
  if (existing) return res.status(409).json({ error: 'Vous avez déjà voté sur cette proposition.' });

  const voteVal = parseInt(vote);
  db.prepare('INSERT INTO governance_votes (user_id, proposal_id, vote) VALUES (?,?,?)').run(req.session.userId, proposal.id, voteVal);

  if (voteVal === 1) {
    db.prepare('UPDATE governance_proposals SET votes_for=votes_for+1 WHERE id=?').run(proposal.id);
  } else {
    db.prepare('UPDATE governance_proposals SET votes_against=votes_against+1 WHERE id=?').run(proposal.id);
  }

  res.json({ ok: true, vote: voteVal });
});

module.exports = router;
