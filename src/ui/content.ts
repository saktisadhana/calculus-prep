// Static content sections: Prasyarat, Materi, Lembar Rumus, Tolak Ukur,
// plus the hover formula-explanation builder.
import { state } from '../storage/state.ts';
import { SVG_AREA_CURVES, SVG_VOLUME_DISK, SVG_POLAR_CARDIOID, SVG_SERIES_CONV } from '../data/diagrams.ts';
import { explainFor } from '../data/formulas.ts';
import { benchmarks } from '../data/benchmarks.ts';

export function renderPrerequisites(): void {
  const el = document.getElementById('prasyarat')!;
  el.innerHTML = `
    <h2>Prasyarat — Bab 1, 2, 3</h2>
    <p class="muted">Bab 4–6 dibangun di atas Bab 1–3. Bila lupa asal sebuah teknik, lihat ringkasan di sini. Chip <b>Prasyarat</b> di Ringkasan Materi &amp; Soal Solver akan melompat ke subbab yang relevan di halaman ini.</p>

    <div class="card">
      <h3 style="margin-top:4px">Bab 1 — Fungsi Transenden <span class="muted" style="font-size:13px">(hlm. 1)</span></h3>
      <div id="pre-1-1" class="presub">
        <h4>1.1 Fungsi Eksponensial dan Logaritma (hlm. 1)</h4>
        <div class="formula">$$\\frac{d}{dx}e^x=e^x,\\quad \\int e^x dx=e^x+C,\\quad \\frac{d}{dx}\\ln x=\\frac1x,\\quad \\int\\frac{dx}{x}=\\ln|x|+C$$</div>
        <p class="muted">Juga $\\frac{d}{dx}a^x=a^x\\ln a$ dan $\\int a^x dx=\\dfrac{a^x}{\\ln a}+C$. Mendasari deret Taylor $e^x$ dan banyak integral di Bab 2–6.</p>
      </div>
      <div id="pre-1-2" class="presub">
        <h4>1.2 Fungsi Invers Trigonometri (hlm. 33)</h4>
        <div class="formula">$$\\frac{d}{dx}\\arcsin x=\\frac{1}{\\sqrt{1-x^2}},\\qquad \\frac{d}{dx}\\arctan x=\\frac{1}{1+x^2}$$</div>
        <div class="formula">$$\\int\\frac{dx}{\\sqrt{a^2-x^2}}=\\arcsin\\frac xa+C,\\qquad \\int\\frac{dx}{a^2+x^2}=\\frac1a\\arctan\\frac xa+C$$</div>
      </div>
      <div id="pre-1-3" class="presub">
        <h4>1.3 Fungsi Hiperbolik (hlm. 54)</h4>
        <div class="formula">$$\\sinh x=\\frac{e^x-e^{-x}}{2},\\quad \\cosh x=\\frac{e^x+e^{-x}}{2},\\quad \\cosh^2x-\\sinh^2x=1$$</div>
        <p class="muted">$\\frac{d}{dx}\\sinh x=\\cosh x$, $\\frac{d}{dx}\\cosh x=\\sinh x$, $\\int\\sinh x\\,dx=\\cosh x+C$.</p>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-top:4px">Bab 2 — Teknik Integrasi <span class="muted" style="font-size:13px">(hlm. 69)</span></h3>
      <div id="pre-2-1" class="presub">
        <h4>2.1 Integrasi Parsial dan Fungsi Trigonometri (hlm. 69)</h4>
        <div class="formula">$$\\int u\\,dv=uv-\\int v\\,du$$</div>
        <p class="muted">Urutan memilih $u$: <b>LIATE</b> (Logaritma, Invers trig, Aljabar, Trig, Eksponen). Untuk $\\int\\sin^2,\\int\\cos^2$ pakai identitas sudut ganda.</p>
      </div>
      <div id="pre-2-2" class="presub">
        <h4>2.2 Fungsi Rasional; Pecahan Parsial (hlm. 86)</h4>
        <div class="formula">$$\\frac{1}{(x-a)(x-b)}=\\frac{A}{x-a}+\\frac{B}{x-b}$$</div>
        <p class="muted">Faktor berulang $(x-a)^2$ butuh $\\frac{A}{x-a}+\\frac{B}{(x-a)^2}$.</p>
      </div>
      <div id="pre-2-3" class="presub">
        <h4>2.3 Teknik-Teknik Integrasi yang Lain (hlm. 97)</h4>
        <p class="muted">Substitusi trigonometri: $\\sqrt{a^2-x^2}\\Rightarrow x=a\\sin\\theta$; $\\sqrt{a^2+x^2}\\Rightarrow x=a\\tan\\theta$; $\\sqrt{x^2-a^2}\\Rightarrow x=a\\sec\\theta$.</p>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-top:4px">Bab 3 — Integrasi Numerik &amp; Integrasi Tak Wajar <span class="muted" style="font-size:13px">(hlm. 107)</span></h3>
      <div id="pre-3-1" class="presub">
        <h4>3.1 Integrasi Numerik (hlm. 107)</h4>
        <div class="formula">$$\\text{Trapesium: } \\int_a^b f\\,dx\\approx \\frac{h}{2}\\big(f_0+2f_1+\\dots+2f_{n-1}+f_n\\big)$$</div>
        <div class="formula">$$\\text{Simpson: } \\int_a^b f\\,dx\\approx \\frac{h}{3}\\big(f_0+4f_1+2f_2+\\dots+4f_{n-1}+f_n\\big)$$</div>
      </div>
      <div id="pre-3-2" class="presub">
        <h4>3.2 Integral Tak Wajar (hlm. 121)</h4>
        <div class="formula">$$\\int_1^\\infty \\frac{dx}{x^p}\\ \\text{konvergen} \\iff p>1$$</div>
        <p class="muted">Batas tak hingga atau integran tak terbatas dihitung sebagai limit. <i>Mendasari uji integral &amp; deret-p (6.3).</i></p>
      </div>
      <div id="pre-3-3" class="presub">
        <h4>3.3 Limit Bentuk Tak Tentu — L'Hôpital (hlm. 131)</h4>
        <div class="formula">$$\\text{Bila } \\tfrac{0}{0}\\ \\text{atau}\\ \\tfrac{\\infty}{\\infty}:\\quad \\lim\\frac{f}{g}=\\lim\\frac{f'}{g'}$$</div>
        <p class="muted">Bentuk $0\\cdot\\infty,\\ 1^\\infty,\\ \\infty-\\infty,\\ 0^0$ diubah dulu ke $\\tfrac00$ atau $\\tfrac\\infty\\infty$. <i>Dipakai untuk limit barisan (6.1).</i></p>
      </div>
    </div>
  `;
}

