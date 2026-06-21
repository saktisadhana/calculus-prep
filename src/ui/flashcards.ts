// Kartu Kilat (flashcards) section.
import { flashcards } from '../data/flashcards.ts';
import { typeset } from './typeset.ts';
import { shuffleArray } from '../util.ts';

let fcIdx = 0;
let fcFlipped = false;
let fcKnown = 0;
let fcUnknown = 0;
const fcDeck = [...flashcards];

export function renderFlashcards(): void {
  const el = document.getElementById('flashcards')!;
  el.innerHTML = `
    <h2>Kartu Kilat — Review Cepat</h2>
    <p class="muted">Klik kartu untuk membalik. Tandai "Sudah Paham" atau "Belum Paham" untuk melacak progres. Total: <b>${flashcards.length} kartu</b> dari Bab 1–6.</p>

    <div class="row" style="justify-content:center;gap:10px;margin-bottom:14px">
      <button class="btn ghost sm" id="fcShuffle">Acak ulang</button>
      <button class="btn ghost sm" id="fcReset">Reset progres</button>
    </div>

    <div class="flashcard-container">
      <div class="flashcard" id="fcCard">
        <div class="fc-face fc-front">
          <div class="fc-label" id="fcBab"></div>
          <div class="fc-content" id="fcFront"></div>
          <div class="hint" style="margin-top:16px">Klik untuk membalik</div>
        </div>
        <div class="fc-face fc-back">
          <div class="fc-label">JAWABAN</div>
          <div class="fc-content" id="fcBack"></div>
        </div>
      </div>
    </div>

    <div class="fc-progress">
      <span style="color:var(--ok)" id="fcKnownCount">Paham: 0</span>
      <span style="color:var(--bad)" id="fcUnknownCount">Belum: 0</span>
      <span>Sisa: <span id="fcRemaining">${fcDeck.length}</span></span>
      <span id="fcPosition">1 / ${fcDeck.length}</span>
    </div>

    <div class="row" style="justify-content:center;gap:10px;margin-top:14px">
      <button class="btn red sm" id="fcDontKnow">Belum Paham</button>
      <button class="btn sm" id="fcKnow" style="background:var(--ok)">Sudah Paham</button>
    </div>
  `;

  const card = document.getElementById('fcCard')!;
  card.onclick = () => {
    fcFlipped = !fcFlipped;
    card.classList.toggle('flipped', fcFlipped);
  };

  document.getElementById('fcShuffle')!.onclick = () => {
    shuffleArray(fcDeck);
    fcIdx = 0; fcFlipped = false; fcKnown = 0; fcUnknown = 0;
    updateFlashcard();
  };

  document.getElementById('fcReset')!.onclick = () => {
    fcIdx = 0; fcFlipped = false; fcKnown = 0; fcUnknown = 0;
    updateFlashcard();
  };

  document.getElementById('fcKnow')!.onclick = () => { fcKnown++; nextCard(); };

  document.getElementById('fcDontKnow')!.onclick = () => {
    fcUnknown++;
    fcDeck.push(fcDeck[fcIdx]); // Move to end for review
    nextCard();
  };

  shuffleArray(fcDeck);
  updateFlashcard();
}

function nextCard(): void {
  fcIdx++;
  fcFlipped = false;
  const card = document.getElementById('fcCard');
  if (card) card.classList.remove('flipped');
  updateFlashcard();
}

function updateFlashcard(): void {
  if (fcIdx >= fcDeck.length) {
    const front = document.getElementById('fcFront')!;
    front.innerHTML = `<b>Selesai!</b><br>Paham: ${fcKnown} · Belum: ${fcUnknown}`;
    document.getElementById('fcBab')!.textContent = 'HASIL';
    document.getElementById('fcBack')!.innerHTML = 'Klik "Acak ulang" untuk mulai lagi.';
    return;
  }
  const c = fcDeck[fcIdx];
  document.getElementById('fcBab')!.textContent = c.bab;
  document.getElementById('fcFront')!.innerHTML = c.front;
  document.getElementById('fcBack')!.innerHTML = c.back;
  document.getElementById('fcKnownCount')!.textContent = `Paham: ${fcKnown}`;
  document.getElementById('fcUnknownCount')!.textContent = `Belum: ${fcUnknown}`;
  document.getElementById('fcRemaining')!.textContent = `${fcDeck.length - fcIdx}`;
  document.getElementById('fcPosition')!.textContent = `${fcIdx + 1} / ${fcDeck.length}`;
  const container = document.querySelector('.flashcard-container');
  if (container) typeset(container as HTMLElement);
}
