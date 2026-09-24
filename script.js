// ==========================================
// 1. DOM 엘리먼트 맵핑
// ==========================================
const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
const shredderBtn = document.getElementById('shredderBtn');
const energyBarFill = document.getElementById('energyBarFill');

// 상단 전광판 스탯 스크린 DOM
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
// 2. 애비스 배포용 하드코딩 피드백 데이터셋
// ==========================================
let isHolding = false;
let gameCleared = false;

let stats = {
    sanity: 24,       // [시작] 커피숍 멘탈 (목표: 74%)
    safety: 45,       // [시작] 인도 배달사고율 (목표: 88%)
    shield: 55,       // [시작] 리뷰 보안쉴드 (목표: 95%)
    loyalty: 310,     // [시작] 단골 손님 수 (목표: 610)
    overhead: 8,      // [시작] 소음 분쟁비용 (목표: 2%)
    dividend: 0,      // [시작] 누적 시너지 수익 (목표: \$1,280)
    energy: 45        // [시작] 에너지 바 퍼센트 (목표: 100%)
};

// 화면에 쏟아지는 악성 리뷰/분쟁 데이터 텍스트 목록
const chaosPhrases = [
    "악성 리뷰 테러 발생!", 
    "인도 주행 라이더 신고 접수", 
    "상인 정신건강 위험 수위", 
    "개인정보 노출 우려 차단 필요", 
    "플랫폼 분쟁 합의 비용 폭증", 
    "라이더-상인 갈등 폭발 직전"
];

let rawTextStreams = [];
let vectorCubes = [];

// 2D 클래식 타이쿤 상주 맵 노드 (오락실 스타일 배치)
const mapNodes = [
    { x: 50, y: 60, icon: '☕', label: '카페 본점' },
    { x: 120, y: 40, icon: '🏠', label: '단골집' },
    { x: 220, y: 70, icon: '🛵', label: '라이더' },
    { x: 80, y: 130, icon: '👤', label: '동네주민' },
    { x: 180, y: 110, icon: '👤', label: '대기손님' }
];

// ==========================================
// 3. 캔버스 리사이즈 
// ==========================================
function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resize);
resize();

// ==========================================
// 4. 분쟁 데이터 생성기
// ==========================================
function injectChaosNode() {
    if (isHolding || gameCleared || rawTextStreams.length > 6) return;
    
    rawTextStreams.push({
        x: Math.random() * (canvas.width - 160) + 40,
        y: Math.random() * (canvas.height - 80) + 40,
        text: chaosPhrases[Math.floor(Math.random() * chaosPhrases.length)],
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2
    });
}
setInterval(injectChaosNode, 900);

// ==========================================
// 5. 모바일 터치 및 클릭 이벤트 인터페이스
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

shredderBtn.addEventListener('mousedown', startShred);
shredderBtn.addEventListener('touchstart', startShred, { passive: false });
window.addEventListener('mouseup', stopShred);
window.addEventListener('touchend', stopShred);

// 2D 픽셀 스타일 쿠폰 매트릭스 그리기
function drawPixelCoupon() {
    const container = document.getElementById('qrContainer');
    container.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'qr-pixel';
        pixel.style.background = Math.random() > 0.5 ? '#fff' : '#000';
        container.appendChild(pixel);
    }
}
drawPixelCoupon();
setInterval(() => { if (!gameCleared) drawPixelCoupon(); }, 300);