export function renderMaterials(): void {
  const el = document.getElementById('materi')!;
  el.innerHTML = `
    <h2>Ringkasan Materi</h2>
    <p class="muted">Setiap subbab: konsep inti + rumus master + contoh kilat. <b>Arahkan kursor (atau ketuk) sebuah rumus</b> untuk melihat arti tiap simbol. Centang "Saya paham" di bawah tiap bab.</p>

    <div class="card" style="margin-bottom: 20px; border-left: 4px solid var(--acc2);">
      <h3 style="margin-top:0; font-size:16px;">Bahan Belajar & Pembahasan Soal EAS</h3>
      <ul style="margin: 8px 0 0; padding-left: 20px; font-size: 14px;">
        <li><a href="https://youtu.be/NRFA2M6aeRU?si=-7ufdm5R1wIQoVe9" target="_blank">Pembahasan Soal EAS - Part 1</a></li>
        <li><a href="https://youtu.be/yatPC_0DaGQ?si=v9rH8EOke3kz0p5x" target="_blank">Pembahasan Soal EAS - Part 2</a></li>
      </ul>
    </div>

    <div class="subnav" id="matnav">
      <button data-m="b4" class="active">BAB 4 — Aplikasi Integral</button>
      <button data-m="b5">BAB 5 — Parametrik &amp; Kutub</button>
      <button data-m="b6">BAB 6 — Barisan &amp; Deret</button>
    </div>

    <div class="matpage active" id="b4">
      <h3>4.1 Luas Antara Dua Kurva</h3>
      <p>Luas daerah di antara dua kurva = integral dari (kurva atas − kurva bawah).</p>
      ${SVG_AREA_CURVES}
      <div class="formula">$$A=\\int_a^b \\big[f(x)-g(x)\\big]\\,dx \\quad\\text{(irisan vertikal, } f\\ge g)$$</div>
      <div class="formula">$$A=\\int_c^d \\big[w(y)-v(y)\\big]\\,dy \\quad\\text{(irisan horizontal, } w\\ge v)$$</div>
      <ul>
        <li>Langkah: (1) gambar sketsa, (2) cari titik potong sebagai batas, (3) tentukan mana yang atas/kanan, (4) integralkan selisihnya.</li>
        <li>Jika kurva berpotongan/bertukar posisi, <b>pecah</b> integral di titik potong.</li>
      </ul>
      <div class="q" style="margin-top: 15px">
        <div class="qh"><b>Contoh Soal: Luas Antara Dua Kurva</b></div>
        <p>Hitunglah luas daerah yang dibatasi oleh parabola $y = x^2$ dan garis $y = x$.</p>
        <button class="toggle">Lihat Langkah-langkah</button>
        <div class="ans">
          <b>Langkah 1: Cari titik potong (batas integral)</b><br>
          Samakan persamaannya: $x^2 = x \\implies x^2 - x = 0 \\implies x(x - 1) = 0$<br>
          Batas integralnya adalah dari $x = 0$ sampai $x = 1$.<br><br>
          <b>Langkah 2: Tentukan kurva "atas" dan "bawah"</b><br>
          Pilih titik uji antara $0$ dan $1$, misal $x = 0.5$.<br>
          Pada garis: $y = 0.5$<br>
          Pada parabola: $y = 0.5^2 = 0.25$<br>
          Karena $0.5 > 0.25$, maka garis $y = x$ adalah kurva atas, dan $y = x^2$ adalah kurva bawah.<br><br>
          <b>Langkah 3: Hitung integral selisihnya</b><br>
          $$A = \\int_0^1 (x - x^2) \\,dx$$
          $$A = \\left[ \\frac{1}{2}x^2 - \\frac{1}{3}x^3 \\right]_0^1 = \\left( \\frac{1}{2} - \\frac{1}{3} \\right) - 0 = \\frac{1}{6}$$
          Luasnya adalah $\\frac{1}{6}$ satuan luas.
        </div>
      </div>

      <h3>4.2 Volume Benda Putar</h3>
      <p>Tiga metode utama. Pilih sesuai sumbu putar &amp; bentuk daerah.</p>
      ${SVG_VOLUME_DISK}
      <h4>Metode Cakram (Disk)</h4>
      <div class="formula">$$V=\\pi\\int_a^b [R(x)]^2\\,dx$$</div>
      <h4>Metode Cincin (Washer)</h4>
      <div class="formula">$$V=\\pi\\int_a^b \\big([R_{luar}]^2-[R_{dalam}]^2\\big)\\,dx$$</div>
      <h4>Metode Kulit Tabung (Shell)</h4>
      <div class="formula">$$V=2\\pi\\int_a^b (\\text{jari-jari})(\\text{tinggi})\\,dx=2\\pi\\int_a^b x\\,f(x)\\,dx$$</div>
      <div class="warnbox"><span class="tag">Perhatian</span><br>Hati-hati sumbu putar bukan sumbu koordinat. Jari-jari = jarak ke garis itu.</div>
      <div class="q" style="margin-top: 15px; margin-bottom: 15px">
        <div class="qh"><b>Contoh Soal: Volume (Metode Cakram)</b></div>
        <p>Daerah di bawah kurva $y = \\sqrt{x}$ dari $x=0$ sampai $x=4$ diputar mengelilingi sumbu-x. Berapa volumenya?</p>
        <button class="toggle">Lihat Langkah-langkah</button>
        <div class="ans">
          <b>Langkah 1: Identifikasi Jari-jari $R(x)$</b><br>
          Karena diputar pada sumbu-x, dan tidak ada rongga kosong antara sumbu-x dan daerah, kita pakai Metode Cakram. Jari-jari cakram adalah tinggi kurva: $R(x) = \\sqrt{x}$.<br><br>
          <b>Langkah 2: Susun Integral Volume</b><br>
          $$V = \\pi \\int_0^4 [R(x)]^2 \\,dx = \\pi \\int_0^4 (\\sqrt{x})^2 \\,dx = \\pi \\int_0^4 x \\,dx$$
          <br>
          <b>Langkah 3: Evaluasi Integral</b><br>
          $$V = \\pi \\left[ \\frac{x^2}{2} \\right]_0^4 = \\pi \\left( \\frac{16}{2} - 0 \\right) = 8\\pi$$
          Volumenya adalah $8\\pi$.
        </div>
      </div>
      <div class="tip"><b>Bingung pilih metode?</b> Gunakan <a style="cursor:pointer" class="preref" data-goto-fc="true">Flowchart Volume</a> di bawah halaman Materi.<br>
      <b>Video Referensi:</b>
        <a href="https://youtu.be/Ty550_vJPrs?si=lbL0s1w4MnwQx17m" target="_blank">Part 1</a> ·
        <a href="https://youtu.be/8fCFXQHfU2g?si=WYR8mEKhDsB43MJW" target="_blank">Part 2</a> ·
        <a href="https://youtu.be/oRbKkzXo7f8?si=kmQtYne_jBG0U8dZ" target="_blank">Part 3</a>
      </div>

      <h3>4.3 Panjang Suatu Kurva (Arc Length)</h3>
      <div class="prereq"><span class="tag">Prasyarat</span> <a class="preref" data-pre="pre-2-3">2.3 Teknik Integrasi Lain (hlm. 97)</a> — integral bentuk akar.</div>
      <div class="formula">$$L=\\int_a^b \\sqrt{1+\\left(\\dfrac{dy}{dx}\\right)^2}\\,dx$$</div>
      <div class="tip"><b>Contoh.</b> $y=\\tfrac23 x^{3/2}$, $y'=x^{1/2}$, $1+y'^2=1+x$, jadi $L=\\int_0^a\\sqrt{1+x}\\,dx$.<br>
      <b>Video Referensi:</b> <a href="https://youtu.be/K1UgI0yPHOY?si=FqsqeGkXdEYjL4Ib" target="_blank">Panjang Busur</a></div>

      <h3>4.4 Luas Permukaan Benda Putar</h3>
      <div class="prereq"><span class="tag">Prasyarat</span> <a class="preref" data-pre="pre-2-1">2.1 Integrasi Parsial (hlm. 69)</a> · <a class="preref" data-pre="pre-2-3">2.3 Substitusi akar (hlm. 97)</a></div>
      <div class="formula">$$\\text{Putar sumbu-x: } S=2\\pi\\int_a^b y\\sqrt{1+(y')^2}\\,dx$$</div>
      <div class="formula">$$\\text{Putar sumbu-y: } S=2\\pi\\int_a^b x\\sqrt{1+(y')^2}\\,dx$$</div>
      <div class="tip" style="margin-top: 10px;"><b>Video Referensi:</b> <a href="https://youtu.be/8OH4Jt3toQc?si=8Z35QWQFxP7cBDTK" target="_blank">Luas Permukaan Benda Putar</a></div>

      <h3>4.5 Titik Berat (Centroid)</h3>
      <div class="formula">$$\\bar{x}=\\frac{1}{A}\\int_a^b x\\,[f(x)-g(x)]\\,dx$$</div>
      <div class="formula">$$\\bar{y}=\\frac{1}{A}\\int_a^b \\tfrac12\\big([f(x)]^2-[g(x)]^2\\big)\\,dx$$</div>
      <ul>
        <li><b>Teorema Pappus:</b> $V=2\\pi\\bar{d}\\,A$. Cepat untuk soal pilihan ganda.</li>
      </ul>
      <div class="warnbox"><span class="tag">Kesalahan umum BAB 4</span>
        <ul style="margin-bottom:0">
          <li>Lupa menentukan kurva mana yang "atas" sehingga hasil luas negatif.</li>
          <li>Memakai cakram padahal daerah punya lubang (seharusnya cincin).</li>
          <li>Salah jari-jari saat sumbu putar bukan sumbu koordinat.</li>
        </ul>
      </div>
      <div class="card" style="margin-top:18px">
        <div class="chk" data-key="mat-b4"><input type="checkbox" id="mat-b4" ${state['mat-b4'] ? 'checked' : ''}><label for="mat-b4">Saya paham BAB 4 (bisa pilih metode volume yang tepat &amp; hitung tanpa contekan)</label></div>
      </div>

      <h3 style="margin-top:30px">Flowchart: Metode Volume Mana yang Dipilih?</h3>
      <div id="fc-volume"></div>
    </div>

    <div class="matpage" id="b5">
      <h3>5.1 Persamaan Parametrik</h3>
      <div class="formula">$$\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt},\\qquad \\frac{d^2y}{dx^2}=\\frac{d}{dt}\\!\\left(\\frac{dy}{dx}\\right)\\Big/\\frac{dx}{dt}$$</div>
      <div class="formula">$$L=\\int_{t_1}^{t_2}\\sqrt{\\left(\\tfrac{dx}{dt}\\right)^2+\\left(\\tfrac{dy}{dt}\\right)^2}\\,dt$$</div>
      <div class="tip" style="margin-top: 10px;"><b>Video Referensi:</b> <a href="https://youtu.be/mB_Bz7o6etY?si=kuX3b02JQoL-B8tw" target="_blank">Panjang Busur Kurva Parametrik</a></div>

      <h3>5.2 Koordinat Kutub</h3>
      <div class="formula">$$x=r\\cos\\theta,\\quad y=r\\sin\\theta,\\quad r^2=x^2+y^2,\\quad \\tan\\theta=\\frac{y}{x}$$</div>
      <div class="tip" style="margin-top: 10px;"><b>Video Referensi:</b> <a href="https://youtu.be/vxfzQCLSuVY?si=crQNQsZ6RmR7RaWH" target="_blank">Pengenalan Koordinat Kutub</a></div>

      <h3>5.3 Grafik dalam Koordinat Kutub</h3>
      ${SVG_POLAR_CARDIOID}
      <table>
        <tr><th>Persamaan</th><th>Bentuk</th></tr>
        <tr><td>$r=a$</td><td>Lingkaran pusat O, jari-jari $a$</td></tr>
        <tr><td>$r=a\\cos\\theta$ / $r=a\\sin\\theta$</td><td>Lingkaran lewat titik asal</td></tr>
        <tr><td>$r=a\\pm b\\cos\\theta$ ($a=b$)</td><td>Kardioid</td></tr>
        <tr><td>$r=a\\pm b\\cos\\theta$ ($a<b$)</td><td>Limaçon berloop</td></tr>
        <tr><td>$r=a\\cos(n\\theta)$</td><td>Mawar: $n$ ganjil → $n$ daun, $n$ genap → $2n$ daun</td></tr>
        <tr><td>$r^2=a^2\\cos(2\\theta)$</td><td>Lemniskat</td></tr>
      </table>

      <h3>5.4 Luas dalam Koordinat Kutub</h3>
      <div class="prereq"><span class="tag">Prasyarat</span> <a class="preref" data-pre="pre-2-1">2.1 Integral $\\sin^2,\\cos^2$ (hlm. 69)</a></div>
      <div class="formula">$$A=\\frac12\\int_\\alpha^\\beta r^2\\,d\\theta$$</div>
      <div class="formula">$$A_{\\text{antar kurva}}=\\frac12\\int_\\alpha^\\beta \\big(r_{luar}^2-r_{dalam}^2\\big)\\,d\\theta$$</div>
      <div class="q" style="margin-top: 15px">
        <div class="qh"><b>Contoh Soal: Luas Kutub (Satu Daun Mawar)</b></div>
        <p>Tentukan luas satu daun mawar dari persamaan $r = \\cos(2\\theta)$.</p>
        <button class="toggle">Lihat Langkah-langkah</button>
        <div class="ans">
          <b>Langkah 1: Tentukan batas $\\theta$</b><br>
          Daun mawar terbentuk ketika $r$ bergerak dari $0$ kembali ke $0$.<br>
          $r = \\cos(2\\theta) = 0 \\implies 2\\theta = -\\frac{\\pi}{2}$ dan $2\\theta = \\frac{\\pi}{2}$.<br>
          Maka batasnya adalah $\\theta = -\\frac{\\pi}{4}$ sampai $\\theta = \\frac{\\pi}{4}$.<br><br>
          <b>Langkah 2: Susun Integral Luas</b><br>
          $$A = \\frac{1}{2} \\int_{-\\pi/4}^{\\pi/4} [\\cos(2\\theta)]^2 \\,d\\theta$$
          Karena simetris, kita bisa hitung dari $0$ sampai $\\frac{\\pi}{4}$ lalu kalikan 2:<br>
          $$A = 2 \\times \\frac{1}{2} \\int_0^{\\pi/4} \\cos^2(2\\theta) \\,d\\theta = \\int_0^{\\pi/4} \\frac{1 + \\cos(4\\theta)}{2} \\,d\\theta$$
          <br>
          <b>Langkah 3: Evaluasi Integral</b><br>
          $$A = \\frac{1}{2} \\left[ \\theta + \\frac{\\sin(4\\theta)}{4} \\right]_0^{\\pi/4} = \\frac{1}{2} \\left( \\frac{\\pi}{4} + 0 - 0 \\right) = \\frac{\\pi}{8}$$
          Luas satu daun adalah $\\frac{\\pi}{8}$.
        </div>
      </div>
      <div class="tip"><b>Video Referensi:</b> <a href="https://youtu.be/_QwJYVBnUfU?si=EmZVpAu7pxReO8i8" target="_blank">Luas Dalam Koordinat Kutub</a></div>

      <h3>5.5 Garis Singgung &amp; Panjang Busur Kutub</h3>
      <div class="formula">$$\\frac{dy}{dx}=\\frac{r'\\sin\\theta+r\\cos\\theta}{r'\\cos\\theta-r\\sin\\theta}$$</div>
      <div class="formula">$$L=\\int_\\alpha^\\beta \\sqrt{r^2+\\left(\\tfrac{dr}{d\\theta}\\right)^2}\\,d\\theta$$</div>
      <div class="tip" style="margin-top: 10px;"><b>Video Referensi:</b> <a href="https://youtu.be/TBOwaSgtG9U?si=vIcsyWB4lWAHnce0" target="_blank">Garis Singgung dalam Koordinat Kutub</a></div>
      <div class="warnbox"><span class="tag">Kesalahan umum BAB 5</span>
        <ul style="margin-bottom:0">
          <li>Salah batas $\\theta$ untuk satu daun mawar (gunakan $r=0$ sebagai batas).</li>
          <li>Lupa faktor $\\tfrac12$ pada luas kutub.</li>
          <li>Tertukar antara $\\sqrt{r^2+r'^2}$ (busur kutub) dan $\\sqrt{1+y'^2}$ (busur Cartesius).</li>
        </ul>
      </div>
      <div class="card" style="margin-top:18px">
        <div class="chk" data-key="mat-b5"><input type="checkbox" id="mat-b5" ${state['mat-b5'] ? 'checked' : ''}><label for="mat-b5">Saya paham BAB 5 (bisa sketsa grafik kutub &amp; hitung luas/busur)</label></div>
      </div>
    </div>

    <div class="matpage" id="b6">
      <h3>6.1 Barisan Tak Hingga</h3>
      <div class="prereq"><span class="tag">Prasyarat</span> <a class="preref" data-pre="pre-3-3">3.3 L'Hôpital (hlm. 131)</a></div>
      ${SVG_SERIES_CONV}
      <p>Barisan $\\{a_n\\}$ konvergen jika $\\lim_{n\\to\\infty}a_n=L$ ada (berhingga). Ingat: $\\lim (1+\\tfrac{x}{n})^n=e^x$.</p>

      <h3>6.2 Deret Tak Hingga</h3>
      <div class="formula">$$\\text{Geometri: } \\sum_{n=0}^\\infty ar^n=\\frac{a}{1-r}\\ \\ (|r|<1)$$</div>
      <div class="formula">$$\\text{Teleskopik: } \\sum (b_n-b_{n+1})=b_1-\\lim b_{n+1}$$</div>
      <div class="warnbox"><span class="tag">Perhatian — uji suku ke-n</span><br>Jika $\\lim a_n\\ne 0$ maka deret <b>divergen</b>. Tapi $\\lim a_n=0$ <b>tidak</b> menjamin konvergen!</div>
      <div class="tip"><b>Video Referensi Barisan & Deret Tak Hingga:</b>
        <a href="https://youtu.be/S8MctLVnZxA?si=5UW8jHbDAtOtbslD" target="_blank">Part 1</a> ·
        <a href="https://youtu.be/gWa6rcvWV6k?si=Ke1zKuAuMYcZdZDa" target="_blank">Part 2</a> ·
        <a href="https://youtu.be/GZwZ0Xdu8wE?si=0o9LyxVa6soatHqD" target="_blank">Part 3</a>
      </div>

      <h3>6.3 Uji Konvergensi</h3>
      <div class="prereq"><span class="tag">Prasyarat</span> <a class="preref" data-pre="pre-3-2">3.2 Integral Tak Wajar (hlm. 121)</a></div>
      <table>
        <tr><th>Uji</th><th>Cocok untuk</th><th>Kesimpulan</th></tr>
        <tr><td>Suku ke-n</td><td>Cek cepat</td><td>$\\lim a_n\\ne0$ → divergen</td></tr>
        <tr><td>Deret-p</td><td>$\\sum 1/n^p$</td><td>Konvergen jika $p>1$</td></tr>
        <tr><td>Geometri</td><td>$\\sum ar^n$</td><td>Konvergen jika $|r|<1$</td></tr>
        <tr><td>Integral</td><td>$a_n=f(n)$ positif, turun</td><td>Deret &amp; $\\int f$ sependapat</td></tr>
        <tr><td>Banding / Banding Limit</td><td>Mirip deret-p / geometri</td><td>Bandingkan dgn deret acuan</td></tr>
        <tr><td>Rasio</td><td>Ada faktorial / $r^n$</td><td>$L<1$ konv, $L>1$ div</td></tr>
        <tr><td>Akar</td><td>Ada pangkat $n$</td><td>$L<1$ konv</td></tr>
        <tr><td>Leibniz</td><td>$\\sum(-1)^n b_n$</td><td>$b_n$ turun &amp; $\\to0$ → konv</td></tr>
      </table>
      <div class="q" style="margin-top: 15px; margin-bottom: 15px">
        <div class="qh"><b>Contoh Soal: Uji Rasio (Mencari Konvergensi)</b></div>
        <p>Apakah deret $\\sum_{n=1}^\\infty \\frac{n^2}{2^n}$ konvergen atau divergen?</p>
        <button class="toggle">Lihat Langkah-langkah</button>
        <div class="ans">
          <b>Langkah 1: Identifikasi bentuk deret</b><br>
          Karena ada faktor eksponensial $2^n$ di penyebut, uji rasio sangat cocok.<br><br>
          <b>Langkah 2: Terapkan Uji Rasio</b><br>
          Cari nilai $L = \\lim_{n\\to\\infty} \\left| \\frac{a_{n+1}}{a_n} \\right|$<br>
          $$L = \\lim_{n\\to\\infty} \\left| \\frac{(n+1)^2 / 2^{n+1}}{n^2 / 2^n} \\right|$$
          $$L = \\lim_{n\\to\\infty} \\frac{(n+1)^2}{n^2} \\cdot \\frac{2^n}{2^{n+1}}$$
          $$L = \\lim_{n\\to\\infty} \\left(1 + \\frac{1}{n}\\right)^2 \\cdot \\frac{1}{2}$$
          <br>
          <b>Langkah 3: Simpulkan</b><br>
          Karena $(1 + 0)^2 = 1$, maka $L = 1 \\cdot \\frac{1}{2} = \\frac{1}{2}$.<br>
          Karena $L < 1$, menurut Uji Rasio, deret tersebut <b>Konvergen Absolut</b>.
        </div>
      </div>
      <div class="tip"><b>Bingung pilih uji?</b> Gunakan <a style="cursor:pointer" class="preref" data-goto-fc2="true">Flowchart Uji Konvergensi</a> di bawah.</div>

      <h3>6.4 Deret Pangkat; Taylor &amp; Maclaurin</h3>
      <div class="prereq"><span class="tag">Prasyarat</span> <a class="preref" data-pre="pre-1-1">1.1 Turunan $e^x,\\ln x$ (hlm. 1)</a> · <a class="preref" data-pre="pre-1-2">1.2 Invers Trigonometri (hlm. 33)</a></div>
      <div class="formula">$$\\text{Taylor: } f(x)=\\sum_{n=0}^\\infty \\frac{f^{(n)}(a)}{n!}(x-a)^n$$</div>
      <table>
        <tr><th>Fungsi</th><th>Deret Maclaurin</th><th>Berlaku</th></tr>
        <tr><td>$e^x$</td><td>$\\sum \\frac{x^n}{n!}$</td><td>semua $x$</td></tr>
        <tr><td>$\\sin x$</td><td>$\\sum \\frac{(-1)^n x^{2n+1}}{(2n+1)!}$</td><td>semua $x$</td></tr>
        <tr><td>$\\cos x$</td><td>$\\sum \\frac{(-1)^n x^{2n}}{(2n)!}$</td><td>semua $x$</td></tr>
        <tr><td>$\\frac{1}{1-x}$</td><td>$\\sum x^n$</td><td>$|x|<1$</td></tr>
        <tr><td>$\\ln(1+x)$</td><td>$\\sum \\frac{(-1)^{n+1}x^n}{n}$</td><td>$-1<x\\le1$</td></tr>
        <tr><td>$\\arctan x$</td><td>$\\sum \\frac{(-1)^n x^{2n+1}}{2n+1}$</td><td>$|x|\\le1$</td></tr>
      </table>
      <div class="warnbox"><span class="tag">Kesalahan umum BAB 6</span>
        <ul style="margin-bottom:0">
          <li>Menyimpulkan konvergen hanya karena $\\lim a_n=0$.</li>
          <li>Lupa mengecek kedua ujung interval konvergensi.</li>
          <li>Salah menyebut konvergen mutlak padahal hanya bersyarat.</li>
        </ul>
      </div>
      <div class="card" style="margin-top:18px">
        <div class="chk" data-key="mat-b6"><input type="checkbox" id="mat-b6" ${state['mat-b6'] ? 'checked' : ''}><label for="mat-b6">Saya paham BAB 6 (bisa pilih uji konvergensi tepat &amp; turunkan deret Taylor)</label></div>
      </div>

      <h3 style="margin-top:30px">Flowchart: Uji Konvergensi Mana yang Dipilih?</h3>
      <div id="fc-convergence"></div>
    </div>
  `;
}

