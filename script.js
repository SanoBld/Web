// ============================================================
//  SANO BLD — Galerie Monolithique
//  script.js
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

// ============================================================
//  PROJETS — Source de vérité unique
// ============================================================
const PROJECTS = [
    // 01–06 · Applications
    { name: 'Unitix',        tag: 'App',  cat: 'apps', url: 'https://sanobld.github.io/Unitix/'       },
    { name: 'Eco Drive',     tag: 'App',  cat: 'apps', url: 'https://sanobld.github.io/Eco-Drive/'    },
    { name: 'So Bohème',     tag: 'Web',  cat: 'apps', url: 'https://soboheme.github.io/Web/'         },
    { name: 'Metrolist',     tag: 'App',  cat: 'apps', url: 'https://mostafaalagamy.github.io/'       },
    { name: 'BioLink Maker', tag: 'Tool', cat: 'apps', url: 'https://sanobld.github.io/BioLinkMaker/' },
    { name: 'LastStats',     tag: 'PWA',  cat: 'apps', url: 'https://sanobld.github.io/LastStats/'    },
    // 07–10 · Jeux
    { name: 'Glide',         tag: 'Game', cat: 'games', url: 'https://sanobld.github.io/Glide/'         },
    { name: 'Survivor.io',   tag: 'Game', cat: 'games', url: 'https://sanobld.github.io/Survivor.io/'   },
    { name: 'Tic Tac Boom',  tag: 'Game', cat: 'games', url: 'https://sanobld.github.io/Tic-Tac-Boom/' },
    { name: 'Cards',         tag: 'Game', cat: 'games', url: 'https://sanobld.github.io/Cards/'         },
    // 11–14 · Réseau
    { name: 'Twitter',       tag: '𝕏',    cat: 'network', url: 'https://x.com/SanoBld'                 },
    { name: 'Reddit',        tag: 'R/',   cat: 'network', url: 'https://www.reddit.com/user/Sano_bld/' },
    { name: 'GitHub',        tag: '⌥',    cat: 'network', url: 'https://github.com/SanoBld'            },
    { name: 'Discord',       tag: '#',    cat: 'network', url: 'https://discord.gg/nothingtech'        },
];

const TOTAL = PROJECTS.length; // 14

// Libellés catégories par langue
const CAT_LABELS = {
    fr: { apps: 'Applications', games: 'Jeux',  network: 'Réseau'   },
    en: { apps: 'Applications', games: 'Games', network: 'Network'  },
};

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
    const el = document.getElementById('hud-views');
    if (el) el.textContent = (snap.val() ?? 0).toLocaleString() + ' vues';
});

// ============================================================
//  GÉNÉRATION DES SLIDES
// ============================================================
const scene = document.getElementById('scene');

PROJECTS.forEach((proj, i) => {
    const slide   = document.createElement('div');
    slide.className = 'slide';
    slide.id        = `slide-${i}`;
    slide.setAttribute('data-index', i);
    slide.setAttribute('data-cat', proj.cat);

    // .slide-content → reçoit translateY + scale + blur (scroll JS)
    const content = document.createElement('div');
    content.className = 'slide-content';

    // .slide-tilt → fournit la perspective pour le tilt du titre
    const tilt  = document.createElement('div');
    tilt.className = 'slide-tilt';

    const link  = document.createElement('a');
    link.href          = proj.url;
    link.target        = '_blank';
    link.rel           = 'noopener noreferrer';
    link.className     = 'slide-link';
    link.setAttribute('aria-label', `Voir ${proj.name}`);

    const title = document.createElement('h2');
    title.className = 'slide-title';
    title.textContent = proj.name;

    const tag   = document.createElement('span');
    tag.className   = 'slide-tag';
    tag.textContent = proj.tag;

    const rule  = document.createElement('div');
    rule.className = 'slide-rule';

    link.appendChild(title);
    link.appendChild(tag);
    tilt.appendChild(link);
    content.appendChild(tilt);
    slide.appendChild(content);
    slide.appendChild(rule);
    scene.appendChild(slide);
});

// Références pré-calculées pour la perf
const allSlides   = [...document.querySelectorAll('.slide')];
const allContents = [...document.querySelectorAll('.slide-content')];
const allTitles   = [...document.querySelectorAll('.slide-title')];
const allTags     = [...document.querySelectorAll('.slide-tag')];

let currentIndex = 0;
let vh = window.innerHeight;

// ============================================================
//  SCROLL PARALLAXE — boucle rAF
//
//  progress = 0 → slide centré dans le viewport
//  progress > 0 → slide en dessous (titre monte en entrant)
//  progress < 0 → slide au-dessus (titre monte en sortant)
//
//  La formule translateY(progress * PARALLAX_PX) crée
//  naturellement l'effet "monte depuis le bas, sort par le haut".
// ============================================================
const PARALLAX_RATIO = 0.30; // 30% de vh de décalage pour ±1 slide
let   rafScrollId    = null;
let   nextActiveIndex = 0;

