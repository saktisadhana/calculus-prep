// Pengaturan (settings) section + profile dropdown.
import {
  activeProfile, loadIdx, saveIdx, loadData, saveData, removeData, uid, defaultExamISO,
} from '../storage/profiles.ts';
import { Cloud } from '../storage/cloud.ts';
import { updateCountdown } from './countdown.ts';

const AI_MODELS = [
  { group: 'Google Gemini (default server bawaan)', options: [
    { v: 'gemini-1.5-flash', t: 'Gemini 1.5 Flash (cepat, hemat)' },
    { v: 'gemini-1.5-pro', t: 'Gemini 1.5 Pro (lebih pintar)' },
    { v: 'gemini-2.0-flash', t: 'Gemini 2.0 Flash' },
    { v: 'gemini-2.5-pro', t: 'Gemini 2.5 Pro' },
  ] },
  { group: 'OpenRouter GRATIS (daftar di openrouter.ai)', options: [
    { v: 'openrouter/deepseek/deepseek-r1-0528:free', t: 'DeepSeek R1 0528 (gratis, sangat pintar)' },
    { v: 'openrouter/qwen/qwen3-235b-a22b:free', t: 'Qwen 3 235B (gratis, pintar)' },
    { v: 'openrouter/meta-llama/llama-4-maverick:free', t: 'Llama 4 Maverick (gratis)' },
    { v: 'openrouter/google/gemma-3-27b-it:free', t: 'Gemma 3 27B (gratis, cepat)' },
  ] },
  { group: 'Groq (perlu API key sendiri)', options: [
    { v: 'llama-3.3-70b-versatile', t: 'Llama 3.3 70B' },
    { v: 'mixtral-8x7b-32768', t: 'Mixtral 8x7B' },
  ] },
  { group: 'Anthropic Claude (perlu API key sendiri)', options: [
    { v: 'claude-3-7-sonnet-20250219', t: 'Claude 3.7 Sonnet' },
    { v: 'claude-3-5-sonnet-20241022', t: 'Claude 3.5 Sonnet' },
  ] },
];

function modelOptions(selected: string): string {
  return AI_MODELS.map(g =>
    `<optgroup label="${g.group}">` +
    g.options.map(o => `<option value="${o.v}" ${o.v === selected ? 'selected' : ''}>${o.t}</option>`).join('') +
    `</optgroup>`
  ).join('');
}

export function renderSettings(): void {
  const el = document.getElementById('pengaturan')!;
  const a = activeProfile();
  const c = Cloud.getCfg();
  const selectedModel = localStorage.getItem('kalk2_ai_model') || 'gemini-1.5-flash';

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
      <h3 style="margin-top:4px">AI Tutor</h3>
      <p class="muted" style="margin-top:0">Secara default app memakai <b>AI server bawaan</b> (Gemini). Untuk penyedia lain, isi API key di bawah. <b>Rekomendasi GRATIS:</b> daftar di <a href="https://openrouter.ai" target="_blank">openrouter.ai</a>, ambil API key, lalu pilih model OpenRouter di bawah (DeepSeek R1 sangat pintar!). Juga mendukung <a href="https://console.groq.com/" target="_blank">Groq</a> dan <a href="https://console.anthropic.com/" target="_blank">Claude</a>.</p>
      <div class="field"><label>API Key (opsional)</label><input class="fld" id="aiKey" type="password" value="${localStorage.getItem('kalk2_ai_backend') || ''}" placeholder="Kosongkan untuk pakai server bawaan"></div>
      <div class="field" style="max-width:320px"><label>Model</label><select class="fld" id="aiModel">${modelOptions(selectedModel)}</select></div>
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

  wireSettingsEvents();
}

function wireSettingsEvents(): void {
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

  document.getElementById('pExport')!.onclick = () => {
    const p = activeProfile();
    const payload = { name: p.name, examISO: p.examISO, data: loadData(p.id), exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const u = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = u;
    link.download = `kalkulus2-${(p.name || 'profil').replace(/\s+/g, '_')}.json`;
    link.click();
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

  document.getElementById('aiSave')!.onclick = () => {
    const key = (document.getElementById('aiKey') as HTMLInputElement).value.trim();
    const model = (document.getElementById('aiModel') as HTMLSelectElement).value;
    localStorage.setItem('kalk2_ai_backend', key);
    localStorage.setItem('kalk2_ai_model', model);
    const status = document.getElementById('aiStatus')!;
    status.textContent = key
      ? 'Tersimpan. AI memakai API key kamu sendiri (dari browser).'
      : 'Tersimpan. AI memakai server bawaan (perlu GEMINI_API_KEY di server).';
    status.className = 'status ok';
  };

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

export function renderProfileDropdown(): void {
  const i = loadIdx()!;
  const sel = document.getElementById('profSel') as HTMLSelectElement;
  sel.innerHTML = i.list.map(p => `<option value="${p.id}" ${p.id === i.activeId ? 'selected' : ''}>${p.name || 'Profil'}</option>`).join('');
  sel.onchange = () => { const idx = loadIdx()!; idx.activeId = sel.value; saveIdx(idx); location.reload(); };

  const list = document.getElementById('profList');
  if (list) {
    list.innerHTML = i.list.map(p => `<li>
      <span class="pn">${p.name || 'Profil'} ${p.id === i.activeId ? '<span class="pcur">aktif</span>' : ''}</span>
      <span>${p.id !== i.activeId ? `<button class="btn ghost sm" data-use="${p.id}">Gunakan</button> ` : ''}${i.list.length > 1 ? `<button class="btn red sm" data-del="${p.id}">Hapus</button>` : ''}</span>
    </li>`).join('');
  }
}
