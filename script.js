// ─────────────────────────────────────────────
// DONNÉES PROJETS
// ─────────────────────────────────────────────
const projects = [
  { name: 'LastStats',    url: 'https://sanobld.github.io/LastStats/',   category: 'musique', repo: 'SanoBld/LastStats' },
  { name: 'Aura',         url: 'https://sanobld.github.io/Aura/',         category: 'musique', repo: 'SanoBld/Aura' },
  { name: "SO'BÔHÈME",    url: 'https://soboheme.github.io/Web/',          category: 'web',     repo: 'soboheme/Web' },
  { name: 'BioLinkMaker', url: 'https://sanobld.github.io/BioLinkMaker/', category: 'appjeu',  repo: 'SanoBld/BioLinkMaker' },
];

const CATEGORY_LABELS = {
  musique: { en: 'Music',      fr: 'Musique' },
  web:     { en: 'Web',        fr: 'Web' },
  appjeu:  { en: 'App / Game', fr: 'App / Jeu' },
};

// ─────────────────────────────────────────────
// i18n — détection automatique de la langue
// ─────────────────────────────────────────────
const i18n = {
  en: {
    sectionTag:      'Selected Work',
    sectionTitle:    'Projects',
    ctaTitle:        'See the full picture',
    ctaBtn:          'View on GitHub',
    footer:          '© 2025 SanoBld',
    cursorOpen:      'OPEN',
    navGithub:       'GitHub',
    aboutTag:        'About',
    aboutText:       'Developer & designer based in France. I build refined web experiences in pure HTML, CSS and JavaScript — no frameworks, just deliberate code.',
    activityTag:     'Latest Activity',
    activityTitle:   'Commits',
    commitsLoading:  'Fetching commits…',
    commitsError:    'Unavailable',
    filterAll:       'All',
    filterMusique:   'Music',
    filterWeb:       'Web',
    filterAppjeu:    'App / Game',
    shortcutTheme:   'Theme toggled',
    shortcutGithub:  'Opening GitHub…',
    shortcutsHint:   'D = Theme · G = GitHub · ? = Shortcuts',
    konamiMsg:       '👑 Royal Mode — Activated',
  },
  fr: {
    sectionTag:      'Travaux Choisis',
    sectionTitle:    'Projets',
    ctaTitle:        "Voir l'ensemble du travail",
    ctaBtn:          'Voir sur GitHub',
    footer:          '© 2025 SanoBld',
    cursorOpen:      'VOIR',
    navGithub:       'GitHub',
    aboutTag:        'À propos',
    aboutText:       'Développeur & designer basé en France. Je construis des expériences web soignées en HTML, CSS et JavaScript pur — sans framework, juste du code réfléchi.',
    activityTag:     'Activité récente',
    activityTitle:   'Commits',
    commitsLoading:  'Chargement…',
    commitsError:    'Indisponible',
    filterAll:       'Tout',
    filterMusique:   'Musique',
    filterWeb:       'Web',
    filterAppjeu:    'App / Jeu',
    shortcutTheme:   'Thème changé',
    shortcutGithub:  'Ouverture GitHub…',
    shortcutsHint:   'D = Thème · G = GitHub · ? = Raccourcis',
    konamiMsg:       '👑 Mode Royal — Activé',
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
  document.getElementById('lang-toggle').textContent = lang === 'en' ? 'FR' : 'EN';

  // Labels filtres
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
    const key = 'filter' + btn.dataset.filter.charAt(0).toUpperCase() + btn.dataset.filter.slice(1);
    if (i18n[lang][key]) btn.textContent = i18n[lang][key];
  });

  // Tags catégorie sur les cartes
  document.querySelectorAll('.card-category[data-category]').forEach(el => {
    const cat = el.dataset.category;
    if (CATEGORY_LABELS[cat]) el.textContent = CATEGORY_LABELS[cat][lang] || cat;
  });
}

// ─────────────────────────────────────────────
// RENDU D'UNE CARTE PROJET
// ─────────────────────────────────────────────
function renderCard(project, i) {
  const idx    = String(i + 1).padStart(2, '0');
  const catLbl = (CATEGORY_LABELS[project.category] || {})[currentLang] || project.category;
  const li     = document.createElement('li');
  li.className       = 'project-card';
  li.dataset.category = project.category;
  li.innerHTML = `
    <a href="${project.url}" target="_blank" rel="noopener" class="project-link"
       data-cursor="open" data-name="${project.name}" data-index="${idx}">
      <span class="card-num">${idx}</span>
      <span class="card-ghost" aria-hidden="true">${idx}</span>
      <h3 class="card-name">
        <span class="name-normal">${project.name}</span>
        <span class="name-italic">${project.name}</span>
      </h3>
      <span class="card-category" data-category="${project.category}">${catLbl}</span>
      <span class="card-arrow">↗</span>
    </a>`;
  return li;
}

// ─────────────────────────────────────────────
// GRILLE PROJETS + FILTRE CATÉGORIES
// ─────────────────────────────────────────────
const gridEl      = document.getElementById('project-grid');
let   activeFilter = 'all';

