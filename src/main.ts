// Main entry point — imports everything, renders all sections, wires events
import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/responsive.css';

import { studyDay, examDay } from './data/schedule.ts';
import { soal, type Question } from './data/questions.ts';
import { mocks } from './data/mocks.ts';
import { benchmarks, tuKeys } from './data/benchmarks.ts';
import { explainFor } from './data/formulas.ts';
import { GENS, TOPIC_KEYS, type GeneratedProblem } from './data/generators.ts';
import { flashcards } from './data/flashcards.ts';
import { SVG_AREA_CURVES, SVG_VOLUME_DISK, SVG_POLAR_CARDIOID, SVG_SERIES_CONV } from './data/diagrams.ts';

import {
  ensureProfiles, activeProfile, loadIdx, saveIdx,
  loadData, saveData, removeData, uid, defaultExamISO, parseExam,
} from './storage/profiles.ts';
import { Cloud } from './storage/cloud.ts';
import { state, save, resetState } from './storage/state.ts';

import { setupNavigation, setupSubnav, navigateTo } from './ui/navigation.ts';
import { typeset } from './ui/typeset.ts';
import { applyTheme, getTheme, setupTheme } from './ui/theme.ts';
import { startCountdown, updateCountdown } from './ui/countdown.ts';
import { setupFlowcharts } from './ui/flowcharts.ts';

// ===================================================================
//  DATE FORMATTERS
// ===================================================================
const dfmt = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const tfmt = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' });
function pad2(n: number) { return String(n).padStart(2, '0'); }

// ===================================================================
//  SECTION: DASHBOARD
// ===================================================================
function renderDashboard() {
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

    <div class="tip"><span class="tag">Urutan disarankan</span><br>BAB 4 (paling banyak rumus integral) ke BAB 6 (butuh ketelitian uji konvergensi) ke BAB 5 (relatif baru, butuh visualisasi). Jadwal di app menyusun 4 ke 5 ke 6 mengikuti urutan silabus agar tidak bingung.</div>

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

  // Goto links
  el.querySelectorAll<HTMLElement>('[data-goto]').forEach(s => {
    s.onclick = () => navigateTo(s.dataset.goto!);
  });

  // Reset
  document.getElementById('resetDash')!.onclick = () => {
    if (confirm('Hapus semua progres & centang untuk profil ini?')) resetState();
  };

  // Notes auto-save
  let notesT: ReturnType<typeof setTimeout>;
  document.getElementById('notes')!.addEventListener('input', (e) => {
    state.notes = (e.target as HTMLTextAreaElement).value;
    clearTimeout(notesT);
    notesT = setTimeout(save, 600);
  });
}

// ===================================================================
//  SECTION: JADWAL (Schedule) — Flexible + Pomodoro
// ===================================================================

let audioCtx: AudioContext | null = null;
let alarmPlaying = false;

function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return audioCtx;
}

function playAlarm() {
  if (alarmPlaying) return;
  alarmPlaying = true;

  const ctx = getAudioCtx();
  
  function chime(freq: number, delaySec: number) {
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    const osc = ctx.createOscillator();
    osc.type = 'sine'; // Gentle sine wave
    osc.frequency.value = freq;
    osc.connect(gain);
    
    const startTime = ctx.currentTime + delaySec;
    osc.start(startTime);
    
    // Soft attack and smooth decay
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.5, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 1.5);
    osc.stop(startTime + 1.5);
  }

  // Play a soft "Ding-Dong" (C5 -> E5)
  chime(523.25, 0);   
  chime(659.25, 0.4); 
  
  // Repeat once
  chime(523.25, 2.0); 
  chime(659.25, 2.4);

  // Auto-reset alarm state after the chimes finish
  setTimeout(() => {
    alarmPlaying = false;
  }, 4500);

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Waktu Habis!', { body: 'Sesi selesai. Saatnya istirahat/fokus!' });
  }
}

function stopAlarm() {
  // Since it now stops automatically, we just clear the flag
  alarmPlaying = false;
}

// --- Pomodoro state ---
type PomMode = 'focus' | 'break' | 'longbreak' | 'idle' | 'busy';

interface PomBlock {
  type: PomMode;
  duration: number; // minutes
  desc: string;
  time: string;
  k?: string;
}

let pomTimer: ReturnType<typeof setInterval> | null = null;
let pomRemaining = state.pomSavedState?.remaining || 0; // seconds
let pomMode: PomMode = state.pomSavedState?.mode || 'idle';
let pomSchedule: PomBlock[] = state.pomSavedState?.schedule || [];
let pomSessionIndex = state.pomSavedState?.sessionIndex || 0; 
let pomTotalFocus = state.pomSavedState?.totalFocus || 0; // total focus seconds this run

function persistPomState() {
  state.pomSavedState = {
    remaining: pomRemaining,
    mode: pomMode,
    schedule: pomSchedule,
    sessionIndex: pomSessionIndex,
    totalFocus: pomTotalFocus
  };
  save();
}

// Persist automatically when leaving the app or hiding it
window.addEventListener('beforeunload', persistPomState);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') persistPomState();
});

function pomDefaults() {
  return {
    startTime: state.pomStartTime as string || '06:00',
    focusMin: state.pomFocus as number || 25,
    breakMin: state.pomBreak as number || 5,
    longBreakMin: state.pomLongBreak as number || 15,
    sessionsBeforeLong: state.pomSessions as number || 4,
    busyStart: state.pomBusyStart as string || '',
    busyEnd: state.pomBusyEnd as string || '',
    busyLabel: state.pomBusyLabel as string || '',
  };
}

function savePomSettings(d: ReturnType<typeof pomDefaults>) {
  state.pomStartTime = d.startTime;
  state.pomFocus = d.focusMin;
  state.pomBreak = d.breakMin;
  state.pomLongBreak = d.longBreakMin;
  state.pomSessions = d.sessionsBeforeLong;
  state.pomBusyStart = d.busyStart;
  state.pomBusyEnd = d.busyEnd;
  state.pomBusyLabel = d.busyLabel;
  save();
}

function readPomForm(): ReturnType<typeof pomDefaults> {
  return {
    startTime: (document.getElementById('pomStartTime') as HTMLInputElement)?.value || '06:00',
    focusMin: parseInt((document.getElementById('pomFocusMin') as HTMLInputElement)?.value) || 25,
    breakMin: parseInt((document.getElementById('pomBreakMin') as HTMLInputElement)?.value) || 5,
    longBreakMin: parseInt((document.getElementById('pomLongBreakMin') as HTMLInputElement)?.value) || 15,
    sessionsBeforeLong: parseInt((document.getElementById('pomSessions') as HTMLInputElement)?.value) || 4,
    busyStart: (document.getElementById('pomBusyStart') as HTMLInputElement)?.value || '',
    busyEnd: (document.getElementById('pomBusyEnd') as HTMLInputElement)?.value || '',
    busyLabel: (document.getElementById('pomBusyLabel') as HTMLInputElement)?.value || '',
  };
}

function pomModeLabel(m: PomMode): string {
  switch (m) {
    case 'focus': return 'FOKUS';
    case 'break': return 'ISTIRAHAT';
    case 'longbreak': return 'ISTIRAHAT PANJANG';
    case 'busy': return 'SIBUK / JEDA';
    default: return 'SIAP';
  }
}

function pomModeClass(m: PomMode): string {
  switch (m) {
    case 'focus': return 'pom-focus';
    case 'break': return 'pom-break';
    case 'longbreak': return 'pom-longbreak';
    case 'busy': return 'pom-busy';
    default: return 'pom-idle';
  }
}

function updatePomUI() {
  const mins = Math.floor(pomRemaining / 60);
  const secs = pomRemaining % 60;
  const timeStr = `${pad2(mins)}:${pad2(secs)}`;
  
  const clock = document.getElementById('pomClock');
  if (clock) clock.textContent = timeStr;

  // Global visibility
  document.title = pomMode !== 'idle' ? `[${timeStr}] Kalkulus 2` : 'Kalkulus 2 Prep';
  
  const miniTimer = document.getElementById('topPomTimer');
  if (miniTimer) {
    if (pomMode === 'idle') {
      miniTimer.style.display = 'none';
      miniTimer.textContent = '';
    } else {
      miniTimer.style.display = 'inline-block';
      miniTimer.textContent = `⏱ ${timeStr}`;
      // Color based on focus or break
      if (pomMode === 'focus') {
        miniTimer.style.color = 'var(--primary)';
        miniTimer.style.background = 'rgba(14,165,233,0.1)';
      } else if (pomMode === 'busy') {
        miniTimer.style.color = 'var(--warn)';
        miniTimer.style.background = 'rgba(234,179,8,0.1)';
      } else {
        miniTimer.style.color = 'var(--success)';
        miniTimer.style.background = 'rgba(34,197,94,0.1)';
      }
    }
  }

  const label = document.getElementById('pomLabel');
  if (label) {
    label.textContent = pomModeLabel(pomMode);
    label.className = 'pom-label ' + pomModeClass(pomMode);
  }

  const sessionEl = document.getElementById('pomSessionCount');
  if (sessionEl) {
    if (pomMode === 'idle' || pomSchedule.length === 0) {
      sessionEl.textContent = 'Jadwal belum jalan';
    } else {
      sessionEl.textContent = `Sesi ${pomSessionIndex + 1} dari ${pomSchedule.length}`;
    }
  }

  const totalEl = document.getElementById('pomTotalFocus');
  if (totalEl) {
    const h = Math.floor(pomTotalFocus / 3600);
    const m = Math.floor((pomTotalFocus % 3600) / 60);
    totalEl.textContent = `Total fokus: ${h > 0 ? h + 'j ' : ''}${m} mnt`;
  }

  // Progress ring
  let total = 1;
  if (pomMode !== 'idle' && pomSchedule[pomSessionIndex]) {
    total = pomSchedule[pomSessionIndex].duration * 60;
  }
  const pct = total > 0 ? ((total - pomRemaining) / total) * 100 : 0;
  const ring = document.getElementById('pomRing') as HTMLElement;
  if (ring) ring.style.setProperty('--pom-pct', `${pct}%`);
}

function advancePomodoro() {
  const currentBlock = pomSchedule[pomSessionIndex];
  
  // Auto-check task if it's a focus block with a key
  if (currentBlock && currentBlock.type === 'focus' && currentBlock.k) {
    state[currentBlock.k] = true;
    save();
    updateStats();
    // Also visually update the checkbox in the DOM
    const chk = document.getElementById(currentBlock.k) as HTMLInputElement;
    if (chk) {
      chk.checked = true;
      const wrap = chk.closest('.chk');
      if (wrap) wrap.classList.add('done');
    }
  }

  pomSessionIndex++;
  if (pomSessionIndex >= pomSchedule.length) {
    pomReset(); // Finished the whole schedule
    return;
  }
  
  const nextBlock = pomSchedule[pomSessionIndex];
  pomMode = nextBlock.type;
  pomRemaining = nextBlock.duration * 60;
  persistPomState();
}

function pomTick() {
  if (pomRemaining <= 0) {
    playAlarm();
    advancePomodoro();
    updatePomUI();
    return;
  }
  pomRemaining--;
  if (pomMode === 'focus') pomTotalFocus++;
  updatePomUI();
}

function syncPomToRealTime(): boolean {
  if (pomSchedule.length === 0) return false;
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const currentSec = now.getSeconds();

  for (let i = 0; i < pomSchedule.length; i++) {
    const block = pomSchedule[i];
    const [startStr, endStr] = block.time.split('–');
    if (!startStr || !endStr) continue;
    
    const [sh, sm] = startStr.split(':').map(Number);
    const startMins = sh * 60 + sm;
    const [eh, em] = endStr.split(':').map(Number);
    let endMins = eh * 60 + em;
    if (endMins <= startMins) endMins += 24 * 60; // handle midnight crossing

    let checkMin = currentMin;
    if (checkMin < startMins && startMins > 12 * 60 && checkMin < 12 * 60) {
       checkMin += 24 * 60; // early morning but schedule is from last night
    }

    if (checkMin >= startMins && checkMin < endMins) {
      pomSessionIndex = i;
      pomMode = block.type;
      
      const elapsedMins = checkMin - startMins;
      const elapsedSecs = elapsedMins * 60 + currentSec;
      const totalSecs = block.duration * 60;
      
      pomRemaining = Math.max(0, totalSecs - elapsedSecs);
      
      // Calculate accumulated focus time up to this point
      pomTotalFocus = 0;
      for (let j = 0; j < i; j++) {
        if (pomSchedule[j].type === 'focus') pomTotalFocus += pomSchedule[j].duration * 60;
      }
      if (pomMode === 'focus') pomTotalFocus += elapsedSecs;

      return true;
    }
  }
  return false;
}