function updateSlides() {
    const scrollTop = scene.scrollTop;
    let   minDist   = Infinity;
    nextActiveIndex = currentIndex;

    allSlides.forEach((slide, i) => {
        // progress : 0 = centré, ±1 = ±1 slide hors centre
        const progress = (i * vh - scrollTop) / vh;
        const absProg  = Math.abs(progress);

        // Ignorer les slides très éloignées (opt. perf.)
        if (absProg > 2.5) {
            allContents[i].style.opacity   = '0';
            allContents[i].style.transform = '';
            allContents[i].style.filter    = '';
            allTags[i].style.opacity       = '0';
            return;
        }

        // Suivre le plus proche du centre
        if (absProg < minDist) { minDist = absProg; nextActiveIndex = i; }

        // ── Parallaxe vertical du titre ──
        const parallaxPx = progress * vh * PARALLAX_RATIO;

        // ── Réduction d'échelle ──
        const scale = Math.max(0.76, 1 - Math.min(absProg, 1) * 0.24);

        // ── Opacité ──
        const opacity = Math.max(0, 1 - absProg * 1.6);

        // ── Flou ──
        const blur = absProg < 0.08 ? 0 : Math.min(7, absProg * 5.5);

        // ── Opacité du tag (disparaît plus vite) ──
        const tagOpacity = Math.max(0, 1 - absProg * 4.0);

        // Application directe (pas de transition CSS — rAF assure la fluidité)
        allContents[i].style.transform = `translateY(${parallaxPx.toFixed(1)}px) scale(${scale.toFixed(4)})`;
        allContents[i].style.opacity   = opacity.toFixed(4);
        allContents[i].style.filter    = blur > 0.05
            ? `blur(${blur.toFixed(2)}px)`
            : 'none';
        allTags[i].style.opacity = tagOpacity.toFixed(4);

        // Marquage actif
        const wasActive = slide.classList.contains('active');
        const isActive  = absProg < 0.38;

        if (isActive !== wasActive) {
            slide.classList.toggle('active', isActive);
            if (!isActive) {
                // Effacer le tilt résiduel sur les slides inactives
                allTitles[i].style.transform = '';
            }
        }
    });

    // Mise à jour de l'index HUD si le projet centré a changé
    if (nextActiveIndex !== currentIndex) {
        currentIndex = nextActiveIndex;
        updateIndexHUD();
    }

    rafScrollId = null;
}

function scheduleScrollUpdate() {
    if (!rafScrollId) {
        rafScrollId = requestAnimationFrame(updateSlides);
    }
}

scene.addEventListener('scroll', scheduleScrollUpdate, { passive: true });

// Rendu initial
updateSlides();

// ============================================================
//  INDEX HUD — [01 // 14] · Catégorie
// ============================================================
const hudIndexEl = document.getElementById('hud-index');

function updateIndexHUD() {
    if (!hudIndexEl) return;
    const n       = String(currentIndex + 1).padStart(2, '0');
    const t       = String(TOTAL).padStart(2, '0');
    const cat     = PROJECTS[currentIndex].cat;
    const catName = CAT_LABELS[currentLang]?.[cat] || cat;
    hudIndexEl.innerHTML =
        `[${n}&thinsp;&#47;&#47;&thinsp;${t}]<span class="hud-cat"> · ${catName}</span>`;
}

// ============================================================
//  TILT 3D — Profondeur cinétique sur le titre actif
//
//  Perspective : 1000px (CSS sur .slide-tilt)
//  Rotation max : 8° — plus accentuée que l'ancienne version
//  LERP : 0.07 — inertie longue et luxueuse
// ============================================================
const hasHover  = window.matchMedia('(hover: hover)').matches;

let tiltTargetRX = 0, tiltTargetRY = 0;
let tiltCurrentRX = 0, tiltCurrentRY = 0;
let tiltRafId    = null;

const MAX_ROT   = 8;
const LERP_TILT = 0.07;

function animateTilt() {
    tiltCurrentRX += (tiltTargetRX - tiltCurrentRX) * LERP_TILT;
    tiltCurrentRY += (tiltTargetRY - tiltCurrentRY) * LERP_TILT;

    // Appliquer uniquement sur le titre du slide actif
    const activeTitle = allSlides[currentIndex]?.querySelector('.slide-title');
    if (activeTitle) {
        activeTitle.style.transform =
            `rotateX(${tiltCurrentRX.toFixed(3)}deg) rotateY(${tiltCurrentRY.toFixed(3)}deg)`;
    }

    const delta = Math.abs(tiltTargetRX - tiltCurrentRX) + Math.abs(tiltTargetRY - tiltCurrentRY);
    if (delta > 0.004) {
        tiltRafId = requestAnimationFrame(animateTilt);
    } else {
        tiltRafId = null;
    }
}

