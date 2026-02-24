// ================================================================
// BOOTSTRAP — tout le code s'exécute après le DOM complet
// ================================================================
document.addEventListener('DOMContentLoaded', () => {

// ================================================================
// FIREBASE — Compteur de vues en temps réel
// ================================================================
const firebaseConfig = {
    apiKey:      "AIzaSyCo84qaR5dUOWutGE4w3g-HjxAiNZLldpM",
    databaseURL: "https://sanobld-portfolio-default-rtdb.europe-west1.firebasedatabase.app",
    projectId:   "sanobld-portfolio"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ================================================================
// SYSTÈME BILINGUE (FR / EN)
// Toutes les chaînes de l'interface sont centralisées ici.
// ================================================================
const translations = {
    FR: {
        // Boutons de contrôle
        'btn-perf'         : 'PERF',
        'btn-mode'         : 'MODE',
        'btn-lang'         : 'EN',        // label = langue vers laquelle basculer
        'btn-perf-active'  : 'NORMAL',
        'btn-mode-light'   : 'SOMBRE',
        'btn-mode-dark'    : 'CLAIR',

        // Sections déroulantes
        'section-apps'     : '// APPLICATIONS',
        'section-games'    : '// JEUX',
        'section-about'    : '// À PROPOS',

        // Widget Calendrier
        'widget-calendar'  : 'Calendrier',
        'widget-time'      : 'Heure',
        'widget-event'     : 'Événement',
        'widget-event-none': 'Aucun',

        // Widget Infos système
        'widget-views'     : 'Vues',
        'widget-battery'   : 'Batterie',
        'widget-system'    : 'Système',
        'widget-resolution': 'Résolution',
        'widget-uptime'    : 'Uptime',
        'widget-lang'      : 'Langue',
        'widget-connection': 'Connexion',
        'widget-online'    : 'EN LIGNE',
        'widget-offline'   : 'HORS LIGNE',
        'widget-cpu'       : 'CPU',
        'widget-ram'       : 'RAM',

        // Météo — conditions WMO
        'weather-loading'       : 'chargement',
        'weather-sunny'         : 'ensoleillé',
        'weather-mostly-clear'  : 'peu nuageux',
        'weather-partly-cloudy' : 'partiellement nuageux',
        'weather-cloudy'        : 'nuageux',
        'weather-fog'           : 'brouillard',
        'weather-drizzle'       : 'bruine',
        'weather-rain'          : 'pluie',
        'weather-snow'          : 'neige',
        'weather-showers'       : 'averses',
        'weather-snow-showers'  : 'averses neigeuses',
        'weather-thunder'       : 'orage',
        'weather-unknown'       : 'inconnu',

        // Événements religieux / culturels
        'event-new-year'   : 'NOUVEL AN',
        'event-valentine'  : 'ST-VALENTIN',
        'event-halloween'  : 'HALLOWEEN',
        'event-christmas'  : 'NOËL',
        'event-new-years-eve': 'RÉVEILLON',
        'event-easter'     : 'PÂQUES',
        'event-lent'       : 'CARÊME',
        'event-ramadan'    : 'RAMADAN',
        'event-eid'        : 'AÏD AL-FITR',

        // À propos
        'about-body': `Interface personnelle minimaliste développée par passion pour le code et le design. Ce hub regroupe mes projets web créés pour le plaisir d'explorer de nouvelles technologies et affiner mes compétences en développement front-end. Inspiré par l'esthétique brute et épurée de <span class="dyn-txt">Nothing</span>, ce site combine typographie dot-matrix, animations canvas et effets interactifs.`,

        // Footer
        'footer': 'SANO BLD // 2025',
    },

    EN: {
        // Boutons de contrôle
        'btn-perf'         : 'PERF',
        'btn-mode'         : 'MODE',
        'btn-lang'         : 'FR',
        'btn-perf-active'  : 'NORMAL',
        'btn-mode-light'   : 'DARK',
        'btn-mode-dark'    : 'LIGHT',

        // Sections déroulantes
        'section-apps'     : '// APPLICATIONS',
        'section-games'    : '// GAMES',
        'section-about'    : '// ABOUT',

        // Widget Calendrier
        'widget-calendar'  : 'Calendar',
        'widget-time'      : 'Time',
        'widget-event'     : 'Event',
        'widget-event-none': 'None',

        // Widget Infos système
        'widget-views'     : 'Views',
        'widget-battery'   : 'Battery',
        'widget-system'    : 'System',
        'widget-resolution': 'Resolution',
        'widget-uptime'    : 'Uptime',
        'widget-lang'      : 'Language',
        'widget-connection': 'Connection',
        'widget-online'    : 'ONLINE',
        'widget-offline'   : 'OFFLINE',
        'widget-cpu'       : 'CPU',
        'widget-ram'       : 'RAM',

        // Météo — conditions WMO
        'weather-loading'       : 'loading',
        'weather-sunny'         : 'sunny',
        'weather-mostly-clear'  : 'mostly clear',
        'weather-partly-cloudy' : 'partly cloudy',
        'weather-cloudy'        : 'cloudy',
        'weather-fog'           : 'fog',
        'weather-drizzle'       : 'drizzle',
        'weather-rain'          : 'rain',
        'weather-snow'          : 'snow',
        'weather-showers'       : 'showers',
        'weather-snow-showers'  : 'snow showers',
        'weather-thunder'       : 'thunderstorm',
        'weather-unknown'       : 'unknown',

        // Événements religieux / culturels
        'event-new-year'   : "NEW YEAR'S DAY",
        'event-valentine'  : "VALENTINE'S DAY",
        'event-halloween'  : 'HALLOWEEN',
        'event-christmas'  : 'CHRISTMAS',
        'event-new-years-eve': "NEW YEAR'S EVE",
        'event-easter'     : 'EASTER',
        'event-lent'       : 'LENT',
        'event-ramadan'    : 'RAMADAN',
        'event-eid'        : 'EID AL-FITR',

        // À propos
        'about-body': `Minimalist personal interface built out of passion for code and design. This hub gathers my web projects, created for the joy of exploring new technologies and honing my front-end development skills. Inspired by the raw, stripped-back aesthetic of <span class="dyn-txt">Nothing</span>, the site blends dot-matrix typography, canvas animations, and interactive effects.`,

        // Footer
        'footer': 'SANO BLD // 2025',
    }
};

// Langue courante — restaurée depuis localStorage
let currentLang = localStorage.getItem('sano-lang') || 'FR';

// Raccourci de traduction
function t(key) {
    return (translations[currentLang] || translations.FR)[key] || key;
}

// Applique la langue à tous les éléments [data-i18n] + rafraîchit les états dynamiques
function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('sano-lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key === 'about-body') {
            el.innerHTML = t(key);
        } else {
            el.textContent = t(key);
        }
    });

    // Bouton langue affiche la langue OPPOSÉE
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) langBtn.textContent = t('btn-lang');

    // Synchronise les labels dynamiques des boutons thème/perf
    const perfBtn  = document.getElementById('perf-toggle');
    const themeBtn = document.getElementById('theme-toggle');
    if (perfBtn)  perfBtn.textContent  = performanceMode ? t('btn-perf-active') : t('btn-perf');
    if (themeBtn) themeBtn.textContent = document.body.classList.contains('light-mode')
        ? t('btn-mode-light') : t('btn-mode-dark');

    // Rafraîchit les labels des widgets date et info
    const dateLbl = document.getElementById('date-label');
    if (dateLbl) {
        const dateLabels = ['widget-calendar', 'widget-time', 'widget-event'];
        dateLbl.textContent = t(dateLabels[dateState] || 'widget-calendar');
    }
    applyInfoLabel();

    // Re-rendu du widget météo avec condition traduite
    if (lastWeatherData) renderWeatherWidget(lastWeatherData);
}

