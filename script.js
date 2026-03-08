// ============================================================
//  SANO BLD — Dualité Luxe
//  script.js — version Lame de Rasoir Vraie
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

// ============================================================
//  FIREBASE — Compteur de vues
// ============================================================
const firebaseConfig = {
    apiKey:      "AIzaSyCo84qaR5dUOWutGE4w3g-HjxAiNZLldpM",
    databaseURL: "https://sanobld-portfolio-default-rtdb.europe-west1.firebasedatabase.app",
    projectId:   "sanobld-portfolio"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const viewRef = db.ref('views');
viewRef.transaction(n => (n || 0) + 1);
viewRef.on('value', snap => {
    const el = document.getElementById('footer-views');
    if (el) el.textContent = (snap.val() ?? 0).toLocaleString() + ' views';
});

// ============================================================
//  HERO — Anti-saccade mobile
//  Verrouillage px unique au premier chargement.
//  Recalcul uniquement si la LARGEUR change (pas la hauteur),
//  pour immuniser contre la barre URL mobile flottante.
// ============================================================
function lockHero() {
    const vw  = window.innerWidth;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const size = Math.min(Math.max(vw * 0.17, 5 * rem), 21 * rem);
    const root = document.documentElement;
    root.style.setProperty('--hero-title-size', `${size}px`);
    root.style.setProperty('--hero-h', `${window.innerHeight}px`);
}
lockHero();

let prevW = window.innerWidth;
window.addEventListener('resize', () => {
    if (window.innerWidth !== prevW) { prevW = window.innerWidth; lockHero(); }
}, { passive: true });

// ============================================================
//  THÈME — auto system + toggle
// ============================================================
const body     = document.body;
const themeBtn = document.getElementById('theme-toggle');

function detectTheme() {
    const saved = localStorage.getItem('sb-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

let currentTheme = detectTheme();

function applyTheme(t, animate = true) {
    currentTheme = t;
    if (!animate) body.style.transition = 'none';
    body.classList.toggle('dark', t === 'dark');
    if (!animate) requestAnimationFrame(() => body.style.transition = '');
    if (themeBtn) themeBtn.textContent = t === 'dark' ? '◑' : '◐';
    localStorage.setItem('sb-theme', t);
}

applyTheme(currentTheme, false);
themeBtn?.addEventListener('click', () => applyTheme(currentTheme === 'dark' ? 'light' : 'dark'));

// ============================================================
//  LANGUE — FR / EN
// ============================================================
const strings = {
    fr: {
        'hero-eyebrow':    'Portfolio · 2026',
        'hero-sub':        'Creative Developer',
        'scroll-hint':     '— défiler',
        'section-apps':    'Applications',
        'section-games':   'Jeux',
        'section-network': 'Réseau',
        'toc-apps':        'Applications',
        'toc-games':       'Jeux',
        'toc-network':     'Réseau',
        'footer':          'Sano Bld © 2026',
    },
    en: {
        'hero-eyebrow':    'Portfolio · 2026',
        'hero-sub':        'Creative Developer',
        'scroll-hint':     '— scroll',
        'section-apps':    'Applications',
        'section-games':   'Games',
        'section-network': 'Network',
        'toc-apps':        'Applications',
        'toc-games':       'Games',
        'toc-network':     'Network',
        'footer':          'Sano Bld © 2026',
    }
};

let currentLang = localStorage.getItem('sb-lang')
    || (navigator.language?.startsWith('en') ? 'en' : 'fr');

const langBtn = document.getElementById('lang-toggle');

function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    if (langBtn) langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
    localStorage.setItem('sb-lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (strings[lang]?.[key] !== undefined) el.textContent = strings[lang][key];
    });
}

applyLang(currentLang);
langBtn?.addEventListener('click', () => applyLang(currentLang === 'fr' ? 'en' : 'fr'));

// ============================================================
//  PRELOADER — Vrai Split-Text via clip-path
//
//  Principe :
//  Le texte SANO BLD est injecté dans DEUX spans superposés
//  au centre de l'écran, positionnés identiquement.
//  Chaque span n'affiche qu'une moitié du texte via clip-path.
//
//  .pre-text-top → clip-path: inset(0 padding 50% padding)
//                  = moitié SUPÉRIEURE des lettres
//                  → couleur Nuit (lisible sur fond Beige)
//
//  .pre-text-bot → clip-path: inset(50% padding 0 padding)
//                  = moitié INFÉRIEURE des lettres
//                  → couleur Beige (lisible sur fond Nuit)
//
//  Résultat visuel : UN seul mot bicolore, la jointure passant
//  exactement à mi-hauteur des capitales.
//
//  À l'ouverture :
//  · .pre-text-top + .pre-curtain-top → translateY(-120vh)
//  · .pre-text-bot + .pre-curtain-bot → translateY(+120vh)
//  → Déchirure physique nette.
// ============================================================
const preTextTop = document.getElementById('pre-text-top');
const preTextBot = document.getElementById('pre-text-bot');
const preloader  = document.getElementById('preloader');

const WORD       = 'SANO BLD';
const CHAR_DELAY = 0.052;

// Injection des chars animés dans les deux spans
[preTextTop, preTextBot].forEach(el => {
    if (!el) return;
    WORD.split('').forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.animationDelay = `${i * CHAR_DELAY}s`;
        el.appendChild(span);
    });
});

