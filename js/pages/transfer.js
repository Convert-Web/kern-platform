/* ═══════════════════════════════════════════════════════════════
   KERN — Transfer Page
═══════════════════════════════════════════════════════════════ */

const TransferPage = {
  selectedUser: null,
  searchTimeout: null,

  async load() {
    this.bindSearch();
    this.bindForm();
    this.loadBalance();
    this.renderQR();
  },

  async loadBalance() {
    try {
      const data = await API.user.profile();
      const el = document.getElementById('transfer-available');
      if (el) el.textContent = parseFloat(data.kern_balance).toFixed(2);
    } catch (e) {}
  },

  renderQR() {
    const username = App.state.username || 'user';
    const qr = document.getElementById('qr-visual');
    if (qr) Charts.renderQR(qr, username);

    const copyBtn = document.getElementById('btn-copy-link');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const link = `${window.location.origin}/pay?to=${username}`;
        navigator.clipboard.writeText(link).then(() => {
          UI.toast('Lien copié !', 'success');
        }).catch(() => {
          UI.toast(link, 'info', 5000);
        });
      });
    }
  },

  bindSearch() {
    const input = document.getElementById('transfer-recipient');
    const suggestions = document.getElementById('user-suggestions');
    const selectedEl  = document.getElementById('selected-user');
    const clearBtn    = document.getElementById('clear-recipient');

    if (!input) return;

    input.addEventListener('input', () => {
      const q = input.value.trim();
      if (this.searchTimeout) clearTimeout(this.searchTimeout);
      if (q.length < 2) { suggestions.innerHTML = ''; return; }

      this.searchTimeout = setTimeout(async () => {
        try {
          const data = await API.user.search(q);
          suggestions.innerHTML = data.users.map(u => `
            <div class="suggestion-item" data-id="${u.id}" data-name="${u.username}" data-color="${u.avatar_color||'#6C63FF'}">
              <div class="avatar-circle small" style="background:${u.avatar_color||'#6C63FF'}">${u.username[0].toUpperCase()}</div>
              <span>${u.username}</span>
            </div>
          `).join('');

          suggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
              this.selectUser(item.dataset.name, item.dataset.color);
              suggestions.innerHTML = '';
              input.value = '';
            });
          });
        } catch (e) {}
      }, 300);
    });

    document.addEventListener('click', (e) => {
      if (!suggestions.contains(e.target) && e.target !== input) {
        suggestions.innerHTML = '';
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.selectedUser = null;
        selectedEl.classList.add('hidden');
        input.value = '';
        input.focus();
      });
    }
  },

  selectUser(username, color) {
    this.selectedUser = username;
    const selectedEl  = document.getElementById('selected-user');
    const avatar      = document.getElementById('selected-avatar');
    const name        = document.getElementById('selected-name');

    if (avatar) { avatar.textContent = username[0].toUpperCase(); avatar.style.background = color; }
    if (name)   name.textContent = username;
    if (selectedEl) selectedEl.classList.remove('hidden');
  },

  bindForm() {
    const btn = document.getElementById('btn-transfer');
    if (!btn) return;

    btn.addEventListener('click', async (e) => {
      UI.clearError('transfer-error');
      const recipient = this.selectedUser;
      const amount    = document.getElementById('transfer-amount')?.value;
      const note      = document.getElementById('transfer-note')?.value;

      if (!recipient) return UI.showError('transfer-error', 'Sélectionnez un destinataire.');
      if (!amount || parseFloat(amount) <= 0) return UI.showError('transfer-error', 'Entrez un montant valide.');

      const confirmed = await UI.confirm(
        'Confirmer le transfert',
        `Envoyer ${parseFloat(amount).toFixed(2)} K à ${recipient} ?`
      );
      if (!confirmed) return;

      btn.disabled = true;
      btn.textContent = '…';

      try {
        const res = await API.transfer.send({ to_username: recipient, amount: parseFloat(amount), note });
        UI.showSuccess(`-${parseFloat(amount).toFixed(2)} K`, `Envoyé à ${res.recipient}`);
        App.state.balance = res.newBalance;
        UI.setBalance(res.newBalance, res.newBalance + parseFloat(amount));

        // Reset form
        document.getElementById('transfer-amount').value = '';
        document.getElementById('transfer-note').value   = '';
        this.selectedUser = null;
        document.getElementById('selected-user')?.classList.add('hidden');
        const available = document.getElementById('transfer-available');
        if (available) available.textContent = res.newBalance.toFixed(2);

        // Refresh balance hint
        this.loadBalance();
      } catch (e) {
        UI.showError('transfer-error', e.message || 'Erreur lors du transfert');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Confirmer le transfert';
      }
    });
  }
};
