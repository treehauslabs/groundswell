// ========================================
// GROUNDSWELL — Main JavaScript
// SVG Product Illustrations + Interactivity
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  renderHeroFence();
  renderFenceScene();
  renderStepIllustrations();
  renderAlignmentDiagram();
  renderEcosystemCards();
  renderCrossSection();
  renderPlatformDiagram();
  initCalculator();
  initNav();
});

// ---- Color Constants ----
const C = {
  post: '#1a1a1a',
  postHighlight: '#2a2a2a',
  postEdge: '#333',
  glass: '#1a2a3f',
  glassShine: 'rgba(100,160,220,0.15)',
  glassEdge: '#0d1a2a',
  ground: '#2a3a1a',
  groundDark: '#1e2a12',
  sky: '#1a1a3e',
  copper: '#B87333',
  copperLight: '#D4945A',
  screw: '#555',
  screwHelix: '#666',
  gasket: '#333',
  white08: 'rgba(255,255,255,0.08)',
  white15: 'rgba(255,255,255,0.15)',
  white03: 'rgba(255,255,255,0.03)',
  label: '#888',
  grass1: '#2d4a18',
  grass2: '#3a5a22',
};

// ---- SVG Helper ----
function svg(w, h, content, cls = '') {
  return `<svg class="svg-illustration ${cls}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
}

// ---- Hero Fence (silhouette against sunset) ----
function renderHeroFence() {
  const el = document.getElementById('heroFence');
  if (!el) return;

  const W = 1000, H = 300;
  const postW = 12, panelH = 200, panelW = 130, clearance = 30;
  const groundY = H - 20;
  const panelTop = groundY - clearance - panelH;
  const numPanels = 6;
  const startX = (W - (numPanels * (panelW + postW) + postW)) / 2;

  let panels = '';
  for (let i = 0; i <= numPanels; i++) {
    const x = startX + i * (panelW + postW);
    // Post
    panels += `<rect x="${x}" y="${panelTop - 10}" width="${postW}" height="${panelH + clearance + 20}" rx="1" fill="#111" opacity="0.9"/>`;
    // Post cap
    panels += `<rect x="${x - 2}" y="${panelTop - 14}" width="${postW + 4}" height="5" rx="1" fill="#1a1a1a"/>`;

    if (i < numPanels) {
      // Panel glass
      const px = x + postW;
      panels += `<rect x="${px}" y="${panelTop}" width="${panelW}" height="${panelH}" fill="${C.glass}" opacity="0.85"/>`;
      // Glass reflections
      panels += `<rect x="${px + 5}" y="${panelTop + 5}" width="${panelW - 10}" height="${panelH - 10}" fill="none" stroke="${C.glassShine}" stroke-width="0.5" rx="1"/>`;
      // Subtle grid lines on panel
      for (let r = 1; r < 6; r++) {
        panels += `<line x1="${px}" y1="${panelTop + r * (panelH / 6)}" x2="${px + panelW}" y2="${panelTop + r * (panelH / 6)}" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/>`;
      }
      for (let c = 1; c < 4; c++) {
        panels += `<line x1="${px + c * (panelW / 4)}" y1="${panelTop}" x2="${px + c * (panelW / 4)}" y2="${panelTop + panelH}" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/>`;
      }
    }
  }

  // Ground line
  let ground = `<rect x="0" y="${groundY}" width="${W}" height="${H - groundY}" fill="${C.groundDark}" opacity="0.5"/>`;

  // Grass tufts
  let grass = '';
  for (let i = 0; i < 50; i++) {
    const gx = Math.random() * W;
    const gh = 5 + Math.random() * 15;
    grass += `<line x1="${gx}" y1="${groundY}" x2="${gx + (Math.random() - 0.5) * 4}" y2="${groundY - gh}" stroke="${Math.random() > 0.5 ? C.grass1 : C.grass2}" stroke-width="1" opacity="${0.3 + Math.random() * 0.4}"/>`;
  }

  el.innerHTML = svg(W, H, ground + grass + panels);
}

// ---- Fence Scene (product detail) ----
function renderFenceScene() {
  const el = document.getElementById('fenceScene');
  if (!el) return;

  const W = 600, H = 450;
  const postW = 18, panelH = 260, panelW = 160, clearance = 40;
  const groundY = H - 60;
  const panelTop = groundY - clearance - panelH;

  let content = '';

  // Background gradient
  content += `<defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0e1a"/>
      <stop offset="60%" stop-color="#1a2a3f"/>
      <stop offset="100%" stop-color="#2a3a1a"/>
    </linearGradient>
    <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a2a3f"/>
      <stop offset="50%" stop-color="#15253a"/>
      <stop offset="100%" stop-color="#1a2a3f"/>
    </linearGradient>
    <linearGradient id="copperGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${C.copperLight}"/>
      <stop offset="100%" stop-color="${C.copper}"/>
    </linearGradient>
  </defs>`;

  content += `<rect width="${W}" height="${H}" fill="url(#skyGrad)"/>`;

  // Ground
  content += `<rect x="0" y="${groundY}" width="${W}" height="${H - groundY}" fill="${C.groundDark}"/>`;
  content += `<line x1="0" y1="${groundY}" x2="${W}" y2="${groundY}" stroke="${C.grass1}" stroke-width="2"/>`;

  // Draw 3 panels with 4 posts
  const numPanels = 3;
  const totalW = numPanels * panelW + (numPanels + 1) * postW;
  const startX = (W - totalW) / 2;

  for (let i = 0; i <= numPanels; i++) {
    const px = startX + i * (panelW + postW);

    // Ground screw (visible below ground)
    const screwX = px + postW / 2;
    content += `<line x1="${screwX}" y1="${groundY}" x2="${screwX}" y2="${groundY + 40}" stroke="${C.screw}" stroke-width="4" stroke-linecap="round"/>`;
    // Helix suggestion
    content += `<ellipse cx="${screwX}" cy="${groundY + 35}" rx="10" ry="3" fill="none" stroke="${C.screwHelix}" stroke-width="1.5"/>`;

    // Post body
    content += `<rect x="${px}" y="${panelTop - 10}" width="${postW}" height="${panelH + clearance + 15}" rx="1" fill="${C.post}" stroke="${C.postEdge}" stroke-width="0.5"/>`;
    // Post highlight edge
    content += `<rect x="${px + 1}" y="${panelTop - 10}" width="3" height="${panelH + clearance + 15}" fill="${C.postHighlight}" opacity="0.5"/>`;

    // Post cap
    content += `<rect x="${px - 2}" y="${panelTop - 16}" width="${postW + 4}" height="7" rx="1.5" fill="${C.post}" stroke="${C.postEdge}" stroke-width="0.5"/>`;

    // Channel indicators (subtle grooves)
    content += `<line x1="${px}" y1="${panelTop}" x2="${px}" y2="${panelTop + panelH}" stroke="${C.gasket}" stroke-width="1.5"/>`;
    content += `<line x1="${px + postW}" y1="${panelTop}" x2="${px + postW}" y2="${panelTop + panelH}" stroke="${C.gasket}" stroke-width="1.5"/>`;

    if (i < numPanels) {
      const glassX = px + postW;

      // Panel glass
      content += `<rect x="${glassX}" y="${panelTop}" width="${panelW}" height="${panelH}" fill="url(#glassGrad)" rx="1"/>`;

      // Glass cell grid (subtle)
      for (let r = 1; r < 8; r++) {
        content += `<line x1="${glassX}" y1="${panelTop + r * (panelH / 8)}" x2="${glassX + panelW}" y2="${panelTop + r * (panelH / 8)}" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>`;
      }
      for (let c = 1; c < 5; c++) {
        content += `<line x1="${glassX + c * (panelW / 5)}" y1="${panelTop}" x2="${glassX + c * (panelW / 5)}" y2="${panelTop + panelH}" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>`;
      }

      // Glass reflection
      content += `<rect x="${glassX + 8}" y="${panelTop + 8}" width="${panelW * 0.3}" height="${panelH * 0.4}" fill="rgba(255,255,255,0.03)" rx="2"/>`;

      // EPDM gasket lines (where glass meets post)
      content += `<line x1="${glassX}" y1="${panelTop}" x2="${glassX}" y2="${panelTop + panelH}" stroke="${C.gasket}" stroke-width="2"/>`;
      content += `<line x1="${glassX + panelW}" y1="${panelTop}" x2="${glassX + panelW}" y2="${panelTop + panelH}" stroke="${C.gasket}" stroke-width="2"/>`;
    }
  }

  // Dimension labels
  const midPanel = startX + postW + panelW / 2;

  // "150W" label on center panel
  content += `<text x="${startX + postW + panelW + postW + panelW / 2}" y="${panelTop + panelH / 2}" text-anchor="middle" fill="rgba(255,255,255,0.25)" font-size="14" font-weight="700" font-family="Inter, sans-serif">150W</text>`;

  // Height dimension
  const dimX = startX - 30;
  content += `<line x1="${dimX}" y1="${panelTop}" x2="${dimX}" y2="${panelTop + panelH}" stroke="${C.copper}" stroke-width="1" opacity="0.5"/>`;
  content += `<line x1="${dimX - 5}" y1="${panelTop}" x2="${dimX + 5}" y2="${panelTop}" stroke="${C.copper}" stroke-width="1" opacity="0.5"/>`;
  content += `<line x1="${dimX - 5}" y1="${panelTop + panelH}" x2="${dimX + 5}" y2="${panelTop + panelH}" stroke="${C.copper}" stroke-width="1" opacity="0.5"/>`;
  content += `<text x="${dimX}" y="${panelTop + panelH / 2}" text-anchor="middle" fill="${C.copper}" font-size="10" font-family="Inter, sans-serif" transform="rotate(-90 ${dimX} ${panelTop + panelH / 2})" opacity="0.7">5 ft panel</text>`;

  // Grass details
  for (let i = 0; i < 80; i++) {
    const gx = Math.random() * W;
    const gh = 3 + Math.random() * 12;
    content += `<line x1="${gx}" y1="${groundY}" x2="${gx + (Math.random() - 0.5) * 3}" y2="${groundY - gh}" stroke="${Math.random() > 0.5 ? C.grass1 : C.grass2}" stroke-width="1" opacity="${0.2 + Math.random() * 0.4}"/>`;
  }

  el.innerHTML = svg(W, H, content);
}

// ---- Step Illustrations ----
function renderStepIllustrations() {
  renderStepDrive();
  renderStepPost();
  renderStepPanel();
  renderStepConnect();
}

function renderStepDrive() {
  const el = document.getElementById('stepDrive');
  if (!el) return;
  const W = 240, H = 240;
  let c = '';
  // Ground
  c += `<rect x="0" y="140" width="${W}" height="100" fill="${C.groundDark}"/>`;
  c += `<line x1="0" y1="140" x2="${W}" y2="140" stroke="${C.grass1}" stroke-width="2"/>`;
  // Screw shaft going into ground
  c += `<rect x="115" y="80" width="10" height="100" fill="${C.screw}" rx="2"/>`;
  // Helix blades
  c += `<ellipse cx="120" cy="155" rx="20" ry="5" fill="none" stroke="${C.screwHelix}" stroke-width="2.5"/>`;
  c += `<ellipse cx="120" cy="170" rx="16" ry="4" fill="none" stroke="${C.screwHelix}" stroke-width="2" opacity="0.6"/>`;
  // Impact driver (above screw)
  c += `<rect x="107" y="40" width="26" height="45" rx="4" fill="${C.copper}"/>`;
  c += `<rect x="112" y="28" width="16" height="16" rx="3" fill="${C.copperLight}"/>`;
  // Handle
  c += `<rect x="130" y="50" width="30" height="14" rx="3" fill="${C.copper}"/>`;
  // Rotation arrow
  c += `<path d="M 95 70 A 30 30 0 0 1 145 70" fill="none" stroke="${C.copperLight}" stroke-width="2" stroke-dasharray="4 3"/>`;
  c += `<polygon points="145,65 145,75 152,70" fill="${C.copperLight}"/>`;
  // Label
  c += `<text x="120" y="220" text-anchor="middle" fill="${C.label}" font-size="11" font-family="Inter, sans-serif">3 minutes</text>`;
  el.innerHTML = svg(W, H, c);
}

function renderStepPost() {
  const el = document.getElementById('stepPost');
  if (!el) return;
  const W = 240, H = 240;
  let c = '';
  c += `<rect x="0" y="160" width="${W}" height="80" fill="${C.groundDark}"/>`;
  c += `<line x1="0" y1="160" x2="${W}" y2="160" stroke="${C.grass1}" stroke-width="2"/>`;
  // Screw stub above ground
  c += `<rect x="115" y="130" width="10" height="40" fill="${C.screw}" rx="1"/>`;
  // Screw below ground
  c += `<rect x="115" y="160" width="10" height="40" fill="${C.screw}" rx="1" opacity="0.4"/>`;
  // Post (sliding down, shown with gap)
  c += `<rect x="108" y="30" width="24" height="95" rx="2" fill="${C.post}" stroke="${C.postEdge}" stroke-width="1"/>`;
  // Post cap
  c += `<rect x="105" y="24" width="30" height="8" rx="2" fill="${C.post}" stroke="${C.postEdge}" stroke-width="0.5"/>`;
  // Channel grooves on post
  c += `<line x1="110" y1="35" x2="110" y2="120" stroke="${C.gasket}" stroke-width="1.5"/>`;
  c += `<line x1="130" y1="35" x2="130" y2="120" stroke="${C.gasket}" stroke-width="1.5"/>`;
  // Downward arrow
  c += `<line x1="120" y1="125" x2="120" y2="128" stroke="${C.copperLight}" stroke-width="2" stroke-dasharray="3 2"/>`;
  c += `<polygon points="115,128 125,128 120,135" fill="${C.copperLight}"/>`;
  // Bolt indicator
  c += `<circle cx="100" cy="140" r="3" fill="${C.copper}"/>`;
  c += `<line x1="103" y1="140" x2="108" y2="140" stroke="${C.copper}" stroke-width="1.5"/>`;
  c += `<text x="120" y="220" text-anchor="middle" fill="${C.label}" font-size="11" font-family="Inter, sans-serif">1 minute</text>`;
  el.innerHTML = svg(W, H, c);
}

function renderStepPanel() {
  const el = document.getElementById('stepPanel');
  if (!el) return;
  const W = 240, H = 240;
  let c = '';
  c += `<rect x="0" y="175" width="${W}" height="65" fill="${C.groundDark}"/>`;
  c += `<line x1="0" y1="175" x2="${W}" y2="175" stroke="${C.grass1}" stroke-width="2"/>`;
  // Two posts (already installed)
  c += `<rect x="50" y="45" width="18" height="140" rx="1" fill="${C.post}" stroke="${C.postEdge}" stroke-width="0.5"/>`;
  c += `<rect x="172" y="45" width="18" height="140" rx="1" fill="${C.post}" stroke="${C.postEdge}" stroke-width="0.5"/>`;
  // Post caps
  c += `<rect x="47" y="39" width="24" height="7" rx="1.5" fill="${C.post}"/>`;
  c += `<rect x="169" y="39" width="24" height="7" rx="1.5" fill="${C.post}"/>`;
  // Panel (being lowered — shown slightly above final position)
  c += `<rect x="68" y="25" width="104" height="130" fill="${C.glass}" rx="1" opacity="0.9"/>`;
  // Glass reflection
  c += `<rect x="73" y="30" width="30" height="50" fill="rgba(255,255,255,0.04)" rx="2"/>`;
  // Downward arrows on both sides
  c += `<polygon points="63,55 63,75 58,65" fill="${C.copperLight}" opacity="0.8"/>`;
  c += `<polygon points="177,55 177,75 182,65" fill="${C.copperLight}" opacity="0.8"/>`;
  // Arrow down center
  c += `<line x1="120" y1="10" x2="120" y2="22" stroke="${C.copperLight}" stroke-width="2"/>`;
  c += `<polygon points="115,22 125,22 120,28" fill="${C.copperLight}"/>`;
  c += `<text x="120" y="220" text-anchor="middle" fill="${C.label}" font-size="11" font-family="Inter, sans-serif">self-aligning</text>`;
  el.innerHTML = svg(W, H, c);
}

function renderStepConnect() {
  const el = document.getElementById('stepConnect');
  if (!el) return;
  const W = 240, H = 240;
  let c = '';
  c += `<rect x="0" y="175" width="${W}" height="65" fill="${C.groundDark}"/>`;
  c += `<line x1="0" y1="175" x2="${W}" y2="175" stroke="${C.grass1}" stroke-width="2"/>`;
  // Post with panel (complete)
  c += `<rect x="105" y="40" width="18" height="140" rx="1" fill="${C.post}" stroke="${C.postEdge}" stroke-width="0.5"/>`;
  c += `<rect x="102" y="34" width="24" height="7" rx="1.5" fill="${C.post}"/>`;
  // Panel to right
  c += `<rect x="123" y="50" width="80" height="120" fill="${C.glass}" rx="1"/>`;
  // Panel to left
  c += `<rect x="37" y="50" width="68" height="120" fill="${C.glass}" rx="1"/>`;
  // Cap highlight (being placed)
  c += `<rect x="102" y="34" width="24" height="7" rx="1.5" fill="${C.copper}" opacity="0.6"/>`;
  // DC cable at base
  c += `<path d="M 114 180 Q 114 190 130 190 L 160 190" fill="none" stroke="${C.copper}" stroke-width="2.5" stroke-linecap="round"/>`;
  // Click indicator
  c += `<circle cx="114" cy="178" r="5" fill="none" stroke="${C.copperLight}" stroke-width="1.5"/>`;
  c += `<circle cx="114" cy="178" r="2" fill="${C.copperLight}"/>`;
  c += `<text x="120" y="220" text-anchor="middle" fill="${C.label}" font-size="11" font-family="Inter, sans-serif">click & done</text>`;
  el.innerHTML = svg(W, H, c);
}

// ---- Alignment / Ground Shift Diagram ----
function renderAlignmentDiagram() {
  const el = document.getElementById('alignmentVisual');
  if (!el) return;
  const W = 500, H = 375;
  let c = '';

  // Background
  c += `<rect width="${W}" height="${H}" fill="#0d1117" rx="8"/>`;

  // Labels
  c += `<text x="125" y="30" text-anchor="middle" fill="${C.label}" font-size="12" font-family="Inter, sans-serif" font-weight="600">LEVEL GROUND</text>`;
  c += `<text x="375" y="30" text-anchor="middle" fill="${C.copperLight}" font-size="12" font-family="Inter, sans-serif" font-weight="600">AFTER SETTLEMENT</text>`;

  // Divider
  c += `<line x1="250" y1="40" x2="250" y2="${H - 20}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;

  // LEFT SIDE: Level ground
  const lGround = 260;
  c += `<rect x="0" y="${lGround}" width="250" height="${H - lGround}" fill="${C.groundDark}"/>`;
  c += `<line x1="0" y1="${lGround}" x2="250" y2="${lGround}" stroke="${C.grass1}" stroke-width="1.5"/>`;

  // Two posts, level
  c += `<rect x="55" y="80" width="14" height="190" rx="1" fill="${C.post}" stroke="${C.postEdge}" stroke-width="0.5"/>`;
  c += `<rect x="175" y="80" width="14" height="190" rx="1" fill="${C.post}" stroke="${C.postEdge}" stroke-width="0.5"/>`;
  // Panel between them
  c += `<rect x="69" y="90" width="106" height="160" fill="${C.glass}" rx="1"/>`;
  // Gasket lines
  c += `<line x1="69" y1="90" x2="69" y2="250" stroke="${C.gasket}" stroke-width="2"/>`;
  c += `<line x1="175" y1="90" x2="175" y2="250" stroke="${C.gasket}" stroke-width="2"/>`;

  // RIGHT SIDE: Post 2 settled 12mm (scaled up visually to 15px)
  const rGround = 260;
  const settle = 18;
  c += `<rect x="250" y="${rGround}" width="250" height="${H - rGround}" fill="${C.groundDark}"/>`;
  c += `<line x1="250" y1="${rGround}" x2="500" y2="${rGround}" stroke="${C.grass1}" stroke-width="1.5"/>`;

  // Post 1 (level)
  c += `<rect x="305" y="80" width="14" height="190" rx="1" fill="${C.post}" stroke="${C.postEdge}" stroke-width="0.5"/>`;
  // Post 2 (settled)
  c += `<rect x="425" y="${80 + settle}" width="14" height="190" rx="1" fill="${C.post}" stroke="${C.postEdge}" stroke-width="0.5"/>`;

  // Panel (tilted slightly) - connects the two posts at their respective heights
  const p2panelTop = 90 + settle;
  c += `<polygon points="319,90 425,${p2panelTop} 425,${p2panelTop + 160} 319,250" fill="${C.glass}"/>`;
  // Gaskets
  c += `<line x1="319" y1="90" x2="319" y2="250" stroke="${C.gasket}" stroke-width="2"/>`;
  c += `<line x1="425" y1="${p2panelTop}" x2="425" y2="${p2panelTop + 160}" stroke="${C.gasket}" stroke-width="2"/>`;

  // Settlement arrow
  c += `<line x1="455" y1="80" x2="455" y2="${80 + settle}" stroke="${C.copper}" stroke-width="1.5"/>`;
  c += `<line x1="450" y1="80" x2="460" y2="80" stroke="${C.copper}" stroke-width="1"/>`;
  c += `<polygon points="451,${78 + settle} 459,${78 + settle} 455,${84 + settle}" fill="${C.copper}"/>`;
  c += `<text x="470" y="${80 + settle / 2 + 4}" fill="${C.copper}" font-size="10" font-family="Inter, sans-serif">16mm</text>`;

  // "Privacy maintained" label
  c += `<text x="370" y="${H - 30}" text-anchor="middle" fill="${C.copperLight}" font-size="10" font-family="Inter, sans-serif">Privacy maintained. Zero gaps.</text>`;

  el.innerHTML = svg(W, H, c);
}