// ==========================================
// 6. 메인 그래픽 렌더링 루프 (아케이드 가동 엔진)
// ==========================================
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 6A. 고전 게임용 백그라운드 격자 바닥 렌더링
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // 6B. 2D 아기자기한 이모지 마을 노드 배치
    mapNodes.forEach(node => {
        // 반응형 화면 비율 고려한 배치 스케일링
        let targetX = (node.x / 280) * (canvas.width - 60) + 30;
        let targetY = (node.y / 160) * (canvas.height - 60) + 30;

        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(node.icon, targetX, targetY);

        ctx.fillStyle = '#adb5bd';
        ctx.font = '9px monospace';
        ctx.fillText(node.label, targetX, targetY + 16);
    });

    // 6C. 텍스트 파쇄 홀드 처리부 (수치 변동 매커니즘 연동)
    if (isHolding && rawTextStreams.length > 0 && !gameCleared) {
        let currentTarget = rawTextStreams[0];

        // 텍스트가 2D 픽셀 파티클(큐브)로 깨지는 효과 생성
        for (let i = 0; i < 5; i++) {
            vectorCubes.push({
                x: currentTarget.x + (Math.random() - 0.5) * 30,
                y: currentTarget.y,
                size: Math.random() * 4 + 4,
                vy: -Math.random() * 5 - 3,
                color: Math.random() > 0.5 ? 'var(--arcade-green)' : 'var(--arcade-blue)'
            });
        }
        rawTextStreams.shift(); // 파쇄된 데이터 제거

        // 정확히 10번 전후 조작으로 목표치 도달하도록 고정 연산
        stats.sanity = Math.min(74, stats.sanity + 5);
        stats.safety = Math.min(88, stats.safety + 5);
        stats.shield = Math.min(95, stats.shield + 4);
        stats.loyalty = Math.min(610, stats.loyalty + 30);
        stats.overhead = Math.max(2, stats.overhead - 1);
        stats.dividend = Math.min(1280, stats.dividend + 128);
        stats.energy = Math.min(100, stats.energy + 6);

        // 상단 전광판 데이터 갱신
        mSanity.textContent = `${stats.sanity}%`;
        mSafety.textContent = `${stats.safety}%`;
        mShield.textContent = `${stats.shield}%`;
        mLoyalty.textContent = stats.loyalty;
        mOverhead.textContent = `${stats.overhead}%`;
        mDividend.textContent = `$${stats.dividend.toLocaleString()}`;

        // 에너지 바 UI 반영
        energyBarFill.style.width = `${stats.energy}%`;

        // 민심 위기 탈출 시 경광등 해제
        if (stats.sanity >= 50) cardL1.classList.remove('alert');

        // 클리어 조건 평가 (와이어프레임 데이터셋 매칭 완료)
        if (stats.dividend >= 1280 && stats.loyalty >= 610) {
            gameCleared = true;
            isHolding = false;
            shredderBtn.textContent = "영수증 쿠폰 발급 완료";
            shredderBtn.style.background = "var(--arcade-blue)";
            anonymousWallet.classList.add('active');
            walletLabel.textContent = "아메리카노 쿠폰";
            
            setTimeout(() => {
                alert("🎮 [STAGE CLEAR] 🎮\n\n모든 분쟁 텍스트를 완벽하게 파쇄하여 처리했습니다!\n- 동네 민심 정상화 완료\n- 단골 손님 610명 확보\n- 최종 정산 수익 \$1,280 달성\n\n우측 하단의 영수증 비밀 쿠폰이 활성화되었습니다. 애비스 단톡방에 후기를 남겨주세요!");
            }, 100);
        }
    }

    // 6D. 분쟁 데이터 텍스트 화면 렌더링
    rawTextStreams.forEach(stream => {
        stream.x += stream.vx;
        stream.y += stream.vy;

        // 벽 튕기기
        if (stream.x < 10 || stream.x > canvas.width - 130) stream.vx *= -1;
        if (stream.y < 20 || stream.y > canvas.height - 20) stream.vy *= -1;

        ctx.fillStyle = 'var(--arcade-red)';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`💥 ${stream.text}`, stream.x, stream.y);
    });

    // 6E. 위로 뿜어져 나가는 도트 파티클 연출 계산
    vectorCubes.forEach((cube, index) => {
        cube.y += cube.vy;
        ctx.fillStyle = cube.color;
        ctx.fillRect(cube.x, cube.y, cube.size, cube.size);

        // 화면 상단으로 사라지면 청소
        if (cube.y < 0) vectorCubes.splice(index, 1);
    });

    requestAnimationFrame(gameLoop);
}

// 게임 기동
gameLoop();
