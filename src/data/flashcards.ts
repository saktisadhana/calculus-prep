// Flashcard decks — ~60 cards across Bab 1–6
export interface Flashcard {
  bab: string;
  front: string;
  back: string;
}

export const flashcards: Flashcard[] = [
  // === BAB 1: Fungsi Transenden ===
  { bab: 'Bab 1', front: '$\\dfrac{d}{dx}e^x = \\ ?$', back: '$\\dfrac{d}{dx}e^x = e^x$. Satu-satunya fungsi yang merupakan turunan dari dirinya sendiri.' },
  { bab: 'Bab 1', front: '$\\int e^x\\,dx = \\ ?$', back: '$\\int e^x\\,dx = e^x + C$' },
  { bab: 'Bab 1', front: '$\\dfrac{d}{dx}\\ln x = \\ ?$', back: '$\\dfrac{d}{dx}\\ln x = \\dfrac{1}{x}$' },
  { bab: 'Bab 1', front: '$\\int \\dfrac{dx}{x} = \\ ?$', back: '$\\int \\dfrac{dx}{x} = \\ln|x| + C$' },
  { bab: 'Bab 1', front: '$\\dfrac{d}{dx}a^x = \\ ?$', back: '$\\dfrac{d}{dx}a^x = a^x \\ln a$' },
  { bab: 'Bab 1', front: '$\\dfrac{d}{dx}\\arcsin x = \\ ?$', back: '$\\dfrac{d}{dx}\\arcsin x = \\dfrac{1}{\\sqrt{1-x^2}}$' },
  { bab: 'Bab 1', front: '$\\dfrac{d}{dx}\\arctan x = \\ ?$', back: '$\\dfrac{d}{dx}\\arctan x = \\dfrac{1}{1+x^2}$' },
  { bab: 'Bab 1', front: '$\\int \\dfrac{dx}{\\sqrt{a^2-x^2}} = \\ ?$', back: '$\\int \\dfrac{dx}{\\sqrt{a^2-x^2}} = \\arcsin\\dfrac{x}{a} + C$' },
  { bab: 'Bab 1', front: '$\\int \\dfrac{dx}{a^2+x^2} = \\ ?$', back: '$\\int \\dfrac{dx}{a^2+x^2} = \\dfrac{1}{a}\\arctan\\dfrac{x}{a} + C$' },
  { bab: 'Bab 1', front: '$\\cosh^2 x - \\sinh^2 x = \\ ?$', back: '$\\cosh^2 x - \\sinh^2 x = 1$ (identitas hiperbolik)' },

  // === BAB 2: Teknik Integrasi ===
  { bab: 'Bab 2', front: 'Rumus integrasi parsial?', back: '$\\int u\\,dv = uv - \\int v\\,du$. Urutan pilih $u$: LIATE (Log, Invers trig, Aljabar, Trig, Eksponen).' },
  { bab: 'Bab 2', front: '$\\sin^2 x = \\ ?$ (identitas)', back: '$\\sin^2 x = \\tfrac12(1-\\cos 2x)$' },
  { bab: 'Bab 2', front: '$\\cos^2 x = \\ ?$ (identitas)', back: '$\\cos^2 x = \\tfrac12(1+\\cos 2x)$' },
  { bab: 'Bab 2', front: 'Substitusi untuk $\\sqrt{a^2-x^2}$?', back: '$x = a\\sin\\theta$, sehingga $\\sqrt{a^2-x^2} = a\\cos\\theta$.' },
  { bab: 'Bab 2', front: 'Substitusi untuk $\\sqrt{a^2+x^2}$?', back: '$x = a\\tan\\theta$, sehingga $\\sqrt{a^2+x^2} = a\\sec\\theta$.' },
  { bab: 'Bab 2', front: 'Substitusi untuk $\\sqrt{x^2-a^2}$?', back: '$x = a\\sec\\theta$, sehingga $\\sqrt{x^2-a^2} = a\\tan\\theta$.' },

  // === BAB 3: Integral Numerik & Tak Wajar ===
  { bab: 'Bab 3', front: 'Rumus Trapesium?', back: '$\\int_a^b f\\,dx \\approx \\dfrac{h}{2}(f_0 + 2f_1 + 2f_2 + \\cdots + 2f_{n-1} + f_n)$ dengan $h=\\tfrac{b-a}{n}$.' },
  { bab: 'Bab 3', front: 'Rumus Simpson?', back: '$\\int_a^b f\\,dx \\approx \\dfrac{h}{3}(f_0 + 4f_1 + 2f_2 + 4f_3 + \\cdots + f_n)$, $n$ genap.' },
  { bab: 'Bab 3', front: '$\\int_1^\\infty \\dfrac{dx}{x^p}$ konvergen jika?', back: 'Konvergen jika $p > 1$, divergen jika $p \\le 1$.' },
  { bab: 'Bab 3', front: "Aturan L'Hôpital?", back: "Jika $\\lim \\dfrac{f}{g}$ berbentuk $\\tfrac00$ atau $\\tfrac\\infty\\infty$, maka $\\lim\\dfrac{f}{g} = \\lim\\dfrac{f'}{g'}$." },

  // === BAB 4: Aplikasi Integral ===
  { bab: 'Bab 4', front: 'Luas antara dua kurva?', back: '$A = \\int_a^b [f(x)-g(x)]\\,dx$ dengan $f \\ge g$. Selalu periksa mana yang di atas!' },
  { bab: 'Bab 4', front: 'Volume metode cakram?', back: '$V = \\pi\\int_a^b [R(x)]^2\\,dx$. Gunakan saat daerah menempel sumbu putar (tanpa lubang).' },
  { bab: 'Bab 4', front: 'Volume metode cincin?', back: '$V = \\pi\\int_a^b ([R_{luar}]^2 - [R_{dalam}]^2)\\,dx$. Ada lubang (daerah tidak menempel sumbu).' },
  { bab: 'Bab 4', front: 'Volume metode kulit tabung?', back: '$V = 2\\pi\\int_a^b x\\,f(x)\\,dx$. Praktis untuk putar terhadap sumbu-y jika fungsi dalam $x$.' },
  { bab: 'Bab 4', front: 'Kapan pakai cakram vs kulit?', back: 'Cakram: irisan $\\perp$ sumbu putar. Kulit: irisan $\\parallel$ sumbu putar. Kulit lebih praktis jika mengubah variabel sulit.' },
  { bab: 'Bab 4', front: 'Panjang kurva (arc length)?', back: "$L = \\int_a^b \\sqrt{1+(y')^2}\\,dx$. Cari $y'$, kuadratkan, tambah 1, akarkan." },
  { bab: 'Bab 4', front: 'Luas permukaan putar (sumbu-x)?', back: "$S = 2\\pi\\int_a^b y\\sqrt{1+(y')^2}\\,dx$. Ingat: $2\\pi \\times$ jari-jari $\\times ds$." },
  { bab: 'Bab 4', front: 'Centroid $\\bar x$?', back: '$\\bar x = \\dfrac{1}{A}\\int_a^b x[f(x)-g(x)]\\,dx$' },
  { bab: 'Bab 4', front: 'Centroid $\\bar y$?', back: '$\\bar y = \\dfrac{1}{A}\\int_a^b \\tfrac12[f(x)^2-g(x)^2]\\,dx$' },
  { bab: 'Bab 4', front: 'Teorema Pappus?', back: '$V = 2\\pi\\bar d \\cdot A$. Volume = keliling lintasan centroid $\\times$ luas daerah. Cepat untuk soal simetri.' },

  // === BAB 5: Parametrik & Kutub ===
  { bab: 'Bab 5', front: '$\\dfrac{dy}{dx}$ kurva parametrik?', back: '$\\dfrac{dy}{dx} = \\dfrac{dy/dt}{dx/dt}$' },
  { bab: 'Bab 5', front: 'Panjang kurva parametrik?', back: '$L = \\int_{t_1}^{t_2}\\sqrt{\\dot x^2 + \\dot y^2}\\,dt$' },
  { bab: 'Bab 5', front: 'Konversi kutub ke Cartesius?', back: '$x = r\\cos\\theta,\\quad y = r\\sin\\theta$' },
  { bab: 'Bab 5', front: 'Konversi Cartesius ke kutub?', back: '$r^2 = x^2+y^2,\\quad \\tan\\theta = y/x$' },
  { bab: 'Bab 5', front: '$r = a\\cos(n\\theta)$: berapa daun?', back: '$n$ ganjil: $n$ daun. $n$ genap: $2n$ daun.' },
  { bab: 'Bab 5', front: '$r = a + b\\cos\\theta$: apa bentuknya?', back: '$a=b$: kardioid. $a>b$: limaçon (tanpa loop). $a<b$: limaçon berloop.' },
  { bab: 'Bab 5', front: 'Luas daerah kutub?', back: '$A = \\tfrac12\\int_\\alpha^\\beta r^2\\,d\\theta$. Jangan lupa faktor $\\tfrac12$!' },
  { bab: 'Bab 5', front: 'Panjang busur kutub?', back: "$L = \\int_\\alpha^\\beta \\sqrt{r^2 + (r')^2}\\,d\\theta$. Beda dengan Cartesius!" },
  { bab: 'Bab 5', front: 'Kemiringan garis singgung kutub?', back: "$\\dfrac{dy}{dx} = \\dfrac{r'\\sin\\theta + r\\cos\\theta}{r'\\cos\\theta - r\\sin\\theta}$" },

  // === BAB 6: Barisan & Deret ===
  { bab: 'Bab 6', front: 'Jumlah deret geometri tak hingga?', back: '$\\sum_{n=0}^\\infty ar^n = \\dfrac{a}{1-r}$, syarat $|r|<1$.' },
  { bab: 'Bab 6', front: 'Uji suku ke-n: $\\lim a_n \\ne 0$ berarti?', back: 'Deret DIVERGEN. Tapi $\\lim a_n=0$ TIDAK menjamin konvergen (contoh: $\\sum 1/n$).' },
  { bab: 'Bab 6', front: 'Deret-p konvergen jika?', back: '$\\sum 1/n^p$ konvergen jika $p>1$, divergen jika $p\\le1$.' },
  { bab: 'Bab 6', front: 'Uji rasio: kapan pakai?', back: 'Ada faktorial atau $r^n$. $L=\\lim|a_{n+1}/a_n|$: $L<1$ konvergen, $L>1$ divergen, $L=1$ tak tentu.' },
  { bab: 'Bab 6', front: 'Uji akar: kapan pakai?', back: 'Ada pangkat $n$: $(\\cdots)^n$. $L=\\lim\\sqrt[n]{|a_n|}$: $L<1$ konvergen, $L>1$ divergen.' },
  { bab: 'Bab 6', front: 'Uji Leibniz (ganti tanda)?', back: '$\\sum(-1)^n b_n$ konvergen jika $b_n$ turun monoton dan $b_n \\to 0$.' },
  { bab: 'Bab 6', front: 'Konvergen mutlak vs bersyarat?', back: 'Mutlak: $\\sum|a_n|$ konvergen. Bersyarat: $\\sum a_n$ konvergen tapi $\\sum|a_n|$ divergen.' },
  { bab: 'Bab 6', front: 'Radius konvergensi deret pangkat?', back: '$R = \\lim\\left|\\dfrac{c_n}{c_{n+1}}\\right|$ atau $R = \\dfrac{1}{\\lim\\sqrt[n]{|c_n|}}$.' },
  { bab: 'Bab 6', front: 'Deret Taylor?', back: '$f(x) = \\sum_{n=0}^\\infty \\dfrac{f^{(n)}(a)}{n!}(x-a)^n$. Maclaurin = Taylor di $a=0$.' },
  { bab: 'Bab 6', front: 'Maclaurin: $e^x = \\ ?$', back: '$e^x = \\sum\\dfrac{x^n}{n!} = 1 + x + \\dfrac{x^2}{2!} + \\dfrac{x^3}{3!} + \\cdots$ untuk semua $x$.' },
  { bab: 'Bab 6', front: 'Maclaurin: $\\sin x = \\ ?$', back: '$\\sin x = \\sum\\dfrac{(-1)^n x^{2n+1}}{(2n+1)!} = x - \\dfrac{x^3}{3!} + \\dfrac{x^5}{5!} - \\cdots$' },
  { bab: 'Bab 6', front: 'Maclaurin: $\\cos x = \\ ?$', back: '$\\cos x = \\sum\\dfrac{(-1)^n x^{2n}}{(2n)!} = 1 - \\dfrac{x^2}{2!} + \\dfrac{x^4}{4!} - \\cdots$' },
  { bab: 'Bab 6', front: 'Maclaurin: $\\dfrac{1}{1-x} = \\ ?$', back: '$\\dfrac{1}{1-x} = \\sum x^n = 1 + x + x^2 + x^3 + \\cdots$, untuk $|x|<1$.' },
  { bab: 'Bab 6', front: 'Maclaurin: $\\ln(1+x) = \\ ?$', back: '$\\ln(1+x) = \\sum\\dfrac{(-1)^{n+1}x^n}{n} = x - \\dfrac{x^2}{2} + \\dfrac{x^3}{3} - \\cdots$, $-1<x\\le1$.' },
  { bab: 'Bab 6', front: 'Maclaurin: $\\arctan x = \\ ?$', back: '$\\arctan x = \\sum\\dfrac{(-1)^n x^{2n+1}}{2n+1} = x - \\dfrac{x^3}{3} + \\dfrac{x^5}{5} - \\cdots$, $|x|\\le1$.' },
  { bab: 'Bab 6', front: 'Alur memilih uji konvergensi?', back: '1. $\\lim a_n \\ne 0$? → divergen. 2. Geometri/deret-p? 3. Faktorial/$r^n$? → rasio/akar. 4. Positif turun? → integral/banding. 5. Ganti tanda? → Leibniz.' },
];