function pomStart() {
  if (pomSchedule.length === 0) {
    alert('Buat jadwal terlebih dahulu di bawah!');
    return;
  }
  if (pomMode === 'idle') {
    pomSessionIndex = 0;
    const firstBlock = pomSchedule[0];
    pomMode = firstBlock.type;
    pomRemaining = firstBlock.duration * 60;
    pomTotalFocus = 0;
  }
  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  // Resume audio context (Chrome autoplay policy)
  getAudioCtx().resume();
  if (pomTimer) clearInterval(pomTimer);
  pomTimer = setInterval(pomTick, 1000);
  updatePomUI();
  const startBtn = document.getElementById('pomStart');
  if (startBtn) startBtn.textContent = 'Berjalan...';
  persistPomState();
}

function pomPause() {
  if (pomTimer) { clearInterval(pomTimer); pomTimer = null; }
  const startBtn = document.getElementById('pomStart');
  if (startBtn) startBtn.textContent = 'Lanjut';
  persistPomState();
}

function pomSkip() {
  stopAlarm();
  if (pomMode === 'idle' || pomSchedule.length === 0) return;
  advancePomodoro();
  updatePomUI();
}

function pomReset() {
  stopAlarm();
  if (pomTimer) { clearInterval(pomTimer); pomTimer = null; }
  pomMode = 'idle';
  pomRemaining = 0;
  pomSessionIndex = 0;
  pomTotalFocus = 0;
  updatePomUI();
  const startBtn = document.getElementById('pomStart');
  if (startBtn) startBtn.textContent = 'Mulai';
  persistPomState();
}

function pomBusy() {
  // If user hits busy, insert a temporary busy block right where we are
  pomMode = 'busy';
  const busyMin = parseInt((document.getElementById('pomBusyDuration') as HTMLInputElement)?.value) || 30;
  pomRemaining = busyMin * 60;
  updatePomUI();
  if (!pomTimer) pomTimer = setInterval(pomTick, 1000);
  persistPomState();
}

function pomSyncTime() {
  if (pomSchedule.length === 0) {
    alert('Buat jadwal terlebih dahulu!');
    return;
  }
  const synced = syncPomToRealTime();
  if (synced) {
    // Auto-check any focus sessions we skipped
    for (let i = 0; i < pomSessionIndex; i++) {
      const b = pomSchedule[i];
      if (b.type === 'focus' && b.k) {
        state[b.k] = true;
        const chk = document.getElementById(b.k) as HTMLInputElement;
        if (chk) {
          chk.checked = true;
          const wrap = chk.closest('.chk');
          if (wrap) wrap.classList.add('done');
        }
      }
    }
    save();
    updateStats();
    updatePomUI();
    
    // Automatically start timer if not running
    if (!pomTimer) {
      getAudioCtx().resume();
      pomTimer = setInterval(pomTick, 1000);
      const startBtn = document.getElementById('pomStart');
      if (startBtn) startBtn.textContent = 'Berjalan...';
    }
    persistPomState();
  } else {
    alert('Waktu saat ini berada di luar rentang jadwal (belum mulai atau sudah selesai).');
  }
}

// --- Generate flexible timeline ---
function generateTimeline(): string {
  const d = readPomForm();
  const [sh, sm] = (d.startTime || '06:00').split(':').map(Number);
  let cursor = sh * 60 + sm; // in minutes from midnight
  const blocks: { time: string; desc: string; type: string; k?: string }[] = [];
  const totalSessions = d.sessionsBeforeLong * 2; // two full cycles ≈ 8 sessions

  const focusTasks = studyDay.filter(s => s.type === '');
  let focusIdx = 0;

  // Parse busy block
  let busyStartMin = -1, busyEndMin = -1;
  if (d.busyStart && d.busyEnd) {
    const [bsh, bsm] = d.busyStart.split(':').map(Number);
    const [beh, bem] = d.busyEnd.split(':').map(Number);
    busyStartMin = bsh * 60 + bsm;
    busyEndMin = beh * 60 + bem;
  }

  function fmtTime(m: number): string {
    return `${pad2(Math.floor(m / 60) % 24)}:${pad2(m % 60)}`;
  }

  pomSchedule = [];

  for (let i = 0; i < totalSessions && cursor < 30 * 60; i++) {
    // Check if we hit the busy block
    if (busyStartMin >= 0 && cursor >= busyStartMin && cursor < busyEndMin) {
      const busyDur = busyEndMin - busyStartMin;
      pomSchedule.push({ type: 'busy', duration: busyDur, time: `${fmtTime(busyStartMin)}–${fmtTime(busyEndMin)}`, desc: d.busyLabel || 'Sibuk / istirahat' });
      cursor = busyEndMin;
    }
    if (busyStartMin >= 0 && cursor < busyStartMin && cursor + d.focusMin > busyStartMin) {
      const truncDur = busyStartMin - cursor;
      if (truncDur >= 10) {
        pomSchedule.push({ type: 'focus', duration: truncDur, time: `${fmtTime(cursor)}–${fmtTime(busyStartMin)}`, desc: `Sesi ${i + 1}: Fokus belajar (${truncDur} mnt — dipotong)` });
      }
      const busyDur = busyEndMin - busyStartMin;
      pomSchedule.push({ type: 'busy', duration: busyDur, time: `${fmtTime(busyStartMin)}–${fmtTime(busyEndMin)}`, desc: d.busyLabel || 'Sibuk / istirahat' });
      cursor = busyEndMin;
      continue;
    }

    // Focus
    const isPrep = focusIdx === 0;
    const duration = isPrep ? 15 : d.focusMin;
    const focusEnd = cursor + duration;
    const taskDesc = focusIdx < focusTasks.length ? focusTasks[focusIdx].desc : `Review mandiri (${duration} mnt)`;
    pomSchedule.push({ type: 'focus', duration, time: `${fmtTime(cursor)}–${fmtTime(focusEnd)}`, desc: taskDesc, k: 'jt' + focusIdx });
    focusIdx++;
    cursor = focusEnd;

    // Break
    const isLong = (i + 1) % d.sessionsBeforeLong === 0;
    const brkMin = isLong ? d.longBreakMin : d.breakMin;
    const brkEnd = cursor + brkMin;
    pomSchedule.push({ type: isLong ? 'longbreak' : 'break', duration: brkMin, time: `${fmtTime(cursor)}–${fmtTime(brkEnd)}`, desc: isLong ? `Istirahat panjang (${brkMin} mnt)` : `Istirahat (${brkMin} mnt)` });
    cursor = brkEnd;
  }

  if (pomSchedule.length === 0) return '<p class="muted">Atur waktu mulai dan tekan "Buat jadwal".</p>';

  const endTime = fmtTime(cursor);
  let html = pomSchedule.map(b => {
    if (b.type !== 'focus') return `<div class="slot brk"><div class="t">${b.time}</div><div>${b.desc}</div></div>`;
    
    // Focus slot with checkbox
    const k = (b as any).k;
    const done = state[k] ? 'done' : '';
    return `<div class="slot">
      <div class="t">${b.time}</div>
      <div class="chk ${done}" data-key="${k}" style="border:none;padding:2px 0">
        <input type="checkbox" id="${k}" ${state[k] ? 'checked' : ''}>
        <label for="${k}">${b.desc}</label>
      </div>
    </div>`;
  }).join('');
  html += `<div class="slot brk"><div class="t">${endTime}</div><div>Selesai — istirahat penuh, tidur cukup!</div></div>`;
  return html;
}

function renderSchedule() {
  const el = document.getElementById('jadwal')!;
  const a = activeProfile();
  const exam = parseExam(a.examISO);
  const examStr = exam ? dfmt.format(exam) : '—';
  const d = pomDefaults();

  el.innerHTML = `
    <h2>Jadwal Belajar Fleksibel</h2>
    <p class="muted">Atur jadwalmu sendiri — pilih kapan mulai, berapa lama fokus dan istirahat, dan tandai waktu sibuk. Timer Pomodoro dengan alarm bunyi otomatis.</p>
    <div class="progwrap"><div class="progbar" id="jadbar"></div></div>

    <!-- Pomodoro Timer -->
    <div class="pom-container">
      <div class="pom-ring-wrap">
        <div class="pom-ring" id="pomRing">
          <div class="pom-inner">
            <div class="pom-clock" id="pomClock">00:00</div>
            <div class="pom-label pom-idle" id="pomLabel">SIAP</div>
          </div>
        </div>
      </div>
      <div class="pom-stats">
        <span id="pomSessionCount">Sesi: 0</span>
        <span id="pomTotalFocus">Total fokus: 0 mnt</span>
      </div>
      <div class="pom-controls">
        <button class="btn lg" id="pomStart">Mulai</button>
        <button class="btn ghost" id="pomPause">Jeda</button>
        <button class="btn ghost" id="pomSkip">Skip</button>
        <button class="btn red sm" id="pomReset">Reset</button>
      </div>
      <div class="row" style="justify-content:center;margin-top:8px">
        <button class="btn ghost sm" id="pomSyncBtn" style="color:var(--primary)">Sync Jam Sekarang</button>
        <button class="btn ghost sm" id="pomBusyBtn">Sibuk / Jeda (<input type="number" id="pomBusyDuration" value="30" min="5" max="120" style="width:45px;text-align:center;background:var(--panel2);border:1px solid var(--line);border-radius:4px;color:var(--ink);font-size:13px;padding:2px 4px"> mnt)</button>
        <button class="btn ghost sm" id="pomStopAlarm" style="display:none">Stop Alarm</button>
      </div>
    </div>

    <!-- Schedule Config -->
    <div class="card">
      <h3 style="margin-top:4px">Pengaturan jadwal</h3>
      <div class="grid g3" style="gap:10px">
        <div class="field"><label>Mulai belajar</label><input class="fld" type="time" id="pomStartTime" value="${d.startTime}"></div>
        <div class="field"><label>Fokus (menit)</label><input class="fld" type="number" id="pomFocusMin" value="${d.focusMin}" min="10" max="90"></div>
        <div class="field"><label>Istirahat (menit)</label><input class="fld" type="number" id="pomBreakMin" value="${d.breakMin}" min="1" max="30"></div>
      </div>
      <div class="grid g3" style="gap:10px;margin-top:10px">
        <div class="field"><label>Istirahat panjang (menit)</label><input class="fld" type="number" id="pomLongBreakMin" value="${d.longBreakMin}" min="5" max="60"></div>
        <div class="field"><label>Sesi sebelum istirahat panjang</label><input class="fld" type="number" id="pomSessions" value="${d.sessionsBeforeLong}" min="2" max="8"></div>
        <div class="field"></div>
      </div>

      <h4 style="margin-top:18px">Waktu sibuk / istirahat wajib (opsional)</h4>
      <p class="muted" style="margin-top:0;font-size:13px">Misal: makan siang, sholat, kegiatan lain. Jadwal otomatis akan melewati waktu ini.</p>
      <div class="grid g3" style="gap:10px">
        <div class="field"><label>Mulai sibuk</label><input class="fld" type="time" id="pomBusyStart" value="${d.busyStart}"></div>
        <div class="field"><label>Selesai sibuk</label><input class="fld" type="time" id="pomBusyEnd" value="${d.busyEnd}"></div>
        <div class="field"><label>Keterangan</label><input class="fld" type="text" id="pomBusyLabel" value="${d.busyLabel}" placeholder="mis. Makan siang"></div>
      </div>

      <div class="row" style="margin-top:14px">
        <button class="btn" id="pomGenerate">Buat jadwal</button>
        <button class="btn ghost sm" id="pomSaveSettings">Simpan pengaturan</button>
      </div>
    </div>

    <!-- Generated Timeline -->
    <div class="card">
      <h3 style="margin-top:4px">Timeline belajarmu</h3>
      <div class="timeline" id="pomTimeline"></div>
    </div>

    <!-- Exam Day (fixed) -->
    <div class="card">
      <h3 style="margin-top:4px">HARI UJIAN — <span>${examStr}</span></h3>
      <div class="timeline" id="tl-exam">${renderExamTL()}</div>
    </div>

    <div class="warnbox"><span class="tag">Aturan emas</span><br>Tidur minimal 6–7 jam. Otak mengonsolidasi memori saat tidur — begadang penuh justru menurunkan skor. Berhenti belajar maksimal jam 23:00.</div>

    <div class="tip"><span class="tag">Tips Pomodoro</span><br>
      <b>25/5</b> — Standar. Fokus 25 mnt, istirahat 5 mnt. Bagus untuk materi baru.<br>
      <b>50/10</b> — Deep work. Untuk soal sulit dan mock exam.<br>
      <b>45/15</b> — Balanced. Istirahat cukup untuk review kartu kilat.<br>
      Setiap 4 sesi, ambil istirahat panjang 15–30 mnt. Minum, jalan, stretch.
    </div>
  `;

  // Wire events
  document.getElementById('pomStart')!.onclick = pomStart;
  document.getElementById('pomPause')!.onclick = pomPause;
  document.getElementById('pomSkip')!.onclick = pomSkip;
  document.getElementById('pomReset')!.onclick = pomReset;
  document.getElementById('pomSyncBtn')!.onclick = pomSyncTime;
  document.getElementById('pomBusyBtn')!.onclick = pomBusy;
  document.getElementById('pomStopAlarm')!.onclick = () => {
    stopAlarm();
    document.getElementById('pomStopAlarm')!.style.display = 'none';
  };

  document.getElementById('pomGenerate')!.onclick = () => {
    const settings = readPomForm();
    savePomSettings(settings);
    document.getElementById('pomTimeline')!.innerHTML = generateTimeline();
    pomSessionIndex = 0;
    pomRemaining = 0;
    pomMode = 'idle';
    persistPomState();
    updatePomUI();
  };
  document.getElementById('pomSaveSettings')!.onclick = () => {
    savePomSettings(readPomForm());
    const btn = document.getElementById('pomSaveSettings')!;
    btn.textContent = 'Tersimpan!';
    setTimeout(() => btn.textContent = 'Simpan pengaturan', 1500);
  };

  // Auto-generate on load if settings exist
  if (pomSchedule.length > 0) {
    document.getElementById('pomTimeline')!.innerHTML = generateTimelineFromExisting();
    updatePomUI();
    if (pomMode !== 'idle') {
      const startBtn = document.getElementById('pomStart');
      if (startBtn) startBtn.textContent = 'Lanjut';
    }
  } else if (d.startTime) {
    document.getElementById('pomTimeline')!.innerHTML = generateTimeline();
  }
}