// ================================================================
// THÈME & PERSISTANCE DU MODE PERFORMANCE
// ================================================================
const body     = document.body;
const themeBtn = document.getElementById('theme-toggle');
const perfBtn  = document.getElementById('perf-toggle');
const langBtn  = document.getElementById('lang-toggle');

// ── Mode performance : restauré immédiatement depuis localStorage ──
let performanceMode = localStorage.getItem('sano-perf') === 'true';
if (performanceMode) body.classList.add('perf-mode');

// ── Thème : respecte la préférence système ──
const themeMediaQuery = window.matchMedia('(prefers-color-scheme: light)');
body.classList.toggle('light-mode', themeMediaQuery.matches);

// ── Handlers ──
perfBtn.onclick = () => {
    performanceMode = !performanceMode;
    localStorage.setItem('sano-perf', performanceMode);
    perfBtn.textContent = performanceMode ? t('btn-perf-active') : t('btn-perf');
    body.classList.toggle('perf-mode', performanceMode);
    playTick();
};

themeBtn.onclick = () => {
    body.classList.toggle('light-mode');
    themeBtn.textContent = body.classList.contains('light-mode')
        ? t('btn-mode-light') : t('btn-mode-dark');
    // Met à jour aussi la couleur de l'overlay si le scan est en cours
    const overlay = document.getElementById('scan-overlay');
    if (overlay) overlay.style.backgroundColor = getComputedStyle(body)
        .getPropertyValue('--bg-color').trim();
    playTick();
};

