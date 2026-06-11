/* ═══════════════════════════════════════════════════════════════
   KERN — Charts (pure Canvas, no deps)
═══════════════════════════════════════════════════════════════ */

const Charts = {
  // ── Mini sparkline ──────────────────────────────────────────
  drawSparkline(canvas, prices, color = '#7C6FF7') {
    if (!canvas || !prices?.length) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const pad = { t: 6, b: 6, l: 0, r: 0 };

    const x = (i) => pad.l + (i / (prices.length - 1)) * (w - pad.l - pad.r);
    const y = (v)  => pad.t + (1 - (v - min) / range)  * (h - pad.t - pad.b);

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + '40');
    grad.addColorStop(1, color + '00');

    ctx.beginPath();
    prices.forEach((p, i) => { i === 0 ? ctx.moveTo(x(i), y(p)) : ctx.lineTo(x(i), y(p)); });
    ctx.lineTo(x(prices.length - 1), h);
    ctx.lineTo(x(0), h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    prices.forEach((p, i) => { i === 0 ? ctx.moveTo(x(i), y(p)) : ctx.lineTo(x(i), y(p)); });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // End dot
    const lx = x(prices.length - 1);
    const ly = y(prices[prices.length - 1]);
    ctx.beginPath();
    ctx.arc(lx, ly, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lx, ly, 5, 0, Math.PI * 2);
    ctx.strokeStyle = color + '60';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  },

  // ── Line chart with grid ─────────────────────────────────────
  drawLineChart(canvas, dataPoints, options = {}) {
    if (!canvas || !dataPoints?.length) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight || 200;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const pad = { t: 12, b: 28, l: 52, r: 16 };
    const chartW = w - pad.l - pad.r;
    const chartH = h - pad.t - pad.b;

    const prices = dataPoints.map(d => d.price ?? d);
    const min = Math.min(...prices) * 0.998;
    const max = Math.max(...prices) * 1.002;
    const range = max - min || 1;

    const px = (i) => pad.l + (i / (prices.length - 1)) * chartW;
    const py = (v)  => pad.t + (1 - (v - min) / range) * chartH;

    // Background grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    const rows = 5;
    for (let i = 0; i <= rows; i++) {
      const y = pad.t + (i / rows) * chartH;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(pad.l + chartW, y);
      ctx.stroke();

      // Y labels
      const val = max - (i / rows) * range;
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = `${Math.floor(10 * dpr) / dpr}px Inter, sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText(val.toFixed(2), pad.l - 6, y + 4);
    }

    // Area gradient
    const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + chartH);
    grad.addColorStop(0, 'rgba(124,111,247,0.3)');
    grad.addColorStop(1, 'rgba(124,111,247,0.0)');

    ctx.beginPath();
    prices.forEach((p, i) => { i === 0 ? ctx.moveTo(px(i), py(p)) : ctx.lineTo(px(i), py(p)); });
    ctx.lineTo(px(prices.length - 1), pad.t + chartH);
    ctx.lineTo(px(0), pad.t + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    prices.forEach((p, i) => { i === 0 ? ctx.moveTo(px(i), py(p)) : ctx.lineTo(px(i), py(p)); });
    ctx.strokeStyle = '#9D93FF';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap  = 'round';
    ctx.stroke();

    // Candlestick mini bars at each point
    prices.forEach((p, i) => {
      if (i === 0) return;
      const prev = prices[i - 1];
      const color = p >= prev ? '#00E5A0' : '#FF4D6A';
      const bx = px(i);
      const by = py(Math.max(p, prev));
      const bh = Math.max(2, Math.abs(py(p) - py(prev)));
      ctx.fillStyle = color + 'AA';
      ctx.fillRect(bx - 2, by, 4, bh);
    });

    // X axis time labels
    if (dataPoints.length > 1 && dataPoints[0].recorded_at) {
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = `${Math.floor(9 * dpr) / dpr}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      const labelCount = Math.min(5, prices.length);
      for (let k = 0; k < labelCount; k++) {
        const idx = Math.floor(k * (prices.length - 1) / (labelCount - 1));
        const dt  = new Date(dataPoints[idx].recorded_at);
        const label = dt.toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' });
        ctx.fillText(label, px(idx), h - 6);
      }
    }

    // Current price marker
    const lastY = py(prices[prices.length - 1]);
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.moveTo(pad.l, lastY);
    ctx.lineTo(pad.l + chartW, lastY);
    ctx.stroke();
    ctx.setLineDash([]);
  },

  // ── QR-like visual (decorative) ──────────────────────────────
  renderQR(container, username) {
    if (!container) return;
    container.innerHTML = '';
    const size = 7;
    for (let i = 0; i < size * size; i++) {
      const cell = document.createElement('div');
      cell.className = 'qr-cell';
      // Deterministic pattern from username
      const code = username.charCodeAt(i % username.length) ^ i ^ 0b10110100;
      cell.classList.add(code % 2 === 0 ? 'filled' : 'empty');
      container.appendChild(cell);
    }
    // Force corners
    [0,1,5,6,7,13,42,43,47,48].forEach(i => {
      if (container.children[i]) container.children[i].classList.add('filled');
    });
  }
};
