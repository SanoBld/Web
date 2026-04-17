// ─────────────────────────────────────────────
// DONNÉES PROJETS
// ─────────────────────────────────────────────
const projects = [
  { name: 'OmniMedia',    url: 'https://github.com/SanoBld/OmniMedia/releases/latest', category: 'appjeu',     repo: 'SanoBld/OmniMedia' },
  { name: 'LastStats',    url: 'https://sanobld.github.io/LastStats/',    category: 'musique',    repo: 'SanoBld/LastStats' },
  { name: 'Pulse',        url: 'https://sanobld.github.io/Pulse/',         category: 'musique',    repo: 'SanoBld/Pulse' },
  { name: 'Aura',         url: 'https://sanobld.github.io/Aura/',          category: 'musique',    repo: 'SanoBld/Aura' },
  { name: "SO'BÔHÈME",    url: 'https://soboheme.github.io/Web/',          category: 'web',        repo: 'soboheme/Web' },
  { name: 'Metrolist',    url: 'https://metrolist.cc/',                    category: 'web',        repo: 'MetrolistGroup/Metrolist' },
  { name: 'BioLinkMaker', url: 'https://sanobld.github.io/BioLinkMaker/', category: 'appjeu',     repo: 'SanoBld/BioLinkMaker' },
  { name: 'Eco-Drive',    url: 'https://sanobld.github.io/Eco-Drive/',     category: 'appjeu',     repo: 'SanoBld/Eco-Drive' },
  { name: 'OpenTrad',     url: 'https://sanobld.github.io/OpenTrad/',      category: 'appjeu',     repo: 'SanoBld/OpenTrad' },
  { name: 'Boids',        url: 'https://sanobld.github.io/Boids/',         category: 'experience', repo: 'SanoBld/Boids' },
];

const CATEGORY_LABELS = {
  musique:    { en: 'Music',      fr: 'Musique' },
  web:        { en: 'Web',        fr: 'Web' },
  appjeu:     { en: 'App / Game', fr: 'App / Jeu' },
  experience: { en: 'Experience', fr: 'Expérience' },
};

// Map pour stocker les commits par nom de projet
const commitCache = {};

// ─────────────────────────────────────────────
// i18n
// ─────────────────────────────────────────────
const i18n = {
  en: {
    sectionTag:      'Selected Work',
    sectionTitle:    'Projects',
    ctaTitle:        'See the full picture',
    ctaBtn:          'View on GitHub',
    footer:          '© 2025 Sano Bld',
    cursorOpen:      'OPEN',
    cursorLink:      'LEARN MORE',
    navGithub:       'GitHub',
    navAbout:        'About',
    navProjects:     'Projects',
    aboutTag:        'Identity',
    aboutTitle:      'About',
    aboutText:       'Developer & designer based in France. I build refined web experiences in pure HTML, CSS and JavaScript — no frameworks, just deliberate code.',
    stackTag:        'Stack',
    stackTitle:      'Technologies',
    filterAll:       'All',
    filterMusique:   'Music',
    filterWeb:       'Web',
    filterAppjeu:    'App / Game',
    filterExperience:'Experience',
    shortcutTheme:   'Theme toggled',
    shortcutGithub:  'Opening GitHub…',
    shortcutsHint:   'D = Theme · G = GitHub · K = Palette',
    konamiMsg:       '👑 Royal Mode — Activated',
    cmdPlaceholder:  'Type a command…',
    cmdGoAbout:      'Go to About',
    cmdGoProjects:   'Go to Projects',
    cmdGoStack:      'Go to Stack',
    cmdToggleTheme:  'Toggle Theme',
    cmdToggleLang:   'Toggle Language',
    cmdGitHub:       'Open GitHub',
    cmdEmpty:        'No results',
    themeLight:      'Light',
    themeDark:       'Dark',
    themeAuto:       'Auto',
    commitLoading:   'loading…',
  },
  fr: {
    sectionTag:      'Travaux Choisis',
    sectionTitle:    'Projets',
    ctaTitle:        "Voir l'ensemble du travail",
    ctaBtn:          'Voir sur GitHub',
    footer:          '© 2025 Sano Bld',
    cursorOpen:      'VOIR',
    cursorLink:      'EN SAVOIR PLUS',
    navGithub:       'GitHub',
    navAbout:        'À propos',
    navProjects:     'Projets',
    aboutTag:        'Identité',
    aboutTitle:      'À propos',
    aboutText:       'Développeur & designer basé en France. Je construis des expériences web soignées en HTML, CSS et JavaScript pur — sans framework, juste du code réfléchi.',
    stackTag:        'Stack',
    stackTitle:      'Technologies',
    filterAll:       'Tout',
    filterMusique:   'Musique',
    filterWeb:       'Web',
    filterAppjeu:    'App / Jeu',
    filterExperience:'Expérience',
    shortcutTheme:   'Thème changé',
    shortcutGithub:  'Ouverture GitHub…',
    shortcutsHint:   'D = Thème · G = GitHub · K = Palette',
    konamiMsg:       '👑 Mode Royal — Activé',
    cmdPlaceholder:  'Taper une commande…',
    cmdGoAbout:      'Aller à À propos',
    cmdGoProjects:   'Aller aux Projets',
    cmdGoStack:      'Aller au Stack',
    cmdToggleTheme:  'Changer le thème',
    cmdToggleLang:   'Changer la langue',
    cmdGitHub:       'Ouvrir GitHub',
    cmdEmpty:        'Aucun résultat',
    themeLight:      'Clair',
    themeDark:       'Sombre',
    themeAuto:       'Auto',
    commitLoading:   'chargement…',
  },
};