langBtn.onclick = () => {
    applyLang(currentLang === 'FR' ? 'EN' : 'FR');
    playTick();
};

// ================================================================
// PRÉLOADER
// ================================================================
const preloader = document.getElementById('preloader');

function hidePreloader() {
    preloader.classList.add('fade-out');
    setTimeout(() => {
        preloader.style.display = 'none';
        runScanAnimation();    // ← lance le scan après le preloader
    }, 580);
}

const preloaderMax = setTimeout(hidePreloader, 3000);
window.addEventListener('load', () => {
    clearTimeout(preloaderMax);
    setTimeout(hidePreloader, 280);
});

// ================================================================
// ANIMATION SCANNER FULL-PAGE — Logique corrigée
//
// Principe :
//   1. #scan-overlay couvre toute la page (fond plein = bg-color).
//   2. #scan-line descend de 0 → window.innerHeight (position:fixed).
//   3. L'overlay se "rogne" du haut : clip-path: inset(PROGRESS% 0 0 0)
//      où PROGRESS monte de 0 → 100, révélant le contenu par-dessous.
//   4. Quand la progression atteint 100%, l'overlay et la ligne sont masqués.
// ================================================================
function runScanAnimation() {
    const scanLine  = document.getElementById('scan-line');
    const overlay   = document.getElementById('scan-overlay');

    if (!scanLine || !overlay) return;

    // Assure que la couleur de l'overlay correspond au thème courant
    overlay.style.backgroundColor = getComputedStyle(body)
        .getPropertyValue('--bg-color').trim();

    const DURATION   = 1400;  // ms — durée totale du balayage
    const scanTravel = window.innerHeight; // distance parcourue (viewport, position:fixed)
    const startTS    = performance.now();

    // Rend la ligne visible
    scanLine.style.display = 'block';
    scanLine.style.transform = 'translateY(0px)';

    function tick(now) {
        const elapsed = now - startTS;
        const rawT    = Math.min(elapsed / DURATION, 1);

        // Easing easeInOutCubic pour un mouvement fluide et naturel
        const eased = rawT < 0.5
            ? 4 * rawT * rawT * rawT
            : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

        // Déplace la ligne de scan dans la viewport
        scanLine.style.transform = `translateY(${(eased * scanTravel).toFixed(1)}px)`;

        // Rogne l'overlay par le haut — de inset(0% ...) → inset(100% ...)
        // Ainsi, la zone AU-DESSUS de la ligne est révélée, celle EN-DESSOUS reste masquée
        overlay.style.clipPath = `inset(${(eased * 100).toFixed(2)}% 0 0 0)`;

        if (rawT < 1) {
            requestAnimationFrame(tick);
        } else {
            // ── Nettoyage final ──
            scanLine.style.display = 'none';
            overlay.style.display  = 'none';
            overlay.style.clipPath = '';
        }
    }

    requestAnimationFrame(tick);
}

// ================================================================
// TRANSITION WIDGET — Fade + slide style Nothing OS
// ================================================================
function transitionWidget(widgetEl, updateFn) {
    widgetEl.classList.add('widget-exit');
    setTimeout(() => {
        widgetEl.classList.remove('widget-exit');
        widgetEl.classList.add('widget-enter');
        updateFn();
        widgetEl.offsetHeight; // force reflow pour déclencher la transition CSS
        widgetEl.classList.remove('widget-enter');
    }, 140);
}

// ================================================================
// MÉTÉO — Open-Meteo (sans clé API)
// ================================================================

