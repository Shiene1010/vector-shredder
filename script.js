// ==========================================
// 1. DOM Elements Mapping
// ==========================================
const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
const shredderBtn = document.getElementById('shredderBtn');
const energyGauge = document.getElementById('energyGauge');

// Top Metrics Cards DOM
const mSanity = document.getElementById('m-sanity');
const mSafety = document.getElementById('m-safety');
const mShield = document.getElementById('m-shield');
const mLoyalty = document.getElementById('m-loyalty');
const mOverhead = document.getElementById('m-overhead');
const mDividend = document.getElementById('m-dividend');

const cardL1 = document.getElementById('card-l1');
const anonymousWallet = document.getElementById('anonymousWallet');
const walletLabel = document.getElementById('walletLabel');

// ==========================================
// 2. Real-Time Engine State Variables
// ==========================================
let isHolding = false;
let gameCleared = false;

// Synchronized Stats to Match Wireframe Scenario Initial State
let stats = {
    sanity: 24,       // L1 Alert Level
    safety: 45,       // L1
    shield: 55,       // L2
    loyalty: 310,     // L2 Target: 610
    overhead: 8,      // L3 Attenuates to 2%
    dividend: 0,      // L3 Target: \$1280
    energy: 45        // Gauge Percent
};

// Isometric Simulation Entities
let rawTextStreams = [];
let vectorCubes = [];

// Static Infrastructure Isometric Node Positions (Mapped from Diagram Layout)
const staticNodes = [
    { type: 'shop', x: 0, y: -40, icon: '☕', label: 'Coffee Shop' },
    { type: 'shop', x: -60, y: 10, icon: '☕', label: 'Hub' },
    { type: 'rider', x: 30, y: -10, icon: '🛵', label: 'Rider Node' },
    { type: 'customer', x: -20, y: 60, icon: '👤', label: 'Customer' },
    { type: 'customer', x: 50, y: 40, icon: '👤', label: 'User Node' }
];

const chaosPhrases = [
    "DATA LEAK ALERT!", "REVIEWS BOMBING", "SIDEWALK ACCIDENT",
    "HUMAN BURNOUT", "LAWSUIT THREAT", "COMPLAINT OVERFLOW"
];

// ==========================================
// 3. Isometric Coordinate Converter Tool
// ==========================================
function toIso(x, y) {
    const isoX = (x - y) + (canvas.width / 2);
    const isoY = (x + y) * 0.5 + (canvas.height / 2 - 20);
    return { x: isoX, y: isoY };
}

// Adjust Screen Geometry Dynamically
function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resize);
resize();

// ==========================================
// 4. Data Streams Chaos Generator
// ==========================================
function injectChaosNode() {
    if (isHolding || gameCleared || rawTextStreams.length > 8) return;
    
    // Pick a random grid position to explode text stream
    const rx = (Math.random() - 0.5) * 160;
    const ry = (Math.random() - 0.5) * 160;
    const phrase = chaosPhrases[Math.floor(Math.random() * chaosPhrases.length)];
    
    rawTextStreams.push({
        x: rx, y: ry,
        text: phrase,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        bounceTimer: 0
    });
}
setInterval(injectChaosNode, 1000);

// ==========================================
// 5. Tactile Control & Input Interfaces
// ==========================================
function triggerHold(e) {
    e.preventDefault();
    if (gameCleared) return;
    isHolding = true;
    shredderBtn.classList.add('active');
}

function releaseHold() {
    isHolding = false;
    shredderBtn.classList.remove('active');
}

shredderBtn.addEventListener('mousedown', triggerHold);
shredderBtn.addEventListener('touchstart', triggerHold, { passive: false });
window.addEventListener('mouseup', releaseHold);
window.addEventListener('touchend', releaseHold);

// Cryptographic Pseudo ZKP QR Compiler Matrix 
function compileZkpMatrix() {
    const container = document.getElementById('qrContainer');
    container.innerHTML = '';
    for (let i = 0; i < 49; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'qr-pixel';
        pixel.style.background = Math.random() > 0.45 ? '#0b0f17' : 'transparent';
        container.appendChild(pixel);
    }
}
compileZkpMatrix();
setInterval(() => { if (!gameCleared) compileZkpMatrix(); }, 250);

