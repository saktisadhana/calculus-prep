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

    <div class="card" style="margin-top:16px;margin-bottom:24px;border-color:var(--primary);">
      <h3>✨ Generator Soal Uraian AI (BETA)</h3>
      <p class="muted">Generate soal essay ala EAS ITS secara dinamis. AI akan meracik angkanya agar enak dihitung dan memberikan visualisasi kurva (Canvas JS).</p>
      <button class="btn" id="aiPracticeBtn" style="background:var(--primary);color:#fff">Generate 1 Soal Uraian</button>
      <div id="aiPracticeResult" style="margin-top:16px;display:none;"></div>
    </div>

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

  document.getElementById('aiPracticeBtn')!.onclick = async () => {
    const btn = document.getElementById('aiPracticeBtn') as HTMLButtonElement;
    const res = document.getElementById('aiPracticeResult')!;
    btn.disabled = true;
    btn.textContent = 'Meracik soal...';
    res.style.display = 'block';
    res.innerHTML = '<div class="ai-msg loading">AI sedang membuat soal yang angkanya cantik...</div>';
    
    try {
      const { callAITutor } = await import('./solver.ts');
      const { renderMarkdown } = await import('./markdown.ts');
      const { typeset } = await import('./typeset.ts');
      
      const sys = `Kamu adalah Generator Soal Kalkulus 2 tingkat Universitas (setara EAS ITS). 
Buatlah SATU soal uraian / essay dari salah satu topik berikut secara acak: 
1. Luas antar kurva (beserta instruksi sketsa)
2. Titik berat (Centroid) daerah homogen
3. Persamaan parametrik (mencari garis singgung vertikal/horizontal)
4. Kurva kutub/polar (mencari luas dalam kurva kardioida, dll)
5. Uji konvergensi barisan/deret

ATURAN WAJIB:
- Rancang angkanya agar HASIL PERHITUNGANNYA BULAT ATAU PECAHAN SEDERHANA (mudah dihitung tanpa kalkulator). Jangan terlalu mudah, tapi angkanya "cantik".
- Tampilkan soal dengan jelas.
- Kemudian berikan "KUNCI JAWABAN" langkah demi langkah.
- JIKA TOPIK TERKAIT GRAFIK (Luas, Titik Berat, Polar, Parametrik), SAAT MEMBAHAS KUNCI JAWABAN, KAMU WAJIB MENYERTAKAN BLOK KODE JAVASCRIPT UNTUK MENGGAMBAR GRAFIKNYA DI CANVAS.

Format untuk menggambar grafik:
\`\`\`javascript
// Gunakan variabel 'ctx' (CanvasRenderingContext2D) dan 'canvas' (HTMLCanvasElement 400x400)
// Contoh menggambar polar:
ctx.translate(200, 200);
ctx.scale(40, -40); // sesuaikan scale agar pas
ctx.beginPath();
for(let t=0; t<=Math.PI*2; t+=0.05) {
  let r = 2 - 2*Math.cos(t);
  ctx.lineTo(r*Math.cos(t), r*Math.sin(t));
}
ctx.stroke();
// tambahkan sumbu x dan y dll
\`\`\`
Gunakan Markdown dan LaTeX ($...$) untuk rumus.`;

      const ans = await callAITutor(sys, 'Buatkan saya 1 soal latihan uraian yang bagus sekarang!');
      res.innerHTML = renderMarkdown(ans);
      typeset(res);

      // Feedback buttons
      const fb = document.createElement('div');
      fb.style.marginTop = '16px';
      fb.style.paddingTop = '16px';
      fb.style.borderTop = '1px solid var(--line)';
      fb.style.display = 'flex';
      fb.style.gap = '8px';
      fb.innerHTML = `
        <span class="muted" style="line-height:2">Apakah format jawaban ini bagus?</span>
        <button class="btn ghost2 sm fb-like">Like</button>
        <button class="btn ghost2 sm fb-dislike">Dislike</button>
      `;
      res.appendChild(fb);

      const btnLike = fb.querySelector('.fb-like') as HTMLButtonElement;
      const btnDislike = fb.querySelector('.fb-dislike') as HTMLButtonElement;

      btnLike.onclick = async () => {
        btnLike.disabled = true;
        btnDislike.style.display = 'none';
        btnLike.textContent = 'Menganalisis gaya...';
        try {
          const { state, save } = await import('../storage/state.ts');
          const sys = 'Tolong rangkum gaya penulisan, format, dan *tone* dari teks berikut ke dalam 1 kalimat instruksi singkat. JANGAN BAHAS MATERINYA. Berikan HANYA kalimat instruksi.';
          const styleInfo = await callAITutor(sys, ans);
          state.aiStyleRules = styleInfo;
          save();
          btnLike.textContent = 'Preferensi Disimpan!';
        } catch (e) {
          btnLike.textContent = 'Gagal menyimpan';
        }
      };

      btnDislike.onclick = () => {
        fb.innerHTML = '<span class="muted">Sesi ini akan diabaikan.</span>';
      };

    } catch (e: any) {
      res.innerHTML = `<div class="warnbox">Gagal: ${e.message}</div>`;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Generate Soal Baru';
    }
  };
}