// Table de correspondance WMO code → icône + clé de traduction
const WMO_MAP = [
    { codes: [0],                  icon: '☀️',  key: 'weather-sunny'         },
    { codes: [1],                  icon: '🌤️', key: 'weather-mostly-clear'   },
    { codes: [2],                  icon: '⛅',  key: 'weather-partly-cloudy'  },
    { codes: [3],                  icon: '☁️',  key: 'weather-cloudy'         },
    { codes: [45, 48],             icon: '🌫️', key: 'weather-fog'            },
    { codes: [51, 53, 55, 56, 57], icon: '🌦️', key: 'weather-drizzle'        },
    { codes: [61, 63, 65, 66, 67], icon: '🌧️', key: 'weather-rain'           },
    { codes: [71, 73, 75, 77],     icon: '❄️',  key: 'weather-snow'           },
    { codes: [80, 81, 82],         icon: '🌦️', key: 'weather-showers'        },
    { codes: [85, 86],             icon: '❄️',  key: 'weather-snow-showers'   },
    { codes: [95, 96, 99],         icon: '⛈️',  key: 'weather-thunder'        },
];

function getWeatherMeta(code) {
    return WMO_MAP.find(w => w.codes.includes(code)) || { icon: '🌡️', key: 'weather-unknown' };
}

let lastWeatherData = null; // cache pour re-rendre lors d'un changement de langue

// Injecte les données dans le DOM du widget météo
function renderWeatherWidget(data) {
    if (!data) return;
    lastWeatherData = data;

    const iconEl = document.getElementById('ww-icon');
    const cityEl = document.getElementById('ww-city');
    const tempEl = document.getElementById('ww-temp');
    const condEl = document.getElementById('ww-cond');
    const widget = document.getElementById('weather-widget');

    if (iconEl) iconEl.textContent = data.icon;
    if (cityEl) cityEl.textContent = data.city || '—';
    if (tempEl) tempEl.textContent = `${data.temp}°C`;
    if (condEl) condEl.textContent = t(data.condKey);

    // Fade-in à l'apparition
    if (widget) widget.classList.add('loaded');
}

// Interroge Open-Meteo + Nominatim pour la géolocalisation inverse
async function doWeatherFetch(lat, lon) {
    const langCode = currentLang.toLowerCase();
    const [weatherRes, geoRes] = await Promise.allSettled([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`),
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=${langCode}`)
    ]);

    if (weatherRes.status !== 'fulfilled' || !weatherRes.value.ok) return null;

    const data = await weatherRes.value.json();
    const { temperature, weathercode } = data.current_weather;
    const meta = getWeatherMeta(weathercode);

    let city = '';
    if (geoRes.status === 'fulfilled' && geoRes.value.ok) {
        const geo = await geoRes.value.json();
        city = (geo?.address?.city
            || geo?.address?.town
            || geo?.address?.village
            || geo?.address?.municipality
            || '').toLowerCase();
    }

    return {
        icon:    meta.icon,
        temp:    Math.round(temperature),
        condKey: meta.key,
        city
    };
}

// Point d'entrée principal de la météo — géoloc → Paris par défaut
async function fetchWeatherData() {
    const PARIS = { lat: 48.8566, lon: 2.3522 };

    const handleResult = (result) => {
        if (result) renderWeatherWidget(result);
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const r = await doWeatherFetch(pos.coords.latitude, pos.coords.longitude);
                    handleResult(r || await doWeatherFetch(PARIS.lat, PARIS.lon).catch(() => null));
                } catch {
                    handleResult(await doWeatherFetch(PARIS.lat, PARIS.lon).catch(() => null));
                }
            },
            async () => { handleResult(await doWeatherFetch(PARIS.lat, PARIS.lon).catch(() => null)); },
            { timeout: 7000 }
        );
    } else {
        handleResult(await doWeatherFetch(PARIS.lat, PARIS.lon).catch(() => null));
    }
}

fetchWeatherData(); // pré-chargement dès le démarrage

// ================================================================
// CALCUL DES ÉVÉNEMENTS RELIGIEUX / CULTURELS
// ================================================================