let currentLang = navigator.language.startsWith('fr') ? 'fr' : 'en';

function t(key) {
  return (i18n[currentLang] && i18n[currentLang][key]) || i18n.en[key] || key;
}

function applyTranslations(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = i18n[lang][el.dataset.i18n];
    if (val !== undefined) el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const val = i18n[lang][el.dataset.i18nPlaceholder];
    if (val !== undefined) el.placeholder = val;
  });
  document.getElementById('lang-toggle').textContent = lang === 'en' ? 'FR' : 'EN';

  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
    const key = 'filter' + btn.dataset.filter.charAt(0).toUpperCase() + btn.dataset.filter.slice(1);
    if (i18n[lang][key]) btn.textContent = i18n[lang][key];
  });

  document.querySelectorAll('.card-category[data-category]').forEach(el => {
    const cat = el.dataset.category;
    if (CATEGORY_LABELS[cat]) el.textContent = CATEGORY_LABELS[cat][lang] || cat;
  });
}

// ─────────────────────────────────────────────
// PRÉFÉRENCES : SON + ANIMATIONS
// ─────────────────────────────────────────────
let soundEnabled = localStorage.getItem('sound') !== '0';
let animEnabled  = localStorage.getItem('anim')  !== '0';

function initPreferenceToggles() {
  const soundBtn = document.getElementById('sound-toggle');
  const animBtn  = document.getElementById('anim-toggle');
  if (!soundBtn || !animBtn) return;

  function applySoundState() {
    soundBtn.classList.toggle('ctrl-off', !soundEnabled);
    soundBtn.title = soundEnabled ? 'Sons actifs' : 'Sons désactivés';
  }
  function applyAnimState() {
    animBtn.classList.toggle('ctrl-off', !animEnabled);
    document.body.classList.toggle('no-anim', !animEnabled);
    animBtn.title = animEnabled ? 'Animations actives' : 'Animations désactivées';
  }

  applySoundState();
  applyAnimState();

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('sound', soundEnabled ? '1' : '0');
    applySoundState();
  });
  animBtn.addEventListener('click', () => {
    animEnabled = !animEnabled;
    localStorage.setItem('anim', animEnabled ? '1' : '0');
    applyAnimState();
  });
}
initPreferenceToggles();

// ─────────────────────────────────────────────
// SON (Web Audio API) — très discrets
// ─────────────────────────────────────────────
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTick(freq = 700, dur = 0.07, vol = 0.055) {
  if (!soundEnabled) return;
  try {
    const ctx  = getAudioCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + dur);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  } catch (_) {}
}

