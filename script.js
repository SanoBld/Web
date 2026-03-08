// ============================================================
//  SANO BLD — Dualité Luxe
//  script.js
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
//  Verrouille hauteur + font-size en px basés sur window.innerWidth.
//  Ne se recalcule QUE si la largeur change (pas la hauteur),
//  ce qui évite les sauts quand la barre du navigateur mobile
//  apparaît ou disparaît.
// ============================================================
function lockHero() {
    const vw  = window.innerWidth;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

    // Reproduit clamp(5rem, 17vw, 21rem) en px fixe
    const min  = 5  * rem;
    const max  = 21 * rem;
    const size = Math.min(Math.max(vw * 0.17, min), max);

    const root = document.documentElement;
    root.style.setProperty('--hero-title-size', `${size}px`);
    root.style.setProperty('--hero-h', `${window.innerHeight}px`);
}

lockHero();

// Surveillance UNIQUEMENT sur changement de largeur
let prevViewportW = window.innerWidth;
window.addEventListener('resize', () => {
    if (window.innerWidth !== prevViewportW) {
        prevViewportW = window.innerWidth;
        lockHero();
    }
}, { passive: true });

// ============================================================
//  THÈME — auto system + toggle (transition 1.5s)
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
        'toc-apps':        'Apps',
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
        'toc-apps':        'Apps',
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
//  PRELOADER ENVELOPPE — Split Text
//  Le texte SANO BLD est injecté dans les DEUX moitiés
//  (pre-name-top ancré bottom:0 · pre-name-bot ancré top:0).
//  overflow:hidden sur chaque .pre-half fait le découpage.
//  À l'ouverture : moitié haute remonte / moitié basse descend.
//  Effet : le nom a été scellé sur la jonction de l'enveloppe.
// ============================================================
const preNameTop = document.getElementById('pre-name-top');
const preNameBot = document.getElementById('pre-name-bot');
const preloader  = document.getElementById('preloader');

const WORD       = 'SANO BLD';
const CHAR_DELAY = 0.055; // secondes entre chaque lettre

// Injection identique dans les deux moitiés
[preNameTop, preNameBot].forEach(el => {
    if (!el) return;
    WORD.split('').forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.animationDelay = `${i * CHAR_DELAY}s`;
        el.appendChild(span);
    });
});

// Durée totale d'animation des chars
const charsDuration = WORD.length * CHAR_DELAY * 1000 + 600; // +600ms de lecture

window.addEventListener('load', () => {
    setTimeout(() => {
        preloader?.classList.add('open');
        setTimeout(() => preloader?.classList.add('gone'), 1000);
    }, charsDuration);
});

// ============================================================
//  CURSEUR — Flèche SVG fine type macOS
//  • Flèche 16×24px, hotspot = coin supérieur gauche
//  • Lerp 0.20 — fluidité soyeuse
//  • fill: var(--text) + stroke: var(--bg) → adaptatif au thème
//  • Pas d'anneau, pas de cercle
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
        mx = e.clientX;
        my = e.clientY;
    }, { passive: true });

    function animateCursor() {
        cx += (mx - cx) * LERP;
        cy += (my - cy) * LERP;

        if (cursorArrow) {
            // Pas de soustraction de 50% : le hotspot est le coin haut-gauche du SVG
            cursorArrow.style.transform = `translate(${cx}px, ${cy}px)`;
        }

        requestAnimationFrame(animateCursor);
    }
    animateCursor();
}

// ============================================================
//  SCROLL REVEAL — IntersectionObserver + stagger par liste
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
//  SOMMAIRE FLOTTANT — Scrollspy
//  IntersectionObserver sur chaque .work-section[id].
//  Active la classe .active sur le .toc-item correspondant.
// ============================================================
const tocItems   = document.querySelectorAll('.toc-item[data-section]');
const wSections  = document.querySelectorAll('.work-section[id]');

if (tocItems.length && wSections.length) {
    const tocMap = {};
    tocItems.forEach(item => { tocMap[item.dataset.section] = item; });

    const tocObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const item = tocMap[entry.target.id];
            if (item) item.classList.toggle('active', entry.isIntersecting);
        });
    }, {
        threshold: 0.25,
        rootMargin: '-10% 0px -10% 0px'
    });

    wSections.forEach(s => tocObs.observe(s));
}

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