function generateTimelineFromExisting(): string {
  if (pomSchedule.length === 0) return '<p class="muted">Atur waktu mulai dan tekan "Buat jadwal".</p>';
  const endTime = pomSchedule[pomSchedule.length - 1].time.split('–')[1] || 'Selesai';
  let html = pomSchedule.map(b => {
    if (b.type !== 'focus') return `<div class="slot brk"><div class="t">${b.time}</div><div>${b.desc}</div></div>`;
    const k = (b as any).k;
    const done = state[k] ? 'done' : '';
    return `<div class="slot">
      <div class="t">${b.time}</div>
      <div class="chk ${done}" data-key="${k}" style="border:none;padding:2px 0">
        <input type="checkbox" id="${k}" ${state[k] ? 'checked' : ''}>
        <label for="${k}">${b.desc}</label>
      </div>
    </div>`;
  }).join('');
  html += `<div class="slot brk"><div class="t">${endTime}</div><div>Selesai — istirahat penuh, tidur cukup!</div></div>`;
  return html;
}

function renderExamTL(): string {
  return examDay.map((s, i) => {
    const k = 'jm' + i;
    const done = state[k] ? 'done' : '';
    return `<div class="slot ${s.type}">
      <div class="t">${s.time}</div>
      <div class="chk ${done}" data-key="${k}" style="border:none;padding:2px 0">
        <input type="checkbox" id="${k}" ${state[k] ? 'checked' : ''}>
        <label for="${k}">${s.desc}</label>
      </div></div>`;
  }).join('');
}

// ===================================================================
//  SECTION: PRASYARAT (Bab 1-3)
// ===================================================================
function renderPrerequisites() {
  const el = document.getElementById('prasyarat')!;
  el.innerHTML = `
    <h2>Prasyarat — Bab 1, 2, 3</h2>
    <p class="muted">Bab 4–6 dibangun di atas Bab 1–3. Bila lupa asal sebuah teknik, lihat ringkasan di sini. Chip <b>Prasyarat</b> di Ringkasan Materi &amp; Soal Solver akan melompat ke subbab yang relevan di halaman ini.</p>

    <div class="card">
      <h3 style="margin-top:4px">Bab 1 — Fungsi Transenden <span class="muted" style="font-size:13px">(hlm. 1)</span></h3>
      <div id="pre-1-1" class="presub">
        <h4>1.1 Fungsi Eksponensial dan Logaritma (hlm. 1)</h4>
        <div class="formula">$$\\frac{d}{dx}e^x=e^x,\\quad \\int e^x dx=e^x+C,\\quad \\frac{d}{dx}\\ln x=\\frac1x,\\quad \\int\\frac{dx}{x}=\\ln|x|+C$$</div>
        <p class="muted">Juga $\\frac{d}{dx}a^x=a^x\\ln a$ dan $\\int a^x dx=\\dfrac{a^x}{\\ln a}+C$. Mendasari deret Taylor $e^x$ dan banyak integral di Bab 2–6.</p>
      </div>
      <div id="pre-1-2" class="presub">
        <h4>1.2 Fungsi Invers Trigonometri (hlm. 33)</h4>
        <div class="formula">$$\\frac{d}{dx}\\arcsin x=\\frac{1}{\\sqrt{1-x^2}},\\qquad \\frac{d}{dx}\\arctan x=\\frac{1}{1+x^2}$$</div>
        <div class="formula">$$\\int\\frac{dx}{\\sqrt{a^2-x^2}}=\\arcsin\\frac xa+C,\\qquad \\int\\frac{dx}{a^2+x^2}=\\frac1a\\arctan\\frac xa+C$$</div>
      </div>
      <div id="pre-1-3" class="presub">
        <h4>1.3 Fungsi Hiperbolik (hlm. 54)</h4>
        <div class="formula">$$\\sinh x=\\frac{e^x-e^{-x}}{2},\\quad \\cosh x=\\frac{e^x+e^{-x}}{2},\\quad \\cosh^2x-\\sinh^2x=1$$</div>
        <p class="muted">$\\frac{d}{dx}\\sinh x=\\cosh x$, $\\frac{d}{dx}\\cosh x=\\sinh x$, $\\int\\sinh x\\,dx=\\cosh x+C$.</p>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-top:4px">Bab 2 — Teknik Integrasi <span class="muted" style="font-size:13px">(hlm. 69)</span></h3>
      <div id="pre-2-1" class="presub">
        <h4>2.1 Integrasi Parsial dan Fungsi Trigonometri (hlm. 69)</h4>
        <div class="formula">$$\\int u\\,dv=uv-\\int v\\,du$$</div>
        <p class="muted">Urutan memilih $u$: <b>LIATE</b> (Logaritma, Invers trig, Aljabar, Trig, Eksponen). Untuk $\\int\\sin^2,\\int\\cos^2$ pakai identitas sudut ganda.</p>
      </div>
      <div id="pre-2-2" class="presub">
        <h4>2.2 Fungsi Rasional; Pecahan Parsial (hlm. 86)</h4>
        <div class="formula">$$\\frac{1}{(x-a)(x-b)}=\\frac{A}{x-a}+\\frac{B}{x-b}$$</div>
        <p class="muted">Faktor berulang $(x-a)^2$ butuh $\\frac{A}{x-a}+\\frac{B}{(x-a)^2}$.</p>
      </div>
      <div id="pre-2-3" class="presub">
        <h4>2.3 Teknik-Teknik Integrasi yang Lain (hlm. 97)</h4>
        <p class="muted">Substitusi trigonometri: $\\sqrt{a^2-x^2}\\Rightarrow x=a\\sin\\theta$; $\\sqrt{a^2+x^2}\\Rightarrow x=a\\tan\\theta$; $\\sqrt{x^2-a^2}\\Rightarrow x=a\\sec\\theta$.</p>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-top:4px">Bab 3 — Integrasi Numerik &amp; Integrasi Tak Wajar <span class="muted" style="font-size:13px">(hlm. 107)</span></h3>
      <div id="pre-3-1" class="presub">
        <h4>3.1 Integrasi Numerik (hlm. 107)</h4>
        <div class="formula">$$\\text{Trapesium: } \\int_a^b f\\,dx\\approx \\frac{h}{2}\\big(f_0+2f_1+\\dots+2f_{n-1}+f_n\\big)$$</div>
        <div class="formula">$$\\text{Simpson: } \\int_a^b f\\,dx\\approx \\frac{h}{3}\\big(f_0+4f_1+2f_2+\\dots+4f_{n-1}+f_n\\big)$$</div>
      </div>
      <div id="pre-3-2" class="presub">
        <h4>3.2 Integral Tak Wajar (hlm. 121)</h4>
        <div class="formula">$$\\int_1^\\infty \\frac{dx}{x^p}\\ \\text{konvergen} \\iff p>1$$</div>
        <p class="muted">Batas tak hingga atau integran tak terbatas dihitung sebagai limit. <i>Mendasari uji integral &amp; deret-p (6.3).</i></p>
      </div>
      <div id="pre-3-3" class="presub">
        <h4>3.3 Limit Bentuk Tak Tentu — L'Hôpital (hlm. 131)</h4>
        <div class="formula">$$\\text{Bila } \\tfrac{0}{0}\\ \\text{atau}\\ \\tfrac{\\infty}{\\infty}:\\quad \\lim\\frac{f}{g}=\\lim\\frac{f'}{g'}$$</div>
        <p class="muted">Bentuk $0\\cdot\\infty,\\ 1^\\infty,\\ \\infty-\\infty,\\ 0^0$ diubah dulu ke $\\tfrac00$ atau $\\tfrac\\infty\\infty$. <i>Dipakai untuk limit barisan (6.1).</i></p>
      </div>
    </div>
  `;
}

