// Quarta serie: open world e giochi «scuri».
const {o, INK, shadow, r1, mulberry} = require('./kit.js');
const P = require('./parts.js');
const S = {};
const pine = (x, y, s, c1, c2)=> `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-10" y="-30" width="20" height="30" fill="#3a2418"/>${[[0, -50, 90], [0, -110, 74], [0, -170, 54]].map(([a, b, w])=> `<path d="M${-w} ${b + 60} L0 ${b - 40} L${w} ${b + 60}Z" fill="${c1}" stroke="${INK}" stroke-width="4"/>`).join('')}<path d="M0 -210 L40 -110 L0 -130Z" fill="${c2}" opacity=".7"/></g>`;

S['grand-theft-auto-v'] = k=>{
  k.sky(['#2a0a5a', '#8a1a8a', '#ff4a7a', '#ff9a3a', '#ffd070']); k.glow(375, 640, 460, '#ffcf5a', .9);
  k.add(`<circle cx="375" cy="620" r="210" fill="${k.lg([[0, '#fff3a0'], [1, '#ff7a4a']])}"/>`);
  for(let i = 0; i < 8; i++) k.add(`<rect x="130" y="${540 + i * 26}" width="490" height="${4 + i * 2}" fill="#8a1a8a" opacity=".55"/>`);
  k.stars(40, 0, 300, '#fde');
  // grande V
  k.add(`<path d="M120 180 L250 180 L375 560 L500 180 L630 180 L440 760 L310 760Z" fill="${k.lg([[0, '#ff4a9a'], [1, '#ffb03a']])}" stroke="#fff" stroke-width="6" opacity=".92"/><path d="M120 180 L250 180 L375 560 L500 180 L630 180 L440 760 L310 760Z" fill="none" stroke="${INK}" stroke-width="8"/>`);
  k.skyline(820, '#1a0a30', {hmin: 100, hvar: 260, wmin: 30, wvar: 40, windows: '#ffb84a'});
  const palm = (x, y, s)=> `<g transform="translate(${x} ${y}) scale(${s})" fill="#0e0620" stroke="none"><path d="M-8 0 C-14 -200 10 -400 30 -520 L44 -516 C24 -400 8 -200 12 0Z"/>${[-160, -120, -75, -30, 15, 55].map(a=> { const r = a * Math.PI / 180; return `<path d="M36 -520 C${36 + Math.cos(r) * 70} ${-520 + Math.sin(r) * 50 - 50} ${36 + Math.cos(r) * 150} ${-520 + Math.sin(r) * 110} ${36 + Math.cos(r) * 210} ${-520 + Math.sin(r) * 170 + 40} C${36 + Math.cos(r) * 150} ${-520 + Math.sin(r) * 120 - 20} ${36 + Math.cos(r) * 60} ${-520 + Math.sin(r) * 60 - 10} 36 -510Z"/>`; }).join('')}</g>`;
  k.add(palm(60, 1010, .9), palm(690, 1010, 1));
  k.add(`<rect y="900" width="750" height="150" fill="#0e0620"/>`);
  // tre sagome
  const sil = (x, y, s, kind)=>{ const c = '#0a0416', rim = '#ff9ac8'; let extra = '';
    if(kind === 'm') extra = `<path d="M-50 -320 C-50 -390 50 -390 50 -320 C50 -270 -50 -270 -50 -320Z"/><path d="M-30 -270 L0 -200 L30 -270Z" fill="#fff" opacity=".25"/>`;
    if(kind === 'f') extra = `<path d="M-50 -320 C-50 -390 50 -390 50 -320 C50 -270 -50 -270 -50 -320Z"/><path d="M-56 -340 C-30 -400 30 -400 56 -340 L100 -330 L-56 -330Z"/>`;
    if(kind === 't') extra = `<path d="M-52 -322 C-52 -392 52 -392 52 -322 C52 -262 -52 -262 -52 -322Z"/><path d="M-46 -300 C-40 -230 40 -230 46 -300 C30 -260 -30 -260 -46 -300Z"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}" stroke="${rim}" stroke-width="3"><path d="M-40 0 L-36 -140 L-90 -150 L-100 -230 C-100 -270 -70 -280 -50 -270 L50 -270 C70 -280 100 -270 100 -230 L90 -150 L36 -140 L40 0 L14 0 L0 -100 L-14 0Z"/>${extra}</g>`; };
  k.add(sil(150, 1000, 1.3, 'f'), sil(600, 1000, 1.3, 't'), sil(375, 1000, 1.7, 'm'));
  k.dots(30, 0, 500, 750, 900, '#fff', 1.5, 3, .5);
  k.finish();
};

