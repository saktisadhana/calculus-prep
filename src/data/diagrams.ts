export const SVG_AREA_CURVES = `
<svg viewBox="0 0 300 200" class="interactive-svg">
  <style>
    .interactive-svg {
      width: 100%; max-width: 350px; display: block; margin: 20px auto;
      background: var(--panel2, #1e293b); border-radius: 12px; border: 1px solid var(--line, #334155);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s;
      cursor: crosshair;
    }
    .interactive-svg:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 20px 25px -5px rgba(14, 165, 233, 0.15);
      border-color: rgba(14, 165, 233, 0.5);
    }
  </style>
  <defs>
    <pattern id="grid1" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.1" />
    </pattern>
    <clipPath id="areaShape">
      <!-- Area between y=f(x) and y=g(x) -->
      <path d="M 100 80 Q 150 40 200 60 L 200 120 Q 150 140 100 110 Z" />
    </clipPath>
    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.1" />
    </linearGradient>
  </defs>

  <rect width="300" height="200" fill="url(#grid1)" color="#94a3b8" />
  
  <!-- Axes -->
  <line x1="20" y1="150" x2="280" y2="150" stroke="#64748b" stroke-width="2" />
  <line x1="50" y1="180" x2="50" y2="20" stroke="#64748b" stroke-width="2" />
  <text x="285" y="145" font-family="sans-serif" font-size="12" fill="#64748b">x</text>
  <text x="35" y="20" font-family="sans-serif" font-size="12" fill="#64748b">y</text>

  <!-- The Area with sweep animation -->
  <g clip-path="url(#areaShape)">
    <!-- Base area fill sweeping in -->
    <rect x="100" y="0" width="100" height="200" fill="url(#areaGrad)">
      <animate attributeName="width" values="0;100;100;0;0" dur="4s" repeatCount="indefinite" />
    </rect>
    <!-- Sweeping dx strip (red line) -->
    <rect x="100" y="0" width="3" height="200" fill="#ef4444">
      <animate attributeName="x" values="100;197;197;100;100" dur="4s" repeatCount="indefinite" />
    </rect>
  </g>

  <!-- Bounding Curves -->
  <path d="M 50 110 Q 150 20 250 80" stroke="#0ea5e9" stroke-width="3" fill="none" />
  <path d="M 50 100 Q 150 160 250 110" stroke="#f43f5e" stroke-width="3" fill="none" />
  
  <!-- Labels -->
  <text x="220" y="55" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0ea5e9">f(x)</text>
  <text x="220" y="135" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f43f5e">g(x)</text>
  
  <line x1="100" y1="150" x2="100" y2="80" stroke="#64748b" stroke-dasharray="4" stroke-width="2" />
  <line x1="200" y1="150" x2="200" y2="60" stroke="#64748b" stroke-dasharray="4" stroke-width="2" />
  <text x="95" y="165" font-family="sans-serif" font-size="14" fill="#94a3b8">a</text>
  <text x="195" y="165" font-family="sans-serif" font-size="14" fill="#94a3b8">b</text>
</svg>
`;