// ===================================================================
//  SECTION: MATERI (Materials with formula explanations)
// ===================================================================
function renderMaterials() {
  const el = document.getElementById('materi')!;
  // This is the largest section — I'll insert it as HTML
  // For brevity, reusing the exact same content structure from the original app
  el.innerHTML = `
    <h2>Ringkasan Materi</h2>
    <p class="muted">Setiap subbab: konsep inti + rumus master + contoh kilat. <b>Arahkan kursor (atau ketuk) sebuah rumus</b> untuk melihat arti tiap simbol. Centang "Saya paham" di bawah tiap bab.</p>
    
    <div class="card" style="margin-bottom: 20px; border-left: 4px solid var(--acc2);">
      <h3 style="margin-top:0; font-size:16px;">Bahan Belajar & Pembahasan Soal EAS</h3>
      <ul style="margin: 8px 0 0; padding-left: 20px; font-size: 14px;">
        <li><a href="https://youtu.be/NRFA2M6aeRU?si=-7ufdm5R1wIQoVe9" target="_blank">Pembahasan Soal EAS - Part 1</a></li>
        <li><a href="https://youtu.be/yatPC_0DaGQ?si=v9rH8EOke3kz0p5x" target="_blank">Pembahasan Soal EAS - Part 2</a></li>
      </ul>
    </div>

    <div class="subnav" id="matnav">
      <button data-m="b4" class="active">BAB 4 — Aplikasi Integral</button>
      <button data-m="b5">BAB 5 — Parametrik &amp; Kutub</button>
      <button data-m="b6">BAB 6 — Barisan &amp; Deret</button>
    </div>

    <div class="matpage active" id="b4">
      <h3>4.1 Luas Antara Dua Kurva</h3>
      <p>Luas daerah di antara dua kurva = integral dari (kurva atas − kurva bawah).</p>
      ${SVG_AREA_CURVES}
      <div class="formula">$$A=\\int_a^b \\big[f(x)-g(x)\\big]\\,dx \\quad\\text{(irisan vertikal, } f\\ge g)$$</div>
      <div class="formula">$$A=\\int_c^d \\big[w(y)-v(y)\\big]\\,dy \\quad\\text{(irisan horizontal, } w\\ge v)$$</div>
      <ul>
        <li>Langkah: (1) gambar sketsa, (2) cari titik potong sebagai batas, (3) tentukan mana yang atas/kanan, (4) integralkan selisihnya.</li>
        <li>Jika kurva berpotongan/bertukar posisi, <b>pecah</b> integral di titik potong.</li>
      </ul>
      <div class="q" style="margin-top: 15px">
        <div class="qh"><b>Contoh Soal: Luas Antara Dua Kurva</b></div>
        <p>Hitunglah luas daerah yang dibatasi oleh parabola $y = x^2$ dan garis $y = x$.</p>
        <button class="toggle">Lihat Langkah-langkah</button>
        <div class="ans">
          <b>Langkah 1: Cari titik potong (batas integral)</b><br>
          Samakan persamaannya: $x^2 = x \\implies x^2 - x = 0 \\implies x(x - 1) = 0$<br>
          Batas integralnya adalah dari $x = 0$ sampai $x = 1$.<br><br>
          <b>Langkah 2: Tentukan kurva "atas" dan "bawah"</b><br>
          Pilih titik uji antara $0$ dan $1$, misal $x = 0.5$.<br>
          Pada garis: $y = 0.5$<br>
          Pada parabola: $y = 0.5^2 = 0.25$<br>
          Karena $0.5 > 0.25$, maka garis $y = x$ adalah kurva atas, dan $y = x^2$ adalah kurva bawah.<br><br>
          <b>Langkah 3: Hitung integral selisihnya</b><br>
          $$A = \\int_0^1 (x - x^2) \\,dx$$
          $$A = \\left[ \\frac{1}{2}x^2 - \\frac{1}{3}x^3 \\right]_0^1 = \\left( \\frac{1}{2} - \\frac{1}{3} \\right) - 0 = \\frac{1}{6}$$
          Luasnya adalah $\\frac{1}{6}$ satuan luas.
        </div>
      </div>

      <h3>4.2 Volume Benda Putar</h3>
      <p>Tiga metode utama. Pilih sesuai sumbu putar &amp; bentuk daerah.</p>
      ${SVG_VOLUME_DISK}
      <h4>Metode Cakram (Disk)</h4>
      <div class="formula">$$V=\\pi\\int_a^b [R(x)]^2\\,dx$$</div>
      <h4>Metode Cincin (Washer)</h4>
      <div class="formula">$$V=\\pi\\int_a^b \\big([R_{luar}]^2-[R_{dalam}]^2\\big)\\,dx$$</div>
      <h4>Metode Kulit Tabung (Shell)</h4>
      <div class="formula">$$V=2\\pi\\int_a^b (\\text{jari-jari})(\\text{tinggi})\\,dx=2\\pi\\int_a^b x\\,f(x)\\,dx$$</div>
      <div class="warnbox"><span class="tag">Perhatian</span><br>Hati-hati sumbu putar bukan sumbu koordinat. Jari-jari = jarak ke garis itu.</div>
      <div class="q" style="margin-top: 15px; margin-bottom: 15px">
        <div class="qh"><b>Contoh Soal: Volume (Metode Cakram)</b></div>
        <p>Daerah di bawah kurva $y = \\sqrt{x}$ dari $x=0$ sampai $x=4$ diputar mengelilingi sumbu-x. Berapa volumenya?</p>
        <button class="toggle">Lihat Langkah-langkah</button>
        <div class="ans">
          <b>Langkah 1: Identifikasi Jari-jari $R(x)$</b><br>
          Karena diputar pada sumbu-x, dan tidak ada rongga kosong antara sumbu-x dan daerah, kita pakai Metode Cakram. Jari-jari cakram adalah tinggi kurva: $R(x) = \\sqrt{x}$.<br><br>
          <b>Langkah 2: Susun Integral Volume</b><br>
          $$V = \\pi \\int_0^4 [R(x)]^2 \\,dx = \\pi \\int_0^4 (\\sqrt{x})^2 \\,dx = \\pi \\int_0^4 x \\,dx$$
          <br>
          <b>Langkah 3: Evaluasi Integral</b><br>
          $$V = \\pi \\left[ \\frac{x^2}{2} \\right]_0^4 = \\pi \\left( \\frac{16}{2} - 0 \\right) = 8\\pi$$
          Volumenya adalah $8\\pi$.
        </div>
      </div>
      <div class="tip"><b>Bingung pilih metode?</b> Gunakan <a style="cursor:pointer" class="preref" data-goto-fc="true">Flowchart Volume</a> di bawah halaman Materi.<br>
      <b>Video Referensi:</b> 
        <a href="https://youtu.be/Ty550_vJPrs?si=lbL0s1w4MnwQx17m" target="_blank">Part 1</a> · 
        <a href="https://youtu.be/8fCFXQHfU2g?si=WYR8mEKhDsB43MJW" target="_blank">Part 2</a> · 
        <a href="https://youtu.be/oRbKkzXo7f8?si=kmQtYne_jBG0U8dZ" target="_blank">Part 3</a>
      </div>

      <h3>4.3 Panjang Suatu Kurva (Arc Length)</h3>
      <div class="prereq"><span class="tag">Prasyarat</span> <a class="preref" data-pre="pre-2-3">2.3 Teknik Integrasi Lain (hlm. 97)</a> — integral bentuk akar.</div>
      <div class="formula">$$L=\\int_a^b \\sqrt{1+\\left(\\dfrac{dy}{dx}{dy}\\right)^2}\\,dx$$</div>
      <div class="tip"><b>Contoh.</b> $y=\\tfrac23 x^{3/2}$, $y'=x^{1/2}$, $1+y'^2=1+x$, jadi $L=\\int_0^a\\sqrt{1+x}\\,dx$.<br>
      <b>Video Referensi:</b> <a href="https://youtu.be/K1UgI0yPHOY?si=FqsqeGkXdEYjL4Ib" target="_blank">Panjang Busur</a></div>

      <h3>4.4 Luas Permukaan Benda Putar</h3>
      <div class="prereq"><span class="tag">Prasyarat</span> <a class="preref" data-pre="pre-2-1">2.1 Integrasi Parsial (hlm. 69)</a> · <a class="preref" data-pre="pre-2-3">2.3 Substitusi akar (hlm. 97)</a></div>
      <div class="formula">$$\\text{Putar sumbu-x: } S=2\\pi\\int_a^b y\\sqrt{1+(y')^2}\\,dx$$</div>
      <div class="formula">$$\\text{Putar sumbu-y: } S=2\\pi\\int_a^b x\\sqrt{1+(y')^2}\\,dx$$</div>
      <div class="tip" style="margin-top: 10px;"><b>Video Referensi:</b> <a href="https://youtu.be/8OH4Jt3toQc?si=8Z35QWQFxP7cBDTK" target="_blank">Luas Permukaan Benda Putar</a></div>

      <h3>4.5 Titik Berat (Centroid)</h3>
      <div class="formula">$$\\bar{x}=\\frac{1}{A}\\int_a^b x\\,[f(x)-g(x)]\\,dx$$</div>
      <div class="formula">$$\\bar{y}=\\frac{1}{A}\\int_a^b \\tfrac12\\big([f(x)]^2-[g(x)]^2\\big)\\,dx$$</div>
      <ul>
        <li><b>Teorema Pappus:</b> $V=2\\pi\\bar{d}\\,A$. Cepat untuk soal pilihan ganda.</li>
      </ul>
      <div class="warnbox"><span class="tag">Kesalahan umum BAB 4</span>
        <ul style="margin-bottom:0">
          <li>Lupa menentukan kurva mana yang "atas" sehingga hasil luas negatif.</li>
          <li>Memakai cakram padahal daerah punya lubang (seharusnya cincin).</li>
          <li>Salah jari-jari saat sumbu putar bukan sumbu koordinat.</li>
        </ul>
      </div>
      <div class="card" style="margin-top:18px">
        <div class="chk" data-key="mat-b4"><input type="checkbox" id="mat-b4" ${state['mat-b4'] ? 'checked' : ''}><label for="mat-b4">Saya paham BAB 4 (bisa pilih metode volume yang tepat &amp; hitung tanpa contekan)</label></div>
      </div>

      <h3 style="margin-top:30px">Flowchart: Metode Volume Mana yang Dipilih?</h3>
      <div id="fc-volume"></div>
    </div>

    <div class="matpage" id="b5">
      <h3>5.1 Persamaan Parametrik</h3>
      <div class="formula">$$\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt},\\qquad \\frac{d^2y}{dx^2}=\\frac{d}{dt}\\!\\left(\\frac{dy}{dx}\\right)\\Big/\\frac{dx}{dt}$$</div>
      <div class="formula">$$L=\\int_{t_1}^{t_2}\\sqrt{\\left(\\tfrac{dx}{dt}\\right)^2+\\left(\\tfrac{dy}{dt}\\right)^2}\\,dt$$</div>
      <div class="tip" style="margin-top: 10px;"><b>Video Referensi:</b> <a href="https://youtu.be/mB_Bz7o6etY?si=kuX3b02JQoL-B8tw" target="_blank">Panjang Busur Kurva Parametrik</a></div>

      <h3>5.2 Koordinat Kutub</h3>
      <div class="formula">$$x=r\\cos\\theta,\\quad y=r\\sin\\theta,\\quad r^2=x^2+y^2,\\quad \\tan\\theta=\\frac{y}{x}$$</div>
      <div class="tip" style="margin-top: 10px;"><b>Video Referensi:</b> <a href="https://youtu.be/vxfzQCLSuVY?si=crQNQsZ6RmR7RaWH" target="_blank">Pengenalan Koordinat Kutub</a></div>

      <h3>5.3 Grafik dalam Koordinat Kutub</h3>
      ${SVG_POLAR_CARDIOID}
      <table>
        <tr><th>Persamaan</th><th>Bentuk</th></tr>
        <tr><td>$r=a$</td><td>Lingkaran pusat O, jari-jari $a$</td></tr>
        <tr><td>$r=a\\cos\\theta$ / $r=a\\sin\\theta$</td><td>Lingkaran lewat titik asal</td></tr>
        <tr><td>$r=a\\pm b\\cos\\theta$ ($a=b$)</td><td>Kardioid</td></tr>
        <tr><td>$r=a\\pm b\\cos\\theta$ ($a<b$)</td><td>Limaçon berloop</td></tr>
        <tr><td>$r=a\\cos(n\\theta)$</td><td>Mawar: $n$ ganjil → $n$ daun, $n$ genap → $2n$ daun</td></tr>
        <tr><td>$r^2=a^2\\cos(2\\theta)$</td><td>Lemniskat</td></tr>
      </table>

      <h3>5.4 Luas dalam Koordinat Kutub</h3>
      <div class="prereq"><span class="tag">Prasyarat</span> <a class="preref" data-pre="pre-2-1">2.1 Integral $\\sin^2,\\cos^2$ (hlm. 69)</a></div>
      <div class="formula">$$A=\\frac12\\int_\\alpha^\\beta r^2\\,d\\theta$$</div>
      <div class="formula">$$A_{\\text{antar kurva}}=\\frac12\\int_\\alpha^\\beta \\big(r_{luar}^2-r_{dalam}^2\\big)\\,d\\theta$$</div>
      <div class="q" style="margin-top: 15px">
        <div class="qh"><b>Contoh Soal: Luas Kutub (Satu Daun Mawar)</b></div>
        <p>Tentukan luas satu daun mawar dari persamaan $r = \\cos(2\\theta)$.</p>
        <button class="toggle">Lihat Langkah-langkah</button>
        <div class="ans">
          <b>Langkah 1: Tentukan batas $\\theta$</b><br>
          Daun mawar terbentuk ketika $r$ bergerak dari $0$ kembali ke $0$.<br>
          $r = \\cos(2\\theta) = 0 \\implies 2\\theta = -\\frac{\\pi}{2}$ dan $2\\theta = \\frac{\\pi}{2}$.<br>
          Maka batasnya adalah $\\theta = -\\frac{\\pi}{4}$ sampai $\\theta = \\frac{\\pi}{4}$.<br><br>
          <b>Langkah 2: Susun Integral Luas</b><br>
          $$A = \\frac{1}{2} \\int_{-\\pi/4}^{\\pi/4} [\\cos(2\\theta)]^2 \\,d\\theta$$
          Karena simetris, kita bisa hitung dari $0$ sampai $\\frac{\\pi}{4}$ lalu kalikan 2:<br>
          $$A = 2 \\times \\frac{1}{2} \\int_0^{\\pi/4} \\cos^2(2\\theta) \\,d\\theta = \\int_0^{\\pi/4} \\frac{1 + \\cos(4\\theta)}{2} \\,d\\theta$$
          <br>
          <b>Langkah 3: Evaluasi Integral</b><br>
          $$A = \\frac{1}{2} \\left[ \\theta + \\frac{\\sin(4\\theta)}{4} \\right]_0^{\\pi/4} = \\frac{1}{2} \\left( \\frac{\\pi}{4} + 0 - 0 \\right) = \\frac{\\pi}{8}$$
          Luas satu daun adalah $\\frac{\\pi}{8}$.
        </div>
      </div>
      <div class="tip"><b>Video Referensi:</b> <a href="https://youtu.be/_QwJYVBnUfU?si=EmZVpAu7pxReO8i8" target="_blank">Luas Dalam Koordinat Kutub</a></div>

      <h3>5.5 Garis Singgung &amp; Panjang Busur Kutub</h3>
      <div class="formula">$$\\frac{dy}{dx}=\\frac{r'\\sin\\theta+r\\cos\\theta}{r'\\cos\\theta-r\\sin\\theta}$$</div>
      <div class="formula">$$L=\\int_\\alpha^\\beta \\sqrt{r^2+\\left(\\tfrac{dr}{d\\theta}\\right)^2}\\,d\\theta$$</div>
      <div class="tip" style="margin-top: 10px;"><b>Video Referensi:</b> <a href="https://youtu.be/TBOwaSgtG9U?si=vIcsyWB4lWAHnce0" target="_blank">Garis Singgung dalam Koordinat Kutub</a></div>
      <div class="warnbox"><span class="tag">Kesalahan umum BAB 5</span>
        <ul style="margin-bottom:0">
          <li>Salah batas $\\theta$ untuk satu daun mawar (gunakan $r=0$ sebagai batas).</li>
          <li>Lupa faktor $\\tfrac12$ pada luas kutub.</li>
          <li>Tertukar antara $\\sqrt{r^2+r'^2}$ (busur kutub) dan $\\sqrt{1+y'^2}$ (busur Cartesius).</li>
        </ul>
      </div>
      <div class="card" style="margin-top:18px">
        <div class="chk" data-key="mat-b5"><input type="checkbox" id="mat-b5" ${state['mat-b5'] ? 'checked' : ''}><label for="mat-b5">Saya paham BAB 5 (bisa sketsa grafik kutub &amp; hitung luas/busur)</label></div>
      </div>
    </div>

    <div class="matpage" id="b6">
      <h3>6.1 Barisan Tak Hingga</h3>
      <div class="prereq"><span class="tag">Prasyarat</span> <a class="preref" data-pre="pre-3-3">3.3 L'Hôpital (hlm. 131)</a></div>
      ${SVG_SERIES_CONV}
      <p>Barisan $\\{a_n\\}$ konvergen jika $\\lim_{n\\to\\infty}a_n=L$ ada (berhingga). Ingat: $\\lim (1+\\tfrac{x}{n})^n=e^x$.</p>

      <h3>6.2 Deret Tak Hingga</h3>
      <div class="formula">$$\\text{Geometri: } \\sum_{n=0}^\\infty ar^n=\\frac{a}{1-r}\\ \\ (|r|<1)$$</div>
      <div class="formula">$$\\text{Teleskopik: } \\sum (b_n-b_{n+1})=b_1-\\lim b_{n+1}$$</div>
      <div class="warnbox"><span class="tag">Perhatian — uji suku ke-n</span><br>Jika $\\lim a_n\\ne 0$ maka deret <b>divergen</b>. Tapi $\\lim a_n=0$ <b>tidak</b> menjamin konvergen!</div>
      <div class="tip"><b>Video Referensi Barisan & Deret Tak Hingga:</b> 
        <a href="https://youtu.be/S8MctLVnZxA?si=5UW8jHbDAtOtbslD" target="_blank">Part 1</a> · 
        <a href="https://youtu.be/gWa6rcvWV6k?si=Ke1zKuAuMYcZdZDa" target="_blank">Part 2</a> · 
        <a href="https://youtu.be/GZwZ0Xdu8wE?si=0o9LyxVa6soatHqD" target="_blank">Part 3</a>
      </div>

      <h3>6.3 Uji Konvergensi</h3>
      <div class="prereq"><span class="tag">Prasyarat</span> <a class="preref" data-pre="pre-3-2">3.2 Integral Tak Wajar (hlm. 121)</a></div>
      <table>
        <tr><th>Uji</th><th>Cocok untuk</th><th>Kesimpulan</th></tr>
        <tr><td>Suku ke-n</td><td>Cek cepat</td><td>$\\lim a_n\\ne0$ → divergen</td></tr>
        <tr><td>Deret-p</td><td>$\\sum 1/n^p$</td><td>Konvergen jika $p>1$</td></tr>
        <tr><td>Geometri</td><td>$\\sum ar^n$</td><td>Konvergen jika $|r|<1$</td></tr>
        <tr><td>Integral</td><td>$a_n=f(n)$ positif, turun</td><td>Deret &amp; $\\int f$ sependapat</td></tr>
        <tr><td>Banding / Banding Limit</td><td>Mirip deret-p / geometri</td><td>Bandingkan dgn deret acuan</td></tr>
        <tr><td>Rasio</td><td>Ada faktorial / $r^n$</td><td>$L<1$ konv, $L>1$ div</td></tr>
        <tr><td>Akar</td><td>Ada pangkat $n$</td><td>$L<1$ konv</td></tr>
        <tr><td>Leibniz</td><td>$\\sum(-1)^n b_n$</td><td>$b_n$ turun &amp; $\\to0$ → konv</td></tr>
      </table>
      <div class="q" style="margin-top: 15px; margin-bottom: 15px">
        <div class="qh"><b>Contoh Soal: Uji Rasio (Mencari Konvergensi)</b></div>
        <p>Apakah deret $\\sum_{n=1}^\\infty \\frac{n^2}{2^n}$ konvergen atau divergen?</p>
        <button class="toggle">Lihat Langkah-langkah</button>
        <div class="ans">
          <b>Langkah 1: Identifikasi bentuk deret</b><br>
          Karena ada faktor eksponensial $2^n$ di penyebut, uji rasio sangat cocok.<br><br>
          <b>Langkah 2: Terapkan Uji Rasio</b><br>
          Cari nilai $L = \\lim_{n\\to\\infty} \\left| \\frac{a_{n+1}}{a_n} \\right|$<br>
          $$L = \\lim_{n\\to\\infty} \\left| \\frac{(n+1)^2 / 2^{n+1}}{n^2 / 2^n} \\right|$$
          $$L = \\lim_{n\\to\\infty} \\frac{(n+1)^2}{n^2} \\cdot \\frac{2^n}{2^{n+1}}$$
          $$L = \\lim_{n\\to\\infty} \\left(1 + \\frac{1}{n}\\right)^2 \\cdot \\frac{1}{2}$$
          <br>
          <b>Langkah 3: Simpulkan</b><br>
          Karena $(1 + 0)^2 = 1$, maka $L = 1 \\cdot \\frac{1}{2} = \\frac{1}{2}$.<br>
          Karena $L < 1$, menurut Uji Rasio, deret tersebut <b>Konvergen Absolut</b>.
        </div>
      </div>
      <div class="tip"><b>Bingung pilih uji?</b> Gunakan <a style="cursor:pointer" class="preref" data-goto-fc2="true">Flowchart Uji Konvergensi</a> di bawah.</div>

      <h3>6.4 Deret Pangkat; Taylor &amp; Maclaurin</h3>
      <div class="prereq"><span class="tag">Prasyarat</span> <a class="preref" data-pre="pre-1-1">1.1 Turunan $e^x,\\ln x$ (hlm. 1)</a> · <a class="preref" data-pre="pre-1-2">1.2 Invers Trigonometri (hlm. 33)</a></div>
      <div class="formula">$$\\text{Taylor: } f(x)=\\sum_{n=0}^\\infty \\frac{f^{(n)}(a)}{n!}(x-a)^n$$</div>
      <table>
        <tr><th>Fungsi</th><th>Deret Maclaurin</th><th>Berlaku</th></tr>
        <tr><td>$e^x$</td><td>$\\sum \\frac{x^n}{n!}$</td><td>semua $x$</td></tr>
        <tr><td>$\\sin x$</td><td>$\\sum \\frac{(-1)^n x^{2n+1}}{(2n+1)!}$</td><td>semua $x$</td></tr>
        <tr><td>$\\cos x$</td><td>$\\sum \\frac{(-1)^n x^{2n}}{(2n)!}$</td><td>semua $x$</td></tr>
        <tr><td>$\\frac{1}{1-x}$</td><td>$\\sum x^n$</td><td>$|x|<1$</td></tr>
        <tr><td>$\\ln(1+x)$</td><td>$\\sum \\frac{(-1)^{n+1}x^n}{n}$</td><td>$-1<x\\le1$</td></tr>
        <tr><td>$\\arctan x$</td><td>$\\sum \\frac{(-1)^n x^{2n+1}}{2n+1}$</td><td>$|x|\\le1$</td></tr>
      </table>
      <div class="warnbox"><span class="tag">Kesalahan umum BAB 6</span>
        <ul style="margin-bottom:0">
          <li>Menyimpulkan konvergen hanya karena $\\lim a_n=0$.</li>
          <li>Lupa mengecek kedua ujung interval konvergensi.</li>
          <li>Salah menyebut konvergen mutlak padahal hanya bersyarat.</li>
        </ul>
      </div>
      <div class="card" style="margin-top:18px">
        <div class="chk" data-key="mat-b6"><input type="checkbox" id="mat-b6" ${state['mat-b6'] ? 'checked' : ''}><label for="mat-b6">Saya paham BAB 6 (bisa pilih uji konvergensi tepat &amp; turunkan deret Taylor)</label></div>
      </div>

      <h3 style="margin-top:30px">Flowchart: Uji Konvergensi Mana yang Dipilih?</h3>
      <div id="fc-convergence"></div>
    </div>
  `;
}