// ---- Ecosystem Card Icons ----
function renderEcosystemCards() {
  const cards = {
    ecoFence: drawEcoFence,
    ecoHub: drawEcoHub,
    ecoGate: drawEcoGate,
    ecoCamera: drawEcoCamera,
    ecoShade: drawEcoShade,
    ecoShed: drawEcoShed,
    ecoBattery: drawEcoBattery,
    ecoEv: drawEcoEv,
    ecoLight: drawEcoLight,
  };
  for (const [id, fn] of Object.entries(cards)) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = fn();
  }
}

function drawEcoFence() {
  const W = 400, H = 250;
  let c = `<rect width="${W}" height="${H}" fill="#0d1117"/>`;
  c += `<rect x="0" y="180" width="${W}" height="70" fill="${C.groundDark}"/>`;
  const posts = 5;
  for (let i = 0; i < posts; i++) {
    const x = 40 + i * 80;
    c += `<rect x="${x}" y="60" width="10" height="125" fill="${C.post}" rx="1"/>`;
    c += `<rect x="${x - 1}" y="55" width="12" height="6" rx="1" fill="${C.post}"/>`;
    if (i < posts - 1) {
      c += `<rect x="${x + 10}" y="68" width="70" height="110" fill="${C.glass}" rx="1"/>`;
    }
  }
  return svg(W, H, c);
}

