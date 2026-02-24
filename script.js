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
// ================================================================
const translations = {
    FR: {
        // Boutons de contrôle
        'btn-perf'         : 'PERF',
        'btn-mode'         : 'MODE',
        'btn-lang'         : 'EN',
        'btn-perf-active'  : 'NORMAL',
        'btn-mode-light'   : 'SOMBRE',
        'btn-mode-dark'    : 'CLAIR',

        // Sections déroulantes
        'section-apps'     : '// APPLICATIONS',
        'section-games'    : '// JEUX',
        'section-about'    : '// À PROPOS',

        // Widget Calendrier
        'widget-calendar'       : 'Calendrier',
        'widget-time'           : 'Heure',
        'widget-event'          : 'Événement',
        'widget-event-fmt'      : 'Événement %i/%n',   // %i = index, %n = total
        'widget-event-none'     : 'Aucun',

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

        // ── Événements fixes ──
        'event-new-year'        : 'NOUVEL AN',
        'event-new-years-eve'   : 'RÉVEILLON',
        'event-valentine'       : 'ST-VALENTIN',
        'event-halloween'       : 'HALLOWEEN',
        'event-christmas'       : 'NOËL',
        'event-christmas-eve'   : 'VEILLE DE NOËL',

        // ── Événements calculés à partir de Pâques ──
        'event-mardi-gras'      : 'MARDI GRAS',
        'event-lent'            : 'CARÊME',
        'event-palm-sunday'     : 'DIMANCHE DES RAMEAUX',
        'event-holy-week'       : 'SEMAINE SAINTE',
        'event-good-friday'     : 'VENDREDI SAINT',
        'event-easter'          : 'PÂQUES',
        'event-ascension'       : 'ASCENSION',
        'event-pentecost'       : 'PENTECÔTE',

        // ── Événements islamiques ──
        'event-ramadan'         : 'RAMADAN',
        'event-eid-al-fitr'     : 'AÏD AL-FITR',
        'event-eid-al-adha'     : 'AÏD AL-ADHA',

        // ── Événements juifs ──
        'event-hanukkah'        : 'HANOUKKA',
        'event-rosh-hashana'    : 'ROSH HASHANA',
        'event-yom-kippur'      : 'YOM KIPPOUR',

    // À propos
    'about-body': `Mes premiers pas dans le code web, inspirés par l'esthétique <span class="dyn-txt">Nothing</span>.`,

    // Footer
    'footer': 'SANO BLD // 2026',
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
        'widget-calendar'       : 'Calendar',
        'widget-time'           : 'Time',
        'widget-event'          : 'Event',
        'widget-event-fmt'      : 'Event %i/%n',
        'widget-event-none'     : 'None',

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

        // ── Événements fixes ──
        'event-new-year'        : "NEW YEAR'S DAY",
        'event-new-years-eve'   : "NEW YEAR'S EVE",
        'event-valentine'       : "VALENTINE'S DAY",
        'event-halloween'       : 'HALLOWEEN',
        'event-christmas'       : 'CHRISTMAS DAY',
        'event-christmas-eve'   : 'CHRISTMAS EVE',

        // ── Événements calculés à partir de Pâques ──
        'event-mardi-gras'      : 'MARDI GRAS',
        'event-lent'            : 'LENT',
        'event-palm-sunday'     : 'PALM SUNDAY',
        'event-holy-week'       : 'HOLY WEEK',
        'event-good-friday'     : 'GOOD FRIDAY',
        'event-easter'          : 'EASTER',
        'event-ascension'       : 'ASCENSION',
        'event-pentecost'       : "PENTECOST",

        // ── Événements islamiques ──
        'event-ramadan'         : 'RAMADAN',
        'event-eid-al-fitr'     : 'EID AL-FITR',
        'event-eid-al-adha'     : 'EID AL-ADHA',

        // ── Événements juifs ──
        'event-hanukkah'        : 'HANUKKAH',
        'event-rosh-hashana'    : 'ROSH HASHANA',
        'event-yom-kippur'      : 'YOM KIPPUR',

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

    // Recharge le cache d'événements (les labels sont traduits)
    refreshTodayEvents();

    // Rafraîchit le label du widget date avec le nouvel état courant
    const dateLbl = document.getElementById('date-label');
    if (dateLbl) dateLbl.textContent = getDateLabel();

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
        runScanAnimation();
    }, 580);
}

