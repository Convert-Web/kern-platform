/* ═══════════════════════════════════════════════════════════════
   KERN — Noyau Exchange Page
═══════════════════════════════════════════════════════════════ */

const NoyauPage = {
  currentPrice: 0,
  prevPrice: 0,
  priceInterval: null,

  async load() {
    await this.loadData();
    this.bindTabs();
    this.bindBuy();
    this.bindSell();
    this.startPriceRefresh();
  },

  async loadData() {
    try {
      const [priceData, portfolio] = await Promise.all([
        API.noyau.price(),
        API.noyau.portfolio()
      ]);

      this.prevPrice = this.currentPrice || priceData.current.price;
      this.currentPrice = priceData.current.price;
      this.renderPrice(priceData);
      this.renderPortfolio(portfolio);
      this.renderChart(priceData.history);
      this.renderOrders(portfolio.orders);
    } catch (e) {
      UI.toast('Erreur chargement Noyau', 'error');
    }
  },

  renderPrice(data) {
    const price = data.current.price;
    const history = data.history;
    const priceEl  = document.getElementById('noyau-price-display');
    const changeEl = document.getElementById('noyau-price-change');

    if (priceEl) priceEl.textContent = price.toFixed(4) + ' K';

    if (history.length >= 2 && changeEl) {
      const first = history[0].price;
      const pct   = ((price - first) / first * 100).toFixed(2);
      const isUp  = price >= first;
      changeEl.textContent = `${isUp ? '+' : ''}${pct}%`;
      changeEl.className   = `price-change ${isUp ? 'up' : 'down'}`;
    }

    // Flash on price change
    if (priceEl && this.prevPrice && price !== this.prevPrice) {
      priceEl.classList.remove('price-flash-up', 'price-flash-down');
      void priceEl.offsetWidth; // reflow
      priceEl.classList.add(price >= this.prevPrice ? 'price-flash-up' : 'price-flash-down');
    }
  },

  renderPortfolio(data) {
    const sharesEl = document.getElementById('my-noyau-shares');
    const valueEl  = document.getElementById('my-portfolio-value');
    if (sharesEl) sharesEl.textContent = parseFloat(data.shares).toFixed(4) + ' parts';
    if (valueEl)  valueEl.textContent  = parseFloat(data.portfolioValue).toFixed(2) + ' K';

    // Update buy/sell previews
    this.updateBuyPreview();
    this.updateSellPreview();
  },

  renderChart(history) {
    const canvas = document.getElementById('noyau-chart');
    if (!canvas || !history.length) return;
    setTimeout(() => Charts.drawLineChart(canvas, history), 50);
  },

  renderOrders(orders) {
    const list = document.getElementById('order-list');
    if (!list) return;
    if (!orders?.length) {
      list.innerHTML = '<p class="empty-state">Aucun ordre pour l\'instant</p>';
      return;
    }
    list.innerHTML = orders.map(o => `
      <div class="order-item">
        <span class="order-type ${o.type}">${o.type === 'buy' ? 'Achat' : 'Vente'}</span>
        <span>${parseFloat(o.shares).toFixed(4)} parts</span>
        <span>@ ${parseFloat(o.price).toFixed(4)} K</span>
        <span class="${o.type === 'buy' ? 'text-red' : 'text-green'}">${o.type === 'buy' ? '-' : '+'}${parseFloat(o.kern_amount).toFixed(2)} K</span>
      </div>
    `).join('');
  },

  bindTabs() {
    document.querySelectorAll('.ex-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ex-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const side = tab.dataset.side;
        document.getElementById('panel-buy').classList.toggle('hidden', side !== 'buy');
        document.getElementById('panel-sell').classList.toggle('hidden', side !== 'sell');
      });
    });
  },

  updateBuyPreview() {
    const amt = parseFloat(document.getElementById('buy-amount')?.value) || 0;
    const el  = document.getElementById('buy-shares');
    if (el) el.textContent = this.currentPrice ? (amt / this.currentPrice).toFixed(4) : '0';
  },

  updateSellPreview() {
    const shares = parseFloat(document.getElementById('sell-shares')?.value) || 0;
    const el = document.getElementById('sell-kern');
    if (el) el.textContent = (shares * this.currentPrice).toFixed(2);
  },

  bindBuy() {
    const input = document.getElementById('buy-amount');
    const btn   = document.getElementById('btn-buy-noyau');
    if (!input || !btn) return;

    input.addEventListener('input', () => this.updateBuyPreview());

    btn.addEventListener('click', async () => {
      UI.clearError('buy-error');
      const amt = parseFloat(input.value);
      if (!amt || amt <= 0) return UI.showError('buy-error', 'Entrez un montant.');

      btn.disabled = true;
      btn.textContent = '…';

      try {
        const res = await API.noyau.buy({ amount_kern: amt });
        UI.showSuccess(`+${parseFloat(res.sharesBought).toFixed(4)} parts`, `Achat Noyau réussi`);
        App.state.balance = res.kern_balance;
        UI.setBalance(res.kern_balance, res.kern_balance + amt);
        input.value = '';
        await this.loadData();
        UI.toast(`Achat : ${parseFloat(res.sharesBought).toFixed(4)} parts à ${this.currentPrice.toFixed(4)} K`, 'success');
      } catch (e) {
        UI.showError('buy-error', e.message || 'Erreur');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Acheter Noyau';
      }
    });
  },

  bindSell() {
    const input = document.getElementById('sell-shares');
    const btn   = document.getElementById('btn-sell-noyau');
    if (!input || !btn) return;

    input.addEventListener('input', () => this.updateSellPreview());

    btn.addEventListener('click', async () => {
      UI.clearError('sell-error');
      const shares = parseFloat(input.value);
      if (!shares || shares <= 0) return UI.showError('sell-error', 'Entrez un nombre de parts.');

      const kernReceived = (shares * this.currentPrice).toFixed(2);
      const confirmed = await UI.confirm('Confirmer la vente', `Vendre ${shares} parts pour ≈ ${kernReceived} K ?`);
      if (!confirmed) return;

      btn.disabled = true;
      btn.textContent = '…';

      try {
        const res = await API.noyau.sell({ shares });
        UI.showSuccess(`+${parseFloat(res.kernReceived).toFixed(2)} K`, `Vente Noyau réussie`);
        App.state.balance = res.kern_balance;
        UI.setBalance(res.kern_balance, res.kern_balance - res.kernReceived);
        input.value = '';
        await this.loadData();
      } catch (e) {
        UI.showError('sell-error', e.message || 'Erreur');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Vendre Noyau';
      }
    });
  },

  startPriceRefresh() {
    if (this.priceInterval) clearInterval(this.priceInterval);
    this.priceInterval = setInterval(async () => {
      try {
        const data = await API.noyau.price();
        this.prevPrice = this.currentPrice;
        this.currentPrice = data.current.price;
        this.renderPrice(data);
        this.renderChart(data.history);
        this.updateBuyPreview();
        this.updateSellPreview();
      } catch(e) {}
    }, 60000);
  },

  stopPriceRefresh() {
    if (this.priceInterval) { clearInterval(this.priceInterval); this.priceInterval = null; }
  }
};