export const SVG_VOLUME_DISK = `
<svg viewBox="0 0 300 200" class="interactive-svg">
  <style>
    .interactive-svg {
      width: 100%; max-width: 350px; display: block; margin: 20px auto;
      background: var(--panel2, #1e293b); border-radius: 12px; border: 1px solid var(--line, #334155);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s;
      cursor: crosshair;
    }
    .interactive-svg:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 20px 25px -5px rgba(34, 197, 94, 0.15);
      border-color: rgba(34, 197, 94, 0.5);
    }
  </style>
  <defs>
    <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.1" />
    </pattern>
  </defs>

  <rect width="300" height="200" fill="url(#grid2)" color="#94a3b8" />

  <!-- Axes -->
  <line x1="20" y1="150" x2="280" y2="150" stroke="#64748b" stroke-width="2" />
  <line x1="50" y1="180" x2="50" y2="20" stroke="#64748b" stroke-width="2" />
  
  <!-- The filled volume region (cone) -->
  <polygon points="50,150 230,50 230,250" fill="rgba(34, 197, 94, 0.1)" />

  <!-- The straight linear curve y = f(x) -->
  <line x1="50" y1="150" x2="230" y2="50" stroke="#0ea5e9" stroke-width="3" />
  <line x1="50" y1="150" x2="230" y2="250" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4" />

  <!-- The sweeping disk -->
  <ellipse cx="50" cy="150" rx="0" ry="0" fill="rgba(34, 197, 94, 0.4)" stroke="#16a34a" stroke-width="2">
    <!-- Move center X from 50 to 230 -->
    <animate attributeName="cx" values="50; 230; 230; 50; 50" dur="4s" repeatCount="indefinite" />
    <!-- Scale Radius Y (150 down to 50 = height 0 to 100) -->
    <animate attributeName="ry" values="0; 100; 100; 0; 0" dur="4s" repeatCount="indefinite" />
    <!-- Scale Radius X (perspective depth 0 to 25) -->
    <animate attributeName="rx" values="0; 25; 25; 0; 0" dur="4s" repeatCount="indefinite" />
  </ellipse>

  <!-- The exact radius line on the disk -->
  <line x1="50" y1="150" x2="50" y2="150" stroke="#ef4444" stroke-width="3">
    <animate attributeName="x1" values="50; 230; 230; 50; 50" dur="4s" repeatCount="indefinite" />
    <animate attributeName="x2" values="50; 230; 230; 50; 50" dur="4s" repeatCount="indefinite" />
    <!-- y2 follows the curve from 150 to 50 -->
    <animate attributeName="y2" values="150; 50; 50; 150; 150" dur="4s" repeatCount="indefinite" />
  </line>

  <text x="160" y="80" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ef4444">
    R(x)
    <animate attributeName="x" values="50; 230; 230; 50; 50" dur="4s" repeatCount="indefinite" />
    <animate attributeName="y" values="140; 40; 40; 140; 140" dur="4s" repeatCount="indefinite" />
  </text>
  
  <text x="240" y="45" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0ea5e9">y=f(x)</text>
</svg>
`;

export const SVG_POLAR_CARDIOID = `
<svg viewBox="0 0 200 200" class="interactive-svg">
  <style>
    .interactive-svg {
      width: 100%; max-width: 250px; display: block; margin: 20px auto;
      background: var(--panel2, #1e293b); border-radius: 12px; border: 1px solid var(--line, #334155);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s;
      cursor: crosshair;
    }
    .interactive-svg:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 20px 25px -5px rgba(168, 85, 247, 0.15);
      border-color: rgba(168, 85, 247, 0.5);
    }
  </style>

  <!-- Polar Grid -->
  <circle cx="100" cy="100" r="30" stroke="#475569" fill="none" opacity="0.3" />
  <circle cx="100" cy="100" r="60" stroke="#475569" fill="none" opacity="0.3" />
  <circle cx="100" cy="100" r="90" stroke="#475569" fill="none" opacity="0.3" />
  <line x1="10" y1="100" x2="190" y2="100" stroke="#475569" stroke-width="1" opacity="0.5" />
  <line x1="100" y1="10" x2="100" y2="190" stroke="#475569" stroke-width="1" opacity="0.5" />
  <line x1="36" y1="36" x2="164" y2="164" stroke="#475569" stroke-width="1" opacity="0.5" />
  <line x1="36" y1="164" x2="164" y2="36" stroke="#475569" stroke-width="1" opacity="0.5" />
  
  <g transform="translate(100, 100)">
    <!-- Radar sweeping vector -->
    <line x1="0" y1="0" x2="90" y2="0" stroke="rgba(168, 85, 247, 0.4)" stroke-width="2">
      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" />
    </line>
    
    <!-- Cardioid being drawn -->
    <path d="M 80 0 C 80 -50, 40 -90, 0 -90 C -40 -90, -20 0, 0 0 C -20 0, -40 90, 0 90 C 40 90, 80 50, 80 0 Z" 
          stroke="#a855f7" stroke-width="3" fill="none"
          stroke-dasharray="400" stroke-dashoffset="400">
      <animate attributeName="stroke-dashoffset" values="400;0;0;400" dur="4s" repeatCount="indefinite" />
    </path>
    
    <!-- Filled area following the drawing -->
    <path d="M 80 0 C 80 -50, 40 -90, 0 -90 C -40 -90, -20 0, 0 0 C -20 0, -40 90, 0 90 C 40 90, 80 50, 80 0 Z" 
          fill="rgba(168, 85, 247, 0.2)">
      <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite" />
    </path>
  </g>
  
  <text x="100" y="195" font-family="sans-serif" font-size="12" font-weight="bold" fill="#c084fc" text-anchor="middle">r = a(1 + cos θ)</text>
</svg>
`;

