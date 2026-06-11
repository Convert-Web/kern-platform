/* ═══════════════════════════════════════════════════════════════
   KERN — UI Helpers
═══════════════════════════════════════════════════════════════ */

const UI = {
  // ── Toast notifications ──────────────────────────────────────
  toast(msg, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 300);
    }, duration);
  },

  // ── Success overlay ──────────────────────────────────────────
  showSuccess(amount, msg, duration = 2000) {
    const overlay = document.getElementById('success-overlay');
    document.getElementById('success-amount').textContent = amount;
    document.getElementById('success-msg').textContent = msg;
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('hidden'), duration);
  },

  // ── Confirmation modal ───────────────────────────────────────
  confirm(title, body) {
    return new Promise(resolve => {
      const modal = document.getElementById('confirm-modal');
      document.getElementById('confirm-title').textContent = title;
      document.getElementById('confirm-body').textContent  = body;
      modal.classList.remove('hidden');

      const ok  = document.getElementById('confirm-ok');
      const can = document.getElementById('confirm-cancel');

      const cleanup = (val) => {
        modal.classList.add('hidden');
        ok.replaceWith(ok.cloneNode(true));
        can.replaceWith(can.cloneNode(true));
        resolve(val);
      };
      document.getElementById('confirm-ok')    .addEventListener('click', () => cleanup(true),  { once: true });
      document.getElementById('confirm-cancel').addEventListener('click', () => cleanup(false), { once: true });
    });
  },

  // ── Animate number ───────────────────────────────────────────
  animateNumber(el, from, to, decimals = 2, duration = 600) {
    const start = performance.now();
    const diff  = to - from;
    const step  = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = (from + diff * ease).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },

  // ── Set balance with animation ───────────────────────────────
  setBalance(newVal, prevVal) {
    const el = document.getElementById('dash-balance');
    const changeEl = document.getElementById('dash-balance-change');
    if (!el) return;

    const prev = parseFloat(prevVal ?? el.textContent) || 0;
    UI.animateNumber(el, prev, newVal, 2);

    if (prevVal !== undefined && newVal !== prev) {
      const diff = newVal - prev;
      const sign = diff >= 0 ? '+' : '';
      changeEl.textContent = `${sign}${diff.toFixed(2)} K`;
      changeEl.className = `balance-change ${diff >= 0 ? 'up' : 'down'}`;
      el.classList.add(diff >= 0 ? 'amount-flash' : 'amount-flash-red');
      setTimeout(() => el.classList.remove('amount-flash', 'amount-flash-red'), 600);
    }
  },

  // ── Float reward particle ─────────────────────────────────────
  floatReward(x, y, amount) {
    const el = document.createElement('div');
    el.className = 'reward-float';
    el.textContent = `+${amount} K`;
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  },

  // ── Button loading state ─────────────────────────────────────
  btnLoading(btn, loading) {
    const text   = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.btn-loader');
    if (loading) {
      btn.disabled = true;
      if (text)   text.classList.add('hidden');
      if (loader) loader.classList.remove('hidden');
    } else {
      btn.disabled = false;
      if (text)   text.classList.remove('hidden');
      if (loader) loader.classList.add('hidden');
    }
  },

  // ── Ripple effect ─────────────────────────────────────────────
  ripple(btn, e) {
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const el     = document.createElement('span');
    el.className = 'ripple-el';
    el.style.cssText = `
      width: ${size}px; height: ${size}px;
      left:  ${e.clientX - rect.left  - size/2}px;
      top:   ${e.clientY - rect.top   - size/2}px;
    `;
    btn.appendChild(el);
    setTimeout(() => el.remove(), 700);
  },

  // ── Format transaction ────────────────────────────────────────
  formatTx(tx, userId) {
    const isOut = tx.from_user === userId;
    const types = {
      transfer:    { icon: isOut ? '↑' : '↓',  cls: isOut ? 'send' : 'receive', label: isOut ? `À ${tx.to_name||'?'}` : `De ${tx.from_name||'?'}` },
      task_reward: { icon: '⚡', cls: 'task',  label: 'Tâche accomplie' },
      buy_noyau:   { icon: '◆', cls: 'noyau', label: 'Achat Noyau' },
      sell_noyau:  { icon: '◆', cls: 'noyau', label: 'Vente Noyau' },
      stake:       { icon: '⬡', cls: 'stake', label: 'Staking' },
      unstake:     { icon: '⬡', cls: 'stake', label: 'Fin de staking' },
      stake_reward:{ icon: '★', cls: 'task',  label: 'Récompense staking' },
    };
    const t = types[tx.type] || { icon: '○', cls: 'task', label: tx.type };
    const amtSign = (tx.type === 'transfer' && isOut) || tx.type === 'buy_noyau' || tx.type === 'stake' ? '-' : '+';
    const amtCls  = amtSign === '+' ? 'positive' : 'negative';
    const date    = new Date(tx.created_at).toLocaleDateString('fr', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    const desc    = tx.description || t.label;

    return `
      <div class="tx-item">
        <div class="tx-icon ${t.cls}">${t.icon}</div>
        <div class="tx-info">
          <div class="tx-desc">${desc}</div>
          <div class="tx-date">${date}</div>
        </div>
        <div class="tx-amount ${amtCls}">${amtSign}${parseFloat(tx.amount).toFixed(2)} K</div>
      </div>`;
  },

  // ── Format date ───────────────────────────────────────────────
  relativeDate(dateStr) {
    const d = new Date(dateStr);
    const now = Date.now();
    const diff = now - d.getTime();
    if (diff < 60000)     return 'À l\'instant';
    if (diff < 3600000)   return `Il y a ${Math.floor(diff/60000)} min`;
    if (diff < 86400000)  return `Il y a ${Math.floor(diff/3600000)} h`;
    return d.toLocaleDateString('fr');
  },

  // ── Show error ────────────────────────────────────────────────
  showError(elId, msg) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 5000);
  },
  clearError(elId) {
    const el = document.getElementById(elId);
    if (el) el.classList.add('hidden');
  },
};

// Add ripple to all primary buttons
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-primary, .btn-buy, .btn-sell, .btn-neon');
  if (btn) UI.ripple(btn, e);
});