if (hasHover) {
    document.addEventListener('mousemove', e => {
        // Normalisation : −1 → +1 sur chaque axe
        const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;

        tiltTargetRX = -ny * MAX_ROT; // souris en haut → titre penche vers viewer
        tiltTargetRY =  nx * MAX_ROT;

        if (!tiltRafId) tiltRafId = requestAnimationFrame(animateTilt);
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        tiltTargetRX = 0;
        tiltTargetRY = 0;
        if (!tiltRafId) tiltRafId = requestAnimationFrame(animateTilt);
    });
}

// ============================================================
//  CURSEUR GHOST
//  Lerp 0.22 pour une réactivité immédiate mais douce.
//  Expand sur le titre du slide actif → "VOIR LE PROJET"
// ============================================================
const cursorGhost = document.getElementById('cursor-ghost');

if (hasHover && cursorGhost) {
    let ghostMX = window.innerWidth  / 2;
    let ghostMY = window.innerHeight / 2;
    let ghostCX = ghostMX;
    let ghostCY = ghostMY;
    const LERP_CURSOR = 0.22;
    let isExpanded = false;

    // Boucle permanente — très peu coûteuse (juste un style.transform)
    function animateCursor() {
        ghostCX += (ghostMX - ghostCX) * LERP_CURSOR;
        ghostCY += (ghostMY - ghostCY) * LERP_CURSOR;
        cursorGhost.style.transform =
            `translate(${ghostCX.toFixed(1)}px, ${ghostCY.toFixed(1)}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    document.addEventListener('mousemove', e => {
        ghostMX = e.clientX;
        ghostMY = e.clientY;
    }, { passive: true });

    // Expand : uniquement sur le titre du slide actif
    document.addEventListener('mouseover', e => {
        if (isExpanded) return;
        const t = e.target.closest('.slide-title');
        if (t && t.closest('.slide')?.classList.contains('active')) {
            isExpanded = true;
            cursorGhost.classList.add('expand');
        }
    });

    document.addEventListener('mouseout', e => {
        if (!isExpanded) return;
        const t = e.target.closest('.slide-title');
        if (t) {
            isExpanded = false;
            cursorGhost.classList.remove('expand');
        }
    });
}

// ============================================================
//  THÈME
//  Fond : transition 1.5s (CSS sur body)
//  Texte : instantané (pas de transition color sur les éléments)
// ============================================================
const body     = document.body;
const themeBtn = document.getElementById('theme-toggle');

function detectTheme() {
    const saved = localStorage.getItem('sb-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

let currentTheme = detectTheme();

function applyTheme(t) {
    currentTheme = t;
    body.classList.toggle('dark', t === 'dark');
    if (themeBtn) themeBtn.textContent = t === 'dark' ? '◑' : '◐';
    localStorage.setItem('sb-theme', t);
}

// Premier appel sans attendre → évite le flash
applyTheme(currentTheme);

themeBtn?.addEventListener('click', () =>
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark'));

// ============================================================
//  LANGUE
// ============================================================
let currentLang = localStorage.getItem('sb-lang')
    || (navigator.language?.startsWith('en') ? 'en' : 'fr');

const langBtn = document.getElementById('lang-toggle');

function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    if (langBtn) langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
    localStorage.setItem('sb-lang', lang);
    // Mettre à jour le compteur de vues label
    updateViewsLabel();
    // Mettre à jour l'index (nom de catégorie)
    updateIndexHUD();
}

applyLang(currentLang);

langBtn?.addEventListener('click', () =>
    applyLang(currentLang === 'fr' ? 'en' : 'fr'));

function updateViewsLabel() {
    // On conserve juste le nombre existant et on remet le bon suffixe
    const el = document.getElementById('hud-views');
    if (!el || el.textContent === '—') return;
    const num = el.textContent.replace(/[^\d]/g, '');
    if (num) {
        const suffix = currentLang === 'fr' ? ' vues' : ' views';
        el.textContent = parseInt(num, 10).toLocaleString() + suffix;
    }
}

// ============================================================
//  PRELOADER (identique au précédent — split-text)
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
        span.className   = 'char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.animationDelay = `${i * CHAR_DELAY}s`;
        el.appendChild(span);
    });
}

document.fonts.ready.then(() => {
    injectChars(preTextTop);
    injectChars(preTextBot);
});

const charsDuration = WORD.length * CHAR_DELAY * 1000 + 700; // ≈ 1116 ms

window.addEventListener('load', () => {
    setTimeout(() => {
        preloader?.classList.add('open');

        // Révéler le HUD une fois le preloader terminé
        setTimeout(() => {
            preloader?.classList.add('gone');
            document.querySelectorAll('.hud').forEach(h => h.classList.add('ready'));
        }, 1050);

    }, charsDuration);
});

// ============================================================
//  HORLOGE
// ============================================================
function updateClock() {
    const el = document.getElementById('hud-time');
    if (!el) return;
    const now = new Date();
    const pad = v => String(v).padStart(2, '0');
    el.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
setInterval(updateClock, 1000);
updateClock();

// ============================================================
//  RESIZE — recalcul de vh
// ============================================================
window.addEventListener('resize', () => {
    vh = window.innerHeight;
    scheduleScrollUpdate();
}, { passive: true });

});
