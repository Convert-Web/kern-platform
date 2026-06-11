/* ═══════════════════════════════════════════════════════════════
   KERN — Profile Page
═══════════════════════════════════════════════════════════════ */

const ProfilePage = {
  currentPage: 1,

  async load() {
    await Promise.all([
      this.loadProfile(),
      this.loadHistory(1)
    ]);
    this.bindLogout();
  },

  async loadProfile() {
    try {
      const user = await API.user.profile();
      const avatarEl   = document.getElementById('profile-avatar-display');
      const usernameEl = document.getElementById('profile-username');
      const emailEl    = document.getElementById('profile-email');
      const sinceEl    = document.getElementById('profile-since');

      if (avatarEl)   { avatarEl.textContent = user.username[0].toUpperCase(); avatarEl.style.background = user.avatar_color || '#6C63FF'; }
      if (usernameEl) usernameEl.textContent = user.username;
      if (emailEl)    emailEl.textContent    = user.email;
      if (sinceEl)    sinceEl.textContent    = `Membre depuis ${new Date(user.created_at).toLocaleDateString('fr', { year:'numeric', month:'long' })}`;

      // Stats
      document.getElementById('stat-balance')?.setAttribute('data-val', user.kern_balance);
      const balEl = document.getElementById('stat-balance');
      if (balEl) UI.animateNumber(balEl, 0, parseFloat(user.kern_balance), 2, 800);

      const sharesEl = document.getElementById('stat-shares');
      if (sharesEl) UI.animateNumber(sharesEl, 0, parseFloat(user.noyau_shares), 4, 800);

      // Staked amount
      const staking = await API.staking.list();
      const stakedEl = document.getElementById('stat-staked');
      if (stakedEl) UI.animateNumber(stakedEl, 0, staking.stakes.filter(s=>s.status==='active').reduce((a,s)=>a+s.amount,0), 2, 800);

    } catch (e) {
      UI.toast('Erreur chargement profil', 'error');
    }
  },

  async loadHistory(page) {
    this.currentPage = page;
    const list = document.getElementById('history-list');
    const statsTask = document.getElementById('stat-tasks');

    list.innerHTML = `<div class="skeleton-list">
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
    </div>`;

    try {
      const data = await API.user.history(page);

      if (!data.transactions.length) {
        list.innerHTML = '<p class="empty-state">Aucune transaction</p>';
        return;
      }

      // Count task completions
      const taskCount = data.transactions.filter(t => t.type === 'task_reward').length;
      if (statsTask) statsTask.textContent = taskCount;

      list.innerHTML = data.transactions
        .map(tx => UI.formatTx(tx, App.state.userId))
        .join('');

      this.renderPagination(data.page, data.pages);
    } catch (e) {
      list.innerHTML = '<p class="empty-state">Erreur de chargement</p>';
    }
  },

  renderPagination(current, total) {
    const pag = document.getElementById('pagination');
    if (!pag || total <= 1) { if (pag) pag.innerHTML = ''; return; }

    let html = '';
    for (let i = 1; i <= total; i++) {
      html += `<button class="page-btn ${i === current ? 'active' : ''}" data-p="${i}">${i}</button>`;
    }
    pag.innerHTML = html;

    pag.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => this.loadHistory(parseInt(btn.dataset.p)));
    });
  },

  bindLogout() {
    const btn = document.getElementById('btn-logout');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const confirmed = await UI.confirm('Déconnexion', 'Voulez-vous vous déconnecter ?');
      if (!confirmed) return;
      try {
        await API.auth.logout();
        App.logout();
      } catch(e) {
        App.logout();
      }
    });
  }
};
