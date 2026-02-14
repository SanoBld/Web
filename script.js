// --- CONFIGURATION FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCo84qaR5dUOWutGE4w3g-HjxAiNZLldpM",
  databaseURL: "https://sanobld-portfolio-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sanobld-portfolio"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const body = document.body;
const themeBtn = document.getElementById('theme-toggle');
const perfBtn = document.getElementById('perf-toggle');

// --- MODE PERFORMANCE ---
let performanceMode = false;
perfBtn.onclick = () => {
    performanceMode = !performanceMode;
    perfBtn.textContent = performanceMode ? "NORMAL" : "PERF";
    
    // Activer/désactiver la classe perf-mode sur body
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

// --- ÉVÉNEMENTS DU CALENDRIER ---
const fixedEvents = [
    { month: 1, day: 1, name: "NOUVEL AN" },
    { month: 2, day: 14, name: "ST-VALENTIN" },
    { month: 10, day: 31, name: "HALLOWEEN" },
    { month: 12, day: 25, name: "NOËL" },
    { month: 12, day: 31, name: "RÉVEILLON" }
];

// Événements dynamiques (Ramadan, etc.) - API Calendarific ou similaire
let dynamicEvents = [];

async function fetchDynamicEvents() {
    try {
        const year = new Date().getFullYear();
        // API gratuite pour les jours fériés et événements religieux
        const response = await fetch(`https://date.nager.at/api/v3/publicholidays/${year}/FR`);
        if (response.ok) {
            const holidays = await response.json();
            holidays.forEach(holiday => {
                const date = new Date(holiday.date);
                dynamicEvents.push({
                    month: date.getMonth() + 1,
                    day: date.getDate(),
                    name: holiday.localName.toUpperCase()
                });
            });
        }
    } catch (error) {
        console.log("Impossible de charger les événements dynamiques");
    }
}

fetchDynamicEvents();

function getTodayEvent() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // Chercher dans les événements fixes
    const fixedEvent = fixedEvents.find(e => e.month === month && e.day === day);
    if (fixedEvent) return fixedEvent.name;
    
    // Chercher dans les événements dynamiques
    const dynamicEvent = dynamicEvents.find(e => e.month === month && e.day === day);
    if (dynamicEvent) return dynamicEvent.name;
    
    return null;
}

// --- GESTION DU WIDGET DATE/CALENDRIER ---
let showTime = false;
let showEvent = false;

