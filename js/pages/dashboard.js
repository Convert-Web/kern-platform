/* ═══════════════════════════════════════════════════════════════
   KERN — Dashboard Page
═══════════════════════════════════════════════════════════════ */

const DashboardPage = {
  data: null,
  prevBalance: null,

  async load() {
    try {
      const data = await API.user.dashboard();
      this.data = data;
      this.render(data);
      this.startPriceRefresh();
    } catch (e) {
      UI.toast('Erreur chargement dashboard', 'error');
    }
  },

  render(data) {
    const { user, recentTransactions, noyauPrice, noyauHistory, stakedAmount } = data;

    // Balance
    const prev = this.prevBalance ?? user.kern_balance;
    UI.setBalance(user.kern_balance, this.prevBalance !== null ? prev : undefined);
    this.prevBalance = user.kern_balance;

    // Avatar
    const avatar = document.getElementById('topbar-avatar');
    if (avatar) {
      avatar.textContent = user.username[0].toUpperCase();
      avatar.style.background = user.avatar_color || '#6C63FF';
    }

    // Noyau price
    const noyauVal = (user.noyau_shares * noyauPrice).toFixed(2);
    const priceEl = document.getElementById('dash-noyau-price');
    const subEl   = document.getElementById('dash-noyau-value');
    if (priceEl) priceEl.textContent = noyauPrice.toFixed(4) + ' K';
    if (subEl)   subEl.textContent   = `Portfolio Noyau: ${noyauVal} K`;

    // Mini chart
    const canvas = document.getElementById('mini-chart');
    if (canvas && noyauHistory.length > 1) {
      const prices = noyauHistory.map(h => h.price);
      const isUp = prices[prices.length-1] >= prices[0];
      setTimeout(() => Charts.drawSparkline(canvas, prices, isUp ? '#00E5A0' : '#FF4D6A'), 50);
    }

    // Transactions
    const txList = document.getElementById('dash-tx-list');
    if (txList) {
      if (!recentTransactions.length) {
        txList.innerHTML = '<p class="empty-state">Aucune transaction</p>';
      } else {
        txList.innerHTML = recentTransactions
          .map(tx => UI.formatTx(tx, user.id))
          .join('');
      }
    }
  },

  startPriceRefresh() {
    // Refresh price every 60s
    if (this._priceInterval) clearInterval(this._priceInterval);
    this._priceInterval = setInterval(async () => {
      try {
        const data = await API.noyau.price();
        const priceEl = document.getElementById('dash-noyau-price');
        if (priceEl) priceEl.textContent = data.current.price.toFixed(4) + ' K';

        const canvas = document.getElementById('mini-chart');
        if (canvas && data.history.length > 1) {
          const prices = data.history.map(h => h.price);
          const isUp = prices[prices.length-1] >= prices[0];
          Charts.drawSparkline(canvas, prices, isUp ? '#00E5A0' : '#FF4D6A');
        }
      } catch(e) {}
    }, 60000);
  },

  stopPriceRefresh() {
    if (this._priceInterval) {
      clearInterval(this._priceInterval);
      this._priceInterval = null;
    }
  },

  bindActions() {
    document.querySelectorAll('.qa-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const pageMap = { send: 'transfer', request: 'transfer', invest: 'noyau', stake: 'staking' };
        if (pageMap[action]) App.navigate(pageMap[action]);
      });
    });

    const histBtn = document.querySelector('[data-page="history"]');
    if (histBtn) histBtn.addEventListener('click', () => App.navigate('profile'));
  }
};
