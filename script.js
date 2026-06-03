/* ═══════════════════════════════════════
   Sano Bld Portfolio — Main Script
   (data.js must load before this)
   ═══════════════════════════════════════ */

// detect mobile (no fine pointer = touch device)
const isMobile = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// current language — detect from browser
let lang = navigator.language.startsWith('fr') ? 'fr' : 'en';

// get translation string
function t(key) {
  return (i18n[lang] && i18n[lang][key]) || i18n.en[key] || key;
}

// apply all data-i18n text in the page
function applyLang(l) {
  document.documentElement.lang = l;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = i18n[l][el.dataset.i18n];
    if (val !== undefined) el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const val = i18n[l][el.dataset.i18nPlaceholder];
    if (val !== undefined) el.placeholder = val;
  });
  document.getElementById('lang-toggle').textContent = l === 'en' ? 'FR' : 'EN';

  // update filter button labels
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
    const key = 'filter' + btn.dataset.filter[0].toUpperCase() + btn.dataset.filter.slice(1);
    if (i18n[l][key]) btn.textContent = i18n[l][key];
  });

  // update category tags on cards
  document.querySelectorAll('.card-category[data-cat]').forEach(el => {
    const labels = CAT_LABELS[el.dataset.cat];
    if (labels) el.textContent = labels[l] || labels.en;
  });

  // update card descriptions
  document.querySelectorAll('.card-desc[data-name]').forEach(el => {
    const proj = projects.find(p => p.name === el.dataset.name);
    if (proj) el.textContent = proj.desc[l] || proj.desc.en;
  });
}

// ── Preferences ─────────────────────────
// sound and animations stored in localStorage
let soundEnabled = localStorage.getItem('sound') !== '0';
let animEnabled  = localStorage.getItem('anim')  !== '0';

function initToggles() {
  const soundBtn = document.getElementById('sound-toggle');
  const animBtn  = document.getElementById('anim-toggle');
  if (!soundBtn || !animBtn) return;

  function applySound() {
    soundBtn.classList.toggle('ctrl-off', !soundEnabled);
    soundBtn.title = soundEnabled ? t('soundOn') : t('soundOff');
  }
  function applyAnim() {
    animBtn.classList.toggle('ctrl-off', !animEnabled);
    document.body.classList.toggle('no-anim', !animEnabled);
    animBtn.title = animEnabled ? t('animOn') : t('animOff');
    // restart/stop particles if hero canvas exists
    if (animEnabled) startParticles(); else stopParticles();
  }

  applySound();
  applyAnim();

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('sound', soundEnabled ? '1' : '0');
    applySound();
  });
  animBtn.addEventListener('click', () => {
    animEnabled = !animEnabled;
    localStorage.setItem('anim', animEnabled ? '1' : '0');
    applyAnim();
  });
}

// ── Sound effects (Web Audio) ────────────
let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

// short click beep
function playTick(freq = 700, dur = 0.07, vol = 0.055) {
  if (!soundEnabled) return;
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + dur);
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(); osc.stop(ctx.currentTime + dur);
  } catch (_) {}
}

// airy whoosh for theme switch
function playWhoosh() {
  if (!soundEnabled) return;
  try {
    const ctx = getCtx();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.18, ctx.sampleRate);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.setValueAtTime(1800, ctx.currentTime);
    f.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.18);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.04, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    src.connect(f); f.connect(g); g.connect(ctx.destination);
    src.start();
  } catch (_) {}
}

// paper rustle for filter clicks
function playPaper() {
  if (!soundEnabled) return;
  try {
    const ctx = getCtx();
    const dur = 0.13;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(600, ctx.currentTime);
    lp.frequency.linearRampToValueAtTime(180, ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.032, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    src.connect(lp); lp.connect(g); g.connect(ctx.destination);
    src.start();
  } catch (_) {}
}

// ── Grain ────────────────────────────────
// generate canvas noise texture (lighter than a PNG)
(function initGrain() {
  const size = 200;
  const c    = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255 | 0;
    img.data[i] = img.data[i+1] = img.data[i+2] = v;
    img.data[i+3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  document.querySelector('.grain').style.backgroundImage = `url(${c.toDataURL()})`;

  // subtle mouse parallax on grain (desktop only)
  if (!isMobile) {
    const grain = document.querySelector('.grain');
    let gx = 0, gy = 0, cgx = 0, cgy = 0;
    document.addEventListener('mousemove', e => {
      gx = (e.clientX / innerWidth  - 0.5) * 10;
      gy = (e.clientY / innerHeight - 0.5) * 10;
    });
    (function tick() {
      cgx += (gx - cgx) * 0.06;
      cgy += (gy - cgy) * 0.06;
      grain.style.backgroundPosition = `${cgx.toFixed(2)}px ${cgy.toFixed(2)}px`;
      requestAnimationFrame(tick);
    })();
  }
})();

// ── Custom cursor ────────────────────────
(function initCursor() {
  if (isMobile) return;
  document.body.classList.add('has-custom-cursor');
  const cursor = document.getElementById('cursor');
  const label  = document.getElementById('cursor-label');
  let mx = innerWidth / 2, my = innerHeight / 2;
  let cx = mx, cy = my;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function tick() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cursor.style.left = `${cx}px`;
    cursor.style.top  = `${cy}px`;
    requestAnimationFrame(tick);
  })();

  // attach cursor hover states to static elements
  initStaticCursor(label);
})();

