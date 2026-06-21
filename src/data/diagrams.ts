export const SVG_AREA_CURVES = `
<svg viewBox="0 0 300 200" style="width:100%; max-width:350px; display:block; margin: 15px auto; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
  <!-- Grid -->
  <path d="M50 20 v160 M100 20 v160 M150 20 v160 M200 20 v160 M250 20 v160" stroke="#e2e8f0" stroke-width="1" />
  <path d="M20 50 h260 M20 100 h260 M20 150 h260" stroke="#e2e8f0" stroke-width="1" />
  <!-- Axes -->
  <line x1="20" y1="150" x2="280" y2="150" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)" />
  <line x1="50" y1="180" x2="50" y2="20" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)" />
  <text x="285" y="145" font-family="sans-serif" font-size="12" fill="#64748b">x</text>
  <text x="35" y="20" font-family="sans-serif" font-size="12" fill="#64748b">y</text>
  <!-- Area fill -->
  <path d="M 100 80 Q 150 40 200 60 L 200 120 Q 150 140 100 110 Z" fill="rgba(56, 189, 248, 0.3)" />
  <!-- Curves -->
  <path d="M 50 110 Q 150 20 250 80" stroke="#0ea5e9" stroke-width="3" fill="none" />
  <path d="M 50 100 Q 150 160 250 110" stroke="#f43f5e" stroke-width="3" fill="none" />
  <!-- Labels -->
  <text x="220" y="55" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0ea5e9">f(x)</text>
  <text x="220" y="135" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f43f5e">g(x)</text>
  <text x="135" y="95" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0369a1">A</text>
  <line x1="100" y1="150" x2="100" y2="80" stroke="#94a3b8" stroke-dasharray="4" stroke-width="2" />
  <line x1="200" y1="150" x2="200" y2="60" stroke="#94a3b8" stroke-dasharray="4" stroke-width="2" />
  <text x="95" y="165" font-family="sans-serif" font-size="14" fill="#475569">a</text>
  <text x="195" y="165" font-family="sans-serif" font-size="14" fill="#475569">b</text>
  <!-- Defs -->
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
    </marker>
  </defs>
</svg>
`;

export const SVG_VOLUME_DISK = `
<svg viewBox="0 0 300 200" style="width:100%; max-width:350px; display:block; margin: 15px auto; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
  <!-- Axes -->
  <line x1="20" y1="150" x2="280" y2="150" stroke="#64748b" stroke-width="2" />
  <line x1="50" y1="180" x2="50" y2="20" stroke="#64748b" stroke-width="2" />
  <!-- Original Curve -->
  <path d="M 50 150 Q 150 70 230 50" stroke="#0ea5e9" stroke-width="3" fill="none" />
  <!-- Reflected Curve for 3D illusion -->
  <path d="M 50 150 Q 150 230 230 250" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4" fill="none" />
  <!-- Disk Slice -->
  <ellipse cx="140" cy="150" rx="15" ry="60" fill="rgba(34, 197, 94, 0.3)" stroke="#22c55e" stroke-width="2" />
  <ellipse cx="150" cy="150" rx="15" ry="58" fill="rgba(34, 197, 94, 0.4)" stroke="#16a34a" stroke-width="2" />
  <!-- Slice connecting lines -->
  <line x1="140" y1="90" x2="150" y2="92" stroke="#16a34a" stroke-width="2" />
  <line x1="140" y1="210" x2="150" y2="208" stroke="#16a34a" stroke-width="2" />
  
  <line x1="145" y1="150" x2="145" y2="91" stroke="#ef4444" stroke-width="3" />
  <text x="150" y="120" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ef4444">R(x)</text>
  <text x="135" y="165" font-family="sans-serif" font-size="12" fill="#475569">dx</text>
  <text x="240" y="45" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0ea5e9">y=f(x)</text>
</svg>
`;

export const SVG_POLAR_CARDIOID = `
<svg viewBox="0 0 200 200" style="width:100%; max-width:250px; display:block; margin: 15px auto; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
  <!-- Polar Grid -->
  <circle cx="100" cy="100" r="30" stroke="#e2e8f0" fill="none" />
  <circle cx="100" cy="100" r="60" stroke="#e2e8f0" fill="none" />
  <circle cx="100" cy="100" r="90" stroke="#e2e8f0" fill="none" />
  <line x1="10" y1="100" x2="190" y2="100" stroke="#cbd5e1" stroke-width="1" />
  <line x1="100" y1="10" x2="100" y2="190" stroke="#cbd5e1" stroke-width="1" />
  <line x1="36" y1="36" x2="164" y2="164" stroke="#cbd5e1" stroke-width="1" />
  <line x1="36" y1="164" x2="164" y2="36" stroke="#cbd5e1" stroke-width="1" />
  <!-- Cardioid path (a=40, r = 40(1+cos theta)) -->
  <path d="M 180 100 C 180 50, 140 10, 100 10 C 60 10, 80 100, 100 100 C 80 100, 60 190, 100 190 C 140 190, 180 150, 180 100 Z" stroke="#a855f7" stroke-width="3" fill="rgba(168, 85, 247, 0.2)" />
  <text x="120" y="80" font-family="sans-serif" font-size="12" font-weight="bold" fill="#9333ea">r = a(1 + cos θ)</text>
</svg>
`;

export const SVG_SERIES_CONV = `
<svg viewBox="0 0 300 150" style="width:100%; max-width:350px; display:block; margin: 15px auto; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
  <line x1="20" y1="130" x2="280" y2="130" stroke="#64748b" stroke-width="2" />
  <line x1="30" y1="140" x2="30" y2="20" stroke="#64748b" stroke-width="2" />
  <!-- Terms 1/n^2 -->
  <circle cx="50" cy="30" r="5" fill="#f59e0b" />
  <line x1="50" y1="130" x2="50" y2="30" stroke="#f59e0b" stroke-dasharray="2" />
  
  <circle cx="90" cy="105" r="5" fill="#f59e0b" />
  <line x1="90" y1="130" x2="90" y2="105" stroke="#f59e0b" stroke-dasharray="2" />
  
  <circle cx="130" cy="119" r="5" fill="#f59e0b" />
  <line x1="130" y1="130" x2="130" y2="119" stroke="#f59e0b" stroke-dasharray="2" />
  
  <circle cx="170" cy="124" r="5" fill="#f59e0b" />
  <line x1="170" y1="130" x2="170" y2="124" stroke="#f59e0b" stroke-dasharray="2" />
  
  <circle cx="210" cy="126" r="5" fill="#f59e0b" />
  <circle cx="250" cy="127.2" r="5" fill="#f59e0b" />
  
  <path d="M 50 30 Q 80 120 280 128" stroke="#d97706" stroke-width="2" fill="none" opacity="0.5" />
  <text x="150" y="60" font-family="sans-serif" font-size="14" font-weight="bold" fill="#d97706">a_n → 0</text>
  <text x="275" y="145" font-family="sans-serif" font-size="12" fill="#64748b">n</text>
</svg>
`;
