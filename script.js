// ================================================================
// BOOTSTRAP — tout le code s'exécute après le DOM
// ================================================================
document.addEventListener('DOMContentLoaded', () => {

// --- CONFIGURATION FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCo84qaR5dUOWutGE4w3g-HjxAiNZLldpM",
  databaseURL: "https://sanobld-portfolio-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sanobld-portfolio"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ================================================================
// PRELOADER
// ================================================================
const preloader = document.getElementById('preloader');

function hidePreloader() {
    preloader.classList.add('fade-out');
    setTimeout(() => {
        preloader.style.display = 'none';
        document.body.classList.add('page-ready');
    }, 580);
}

// Le preloader disparaît une fois que tout est chargé
// (au plus tard après 3s pour les connexions lentes)
const preloaderMax = setTimeout(hidePreloader, 3000);
window.addEventListener('load', () => {
    clearTimeout(preloaderMax);
    // Légère pause pour que l'animation soit propre
    setTimeout(hidePreloader, 280);
});

// ================================================================
// THÈME & PERFORMANCE
// ================================================================
const body   = document.body;
const themeBtn = document.getElementById('theme-toggle');
const perfBtn  = document.getElementById('perf-toggle');

let performanceMode = false;

perfBtn.onclick = () => {
    performanceMode = !performanceMode;
    perfBtn.textContent = performanceMode ? "NORMAL" : "PERF";
    body.classList.toggle('perf-mode', performanceMode);
    playTick();
};

const themeMediaQuery = window.matchMedia('(prefers-color-scheme: light)');
body.classList.toggle('light-mode', themeMediaQuery.matches);

themeBtn.onclick = () => {
    body.classList.toggle('light-mode');
    themeBtn.textContent = body.classList.contains('light-mode') ? "SOMBRE" : "CLAIR";
    playTick();
};

// ================================================================
// ÉVÉNEMENTS DU CALENDRIER
// ================================================================
const fixedEvents = [
    { month: 1,  day: 1,  name: "NOUVEL AN"  },
    { month: 2,  day: 14, name: "ST-VALENTIN" },
    { month: 10, day: 31, name: "HALLOWEEN"   },
    { month: 12, day: 25, name: "NOËL"        },
    { month: 12, day: 31, name: "RÉVEILLON"   }
];

let dynamicEvents = [];

async function fetchDynamicEvents() {
    try {
        const year = new Date().getFullYear();
        const response = await fetch(`https://date.nager.at/api/v3/publicholidays/${year}/FR`);
        if (response.ok) {
            const holidays = await response.json();
            holidays.forEach(holiday => {
                const date = new Date(holiday.date);
                dynamicEvents.push({
                    month: date.getMonth() + 1,
                    day:   date.getDate(),
                    name:  holiday.localName.toUpperCase()
                });
            });
        }
    } catch {
        console.log("Impossible de charger les événements dynamiques");
    }
}

fetchDynamicEvents();

function getTodayEvent() {
    const now   = new Date();
    const month = now.getMonth() + 1;
    const day   = now.getDate();
    const fixed   = fixedEvents.find(e => e.month === month && e.day === day);
    if (fixed)   return fixed.name;
    const dynamic = dynamicEvents.find(e => e.month === month && e.day === day);
    if (dynamic) return dynamic.name;
    return null;
}

// ================================================================
// MÉTÉO — Open-Meteo via géolocalisation
// ================================================================
let weatherCache = null; // { text, label }

const WMO_MAP = [
    { codes: [0],                        icon: "☀️",  label: "ENSOLEILLÉ"         },
    { codes: [1],                        icon: "🌤️", label: "MOSTLY CLEAR"       },
    { codes: [2],                        icon: "⛅",  label: "PARTIELLEMENT NUAGEUX" },
    { codes: [3],                        icon: "☁️",  label: "NUAGEUX"            },
    { codes: [45, 48],                   icon: "🌫️", label: "BROUILLARD"         },
    { codes: [51, 53, 55, 56, 57],       icon: "🌦️", label: "BRUINE"             },
    { codes: [61, 63, 65, 66, 67],       icon: "🌧️", label: "PLUIE"              },
    { codes: [71, 73, 75, 77],           icon: "❄️",  label: "NEIGE"              },
    { codes: [80, 81, 82],               icon: "🌦️", label: "AVERSES"            },
    { codes: [85, 86],                   icon: "❄️",  label: "AVERSES NEIGEUSES"  },
    { codes: [95, 96, 99],               icon: "⛈️",  label: "ORAGE"             },
];

function getWeatherMeta(code) {
    return WMO_MAP.find(w => w.codes.includes(code)) || { icon: "🌡️", label: "INCONNU" };
}

async function fetchWeather() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(null);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius`;
                    const res  = await fetch(url);
                    const data = await res.json();
                    const { temperature, weathercode } = data.current_weather;
                    const meta  = getWeatherMeta(weathercode);
                    const round = Math.round(temperature);
                    weatherCache = {
                        text:  `${meta.icon} ${round}°C`,
                        label: meta.label
                    };
                    resolve(weatherCache);
                } catch {
                    resolve(null);
                }
            },
            () => resolve(null),
            { timeout: 6000 }
        );
    });
}

// Pré-chargement en arrière-plan
fetchWeather();

// ================================================================
// WIDGET DATE / HEURE / ÉVÉNEMENT / MÉTÉO
// ================================================================
// États : 0 = Date  |  1 = Heure  |  2 = Événement  |  3 = Météo
let dateState = 0;

function renderDate() {
    const now      = new Date();
    const dateVal  = document.getElementById('date-val');
    const dateLabel = document.getElementById('date-label');

    switch (dateState) {
        case 1: // Heure
            dateVal.textContent  = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            dateLabel.textContent = "HEURE";
            break;
        case 2: // Événement
            const event = getTodayEvent();
            dateVal.textContent  = event || "AUCUN";
            dateLabel.textContent = "ÉVÉNEMENT";
            break;
        case 3: // Météo
            if (weatherCache) {
                dateVal.textContent   = weatherCache.text;
                dateLabel.textContent = weatherCache.label;
            } else {
                dateVal.textContent   = "...";
                dateLabel.textContent = "MÉTÉO";
                // Tentative différée si non encore chargé
                fetchWeather().then(w => {
                    if (w && dateState === 3) {
                        dateVal.textContent   = w.text;
                        dateLabel.textContent = w.label;
                    }
                });
            }
            break;
        default: // Date (0)
            const d = String(now.getDate()).padStart(2, '0');
            const m = String(now.getMonth() + 1).padStart(2, '0');
            const y = now.getFullYear().toString().slice(-2);
            dateVal.textContent  = `${d}.${m}.${y}`;
            dateLabel.textContent = "CALENDRIER";
    }
}

// Rafraîchissement de l'heure en temps réel
setInterval(() => { if (dateState === 1) renderDate(); }, 1000);
renderDate();

document.getElementById('date-widget').onclick = () => {
    dateState = (dateState + 1) % 4;
    renderDate();
    playTick();
};

// ================================================================
// WIDGET INFOS SYSTÈME
// ================================================================
const viewVal   = document.getElementById('view-val');
const viewLabel = document.getElementById('view-label');
let infoState = 0;
let v = "...";
const startTime = Date.now();

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

async function updateInfoDisplay() {
    switch (infoState) {
        case 0:
            viewVal.textContent  = v;
            viewLabel.textContent = "VUES";
            break;
        case 1:
            let bat = "N/A";
            if (navigator.getBattery) {
                const b = await navigator.getBattery();
                bat = Math.round(b.level * 100) + "%";
            }
            viewVal.textContent  = bat;
            viewLabel.textContent = "BATTERIE";
            break;
        case 2:
            viewVal.textContent  = navigator.platform.substring(0, 8).toUpperCase();
            viewLabel.textContent = "SYSTÈME";
            break;
        case 3:
            viewVal.textContent  = `${window.screen.width}X${window.screen.height}`;
            viewLabel.textContent = "RÉSOLUTION";
            break;
        case 4:
            const uptime  = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(uptime / 60);
            const seconds = uptime % 60;
            viewVal.textContent  = `${minutes}:${String(seconds).padStart(2, '0')}`;
            viewLabel.textContent = "UPTIME";
            break;
        case 5:
            viewVal.textContent  = navigator.language.toUpperCase().substring(0, 5);
            viewLabel.textContent = "LANGUE";
            break;
        case 6:
            viewVal.textContent  = navigator.onLine ? "EN LIGNE" : "HORS LIGNE";
            viewLabel.textContent = "CONNEXION";
            break;
        case 7:
            viewVal.textContent  = (navigator.hardwareConcurrency || "N/A") + " CORES";
            viewLabel.textContent = "CPU";
            break;
        case 8:
            viewVal.textContent  = (navigator.deviceMemory || "N/A") + " GB";
            viewLabel.textContent = "RAM";
            break;
    }
}

document.getElementById('view-widget').onclick = () => {
    playTick();
    infoState = (infoState + 1) % 9;
    updateInfoDisplay();
};

setInterval(() => { if (infoState === 4) updateInfoDisplay(); }, 1000);

// ================================================================
// AUDIO
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
// CURSEUR
// ================================================================
const cursor = document.getElementById('cursor-dot');
const title  = document.getElementById('main-title');
let mouse = { x: -1000, y: -1000 };

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top  = `${e.clientY}px`;

    const r = title.getBoundingClientRect();
    title.style.setProperty('--m-x', `${e.clientX - r.left}px`);
    title.style.setProperty('--m-y', `${e.clientY - r.top}px`);

    if (!performanceMode) {
        document.querySelectorAll('.active-fx').forEach(el => {
            const b = el.getBoundingClientRect();
            if (e.clientX > b.left && e.clientX < b.right &&
                e.clientY > b.top  && e.clientY < b.bottom) {
                const tx = (e.clientX - (b.left + b.width  / 2)) / 12;
                const ty = (e.clientY - (b.top  + b.height / 2)) / 6;
                el.style.transform = `scale(1.01) translate(${tx}px, ${ty}px) skewX(${tx / 2}deg)`;
            } else {
                el.style.transform = `scale(1) translate(0, 0) skewX(0)`;
            }
        });
    }
});

// Squeeze & hold — libération à mouseup
document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));

// Hover sur les éléments actifs
document.querySelectorAll('.active-fx').forEach(el => {
    el.onmouseenter = () => { cursor.classList.add('hover'); playTick(); el.dataset.hovered = "true";  };
    el.onmouseleave = () => { cursor.classList.remove('hover'); el.dataset.hovered = "false"; };
});

// ================================================================
// TOGGLE DES SECTIONS DÉROULANTES
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
    particles = []; // reset pour éviter les fuites mémoire
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
    const isLight  = body.classList.contains('light-mode');
    const colorMain = isLight ? "rgba(0,0,0,0.8)"   : "rgba(255,255,255,0.8)";
    const colorInv  = isLight ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)";

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
            if (el.dataset.hovered === "true") {
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
// FIN DOMContentLoaded
// ================================================================
});
