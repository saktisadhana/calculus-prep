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
      <p class="muted">Generate soal essay ala EAS ITS secara dinamis. AI akan meracik angkanya agar enak dihitung.</p>
      <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-top:12px;">
        <select class="fld" id="aiTopicSelect" style="max-width:300px; padding:8px;">
          <option value="Acak Semua Bab">🎲 Acak Semua Topik</option>
          <optgroup label="BAB 4: APLIKASI INTEGRAL TERTENTU">
            <option value="Bab 4.1: Luas antara dua kurva">4.1 Luas antara dua kurva</option>
            <option value="Bab 4.2: Menghitung Volume Benda Putar">4.2 Menghitung Volume Benda Putar</option>
            <option value="Bab 4.3: Panjang Suatu Kurva">4.3 Panjang Suatu Kurva</option>
            <option value="Bab 4.4: Luas Permukaan Benda Putar">4.4 Luas Permukaan Benda Putar</option>
            <option value="Bab 4.5: Titik Berat">4.5 Titik Berat</option>
          </optgroup>
          <optgroup label="BAB 5: PERSAMAAN PARAMETRIK DAN KOORDINAT KUTUB">
            <option value="Bab 5.1: Persamaan Parametrik">5.1 Persamaan Parametrik</option>
            <option value="Bab 5.2: Koordinat Kutub">5.2 Koordinat Kutub</option>
            <option value="Bab 5.3: Grafik dalam Koordinat Kutub">5.3 Grafik dalam Koordinat Kutub</option>
            <option value="Bab 5.4: Luas dan Volume dalam Koordinat Kutub">5.4 Luas dan Volume dalam Koordinat Kutub</option>
            <option value="Bab 5.5: Garis Singgung dan Panjang Busur di Koordinat Kutub">5.5 Garis Singgung & Panjang Busur di Koordinat Kutub</option>
          </optgroup>
          <optgroup label="BAB 6: BARISAN DAN DERET">
            <option value="Bab 6.1: Barisan Tak Hingga">6.1 Barisan Tak Hingga</option>
            <option value="Bab 6.2: Deret Tak Hingga">6.2 Deret Takhingga</option>
            <option value="Bab 6.3: Uji Konvergensi">6.3 Uji Konvergensi</option>
            <option value="Bab 6.4: Deret Pangkat; Deret Taylor dan Maclaurin">6.4 Deret Pangkat; Deret Taylor dan Maclaurin</option>
            <option value="Bab 6.5: Differensiasi dan Integrasi Deret Pangkat">6.5 Differensiasi dan Integrasi Deret Pangkat</option>
          </optgroup>
        </select>
        <button class="btn" id="aiPracticeBtn" style="background:var(--primary);color:#fff">Generate 1 Soal Uraian</button>
      </div>
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
    const sel = document.getElementById('aiTopicSelect') as HTMLSelectElement;
    const chosenTopic = sel.value;

    btn.disabled = true;
    sel.disabled = true;
    btn.textContent = 'Meracik soal...';
    res.style.display = 'block';
    res.innerHTML = '<div class="ai-msg loading">AI sedang membuat soal yang angkanya cantik...</div>';
    
    try {
      const { callAITutor } = await import('./solver.ts');
      const { renderMarkdown } = await import('./markdown.ts');
      const { typeset } = await import('./typeset.ts');
      
      const topicPrompt = chosenTopic === 'Acak Semua Bab' 
        ? 'dari salah satu topik Kalkulus 2 secara acak' 
        : `KHUSUS tentang topik: **${chosenTopic}**`;

      const sys = `Kamu adalah Generator Soal Kalkulus 2 tingkat Universitas (setara EAS ITS). 
Buatlah SATU soal uraian / essay ${topicPrompt}.

ATURAN WAJIB:
- Rancang angkanya agar HASIL PERHITUNGANNYA BULAT ATAU PECAHAN SEDERHANA (mudah dihitung tanpa kalkulator). Jangan terlalu mudah, tapi angkanya "cantik".
- Tampilkan soal dengan jelas.
- Kemudian berikan "KUNCI JAWABAN" langkah demi langkah.
- Gunakan Markdown dan LaTeX ($...$) untuk rumus.`;

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