// ===================================================================
//  SECTION: RUMUS (Formula Sheet)
// ===================================================================
function renderFormulaSheet() {
  const el = document.getElementById('rumus')!;
  el.innerHTML = `
    <h2>Lembar Rumus</h2>
    <p class="muted">Semua rumus master dalam satu halaman untuk review cepat sebelum ujian.</p>

    <div class="card"><h3 style="margin-top:4px">BAB 4 — Aplikasi Integral</h3>
      <div class="formula">$$A=\\int_a^b [f(x)-g(x)]\\,dx \\quad (f\\ge g)$$</div>
      <div class="formula">$$V_{\\text{cakram}}=\\pi\\int_a^b [R(x)]^2 dx,\\quad V_{\\text{cincin}}=\\pi\\int_a^b ([R]^2-[r]^2)\\,dx$$</div>
      <div class="formula">$$V_{\\text{kulit}}=2\\pi\\int_a^b x\\,f(x)\\,dx$$</div>
      <div class="formula">$$L=\\int_a^b\\sqrt{1+(y')^2}\\,dx,\\qquad S=2\\pi\\int_a^b y\\sqrt{1+(y')^2}\\,dx$$</div>
      <div class="formula">$$\\bar x=\\tfrac1A\\int x(f-g)\\,dx,\\quad \\bar y=\\tfrac1A\\int \\tfrac12(f^2-g^2)\\,dx,\\quad V=2\\pi\\bar d\\,A$$</div>
    </div>

    <div class="card"><h3 style="margin-top:4px">BAB 5 — Parametrik &amp; Kutub</h3>
      <div class="formula">$$\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt},\\qquad L=\\int_{t_1}^{t_2}\\sqrt{\\dot x^2+\\dot y^2}\\,dt$$</div>
      <div class="formula">$$x=r\\cos\\theta,\\ y=r\\sin\\theta,\\ r^2=x^2+y^2,\\ \\tan\\theta=\\tfrac yx$$</div>
      <div class="formula">$$A=\\tfrac12\\int_\\alpha^\\beta r^2\\,d\\theta,\\qquad L=\\int_\\alpha^\\beta\\sqrt{r^2+(r')^2}\\,d\\theta$$</div>
    </div>

    <div class="card"><h3 style="margin-top:4px">BAB 6 — Barisan &amp; Deret</h3>
      <div class="formula">$$\\sum_{n=0}^\\infty ar^n=\\frac{a}{1-r}\\ (|r|<1),\\qquad \\text{deret-p konvergen} \\iff p>1$$</div>
      <div class="formula">$$\\text{Rasio: } L=\\lim\\left|\\frac{a_{n+1}}{a_n}\\right|,\\qquad \\text{Akar: } L=\\lim\\sqrt[n]{|a_n|}$$</div>
      <div class="formula">$$f(x)=\\sum_{n=0}^\\infty \\frac{f^{(n)}(a)}{n!}(x-a)^n$$</div>
      <div class="formula">$$e^x=\\sum\\frac{x^n}{n!},\\quad \\sin x=\\sum\\frac{(-1)^n x^{2n+1}}{(2n+1)!},\\quad \\cos x=\\sum\\frac{(-1)^n x^{2n}}{(2n)!}$$</div>
      <div class="formula">$$\\frac1{1-x}=\\sum x^n,\\quad \\ln(1+x)=\\sum\\frac{(-1)^{n+1}x^n}{n},\\quad \\arctan x=\\sum\\frac{(-1)^n x^{2n+1}}{2n+1}$$</div>
    </div>
  `;
}

// ===================================================================
//  SECTION: LATIHAN (Practice Problems)
// ===================================================================
const DIFF: Record<string, [string, string]> = { e: ['Mudah', 'b-e'], m: ['Sedang', 'b-m'], h: ['Sulit', 'b-h'] };