function playWhoosh(vol = 0.04) {
  if (!soundEnabled) return;
  try {
    const ctx    = getAudioCtx();
    const buf    = ctx.createBuffer(1, ctx.sampleRate * 0.18, ctx.sampleRate);
    const data   = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
    const src    = ctx.createBufferSource();
    src.buffer   = buf;
    const filter = ctx.createBiquadFilter();
    filter.type  = 'bandpass';
    filter.frequency.setValueAtTime(1800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.18);
    const gain   = ctx.createGain();
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch (_) {}
}

// Son "glissement papier" — filtre grave court, pour les changements de filtre
function playPaper(vol = 0.032) {
  if (!soundEnabled) return;
  try {
    const ctx  = getAudioCtx();
    const dur  = 0.13;
    const buf  = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
    const src  = ctx.createBufferSource();
    src.buffer = buf;
    const lp   = ctx.createBiquadFilter();
    lp.type    = 'lowpass';
    lp.frequency.setValueAtTime(600, ctx.currentTime);
    lp.frequency.linearRampToValueAtTime(180, ctx.currentTime + dur);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    src.connect(lp); lp.connect(gain); gain.connect(ctx.destination);
    src.start();
  } catch (_) {}
}

// ─────────────────────────────────────────────
// RENDU D'UNE CARTE PROJET
// ─────────────────────────────────────────────
function renderCard(project, i) {
  const idx    = String(i + 1).padStart(2, '0');
  const catLbl = (CATEGORY_LABELS[project.category] || {})[currentLang] || project.category;
  const li     = document.createElement('li');
  li.className        = 'project-card';
  li.dataset.category = project.category;
  li.dataset.name     = project.name;

  const hasCommit = commitCache[project.name];

  li.innerHTML = `
    <a href="${project.url}" target="_blank" rel="noopener" class="project-link"
       data-cursor="open" data-name="${project.name}" data-index="${idx}">
      <span class="card-num">${idx}</span>
      <span class="card-ghost" aria-hidden="true">${idx}</span>
      <h3 class="card-name">
        <span class="name-normal">${project.name}</span>
      </h3>
      <span class="card-category" data-category="${project.category}">${catLbl}</span>
      <span class="card-arrow">↗</span>
      <div class="card-commit-overlay" aria-hidden="true">
        ${hasCommit
          ? `<div class="commit-overlay-msg">${hasCommit.msg}</div>
             <div class="commit-overlay-time">${hasCommit.time}</div>`
          : `<div class="commit-skeleton">
               <div class="commit-skeleton-line" style="width:72%"></div>
               <div class="commit-skeleton-line" style="width:38%"></div>
             </div>`
        }
      </div>
    </a>`;
  return li;
}

// ─────────────────────────────────────────────
// CALCUL DES SPANS — grille sans case vide
// ─────────────────────────────────────────────
function assignSpans(n) {
  if (n <= 0) return [];
  if (n === 1) return [3];
  if (n === 2) return [2, 1];
  if (n === 3) return [1, 1, 1];

  const spans = [];
  let i = 0, rowType = 0;
  while (i < n) {
    const rem = n - i;
    if (rem === 1)                          { spans.push(3);       break; }
    if (rem === 3 && rowType % 2 !== 0)     { spans.push(1, 1, 1); break; }
    if (rowType % 2 === 0) spans.push(2, 1);
    else                   spans.push(1, 2);
    i += 2;
    rowType++;
  }
  return spans;
}

// ─────────────────────────────────────────────
// GRILLE PROJETS + FILTRE FLIP
// ─────────────────────────────────────────────
const gridEl      = document.getElementById('project-grid');
let   activeFilter = 'all';

function renderGrid(filter) {
  activeFilter = filter;
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  // FLIP — Step 1 : snapshot positions actuelles
  const first = {};
  gridEl.querySelectorAll('.project-card').forEach(card => {
    if (card.dataset.name) first[card.dataset.name] = card.getBoundingClientRect();
  });

  // Re-render immédiat (pas de délai)
  gridEl.innerHTML = '';
  const spans = assignSpans(filtered.length);
  filtered.forEach((proj, i) => {
    const card = renderCard(proj, i);
    const span = spans[i] || 1;
    if (span > 1) card.style.gridColumn = `span ${span}`;
    gridEl.appendChild(card);
  });

  attachCursorListeners();
  updateGhostParallax();

  // FLIP — Step 2 : animer depuis l'ancienne position
  requestAnimationFrame(() => {
    gridEl.querySelectorAll('.project-card').forEach((card, idx) => {
      card.classList.add('visible');
      const name  = card.dataset.name;
      const after = card.getBoundingClientRect();
      const bef   = first[name];

      if (bef) {
        // Carte déjà présente → FLIP translate
        const dx = bef.left - after.left;
        const dy = bef.top  - after.top;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          card.animate(
            [
              { transform: `translate(${dx}px,${dy}px)`, opacity: 0.7 },
              { transform: 'translate(0,0)',              opacity: 1   }
            ],
            { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
          );
        }
      } else {
        // Nouvelle carte → fade-in décalé
        card.style.opacity   = '0';
        card.style.transform = 'translateY(14px) scale(0.97)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)';
          card.style.opacity    = '1';
          card.style.transform  = 'none';
          setTimeout(() => { card.style.transition = ''; }, 500);
        }, idx * 60 + 40);
      }
    });
  });
}

renderGrid('all');

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

// ─────────────────────────────────────────────
// COMMITS GITHUB → affichés sur chaque carte
// ─────────────────────────────────────────────
function timeAgo(dateStr) {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const rtf  = new Intl.RelativeTimeFormat(currentLang, { numeric: 'auto' });
    const sec  = diff / 1000;
    const min  = sec  / 60;
    const hr   = min  / 60;
    const day  = hr   / 24;
    if (sec < 60)  return rtf.format(-Math.round(sec), 'second');
    if (min < 60)  return rtf.format(-Math.round(min), 'minute');
    if (hr  < 24)  return rtf.format(-Math.round(hr),  'hour');
    if (day < 30)  return rtf.format(-Math.round(day), 'day');
    return new Date(dateStr).toLocaleDateString(currentLang);
  } catch { return new Date(dateStr).toLocaleDateString(); }
}

function updateCardCommit(name) {
  const data = commitCache[name];
  document.querySelectorAll(`.project-card[data-name="${CSS.escape(name)}"] .card-commit-overlay`)
    .forEach(overlay => {
      overlay.innerHTML = `
        <div class="commit-overlay-msg">${data.msg}</div>
        <div class="commit-overlay-time">${data.time}</div>`;
    });
}

async function fetchCommits() {
  await Promise.allSettled(
    projects.map(p =>
      fetch(`https://api.github.com/repos/${p.repo}/commits?per_page=1`)
        .then(r => { if (!r.ok) throw r.status; return r.json(); })
        .then(data => {
          const msg  = (data[0]?.commit?.message || '—').split('\n')[0];
          const date = data[0]?.commit?.author?.date || null;
          commitCache[p.name] = { msg, time: date ? timeAgo(date) : '—' };
          updateCardCommit(p.name);
        })
        .catch(() => {
          commitCache[p.name] = { msg: '—', time: '—' };
          updateCardCommit(p.name);
        })
    )
  );
}

fetchCommits();