function renderGrid(filter) {
  activeFilter = filter;
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  // Fade-out
  gridEl.style.opacity   = '0';
  gridEl.style.transform = 'translateY(10px)';

  setTimeout(() => {
    gridEl.innerHTML = '';
    gridEl.classList.toggle('grid-compact', filtered.length < 3);

    filtered.forEach((proj, i) => gridEl.appendChild(renderCard(proj, i)));

    attachScrambleListeners();
    attachCursorListeners();
    updateGhostParallax();

    // Fade-in + stagger
    requestAnimationFrame(() => {
      gridEl.style.opacity   = '1';
      gridEl.style.transform = '';
      gridEl.querySelectorAll('.project-card').forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 90);
      });
    });
  }, 290);
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
    renderGrid(btn.dataset.filter);
  });
});

// ─────────────────────────────────────────────
// GRAIN TEXTURE (canvas généré)
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
})();

// ─────────────────────────────────────────────
// PRELOADER — couronne → titre plein écran
// ─────────────────────────────────────────────
const preloader      = document.getElementById('preloader');
const preloaderLogo  = document.getElementById('preloader-logo');
const preloaderCrown = document.getElementById('preloader-crown');

function fitLoaderText() {
  preloaderLogo.style.fontSize = '10px';
  const maxW = window.innerWidth * 0.82;
  let lo = 10, hi = 700, mid;
  while (lo < hi - 1) {
    mid = (lo + hi) >> 1;
    preloaderLogo.style.fontSize = mid + 'px';
    preloaderLogo.scrollWidth > maxW ? (hi = mid) : (lo = mid);
  }
  preloaderLogo.style.fontSize = lo + 'px';
}

function dismissPreloader() {
  document.body.classList.add('loaded');
  preloader.classList.add('out');
  preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
}

// Phase 1 : couronne (950ms), Phase 2 : titre
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
// THÈME (le flash est déjà géré dans le <head>)
// ─────────────────────────────────────────────
const html        = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function getEffectiveTheme() {
  const s = localStorage.getItem('theme');
  return (s === 'dark' || s === 'light') ? s
    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '◑' : '◐';
  localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () =>
  applyTheme(getEffectiveTheme() === 'dark' ? 'light' : 'dark')
);
applyTheme(getEffectiveTheme());
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) applyTheme(e.matches ? 'dark' : 'light');
});

// ─────────────────────────────────────────────
// LANGUE
// ─────────────────────────────────────────────
document.getElementById('lang-toggle').addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'fr' : 'en';
  applyTranslations(currentLang);
  renderGrid(activeFilter); // rerender les labels catégorie
});
applyTranslations(currentLang);

// ─────────────────────────────────────────────
// CURSEUR CUSTOM (uniquement desktop avec pointeur précis)
// ─────────────────────────────────────────────
(function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.body.classList.add('has-custom-cursor');
  const cursor = document.querySelector('.cursor');
  let mx = window.innerWidth  / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;
  const LERP = 0.22;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function tick() {
    cx += (mx - cx) * LERP;
    cy += (my - cy) * LERP;
    cursor.style.left = `${cx}px`;
    cursor.style.top  = `${cy}px`;
    requestAnimationFrame(tick);
  })();

  attachCursorListeners();
})();

function attachCursorListeners() {
  document.querySelectorAll('[data-cursor="open"]').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-open'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-open'));
  });
  document.querySelectorAll('[data-cursor="link"]').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-link'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-link'));
  });
}

// ─────────────────────────────────────────────
// SCRAMBLE + CROSSFADE ITALIC
// ─────────────────────────────────────────────
const SCRAMBLE_CHARS    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&';
const SCRAMBLE_MS       = 380;
const SCRAMBLE_INTERVAL = 28;

function startScramble(link) {
  const span     = link.querySelector('.name-normal');
  const realName = link.dataset.name;
  const total    = Math.ceil(SCRAMBLE_MS / SCRAMBLE_INTERVAL);
  let frame = 0;
  link._scramble = setInterval(() => {
    const locked = Math.floor((frame / total) * realName.length);
    span.textContent = realName.split('').map((ch, i) => {
      if (ch === ' ' || ch === "'") return ch;
      if (i < locked) return ch;
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }).join('');
    frame++;
    if (frame > total) {
      clearInterval(link._scramble);
      span.textContent = realName;
      link.classList.add('scramble-done');
    }
  }, SCRAMBLE_INTERVAL);
}

function stopScramble(link) {
  clearInterval(link._scramble);
  link.classList.remove('scramble-done');
  link.querySelector('.name-normal').textContent = link.dataset.name;
}

function attachScrambleListeners() {
  document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('mouseenter', () => startScramble(link));
    link.addEventListener('mouseleave', () => stopScramble(link));
  });
}

// ─────────────────────────────────────────────
// SCROLL : header · barre de progression · parallaxe fantômes · skew
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

// Parallaxe sur les numéros fantômes
function updateGhostParallax() {
  const sy = window.scrollY;
  document.querySelectorAll('.card-ghost').forEach((ghost, i) => {
    const speed = 0.022 + (i % 4) * 0.007;
    ghost.style.setProperty('--py', `${sy * speed}px`);
  });
}