S['the-elder-scrolls-v-skyrim'] = k=>{
  k.sky(['#04182a', '#0a3a4a', '#1a7a7a', '#6ad8c0']); k.stars(70, 0, 400, '#e8fff8');
  // aurora
  for(let i = 0; i < 4; i++) k.add(`<path d="M-20 ${180 + i * 50} C150 ${80 + i * 40} 300 ${260 + i * 30} 480 ${140 + i * 50} C600 ${60 + i * 30} 700 ${180 + i * 40} 800 ${120 + i * 30} V${240 + i * 50} C650 ${300 + i * 30} 500 ${180 + i * 40} 340 ${320 + i * 30} C200 ${420 + i * 20} 60 ${260 + i * 30} -20 ${340 + i * 30}Z" fill="${['#5aff9a', '#3ad8c8', '#7a8aff', '#a8ff7a'][i]}" opacity=".16"/>`);
  k.glow(375, 520, 380, '#9af0e0', .3);
  k.hills(600, 190, ['#5a7a92', '#1a2e46'], {f: .007, sharp: true, op: .95}); k.hills(720, 130, ['#c8dcec', '#6a8aa8'], {f: .009, sharp: true});
  k.add(`<rect y="860" width="750" height="190" fill="#e2eef8"/><path d="M0 860 C150 830 300 870 450 850 C600 830 700 860 750 850 V900 H0Z" fill="#b8ccdc"/>`);
  // drago
  const wing = `<path d="M0 0 C-80 -100 -240 -190 -330 -150 C-290 -120 -280 -90 -250 -60 C-260 -30 -220 -20 -200 10 C-150 -10 -60 20 0 40Z"/>`;
  k.add(`<g transform="translate(470 330) scale(1.3)" fill="#0c0a14" stroke="#7ad8c8" stroke-width="3">${wing}<g transform="scale(-1 1)">${wing}</g><path d="M-50 -10 C-70 40 -40 110 20 130 C60 120 80 60 60 10 C50 -30 -20 -50 -50 -10Z"/><path d="M40 20 C90 0 150 -20 190 -70 L226 -84 L210 -54 C230 -40 226 -20 200 -8 C150 20 90 40 50 60Z"/><path d="M-40 120 C-120 190 -190 210 -260 240 C-190 250 -120 230 -40 170Z"/><path d="M190 -70 L210 -110 L196 -60Z M170 -50 L176 -100 L160 -52Z"/><circle cx="196" cy="-58" r="6" fill="#ff5a2a" stroke="none"/></g>`);
  k.add(`<g transform="translate(590 240)"><path d="M0 0 C60 -20 130 -10 170 30 C120 20 70 20 0 40Z" fill="#ffb03a" opacity=".85"/><path d="M0 8 C50 -4 100 4 130 30 C90 24 50 24 0 30Z" fill="#fff2a0" opacity=".8"/></g>`);
  k.add(pine(90, 860, 1.4, '#164a3a', '#a8d8c8'), pine(660, 880, 1.2, '#164a3a', '#a8d8c8'), pine(40, 940, 1, '#0f3a2c', '#a8d8c8'));
  // Dovahkiin
  const helm = `<path d="M-74 -244 C-90 -340 90 -340 74 -244 C40 -262 -40 -262 -74 -244Z" ${o('#8a8a94', 7)}/><rect x="-14" y="-262" width="28" height="70" rx="8" ${o('#8a8a94', 5)}/><path d="M-76 -290 C-120 -320 -140 -360 -126 -392 C-112 -356 -92 -334 -72 -324Z" ${o('#e8e2c8', 6)}/><path d="M76 -290 C120 -320 140 -360 126 -392 C112 -356 92 -334 72 -324Z" ${o('#e8e2c8', 6)}/>`;
  k.add(`<ellipse cx="360" cy="985" rx="150" ry="16" fill="#000" opacity=".35"/>`, P.chibi(360, 980, 1.8, {top: '#6a6a74', bot: '#4a4a52', boots: '#3a2a20', skin: '#f0c49a', eye: '#3a5ad8', sleeve: '#6a6a74', glove: '#3a2a20', extra: helm, hairFront: '',
    back: `<path d="M-66 -196 C-130 -120 -140 -30 -110 -8 L110 -8 C140 -30 130 -120 66 -196Z" ${o('#7a3a2a', 7)}/>`,
    torso: `<path d="M-56 -186 C-30 -170 30 -170 56 -186 L56 -150 C30 -132 -30 -132 -56 -150Z" ${o('#8a8a94', 6)}/><rect x="-56" y="-104" width="112" height="16" ${o('#4a3a2a', 5)}/>`}));
  k.add(`<g transform="translate(560 760) rotate(20)"><rect x="-10" y="-320" width="20" height="300" rx="4" ${o('#dfe8f4', 6)}/><path d="M0 -310 V-40" stroke="#fff" stroke-width="4"/><rect x="-44" y="-20" width="88" height="16" rx="6" ${o('#c9a040', 6)}/><rect x="-7" y="-6" width="14" height="50" ${o('#4a2a10', 5)}/></g>`);
  k.dots(60, 0, 0, 750, 1050, '#fff', 1.5, 3.5, .55);
  k.finish();
};