const charsDuration = WORD.length * CHAR_DELAY * 1000 + 650;

window.addEventListener('load', () => {
    setTimeout(() => {
        preloader?.classList.add('open');
        setTimeout(() => preloader?.classList.add('gone'), 1050);
    }, charsDuration);
});

// ============================================================
//  CURSEUR CAMÉLÉON — mix-blend-mode: difference
//  Le conteneur #cursor-arrow a mix-blend-mode: difference.
//  Le SVG est forcé tout-blanc (filter: brightness(1000)).
//  Blanc + difference = inversion parfaite du fond sous-jacent.
//  Aucun calcul JS de couleur requis. Performances max.
// ============================================================
const cursorArrow = document.getElementById('cursor-arrow');
const hasPointer  = window.matchMedia('(hover: hover)').matches;

if (!hasPointer) {
    cursorArrow?.remove();
} else {
    let mx = window.innerWidth  / 2;
    let my = window.innerHeight / 2;
    let cx = mx, cy = my;
    const LERP = 0.20;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
    }, { passive: true });

    function animateCursor() {
        cx += (mx - cx) * LERP;
        cy += (my - cy) * LERP;
        if (cursorArrow) cursorArrow.style.transform = `translate(${cx}px, ${cy}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
}

// ============================================================
//  GHOST SPANS — Italic sans pop de layout
//  Injecte .pn-real (visible) + .pn-ghost (italic invisible)
//  dans un conteneur inline-grid. Les deux partagent la même
//  grid-area → le ghost fixe la largeur max (version italic).
//  Au hover, .pn-real bascule en italic dans l'espace réservé.
// ============================================================
document.querySelectorAll('.project-name').forEach(el => {
    const text = el.textContent.trim();
    el.innerHTML =
        `<span class="pn-real">${text}</span>` +
        `<span class="pn-ghost" aria-hidden="true">${text}</span>`;
});

// ============================================================
//  SCROLL REVEAL — stagger par liste
// ============================================================
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const list    = entry.target.closest('.project-list');
        const pending = list
            ? [...list.querySelectorAll('.project-row:not(.visible)')]
            : [];
        const idx   = pending.indexOf(entry.target);
        const delay = Math.max(0, Math.min(idx, 5)) * 0.072;
        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
    });
}, { threshold: 0.04, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.project-row').forEach(r => revealObs.observe(r));

// ============================================================
//  NAV CENTRALE — Scrollspy
//  IntersectionObserver sur chaque .work-section[id].
//  Active .active sur le .nav-toc-item correspondant.
// ============================================================
const navItems  = document.querySelectorAll('.nav-toc-item[data-section]');
const wSections = document.querySelectorAll('.work-section[id]');

if (navItems.length && wSections.length) {
    const navMap = {};
    navItems.forEach(item => { navMap[item.dataset.section] = item; });

    const navObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const item = navMap[entry.target.id];
            if (item) item.classList.toggle('active', entry.isIntersecting);
        });
    }, { threshold: 0.25, rootMargin: '-10% 0px -10% 0px' });

    wSections.forEach(s => navObs.observe(s));
}

// ============================================================
//  PARALLAXE — Asides défilent à 88% de la vitesse de scroll
//  Effet couches éditoriales (livre d'art / catalogue)
// ============================================================
const parallaxAsides  = document.querySelectorAll('[data-parallax]');
const PARALLAX_FACTOR = 0.12;

function tickParallax() {
    parallaxAsides.forEach(aside => {
        const section = aside.closest('.work-section');
        if (!section) return;
        const rect          = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2 - window.innerHeight / 2;
        aside.style.transform = `translateY(${sectionCenter * PARALLAX_FACTOR}px)`;
    });
}

// ============================================================
//  PROFONDEUR DE CHAMP — Blur progressif au scroll
//  Distance au centre du viewport → data-blur 0 / 1 / 2
//  Les transitions CSS (filter + opacity) assurent la fluidité.
// ============================================================
function tickBlur() {
    const vh      = window.innerHeight;
    const vCenter = vh / 2;
    const ZONE1   = vh * 0.30;
    const ZONE2   = vh * 0.50;

    document.querySelectorAll('.project-row.visible').forEach(row => {
        const rect      = row.getBoundingClientRect();
        const rowCenter = rect.top + rect.height / 2;
        const dist      = Math.abs(rowCenter - vCenter);
        const level     = dist > ZONE2 ? 2 : dist > ZONE1 ? 1 : 0;
        const current   = row.getAttribute('data-blur') || '0';
        if (String(level) !== current) row.setAttribute('data-blur', level);
    });
}

// Scroll handler batché sur rAF
let rafPending = false;
function onScroll() {
    if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
            tickParallax();
            tickBlur();
            rafPending = false;
        });
    }
}

window.addEventListener('scroll', onScroll, { passive: true });
tickParallax();
tickBlur();

// ============================================================
//  HORLOGE — footer
// ============================================================
function updateClock() {
    const el = document.getElementById('footer-time');
    if (!el) return;
    const now = new Date();
    const pad = v => String(v).padStart(2, '0');
    el.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
setInterval(updateClock, 1000);
updateClock();

// ============================================================
//  FIN
// ============================================================
});