function drawEcoHub() {
  const W = 400, H = 250;
  let c = `<rect width="${W}" height="${H}" fill="#0d1117"/>`;
  // Wall
  c += `<rect x="100" y="30" width="200" height="190" fill="#1a1a1a" rx="2"/>`;
  // Hub box
  c += `<rect x="150" y="60" width="100" height="130" fill="${C.earth}" rx="6" stroke="${C.postEdge}" stroke-width="1"/>`;
  c += `<text x="200" y="100" text-anchor="middle" fill="${C.ground}" font-size="9" font-family="Inter, sans-serif" font-weight="600">GROUNDSWELL</text>`;
  c += `<rect x="165" y="110" width="70" height="40" fill="#111" rx="3"/>`;
  c += `<circle cx="200" cy="165" r="4" fill="${C.green}"/>`;
  // Status light glow
  c += `<circle cx="200" cy="165" r="8" fill="${C.green}" opacity="0.2"/>`;
  return svg(W, H, c);
}

function drawEcoGate() {
  const W = 400, H = 250;
  let c = `<rect width="${W}" height="${H}" fill="#0d1117"/>`;
  c += `<rect x="0" y="185" width="${W}" height="65" fill="${C.groundDark}"/>`;
  // Hinge post
  c += `<rect x="100" y="50" width="14" height="140" fill="${C.post}" rx="1"/>`;
  // Latch post
  c += `<rect x="286" y="50" width="14" height="140" fill="${C.post}" rx="1"/>`;
  // Gate panel (slightly open - angled)
  c += `<polygon points="114,60 260,68 260,178 114,170" fill="${C.glass}" opacity="0.85"/>`;
  // Smart lock
  c += `<rect x="240" y="110" width="20" height="30" fill="${C.copper}" rx="3"/>`;
  c += `<circle cx="250" cy="122" r="4" fill="${C.copperLight}"/>`;
  return svg(W, H, c);
}