function renderDate() {
    const now = new Date();
    const dateVal = document.getElementById('date-val');
    const dateLabel = document.getElementById('date-label');
    
    if (showEvent) {
        const event = getTodayEvent();
        if (event) {
            dateVal.textContent = event;
            dateLabel.textContent = "ÉVÉNEMENT";
        } else {
            dateVal.textContent = "AUCUN";
            dateLabel.textContent = "ÉVÉNEMENT";
        }
    } else if (showTime) {
        dateVal.textContent = now.toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit', second:'2-digit'});
        dateLabel.textContent = "HEURE";
    } else {
        dateVal.textContent = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear().toString().slice(-2)}`;
        dateLabel.textContent = "CALENDRIER";
    }
}

setInterval(() => { if(showTime) renderDate(); }, 1000); 
renderDate();

document.getElementById('date-widget').onclick = () => { 
    if (!showTime && !showEvent) {
        showTime = true;
    } else if (showTime && !showEvent) {
        showTime = false;
        showEvent = true;
    } else {
        showTime = false;
        showEvent = false;
    }
    renderDate(); 
    playTick(); 
};

// --- GESTION DU WIDGET INFOS SYSTÈME (PLUS DE GADGETS) ---
const viewVal = document.getElementById('view-val');
const viewLabel = document.getElementById('view-label');
let infoState = 0;
let v = "...";
const startTime = Date.now();

async function fetchGlobalViews() {
    const viewRef = database.ref('total_views');
    viewRef.transaction((currentValue) => (currentValue || 0) + 1, (error, committed, snapshot) => {
        if (committed) {
            v = snapshot.val();
            if (infoState === 0) viewVal.textContent = v;
        }
    });
}
fetchGlobalViews();

async function updateInfoDisplay() {
    if (infoState === 0) { 
        viewVal.textContent = v; 
        viewLabel.textContent = "VUES"; 
    }
    else if (infoState === 1) { 
        let bat = "N/A"; 
        if (navigator.getBattery) { 
            const b = await navigator.getBattery(); 
            bat = Math.round(b.level * 100) + "%"; 
        }
        viewVal.textContent = bat; 
        viewLabel.textContent = "BATTERIE"; 
    }
    else if (infoState === 2) { 
        viewVal.textContent = navigator.platform.substring(0,8).toUpperCase(); 
        viewLabel.textContent = "SYSTÈME"; 
    }
    else if (infoState === 3) { 
        viewVal.textContent = `${window.screen.width}X${window.screen.height}`; 
        viewLabel.textContent = "RÉSOLUTION"; 
    }
    else if (infoState === 4) {
        const uptime = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(uptime / 60);
        const seconds = uptime % 60;
        viewVal.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
        viewLabel.textContent = "UPTIME";
    }
    else if (infoState === 5) {
        viewVal.textContent = navigator.language.toUpperCase().substring(0, 5);
        viewLabel.textContent = "LANGUE";
    }
    else if (infoState === 6) {
        viewVal.textContent = navigator.onLine ? "EN LIGNE" : "HORS LIGNE";
        viewLabel.textContent = "CONNEXION";
    }
    else if (infoState === 7) {
        const cores = navigator.hardwareConcurrency || "N/A";
        viewVal.textContent = cores + " CORES";
        viewLabel.textContent = "CPU";
    }
    else if (infoState === 8) {
        const memory = navigator.deviceMemory || "N/A";
        viewVal.textContent = memory + " GB";
        viewLabel.textContent = "RAM";
    }
}

document.getElementById('view-widget').onclick = () => { 
    playTick(); 
    infoState = (infoState + 1) % 9; // 9 états maintenant
    updateInfoDisplay(); 
};

// Mettre à jour l'uptime chaque seconde si affiché
setInterval(() => {
    if (infoState === 4) updateInfoDisplay();
}, 1000);

// --- AUDIO & CURSEUR ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTick() {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
    o.frequency.setValueAtTime(180, audioCtx.currentTime);
    g.gain.setValueAtTime(0.02, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
    o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + 0.04);
}

const cursor = document.getElementById('cursor-dot');
const title = document.getElementById('main-title');
let mouse = { x: -1000, y: -1000 };

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`;
    const r = title.getBoundingClientRect();
    title.style.setProperty('--m-x', `${e.clientX - r.left}px`);
    title.style.setProperty('--m-y', `${e.clientY - r.top}px`);
    
    // Désactiver les effets 3D en mode performance
    if (!performanceMode) {
        document.querySelectorAll('.active-fx').forEach(el => {
            const b = el.getBoundingClientRect();
            if (e.clientX > b.left && e.clientX < b.right && e.clientY > b.top && e.clientY < b.bottom) {
                const tx = (e.clientX - (b.left + b.width/2)) / 12;
                const ty = (e.clientY - (b.top + b.height/2)) / 6;
                el.style.transform = `scale(1.01) translate(${tx}px, ${ty}px) skewX(${tx/2}deg)`;
            } else { 
                el.style.transform = `scale(1) translate(0, 0) skewX(0)`; 
            }
        });
    }
});

// Animation de clic sur le curseur
document.addEventListener('mousedown', () => {
    cursor.classList.add('clicking');
    setTimeout(() => {
        cursor.classList.remove('clicking');
    }, 300);
});

document.querySelectorAll('.active-fx').forEach(el => {
    el.onmouseenter = () => { cursor.classList.add('hover'); playTick(); el.dataset.hovered = "true"; };
    el.onmouseleave = () => { cursor.classList.remove('hover'); el.dataset.hovered = "false"; };
});

// GESTION UNIFIÉE DES CLICS DÉROULANTS
document.querySelectorAll('.toggle-box').forEach(box => {
    box.onclick = function(e) {
        // Ne ferme pas si on clique sur un lien réel à l'intérieur
        if (e.target.tagName === 'A') return;
        this.classList.toggle('open');
        playTick();
    };
});

// --- PARTICULES ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function init() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    particles = [];
    for (let x = 12; x < canvas.width; x += 24) {
        for (let y = 12; y < canvas.height; y += 24) { particles.push({ x, y, bx: x, by: y }); }
    }
}
function animate() {
    // En mode performance, ne pas afficher les particules
    if (performanceMode) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        requestAnimationFrame(animate);
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLight = body.classList.contains('light-mode');
    const colorMain = isLight ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)";
    const colorInv = isLight ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)";
    particles.forEach(p => {
        let dx = mouse.x - p.x; let dy = mouse.y - p.y; let d = Math.sqrt(dx*dx + dy*dy);
        if (d < 70) { p.x -= dx/d * (70-d)/5; p.y -= dy/d * (70-d)/5; }
        else { p.x += (p.bx - p.x) * 0.1; p.y += (p.by - p.y) * 0.1; }
        let finalColor = colorMain;
        document.querySelectorAll('.active-fx').forEach(el => {
            if (el.dataset.hovered === "true") {
                const r = el.getBoundingClientRect();
                if (p.x > r.left && p.x < r.right && p.y > r.top && p.y < r.bottom) finalColor = colorInv;
            }
        });
        ctx.fillStyle = finalColor; ctx.beginPath(); ctx.arc(p.x, p.y, 0.9, 0, 7); ctx.fill();
    });
    requestAnimationFrame(animate);
}
window.onresize = init; init(); animate();
