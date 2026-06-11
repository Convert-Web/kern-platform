/* ═══════════════════════════════════════════════════════════════
   KERN — App Controller
═══════════════════════════════════════════════════════════════ */

const App = {
  state: {
    userId: null,
    username: null,
    isAdmin: false,
    balance: 0,
    currentPage: 'dashboard'
  },

  pages: {
    dashboard: DashboardPage,
    tasks:     TasksPage,
    transfer:  TransferPage,
    noyau:     NoyauPage,
    staking:   StakingPage,
    profile:   ProfilePage,
  },

  pageTitles: {
    dashboard: 'Accueil',
    tasks:     'Tâches',
    transfer:  'Envoyer',
    noyau:     'Bourse Noyau',
    staking:   'Staking',
    profile:   'Profil',
  },

  async init() {
    this.bindAuth();
    this.bindNav();

    // Check session
    try {
      const me = await API.auth.me();
      if (me.authenticated) {
        this.state.username = me.username;
        this.state.isAdmin  = me.isAdmin;
        this.showApp();
      } else {
        this.showAuth();
      }
    } catch (e) {
      this.showAuth();
    }
  },

  // ── Auth ───────────────────────────────────────────────────
  bindAuth() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
      });
    });

    // Login
    const loginBtn = document.getElementById('btn-login');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.handleLogin());
    }

    // Enter key on login
    ['login-username','login-password'].forEach(id => {
      document.getElementById(id)?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleLogin();
      });
    });

    // Register
    const regBtn = document.getElementById('btn-register');
    if (regBtn) {
      regBtn.addEventListener('click', () => this.handleRegister());
    }

    ['reg-username','reg-email','reg-password'].forEach(id => {
      document.getElementById(id)?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleRegister();
      });
    });
  },

  async handleLogin() {
    const btn      = document.getElementById('btn-login');
    const username = document.getElementById('login-username')?.value?.trim();
    const password = document.getElementById('login-password')?.value;

    UI.clearError('login-error');
    if (!username || !password) return UI.showError('login-error', 'Tous les champs sont requis.');

    UI.btnLoading(btn, true);
    try {
      const res = await API.auth.login({ username, password });
      this.state.username = res.username;
      this.state.isAdmin  = res.isAdmin;
      this.showApp();
    } catch (e) {
      UI.showError('login-error', e.message || 'Identifiants incorrects');
    } finally {
      UI.btnLoading(btn, false);
    }
  },

  async handleRegister() {
    const btn      = document.getElementById('btn-register');
    const username = document.getElementById('reg-username')?.value?.trim();
    const email    = document.getElementById('reg-email')?.value?.trim();
    const password = document.getElementById('reg-password')?.value;

    UI.clearError('reg-error');
    if (!username || !email || !password) return UI.showError('reg-error', 'Tous les champs sont requis.');

    UI.btnLoading(btn, true);
    try {
      const res = await API.auth.register({ username, email, password });
      this.state.username = res.username;
      this.showApp();
      setTimeout(() => UI.toast('Bienvenue ! 100 Kern offerts 🎉', 'success', 4000), 800);
    } catch (e) {
      UI.showError('reg-error', e.message || 'Erreur d\'inscription');
    } finally {
      UI.btnLoading(btn, false);
    }
  },

  // ── Navigation ─────────────────────────────────────────────
  bindNav() {
    document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
      btn.addEventListener('click', () => this.navigate(btn.dataset.page));
    });

    // Profile avatar button navigates to profile
    document.getElementById('nav-profile-btn')?.addEventListener('click', () => this.navigate('profile'));

    // Dashboard quick links
    document.querySelectorAll('[data-page]').forEach(el => {
      if (el.classList.contains('nav-item') || el.classList.contains('link-btn')) {
        el.addEventListener('click', () => this.navigate(el.dataset.page));
      }
    });
  },

  navigate(pageId) {
    if (!this.pages[pageId]) return;

    // Stop previous page intervals
    const prev = this.pages[this.state.currentPage];
    if (prev?.stopPriceRefresh) prev.stopPriceRefresh();

    this.state.currentPage = pageId;

    // Update pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${pageId}`)?.classList.add('active');

    // Update nav
    document.querySelectorAll('.nav-item').forEach(b => {
      b.classList.toggle('active', b.dataset.page === pageId);
    });

    // Update title
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = this.pageTitles[pageId] || pageId;

    // Scroll to top
    document.querySelector('.page-container')?.scrollTo(0, 0);

    // Load page
    this.pages[pageId].load?.();
  },

  // ── App show/hide ──────────────────────────────────────────
  showApp() {
    document.getElementById('auth-screen')?.classList.add('hidden');
    document.getElementById('main-app')?.classList.remove('hidden');
    document.getElementById('main-app')?.classList.add('active');
    this.navigate('dashboard');
    DashboardPage.bindActions();
  },

  showAuth() {
    document.getElementById('auth-screen')?.classList.remove('hidden');
    document.getElementById('auth-screen')?.classList.add('active');
    document.getElementById('main-app')?.classList.add('hidden');
    document.getElementById('main-app')?.classList.remove('active');
  },

  logout() {
    this.state = { userId: null, username: null, isAdmin: false, balance: 0, currentPage: 'dashboard' };
    DashboardPage.prevBalance = null;
    DashboardPage.stopPriceRefresh?.();
    NoyauPage.stopPriceRefresh?.();

    // Clear form fields
    ['login-username','login-password','reg-username','reg-email','reg-password'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    this.showAuth();
  }
};

// ── Bootstrap ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.init());

// Handle window resize for chart redraws
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (App.state.currentPage === 'dashboard') {
      DashboardPage.load();
    } else if (App.state.currentPage === 'noyau') {
      NoyauPage.loadData();
    }
  }, 200);
});