const preloaderMax = setTimeout(hidePreloader, 3000);
window.addEventListener('load', () => {
    clearTimeout(preloaderMax);
    setTimeout(hidePreloader, 280);
});

// ================================================================
// ANIMATION SCANNER FULL-PAGE
// ================================================================
function runScanAnimation() {
    const scanLine = document.getElementById('scan-line');
    const overlay  = document.getElementById('scan-overlay');
    if (!scanLine || !overlay) return;

    overlay.style.backgroundColor = getComputedStyle(body)
        .getPropertyValue('--bg-color').trim();

    const DURATION   = 1400;
    const scanTravel = window.innerHeight;
    const startTS    = performance.now();

    scanLine.style.display   = 'block';
    scanLine.style.transform = 'translateY(0px)';

    function tick(now) {
        const elapsed = now - startTS;
        const rawT    = Math.min(elapsed / DURATION, 1);
        const eased   = rawT < 0.5
            ? 4 * rawT * rawT * rawT
            : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

        scanLine.style.transform = `translateY(${(eased * scanTravel).toFixed(1)}px)`;
        overlay.style.clipPath   = `inset(${(eased * 100).toFixed(2)}% 0 0 0)`;

        if (rawT < 1) {
            requestAnimationFrame(tick);
        } else {
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
        widgetEl.offsetHeight; // force reflow
        widgetEl.classList.remove('widget-enter');
    }, 140);
}

// ================================================================
// MÉTÉO — Open-Meteo (sans clé API)
// ================================================================
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

let lastWeatherData = null;

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
    if (widget) widget.classList.add('loaded');
}

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

    return { icon: meta.icon, temp: Math.round(temperature), condKey: meta.key, city };
}