function drawEcoCamera() {
  const W = 400, H = 250;
  let c = `<rect width="${W}" height="${H}" fill="#0d1117"/>`;
  c += `<rect x="0" y="190" width="${W}" height="60" fill="${C.groundDark}"/>`;
  // Post body
  c += `<rect x="185" y="80" width="30" height="115" fill="${C.post}" rx="2"/>`;
  // Solar wrap section
  c += `<rect x="183" y="55" width="34" height="30" fill="${C.glass}" rx="2"/>`;
  // Camera housing
  c += `<rect x="180" y="35" width="40" height="22" fill="${C.earth}" rx="4"/>`;
  c += `<circle cx="195" cy="46" r="6" fill="#111" stroke="${C.postEdge}" stroke-width="1"/>`;
  c += `<circle cx="195" cy="46" r="3" fill="${C.glass}"/>`;
  // FOV lines
  c += `<line x1="195" y1="46" x2="120" y2="100" stroke="${C.copper}" stroke-width="0.5" stroke-dasharray="4 3" opacity="0.4"/>`;
  c += `<line x1="195" y1="46" x2="120" y2="170" stroke="${C.copper}" stroke-width="0.5" stroke-dasharray="4 3" opacity="0.4"/>`;
  c += `<path d="M 120 100 Q 100 135 120 170" fill="${C.copper}" opacity="0.05"/>`;
  return svg(W, H, c);
}

