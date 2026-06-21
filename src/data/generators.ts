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
  if (d === 1) return ('' + n);
  if (n === 0) return '0';
  return (n < 0 ? '-' : '') + '\\dfrac{' + Math.abs(n) + '}{' + d + '}';
}

function coef(n: number, d: number): string {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d); n /= g; d /= g;
  if (n === 0) return '0';
  if (d === 1) return n === 1 ? '' : n === -1 ? '-' : ('' + n);
  return (n < 0 ? '-' : '') + '\\dfrac{' + Math.abs(n) + '}{' + d + '}';
}

function frPi(n: number, d: number): string {
  if (n === 0) return '0';
  const c = coef(n, d);
  return (c === '' ? '' : c === '-' ? '-' : c) + '\\pi';
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
  // 1. Luas antar kurva Kuadratik & Linear (e.g. y = x^2+c1, y = c2-x)
  {
    key: 'luas', label: 'Luas Antar Kurva',
    fn() {
      const a = ri(1, 3);
      const b = ri(1, 3);
      const B = a - b;
      const c1 = ri(1, 5);
      const c2 = c1 + a * b; 
      const lineY = B === 0 ? `${c2}` : B === 1 ? `${c2}-x` : B === -1 ? `${c2}+x` : `${c2}${B>0?'-':'+'}${Math.abs(B)}x`;
      
      const top = -2*b*b*b - 3*B*b*b + 6*a*b*b - (-2*(-a)*(-a)*(-a) - 3*B*(-a)*(-a) + 6*a*b*(-a));
      
      return {
        topic: 'Luas Daerah',
        statement: `Gambarkan daerah yang dibatasi oleh $y = x^2 + ${c1}$ dan garis $y = ${lineY}$. Kemudian dapatkan luas daerah tersebut.`,
        steps: [
          `Cari titik potong kedua kurva: $x^2 + ${c1} = ${lineY}$.`,
          `$x^2 ${B===0?'':B===1?'+x':B===-1?'-x':(B>0?'+'+B+'x':B+'x')} - ${a*b} = 0 \\implies (x + ${a})(x - ${b}) = 0$. Titik potong di $x = -${a}$ dan $x = ${b}$.`,
          `Garis berada di atas parabola pada selang $[-${a}, ${b}]$.`,
          `$L = \\int_{-${a}}^{${b}} \\left( (${lineY}) - (x^2 + ${c1}) \\right) dx = \\int_{-${a}}^{${b}} \\left( -x^2 ${B===0?'':B===1?'-x':B===-1?'+x':(B>0?'-'+B+'x':'+'+Math.abs(B)+'x')} + ${a*b} \\right) dx$.`,
          `$L = \\left[ -\\dfrac{x^3}{3} ${B===0?'':B>0?`-\\dfrac{${B}x^2}{2}`:`+\\dfrac{${-B}x^2}{2}`} + ${a*b}x \\right]_{-${a}}^{${b}} = ${fr(top, 6)}$.`
        ],
        answer: `$L = ${fr(top, 6)}$`,
        prereq: [PRE['2-1']]
      };
    }
  },
  
  // 2. Volume Dalil Guldin (Torus)
  {
    key: 'guldin', label: 'Volume Dalil Guldin',
    fn() {
      const r = ri(1, 2);
      const h = ri(r+1, 5);
      const k = ri(r+1, 5);
      const C = h*h + k*k - r*r;
      const axis = pick(['x', 'y']);
      
      const dist = axis === 'x' ? k : h;
      const V = 2 * dist * r * r; 
      
      return {
        topic: 'Dalil Guldin (Volume Benda Putar)',
        statement: `Gunakan Dalil Guldin untuk mendapatkan volume benda padat yang diperoleh dengan memutar daerah di dalam lingkaran $x^2 - ${2*h}x + y^2 - ${2*k}y + ${C} = 0$ terhadap sumbu-${axis}.`,
        steps: [
          `Lengkapi kuadrat sempurna persamaan lingkaran: $(x^2 - ${2*h}x + ${h*h}) + (y^2 - ${2*k}y + ${k*k}) = ${h*h} + ${k*k} - ${C}$.`,
          `Didapat $(x - ${h})^2 + (y - ${k})^2 = ${r*r}$. Ini adalah lingkaran berjari-jari $r = ${r}$ dengan titik pusat $(\\bar{x}, \\bar{y}) = (${h}, ${k})$.`,
          `Luas daerah $A = \\pi r^2 = \\pi(${r})^2 = ${r*r}\\pi$.`,
          `Jarak pusat lintasan centroid terhadap sumbu-${axis} adalah $d = ${dist}$, sehingga panjang lintasan centroid $L = 2\\pi d = 2\\pi(${dist}) = ${2*dist}\\pi$.`,
          `Berdasarkan Dalil Guldin, $V = L \\cdot A = (${2*dist}\\pi)(${r*r}\\pi) = ${V}\\pi^2$.`
        ],
        answer: `$V = ${V}\\pi^2$`,
        prereq: []
      };
    }
  },

  // 3. Garis Singgung Parametrik
  {
    key: 'param_tangent', label: 'Garis Singgung Parametrik',
    fn() {
      const t1 = ri(1, 3);
      const t2 = t1 + ri(1, 2);
      const a = pick([1, 2]);
      const B = 3 * a * (t1 + t2);
      const finalA = (B % 2 !== 0) ? 2 : a;
      const finalB = 3 * finalA * (t1 + t2) / 2;
      const finalC = 3 * finalA * t1 * t2;
      
      const term3 = finalA === 1 ? `t^3` : `${finalA}t^3`;
      
      return {
        topic: 'Garis Singgung Parametrik',
        statement: `Dapatkan $\\frac{dx}{dt}$ dan $\\frac{dy}{dt}$ dari persamaan parametrik $x = ${term3} - ${finalB}t^2 + ${finalC}t + 5$ dan $y = t^2 + t + 1$. Kemudian carilah semua nilai $t$ di mana kurva memiliki garis singgung vertikal.`,
        steps: [
          `Turunkan $x$ dan $y$ terhadap $t$:`,
          `$\\frac{dx}{dt} = ${3*finalA}t^2 - ${2*finalB}t + ${finalC}$`,
          `$\\frac{dy}{dt} = 2t + 1$`,
          `Garis singgung vertikal terjadi ketika $\\frac{dx}{dt} = 0$ dan $\\frac{dy}{dt} \\neq 0$.`,
          `$${3*finalA}t^2 - ${2*finalB}t + ${finalC} = 0 \\implies ${3*finalA}(t - ${t1})(t - ${t2}) = 0$.`,
          `Maka nilai $t$ adalah $t = ${t1}$ atau $t = ${t2}$. (Pada titik ini $\\frac{dy}{dt} \\neq 0$).`
        ],
        answer: `$t = ${t1}$ atau $t = ${t2}$`,
        prereq: [PRE['1-1']]
      };
    }
  },

  // 4. Panjang Busur Parametrik (Sikloida)
  {
    key: 'param_arc', label: 'Panjang Busur Sikloida',
    fn() {
      const R = ri(1, 5);
      const Rx = R === 1 ? '' : R;
      return {
        topic: 'Panjang Busur Parametrik',
        statement: `Dapatkan $\\frac{dx}{dt}$ dan $\\frac{dy}{dt}$ dari persamaan parametrik $x = ${Rx}(t - \\sin t)$ dan $y = ${Rx}(1 - \\cos t)$ untuk $0 \\le t \\le 2\\pi$. Selanjutnya dapatkan panjang busurnya.`,
        steps: [
          `$\\frac{dx}{dt} = ${Rx}(1 - \\cos t)$ dan $\\frac{dy}{dt} = ${Rx}\\sin t$.`,
          `$ds = \\sqrt{\\left(\\frac{dx}{dt}\\right)^2 + \\left(\\frac{dy}{dt}\\right)^2} dt = \\sqrt{${R*R}(1 - 2\\cos t + \\cos^2 t + \\sin^2 t)} dt$.`,
          `Karena $\\cos^2 t + \\sin^2 t = 1$, maka $ds = \\sqrt{${R*R}(2 - 2\\cos t)} dt = \\sqrt{${2*R*R} \\cdot 2\\sin^2(\\frac{t}{2})} dt = ${2*R}\\sin(\\frac{t}{2}) dt$.`,
          `$L = \\int_{0}^{2\\pi} ${2*R}\\sin(\\frac{t}{2}) dt = ${2*R} \\left[ -2\\cos(\\frac{t}{2}) \\right]_{0}^{2\\pi}$.`,
          `$L = -${4*R} (\\cos(\\pi) - \\cos(0)) = -${4*R}(-1 - 1) = ${8*R}$.`
        ],
        answer: `$L = ${8*R}$`,
        prereq: [PRE['2-1']]
      };
    }
  },

  // 5. Luas Rose Koordinat Kutub
  {
    key: 'polar_rose', label: 'Luas Kurva Mawar (Kutub)',
    fn() {
      const a = ri(2, 6);
      const n = pick([2, 3, 4]); 
      const petals = (n % 2 !== 0) ? n : 2 * n;
      const A_one = (a * a) / (4 * n); 
      const A_tot = A_one * petals; 
      
      return {
        topic: 'Luas Kurva Polar',
        statement: `Gambarkan kurva dari rose $r = ${a}\\sin(${n}\\theta)$, dan kemudian dapatkan total luas daerah di dalam seluruh daun kurva tersebut.`,
        steps: [
          `Kurva $r = ${a}\\sin(${n}\\theta)$ memiliki ${petals} daun kelopak.`,
          `Luas satu daun dapat dihitung pada selang $\\theta$ dari $0$ hingga $\\frac{\\pi}{${n}}$:`,
          `$A_1 = \\frac{1}{2} \\int_{0}^{\\pi/${n}} (${a}\\sin(${n}\\theta))^2 d\\theta = \\frac{${a*a}}{2} \\int_{0}^{\\pi/${n}} \\sin^2(${n}\\theta) d\\theta$.`,
          `Gunakan identitas $\\sin^2 u = \\frac{1 - \\cos(2u)}{2}$: $A_1 = \\frac{${a*a}}{4} \\left[ \\theta - \\frac{\\sin(2\\cdot ${n}\\theta)}{2\\cdot ${n}} \\right]_{0}^{\\pi/${n}} = \\frac{${a*a}\\pi}{${4*n}}$.`,
          `Total luas untuk ${petals} daun adalah $A = ${petals} \\times \\frac{${a*a}\\pi}{${4*n}} = ${frPi(A_tot * 4 * n, 4 * n)}$.`
        ],
        answer: `$A = ${frPi(A_tot * 4 * n, 4 * n)}$`,
        prereq: [PRE['2-1']]
      };
    }
  },

  // 6. Luas Irisan Dua Lingkaran Polar
  {
    key: 'polar_intersect', label: 'Luas Irisan Polar',
    fn() {
      const a = pick([2, 4, 6]);
      return {
        topic: 'Irisan Kurva Polar',
        statement: `Gambarkan daerah di dalam lingkaran $r = ${a}\\cos\\theta$ dan $r = ${a}\\sin\\theta$, dan kemudian dapatkan luas irisan daerah tersebut.`,
        steps: [
          `Kedua lingkaran berpotongan ketika ${a}\\cos\\theta = ${a}\\sin\\theta \\implies \\tan\\theta = 1 \\implies \\theta = \\frac{\\pi}{4}$.`,
          `Karena simetri terhadap garis $\\theta = \\frac{\\pi}{4}$, luas daerah irisan adalah 2 kali luas daerah dari $\\theta=0$ ke $\\theta=\\frac{\\pi}{4}$ untuk kurva $r = ${a}\\sin\\theta$.`,
          `$A = 2 \\times \\frac{1}{2} \\int_{0}^{\\pi/4} (${a}\\sin\\theta)^2 d\\theta = ${a*a} \\int_{0}^{\\pi/4} \\frac{1 - \\cos(2\\theta)}{2} d\\theta$.`,
          `$A = \\frac{${a*a}}{2} \\left[ \\theta - \\frac{\\sin(2\\theta)}{2} \\right]_{0}^{\\pi/4} = \\frac{${a*a}}{2} (\\frac{\\pi}{4} - \\frac{1}{2}) = ${frPi(a*a, 8)} - ${fr(a*a, 4)}$.`
        ],
        answer: `$A = ${frPi(a*a, 8)} - ${a*a/4}$`,
        prereq: [PRE['2-1']]
      };
    }
  },

  // 7. Kemonotonan Barisan
  {
    key: 'seq_monotone', label: 'Kemonotonan Barisan',
    fn() {
      const K = ri(4, 8);
      const B = ri(4, K*K - 5);
      const C = K*K - 1 - B;
      
      return {
        topic: 'Barisan',
        statement: `Diketahui barisan $\\left\\{ \\frac{n^2 - ${B}n + ${C}}{n + 1} \\right\\}_{n=1}^{\\infty}$. Carilah bilangan bulat $N$ sedemikian sehingga barisan tersebut adalah monoton naik untuk $n \\ge N$.`,
        steps: [
          `Pandang fungsi kontinu $f(x) = \\frac{x^2 - ${B}x + ${C}}{x + 1}$. Kita cari kapan $f'(x) \\ge 0$.`,
          `Gunakan aturan hasil bagi: $f'(x) = \\frac{(2x - ${B})(x + 1) - (x^2 - ${B}x + ${C}) \\cdot 1}{(x + 1)^2}$.`,
          `$f'(x) = \\frac{2x^2 + 2x - ${B}x - ${B} - x^2 + ${B}x - ${C}}{(x + 1)^2} = \\frac{x^2 + 2x - ${B+C}}{(x + 1)^2}$.`,
          `Syarat monoton naik adalah $f'(x) \\ge 0 \\implies x^2 + 2x - ${B+C} \\ge 0$.`,
          `Faktorkan pembilang: $(x + ${K+1})(x - ${K-1}) \\ge 0$. Karena $x > 0$, maka $x \\ge ${K-1}$.`,
          `Jadi barisan monoton naik mulai suku ke-$N$ dengan $N = ${K-1}$.`
        ],
        answer: `$N = ${K-1}$`,
        prereq: [PRE['1-1']]
      };
    }
  },

  // 8. Limit Barisan Aljabar
  {
    key: 'seq_limit', label: 'Konvergensi Barisan',
    fn() {
      const b = ri(2, 8);
      return {
        topic: 'Limit Barisan',
        statement: `Diketahui barisan $\\left\\{ \\sqrt{n^2 + ${b}n} - n \\right\\}_{n=1}^{\\infty}$. Jelaskan apakah barisan tersebut konvergen atau divergen, dan jika konvergen tentukan nilai limitnya.`,
        steps: [
          `Gunakan perkalian akar sekawan: $\\lim_{n \\to \\infty} (\\sqrt{n^2 + ${b}n} - n) \\cdot \\frac{\\sqrt{n^2 + ${b}n} + n}{\\sqrt{n^2 + ${b}n} + n}$.`,
          `$= \\lim_{n \\to \\infty} \\frac{(n^2 + ${b}n) - n^2}{\\sqrt{n^2 + ${b}n} + n} = \\lim_{n \\to \\infty} \\frac{${b}n}{\\sqrt{n^2 + ${b}n} + n}$.`,
          `Bagi pembilang dan penyebut dengan $n$ (yaitu masuk ke akar sebagai $n^2$):`,
          `$= \\lim_{n \\to \\infty} \\frac{${b}}{\\sqrt{1 + \\frac{${b}}{n}} + 1} = \\frac{${b}}{\\sqrt{1 + 0} + 1} = \\frac{${b}}{2} = ${fr(b, 2)}$.`,
          `Karena limit ada dan terhingga, barisan konvergen ke $${fr(b, 2)}$.`
        ],
        answer: `Konvergen ke $${fr(b, 2)}$`,
        prereq: [PRE['3-2']]
      };
    }
  }
];

export const TOPIC_KEYS: [string, string][] = [
  ['luas', 'luas'], ['area', 'luas'], ['guldin', 'guldin'], ['volume', 'guldin'], 
  ['parametrik', 'param_tangent'], ['garis singgung', 'param_tangent'], 
  ['panjang busur', 'param_arc'], ['sikloida', 'param_arc'],
  ['kutub', 'polar_rose'], ['mawar', 'polar_rose'], ['rose', 'polar_rose'],
  ['irisan', 'polar_intersect'], ['lingkaran', 'polar_intersect'],
  ['barisan', 'seq_monotone'], ['monoton', 'seq_monotone'], 
  ['konvergen', 'seq_limit'], ['limit', 'seq_limit']
];
