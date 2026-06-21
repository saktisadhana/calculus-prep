// Drill Cepat (timed speed rounds) section.
import { state, save } from '../storage/state.ts';
import { typeset } from './typeset.ts';
import { pad2, pick, shuffleArray } from '../util.ts';

interface DrillProblem { question: string; choices: string[]; correct: number; }

function genDrill(): DrillProblem {
  const type = Math.floor(Math.random() * 6);
  switch (type) {
    case 0: { // p-series
      const p = pick(['1/3', '1/2', '1', '3/2', '2', '3']);
      const conv = ['3/2', '2', '3'].includes(p);
      return { question: `$\\sum 1/n^{${p}}$ konvergen?`, choices: ['Konvergen', 'Divergen'], correct: conv ? 0 : 1 };
    }
    case 1: { // geometric ratio
      const r = pick(['1/2', '1/3', '2/3', '3/4', '1', '2']);
      const conv = ['1/2', '1/3', '2/3', '3/4'].includes(r);
      return { question: `$\\sum (${r})^n$ konvergen?`, choices: ['Konvergen', 'Divergen'], correct: conv ? 0 : 1 };
    }
    case 2: { // derivative
      const q = pick([
        { q: '$d/dx(\\ln x)$', a: '$1/x$', w: ['$x$', '$e^x$', '$1/x^2$'] },
        { q: '$d/dx(\\arctan x)$', a: '$1/(1+x^2)$', w: ['$1/\\sqrt{1-x^2}$', '$\\sec^2 x$', '$-1/(1+x^2)$'] },
        { q: '$d/dx(e^{2x})$', a: '$2e^{2x}$', w: ['$e^{2x}$', '$2xe^{2x}$', '$e^x$'] },
      ]);
      const choices = shuffleArray([q.a, ...q.w]);
      return { question: q.q, choices, correct: choices.indexOf(q.a) };
    }
    case 3: { // rose petals
      const n = pick([2, 3, 4, 5]);
      const ans = n % 2 === 0 ? 2 * n : n;
      const choices = [`${ans}`, `${n}`, `${2 * n}`, `${n + 1}`].filter((v, i, a) => a.indexOf(v) === i);
      while (choices.length < 4) choices.push(`${Math.floor(Math.random() * 10) + 1}`);
      return { question: `Berapa daun $r=\\cos(${n}\\theta)$?`, choices: shuffleArray(choices), correct: -1 };
    }
    case 4: { // method choice
      const q = pick([
        { q: 'Putar terhadap sumbu-x, daerah menempel sumbu', a: 'Cakram', w: ['Cincin', 'Kulit', 'Pappus'] },
        { q: 'Putar terhadap sumbu-x, ada lubang', a: 'Cincin', w: ['Cakram', 'Kulit', 'Pappus'] },
        { q: 'Putar terhadap sumbu-y, fungsi dalam $x$', a: 'Kulit Tabung', w: ['Cakram', 'Cincin', 'Pappus'] },
      ]);
      const choices = shuffleArray([q.a, ...q.w]);
      return { question: q.q + ' → metode?', choices, correct: choices.indexOf(q.a) };
    }
    default: { // substitution
      const q = pick([
        { q: '$\\sqrt{a^2-x^2}$ → substitusi?', a: '$x=a\\sin\\theta$', w: ['$x=a\\tan\\theta$', '$x=a\\sec\\theta$', '$u=a^2-x^2$'] },
        { q: '$\\sqrt{a^2+x^2}$ → substitusi?', a: '$x=a\\tan\\theta$', w: ['$x=a\\sin\\theta$', '$x=a\\sec\\theta$', '$u=a^2+x^2$'] },
      ]);
      const choices = shuffleArray([q.a, ...q.w]);
      return { question: q.q, choices, correct: choices.indexOf(q.a) };
    }
  }
}

let drillTimer: ReturnType<typeof setInterval> | null = null;
let drillTime = 180;
let drillScore = 0;
let drillTotal = 0;
let drillCurrent: DrillProblem | null = null;
let drillActive = false;

