// Cloud sync via Supabase (optional)
import { loadIdx, saveIdx, loadData, saveData, activeProfile, defaultExamISO } from './profiles.ts';

const CKEY = 'kalk2_cloud_cfg';

interface CloudConfig {
  enabled: boolean;
  url: string;
  anonKey: string;
  table: string;
}

function getCfg(): CloudConfig {
  try {
    const v = localStorage.getItem(CKEY);
    return v ? JSON.parse(v) : { enabled: false, url: '', anonKey: '', table: 'kalk2_profiles' };
  } catch {
    return { enabled: false, url: '', anonKey: '', table: 'kalk2_profiles' };
  }
}

function setCfg(c: CloudConfig): void {
  try { localStorage.setItem(CKEY, JSON.stringify(c)); } catch { /* noop */ }
}

function isEnabled(): boolean {
  const c = getCfg();
  return !!(c.enabled && c.url && c.anonKey);
}

function headers(): Record<string, string> {
  const c = getCfg();
  return {
    apikey: c.anonKey,
    Authorization: 'Bearer ' + c.anonKey,
    'Content-Type': 'application/json',
  };
}

async function push(p: { id: string; name: string; examISO: string }): Promise<void> {
  const c = getCfg();
  const now = new Date().toISOString();
  const body = [{
    id: p.id,
    name: p.name,
    exam_iso: p.examISO,
    state: loadData(p.id),
    updated_at: now,
  }];
  const res = await fetch(`${c.url.replace(/\/$/, '')}/rest/v1/${c.table}?on_conflict=id`, {
    method: 'POST',
    headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + (await res.text()).slice(0, 120));
  const i = loadIdx()!;
  const ex = i.list.find(x => x.id === p.id);
  if (ex) ex.updatedAt = Date.parse(now);
  saveIdx(i);
}

async function pullAll(): Promise<Array<{ id: string; name: string; exam_iso: string; state: Record<string, unknown>; updated_at: string }>> {
  const c = getCfg();
  const res = await fetch(
    `${c.url.replace(/\/$/, '')}/rest/v1/${c.table}?select=id,name,exam_iso,state,updated_at`,
    { headers: headers() }
  );
  if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + (await res.text()).slice(0, 120));
  return await res.json();
}

let syncStatusEl: HTMLElement | null = null;

function setSync(msg: string, cls: string): void {
  if (!syncStatusEl) syncStatusEl = document.getElementById('cStatus');
  if (syncStatusEl) {
    syncStatusEl.textContent = msg;
    syncStatusEl.className = 'status ' + (cls || '');
  }
}

async function syncNow(): Promise<void> {
  if (!isEnabled()) { setSync('Cloud sync nonaktif.', ''); return; }
  setSync('Menyinkronkan...', '');
  try {
    const ap = activeProfile();
    await push(ap);
    const rows = await pullAll();
    const i = loadIdx()!;
    let merged = 0;
    let activeTouched = false;
    rows.forEach(r => {
      const rt = Date.parse(r.updated_at) || 0;
      const ex = i.list.find(p => p.id === r.id);
      if (!ex) {
        i.list.push({
          id: r.id,
          name: r.name || 'Profil',
          examISO: r.exam_iso || defaultExamISO(),
          updatedAt: rt,
        });
        saveData(r.id, r.state || {});
        merged++;
      } else if (rt > (ex.updatedAt || 0)) {
        ex.name = r.name || ex.name;
        ex.examISO = r.exam_iso || ex.examISO;
        ex.updatedAt = rt;
        saveData(r.id, r.state || {});
        merged++;
        if (r.id === i.activeId) activeTouched = true;
      }
    });
    saveIdx(i);
    setSync(
      `Tersinkron. ${rows.length} profil di cloud${merged ? `, ${merged} diperbarui` : ''}.`,
      'ok'
    );
    if (activeTouched) location.reload();
  } catch (err) {
    setSync('Gagal sync: ' + (err as Error).message, 'err');
  }
}

let pushTimer: ReturnType<typeof setTimeout> | null = null;

function schedulePush(): void {
  if (!isEnabled()) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    push(activeProfile())
      .then(() => setSync('Tersimpan ke cloud.', 'ok'))
      .catch(e => setSync('Gagal simpan cloud: ' + e.message, 'err'));
  }, 1500);
}

export const Cloud = {
  getCfg,
  setCfg,
  isEnabled,
  push,
  syncNow,
  schedulePush,
  setSync,
};
