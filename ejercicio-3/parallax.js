/* =========================================================================
   PyCon Colombia 2028 — Escena parallax de la selva amazónica
   -------------------------------------------------------------------------
   Cada capa (div.layer) recibe un SVG dibujado aquí con formas geométricas
   planas, inspiradas en el moodboard (bosques por capas, jaguar low-poly,
   tucán, capibaras, mariposas de línea dorada).

   - data-depth  → cuánto se desplaza la capa con el mouse.
   - data-scroll → cuánto baja (o sube, si es negativo) la capa con el scroll.
   Al hacer scroll la "cámara" sube sobre el dosel y el día se vuelve noche.
   ========================================================================= */
(() => {
    const C = {
        teal: '#3FB0AC', orange: '#F39419', deep: '#17454B', pink: '#E8336F',
        green: '#1E6B44', cream: '#FBF8EA', gold: '#F3B53A',
        tealL: '#A6DCD2', tealM: '#62C1B7', tealD: '#2F978F',
        lime: '#B9CF5A', limeD: '#8DB04A', greenM: '#2E8A55', greenL: '#4FA66A',
        deepD: '#0E3236', bark: '#6B3A22', capy: '#C86B3C', capyD: '#9A4B2A',
        orangeD: '#D9771A', orangeL: '#F7AE4C', navy: '#1C3D6B'
    };
    const NS = 'http://www.w3.org/2000/svg';
    const W = 1600, H = 1000;

    // Generador pseudoaleatorio con semilla: la selva siempre se dibuja igual.
    const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const f = (n) => Math.round(n * 10) / 10;

    function mount(id, inner, { anchor = 'bottom' } = {}) {
        const host = document.getElementById(id);
        if (!host) return;
        host.innerHTML =
            `<svg xmlns="${NS}" viewBox="0 0 ${W} ${H}" data-anchor="${anchor}" ` +
            `preserveAspectRatio="xMidYMax slice">${inner}</svg>`;
    }

    /* ---------------------------------------------------------------- */
    /*  Piezas reutilizables                                             */
    /* ---------------------------------------------------------------- */

    // Pino geométrico de tres pisos con faceta de luz/sombra (moodboard)
    function conifer(x, y, h, c1, c2) {
        let s = `<rect x="${f(x - h * 0.03)}" y="${f(y - h * 0.2)}" width="${f(h * 0.06)}" height="${f(h * 0.2)}" fill="${C.bark}"/>`;
        for (let i = 0; i < 3; i++) {
            const top = y - h + i * h * 0.24;
            const base = top + h * 0.42;
            const w = h * (0.2 + i * 0.07);
            s += `<polygon points="${f(x)},${f(top)} ${f(x - w)},${f(base)} ${f(x)},${f(base)}" fill="${c1}"/>`;
            s += `<polygon points="${f(x)},${f(top)} ${f(x + w)},${f(base)} ${f(x)},${f(base)}" fill="${c2}"/>`;
        }
        return s;
    }

    // Árbol redondo con media luna de sombra
    function roundTree(x, y, h, c1, c2) {
        const r = h * 0.32, cy = y - h + r;
        return `<rect x="${f(x - 3)}" y="${f(cy)}" width="6" height="${f(y - cy)}" fill="${C.bark}"/>` +
            `<circle cx="${f(x)}" cy="${f(cy)}" r="${f(r)}" fill="${c1}"/>` +
            `<path d="M${f(x)} ${f(cy - r)} A${f(r)} ${f(r)} 0 0 1 ${f(x)} ${f(cy + r)} Z" fill="${c2}"/>`;
    }

    // Árbol tipo "chupeta" con pisos ovalados (como el poster de bosque del moodboard)
    function tieredTree(x, y, h, c1, c2) {
        let s = `<rect x="${f(x - 2.5)}" y="${f(y - h * 0.9)}" width="5" height="${f(h * 0.9)}" fill="${C.bark}"/>`;
        for (let i = 0; i < 4; i++) {
            const cy = y - h + i * h * 0.17 + h * 0.08;
            const rx = h * (0.1 + i * 0.035);
            s += `<ellipse cx="${f(x)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(h * 0.075)}" fill="${i % 2 ? c2 : c1}"/>`;
        }
        return s;
    }

    // Palma con hojas en abanico
    function palm(x, y, h, c1, c2, lean = 1) {
        const tx = x + lean * h * 0.18, ty = y - h;
        let s = `<path d="M${f(x)} ${f(y)} Q${f(x + lean * h * 0.02)} ${f(y - h * 0.6)} ${f(tx)} ${f(ty)}" stroke="${C.bark}" stroke-width="${f(h * 0.035)}" fill="none" stroke-linecap="round"/>`;
        const angles = [-160, -125, -90, -55, -20, 15, 195];
        angles.forEach((a, i) => {
            const len = h * (0.38 + (i % 2) * 0.08);
            s += leaf(tx, ty, len, a + lean * 4, len * 0.18, i % 2 ? c1 : c2, null);
        });
        return s;
    }

    // Hoja: base en (x,y), punta a "len" con ángulo "ang". Mitad superior más oscura = faceta.
    function leaf(x, y, len, ang, w, fill, shade, rib = true) {
        let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})">` +
            `<path d="M0 0 Q${f(len * 0.35)} ${f(-w)} ${f(len)} 0 Q${f(len * 0.35)} ${f(w)} 0 0Z" fill="${fill}"/>`;
        if (shade) s += `<path d="M0 0 Q${f(len * 0.35)} ${f(-w)} ${f(len)} 0Z" fill="${shade}"/>`;
        if (rib) s += `<path d="M0 0 L${f(len * 0.92)} 0" stroke="${C.cream}" stroke-opacity=".22" stroke-width="${f(Math.max(1.2, w * 0.06))}"/>`;
        return s + '</g>';
    }

    // Ceiba / kapok: árbol emergente de la Amazonía, con raíces tablares
    function ceiba(x, y, h, crown1, crown2, crown3) {
        const tw = h * 0.05;
        let s = `<polygon points="${f(x - tw * 3)},${f(y)} ${f(x - tw * 0.8)},${f(y - h * 0.18)} ${f(x - tw * 0.6)},${f(y - h * 0.78)} ${f(x + tw * 0.6)},${f(y - h * 0.78)} ${f(x + tw * 0.8)},${f(y - h * 0.18)} ${f(x + tw * 3)},${f(y)}" fill="${C.bark}"/>`;
        s += `<polygon points="${f(x)},${f(y - h * 0.78)} ${f(x + tw * 0.6)},${f(y - h * 0.78)} ${f(x + tw * 0.8)},${f(y - h * 0.18)} ${f(x + tw * 3)},${f(y)} ${f(x + tw * 0.4)},${f(y)}" fill="#55301C"/>`;
        // ramas
        s += `<path d="M${f(x)} ${f(y - h * 0.7)} L${f(x - h * 0.28)} ${f(y - h * 0.86)} M${f(x)} ${f(y - h * 0.72)} L${f(x + h * 0.3)} ${f(y - h * 0.88)} M${f(x)} ${f(y - h * 0.76)} L${f(x + h * 0.02)} ${f(y - h * 0.94)}" stroke="${C.bark}" stroke-width="${f(tw * 0.7)}" stroke-linecap="round"/>`;
        // copa plana en pisos
        s += `<ellipse cx="${f(x - h * 0.26)}" cy="${f(y - h * 0.9)}" rx="${f(h * 0.2)}" ry="${f(h * 0.06)}" fill="${crown2}"/>`;
        s += `<ellipse cx="${f(x + h * 0.28)}" cy="${f(y - h * 0.92)}" rx="${f(h * 0.22)}" ry="${f(h * 0.065)}" fill="${crown2}"/>`;
        s += `<ellipse cx="${f(x)}" cy="${f(y - h * 0.97)}" rx="${f(h * 0.32)}" ry="${f(h * 0.075)}" fill="${crown1}"/>`;
        s += `<ellipse cx="${f(x + h * 0.05)}" cy="${f(y - h * 1.01)}" rx="${f(h * 0.2)}" ry="${f(h * 0.045)}" fill="${crown3}"/>`;
        return s;
    }

    // Heliconia: flor zigzag rosa/naranja
    function heliconia(x, y, h, lean = 0) {
        let s = `<path d="M${f(x)} ${f(y)} Q${f(x + lean * 30)} ${f(y - h * 0.5)} ${f(x + lean * 20)} ${f(y - h)}" stroke="${C.green}" stroke-width="6" fill="none"/>`;
        for (let i = 0; i < 6; i++) {
            const py = y - h + i * h * 0.12;
            const px = x + lean * 20 + lean * i * 2;
            const dir = i % 2 ? 1 : -1;
            const col = i % 2 ? C.pink : C.orange;
            s += `<polygon points="${f(px)},${f(py)} ${f(px + dir * h * 0.16)},${f(py - h * 0.05)} ${f(px)},${f(py + h * 0.09)}" fill="${col}"/>`;
            s += `<polygon points="${f(px)},${f(py)} ${f(px + dir * h * 0.16)},${f(py - h * 0.05)} ${f(px + dir * h * 0.05)},${f(py + h * 0.02)}" fill="${C.gold}" opacity=".55"/>`;
        }
        return s;
    }

    function fern(x, y, size, color, flip = 1) {
        let s = '';
        for (let i = 0; i < 7; i++) {
            const a = -170 + i * 26;
            s += leaf(x, y, size * (0.7 + (i % 3) * 0.15), flip > 0 ? a : -180 - a, size * 0.09, color, null, false);
        }
        return s;
    }

    function grassTuft(x, y, h, color) {
        let s = '';
        for (let i = -3; i <= 3; i++) {
            s += `<path d="M${f(x + i * 3)} ${f(y)} Q${f(x + i * 6)} ${f(y - h * 0.6)} ${f(x + i * 11)} ${f(y - h * (1 - Math.abs(i) * 0.1))}" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
        }
        return s;
    }

    /* ---------------------------------------------------------------- */
    /*  Capas                                                            */
    /* ---------------------------------------------------------------- */

    function drawStars() {
        const r = seeded(7);
        let s = '';
        for (let i = 0; i < 140; i++) {
            const x = r() * W, y = r() * H * 0.62, rad = r() * 1.6 + 0.4;
            s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill="${C.cream}" opacity="${f(0.4 + r() * 0.6)}" class="${i % 5 ? '' : 'twinkle'}" style="animation-delay:${f(r() * 4)}s"/>`;
        }
        const host = document.getElementById('layer-stars');
        host.innerHTML = `<svg xmlns="${NS}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
    }

    function drawSunMoon() {
        document.getElementById('layer-sun').innerHTML = `
        <svg class="sun" viewBox="0 0 200 200" xmlns="${NS}">
            <defs><radialGradient id="sunG"><stop offset="0" stop-color="#FFF6D6"/><stop offset="1" stop-color="#FFD98A"/></radialGradient></defs>
            <circle cx="100" cy="100" r="96" fill="${C.cream}" opacity=".25"/>
            <circle cx="100" cy="100" r="80" fill="${C.cream}" opacity=".35"/>
            <circle cx="100" cy="100" r="60" fill="url(#sunG)"/>
        </svg>`;
        document.getElementById('layer-moon').innerHTML = `
        <svg class="moon" viewBox="0 0 200 200" xmlns="${NS}">
            <circle cx="100" cy="100" r="98" fill="${C.cream}" opacity=".08"/>
            <circle cx="100" cy="100" r="78" fill="${C.cream}" opacity=".12"/>
            <circle cx="100" cy="100" r="56" fill="#F6F0D2"/>
            <circle cx="82" cy="88" r="10" fill="#E6DDB5"/><circle cx="118" cy="114" r="7" fill="#E6DDB5"/><circle cx="110" cy="80" r="4" fill="#E6DDB5"/>
        </svg>`;
    }

    // Tepuyes (mesetas amazónicas) + bruma + aves
    function drawTepuis() {
        let s = `<defs>
            <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="${C.cream}" stop-opacity="0"/>
                <stop offset="1" stop-color="${C.cream}" stop-opacity=".75"/>
            </linearGradient></defs>`;
        // colinas lejanas
        s += `<path d="M0 560 Q120 500 240 540 T480 520 T760 545 T1040 515 T1320 540 T1600 520 V${H} H0Z" fill="#C3E6DE"/>`;
        const mesas = [[60, 260, 360], [380, 200, 420], [930, 300, 330], [1260, 230, 400]];
        mesas.forEach(([x, w, top]) => {
            s += `<polygon points="${x},600 ${x + 26},${top} ${x + w - 30},${top + 8} ${x + w},600" fill="${C.tealL}"/>`;
            s += `<polygon points="${x + w * 0.62},${top + 5} ${x + w - 30},${top + 8} ${x + w},600 ${x + w * 0.7},600" fill="#8BCFC4"/>`;
            s += `<rect x="${x + w * 0.38}" y="${top + 8}" width="4" height="${600 - top - 30}" fill="${C.cream}" opacity=".7"/>`;
        });
        s += `<rect x="0" y="600" width="${W}" height="${H - 600}" fill="#B4E0D6"/>`;
        s += `<rect x="0" y="470" width="${W}" height="170" fill="url(#mist)"/>`;
        // aves
        [[640, 300, 1], [700, 270, .8], [760, 320, .9], [1180, 220, .7], [1220, 250, .6]].forEach(([x, y, k]) => {
            s += `<path class="bird" d="M${x} ${y} q${10 * k} ${-10 * k} ${20 * k} 0 q${10 * k} ${-10 * k} ${20 * k} 0" stroke="${C.deep}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".55"/>`;
        });
        mount('layer-tepuis', s);
    }

    // Dosel lejano en tonos turquesa
    function drawCanopy() {
        const r = seeded(21);
        let s = '';
        const rows = [
            { y: 612, rMin: 26, rMax: 48, cols: [C.tealM, '#58BBAE', '#6FC7BC'] },
            { y: 646, rMin: 30, rMax: 54, cols: [C.teal, '#47AFA0', '#3DA597'] }
        ];
        rows.forEach((row, ri) => {
            if (ri === 1) s += `<rect x="0" y="650" width="${W}" height="${H - 650}" fill="#3FA596"/>`;
            for (let x = -40; x < W + 60; x += 30 + r() * 26) {
                const rad = row.rMin + r() * (row.rMax - row.rMin);
                s += `<circle cx="${f(x)}" cy="${f(row.y + r() * 18)}" r="${f(rad)}" fill="${row.cols[Math.floor(r() * 3)]}"/>`;
            }
            if (ri === 0) s += `<rect x="0" y="625" width="${W}" height="40" fill="#5DBDB0"/>`;
        });
        // emergentes lejanos
        s += ceiba(330, 640, 230, '#6FC7BC', '#5DBDB0', '#86D0C6');
        s += ceiba(1300, 650, 200, '#6FC7BC', '#5DBDB0', '#86D0C6');
        s += palm(560, 640, 150, '#4FB4A6', '#5DBDB0', -1);
        s += palm(1060, 640, 170, '#4FB4A6', '#5DBDB0', 1);
        mount('layer-canopy', s);
    }

    // Río serpenteante con nenúfares y canoa (moodboard)
    function drawRiver() {
        let s = `<defs>
            <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#5DB27A"/><stop offset="1" stop-color="${C.greenM}"/>
            </linearGradient>
            <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#BFE7DF"/><stop offset=".5" stop-color="${C.tealM}"/><stop offset="1" stop-color="${C.teal}"/>
            </linearGradient></defs>`;
        s += `<path d="M0 672 Q200 650 420 668 T820 662 T1220 670 T1600 660 V${H} H0Z" fill="url(#ground)"/>`;

        const N = 70, left = [], right = [], center = [];
        for (let i = 0; i <= N; i++) {
            const t = i / N;
            const x = 800 + Math.sin(t * 5.4 + 0.6) * (40 + t * 170);
            const y = 664 + t * (H - 664 + 20);
            const w = 4 + t * 40 + t * t * 230;
            left.push([x - w, y]); right.push([x + w, y]); center.push([x, y, w]);
        }
        const poly = (pts) => pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' ');
        // orilla (sombra) + agua
        const bank = (k) => poly(left.map(([x, y], i) => [x - k * (i / N), y]).concat(right.map(([x, y], i) => [x + k * (i / N), y]).reverse()));
        s += `<polygon points="${bank(26)}" fill="#2A7F63"/>`;
        s += `<polygon points="${bank(0)}" fill="url(#water)"/>`;
        // reflejos
        [0.18, 0.3, 0.42, 0.55, 0.68, 0.8, 0.9].forEach((t, i) => {
            const [x, y, w] = center[Math.round(t * N)];
            const len = w * (0.5 + (i % 3) * 0.15);
            s += `<path d="M${f(x - len / 2 + (i % 2 ? w * 0.2 : -w * 0.2))} ${f(y)} h${f(len)}" stroke="${C.cream}" stroke-opacity=".55" stroke-width="${f(2 + t * 4)}" stroke-linecap="round"/>`;
        });
        // nenúfares
        const r = seeded(11);
        for (let i = 0; i < 16; i++) {
            const t = 0.45 + r() * 0.52;
            const [x, y, w] = center[Math.round(t * N)];
            const side = r() > 0.5 ? 1 : -1;
            const px = x + side * w * (0.55 + r() * 0.35);
            const pr = 8 + t * 22;
            s += `<path d="M${f(px)} ${f(y)} m${f(-pr)} 0 a${f(pr)} ${f(pr * 0.45)} 0 1 0 ${f(pr * 2)} 0 L${f(px)} ${f(y)} Z" fill="${i % 3 ? C.greenL : C.lime}"/>`;
            if (i % 3 === 0) {
                const fr = pr * 0.35;
                s += `<polygon points="${f(px - fr)},${f(y - 2)} ${f(px - fr * 0.4)},${f(y - fr * 1.6)} ${f(px)},${f(y - fr * 0.6)} ${f(px + fr * 0.4)},${f(y - fr * 1.6)} ${f(px + fr)},${f(y - 2)}" fill="${C.pink}"/>`;
            }
        }
        // canoa con remero
        const [cx, cy] = center[Math.round(0.56 * N)];
        s += `<g transform="translate(${f(cx + 10)} ${f(cy)})">
            <path d="M-46 0 Q0 18 46 0 L36 8 Q0 20 -36 8Z" fill="${C.deepD}"/>
            <path d="M-46 0 Q0 18 46 0" stroke="${C.orange}" stroke-width="2" fill="none"/>
            <rect x="-6" y="-26" width="14" height="24" rx="5" fill="${C.orange}"/>
            <circle cx="1" cy="-32" r="7" fill="${C.capyD}"/>
            <path d="M-6 -36 h14 l-2 -5 h-10z" fill="${C.lime}"/>
            <path d="M-26 -22 L24 16" stroke="${C.bark}" stroke-width="3" stroke-linecap="round"/>
            <path d="M-60 12 h28 M34 14 h30" stroke="${C.cream}" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>
        </g>`;
        mount('layer-river', s);
    }

    // Bosque medio: pinos, ceibas, palmas, tucán y pantera en una rama
    function drawForest() {
        let s = `<defs><linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="${C.greenM}"/><stop offset="1" stop-color="${C.green}"/></linearGradient></defs>`;
        const r = seeded(42);
        const trees = [];
        const palette = [[C.green, C.greenM], [C.deep, '#215A5F'], [C.limeD, C.lime], [C.greenM, C.greenL]];
        const kinds = ['conifer', 'round', 'tiered', 'conifer'];
        const addCluster = (x0, x1, yBase, n) => {
            for (let i = 0; i < n; i++) {
                const x = x0 + r() * (x1 - x0);
                const y = yBase + r() * 70;
                const h = 110 + r() * 130;
                trees.push({ x, y, h, k: kinds[Math.floor(r() * 4)], c: palette[Math.floor(r() * 4)] });
            }
        };
        addCluster(-20, 520, 740, 16);
        addCluster(1080, 1620, 740, 16);
        trees.sort((a, b) => a.y - b.y);

        // colinas laterales
        s += `<path d="M-20 760 Q160 700 360 735 Q520 760 600 830 Q640 880 620 ${H} H-20Z" fill="url(#hill)"/>`;
        s += `<path d="M1620 750 Q1440 700 1240 735 Q1080 765 1010 840 Q980 890 1000 ${H} H1620Z" fill="url(#hill)"/>`;

        // ceiba grande izquierda con pantera
        s += ceiba(250, 860, 560, C.greenM, C.green, C.limeD);
        s += `<path d="M262 420 Q330 410 420 430" stroke="${C.bark}" stroke-width="16" stroke-linecap="round" fill="none"/>`;
        s += panther(345, 404);

        // palmas
        s += palm(560, 800, 260, C.green, C.greenM, -1);
        s += palm(1080, 800, 280, C.deep, '#215A5F', 1);

        trees.forEach(({ x, y, h, k, c }) => {
            if (k === 'conifer') s += conifer(x, y, h, c[0], c[1]);
            else if (k === 'round') s += roundTree(x, y, h, c[0], c[1]);
            else s += tieredTree(x, y, h, c[0], c[1]);
        });

        // rama derecha con tucán
        s += `<path d="M1620 520 Q1500 505 1380 530 L1330 520" stroke="${C.bark}" stroke-width="14" stroke-linecap="round" fill="none"/>`;
        s += leaf(1460, 512, 70, -60, 14, C.green, C.greenM);
        s += leaf(1520, 515, 60, -110, 12, C.greenM, C.green);
        s += leaf(1400, 525, 55, 120, 11, C.green, null);
        s += toucan(1420, 518, 1.25);
        mount('layer-forest', s);
    }

    function panther(x, y) {
        return `<g transform="translate(${x} ${y})">
            <path d="M-60 -2 C-90 10 -96 50 -82 80 C-78 88 -70 86 -72 78 C-82 52 -78 22 -56 10Z" fill="${C.navy}"/>
            <ellipse cx="0" cy="-8" rx="66" ry="17" fill="${C.navy}"/>
            <ellipse cx="-6" cy="-14" rx="52" ry="8" fill="#2A5288" opacity=".7"/>
            <rect x="24" y="0" width="12" height="34" rx="5" fill="${C.navy}"/>
            <rect x="-30" y="0" width="12" height="28" rx="5" fill="${C.navy}"/>
            <polygon points="54,-28 62,-46 70,-30" fill="${C.navy}"/><polygon points="76,-28 86,-44 90,-24" fill="${C.navy}"/>
            <path d="M52 -26 Q74 -40 94 -22 L98 -8 Q74 6 54 -4Z" fill="${C.navy}"/>
            <circle cx="70" cy="-16" r="3" fill="${C.gold}"/><circle cx="86" cy="-16" r="3" fill="${C.gold}"/>
            <path d="M76 -6 l2 2 l2 -2" stroke="${C.pink}" stroke-width="2" fill="none"/>
        </g>`;
    }

    function toucan(x, y, k = 1) {
        return `<g transform="translate(${x} ${y}) scale(${k})">
            <path d="M-6 -10 L-14 30 L2 30 Z" fill="#12262A"/>
            <ellipse cx="0" cy="-42" rx="20" ry="36" fill="#12262A"/>
            <ellipse cx="6" cy="-58" rx="13" ry="15" fill="${C.cream}"/>
            <path d="M6 -46 Q4 -38 0 -34" stroke="${C.gold}" stroke-width="5" fill="none"/>
            <path d="M14 -74 Q60 -86 76 -62 Q48 -60 18 -60Z" fill="${C.orange}"/>
            <path d="M18 -60 Q48 -60 76 -62 Q62 -50 20 -52Z" fill="${C.pink}"/>
            <path d="M64 -78 Q74 -72 76 -62 Q70 -70 60 -70Z" fill="#12262A"/>
            <circle cx="4" cy="-70" r="7" fill="${C.teal}"/><circle cx="4" cy="-70" r="4" fill="#111"/><circle cx="5.5" cy="-71.5" r="1.3" fill="#fff"/>
            <path d="M-6 -4 v6 M4 -4 v6" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>
        </g>`;
    }

    // Jaguar low-poly sobre una roca + familia de capibaras (moodboard)
    function drawAnimals() {
        let s = '';
        // roca facetada
        s += `<g transform="translate(300 600) scale(1.05)">
            <polygon points="-30,370 0,282 120,262 270,270 350,300 370,370" fill="${C.deep}"/>
            <polygon points="0,282 120,262 150,330 40,370 -30,370" fill="${C.tealD}"/>
            <polygon points="120,262 270,270 230,330 150,330" fill="${C.teal}"/>
            <polygon points="270,270 350,300 370,370 230,330" fill="#215A5F"/>
            ${jaguar()}
        </g>`;
        s += fern(280, 990, 90, C.greenM, 1);
        s += fern(790, 990, 80, C.green, -1);

        // capibaras
        s += capybara(1150, 830, 1, true);
        s += capybara(1300, 870, 0.8, false);
        s += capybara(1060, 905, 0.5, false);
        s += grassTuft(1110, 935, 40, C.limeD);
        s += grassTuft(1380, 950, 46, C.greenL);
        s += grassTuft(1000, 960, 34, C.lime);
        mount('layer-animals', s);
    }

    function jaguar() {
        const spots = [[90, 215], [125, 258], [150, 205], [72, 258], [165, 250], [195, 160], [196, 250], [104, 182]];
        return `<g transform="translate(0 -30)">
            <path d="M60 288 C10 296 -14 248 16 208 C28 192 26 176 16 168" stroke="${C.orange}" stroke-width="16" fill="none" stroke-linecap="round"/>
            <path d="M22 182 C26 176 22 170 16 168" stroke="${C.deep}" stroke-width="16" fill="none" stroke-linecap="round"/>
            <polygon points="45,300 55,205 115,150 175,168 185,300" fill="#E8851C"/>
            <polygon points="55,205 115,150 125,245 70,300 45,300" fill="${C.orangeD}"/>
            <polygon points="115,150 175,168 160,230 125,245" fill="${C.orange}"/>
            <ellipse cx="95" cy="296" rx="36" ry="8" fill="${C.orangeL}"/>
            <polygon points="160,172 205,108 245,118 248,300 180,300" fill="${C.orange}"/>
            <polygon points="205,108 245,118 236,190" fill="${C.orangeL}"/>
            <polygon points="222,140 248,132 245,215 226,200" fill="${C.cream}"/>
            <polygon points="198,200 222,200 222,300 196,300" fill="#E07D1C"/>
            <polygon points="226,205 247,205 250,300 228,300" fill="${C.orangeL}"/>
            <rect x="192" y="290" width="32" height="11" rx="5" fill="#F7C27A"/>
            <rect x="225" y="290" width="30" height="11" rx="5" fill="#F7C27A"/>
            ${spots.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${6 + (i % 3) * 1.5}" fill="none" stroke="${C.deep}" stroke-width="3" opacity=".75"/>`).join('')}
            <polygon points="196,72 202,34 226,60" fill="${C.orangeD}"/>
            <polygon points="202,46 205,40 216,58" fill="${C.pink}"/>
            <polygon points="236,56 252,28 260,64" fill="${C.orangeD}"/>
            <polygon points="190,66 230,50 262,58 288,98 272,134 228,146 194,116" fill="${C.orange}"/>
            <polygon points="230,50 262,58 288,98 250,96" fill="${C.orangeL}"/>
            <polygon points="190,66 228,92 194,116" fill="${C.orangeD}"/>
            <polygon points="248,96 290,100 278,130 246,128" fill="${C.cream}"/>
            <polygon points="279,96 294,99 286,111" fill="#7A2E1C"/>
            <path d="M262 120 L278 124" stroke="${C.deep}" stroke-width="2.5" stroke-linecap="round"/>
            <polygon points="236,80 258,78 252,90 240,90" fill="${C.gold}" stroke="${C.deep}" stroke-width="2.5" stroke-linejoin="round"/>
            <circle cx="249" cy="84" r="2.6" fill="${C.deep}"/>
            <path d="M262 112 l30 -6 M262 116 l32 2 M262 120 l28 10" stroke="${C.cream}" stroke-width="1.4" opacity=".8"/>
            <circle cx="210" cy="96" r="5" fill="none" stroke="${C.deep}" stroke-width="2.5" opacity=".7"/>
        </g>`;
    }

    function capybara(x, y, k, withFruit) {
        return `<g transform="translate(${x} ${y}) scale(${k})">
            <rect x="14" y="68" width="18" height="36" rx="6" fill="${C.capyD}"/>
            <rect x="110" y="68" width="18" height="36" rx="6" fill="${C.capyD}"/>
            <rect x="0" y="20" width="150" height="80" rx="40" fill="${C.capy}"/>
            <path d="M40 22 H110 A40 40 0 0 1 150 60 H0 A40 40 0 0 1 40 22Z" fill="#D47A48"/>
            <rect x="-46" y="0" width="84" height="62" rx="22" fill="#B05A30"/>
            <rect x="-60" y="22" width="44" height="40" rx="15" fill="${C.capyD}"/>
            <circle cx="22" cy="2" r="9" fill="${C.capyD}"/>
            <path d="M-14 22 h12" stroke="${C.deep}" stroke-width="4" stroke-linecap="round"/>
            <circle cx="-48" cy="36" r="3" fill="${C.deep}"/>
            ${withFruit ? `<circle cx="-6" cy="-12" r="13" fill="${C.orange}"/><circle cx="-10" cy="-16" r="4" fill="${C.orangeL}"/><path d="M-6 -25 q8 -10 16 -4 q-8 6 -16 4Z" fill="${C.green}"/>` : ''}
            ${withFruit ? `<g transform="translate(96 4)"><ellipse cx="0" cy="0" rx="13" ry="9" fill="${C.gold}"/><circle cx="10" cy="-8" r="7" fill="${C.gold}"/><polygon points="16,-9 24,-6 16,-5" fill="${C.orangeD}"/><circle cx="12" cy="-9" r="1.6" fill="${C.deep}"/><path d="M-12 0 l-10 4" stroke="${C.gold}" stroke-width="5" stroke-linecap="round"/></g>` : ''}
        </g>`;
    }

    // Primer plano: hojas grandes, heliconias y helechos
    function drawForeground() {
        let s = '';
        s += `<path d="M-20 950 Q300 920 560 960 L600 ${H + 40} H-20Z" fill="${C.deepD}"/>`;
        s += `<path d="M1620 940 Q1300 920 1040 965 L1000 ${H + 40} H1620Z" fill="${C.deepD}"/>`;
        // esquina izquierda
        s += leaf(-20, 1010, 330, -62, 70, C.green, C.greenM);
        s += leaf(40, 1020, 260, -38, 54, C.deep, '#215A5F');
        s += leaf(-40, 900, 300, -20, 60, C.greenM, C.green);
        s += leaf(120, 1030, 220, -84, 46, C.deep, '#215A5F');
        s += heliconia(210, 1010, 230, 0.6);
        s += leaf(200, 1040, 200, -15, 40, C.green, C.greenM);
        s += fern(470, 1005, 120, C.deep, 1);
        // esquina derecha
        s += leaf(1620, 1010, 340, -118, 72, C.green, C.greenM);
        s += leaf(1560, 1030, 270, -142, 54, C.deep, '#215A5F');
        s += leaf(1640, 880, 300, -160, 60, C.greenM, C.green);
        s += leaf(1480, 1030, 220, -96, 46, C.deep, '#215A5F');
        s += heliconia(1390, 1010, 210, -0.6);
        s += leaf(1400, 1040, 200, -165, 40, C.green, C.greenM);
        s += fern(1150, 1005, 110, C.deep, -1);
        s += grassTuft(640, 1000, 50, C.green);
        s += grassTuft(980, 1000, 46, C.green);
        mount('layer-foreground', s);
    }

    // Lianas y hojas colgando desde arriba (suben al hacer scroll)
    function drawVines() {
        let s = '';
        const vine = (x, len, sway, flower) => {
            let v = `<path class="vine" style="transform-origin:${x}px 0" d="M${x} -10 Q${x + sway} ${len * 0.5} ${x} ${len}" stroke="${C.green}" stroke-width="4" fill="none"/>`;
            for (let i = 1; i < 6; i++) {
                const t = i / 6, y = len * t, px = x + sway * 2 * t * (1 - t);
                v += leaf(px, y, 26, i % 2 ? 30 : 150, 8, i % 2 ? C.greenM : C.green, null, false);
            }
            if (flower) v += `<circle cx="${x}" cy="${len + 6}" r="7" fill="${C.pink}"/><circle cx="${x}" cy="${len + 6}" r="3" fill="${C.gold}"/>`;
            return v;
        };
        s += vine(120, 260, 30, true) + vine(190, 170, -20, false) + vine(300, 120, 20, false);
        s += vine(1480, 280, -30, true) + vine(1400, 180, 24, false) + vine(1290, 110, -16, true);
        s += leaf(-30, -20, 300, 28, 60, C.deep, '#215A5F');
        s += leaf(-20, -40, 240, 55, 46, C.green, C.greenM);
        s += leaf(60, -40, 200, 75, 40, C.greenM, C.green);
        s += leaf(1630, -20, 300, 152, 60, C.deep, '#215A5F');
        s += leaf(1620, -40, 240, 125, 46, C.green, C.greenM);
        s += leaf(1540, -40, 200, 105, 40, C.greenM, C.green);
        const host = document.getElementById('layer-vines');
        host.innerHTML = `<svg xmlns="${NS}" viewBox="0 0 ${W} ${H}" data-anchor="top" preserveAspectRatio="xMidYMin slice">${s}</svg>`;
    }

    // Mariposas de línea dorada (moodboard)
    function drawButterflies() {
        const host = document.getElementById('layer-butterflies');
        const spots = [[18, 30], [72, 22], [84, 52], [30, 62], [58, 40], [10, 48], [46, 18]];
        host.innerHTML = spots.map(([x, y], i) => `
            <div class="bfly" style="left:${x}%;top:${y}%;--d:${9 + i * 1.7}s;--delay:${-i * 2.3}s;--s:${0.7 + (i % 3) * 0.25}">
                <svg viewBox="0 0 100 100"><g fill="none" stroke="${C.gold}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
                    <g class="wing wing--l"><path d="M50 30 C30 6 6 20 18 44 C24 54 40 52 50 48Z"/><path d="M50 48 C34 54 26 76 40 80 C48 82 50 66 50 56Z"/><path d="M48 34 C36 26 26 30 26 40"/></g>
                    <g class="wing wing--r"><path d="M50 30 C70 6 94 20 82 44 C76 54 60 52 50 48Z"/><path d="M50 48 C66 54 74 76 60 80 C52 82 50 66 50 56Z"/><path d="M52 34 C64 26 74 30 74 40"/></g>
                    <path d="M50 28 V70 M50 28 L43 16 M50 28 L57 16"/>
                </g></svg>
            </div>`).join('');
    }

    function drawFireflies() {
        const r = seeded(99);
        const host = document.getElementById('layer-fireflies');
        let s = '';
        for (let i = 0; i < 36; i++) {
            s += `<span class="firefly" style="left:${f(r() * 100)}%;top:${f(45 + r() * 50)}%;--d:${f(3 + r() * 5)}s;--delay:${f(-r() * 6)}s"></span>`;
        }
        host.innerHTML = s;
    }

    /* ---------------------------------------------------------------- */
    /*  Encuadre adaptable: en pantallas verticales el viewBox crece      */
    /*  hacia arriba (cielo) para que se vea más ancho de la selva.       */
    /* ---------------------------------------------------------------- */
    function fitViewBoxes() {
        const aspect = innerWidth / innerHeight;
        const h = Math.round(Math.min(2000, Math.max(H, H * (1.6 / aspect) * 0.6)));
        document.querySelectorAll('.scene svg[data-anchor]').forEach((svg) => {
            const top = svg.dataset.anchor === 'top';
            svg.setAttribute('viewBox', `0 ${top ? 0 : H - h} ${W} ${h}`);
        });
    }

    /* ---------------------------------------------------------------- */
    /*  Movimiento: mouse + scroll, suavizado con interpolación           */
    /* ---------------------------------------------------------------- */
    function animate() {
        const scene = document.getElementById('scene');
        const layers = [...scene.querySelectorAll('.layer:not(.layer--celestial)')].map((el) => ({
            el, depth: parseFloat(el.dataset.depth) || 0, scroll: parseFloat(el.dataset.scroll) || 0
        }));
        const sun = document.getElementById('layer-sun');
        const moon = document.getElementById('layer-moon');
        const reduce = matchMedia('(prefers-reduced-motion: reduce)');

        const target = { x: 0, y: 0, p: 0 };
        const cur = { x: 0, y: 0, p: 0 };
        let raf = 0;

        const scrollProgress = () => {
            const max = document.documentElement.scrollHeight - innerHeight;
            return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
        };
        const smooth = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };

        function frame() {
            const ease = reduce.matches ? 1 : 0.075;
            cur.x += (target.x - cur.x) * ease;
            cur.y += (target.y - cur.y) * ease;
            cur.p += (target.p - cur.p) * (reduce.matches ? 1 : 0.12);

            const vh = innerHeight;
            const motion = reduce.matches ? 0 : 1;
            const mx = cur.x * motion, my = cur.y * motion, p = cur.p;

            for (const l of layers) {
                const tx = -mx * l.depth * 70;
                const ty = -my * l.depth * 40 + p * l.scroll * vh * 0.45 * motion;
                l.el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
            }
            // El sol se oculta tras la selva, la luna aparece desde arriba
            sun.style.transform = `translate3d(${(-mx * 4).toFixed(2)}px, ${(p * vh * 0.8 - my * 3).toFixed(2)}px, 0)`;
            moon.style.transform = `translate3d(${(-mx * 6).toFixed(2)}px, ${((1 - smooth(0.25, 0.85, p)) * -vh * 0.55 - my * 4).toFixed(2)}px, 0)`;

            scene.style.setProperty('--dusk', (smooth(0.12, 0.45, p) * (1 - smooth(0.55, 0.9, p))).toFixed(3));
            scene.style.setProperty('--night', smooth(0.4, 0.9, p).toFixed(3));

            const settled = Math.abs(target.x - cur.x) < 0.0005 && Math.abs(target.y - cur.y) < 0.0005 && Math.abs(target.p - cur.p) < 0.0005;
            raf = settled ? 0 : requestAnimationFrame(frame);
        }
        const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

        addEventListener('pointermove', (e) => {
            if (e.pointerType === 'touch') return;
            target.x = (e.clientX / innerWidth - 0.5) * 2;
            target.y = (e.clientY / innerHeight - 0.5) * 2;
            kick();
        }, { passive: true });
        document.addEventListener('pointerleave', () => { target.x = 0; target.y = 0; kick(); });
        // En móviles, el giroscopio (cuando el navegador lo expone sin permiso) hace las veces del mouse
        addEventListener('deviceorientation', (e) => {
            if (e.gamma == null) return;
            target.x = Math.max(-1, Math.min(1, e.gamma / 30));
            target.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
            kick();
        }, { passive: true });
        addEventListener('scroll', () => { target.p = scrollProgress(); kick(); }, { passive: true });
        addEventListener('resize', () => { fitViewBoxes(); target.p = scrollProgress(); kick(); });
        reduce.addEventListener?.('change', kick);

        target.p = cur.p = scrollProgress();
        kick();
    }

    function init() {
        drawStars();
        drawSunMoon();
        drawTepuis();
        drawCanopy();
        drawRiver();
        drawForest();
        drawAnimals();
        drawForeground();
        drawVines();
        drawButterflies();
        drawFireflies();
        fitViewBoxes();
        animate();
        document.documentElement.classList.add('scene-ready');
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
