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
const accentBtn = document.getElementById('accent-toggle');

const colors = [
    { name: 'TRANSP', main: '#ff0037', border: 'rgba(255, 255, 255, 0.1)', dyn: 'inherit', rev: 'auto' },
    { name: 'ROUGE',  main: '#ff0037', border: 'rgba(255, 0, 55, 0.4)',  dyn: '#ff0037', rev: '#ff0037' }, 
    { name: 'BLANC',  main: '#ffffff', border: 'rgba(255, 255, 255, 0.4)', dyn: '#ffffff', rev: '#ffffff' }, 
    { name: 'NOIR',   main: '#000000', border: 'rgba(0, 0, 0, 0.4)',      dyn: '#444',    rev: '#000000' },      
    { name: 'JAUNE',  main: '#f5d94a', border: 'rgba(245, 217, 74, 0.5)', dyn: '#f5d94a', rev: '#f5d94a' }
];
let currentColorIdx = 0;

function updateRevealColor() {
    const theme = colors[currentColorIdx];
    if (theme.rev === 'auto') {
        const isLight = body.classList.contains('light-mode');
        document.documentElement.style.setProperty('--reveal-color', isLight ? '#000000' : '#ffffff');
    } else {
        document.documentElement.style.setProperty('--reveal-color', theme.rev);
    }
}

accentBtn.onclick = () => {
    currentColorIdx = (currentColorIdx + 1) % colors.length;
    const theme = colors[currentColorIdx];
    accentBtn.textContent = theme.name;
    document.documentElement.style.setProperty('--accent-color', theme.main);
    document.documentElement.style.setProperty('--card-border', theme.border);
    document.documentElement.style.setProperty('--dynamic-color', theme.dyn);
    updateRevealColor();
    playTick();
};

const themeMediaQuery = window.matchMedia('(prefers-color-scheme: light)');
body.classList.toggle('light-mode', themeMediaQuery.matches);

themeBtn.onclick = () => { 
    body.classList.toggle('light-mode'); 
    themeBtn.textContent = body.classList.contains('light-mode') ? "SOMBRE" : "CLAIR"; 
    updateRevealColor(); 
    playTick(); 
};

// --- GESTION DES WIDGETS ---
let showTime = false;
function renderDate() {
    const now = new Date();
    const dateVal = document.getElementById('date-val');
    if (showTime) dateVal.textContent = now.toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit', second:'2-digit'});
    else dateVal.textContent = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear().toString().slice(-2)}`;
}
setInterval(() => { if(showTime) renderDate(); }, 1000); 
renderDate();
document.getElementById('date-widget').onclick = () => { showTime = !showTime; renderDate(); playTick(); };

// --- VUES & INFOS ---
const viewVal = document.getElementById('view-val');
const viewLabel = document.getElementById('view-label');
let infoState = 0;
let v = "...";

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
    if (infoState === 0) { viewVal.textContent = v; viewLabel.textContent = "Vues"; }
    else if (infoState === 1) { 
        let bat = "N/A"; 
        if (navigator.getBattery) { 
            const b = await navigator.getBattery(); 
            bat = Math.round(b.level * 100) + "%"; 
        }
        viewVal.textContent = bat; viewLabel.textContent = "BATTERIE"; 
    }
    else if (infoState === 2) { viewVal.textContent = navigator.platform.substring(0,8).toUpperCase(); viewLabel.textContent = "SYSTEME"; }
    else if (infoState === 3) { viewVal.textContent = `${window.screen.width}X${window.screen.height}`; viewLabel.textContent = "RESOLUTION"; }
}
document.getElementById('view-widget').onclick = () => { playTick(); infoState = (infoState + 1) % 4; updateInfoDisplay(); };

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
    document.querySelectorAll('.active-fx').forEach(el => {
        const b = el.getBoundingClientRect();
        if (e.clientX > b.left && e.clientX < b.right && e.clientY > b.top && e.clientY < b.bottom) {
            const tx = (e.clientX - (b.left + b.width/2)) / 12;
            const ty = (e.clientY - (b.top + b.height/2)) / 6;
            el.style.transform = `scale(1.01) translate(${tx}px, ${ty}px) skewX(${tx/2}deg)`;
        } else { el.style.transform = `scale(1) translate(0, 0) skewX(0)`; }
    });
});

document.querySelectorAll('.active-fx').forEach(el => {
    el.onmouseenter = () => { cursor.classList.add('hover'); playTick(); el.dataset.hovered = "true"; };
    el.onmouseleave = () => { cursor.classList.remove('hover'); el.dataset.hovered = "false"; };
});

// --- CLIC SECTIONS DÉROULANTES ---
document.getElementById('about-trigger').onclick = function() { this.classList.toggle('open'); playTick(); };
document.getElementById('projects-trigger').onclick = function(e) {
    if (e.target.classList.contains('project-link')) return;
    this.classList.toggle('open');
    playTick();
};

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
updateRevealColor();