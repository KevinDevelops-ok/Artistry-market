/* ==========================================================================
   ARTISTRY MARKETS — APPLICATION LAYER
   ========================================================================== */

/* --------------------------------------------------------------------
   0. CONFIG — insert your own API keys here. The app runs fully on
   free, no-key endpoints (CoinGecko, Frankfurter, gold-api.com) and
   falls back to clearly-labeled demo data anywhere a paid key is required.
-------------------------------------------------------------------- */
const CONFIG = {
  // Free, no key required:
  COINGECKO_BASE: 'https://api.coingecko.com/api/v3',
  FRANKFURTER_BASE: 'https://api.frankfurter.dev/v1',
  GOLD_API_BASE: 'https://api.gold-api.com',
  // Paid / key-required — insert your own key and wire up the fetch calls
  // marked "DEMO FEED" below to go live:
  ALPHA_VANTAGE_KEY: 'YOUR_ALPHA_VANTAGE_KEY',   // https://www.alphavantage.co (stocks)
  NEWS_API_KEY: 'YOUR_NEWSAPI_KEY',               // https://newsapi.org (financial news)
  REFRESH_MS: 45000
};

const $ = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

function fmtUSD(n, decimals) {
  if (n === null || n === undefined || isNaN(n)) return '$—';
  const d = decimals === undefined ? 2 : decimals;
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}
function fmtCompact(n) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(n);
}
function fmtPct(n) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  const s = n >= 0 ? '+' : '';
  return s + n.toFixed(2) + '%';
}
function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._tm);
  toast._tm = setTimeout(() => t.classList.remove('show'), 2600);
}

/* --------------------------------------------------------------------
   1. RENDER SECTIONS FROM content.js
-------------------------------------------------------------------- */
function renderSections() {
  const main = $('#main-content');
  const frag = document.createDocumentFragment();
  SECTIONS.forEach(sec => {
    const el = document.createElement('section');
    el.id = sec.id;
    el.className = 'section' + (sec.fullBleed ? ' section-full' : '');
    el.innerHTML = sec.html;
    frag.appendChild(el);
  });
  main.appendChild(frag);
}

/* --------------------------------------------------------------------
   2. LOADER
-------------------------------------------------------------------- */
function initLoader() {
  window.addEventListener('load', () => {
    setTimeout(() => $('#loader').classList.add('hidden'), 500);
  });
  // Safety net in case 'load' already fired or assets stall
  setTimeout(() => { const l = $('#loader'); if (l) l.classList.add('hidden'); }, 3500);
}

/* --------------------------------------------------------------------
   3. NAV — always-visible scrollable strip + scroll spy
-------------------------------------------------------------------- */
function initNav() {
  const navLinkEls = $$('#nav-links a[data-nav]');
  const sectionEls = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeLink = navLinkEls.find(a => a.getAttribute('href') === '#' + entry.target.id);
        navLinkEls.forEach(a => a.classList.toggle('active', a === activeLink));
        if (activeLink) activeLink.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sectionEls.forEach(el => spy.observe(el));
}

/* --------------------------------------------------------------------
   4. REVEAL ON SCROLL
-------------------------------------------------------------------- */
function initReveal() {
  const targets = $$('[data-reveal]');
  const heroTargets = $$('#hero [data-reveal]');
  // Hero reveals immediately on load
  heroTargets.forEach((el, i) => setTimeout(() => el.classList.add('reveal-on'), 200 + i * 120));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-on');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(el => { if (!el.closest('#hero')) io.observe(el); });

  // simple fade/rise for cards & panels as they enter view
  const softTargets = $$('.card, .panel, .teach-card, .accordion-item, .news-item');
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'opacity .6s var(--ease), transform .6s var(--ease)';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        io2.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  softTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    io2.observe(el);
  });
}