// ─────────────────────────────────────────────
// STATS GITHUB — dépôts publics + langages
// ─────────────────────────────────────────────
async function fetchGitHubStats() {
  const statsEl = document.getElementById('gh-stats');
  if (!statsEl) return;
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/SanoBld'),
      fetch('https://api.github.com/users/SanoBld/repos?per_page=100'),
    ]);
    if (!userRes.ok || !reposRes.ok) return;
    const user  = await userRes.json();
    const repos = await reposRes.json();

    // Compte les langages
    const langs = {};
    repos.forEach(r => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
    const topLangs = Object.entries(langs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([l]) => l);

    statsEl.innerHTML = `
      <span class="gh-stat"><span class="gh-stat-val">${user.public_repos}</span> repos</span>
      <span class="gh-stat-sep">·</span>
      <span class="gh-stat"><span class="gh-stat-val">${user.followers}</span> followers</span>
      <span class="gh-stat-sep">·</span>
      <span class="gh-stat">${topLangs.join(' · ')}</span>`;
    statsEl.classList.add('loaded');
  } catch (_) {}
}
fetchGitHubStats();

// ─────────────────────────────────────────────
// GRAIN TEXTURE
// ─────────────────────────────────────────────
(function () {
  const size = 200;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255 | 0;
    img.data[i] = img.data[i+1] = img.data[i+2] = v;
    img.data[i+3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  document.querySelector('.grain').style.backgroundImage = `url(${canvas.toDataURL()})`;

  // Parallaxe léger : le grain se déplace très doucement avec la souris
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const grainEl = document.querySelector('.grain');
    let gx = 0, gy = 0, cgx = 0, cgy = 0;
    document.addEventListener('mousemove', e => {
      gx = (e.clientX / window.innerWidth  - 0.5) * 10;
      gy = (e.clientY / window.innerHeight - 0.5) * 10;
    });
    (function grainTick() {
      cgx += (gx - cgx) * 0.06;
      cgy += (gy - cgy) * 0.06;
      grainEl.style.backgroundPosition = `${cgx.toFixed(2)}px ${cgy.toFixed(2)}px`;
      requestAnimationFrame(grainTick);
    })();
  }
})();

// ─────────────────────────────────────────────
// PRELOADER — couronne → titre fusionné hero
// ─────────────────────────────────────────────
const preloader      = document.getElementById('preloader');
const preloaderLogo  = document.getElementById('preloader-logo');
const preloaderCrown = document.getElementById('preloader-crown');
const heroTitle      = document.getElementById('hero-title');

function fitLoaderText() {
  // On cale la taille exactement sur le hero-title rendu
  // → les deux textes ont la même taille et la même position, la fusion est invisible
  const heroFs = parseFloat(getComputedStyle(heroTitle).fontSize);
  preloaderLogo.style.fontSize = heroFs + 'px';
}

function dismissPreloader() {
  document.body.classList.add('loaded');

  // 1. Révèle le hero-title immédiatement, sans aucune transition
  //    Il est centré exactement sous le preloader-logo (même police, même taille, même position)
  heroTitle.style.transition = 'none';
  heroTitle.classList.add('appear');
  heroTitle.offsetHeight; // force reflow — garantit le rendu avant le fondu

  // 2. Fondu du preloader entier (bg + logo disparaissent ensemble)
  //    Le hero-title identique est déjà visible en dessous → fusion parfaite, imperceptible
  preloader.classList.add('out');
  preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
}

// Phase 1 : couronne (950ms) → Phase 2 : titre → dismiss
setTimeout(() => {
  preloaderCrown.classList.add('out');
  fitLoaderText();
  setTimeout(() => {
    preloaderLogo.classList.add('show');
    Promise.race([
      document.fonts.ready,
      new Promise(r => setTimeout(r, 900)),
    ]).then(() => setTimeout(dismissPreloader, 280));
  }, 180);
}, 950);

// ─────────────────────────────────────────────
// THÈME — 3 modes : light · dark · auto
// Mode sauvegardé : 'light' | 'dark' | null (auto)
// ─────────────────────────────────────────────
const html        = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeOverlay = document.getElementById('theme-overlay');

// Mapping mode → icône
const THEME_ICONS = { light: '◐', dark: '◑', auto: '◎' };

function getStoredMode() {
  return localStorage.getItem('theme'); // 'light', 'dark', ou null
}