function initStaticCursor(label) {
  document.querySelectorAll('[data-cursor="link"]').forEach(el => {
    const isCtrl = el.classList.contains('ctrl-btn');
    el.addEventListener('mouseenter', () => {
      document.body.classList.add(isCtrl ? 'cursor-btn' : 'cursor-link');
      if (label) label.textContent = el.dataset.cursorLabel || el.title || el.textContent.trim().replace(/\s+/g, ' ');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-link', 'cursor-btn');
    });
  });
}

function attachCardCursor(label) {
  document.querySelectorAll('[data-cursor="open"]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-open');
      if (label) {
        const name = el.dataset.name || t('cursorOpen');
        label.textContent = name;
        // shrink font size for longer project names so they fit inside the circle
        const len = name.length;
        if (len > 8) {
          label.style.fontSize = `${Math.max(0.34, 0.62 - (len - 8) * 0.024)}rem`;
        } else {
          label.style.fontSize = '';
        }
      }
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-open');
      if (label) label.style.fontSize = '';
    });
  });
}

// ── Hero particles ───────────────────────
const heroCanvas = document.getElementById('hero-canvas');
const heroCtx    = heroCanvas ? heroCanvas.getContext('2d') : null;
let particles    = [];
let particleRaf  = null;

function resizeHeroCanvas() {
  if (!heroCanvas) return;
  heroCanvas.width  = heroCanvas.offsetWidth;
  heroCanvas.height = heroCanvas.offsetHeight;
}

function createParticles() {
  particles = [];
  if (!heroCanvas) return;
  const count = Math.floor((heroCanvas.width * heroCanvas.height) / 18000);
  for (let i = 0; i < Math.min(count, 60); i++) {
    particles.push({
      x:    Math.random() * heroCanvas.width,
      y:    Math.random() * heroCanvas.height,
      vx:   (Math.random() - 0.5) * 0.3,
      vy:   -(Math.random() * 0.4 + 0.1),
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.05,
    });
  }
}

function drawParticles() {
  if (!heroCtx || !heroCanvas) return;
  heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
  // get mustard color from CSS variable
  const color = getComputedStyle(document.documentElement).getPropertyValue('--mustard').trim() || '#C98A35';
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    // wrap around edges
    if (p.y < -10)                    p.y = heroCanvas.height + 10;
    if (p.x < -10)                    p.x = heroCanvas.width  + 10;
    if (p.x > heroCanvas.width  + 10) p.x = -10;
    heroCtx.save();
    heroCtx.globalAlpha = p.alpha;
    heroCtx.fillStyle   = color;
    heroCtx.beginPath();
    heroCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    heroCtx.fill();
    heroCtx.restore();
  });
}

function particleTick() {
  drawParticles();
  particleRaf = requestAnimationFrame(particleTick);
}

function startParticles() {
  if (!heroCanvas || !animEnabled || isMobile) return;
  if (!particleRaf) particleTick();
}

function stopParticles() {
  if (particleRaf) { cancelAnimationFrame(particleRaf); particleRaf = null; }
  if (heroCtx && heroCanvas) heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
}

window.addEventListener('resize', () => {
  resizeHeroCanvas();
  createParticles();
});

// ── Preloader ────────────────────────────
const preloader      = document.getElementById('preloader');
const preloaderTitle = document.getElementById('preloader-title');
const preloaderCrown = document.getElementById('preloader-crown');
const heroTitle      = document.getElementById('hero-title');
const heroSub        = document.getElementById('hero-sub');

function fitLoaderText() {
  // match preloader font size exactly to hero title so they overlap seamlessly
  const fs = parseFloat(getComputedStyle(heroTitle).fontSize);
  preloaderTitle.style.fontSize = fs + 'px';
}

