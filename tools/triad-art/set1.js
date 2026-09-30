// Prima serie: le 32 carte di livello 10, i giochi più famosi.
const {o, INK, shadow, r1} = require('./kit.js');
const P = require('./parts.js');
const S = {};

S['pac-man'] = k=>{
  k.sky(['#03010f', '#0a0a3a', '#121a6b']); k.glow(375, 640, 460, '#ffe600', .35); k.stars(60, 0, 500, '#aab');
  // labirinto neon
  let m = ''; [[40, 200, 200, 90], [520, 180, 190, 110], [300, 130, 150, 60], [60, 830, 170, 70], [520, 830, 180, 70]].forEach(([x, y, w, h])=>{ m += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26"/>`; });
  k.add(`<g fill="none" stroke="#2f4dff" stroke-width="8" opacity=".9">${m}</g>`, `<g fill="none" stroke="#7da0ff" stroke-width="2" opacity=".8">${m}</g>`);
  for(let i = 0; i < 9; i++) k.add(`<circle cx="${420 + i * 38}" cy="${612 + Math.sin(i) * 0}" r="${i % 4 === 0 ? 13 : 6}" fill="#ffd9a0" opacity="${i < 2 ? 0 : .95}"/>`);
  // pac-man
  const px = 250, py = 620, R = 210, a = .62;
  k.add(`<circle cx="${px}" cy="${py}" r="${R + 30}" fill="${k.rg([[0, '#ffe600', .5], [1, '#ffe600', 0]])}"/>`,
    `<path d="M${px} ${py} L${r1(px + R * Math.cos(a))} ${r1(py - R * Math.sin(a))} A${R} ${R} 0 1 0 ${r1(px + R * Math.cos(a))} ${r1(py + R * Math.sin(a))} Z" fill="${k.rg([[0, '#fff36a'], [.7, '#ffd700'], [1, '#e0a800']], .4, .35, .8)}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`,
    `<circle cx="${px + 10}" cy="${py - 130}" r="24" fill="${INK}"/><circle cx="${px + 4}" cy="${py - 138}" r="8" fill="#fff"/>`);
  // fantasmi
  const ghost = (cx, cy, s, col)=> `<g transform="translate(${cx} ${cy}) scale(${s})"><path d="M-46 50 V-8 C-46 -70 46 -70 46 -8 V50 L31 36 L15 50 L0 36 L-15 50 L-31 36Z" fill="${col}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="-17" cy="-12" rx="13" ry="17" fill="#fff"/><ellipse cx="17" cy="-12" rx="13" ry="17" fill="#fff"/><circle cx="-11" cy="-10" r="7" fill="#1e2cff"/><circle cx="23" cy="-10" r="7" fill="#1e2cff"/></g>`;
  [['#ff2a2a', 590, 430, 1.35], ['#ffb8ff', 650, 560, 1.15], ['#00e5ff', 600, 700, 1.15], ['#ffa030', 660, 830, 1.05]].forEach(([c, x, y, s])=> k.add(`<ellipse cx="${x}" cy="${y + 60 * s}" rx="${50 * s}" ry="10" fill="#000" opacity=".3"/>`, ghost(x, y, s, c)));
  k.finish();
};

S['super-mario-bros'] = k=>{
  k.sky(['#3a8bff', '#6fbaff', '#bfe6ff']); k.glow(560, 330, 420, '#fff6c0', .8); k.rays(560, 330, '#fff', 16, .16);
  k.cloud(130, 300, 1.5, '#fff', .95); k.cloud(620, 200, 1.1, '#fff', .9); k.cloud(360, 130, .9, '#fff', .8);
  k.hills(690, 60, '#3fbf4a', {f: .006, op: .9}); k.hills(760, 40, '#2a9d3a', {f: .011});
  // castello
  k.add(`<g transform="translate(520 720)"><rect x="-120" y="-190" width="240" height="190" fill="#d6752a" stroke="${INK}" stroke-width="6"/><rect x="-140" y="-250" width="60" height="70" fill="#d6752a" stroke="${INK}" stroke-width="6"/><rect x="80" y="-250" width="60" height="70" fill="#d6752a" stroke="${INK}" stroke-width="6"/><rect x="-40" y="-280" width="80" height="100" fill="#e88a3a" stroke="${INK}" stroke-width="6"/><path d="M-30 0 V-70 C-30 -100 30 -100 30 -70 V0Z" fill="#221"/><g stroke="${INK}" stroke-width="3" opacity=".5">${[-100, -60, -20, 20, 60, 100].map(x=> `<path d="M${x} -190 V-110"/>`).join('')}</g></g>`);
  k.add(`<path d="M690 730 V420" stroke="#eee" stroke-width="10"/><path d="M690 430 L780 470 L690 510Z" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="690" cy="416" r="12" fill="#3fbf4a" stroke="${INK}" stroke-width="4"/>`);
  // terreno a mattoni
  let br = ''; for(let r = 0; r < 4; r++) for(let c = -1; c < 9; c++) br += `<rect x="${c * 96 + (r % 2) * 48}" y="${820 + r * 58}" width="92" height="54" rx="4" fill="#c8631f" stroke="${INK}" stroke-width="5"/>`;
  k.add(`<rect y="810" width="750" height="240" fill="#8a3e10"/><rect y="810" width="750" height="16" fill="#4fd05a" stroke="${INK}" stroke-width="5"/>${br}`);
  // blocco ? e monete
  k.add(`<g transform="translate(150 500)"><rect width="110" height="110" rx="10" fill="#ffb31a" stroke="${INK}" stroke-width="7"/><rect x="8" y="8" width="94" height="94" rx="6" fill="none" stroke="#ffe08a" stroke-width="4"/><path d="M38 44 C38 22 74 22 74 44 C74 60 56 60 56 74" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><circle cx="56" cy="90" r="7" fill="${INK}"/></g>`);
  [[60, 380], [180, 340], [300, 380]].forEach(([x, y])=> k.add(`<ellipse cx="${x}" cy="${y}" rx="22" ry="34" fill="#ffd21f" stroke="${INK}" stroke-width="6"/><rect x="${x - 4}" y="${y - 20}" width="8" height="40" rx="3" fill="#ffef8a"/>`));
  shadow(k, 300, 812, 120, 16); k.add(P.goomba(300, 812, 1.05, false));
  k.add(P.mario(392, 626, 1.1, {pose: 'jump', flip: false}));
  k.finish({grain: .25});
};

S['tetris'] = k=>{
  k.sky(['#1a0b3d', '#4a1a70', '#a8324a', '#ff9a4a']); k.glow(375, 560, 420, '#ffcf7a', .6);
  // cattedrale di San Basilio, sagoma
  const dome = (x, y, r, c1, c2)=> `<g transform="translate(${x} ${y})"><rect x="${-r * .5}" y="0" width="${r}" height="${r * 1.6}" fill="${c2}" stroke="${INK}" stroke-width="4"/><path d="M${-r} 0 C${-r} ${-r * 1.3} 0 ${-r * 1.9} 0 ${-r * 2.2} C0 ${-r * 1.9} ${r} ${-r * 1.3} ${r} 0 C${r * .5} ${r * .2} ${-r * .5} ${r * .2} ${-r} 0Z" fill="${c1}" stroke="${INK}" stroke-width="5"/><path d="M0 ${-r * 2.2} V${-r * 2.8}" stroke="#ffd45a" stroke-width="5"/><circle cx="0" cy="${-r * 2.9}" r="7" fill="#ffd45a"/><g stroke="#fff" stroke-width="4" opacity=".55">${[-.55, -.2, .2, .55].map(t=> `<path d="M${t * r} ${-r * .1} C${t * r * .4} ${-r * 1.2} 0 ${-r * 1.7} 0 ${-r * 2}" fill="none"/>`).join('')}</g></g>`;
  k.add(`<rect y="860" width="750" height="190" fill="#231238"/>`, dome(375, 500, 110, '#d8232a', '#f0e3c8'), dome(190, 640, 62, '#2f9e44', '#e9d8b0'), dome(560, 630, 70, '#f2b31d', '#e9d8b0'), dome(90, 700, 46, '#2a6fdb', '#e9d8b0'), dome(660, 720, 48, '#c9327a', '#e9d8b0'));
  // tetramini che cadono
  const blk = (x, y, c, s)=> `<g transform="translate(${x} ${y})"><rect width="${s}" height="${s}" fill="${c}" stroke="${INK}" stroke-width="5"/><path d="M4 4 H${s - 4} L${s - 14} 14 H14 V${s - 14} L4 ${s - 4}Z" fill="#fff" opacity=".45"/><path d="M${s - 4} ${s - 4} H4 L14 ${s - 14} H${s - 14} V14 L${s - 4} 4Z" fill="#000" opacity=".22"/></g>`;
  const piece = (cx, cy, cells, c, s, rot)=> `<g transform="rotate(${rot} ${cx} ${cy})">${cells.map(([a, b])=> blk(cx + a * s, cy + b * s, c, s)).join('')}</g>`;
  const s = 76;
  k.add(`<g opacity=".95">${piece(150, 90, [[0, 0], [1, 0], [2, 0], [3, 0]], '#00d8e8', 64, 12)}${piece(560, 130, [[0, 0], [1, 0], [0, 1], [1, 1]], '#ffd21f', s, -8)}${piece(300, 330, [[0, 0], [0, 1], [0, 2], [1, 2]], '#ff8a1a', s, 14)}${piece(520, 390, [[0, 0], [1, 0], [1, 1], [2, 1]], '#ee2e3a', s, -14)}</g>`);
  // pila in basso
  const cols = ['#00d8e8', '#ffd21f', '#a445e8', '#3fbf4a', '#ee2e3a', '#2a6fdb', '#ff8a1a']; let pile = '';
  for(let r = 0; r < 3; r++) for(let c = 0; c < 10; c++){ if(this && 0) continue; const v = (c * 7 + r * 3) % 11; if(v < 2 && r < 2) continue; pile += blk(c * 75, 990 - r * 75, cols[(c + r * 2) % 7], 75); }
  k.add(pile);
  k.finish();
};

S['the-legend-of-zelda-ocarina-of-time'] = k=>{
  k.sky(['#120a3a', '#3a1a78', '#b0508a', '#ffc46a']); k.stars(70, 0, 420, '#fff');
  k.glow(375, 330, 420, '#ffe27a', .75); k.rays(375, 330, '#ffe9a0', 20, .16);
  k.add(P.triforce(375, 150, 260, '#ffd23b').replace(/stroke="#0d0b22" stroke-width="5"/g, 'stroke="#fff2b0" stroke-width="5"'));
  k.add(`<g opacity=".5">${P.triforce(375, 150, 260, 'none').replace(/fill="none"/g, 'fill="#fff3b0"')}</g>`);
  k.hills(720, 90, ['#1d4a6a', '#0f2a44'], {f: .005, sharp: true}); k.hills(800, 50, ['#2a7a4a', '#123a2a'], {f: .009});
  k.add(`<rect y="800" width="750" height="250" fill="#123a2a"/>`);
  // Zelda, piccola, sullo sfondo a destra
  k.add(`<g transform="translate(600 800) scale(.62)"><path d="M-70 0 C-60 -120 -40 -170 0 -190 C40 -170 60 -120 70 0Z" ${o('#e86aa8', 6)}/><path d="M-26 -120 H26 V-100 H-26Z" ${o('#ffd23b', 4)}/><circle cx="0" cy="-232" r="52" ${o('#f8c9a0', 6)}/><path d="M-54 -238 C-60 -300 60 -300 54 -238 C40 -262 -40 -262 -54 -238Z" ${o('#e8c34a', 6)}/><path d="M-30 -292 L0 -320 L30 -292Z" ${o('#ffd23b', 5)}/><ellipse cx="-16" cy="-228" rx="7" ry="12" fill="#2a58d8"/><ellipse cx="16" cy="-228" rx="7" ry="12" fill="#2a58d8"/></g>`);
  shadow(k, 330, 812, 140, 18); k.add(P.link(330, 810, 1.55, {}));
  // ocarina
  k.add(`<g transform="translate(470 620) rotate(-20)"><ellipse cx="0" cy="0" rx="74" ry="40" ${o('#3d8fe0', 6)}/><ellipse cx="-12" cy="-10" rx="40" ry="14" fill="#8fc8ff" opacity=".7"/><circle cx="-20" cy="6" r="6" fill="${INK}"/><circle cx="8" cy="12" r="6" fill="${INK}"/><circle cx="34" cy="4" r="6" fill="${INK}"/><rect x="-92" y="-14" width="30" height="24" rx="6" ${o('#3d8fe0', 5)}/></g>`);
  k.dots(30, 100, 500, 700, 800, '#ffe9a0', 2, 5, .8);
  k.finish();
};

S['the-legend-of-zelda-breath-of-the-wild'] = k=>{
  k.sky(['#5fa8e8', '#9fd0f0', '#f6e9c6', '#ffd9a0']); k.glow(560, 420, 380, '#fff3c0', .9);
  k.cloud(140, 210, 1.6, '#fff', .9); k.cloud(560, 150, 1.2, '#fff', .85); k.cloud(360, 330, 1, '#fff', .7);
  // paesaggio lontano: montagna del Fato, castello, foreste
  k.hills(560, 80, ['#8aa8c8', '#b8cfe0'], {f: .006, sharp: true, op: .8});
  k.add(`<path d="M120 600 L230 380 L300 470 L340 600Z" fill="#7d93b8" stroke="none" opacity=".9"/><g transform="translate(560 520)" fill="#5d6f96"><rect x="-40" y="-100" width="80" height="100"/><rect x="-60" y="-70" width="30" height="70"/><rect x="30" y="-70" width="30" height="70"/><path d="M-40 -100 L0 -160 L40 -100Z"/></g>`);
  k.hills(650, 60, ['#5aa860', '#3a7a4a'], {f: .008, op: .95}); k.hills(720, 50, ['#3f8a4a', '#25603a'], {f: .012});
  k.add(`<path d="M0 760 C120 740 200 780 330 790 C420 800 520 780 640 800 L750 810 V1050 H0Z" fill="#2c5a30" stroke="${INK}" stroke-width="0"/><path d="M0 830 C140 800 260 830 380 822 C520 812 640 840 750 830 V1050 H0Z" fill="#1d4a28"/>`);
  // Link di spalle con tunica blu
  k.add(`<g transform="translate(300 900) scale(1.5)">
    ${P.limb('M-24 -60 L-34 -14', 30, '#8a6a3a')}${P.limb('M26 -60 L36 -14', 30, '#8a6a3a')}
    <ellipse cx="-38" cy="-8" rx="34" ry="16" ${o('#4a2f14', 5)}/><ellipse cx="40" cy="-8" rx="34" ry="16" ${o('#4a2f14', 5)}/>
    <path d="M-56 -190 C-70 -130 -72 -90 -58 -56 L58 -56 C72 -90 70 -130 56 -190 C30 -208 -30 -208 -56 -190Z" ${o('#2d5fd0', 6)}/>
    <path d="M-56 -120 H56" stroke="${INK}" stroke-width="6"/><path d="M-6 -190 V-60" stroke="#f0d060" stroke-width="7"/>
    ${P.limb('M-52 -174 C-84 -150 -88 -110 -78 -84', 26, '#2d5fd0')}${P.limb('M52 -174 C84 -150 88 -110 78 -84', 26, '#2d5fd0')}
    <g transform="rotate(-38 0 -130)"><rect x="-8" y="-330" width="16" height="230" rx="4" ${o('#dfe8f4', 5)}/><rect x="-32" y="-104" width="64" height="12" rx="5" ${o('#2b58c8', 5)}/></g>
    <path d="M-36 -168 C-44 -120 -40 -110 -34 -100 L-20 -108" fill="none" stroke="${INK}" stroke-width="0"/>
    <circle cx="0" cy="-236" r="66" ${o('#e8c34a', 7)}/><path d="M-66 -240 C-70 -300 70 -304 66 -240 C40 -262 -40 -262 -66 -240Z" ${o('#d9b23a', 6)}/>
    <path d="M40 -240 C90 -230 120 -190 110 -130 C100 -170 72 -196 40 -206Z" ${o('#e8c34a', 6)}/><rect x="42" y="-244" width="20" height="16" rx="4" ${o('#3a8ad8', 4)}/>
    <path d="M-72 -246 L-116 -256 L-84 -222Z" ${o('#f8c9a0', 5)}/><path d="M70 -246 L114 -258 L82 -222Z" ${o('#f8c9a0', 5)}/></g>`);
  k.add(`<g transform="translate(560 300) rotate(-14)"><path d="M-160 0 C-80 -60 80 -60 160 0 C80 30 -80 30 -160 0Z" ${o('#e0b46a', 6)}/><path d="M-160 0 C-80 -30 80 -30 160 0" fill="none" stroke="#3a8ad8" stroke-width="8"/><path d="M-90 -28 L-40 8 M0 -34 V14 M90 -28 L40 8" stroke="${INK}" stroke-width="5" opacity=".6"/></g>`);
  k.finish({grain: .25});
};

S['sonic-the-hedgehog-2'] = k=>{
  k.sky(['#2c7dff', '#5ab4ff', '#b8e4ff']); k.glow(200, 250, 360, '#fff', .8); k.rays(200, 250, '#fff', 14, .14);
  k.cloud(560, 220, 1.4, '#fff', .95); k.cloud(160, 400, 1.1, '#fff', .9);
  k.hills(640, 80, ['#39b34a', '#1f7a3a'], {f: .007});
  // palme
  const palm = (x, y, s)=> `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C-10 -120 10 -220 30 -300" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M0 0 C-10 -120 10 -220 30 -300" fill="none" stroke="#a5713a" stroke-width="20" stroke-linecap="round"/><g transform="translate(30 -300)">${[-150, -110, -60, -10, 30].map((a, i)=> `<path d="M0 0 C${Math.cos(a * Math.PI / 180) * 60} ${Math.sin(a * Math.PI / 180) * 60 - 40} ${Math.cos(a * Math.PI / 180) * 130} ${Math.sin(a * Math.PI / 180) * 120} ${Math.cos(a * Math.PI / 180) * 170} ${Math.sin(a * Math.PI / 180) * 170 + 40}" fill="none" stroke="${INK}" stroke-width="26" stroke-linecap="round"/><path d="M0 0 C${Math.cos(a * Math.PI / 180) * 60} ${Math.sin(a * Math.PI / 180) * 60 - 40} ${Math.cos(a * Math.PI / 180) * 130} ${Math.sin(a * Math.PI / 180) * 120} ${Math.cos(a * Math.PI / 180) * 170} ${Math.sin(a * Math.PI / 180) * 170 + 40}" fill="none" stroke="#2fb04a" stroke-width="16" stroke-linecap="round"/>`).join('')}</g></g>`;
  k.add(palm(640, 720, 1.1), palm(80, 760, .9));
  // terreno a scacchi
  let ch = ''; for(let r = 0; r < 5; r++) for(let c = -1; c < 10; c++) ch += `<rect x="${c * 90 + (r % 2) * 45}" y="${770 + r * 60}" width="90" height="60" fill="${(c + r) % 2 ? '#c8781f' : '#a55a12'}"/>`;
  k.add(`<rect y="750" width="750" height="300" fill="#8a4a10"/>${ch}<path d="M0 760 C100 740 200 780 300 760 C420 740 520 780 750 750 V790 H0Z" fill="#3fc04a" stroke="${INK}" stroke-width="6"/>`);
  // anelli
  for(let i = 0; i < 7; i++){ const x = 90 + i * 90, y = 700 - Math.sin(i / 6 * Math.PI) * 120; k.add(`<ellipse cx="${x}" cy="${y}" rx="28" ry="32" fill="none" stroke="${INK}" stroke-width="16"/><ellipse cx="${x}" cy="${y}" rx="28" ry="32" fill="none" stroke="#ffd21f" stroke-width="9"/>`); }
  shadow(k, 300, 780, 140, 16); k.add(P.sonic(320, 780, 1.55, {}));
  shadow(k, 560, 780, 90, 12); k.add(P.tails(590, 780, 1.1, {flip: true}));
  k.finish({grain: .25});
};

S['super-mario-64'] = k=>{
  k.sky(['#2a6fe8', '#63b0ff', '#c4e8ff']); k.glow(375, 300, 400, '#fff', .8); k.rays(375, 300, '#fff', 18, .14);
  k.cloud(130, 230, 1.5, '#fff', .95); k.cloud(620, 300, 1.3, '#fff', .95);
  k.hills(760, 70, ['#58c060', '#2f8a40'], {f: .006});
  // castello di Peach
  const tw = (x, y, w, h, roof)=> `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" ${o('#f6e9dc', 5)}/><path d="M${x - 10} ${y} L${x + w / 2} ${y - w * 1.1} L${x + w + 10} ${y}Z" ${o(roof, 5)}/><rect x="${x + w / 2 - 8}" y="${y + 24}" width="16" height="30" rx="8" fill="#345"/></g>`;
  k.add(`<g transform="translate(0 20)"><rect x="200" y="470" width="350" height="230" ${o('#f6e9dc', 6)}/>${tw(150, 430, 70, 270, '#d8232a')}${tw(530, 430, 70, 270, '#d8232a')}${tw(300, 350, 150, 350, '#e63a5a')}<path d="M330 700 V600 C330 560 420 560 420 600 V700Z" ${o('#5a3a8a', 6)}/><g fill="#f2a1c0" stroke="${INK}" stroke-width="4"><circle cx="375" cy="500" r="30"/></g><path d="M375 480 l6 14 l15 2 l-11 10 l3 15 l-13 -8 l-13 8 l3 -15 l-11 -10 l15 -2z" fill="#ffd23b"/></g>`);
  k.add(`<path d="M0 760 C150 740 260 770 375 760 C500 750 620 770 750 750 V1050 H0Z" fill="#3aa04a" stroke="${INK}" stroke-width="0"/><path d="M280 1050 C300 900 340 800 375 770 C410 800 450 900 470 1050Z" fill="#e6c98a" stroke="${INK}" stroke-width="5"/>`);
  // stella potere
  k.add(`<g transform="translate(590 520)"><path d="${P.star5(0, 0, 90, 40)}" fill="#ffd23b" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><ellipse cx="-14" cy="0" rx="8" ry="14" fill="${INK}"/><ellipse cx="14" cy="0" rx="8" ry="14" fill="${INK}"/></g>`);
  k.glow(590, 520, 130, '#ffe27a', .6);
  shadow(k, 300, 960, 120, 16); k.add(P.mario(320, 960, 1.7, {pose: 'stand', fist: true}));
  k.finish({grain: .25});
};

S['super-mario-kart'] = k=>{
  k.sky(['#2a6fe8', '#7cc0ff', '#d7f0ff']); k.cloud(150, 220, 1.3, '#fff', .95); k.cloud(600, 170, 1, '#fff', .9);
  k.hills(430, 50, ['#4fbf58', '#2f8a40'], {f: .009});
  // strada in prospettiva
  k.add(`<rect y="430" width="750" height="620" fill="#3aa04a"/><path d="M330 430 L420 430 L800 1050 L-50 1050Z" fill="#808892" stroke="${INK}" stroke-width="0"/>`);
  let cb = ''; for(let i = 0; i < 14; i++){ const t0 = i / 14, t1 = (i + 1) / 14, y0 = 430 + t0 * t0 * 620, y1 = 430 + t1 * t1 * 620, xl0 = 330 - t0 * t0 * 380, xl1 = 330 - t1 * t1 * 380, xr0 = 420 + t0 * t0 * 380, xr1 = 420 + t1 * t1 * 380, w0 = 4 + t0 * t0 * 40, w1 = 4 + t1 * t1 * 40; const c = i % 2 ? '#e52521' : '#fff';
    cb += `<path d="M${xl0 - w0} ${y0} L${xl0} ${y0} L${xl1} ${y1} L${xl1 - w1} ${y1}Z" fill="${c}"/><path d="M${xr0} ${y0} L${xr0 + w0} ${y0} L${xr1 + w1} ${y1} L${xr1} ${y1}Z" fill="${c}"/>`; }
  k.add(cb);
  let dash = ''; for(let i = 0; i < 8; i++){ const t = (i + .3) / 8, y = 440 + t * t * 600, w = 3 + t * t * 14, h = 10 + t * t * 80; dash += `<path d="M${375 - w} ${y} h${2 * w} l${w * 1.8} ${h} h${-w * 5.6}Z" fill="#fff" opacity=".85"/>`; }
  k.add(dash);
  // alberi
  const tree = (x, y, s)=> `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-10" y="-40" width="20" height="40" ${o('#7a4a22', 4)}/><circle cx="0" cy="-90" r="52" ${o('#2f9a3a', 5)}/><circle cx="-24" cy="-70" r="34" ${o('#3fb04a', 4)}/></g>`;
  k.add(tree(120, 560, .6), tree(60, 700, .9), tree(640, 570, .6), tree(700, 720, .95));
  // kart
  const kart = (cx, cy, s, col, driver)=> `<g transform="translate(${cx} ${cy}) scale(${s})">
    <ellipse cx="0" cy="8" rx="150" ry="20" fill="#000" opacity=".35"/>
    ${driver}
    <path d="M-120 -30 C-120 -90 120 -90 120 -30 L140 10 H-140Z" ${o(col, 6)}/><path d="M-100 -50 C-60 -80 60 -80 100 -50" fill="none" stroke="#fff" stroke-width="6" opacity=".55"/>
    <rect x="-80" y="-50" width="160" height="16" fill="#fff" opacity=".8"/>
    <rect x="-170" y="-20" width="70" height="46" rx="12" ${o('#232323', 6)}/><rect x="100" y="-20" width="70" height="46" rx="12" ${o('#232323', 6)}/>
    <rect x="-186" y="-8" width="24" height="26" rx="6" fill="#666" stroke="${INK}" stroke-width="4"/><rect x="164" y="-8" width="24" height="26" rx="6" fill="#666" stroke="${INK}" stroke-width="4"/></g>`;
  k.add(kart(470, 780, 1.05, '#2a55d6', P.mario(0, -50, .62, {letter: 'L', cap: '#3fbf4a', shirt: '#3fbf4a', ov: '#2a55d6', pose: 'stand'})));
  k.add(kart(250, 940, 1.35, '#e52521', P.mario(0, -50, .62, {pose: 'stand'})));
  k.dots(28, 0, 600, 750, 1000, '#fff', 2, 5, .25);
  k.finish({grain: .25});
};

module.exports = S;