function renderSoalList(list: Question[], container: HTMLElement) {
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

function renderPractice() {
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

// ===================================================================
//  SECTION: SOLVER (Deterministic + AI Tutor)
// ===================================================================
let curP: GeneratedProblem | null = null;
let curReveal = 0;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function newProblem(key: string | null, count: boolean) {
  const g = (!key || key === 'acak') ? pick(GENS) : (GENS.find(x => x.key === key) || pick(GENS));
  curP = g.fn();
  curReveal = 0;
  if (count) {
    state.genCount = (state.genCount as number || 0) + 1;
    save();
  }
  renderProblem();
}

function renderProblem() {
  const out = document.getElementById('genOut');
  if (!out || !curP) return;
  let h = `<div class="genq"><span class="badge">${curP.topic}</span><p style="margin:8px 0 0"><b>${curP.statement}</b></p>`;
  const ns = Math.min(curReveal, curP.steps.length);
  for (let i = 0; i < ns; i++) h += `<div class="step"><span class="tag">Langkah ${i + 1}</span><div>${curP.steps[i]}</div></div>`;
  if (curReveal >= curP.steps.length) {
    h += `<div class="ans show" style="display:block"><b>Jawaban.</b> ${curP.answer}</div>`;
    if (curP.prereq?.length) {
      h += `<div class="prereq"><span class="tag">Prasyarat Bab 1–3</span> ` + curP.prereq.map(p => `<a class="preref" data-pre="${p.anchor}">${p.label}</a>`).join(' · ') + `</div>`;
    }
  } else {
    h += `<p class="hint">Langkah ${ns}/${curP.steps.length} terbuka. Klik "Jelaskan lebih lanjut" atau ketik <code>jelaskan</code>.</p>`;
  }
  h += `</div>`;
  out.innerHTML = h;
  typeset(out);
}

function handleCmd(raw: string) {
  const t = (raw || '').toLowerCase().trim();
  if (!t) return;
  if (/(baru|new|acak|random)/.test(t)) { newProblem(document.getElementById('genTopic') ? (document.getElementById('genTopic') as HTMLSelectElement).value : 'acak', true); }
  else if (/(semua|all|jawab|answer|selesai|kunci)/.test(t)) { if (curP) { curReveal = curP.steps.length; renderProblem(); } }
  else if (/(jelas|explain|lanjut|langkah|step|next|terus|lagi)/.test(t)) { if (curP) { curReveal = Math.min(curReveal + 1, curP.steps.length); renderProblem(); } }
  else {
    const hit = TOPIC_KEYS.find(m => t.indexOf(m[0]) >= 0);
    if (hit) newProblem(hit[1], true);
  }
}

function renderSolver() {
  const el = document.getElementById('solver')!;
  el.innerHTML = `
    <h2>Soal Solver &amp; AI Tutor</h2>
    <p class="muted">Generator membuat soal baru dengan angka yang masuk akal beserta langkah penyelesaian yang benar. Pakai tombol atau ketik perintah: <code>jelaskan</code>, <code>semua</code>, <code>baru</code>, atau nama topik.</p>

    <div class="card">
      <h3 style="margin-top:4px">Generator Soal Deterministik</h3>
      <div class="row">
        <div class="field"><label>Topik</label><select class="fld" id="genTopic">
          <option value="acak">Acak (semua topik)</option>
          ${GENS.map(g => `<option value="${g.key}">${g.label}</option>`).join('')}
        </select></div>
        <div class="field" style="flex:0 0 auto"><label>&nbsp;</label><button class="btn" id="genNew">Buat soal baru</button></div>
      </div>
      <div id="genOut" style="margin-top:10px"></div>
      <div class="row" style="margin-top:12px">
        <button class="btn ghost sm" id="genMore">Jelaskan lebih lanjut</button>
        <button class="btn ghost sm" id="genAll">Tampilkan semua langkah</button>
      </div>
      <div class="row" style="margin-top:10px">
        <input class="fld" id="genCmd" placeholder="Ketik: jelaskan / semua / baru / luas / volume / deret / kutub / taylor ...">
        <button class="btn" id="genSend" style="flex:0 0 auto">Kirim</button>
      </div>
      <div class="hint" id="genHint">Soal dibuat: ${state.genCount || 0}. Kerjakan dulu sendiri, lalu ketik <code>jelaskan</code> berulang.</div>
    </div>

    <div class="card">
      <h3 style="margin-top:4px">AI Tutor (Gemini)</h3>
      <p class="muted" style="margin-top:0">Tanya apa saja tentang Kalkulus 2 — AI akan menjelaskan langkah demi langkah dengan rumus LaTeX. Perlu konfigurasi API key di Pengaturan.</p>
      <div class="ai-chat">
        <div class="row">
          <textarea class="fld" id="aiInput" placeholder="Contoh: Jelaskan cara menentukan apakah deret konvergen mutlak atau bersyarat..." style="min-height:70px"></textarea>
        </div>
        <div class="row" style="margin-top:10px">
          <button class="btn" id="aiSend">Tanya AI Tutor</button>
          <button class="btn ghost sm" id="aiClear">Bersihkan</button>
        </div>
        <div id="aiResponse" class="response" style="display:none"></div>
      </div>
    </div>
  `;

  // Wire solver events
  document.getElementById('genNew')!.onclick = () => newProblem((document.getElementById('genTopic') as HTMLSelectElement).value, true);
  document.getElementById('genMore')!.onclick = () => { if (curP) { curReveal = Math.min(curReveal + 1, curP.steps.length); renderProblem(); } };
  document.getElementById('genAll')!.onclick = () => { if (curP) { curReveal = curP.steps.length; renderProblem(); } };
  document.getElementById('genSend')!.onclick = () => { const i = document.getElementById('genCmd') as HTMLInputElement; handleCmd(i.value); i.value = ''; };
  document.getElementById('genCmd')!.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); const i = e.target as HTMLInputElement; handleCmd(i.value); i.value = ''; } });

  // Wire AI tutor
  document.getElementById('aiSend')!.onclick = () => sendAIQuestion();
  document.getElementById('aiClear')!.onclick = () => {
    const resp = document.getElementById('aiResponse')!;
    resp.style.display = 'none';
    resp.innerHTML = '';
    resp.classList.remove('streaming');
  };
  document.getElementById('aiInput')!.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAIQuestion(); }
  });

  newProblem('acak', false);
}

