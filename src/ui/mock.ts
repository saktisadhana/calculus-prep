// Mock exam section (3 exam sets + timer).
import { mocks } from '../data/mocks.ts';
import { state, save } from '../storage/state.ts';
import { updateStats, mockScore } from './stats.ts';
import { pad2 } from '../util.ts';

let mockTimer: ReturnType<typeof setInterval> | null = null;
let mockTime = 90 * 60;

export function renderMock(): void {
  const el = document.getElementById('mock')!;
  el.innerHTML = `
    <h2>Mock Exam (90 menit · 10 soal)</h2>
    <p class="muted">Simulasi ujian campuran BAB 4–6. Kerjakan dengan timer aktif. Ada 3 set mock yang berbeda.</p>

    <div class="subnav" id="mocknav">
      <button data-k="mk0" class="active">Mock 1</button>
      <button data-k="mk1">Mock 2</button>
      <button data-k="mk2">Mock 3</button>
    </div>

    <div class="timerbar">
      <div>Sisa waktu: <span class="clk" id="mclk">90:00</span></div>
      <div>
        <button class="btn" id="mstart">Mulai</button>
        <button class="btn ghost" id="mpause">Jeda</button>
        <button class="btn red" id="mreset">Reset</button>
      </div>
    </div>

    <div class="matpage active" id="mk0"></div>
    <div class="matpage" id="mk1"></div>
    <div class="matpage" id="mk2"></div>

    <div class="card">
      <h3 style="margin-top:4px">Hasil</h3>
      <p>Skor saat ini: <b id="mocklive" class="big" style="font-size:22px">0/10</b> <button class="btn sm" id="msave">Simpan sebagai skor terbaik</button></p>
      <p class="muted" id="mockmsg"></p>
    </div>
  `;

  mocks.forEach((mockSet, mi) => {
    const container = document.getElementById(`mk${mi}`)!;
    container.innerHTML = mockSet.map((q, qi) => `
      <div class="q">
        <div class="qh"><b>No. ${q.no} <span class="muted">(${q.bab})</span></b>
          <label class="markok" data-key="mok${mi}_${qi}"><input type="checkbox" ${state[`mok${mi}_${qi}`] ? 'checked' : ''}> jawaban benar</label></div>
        <p>${q.question}</p>
        <button class="toggle">Lihat kunci</button>
        <div class="ans"><b>Kunci.</b> ${q.key}</div>
      </div>
    `).join('');
  });

  document.getElementById('mstart')!.onclick = () => { if (!mockTimer) mockTimer = setInterval(mockTick, 1000); };
  document.getElementById('mpause')!.onclick = () => { if (mockTimer) { clearInterval(mockTimer); mockTimer = null; } };
  document.getElementById('mreset')!.onclick = () => { if (mockTimer) { clearInterval(mockTimer); mockTimer = null; } mockTime = 90 * 60; document.getElementById('mclk')!.textContent = '90:00'; };
  document.getElementById('msave')!.onclick = () => {
    const v = mockScore();
    if (state.mockbest == null || v > (state.mockbest as number)) state.mockbest = v;
    save();
    updateStats();
    const msg = v >= 8 ? 'Mantap, kamu siap!' : v >= 7 ? 'Bagus, lewat target.' : v >= 5 ? 'Cukup, fokus soal yang keliru.' : 'Ulangi topik dasar.';
    document.getElementById('mockmsg')!.textContent = `Skor: ${v}/10 (terbaik: ${state.mockbest}/10). ${msg}`;
  };
}

function mockTick(): void {
  mockTime--;
  document.getElementById('mclk')!.textContent = `${Math.floor(mockTime / 60)}:${pad2(mockTime % 60)}`;
  if (mockTime <= 0) { if (mockTimer) clearInterval(mockTimer); mockTimer = null; document.getElementById('mclk')!.textContent = 'WAKTU HABIS'; }
}
