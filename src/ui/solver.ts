// Soal Solver (deterministic generator) + AI Tutor.
import { GENS, TOPIC_KEYS, type GeneratedProblem } from '../data/generators.ts';
import { state, save } from '../storage/state.ts';
import { typeset } from './typeset.ts';
import { pick } from '../util.ts';
import { renderMarkdown } from './markdown.ts';

let curP: GeneratedProblem | null = null;
let curReveal = 0;

function newProblem(key: string | null, count: boolean): void {
  const g = (!key || key === 'acak') ? pick(GENS) : (GENS.find(x => x.key === key) || pick(GENS));
  curP = g.fn();
  curReveal = 0;
  if (count) {
    state.genCount = (state.genCount as number || 0) + 1;
    save();
  }
  renderProblem();
}

function renderProblem(): void {
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

function handleCmd(raw: string): void {
  const t = (raw || '').toLowerCase().trim();
  if (!t) return;
  if (/(baru|new|acak|random)/.test(t)) { newProblem((document.getElementById('genTopic') as HTMLSelectElement)?.value || 'acak', true); }
  else if (/(semua|all|jawab|answer|selesai|kunci)/.test(t)) { if (curP) { curReveal = curP.steps.length; renderProblem(); } }
  else if (/(jelas|explain|lanjut|langkah|step|next|terus|lagi)/.test(t)) { if (curP) { curReveal = Math.min(curReveal + 1, curP.steps.length); renderProblem(); } }
  else {
    const hit = TOPIC_KEYS.find(m => t.indexOf(m[0]) >= 0);
    if (hit) newProblem(hit[1], true);
  }
}

export function renderSolver(): void {
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
      <h3 style="margin-top:4px">AI Tutor</h3>
      <p class="muted" style="margin-top:0">Tanya apa saja tentang Kalkulus 2 - AI menjelaskan langkah demi langkah dengan rumus LaTeX. Tanpa konfigurasi, app memakai AI server bawaan; atau pakai API key sendiri di Pengaturan.</p>
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

  // Wire generator events
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

// ===================================================================
//  AI TUTOR
// ===================================================================

// Default path: serverless backend (key kept server-side as GEMINI_API_KEY).
// Fallback: if the user pasted their own key in Settings, call the provider
// directly from the browser (supports Gemini, Claude, and Groq models).
export async function callAITutor(systemPrompt: string, userPrompt: string): Promise<string> {
  let localKey = (localStorage.getItem('kalk2_ai_backend') || '').trim();
  let model = localStorage.getItem('kalk2_ai_model') || 'gemini-1.5-flash';

  if (!localKey) {
    localKey = 'AIzaSyAj_UbbGOQrqo8kK6Pr9Bxbwm6AFDqpMH0';
    if (!localStorage.getItem('kalk2_ai_model')) {
      model = 'gemini-1.5-flash';
    }
  }

  let finalSystem = systemPrompt;
  if (state.aiStyleRules) {
    finalSystem += '\n\nATURAN GAYA BAHASA DARI PENGGUNA (WAJIB DIIKUTI): ' + state.aiStyleRules;
  }

  return callProviderDirect(localKey, model, finalSystem, userPrompt);
}

// Bring-your-own-key direct call (no backend needed).
async function callProviderDirect(apiKey: string, model: string, systemPrompt: string, userPrompt: string): Promise<string> {
  // OpenRouter (free models) — uses OpenAI-compatible format
  if (model.startsWith('openrouter/')) {
    const realModel = model.replace('openrouter/', '');
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: realModel,
        max_tokens: 4096,
        temperature: 0.3,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    return data.choices[0].message.content;
  }

  if (model.startsWith('claude')) {
    const url = 'https://api.anthropic.com/v1/messages';
    const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
    const res = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        temperature: 0.3,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    return data.content[0].text;
  }

  if (model.startsWith('llama') || model.startsWith('mixtral')) {
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const opts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        temperature: 0.3,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    };

    let res;
    try {
      res = await fetch(url, opts);
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message.includes('Network') || err.message.includes('fetch')) {
        // Fallback to proxy if CORS/Adblock blocks it
        const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
        res = await fetch(proxyUrl, opts);
      } else {
        throw err;
      }
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    return data.choices[0].message.content;
  }

  // Gemini direct
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

const AI_SYSTEM = 'Kamu adalah tutor Kalkulus 2 yang ahli. Jawab dalam Bahasa Indonesia. Gunakan notasi LaTeX ($...$) untuk semua matematika. Berikan penjelasan langkah demi langkah yang jelas. Referensikan nomor Bab jika relevan (Bab 1: Fungsi Transenden, Bab 2: Teknik Integrasi, Bab 3: Integral Numerik & Tak Wajar, Bab 4: Aplikasi Integral, Bab 5: Parametrik & Kutub, Bab 6: Barisan & Deret).';

async function sendAIQuestion(): Promise<void> {
  const input = document.getElementById('aiInput') as HTMLTextAreaElement;
  const resp = document.getElementById('aiResponse')!;
  const question = input.value.trim();
  if (!question) return;

  resp.style.display = 'block';
  resp.classList.add('streaming');
  resp.innerHTML = 'Sedang berpikir...';

  try {
    const text = await callAITutor(AI_SYSTEM, `Pertanyaan siswa: ${question}`);
    resp.classList.remove('streaming');
    resp.innerHTML = renderMarkdown(text);
    typeset(resp);

    // Like/Dislike feedback
    const fb = document.createElement('div');
    fb.style.cssText = 'margin-top:12px;padding-top:12px;border-top:1px solid var(--line);display:flex;gap:8px;';
    fb.innerHTML = `
      <button class="btn ghost2 sm fb-like">Like</button>
      <button class="btn ghost2 sm fb-dislike">Dislike</button>
    `;
    resp.appendChild(fb);

    const btnLike = fb.querySelector('.fb-like') as HTMLButtonElement;
    const btnDislike = fb.querySelector('.fb-dislike') as HTMLButtonElement;

    btnLike.onclick = async () => {
      btnLike.disabled = true;
      btnDislike.style.display = 'none';
      btnLike.textContent = 'Menyimpan...';
      try {
        const sysFb = 'Rangkum gaya penulisan, format, dan *tone* dari teks berikut ke dalam 1 kalimat instruksi singkat. JANGAN BAHAS MATERINYA. Berikan HANYA kalimat instruksi.';
        const styleInfo = await callAITutor(sysFb, text);
        state.aiStyleRules = styleInfo;
        save();
        btnLike.textContent = 'Preferensi Disimpan!';
      } catch (e) {
        btnLike.textContent = 'Gagal';
      }
    };
    btnDislike.onclick = () => {
      fb.innerHTML = '<span style="font-size:12px;color:var(--muted)">Diabaikan.</span>';
    };

  } catch (err) {
    resp.classList.remove('streaming');
    resp.innerHTML = `<b>Error:</b> ${(err as Error).message}`;
  }
}

// Floating "Jelaskan" button that explains highlighted text via AI.
export function setupAIHighlight(): void {
  const btn = document.createElement('button');
  btn.id = 'aiHighlightBtn';
  btn.textContent = 'Jelaskan dengan AI';
  document.body.appendChild(btn);

  const popover = document.createElement('div');
  popover.id = 'aiPopover';
  popover.innerHTML = `
    <div class="ai-pop-header"><span>AI Explainer <span style="color:var(--muted);font-weight:400">· geser</span></span> <button class="ai-pop-close">&times;</button></div>
    <div class="ai-pop-content" id="aiPopContent"></div>
  `;
  document.body.appendChild(popover);

  let selectedText = '';
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(v, hi));

  function extractSelectionTextWithMath(sel: Selection): string {
    if (!sel || sel.rangeCount === 0) return '';
    const frag = sel.getRangeAt(0).cloneContents();
    const div = document.createElement('div');
    div.appendChild(frag);

    const mathEls = div.querySelectorAll('mjx-container');
    mathEls.forEach(el => {
      const tex = el.getAttribute('data-tex');
      if (tex) {
        const isBlock = el.getAttribute('data-display') === 'true' || el.hasAttribute('display');
        const wrapper = document.createTextNode(isBlock ? `$$${tex}$$` : `$${tex}$`);
        el.replaceWith(wrapper);
      }
    });

    div.style.position = 'absolute';
    div.style.left = '-9999px';
    document.body.appendChild(div);
    const text = div.innerText || div.textContent || '';
    document.body.removeChild(div);
    return text.trim();
  }

  document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) { btn.style.display = 'none'; return; }
    
    // Use our custom extractor to get LaTeX instead of blank spaces
    const text = extractSelectionTextWithMath(sel);
    // Fallback to native toString to detect if we actually highlighted something visible
    const rawText = sel.toString().trim();
    
    if (rawText.length <= 2 && text.length <= 2) { btn.style.display = 'none'; return; }
    
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;
    if (popover.contains(sel.anchorNode)) return;
    selectedText = text || rawText;

    // Position the button near the selection, clamped to the viewport (fixed).
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    btn.style.display = 'flex';
    const bw = btn.offsetWidth || 150, bh = btn.offsetHeight || 34;
    let top = rect.top - bh - 8;
    if (top < 8) top = rect.bottom + 8; // flip below the selection if no room above
    btn.style.left = `${clamp(rect.left + rect.width / 2 - bw / 2, 8, window.innerWidth - bw - 8)}px`;
    btn.style.top = `${clamp(top, 8, window.innerHeight - bh - 8)}px`;
  });

  document.addEventListener('mousedown', (e) => {
    if (btn.contains(e.target as Node) || popover.contains(e.target as Node)) return;
    popover.style.display = 'none';
    btn.style.display = 'none';
  });

  popover.querySelector('.ai-pop-close')!.addEventListener('click', () => { popover.style.display = 'none'; });

  // Keep the popover fully inside the viewport.
  const placePopover = () => {
    const pw = popover.offsetWidth || 340, ph = popover.offsetHeight || 200;
    popover.style.left = `${clamp(parseInt(btn.style.left || '20') - 40, 8, window.innerWidth - pw - 8)}px`;
    popover.style.top = `${clamp(parseInt(btn.style.top || '20') + 38, 8, window.innerHeight - ph - 8)}px`;
  };

  btn.addEventListener('click', async () => {
    btn.style.display = 'none';
    popover.style.display = 'flex';
    placePopover();

    const content = document.getElementById('aiPopContent')!;
    content.className = 'ai-pop-content loading';
    content.innerHTML = 'Menyusun penjelasan...';

    try {
      const sys = 'Kamu adalah asisten cerdas Kalkulus 2. Jika pengguna menyorot sebuah soal, berikan solusi langkah demi langkah untuk menyelesaikannya. Jika pengguna menyorot teori/rumus, jelaskan konsepnya dengan jelas. SAAT MENJELASKAN KONSEP, KAMU WAJIB: 1) Memberikan 1 contoh latihan soal singkat beserta jawabannya. 2) Menjelaskan "sister concept" atau jebakan umum (misal: jika ada lubang pada volume putar, gunakan metode cincin, bukan cakram; atau bedakan disk test vs ratio test). Gunakan format Markdown dan LaTeX ($...$).';
      const ans = await callAITutor(sys, `Teks yang disorot:\n"${selectedText}"\n\nTolong jelaskan teks/soal di atas!`);
      content.className = 'ai-pop-content';
      content.innerHTML = renderMarkdown(ans);
      typeset(content);

      // Like/Dislike feedback
      const fb = document.createElement('div');
      fb.style.cssText = 'margin-top:12px;padding-top:12px;border-top:1px solid var(--line);display:flex;gap:8px;';
      fb.innerHTML = `
        <button class="btn ghost2 sm fb-like">Like</button>
        <button class="btn ghost2 sm fb-dislike">Dislike</button>
      `;
      content.appendChild(fb);

      const btnLike = fb.querySelector('.fb-like') as HTMLButtonElement;
      const btnDislike = fb.querySelector('.fb-dislike') as HTMLButtonElement;

      btnLike.onclick = async () => {
        btnLike.disabled = true;
        btnDislike.style.display = 'none';
        btnLike.textContent = 'Menyimpan...';
        try {
          const sysFb = 'Rangkum gaya penulisan, format, dan *tone* dari teks berikut ke dalam 1 kalimat instruksi singkat. JANGAN BAHAS MATERINYA. Berikan HANYA kalimat instruksi.';
          const styleInfo = await callAITutor(sysFb, ans);
          state.aiStyleRules = styleInfo;
          save();
          btnLike.textContent = 'Preferensi Disimpan!';
        } catch (e) {
          btnLike.textContent = 'Gagal';
        }
      };
      btnDislike.onclick = () => {
        fb.innerHTML = '<span style="font-size:12px;color:var(--muted)">Diabaikan.</span>';
      };

      placePopover(); // re-clamp after the content height changes
    } catch (e) {
      content.className = 'ai-pop-content';
      content.innerHTML = `<b>Gagal memanggil AI:</b> ${(e as Error).message}`;
    }
  });

  // Drag the popover around by its header.
  makeDraggable(popover, popover.querySelector('.ai-pop-header') as HTMLElement);
}