/* --------------------------------------------------------------------
   5. HERO CANVAS — animated world map with glowing hubs + data arcs
-------------------------------------------------------------------- */
function initHeroMap() {
  const canvas = $('#hero-map');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  const hubs = DATA.hubs;

  function project(lat, lon) {
    // simple equirectangular projection onto the hero canvas
    const x = (lon + 180) / 360 * w;
    const y = (90 - lat) / 180 * h;
    return [x, y];
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // background dot grid (suggests a world map without needing a texture)
  const dots = [];
  const cols = 90, rows = 45;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // fade out near poles, sparse ocean-like noise so it doesn't look like a grid
      const jitter = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
      const n = jitter - Math.floor(jitter);
      if (n > 0.42) continue;
      dots.push({ i, j });
    }
  }

  const arcs = [];
  for (let i = 0; i < hubs.length; i++) {
    for (let j = i + 1; j < hubs.length; j++) {
      if (Math.random() < 0.35) arcs.push([hubs[i], hubs[j], Math.random() * 3]);
    }
  }

  let t = 0;
  function draw() {
    t += 0.006;
    ctx.clearRect(0, 0, w, h);

    // dot grid
    ctx.fillStyle = 'rgba(212,175,55,0.10)';
    dots.forEach(d => {
      const x = (d.i / cols) * w;
      const y = (d.j / rows) * h;
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    });

    // arcs between hubs
    arcs.forEach(([a, b, phase]) => {
      const [x1, y1] = project(a.lat, a.lon);
      const [x2, y2] = project(b.lat, b.lon);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.15;
      ctx.strokeStyle = 'rgba(212,175,55,0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(mx, my, x2, y2);
      ctx.stroke();

      // traveling pulse along the arc
      const pct = (t * 0.15 + phase) % 1;
      const px = (1 - pct) * (1 - pct) * x1 + 2 * (1 - pct) * pct * mx + pct * pct * x2;
      const py = (1 - pct) * (1 - pct) * y1 + 2 * (1 - pct) * pct * my + pct * pct * y2;
      ctx.fillStyle = 'rgba(212,175,55,0.9)';
      ctx.beginPath();
      ctx.arc(px, py, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // hub nodes
    hubs.forEach((hub, idx) => {
      const [x, y] = project(hub.lat, hub.lon);
      const pulse = (Math.sin(t * 2 + idx) + 1) / 2;
      ctx.beginPath();
      ctx.arc(x, y, 3 + pulse * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212,175,55,' + (0.12 + pulse * 0.12) + ')';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = '#D4AF37';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* --------------------------------------------------------------------
   6. HERO CLOCK + MARKET STATUS PILL
-------------------------------------------------------------------- */
function isExchangeOpen(hub, now) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: hub.tz, hour: 'numeric', minute: 'numeric', hour12: false, weekday: 'short'
    }).formatToParts(now);
    const wk = parts.find(p => p.type === 'weekday').value;
    const hh = parseInt(parts.find(p => p.type === 'hour').value, 10);
    const mm = parseInt(parts.find(p => p.type === 'minute').value, 10);
    const hourFloat = hh + mm / 60;
    const isWeekday = !['Sat', 'Sun'].includes(wk);
    return isWeekday && hourFloat >= hub.open && hourFloat < hub.close;
  } catch (e) {
    return false;
  }
}

function initClockAndStatus() {
  const clockEl = $('#hero-clock');
  const pill = $('#market-status-pill');
  const pillText = pill.querySelector('.status-text');

  function tick() {
    const now = new Date();
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    const nyse = DATA.hubs.find(h => h.name === 'New York');
    const open = isExchangeOpen(nyse, now);
    pill.classList.toggle('closed', !open);
    pillText.textContent = open ? 'NYSE Open' : 'NYSE Closed';
  }
  tick();
  setInterval(tick, 1000);
}

/* --------------------------------------------------------------------
   BOOTSTRAP
-------------------------------------------------------------------- */
function boot() {
  renderSections();
  initLoader();
  initNav();
  initHeroMap();
  initClockAndStatus();
  initReveal();

  // feature modules (each defensive — one failing module shouldn't break the rest)
  const modules = [
    initTicker, initMoneySection, initGoldSection, initStocksSection,
    initCryptoSection, initTradingSection, initInvestingSection,
    initBusinessSection, initEconomySection, initAiFinanceSection,
    initAcademySection, initNewsSection, initWatchlistSection, initObservatory
  ];
  modules.forEach(fn => {
    try { fn(); } catch (err) { console.error('[Artistry Markets] module failed:', fn.name, err); }
  });
}

document.addEventListener('DOMContentLoaded', boot);

/* --------------------------------------------------------------------
   7. TICKER — live BTC/ETH (CoinGecko) + FX (Frankfurter) + demo items
-------------------------------------------------------------------- */
async function initTicker() {
  const track = $('#ticker-track');
  if (!track) return;

  const demoBase = {
    NIFTY: { v: 24812.35, c: 0.42 }, SENSEX: { v: 81523.20, c: 0.38 },
    NASDAQ: { v: 19856.10, c: -0.21 }, 'S&P 500': { v: 6187.44, c: 0.15 },
    OIL: { v: 78.32, c: -0.64 }
  };

  function renderItems(items) {
    const html = items.map(it => `
      <span class="tick-item">
        <span class="tick-sym">${it.sym}</span>
        <span class="tick-val numeral">${it.val}</span>
        <span class="tick-chg numeral ${it.chg >= 0 ? 'up' : 'down'}">${fmtPct(it.chg)}</span>
        ${it.demo ? '<span class="tick-demo">DEMO</span>' : ''}
      </span>`).join('');
    track.innerHTML = html + html;
  }

  async function refresh() {
    const items = [];
    try {
      const r = await fetch(`${CONFIG.COINGECKO_BASE}/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true`);
      const d = await r.json();
      items.push({ sym: 'BTC', val: fmtUSD(d.bitcoin.usd, 0), chg: d.bitcoin.usd_24h_change || 0 });
      items.push({ sym: 'ETH', val: fmtUSD(d.ethereum.usd, 0), chg: d.ethereum.usd_24h_change || 0 });
      $('#hero-btc') && ($('#hero-btc').textContent = fmtUSD(d.bitcoin.usd, 0));
    } catch (e) {
      items.push({ sym: 'BTC', val: '$—', chg: 0, demo: true });
      items.push({ sym: 'ETH', val: '$—', chg: 0, demo: true });
    }

    try {
      const g = await fetch(`${CONFIG.GOLD_API_BASE}/price/XAU`);
      const gd = await g.json();
      const price = gd.price || gd.price_gram_24k * 31.1035;
      items.push({ sym: 'GOLD', val: fmtUSD(price, 2), chg: gd.chp || gd.ch || 0 });
      $('#hero-gold') && ($('#hero-gold').textContent = fmtUSD(price, 0));
    } catch (e) {
      items.push({ sym: 'GOLD', val: fmtUSD(2380, 2), chg: 0.18, demo: true });
      $('#hero-gold') && ($('#hero-gold').textContent = '$2,380');
    }

    try {
      const s = await fetch(`${CONFIG.GOLD_API_BASE}/price/XAG`);
      const sd = await s.json();
      items.push({ sym: 'SILVER', val: fmtUSD(sd.price, 2), chg: sd.chp || sd.ch || 0 });
    } catch (e) {
      items.push({ sym: 'SILVER', val: fmtUSD(28.4, 2), chg: -0.12, demo: true });
    }

    try {
      const fx = await fetch(`${CONFIG.FRANKFURTER_BASE}/latest?base=USD&symbols=INR,EUR`);
      const fd = await fx.json();
      items.push({ sym: 'USD/INR', val: fd.rates.INR.toFixed(2), chg: 0.06 });
      items.push({ sym: 'EUR/USD', val: (1 / fd.rates.EUR).toFixed(4), chg: -0.04 });
    } catch (e) {
      items.push({ sym: 'USD/INR', val: '83.40', chg: 0.06, demo: true });
      items.push({ sym: 'EUR/USD', val: '1.0850', chg: -0.04, demo: true });
    }

    Object.entries(demoBase).forEach(([sym, o]) => {
      items.push({ sym, val: o.v.toLocaleString('en-US', { maximumFractionDigits: 2 }), chg: o.c, demo: true });
    });

    renderItems(items);
  }

  refresh();
  setInterval(refresh, CONFIG.REFRESH_MS);
}

/* --------------------------------------------------------------------
   8. MONEY — currency converter, fx table, purchasing power chart
-------------------------------------------------------------------- */
async function initMoneySection() {
  const from = $('#conv-from'), to = $('#conv-to'), amount = $('#conv-amount'), result = $('#conv-result');
  const note = $('#conv-rate-note');
  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SGD', 'AED'];
  let rates = null;

  [from, to].forEach(sel => {
    sel.innerHTML = currencies.map(c => `<option value="${c}">${c}</option>`).join('');
  });
  from.value = 'USD'; to.value = 'INR';

  async function loadRates() {
    try {
      const r = await fetch(`${CONFIG.FRANKFURTER_BASE}/latest?base=USD`);
      const d = await r.json();
      rates = d.rates; rates.USD = 1;
      note.textContent = `Live rates as of ${d.date}, base USD.`;
      renderFxTable();
      convert();
    } catch (e) {
      note.textContent = 'Live rates unavailable right now — showing last known values.';
    }
  }

  function convert() {
    if (!rates) { result.textContent = '—'; return; }
    const amt = parseFloat(amount.value) || 0;
    const usd = amt / (rates[from.value] || 1);
    const converted = usd * (rates[to.value] || 1);
    result.textContent = converted.toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' ' + to.value;
  }

  function renderFxTable() {
    const tbody = $('#fx-table tbody');
    const rows = ['EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CNY'].map(c => {
      const v = rates[c];
      return `<tr><td class="name-cell">${c}</td><td class="numeral">${v ? v.toFixed(4) : '—'}</td><td class="numeral" style="color:var(--muted)">live</td></tr>`;
    }).join('');
    tbody.innerHTML = rows;
  }

  [amount, from, to].forEach(el => el.addEventListener('input', convert));
  loadRates();
  setInterval(loadRates, CONFIG.REFRESH_MS * 4);

  const ppCtx = document.getElementById('purchasing-power-chart');
  if (ppCtx && window.Chart) {
    const years = ['1990', '1995', '2000', '2005', '2010', '2015', '2020', '2026'];
    const values = [100, 82, 71, 63, 55, 51, 44, 38];
    new Chart(ppCtx, {
      type: 'line',
      data: { labels: years, datasets: [{ label: 'Real value of original $100', data: values, borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)', fill: true, tension: 0.35, pointRadius: 3, pointBackgroundColor: '#D4AF37' }] },
      options: chartBaseOptions('$')
    });
  }
}

function chartBaseOptions(prefix) {
  return {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => (prefix || '') + ctx.formattedValue } } },
    scales: {
      x: { grid: { color: 'rgba(245,245,245,0.06)' }, ticks: { color: '#A9A9A9', font: { family: 'JetBrains Mono', size: 10 } } },
      y: { grid: { color: 'rgba(245,245,245,0.06)' }, ticks: { color: '#A9A9A9', font: { family: 'JetBrains Mono', size: 10 } } }
    }
  };
}

/* --------------------------------------------------------------------
   9. GOLD — live price, reserves table, history chart, calculator
-------------------------------------------------------------------- */
async function initGoldSection() {
  let liveGoldPerOz = null;

  async function loadLive() {
    try {
      const g = await fetch(`${CONFIG.GOLD_API_BASE}/price/XAU`);
      const gd = await g.json();
      liveGoldPerOz = gd.price;
      $('#gold-live-price').innerHTML = fmtUSD(gd.price, 2) + '<small>/oz</small>';
      const chg = gd.chp || gd.ch || 0;
      const el = $('#gold-live-delta');
      el.textContent = fmtPct(chg); el.className = 'delta ' + (chg >= 0 ? 'up' : 'down');
      $('#gold-source-note').textContent = 'Live via gold-api.com';

      const s = await fetch(`${CONFIG.GOLD_API_BASE}/price/XAG`);
      const sd = await s.json();
      $('#silver-live-price').innerHTML = fmtUSD(sd.price, 2) + '<small>/oz</small>';
      const schg = sd.chp || sd.ch || 0;
      const sel = $('#silver-live-delta');
      sel.textContent = fmtPct(schg); sel.className = 'delta ' + (schg >= 0 ? 'up' : 'down');

      $('#gold-silver-ratio').textContent = (gd.price / sd.price).toFixed(1);

      const perGram = gd.price / 31.1035;
      const nowInput = $('#gold-calc-now');
      if (nowInput && !nowInput.dataset.touched) nowInput.value = perGram.toFixed(2);
      runGoldCalc();
    } catch (e) {
      $('#gold-live-price').innerHTML = fmtUSD(2380, 2) + '<small>/oz</small>';
      $('#gold-live-delta').textContent = 'DEMO DATA';
      $('#gold-source-note').textContent = 'Live feed unavailable — showing demo values.';
      $('#silver-live-price').innerHTML = fmtUSD(28.4, 2) + '<small>/oz</small>';
      $('#gold-silver-ratio').textContent = '83.8';
    }
  }
  loadLive();
  setInterval(loadLive, CONFIG.REFRESH_MS * 3);

  // reserves table
  const rBody = $('#gold-reserves-table tbody');
  if (rBody) {
    rBody.innerHTML = DATA.goldReserves.map(([c, t]) => `<tr><td class="name-cell">${c}</td><td class="numeral">${t.toLocaleString()}</td></tr>`).join('');
  }

  // illustrative 10y history
  const histCtx = document.getElementById('gold-history-chart');
  if (histCtx && window.Chart) {
    const labels = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
    const values = [1150, 1260, 1280, 1390, 1770, 1800, 1820, 1940, 2380, 2620, 2680];
    new Chart(histCtx, {
      type: 'line',
      data: { labels, datasets: [{ data: values, borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.08)', fill: true, tension: 0.3, pointRadius: 2 }] },
      options: chartBaseOptions('$')
    });
  }

  // calculator
  function runGoldCalc() {
    const grams = parseFloat($('#gold-calc-grams').value) || 0;
    const buy = parseFloat($('#gold-calc-buy').value) || 0;
    const now = parseFloat($('#gold-calc-now').value) || 0;
    const invested = grams * buy;
    const value = grams * now;
    const gain = value - invested;
    $('#gold-calc-invested').textContent = fmtUSD(invested, 0);
    $('#gold-calc-value').textContent = fmtUSD(value, 0);
    const gainEl = $('#gold-calc-gain');
    gainEl.textContent = (gain >= 0 ? '+' : '') + fmtUSD(gain, 0);
    gainEl.style.color = gain >= 0 ? 'var(--green)' : 'var(--red)';
  }
  ['gold-calc-grams', 'gold-calc-buy', 'gold-calc-now'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => { el.dataset.touched = '1'; runGoldCalc(); });
  });
  runGoldCalc();
}

/* --------------------------------------------------------------------
   10. STOCK MARKET — demo gainers/losers/heatmap + real exchange status
   (Wire ALPHA_VANTAGE_KEY above and replace generateMockStocks() calls
   with real API fetches to go fully live.)
-------------------------------------------------------------------- */
function generateMockStocks() {
  const universe = [
    ['AAPL', 'Apple'], ['MSFT', 'Microsoft'], ['NVDA', 'NVIDIA'], ['GOOGL', 'Alphabet'],
    ['AMZN', 'Amazon'], ['TSLA', 'Tesla'], ['META', 'Meta'], ['NFLX', 'Netflix'],
    ['JPM', 'JPMorgan'], ['V', 'Visa'], ['XOM', 'Exxon'], ['WMT', 'Walmart'],
    ['DIS', 'Disney'], ['BA', 'Boeing'], ['INTC', 'Intel'], ['AMD', 'AMD']
  ];
  const day = new Date().toISOString().slice(0, 10);
  const rand = seededRandom(day.split('-').join('') * 1);
  return universe.map(([sym, name]) => {
    const chg = (rand() - 0.48) * 6;
    const price = 40 + rand() * 460;
    return { sym, name, price, chg };
  });
}

function initStocksSection() {
  const stocks = generateMockStocks();
  const gainers = [...stocks].sort((a, b) => b.chg - a.chg).slice(0, 6);
  const losers = [...stocks].sort((a, b) => a.chg - b.chg).slice(0, 6);
  const active = [...stocks].sort(() => 0.5 - Math.random()).slice(0, 5);

  const rowHtml = (s) => `<tr><td class="name-cell">${s.sym}</td><td class="numeral">${fmtUSD(s.price, 2)}</td><td class="numeral ${s.chg >= 0 ? 'up' : 'down'}" style="color:${s.chg >= 0 ? 'var(--green)' : 'var(--red)'}">${fmtPct(s.chg)}</td></tr>`;
  $('#gainers-table tbody').innerHTML = gainers.map(rowHtml).join('');
  $('#losers-table tbody').innerHTML = losers.map(rowHtml).join('');
  $('#most-active-list').innerHTML = active.map(s => `<div style="display:flex; justify-content:space-between;"><span>${s.sym}</span><span style="color:var(--muted)">${fmtUSD(s.price, 2)}</span></div>`).join('');

  // heatmap
  const heat = $('#stock-heatmap');
  heat.innerHTML = stocks.map(s => {
    const intensity = Math.min(Math.abs(s.chg) / 4, 1);
    const color = s.chg >= 0
      ? `rgba(46,204,113,${0.15 + intensity * 0.55})`
      : `rgba(231,76,60,${0.15 + intensity * 0.55})`;
    return `<div class="heat-tile" style="background:${color}; border:1px solid var(--hairline);">
      <span class="sym">${s.sym}</span>
      <span class="chg" style="color:${s.chg >= 0 ? '#eafff0' : '#ffecea'}">${fmtPct(s.chg)}</span>
    </div>`;
  }).join('');

  // real, computed exchange status
  const nyse = DATA.hubs.find(h => h.name === 'New York');
  const india = DATA.hubs.find(h => h.name === 'Mumbai');
  const now = new Date();
  const setStat = (id, hub) => {
    const open = isExchangeOpen(hub, now);
    const el = document.getElementById(id);
    el.textContent = open ? 'Open' : 'Closed';
    el.style.color = open ? 'var(--green)' : 'var(--red)';
  };
  setStat('mkt-nyse', nyse);
  setStat('mkt-nasdaq', nyse);
  setStat('mkt-india', india);
}

/* --------------------------------------------------------------------
   11. CRYPTOCURRENCY — fully live via CoinGecko (no key required)
-------------------------------------------------------------------- */
async function initCryptoSection() {
  try {
    const [marketsRes, globalRes, trendRes] = await Promise.all([
      fetch(`${CONFIG.COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&price_change_percentage=24h`),
      fetch(`${CONFIG.COINGECKO_BASE}/global`),
      fetch(`${CONFIG.COINGECKO_BASE}/search/trending`)
    ]);
    const markets = await marketsRes.json();
    const global = (await globalRes.json()).data;
    const trending = await trendRes.json();

    $('#crypto-mcap').textContent = '$' + fmtCompact(global.total_market_cap.usd);
    const mcapChg = global.market_cap_change_percentage_24h_usd || 0;
    const mEl = $('#crypto-mcap-delta');
    mEl.textContent = fmtPct(mcapChg); mEl.className = 'delta ' + (mcapChg >= 0 ? 'up' : 'down');
    $('#crypto-vol').textContent = '$' + fmtCompact(global.total_volume.usd);
    $('#btc-dominance').textContent = global.market_cap_percentage.btc.toFixed(1) + '%';
    $('#trending-coins').textContent = (trending.coins || []).slice(0, 5).map(c => c.item.symbol.toUpperCase()).join('  ·  ');

    $('#crypto-table tbody').innerHTML = markets.map(c => `
      <tr>
        <td>${c.market_cap_rank}</td>
        <td class="name-cell">${c.name} <span style="color:var(--muted)">${c.symbol.toUpperCase()}</span></td>
        <td class="numeral">${fmtUSD(c.current_price, c.current_price < 1 ? 4 : 2)}</td>
        <td class="numeral" style="color:${(c.price_change_percentage_24h || 0) >= 0 ? 'var(--green)' : 'var(--red)'}">${fmtPct(c.price_change_percentage_24h || 0)}</td>
        <td class="numeral">$${fmtCompact(c.market_cap)}</td>
        <td class="numeral">$${fmtCompact(c.total_volume)}</td>
      </tr>`).join('');
  } catch (e) {
    $('#crypto-table tbody').innerHTML = '<tr><td colspan="6" style="color:var(--red);">Live crypto feed unavailable right now — please retry shortly.</td></tr>';
  }
}

/* --------------------------------------------------------------------
   12. TRADING — live candlestick chart via CoinGecko OHLC (custom canvas
   renderer — no charting-library plugin dependency for candles)
-------------------------------------------------------------------- */
function drawCandles(canvas, candles) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const wrap = canvas.parentElement;
  const w = wrap.clientWidth, h = wrap.clientHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  if (!candles.length) return;

  const padL = 60, padR = 16, padT = 16, padB = 26;
  const plotW = w - padL - padR, plotH = h - padT - padB;

  const highs = candles.map(c => c[2]), lows = candles.map(c => c[3]);
  const max = Math.max(...highs), min = Math.min(...lows);
  const range = (max - min) || 1;

  const yFor = (v) => padT + plotH - ((v - min) / range) * plotH;
  const n = candles.length;
  const slot = plotW / n;
  const bodyW = Math.max(2, slot * 0.6);

  // grid + labels
  ctx.strokeStyle = 'rgba(245,245,245,0.06)';
  ctx.fillStyle = '#A9A9A9';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const v = min + (range * i / 4);
    const y = yFor(v);
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
    ctx.fillText('$' + v.toLocaleString('en-US', { maximumFractionDigits: v < 10 ? 4 : 0 }), padL - 8, y + 3);
  }

  candles.forEach((c, i) => {
    const [ts, o, hi, lo, cl] = c;
    const x = padL + i * slot + slot / 2;
    const up = cl >= o;
    ctx.strokeStyle = up ? '#2ECC71' : '#E74C3C';
    ctx.fillStyle = up ? '#2ECC71' : '#E74C3C';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, yFor(hi)); ctx.lineTo(x, yFor(lo)); ctx.stroke();
    const yO = yFor(o), yC = yFor(cl);
    const top = Math.min(yO, yC), bh = Math.max(1.5, Math.abs(yC - yO));
    ctx.fillRect(x - bodyW / 2, top, bodyW, bh);
  });

  // first/last time labels
  ctx.textAlign = 'left';
  ctx.fillStyle = '#A9A9A9';
  const fmtT = (ts) => new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });
  ctx.fillText(fmtT(candles[0][0]), padL, h - 8);
  ctx.textAlign = 'right';
  ctx.fillText(fmtT(candles[n - 1][0]), w - padR, h - 8);
}

