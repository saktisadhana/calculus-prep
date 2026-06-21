// Exam countdown timer
import { activeProfile, parseExam } from '../storage/profiles.ts';

let countdownInterval: ReturnType<typeof setInterval> | null = null;

function pad2(n: number): string { return String(n).padStart(2, '0'); }

export function updateCountdown(): void {
  const exam = parseExam(activeProfile().examISO);
  const el = document.getElementById('cd');
  if (!el) return;
  if (!exam) { el.textContent = '-'; return; }
  const diff = exam.getTime() - Date.now();
  if (diff <= 0) { el.textContent = 'Saatnya ujian - semangat!'; return; }
  const d = Math.floor(diff / 864e5);
  const h = Math.floor((diff % 864e5) / 3.6e6);
  const m = Math.floor((diff % 3.6e6) / 6e4);
  const s = Math.floor((diff % 6e4) / 1000);
  if (d > 0) {
    el.textContent = `${d} hari ${h} jam ${m} mnt`;
  } else {
    el.textContent = `${h} jam ${m} mnt ${s} dtk`;
  }
}

export function startCountdown(): void {
  updateCountdown();
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(updateCountdown, 1000);
}
