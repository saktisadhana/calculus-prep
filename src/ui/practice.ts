// Latihan (practice problems) section.
import { soal, type Question } from '../data/questions.ts';

const DIFF: Record<string, [string, string]> = { e: ['Mudah', 'b-e'], m: ['Sedang', 'b-m'], h: ['Sulit', 'b-h'] };

function renderSoalList(list: Question[], container: HTMLElement): void {
  container.innerHTML = list.map(q => {
    const [lbl, cls] = DIFF[q[0]] || DIFF.m;
    return `<div class="q">
      <div class="qh"><b>${q[1]}</b><span class="badge ${cls}">${lbl}</span></div>
      <p>${q[2]}</p>
      <button class="toggle">Lihat pembahasan</button>
      <div class="ans"><b>Pembahasan.</b><br>${q[3]}</div>
    </div>`;
  }).join('');
}

export function renderPractice(): void {
  const el = document.getElementById('latihan')!;
  el.innerHTML = `
    <h2>Bank Soal Latihan</h2>
    <p class="muted">Kerjakan dulu di kertas, baru klik "Lihat pembahasan". Tingkat: <b style="color:var(--ok)">Mudah</b> · <b style="color:var(--warn)">Sedang</b> · <b style="color:var(--bad)">Sulit</b>. Total: <b>${soal.l4.length + soal.l5.length + soal.l6.length} soal</b>.</p>
    <div class="subnav" id="latnav">
      <button data-l="l4" class="active">BAB 4 (${soal.l4.length})</button>
      <button data-l="l5">BAB 5 (${soal.l5.length})</button>
      <button data-l="l6">BAB 6 (${soal.l6.length})</button>
    </div>
    <div class="matpage active" id="l4"></div>
    <div class="matpage" id="l5"></div>
    <div class="matpage" id="l6"></div>
  `;

  renderSoalList(soal.l4, document.getElementById('l4')!);
  renderSoalList(soal.l5, document.getElementById('l5')!);
  renderSoalList(soal.l6, document.getElementById('l6')!);
}
