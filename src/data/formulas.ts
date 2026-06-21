// Formula explanations for hover/tap interaction
export const FEXP: Record<string, string> = {
  area: '$A$ = luas daerah. $f(x)$ kurva atas, $g(x)$ kurva bawah; integralkan selisih tingginya dari batas $a$ ke $b$ (titik potong).',
  disk: '$V$ = volume. $R(x)$ = jari-jari cakram (jarak kurva ke sumbu putar). Kuadratkan lalu kali $\\pi$ (luas lingkaran $\\pi R^2$) dan jumlahkan sepanjang sumbu.',
  washer: '$R_{luar}$ dan $R_{dalam}$ = jari-jari tepi luar dan lubang. $\\pi(R^2-r^2)$ = luas cincin; dipakai saat daerah tidak menempel sumbu putar.',
  shell: '$2\\pi x$ = keliling kulit tabung berjari-jari $x$; tingginya $f(x)$. Praktis untuk putar terhadap sumbu-y dengan fungsi dalam $x$.',
  arc: "$\\sqrt{1+(y')^2}\\,dx$ = panjang elemen busur $ds$. Integralkan dari $a$ ke $b$ untuk mendapat panjang kurva $L$.",
  surfx: '$2\\pi y$ = keliling lingkaran yang dibentuk titik (jari-jari $=y$) saat diputar terhadap sumbu-x. Dikali elemen busur $ds$ memberi luas pita permukaan $S$.',
  surfy: '$2\\pi x$ = keliling lingkaran hasil putar terhadap sumbu-y (jari-jari $=x$). Dikali elemen busur $ds$ = luas permukaan $S$.',
  cx: '$\\bar x$ = koordinat-x titik berat. Tiap elemen luas $[f-g]\\,dx$ dibobot jaraknya $x$, lalu dibagi luas total $A$.',
  cy: '$\\bar y$ = koordinat-y titik berat. $\\tfrac12(f^2-g^2)$ = momen terhadap sumbu-x per satuan lebar; dibagi $A$.',
  pdydx: 'Kemiringan kurva parametrik: bagi laju $y$ terhadap $t$ ($dy/dt$) dengan laju $x$ terhadap $t$ ($dx/dt$).',
  parc: 'Panjang busur parametrik: $\\sqrt{\\dot x^2+\\dot y^2}\\,dt$ = jarak yang ditempuh tiap selang $dt$ (Pythagoras pada kecepatan).',
  pconv: 'Hubungan kutub dan Cartesius: $r$ = jarak ke titik asal, $\\theta$ = sudut, dengan $x=r\\cos\\theta$ dan $y=r\\sin\\theta$.',
  parea: '$\\tfrac12 r^2\\,d\\theta$ = luas juring (sektor) kecil berjari-jari $r$ dan sudut $d\\theta$. Integralkan dari $\\alpha$ ke $\\beta$.',
  pantar: 'Luas antara dua kurva kutub: selisih sektor luar ($r_{luar}^2$) dan dalam ($r_{dalam}^2$), dikali $\\tfrac12$, lalu integralkan.',
  pdy: "Kemiringan garis singgung kurva kutub via $x=r\\cos\\theta,\\ y=r\\sin\\theta$ sebagai parametrik berparameter $\\theta$ ($r'=dr/d\\theta$).",
  parc2: "Panjang busur kutub: $\\sqrt{r^2+(r')^2}\\,d\\theta$ menggabungkan perubahan jarak ($r'$) dan gerak menyudut ($r$).",
  geo: '$a$ = suku pertama, $r$ = rasio antar suku. Jumlah tak hingga ada (konvergen) hanya bila $|r|<1$, hasilnya $a/(1-r)$.',
  tele: 'Deret teleskopik: suku berurutan saling meniadakan sehingga jumlah parsial hanya menyisakan $b_1$ dikurangi limit suku terakhir.',
  rad: '$R$ = radius konvergensi: deret pangkat konvergen untuk $|x-a|<R$, dihitung dari rasio koefisien $|c_n/c_{n+1}|$.',
  tay: 'Koefisien deret Taylor: turunan ke-$n$ fungsi di titik $a$ dibagi $n!$. Maclaurin = kasus khusus $a=0$.',
};

// Rules to match formulas in the HTML to their explanation key
export const FEXP_RULES: [string, string][] = [
  ['irisan vertikal', 'area'], ['irisan horizontal', 'area'],
  ['R_{luar}', 'washer'], ['[R(x)]^2', 'disk'], ['jari-jari', 'shell'],
  ['dx}{dy}', 'arc'], [' y\\sqrt{1+(y', 'surfx'], [' x\\sqrt{1+(y', 'surfy'],
  ['bar{x}=\\frac{1}{A}', 'cx'], ['bar{y}=\\frac{1}{A}', 'cy'],
  ['dy/dt}{dx/dt}', 'pdydx'], ['dx}{dt}', 'parc'], ['r^2=x^2+y^2', 'pconv'],
  ['antar kurva', 'pantar'], ["r'\\sin\\theta+r\\cos\\theta", 'pdy'],
  ['r^2+\\left(\\tfrac{dr}', 'parc2'], ['\\frac12\\int_\\alpha^\\beta r^2', 'parea'],
  ['Geometri:', 'geo'], ['Teleskopik:', 'tele'], ['radius konvergensi', 'rad'], ['Taylor:', 'tay'],
];

export function explainFor(text: string): string | null {
  for (const [needle, key] of FEXP_RULES) {
    if (text.indexOf(needle) >= 0) return FEXP[key] ?? null;
  }
  return null;
}
