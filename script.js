// ==========================================
// DOM Elements Selection
// ==========================================
const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
const shredderBtn = document.getElementById('shredderBtn');

const metricL1 = document.getElementById('metric-l1');
const metricL2 = document.getElementById('metric-l2');
const metricL3 = document.getElementById('metric-l3');
const cardL1 = document.getElementById('card-l1');
const walletPreview = document.getElementById('walletPreview');
const walletLabel = document.getElementById('walletLabel');

// ==========================================
// Game State & Configuration
// ==========================================
let isHolding = false;
let l1Sanity = 24;
let l2Shield = 45;
let l3Dividend = 0.00;
let gameCleared = false;

// Fixed Scenario Data: Toxic Plaintext Stream Entities
const toxicTexts = [
    "LATE DELIVERY AGAIN?!", 
    "TRASH SERVICE BAN THIS RIDER", 
    "COLD COFFEE SMH", 
    "SIDEWALK RIDER ALMOST HIT ME", 
    "SPAM REVIEWS GOO", 
    "DANGEROUS DRIVING"
];

let textNodes = [];
let vectorCubes = [];

// ==========================================
// Canvas Configuration & Resize Engine
// ==========================================
function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resize);
resize();

// ==========================================
// Spawning Logic: Stream Chaos Data Nodes
// ==========================================
function spawnText() {
    // Stop spawning when shredding or game is cleared
    if (isHolding || gameCleared || textNodes.length > 12) return;
    
    const text = toxicTexts[Math.floor(Math.random() * toxicTexts.length)];
    textNodes.push({
        x: Math.random() * (canvas.width - 150) + 50,
        y: Math.random() * (canvas.height - 100) + 50,
        text: text,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        alpha: 1
    });
}
setInterval(spawnText, 800);

// ==========================================
// Tactile Input Hook Mechanics (Touch & Mouse)
// ==========================================
function startShred(e) {
    e.preventDefault();
    if (gameCleared) return;
    isHolding = true;
    shredderBtn.classList.add('active');
}

function stopShred() {
    isHolding = false;
    shredderBtn.classList.remove('active');
}

// Multi-device listeners
shredderBtn.addEventListener('mousedown', startShred);
shredderBtn.addEventListener('touchstart', startShred, { passive: false });
window.addEventListener('mouseup', stopShred);
window.addEventListener('touchend', stopShred);

// ==========================================
// Cryptographic Module: ZKP Shifting QR Matrix
// ==========================================
function generateQR() {
    const container = document.getElementById('qrContainer');
    container.innerHTML = '';
    // Generate 7x7 pseudo cryptographic grid elements
    for (let i = 0; i < 49; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'qr-pixel';
        pixel.style.opacity = Math.random() > 0.5 ? '1' : '0';
        container.appendChild(pixel);
    }
}
generateQR();
setInterval(() => { if (!gameCleared) generateQR(); }, 300);

// ==========================================
// Real-Time Core Loop & Rendering Pipeline
// ==========================================
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Isometric Grid Background Lines
    ctx.strokeStyle = 'rgba(48, 54, 61, 0.3)';
    ctx.lineWidth = 1;
    for (let i = -canvas.width; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + canvas.height, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(i + canvas.height, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }

    // 2. Processing Phase: Hold To Shred Logic & Metric Attenuation
    if (isHolding && textNodes.length > 0 && !gameCleared) {
        let target = textNodes[0];
        
        // Transform current plain text node into neon high-dimensional vector cubes
        for (let i = 0; i < 6; i++) {
            vectorCubes.push({
                x: target.x + (Math.random() - 0.5) * 40,
                y: target.y + (Math.random() - 0.5) * 20,
                size: Math.random() * 6 + 4,
                color: Math.random() > 0.5 ? 'var(--neon-green)' : 'var(--neon-blue)',
                speed: Math.random() * 4 + 3
            });
        }
        textNodes.shift(); // Evacuate processed semantic text unit

        // Update Matrix State Values (Positive Shift)
        l1Sanity = Math.min(100, l1Sanity + 4);
        l2Shield = Math.min(100, l2Shield + 3);
        l3Dividend += 12.50;

        // Apply To Real-Time UI Cards
        metricL1.textContent = `Sanity: ${l1Sanity}%`;
        metricL2.textContent = `Shield: ${l2Shield}%`;
        metricL3.textContent = `+$${l3Dividend.toFixed(2)}`;

        // Clear Red Alert if safety threshold reached
        if (l1Sanity > 60) {
            cardL1.classList.remove('alert');
        }

        // Evaluate Victory Condition
        if (l1Sanity >= 100 && l2Shield >= 100) {
            gameCleared = true;
            isHolding = false;
            shredderBtn.textContent = "DECENTRALIZED & SECURE";
            shredderBtn.style.borderColor = "var(--neon-green)";
            shredderBtn.style.color = "var(--neon-green)";
            walletPreview.classList.add('active');
            walletLabel.textContent = "CLAIM COFFEE COUPON";
            
            setTimeout(() => {
                alert("🎉 위기 극복 완료! 시맨틱 데이터가 완벽히 파쇄되어 익명 벡터 큐브로 전환되었습니다. 하이 스코어가 오프라인 커피 할인 QR 쿠폰(ZKP)으로 암호화 변환되었습니다!");
            }, 100);
        }
    }

    // 3. Render & Update Floating Toxic Plaintext Streams
    textNodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Boundary Elastic Bounce
        if (node.x < 10 || node.x > canvas.width - 120) node.vx *= -1;
        if (node.y < 20 || node.y > canvas.height - 20) node.vy *= -1;

        ctx.fillStyle = 'rgba(255, 51, 102, ' + node.alpha + ')';
        ctx.font = 'bold 11px monospace';
        ctx.shadowColor = 'var(--neon-red)';
        ctx.shadowBlur = 4;
        ctx.fillText(`⚠️ "${node.text}"`, node.x, node.y);
        ctx.shadowBlur = 0;
    });

    // 4. Render & Update Shimmering Vector Cubes
    vectorCubes.forEach((cube, index) => {
        cube.y -= cube.speed; // Float upward direction
        ctx.fillStyle = cube.color;
        ctx.shadowColor = cube.color;
        ctx.shadowBlur = 6;
        ctx.fillRect(cube.x, cube.y, cube.size, cube.size);
        ctx.shadowBlur = 0;

        // Garbage collection for offscreen cube instances
        if (cube.y < 0) {
            vectorCubes.splice(index, 1);
        }
    });

    requestAnimationFrame(loop);
}

// Initialize Execution Loop
loop();
