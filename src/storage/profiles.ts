// Profile management - localStorage-based multi-user system
// Compatible with existing kalk2_profiles_v2 keys for data migration

export interface Profile {
  id: string;
  name: string;
  examISO: string;
  updatedAt: number;
}

export interface ProfileIndex {
  activeId: string;
  list: Profile[];
}

const PIDX = 'kalk2_profiles_v2';
const DPREFIX = 'kalk2_data_';

function jget<T>(k: string, fallback: T): T {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) as T : fallback;
  } catch { return fallback; }
}

function jset(k: string, v: unknown): void {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* noop */ }
}

export function uid(): string {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function pad2(n: number): string { return String(n).padStart(2, '0'); }

export function defaultExamISO(): string {
  const d = new Date(Date.now() + 864e5);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T10:30`;
}

export function parseExam(iso: string): Date | null {
  if (!iso) return null;
  const [d, t] = iso.split('T');
  const [y, mo, da] = d.split('-').map(Number);
  const [h, mi] = (t || '10:30').split(':').map(Number);
  return new Date(y, (mo || 1) - 1, da || 1, h || 0, mi || 0, 0);
}

export function loadIdx(): ProfileIndex | null {
  return jget<ProfileIndex | null>(PIDX, null);
}

export function saveIdx(idx: ProfileIndex): void {
  jset(PIDX, idx);
}

export function loadData(id: string): Record<string, unknown> {
  return jget(DPREFIX + id, {});
}

export function saveData(id: string, data: Record<string, unknown>): void {
  jset(DPREFIX + id, data);
}

export function removeData(id: string): void {
  localStorage.removeItem(DPREFIX + id);
}

// Migrate from old single-user format or create default profile
export function ensureProfiles(): ProfileIndex {
  let idx = loadIdx();
  if (idx && idx.list && idx.list.length) return idx;

  idx = { activeId: '', list: [] };

  // Check for legacy single-user data
  const legacy = localStorage.getItem('kalk2_state_v1');
  if (legacy) {
    const id = uid();
    try { saveData(id, JSON.parse(legacy) || {}); } catch { saveData(id, {}); }
    idx.list.push({ id, name: 'Sakti', examISO: '2026-06-22T10:30', updatedAt: Date.now() });
    idx.activeId = id;
  } else {
    const id = uid();
    saveData(id, {});
    idx.list.push({ id, name: 'Saya', examISO: defaultExamISO(), updatedAt: Date.now() });
    idx.activeId = id;
  }

  saveIdx(idx);
  return idx;
}

export function activeProfile(): Profile {
  const i = loadIdx()!;
  return i.list.find(p => p.id === i.activeId) || i.list[0];
}