// Generic drag handler (mouse + touch), clamped to the viewport.
function makeDraggable(panel: HTMLElement, handle: HTMLElement): void {
  let dragging = false, startX = 0, startY = 0, originX = 0, originY = 0;

  const begin = (target: EventTarget | null, cx: number, cy: number) => {
    if ((target as HTMLElement)?.closest?.('.ai-pop-close')) return; // don't drag from the close button
    dragging = true;
    const r = panel.getBoundingClientRect();
    originX = r.left; originY = r.top; startX = cx; startY = cy;
    panel.style.left = `${originX}px`;
    panel.style.top = `${originY}px`;
    document.body.style.userSelect = 'none';
  };
  const moveTo = (cx: number, cy: number) => {
    if (!dragging) return;
    const pw = panel.offsetWidth, ph = panel.offsetHeight;
    panel.style.left = `${Math.max(4, Math.min(originX + (cx - startX), window.innerWidth - pw - 4))}px`;
    panel.style.top = `${Math.max(4, Math.min(originY + (cy - startY), window.innerHeight - ph - 4))}px`;
  };
  const end = () => { dragging = false; document.body.style.userSelect = ''; };

  handle.addEventListener('mousedown', (e) => { begin(e.target, e.clientX, e.clientY); if (dragging) e.preventDefault(); });
  window.addEventListener('mousemove', (e) => moveTo(e.clientX, e.clientY));
  window.addEventListener('mouseup', end);

  handle.addEventListener('touchstart', (e) => { const t = e.touches[0]; begin(e.target, t.clientX, t.clientY); }, { passive: true });
  window.addEventListener('touchmove', (e) => { if (!dragging) return; e.preventDefault(); const t = e.touches[0]; moveTo(t.clientX, t.clientY); }, { passive: false });
  window.addEventListener('touchend', end);
}