export const SVG_SERIES_CONV = `
<svg viewBox="0 0 300 150" class="interactive-svg">
  <style>
    .interactive-svg {
      width: 100%; max-width: 350px; display: block; margin: 20px auto;
      background: var(--panel2, #1e293b); border-radius: 12px; border: 1px solid var(--line, #334155);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s;
      cursor: crosshair;
    }
    .interactive-svg:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 20px 25px -5px rgba(245, 158, 11, 0.15);
      border-color: rgba(245, 158, 11, 0.5);
    }
  </style>

  <defs>
    <pattern id="grid4" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.1" />
    </pattern>
  </defs>

  <rect width="300" height="150" fill="url(#grid4)" color="#94a3b8" />

  <!-- Axes -->
  <line x1="20" y1="130" x2="280" y2="130" stroke="#64748b" stroke-width="2" />
  <line x1="30" y1="140" x2="30" y2="20" stroke="#64748b" stroke-width="2" />
  
  <!-- Asymptote line being drawn -->
  <path d="M 50 30 Q 80 120 280 128" stroke="#d97706" stroke-width="2" fill="none" opacity="0.5" stroke-dasharray="300" stroke-dashoffset="300">
    <animate attributeName="stroke-dashoffset" values="300; 0; 0; 300; 300" dur="4s" repeatCount="indefinite" />
  </path>

  <!-- Staggered sequence dots -->
  <g fill="#f59e0b">
    <circle cx="50" cy="30" r="0">
      <animate attributeName="r" values="0;6;5;5;0" keyTimes="0;0.1;0.2;0.9;1" dur="4s" repeatCount="indefinite" />
    </circle>
    <circle cx="90" cy="105" r="0">
      <animate attributeName="r" values="0;0;6;5;5;0" keyTimes="0;0.15;0.25;0.35;0.9;1" dur="4s" repeatCount="indefinite" />
    </circle>
    <circle cx="130" cy="119" r="0">
      <animate attributeName="r" values="0;0;6;5;5;0" keyTimes="0;0.3;0.4;0.5;0.9;1" dur="4s" repeatCount="indefinite" />
    </circle>
    <circle cx="170" cy="124" r="0">
      <animate attributeName="r" values="0;0;6;5;5;0" keyTimes="0;0.45;0.55;0.65;0.9;1" dur="4s" repeatCount="indefinite" />
    </circle>
    <circle cx="210" cy="126" r="0">
      <animate attributeName="r" values="0;0;6;5;5;0" keyTimes="0;0.6;0.7;0.8;0.9;1" dur="4s" repeatCount="indefinite" />
    </circle>
    <circle cx="250" cy="127.2" r="0">
      <animate attributeName="r" values="0;0;6;5;5;0" keyTimes="0;0.75;0.85;0.9;0.95;1" dur="4s" repeatCount="indefinite" />
    </circle>
  </g>

  <text x="150" y="60" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f59e0b" opacity="0">
    a_n → 0
    <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.8;0.85;0.95;1" dur="4s" repeatCount="indefinite" />
  </text>
  <text x="275" y="145" font-family="sans-serif" font-size="12" fill="#94a3b8">n</text>
</svg>
`;
