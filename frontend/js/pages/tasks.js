/* ═══════════════════════════════════════════════════════════════
   KERN — Tasks Page
═══════════════════════════════════════════════════════════════ */

const TasksPage = {
  currentFilter: 'all',
  tasks: [],

  async load() {
    this.bindFilters();
    await this.loadTasks();
  },

  async loadTasks(category) {
    const list = document.getElementById('task-list');
    list.innerHTML = `<div class="skeleton-list">
      <div class="skeleton-item tall"></div>
      <div class="skeleton-item tall"></div>
      <div class="skeleton-item tall"></div>
    </div>`;

    try {
      const data = await API.tasks.list(category || this.currentFilter);
      this.tasks = data.tasks;
      this.renderTasks(data.tasks);
    } catch (e) {
      list.innerHTML = '<p class="empty-state">Erreur de chargement</p>';
    }
  },

  renderTasks(tasks) {
    const list = document.getElementById('task-list');
    if (!tasks.length) {
      list.innerHTML = '<p class="empty-state">Aucune tâche dans cette catégorie</p>';
      return;
    }

    list.innerHTML = tasks.map(t => this.taskCard(t)).join('');

    // Bind complete buttons
    list.querySelectorAll('.btn-accomplish').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        this.completeTask(id, btn);
      });
    });
  },

  taskCard(task) {
    const diffLabel = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' }[task.difficulty] || task.difficulty;
    if (task.completed) {
      return `
        <div class="task-card completed">
          <div class="task-emoji">${task.icon}</div>
          <div class="task-info">
            <div class="task-title">${task.title}</div>
            <div class="task-meta">
              <span class="task-cat ${task.category}">${task.category}</span>
              <span class="task-difficulty">${diffLabel}</span>
            </div>
          </div>
          <div class="task-check">✓</div>
        </div>`;
    }
    return `
      <div class="task-card" data-id="${task.id}">
        <div class="task-emoji">${task.icon}</div>
        <div class="task-info">
          <div class="task-title">${task.title}</div>
          <div class="task-meta">
            <span class="task-cat ${task.category}">${task.category}</span>
            <span class="task-difficulty">${diffLabel}</span>
          </div>
        </div>
        <div class="task-reward">
          <span class="reward-amount">+${task.reward}</span>
          <span class="reward-currency">KERN</span>
          <button class="btn-accomplish" data-id="${task.id}">Accomplir</button>
        </div>
      </div>`;
  },

  async completeTask(taskId, btn) {
    const origText = btn.textContent;
    btn.textContent = '…';
    btn.disabled = true;

    try {
      const res = await API.tasks.complete(taskId);
      // Animate reward
      const rect = btn.getBoundingClientRect();
      UI.floatReward(rect.left, rect.top, res.reward);
      UI.toast(`+${res.reward} K gagnés !`, 'success');

      // Update balance in state
      App.state.balance = res.newBalance;
      UI.setBalance(res.newBalance, res.newBalance - res.reward);

      // Mark task as completed visually
      const card = document.querySelector(`.task-card[data-id="${taskId}"]`);
      if (card) {
        card.classList.add('completed');
        card.innerHTML = card.innerHTML.replace(
          `<div class="task-reward">`,
          `<div class="task-check">✓</div><div class="task-reward hidden">`
        );
        const taskReward = card.querySelector('.task-reward');
        if (taskReward) taskReward.remove();
        const check = document.createElement('div');
        check.className = 'task-check';
        check.textContent = '✓';
        card.appendChild(check);
      }
    } catch (e) {
      UI.toast(e.message || 'Erreur', 'error');
      btn.textContent = origText;
      btn.disabled = false;
    }
  },

  bindFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.loadTasks(this.currentFilter === 'all' ? null : this.currentFilter);
      });
    });
  }
};