export function renderFormulaSheet(): void {
  const el = document.getElementById('rumus')!;
  el.innerHTML = `
    <h2>Lembar Rumus</h2>
    <p class="muted">Semua rumus master dalam satu halaman untuk review cepat sebelum ujian.</p>

    <div class="card"><h3 style="margin-top:4px">BAB 4 — Aplikasi Integral</h3>
      <div class="formula">$$A=\\int_a^b [f(x)-g(x)]\\,dx \\quad (f\\ge g)$$</div>
      <div class="formula">$$V_{\\text{cakram}}=\\pi\\int_a^b [R(x)]^2 dx,\\quad V_{\\text{cincin}}=\\pi\\int_a^b ([R]^2-[r]^2)\\,dx$$</div>
      <div class="formula">$$V_{\\text{kulit}}=2\\pi\\int_a^b x\\,f(x)\\,dx$$</div>
      <div class="formula">$$L=\\int_a^b\\sqrt{1+(y')^2}\\,dx,\\qquad S=2\\pi\\int_a^b y\\sqrt{1+(y')^2}\\,dx$$</div>
      <div class="formula">$$\\bar x=\\tfrac1A\\int x(f-g)\\,dx,\\quad \\bar y=\\tfrac1A\\int \\tfrac12(f^2-g^2)\\,dx,\\quad V=2\\pi\\bar d\\,A$$</div>
    </div>

    <div class="card"><h3 style="margin-top:4px">BAB 5 — Parametrik &amp; Kutub</h3>
      <div class="formula">$$\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt},\\qquad L=\\int_{t_1}^{t_2}\\sqrt{\\dot x^2+\\dot y^2}\\,dt$$</div>
      <div class="formula">$$x=r\\cos\\theta,\\ y=r\\sin\\theta,\\ r^2=x^2+y^2,\\ \\tan\\theta=\\tfrac yx$$</div>
      <div class="formula">$$A=\\tfrac12\\int_\\alpha^\\beta r^2\\,d\\theta,\\qquad L=\\int_\\alpha^\\beta\\sqrt{r^2+(r')^2}\\,d\\theta$$</div>
    </div>

    <div class="card"><h3 style="margin-top:4px">BAB 6 — Barisan &amp; Deret</h3>
      <div class="formula">$$\\sum_{n=0}^\\infty ar^n=\\frac{a}{1-r}\\ (|r|<1),\\qquad \\text{deret-p konvergen} \\iff p>1$$</div>
      <div class="formula">$$\\text{Rasio: } L=\\lim\\left|\\frac{a_{n+1}}{a_n}\\right|,\\qquad \\text{Akar: } L=\\lim\\sqrt[n]{|a_n|}$$</div>
      <div class="formula">$$f(x)=\\sum_{n=0}^\\infty \\frac{f^{(n)}(a)}{n!}(x-a)^n$$</div>
      <div class="formula">$$e^x=\\sum\\frac{x^n}{n!},\\quad \\sin x=\\sum\\frac{(-1)^n x^{2n+1}}{(2n+1)!},\\quad \\cos x=\\sum\\frac{(-1)^n x^{2n}}{(2n)!}$$</div>
      <div class="formula">$$\\frac1{1-x}=\\sum x^n,\\quad \\ln(1+x)=\\sum\\frac{(-1)^{n+1}x^n}{n},\\quad \\arctan x=\\sum\\frac{(-1)^n x^{2n+1}}{2n+1}$$</div>
    </div>
  `;
}