// RAF pour le skew fluide
function skewTick() {
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

// Gestion du header : hero invisible, smart hide/show
function updateHeader(sy) {
  const heroH = heroSection.offsetHeight;
  if (sy < heroH * 0.78) {
    siteHeader.classList.add('header-in-hero');
    siteHeader.classList.remove('header-hidden', 'scrolled');
    return;
  }
  siteHeader.classList.remove('header-in-hero');
  siteHeader.classList.add('scrolled');

  if (sy > lastScrollY + 5)      siteHeader.classList.add('header-hidden');
  else if (sy < lastScrollY - 3) siteHeader.classList.remove('header-hidden');
}

window.addEventListener('scroll', () => {
  const sy  = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;

  // Barre progression
  progressBar.style.width = `${Math.min(100, (sy / docH) * 100)}%`;

  // Header
  updateHeader(sy);

  // Parallaxe fantômes
  updateGhostParallax();

  // Skew
  const delta = sy - prevSkewScroll;
  prevSkewScroll = sy;
  skewTarget = Math.max(-1.8, Math.min(1.8, delta * -0.065));
  if (!skewRafId) skewRafId = requestAnimationFrame(skewTick);

  lastScrollY = sy;
}, { passive: true });

// Init header au chargement
updateHeader(window.scrollY);

// ─────────────────────────────────────────────
// SMOOTH SCROLL (desktop uniquement)
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
      ArrowDown:  90,  ArrowUp:  -90,
      PageDown:   window.innerHeight * 0.85,
      PageUp:    -window.innerHeight * 0.85,
      ' ':        window.innerHeight * 0.85,
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

// ─────────────────────────────────────────────
// INTERSECTION OBSERVER — about + commits
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
// COMMITS GITHUB
// ─────────────────────────────────────────────
async function fetchCommits() {
  const list = document.getElementById('commit-list');

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

  const results = await Promise.allSettled(
    projects.map(p =>
      fetch(`https://api.github.com/repos/${p.repo}/commits?per_page=1`)
        .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(data => ({
          name: p.name,
          msg:  (data[0]?.commit?.message || '—').split('\n')[0],
          date: data[0]?.commit?.author?.date || null,
        }))
    )
  );

  list.innerHTML = '';
  results.forEach((res, i) => {
    const li = document.createElement('li');
    li.className = 'commit-item';
    if (res.status === 'fulfilled') {
      const { name, msg, date } = res.value;
      li.innerHTML = `
        <span class="commit-repo">${name}</span>
        <span class="commit-msg">${msg}</span>
        <span class="commit-time">${date ? timeAgo(date) : t('commitsError')}</span>`;
    } else {
      li.innerHTML = `
        <span class="commit-repo">${projects[i].name}</span>
        <span class="commit-msg">—</span>
        <span class="commit-time">${t('commitsError')}</span>`;
    }
    list.appendChild(li);
    setTimeout(() => li.classList.add('visible'), i * 130);
  });
}

fetchCommits();

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
// RACCOURCIS CLAVIER + CODE KONAMI
// ─────────────────────────────────────────────
const KONAMI_SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;

window.addEventListener('keydown', e => {
  if (e.target.closest('input, textarea, select')) return;

  // Suivi Konami
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

  // Raccourcis simples (pas en conflit avec des combos)
  if (e.altKey || e.ctrlKey || e.metaKey) return;

  switch (e.key.toLowerCase()) {
    case 'd':
      applyTheme(getEffectiveTheme() === 'dark' ? 'light' : 'dark');
      showToast(t('shortcutTheme'));
      break;
    case 'g':
      window.open('https://github.com/SanoBld', '_blank', 'noopener');
      showToast(t('shortcutGithub'));
      break;
    case '?':
      showToast(t('shortcutsHint'));
      break;
  }
});

function activateKonami() {
  showToast(t('konamiMsg'));
  html.classList.add('konami-active');
  setTimeout(() => html.classList.remove('konami-active'), 4000);
}

// ─────────────────────────────────────────────
// MESSAGE CONSOLE — pour les curieux
// ─────────────────────────────────────────────
/* eslint-disable no-console */
console.log(
  '%c👑  SanoBld',
  'color:#AA211F;font-size:30px;font-family:serif;font-weight:bold;padding:4px 0;'
);
console.log(
  '%cDu code fait avec passion. Curieux de voir comment ça marche ? Bienvenue.\n'
+ 'Made with passion. Curious how it works? Welcome.',
  'color:#C98A35;font-size:12px;font-family:monospace;line-height:1.6;'
);
console.log(
  '%cStack → HTML · CSS · Vanilla JS · Canvas API · Firebase · Last.fm API',
  'color:#8a9baa;font-size:11px;font-family:monospace;'
);
console.log(
  '%c→ github.com/SanoBld',
  'color:#F2D99B;background:#1c2330;font-size:12px;font-family:monospace;'
+ 'padding:3px 10px;border-radius:2px;'
);
/* eslint-enable no-console */