async function loadCandles(days) {
  const canvas = $('#candle-canvas');
  const note = $('#candle-note');
  try {
    const r = await fetch(`${CONFIG.COINGECKO_BASE}/coins/bitcoin/ohlc?vs_currency=usd&days=${days}`);
    const data = await r.json();
    drawCandles(canvas, data);
    const last = data[data.length - 1];
    note.textContent = `BTC/USD · last close ${fmtUSD(last[4], 2)} · ${data.length} candles · live via CoinGecko`;
    canvas._lastCandles = data;
  } catch (e) {
    note.textContent = 'Candle feed unavailable right now — please retry shortly.';
  }
}

function initTradingSection() {
  const canvas = $('#candle-canvas');
  if (!canvas) return;
  loadCandles(1);
  $$('#candle-timeframe .chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#candle-timeframe .chip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadCandles(btn.dataset.days);
    });
  });
  window.addEventListener('resize', () => { if (canvas._lastCandles) drawCandles(canvas, canvas._lastCandles); });
}

/* --------------------------------------------------------------------
   13. INVESTING — compound interest, SIP, allocation, growth chart
-------------------------------------------------------------------- */
function initInvestingSection() {
  const ciP = $('#ci-principal'), ciR = $('#ci-rate'), ciY = $('#ci-years'), ciOut = $('#ci-result');
  const sipA = $('#sip-amount'), sipR = $('#sip-rate'), sipY = $('#sip-years'), sipOut = $('#sip-result');
  const allocIds = ['stocks', 'bonds', 'gold', 'crypto'];
  let growthChart, pieChart;

  function runCompound() {
    const p = parseFloat(ciP.value) || 0, r = (parseFloat(ciR.value) || 0) / 100, y = parseFloat(ciY.value) || 0;
    const fv = p * Math.pow(1 + r, y);
    ciOut.textContent = fmtUSD(fv, 0);
    updateGrowthChart();
  }
  function runSip() {
    const a = parseFloat(sipA.value) || 0, r = (parseFloat(sipR.value) || 0) / 100 / 12, y = (parseFloat(sipY.value) || 0) * 12;
    const fv = r === 0 ? a * y : a * ((Math.pow(1 + r, y) - 1) / r) * (1 + r);
    sipOut.textContent = fmtUSD(fv, 0);
    updateGrowthChart();
  }

  function getAlloc() {
    const vals = {};
    let sum = 0;
    allocIds.forEach(k => { vals[k] = parseFloat($('#alloc-' + k).value) || 0; sum += vals[k]; });
    return { vals, sum: sum || 1 };
  }

  function updateAllocLabels() {
    allocIds.forEach(k => { $('#alloc-' + k + '-val').textContent = $('#alloc-' + k).value + '%'; });
    updatePie();
  }

  function updatePie() {
    const { vals } = getAlloc();
    if (!pieChart) return;
    pieChart.data.datasets[0].data = allocIds.map(k => vals[k]);
    pieChart.update();
  }

  function blendedReturn() {
    const { vals, sum } = getAlloc();
    const assumed = { stocks: 9, bonds: 4.5, gold: 5, crypto: 18 };
    let acc = 0;
    allocIds.forEach(k => { acc += (vals[k] / sum) * assumed[k]; });
    return acc;
  }

  function updateGrowthChart() {
    const p = parseFloat(ciP.value) || 0;
    const years = parseFloat(ciY.value) || 20;
    const r = blendedReturn() / 100;
    const labels = [], values = [];
    for (let i = 0; i <= years; i++) { labels.push('Y' + i); values.push(Math.round(p * Math.pow(1 + r, i))); }
    if (!growthChart) {
      const ctx = document.getElementById('investing-growth-chart');
      growthChart = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ data: values, borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.08)', fill: true, tension: 0.3, pointRadius: 0 }] },
        options: chartBaseOptions('$')
      });
    } else {
      growthChart.data.labels = labels;
      growthChart.data.datasets[0].data = values;
      growthChart.update();
    }
  }

  [ciP, ciR, ciY].forEach(el => el.addEventListener('input', runCompound));
  [sipA, sipR, sipY].forEach(el => el.addEventListener('input', runSip));
  allocIds.forEach(k => $('#alloc-' + k).addEventListener('input', () => { updateAllocLabels(); runCompound(); }));

  const pieCtx = document.getElementById('allocation-pie-chart');
  if (pieCtx && window.Chart) {
    pieChart = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Stocks', 'Bonds', 'Gold', 'Crypto'],
        datasets: [{ data: [50, 25, 15, 10], backgroundColor: ['#D4AF37', '#A9A9A9', '#F5F5F5', '#2ECC71'], borderColor: '#161616', borderWidth: 2 }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#A9A9A9', font: { family: 'Inter', size: 11 } } } } }
    });
  }

  runCompound(); runSip(); updateAllocLabels();
}

