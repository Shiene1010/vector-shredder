// ==========================================
// 1. GAME CORE STATE (메인프레임 상태 트리)
// ==========================================
const state = {
  mental: 24,       // 커피숍 멘탈 (시작 24%, 목표 100%)
  accident: 45,     // 인도 배달사고율 (시작 45%, 임계치 50%, 목표 0%)
  shield: 55,       // 리뷰 보안쉴드 (시작 55%, 목표 100%)
  customers: 310,   // 단골 손님 수 (시작 310 -> 목표 610)
  noise: 8,         // 소음 분쟁비용 (시작 8% -> 목표 2%)
  revenue: 0,       // 누적 시너지 수익 (시작 $0 -> 목표 $1,280)
  energy: 45,       // 복구 안정화 게이지
  isHolding: false, // 파쇄 버튼 홀드 여부
  holdTime: 0       // 홀드 지속 가속 시간 (t)
};

// ==========================================
// 2. DOM INTERFACE COMPONENT MAPPING
// ==========================================
const dom = {
  mainContainer: document.getElementById('main-container'),
  mental: document.getElementById('stat-mental'),
  accident: document.getElementById('stat-accident'),
  shield: document.getElementById('stat-shield'),
  customers: document.getElementById('stat-customers'),
  noise: document.getElementById('stat-noise'),
  revenue: document.getElementById('stat-revenue'),
  energyFill: document.getElementById('energy-fill'),
  btnShred: document.getElementById('btn-shred'),
  cardsContainer: document.getElementById('pollution-cards-container'),
  logBox: document.getElementById('log-stream-box'),
  agentsContainer: document.getElementById('rider-agents-pool'),
  viewport: document.getElementById('viewport-frame'),
  zkpBox: document.getElementById('zkp-box'),
  zkpText: document.getElementById('zkp-text'),
  canvas: document.getElementById('shred-canvas'),
  upgrades: {
    machine: document.getElementById('upgrade-machine'),
    bike: document.getElementById('upgrade-bike'),
    safety: document.getElementById('upgrade-safety')
  }
};

// ==========================================
// 3. CANVAS VORTEX GENERATOR (보셀 디졸브 소용돌이 흡입 엔진)
// ==========================================
const ctx = dom.canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  dom.canvas.width = dom.canvas.parentElement.clientWidth;
  dom.canvas.height = dom.canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 카드가 파쇄될 때 텍스트 글자들을 보셀(Voxel) 입자로 변환하는 스폰 함수
function spawnVoxelParticles(cardElement) {
  const cardRect = cardElement.getBoundingClientRect();
  const canvasRect = dom.canvas.getBoundingClientRect();
  
  // 카드의 상대 중심 좌표 계산
  const startX = cardRect.left - canvasRect.left + (cardRect.width / 2);
  const startY = cardRect.top - canvasRect.top + (cardRect.height / 2);

  for (let i = 0; i < 15; i++) {
    particles.push({
      x: startX + (Math.random() - 0.5) * 60,
      y: startY + (Math.random() - 0.5) * 30,
      size: Math.random() * 3 + 2, // 레고 블록 모양 보셀 픽셀
      color: 'var(--neon-red)',
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 20 + 10,
      speed: Math.random() * 2 + 2
    });
  }
}

function animateVortexEngine() {
  ctx.clearRect(0, 0, dom.canvas.width, dom.canvas.height);
  
  // 파쇄기 흡입 싱크홀 최종 타깃 좌표 (하단 버튼 중심 레이어)
  const targetX = dom.canvas.width / 2;
  const targetY = dom.canvas.height - 80;

  particles.forEach((p, idx) => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);

    if (state.isHolding) {
      // 나선형 볼텍스 중력 공식 연산 (v = g * t^2 가속 모델링 모킹)
      const dx = targetX - p.x;
      const dy = targetY - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 12) {
        // 완전 분쇄 지점 도달 시 불꽃 스파크 소멸 연출 및 계단식 햅틱 피드백 트리거
        particles.splice(idx, 1);
        triggerGranularHaptic(20);
        triggerShredAudioEffect();
      } else {
        // 소용돌이 회전각 및 끌어당기는 내향 벡터 가산
        p.angle += 0.12; 
        const attractionForce = (state.holdTime / 500) + 2.5; 
        p.x += (dx / distance) * attractionForce + Math.cos(p.angle) * p.speed;
        p.y += (dy / distance) * attractionForce + Math.sin(p.angle) * p.speed;
      }
    } else {
      // 평시에는 가볍게 허공으로 떠오르다 소멸
      p.y -= 0.5;
      if (p.y < 0) particles.splice(idx, 1);
    }
  });

  requestAnimationFrame(animateVortexEngine);
}

// ==========================================
// 4. HAPTIC & AUDIO MULTI-MIXER HOOK (손맛 제어 API)
// ==========================================
function triggerGranularHaptic(ms) {
  if (navigator.vibrate) {
    navigator.vibrate(ms);
  }
}

