// Reactive state - wraps per-profile data with auto-save
import { ensureProfiles, activeProfile, loadData, saveData, loadIdx, saveIdx } from './profiles.ts';
import { Cloud } from './cloud.ts';

// Initialize
const idx = ensureProfiles();
const active = activeProfile();
export let state: Record<string, any> = loadData(active.id);

export function save(): void {
  const i = loadIdx()!;
  saveData(i.activeId, state);
  const p = i.list.find(x => x.id === i.activeId);
  if (p) p.updatedAt = Date.now();
  saveIdx(i);
  Cloud.schedulePush();
}

export function resetState(): void {
  state = {};
  save();
  location.reload();
}

export function reloadState(): void {
  const ap = activeProfile();
  state = loadData(ap.id);
}
