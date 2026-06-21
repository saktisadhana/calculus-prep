// Problem generators for the Soal Solver
import { PRE, type PrereqRef } from './prerequisites.ts';

// === Utility functions ===
function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { const t = a % b; a = b; b = t; }
  return a || 1;
}

function fr(n: number, d: number): string {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d); n /= g; d /= g;
  return d === 1 ? ('' + n) : ('\\tfrac{' + n + '}{' + d + '}');
}

function coef(n: number, d: number): string {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d); n /= g; d /= g;
  if (d === 1) return n === 1 ? '' : ('' + n);
  return '\\tfrac{' + n + '}{' + d + '}';
}

function frPi(n: number, d: number): string {
  const c = coef(n, d);
  return (c === '' ? '' : c) + '\\pi';
}

function ri(a: number, b: number): number {
  return a + Math.floor(Math.random() * (b - a + 1));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// === Generated problem type ===
export interface GeneratedProblem {
  topic: string;
  statement: string;
  steps: string[];
  answer: string;
  prereq: PrereqRef[];
}

export interface Generator {
  key: string;
  label: string;
  fn: () => GeneratedProblem;
}

// === Generators ===
export const GENS: Generator[] = [
  {
    key: 'luas', label: 'Luas antar kurva (4.1)',
    fn() {
      const m = ri(2, 6);
      return {
        topic: 'Luas antar kurva — 4.1',
        statement: `Hitung luas daerah yang dibatasi $y=${m}x$ dan $y=x^2$.`,
        steps: [
          `Cari titik potong: $${m}x=x^2\\Rightarrow x(x-${m})=0$, jadi $x=0$ dan $x=${m}$.`,
          `Pada $[0,${m}]$ garis $${m}x$ berada di atas $x^2$, sehingga $A=\\int_0^{${m}}(${m}x-x^2)\\,dx$.`,
          `Antiturunan $\\dfrac{${m}x^2}{2}-\\dfrac{x^3}{3}$; substitusi $x=${m}$ (batas bawah 0 bernilai 0).`,
          `$A=\\dfrac{${m}\\cdot${m}^2}{2}-\\dfrac{${m}^3}{3}=${fr(m * m * m, 2)}-${fr(m * m * m, 3)}=${fr(m * m * m, 6)}$.`,
        ],
        answer: `$A=${fr(m * m * m, 6)}$ satuan luas.`,
        prereq: [],
      };
    },
  },
  {
    key: 'disk', label: 'Volume cakram (4.2)',
    fn() {
      const k = ri(1, 4), b = ri(2, 4);
      const fx = k === 1 ? '\\sqrt{x}' : `\\sqrt{${k}x}`;
      const kx = k === 1 ? 'x' : `${k}x`;
      return {
        topic: 'Volume cakram — 4.2',
        statement: `Daerah di bawah $y=${fx}$, $0\\le x\\le ${b}$, diputar terhadap sumbu-x. Cari volumenya.`,
        steps: [
          `Metode cakram: $V=\\pi\\int_0^{${b}}[R(x)]^2\\,dx$ dengan $R(x)=${fx}$.`,
          `$[R(x)]^2=${kx}$, sehingga $V=\\pi\\int_0^{${b}}${kx}\\,dx$.`,
          `$V=\\pi\\left[\\dfrac{${k === 1 ? '' : k}x^2}{2}\\right]_0^{${b}}=\\pi\\cdot\\dfrac{${k === 1 ? '' : k + '\\cdot'}${b}^2}{2}=${frPi(k * b * b, 2)}$.`,
        ],
        answer: `$V=${frPi(k * b * b, 2)}$.`,
        prereq: [],
      };
    },
  },
  {
    key: 'shell', label: 'Volume kulit tabung (4.2)',
    fn() {
      const b = ri(2, 4);
      return {
        topic: 'Volume kulit tabung — 4.2',
        statement: `Daerah di bawah $y=x^2$, $0\\le x\\le ${b}$, diputar terhadap sumbu-y. Gunakan metode kulit.`,
        steps: [
          `Kulit: $V=2\\pi\\int_0^{${b}}x\\cdot f(x)\\,dx=2\\pi\\int_0^{${b}}x\\cdot x^2\\,dx$.`,
          `$=2\\pi\\int_0^{${b}}x^3\\,dx=2\\pi\\left[\\dfrac{x^4}{4}\\right]_0^{${b}}$.`,
          `$=2\\pi\\cdot\\dfrac{${b}^4}{4}=${frPi(2 * Math.pow(b, 4), 4)}$.`,
        ],
        answer: `$V=${frPi(2 * Math.pow(b, 4), 4)}$.`,
        prereq: [],
      };
    },
  },
  {
    key: 'arc', label: 'Panjang kurva (4.3)',
    fn() {
      const s = pick([2, 3, 4, 5]);
      const b = s * s - 1;
      return {
        topic: 'Panjang kurva — 4.3',
        statement: `Hitung panjang kurva $y=\\tfrac23 x^{3/2}$ dari $x=0$ sampai $x=${b}$.`,
        steps: [
          `$y'=x^{1/2}$, maka $1+(y')^2=1+x$.`,
          `$L=\\int_0^{${b}}\\sqrt{1+x}\\,dx=\\left[\\tfrac23(1+x)^{3/2}\\right]_0^{${b}}$.`,
          `$1+${b}=${s * s}$ dan $${s * s}^{3/2}=${s}^3=${s * s * s}$, jadi $L=\\tfrac23(${s * s * s}-1)=${fr(2 * (s * s * s - 1), 3)}$.`,
        ],
        answer: `$L=${fr(2 * (s * s * s - 1), 3)}$.`,
        prereq: [PRE['2-3']],
      };
    },
  },
  {
    key: 'geo', label: 'Deret geometri (6.2)',
    fn() {
      const a = ri(2, 6), k = pick([2, 3, 4, 5]);
      return {
        topic: 'Deret geometri — 6.2',
        statement: `Hitung jumlah deret geometri $\\sum_{n=0}^\\infty ${a}\\left(\\tfrac{1}{${k}}\\right)^n$.`,
        steps: [
          `Suku awal $a=${a}$, rasio $r=\\tfrac1{${k}}$. Karena $|r|<1$, deret konvergen.`,
          `$S=\\dfrac{a}{1-r}=\\dfrac{${a}}{1-\\tfrac1{${k}}}=\\dfrac{${a}}{\\tfrac{${k - 1}}{${k}}}$.`,
          `$S=${a}\\cdot\\dfrac{${k}}{${k - 1}}=${fr(a * k, k - 1)}$.`,
        ],
        answer: `$S=${fr(a * k, k - 1)}$.`,
        prereq: [],
      };
    },
  },
  {
    key: 'pseries', label: 'Uji deret-p (6.3)',
    fn() {
      const o = pick<[string, boolean]>([
        ['\\tfrac12', false], ['\\tfrac23', false], ['1', false],
        ['\\tfrac32', true], ['2', true], ['3', true],
      ]);
      const c = o[1];
      return {
        topic: 'Uji deret-p — 6.3',
        statement: `Tentukan apakah deret $\\sum_{n=1}^\\infty \\dfrac{1}{n^{${o[0]}}}$ konvergen atau divergen.`,
        steps: [
          `Bentuk deret-p dengan $p=${o[0]}$.`,
          `Aturan: deret-p konvergen jika $p>1$ dan divergen jika $p\\le 1$.`,
          `Karena $p=${o[0]}${c ? '>1' : '\\le 1'}$, deret <b>${c ? 'konvergen' : 'divergen'}</b>.`,
        ],
        answer: `Deret <b>${c ? 'konvergen' : 'divergen'}</b> (deret-p, $p=${o[0]}$).`,
        prereq: [PRE['3-2']],
      };
    },
  },
  {
    key: 'ratio', label: 'Uji rasio (6.3)',
    fn() {
      const k = pick([2, 3, 5]);
      return {
        topic: 'Uji rasio — 6.3',
        statement: `Selidiki konvergensi $\\sum_{n=0}^\\infty \\dfrac{${k}^n}{n!}$ memakai uji rasio.`,
        steps: [
          `$\\left|\\dfrac{a_{n+1}}{a_n}\\right|=\\dfrac{${k}^{\\,n+1}/(n+1)!}{${k}^{\\,n}/n!}=\\dfrac{${k}}{n+1}$.`,
          `$L=\\lim_{n\\to\\infty}\\dfrac{${k}}{n+1}=0$.`,
          `Karena $L=0<1$, menurut uji rasio deret <b>konvergen mutlak</b>.`,
        ],
        answer: `<b>Konvergen mutlak</b> (rasio $\\to 0$).`,
        prereq: [],
      };
    },
  },
  {
    key: 'polar', label: 'Luas satu daun mawar (5.4)',
    fn() {
      const n = ri(2, 4);
      return {
        topic: 'Luas satu daun mawar — 5.4',
        statement: `Cari luas satu daun mawar $r=\\cos(${n}\\theta)$.`,
        steps: [
          `Satu daun terbentuk saat $\\cos(${n}\\theta)\\ge0$, yaitu $\\theta\\in[-\\tfrac{\\pi}{${2 * n}},\\tfrac{\\pi}{${2 * n}}]$.`,
          `$A=\\tfrac12\\int_{-\\pi/${2 * n}}^{\\pi/${2 * n}}\\cos^2(${n}\\theta)\\,d\\theta=\\tfrac14\\int_{-\\pi/${2 * n}}^{\\pi/${2 * n}}\\big(1+\\cos(${2 * n}\\theta)\\big)\\,d\\theta$.`,
          `$=\\tfrac14\\left[\\theta+\\dfrac{\\sin(${2 * n}\\theta)}{${2 * n}}\\right]_{-\\pi/${2 * n}}^{\\pi/${2 * n}}=\\tfrac14\\cdot\\dfrac{\\pi}{${n}}=\\dfrac{\\pi}{${4 * n}}$.`,
        ],
        answer: `$A=\\dfrac{\\pi}{${4 * n}}$.`,
        prereq: [PRE['2-1']],
      };
    },
  },
  {
    key: 'tele', label: 'Deret teleskopik (6.2)',
    fn() {
      const k = pick([1, 2]);
      const ans = k === 1 ? '1' : '\\tfrac34';
      const steps = k === 1 ? [
        `Pecahan parsial: $\\dfrac{1}{n(n+1)}=\\dfrac1n-\\dfrac1{n+1}$.`,
        `$S_N=\\left(1-\\tfrac12\\right)+\\left(\\tfrac12-\\tfrac13\\right)+\\cdots+\\left(\\tfrac1N-\\tfrac1{N+1}\\right)=1-\\tfrac1{N+1}$.`,
        `$\\lim_{N\\to\\infty}S_N=1$.`,
      ] : [
        `Pecahan parsial: $\\dfrac{1}{n(n+2)}=\\tfrac12\\left(\\dfrac1n-\\dfrac1{n+2}\\right)$.`,
        `Teleskop menyisakan $S_N=\\tfrac12\\left(1+\\tfrac12-\\tfrac1{N+1}-\\tfrac1{N+2}\\right)$.`,
        `$\\lim_{N\\to\\infty}S_N=\\tfrac12\\left(1+\\tfrac12\\right)=\\tfrac34$.`,
      ];
      return {
        topic: 'Deret teleskopik — 6.2',
        statement: `Hitung jumlah deret teleskopik $\\sum_{n=1}^\\infty \\dfrac{1}{n(n+${k})}$.`,
        steps,
        answer: `$S=${ans}$.`,
        prereq: [],
      };
    },
  },
  {
    key: 'macl', label: 'Deret Maclaurin (6.4)',
    fn() {
      const c = pick([1, 2, 3]);
      const cc = c === 1 ? '' : ('' + c);
      const cn = c === 1 ? '' : (c + '^n\\,');
      return {
        topic: 'Deret Maclaurin — 6.4',
        statement: `Cari deret Maclaurin untuk $f(x)=\\dfrac{1}{1+${cc}x^2}$.`,
        steps: [
          `Pakai deret dasar $\\dfrac{1}{1-u}=\\sum_{n=0}^\\infty u^n$ dengan $u=-${cc}x^2$.`,
          `$f(x)=\\sum_{n=0}^\\infty(-${cc}x^2)^n=\\sum_{n=0}^\\infty(-1)^n ${cn}x^{2n}$.`,
          `Konvergen untuk $|-${cc}x^2|<1$, yaitu $|x|<\\dfrac{1}{\\sqrt{${c}}}$.`,
        ],
        answer: `$f(x)=\\sum_{n=0}^\\infty(-1)^n ${cn}x^{2n}$, untuk $|x|<\\tfrac{1}{\\sqrt{${c}}}$.`,
        prereq: [PRE['1-1']],
      };
    },
  },
  {
    key: 'pappus', label: 'Teorema Pappus (4.5)',
    fn() {
      const r = ri(1, 3), d = ri(3, 6);
      return {
        topic: 'Teorema Pappus — 4.5',
        statement: `Lingkaran berjari-jari $${r}$ berpusat di $(${d},0)$ diputar terhadap sumbu-y. Cari volume torus.`,
        steps: [
          `Luas lingkaran: $A=\\pi(${r})^2=${r * r}\\pi$.`,
          `Jarak centroid ke sumbu putar: $\\bar d=${d}$.`,
          `Pappus: $V=2\\pi\\bar d\\cdot A=2\\pi(${d})(${r * r}\\pi)=${2 * d * r * r}\\pi^2$.`,
        ],
        answer: `$V=${2 * d * r * r}\\pi^2$.`,
        prereq: [],
      };
    },
  },
];

// Topic keyword mapping for command input
export const TOPIC_KEYS: [string, string][] = [
  ['luas', 'luas'], ['area', 'luas'], ['cakram', 'disk'], ['cincin', 'disk'],
  ['volume', 'disk'], ['kulit', 'shell'], ['shell', 'shell'], ['panjang', 'arc'],
  ['arc', 'arc'], ['geometri', 'geo'], ['deret', 'geo'], ['rasio', 'ratio'],
  ['ratio', 'ratio'], ['konvergen', 'pseries'], ['kutub', 'polar'], ['mawar', 'polar'],
  ['polar', 'polar'], ['teleskop', 'tele'], ['taylor', 'macl'], ['maclaurin', 'macl'],
  ['pappus', 'pappus'], ['torus', 'pappus'],
];