async function fetchWeatherData() {
    const PARIS = { lat: 48.8566, lon: 2.3522 };
    const handleResult = (r) => { if (r) renderWeatherWidget(r); };

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
fetchWeatherData();

// ================================================================
// CALCUL DES ÉVÉNEMENTS RELIGIEUX & CULTURELS
// ================================================================

// ── Aide : normalise une Date en entier YYYYMMDD pour comparaison sans heure ──
function dateToInt(d) {
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

// ── Aide : crée une Date décalée de N jours par rapport à une référence ──
function offsetDate(base, offsetDays) {
    const d = new Date(base);
    d.setDate(d.getDate() + offsetDays);
    return d;
}

// ── Algorithme de Meeus / Jones / Butcher — Dimanche de Pâques exact ──
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

// ── Dates exactes du début du Ramadan (calendrier lunaire, données ISNA / IFR) ──
// Ces dates sont les débuts officiels du croissant de lune pour l'Europe occidentale.
const RAMADAN_START = {
    2024: new Date(2024,  2, 11),  // 11 mars 2024
    2025: new Date(2025,  2,  1),  // 1er mars 2025
    2026: new Date(2026,  1, 18),  // 18 fév 2026
    2027: new Date(2027,  1,  7),  // 7 fév 2027
    2028: new Date(2028,  0, 27),  // 27 jan 2028
    2029: new Date(2029,  0, 15),  // 15 jan 2029
    2030: new Date(2030,  0,  5),  // 5 jan 2030
};

// ── Aïd al-Adha — 70 jours après l'Aïd al-Fitr (approximation courante) ──
// Basé sur le calendrier de l'UOIF / sources islamiques européennes.
const EID_ADHA_START = {
    2024: new Date(2024,  5, 17),  // 17 juin 2024
    2025: new Date(2025,  5,  6),  // 6 juin 2025
    2026: new Date(2026,  4, 27),  // 27 mai 2026
    2027: new Date(2027,  4, 17),  // 17 mai 2027
    2028: new Date(2028,  4,  5),  // 5 mai 2028
    2029: new Date(2029,  3, 24),  // 24 avr 2029
    2030: new Date(2030,  3, 14),  // 14 avr 2030
};

// ── Hanoukka — 25 Kislev (calendrier hébreu), données précalculées ──
const HANUKKAH_START = {
    2024: new Date(2024, 11, 26),  // 26 déc 2024
    2025: new Date(2025, 11, 15),  // 15 déc 2025
    2026: new Date(2026, 11,  5),  // 5 déc 2026
    2027: new Date(2027, 11, 25),  // 25 déc 2027
    2028: new Date(2028, 11, 12),  // 12 déc 2028
    2029: new Date(2029, 11,  1),  // 1 déc 2029
    2030: new Date(2030, 10, 21),  // 21 nov 2030
};

// ── Rosh Hashana — 1 Tishri (calendrier hébreu), données précalculées ──
const ROSH_HASHANA_START = {
    2024: new Date(2024,  9,  3),  // 3 oct 2024
    2025: new Date(2025,  8, 23),  // 23 sep 2025
    2026: new Date(2026,  8, 12),  // 12 sep 2026
    2027: new Date(2027,  9,  2),  // 2 oct 2027
    2028: new Date(2028,  8, 21),  // 21 sep 2028
    2029: new Date(2029,  8, 10),  // 10 sep 2029
    2030: new Date(2030,  8, 29),  // 29 sep 2030
};

// ── Yom Kippour — 10 Tishri = Rosh Hashana + 9 jours ──

// ================================================================
// buildYearEvents(year)
//
// Retourne TOUS les événements de l'année sous la forme :
//   { key: string, dateStart: Date, dateEnd: Date }
//
// Un événement à durée = 0 a dateStart === dateEnd.
// Les périodes ont une plage dateStart → dateEnd.
// ================================================================
function buildYearEvents(year) {
    const events = [];

    // ── Événements civils & culturels fixes ──
    const fixedDays = [
        { month: 1,  day:  1,  key: 'event-new-year'      },
        { month: 2,  day: 14,  key: 'event-valentine'     },
        { month: 10, day: 31,  key: 'event-halloween'     },
        { month: 12, day: 24,  key: 'event-christmas-eve' },
        { month: 12, day: 25,  key: 'event-christmas'     },
        { month: 12, day: 31,  key: 'event-new-years-eve' },
    ];
    fixedDays.forEach(({ month, day, key }) => {
        const d = new Date(year, month - 1, day);
        events.push({ key, dateStart: d, dateEnd: d });
    });

    // ── Événements mobiles dérivés de Pâques ──
    const easter = getEaster(year);

    // Mardi Gras = 47 jours avant Pâques (Mardi avant le Mercredi des Cendres)
    events.push({
        key:       'event-mardi-gras',
        dateStart: offsetDate(easter, -47),
        dateEnd:   offsetDate(easter, -47),
    });

    // Carême = Mercredi des Cendres (-46j) → Samedi Saint (-1j)
    events.push({
        key:       'event-lent',
        dateStart: offsetDate(easter, -46),
        dateEnd:   offsetDate(easter, -1),
    });

    // Dimanche des Rameaux = -7j
    events.push({
        key:       'event-palm-sunday',
        dateStart: offsetDate(easter, -7),
        dateEnd:   offsetDate(easter, -7),
    });

    // Semaine Sainte = Lundi Saint (-6j) → Samedi Saint (-1j)
    events.push({
        key:       'event-holy-week',
        dateStart: offsetDate(easter, -6),
        dateEnd:   offsetDate(easter, -1),
    });

    // Vendredi Saint = -2j
    events.push({
        key:       'event-good-friday',
        dateStart: offsetDate(easter, -2),
        dateEnd:   offsetDate(easter, -2),
    });

    // Pâques = dimanche exact
    events.push({
        key:       'event-easter',
        dateStart: easter,
        dateEnd:   easter,
    });

    // Ascension = +39j (jeudi, 40ème jour après Pâques)
    events.push({
        key:       'event-ascension',
        dateStart: offsetDate(easter, 39),
        dateEnd:   offsetDate(easter, 39),
    });

    // Pentecôte = +49j (dimanche, 50ème jour)
    events.push({
        key:       'event-pentecost',
        dateStart: offsetDate(easter, 49),
        dateEnd:   offsetDate(easter, 49),
    });

    // ── Ramadan (durée 30 jours) ──
    const ramStart = RAMADAN_START[year];
    if (ramStart) {
        const ramEnd = offsetDate(ramStart, 29); // 30 jours inclus
        events.push({ key: 'event-ramadan', dateStart: ramStart, dateEnd: ramEnd });

        // Aïd al-Fitr = lendemain de la fin du Ramadan (1 jour)
        const eidFitr = offsetDate(ramEnd, 1);
        events.push({ key: 'event-eid-al-fitr', dateStart: eidFitr, dateEnd: eidFitr });
    }

    // ── Aïd al-Adha (2 jours de fête) ──
    const eidAdha = EID_ADHA_START[year];
    if (eidAdha) {
        events.push({ key: 'event-eid-al-adha', dateStart: eidAdha, dateEnd: offsetDate(eidAdha, 1) });
    }

    // ── Hanoukka (8 nuits) ──
    const hanStart = HANUKKAH_START[year];
    if (hanStart) {
        events.push({ key: 'event-hanukkah', dateStart: hanStart, dateEnd: offsetDate(hanStart, 7) });
    }

    // ── Rosh Hashana (2 jours) ──
    const roshStart = ROSH_HASHANA_START[year];
    if (roshStart) {
        events.push({ key: 'event-rosh-hashana', dateStart: roshStart, dateEnd: offsetDate(roshStart, 1) });

        // Yom Kippour = Rosh Hashana + 9j
        const yom = offsetDate(roshStart, 9);
        events.push({ key: 'event-yom-kippur', dateStart: yom, dateEnd: yom });
    }

    return events;
}

// Jours fériés officiels chargés depuis l'API Nager.Date
let dynamicHolidays = [];

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
        // Rafraîchit le cache d'événements une fois les jours fériés chargés
        refreshTodayEvents();
    } catch {
        console.info('[Sano] Jours fériés non chargés (réseau)');
    }
}
fetchPublicHolidays();

