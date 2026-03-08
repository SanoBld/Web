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

// Premier chargement sans animation pour éviter le flash
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
        'footer':          'Sano Bld © 2026',
    },
    en: {
        'hero-eyebrow':    'Portfolio · 2026',
        'hero-sub':        'Creative Developer',
        'scroll-hint':     '— scroll',
        'section-apps':    'Applications',
        'section-games':   'Games',
        'section-network': 'Network',
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
//  PRELOADER — fade-in lettre par lettre + enveloppe
// ============================================================
const preloader  = document.getElementById('preloader');
const preNameEl  = document.getElementById('pre-name');
const WORD        = 'SANO BLD';
const CHAR_DELAY  = 0.055; // secondes entre chaque lettre

// Injection des <span class="char"> animés
if (preNameEl) {
    WORD.split('').forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch === ' ' ? '\u00A0' : ch; // espace insécable
        span.style.animationDelay = `${i * CHAR_DELAY}s`;
        preNameEl.appendChild(span);
    });
}

// Durée totale d'animation des chars
const charsDuration = WORD.length * CHAR_DELAY * 1000 + 600; // +600ms de lecture

window.addEventListener('load', () => {
    setTimeout(() => {
        // Ouverture enveloppe
        preloader?.classList.add('open');
        // Suppression après la fin de la transition
        setTimeout(() => preloader?.classList.add('gone'), 1000);
    }, charsDuration);
});

// ============================================================
//  CURSEUR PRECISION SILK v2
//  • Anneau 30px : lerp 0.18
//  • Dot 6px     : quasi-instantané (lerp 0.65)
//  • mix-blend-mode: difference (CSS)
//  • Expand sur éléments interactifs
// ============================================================
const cursorOuter = document.getElementById('cursor-outer');
const cursorInner = document.getElementById('cursor-inner');
const hasPointer  = window.matchMedia('(hover: hover)').matches;

if (!hasPointer) {
    cursorOuter?.remove();
    cursorInner?.remove();
} else {
    let mx = window.innerWidth  / 2;
    let my = window.innerHeight / 2;

    // Positions lerp
    let ox = mx, oy = my; // outer (ring)
    let ix = mx, iy = my; // inner (dot)

    const LERP_OUTER = 0.18;
    const LERP_INNER = 0.65;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
    });

    function animateCursor() {
        ox += (mx - ox) * LERP_OUTER;
        oy += (my - oy) * LERP_OUTER;
        ix += (mx - ix) * LERP_INNER;
        iy += (my - iy) * LERP_INNER;

        if (cursorOuter) {
            cursorOuter.style.transform =
                `translate(calc(${ox}px - 50%), calc(${oy}px - 50%))`;
        }
        if (cursorInner) {
            cursorInner.style.transform =
                `translate(calc(${ix}px - 50%), calc(${iy}px - 50%))`;
        }

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Expand anneau sur éléments interactifs
    document.querySelectorAll('a, button, .project-link, .ctrl-btn').forEach(el => {
        el.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
    });
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
