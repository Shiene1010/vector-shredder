// ==========================================
// 1. GAME CORE STATE (시스템 상태 트리)
// ==========================================
const state = {
  mental: 24,       // 커피숍 멘탈 (시작: 24%, 목표: 100%)
  accident: 45,     // 인도 배달사고율 (시작: 45%, 목표: 0%)
  shield: 55,       // 리뷰 보안쉴드 (시작: 55%, 목표: 100%)
  customers: 310,   // 단골 손님 수 (시작: 310명, 목표: 610명)
  noise: 8,         // 소음 분쟁비용 (시작: 8%, 목표: 2%)
  revenue: 0,       // 누적 시너지 수익 (시작: \$0, 목표: \$1,280)
  energy: 45,       // 임계 회복 에너지 게이지
  isHolding: false, // 파쇄 버튼 홀드 여부
  holdTime: 0       // 홀드 지속 시간 (밀리초)
};

// ==========================================
// 2. DOM ELEMENTS MAPPING (인터페이스 바인딩)
// ==========================================
const dom = {
  mental: document.getElementById('stat-mental'),
  accident: document.getElementById('stat-accident'),
  shield: document.getElementById('stat-shield'),
  customers: document.getElementById('stat-customers'),
  noise: document.getElementById('stat-noise'),
  revenue: document.getElementById('stat-revenue'),
  energyFill: document.getElementById('energy-fill'),
  btnShred: document.getElementById('btn-shred'),
  logBox: document.getElementById('log-stream-box'),
  agentsContainer: document.getElementById('dynamic-agents'),
  mapFrame: document.getElementById('map-frame'),
  svgRoutes: document.getElementById('vector-svg-routes'),
  zkpBox: document.getElementById('zkp-box'),
  zkpText: document.getElementById('zkp-text'),
  canvas: document.getElementById('shred-canvas')
};