// ── Algorithme de Meeus / Jones / Butcher pour le dimanche de Pâques ──
function getEaster(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day   = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

// ── Dates approchées du début du Ramadan par année ──
// (calendrier lunaire islamique, ~30 jours / mois)
const RAMADAN_START = {
    2024: new Date(2024, 2, 11),   // 11 mars 2024
    2025: new Date(2025, 2, 1),    // 1er mars 2025
    2026: new Date(2026, 1, 18),   // 18 fév 2026
    2027: new Date(2027, 1, 7),    // 7 fév 2027
    2028: new Date(2028, 0, 27),   // 27 jan 2028
};

// Renvoie les événements de l'année sous la forme { key, dateStart, dateEnd }
// dateEnd : null pour les événements ponctuels (même jour)
function buildYearEvents(year) {
    const events = [];

    // ── Événements fixes ──
    const fixedDays = [
        { month: 1,  day: 1,  key: 'event-new-year'    },
        { month: 2,  day: 14, key: 'event-valentine'   },
        { month: 10, day: 31, key: 'event-halloween'   },
        { month: 12, day: 25, key: 'event-christmas'   },
        { month: 12, day: 31, key: 'event-new-years-eve' },
    ];
    fixedDays.forEach(e => {
        const d = new Date(year, e.month - 1, e.day);
        events.push({ key: e.key, dateStart: d, dateEnd: d });
    });

    // ── Pâques (ponctuel) ──
    const easter = getEaster(year);
    events.push({ key: 'event-easter', dateStart: easter, dateEnd: easter });

    // ── Carême (période : Mercredi des Cendres → Samedi Saint = 46 jours avant Pâques → veille) ──
    const ashWed    = new Date(easter); ashWed.setDate(ashWed.getDate() - 46);
    const holySat   = new Date(easter); holySat.setDate(holySat.getDate() - 1);
    events.push({ key: 'event-lent', dateStart: ashWed, dateEnd: holySat });

    // ── Ramadan (période ~30 jours) ──
    const ramStart = RAMADAN_START[year];
    if (ramStart) {
        const ramEnd = new Date(ramStart); ramEnd.setDate(ramEnd.getDate() + 29);
        events.push({ key: 'event-ramadan', dateStart: ramStart, dateEnd: ramEnd });

        // Aïd al-Fitr = lendemain de la fin du Ramadan
        const eid = new Date(ramEnd); eid.setDate(eid.getDate() + 1);
        events.push({ key: 'event-eid', dateStart: eid, dateEnd: eid });
    }

    return events;
}

let dynamicHolidays = []; // jours fériés FR depuis l'API Nager.Date

async function fetchPublicHolidays() {
    try {
        const year = new Date().getFullYear();
        const res  = await fetch(`https://date.nager.at/api/v3/publicholidays/${year}/FR`);
        if (!res.ok) return;
        const holidays = await res.json();
        dynamicHolidays = holidays.map(h => {
            const d = new Date(h.date);
            return { month: d.getMonth() + 1, day: d.getDate(), name: h.localName.toUpperCase() };
        });
    } catch {
        console.info('[Sano] Jours fériés non chargés (réseau)');
    }
}
fetchPublicHolidays();

// Retourne la clé i18n de l'événement du jour, ou null
function getTodayEventKey() {
    const now        = new Date();
    const todayYear  = now.getFullYear();
    const todayMonth = now.getMonth() + 1;
    const todayDay   = now.getDate();

    // Normalise une date en entier YYYYMMDD pour comparaison
    const toInt = (d) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    const todayInt = toInt(now);

    // Cherche parmi les événements calculés (fixes + religieux)
    const yearEvents = buildYearEvents(todayYear);
    for (const evt of yearEvents) {
        const startInt = toInt(evt.dateStart);
        const endInt   = toInt(evt.dateEnd);
        if (todayInt >= startInt && todayInt <= endInt) return evt.key;
    }

    // Cherche parmi les jours fériés API
    const holiday = dynamicHolidays.find(h => h.month === todayMonth && h.day === todayDay);
    if (holiday) return null; // renvoie le nom directement via _todayHolidayName

    return null;
}

// Nom brut du jour férié API (si applicable)
function getTodayHolidayName() {
    const now  = new Date();
    const m    = now.getMonth() + 1;
    const d    = now.getDate();
    const h    = dynamicHolidays.find(h => h.month === m && h.day === d);
    return h ? h.name : null;
}

// Retourne la chaîne affichable pour le widget événement
function getTodayEventDisplay() {
    const key  = getTodayEventKey();
    if (key)   return t(key);
    const name = getTodayHolidayName();
    if (name)  return name;
    return t('widget-event-none');
}

// ================================================================
// WIDGET CALENDRIER — 3 états : Date → Heure → Événement
// ================================================================
let dateState      = 0;  // 0 = Date | 1 = Heure | 2 = Événement
let dateUserActive = false;
let dateAutoTimer  = null;

const dateEl  = document.getElementById('date-widget');
const dateVal = document.getElementById('date-val');
const dateLbl = document.getElementById('date-label');

const DATE_STATES = ['widget-calendar', 'widget-time', 'widget-event'];

function applyDateState() {
    const now = new Date();
    const locale = currentLang === 'EN' ? 'en-US' : 'fr-FR';

    switch (dateState) {
        case 1: // Heure
            dateVal.textContent = now.toLocaleTimeString(locale, {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
            break;
        case 2: // Événement du jour
            dateVal.textContent = getTodayEventDisplay();
            break;
        default: // Date
            const d = String(now.getDate()).padStart(2, '0');
            const m = String(now.getMonth() + 1).padStart(2, '0');
            const y = now.getFullYear().toString().slice(-2);
            dateVal.textContent = `${d}.${m}.${y}`;
    }
    dateLbl.textContent = t(DATE_STATES[dateState]);
}

function renderDate(withTransition = false) {
    withTransition
        ? transitionWidget(dateEl, applyDateState)
        : applyDateState();
}

// Rafraîchissement temps réel de l'heure
setInterval(() => { if (dateState === 1) applyDateState(); }, 1000);
renderDate();

// Auto-cycle toutes les 5 secondes (sauf si l'utilisateur a interagi)
function scheduleDateAuto() {
    clearInterval(dateAutoTimer);
    dateAutoTimer = setInterval(() => {
        if (!dateUserActive) {
            dateState = (dateState + 1) % 3;
            renderDate(true);
        }
    }, 5000);
}
scheduleDateAuto();

dateEl.onclick = () => {
    dateState = (dateState + 1) % 3;
    renderDate(true);
    playTick();
    dateUserActive = true;
    clearTimeout(dateEl._pauseTimeout);
    dateEl._pauseTimeout = setTimeout(() => { dateUserActive = false; }, 15000);
};

// ================================================================
// WIDGET INFOS SYSTÈME — 9 indicateurs en rotation
// ================================================================
const viewEl    = document.getElementById('view-widget');
const viewVal   = document.getElementById('view-val');
const viewLabel = document.getElementById('view-label');

let infoState      = 0;
let infoUserActive = false;
let infoAutoTimer  = null;
let v              = '...';
const startTime    = Date.now();

// Compteur Firebase — incrémente à chaque visite
async function fetchGlobalViews() {
    const viewRef = database.ref('total_views');
    viewRef.transaction(
        (current) => (current || 0) + 1,
        (error, committed, snapshot) => {
            if (committed) {
                v = snapshot.val();
                if (infoState === 0) viewVal.textContent = v;
            }
        }
    );
}
fetchGlobalViews();

// Applique le label traduit selon l'état courant
function applyInfoLabel() {
    const labels = [
        'widget-views', 'widget-battery', 'widget-system',
        'widget-resolution', 'widget-uptime', 'widget-lang',
        'widget-connection', 'widget-cpu', 'widget-ram'
    ];
    if (viewLabel) viewLabel.textContent = t(labels[infoState] || 'widget-views');
}

async function applyInfoState() {
    switch (infoState) {
        case 0:
            viewVal.textContent = v;
            viewLabel.textContent = t('widget-views');
            break;
        case 1: {
            let bat = 'N/A';
            if (navigator.getBattery) {
                const b = await navigator.getBattery();
                bat = Math.round(b.level * 100) + '%';
            }
            viewVal.textContent   = bat;
            viewLabel.textContent = t('widget-battery');
            break;
        }
        case 2:
            viewVal.textContent   = navigator.platform.substring(0, 8).toUpperCase();
            viewLabel.textContent = t('widget-system');
            break;
        case 3:
            viewVal.textContent   = `${window.screen.width}X${window.screen.height}`;
            viewLabel.textContent = t('widget-resolution');
            break;
        case 4: {
            const secs    = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(secs / 60);
            const seconds = secs % 60;
            viewVal.textContent   = `${minutes}:${String(seconds).padStart(2, '0')}`;
            viewLabel.textContent = t('widget-uptime');
            break;
        }
        case 5:
            viewVal.textContent   = navigator.language.toUpperCase().substring(0, 5);
            viewLabel.textContent = t('widget-lang');
            break;
        case 6:
            viewVal.textContent   = navigator.onLine ? t('widget-online') : t('widget-offline');
            viewLabel.textContent = t('widget-connection');
            break;
        case 7:
            viewVal.textContent   = (navigator.hardwareConcurrency || 'N/A') + ' CORES';
            viewLabel.textContent = t('widget-cpu');
            break;
        case 8:
            viewVal.textContent   = (navigator.deviceMemory || 'N/A') + ' GB';
            viewLabel.textContent = t('widget-ram');
            break;
    }
}

function updateInfoDisplay(withTransition = false) {
    withTransition
        ? transitionWidget(viewEl, applyInfoState)
        : applyInfoState();
}

setInterval(() => { if (infoState === 4) applyInfoState(); }, 1000);

function scheduleInfoAuto() {
    clearInterval(infoAutoTimer);
    infoAutoTimer = setInterval(() => {
        if (!infoUserActive) {
            infoState = (infoState + 1) % 9;
            updateInfoDisplay(true);
        }
    }, 5000);
}
scheduleInfoAuto();

viewEl.onclick = () => {
    playTick();
    infoState = (infoState + 1) % 9;
    updateInfoDisplay(true);
    infoUserActive = true;
    clearTimeout(viewEl._pauseTimeout);
    viewEl._pauseTimeout = setTimeout(() => { infoUserActive = false; }, 15000);
};

// ================================================================
// AUDIO — son subtil de tick
// ================================================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTick() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.frequency.setValueAtTime(180, audioCtx.currentTime);
    g.gain.setValueAtTime(0.02, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + 0.04);
}

// ================================================================
// CURSEUR PERSONNALISÉ — suivi souris + squeeze au clic
// ================================================================
const cursor = document.getElementById('cursor-dot');
const title  = document.getElementById('main-title');
let mouse = { x: -1000, y: -1000 };

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top  = `${e.clientY}px`;

    // Effet de révélation du titre au survol
    const r = title.getBoundingClientRect();
    title.style.setProperty('--m-x', `${e.clientX - r.left}px`);
    title.style.setProperty('--m-y', `${e.clientY - r.top}px`);
});

