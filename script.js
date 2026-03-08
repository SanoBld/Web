// ============================================================
//  SANO BLD — Dualité Luxe
//  script.js — version finale
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
//  Calcul unique en px. Recalcul UNIQUEMENT si largeur change.
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
//  THÈME
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
//  LANGUE
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
//  PRELOADER — Vrai Split-Text (bug d'alignement corrigé)
//
//  CAUSE DU BUG : si la police Google Fonts n'est pas encore
//  chargée, les deux spans peuvent avoir des dimensions
//  différentes lors de l'injection des chars, provoquant un
//  décalage entre les moitiés.
//
//  SOLUTION :
//  1. On attend document.fonts.ready avant d'injecter
//  2. Les deux spans partagent grid-area: 1/1 (CSS)
//     → ils occupent exactement la même cellule
//  3. clip-path en % → coupe toujours à la même hauteur
//     relative, quelle que soit la taille résolue
//
//  OUVERTURE synchronisée :
//  .pre-text-top + .pre-curtain-top → translateY(-110vh)
//  .pre-text-bot + .pre-curtain-bot → translateY(+110vh)
//  Même durée/easing → la jointure reste parfaite jusqu'à
//  la séparation complète.
// ============================================================
const preTextTop = document.getElementById('pre-text-top');
const preTextBot = document.getElementById('pre-text-bot');
const preloader  = document.getElementById('preloader');

const WORD       = 'SANO BLD';
const CHAR_DELAY = 0.052;

function injectChars(el) {
    if (!el) return;
    el.innerHTML = '';
    WORD.split('').forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.animationDelay = `${i * CHAR_DELAY}s`;
        el.appendChild(span);
    });
}

// Attendre la résolution des polices pour garantir l'alignement
document.fonts.ready.then(() => {
    injectChars(preTextTop);
    injectChars(preTextBot);
});

const charsDuration = WORD.length * CHAR_DELAY * 1000 + 700;

window.addEventListener('load', () => {
    setTimeout(() => {
        preloader?.classList.add('open');
        setTimeout(() => preloader?.classList.add('gone'), 1050);
    }, charsDuration);
});

// ============================================================
//  CURSEUR CAMÉLÉON
//  mix-blend-mode: difference (CSS) + SVG blanc pur.
//  Inversion automatique sur tous les fonds. Lerp 0.20.
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
//  HOVER GLISSEMENT — inject .pn-real span dans .project-name
//  Suppression de l'italic.
//  Effet : translateX(4px) + opacity (CSS).
// ============================================================
document.querySelectorAll('.project-name').forEach(el => {
    const text = el.textContent.trim();
    el.innerHTML = `<span class="pn-real">${text}</span>`;
});

// ============================================================
//  EFFET TILT — Profondeur cinétique sur le titre Hero
//
//  Le titre SANO BLD réagit subtilement au mouvement de la
//  souris via rotateX + rotateY.
//
//  Paramètres :
//  · MAX_ROT : rotation max (degrés) — 4° = très subtil
//  · LERP    : interpolation — 0.06 = inertie longue, luxueux
//
//  Technique :
//  On calcule la position normalisée de la souris par rapport
//  au centre du viewport (−1 à +1 sur chaque axe).
//  rotateX = vertical (négatif = souris en haut → titre penche vers nous)
//  rotateY = horizontal
//
//  On utilise un lerp JS sur tiltX/tiltY pour la fluidité.
//  La perspective est définie sur .hero (CSS).
// ============================================================
const heroTitle   = document.getElementById('hero-title');
const hasHover    = window.matchMedia('(hover: hover)').matches;

if (heroTitle && hasHover) {
    const MAX_ROT   = 4;   // degrés
    const LERP_TILT = 0.06; // très doux — inertie de luxe

    let targetRX = 0, targetRY = 0;
    let currentRX = 0, currentRY = 0;
    let tiltRaf = null;

    function animateTilt() {
        currentRX += (targetRX - currentRX) * LERP_TILT;
        currentRY += (targetRY - currentRY) * LERP_TILT;

        heroTitle.style.transform =
            `rotateX(${currentRX.toFixed(3)}deg) rotateY(${currentRY.toFixed(3)}deg)`;

        // Continuer tant qu'on n'a pas convergé
        const dist = Math.abs(targetRX - currentRX) + Math.abs(targetRY - currentRY);
        if (dist > 0.001) {
            tiltRaf = requestAnimationFrame(animateTilt);
        } else {
            tiltRaf = null;
        }
    }

    document.addEventListener('mousemove', e => {
        const nx = (e.clientX / window.innerWidth  - 0.5) * 2; // −1 à +1
        const ny = (e.clientY / window.innerHeight - 0.5) * 2; // −1 à +1

        // rotateX inversé : souris en haut (ny négatif) → penche vers viewer
        targetRX = -ny * MAX_ROT;
        targetRY =  nx * MAX_ROT;

        if (!tiltRaf) tiltRaf = requestAnimationFrame(animateTilt);
    }, { passive: true });

    // Retour à plat quand la souris sort de la fenêtre
    document.addEventListener('mouseleave', () => {
        targetRX = 0;
        targetRY = 0;
        if (!tiltRaf) tiltRaf = requestAnimationFrame(animateTilt);
    });
}

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
//  PARALLAXE — Asides (couches éditoriales)
// ============================================================
const parallaxAsides  = document.querySelectorAll('[data-parallax]');
const PARALLAX_FACTOR = 0.11;

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
//  PROFONDEUR DE CHAMP — Blur progressif
// ============================================================
function tickBlur() {
    const vh      = window.innerHeight;
    const vCenter = vh / 2;
    const ZONE1   = vh * 0.30;
    const ZONE2   = vh * 0.52;

    document.querySelectorAll('.project-row.visible').forEach(row => {
        const rect      = row.getBoundingClientRect();
        const rowCenter = rect.top + rect.height / 2;
        const dist      = Math.abs(rowCenter - vCenter);
        const level     = dist > ZONE2 ? 2 : dist > ZONE1 ? 1 : 0;
        const current   = row.getAttribute('data-blur') || '0';
        if (String(level) !== current) row.setAttribute('data-blur', level);
    });
}

// Scroll batché sur rAF
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
//  HORLOGE
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

});