function drawEcoShade() {
  const W = 400, H = 250;
  let c = `<rect width="${W}" height="${H}" fill="#0d1117"/>`;
  c += `<rect x="0" y="200" width="${W}" height="50" fill="${C.groundDark}"/>`;
  // Three tall posts
  c += `<rect x="80" y="40" width="10" height="165" fill="${C.post}" rx="1"/>`;
  c += `<rect x="195" y="40" width="10" height="165" fill="${C.post}" rx="1"/>`;
  c += `<rect x="310" y="40" width="10" height="165" fill="${C.post}" rx="1"/>`;
  // Shade sail (triangle)
  c += `<polygon points="85,45 200,45 315,45" fill="none" stroke="${C.ground}" stroke-width="1"/>`;
  c += `<polygon points="85,45 200,55 315,45" fill="rgba(107,107,107,0.15)" stroke="${C.ground}" stroke-width="0.5"/>`;
  // Catenary curves for the sail
  c += `<path d="M 85 45 Q 142 60 200 55 Q 257 50 315 45" fill="rgba(80,80,80,0.2)" stroke="${C.ground}" stroke-width="1"/>`;
  return svg(W, H, c);
}

function drawEcoShed() {
  const W = 400, H = 250;
  let c = `<rect width="${W}" height="${H}" fill="#0d1117"/>`;
  c += `<rect x="0" y="195" width="${W}" height="55" fill="${C.groundDark}"/>`;
  // Shed front face - isometric-ish
  // Front wall (3 panels)
  for (let i = 0; i < 3; i++) {
    c += `<rect x="${120 + i * 55}" y="90" width="50" height="108" fill="${C.glass}" rx="1"/>`;
    c += `<rect x="${120 + i * 55}" y="90" width="8" height="108" fill="${C.post}" rx="0.5"/>`;
  }
  c += `<rect x="${120 + 3 * 55}" y="90" width="8" height="108" fill="${C.post}" rx="0.5"/>`;
  // Roof
  c += `<polygon points="110,90 200,55 290,90" fill="${C.glass}" stroke="${C.postEdge}" stroke-width="1"/>`;
  // Roof panel lines
  c += `<line x1="140" y1="82" x2="170" y2="67" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>`;
  c += `<line x1="200" y1="75" x2="200" y2="55" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>`;
  c += `<line x1="230" y1="82" x2="260" y2="67" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>`;
  // Door
  c += `<rect x="170" y="120" width="40" height="78" fill="${C.earth}" rx="2" stroke="${C.postEdge}" stroke-width="0.5"/>`;
  c += `<circle cx="203" cy="160" r="2" fill="${C.copper}"/>`;
  return svg(W, H, c);
}

