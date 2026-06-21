// Schedule data - study day + exam day timeline.
// Each focus slot carries a `weight` used by the Pomodoro generator to allocate
// study time. PRIORITY: Bab 4 & 6 are weighted higher than Bab 5, so the
// generated timeline gives them proportionally more focus minutes.
export interface ScheduleSlot {
  time: string;
  desc: string;
  type: '' | 'brk' | 'exam';
  weight?: number; // relative focus-time weight (focus blocks only); default 1
}

// Chapter priority weights. Bab 4 & 6 (high yield, exam-heavy) > Bab 5.
export const CHAPTER_WEIGHT = { b4: 1.4, b5: 0.7, b6: 1.4, other: 1 };

export const studyDay: ScheduleSlot[] = [
  { time: '11:30–11:45', desc: 'Setup & baca rencana, siapkan alat tulis dan air minum', type: '', weight: CHAPTER_WEIGHT.other },
  { time: '11:45–13:15', desc: 'BAB 4.1–4.2: Luas antar kurva dan Volume (cakram/cincin/kulit) + 4 soal', type: '', weight: CHAPTER_WEIGHT.b4 },
  { time: '13:15–14:00', desc: 'Istirahat dan makan siang', type: 'brk' },
  { time: '14:00–15:30', desc: 'BAB 4.3–4.5: Panjang kurva, luas permukaan, titik berat + 3 soal', type: '', weight: CHAPTER_WEIGHT.b4 },
  { time: '15:30–15:45', desc: 'Break + active recall: tutup mata, sebut rumus BAB 4', type: 'brk' },
  { time: '15:45–17:15', desc: 'BAB 5.1–5.3: Parametrik, koordinat dan grafik kutub + sketsa kurva', type: '', weight: CHAPTER_WEIGHT.b5 },
  { time: '17:15–17:45', desc: 'Break / istirahat sejenak', type: 'brk' },
  { time: '17:45–19:00', desc: 'BAB 5.4–5.5: Luas kutub, garis singgung, panjang busur + 3 soal', type: '', weight: CHAPTER_WEIGHT.b5 },
  { time: '19:00–19:45', desc: 'Makan malam dan istirahat', type: 'brk' },
  { time: '19:45–21:15', desc: 'BAB 6.1–6.3: Barisan, deret, uji konvergensi (kuasai tabel uji)', type: '', weight: CHAPTER_WEIGHT.b6 },
  { time: '21:15–21:30', desc: 'Break', type: 'brk' },
  { time: '21:30–22:45', desc: 'BAB 6.4–6.5: Deret pangkat, Taylor/Maclaurin, diferensiasi dan integrasi', type: '', weight: CHAPTER_WEIGHT.b6 },
  { time: '22:45–23:00', desc: 'Review kilat: baca semua kartu kilat rumus + isi Tolak Ukur', type: '', weight: CHAPTER_WEIGHT.other },
  { time: '23:00', desc: 'Tidur (target minimal 7 jam)', type: 'brk' },
];

export const examDay: ScheduleSlot[] = [
  { time: '06:30', desc: 'Bangun, sarapan ringan, mandi', type: 'brk' },
  { time: '07:00–08:30', desc: 'MOCK EXAM berwaktu (90 menit, jangan buka catatan)', type: '' },
  { time: '08:30–09:15', desc: 'Koreksi mock, catat tiap kesalahan dan tipe soalnya', type: '' },
  { time: '09:15–10:00', desc: 'Review rumus master + 2 sampai 3 topik terlemah dari mock', type: '' },
  { time: '10:00–10:20', desc: 'Berangkat, bawa alat lengkap, tarik napas tenang', type: 'brk' },
  { time: '10:30', desc: 'UJIAN KALKULUS 2 - semangat!', type: 'exam' },
];
