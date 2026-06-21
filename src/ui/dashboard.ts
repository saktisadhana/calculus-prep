// Dashboard section.
import { state, save, resetState } from '../storage/state.ts';
import { activeProfile, parseExam } from '../storage/profiles.ts';
import { navigateTo } from './navigation.ts';
import { dfmt, tfmt } from '../util.ts';

export function renderDashboard(): void {
  const el = document.getElementById('dash')!;
  const a = activeProfile();
  const exam = parseExam(a.examISO);
  const examStr = exam ? `${dfmt.format(exam)} — ${tfmt.format(exam)} WIB` : '—';

  el.innerHTML = `
    <h2>Selamat datang, <span id="welcomeName">${a.name}</span></h2>
    <p class="muted">Ujian: <b id="examLabel">${examStr}</b>. Aplikasi lengkap untuk persiapan Kalkulus 2 — rencana belajar, ringkasan materi, 60+ soal latihan, 3 mock exam, AI tutor, kartu kilat, dan tolak ukur.</p>

    <div class="grid g2" style="margin-top:14px">
      <div class="stat"><div class="big" id="s-mat">0%</div><div class="lbl">Materi dipahami</div></div>
      <div class="stat"><div class="big" id="s-jad">0%</div><div class="lbl">Jadwal selesai</div></div>
      <div class="stat"><div class="big" id="s-tu">0%</div><div class="lbl">Tolak Ukur tercapai</div></div>
      <div class="stat"><div class="big" id="s-mock">—</div><div class="lbl">Skor mock terbaik</div></div>
    </div>

    <div class="card">
      <h3 style="margin-top:4px">Strategi inti 5 langkah</h3>
      <ol>
        <li><b>Pahami pola, bukan hafal.</b> Tiap topik punya rumus master + langkah baku. Kuasai langkahnya.</li>
        <li><b>Active recall.</b> Setelah baca tiap subbab, tutup layar dan tulis ulang rumus + 1 contoh dari ingatan.</li>
        <li><b>Latihan bertingkat.</b> Mudah ke sedang ke sulit. Jangan loncat ke soal sulit sebelum yang dasar lancar.</li>
        <li><b>Timed practice.</b> Kerjakan mock exam dengan timer agar terbiasa tekanan waktu.</li>
        <li><b>Review kesalahan.</b> Catat tiap kesalahan di logbook mental — itu sumber nilai termudah.</li>
      </ol>
    </div>

    <div class="tip"><span class="tag">Urutan & prioritas</span><br>Jadwal menyusun <b>BAB 4 → 5 → 6</b> mengikuti silabus, tetapi mengalokasikan <b>lebih banyak waktu untuk BAB 4 &amp; 6</b> (bobot tinggi) dibanding BAB 5. Atur sendiri durasi di halaman Jadwal.</div>

    <div class="card">
      <h3 style="margin-top:4px">Alat bantu di app ini</h3>
      <div class="grid g3" style="margin-top:10px">
        <div class="stat" style="cursor:pointer" data-goto="flashcards"><div style="font-size:20px;font-weight:800;color:var(--acc2)">60</div><div class="lbl">Kartu Kilat</div></div>
        <div class="stat" style="cursor:pointer" data-goto="latihan"><div style="font-size:20px;font-weight:800;color:var(--acc)">60+</div><div class="lbl">Soal Latihan</div></div>
        <div class="stat" style="cursor:pointer" data-goto="mock"><div style="font-size:20px;font-weight:800;color:var(--warn)">3</div><div class="lbl">Mock Exam</div></div>
        <div class="stat" style="cursor:pointer" data-goto="solver"><div style="font-size:20px;font-weight:800;color:var(--ok)">AI</div><div class="lbl">Tutor Cerdas</div></div>
        <div class="stat" style="cursor:pointer" data-goto="drills"><div style="font-size:20px;font-weight:800;color:var(--bad)">3m</div><div class="lbl">Drill Cepat</div></div>
        <div class="stat" style="cursor:pointer" data-goto="materi"><div style="font-size:20px;font-weight:800;color:var(--acc3)">6</div><div class="lbl">Bab Materi</div></div>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-top:4px">Peta 3 bab</h3>
      <table>
        <tr><th>Bab</th><th>Inti</th><th>Bobot fokus</th></tr>
        <tr><td><b>BAB 4</b><br>Aplikasi Integral</td><td>Luas, volume (cakram/cincin/kulit), panjang kurva, luas permukaan, titik berat</td><td><b style="color:var(--bad)">Tinggi</b></td></tr>
        <tr><td><b>BAB 5</b><br>Parametrik &amp; Kutub</td><td>Kurva parametrik, koordinat &amp; grafik kutub, luas/panjang busur kutub, garis singgung</td><td><b style="color:var(--warn)">Sedang</b></td></tr>
        <tr><td><b>BAB 6</b><br>Barisan &amp; Deret</td><td>Barisan, deret, uji konvergensi, deret pangkat, Taylor/Maclaurin</td><td><b style="color:var(--bad)">Tinggi</b></td></tr>
      </table>
    </div>

    <div class="card">
      <h3 style="margin-top:4px">Catatan pribadi</h3>
      <p class="muted" style="margin-top:0">Tempat mencatat rumus yang sering lupa, kesalahan dari mock, atau pengingat. Tersimpan otomatis per profil.</p>
      <textarea class="fld" id="notes" placeholder="Tulis catatanmu di sini...">${state.notes || ''}</textarea>
    </div>

    <p class="muted" style="margin-top:18px"><a class="reset" id="resetDash">Reset progres profil ini</a></p>
  `;

  el.querySelectorAll<HTMLElement>('[data-goto]').forEach(s => {
    s.onclick = () => navigateTo(s.dataset.goto!);
  });

  document.getElementById('resetDash')!.onclick = () => {
    if (confirm('Hapus semua progres & centang untuk profil ini?')) resetState();
  };

  let notesT: ReturnType<typeof setTimeout>;
  document.getElementById('notes')!.addEventListener('input', (e) => {
    state.notes = (e.target as HTMLTextAreaElement).value;
    clearTimeout(notesT);
    notesT = setTimeout(save, 600);
  });
}