// ==========================================
// 3. CANVAS PARTICLE ENGINE (파쇄 파티클 렌더러)
// ==========================================
const ctx = dom.canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  dom.canvas.width = dom.canvas.parentElement.clientWidth;
  dom.canvas.height = dom.canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function spawnShredParticles() {
  // 터미널 및 중앙 버퍼 영역에서 흡입구로 빨려 들어가는 픽셀 입자 생성
  for (let i = 0; i < 5; i++) {
    particles.push({
      x: Math.random() * dom.canvas.width,
      y: dom.canvas.height * 0.4 + (Math.random() * 50),
      size: Math.random() * 4 + 2,
      color: Math.random() > 0.5 ? 'var(--neon-red)' : 'var(--neon-yellow)',
      speedY: (Math.random() * 3 + 2)
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, dom.canvas.width, dom.canvas.height);
  
  if (state.isHolding) {
    spawnShredParticles();
  }

  particles.forEach((p, idx) => {
    ctx.fillStyle = p.color;
    // 사이버펑크 2D 네온 큐브 사각형 렌더링
    ctx.fillRect(p.x, p.y, p.size, p.size);
    
    // 파쇄 중심 축(하단)으로 수렴 및 낙하 가속도 계산
    p.y += p.speedY;
    p.x += (dom.canvas.width / 2 - p.x) * 0.05;

    if (p.y > dom.canvas.height) {
      particles.splice(idx, 1);
    }
  });

  requestAnimationFrame(animateParticles);
}

// ==========================================
// 4. DATA LOG STREAM ENGINE (텍스트 스트림 버퍼)
// ==========================================
const rawIssues = [
  { text: "⚠️ [인도주행] 배달 오토바이 보행자 아슬아슬하게 추월 분쟁!", type: "error" },
  { text: "💥 [충돌위험] 인도 안전구역 내 주행 속도 위반!", type: "error" },
  { text: "📢 [골목소음] 카페 본점 앞 오토바이 공회전 주민 항의!", type: "warn" },
  { text: "🔥 [상인번아웃] '분당 5건 제조는 무리!' 커피숍 멘탈 붕괴 위기", type: "warn" },
  { text: "🛑 [알고리즘 분쟁] 배달료 정산 기준 단가 타협 불일치 폭동 직전", type: "error" },
  { text: "📉 [악성리뷰] '식어서 도착함' 별점 테러 발생 데이터 침투", type: "info" }
];

const successLogs = [
  { text: "✅ [시너지] 텍스트 매핑 완화 격자 안전성 복구 완료", type: "success" },
  { text: "⚡ [벡터 인텔리전스] 익명 좌표계 변환 성공 효율 누적", type: "success" },
  { text: "💵 [정산] 소음 합의 비용 분기 절감액 국고 전환", type: "success" }
];

function addLogLine(text, type) {
  const line = document.createElement('div');
  line.className = `log-line ${type}`;
  line.innerText = `> ${text}`;
  dom.logBox.insertBefore(line, dom.logBox.firstChild);
  
  // 가독성 확보를 위한 최대 스크롤 버퍼 18줄 고정
  if (dom.logBox.children.length > 18) {
    dom.logBox.removeChild(dom.logBox.lastChild);
  }
}

// ==========================================
// 5. 2D VECTOR MULTI-AGENT SIMULATION
// ==========================================
const riders = [];
const citizens = [];

function spawnInitialAgents() {
  // 다중 라이더 에이전트 인스턴스화
  for (let i = 0; i < 2; i++) {
    const r = document.createElement('div');
    r.className = 'rider-agent';
    r.innerText = '🛵';
    dom.agentsContainer.appendChild(r);
    riders.push({ el: r, x: 25, y: 55, targetX: 35, targetY: 30, speed: 1.5 + Math.random() });
  }
  // 무작위 동네 주민 배회 개체 인스턴스화
  for (let i = 0; i < 3; i++) {
    const c = document.createElement('div');
    c.className = 'citizen-agent';
    c.innerText = ['🚶', '🏃', '🧍'][Math.floor(Math.random() * 3)];
    dom.agentsContainer.appendChild(c);
    citizens.push({ el: c, x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
  }
}

function updateSimulation() {
  // 라이더 가중치 경로 탐색 및 타깃 이동 연산
  riders.forEach(r => {
    const dx = r.targetX - r.x;
    const dy = r.targetY - r.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 2) {
      if (r.targetX === 35) {
        r.targetX = Math.random() * 80 + 10;
        r.targetY = Math.random() * 80 + 10;
      } else {
        r.targetX = 35; r.targetY = 30; // 본점 회귀 경로
      }
    } else {
      r.x += (dx / dist) * r.speed;
      r.y += (dy / dist) * r.speed;
    }
    r.el.style.left = `${r.x}%`;
    r.el.style.top = `${r.y}%`;

    // 파쇄 액션 비활성화 상태일 때 주민과의 근접도에 따른 충돌 및 이슈 제너레이터
    citizens.forEach(c => {
      const prox = Math.sqrt(Math.pow(r.x - c.x, 2) + Math.pow(r.y - c.y, 2));
      if (prox < 6 && Math.random() < 0.04 && !state.isHolding) {
        triggerConflict(r.x, r.y);
      }
    });
  });

  // 주민 랜덤 워크(Random Walk) 연산
  citizens.forEach(c => {
    if (Math.random() < 0.1) {
      c.x += (Math.random() - 0.5) * 4;
      c.y += (Math.random() - 0.5) * 4;
      c.x = Math.max(10, Math.min(90, c.x));
      c.y = Math.max(10, Math.min(90, c.y));
    }
    c.el.style.left = `${c.x}%`;
    c.el.style.top = `${c.y}%`;
  });

  // 실시간 빅데이터 벡터 라인 드로잉
  if (riders.length > 0) {
    dom.svgRoutes.innerHTML = `<line x1="${riders[0].x}%" y1="${riders[0].y}%" x2="${riders[0].targetX}%" y2="${riders[0].targetY}%" stroke="rgba(0,163,255,0.4)" stroke-width="1.5" stroke-dasharray="3 3"/>`;
  }
}

function triggerConflict(mx, my) {
  const bub = document.createElement('div');
  bub.className = 'conflict-bubble';
  bub.style.left = `${mx}%`;
  bub.style.top = `${my}%`;
  bub.innerText = "🚨 갈등 스파크!";
  dom.mapFrame.appendChild(bub);
  setTimeout(() => bub.remove(), 1200);

  // 실시간 인간 번아웃 페널티 역치 가산
  state.accident = Math.min(100, state.accident + Math.floor(Math.random() * 4 + 2));
  state.noise = Math.min(100, state.noise + Math.floor(Math.random() * 2 + 1));
  state.mental = Math.max(0, state.mental - Math.floor(Math.random() * 3 + 1));
  
  const issue = rawIssues[Math.floor(Math.random() * rawIssues.length)];
  addLogLine(issue.text, issue.type);
  updateHUD();
}

// ==========================================
// 6. HUD REAL-TIME STATS COUPLING
// ==========================================
function updateHUD() {
  dom.mental.innerText = `${state.mental}%`;
  dom.accident.innerText = `${state.accident}%`;
  dom.shield.innerText = `${state.shield}%`;
  dom.customers.innerText = state.customers;
  dom.noise.innerText = `${state.noise}%`;
  dom.revenue.innerText = `$${state.revenue.toLocaleString()}`;
  dom.energyFill.style.width = `${state.energy}%`;

  // 승리 조건 체크 (영지식 증명 QR 영수증 인디케이터 바인딩)
  if (state.revenue >= 1280 && state.noise <= 2 && state.customers >= 610) {
    dom.zkpBox.className = "zkp-receipt-box ready";
    dom.zkpText.innerText = "🎟️ 영수증 발급완료";
  } else {
    dom.zkpBox.className = "zkp-receipt-box";
    dom.zkpText.innerText = "쿠폰 준비중";
  }
}

// ==========================================
// 7. HOLD MECHANICS & BALANCE FORMULA INTERRUPT
// ==========================================
function startHold() {
  state.isHolding = true;
  dom.btnShred.classList.add('holding');
}

function endHold() {
  state.isHolding = false;
  dom.btnShred.classList.remove('holding');
  state.holdTime = 0;
}

dom.btnShred.addEventListener('mousedown', startHold);
dom.btnShred.addEventListener('mouseup', endHold);
dom.btnShred.addEventListener('mouseleave', endHold);
dom.btnShred.addEventListener('touchstart', (e) => { e.preventDefault(); startHold(); });
dom.btnShred.addEventListener('touchend', endHold);

// CORE TICK LOOP (100ms FRAME)
setInterval(() => {
  updateSimulation();

  if (state.isHolding) {
    state.holdTime += 100;
    
    // 홀드 지속 시간(t) 가속도 공식에 따른 정량 감쇄 및 복구
    if (state.holdTime > 200) {
      state.energy = Math.min(100, state.energy + 1);
      state.accident = Math.max(0, state.accident - 1);
      state.noise = Math.max(2, state.noise - 1); 
      state.mental = Math.min(100, state.mental + 1);
      
      if (Math.random() < 0.15) {
        state.customers = Math.min(610, state.customers + 10);
        state.revenue = Math.min(1280, state.revenue + 40);
        
        const slog = successLogs[Math.floor(Math.random() * successLogs.length)];
        addLogLine(slog.text, slog.type);
      }
      updateHUD();
    }
  } else {
    // 유휴 상태일 때 백그라운드 환경 변수 침투 확률 연산
    if (Math.random() < 0.015) {
      const issue = rawIssues[Math.floor(Math.random() * rawIssues.length)];
      addLogLine(issue.text, issue.type);
    }
  }
}, 100);

// ==========================================
// 8. ENGINE INITIALIZATION (구동 초기화)
// ==========================================
spawnInitialAgents();
animateParticles();
addLogLine("SYSTEM INGESTION INITIALIZED. STANDBY ORDERING...", "info");
addLogLine("⚠️ PIPELINE EXGEST ALERT: SIDEWALK CONFLICT DETECTED.", "error");
updateHUD();