export function renderBenchmarks(): void {
  const el = document.getElementById('tolakukur')!;
  el.innerHTML = `
    <h2>Tolak Ukur Keberhasilan</h2>
    <p class="muted">Indikator terukur. Centang yang sudah tercapai — target minimal lulus: <b>minimal 80% tercentang</b>.</p>
    <div class="progwrap"><div class="progbar" id="tubar"></div></div>
    <p class="muted" id="tucount" style="margin-top:0"></p>

    <div class="card" id="tu-list">
      ${benchmarks.map(t => {
        const done = state[t[0]] ? 'done' : '';
        return `<div class="chk ${done}" data-key="${t[0]}">
          <input type="checkbox" id="${t[0]}" ${state[t[0]] ? 'checked' : ''}>
          <label for="${t[0]}">${t[1]}</label></div>`;
      }).join('')}
    </div>

    <div class="card">
      <h3 style="margin-top:4px">Skala penilaian kesiapan</h3>
      <table>
        <tr><th>% Tercapai</th><th>Status</th><th>Tindakan</th></tr>
        <tr><td>90–100%</td><td><b style="color:var(--ok)">Siap tempur</b></td><td>Tidur cukup, review rumus + 2 soal pemanasan.</td></tr>
        <tr><td>75–89%</td><td><b style="color:var(--warn)">Cukup siap</b></td><td>Fokus tambal 1–2 topik terlemah.</td></tr>
        <tr><td>60–74%</td><td><b style="color:var(--warn)">Waspada</b></td><td>Prioritaskan BAB berbobot tinggi (4 &amp; 6).</td></tr>
        <tr><td>&lt;60%</td><td><b style="color:var(--bad)">Mode triase</b></td><td>Kuasai rumus master + soal mudah-sedang. Jangan nol di topik manapun.</td></tr>
      </table>
    </div>
  `;
}

export function buildFormulaExp(): void {
  document.querySelectorAll('#materi .formula').forEach(f => {
    const el = f as HTMLElement;
    if (el.dataset.fx) return;
    const exp = explainFor(el.textContent || '');
    if (!exp) return;
    el.dataset.fx = '1';
    const wrap = document.createElement('div');
    wrap.className = 'fwrap';
    el.parentNode!.insertBefore(wrap, el);
    wrap.appendChild(el);
    const e = document.createElement('div');
    e.className = 'fexp';
    e.innerHTML = '<span class="tag">Arti rumus</span> ' + exp + ' <span class="fhint">(klik untuk menyematkan)</span>';
    wrap.appendChild(e);
    el.addEventListener('click', () => wrap.classList.toggle('show'));
  });
}