S['the-witcher-3-wild-hunt'] = k=>{
  k.sky(['#1a0a0a', '#5a1a0a', '#c8480a', '#ffb040']); k.glow(560, 420, 400, '#ffb040', .8); k.rays(560, 420, '#ffd070', 16, .12);
  // fumo
  for(let i = 0; i < 6; i++) k.add(`<ellipse cx="${100 + i * 130}" cy="${260 + (i % 3) * 60}" rx="150" ry="60" fill="#2a0a06" opacity=".35" filter="${k.blur(14)}"/>`);
  // campo di battaglia: lance e stendardi
  const spear = (x, y, h, a)=> `<g transform="translate(${x} ${y}) rotate(${a})"><rect x="-3" y="${-h}" width="6" height="${h}" fill="#1a0806"/><path d="M0 ${-h - 40} L12 ${-h} L-12 ${-h}Z" fill="#1a0806"/></g>`;
  k.add([[40, 800, 380, -6], [120, 810, 320, 4], [630, 800, 400, 7], [700, 820, 340, -3], [560, 790, 300, 9]].map(a=> spear(...a)).join(''));
  k.add(`<g transform="translate(600 620)"><rect x="-3" y="-160" width="6" height="200" fill="#1a0806"/><path d="M3 -150 H110 L84 -110 L110 -70 H3Z" fill="#7a1010" stroke="${INK}" stroke-width="4"/></g>`);
  k.add(`<rect y="820" width="750" height="230" fill="#1a0806"/>`);
  k.add(P.flame(k, 60, 830, .8, '#ff7a1a', '#ffc040', '#fff0a0'), P.flame(k, 700, 850, .7, '#ff7a1a', '#ffc040', '#fff0a0'));
  // Geralt
  const hairBack = `<path d="M-70 -260 C-130 -270 -150 -150 -120 -60 C-120 -140 -96 -210 -56 -226Z" ${o('#e8e8ee', 6)}/><path d="M70 -260 C130 -270 150 -150 120 -60 C120 -140 96 -210 56 -226Z" ${o('#e8e8ee', 6)}/>`;
  const hairFront = `<path d="M-72 -246 C-84 -322 84 -322 72 -246 C40 -282 -40 -282 -72 -246Z" ${o('#f0f0f6', 7)}/>`;
  const swords = `<g transform="translate(-50 -200) rotate(-32)"><rect x="-8" y="-400" width="16" height="360" rx="4" ${o('#dfe8f4', 5)}/><rect x="-26" y="-40" width="52" height="10" ${o('#4a3a2a', 4)}/><rect x="-5" y="-30" width="10" height="70" fill="#2a1a10" stroke="${INK}" stroke-width="4"/></g><g transform="translate(50 -200) rotate(32)"><rect x="-8" y="-400" width="16" height="360" rx="4" ${o('#c8a060', 5)}/><rect x="-26" y="-40" width="52" height="10" ${o('#4a3a2a', 4)}/><rect x="-5" y="-30" width="10" height="70" fill="#2a1a10" stroke="${INK}" stroke-width="4"/></g>`;
  k.add(`<ellipse cx="375" cy="985" rx="160" ry="16" fill="#000" opacity=".5"/>`, P.chibi(375, 980, 1.9, {top: '#2a2226', bot: '#2a2226', boots: '#1a1418', skin: '#e8c4a0', eye: '#f0d020', sleeve: '#2a2226', glove: '#1a1418', brow: '#c8c8d0', back: swords, hairBack, hairFront,
    torso: `<path d="M-56 -186 L-30 -66 H30 L56 -186" fill="none" stroke="#8a7050" stroke-width="6"/><rect x="-56" y="-116" width="112" height="14" ${o('#6a4a2a', 4)}/><path d="M-24 -170 L0 -140 L24 -170" fill="none" stroke="#8a7050" stroke-width="5"/>`,
    extra: `<path d="M-30 -258 L-12 -228" stroke="#a03030" stroke-width="5" stroke-linecap="round"/><ellipse cx="-22" cy="-226" rx="12" ry="18" fill="none"/>` }));
  // medaglione del lupo
  k.add(`<g transform="translate(375 780)"><circle r="34" ${o('#b8c0c8', 5)}/><circle r="20" fill="none" stroke="${INK}" stroke-width="4"/><path d="M-12 -10 L0 12 L12 -10 M-6 -2 L-2 -12 M6 -2 L2 -12" fill="none" stroke="${INK}" stroke-width="4"/></g>`);
  k.dots(40, 0, 200, 750, 900, '#ffb040', 1.5, 3, .7);
  k.finish();
};