function drawEcoBattery() {
  const W = 400, H = 250;
  let c = `<rect width="${W}" height="${H}" fill="#0d1117"/>`;
  c += `<rect x="0" y="190" width="${W}" height="60" fill="${C.groundDark}"/>`;
  // Battery post
  c += `<rect x="175" y="50" width="50" height="145" fill="${C.post}" rx="4" stroke="${C.postEdge}" stroke-width="1"/>`;
  // Vent louvers
  for (let i = 0; i < 4; i++) {
    c += `<rect x="182" y="${65 + i * 12}" width="36" height="4" fill="#111" rx="1"/>`;
  }
  // Battery cells indicator
  c += `<rect x="182" y="120" width="36" height="60" fill="rgba(76,175,80,0.1)" rx="3" stroke="${C.green}" stroke-width="0.5" opacity="0.6"/>`;
  // Charge level
  c += `<rect x="185" y="145" width="30" height="32" fill="${C.green}" rx="2" opacity="0.3"/>`;
  // Label
  c += `<text x="200" y="170" text-anchor="middle" fill="${C.green}" font-size="10" font-family="Inter, sans-serif" font-weight="600" opacity="0.7">2.5kWh</text>`;
  c += `<rect x="172" y="44" width="56" height="8" rx="2" fill="${C.post}"/>`;
  return svg(W, H, c);
}

function drawEcoEv() {
  const W = 400, H = 250;
  let c = `<rect width="${W}" height="${H}" fill="#0d1117"/>`;
  c += `<rect x="0" y="185" width="${W}" height="65" fill="${C.groundDark}"/>`;
  // EV charger post
  c += `<rect x="175" y="65" width="30" height="125" fill="${C.post}" rx="2" stroke="${C.postEdge}" stroke-width="1"/>`;
  // LED ring
  c += `<rect x="172" y="60" width="36" height="8" rx="3" fill="${C.copper}"/>`;
  // Cable wrapping around
  c += `<path d="M 190 155 Q 220 160 220 175 Q 220 190 250 190 L 280 190" fill="none" stroke="${C.copper}" stroke-width="3" stroke-linecap="round"/>`;
  // Plug
  c += `<rect x="278" y="183" width="20" height="14" fill="${C.copperLight}" rx="3"/>`;
  // Car silhouette (simple)
  c += `<path d="M 260 165 L 340 165 Q 350 165 350 175 L 350 185 L 250 185 L 250 175 Q 250 165 260 165 Z" fill="#1a1a1a" stroke="${C.postEdge}" stroke-width="1"/>`;
  c += `<circle cx="270" cy="185" r="6" fill="#111" stroke="${C.postEdge}" stroke-width="1"/>`;
  c += `<circle cx="335" cy="185" r="6" fill="#111" stroke="${C.postEdge}" stroke-width="1"/>`;
  return svg(W, H, c);
}

function drawEcoLight() {
  const W = 400, H = 250;
  let c = `<rect width="${W}" height="${H}" fill="#0d1117"/>`;
  c += `<rect x="0" y="190" width="${W}" height="60" fill="${C.groundDark}"/>`;
  // Short post
  c += `<rect x="190" y="110" width="20" height="85" fill="${C.post}" rx="1" stroke="${C.postEdge}" stroke-width="0.5"/>`;
  // Solar cap (angled)
  c += `<polygon points="185,100 215,100 218,108 182,108" fill="${C.glass}"/>`;
  // LED ring (glowing)
  c += `<rect x="184" y="108" width="32" height="6" rx="2" fill="${C.copperLight}"/>`;
  // Light glow
  c += `<ellipse cx="200" cy="115" rx="40" ry="60" fill="${C.copperLight}" opacity="0.04"/>`;
  c += `<ellipse cx="200" cy="115" rx="25" ry="40" fill="${C.copperLight}" opacity="0.06"/>`;
  // Light rays
  for (let a = 0; a < 8; a++) {
    const angle = (a / 8) * Math.PI + Math.PI / 2;
    const x2 = 200 + Math.cos(angle) * 30;
    const y2 = 130 + Math.sin(angle) * 30;
    c += `<line x1="200" y1="114" x2="${x2}" y2="${y2}" stroke="${C.copperLight}" stroke-width="0.5" opacity="0.3"/>`;
  }
  return svg(W, H, c);
}