function dismissPreloader() {
  document.body.classList.add('loaded');

  // reveal hero title instantly (it was hidden under preloader)
  heroTitle.style.transition = 'none';
  heroTitle.classList.add('appear');
  heroTitle.offsetHeight; // force reflow

  // fade out preloader
  preloader.classList.add('out');
  preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });

  // reveal hero subtitle
  setTimeout(() => heroSub.classList.add('appear'), 150);

  // start particles
  resizeHeroCanvas();
  createParticles();
  startParticles();
}

// crown (950ms) → title appears → dismiss
setTimeout(() => {
  preloaderCrown.classList.add('out');
  fitLoaderText();
  setTimeout(() => {
    preloaderTitle.classList.add('show');
    Promise.race([
      document.fonts.ready,
      new Promise(r => setTimeout(r, 900)),
    ]).then(() => setTimeout(dismissPreloader, 280));
  }, 180);
}, 950);

// ── Theme ────────────────────────────────
const html         = document.documentElement;
const themeToggle  = document.getElementById('theme-toggle');
const themeOverlay = document.getElementById('theme-overlay');
const THEME_ICONS  = { light: '◐', dark: '◑', auto: '◎' };

function getMode()      { return localStorage.getItem('theme') || 'auto'; }
function getEffective(m) {
  if (m === 'light') return 'light';
  if (m === 'dark')  return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme, mode) {
  html.setAttribute('data-theme', theme);
  const m = mode || 'auto';
  themeToggle.textContent = THEME_ICONS[m] || '◐';
  themeToggle.setAttribute('data-mode', m);
  themeToggle.title = t('theme' + m[0].toUpperCase() + m.slice(1)) || m;
  if (m !== 'auto') localStorage.setItem('theme', m);
  else localStorage.removeItem('theme');
}

// gold ring burst at click point
function fireRing(cx, cy) {
  const ring = document.createElement('div');
  const maxD = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) * 2 + 40;
  Object.assign(ring.style, {
    position: 'fixed', left: cx + 'px', top: cy + 'px',
    width: '6px', height: '6px',
    borderRadius: '50%',
    border: '2.5px solid #C98A35',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none', zIndex: '19998',
  });
  document.body.appendChild(ring);
  ring.animate(
    [{ width: '6px', height: '6px', opacity: 1 }, { width: maxD + 'px', height: maxD + 'px', opacity: 0 }],
    { duration: 680, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
  ).onfinish = () => ring.remove();
}