// ================================================================
// getTodayEvents()
//
// ★ Retourne un tableau de TOUS les événements actifs aujourd'hui.
//   Chaque entrée est { label: string } — déjà traduite dans la langue courante.
//
// Ordre de priorité :
//   1. Événements ponctuels (fixes ou calculés) — affichés en premier
//   2. Périodes multi-jours (Carême, Ramadan, etc.)
//   3. Jours fériés officiels (API) — dédupliqués
//
// Déduplications :
//   - Un jour qui appartient à la fois à une période (Semaine Sainte) et
//     à un événement ponctuel (Vendredi Saint) est affiché comme deux entrées
//     distinctes (comportement souhaité — ex: "CARÊME • VENDREDI SAINT").
//   - En revanche un jour férié API dont le label est identique à un événement
//     déjà présent n'est PAS dupliqué.
// ================================================================
function getTodayEvents() {
    const now       = new Date();
    const year      = now.getFullYear();
    const todayInt  = dateToInt(now);
    const m         = now.getMonth() + 1;
    const d         = now.getDate();

    const results   = [];
    const seenLabels = new Set();

    const push = (label) => {
        const upper = label.toUpperCase();
        if (!seenLabels.has(upper)) {
            seenLabels.add(upper);
            results.push({ label });
        }
    };

    // ── 1. Événements calculés ──
    // Sépare ponctuels et périodes pour prioriser les ponctuels
    const yearEvents  = buildYearEvents(year);
    const punctual    = yearEvents.filter(e => dateToInt(e.dateStart) === dateToInt(e.dateEnd));
    const periods     = yearEvents.filter(e => dateToInt(e.dateStart) !== dateToInt(e.dateEnd));

    // Ponctuels d'abord
    punctual.forEach(evt => {
        if (todayInt === dateToInt(evt.dateStart)) {
            push(t(evt.key));
        }
    });

    // Périodes ensuite
    periods.forEach(evt => {
        const startInt = dateToInt(evt.dateStart);
        const endInt   = dateToInt(evt.dateEnd);
        if (todayInt >= startInt && todayInt <= endInt) {
            push(t(evt.key));
        }
    });

    // ── 2. Jours fériés officiels (API Nager.Date) — dédupliqués ──
    dynamicHolidays
        .filter(h => h.month === m && h.day === d)
        .forEach(h => push(h.name));

    return results;
}

// Cache des événements du jour — reconstruit à chaque changement de langue ou de jour
let todayEvents = [];

function refreshTodayEvents() {
    todayEvents = getTodayEvents();
}

// Initialisation au démarrage
refreshTodayEvents();

// Rafraîchit le cache à minuit (changement de jour)
function scheduleMidnightRefresh() {
    const now    = new Date();
    const msToMidnight = new Date(
        now.getFullYear(), now.getMonth(), now.getDate() + 1
    ) - now;
    setTimeout(() => {
        refreshTodayEvents();
        dateState = 0; // retour à la date
        renderDate();
        scheduleMidnightRefresh(); // re-programme pour le lendemain
    }, msToMidnight + 500);
}
scheduleMidnightRefresh();