// ---- Cross-Section Diagram ----
function renderCrossSection() {
  const el = document.getElementById('crossSection');
  if (!el) return;
  const W = 500, H = 500;
  let c = '';
  c += `<rect width="${W}" height="${H}" fill="#0d1117" rx="8"/>`;

  const cx = W / 2, cy = H / 2;
  const scale = 2.5; // pixels per mm
  const postW = 85 * scale; // 85mm
  const postH = 70 * scale; // 70mm
  const wallT = 3 * scale;
  const chanW = 22 * scale;
  const chanD = 20 * scale;
  const wireW = 25 * scale;
  const wireH = 35 * scale;

  const x0 = cx - postW / 2;
  const y0 = cy - postH / 2;

  // Outer wall
  c += `<rect x="${x0}" y="${y0}" width="${postW}" height="${postH}" rx="4" fill="${C.post}" stroke="${C.postEdge}" stroke-width="2"/>`;

  // Channel A (left)
  const chAx = x0;
  const chAy = y0 + (postH - chanW) / 2;
  c += `<rect x="${chAx - 2}" y="${chAy}" width="${chanD + 2}" height="${chanW}" fill="#0d1117" rx="2"/>`;

  // Channel B (right)
  const chBx = x0 + postW - chanD;
  c += `<rect x="${chBx}" y="${chAy}" width="${chanD + 2}" height="${chanW}" fill="#0d1117" rx="2"/>`;

  // Channel C (top)
  const chCx = x0 + (postW - chanW) / 2;
  const chCy = y0;
  c += `<rect x="${chCx}" y="${chCy - 2}" width="${chanW}" height="${chanD + 2}" fill="#0d1117" rx="2"/>`;

  // Channel D (bottom)
  c += `<rect x="${chCx}" y="${y0 + postH - chanD}" width="${chanW}" height="${chanD + 2}" fill="#0d1117" rx="2"/>`;

  // Wire chase (center)
  const wcx = cx - wireW / 2;
  const wcy = cy - wireH / 2;
  c += `<rect x="${wcx}" y="${wcy}" width="${wireW}" height="${wireH}" fill="#111" rx="3" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;
  // Wires inside
  c += `<circle cx="${cx - 8}" cy="${cy}" r="5" fill="none" stroke="${C.copper}" stroke-width="1.5"/>`;
  c += `<circle cx="${cx + 8}" cy="${cy}" r="5" fill="none" stroke="${C.copper}" stroke-width="1.5"/>`;

  // Glass panel in channel A (showing engagement)
  const glassT = 6 * scale;
  c += `<rect x="${chAx}" y="${chAy + (chanW - glassT) / 2}" width="${chanD * 0.6}" height="${glassT}" fill="${C.glass}" rx="1"/>`;
  // EPDM gasket
  c += `<rect x="${chAx}" y="${chAy + 2}" width="${chanD * 0.6}" height="${chanW - 4}" fill="none" stroke="${C.gasket}" stroke-width="2" stroke-dasharray="4 2" rx="1"/>`;

  // Glass panel in channel B
  c += `<rect x="${chBx + chanD * 0.4}" y="${chAy + (chanW - glassT) / 2}" width="${chanD * 0.6}" height="${glassT}" fill="${C.glass}" rx="1"/>`;
  c += `<rect x="${chBx + chanD * 0.4}" y="${chAy + 2}" width="${chanD * 0.6}" height="${chanW - 4}" fill="none" stroke="${C.gasket}" stroke-width="2" stroke-dasharray="4 2" rx="1"/>`;

  // Labels
  c += `<text x="${cx}" y="${y0 - 25}" text-anchor="middle" fill="${C.label}" font-size="12" font-family="Inter, sans-serif" font-weight="600">POST CROSS-SECTION</text>`;
  c += `<text x="${cx}" y="${y0 - 10}" text-anchor="middle" fill="${C.ground}" font-size="10" font-family="Inter, sans-serif">85mm × 70mm, 4-channel universal</text>`;

  // Dimension lines
  // Width
  c += `<line x1="${x0}" y1="${y0 + postH + 25}" x2="${x0 + postW}" y2="${y0 + postH + 25}" stroke="${C.copper}" stroke-width="1" opacity="0.6"/>`;
  c += `<line x1="${x0}" y1="${y0 + postH + 20}" x2="${x0}" y2="${y0 + postH + 30}" stroke="${C.copper}" stroke-width="1" opacity="0.6"/>`;
  c += `<line x1="${x0 + postW}" y1="${y0 + postH + 20}" x2="${x0 + postW}" y2="${y0 + postH + 30}" stroke="${C.copper}" stroke-width="1" opacity="0.6"/>`;
  c += `<text x="${cx}" y="${y0 + postH + 40}" text-anchor="middle" fill="${C.copper}" font-size="11" font-family="Inter, sans-serif" opacity="0.8">85mm</text>`;

  // Height
  c += `<line x1="${x0 + postW + 25}" y1="${y0}" x2="${x0 + postW + 25}" y2="${y0 + postH}" stroke="${C.copper}" stroke-width="1" opacity="0.6"/>`;
  c += `<line x1="${x0 + postW + 20}" y1="${y0}" x2="${x0 + postW + 30}" y2="${y0}" stroke="${C.copper}" stroke-width="1" opacity="0.6"/>`;
  c += `<line x1="${x0 + postW + 20}" y1="${y0 + postH}" x2="${x0 + postW + 30}" y2="${y0 + postH}" stroke="${C.copper}" stroke-width="1" opacity="0.6"/>`;
  c += `<text x="${x0 + postW + 35}" y="${cy + 4}" fill="${C.copper}" font-size="11" font-family="Inter, sans-serif" transform="rotate(-90 ${x0 + postW + 35} ${cy})" text-anchor="middle" opacity="0.8">70mm</text>`;

  // Channel labels
  c += `<text x="${chAx + chanD / 2}" y="${chAy - 8}" text-anchor="middle" fill="${C.label}" font-size="9" font-family="Inter, sans-serif">PANEL A</text>`;
  c += `<text x="${chBx + chanD / 2}" y="${chAy - 8}" text-anchor="middle" fill="${C.label}" font-size="9" font-family="Inter, sans-serif">PANEL B</text>`;
  c += `<text x="${cx}" y="${wcy - 8}" text-anchor="middle" fill="${C.label}" font-size="9" font-family="Inter, sans-serif">WIRE CHASE</text>`;

  el.innerHTML = svg(W, H, c);
}

// ---- Platform Architecture Diagram ----
function renderPlatformDiagram() {
  const el = document.getElementById('platformDiagram');
  if (!el) return;
  const W = 800, H = 450;
  let c = '';
  c += `<rect width="${W}" height="${H}" fill="#0d1117" rx="12"/>`;

  // App layer
  c += `<rect x="250" y="20" width="300" height="50" rx="8" fill="rgba(184,115,51,0.15)" stroke="${C.copper}" stroke-width="1"/>`;
  c += `<text x="400" y="50" text-anchor="middle" fill="${C.copperLight}" font-size="13" font-family="Inter, sans-serif" font-weight="700">GROUNDSWELL APP</text>`;

  // Hub
  c += `<line x1="400" y1="70" x2="400" y2="100" stroke="${C.copper}" stroke-width="1.5"/>`;
  c += `<rect x="300" y="100" width="200" height="45" rx="8" fill="${C.earth}" stroke="${C.postEdge}" stroke-width="1"/>`;
  c += `<text x="400" y="127" text-anchor="middle" fill="${C.cream}" font-size="12" font-family="Inter, sans-serif" font-weight="600">POWER HUB</text>`;

  // Connection lines down to products
  const products = [
    { label: 'Solar\nFence', x: 80 },
    { label: 'Gate', x: 200 },
    { label: 'Camera', x: 320 },
    { label: 'Shade', x: 440 },
    { label: 'Battery', x: 560 },
    { label: 'EV\nCharger', x: 680 },
  ];

  products.forEach(p => {
    c += `<line x1="400" y1="145" x2="${p.x}" y2="200" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
    // Product box
    c += `<rect x="${p.x - 45}" y="200" width="90" height="60" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
    const lines = p.label.split('\n');
    lines.forEach((line, i) => {
      c += `<text x="${p.x}" y="${230 + i * 16}" text-anchor="middle" fill="${C.cream}" font-size="11" font-family="Inter, sans-serif" font-weight="500">${line}</text>`;
    });
  });

  // Universal post interface
  c += `<line x1="50" y1="290" x2="750" y2="290" stroke="${C.copper}" stroke-width="2"/>`;
  c += `<text x="400" y="310" text-anchor="middle" fill="${C.copper}" font-size="11" font-family="Inter, sans-serif" font-weight="700" letter-spacing="2">UNIVERSAL POST INTERFACE</text>`;

  // Lines down to ground screws
  products.forEach(p => {
    c += `<line x1="${p.x}" y1="260" x2="${p.x}" y2="290" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
    c += `<line x1="${p.x}" y1="290" x2="${p.x}" y2="340" stroke="${C.screw}" stroke-width="3"/>`;
    // Helix
    c += `<ellipse cx="${p.x}" cy="345" rx="12" ry="4" fill="none" stroke="${C.screwHelix}" stroke-width="1.5"/>`;
  });

  // Ground
  c += `<rect x="0" y="355" width="${W}" height="95" fill="${C.groundDark}" rx="0 0 12 12"/>`;
  c += `<line x1="0" y1="355" x2="${W}" y2="355" stroke="${C.grass1}" stroke-width="2"/>`;
  c += `<text x="400" y="390" text-anchor="middle" fill="${C.ground}" font-size="13" font-family="Inter, sans-serif" font-weight="700" letter-spacing="3">YOUR GROUND</text>`;

  el.innerHTML = svg(W, H, c);
}