async function sendAIQuestion() {
  const input = document.getElementById('aiInput') as HTMLTextAreaElement;
  const resp = document.getElementById('aiResponse')!;
  const question = input.value.trim();
  if (!question) return;

  resp.style.display = 'block';
  resp.classList.add('streaming');
  resp.innerHTML = 'Sedang berpikir...';

  // Check if API key is configured
  const apiUrl = localStorage.getItem('kalk2_ai_backend') || '';
  if (!apiUrl) {
    resp.classList.remove('streaming');
    resp.innerHTML = '<b>AI Tutor belum dikonfigurasi.</b> Buka Pengaturan → AI Tutor, masukkan API key Google AI Studio. Dapatkan key gratis di <a href="https://aistudio.google.com" target="_blank">aistudio.google.com</a>.';
    typeset(resp);
    return;
  }

  try {
    // Call Gemini API directly (key stored in localStorage, secure enough for personal use)
    const apiKey = apiUrl; // The stored value is the API key itself
    const model = localStorage.getItem('kalk2_ai_model') || 'gemini-2.5-pro';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const body = {
      contents: [{
        parts: [{
          text: `Kamu adalah tutor Kalkulus 2 yang ahli. Jawab dalam Bahasa Indonesia. Gunakan notasi LaTeX ($...$) untuk semua matematika. Berikan penjelasan langkah demi langkah yang jelas. Referensikan nomor Bab jika relevan (Bab 1: Fungsi Transenden, Bab 2: Teknik Integrasi, Bab 3: Integral Numerik & Tak Wajar, Bab 4: Aplikasi Integral, Bab 5: Parametrik & Kutub, Bab 6: Barisan & Deret).

Pertanyaan siswa: ${question}`
        }]
      }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 4096 }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`HTTP ${res.status}: ${err.slice(0, 200)}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Tidak ada respons.';

    resp.classList.remove('streaming');
    resp.innerHTML = text.replace(/\n/g, '<br>');
    typeset(resp);
  } catch (err) {
    resp.classList.remove('streaming');
    resp.innerHTML = `<b>Error:</b> ${(err as Error).message}`;
  }
}

// ===================================================================
//  SECTION: FLASHCARDS
// ===================================================================
let fcIdx = 0;
let fcFlipped = false;
let fcKnown = 0;
let fcUnknown = 0;
const fcDeck = [...flashcards];

function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderFlashcards() {
  const el = document.getElementById('flashcards')!;
  el.innerHTML = `
    <h2>Kartu Kilat — Review Cepat</h2>
    <p class="muted">Klik kartu untuk membalik. Tandai "Sudah Paham" atau "Belum Paham" untuk melacak progres. Total: <b>${flashcards.length} kartu</b> dari Bab 1–6.</p>

    <div class="row" style="justify-content:center;gap:10px;margin-bottom:14px">
      <button class="btn ghost sm" id="fcShuffle">Acak ulang</button>
      <button class="btn ghost sm" id="fcReset">Reset progres</button>
    </div>

    <div class="flashcard-container">
      <div class="flashcard" id="fcCard">
        <div class="fc-face fc-front">
          <div class="fc-label" id="fcBab"></div>
          <div class="fc-content" id="fcFront"></div>
          <div class="hint" style="margin-top:16px">Klik untuk membalik</div>
        </div>
        <div class="fc-face fc-back">
          <div class="fc-label">JAWABAN</div>
          <div class="fc-content" id="fcBack"></div>
        </div>
      </div>
    </div>

    <div class="fc-progress">
      <span style="color:var(--ok)" id="fcKnownCount">Paham: 0</span>
      <span style="color:var(--bad)" id="fcUnknownCount">Belum: 0</span>
      <span>Sisa: <span id="fcRemaining">${fcDeck.length}</span></span>
      <span id="fcPosition">1 / ${fcDeck.length}</span>
    </div>

    <div class="row" style="justify-content:center;gap:10px;margin-top:14px">
      <button class="btn red sm" id="fcDontKnow">Belum Paham</button>
      <button class="btn sm" id="fcKnow" style="background:var(--ok)">Sudah Paham</button>
    </div>
  `;

  const card = document.getElementById('fcCard')!;
  card.onclick = () => {
    fcFlipped = !fcFlipped;
    card.classList.toggle('flipped', fcFlipped);
  };

  document.getElementById('fcShuffle')!.onclick = () => {
    shuffleArray(fcDeck);
    fcIdx = 0;
    fcFlipped = false;
    fcKnown = 0;
    fcUnknown = 0;
    updateFlashcard();
  };

  document.getElementById('fcReset')!.onclick = () => {
    fcIdx = 0;
    fcFlipped = false;
    fcKnown = 0;
    fcUnknown = 0;
    updateFlashcard();
  };

  document.getElementById('fcKnow')!.onclick = () => {
    fcKnown++;
    nextCard();
  };

  document.getElementById('fcDontKnow')!.onclick = () => {
    fcUnknown++;
    // Move to end for review
    fcDeck.push(fcDeck[fcIdx]);
    nextCard();
  };

  shuffleArray(fcDeck);
  updateFlashcard();
}

function nextCard() {
  fcIdx++;
  fcFlipped = false;
  const card = document.getElementById('fcCard');
  if (card) card.classList.remove('flipped');
  updateFlashcard();
}

function updateFlashcard() {
  if (fcIdx >= fcDeck.length) {
    const front = document.getElementById('fcFront')!;
    front.innerHTML = `<b>Selesai!</b><br>Paham: ${fcKnown} · Belum: ${fcUnknown}`;
    document.getElementById('fcBab')!.textContent = 'HASIL';
    document.getElementById('fcBack')!.innerHTML = 'Klik "Acak ulang" untuk mulai lagi.';
    return;
  }
  const c = fcDeck[fcIdx];
  document.getElementById('fcBab')!.textContent = c.bab;
  document.getElementById('fcFront')!.innerHTML = c.front;
  document.getElementById('fcBack')!.innerHTML = c.back;
  document.getElementById('fcKnownCount')!.textContent = `Paham: ${fcKnown}`;
  document.getElementById('fcUnknownCount')!.textContent = `Belum: ${fcUnknown}`;
  document.getElementById('fcRemaining')!.textContent = `${fcDeck.length - fcIdx}`;
  document.getElementById('fcPosition')!.textContent = `${fcIdx + 1} / ${fcDeck.length}`;
  const container = document.querySelector('.flashcard-container');
  if (container) typeset(container as HTMLElement);
}

// ===================================================================
//  SECTION: DRILLS (Speed rounds)
// ===================================================================
interface DrillProblem { question: string; choices: string[]; correct: number; }

function genDrill(): DrillProblem {
  const type = Math.floor(Math.random() * 6);
  switch (type) {
    case 0: { // p-series
      const p = pick(['1/3', '1/2', '1', '3/2', '2', '3']);
      const conv = ['3/2', '2', '3'].includes(p);
      return { question: `$\\sum 1/n^{${p}}$ konvergen?`, choices: ['Konvergen', 'Divergen'], correct: conv ? 0 : 1 };
    }
    case 1: { // geometric ratio
      const r = pick(['1/2', '1/3', '2/3', '3/4', '1', '2']);
      const conv = ['1/2', '1/3', '2/3', '3/4'].includes(r);
      return { question: `$\\sum (${r})^n$ konvergen?`, choices: ['Konvergen', 'Divergen'], correct: conv ? 0 : 1 };
    }
    case 2: { // derivative
      const q = pick([
        { q: '$d/dx(\\ln x)$', a: '$1/x$', w: ['$x$', '$e^x$', '$1/x^2$'] },
        { q: '$d/dx(\\arctan x)$', a: '$1/(1+x^2)$', w: ['$1/\\sqrt{1-x^2}$', '$\\sec^2 x$', '$-1/(1+x^2)$'] },
        { q: '$d/dx(e^{2x})$', a: '$2e^{2x}$', w: ['$e^{2x}$', '$2xe^{2x}$', '$e^x$'] },
      ]);
      const choices = shuffleArray([q.a, ...q.w]);
      return { question: q.q, choices, correct: choices.indexOf(q.a) };
    }
    case 3: { // rose petals
      const n = pick([2, 3, 4, 5]);
      const ans = n % 2 === 0 ? 2 * n : n;
      const choices = [`${ans}`, `${n}`, `${2 * n}`, `${n + 1}`].filter((v, i, a) => a.indexOf(v) === i);
      while (choices.length < 4) choices.push(`${Math.floor(Math.random() * 10) + 1}`);
      return { question: `Berapa daun $r=\\cos(${n}\\theta)$?`, choices: shuffleArray(choices), correct: -1 };
    }
    case 4: { // method choice
      const q = pick([
        { q: 'Putar terhadap sumbu-x, daerah menempel sumbu', a: 'Cakram', w: ['Cincin', 'Kulit', 'Pappus'] },
        { q: 'Putar terhadap sumbu-x, ada lubang', a: 'Cincin', w: ['Cakram', 'Kulit', 'Pappus'] },
        { q: 'Putar terhadap sumbu-y, fungsi dalam $x$', a: 'Kulit Tabung', w: ['Cakram', 'Cincin', 'Pappus'] },
      ]);
      const choices = shuffleArray([q.a, ...q.w]);
      return { question: q.q + ' → metode?', choices, correct: choices.indexOf(q.a) };
    }
    default: { // substitution
      const q = pick([
        { q: '$\\sqrt{a^2-x^2}$ → substitusi?', a: '$x=a\\sin\\theta$', w: ['$x=a\\tan\\theta$', '$x=a\\sec\\theta$', '$u=a^2-x^2$'] },
        { q: '$\\sqrt{a^2+x^2}$ → substitusi?', a: '$x=a\\tan\\theta$', w: ['$x=a\\sin\\theta$', '$x=a\\sec\\theta$', '$u=a^2+x^2$'] },
      ]);
      const choices = shuffleArray([q.a, ...q.w]);
      return { question: q.q, choices, correct: choices.indexOf(q.a) };
    }
  }
}

let drillTimer: ReturnType<typeof setInterval> | null = null;
let drillTime = 180;
let drillScore = 0;
let drillTotal = 0;
let drillCurrent: DrillProblem | null = null;
let drillActive = false;

function renderDrills() {
  const el = document.getElementById('drills')!;
  el.innerHTML = `
    <h2>Drill Cepat — 3 Menit</h2>
    <p class="muted">Jawab soal cepat sebanyak-banyaknya dalam 3 menit. Melatih kecepatan dan intuisi rumus. Skor terbaik: <b id="drillBest">${state.drillBest || 0}</b>.</p>

    <div class="drill-area">
      <div class="drill-timer" id="drillClock">3:00</div>
      <div class="drill-score">Skor: <span id="drillScoreEl">0</span> / <span id="drillTotalEl">0</span></div>
      <div class="row" style="justify-content:center;gap:10px;margin:14px 0">
        <button class="btn lg" id="drillStart">Mulai Drill</button>
        <button class="btn red sm" id="drillStop" style="display:none">Stop</button>
      </div>
      <div id="drillProblem" class="drill-problem" style="display:none"></div>
      <div id="drillChoices" class="drill-choices" style="display:none"></div>
    </div>
  `;

  document.getElementById('drillStart')!.onclick = startDrill;
  document.getElementById('drillStop')!.onclick = stopDrill;
}

function startDrill() {
  drillTime = 180;
  drillScore = 0;
  drillTotal = 0;
  drillActive = true;
  document.getElementById('drillStart')!.style.display = 'none';
  document.getElementById('drillStop')!.style.display = '';
  document.getElementById('drillProblem')!.style.display = '';
  document.getElementById('drillChoices')!.style.display = '';
  updateDrillUI();
  nextDrillProblem();
  drillTimer = setInterval(() => {
    drillTime--;
    document.getElementById('drillClock')!.textContent = `${Math.floor(drillTime / 60)}:${pad2(drillTime % 60)}`;
    if (drillTime <= 0) stopDrill();
  }, 1000);
}

function stopDrill() {
  drillActive = false;
  if (drillTimer) clearInterval(drillTimer);
  drillTimer = null;
  document.getElementById('drillStart')!.style.display = '';
  document.getElementById('drillStop')!.style.display = 'none';
  document.getElementById('drillProblem')!.innerHTML = `<b>Selesai!</b> Skor: ${drillScore}/${drillTotal}`;
  document.getElementById('drillChoices')!.style.display = 'none';
  if (!state.drillBest || drillScore > (state.drillBest as number)) {
    state.drillBest = drillScore;
    save();
    document.getElementById('drillBest')!.textContent = String(drillScore);
  }
}

function nextDrillProblem() {
  if (!drillActive) return;
  drillCurrent = genDrill();

  // Fix for rose petals (correct index based on actual answer)
  if (drillCurrent.correct === -1) {
    const n = parseInt(drillCurrent.question.match(/(\d+)/)?.[1] || '2');
    const ans = n % 2 === 0 ? 2 * n : n;
    drillCurrent.correct = drillCurrent.choices.indexOf(`${ans}`);
    if (drillCurrent.correct === -1) drillCurrent.correct = 0;
  }

  const prob = document.getElementById('drillProblem')!;
  prob.innerHTML = drillCurrent.question;
  typeset(prob);

  const choicesEl = document.getElementById('drillChoices')!;
  choicesEl.innerHTML = drillCurrent.choices.map((c, i) => `<button data-drill-idx="${i}">${c}</button>`).join('');
  typeset(choicesEl);

  choicesEl.querySelectorAll<HTMLButtonElement>('button').forEach(btn => {
    btn.onclick = () => {
      if (!drillActive || !drillCurrent) return;
      const idx = parseInt(btn.dataset.drillIdx!);
      drillTotal++;
      if (idx === drillCurrent.correct) {
        drillScore++;
        btn.classList.add('correct');
      } else {
        btn.classList.add('wrong');
        choicesEl.children[drillCurrent.correct]?.classList.add('correct');
      }
      updateDrillUI();
      setTimeout(nextDrillProblem, 600);
    };
  });
}

function updateDrillUI() {
  document.getElementById('drillScoreEl')!.textContent = String(drillScore);
  document.getElementById('drillTotalEl')!.textContent = String(drillTotal);
}

// ===================================================================
//  SECTION: MOCK EXAM (3 different exams)
// ===================================================================
let mockIdx = 0;
let mockTimer: ReturnType<typeof setInterval> | null = null;
let mockTime = 90 * 60;

function renderMock() {
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

  // Render each mock
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

  // Timer
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

function mockTick() {
  mockTime--;
  document.getElementById('mclk')!.textContent = `${Math.floor(mockTime / 60)}:${pad2(mockTime % 60)}`;
  if (mockTime <= 0) { if (mockTimer) clearInterval(mockTimer); mockTimer = null; document.getElementById('mclk')!.textContent = 'WAKTU HABIS'; }
}

function mockScore(): number {
  let s = 0;
  mocks.forEach((mockSet, mi) => {
    mockSet.forEach((_, qi) => { if (state[`mok${mi}_${qi}`]) s++; });
  });
  return Math.round(s / 3); // Average across 3 mocks
}

// ===================================================================
//  SECTION: TOLAK UKUR (Benchmarks)
// ===================================================================
function renderBenchmarks() {
  const el = document.getElementById('tolakukur')!;
  el.innerHTML = `
    <h2>Tolak Ukur Keberhasilan</h2>
    <p class="muted">Indikator terukur. Centang yang sudah tercapai — target minimal lulus: <b>minimal 80% tercentang</b>.</p>
    <div class="progwrap"><div class="progbar" id="tubar"></div></div>
    <p class="muted" id="tucount" style="margin-top:0"></p>

    <div class="card" id="tu-list">
      ${benchmarks.map(t => {
        const done = state[t[0]] ? 'done' : '';
        return `<div class="chk ${done}" data-key="${t[0]}">
          <input type="checkbox" id="${t[0]}" ${state[t[0]] ? 'checked' : ''}>
          <label for="${t[0]}">${t[1]}</label></div>`;
      }).join('')}
    </div>

    <div class="card">
      <h3 style="margin-top:4px">Skala penilaian kesiapan</h3>
      <table>
        <tr><th>% Tercapai</th><th>Status</th><th>Tindakan</th></tr>
        <tr><td>90–100%</td><td><b style="color:var(--ok)">Siap tempur</b></td><td>Tidur cukup, review rumus + 2 soal pemanasan.</td></tr>
        <tr><td>75–89%</td><td><b style="color:var(--warn)">Cukup siap</b></td><td>Fokus tambal 1–2 topik terlemah.</td></tr>
        <tr><td>60–74%</td><td><b style="color:var(--warn)">Waspada</b></td><td>Prioritaskan BAB berbobot tinggi (4 &amp; 6).</td></tr>
        <tr><td>&lt;60%</td><td><b style="color:var(--bad)">Mode triase</b></td><td>Kuasai rumus master + soal mudah-sedang. Jangan nol di topik manapun.</td></tr>
      </table>
    </div>
  `;
}

// ===================================================================
//  SECTION: PENGATURAN (Settings)
// ===================================================================
function renderSettings() {
  const el = document.getElementById('pengaturan')!;
  const a = activeProfile();
  const c = Cloud.getCfg();

  el.innerHTML = `
    <h2>Pengaturan</h2>
    <p class="muted">Kelola profil, tampilan, cloud sync, dan AI Tutor.</p>

    <div class="card">
      <h3 style="margin-top:4px">Profil aktif</h3>
      <div class="row">
        <div class="field"><label>Nama</label><input class="fld" id="pName" value="${a.name || ''}" placeholder="Nama"></div>
        <div class="field"><label>Tanggal &amp; jam ujian</label><input class="fld" id="pExam" type="datetime-local" value="${a.examISO || ''}"></div>
        <div class="field" style="flex:0 0 auto"><label>&nbsp;</label><button class="btn" id="pSaveMeta">Simpan</button></div>
      </div>
      <div class="status" id="metaStatus"></div>
    </div>

    <div class="card">
      <h3 style="margin-top:4px">Semua profil</h3>
      <ul class="plist" id="profList"></ul>
      <div class="row" style="margin-top:10px">
        <div class="field"><label>Nama profil baru</label><input class="fld" id="pNewName" placeholder="mis. Andi"></div>
        <div class="field"><label>Tanggal &amp; jam ujian</label><input class="fld" id="pNewExam" type="datetime-local"></div>
        <div class="field" style="flex:0 0 auto"><label>&nbsp;</label><button class="btn" id="pAdd">Tambah profil</button></div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn ghost sm" id="pExport">Ekspor profil aktif (.json)</button>
        <label class="btn ghost sm" style="display:inline-block;cursor:pointer">Impor profil<input type="file" id="pImport" accept="application/json" style="display:none"></label>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-top:4px">AI Tutor (Gemini)</h3>
      <p class="muted" style="margin-top:0">Masukkan API key dari <a href="https://aistudio.google.com" target="_blank">Google AI Studio</a>. Dengan Google AI Pro, gunakan model <b>gemini-2.5-pro</b> untuk jawaban matematika terbaik.</p>
      <div class="field"><label>API Key</label><input class="fld" id="aiKey" type="password" value="${localStorage.getItem('kalk2_ai_backend') || ''}" placeholder="AIza..."></div>
      <div class="field" style="max-width:280px"><label>Model</label><select class="fld" id="aiModel">
        <option value="gemini-2.5-pro" ${(localStorage.getItem('kalk2_ai_model') || 'gemini-2.5-pro') === 'gemini-2.5-pro' ? 'selected' : ''}>Gemini 2.5 Pro (terbaik untuk matematika)</option>
        <option value="gemini-2.0-flash" ${localStorage.getItem('kalk2_ai_model') === 'gemini-2.0-flash' ? 'selected' : ''}>Gemini 2.0 Flash (lebih cepat, gratis)</option>
      </select></div>
      <button class="btn sm" id="aiSave">Simpan konfigurasi AI</button>
      <div class="status" id="aiStatus"></div>
    </div>

    <div class="card">
      <h3 style="margin-top:4px">Sinkronisasi cloud (opsional)</h3>
      <p class="muted" style="margin-top:0">Gunakan <b>Supabase</b> gratis untuk sinkronisasi lintas perangkat.</p>
      <div class="field"><label>Project URL</label><input class="fld" id="cUrl" value="${c.url || ''}" placeholder="https://xxxx.supabase.co"></div>
      <div class="field"><label>Anon public key</label><input class="fld" id="cKey" value="${c.anonKey || ''}" placeholder="eyJ..."></div>
      <div class="row">
        <div class="field"><label>Nama tabel</label><input class="fld" id="cTable" value="${c.table || 'kalk2_profiles'}" placeholder="kalk2_profiles"></div>
        <div class="field" style="flex:0 0 auto"><label>&nbsp;</label><label class="markok"><input type="checkbox" id="cEnable" ${c.enabled ? 'checked' : ''}> Aktifkan sync</label></div>
      </div>
      <div class="row" style="margin-top:8px">
        <button class="btn" id="cSave">Simpan konfigurasi</button>
        <button class="btn ghost" id="cSync">Sinkron sekarang</button>
      </div>
      <div class="status" id="cStatus"></div>
    </div>

    <div class="card">
      <h3 style="margin-top:4px">Tampilan</h3>
      <div class="field" style="max-width:220px"><label>Tema</label>
        <select class="fld" id="themeSel">
          <option value="dark">Gelap</option>
          <option value="light">Terang</option>
        </select>
      </div>
    </div>
  `;

  // Wire settings events
  wireSettingsEvents();
}

function wireSettingsEvents() {
  // Profile meta save
  document.getElementById('pSaveMeta')!.onclick = () => {
    const i = loadIdx()!;
    const p = i.list.find(x => x.id === i.activeId);
    if (!p) return;
    p.name = (document.getElementById('pName') as HTMLInputElement).value.trim() || p.name;
    p.examISO = (document.getElementById('pExam') as HTMLInputElement).value || p.examISO;
    p.updatedAt = Date.now();
    saveIdx(i);
    Cloud.schedulePush();
    document.getElementById('metaStatus')!.textContent = 'Tersimpan.';
    document.getElementById('metaStatus')!.className = 'status ok';
    renderProfileDropdown();
    updateCountdown();
  };

  // Add profile
  document.getElementById('pAdd')!.onclick = () => {
    const name = (document.getElementById('pNewName') as HTMLInputElement).value.trim();
    if (!name) { alert('Isi nama profil dulu.'); return; }
    const exam = (document.getElementById('pNewExam') as HTMLInputElement).value || defaultExamISO();
    const i = loadIdx()!;
    const id = uid();
    saveData(id, {});
    i.list.push({ id, name, examISO: exam, updatedAt: Date.now() });
    i.activeId = id;
    saveIdx(i);
    location.reload();
  };

  // Profile list actions
  document.getElementById('profList')!.addEventListener('click', e => {
    const use = (e.target as HTMLElement).closest<HTMLElement>('[data-use]');
    const del = (e.target as HTMLElement).closest<HTMLElement>('[data-del]');
    if (use) { const i = loadIdx()!; i.activeId = use.dataset.use!; saveIdx(i); location.reload(); }
    if (del) {
      const i = loadIdx()!;
      const p = i.list.find(x => x.id === del.dataset.del);
      if (!confirm(`Hapus profil "${p?.name || ''}"?`)) return;
      removeData(del.dataset.del!);
      i.list = i.list.filter(x => x.id !== del.dataset.del);
      if (i.activeId === del.dataset.del) i.activeId = i.list[0].id;
      saveIdx(i);
      location.reload();
    }
  });

  // Export/Import
  document.getElementById('pExport')!.onclick = () => {
    const p = activeProfile();
    const payload = { name: p.name, examISO: p.examISO, data: loadData(p.id), exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = `kalkulus2-${(p.name || 'profil').replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(u);
  };

  document.getElementById('pImport')!.onchange = (e) => {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result as string);
        const i = loadIdx()!;
        const id = uid();
        saveData(id, obj.data || {});
        i.list.push({ id, name: obj.name || 'Impor', examISO: obj.examISO || defaultExamISO(), updatedAt: Date.now() });
        i.activeId = id;
        saveIdx(i);
        alert('Profil berhasil diimpor.');
        location.reload();
      } catch (err) { alert('File tidak valid: ' + (err as Error).message); }
    };
    reader.readAsText(f);
  };

  // AI config
  document.getElementById('aiSave')!.onclick = () => {
    const key = (document.getElementById('aiKey') as HTMLInputElement).value.trim();
    const model = (document.getElementById('aiModel') as HTMLSelectElement).value;
    localStorage.setItem('kalk2_ai_backend', key);
    localStorage.setItem('kalk2_ai_model', model);
    document.getElementById('aiStatus')!.textContent = key ? 'AI Tutor dikonfigurasi. Gunakan di halaman Solver.' : 'API key dihapus.';
    document.getElementById('aiStatus')!.className = 'status ' + (key ? 'ok' : '');
  };

  // Cloud config
  document.getElementById('cSave')!.onclick = () => {
    const cfg = {
      url: (document.getElementById('cUrl') as HTMLInputElement).value.trim(),
      anonKey: (document.getElementById('cKey') as HTMLInputElement).value.trim(),
      table: (document.getElementById('cTable') as HTMLInputElement).value.trim() || 'kalk2_profiles',
      enabled: (document.getElementById('cEnable') as HTMLInputElement).checked,
    };
    Cloud.setCfg(cfg);
    Cloud.setSync(Cloud.isEnabled() ? 'Cloud sync aktif.' : 'Cloud sync nonaktif.', Cloud.isEnabled() ? 'ok' : '');
  };
  document.getElementById('cSync')!.onclick = () => Cloud.syncNow();
}

