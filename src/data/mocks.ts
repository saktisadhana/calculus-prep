// 3 Mock exams — each 10 questions, covering Bab 4–6
export interface MockQuestion {
  no: string;
  bab: string;
  question: string;
  key: string;
}

export const mocks: MockQuestion[][] = [
  // ========== MOCK 1 ==========
  [
    { no: '1', bab: 'BAB 4', question: 'Luas daerah antara $y=4-x^2$ dan sumbu-x.', key: 'Akar: $x=\\pm2$. $A=\\int_{-2}^2(4-x^2)dx=[4x-\\tfrac{x^3}3]_{-2}^2=2(8-\\tfrac83)=\\tfrac{32}{3}$.' },
    { no: '2', bab: 'BAB 4', question: 'Volume benda putar daerah $y=\\sqrt x$, $0\\le x\\le4$ terhadap sumbu-x.', key: '$V=\\pi\\int_0^4 x\\,dx=8\\pi$.' },
    { no: '3', bab: 'BAB 4', question: 'Panjang kurva $y=\\tfrac23 x^{3/2}$, $0\\le x\\le3$.', key: '$1+y\'^2=1+x$, $L=\\int_0^3\\sqrt{1+x}dx=\\tfrac23(8-1)=\\tfrac{14}{3}$.' },
    { no: '4', bab: 'BAB 4', question: '$\\bar x$ centroid daerah di bawah $y=x^2$, $0\\le x\\le1$.', key: '$A=\\tfrac13$, $\\bar x=3\\int_0^1 x^3dx=\\tfrac34$.' },
    { no: '5', bab: 'BAB 5', question: '$\\dfrac{dy}{dx}$ untuk $x=t^2,\\ y=t^3$ di $t=1$.', key: '$\\frac{dy}{dx}=\\frac{3t}{2}=\\frac32$ di $t=1$.' },
    { no: '6', bab: 'BAB 5', question: 'Ubah $(2,\\tfrac\\pi3)$ kutub ke Cartesius.', key: '$(1,\\sqrt3)$.' },
    { no: '7', bab: 'BAB 5', question: 'Luas satu daun mawar $r=\\cos2\\theta$.', key: '$A=\\tfrac\\pi8$.' },
    { no: '8', bab: 'BAB 6', question: 'Jumlah $\\sum_{n=0}^\\infty 3(\\tfrac12)^n$.', key: '$=\\frac{3}{1-1/2}=6$.' },
    { no: '9', bab: 'BAB 6', question: 'Selidiki konvergensi $\\sum\\dfrac{2^n}{n!}$.', key: 'Uji rasio $\\to0<1$ maka konvergen mutlak.' },
    { no: '10', bab: 'BAB 6', question: 'Radius konvergensi $\\sum\\dfrac{x^n}{n\\,3^n}$.', key: '$R=3$.' },
  ],

  // ========== MOCK 2 ==========
  [
    { no: '1', bab: 'BAB 4', question: 'Luas daerah antara $y=x^2$ dan $y=2x+3$.',
      key: 'Potong: $x^2=2x+3 \\Rightarrow x^2-2x-3=0 \\Rightarrow (x-3)(x+1)=0$, $x=-1,3$. $A=\\int_{-1}^3(2x+3-x^2)dx=[x^2+3x-\\tfrac{x^3}{3}]_{-1}^3=(9+9-9)-(-1+(-3)+\\tfrac13)=\\tfrac{32}{3}$.' },
    { no: '2', bab: 'BAB 4', question: 'Volume kulit tabung: $y=x-x^2$, $0\\le x\\le1$ diputar terhadap sumbu-y.',
      key: '$V=2\\pi\\int_0^1 x(x-x^2)dx=2\\pi\\int_0^1(x^2-x^3)dx=2\\pi(\\tfrac13-\\tfrac14)=\\tfrac{\\pi}{6}$.' },
    { no: '3', bab: 'BAB 4', question: 'Luas permukaan benda putar $y=x^2$, $0\\le x\\le1$ terhadap sumbu-y (susun integral).',
      key: 'Putar terhadap sumbu-y: $S=2\\pi\\int_0^1 x\\sqrt{1+4x^2}dx$. Substitusi $u=1+4x^2$: $S=\\tfrac{\\pi}{4}\\int_1^5\\sqrt{u}\\,du=\\tfrac{\\pi}{6}(5\\sqrt5-1)$.' },
    { no: '4', bab: 'BAB 4', question: 'Teorema Pappus: volume cincin saat lingkaran $x^2+(y-3)^2=4$ diputar terhadap sumbu-x.',
      key: 'Centroid di $(0,3)$, $\\bar d=3$, $A=4\\pi$. $V=2\\pi(3)(4\\pi)=24\\pi^2$.' },
    { no: '5', bab: 'BAB 5', question: 'Panjang kurva parametrik $x=3\\cos t,\\ y=3\\sin t$ untuk $t\\in[0,2\\pi]$.',
      key: '$\\sqrt{9\\sin^2t+9\\cos^2t}=3$. $L=\\int_0^{2\\pi}3\\,dt=6\\pi$ (keliling lingkaran jari-jari 3).' },
    { no: '6', bab: 'BAB 5', question: 'Ubah $r=2\\cos\\theta$ ke Cartesius dan identifikasi kurvanya.',
      key: '$r=2\\cos\\theta \\Rightarrow r^2=2r\\cos\\theta \\Rightarrow x^2+y^2=2x \\Rightarrow (x-1)^2+y^2=1$. Lingkaran pusat $(1,0)$, jari-jari 1.' },
    { no: '7', bab: 'BAB 5', question: 'Luas total kardioid $r=1+\\sin\\theta$.',
      key: '$A=\\tfrac12\\int_0^{2\\pi}(1+\\sin\\theta)^2d\\theta=\\tfrac12(2\\pi+0+\\pi)=\\tfrac{3\\pi}{2}$.' },
    { no: '8', bab: 'BAB 6', question: 'Jumlah $\\sum_{n=1}^\\infty\\dfrac{1}{n(n+1)}$.',
      key: 'Teleskopik: $\\sum(\\tfrac1n-\\tfrac{1}{n+1})=1$.' },
    { no: '9', bab: 'BAB 6', question: 'Konvergen/divergen: $\\sum \\dfrac{(-1)^n}{\\sqrt{n}}$. Mutlak atau bersyarat?',
      key: 'Leibniz: $b_n=1/\\sqrt{n}$ turun $\\to0$, konvergen. Tapi $\\sum 1/\\sqrt{n}$ (deret-p $p=1/2$) divergen. Konvergen bersyarat.' },
    { no: '10', bab: 'BAB 6', question: 'Interval konvergensi $\\sum_{n=1}^\\infty \\dfrac{(x-2)^n}{n\\cdot5^n}$.',
      key: 'Rasio $\\to\\tfrac{|x-2|}{5}$, $R=5$. Interval: $-3\\le x\\le7$? Cek $x=7$: $\\sum 1/n$ div. $x=-3$: $\\sum(-1)^n/n$ konv. Interval $[-3,7)$.' },
  ],

  // ========== MOCK 3 ==========
  [
    { no: '1', bab: 'BAB 4', question: 'Luas daerah yang dibatasi $y=\\sin x$ dan sumbu-x dari $x=0$ ke $x=\\pi$.',
      key: '$A=\\int_0^\\pi\\sin x\\,dx=[-\\cos x]_0^\\pi=1+1=2$.' },
    { no: '2', bab: 'BAB 4', question: 'Volume: $y=1/x$, $1\\le x\\le3$, diputar terhadap sumbu-x.',
      key: '$V=\\pi\\int_1^3 x^{-2}dx=\\pi[-1/x]_1^3=\\pi(1-\\tfrac13)=\\tfrac{2\\pi}{3}$.' },
    { no: '3', bab: 'BAB 4', question: 'Panjang kurva $y=\\ln(\\cos x)$ dari $x=0$ ke $x=\\pi/4$.',
      key: '$y\'=-\\tan x$, $1+y\'^2=\\sec^2 x$. $L=\\int_0^{\\pi/4}\\sec x\\,dx=[\\ln|\\sec x+\\tan x|]_0^{\\pi/4}=\\ln(\\sqrt2+1)$.' },
    { no: '4', bab: 'BAB 4', question: 'Centroid: $\\bar y$ daerah di bawah $y=\\sin x$, $0\\le x\\le\\pi$.',
      key: '$A=2$. $\\bar y=\\tfrac{1}{2}\\int_0^\\pi\\tfrac12\\sin^2 x\\,dx=\\tfrac14\\cdot\\tfrac\\pi2=\\tfrac{\\pi}{8}$.' },
    { no: '5', bab: 'BAB 5', question: 'Turunan $dy/dx$ kurva parametrik $x=t+1/t$, $y=t-1/t$ di $t=2$.',
      key: '$dx/dt=1-1/t^2$, $dy/dt=1+1/t^2$. Di $t=2$: $\\frac{dy}{dx}=\\frac{1+1/4}{1-1/4}=\\frac{5/4}{3/4}=\\tfrac53$.' },
    { no: '6', bab: 'BAB 5', question: 'Cari luas daerah dalam lemniskat $r^2=4\\cos 2\\theta$.',
      key: 'Pakai simetri: $A=4\\cdot\\tfrac12\\int_0^{\\pi/4}4\\cos2\\theta\\,d\\theta=8[\\tfrac{\\sin2\\theta}{2}]_0^{\\pi/4}=4$.' },
    { no: '7', bab: 'BAB 5', question: 'Panjang busur $r=e^\\theta$ dari $\\theta=0$ ke $\\theta=\\pi$.',
      key: '$r\'=e^\\theta$. $\\sqrt{r^2+r\'^2}=\\sqrt{2}e^\\theta$. $L=\\sqrt{2}\\int_0^\\pi e^\\theta d\\theta=\\sqrt{2}(e^\\pi-1)$.' },
    { no: '8', bab: 'BAB 6', question: 'Jumlahkan $\\sum_{n=1}^\\infty \\dfrac{3}{4^n}$.',
      key: 'Geometri $a=3/4, r=1/4$: $S=\\tfrac{3/4}{1-1/4}=1$.' },
    { no: '9', bab: 'BAB 6', question: 'Deret Maclaurin $f(x)=\\ln(1+x)$, tulis 4 suku pertama.',
      key: '$\\ln(1+x)=x-\\tfrac{x^2}{2}+\\tfrac{x^3}{3}-\\tfrac{x^4}{4}+\\cdots=\\sum_{n=1}^\\infty\\tfrac{(-1)^{n+1}x^n}{n}$, $-1<x\\le1$.' },
    { no: '10', bab: 'BAB 6', question: 'Apakah $\\sum \\dfrac{n!}{n^n}$ konvergen? Gunakan uji rasio.',
      key: '$\\frac{a_{n+1}}{a_n}=\\frac{(n+1)!}{(n+1)^{n+1}}\\cdot\\frac{n^n}{n!}=\\frac{n^n}{(n+1)^n}=(\\frac{n}{n+1})^n=(1-\\frac{1}{n+1})^n\\to e^{-1}=\\tfrac1e<1$. Konvergen.' },
  ],
];