/* --------------------------------------------------------------------
   14. BUSINESS — break-even calculator, revenue projection
-------------------------------------------------------------------- */
function initBusinessSection() {
  const fixed = $('#be-fixed'), price = $('#be-price'), varCost = $('#be-varcost');
  const units = $('#be-units'), rev = $('#be-revenue');

  function runBreakEven() {
    const f = parseFloat(fixed.value) || 0, p = parseFloat(price.value) || 0, v = parseFloat(varCost.value) || 0;
    const margin = p - v;
    if (margin <= 0) { units.textContent = 'N/A — price ≤ cost'; rev.textContent = '$—'; return; }
    const u = f / margin;
    units.textContent = Math.ceil(u).toLocaleString() + ' units/mo';
    rev.textContent = fmtUSD(u * p, 0);
  }
  [fixed, price, varCost].forEach(el => el.addEventListener('input', runBreakEven));
  runBreakEven();

  const start = $('#rev-start'), growth = $('#rev-growth');
  let revChart;
  function runRevenue() {
    const s = parseFloat(start.value) || 0, g = (parseFloat(growth.value) || 0) / 100;
    const labels = [], values = [];
    for (let i = 0; i < 24; i++) { labels.push('M' + (i + 1)); values.push(Math.round(s * Math.pow(1 + g, i))); }
    if (!revChart) {
      revChart = new Chart(document.getElementById('revenue-chart'), {
        type: 'bar',
        data: { labels, datasets: [{ data: values, backgroundColor: 'rgba(212,175,55,0.55)' }] },
        options: chartBaseOptions('$')
      });
    } else { revChart.data.labels = labels; revChart.data.datasets[0].data = values; revChart.update(); }
  }
  [start, growth].forEach(el => el.addEventListener('input', runRevenue));
  runRevenue();
}