function cycleTheme(origin) {
  const cur  = getMode();
  const next = cur === 'light' ? 'dark' : cur === 'dark' ? 'auto' : 'light';
  const newTheme = getEffective(next === 'auto' ? null : next);

  const rect = origin.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;
  const maxR = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) + 20;

  fireRing(cx, cy);

  // use View Transitions API when available (Chrome/Edge)
  if (typeof document.startViewTransition === 'function') {
    const tr = document.startViewTransition(() => applyTheme(newTheme, next));
    tr.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${maxR}px at ${cx}px ${cy}px)`] },
        { duration: 640, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(() => {});
    playWhoosh();
    return;
  }

  // fallback: circle wipe overlay
  const oldBg = getComputedStyle(html).getPropertyValue('--bg').trim();
  themeOverlay.style.cssText = `transition:none; background:${oldBg}; clip-path:circle(${maxR}px at ${cx}px ${cy}px); opacity:1`;
  themeOverlay.offsetHeight;
  applyTheme(newTheme, next);
  requestAnimationFrame(() => {
    themeOverlay.style.cssText += `transition:clip-path .65s cubic-bezier(0.22,1,0.36,1),opacity .65s;clip-path:circle(0px at ${cx}px ${cy}px);opacity:.95`;
  });
  setTimeout(() => {
    themeOverlay.style.cssText = 'transition:none;clip-path:circle(0px at 50% 50%);opacity:1';
  }, 720);
  playWhoosh();
}

themeToggle.addEventListener('click', () => cycleTheme(themeToggle));

// init theme
applyTheme(getEffective(getMode()), getMode());

// follow system preference in auto mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) applyTheme(e.matches ? 'dark' : 'light', 'auto');
});

// ── Language toggle ──────────────────────
document.getElementById('lang-toggle').addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  applyLang(lang);
  renderGrid(activeFilter);
  buildCmdList();
  playTick(600, 0.06);
});

// ── GitHub API ───────────────────────────
// cache: { repoName: { stars, language, msg, time } }
const ghCache = {};

function timeAgo(dateStr) {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const rtf  = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
    const s = diff / 1000, m = s / 60, h = m / 60, d = h / 24;
    if (s < 60)  return rtf.format(-Math.round(s), 'second');
    if (m < 60)  return rtf.format(-Math.round(m), 'minute');
    if (h < 24)  return rtf.format(-Math.round(h), 'hour');
    if (d < 30)  return rtf.format(-Math.round(d), 'day');
    return new Date(dateStr).toLocaleDateString(lang);
  } catch { return new Date(dateStr).toLocaleDateString(); }
}

// update card commit overlay after fetch
function updateCardCommit(name) {
  const data = ghCache[name];
  document.querySelectorAll(`.project-card[data-name="${CSS.escape(name)}"] .card-commit`).forEach(el => {
    el.innerHTML = data.msg !== undefined
      ? `<div class="commit-msg">${data.msg || '—'}</div><div class="commit-time">${data.time || '—'}</div>`
      : `<div class="commit-skel"><div class="commit-skel-line" style="width:72%"></div><div class="commit-skel-line" style="width:40%"></div></div>`;
  });
}

// update card meta (stars + language)
function updateCardMeta(name) {
  const data = ghCache[name];
  document.querySelectorAll(`.project-card[data-name="${CSS.escape(name)}"] .card-meta`).forEach(el => {
    if (data.stars !== undefined) {
      el.innerHTML = `
        <span class="card-meta-stars">★ ${data.stars}</span>
        <span class="card-meta-dot">·</span>
        <span class="card-meta-lang">${data.language || '—'}</span>`;
    }
  });
}

async function fetchGitHub() {
  await Promise.allSettled(projects.map(async p => {
    try {
      // fetch repo info and latest commit in parallel
      const [repoRes, commitsRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${p.repo}`),
        fetch(`https://api.github.com/repos/${p.repo}/commits?per_page=1`),
      ]);

      const repo    = repoRes.ok    ? await repoRes.json()    : {};
      const commits = commitsRes.ok ? await commitsRes.json() : [];

      const msg  = (commits[0]?.commit?.message || '').split('\n')[0] || '—';
      const date = commits[0]?.commit?.author?.date || null;

      ghCache[p.name] = {
        stars:    repo.stargazers_count ?? '—',
        language: repo.language || '—',
        msg,
        time: date ? timeAgo(date) : '—',
      };
    } catch {
      ghCache[p.name] = { stars: '—', language: '—', msg: '—', time: '—' };
    }
    updateCardCommit(p.name);
    updateCardMeta(p.name);
  }));
}

// fetch github profile stats for the about section
async function fetchGhStats() {
  const el = document.getElementById('gh-stats');
  if (!el) return;
  try {
    const [uRes, rRes] = await Promise.all([
      fetch('https://api.github.com/users/SanoBld'),
      fetch('https://api.github.com/users/SanoBld/repos?per_page=100'),
    ]);
    if (!uRes.ok || !rRes.ok) return;
    const user  = await uRes.json();
    const repos = await rRes.json();

    // top 3 languages by repo count
    const langs = {};
    repos.forEach(r => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
    const top = Object.entries(langs).sort((a,b) => b[1] - a[1]).slice(0,3).map(([l]) => l);

    // total stars across all repos
    const stars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);

    el.innerHTML = `
      <span class="gh-stat"><span class="gh-stat-val">${user.public_repos}</span> repos</span>
      <span class="gh-stat-sep">·</span>
      <span class="gh-stat"><span class="gh-stat-val">${user.followers}</span> followers</span>
      <span class="gh-stat-sep">·</span>
      <span class="gh-stat"><span class="gh-stat-val">${stars}</span> stars</span>
      <span class="gh-stat-sep">·</span>
      <span class="gh-stat">${top.join(' · ')}</span>`;
    el.classList.add('loaded');
  } catch (_) {}
}

// ── Project grid ─────────────────────────
const gridEl      = document.getElementById('project-grid');
let   activeFilter = 'all';

// assign grid-column spans so every row is full (no gaps)
function assignSpans(n) {
  if (n <= 0) return [];
  if (n === 1) return [3];
  if (n === 2) return [2, 1];
  if (n === 3) return [1, 1, 1];
  const spans = [];
  let i = 0, row = 0;
  while (i < n) {
    const rem = n - i;
    if (rem === 1)                       { spans.push(3);       break; }
    if (rem === 3 && row % 2 !== 0)      { spans.push(1, 1, 1); break; }
    if (row % 2 === 0) spans.push(2, 1); else spans.push(1, 2);
    i += 2; row++;
  }
  return spans;
}