function getEffectiveTheme(mode) {
  if (mode === 'light') return 'light';
  if (mode === 'dark')  return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getCurrentMode() {
  return getStoredMode() || 'auto';
}

function applyTheme(theme, mode) {
  html.setAttribute('data-theme', theme);
  html.setAttribute('data-theme-mode', mode || 'auto');
  const m = mode || 'auto';
  themeToggle.textContent = THEME_ICONS[m] || '◐';
  themeToggle.setAttribute('data-mode', m);
  // Titre lisible pour le curseur réactif
  const LABELS = { light: 'Clair', dark: 'Sombre', auto: 'Auto' };
  themeToggle.title = LABELS[m] || 'Thème';
  if (mode && mode !== 'auto') localStorage.setItem('theme', mode);
  else localStorage.removeItem('theme');
}

function fireThemeRing(cx, cy) {
  const ring = document.createElement('div');
  const maxD = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) * 2 + 40;
  Object.assign(ring.style, {
    position:      'fixed',
    left:          cx + 'px',
    top:           cy + 'px',
    width:         '6px',
    height:        '6px',
    borderRadius:  '50%',
    border:        '2.5px solid #C98A35',
    transform:     'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex:        '19998',
  });
  document.body.appendChild(ring);
  ring.animate(
    [
      { width: '6px',       height: '6px',       opacity: 1, offset: 0 },
      { width: maxD + 'px', height: maxD + 'px', opacity: 0, offset: 1 },
    ],
    { duration: 680, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
  ).onfinish = () => ring.remove();
}

function cycleTheme(originEl) {
  const cur  = getCurrentMode();
  const next = cur === 'light' ? 'dark' : cur === 'dark' ? 'auto' : 'light';
  const nextTheme = getEffectiveTheme(next === 'auto' ? null : next);

  const rect = originEl.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;
  const maxR = Math.hypot(
    Math.max(cx, window.innerWidth  - cx),
    Math.max(cy, window.innerHeight - cy)
  ) + 20;

  // Anneau visuel discret au point de clic
  fireThemeRing(cx, cy);

  // --- View Transitions API (Chrome/Edge) -----------------------------------
  if (typeof document.startViewTransition === 'function') {
    const transition = document.startViewTransition(() => applyTheme(nextTheme, next));
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${maxR}px at ${cx}px ${cy}px)`] },
        { duration: 640, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(() => {});
    playWhoosh();
    return;
  }

  // --- Fallback propre pour les autres navigateurs --------------------------
  // 1. Couvre l'écran avec l'ANCIENNE couleur de fond (masque le changement)
  const oldBg = getComputedStyle(document.documentElement)
    .getPropertyValue('--bg').trim() || '#F2D99B';

  themeOverlay.style.transition  = 'none';
  themeOverlay.style.background  = oldBg;
  themeOverlay.style.clipPath    = `circle(${maxR}px at ${cx}px ${cy}px)`;
  themeOverlay.style.opacity     = '1';
  themeOverlay.offsetHeight; // force reflow

  // 2. Applique le nouveau thème immédiatement sous l'overlay
  applyTheme(nextTheme, next);

  // 3. Réduit l'overlay depuis le point de clic → révèle le nouveau thème
  requestAnimationFrame(() => {
    themeOverlay.style.transition = `clip-path 0.65s cubic-bezier(0.22, 1, 0.36, 1),
                                     opacity    0.65s cubic-bezier(0.22, 1, 0.36, 1)`;
    themeOverlay.style.clipPath   = `circle(0px at ${cx}px ${cy}px)`;
    themeOverlay.style.opacity    = '0.95';
  });

  // 4. Nettoyage une fois l'animation terminée
  setTimeout(() => {
    themeOverlay.style.transition = 'none';
    themeOverlay.style.clipPath   = 'circle(0px at 50% 50%)';
    themeOverlay.style.opacity    = '1';
  }, 720);

  playWhoosh();
}

themeToggle.addEventListener('click', () => cycleTheme(themeToggle));

// Initialisation
applyTheme(getEffectiveTheme(getStoredMode()), getCurrentMode());

// Écoute system preference change (mode auto)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'dark' : 'light', 'auto');
  }
});

// ─────────────────────────────────────────────
// LANGUE
// ─────────────────────────────────────────────
document.getElementById('lang-toggle').addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'fr' : 'en';
  applyTranslations(currentLang);
  renderGrid(activeFilter);
  buildCommandList();
});
applyTranslations(currentLang);

// ─────────────────────────────────────────────
// CURSEUR — Cercle réactif qui s'adapte à ce qu'on survole
// ─────────────────────────────────────────────

/**
 * Trouve le meilleur texte à afficher dans le curseur pour un élément donné.
 * Ordre de priorité : data-cursor-label → title → aria-label (si pertinent) → textContent
 */
function getCursorLabel(el) {
  if (el.dataset.cursorLabel) return el.dataset.cursorLabel;
  if (el.title)               return el.title;

  const aria = el.getAttribute('aria-label');
  if (aria && !/toggle/i.test(aria)) return aria;

  // textContent brut, espaces normalisés — pas de troncature, le CSS gère
  return el.textContent.trim().replace(/\s+/g, ' ');
}

(function initCursor() {
  // Seulement sur desktop avec une souris précise
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.body.classList.add('has-custom-cursor');
  const cursor      = document.querySelector('.cursor');
  const cursorLabel = document.querySelector('.cursor-label');
  let mx = window.innerWidth  / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;
  const LERP = 0.18;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function tick() {
    cx += (mx - cx) * LERP;
    cy += (my - cy) * LERP;
    cursor.style.left = `${cx}px`;
    cursor.style.top  = `${cy}px`;
    requestAnimationFrame(tick);
  })();

  attachCursorListeners();
  initStaticCursorTargets();
})();

function attachCursorListeners() {
  const cursorLabel = document.querySelector('.cursor-label');
  gridEl.querySelectorAll('[data-cursor="open"]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-open');
      // Affiche le nom du projet (ex: "Aura", "Pulse"…)
      if (cursorLabel) cursorLabel.textContent = el.dataset.name || t('cursorOpen');
    });
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-open'));
  });
}

function initStaticCursorTargets() {
  const cursorLabel = document.querySelector('.cursor-label');
  document.querySelectorAll('[data-cursor="link"]').forEach(el => {
    const isCtrl = el.classList.contains('ctrl-btn');

    el.addEventListener('mouseenter', () => {
      // Petits boutons de contrôle → cercle compact
      if (isCtrl) {
        document.body.classList.add('cursor-btn');
      } else {
        document.body.classList.add('cursor-link');
      }
      if (cursorLabel) cursorLabel.textContent = getCursorLabel(el);
    });

    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-link', 'cursor-btn');
    });
  });
}

// ─────────────────────────────────────────────
// SCROLL — header · barre de progression · parallaxe · skew
// ─────────────────────────────────────────────
const siteHeader  = document.getElementById('site-header');
const progressBar = document.getElementById('progress-bar');
const mainContent = document.getElementById('main-content');
const heroSection = document.querySelector('.hero');

let lastScrollY    = window.scrollY;
let prevSkewScroll = window.scrollY;
let skewCurrent    = 0;
let skewTarget     = 0;
let skewRafId      = null;

function updateGhostParallax() {
  if (!animEnabled) return;
  const sy = window.scrollY;
  document.querySelectorAll('.card-ghost').forEach((ghost, i) => {
    const speed = 0.022 + (i % 4) * 0.007;
    ghost.style.setProperty('--py', `${sy * speed}px`);
  });
}

function skewTick() {
  if (!animEnabled) { mainContent.style.transform = ''; skewRafId = null; return; }
  skewCurrent += (skewTarget - skewCurrent) * 0.1;
  skewTarget  *= 0.78;
  const val = parseFloat(skewCurrent.toFixed(3));
  mainContent.style.transform = Math.abs(val) > 0.02 ? `skewY(${val}deg)` : '';
  if (Math.abs(skewCurrent) > 0.02 || Math.abs(skewTarget) > 0.02) {
    skewRafId = requestAnimationFrame(skewTick);
  } else {
    mainContent.style.transform = '';
    skewRafId = null;
  }
}

const navLogo = document.querySelector('.nav-logo');
let heroExited = false;

// Clic sur le logo → retour en haut
navLogo.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function updateHeader(sy) {
  const heroH  = heroSection.offsetHeight;
  const inHero = sy < heroH * 0.78;

  if (inHero) {
    siteHeader.classList.add('header-in-hero');
    siteHeader.classList.remove('header-hidden', 'scrolled');
    heroExited = false;
    return;
  }

  siteHeader.classList.remove('header-in-hero');
  siteHeader.classList.add('scrolled');
  heroExited = true;

  // Cache la nav quand on scrolle vers le bas, la montre quand on remonte.
  // Le seuil asymétrique (8 / 4) rend l'animation plus naturelle.
  const scrollingDown = sy > lastScrollY + 8;
  const scrollingUp   = sy < lastScrollY - 4;
  // Ne jamais cacher si on est encore très proche du haut de page
  const farEnoughDown = sy > 120;

  if (scrollingDown && farEnoughDown) siteHeader.classList.add('header-hidden');
  else if (scrollingUp)               siteHeader.classList.remove('header-hidden');
}

window.addEventListener('scroll', () => {
  const sy   = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct  = Math.min(100, (sy / docH) * 100);

  progressBar.style.width = `${pct}%`;
  updateHeader(sy);
  updateGhostParallax();
  updateProgressCheckpoints(pct);

  const delta = sy - prevSkewScroll;
  prevSkewScroll = sy;
  skewTarget = Math.max(-1.8, Math.min(1.8, delta * -0.065));
  if (!skewRafId) skewRafId = requestAnimationFrame(skewTick);

  lastScrollY = sy;
}, { passive: true });

updateHeader(window.scrollY);

// ─────────────────────────────────────────────
// PROGRESS BAR CHECKPOINTS
// ─────────────────────────────────────────────
const CHECKPOINT_SECTIONS = [
  { id: 'projects', label: 'Projects' },
  { id: 'about',    label: 'About'    },
];
let checkpointEls = [];

function initProgressCheckpoints() {
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  if (docH <= 0) return;
  checkpointEls.forEach(el => el.remove());
  checkpointEls = [];
  CHECKPOINT_SECTIONS.forEach(({ id, label }) => {
    const section = document.getElementById(id);
    if (!section) return;
    const pct = (section.offsetTop / docH) * 100;
    const dot = document.createElement('div');
    dot.className = 'progress-checkpoint';
    dot.style.left = `${pct}%`;
    dot.title = label;
    dot.dataset.pct = pct;
    document.body.appendChild(dot);
    checkpointEls.push(dot);
  });
}

function updateProgressCheckpoints(currentPct) {
  checkpointEls.forEach(dot => {
    dot.classList.toggle('passed', currentPct >= parseFloat(dot.dataset.pct));
  });
}

// Init après chargement complet (positions stables)
window.addEventListener('load', () => setTimeout(initProgressCheckpoints, 400));
window.addEventListener('resize', () => setTimeout(initProgressCheckpoints, 200));

// ─────────────────────────────────────────────
// SCROLL FLUIDE — interpolation douce sur desktop
// (désactivé sur mobile / tactile pour ne pas gêner le scroll natif)
// ─────────────────────────────────────────────
(function initSmoothScroll() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let target  = window.scrollY;
  let current = target;
  const ease  = 0.09;
  let rafId   = null;

  function tick() {
    current += (target - current) * ease;
    window.scrollTo(0, Math.round(current));
    if (Math.abs(target - current) > 0.3) {
      rafId = requestAnimationFrame(tick);
    } else {
      window.scrollTo(0, target);
      rafId = null;
    }
  }
  function start() { if (!rafId) rafId = requestAnimationFrame(tick); }

  window.addEventListener('wheel', e => {
    e.preventDefault();
    target = Math.max(0, Math.min(
      target + e.deltaY,
      document.documentElement.scrollHeight - window.innerHeight
    ));
    start();
  }, { passive: false });

  window.addEventListener('keydown', e => {
    if (e.target.closest('input, textarea, select')) return;
    const map = {
      ArrowDown: 90, ArrowUp: -90,
      PageDown:  window.innerHeight * 0.85,
      PageUp:   -window.innerHeight * 0.85,
      ' ':       window.innerHeight * 0.85,
    };
    if (map[e.key] !== undefined) {
      e.preventDefault();
      target = Math.max(0, Math.min(target + map[e.key],
        document.documentElement.scrollHeight - window.innerHeight));
      start();
    }
    if (e.key === 'Home') { target = 0; start(); }
    if (e.key === 'End')  { target = document.documentElement.scrollHeight - window.innerHeight; start(); }
  });
})();

// Smooth scroll sur les liens de nav
document.querySelectorAll('.nav-section-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ─────────────────────────────────────────────
// INTERSECTION OBSERVER
// ─────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.08 });

const aboutSection = document.querySelector('.about');
if (aboutSection) revealObs.observe(aboutSection);

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

// ─────────────────────────────────────────────
// COMMAND PALETTE (Cmd+K / Ctrl+K)
// ─────────────────────────────────────────────
const cmdPalette  = document.getElementById('cmd-palette');
const cmdInput    = document.getElementById('cmd-input');
const cmdList     = document.getElementById('cmd-list');
const cmdBackdrop = document.getElementById('cmd-backdrop');

let cmdOpen = false;
let selectedIdx = 0;
let currentCommands = [];

function getCommands() {
  return [
    { icon: '↓', label: t('cmdGoAbout'),    action: () => { document.getElementById('about').scrollIntoView({ behavior: 'smooth' }); } },
    { icon: '↓', label: t('cmdGoProjects'), action: () => { document.getElementById('projects').scrollIntoView({ behavior: 'smooth' }); } },
    { icon: '◐', label: t('cmdToggleTheme'), action: () => { cycleTheme(themeToggle); } },
    { icon: '⟳', label: t('cmdToggleLang'),  action: () => {
        currentLang = currentLang === 'en' ? 'fr' : 'en';
        applyTranslations(currentLang);
        renderGrid(activeFilter);
        buildCommandList();
    }},
    { icon: '↗', label: t('cmdGitHub'),      action: () => { window.open('https://github.com/SanoBld', '_blank', 'noopener'); } },
    // Projets dynamiques
    ...projects.map(p => ({
      icon: '◈',
      label: p.name,
      action: () => { window.open(p.url, '_blank', 'noopener'); }
    })),
  ];
}

function buildCommandList(query = '') {
  const cmds = getCommands().filter(c => !query || c.label.toLowerCase().includes(query.toLowerCase()));
  currentCommands = cmds;
  selectedIdx = 0;
  cmdList.innerHTML = '';

  if (!cmds.length) {
    cmdList.innerHTML = `<li class="cmd-empty">${t('cmdEmpty')}</li>`;
    return;
  }

  cmds.forEach((cmd, i) => {
    const li = document.createElement('li');
    li.className = 'cmd-item' + (i === 0 ? ' selected' : '');
    li.innerHTML = `<span class="cmd-item-icon">${cmd.icon}</span>${cmd.label}`;
    li.addEventListener('click', () => { closeCmd(); cmd.action(); playTick(800, 0.05, 0.05); });
    li.addEventListener('mouseenter', () => {
      cmdList.querySelectorAll('.cmd-item').forEach((el, j) => el.classList.toggle('selected', j === i));
      selectedIdx = i;
    });
    cmdList.appendChild(li);
  });
}

function openCmd() {
  cmdOpen = true;
  cmdPalette.classList.add('open');
  cmdPalette.setAttribute('aria-hidden', 'false');
  cmdInput.value = '';
  buildCommandList();
  setTimeout(() => cmdInput.focus(), 30);
}

function closeCmd() {
  cmdOpen = false;
  cmdPalette.classList.remove('open');
  cmdPalette.setAttribute('aria-hidden', 'true');
}

cmdInput.addEventListener('input', e => buildCommandList(e.target.value));

cmdInput.addEventListener('keydown', e => {
  if (e.key === 'Escape')     { closeCmd(); return; }
  if (e.key === 'ArrowDown')  { e.preventDefault(); selectedIdx = Math.min(selectedIdx + 1, currentCommands.length - 1); }
  if (e.key === 'ArrowUp')    { e.preventDefault(); selectedIdx = Math.max(selectedIdx - 1, 0); }
  if (e.key === 'Enter' && currentCommands[selectedIdx]) {
    closeCmd();
    currentCommands[selectedIdx].action();
    playTick(800, 0.05, 0.05);
    return;
  }
  cmdList.querySelectorAll('.cmd-item').forEach((el, i) => el.classList.toggle('selected', i === selectedIdx));
});

cmdBackdrop.addEventListener('click', closeCmd);
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    cmdOpen ? closeCmd() : openCmd();
  }
});

// ─────────────────────────────────────────────
// RACCOURCIS CLAVIER + CODE KONAMI
// ─────────────────────────────────────────────
const KONAMI_SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;

window.addEventListener('keydown', e => {
  if (e.target.closest('input, textarea, select')) return;

  // Konami tracking
  if (e.key === KONAMI_SEQ[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI_SEQ.length) {
      konamiIdx = 0;
      activateKonami();
      return;
    }
  } else {
    konamiIdx = 0;
  }

  if (e.altKey || e.ctrlKey || e.metaKey) return;

  switch (e.key.toLowerCase()) {
    case 'd':
      cycleTheme(themeToggle);
      showToast(t('shortcutTheme'));
      break;
    case 'g':
      window.open('https://github.com/SanoBld', '_blank', 'noopener');
      showToast(t('shortcutGithub'));
      break;
    case 'k':
      if (!cmdOpen) { openCmd(); }
      break;
    case '?':
      showToast(t('shortcutsHint'));
      break;
  }
});

// ─────────────────────────────────────────────
// KONAMI — traînée de particules dorées + son royal
// (↑ ↑ ↓ ↓ ← → ← → B A)
// ─────────────────────────────────────────────
const trailCanvas  = document.getElementById('konami-trail');
const trailCtx     = trailCanvas.getContext('2d');
let   trailParticles = [];
let   trailRaf     = null;
let   konamiActive = false;
let   trailMX = 0, trailMY = 0;

function resizeTrail() {
  trailCanvas.width  = window.innerWidth;
  trailCanvas.height = window.innerHeight;
}
resizeTrail();
window.addEventListener('resize', resizeTrail);

document.addEventListener('mousemove', e => {
  trailMX = e.clientX;
  trailMY = e.clientY;
  if (!konamiActive) return;
  // spawn plusieurs particules
  for (let i = 0; i < 3; i++) {
    trailParticles.push({
      x:    trailMX + (Math.random() - 0.5) * 12,
      y:    trailMY + (Math.random() - 0.5) * 12,
      vx:   (Math.random() - 0.5) * 1.6,
      vy:   -(Math.random() * 1.4 + 0.4),
      size: Math.random() * 4 + 2,
      life: 1,
    });
  }
});

function trailTick() {
  trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  trailParticles = trailParticles.filter(p => p.life > 0.02);
  trailParticles.forEach(p => {
    p.x    += p.vx;
    p.y    += p.vy;
    p.vy   += 0.035;  // gravité légère
    p.life -= 0.025;
    const alpha = Math.max(0, p.life);
    trailCtx.save();
    trailCtx.globalAlpha = alpha;
    trailCtx.fillStyle   = `hsl(${38 + Math.random() * 14}, 88%, ${52 + Math.random() * 22}%)`;
    trailCtx.beginPath();
    trailCtx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
    trailCtx.fill();
    trailCtx.restore();
  });
  if (konamiActive || trailParticles.length > 0) trailRaf = requestAnimationFrame(trailTick);
  else trailRaf = null;
}

function activateKonami() {
  showToast(t('konamiMsg'));
  html.classList.add('konami-active');
  konamiActive = true;
  trailCanvas.classList.add('active');

  // Haptic (mobile)
  if (navigator.vibrate) navigator.vibrate([8, 60, 8, 60, 30]);

  // Son royal
  playTick(523, 0.12, 0.09);
  setTimeout(() => playTick(659, 0.12, 0.09), 130);
  setTimeout(() => playTick(784, 0.20, 0.09), 260);

  if (!trailRaf) trailRaf = requestAnimationFrame(trailTick);

  setTimeout(() => {
    html.classList.remove('konami-active');
    konamiActive = false;
    trailCanvas.classList.remove('active');
  }, 4000);
}

// ─────────────────────────────────────────────
// MESSAGE CONSOLE
// ─────────────────────────────────────────────
/* eslint-disable no-console */
console.log('%c👑  Sano Bld','color:#AA211F;font-size:30px;font-family:serif;font-weight:bold;padding:4px 0;');
console.log('%cDu code fait avec passion. Curieux de voir comment ça marche ? Bienvenue.\nMade with passion. Curious how it works? Welcome.','color:#C98A35;font-size:12px;font-family:monospace;line-height:1.6;');
console.log('%cStack → HTML · CSS · Vanilla JS · Canvas API · Firebase · Last.fm API','color:#8a9baa;font-size:11px;font-family:monospace;');
console.log('%c→ github.com/SanoBld','color:#F2D99B;background:#1c2330;font-size:12px;font-family:monospace;padding:3px 10px;border-radius:2px;');
/* eslint-enable no-console */
