// Jadwal (schedule) section - flexible Pomodoro engine + weighted timeline.
// PRIORITY: focus minutes are allocated proportional to each study task's
// `weight` (data/schedule.ts), so Bab 4 & 6 get more time than Bab 5.
import { state, save } from '../storage/state.ts';
import { activeProfile, parseExam } from '../storage/profiles.ts';
import { studyDay, examDay } from '../data/schedule.ts';
import { updateStats } from './stats.ts';
import { callAITutor } from './solver.ts';
import { pad2, dfmt } from '../util.ts';

// ===================================================================
//  AUDIO ALARM
// ===================================================================
let audioCtx: AudioContext | null = null;
let alarmPlaying = false;

function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return audioCtx;
}

function playAlarm(): void {
  if (alarmPlaying) return;
  alarmPlaying = true;
  const ctx = getAudioCtx();

  function chime(freq: number, delaySec: number) {
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(gain);
    const startTime = ctx.currentTime + delaySec;
    osc.start(startTime);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.5, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 1.5);
    osc.stop(startTime + 1.5);
  }

  chime(523.25, 0);
  chime(659.25, 0.4);
  chime(523.25, 2.0);
  chime(659.25, 2.4);

  setTimeout(() => { alarmPlaying = false; }, 4500);

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Waktu Habis!', { body: 'Sesi selesai. Saatnya istirahat/fokus!' });
  }
}

function stopAlarm(): void { alarmPlaying = false; }

// ===================================================================
//  POMODORO STATE
// ===================================================================
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
let lastTickTime = Date.now();

function persistPomState(): void {
  state.pomSavedState = {
    remaining: pomRemaining,
    mode: pomMode,
    schedule: pomSchedule,
    sessionIndex: pomSessionIndex,
    totalFocus: pomTotalFocus,
  };
  save();
}

window.addEventListener('beforeunload', persistPomState);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') persistPomState();
});

function pomDefaults() {
  return {
    startTime: state.pomStartTime as string || '06:00',
    bedTime: state.pomBedTime as string || '01:00',
    focusMin: state.pomFocus as number || 25,
    breakMin: state.pomBreak as number || 5,
    longBreakMin: state.pomLongBreak as number || 15,
    sessionsBeforeLong: state.pomSessions as number || 4,
    busyStart: state.pomBusyStart as string || '',
    busyEnd: state.pomBusyEnd as string || '',
    busyLabel: state.pomBusyLabel as string || '',
  };
}