// ==========================================
// 6. Graphics Pipeline & Simulation Engine Loop
// ==========================================
function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 6A. Draw Grid Mesh Overlay Matrix (Wireframe Style)
    ctx.strokeStyle = 'rgba(36, 47, 65, 0.4)';
    ctx.lineWidth = 1;
    for (let i = -180; i <= 180; i += 30) {
        let p1 = toIso(i, -180);
        let p2 = toIso(i, 180);
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();

        let p3 = toIso(-180, i);
        let p4 = toIso(180, i);
        ctx.beginPath(); ctx.moveTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.stroke();
    }

    // 6B. Draw Static Isometric Structural Architecture Nodes
    staticNodes.forEach(node => {
        let pos = toIso(node.x, node.y);
        
        // Draw Subtle Base Ring
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
        ctx.stroke();

        // Node Typography Rendering
        ctx.fillStyle = 'var(--text-main)';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.icon, pos.x, pos.y + 4);
        
        ctx.fillStyle = 'var(--text-muted)';
        ctx.font = '7px monospace';
        ctx.fillText(node.label, pos.x, pos.y + 22);
    });

    // 6C. Hold State: Real-Time Vector Shifting Math Formulas
    if (isHolding && rawTextStreams.length > 0 && !gameCleared) {
        let targetText = rawTextStreams[0];
        let pos = toIso(targetText.x, targetText.y);

        // Explode Plaintext into High-Dimensional Vectors
        for (let i = 0; i < 4; i++) {
            vectorCubes.push({
                cx: pos.x + (Math.random() - 0.5) * 30,
                cy: pos.y + (Math.random() - 0.5) * 15,
                size: Math.random() * 5 + 3,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 4 - 2, // Propulsion upwards toward top metrics
                color: Math.random() > 0.5 ? 'var(--neon-green)' : 'var(--neon-blue)'
            });
        }
        rawTextStreams.shift(); // Free processed semantic data block

        // System Overhead Decreases, Loyalty and Dividends Accumulate
        stats.sanity = Math.min(74, stats.sanity + 5);      // Target wireframe values
        stats.safety = Math.min(88, stats.safety + 4);
        stats.shield = Math.min(95, stats.shield + 4);
        stats.loyalty = Math.min(610, stats.loyalty + 30);
        stats.overhead = Math.max(2, stats.overhead - 1);
        stats.dividend = Math.min(1280, stats.dividend + 128);
        stats.energy = Math.min(100, stats.energy + 5);

        // Update Matrix View Interfaces Directly
        mSanity.textContent = `${stats.sanity}%`;
        mSafety.textContent = `${stats.safety}%`;
        mShield.textContent = `${stats.shield}%`;
        mLoyalty.textContent = stats.loyalty;
        mOverhead.textContent = `${stats.overhead}%`;
        mDividend.textContent = `$${stats.dividend.toLocaleString()}`;
        
        // Dynamically adjust hyper velocity angular gauge asset color border
        energyGauge.style.background = `conic-gradient(var(--neon-green) 0% ${stats.energy}%, #1a2333 ${stats.energy}% 100%)`;

        if (stats.sanity >= 60) cardL1.classList.remove('alert');

        // Check Diagram Equilibrium Completion Target 
        if (stats.dividend >= 1280 && stats.loyalty >= 610) {
            gameCleared = true;
            isHolding = false;
            shredderBtn.textContent = "SYSTEM BALANCED";
            shredderBtn.style.borderColor = "var(--neon-blue)";
            shredderBtn.style.color = "var(--neon-blue)";
            anonymousWallet.classList.add('active');
            walletLabel.textContent = "ZKP SECURE: 2GP VERIFIED";
            alert("⚙️ [SYSTEM EQUILIBRIUM REACHED]\n익명 차원 벡터 변환 기술을 통해 최적화 밸런스가 마감되었습니다.\n- L1/L2 지표 위험 해제 완료\n- 플랫폼 국고 시너지 배당 달성: \$1,280\n- 영지식 증명 오프라인 커피 QR 쿠폰이 발급되었습니다!");
        }
    }

    // 6D. Compute Floating Semantic Plaintext Data Elements
    rawTextStreams.forEach(stream => {
        stream.x += stream.vx;
        stream.y += stream.vy;
        
        let pos = toIso(stream.x, stream.y);

        // Display Glowing Raw Toxic Alert Strings
        ctx.fillStyle = 'var(--neon-red)';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'var(--neon-red)';
        ctx.shadowBlur = 5;
        ctx.fillText(`⚠️ [${stream.text}]`, pos.x, pos.y);
        ctx.shadowBlur = 0;
    });

    // 6E. Compute High-Dimensional Neon Vector Cube Particles
    vectorCubes.forEach((cube, idx) => {
        cube.cx += cube.vx;
        cube.cy += cube.vy;
        
        ctx.fillStyle = cube.color;
        ctx.shadowColor = cube.color;
        ctx.shadowBlur = 4;
        ctx.fillRect(cube.cx, cube.cy, cube.size, cube.size);
        ctx.shadowBlur = 0;

        // Clean memory cycle for out of boundary fragments
        if (cube.cy < -20) vectorCubes.splice(idx, 1);
    });

    requestAnimationFrame(renderLoop);
}

// Fire Simulation Initialization Engine
renderLoop();