function triggerShredAudioEffect() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'triangle'; // 퍼퍼퍽 거친 디지털 크러시음 텍스처
    oscillator.frequency.setValueAtTime(Math.random() * 80 + 40, audioCtx.currentTime); 
    
    gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime); // 사운드 볼륨 제어 한계선
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.08);
  } catch(e) {}
}

// ==========================================
// 5. POLLUTION CARD DATA SOURCE & DISPATCH
// ==========================================
const pollutionPool = [
  { id: "p1", tag: "갑질주문", msg: "💬 '벨 누르지 말고 기어와라 숨소리도 내지 마'", step: "ingest" },
  { id: "p2", tag: "악질업주행태", msg: "🏭 '배달원 주제에 어디 감히 매장 내부로 들어와?'", step: "brew" },
  { id: "p3", tag: "보도주행", msg: "🛵 '알고리즘 시간 밀린다! 사람 비켜, 인도 질주!'", step: "dispatch" },
  { id: "p4", tag: "악평리뷰", msg: "📉 '별점 1점 테러: 커피에서 사람 냄새 남 환불해줘'", step: "ingest" }
];

function injectPollutionCard() {
  if (dom.cardsContainer.children.length >= 3 || state.isHolding) return;

  const data = pollutionPool[Math.floor(Math.random() * pollutionPool.length)];
  
  if (document.getElementById(data.id)) return;

  const card = document.createElement('div');
  card.className = 'pollution-card';
  card.id = data.id;
  card.dataset.step = data.step;
  card.innerHTML = `
    <div class="card-tag">${data.tag}</div>
    <div class="card-msg">${data.msg}</div>
  `;
  
  dom.cardsContainer.appendChild(card);
  addLogLine(`🚨 커뮤니티 훼손 요소 침투: [${data.tag}] 데이터 매핑 차단 시급!`, "error");

  highlightPipelineStation(data.step, true);
}

function highlightPipelineStation(stepId, isActive) {
  const stationMap = { ingest: 'station-ingest', brew: 'station-brew', dispatch: 'station-dispatch' };
  const target = document.getElementById(stationMap[stepId]);
  if (target) {
    if (isActive) target.classList.add('active');
    else target.classList.remove('active');
  }
}

function addLogLine(text, type) {
  const line = document.createElement('div');
  line.className = `log-line ${type}`;
  line.innerText = `> ${text}`;
  dom.logBox.insertBefore(line, dom.logBox.firstChild);
  if (dom.logBox.children.length > 8) dom.logBox.removeChild(dom.logBox.lastChild);
}

// ==========================================
// 6. 2D RIDER AGENT VECTOR RUNNER
// ==========================================
const riders = [];
function spawnRiderAgent() {
  const r = document.createElement('div');
  r.className = 'rider-node';
  r.innerText = '🛵';
  dom.agentsContainer.appendChild(r);
  riders.push({ el: r, x: Math.random() * 80 + 10, y: 15, speedX: (Math.random() - 0.5) * 2 });
}

function updateRiderAgents() {
  riders.forEach(r => {
    r.x += r.speedX;
    if (r.x < 5 || r.x > 95) r.speedX *= -1; // 벨트 폭 왕복 주행
    r.el.style.left = `${r.x}%`;
    r.el.style.top = `${r.y}%`;
  });
}

// ==========================================
// 7. QUANT HUD DATA SYNC & STABILIZATION CRITERIA
// ==========================================
function updateHUD() {
  dom.mental.innerText = `${state.mental}%`;
  dom.accident.innerText = `${state.accident}%`;
  dom.shield.innerText = `${state.shield}%`;
  dom.customers.innerText = state.customers;
  dom.noise.innerText = `${state.noise}%`;
  dom.revenue.innerText = `$${state.revenue.toLocaleString()}`;
  dom.energyFill.style.width = `${state.energy}%`;

  if (state.accident >= 50) dom.mainContainer.classList.add('critical-alert');
  else dom.mainContainer.classList.remove('critical-alert');

  // 최종 안정화 해시 릴리즈 조건 충족 연산
  if (state.revenue >= 1280 && state.noise <= 2 && state.customers >= 610) {
    dom.mainContainer.classList.remove('critical-alert');
    dom.mainContainer.classList.add('stabilized');
    dom.zkpBox.classList.add('active');
    dom.zkpText.innerText = "🎟️ 영수증 발급완료";
  } else {
    dom.mainContainer.classList.remove('stabilized');
    dom.zkpBox.classList.remove('active');
    dom.zkpText.innerText = "쿠폰 준비중";
  }
}

// ==========================================
// 8. INTERACTION HANDLER & HOLD ATTRACT PROCOLS
// ==========================================
function startAbsorbHold(e) {
  e.preventDefault();
  state.isHolding = true;
  dom.btnShred.classList.add('absorbing');
  triggerGranularHaptic(30);
}

function endAbsorbHold() {
  state.isHolding = false;
  dom.btnShred.classList.remove('absorbing');
  state.holdTime = 0;
  
  const activeCards = dom.cardsContainer.querySelectorAll('.pollution-card');
  activeCards.forEach(c => c.classList.remove('shredding-glitch'));
}