// ---- Calculator ----
function initCalculator() {
  const slider = document.getElementById('fenceLength');
  if (!slider) return;

  function update() {
    const feet = parseInt(slider.value);
    const modules = Math.round(feet / 4); // ~4ft per module (panel span)
    const kw = (modules * 0.15).toFixed(2);
    const moduleCost = modules * 399;
    const endPost = 49;
    const hub = modules <= 13 ? 449 : modules <= 26 ? 599 : 749;
    const total = moduleCost + endPost + hub;
    const solarPortion = moduleCost + hub * 0.8; // Approximate solar-qualifying portion
    const itcCredit = Math.round(solarPortion * 0.30);
    const afterItc = total - itcCredit;
    const annualKwh = modules * 238; // Phoenix estimate
    const annualSavings = Math.round(annualKwh * 0.15);
    const paybackYears = afterItc > 0 && annualSavings > 0 ? (afterItc / annualSavings).toFixed(1) : '—';

    document.getElementById('fenceLengthDisplay').textContent = `${feet} ft`;
    document.getElementById('calcModules').textContent = modules;
    document.getElementById('calcKw').textContent = `${kw} kW`;
    document.getElementById('calcCost').textContent = `$${total.toLocaleString()}`;
    document.getElementById('calcAfterItc').textContent = `$${afterItc.toLocaleString()}`;
    document.getElementById('calcKwh').textContent = `${annualKwh.toLocaleString()} kWh`;
    document.getElementById('calcSavings').textContent = `$${annualSavings}/yr`;
    document.getElementById('calcPayback').textContent = `~${paybackYears} years`;
  }

  slider.addEventListener('input', update);
  update();
}

// ---- Nav ----
function initNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // Scroll behavior for nav background
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (window.scrollY > 50) {
      nav.style.background = 'rgba(26,26,26,0.95)';
    } else {
      nav.style.background = 'rgba(26,26,26,0.85)';
    }
  });
}