document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));

document.querySelectorAll('.active-fx').forEach(el => {
    el.onmouseenter = () => {
        cursor.classList.add('hover');
        playTick();
        el.dataset.hovered = 'true';
    };
    el.onmouseleave = () => {
        cursor.classList.remove('hover');
        el.dataset.hovered = 'false';
    };
});

// ================================================================
// SECTIONS DÉROULANTES — toggle + son
// ================================================================
document.querySelectorAll('.toggle-box').forEach(box => {
    box.onclick = function(e) {
        if (e.target.tagName === 'A') return;
        this.classList.toggle('open');
        playTick();
    };
});

// ================================================================
// PARTICULES — fond dynamique réactif à la souris
// ================================================================
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function initCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    particles     = [];
    for (let x = 12; x < canvas.width;  x += 24) {
        for (let y = 12; y < canvas.height; y += 24) {
            particles.push({ x, y, bx: x, by: y });
        }
    }
}

function animate() {
    // Mode performance : canvas vide = pas de particules
    if (performanceMode) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        requestAnimationFrame(animate);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLight   = body.classList.contains('light-mode');
    const colorMain = isLight ? 'rgba(0,0,0,0.8)'       : 'rgba(255,255,255,0.8)';
    const colorInv  = isLight ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';

    particles.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d  = Math.sqrt(dx * dx + dy * dy);

        if (d < 70) {
            // Répulsion magnétique
            p.x -= dx / d * (70 - d) / 5;
            p.y -= dy / d * (70 - d) / 5;
        } else {
            // Retour à la position d'origine
            p.x += (p.bx - p.x) * 0.1;
            p.y += (p.by - p.y) * 0.1;
        }

        // Inversion de couleur à l'intérieur d'un élément survolé
        let finalColor = colorMain;
        document.querySelectorAll('.active-fx').forEach(el => {
            if (el.dataset.hovered === 'true') {
                const r = el.getBoundingClientRect();
                if (p.x > r.left && p.x < r.right && p.y > r.top && p.y < r.bottom) {
                    finalColor = colorInv;
                }
            }
        });

        ctx.fillStyle = finalColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.9, 0, 7);
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

window.onresize = initCanvas;
initCanvas();
animate();

// ================================================================
// INIT LANGUE — appelé en dernier, après toutes les déclarations
// ================================================================
applyLang(currentLang);

// ================================================================
// FIN DOMContentLoaded
// ================================================================
});