// ===================================================================
//  PROFILE DROPDOWN & STATS
// ===================================================================
function renderProfileDropdown() {
  const i = loadIdx()!;
  const sel = document.getElementById('profSel') as HTMLSelectElement;
  sel.innerHTML = i.list.map(p => `<option value="${p.id}" ${p.id === i.activeId ? 'selected' : ''}>${p.name || 'Profil'}</option>`).join('');
  sel.onchange = () => { const idx = loadIdx()!; idx.activeId = sel.value; saveIdx(idx); location.reload(); };

  // Profile list in settings
  const list = document.getElementById('profList');
  if (list) {
    list.innerHTML = i.list.map(p => `<li>
      <span class="pn">${p.name || 'Profil'} ${p.id === i.activeId ? '<span class="pcur">aktif</span>' : ''}</span>
      <span>${p.id !== i.activeId ? `<button class="btn ghost sm" data-use="${p.id}">Gunakan</button> ` : ''}${i.list.length > 1 ? `<button class="btn red sm" data-del="${p.id}">Hapus</button>` : ''}</span>
    </li>`).join('');
  }
}

function pct(keys: string[]): number {
  const d = keys.filter(k => state[k]).length;
  return keys.length ? Math.round(d / keys.length * 100) : 0;
}

function updateStats() {
  const matKeys = ['mat-b4', 'mat-b5', 'mat-b6'];
  const jtKeys = studyDay.filter(s => s.type === '').map((_, i) => 'jt' + i);
  const jadKeys = [...jtKeys, ...examDay.map((_, i) => 'jm' + i)];
  const mp = pct(matKeys), jp = pct(jadKeys), tp = pct(tuKeys);

  const set = (id: string, val: string) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  const setW = (id: string, val: string) => { const e = document.getElementById(id) as HTMLElement; if (e) e.style.width = val; };

  set('s-mat', mp + '%');
  set('s-jad', jp + '%');
  set('s-tu', tp + '%');
  set('s-mock', state.mockbest != null ? state.mockbest + '/10' : '—');
  setW('jadbar', jp + '%');
  setW('tubar', tp + '%');

  const d = tuKeys.filter(k => state[k]).length;
  set('tucount', `${d} dari ${tuKeys.length} indikator tercapai (${tp}%) — target minimal 80%.`);
  set('mocklive', mockScore() + '/10');
}

// ===================================================================
//  FORMULA EXPLANATION BUILDER
// ===================================================================
function buildFormulaExp() {
  document.querySelectorAll('#materi .formula').forEach(f => {
    const el = f as HTMLElement;
    if (el.dataset.fx) return;
    const exp = explainFor(el.textContent || '');
    if (!exp) return;
    el.dataset.fx = '1';
    const wrap = document.createElement('div');
    wrap.className = 'fwrap';
    el.parentNode!.insertBefore(wrap, el);
    wrap.appendChild(el);
    const e = document.createElement('div');
    e.className = 'fexp';
    e.innerHTML = '<span class="tag">Arti rumus</span> ' + exp + ' <span class="fhint">(klik untuk menyematkan)</span>';
    wrap.appendChild(e);
    el.addEventListener('click', () => wrap.classList.toggle('show'));
  });
}

// ===================================================================
//  GLOBAL EVENT HANDLERS
// ===================================================================
function setupGlobalHandlers() {
  // Checkbox change handler (event delegation)
  document.addEventListener('change', e => {
    const target = e.target as HTMLInputElement;
    if (target.type === 'checkbox') {
      const wrap = target.closest('[data-key]') as HTMLElement | null;
      if (!wrap) return;
      const k = wrap.dataset.key!;
      state[k] = target.checked;
      wrap.classList.toggle('done', target.checked);
      save();
      updateStats();
    }
  });

  // Toggle answer (event delegation)
  document.addEventListener('click', e => {
    const t = (e.target as HTMLElement).closest('.toggle');
    if (t) {
      const ans = t.nextElementSibling;
      if (ans?.classList.contains('ans')) {
        ans.classList.toggle('show');
        typeset(ans as HTMLElement);
      }
    }
  });

  // Prerequisite jump (event delegation)
  document.addEventListener('click', e => {
    const a = (e.target as HTMLElement).closest('.preref') as HTMLElement | null;
    if (!a) return;
    const id = a.dataset.pre;
    if (!id) return;
    navigateTo('prasyarat');
    const tgt = document.getElementById(id);
    if (tgt) {
      tgt.scrollIntoView({ behavior: 'smooth', block: 'center' });
      tgt.classList.add('prehit');
      setTimeout(() => tgt.classList.remove('prehit'), 1600);
    }
  });
}

// ===================================================================
//  INIT
// ===================================================================
(function init() {
  // Apply theme
  applyTheme(getTheme());

  // Render all sections
  renderDashboard();
  renderSchedule();
  renderPrerequisites();
  renderMaterials();
  renderFormulaSheet();
  renderPractice();
  renderSolver();
  renderFlashcards();
  renderDrills();
  renderMock();
  renderBenchmarks();
  renderSettings();

  // Setup navigation
  setupNavigation();
  setupSubnav('#matnav', '#materi .matpage');
  setupSubnav('#latnav', '#latihan .matpage');
  setupSubnav('#mocknav', '#mock .matpage');

  // Profile dropdown
  renderProfileDropdown();

  // Theme
  setupTheme();

  // Countdown
  startCountdown();

  // Stats
  updateStats();

  // Formula explanations
  buildFormulaExp();

  // Flowcharts
  setupFlowcharts();

  // Global handlers
  setupGlobalHandlers();

  // MathJax typeset after load
  window.addEventListener('load', () => setTimeout(() => typeset(), 800));

  // Cloud sync
  if (Cloud.isEnabled()) setTimeout(() => Cloud.syncNow(), 400);
})();
