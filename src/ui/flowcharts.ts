// Interactive decision-tree flowcharts
import { typeset } from './typeset.ts';

interface FlowNode {
  question: string;
  options: { label: string; next: string }[];
}

interface FlowAnswer {
  text: string;
}

type FlowChart = Record<string, FlowNode | FlowAnswer>;

function isAnswer(node: FlowNode | FlowAnswer): node is FlowAnswer {
  return 'text' in node;
}

// Volume method flowchart
const volumeChart: FlowChart = {
  start: {
    question: 'Daerah diputar terhadap sumbu apa?',
    options: [
      { label: 'Sumbu-x (atau garis horizontal)', next: 'q_xaxis' },
      { label: 'Sumbu-y (atau garis vertikal)', next: 'q_yaxis' },
    ],
  },
  q_xaxis: {
    question: 'Daerah menempel langsung pada sumbu putar (tanpa lubang)?',
    options: [
      { label: 'Ya, menempel (tanpa lubang)', next: 'a_disk' },
      { label: 'Tidak, ada jarak/lubang', next: 'a_washer' },
    ],
  },
  q_yaxis: {
    question: 'Fungsi dinyatakan dalam $x$ (misal $y=f(x)$)?',
    options: [
      { label: 'Ya, $y=f(x)$', next: 'q_shell_or_inverse' },
      { label: 'Sudah dalam $x=g(y)$', next: 'q_yvar' },
    ],
  },
  q_shell_or_inverse: {
    question: 'Lebih mudah mengubah ke $x=g(y)$, atau tetap dalam $x$?',
    options: [
      { label: 'Tetap dalam $x$ (kulit tabung)', next: 'a_shell' },
      { label: 'Ubah ke $x=g(y)$ (cakram/cincin di $y$)', next: 'q_yvar' },
    ],
  },
  q_yvar: {
    question: 'Ada lubang/jarak ke sumbu putar?',
    options: [
      { label: 'Tidak ada lubang', next: 'a_disk_y' },
      { label: 'Ada lubang', next: 'a_washer_y' },
    ],
  },
  a_disk: { text: '<b>Metode Cakram</b> (variabel $x$): $V=\\pi\\int_a^b [R(x)]^2\\,dx$. Jari-jari $R$ = jarak kurva ke sumbu putar.' },
  a_washer: { text: '<b>Metode Cincin</b> (variabel $x$): $V=\\pi\\int_a^b ([R_{luar}]^2-[R_{dalam}]^2)\\,dx$.' },
  a_shell: { text: '<b>Metode Kulit Tabung</b>: $V=2\\pi\\int_a^b x\\,f(x)\\,dx$. Jari-jari = $x$, tinggi = $f(x)$.' },
  a_disk_y: { text: '<b>Metode Cakram</b> (variabel $y$): $V=\\pi\\int_c^d [g(y)]^2\\,dy$.' },
  a_washer_y: { text: '<b>Metode Cincin</b> (variabel $y$): $V=\\pi\\int_c^d ([R_{luar}]^2-[R_{dalam}]^2)\\,dy$.' },
};

// Convergence test flowchart
const convergenceChart: FlowChart = {
  start: {
    question: 'Langkah 1: Hitung $\\lim_{n\\to\\infty} a_n$. Apakah $\\ne 0$?',
    options: [
      { label: '$\\lim a_n \\ne 0$ → DIVERGEN', next: 'a_divn' },
      { label: '$\\lim a_n = 0$ → lanjut', next: 'q_form' },
    ],
  },
  q_form: {
    question: 'Apa bentuk $a_n$?',
    options: [
      { label: '$ar^n$ (geometri)', next: 'a_geo' },
      { label: '$1/n^p$ (deret-p)', next: 'a_pseries' },
      { label: 'Ada faktorial $n!$ atau $r^n$', next: 'a_ratio' },
      { label: 'Ada pangkat $n$: $(\\cdots)^n$', next: 'a_root' },
      { label: '$(-1)^n b_n$ (ganti tanda)', next: 'a_leibniz' },
      { label: 'Mirip deret-p/geometri', next: 'a_compare' },
      { label: '$f(n)$ positif, turun, kontinu', next: 'a_integral' },
    ],
  },
  a_divn: { text: '<b>Divergen</b> oleh Uji Suku ke-n. Jika $\\lim a_n \\ne 0$, deret pasti divergen.' },
  a_geo: { text: '<b>Deret Geometri</b>: $\\sum ar^n$ konvergen jika $|r|<1$, jumlah $= a/(1-r)$. Divergen jika $|r|\\ge1$.' },
  a_pseries: { text: '<b>Deret-p</b>: $\\sum 1/n^p$ konvergen jika $p>1$, divergen jika $p\\le1$.' },
  a_ratio: { text: '<b>Uji Rasio</b>: $L=\\lim|a_{n+1}/a_n|$. Jika $L<1$: konvergen mutlak. $L>1$: divergen. $L=1$: tak tentu, coba uji lain.' },
  a_root: { text: '<b>Uji Akar</b>: $L=\\lim\\sqrt[n]{|a_n|}$. Jika $L<1$: konvergen. $L>1$: divergen. $L=1$: tak tentu.' },
  a_leibniz: { text: '<b>Uji Leibniz</b> (Deret Ganti-tanda): Jika $b_n$ turun monoton dan $\\lim b_n=0$, maka konvergen. Cek juga konvergen mutlak vs bersyarat!' },
  a_compare: { text: '<b>Uji Banding / Banding Limit</b>: Bandingkan dengan deret acuan ($1/n^p$ atau geometri). Limit perbandingan: $L=\\lim(a_n/b_n)$. Jika $0<L<\\infty$, keduanya sependapat.' },
  a_integral: { text: '<b>Uji Integral</b>: $\\sum f(n)$ dan $\\int_1^\\infty f(x)\\,dx$ sependapat (keduanya konvergen atau divergen).' },
};

function renderFlowchart(chart: FlowChart, containerId: string): void {
  const container = document.getElementById(containerId)!;
  if (!container) return;

  let currentNode = 'start';

  function render() {
    const node = chart[currentNode];
    if (!node) return;

    let html = '<div class="flowchart">';

    if (isAnswer(node)) {
      html += `<div class="fc-node answer">${node.text}</div>`;
      html += `<div style="text-align:center;margin-top:14px"><button class="btn ghost sm" data-fc-reset>Ulangi dari awal</button></div>`;
    } else {
      html += `<div class="fc-node active">${node.question}</div>`;
      html += `<div class="fc-arrow">↓</div>`;
      html += `<div class="fc-options">`;
      node.options.forEach(opt => {
        html += `<button class="fc-opt" data-fc-next="${opt.next}">${opt.label}</button>`;
      });
      html += `</div>`;
    }

    html += '</div>';
    container.innerHTML = html;
    typeset(container);

    // Bind clicks
    container.querySelectorAll<HTMLButtonElement>('[data-fc-next]').forEach(btn => {
      btn.onclick = () => {
        currentNode = btn.dataset.fcNext!;
        render();
      };
    });
    container.querySelectorAll<HTMLButtonElement>('[data-fc-reset]').forEach(btn => {
      btn.onclick = () => {
        currentNode = 'start';
        render();
      };
    });
  }

  render();
}

export function setupFlowcharts(): void {
  renderFlowchart(volumeChart, 'fc-volume');
  renderFlowchart(convergenceChart, 'fc-convergence');
}
