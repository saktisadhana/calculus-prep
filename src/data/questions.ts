// Practice questions — 20+ per bab for comprehensive exam prep
// Format: [difficulty, topic, question, solution]
export type Difficulty = 'e' | 'm' | 'h';
export type Question = [Difficulty, string, string, string];

export const soal: Record<string, Question[]> = {
  l4: [
    // === LUAS (4.1) ===
    ['e', '4.1 Luas', 'Hitung luas daerah yang dibatasi $y=x^2$ dan $y=2x$.',
      'Titik potong: $x^2=2x \\Rightarrow x=0,2$. Pada $[0,2]$, $2x\\ge x^2$. $A=\\int_0^2(2x-x^2)dx=[x^2-\\tfrac{x^3}{3}]_0^2=4-\\tfrac83=\\tfrac43$.'],
    ['e', '4.1 Luas', 'Luas daerah antara $y=x$ dan $y=x^2$ pada $[0,1]$.',
      'Pada $[0,1]$, $x\\ge x^2$. $A=\\int_0^1(x-x^2)dx=\\tfrac12-\\tfrac13=\\tfrac16$.'],
    ['m', '4.1 Luas', 'Hitung luas daerah yang dibatasi oleh $y=x^2-1$ dan $y=3-x^2$.',
      'Titik potong: $x^2-1=3-x^2 \\Rightarrow 2x^2=4 \\Rightarrow x=\\pm\\sqrt{2}$. Pada $[-\\sqrt2,\\sqrt2]$, $3-x^2\\ge x^2-1$. $A=\\int_{-\\sqrt2}^{\\sqrt2}(4-2x^2)dx=2\\int_0^{\\sqrt2}(4-2x^2)dx=2[4x-\\tfrac{2x^3}{3}]_0^{\\sqrt2}=2(4\\sqrt2-\\tfrac{4\\sqrt2}{3})=\\tfrac{16\\sqrt2}{3}$.'],
    ['m', '4.1 Luas', 'Hitung luas daerah yang dibatasi $y=\\sin x$ dan $y=\\cos x$ pada $[0,\\pi/2]$.',
      'Titik potong: $\\sin x=\\cos x \\Rightarrow x=\\pi/4$. Pada $[0,\\pi/4]$, $\\cos x\\ge\\sin x$; pada $[\\pi/4,\\pi/2]$, $\\sin x\\ge\\cos x$. $A=\\int_0^{\\pi/4}(\\cos x-\\sin x)dx+\\int_{\\pi/4}^{\\pi/2}(\\sin x-\\cos x)dx=[\\sin x+\\cos x]_0^{\\pi/4}+[-\\cos x-\\sin x]_{\\pi/4}^{\\pi/2}=(\\sqrt2-1)+(\\sqrt2-1)=2\\sqrt2-2$.'],
    ['h', '4.1 Luas', 'Hitung luas daerah yang dibatasi $x=y^2$ dan $x=2-y^2$ menggunakan irisan horizontal.',
      'Potong: $y^2=2-y^2 \\Rightarrow y^2=1 \\Rightarrow y=\\pm1$. $A=\\int_{-1}^1[(2-y^2)-y^2]dy=\\int_{-1}^1(2-2y^2)dy=[2y-\\tfrac{2y^3}{3}]_{-1}^1=(2-\\tfrac23)-(-2+\\tfrac23)=\\tfrac83$.'],

    // === VOLUME (4.2) ===
    ['e', '4.2 Volume cakram', 'Daerah di bawah $y=\\sqrt{x}$, $0\\le x\\le4$, diputar terhadap sumbu-x. Cari volume.',
      'Cakram: $V=\\pi\\int_0^4(\\sqrt x)^2dx=\\pi\\int_0^4 x\\,dx=\\pi[\\tfrac{x^2}{2}]_0^4=8\\pi$.'],
    ['m', '4.2 Volume cincin', 'Daerah antara $y=x$ dan $y=x^2$ diputar terhadap sumbu-x. Cari volume.',
      'Pada $[0,1]$, $x\\ge x^2$. Cincin: $V=\\pi\\int_0^1(x^2-(x^2)^2)dx=\\pi\\int_0^1(x^2-x^4)dx=\\pi(\\tfrac13-\\tfrac15)=\\tfrac{2\\pi}{15}$.'],
    ['m', '4.2 Volume cincin', 'Daerah antara $y=\\sqrt{x}$ dan $y=x$ diputar terhadap sumbu-y. Cari volume dengan kulit tabung.',
      '$V=2\\pi\\int_0^1 x(\\sqrt{x}-x)dx=2\\pi\\int_0^1(x^{3/2}-x^2)dx=2\\pi[\\tfrac{2x^{5/2}}{5}-\\tfrac{x^3}{3}]_0^1=2\\pi(\\tfrac25-\\tfrac13)=\\tfrac{2\\pi}{15}$.'],
    ['h', '4.2 Kulit tabung', 'Daerah di bawah $y=x^2$, $0\\le x\\le2$, diputar terhadap sumbu-y. Gunakan metode kulit.',
      'Kulit: $V=2\\pi\\int_0^2 x\\cdot x^2\\,dx=2\\pi\\int_0^2 x^3dx=2\\pi[\\tfrac{x^4}{4}]_0^2=2\\pi\\cdot4=8\\pi$.'],
    ['h', '4.2 Volume', 'Daerah $y=x^2$ dan $y=4$ diputar terhadap garis $y=5$. Cari volume.',
      'Batas $x$: $x^2=4 \\Rightarrow x=\\pm2$. $R_{luar}=5-x^2$, $R_{dalam}=5-4=1$. $V=\\pi\\int_{-2}^2[(5-x^2)^2-1]dx=2\\pi\\int_0^2(24-10x^2+x^4)dx=2\\pi[24x-\\tfrac{10x^3}{3}+\\tfrac{x^5}{5}]_0^2=2\\pi(48-\\tfrac{80}{3}+\\tfrac{32}{5})=\\tfrac{832\\pi}{15}$.'],

    // === PANJANG KURVA (4.3) ===
    ['m', '4.3 Panjang kurva', 'Panjang kurva $y=\\tfrac23 x^{3/2}$ dari $x=0$ ke $x=3$.',
      '$y\'=x^{1/2}$, $1+y\'^2=1+x$. $L=\\int_0^3\\sqrt{1+x}\\,dx=[\\tfrac23(1+x)^{3/2}]_0^3=\\tfrac23(8-1)=\\tfrac{14}{3}$.'],
    ['m', '4.3 Panjang kurva', 'Panjang kurva $y=\\frac{x^2}{4}-\\frac{\\ln x}{2}$ dari $x=1$ ke $x=e$.',
      '$y\'=\\tfrac{x}{2}-\\tfrac{1}{2x}$. $1+y\'^2=1+\\tfrac{x^2}{4}-\\tfrac12+\\tfrac{1}{4x^2}=(\\tfrac{x}{2}+\\tfrac{1}{2x})^2$. $L=\\int_1^e(\\tfrac{x}{2}+\\tfrac{1}{2x})dx=[\\tfrac{x^2}{4}+\\tfrac{\\ln x}{2}]_1^e=\\tfrac{e^2-1}{4}+\\tfrac12$.'],

    // === LUAS PERMUKAAN (4.4) ===
    ['h', '4.4 Luas permukaan', 'Kurva $y=\\sqrt{x}$, $0\\le x\\le1$ diputar terhadap sumbu-x. Susun integral luas permukaan.',
      '$y\'=\\tfrac{1}{2\\sqrt x}$, $1+y\'^2=1+\\tfrac1{4x}$. $S=2\\pi\\int_0^1\\sqrt x\\sqrt{1+\\tfrac1{4x}}dx=2\\pi\\int_0^1\\sqrt{x+\\tfrac14}dx=2\\pi[\\tfrac23(x+\\tfrac14)^{3/2}]_0^1=\\tfrac{4\\pi}{3}\\big((\\tfrac54)^{3/2}-(\\tfrac14)^{3/2}\\big)$.'],
    ['m', '4.4 Luas permukaan', 'Kurva $y=x^3$, $0\\le x\\le1$ diputar terhadap sumbu-x. Susun integral luas permukaannya.',
      '$y\'=3x^2$, $ds=\\sqrt{1+9x^4}\\,dx$. $S=2\\pi\\int_0^1 x^3\\sqrt{1+9x^4}\\,dx$. Substitusi $u=1+9x^4$, $du=36x^3dx$. $S=\\tfrac{2\\pi}{36}\\int_1^{10}\\sqrt{u}\\,du=\\tfrac{\\pi}{18}[\\tfrac{2u^{3/2}}{3}]_1^{10}=\\tfrac{\\pi}{27}(10\\sqrt{10}-1)$.'],

    // === TITIK BERAT (4.5) ===
    ['h', '4.5 Titik berat', 'Cari $\\bar x$ centroid daerah di bawah $y=x^2$, $0\\le x\\le1$ (di atas sumbu-x).',
      '$A=\\int_0^1 x^2dx=\\tfrac13$. $\\bar x=\\tfrac1A\\int_0^1 x\\cdot x^2dx=3\\int_0^1 x^3dx=3\\cdot\\tfrac14=\\tfrac34$.'],
    ['h', '4.5 Teorema Pappus', 'Daerah lingkaran berjari-jari $1$ berpusat di $(3,0)$ diputar mengelilingi sumbu-y. Cari volumenya (torus).',
      'Luas $A=\\pi(1)^2=\\pi$. Jarak centroid ke sumbu putar $\\bar d=3$. Pappus: $V=2\\pi\\bar d\\,A=2\\pi\\cdot3\\cdot\\pi=6\\pi^2$.'],
    ['m', '4.5 Titik berat', 'Cari $\\bar y$ centroid daerah antara $y=\\sqrt{x}$ dan sumbu-x, $0\\le x\\le4$.',
      '$A=\\int_0^4\\sqrt{x}\\,dx=\\tfrac{2\\cdot8}{3}=\\tfrac{16}{3}$. $\\bar y=\\tfrac{1}{A}\\int_0^4\\tfrac12(\\sqrt{x})^2dx=\\tfrac{3}{16}\\cdot\\tfrac12\\int_0^4 x\\,dx=\\tfrac{3}{32}\\cdot8=\\tfrac34$.'],
    ['h', '4.5 Teorema Pappus', 'Segitiga dengan simpul $(0,0)$, $(4,0)$, $(0,3)$ diputar terhadap sumbu-x. Gunakan Pappus untuk cari volumenya.',
      'Centroid segitiga: $\\bar y=\\tfrac{0+0+3}{3}=1$. Luas $=\\tfrac12(4)(3)=6$. $V=2\\pi\\bar y\\cdot A=2\\pi(1)(6)=12\\pi$.'],
  ],

  l5: [
    // === PARAMETRIK (5.1) ===
    ['e', '5.1 Parametrik', 'Diberi $x=t^2,\\ y=t^3$. Cari $\\dfrac{dy}{dx}$.',
      '$\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}=\\frac{3t^2}{2t}=\\frac{3t}{2}$.'],
    ['m', '5.1 Panjang parametrik', 'Panjang kurva $x=\\cos t,\\ y=\\sin t$, $0\\le t\\le\\pi$.',
      '$\\dot x=-\\sin t,\\ \\dot y=\\cos t$, $\\sqrt{\\dot x^2+\\dot y^2}=1$. $L=\\int_0^\\pi 1\\,dt=\\pi$ (setengah keliling lingkaran satuan).'],
    ['m', '5.1 Parametrik', 'Cari $\\dfrac{d^2y}{dx^2}$ untuk $x=t-\\sin t$, $y=1-\\cos t$ di $t=\\pi/2$.',
      '$\\frac{dy}{dx}=\\frac{\\sin t}{1-\\cos t}$. Di $t=\\pi/2$: $\\frac{dy}{dx}=\\frac{1}{1}=1$. $\\frac{d^2y}{dx^2}=\\frac{\\frac{d}{dt}(\\frac{dy}{dx})}{dx/dt}=\\frac{\\frac{\\cos t(1-\\cos t)-\\sin^2 t}{(1-\\cos t)^2}}{1-\\cos t}=\\frac{\\cos t-1}{(1-\\cos t)^3}=\\frac{-1}{(1-\\cos t)^2}$. Di $t=\\pi/2$: $=-1$.'],
    ['h', '5.1 Panjang parametrik', 'Panjang kurva $x=e^t\\cos t$, $y=e^t\\sin t$ dari $t=0$ ke $t=\\pi$.',
      '$\\dot x=e^t(\\cos t-\\sin t)$, $\\dot y=e^t(\\sin t+\\cos t)$. $\\dot x^2+\\dot y^2=e^{2t}(\\cos^2-2\\cos\\sin+\\sin^2+\\sin^2+2\\sin\\cos+\\cos^2)=2e^{2t}$. $L=\\int_0^\\pi\\sqrt{2}\\,e^t dt=\\sqrt{2}(e^\\pi-1)$.'],

    // === KOORDINAT KUTUB (5.2) ===
    ['e', '5.2 Konversi', 'Ubah titik kutub $(2,\\tfrac{\\pi}{3})$ ke Cartesius.',
      '$x=2\\cos\\tfrac\\pi3=2\\cdot\\tfrac12=1$, $y=2\\sin\\tfrac\\pi3=2\\cdot\\tfrac{\\sqrt3}{2}=\\sqrt3$. Jadi $(1,\\sqrt3)$.'],
    ['e', '5.2 Konversi', 'Ubah titik Cartesius $(1,1)$ ke koordinat kutub (sudut di $[0,2\\pi)$).',
      '$r=\\sqrt{1^2+1^2}=\\sqrt2$, $\\tan\\theta=1\\Rightarrow\\theta=\\tfrac\\pi4$. Jadi $(\\sqrt2,\\tfrac\\pi4)$.'],
    ['m', '5.2 Konversi', 'Ubah persamaan Cartesius $x^2+y^2=4x$ ke bentuk kutub.',
      '$r^2=4r\\cos\\theta \\Rightarrow r=4\\cos\\theta$ (lingkaran pusat $(2,0)$, jari-jari 2).'],

    // === GRAFIK KUTUB (5.3) ===
    ['m', '5.3 Grafik', 'Identifikasi kurva $r=1+\\cos\\theta$ dan sebutkan ciri grafiknya.',
      'Kardioid (karena $a=b=1$). Simetris terhadap sumbu-x (sumbu polar), $r=2$ di $\\theta=0$, $r=0$ di $\\theta=\\pi$.'],
    ['m', '5.3 Mawar', 'Berapa jumlah daun kurva $r=\\cos 3\\theta$ dan $r=\\cos 2\\theta$?',
      '$r=\\cos n\\theta$: $n$ ganjil maka $n$ daun, $n$ genap maka $2n$ daun. Jadi $\\cos3\\theta\\to3$ daun, $\\cos2\\theta\\to4$ daun.'],
    ['m', '5.3 Grafik', 'Identifikasi kurva $r=2+3\\cos\\theta$. Apa bentuknya?',
      'Limaçon berloop (karena $a<b$, yaitu $2<3$). Ada loop dalam saat $r<0$, yaitu saat $\\cos\\theta<-2/3$.'],

    // === LUAS KUTUB (5.4) ===
    ['m', '5.4 Luas kutub', 'Cari luas daerah dalam satu lingkaran $r=2\\sin\\theta$.',
      '$\\theta:0\\to\\pi$. $A=\\tfrac12\\int_0^\\pi(2\\sin\\theta)^2d\\theta=2\\int_0^\\pi\\sin^2\\theta\\,d\\theta=2\\cdot\\tfrac\\pi2=\\pi$ (lingkaran jari-jari 1).'],
    ['m', '5.4 Luas kardioid', 'Cari luas total daerah di dalam kardioid $r=1+\\cos\\theta$.',
      '$A=\\tfrac12\\int_0^{2\\pi}(1+\\cos\\theta)^2d\\theta=\\tfrac12\\int_0^{2\\pi}(1+2\\cos\\theta+\\cos^2\\theta)d\\theta=\\tfrac12(2\\pi+0+\\pi)=\\tfrac{3\\pi}{2}$.'],
    ['h', '5.4 Luas satu daun', 'Cari luas satu daun mawar $r=\\cos 2\\theta$.',
      'Satu daun: $\\theta\\in[-\\tfrac\\pi4,\\tfrac\\pi4]$. $A=\\tfrac12\\int_{-\\pi/4}^{\\pi/4}\\cos^2 2\\theta\\,d\\theta=\\tfrac14[\\theta+\\tfrac{\\sin4\\theta}{4}]_{-\\pi/4}^{\\pi/4}=\\tfrac14\\cdot\\tfrac\\pi2=\\tfrac\\pi8$.'],
    ['h', '5.4 Luas antar kurva', 'Cari luas daerah di dalam kardioid $r=1+\\cos\\theta$ dan di luar lingkaran $r=1$.',
      'Potong: $1+\\cos\\theta=1 \\Rightarrow \\cos\\theta=0 \\Rightarrow \\theta=\\pm\\pi/2$. $A=2\\cdot\\tfrac12\\int_0^{\\pi/2}[(1+\\cos\\theta)^2-1^2]d\\theta=\\int_0^{\\pi/2}(2\\cos\\theta+\\cos^2\\theta)d\\theta=[2\\sin\\theta+\\tfrac\\theta2+\\tfrac{\\sin2\\theta}{4}]_0^{\\pi/2}=2+\\tfrac\\pi4$.'],

    // === GARIS SINGGUNG & BUSUR (5.5) ===
    ['h', '5.5 Panjang busur kutub', 'Susun dan hitung panjang busur kardioid $r=1+\\cos\\theta$, $0\\le\\theta\\le2\\pi$.',
      '$r\'=-\\sin\\theta$. $r^2+r\'^2=(1+\\cos\\theta)^2+\\sin^2\\theta=2+2\\cos\\theta=4\\cos^2(\\theta/2)$. $L=\\int_0^{2\\pi}2|\\cos(\\theta/2)|\\,d\\theta=8$.'],
    ['m', '5.5 Garis singgung', 'Cari kemiringan garis singgung kurva $r=\\sin\\theta$ di $\\theta=\\pi/4$.',
      '$\\frac{dy}{dx}=\\frac{r\'\\sin\\theta+r\\cos\\theta}{r\'\\cos\\theta-r\\sin\\theta}$. $r\'=\\cos\\theta$. Di $\\theta=\\pi/4$: $r=r\'=\\tfrac{\\sqrt2}{2}$. Jadi $\\frac{dy}{dx}=\\frac{\\tfrac12+\\tfrac12}{\\tfrac12-\\tfrac12}$ — penyebut $=0$, garis singgung vertikal.'],
    ['h', '5.5 Luas permukaan kutub', 'Kurva $r=1+\\cos\\theta$ diputar terhadap sumbu kutub. Susun integral luas permukaan.',
      '$y=r\\sin\\theta=(1+\\cos\\theta)\\sin\\theta$. $ds=\\sqrt{r^2+r\'^2}d\\theta=2|\\cos(\\theta/2)|d\\theta$. $S=2\\pi\\int_0^\\pi(1+\\cos\\theta)\\sin\\theta\\cdot 2\\cos(\\theta/2)\\,d\\theta$. Sederhanakan: $(1+\\cos\\theta)=2\\cos^2(\\theta/2)$, $\\sin\\theta=2\\sin(\\theta/2)\\cos(\\theta/2)$. $S=2\\pi\\int_0^\\pi 8\\cos^4(\\theta/2)\\sin(\\theta/2)\\,d\\theta=\\tfrac{32\\pi}{5}$.'],
  ],

  l6: [
    // === BARISAN (6.1) ===
    ['e', '6.1 Barisan', 'Tentukan $\\lim_{n\\to\\infty}\\dfrac{3n^2+1}{2n^2+n}$.',
      'Bagi pangkat tertinggi: $\\frac{3+1/n^2}{2+1/n}\\to\\frac{3}{2}$. Konvergen ke $\\tfrac32$.'],
    ['m', '6.1 Barisan', 'Tentukan $\\lim_{n\\to\\infty}\\left(1+\\dfrac{3}{n}\\right)^n$.',
      'Bentuk $(1+\\tfrac{x}{n})^n$ dengan $x=3$. Limit = $e^3$.'],
    ['m', '6.1 Barisan', 'Tentukan apakah $a_n=\\dfrac{(-1)^n n}{n+1}$ konvergen.',
      '$|a_n|=\\tfrac{n}{n+1}\\to1\\ne0$. Jadi $\\lim a_n$ tidak ada (osilasi antara $\\pm1$). Barisan divergen.'],

    // === DERET (6.2) ===
    ['e', '6.2 Geometri', 'Jumlahkan $\\sum_{n=0}^\\infty 3\\left(\\tfrac12\\right)^n$.',
      'Geometri $a=3,r=\\tfrac12$: $S=\\frac{a}{1-r}=\\frac{3}{1/2}=6$.'],
    ['e', '6.2 Teleskopik', 'Jumlahkan $\\sum_{n=1}^\\infty \\dfrac{1}{n(n+1)}$.',
      'Pecahan parsial: $\\frac1{n(n+1)}=\\frac1n-\\frac1{n+1}$. Jumlah parsial $S_N=1-\\frac1{N+1}\\to1$. Jadi jumlahnya $=1$.'],
    ['m', '6.2 Geometri', 'Nyatakan $0.\\overline{36}$ sebagai pecahan menggunakan deret geometri.',
      '$0.363636\\ldots=\\tfrac{36}{100}+\\tfrac{36}{10000}+\\cdots=\\tfrac{36/100}{1-1/100}=\\tfrac{36}{99}=\\tfrac{4}{11}$.'],
    ['m', '6.2 Teleskopik', 'Jumlahkan $\\sum_{n=1}^\\infty \\dfrac{1}{n(n+2)}$.',
      '$\\frac{1}{n(n+2)}=\\tfrac12(\\frac1n-\\frac1{n+2})$. Teleskop: $S_N=\\tfrac12(1+\\tfrac12-\\tfrac{1}{N+1}-\\tfrac{1}{N+2})\\to\\tfrac12\\cdot\\tfrac32=\\tfrac34$.'],

    // === UJI KONVERGENSI (6.3) ===
    ['m', '6.3 Deret-p', 'Apakah $\\sum_{n=1}^\\infty \\dfrac{1}{n^{3/2}}$ konvergen?',
      'Deret-p dengan $p=\\tfrac32>1$ maka <b>konvergen</b>.'],
    ['m', '6.3 Uji rasio', 'Selidiki $\\sum \\dfrac{2^n}{n!}$.',
      '$\\frac{a_{n+1}}{a_n}=\\frac{2^{n+1}/(n+1)!}{2^n/n!}=\\frac{2}{n+1}\\to0<1$ maka <b>konvergen</b> (mutlak).'],
    ['m', '6.3 Banding limit', 'Selidiki konvergensi $\\sum \\dfrac{n}{n^2+1}$.',
      'Banding limit dengan $\\frac1n$: $\\lim\\frac{n/(n^2+1)}{1/n}=\\lim\\frac{n^2}{n^2+1}=1>0$. Karena $\\sum\\frac1n$ divergen maka deret <b>divergen</b>.'],
    ['m', '6.3 Leibniz', 'Selidiki $\\sum \\dfrac{(-1)^n}{\\sqrt n}$ — konvergen mutlak atau bersyarat?',
      'Ganti tanda, $b_n=\\tfrac1{\\sqrt n}$ turun & $\\to0$ maka konvergen (Leibniz). Tapi $\\sum\\tfrac1{\\sqrt n}$ (deret-p $p=\\tfrac12$) divergen maka <b>konvergen bersyarat</b>.'],
    ['m', '6.3 Uji integral', 'Selidiki $\\sum_{n=2}^\\infty \\dfrac{1}{n\\ln n}$ dengan uji integral.',
      '$f(x)=\\frac{1}{x\\ln x}$ positif dan turun untuk $x\\ge2$. $\\int_2^\\infty\\frac{dx}{x\\ln x}=\\lim_{b\\to\\infty}[\\ln(\\ln x)]_2^b=\\infty$. Divergen oleh uji integral.'],
    ['h', '6.3 Uji akar', 'Selidiki $\\sum \\left(\\dfrac{n}{2n+1}\\right)^n$.',
      '$L=\\lim\\sqrt[n]{|a_n|}=\\lim\\frac{n}{2n+1}=\\frac12<1$. Konvergen oleh uji akar.'],
    ['h', '6.3 Banding', 'Selidiki $\\sum \\dfrac{\\ln n}{n^2}$.',
      'Untuk $n\\ge3$, $\\ln n<n^{1/2}$, jadi $\\frac{\\ln n}{n^2}<\\frac{1}{n^{3/2}}$. Karena $\\sum\\frac{1}{n^{3/2}}$ konvergen ($p=3/2>1$), maka oleh uji banding deret <b>konvergen</b>.'],

    // === DERET PANGKAT & TAYLOR (6.4–6.5) ===
    ['h', '6.4 Radius konvergensi', 'Cari radius konvergensi $\\sum \\dfrac{x^n}{n\\,3^n}$.',
      'Rasio: $\\left|\\frac{x^{n+1}/((n+1)3^{n+1})}{x^n/(n3^n)}\\right|=\\frac{|x|}{3}\\cdot\\frac{n}{n+1}\\to\\frac{|x|}{3}$. Konvergen jika $<1$ maka $|x|<3$, $R=3$.'],
    ['h', '6.4 Interval konvergensi', 'Cari interval konvergensi $\\sum_{n=1}^\\infty \\dfrac{x^n}{n}$ termasuk ujung.',
      'Rasio $\\to|x|$, jadi $R=1$. Cek ujung: $x=1\\Rightarrow\\sum\\frac1n$ divergen; $x=-1\\Rightarrow\\sum\\frac{(-1)^n}{n}$ konvergen (Leibniz). Interval: $[-1,1)$.'],
    ['h', '6.4/6.5 Deret Taylor', 'Cari deret Maclaurin $f(x)=\\dfrac{1}{1+x^2}$ lalu deret untuk $\\arctan x$.',
      'Substitusi $x\\to -x^2$ pada $\\frac1{1-u}=\\sum u^n$: $\\frac1{1+x^2}=\\sum(-1)^n x^{2n}$. Integralkan suku demi suku: $\\arctan x=\\sum\\frac{(-1)^n x^{2n+1}}{2n+1}$, $|x|\\le1$.'],
    ['m', '6.4 Taylor', 'Cari 3 suku pertama deret Taylor $f(x)=e^x$ di $a=1$.',
      '$f(1)=e$, $f\'(1)=e$, $f\'\'(1)=e$. Taylor: $e^x=e+e(x-1)+\\tfrac{e}{2}(x-1)^2+\\cdots=e\\sum\\tfrac{(x-1)^n}{n!}$.'],
    ['h', '6.5 Manipulasi deret', 'Cari deret Maclaurin untuk $\\dfrac{x}{(1-x)^2}$.',
      'Dari $\\frac{1}{1-x}=\\sum x^n$, turunkan: $\\frac{1}{(1-x)^2}=\\sum nx^{n-1}$. Kalikan $x$: $\\frac{x}{(1-x)^2}=\\sum nx^n=\\sum_{n=1}^\\infty nx^n$, $|x|<1$.'],
    ['h', '6.5 Estimasi', 'Gunakan deret Maclaurin untuk memperkirakan $\\int_0^{0.5}e^{-x^2}dx$ dengan galat $<10^{-4}$.',
      '$e^{-x^2}=\\sum\\frac{(-1)^n x^{2n}}{n!}$. $\\int_0^{0.5}=\\sum\\frac{(-1)^n (0.5)^{2n+1}}{n!(2n+1)}$. $n=0$: $0.5$; $n=1$: $-0.5^3/(1\\cdot3)\\approx-0.04167$; $n=2$: $0.5^5/(2\\cdot5)=0.003125$; $n=3$: $-0.5^7/(6\\cdot7)\\approx-0.000186$. Galat $<0.000186<10^{-4}$ di suku ke-4, jadi pakai 4 suku: $\\approx0.4613$.'],
  ]
};