// ================================================================
// WIDGET CALENDRIER — états dynamiques
//
// Structure du cycle :
//   [0]  Date
//   [1]  Heure
//   [2]  Événement #1   (si todayEvents.length ≥ 1)
//   [3]  Événement #2   (si todayEvents.length ≥ 2)
//   ...  etc.
//
// S'il n'y a aucun événement, l'état [2] affiche "Aucun".
// getDateStateCount() renvoie le nombre total d'états.
// getEventIndex()     renvoie l'index de l'événement pour dateState ≥ 2.
// ================================================================
let dateState      = 0;
let dateUserActive = false;
let dateAutoTimer  = null;

const dateEl  = document.getElementById('date-widget');
const dateVal = document.getElementById('date-val');
const dateLbl = document.getElementById('date-label');

// Nombre total d'états pour le widget calendrier
function getDateStateCount() {
    return 2 + Math.max(todayEvents.length, 1);
}

// Index de l'événement dans todayEvents (pour dateState ≥ 2)
function getEventIndex() {
    return dateState - 2;
}

// Label du widget pour l'état courant
function getDateLabel() {
    if (dateState === 0) return t('widget-calendar');
    if (dateState === 1) return t('widget-time');

    const total = todayEvents.length;
    if (total === 0) return t('widget-event');          // "Aucun"
    if (total === 1) return t('widget-event');           // Pas de fraction quand 1 seul événement

    // Plusieurs événements → "Événement 1/3"
    const idx = getEventIndex() + 1;
    return t('widget-event-fmt')
        .replace('%i', idx)
        .replace('%n', total);
}

function applyDateState() {
    const now    = new Date();
    const locale = currentLang === 'EN' ? 'en-US' : 'fr-FR';

    if (dateState === 0) {
        // ── Date ──
        const d = String(now.getDate()).padStart(2, '0');
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const y = now.getFullYear().toString().slice(-2);
        dateVal.textContent = `${d}.${m}.${y}`;

    } else if (dateState === 1) {
        // ── Heure ──
        dateVal.textContent = now.toLocaleTimeString(locale, {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });

    } else {
        // ── Événement ──
        const evtIndex = getEventIndex();
        if (todayEvents.length === 0) {
            dateVal.textContent = t('widget-event-none');
        } else {
            dateVal.textContent = todayEvents[evtIndex]?.label || t('widget-event-none');
        }
    }

    dateLbl.textContent = getDateLabel();
}

function renderDate(withTransition = false) {
    withTransition
        ? transitionWidget(dateEl, applyDateState)
        : applyDateState();
}

// Rafraîchissement temps réel de l'heure
setInterval(() => { if (dateState === 1) applyDateState(); }, 1000);
renderDate();

// Auto-cycle toutes les 5 secondes
function scheduleDateAuto() {
    clearInterval(dateAutoTimer);
    dateAutoTimer = setInterval(() => {
        if (!dateUserActive) {
            dateState = (dateState + 1) % getDateStateCount();
            renderDate(true);
        }
    }, 5000);
}
scheduleDateAuto();

// Clic manuel — avance d'un état
dateEl.onclick = () => {
    dateState = (dateState + 1) % getDateStateCount();
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
            viewVal.textContent   = v;
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
// CURSEUR PERSONNALISÉ
// ================================================================
const cursor = document.getElementById('cursor-dot');
const title  = document.getElementById('main-title');
let mouse = { x: -1000, y: -1000 };

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top  = `${e.clientY}px`;

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
// SECTIONS DÉROULANTES
// ================================================================
document.querySelectorAll('.toggle-box').forEach(box => {
    box.onclick = function(e) {
        if (e.target.tagName === 'A') return;
        this.classList.toggle('open');
        playTick();
    };
});

// ================================================================
// PARTICULES
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
            p.x -= dx / d * (70 - d) / 5;
            p.y -= dy / d * (70 - d) / 5;
        } else {
            p.x += (p.bx - p.x) * 0.1;
            p.y += (p.by - p.y) * 0.1;
        }

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
// INIT LANGUE — appelé en dernier
// ================================================================
applyLang(currentLang);

// ================================================================
// FIN DOMContentLoaded
// ================================================================
});