S['dark-souls'] = k=>{
  k.sky(['#08080c', '#1a1a22', '#3a3a44', '#8a8078']); k.glow(375, 640, 460, '#ff8a2a', .55);
  // boss gigante e nebbia
  k.add(`<g transform="translate(375 800)" fill="#0c0c12" stroke="#4a4a58" stroke-width="4"><path d="M-160 0 L-150 -300 L-110 -480 C-110 -560 -60 -600 0 -600 C60 -600 110 -560 110 -480 L150 -300 L160 0Z"/><path d="M-30 -600 L-10 -720 L10 -600Z"/><path d="M-110 -470 L-200 -520 L-160 -400Z M110 -470 L200 -520 L160 -400Z"/><rect x="-14" y="-800" width="28" height="700" opacity="0" /><path d="M180 -300 L230 -900 L250 -300Z" fill="#1a1a22"/></g><ellipse cx="345" cy="220" rx="10" ry="6" fill="#f2a030"/><ellipse cx="405" cy="220" rx="10" ry="6" fill="#f2a030"/>`);
  for(let i = 0; i < 6; i++) k.add(`<ellipse cx="${(i * 170) % 750}" cy="${760 + (i % 2) * 40}" rx="200" ry="50" fill="#9a9aa8" opacity=".18" filter="${k.blur(16)}"/>`);
  k.add(`<rect y="860" width="750" height="190" fill="#100e12"/><path d="M0 860 C200 840 500 880 750 850" fill="none" stroke="#3a3a44" stroke-width="4"/>`);
  // rovine: archi
  k.add(`<g fill="#16161c" stroke="#3a3a44" stroke-width="3"><path d="M-20 860 V420 C-20 300 140 300 140 420 V860 H90 V440 C90 380 30 380 30 440 V860Z"/><path d="M610 860 V400 C610 290 770 290 770 400 V860 H720 V430 C720 370 660 370 660 430 V860Z"/></g>`);
  // falò con spada a spirale
  k.glow(375, 850, 320, '#ff8a2a', .8);
  k.add(`<ellipse cx="375" cy="900" rx="190" ry="34" fill="#2a1a10" stroke="${INK}" stroke-width="5"/>`);
  k.add(P.flame(k, 375, 900, 2.4, '#ff7a1a', '#ffc040', '#fff0b0'));
  k.add(`<g transform="translate(375 900)"><rect x="-7" y="-320" width="14" height="320" rx="3" ${o('#c8c8d0', 5)}/><path d="M-40 -120 C-40 -160 40 -160 40 -200 C40 -240 -40 -240 -40 -280" fill="none" stroke="#8a8a94" stroke-width="10" stroke-linecap="round"/><rect x="-30" y="-20" width="60" height="12" ${o('#5a5a64', 4)}/></g>`);
  // cavaliere seduto
  k.add(`<g transform="translate(180 930) scale(1.6)"><path d="M-70 0 C-80 -60 -60 -110 -20 -130 L40 -130 C80 -110 90 -60 80 0Z" ${o('#6a6a74', 7)}/><path d="M-60 -20 C-100 -10 -110 20 -90 30 L-30 20Z" ${o('#5a5a64', 6)}/><path d="M-30 -130 C-40 -230 60 -230 50 -130Z" ${o('#8a8a94', 7)}/><rect x="-24" y="-190" width="66" height="10" fill="#0a0a10"/><path d="M-30 -136 L60 -136" stroke="${INK}" stroke-width="5"/><path d="M60 -110 L130 -10" stroke="${INK}" stroke-width="26" stroke-linecap="round"/><path d="M60 -110 L130 -10" stroke="#6a6a74" stroke-width="16" stroke-linecap="round"/><path d="M-60 -60 C-110 -100 -140 -40 -150 0" fill="none" stroke="#b8402a" stroke-width="16" opacity=".8"/></g>`);
  k.dots(70, 0, 500, 750, 1000, '#ffb040', 1.5, 3.5, .8);
  k.finish();
};