function savePomSettings(d: ReturnType<typeof pomDefaults>): void {
  state.pomStartTime = d.startTime;
  state.pomBedTime = d.bedTime;
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
    bedTime: (document.getElementById('pomBedTime') as HTMLInputElement)?.value || '01:00',
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

function updatePomUI(): void {
  const mins = Math.floor(pomRemaining / 60);
  const secs = pomRemaining % 60;
  const timeStr = `${pad2(mins)}:${pad2(secs)}`;

  const clock = document.getElementById('pomClock');
  if (clock) clock.textContent = timeStr;

  document.title = pomMode !== 'idle' ? `[${timeStr}] Kalkulus 2` : 'Kalkulus 2 Prep';

  const miniTimer = document.getElementById('topPomTimer');
  if (miniTimer) {
    if (pomMode === 'idle') {
      miniTimer.style.display = 'none';
      miniTimer.textContent = '';
    } else {
      miniTimer.style.display = 'inline-block';
      miniTimer.textContent = timeStr;
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
    sessionEl.textContent = (pomMode === 'idle' || pomSchedule.length === 0)
      ? 'Jadwal belum jalan'
      : `Sesi ${pomSessionIndex + 1} dari ${pomSchedule.length}`;
  }

  const totalEl = document.getElementById('pomTotalFocus');
  if (totalEl) {
    const h = Math.floor(pomTotalFocus / 3600);
    const m = Math.floor((pomTotalFocus % 3600) / 60);
    totalEl.textContent = `Total fokus: ${h > 0 ? h + 'j ' : ''}${m} mnt`;
  }

  let total = 1;
  if (pomMode !== 'idle' && pomSchedule[pomSessionIndex]) {
    total = pomSchedule[pomSessionIndex].duration * 60;
  }
  const pct = total > 0 ? ((total - pomRemaining) / total) * 100 : 0;
  const ring = document.getElementById('pomRing') as HTMLElement | null;
  if (ring) ring.style.setProperty('--pom-pct', `${pct}%`);
}

function advancePomodoro(): void {
  const currentBlock = pomSchedule[pomSessionIndex];
  if (currentBlock && currentBlock.type === 'focus' && currentBlock.k) {
    state[currentBlock.k] = true;
    save();
    updateStats();
    const chk = document.getElementById(currentBlock.k) as HTMLInputElement | null;
    if (chk) {
      chk.checked = true;
      const wrap = chk.closest('.chk');
      if (wrap) wrap.classList.add('done');
    }
  }

  pomSessionIndex++;
  if (pomSessionIndex >= pomSchedule.length) { pomReset(); return; }

  const nextBlock = pomSchedule[pomSessionIndex];
  pomMode = nextBlock.type;
  pomRemaining = nextBlock.duration * 60;
  persistPomState();
}

function pomTick(): void {
  const now = Date.now();
  const deltaSec = Math.floor((now - lastTickTime) / 1000);
  if (deltaSec < 1) return;
  lastTickTime += deltaSec * 1000;

  const focusAdded = Math.min(deltaSec, pomRemaining);
  pomRemaining -= deltaSec;
  if (pomMode === 'focus') pomTotalFocus += focusAdded;

  if (pomRemaining <= 0) {
    pomRemaining = 0;
    playAlarm();
    advancePomodoro();
    updatePomUI();
    return;
  }
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
    if (endMins <= startMins) endMins += 24 * 60;

    let checkMin = currentMin;
    if (checkMin < startMins && startMins > 12 * 60 && checkMin < 12 * 60) {
      checkMin += 24 * 60;
    }

    if (checkMin >= startMins && checkMin < endMins) {
      pomSessionIndex = i;
      pomMode = block.type;

      const elapsedMins = checkMin - startMins;
      const elapsedSecs = elapsedMins * 60 + currentSec;
      const totalSecs = block.duration * 60;
      pomRemaining = Math.max(0, totalSecs - elapsedSecs);

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

function pomStart(): void {
  if (pomSchedule.length === 0) { alert('Buat jadwal terlebih dahulu di bawah!'); return; }
  if (pomMode === 'idle') {
    pomSessionIndex = 0;
    const firstBlock = pomSchedule[0];
    pomMode = firstBlock.type;
    pomRemaining = firstBlock.duration * 60;
    pomTotalFocus = 0;
  }
  if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
  getAudioCtx().resume();
  lastTickTime = Date.now();
  if (pomTimer) clearInterval(pomTimer);
  pomTimer = setInterval(pomTick, 1000);
  updatePomUI();
  const startBtn = document.getElementById('pomStart');
  if (startBtn) startBtn.textContent = 'Berjalan...';
  persistPomState();
}

function pomPause(): void {
  if (pomTimer) { clearInterval(pomTimer); pomTimer = null; }
  const startBtn = document.getElementById('pomStart');
  if (startBtn) startBtn.textContent = 'Lanjut';
  persistPomState();
}

function pomSkip(): void {
  stopAlarm();
  if (pomMode === 'idle' || pomSchedule.length === 0) return;
  advancePomodoro();
  updatePomUI();
}

function pomReset(): void {
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

function pomBusy(): void {
  pomMode = 'busy';
  const busyMin = parseInt((document.getElementById('pomBusyDuration') as HTMLInputElement)?.value) || 30;
  pomRemaining = busyMin * 60;
  updatePomUI();
  lastTickTime = Date.now();
  if (!pomTimer) pomTimer = setInterval(pomTick, 1000);
  persistPomState();
}

function pomSyncTime(): void {
  if (pomSchedule.length === 0) { alert('Buat jadwal terlebih dahulu!'); return; }
  const synced = syncPomToRealTime();
  if (synced) {
    for (let i = 0; i < pomSessionIndex; i++) {
      const b = pomSchedule[i];
      if (b.type === 'focus' && b.k) {
        state[b.k] = true;
        const chk = document.getElementById(b.k) as HTMLInputElement | null;
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
    if (!pomTimer) {
      getAudioCtx().resume();
      lastTickTime = Date.now();
      pomTimer = setInterval(pomTick, 1000);
      const startBtn = document.getElementById('pomStart');
      if (startBtn) startBtn.textContent = 'Berjalan...';
    }
    persistPomState();
  } else {
    alert('Waktu saat ini berada di luar rentang jadwal (belum mulai atau sudah selesai).');
  }
}

// ===================================================================
//  TIMELINE GENERATION (weighted by chapter priority)
// ===================================================================
function generateTimeline(): string {
  const d = readPomForm();
  const [sh, sm] = (d.startTime || '06:00').split(':').map(Number);
  let cursor = sh * 60 + sm;

  const [bedH, bedM] = (d.bedTime || '01:00').split(':').map(Number);
  let bedMin = bedH * 60 + bedM;
  if (bedMin <= cursor) bedMin += 24 * 60;

  const focusTasks = studyDay.filter(s => s.type === '');
  let focusIdx = 0;

  // Busy block
  let busyStartMin = -1, busyEndMin = -1, busyDur = 0;
  if (d.busyStart && d.busyEnd) {
    const [bsh, bsm] = d.busyStart.split(':').map(Number);
    const [beh, bem] = d.busyEnd.split(':').map(Number);
    busyStartMin = bsh * 60 + bsm;
    busyEndMin = beh * 60 + bem;
    if (busyEndMin < busyStartMin) busyEndMin += 24 * 60;
    if (busyStartMin < cursor && busyStartMin < 12 * 60) {
      busyStartMin += 24 * 60; busyEndMin += 24 * 60;
    }
    busyDur = Math.max(0, busyEndMin - busyStartMin);
  }

  const numTasks = focusTasks.length;
  let totalBreakMins = 0;
  for (let i = 0; i < numTasks - 1; i++) {
    const isLong = (i + 1) % d.sessionsBeforeLong === 0;
    totalBreakMins += isLong ? d.longBreakMin : d.breakMin;
  }

  const prepTime = 15;
  const totalAvail = (bedMin - cursor) - busyDur - totalBreakMins - prepTime;

  // PRIORITY ALLOCATION - focus minutes proportional to each task's weight.
  // First task is fixed prep (15 min). Bab 4 & 6 weigh more than Bab 5.
  const prefDur = focusTasks.map((t, i) =>
    i === 0 ? prepTime : Math.max(10, Math.round(d.focusMin * (t.weight ?? 1)))
  );
  const sumPrefNonPrep = prefDur.slice(1).reduce((a, b) => a + b, 0);
  let scale = 1;
  if (totalAvail > 0 && sumPrefNonPrep > totalAvail) scale = totalAvail / sumPrefNonPrep;
  const taskDur = prefDur.map((dur, i) => i === 0 ? prepTime : Math.max(10, Math.round(dur * scale)));

  let warningHtml = '';
  if (scale < 1) {
    warningHtml = `<div class="warn" style="background:var(--warn);color:#000;padding:8px 12px;border-radius:6px;margin-bottom:12px;font-size:13px"><b>Auto-Squeeze aktif:</b> Karena target tidur jam ${d.bedTime}, durasi fokus dipersingkat otomatis agar semua materi selesai sebelum tidur. <b>BAB 4 &amp; 6 tetap diprioritaskan</b> (porsi waktu lebih besar dari BAB 5).</div>`;
  }

  const fmtTime = (m: number): string => `${pad2(Math.floor(m / 60) % 24)}:${pad2(m % 60)}`;

  pomSchedule = [];

  for (let i = 0; i < numTasks; i++) {
    if (busyStartMin >= 0 && cursor >= busyStartMin && cursor < busyEndMin) {
      const bDur = busyEndMin - busyStartMin;
      pomSchedule.push({ type: 'busy', duration: bDur, time: `${fmtTime(busyStartMin)}–${fmtTime(busyEndMin)}`, desc: d.busyLabel || 'Sibuk / istirahat' });
      cursor = busyEndMin;
    }

    const duration = taskDur[focusIdx];

    if (busyStartMin >= 0 && cursor < busyStartMin && cursor + duration > busyStartMin) {
      const truncDur = busyStartMin - cursor;
      if (truncDur >= 10) {
        pomSchedule.push({ type: 'focus', duration: truncDur, time: `${fmtTime(cursor)}–${fmtTime(busyStartMin)}`, desc: `Sesi ${i + 1}: ${focusTasks[focusIdx].desc} (${truncDur} mnt - dipotong)`, k: 'jt' + focusIdx });
      }
      const bDur = busyEndMin - busyStartMin;
      pomSchedule.push({ type: 'busy', duration: bDur, time: `${fmtTime(busyStartMin)}–${fmtTime(busyEndMin)}`, desc: d.busyLabel || 'Sibuk / istirahat' });
      cursor = busyEndMin;
    } else {
      const focusEnd = cursor + duration;
      pomSchedule.push({ type: 'focus', duration, time: `${fmtTime(cursor)}–${fmtTime(focusEnd)}`, desc: focusTasks[focusIdx].desc, k: 'jt' + focusIdx });
      cursor = focusEnd;
    }
    focusIdx++;

    if (i < numTasks - 1) {
      const isLong = (i + 1) % d.sessionsBeforeLong === 0;
      const brkMin = isLong ? d.longBreakMin : d.breakMin;
      const brkEnd = cursor + brkMin;
      pomSchedule.push({ type: isLong ? 'longbreak' : 'break', duration: brkMin, time: `${fmtTime(cursor)}–${fmtTime(brkEnd)}`, desc: isLong ? `Istirahat panjang (${brkMin} mnt)` : `Istirahat (${brkMin} mnt)` });
      cursor = brkEnd;
    }
  }

  if (pomSchedule.length === 0) return '<p class="muted">Atur waktu mulai dan tekan "Buat jadwal".</p>';

  const endTime = fmtTime(cursor);
  let html = warningHtml + pomSchedule.map(b => {
    if (b.type !== 'focus') return `<div class="slot brk"><div class="t">${b.time}</div><div>${b.desc}</div></div>`;
    const k = b.k!;
    const done = state[k] ? 'done' : '';
    return `<div class="slot">
      <div class="t">${b.time}</div>
      <div class="chk ${done}" data-key="${k}" style="border:none;padding:2px 0">
        <input type="checkbox" id="${k}" ${state[k] ? 'checked' : ''}>
        <label for="${k}">${b.desc}</label>
      </div>
    </div>`;
  }).join('');
  html += `<div class="slot brk"><div class="t">${endTime}</div><div>Selesai - istirahat penuh, tidur cukup!</div></div>`;
  return html;
}

function generateTimelineFromExisting(): string {
  if (pomSchedule.length === 0) return '<p class="muted">Atur waktu mulai dan tekan "Buat jadwal".</p>';
  const endTime = pomSchedule[pomSchedule.length - 1].time.split('–')[1] || 'Selesai';
  let html = pomSchedule.map(b => {
    if (b.type !== 'focus') return `<div class="slot brk"><div class="t">${b.time}</div><div>${b.desc}</div></div>`;
    const k = b.k!;
    const done = state[k] ? 'done' : '';
    return `<div class="slot">
      <div class="t">${b.time}</div>
      <div class="chk ${done}" data-key="${k}" style="border:none;padding:2px 0">
        <input type="checkbox" id="${k}" ${state[k] ? 'checked' : ''}>
        <label for="${k}">${b.desc}</label>
      </div>
    </div>`;
  }).join('');
  html += `<div class="slot brk"><div class="t">${endTime}</div><div>Selesai - istirahat penuh, tidur cukup!</div></div>`;
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
//  AI SCHEDULER - natural language -> Pomodoro plan
// ===================================================================
function nowHM(): string {
  const n = new Date();
  return `${pad2(n.getHours())}:${pad2(n.getMinutes())}`;
}

function parseScheduleJSON(raw: string): any {
  if (!raw) return null;
  const s = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try { return JSON.parse(s.slice(start, end + 1)); } catch { return null; }
}

// Convert AI block list -> pomSchedule with real clock times, then render.
function applyAISchedule(blocks: any[], startTime: string): void {
  const esc = (x: string) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const fmtTime = (m: number) => `${pad2(Math.floor(m / 60) % 24)}:${pad2(m % 60)}`;
  const [sh, sm] = (startTime || nowHM()).split(':').map(Number);
  let cursor = (sh || 0) * 60 + (sm || 0);

  pomSchedule = [];
  let focusCount = 0;
  for (const b of blocks) {
    const mins = Math.max(1, Math.min(180, Math.round(Number(b && b.minutes) || 0)));
    if (!mins) continue;
    const t = String((b && b.type) || 'focus').toLowerCase();
    const type: PomMode = t.startsWith('long') ? 'longbreak'
      : (t.startsWith('break') || t.startsWith('istir')) ? 'break'
      : 'focus';
    const end = cursor + mins;
    const desc = esc(String((b && b.desc) || (type === 'focus' ? 'Fokus belajar' : 'Istirahat')).slice(0, 120));
    const block: PomBlock = { type, duration: mins, time: `${fmtTime(cursor)}–${fmtTime(end)}`, desc };
    if (type === 'focus') { block.k = 'ai' + focusCount; focusCount++; }
    pomSchedule.push(block);
    cursor = end;
  }

  pomSessionIndex = 0;
  pomRemaining = 0;
  pomMode = 'idle';
  persistPomState();

  const tl = document.getElementById('pomTimeline');
  if (tl) tl.innerHTML = generateTimelineFromExisting();
  updatePomUI();
  const startBtn = document.getElementById('pomStart');
  if (startBtn) startBtn.textContent = 'Mulai';
}

async function buildScheduleWithAI(): Promise<void> {
  const reqEl = document.getElementById('aiSchedReq') as HTMLTextAreaElement | null;
  const startEl = document.getElementById('aiSchedStart') as HTMLInputElement | null;
  const statusEl = document.getElementById('aiSchedStatus');
  const btn = document.getElementById('aiSchedBtn') as HTMLButtonElement | null;
  if (!reqEl || !statusEl) return;

  const req = reqEl.value.trim();
  if (!req) { statusEl.textContent = 'Tulis dulu apa yang kamu mau (topik, total waktu, durasi sesi).'; statusEl.className = 'status'; return; }
  const startTime = (startEl && startEl.value) || nowHM();

  statusEl.textContent = 'AI sedang menyusun jadwal...';
  statusEl.className = 'status';
  if (btn) btn.disabled = true;

  const system = `Kamu perencana jadwal belajar Kalkulus 2. Susun rangkaian sesi belajar dari permintaan siswa.
Topik valid: BAB 4 (4.1 Luas antar kurva, 4.2 Volume benda putar, 4.3 Panjang kurva, 4.4 Luas permukaan, 4.5 Titik berat), BAB 5 (5.1 Parametrik, 5.2 Koordinat kutub, 5.3 Grafik kutub, 5.4 Luas kutub, 5.5 Garis singgung & busur kutub), BAB 6 (6.1 Barisan, 6.2 Deret, 6.3 Uji konvergensi, 6.4 Deret pangkat & Taylor, 6.5 Diferensiasi & integrasi deret).
Aturan WAJIB:
- Total durasi semua block (fokus + istirahat) TIDAK BOLEH melebihi total waktu yang dimiliki siswa.
- Hormati durasi sesi fokus maksimal. Pecah satu topik jadi beberapa sesi fokus bila perlu.
- Sisipkan istirahat singkat (5-10 mnt) antar sesi fokus hanya jika sisa waktu cukup; utamakan waktu untuk fokus.
- Ikuti urutan/topik yang diminta; jika tak disebut, pilih yang masuk akal (utamakan BAB 4 & 6).
- desc tiap block singkat dan sebut nomor subbab, mis. "6.1 Barisan tak hingga".
Balas HANYA JSON valid tanpa teks lain dan tanpa code fence:
{"blocks":[{"type":"focus","minutes":30,"desc":"6.1 Barisan tak hingga"},{"type":"break","minutes":5,"desc":"Istirahat"}],"note":"satu kalimat ringkas"}`;

  const userPrompt = `Permintaan siswa: """${req}"""\nWaktu mulai: ${startTime}. Buat jadwalnya sekarang.`;

  try {
    const raw = await callAITutor(system, userPrompt);
    const parsed = parseScheduleJSON(raw);
    if (!parsed || !Array.isArray(parsed.blocks) || parsed.blocks.length === 0) {
      throw new Error('AI tidak mengembalikan jadwal yang valid. Coba lagi atau perjelas permintaanmu.');
    }
    applyAISchedule(parsed.blocks, startTime);
    const focusN = parsed.blocks.filter((b: any) => String((b && b.type) || 'focus').toLowerCase().startsWith('foc')).length;
    statusEl.className = 'status ok';
    statusEl.textContent = `Jadwal dibuat (${focusN} sesi fokus).${parsed.note ? ' ' + parsed.note : ''} Tekan "Mulai" pada timer di atas.`;
  } catch (e) {
    statusEl.className = 'status err';
    statusEl.textContent = 'Gagal membuat jadwal: ' + (e as Error).message;
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ===================================================================
//  RENDER
// ===================================================================
export function renderSchedule(): void {
  const el = document.getElementById('jadwal')!;
  const a = activeProfile();
  const exam = parseExam(a.examISO);
  const examStr = exam ? dfmt.format(exam) : '-';
  const d = pomDefaults();

  el.innerHTML = `
    <h2>Jadwal Belajar Fleksibel</h2>
    <p class="muted">Atur jadwalmu sendiri - pilih kapan mulai, berapa lama fokus dan istirahat, dan tandai waktu sibuk. Timer Pomodoro dengan alarm bunyi otomatis. <b>BAB 4 &amp; 6 otomatis dapat porsi waktu lebih besar dari BAB 5.</b></p>
    <div class="progwrap"><div class="progbar" id="jadbar"></div></div>

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

    <div class="card" style="border-left:4px solid var(--acc2)">
      <h3 style="margin-top:4px">Buat jadwal dengan AI</h3>
      <p class="muted" style="margin-top:0;font-size:13px">Tulis maumu dengan bahasa biasa, AI langsung menyusun sesi fokus + istirahat sesuai waktu dan topik yang kamu sebut. Contoh: <i>"Fokus 6.1, 4.2, 4.3. Aku cuma punya 100 menit, sesi fokus maksimal 30 menit."</i></p>
      <div class="field"><textarea class="fld" id="aiSchedReq" style="min-height:64px" placeholder="mis. Fokus bab 6.1, 4.2, dan 4.3. Aku punya 100 menit, maksimal fokus 30 menit per sesi."></textarea></div>
      <div class="row">
        <div class="field" style="max-width:150px"><label>Mulai jam</label><input class="fld" type="time" id="aiSchedStart" value="${nowHM()}"></div>
        <div class="field" style="flex:0 0 auto"><label>&nbsp;</label><button class="btn" id="aiSchedBtn">Buat dengan AI</button></div>
      </div>
      <div class="status" id="aiSchedStatus"></div>
    </div>

    <div class="card">
      <h3 style="margin-top:4px">Atau atur manual</h3>
      <div class="grid g3" style="gap:10px">
        <div class="field"><label>Mulai belajar</label><input class="fld" type="time" id="pomStartTime" value="${d.startTime}"></div>
        <div class="field"><label>Target tidur</label><input class="fld" type="time" id="pomBedTime" value="${d.bedTime || '01:00'}"></div>
        <div class="field"><label>Fokus (menit)</label><input class="fld" type="number" id="pomFocusMin" value="${d.focusMin}" min="10" max="90"></div>
      </div>
      <div class="grid g3" style="gap:10px;margin-top:10px">
        <div class="field"><label>Istirahat (menit)</label><input class="fld" type="number" id="pomBreakMin" value="${d.breakMin}" min="1" max="30"></div>
        <div class="field"><label>Istirahat panjang (menit)</label><input class="fld" type="number" id="pomLongBreakMin" value="${d.longBreakMin}" min="5" max="60"></div>
        <div class="field"><label>Sesi sblm istrht panjang</label><input class="fld" type="number" id="pomSessions" value="${d.sessionsBeforeLong}" min="2" max="8"></div>
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

    <div class="card">
      <h3 style="margin-top:4px">Timeline belajarmu</h3>
      <div class="timeline" id="pomTimeline"></div>
    </div>

    <div class="card">
      <h3 style="margin-top:4px">HARI UJIAN - <span>${examStr}</span></h3>
      <div class="timeline" id="tl-exam">${renderExamTL()}</div>
    </div>

    <div class="warnbox"><span class="tag">Aturan emas</span><br>Tidur minimal 6–7 jam. Otak mengonsolidasi memori saat tidur - begadang penuh justru menurunkan skor. Berhenti belajar maksimal jam 23:00.</div>

    <div class="tip"><span class="tag">Tips Pomodoro</span><br>
      <b>25/5</b> - Standar. Fokus 25 mnt, istirahat 5 mnt. Bagus untuk materi baru.<br>
      <b>50/10</b> - Deep work. Untuk soal sulit dan mock exam.<br>
      <b>45/15</b> - Balanced. Istirahat cukup untuk review kartu kilat.<br>
      Setiap 4 sesi, ambil istirahat panjang 15–30 mnt. Minum, jalan, stretch.
    </div>
  `;

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

  document.getElementById('aiSchedBtn')!.onclick = () => buildScheduleWithAI();

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