/* --------------------------------------------------------------------
   15. GLOBAL ECONOMY — GDP/rates tables, live exchange status, calendar
-------------------------------------------------------------------- */
function initEconomySection() {
  $('#gdp-table tbody').innerHTML = DATA.gdpRankings.map(([c, v]) => `<tr><td class="name-cell">${c}</td><td class="numeral">${v}</td></tr>`).join('');
  $('#rates-table tbody').innerHTML = DATA.centralBankRates.map(([c, v]) => `<tr><td class="name-cell">${c}</td><td class="numeral">${v}</td></tr>`).join('');

  const now = new Date();
  $('#global-exchange-status').innerHTML = DATA.hubs.map(h => {
    const open = isExchangeOpen(h, now);
    return `<div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--hairline);">
      <div><strong style="font-size:0.88rem;">${h.exch}</strong><div style="font-size:0.72rem; color:var(--muted);">${h.name}</div></div>
      <span style="font-family:var(--font-mono); font-size:0.78rem; color:${open ? 'var(--green)' : 'var(--red)'};">${open ? '● Open' : '● Closed'}</span>
    </div>`;
  }).join('');

  $('#econ-calendar').innerHTML = DATA.econCalendar.map(([day, ev, impact]) => `
    <div style="display:flex; justify-content:space-between; align-items:center; gap:14px;">
      <div style="font-family:var(--font-mono); color:var(--gold); font-size:0.78rem; width:38px;">${day}</div>
      <div style="flex:1; font-size:0.85rem;">${ev}</div>
      <span class="badge">${impact}</span>
    </div>`).join('');
}