S['elden-ring'] = k=>{
  k.sky(['#1a1206', '#5a3a0a', '#c8902a', '#ffe08a']); k.glow(375, 380, 460, '#fff0b0', .9); k.rays(375, 380, '#ffe9a0', 24, .13);
  // Albero Madre
  const branch = (x, y, len, a, w, d)=>{ const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len; let s = `<path d="M${r1(x)} ${r1(y)} L${r1(ex)} ${r1(ey)}" stroke="#7a4a0a" stroke-width="${r1(w)}" stroke-linecap="round"/><path d="M${r1(x)} ${r1(y)} L${r1(ex)} ${r1(ey)}" stroke="#ffd25a" stroke-width="${r1(w * .55)}" stroke-linecap="round"/>`; if(d > 0){ s += branch(ex, ey, len * .72, a - .5, w * .66, d - 1) + branch(ex, ey, len * .72, a + .5, w * .66, d - 1); } return s; };
  k.add(`<g>${branch(375, 700, 150, -Math.PI / 2, 48, 6)}</g>`);
  k.glow(375, 250, 300, '#fff0a0', .7);
  for(let i = 0; i < 40; i++) k.add(`<circle cx="${140 + (i * 137) % 480}" cy="${90 + (i * 89) % 320}" r="${6 + (i % 5) * 4}" fill="#ffe27a" opacity=".55"/>`);
  k.hills(760, 70, ['#4a3a1a', '#1a1408'], {f: .007}); 
  k.add(`<rect y="820" width="750" height="230" fill="#0e0a04"/>`);
  for(let i = 0; i < 5; i++) k.add(`<ellipse cx="${i * 190}" cy="${830 + (i % 2) * 20}" rx="200" ry="34" fill="#ffe9a0" opacity=".2" filter="${k.blur(12)}"/>`);
  // cavaliere in sella
  k.add(`<ellipse cx="380" cy="985" rx="240" ry="18" fill="#000" opacity=".5"/>`);
  k.add(P.horse(330, 980, 1.5, '#f0e4c0', {dark: '#c8a860', saddle: false}));
  k.add(`<g transform="translate(320 640) scale(1.4)"><path d="M-60 40 C-70 -60 -40 -130 0 -140 C40 -130 70 -60 60 40Z" ${o('#2a2830', 7)}/><path d="M-70 40 C-120 60 -140 120 -130 160 L-40 100Z" ${o('#2a2830', 6)}/><path d="M-50 -130 C-50 -200 50 -200 50 -130 C50 -100 -50 -100 -50 -130Z" ${o('#3a3840', 7)}/><path d="M-30 -160 H30 V-140 H-30Z" fill="#0a0a10"/><ellipse cx="-10" cy="-150" rx="6" ry="4" fill="#ffd25a"/><ellipse cx="14" cy="-150" rx="6" ry="4" fill="#ffd25a"/><g transform="translate(60 -60) rotate(-24)"><rect x="-6" y="-300" width="12" height="270" rx="4" ${o('#ffe9a0', 5)}/><rect x="-26" y="-30" width="52" height="10" ${o('#c9a040', 4)}/></g></g>`);
  k.dots(80, 0, 0, 750, 1050, '#ffe27a', 1.5, 4, .7);
  k.finish();
};

