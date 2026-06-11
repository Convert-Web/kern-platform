/* ═══════════════════════════════════════════════════════════════
   KERN — Staking & Governance Page
═══════════════════════════════════════════════════════════════ */

const StakingPage = {
  selectedDuration: 7,
  apy: { 7: 5, 30: 8, 90: 14 },
  stakingPower: 0,

  async load() {
    await this.loadData();
    this.bindDurationPicker();
    this.bindStakeForm();
  },

  async loadData() {
    try {
      const [stakingData, govData] = await Promise.all([
        API.staking.list(),
        API.governance.list()
      ]);
      this.stakingPower = govData.stakingPower || 0;
      this.renderStakes(stakingData.stakes, stakingData.kernBalance);
      this.renderGovernance(govData.proposals, govData.stakingPower);
    } catch (e) {
      UI.toast('Erreur chargement staking', 'error');
    }
  },

  renderStakes(stakes, balance) {
    const list  = document.getElementById('stakes-list');
    const input = document.getElementById('stake-amount');
    if (input) {
      const availEl = input.closest('.glass-card')?.querySelector('.balance-hint');
    }

    if (!stakes?.length) {
      list.innerHTML = '<p class="empty-state">Aucune position active</p>';
      return;
    }

    list.innerHTML = stakes.map(s => {
      const start   = new Date(s.started_at);
      const end     = new Date(s.ends_at);
      const now     = Date.now();
      const total   = end - start;
      const elapsed = Math.max(0, Math.min(now - start.getTime(), total));
      const pct     = total > 0 ? (elapsed / total * 100).toFixed(1) : 0;
      const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));
      const estReward = (s.amount * (s.apy / 100) * (s.duration / 365)).toFixed(2);

      return `
        <div class="stake-item ${s.status}">
          <div class="stake-item-header">
            <span class="stake-amount-display">${parseFloat(s.amount).toFixed(2)} K</span>
            <span class="stake-status ${s.status}">${s.status === 'active' ? 'Actif' : s.status === 'completed' ? 'Terminé' : 'Annulé'}</span>
          </div>
          <div class="stake-meta">
            <span>${s.duration}j · ${s.apy}% APY</span>
            <span>+${estReward} K estimé</span>
            ${s.status === 'active' ? `<span>${daysLeft}j restants</span>` : ''}
            ${s.status === 'completed' ? `<span class="text-green">+${parseFloat(s.reward_paid).toFixed(2)} K reçus</span>` : ''}
          </div>
          ${s.status === 'active' ? `
            <div class="stake-progress">
              <div class="stake-progress-bar" style="width:${pct}%"></div>
            </div>
            <button class="btn-cancel-stake" data-id="${s.id}">Annuler (pénalité 10%)</button>
          ` : ''}
        </div>`;
    }).join('');

    // Bind cancel buttons
    list.querySelectorAll('.btn-cancel-stake').forEach(btn => {
      btn.addEventListener('click', () => this.cancelStake(btn.dataset.id, btn));
    });
  },

  renderGovernance(proposals, stakingPower) {
    const hint = document.getElementById('governance-hint');
    const list = document.getElementById('proposals-list');

    if (hint) {
      if (stakingPower >= 10) {
        hint.textContent = `Pouvoir de vote: ${parseFloat(stakingPower).toFixed(2)} K stakés ✓`;
        hint.style.color = 'var(--green)';
      } else {
        hint.textContent = `Stakez au moins 10 Kern pour voter (actuellement: ${parseFloat(stakingPower || 0).toFixed(2)} K)`;
        hint.style.color = '';
      }
    }

    if (!proposals?.length) {
      list.innerHTML = '<p class="empty-state">Aucune proposition active</p>';
      return;
    }

    list.innerHTML = proposals.map(p => {
      const total = (p.votes_for + p.votes_against) || 1;
      const forPct = ((p.votes_for / total) * 100).toFixed(0);
      const end = new Date(p.ends_at);
      const daysLeft = Math.max(0, Math.ceil((end - Date.now()) / 86400000));
      const hasVoted = p.my_vote !== null && p.my_vote !== undefined;

      return `
        <div class="proposal-card" data-id="${p.id}">
          <div class="proposal-timer">⏱ ${daysLeft > 0 ? `${daysLeft} jours restants` : 'Clôturé'}</div>
          <div class="proposal-title">${p.title}</div>
          ${p.description ? `<div class="proposal-desc">${p.description}</div>` : ''}
          <div class="vote-bar-wrap">
            <div class="vote-bar-labels">
              <span class="text-green">Pour: ${p.votes_for}</span>
              <span class="text-red">Contre: ${p.votes_against}</span>
            </div>
            <div class="vote-bar-track">
              <div class="vote-bar-fill" style="width:${forPct}%"></div>
            </div>
          </div>
          ${!hasVoted && daysLeft > 0 ? `
            <div class="vote-actions">
              <button class="btn-vote for"  data-proposal="${p.id}" data-vote="1">✓ Pour</button>
              <button class="btn-vote against" data-proposal="${p.id}" data-vote="0">✗ Contre</button>
            </div>` : hasVoted ? `
            <div class="vote-actions">
              <button class="btn-vote for ${p.my_vote === 1 ? 'voted' : ''}" disabled>✓ Pour</button>
              <button class="btn-vote against ${p.my_vote === 0 ? 'voted' : ''}" disabled>✗ Contre</button>
            </div>` : '<p class="text-muted" style="font-size:12px">Vote clôturé</p>'
          }
        </div>`;
    }).join('');

    // Bind vote buttons
    list.querySelectorAll('.btn-vote').forEach(btn => {
      if (!btn.disabled) {
        btn.addEventListener('click', () => this.vote(btn.dataset.proposal, btn.dataset.vote, btn));
      }
    });
  },

  bindDurationPicker() {
    document.querySelectorAll('.duration-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.duration-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        this.selectedDuration = parseInt(opt.dataset.dur);
        this.updateStakePreview();
      });
    });

    const amtInput = document.getElementById('stake-amount');
    if (amtInput) amtInput.addEventListener('input', () => this.updateStakePreview());
  },

  updateStakePreview() {
    const amt = parseFloat(document.getElementById('stake-amount')?.value) || 0;
    const apy = this.apy[this.selectedDuration] || 5;
    const reward = amt * (apy / 100) * (this.selectedDuration / 365);
    const el = document.getElementById('stake-reward-preview');
    if (el) el.textContent = reward.toFixed(4);
  },

  bindStakeForm() {
    const btn = document.getElementById('btn-stake');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      UI.clearError('stake-error');
      const amt = parseFloat(document.getElementById('stake-amount')?.value);
      if (!amt || amt < 10) return UI.showError('stake-error', 'Montant minimum: 10 Kern.');

      const apy = this.apy[this.selectedDuration];
      const confirmed = await UI.confirm(
        'Confirmer le staking',
        `Bloquer ${amt} K pendant ${this.selectedDuration} jours à ${apy}% APY ?`
      );
      if (!confirmed) return;

      btn.disabled = true;
      btn.textContent = '…';

      try {
        const res = await API.staking.stake({ amount: amt, duration: this.selectedDuration });
        UI.showSuccess(`${amt} K bloqués`, `Récompense estimée: +${res.estimatedReward.toFixed(4)} K`);
        App.state.balance = res.newBalance;
        UI.setBalance(res.newBalance, res.newBalance + amt);
        document.getElementById('stake-amount').value = '';
        await this.loadData();
      } catch (e) {
        UI.showError('stake-error', e.message || 'Erreur');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Staker';
      }
    });
  },

  async cancelStake(stakeId, btn) {
    const confirmed = await UI.confirm(
      'Annuler le staking',
      'Une pénalité de 10% sera appliquée sur le montant initial. Continuer ?'
    );
    if (!confirmed) return;

    btn.disabled = true;
    try {
      const res = await API.staking.cancel(stakeId);
      UI.toast(`${res.returned.toFixed(2)} K récupérés (pénalité: ${res.penalty.toFixed(2)} K)`, 'info');
      App.state.balance = res.newBalance;
      UI.setBalance(res.newBalance);
      await this.loadData();
    } catch (e) {
      UI.toast(e.message || 'Erreur', 'error');
      btn.disabled = false;
    }
  },

  async vote(proposalId, voteVal, btn) {
    btn.disabled = true;
    try {
      await API.governance.vote(proposalId, parseInt(voteVal));
      UI.toast(voteVal === '1' ? 'Vote "Pour" enregistré ✓' : 'Vote "Contre" enregistré', 'success');
      btn.classList.add('voted');
      // Disable both vote buttons for this proposal
      const card = btn.closest('.proposal-card');
      card.querySelectorAll('.btn-vote').forEach(b => b.disabled = true);
    } catch (e) {
      UI.toast(e.message || 'Erreur vote', 'error');
      btn.disabled = false;
    }
  }
};
