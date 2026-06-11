/* ═══════════════════════════════════════════════════════════════
   KERN — API Client
═══════════════════════════════════════════════════════════════ */

const API = {
  async request(method, path, body) {
    try {
      const opts = {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      };
      if (body) opts.body = JSON.stringify(body);
      const res = await fetch('/api' + path, opts);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur serveur');
      return data;
    } catch (e) {
      throw e;
    }
  },
  get: (path)         => API.request('GET',    path),
  post:(path, body)   => API.request('POST',   path, body),
  put: (path, body)   => API.request('PUT',    path, body),
  del: (path)         => API.request('DELETE', path),

  auth: {
    login:    (d) => API.post('/auth/login',    d),
    register: (d) => API.post('/auth/register', d),
    logout:   ()  => API.post('/auth/logout'),
    me:       ()  => API.get('/auth/me'),
  },
  user: {
    profile:   ()     => API.get('/user/profile'),
    dashboard: ()     => API.get('/user/dashboard'),
    history:   (page) => API.get(`/user/history?page=${page||1}`),
    search:    (q)    => API.get(`/user/search?q=${encodeURIComponent(q)}`),
  },
  tasks: {
    list:     (cat)  => API.get(`/tasks${cat&&cat!=='all'?'?category='+cat:''}`),
    complete: (id)   => API.post(`/tasks/${id}/complete`),
  },
  transfer: {
    send: (d) => API.post('/transfer', d),
  },
  noyau: {
    price:     ()    => API.get('/noyau/price'),
    portfolio: ()    => API.get('/noyau/portfolio'),
    buy:       (d)   => API.post('/noyau/buy',  d),
    sell:      (d)   => API.post('/noyau/sell', d),
  },
  staking: {
    list:   ()    => API.get('/staking'),
    stake:  (d)   => API.post('/staking/stake', d),
    cancel: (id)  => API.post(`/staking/${id}/cancel`),
  },
  governance: {
    list: ()           => API.get('/governance'),
    vote: (id, vote)   => API.post(`/governance/${id}/vote`, { vote }),
  },
  admin: {
    stats: ()     => API.get('/admin/stats'),
    users: ()     => API.get('/admin/users'),
    createTask:   (d) => API.post('/admin/tasks', d),
    createProp:   (d) => API.post('/admin/governance', d),
    reward:       (userId, d) => API.post(`/admin/reward/${userId}`, d),
  }
};