S['red-dead-redemption-2'] = k=>{
  k.sky(['#3a2a5a', '#9a4a6a', '#ff8a5a', '#ffd9a0']); k.glow(500, 640, 440, '#ffe0a0', .9);
  k.add(`<circle cx="500" cy="660" r="150" fill="${k.lg([[0, '#fff7d0'], [1, '#ffb070']])}"/>`);
  k.cloud(140, 250, 1.6, '#ffc0a0', .55); k.cloud(560, 200, 1.4, '#ff9a8a', .5);
  k.hills(700, 180, ['#5a4a7a', '#2a2244'], {f: .006, sharp: true, op: .95}); k.hills(760, 90, ['#e8dce8', '#b09ac0'], {f: .009, sharp: true});
  k.add(`<rect y="820" width="750" height="230" fill="${k.lg([[0, '#f4e8f0'], [1, '#9a86b0']])}"/><path d="M0 820 C160 800 320 840 480 815 C620 795 700 825 750 815 V860 H0Z" fill="#dcccdc"/>`);
  k.add(pine(60, 850, 1.3, '#1a3a34', '#e8f0f0'), pine(150, 870, 1, '#1a3a34', '#e8f0f0'), pine(690, 860, 1.4, '#1a3a34', '#e8f0f0'), pine(610, 880, .9, '#1a3a34', '#e8f0f0'));
  // Arthur a cavallo
  k.add(`<ellipse cx="380" cy="985" rx="240" ry="16" fill="#3a2a5a" opacity=".5"/>`);
  k.add(P.horse(340, 980, 1.5, '#5a3a22', {dark: '#2a1a10'}));
  k.add(`<g transform="translate(330 668) scale(1.3)"><path d="M-56 40 C-66 -60 -40 -120 0 -130 C40 -120 66 -60 56 40Z" ${o('#4a3a2a', 7)}/><path d="M-50 40 C-90 120 -80 160 -60 190 L-20 130Z" ${o('#3a2e22', 6)}/><path d="M-20 -110 L20 -110 L0 -60Z" fill="#c8402a" opacity=".9"/><ellipse cx="0" cy="-150" rx="46" ry="52" ${o('#f0c49a', 7)}/><path d="M-30 -130 C-20 -100 20 -100 30 -130 C20 -80 -20 -80 -30 -130Z" ${o('#4a2a18', 5)}/><ellipse cx="-10" cy="-152" rx="6" ry="9" fill="#2a2a2a"/><ellipse cx="14" cy="-152" rx="6" ry="9" fill="#2a2a2a"/><path d="M-110 -166 C-80 -200 80 -200 110 -166 C60 -150 -60 -150 -110 -166Z" ${o('#3a2418', 7)}/><path d="M-50 -170 C-40 -240 40 -240 50 -170Z" ${o('#3a2418', 7)}/><path d="M-48 -186 H48" stroke="#c8a060" stroke-width="7"/><path d="M50 -50 C100 -60 130 -30 150 20" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M50 -50 C100 -60 130 -30 150 20" fill="none" stroke="#4a3a2a" stroke-width="20" stroke-linecap="round"/></g>`);
  k.dots(120, 0, 0, 750, 1050, '#fff', 1.5, 3.5, .7);
  k.finish();
};

module.exports = S;
