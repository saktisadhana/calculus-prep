// Vercel serverless function — AI Tutor backend.
// Keeps the API key on the server (set GEMINI_API_KEY in your Vercel project
// env vars). The browser calls POST /api/ai with { system, prompt, model? }
// and never sees the key. Optionally set GEMINI_MODEL to change the default.
import { GoogleGenerativeAI } from '@google/generative-ai';

interface AIRequest { system?: string; prompt?: string; model?: string }

export default async function handler(req: any, res: any): Promise<void> {
  // CORS (same-origin in practice, but harmless and helps local tooling)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    res.status(500).json({ error: 'Server belum dikonfigurasi: set GEMINI_API_KEY di environment Vercel.' });
    return;
  }

  try {
    let body: AIRequest = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    if (!body || typeof body !== 'object') body = {};

    const { system, prompt, model } = body;
    if (!prompt) { res.status(400).json({ error: 'Pertanyaan kosong.' }); return; }

    const genAI = new GoogleGenerativeAI(key);
    // Only Gemini models are served here; the client uses its own key for other providers.
    const modelName = model && model.startsWith('gemini') ? model : (process.env.GEMINI_MODEL || 'gemini-1.5-flash');
    const m = genAI.getGenerativeModel({ model: modelName, systemInstruction: system || undefined });

    const result = await m.generateContent(prompt);
    const text = result.response.text();
    res.status(200).json({ text });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Terjadi kesalahan pada AI.' });
  }
}