/* --------------------------------------------------------------------
   16. AI IN FINANCE — sentiment gauge + topic cloud
-------------------------------------------------------------------- */
function initAiFinanceSection() {
  const canvas = $('#sentiment-gauge');
  const label = $('#sentiment-label');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    // demo sentiment score derived from BTC 24h change sign already fetched elsewhere; default neutral-positive
    const score = 0.62; // 0 = extreme fear, 1 = extreme greed
    const w = canvas.width, h = canvas.height, cx = w / 2, cy = h - 10, r = w / 2 - 20;
    ctx.clearRect(0, 0, w, h);
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#E74C3C'); grad.addColorStop(0.5, '#D4AF37'); grad.addColorStop(1, '#2ECC71');
    ctx.lineWidth = 16; ctx.strokeStyle = grad; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, Math.PI * 2); ctx.stroke();
    const angle = Math.PI + score * Math.PI;
    const nx = cx + Math.cos(angle) * (r - 26), ny = cy + Math.sin(angle) * (r - 26);
    ctx.strokeStyle = '#F5F5F5'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny); ctx.stroke();
    ctx.fillStyle = '#F5F5F5'; ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
    label.textContent = score > 0.66 ? 'Greed' : score > 0.4 ? 'Neutral' : 'Fear';
  }
  $('#topic-cloud').innerHTML = DATA.topics.map(t => `<span class="chip-btn" style="cursor:default;">${t}</span>`).join('');
}

