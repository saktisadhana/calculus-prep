// Progress stats + mock scoring (shared across sections).
import { state } from '../storage/state.ts';
import { studyDay, examDay } from '../data/schedule.ts';
import { tuKeys } from '../data/benchmarks.ts';
import { mocks } from '../data/mocks.ts';

export function pct(keys: string[]): number {
  const d = keys.filter(k => state[k]).length;
  return keys.length ? Math.round(d / keys.length * 100) : 0;
}

export function mockScore(): number {
  let s = 0;
  mocks.forEach((mockSet, mi) => {
    mockSet.forEach((_, qi) => { if (state[`mok${mi}_${qi}`]) s++; });
  });
  return Math.round(s / 3); // Average across 3 mocks
}

export function updateStats(): void {
  const matKeys = ['mat-b4', 'mat-b5', 'mat-b6'];
  const jtKeys = studyDay.filter(s => s.type === '').map((_, i) => 'jt' + i);
  const jadKeys = [...jtKeys, ...examDay.map((_, i) => 'jm' + i)];
  const mp = pct(matKeys), jp = pct(jadKeys), tp = pct(tuKeys);

  const set = (id: string, val: string) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  const setW = (id: string, val: string) => { const e = document.getElementById(id) as HTMLElement | null; if (e) e.style.width = val; };

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