dom.btnShred.addEventListener('mousedown', startAbsorbHold);
dom.btnShred.addEventListener('mouseup', endAbsorbHold);
dom.btnShred.addEventListener('mouseleave', endAbsorbHold);
dom.btnShred.addEventListener('touchstart', startAbsorbHold);
dom.btnShred.addEventListener('touchend', endAbsorbHold);

// ==========================================
// 9. UPGRADE LOGIC ACTION BINDING (인프라 고도화 시스템)
// ==========================================
let machineLv = 1, bikeLv = 1, infraActive = false;
const upgradeCosts = { machine: 150, bike: 200, infra: 400 };

dom.upgrades.machine.addEventListener('click', () => {
  if (state.revenue >= upgradeCosts.machine && machineLv < 5) {
    state.revenue -= upgradeCosts.machine; machineLv++;
    upgradeCosts.machine = Math.floor(upgradeCosts.machine * 1.5);
    dom.upgrades.machine.querySelector('.status').innerText = `Lv.${machineLv}`;
    addLogLine(`🛠️ [인프라] 초고속 머신 Lv.${machineLv} 도입. 상인 번아웃 저항 가산.`, "success");
    state.mental = Math.min(100, state.mental + 15);
    updateHUD();
  }
});

dom.upgrades.bike.addEventListener('click', () => {
  if (state.revenue >= upgradeCosts.bike && bikeLv < 5) {
    state.revenue -= upgradeCosts.bike; bikeLv++;
    upgradeCosts.bike = Math.floor(upgradeCosts.bike * 1.6);
    dom.upgrades.bike.querySelector('.status').innerText = `Lv.${bikeLv}`;
    spawnRiderAgent(); // 신규 자원 물리 에이전트 동적 분기 스폰
    addLogLine(`🛠️ [인프라] 고성능 배달바이크 기단 확충 완료 (에이전트 추가)`, "success");
    updateHUD();
  }
});

dom.upgrades.safety.addEventListener('click', () => {
  if (state.revenue >= upgradeCosts.infra && !infraActive) {
    state.revenue -= upgradeCosts.infra; infraActive = true;
    dom.upgrades.safety.querySelector('.status').innerText = `ACTIVE`;
    dom.upgrades.safety.style.borderColor = 'var(--neon-green)';
    state.accident = Math.max(0, state.accident - 25);
    state.noise = Math.max(2, state.noise - 3);
    addLogLine(`🛣️ [시빅테크] 인도안전구역 도입 (갈등 확률 50% 영구 감쇄 프로토콜 가동)`, "success");
    updateHUD();
  }
});

// ==========================================
// 10. SYSTEM TICK TICK ENGINE RUN (100ms FPS 실시간 관제 연산 가동)
// ==========================================
setInterval(() => {
  updateRiderAgents();

  if (state.isHolding) {
    state.holdTime += 100;
    
    if (state.holdTime % 200 === 0) triggerGranularHaptic(30);

    const activeCards = dom.cardsContainer.querySelectorAll('.pollution-card');
    
    if (activeCards.length > 0) {
      const targetCard = activeCards[0]; // 가장 오래 큐에 체증된 첫 번째 타깃 카드 고정
      targetCard.classList.add('shredding-glitch');
      
      spawnVoxelParticles(targetCard);

      if (state.holdTime > 300) {
        state.energy = Math.min(100, state.energy + 2);
        
        const reductionFactor = infraActive ? 2 : 1;
        state.accident = Math.max(0, state.accident - (1 * reductionFactor));
        state.noise = Math.max(2, state.noise - (0.5 * reductionFactor));
        state.mental = Math.min(100, state.mental + (1 * (1 + machineLv * 0.2)));

        if (Math.random() < 0.22) {
          state.customers = Math.min(610, state.customers + Math.floor(12 * (1 + bikeLv * 0.15)));
          state.revenue = Math.min(1280, state.revenue + Math.floor(45 * (1 + machineLv * 0.2)));
          
          const clearedTag = targetCard.querySelector('.card-tag').innerText;
          addLogLine(`⚡ [벡터 공간 정화] [${clearedTag}] 오염 텍스트 완파 성공.`, "success");
          
          highlightPipelineStation(targetCard.dataset.step, false);
          targetCard.remove();
        }
        updateHUD();
      }
    } else {
      state.energy = Math.min(100, state.energy + 1);
      updateHUD();
    }
  } else {
    const spawnChance = infraActive ? 0.02 : 0.04;
    if (Math.random() < spawnChance) {
      injectPollutionCard();
    }
  }
}, 100);

// ==========================================
// 11. ENGINE INITIALIZATION START
// ==========================================
for (let i = 0; i < 2; i++) spawnRiderAgent();
animateVortexEngine();
addLogLine("MAIN_FRAME CORE_KERNEL V3.5 ONLINE. STANDBY MONITORING Center...", "success");
updateHUD();