export function renderDrills(): void {
  const el = document.getElementById('drills')!;
  el.innerHTML = `
    <h2>Drill Cepat - 3 Menit</h2>
    <p class="muted">Jawab soal cepat sebanyak-banyaknya dalam 3 menit. Melatih kecepatan dan intuisi rumus. Skor terbaik: <b id="drillBest">${state.drillBest || 0}</b>.</p>

    <div class="drill-area">
      <div class="drill-timer" id="drillClock">3:00</div>
      <div class="drill-score">Skor: <span id="drillScoreEl">0</span> / <span id="drillTotalEl">0</span></div>
      <div class="row" style="justify-content:center;gap:10px;margin:14px 0">
        <button class="btn lg" id="drillStart">Mulai Drill</button>
        <button class="btn red sm" id="drillStop" style="display:none">Stop</button>
      </div>
      <div id="drillProblem" class="drill-problem" style="display:none"></div>
      <div id="drillChoices" class="drill-choices" style="display:none"></div>
    </div>
  `;

  document.getElementById('drillStart')!.onclick = startDrill;
  document.getElementById('drillStop')!.onclick = stopDrill;
}

function startDrill(): void {
  drillTime = 180; drillScore = 0; drillTotal = 0; drillActive = true;
  document.getElementById('drillStart')!.style.display = 'none';
  document.getElementById('drillStop')!.style.display = '';
  document.getElementById('drillProblem')!.style.display = '';
  document.getElementById('drillChoices')!.style.display = '';
  updateDrillUI();
  nextDrillProblem();
  drillTimer = setInterval(() => {
    drillTime--;
    document.getElementById('drillClock')!.textContent = `${Math.floor(drillTime / 60)}:${pad2(drillTime % 60)}`;
    if (drillTime <= 0) stopDrill();
  }, 1000);
}

function stopDrill(): void {
  drillActive = false;
  if (drillTimer) clearInterval(drillTimer);
  drillTimer = null;
  document.getElementById('drillStart')!.style.display = '';
  document.getElementById('drillStop')!.style.display = 'none';
  document.getElementById('drillProblem')!.innerHTML = `<b>Selesai!</b> Skor: ${drillScore}/${drillTotal}`;
  document.getElementById('drillChoices')!.style.display = 'none';
  if (!state.drillBest || drillScore > (state.drillBest as number)) {
    state.drillBest = drillScore;
    save();
    document.getElementById('drillBest')!.textContent = String(drillScore);
  }
}

function nextDrillProblem(): void {
  if (!drillActive) return;
  drillCurrent = genDrill();

  // Fix for rose petals (correct index based on actual answer)
  if (drillCurrent.correct === -1) {
    const n = parseInt(drillCurrent.question.match(/(\d+)/)?.[1] || '2');
    const ans = n % 2 === 0 ? 2 * n : n;
    drillCurrent.correct = drillCurrent.choices.indexOf(`${ans}`);
    if (drillCurrent.correct === -1) drillCurrent.correct = 0;
  }

  const prob = document.getElementById('drillProblem')!;
  prob.innerHTML = drillCurrent.question;
  typeset(prob);

  const choicesEl = document.getElementById('drillChoices')!;
  choicesEl.innerHTML = drillCurrent.choices.map((c, i) => `<button data-drill-idx="${i}">${c}</button>`).join('');
  typeset(choicesEl);

  choicesEl.querySelectorAll<HTMLButtonElement>('button').forEach(btn => {
    btn.onclick = () => {
      if (!drillActive || !drillCurrent) return;
      const idx = parseInt(btn.dataset.drillIdx!);
      drillTotal++;
      if (idx === drillCurrent.correct) {
        drillScore++;
        btn.classList.add('correct');
      } else {
        btn.classList.add('wrong');
        choicesEl.children[drillCurrent.correct]?.classList.add('correct');
      }
      updateDrillUI();
      setTimeout(nextDrillProblem, 600);
    };
  });
}

function updateDrillUI(): void {
  document.getElementById('drillScoreEl')!.textContent = String(drillScore);
  document.getElementById('drillTotalEl')!.textContent = String(drillTotal);
}