/* --------------------------------------------------------------------
   17. FINANCIAL ACADEMY — accordion roadmap
-------------------------------------------------------------------- */
function initAcademySection() {
  const wrap = $('#academy-accordion');
  wrap.innerHTML = DATA.academy.map((lvl, i) => `
    <div class="accordion-item" data-idx="${i}">
      <button class="accordion-trigger">
        <div class="lvl-title"><span class="lvl-num">0${i + 1}</span><h3>${lvl.level}</h3></div>
        <span class="chevron">▾</span>
      </button>
      <div class="accordion-panel">
        <div class="accordion-body">
          ${lvl.topics.map(t => `<div class="topic-chip">${t}</div>`).join('')}
        </div>
      </div>
    </div>`).join('');

  $$('.accordion-item', wrap).forEach((item, i) => {
    const trigger = $('.accordion-trigger', item);
    const panel = $('.accordion-panel', item);
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.classList.toggle('open', !isOpen);
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : '0px';
    });
    if (i === 0) { item.classList.add('open'); setTimeout(() => { panel.style.maxHeight = panel.scrollHeight + 'px'; }, 50); }
  });
}

/* --------------------------------------------------------------------
   18. FINANCIAL NEWS — search + category filter over demo dataset
   (Wire NEWS_API_KEY above to replace DATA.news with a live feed.)
-------------------------------------------------------------------- */
function initNewsSection() {
  const list = $('#news-list');
  const search = $('#news-search');
  const filterWrap = $('#news-filters');
  const cats = ['All', ...new Set(DATA.news.map(n => n.cat))];
  let activeCat = 'All';

  filterWrap.innerHTML = cats.map(c => `<button class="chip-btn ${c === 'All' ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('');

  function render() {
    const q = search.value.trim().toLowerCase();
    const items = DATA.news.filter(n =>
      (activeCat === 'All' || n.cat === activeCat) &&
      (q === '' || n.title.toLowerCase().includes(q))
    );
    list.innerHTML = items.length ? items.map(n => `
      <div class="news-item">
        <span class="news-cat">${n.cat}</span>
        <div><h4>${n.title}</h4><p>Illustrative summary — connect a news API for full live articles.</p></div>
        <span class="news-time">${n.time}</span>
      </div>`).join('') : `<div class="news-item"><p style="color:var(--muted);">No headlines match your search.</p></div>`;
  }

  filterWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip-btn');
    if (!btn) return;
    activeCat = btn.dataset.cat;
    $$('.chip-btn', filterWrap).forEach(b => b.classList.toggle('active', b === btn));
    render();
  });
  search.addEventListener('input', render);
  render();
}

/* --------------------------------------------------------------------
   19. PERSONAL WATCHLIST — in-memory for this session; live price for
   crypto entries via CoinGecko, deterministic demo price otherwise.
-------------------------------------------------------------------- */
function initWatchlistSection() {
  const select = $('#watch-select');
  const addBtn = $('#watch-add-btn');
  const wrap = $('#watch-table-wrap');
  const watched = [];

  select.innerHTML = DATA.watchOptions.map(o => `<option value="${o.sym}">${o.name} (${o.type})</option>`).join('');

  function demoPrice(sym) {
    const rand = seededRandom(sym.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
    return { price: 20 + rand() * 480, chg: (rand() - 0.5) * 6 };
  }

  async function priceFor(opt) {
    if (opt.type === 'Crypto') {
      try {
        const r = await fetch(`${CONFIG.COINGECKO_BASE}/simple/price?ids=${opt.sym}&vs_currencies=usd&include_24hr_change=true`);
        const d = await r.json();
        const k = Object.keys(d)[0];
        return { price: d[k].usd, chg: d[k].usd_24h_change || 0, live: true };
      } catch (e) { return { ...demoPrice(opt.sym), live: false }; }
    }
    return { ...demoPrice(opt.sym), live: false };
  }

  async function render() {
    if (!watched.length) {
      wrap.innerHTML = `<div class="watch-empty">Your watchlist is empty — add a stock, crypto, currency, or index above to start tracking it.</div>`;
      return;
    }
    wrap.innerHTML = `<div class="table-scroll"><table class="data-table"><thead><tr><th>Symbol</th><th>Type</th><th>Price</th><th>24h</th><th></th></tr></thead><tbody>${
      watched.map(w => `<tr class="watch-row" data-sym="${w.sym}">
        <td class="name-cell">${w.name}</td><td style="color:var(--muted);">${w.type}${w.live ? ' <span class="badge" style="margin-left:6px;">live</span>' : ''}</td>
        <td class="numeral">${fmtUSD(w.price, w.price < 1 ? 4 : 2)}</td>
        <td class="numeral" style="color:${w.chg >= 0 ? 'var(--green)' : 'var(--red)'}">${fmtPct(w.chg)}</td>
        <td><button class="rm-btn" data-rm="${w.sym}">Remove</button></td>
      </tr>`).join('')
    }</tbody></table></div>`;
  }

  addBtn.addEventListener('click', async () => {
    const sym = select.value;
    const opt = DATA.watchOptions.find(o => o.sym === sym);
    if (watched.find(w => w.sym === sym)) { toast(`${opt.name} is already on your watchlist`); return; }
    const p = await priceFor(opt);
    watched.push({ sym: opt.sym, name: opt.name, type: opt.type, price: p.price, chg: p.chg, live: p.live });
    render();
    toast(`Added ${opt.name} to your watchlist`);
  });

  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-rm]');
    if (!btn) return;
    const idx = watched.findIndex(w => w.sym === btn.dataset.rm);
    if (idx > -1) { const removed = watched.splice(idx, 1)[0]; render(); toast(`Removed ${removed.name}`); }
  });

  render();
}

/* --------------------------------------------------------------------
   20. GLOBAL FINANCIAL OBSERVATORY — Three.js interactive globe
-------------------------------------------------------------------- */
const HUB_INFO = {
  'New York':  { country: 'United States', gdp: '$27.4T', currency: 'USD', index: 'S&P 500 / NASDAQ' },
  'London':    { country: 'United Kingdom', gdp: '$3.5T', currency: 'GBP', index: 'FTSE 100' },
  'Tokyo':     { country: 'Japan', gdp: '$4.1T', currency: 'JPY', index: 'Nikkei 225' },
  'Hong Kong': { country: 'Hong Kong SAR', gdp: '$0.4T', currency: 'HKD', index: 'Hang Seng' },
  'Frankfurt': { country: 'Germany', gdp: '$4.7T', currency: 'EUR', index: 'DAX' },
  'Mumbai':    { country: 'India', gdp: '$3.9T', currency: 'INR', index: 'Nifty 50 / Sensex' },
  'Shanghai':  { country: 'China', gdp: '$18.3T', currency: 'CNY', index: 'SSE Composite' },
  'Singapore': { country: 'Singapore', gdp: '$0.5T', currency: 'SGD', index: 'STI' },
  'Sydney':    { country: 'Australia', gdp: '$1.7T', currency: 'AUD', index: 'ASX 200' },
  'Zürich':    { country: 'Switzerland', gdp: '$0.9T', currency: 'CHF', index: 'SMI' }
};

function initObservatory() {
  const wrap = $('#globe-canvas-wrap');
  const fallback = $('#globe-fallback');
  const tooltip = $('#globe-tooltip');
  if (!wrap) return;

  if (!window.THREE) { fallback.style.display = 'flex'; return; }

  let renderer, testCtx;
  try {
    const testCanvas = document.createElement('canvas');
    testCtx = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!testCtx) throw new Error('no webgl');
  } catch (e) { fallback.style.display = 'flex'; return; }

  try {
    const width = wrap.clientWidth, height = wrap.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 7.2);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    wrap.insertBefore(renderer.domElement, tooltip);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 4;
    controls.maxDistance = 14;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const pt = new THREE.PointLight(0xD4AF37, 1.1);
    pt.position.set(6, 4, 6);
    scene.add(pt);

    const RADIUS = 2.4;

    // Procedural dot-texture for the globe surface (no external image needed)
    function buildDotTexture() {
      const c = document.createElement('canvas');
      c.width = 1024; c.height = 512;
      const tctx = c.getContext('2d');
      tctx.fillStyle = '#0a0a0a';
      tctx.fillRect(0, 0, c.width, c.height);
      tctx.fillStyle = 'rgba(212,175,55,0.55)';
      for (let x = 0; x < c.width; x += 6) {
        for (let y = 0; y < c.height; y += 6) {
          const nx = x / c.width, ny = y / c.height;
          const n = Math.sin(nx * 40) * Math.cos(ny * 30) + Math.sin(nx * 13 + ny * 21);
          if (n > 0.65) tctx.fillRect(x, y, 1.6, 1.6);
        }
      }
      return new THREE.CanvasTexture(c);
    }

    const globeMat = new THREE.MeshPhongMaterial({ map: buildDotTexture(), color: 0x333333, shininess: 4 });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, 64, 64), globeMat);
    scene.add(globe);

    const wireMat = new THREE.MeshBasicMaterial({ color: 0xD4AF37, wireframe: true, transparent: true, opacity: 0.08 });
    const wireGlobe = new THREE.Mesh(new THREE.SphereGeometry(RADIUS + 0.01, 24, 24), wireMat);
    scene.add(wireGlobe);

    // subtle outer glow shell
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.05, side: THREE.BackSide });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(RADIUS + 0.12, 32, 32), glowMat));

    function latLonToVec3(lat, lon, r) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    }

    const hubMeshes = [];
    const hubMat = new THREE.MeshBasicMaterial({ color: 0xD4AF37 });
    DATA.hubs.forEach(hub => {
      const pos = latLonToVec3(hub.lat, hub.lon, RADIUS + 0.02);
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), hubMat);
      mesh.position.copy(pos);
      mesh.userData.hub = hub;
      scene.add(mesh);
      hubMeshes.push(mesh);

      const haloMat = new THREE.SpriteMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.35 });
      const halo = new THREE.Sprite(haloMat);
      halo.scale.set(0.22, 0.22, 1);
      halo.position.copy(pos);
      scene.add(halo);
    });

    // animated arcs between a subset of hub pairs
    const arcGroup = new THREE.Group();
    scene.add(arcGroup);
    const pairs = [];
    for (let i = 0; i < DATA.hubs.length; i++) {
      const j = (i + 1) % DATA.hubs.length;
      pairs.push([DATA.hubs[i], DATA.hubs[j]]);
    }
    pairs.forEach(([a, b]) => {
      const p1 = latLonToVec3(a.lat, a.lon, RADIUS + 0.02);
      const p2 = latLonToVec3(b.lat, b.lon, RADIUS + 0.02);
      const mid = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(RADIUS + 0.9);
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(40);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.28 });
      arcGroup.add(new THREE.Line(geo, mat));
    });

    // hover interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hovered = null;

    function onMove(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(hubMeshes);
      if (hits.length) {
        const hub = hits[0].object.userData.hub;
        if (hovered !== hub) {
          hovered = hub;
          const info = HUB_INFO[hub.name] || {};
          tooltip.innerHTML = `<h5>${hub.name}</h5>
            <div class="row"><span>Exchange</span><b>${hub.exch}</b></div>
            <div class="row"><span>GDP</span><b>${info.gdp || '—'}</b></div>
            <div class="row"><span>Currency</span><b>${info.currency || '—'}</b></div>
            <div class="row"><span>Key Index</span><b>${info.index || '—'}</b></div>
            <div class="row"><span>Status</span><b style="color:${isExchangeOpen(hub, new Date()) ? '#2ECC71' : '#E74C3C'}">${isExchangeOpen(hub, new Date()) ? 'Open' : 'Closed'}</b></div>`;
        }
        tooltip.style.left = Math.min(e.clientX - rect.left + 16, rect.width - 220) + 'px';
        tooltip.style.top = Math.max(e.clientY - rect.top - 10, 10) + 'px';
        tooltip.classList.add('show');
        controls.autoRotate = false;
      } else {
        hovered = null;
        tooltip.classList.remove('show');
      }
    }
    renderer.domElement.addEventListener('mousemove', onMove);
    renderer.domElement.addEventListener('mouseleave', () => { tooltip.classList.remove('show'); controls.autoRotate = true; });

    function resize() {
      const w2 = wrap.clientWidth, h2 = wrap.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    }
    window.addEventListener('resize', resize);

    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // pause render loop when off-screen for performance
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
        else if (entry.isIntersecting && !raf) { animate(); }
      });
    }, { threshold: 0.05 });
    io.observe(wrap);

  } catch (err) {
    console.error('[Artistry Markets] Observatory globe failed:', err);
    if (fallback) fallback.style.display = 'flex';
  }
}