// build a single card element
function buildCard(proj, idx) {
  const num    = String(idx + 1).padStart(2, '0');
  const catLbl = (CAT_LABELS[proj.category] || {})[lang] || proj.category;
  const desc   = proj.desc[lang] || proj.desc.en;
  const cached = ghCache[proj.name];

  const li = document.createElement('li');
  li.className     = 'project-card';
  li.dataset.name     = proj.name;
  li.dataset.category = proj.category;

  li.innerHTML = `
    <a href="${proj.url}" target="_blank" rel="noopener" class="project-link"
       data-cursor="open" data-name="${proj.name}">
      <div class="card-glow" aria-hidden="true"></div>
      <div class="card-top">
        <span class="card-num">${num}</span>
        <span class="card-category" data-cat="${proj.category}">${catLbl}</span>
      </div>
      <h3 class="card-name">${proj.name}</h3>
      <p class="card-desc" data-name="${proj.name}">${desc}</p>
      <div class="card-meta">
        ${cached
          ? `<span class="card-meta-stars">★ ${cached.stars}</span>
             <span class="card-meta-dot">·</span>
             <span class="card-meta-lang">${cached.language}</span>`
          : '<span class="card-meta-lang">—</span>'}
      </div>
      <span class="card-arrow">↗</span>
      <div class="card-commit" aria-hidden="true">
        ${cached
          ? `<div class="commit-msg">${cached.msg}</div><div class="commit-time">${cached.time}</div>`
          : `<div class="commit-skel">
               <div class="commit-skel-line" style="width:72%"></div>
               <div class="commit-skel-line" style="width:40%"></div>
             </div>`}
      </div>
    </a>`;
  return li;
}

// render grid with FLIP animation on filter change
function renderGrid(filter) {
  activeFilter = filter;
  const list = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  // snapshot positions before update (FLIP)
  const before = {};
  gridEl.querySelectorAll('.project-card').forEach(c => {
    if (c.dataset.name) before[c.dataset.name] = c.getBoundingClientRect();
  });

  gridEl.innerHTML = '';
  const spans = assignSpans(list.length);

  list.forEach((proj, i) => {
    const card = buildCard(proj, i);
    const span = spans[i] || 1;
    if (span > 1) card.style.gridColumn = `span ${span}`;
    gridEl.appendChild(card);
  });

  // attach effects after DOM update
  attachCardCursor(document.getElementById('cursor-label'));
  attachCardTilt();

  // play FLIP animation
  requestAnimationFrame(() => {
    gridEl.querySelectorAll('.project-card').forEach((card, i) => {
      card.classList.add('visible');
      const name  = card.dataset.name;
      const after = card.getBoundingClientRect();
      const bef   = before[name];

      if (bef) {
        // card existed before — animate from old position
        const dx = bef.left - after.left;
        const dy = bef.top  - after.top;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          card.animate(
            [{ transform: `translate(${dx}px,${dy}px)`, opacity: .7 }, { transform: 'translate(0,0)', opacity: 1 }],
            { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
          );
        }
      } else {
        // new card — fade in with stagger
        card.style.opacity   = '0';
        card.style.transform = 'translateY(14px) scale(0.97)';
        setTimeout(() => {
          card.style.transition = 'opacity .4s ease, transform .42s cubic-bezier(0.22,1,0.36,1)';
          card.style.opacity    = '1';
          card.style.transform  = 'none';
          setTimeout(() => card.style.transition = '', 500);
        }, i * 60 + 40);
      }
    });
  });
}

// 3D tilt + mouse-tracking glow on project cards (desktop only)
function attachCardTilt() {
  if (isMobile) return;
  document.querySelectorAll('.project-link').forEach(link => {
    const glow = link.querySelector('.card-glow');

    link.addEventListener('mousemove', e => {
      if (!animEnabled) return;
      const r  = link.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;   // 0–1
      const ny = (e.clientY - r.top)  / r.height;  // 0–1
      const cx = (nx - 0.5) * 10;
      const cy = (ny - 0.5) * 10;
      link.style.transform = `perspective(900px) rotateY(${cx}deg) rotateX(${-cy}deg)`;

      // update glow center to follow mouse
      if (glow) {
        glow.style.background =
          `radial-gradient(circle at ${(nx * 100).toFixed(1)}% ${(ny * 100).toFixed(1)}%,
            rgba(201,138,53,0.15) 0%, rgba(201,138,53,0.04) 38%, transparent 64%)`;
      }
    });

    link.addEventListener('mouseleave', () => {
      link.style.transition = 'transform .55s cubic-bezier(0.22,1,0.36,1)';
      link.style.transform  = '';
      setTimeout(() => link.style.transition = '', 550);
      // reset glow to centre so it fades out symmetrically
      if (glow) {
        glow.style.background =
          'radial-gradient(circle at 50% 50%, rgba(201,138,53,0.15) 0%, rgba(201,138,53,0.04) 38%, transparent 64%)';
      }
    });
  });
}

// filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    playPaper();
    renderGrid(btn.dataset.filter);
  });
});

// initial render
renderGrid('all');
fetchGitHub();
fetchGhStats();

// ── Magnetic buttons ─────────────────────
// nav control buttons slightly attract toward cursor
function initMagnetic() {
  if (isMobile) return;
  document.querySelectorAll('.ctrl-btn, .nav-gh').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      if (!animEnabled) return;
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.28;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.28;
      btn.style.transform = `translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform .4s cubic-bezier(0.22,1,0.36,1)';
      btn.style.transform  = '';
      setTimeout(() => btn.style.transition = '', 400);
    });
  });
}

// ── Progress milestones ───────────────────
// render a tick mark on the progress bar for each named section
const MILESTONE_SECTIONS = [
  { id: 'projects', label: 'Projects' },
  { id: 'about',    label: 'About'    },
];

function buildProgressMilestones() {
  const milestonesEl = document.getElementById('progress-milestones');
  if (!milestonesEl) return;
  const docH = document.documentElement.scrollHeight - innerHeight;
  if (docH <= 0) return;
  milestonesEl.innerHTML = '';
  MILESTONE_SECTIONS.forEach(s => {
    const section = document.getElementById(s.id);
    if (!section) return;
    const pct  = Math.min(99, (section.offsetTop / docH) * 100);
    const tick = document.createElement('div');
    tick.className       = 'progress-milestone';
    tick.style.left      = pct + '%';
    tick.dataset.section = s.id;
    tick.title           = s.label;
    milestonesEl.appendChild(tick);
  });
}

function updateMilestonePassed(sy) {
  const docH = document.documentElement.scrollHeight - innerHeight;
  document.querySelectorAll('.progress-milestone').forEach(tick => {
    const section = document.getElementById(tick.dataset.section);
    if (!section) return;
    tick.classList.toggle('passed', sy >= section.offsetTop - 10);
  });
}

// call once after DOM is ready, and again on resize
window.addEventListener('load',   buildProgressMilestones);
window.addEventListener('resize', buildProgressMilestones);

// ── Scroll effects ───────────────────────
const siteHeader  = document.getElementById('site-header');
const progressBar = document.getElementById('progress-bar');
const mainEl      = document.getElementById('main');
const heroSection = document.getElementById('hero');

let lastY  = window.scrollY;
let prevY  = window.scrollY;
let skewCur = 0, skewTgt = 0;
let skewRaf = null;

// subtle skew on scroll (like inertia)
function skewTick() {
  if (!animEnabled) { mainEl.style.transform = ''; skewRaf = null; return; }
  skewCur += (skewTgt - skewCur) * 0.1;
  skewTgt *= 0.78;
  const val = parseFloat(skewCur.toFixed(3));
  mainEl.style.transform = Math.abs(val) > 0.02 ? `skewY(${val}deg)` : '';
  if (Math.abs(skewCur) > 0.02 || Math.abs(skewTgt) > 0.02) {
    skewRaf = requestAnimationFrame(skewTick);
  } else {
    mainEl.style.transform = '';
    skewRaf = null;
  }
}

// hide/show header based on scroll direction
function updateHeader(sy) {
  const heroH  = heroSection.offsetHeight;
  const inHero = sy < heroH * 0.78;

  if (inHero) {
    siteHeader.classList.add('header-in-hero');
    siteHeader.classList.remove('header-hidden', 'scrolled');
    return;
  }
  siteHeader.classList.remove('header-in-hero');
  siteHeader.classList.add('scrolled');

  if (sy > lastY + 8 && sy > 120) siteHeader.classList.add('header-hidden');
  else if (sy < lastY - 4)        siteHeader.classList.remove('header-hidden');
}

window.addEventListener('scroll', () => {
  const sy   = window.scrollY;
  const docH = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.width = `${Math.min(100, (sy / docH) * 100)}%`;

  updateHeader(sy);
  updateMilestonePassed(sy);

  const delta = sy - prevY;
  prevY   = sy;
  skewTgt = Math.max(-1.8, Math.min(1.8, delta * -0.065));
  if (!skewRaf) skewRaf = requestAnimationFrame(skewTick);

  lastY = sy;
}, { passive: true });

updateHeader(window.scrollY);

// logo click → scroll to top
document.getElementById('nav-logo').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// nav section links → smooth scroll
document.querySelectorAll('.nav-section-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href?.startsWith('#')) return;
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// hero scroll indicator
document.querySelector('.hero-scroll')?.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
});

// about section reveal on scroll
const aboutEl = document.querySelector('.about');
if (aboutEl) {
  new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.08 }).observe(aboutEl);
}

// smooth wheel scroll (desktop only — native is better on mobile)
(function initSmoothScroll() {
  if (isMobile) return;
  let target  = window.scrollY;
  let current = target;
  let rafId   = null;

  function tick() {
    current += (target - current) * 0.09;
    window.scrollTo(0, Math.round(current));
    if (Math.abs(target - current) > 0.3) rafId = requestAnimationFrame(tick);
    else { window.scrollTo(0, target); rafId = null; }
  }
  function go() { if (!rafId) rafId = requestAnimationFrame(tick); }

  window.addEventListener('wheel', e => {
    e.preventDefault();
    target = Math.max(0, Math.min(target + e.deltaY, document.documentElement.scrollHeight - innerHeight));
    go();
  }, { passive: false });

  window.addEventListener('keydown', e => {
    if (e.target.closest('input,textarea,select')) return;
    const map = { ArrowDown: 90, ArrowUp: -90, PageDown: innerHeight * .85, PageUp: -innerHeight * .85, ' ': innerHeight * .85 };
    if (map[e.key] !== undefined) {
      e.preventDefault();
      target = Math.max(0, Math.min(target + map[e.key], document.documentElement.scrollHeight - innerHeight));
      go();
    }
    if (e.key === 'Home') { target = 0; go(); }
    if (e.key === 'End')  { target = document.documentElement.scrollHeight - innerHeight; go(); }
  });
})();

// ── Toast ────────────────────────────────
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

// ── Command palette (⌘K) ─────────────────
const cmdPalette  = document.getElementById('cmd-palette');
const cmdInput    = document.getElementById('cmd-input');
const cmdList     = document.getElementById('cmd-list');
const cmdBackdrop = document.getElementById('cmd-backdrop');

let cmdOpen     = false;
let cmdIdx      = 0;
let cmdCurrent  = [];

function getCommands() {
  return [
    { icon: '↓', label: t('cmdGoProjects'), action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
    { icon: '↓', label: t('cmdGoAbout'),    action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
    { icon: '◐', label: t('cmdTheme'),      action: () => cycleTheme(themeToggle) },
    { icon: '⟳', label: t('cmdLang'),       action: () => document.getElementById('lang-toggle').click() },
    { icon: '↗', label: t('cmdGithub'),     action: () => window.open('https://github.com/SanoBld', '_blank', 'noopener') },
    // direct links to each project
    ...projects.map(p => ({ icon: '◈', label: p.name, action: () => window.open(p.url, '_blank', 'noopener') })),
  ];
}

function buildCmdList(query = '') {
  const cmds = getCommands().filter(c => !query || c.label.toLowerCase().includes(query.toLowerCase()));
  cmdCurrent = cmds;
  cmdIdx = 0;
  cmdList.innerHTML = '';

  if (!cmds.length) {
    cmdList.innerHTML = `<li class="cmd-empty">${t('cmdEmpty')}</li>`;
    return;
  }
  cmds.forEach((cmd, i) => {
    const li = document.createElement('li');
    li.className = 'cmd-item' + (i === 0 ? ' selected' : '');
    li.innerHTML = `<span class="cmd-item-icon">${cmd.icon}</span>${cmd.label}`;
    li.addEventListener('click', () => { closeCmd(); cmd.action(); playTick(800, .05, .05); });
    li.addEventListener('mouseenter', () => {
      cmdList.querySelectorAll('.cmd-item').forEach((el, j) => el.classList.toggle('selected', j === i));
      cmdIdx = i;
    });
    cmdList.appendChild(li);
  });
}

function openCmd()  {
  cmdOpen = true;
  cmdPalette.classList.add('open');
  cmdPalette.setAttribute('aria-hidden', 'false');
  cmdInput.value = '';
  buildCmdList();
  setTimeout(() => cmdInput.focus(), 30);
}
function closeCmd() {
  cmdOpen = false;
  cmdPalette.classList.remove('open');
  cmdPalette.setAttribute('aria-hidden', 'true');
}

cmdInput.addEventListener('input', e => buildCmdList(e.target.value));

cmdInput.addEventListener('keydown', e => {
  if (e.key === 'Escape')    { closeCmd(); return; }
  if (e.key === 'ArrowDown') { e.preventDefault(); cmdIdx = Math.min(cmdIdx + 1, cmdCurrent.length - 1); }
  if (e.key === 'ArrowUp')   { e.preventDefault(); cmdIdx = Math.max(cmdIdx - 1, 0); }
  if (e.key === 'Enter' && cmdCurrent[cmdIdx]) { closeCmd(); cmdCurrent[cmdIdx].action(); playTick(800, .05, .05); return; }
  cmdList.querySelectorAll('.cmd-item').forEach((el, i) => el.classList.toggle('selected', i === cmdIdx));
});

cmdBackdrop.addEventListener('click', closeCmd);
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); cmdOpen ? closeCmd() : openCmd(); }
});

// ── Keyboard shortcuts + Konami ──────────
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;

window.addEventListener('keydown', e => {
  if (e.target.closest('input,textarea,select')) return;

  // track konami sequence
  if (e.key === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) { konamiIdx = 0; activateKonami(); return; }
  } else { konamiIdx = 0; }

  if (e.altKey || e.ctrlKey || e.metaKey) return;
  switch (e.key.toLowerCase()) {
    case 'd': cycleTheme(themeToggle); showToast(t('toastTheme')); break;
    case 'g': window.open('https://github.com/SanoBld', '_blank', 'noopener'); showToast(t('toastGithub')); break;
    case 'k': if (!cmdOpen) openCmd(); break;
    case '?': showToast(t('shortcutsHint')); break;
  }
});

// ── Konami code — gold trail ─────────────
const konamiCanvas = document.getElementById('konami-canvas');
const konamiCtx    = konamiCanvas.getContext('2d');
let   kParticles   = [];
let   kRaf         = null;
let   kActive      = false;
let   kMX = 0, kMY = 0;

function resizeKonami() { konamiCanvas.width = innerWidth; konamiCanvas.height = innerHeight; }
resizeKonami();
window.addEventListener('resize', resizeKonami);

document.addEventListener('mousemove', e => {
  kMX = e.clientX; kMY = e.clientY;
  if (!kActive) return;
  // spawn 3 gold particles per mouse move
  for (let i = 0; i < 3; i++) {
    kParticles.push({
      x: kMX + (Math.random() - .5) * 12,
      y: kMY + (Math.random() - .5) * 12,
      vx: (Math.random() - .5) * 1.6,
      vy: -(Math.random() * 1.4 + .4),
      size: Math.random() * 4 + 2,
      life: 1,
    });
  }
});

function konamiTick() {
  konamiCtx.clearRect(0, 0, konamiCanvas.width, konamiCanvas.height);
  kParticles = kParticles.filter(p => p.life > 0.02);
  kParticles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    p.vy += 0.035; // gravity
    p.life -= 0.025;
    konamiCtx.save();
    konamiCtx.globalAlpha = Math.max(0, p.life);
    konamiCtx.fillStyle   = `hsl(${38 + Math.random() * 14}, 88%, ${52 + Math.random() * 22}%)`;
    konamiCtx.beginPath();
    konamiCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    konamiCtx.fill();
    konamiCtx.restore();
  });
  if (kActive || kParticles.length > 0) kRaf = requestAnimationFrame(konamiTick);
  else kRaf = null;
}

function activateKonami() {
  showToast(t('konamiMsg'));
  html.classList.add('konami-active');
  kActive = true;
  konamiCanvas.classList.add('active');

  if (navigator.vibrate) navigator.vibrate([8, 60, 8, 60, 30]);

  // play do-mi-sol chord
  playTick(523, .12, .09);
  setTimeout(() => playTick(659, .12, .09), 130);
  setTimeout(() => playTick(784, .20, .09), 260);

  if (!kRaf) kRaf = requestAnimationFrame(konamiTick);

  setTimeout(() => {
    html.classList.remove('konami-active');
    kActive = false;
    konamiCanvas.classList.remove('active');
  }, 4000);
}

// ── Init ─────────────────────────────────
applyLang(lang);
initToggles();
initMagnetic();

// console welcome message
console.log('%c👑  Sano Bld','color:#AA211F;font-size:30px;font-family:serif;font-weight:bold;');
console.log('%cCurious how it works? Welcome.\nFait avec passion. Curieux ? Bienvenue.','color:#C98A35;font-size:12px;font-family:monospace;line-height:1.6;');
console.log('%cStack → HTML · CSS · Vanilla JS · Canvas API · Firebase · Last.fm API','color:#8a9baa;font-size:11px;font-family:monospace;');
console.log('%c→ github.com/SanoBld','color:#F2D99B;background:#1c2330;font-size:12px;font-family:monospace;padding:3px 10px;');
