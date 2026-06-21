import { callAITutor } from './solver.ts';
import { renderMarkdown } from './markdown.ts';
import { typeset } from './typeset.ts';

export function setupFloatingChat(): void {
  // Create UI
  const container = document.createElement('div');
  container.className = 'ai-chat-container';
  container.innerHTML = `
    <div class="ai-chat-panel" id="aiChatPanel" style="display:none">
      <div class="ai-chat-header">
        <b>🤖 AI Assistant</b>
        <button id="aiChatClose" class="btn ghost sm" style="padding:4px;min-width:unset">✕</button>
      </div>
      <div class="ai-chat-body" id="aiChatBody">
        <div class="ai-msg">Halo! Ada yang bisa saya bantu terkait Kalkulus 2 hari ini?</div>
      </div>
      <div class="ai-chat-input-area">
        <textarea id="aiChatInput" placeholder="Tanya sesuatu... (Shift+Enter baris baru)" rows="1"></textarea>
        <button id="aiChatSend" class="btn sm">Kirim</button>
      </div>
    </div>
    <button class="ai-chat-btn" id="aiChatToggle" title="Tanya AI">
      ✨
    </button>
  `;
  document.body.appendChild(container);

  const panel = document.getElementById('aiChatPanel')!;
  const toggleBtn = document.getElementById('aiChatToggle')!;
  const closeBtn = document.getElementById('aiChatClose')!;
  const body = document.getElementById('aiChatBody')!;
  const input = document.getElementById('aiChatInput') as HTMLTextAreaElement;
  const sendBtn = document.getElementById('aiChatSend') as HTMLButtonElement;

  // Toggle
  toggleBtn.addEventListener('click', () => {
    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
    if (panel.style.display === 'flex') input.focus();
  });
  closeBtn.addEventListener('click', () => {
    panel.style.display = 'none';
  });

  let history: { role: 'user' | 'assistant', content: string }[] = [];

  const handleSend = async () => {
    const text = input.value.trim();
    if (!text) return;

    // Append user message
    const uMsg = document.createElement('div');
    uMsg.className = 'ai-msg user';
    uMsg.textContent = text;
    body.appendChild(uMsg);
    input.value = '';
    input.style.height = 'auto'; // reset height
    body.scrollTop = body.scrollHeight;

    history.push({ role: 'user', content: text });

    // Append loading bubble
    const aMsg = document.createElement('div');
    aMsg.className = 'ai-msg loading';
    aMsg.textContent = 'Mengetik...';
    body.appendChild(aMsg);
    body.scrollTop = body.scrollHeight;

    try {
      // Build prompt from history (simplified window)
      const sys = 'Kamu adalah AI Assistant untuk mahasiswa yang sedang belajar Kalkulus 2. Berikan saran belajar, penjelasan konsep, atau rekomendasi jadwal. Selalu ramah, ringkas, dan memotivasi. Gunakan Markdown dan LaTeX ($...$).';
      
      // Limit history to last 10 pairs to avoid token bloat
      const recent = history.slice(-10);
      let promptText = '';
      for (const h of recent) {
        promptText += `\n\n${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`;
      }

      const ans = await callAITutor(sys, promptText);
      history.push({ role: 'assistant', content: ans });

      aMsg.className = 'ai-msg';
      aMsg.innerHTML = renderMarkdown(ans);
      typeset(aMsg);
    } catch (e: any) {
      aMsg.className = 'ai-msg error';
      aMsg.textContent = `Error: ${e.message}`;
    }
    body.scrollTop = body.scrollHeight;
  };

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });
}
