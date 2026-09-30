// Terza serie: picchiaduro, sparatutto, Minecraft, Mega Man, Metal Gear.
const {o, INK, shadow, r1, mulberry} = require('./kit.js');
const P = require('./parts.js');
const S = {};

S['street-fighter-ii'] = k=>{
  k.sky(['#0a0620', '#2a0f4a', '#7a1a5a', '#ff6a3a']); k.glow(375, 360, 460, '#ffb060', .6);
  // riflettori e folla
  [[80, 0, 300], [670, 0, 450], [375, 0, 380]].forEach(([x, y, tx])=> k.add(`<path d="M${x - 14} ${y} L${tx - 70} 640 L${tx + 70} 640 L${x + 14} ${y}Z" fill="#fff" opacity=".07"/>`));
  let crowd = ''; const rnd = mulberry(7); for(let i = 0; i < 90; i++){ const x = rnd() * 750, y = 560 + rnd() * 120; crowd += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(16 + rnd() * 10)}" fill="${['#1a1030', '#26123a', '#301442'][i % 3]}"/><rect x="${r1(x - 18)}" y="${r1(y + 14)}" width="36" height="80" fill="#1a1030"/>`; }
  k.add(crowd); k.dots(40, 0, 520, 750, 700, '#ffd070', 1.5, 3, .7);
  k.add(`<rect y="720" width="750" height="330" fill="${k.lg([[0, '#3a2a4a'], [1, '#160c26']])}"/><path d="M0 720 H750" stroke="#ff9a4a" stroke-width="6"/>`);
  for(let i = 1; i < 6; i++) k.add(`<path d="M${375 + (i - 3) * 30} 720 L${375 + (i - 3) * 260} 1050" stroke="#fff" stroke-width="2" opacity=".18"/>`);
  // hadoken
  k.glow(420, 700, 260, '#7ad8ff', .9);
  k.add(`<g transform="translate(420 700)"><circle r="90" fill="${k.rg([[0, '#fff'], [.5, '#9ae0ff'], [1, '#2a8aff']])}" stroke="#dff6ff" stroke-width="6"/><path d="M-90 -20 C-190 -60 -260 -30 -330 -10 M-90 20 C-190 40 -250 30 -310 50 M-80 -60 C-150 -110 -210 -90 -260 -60" fill="none" stroke="#7ad8ff" stroke-width="16" stroke-linecap="round" opacity=".8"/></g>`);
  const ryu = P.chibi(210, 960, 1.6, {arms: 'fwd', top: '#f4f4f0', bot: '#f4f4f0', boots: '#d8232a', skin: '#f6c69a', eye: '#3a2a1a', sleeve: '#f4f4f0', glove: '#d8232a',
    hairBack: `<path d="M-72 -250 C-80 -320 80 -320 72 -250 L64 -216 C60 -290 -60 -290 -64 -216Z" ${o('#2a2020', 7)}/>`,
    hairFront: `<path d="M-74 -252 C-86 -330 86 -330 74 -252 C46 -282 -46 -282 -74 -252Z" ${o('#2a2020', 7)}/><path d="M-72 -262 C-30 -286 30 -286 72 -262" fill="none" stroke="#f4f4f0" stroke-width="14" stroke-linecap="round"/><path d="M-72 -262 L-116 -238 L-96 -262" fill="none" stroke="#f4f4f0" stroke-width="10" stroke-linecap="round"/>`,
    torso: `<path d="M-56 -190 L0 -120 L56 -190" fill="none" stroke="${INK}" stroke-width="5"/><rect x="-56" y="-116" width="112" height="14" fill="#2a2020" stroke="${INK}" stroke-width="4"/>`});
  const ken = P.chibi(560, 960, 1.6, {arms: 'fwd', flip: true, top: '#d8232a', bot: '#d8232a', boots: '#f4f4f0', skin: '#f6c69a', eye: '#2a58d8', sleeve: '#d8232a', glove: '#e4a020',
    hairBack: P.spikes(0, -250, 62, 5, 70, 170, 350, '#f2d24a', 7),
    hairFront: `<path d="M-76 -250 C-86 -326 86 -326 76 -250 C46 -282 -46 -282 -76 -250Z" ${o('#f2d24a', 7)}/><path d="M-72 -262 C-30 -286 30 -286 72 -262" fill="none" stroke="#d8232a" stroke-width="12" stroke-linecap="round"/>`,
    torso: `<path d="M-56 -190 L0 -120 L56 -190" fill="none" stroke="${INK}" stroke-width="5"/><rect x="-56" y="-116" width="112" height="14" fill="#2a2020" stroke="${INK}" stroke-width="4"/>`});
  k.add(`<ellipse cx="210" cy="968" rx="140" ry="14" fill="#000" opacity=".5"/><ellipse cx="560" cy="968" rx="140" ry="14" fill="#000" opacity=".5"/>`, ryu, ken);
  k.finish();
};

S['doom'] = k=>{
  k.sky(['#1a0000', '#5a0a04', '#c8300a', '#ff9a2a']); k.glow(375, 420, 460, '#ff8a1a', .8); k.rays(375, 420, '#ffb040', 18, .14);
  // cielo di brace e montagne
  k.add(`<g fill="#ffb040">${Array.from({length: 60}, (_, i)=> `<circle cx="${(i * 137) % 750}" cy="${(i * 211) % 800}" r="${1 + (i % 3)}" opacity="${.3 + (i % 5) * .12}"/>`).join('')}</g>`);
  k.hills(640, 120, ['#3a0a04', '#1a0402'], {f: .006, sharp: true});
  k.add(`<rect y="800" width="750" height="250" fill="${k.lg([[0, '#ff6a1a'], [.15, '#8a1a04'], [1, '#1a0402']])}"/>`);
  // cacodemone
  const caco = (x, y, s)=> `<g transform="translate(${x} ${y}) scale(${s})"><circle r="120" ${o('#c8232a', 7)}/><path d="M-90 -50 C-60 -110 60 -110 90 -50" fill="none" stroke="#8a1218" stroke-width="10"/><ellipse cx="0" cy="-30" rx="38" ry="44" ${o('#f2e04a', 6)}/><ellipse cx="0" cy="-28" rx="16" ry="30" fill="#2a8a2a"/><ellipse cx="0" cy="-28" rx="6" ry="20" fill="${INK}"/><path d="M-84 30 C-40 90 40 90 84 30 C40 60 -40 60 -84 30Z" ${o('#1a0004', 6)}/><g fill="#fff" stroke="${INK}" stroke-width="3">${[-64, -34, -4, 26, 56].map(a=> `<path d="M${a} 46 l9 20 l9 -20Z"/>`).join('')}</g><path d="M-100 -70 l-30 -50 l50 30Z M100 -70 l30 -50 l-50 30Z" ${o('#ffe9c0', 5)}/></g>`;
  k.add(caco(150, 380, .9), caco(620, 300, .65));
  // Doomguy busto
  k.add(`<g transform="translate(375 1000)">
    <path d="M-330 60 C-330 -160 -250 -250 -130 -270 L130 -270 C250 -250 330 -160 330 60Z" ${o('#4a8a3a', 8)}/>
    <path d="M-330 -60 C-260 -100 -200 -80 -170 -30 L-200 70 L-330 70Z" ${o('#3a7a2a', 7)}/><path d="M330 -60 C260 -100 200 -80 170 -30 L200 70 L330 70Z" ${o('#3a7a2a', 7)}/>
    <path d="M-120 -270 L-150 -380 L150 -380 L120 -270Z" ${o('#5a3a22', 7)}/>
    <path d="M-150 -370 C-190 -500 -170 -620 -100 -660 C-40 -690 40 -690 100 -660 C170 -620 190 -500 150 -370Z" ${o('#5aa04a', 8)}/>
    <path d="M-120 -560 C-100 -650 100 -650 120 -560 C120 -520 100 -486 60 -486 L-60 -486 C-100 -486 -120 -520 -120 -560Z" ${o('#e2b62a', 7)}/>
    <path d="M-100 -556 C-90 -620 90 -620 100 -556 C60 -580 -60 -580 -100 -556Z" fill="#fff" opacity=".35"/>
    <path d="M-150 -470 H150" stroke="${INK}" stroke-width="6"/><rect x="-60" y="-470" width="120" height="60" rx="10" ${o('#3a7a2a', 6)}/>
    <g stroke="${INK}" stroke-width="5">${[-50, -25, 0, 25, 50].map(x=> `<path d="M${x} -466 V-414"/>`).join('')}</g>
    <path d="M-200 -160 C-190 -300 -40 -330 60 -300" fill="none" stroke="#7ac86a" stroke-width="6" opacity=".6"/>
    <g transform="translate(180 -120) rotate(-40)"><rect x="-16" y="-330" width="32" height="360" rx="6" ${o('#4a4a54', 7)}/><rect x="-30" y="-20" width="60" height="110" rx="10" ${o('#5a3a22', 7)}/><rect x="-10" y="-330" width="20" height="30" fill="#0a0a10"/></g>
  </g>`);
  k.glow(375, 440, 200, '#ff6a1a', .25);
  k.finish();
};

// Minecraft: texture a pixel disegnate a mano
const px = (x, y, w, h, n, base, alt, rnd)=>{ let s = ''; const cw = w / n, ch = h / n; for(let i = 0; i < n; i++) for(let j = 0; j < n; j++) s += `<rect x="${r1(x + i * cw)}" y="${r1(y + j * ch)}" width="${r1(cw + .6)}" height="${r1(ch + .6)}" fill="${rnd() < .35 ? alt[Math.floor(rnd() * alt.length)] : base}"/>`; return s; };
S['minecraft'] = k=>{
  const rnd = mulberry(11);
  k.sky(['#5aa8f0', '#8ecaf8', '#cfeaff']); k.add(`<rect x="560" y="120" width="110" height="110" fill="#fff8c0"/><rect x="580" y="140" width="70" height="70" fill="#fff"/>`); k.glow(615, 175, 300, '#fff6c0', .5);
  [[80, 200], [420, 130], [220, 330]].forEach(([x, y])=> k.add(`<g fill="#fff" opacity=".92"><rect x="${x}" y="${y}" width="190" height="44"/><rect x="${x + 30}" y="${y - 30}" width="110" height="34"/><rect x="${x + 60}" y="${y + 44}" width="80" height="26"/></g>`));
  // terreno a blocchi (colline a gradini)
  let land = ''; const B = 75;
  for(let c = 0; c < 10; c++){ const h = [7, 7, 6, 6, 5, 5, 5, 6, 6, 7][c]; for(let r = 0; r < 4; r++){ const y = 1050 - (h - r) * B * .7 + 0; } }
  for(let c = 0; c < 10; c++){ const top = 640 + [0, 0, 40, 40, 80, 80, 80, 40, 40, 0][c]; for(let y = top; y < 1050; y += B){ const grass = y === top; land += `<g><rect x="${c * B}" y="${y}" width="${B}" height="${B}" fill="${grass ? '#5fae3a' : '#8a5a34'}"/>${px(c * B, y, B, B, 5, grass ? '#5fae3a' : '#8a5a34', grass ? ['#4a9a2a', '#74c24a'] : ['#7a4a26', '#9a6a40', '#6a3c1c'], rnd)}<rect x="${c * B}" y="${y}" width="${B}" height="${B}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="3"/>${grass ? `<rect x="${c * B}" y="${y + 14}" width="${B}" height="${B - 14}" fill="#8a5a34" opacity="0"/>` : ''}</g>`; } }
  k.add(land);
  // Creeper
  const cr = (x, y, s)=> { let body = ''; body += `<rect x="-60" y="-260" width="120" height="120" fill="#4cb038" stroke="${INK}" stroke-width="6"/>` + px(-60, -260, 120, 120, 6, '#4cb038', ['#3a9a2a', '#68c84c', '#2c7a20'], rnd) + `<g fill="#0a1a08"><rect x="-42" y="-234" width="30" height="30"/><rect x="12" y="-234" width="30" height="30"/><rect x="-18" y="-204" width="36" height="30"/><rect x="-30" y="-176" width="14" height="36"/><rect x="16" y="-176" width="14" height="36"/></g>`;
    body += `<rect x="-40" y="-140" width="80" height="120" fill="#4cb038" stroke="${INK}" stroke-width="6"/>` + px(-40, -140, 80, 120, 5, '#4cb038', ['#3a9a2a', '#68c84c', '#2c7a20'], rnd);
    body += `<rect x="-58" y="-20" width="50" height="40" fill="#4cb038" stroke="${INK}" stroke-width="5"/><rect x="8" y="-20" width="50" height="40" fill="#4cb038" stroke="${INK}" stroke-width="5"/>`; return `<g transform="translate(${x} ${y}) scale(${s})">${body}</g>`; };
  k.add(cr(560, 620, 1.9));
  // Steve
  const steve = (x, y, s)=> { let b = '';
    b += `<rect x="-38" y="-70" width="36" height="70" fill="#3a3aa8" stroke="${INK}" stroke-width="5"/><rect x="2" y="-70" width="36" height="70" fill="#4a4ab8" stroke="${INK}" stroke-width="5"/>` + `<rect x="-38" y="-14" width="36" height="14" fill="#6a6a70"/><rect x="2" y="-14" width="36" height="14" fill="#6a6a70"/>`;
    b += `<rect x="-42" y="-150" width="84" height="84" fill="#28b0b8" stroke="${INK}" stroke-width="5"/>` + px(-42, -150, 84, 84, 5, '#28b0b8', ['#1e98a0', '#38c4cc'], rnd);
    b += `<rect x="-78" y="-150" width="36" height="84" fill="#f2b48a" stroke="${INK}" stroke-width="5"/><rect x="42" y="-150" width="36" height="84" fill="#f2b48a" stroke="${INK}" stroke-width="5"/>`;
    b += `<rect x="-48" y="-240" width="96" height="92" fill="#f2b48a" stroke="${INK}" stroke-width="6"/>` + px(-48, -240, 96, 92, 6, '#f2b48a', ['#e2a078', '#fac49a'], rnd) + `<rect x="-48" y="-240" width="96" height="30" fill="#4a2a14"/><rect x="-48" y="-224" width="20" height="30" fill="#4a2a14"/><rect x="28" y="-224" width="20" height="30" fill="#4a2a14"/><rect x="-36" y="-198" width="26" height="14" fill="#fff"/><rect x="10" y="-198" width="26" height="14" fill="#fff"/><rect x="-26" y="-198" width="14" height="14" fill="#4a3aa8"/><rect x="10" y="-198" width="14" height="14" fill="#4a3aa8"/><rect x="-14" y="-176" width="28" height="12" fill="#a8683a"/>`;
    b += `<g transform="translate(80 -110) rotate(-30)"><rect x="-6" y="-120" width="12" height="130" fill="#6a4a22" stroke="${INK}" stroke-width="4"/><path d="M-90 -120 C-50 -160 50 -160 90 -120 L70 -104 C40 -132 -40 -132 -70 -104Z" fill="#9aa8b8" stroke="${INK}" stroke-width="6"/></g>`;
    return `<g transform="translate(${x} ${y}) scale(${s})">${b}</g>`; };
  k.add(`<ellipse cx="220" cy="646" rx="120" ry="14" fill="#000" opacity=".3"/>`, steve(220, 640, 1.9));
  // torcia e stelline di polvere
  k.dots(24, 0, 300, 750, 700, '#ffe08a', 2, 5, .5);
  k.finish({grain: .2});
};

S['half-life-2'] = k=>{
  k.sky(['#2a3038', '#5a6a70', '#a8b4b0', '#d8dccc']); k.glow(375, 320, 420, '#eef2e0', .6);
  // Cittadella: torre a spirale
  k.add(`<g transform="translate(520 720)"><path d="M-70 0 L-46 -560 L-14 -760 L0 -840 L14 -760 L46 -560 L70 0Z" fill="#3a4448" stroke="${INK}" stroke-width="6"/><path d="M-60 -60 C40 -130 -50 -200 40 -270 C-40 -340 30 -400 -30 -470 M-50 -100 H50 M-46 -300 H46 M-40 -480 H40" fill="none" stroke="#6a7a80" stroke-width="7"/><ellipse cx="0" cy="-620" rx="110" ry="24" fill="none" stroke="#5a6a70" stroke-width="10"/><circle cx="0" cy="-800" r="14" fill="#7dd8ff"/></g>`);
  k.glow(520, -80, 100, '#7dd8ff', .7);
  k.skyline(760, '#20262a', {hmin: 60, hvar: 200, wmin: 40, wvar: 60, windows: '#c8d090'});
  k.add(`<rect y="800" width="750" height="250" fill="#20262a"/><path d="M0 800 H750" stroke="#c8d090" stroke-width="3" opacity=".4"/>`);
  // lambda gigante
  k.add(`<g transform="translate(200 470)" opacity=".3"><circle r="150" fill="none" stroke="#ff8a1a" stroke-width="16"/><path d="M-70 90 L10 -90 L34 -50 M-14 -10 L70 90" fill="none" stroke="#ff8a1a" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/></g>`);
  // Alyx
  const alyx = P.chibi(210, 960, 1.5, {top: '#a8a89a', bot: '#3a4a5a', boots: '#3a2a20', skin: '#f2c49a', eye: '#5a3a1a', sleeve: '#8a8a7a',
    hairBack: `<path d="M-60 -290 C-140 -300 -170 -230 -140 -150 C-140 -200 -100 -240 -56 -250Z" ${o('#3a2418', 6)}/>`,
    hairFront: `<path d="M-72 -246 C-84 -320 82 -320 72 -246 C46 -278 -46 -278 -72 -246Z" ${o('#3a2418', 7)}/>`,
    torso: `<path d="M-56 -186 L-20 -70 M56 -186 L20 -70" stroke="${INK}" stroke-width="5"/><rect x="-56" y="-124" width="112" height="12" fill="#5a4a2a" stroke="${INK}" stroke-width="4"/>`});
  // Gordon
  const hev = `<path d="M-56 -190 L-30 -190 L-20 -70 L-58 -70Z" fill="#f47a1a" stroke="${INK}" stroke-width="4"/><path d="M56 -190 L30 -190 L20 -70 L58 -70Z" fill="#f47a1a" stroke="${INK}" stroke-width="4"/><g transform="translate(0 -130)"><circle r="26" fill="#1a1a20" stroke="${INK}" stroke-width="5"/><path d="M-12 12 L2 -12 L8 -4 M-2 2 L12 12" fill="none" stroke="#ff8a1a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  const gordon = P.chibi(500, 960, 1.75, {top: '#f47a1a', bot: '#5a5a62', boots: '#2a2a30', skin: '#f2c49a', eye: '#3a2a1a', sleeve: '#f47a1a', glove: '#3a3a44', brow: '#3a2418',
    hairFront: `<path d="M-70 -244 C-80 -316 80 -316 70 -244 C44 -276 -44 -276 -70 -244Z" ${o('#3a2418', 7)}/>`,
    torso: hev,
    extra: `<path d="M-50 -204 C-40 -176 40 -176 50 -204 C40 -160 -40 -160 -50 -204Z" ${o('#3a2418', 5)}/><circle cx="-22" cy="-226" r="21" fill="#fff" fill-opacity=".25" stroke="${INK}" stroke-width="5"/><circle cx="24" cy="-226" r="21" fill="#fff" fill-opacity=".25" stroke="${INK}" stroke-width="5"/><path d="M-1 -226 H3" stroke="${INK}" stroke-width="5"/>`});
  k.add(`<ellipse cx="210" cy="968" rx="120" ry="14" fill="#000" opacity=".5"/><ellipse cx="500" cy="968" rx="140" ry="16" fill="#000" opacity=".5"/>`, alyx, gordon);
  k.add(`<g transform="translate(640 880) rotate(20)"><rect x="-10" y="-300" width="20" height="300" rx="8" ${o('#d8232a', 6)}/><path d="M-10 -300 C-10 -350 40 -370 60 -340 L40 -320 C30 -340 10 -330 10 -300Z" ${o('#d8232a', 6)}/></g>`);
  k.finish();
};

S['mega-man-x'] = k=>{
  k.sky(['#1a1a5a', '#4a2a9a', '#e0508a', '#ffb060']); k.glow(375, 640, 460, '#ffd070', .8); k.rays(375, 640, '#fff', 16, .1);
  // grattacieli e autostrada
  k.skyline(700, '#241a4a', {hmin: 140, hvar: 320, wmin: 40, wvar: 50, windows: '#7ad8ff'}); k.skyline(760, '#160e34', {hmin: 60, hvar: 200, wmin: 50, wvar: 60, windows: '#ffd070'});
  k.add(`<rect y="800" width="750" height="250" fill="#20204a"/><path d="M0 800 H750" stroke="#7ad8ff" stroke-width="6"/>`);
  for(let i = 0; i < 8; i++) k.add(`<path d="M${(i * 110) % 750} 900 h60" stroke="#ffd070" stroke-width="8" stroke-linecap="round" opacity=".8"/>`);
  const hb = (col, gem)=> ({top: col, bot: col, boots: col, skin: '#f8d4b0', eye: '#2a58d8', sleeve: col, glove: col});
  // X
  const X = P.chibi(230, 960, 1.65, Object.assign(hb('#2a6ae8'), {boots: '#2a6ae8', brow: '#2a2a3a',
    hairBack: `<path d="M-74 -246 C-86 -336 86 -336 74 -246Z" ${o('#2a6ae8', 8)}/>`,
    hairFront: `<path d="M-78 -252 C-90 -350 90 -350 78 -252 C50 -276 -50 -276 -78 -252Z" ${o('#2a6ae8', 8)}/><path d="M-20 -318 H20 L14 -290 H-14Z" ${o('#e8452a', 5)}/><circle cx="0" cy="-330" r="14" fill="#5aff8a" stroke="${INK}" stroke-width="4"/><path d="M-78 -252 V-210 M78 -252 V-210" stroke="${INK}" stroke-width="6"/>`,
    torso: `<path d="M-56 -186 L-20 -130 H20 L56 -186" fill="#e8f0ff" stroke="${INK}" stroke-width="5"/><rect x="-16" y="-160" width="32" height="24" rx="6" fill="#5aff8a" stroke="${INK}" stroke-width="4"/>`,
    extra: `<g transform="translate(90 -110)"><path d="M0 -30 H90 V30 H0 C-20 20 -20 -20 0 -30Z" ${o('#2a6ae8', 7)}/><rect x="60" y="-16" width="40" height="32" fill="#12123a" stroke="${INK}" stroke-width="4"/><circle cx="110" cy="0" r="14" fill="#7ad8ff"/></g>`}));
  // Zero
  const Z = P.chibi(530, 960, 1.65, Object.assign(hb('#e02a3a'), {flip: true, boots: '#e02a3a', brow: '#c8a020',
    hairBack: `<path d="M-40 -280 C-110 -310 -160 -210 -170 -60 C-130 -150 -90 -210 -50 -240Z" ${o('#f4d24a', 7)}/>`,
    hairFront: `<path d="M-78 -252 C-90 -350 90 -350 78 -252 C50 -276 -50 -276 -78 -252Z" ${o('#e02a3a', 8)}/><path d="M-20 -318 H20 L14 -290 H-14Z" ${o('#f4d24a', 5)}/><circle cx="0" cy="-330" r="14" fill="#5aff8a" stroke="${INK}" stroke-width="4"/>`,
    torso: `<path d="M-56 -186 L-20 -130 H20 L56 -186" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-16" y="-160" width="32" height="24" rx="6" fill="#5aff8a" stroke="${INK}" stroke-width="4"/>`,
    extra: `<g transform="translate(96 -180) rotate(-30)"><rect x="-8" y="-280" width="16" height="280" rx="6" ${o('#7dffb0', 6)}/><rect x="-24" y="-8" width="48" height="12" fill="#333" stroke="${INK}" stroke-width="4"/></g>`}));
  k.add(`<ellipse cx="230" cy="968" rx="130" ry="14" fill="#000" opacity=".5"/><ellipse cx="530" cy="968" rx="130" ry="14" fill="#000" opacity=".5"/>`, Z, X);
  k.finish();
};

S['metal-gear-solid'] = k=>{
  k.sky(['#0a1226', '#1a3a5a', '#4a7a9a', '#b8d4e4']); k.stars(30, 0, 250, '#dfe');
  k.glow(375, 300, 400, '#cfe8ff', .4);
  // Metal Gear REX in lontananza
  k.add(`<g transform="translate(540 700)" fill="#26384c" stroke="#5a7a9a" stroke-width="3" opacity=".9"><rect x="-60" y="-220" width="120" height="120" rx="20"/><path d="M-50 -110 L-90 0 H-40 L-20 -110Z"/><path d="M50 -110 L90 0 H40 L20 -110Z"/><rect x="-24" y="-260" width="48" height="50" rx="14"/><rect x="-90" y="-180" width="30" height="20"/><rect x="60" y="-180" width="30" height="20"/></g>`);
  k.hills(760, 40, ['#dfe9f2', '#a8bccb'], {f: .01}); 
  k.add(`<rect y="780" width="750" height="270" fill="${k.lg([[0, '#e6eef6'], [1, '#8aa2b6']])}"/>`);
  // neve
  const rnd = mulberry(5); let sn = ''; for(let i = 0; i < 160; i++) sn += `<circle cx="${r1(rnd() * 750)}" cy="${r1(rnd() * 1050)}" r="${r1(1.5 + rnd() * 3.5)}" opacity="${r1(.4 + rnd() * .5)}"/>`;
  // scatola di cartone
  k.add(`<g transform="translate(560 900)"><path d="M-110 -30 L110 -30 L130 -140 L-130 -140Z" ${o('#b88a54', 7)}/><path d="M-130 -140 L-90 -190 L90 -190 L130 -140Z" ${o('#c89a64', 7)}/><rect x="-60" y="-110" width="120" height="60" fill="#9a6a3a" stroke="${INK}" stroke-width="4" opacity=".6"/><path d="M-110 -30 L-90 20 H90 L110 -30Z" fill="#9a6a3a" stroke="${INK}" stroke-width="7"/><text x="0" y="-70" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="44" fill="#2a2a2a" opacity=".6">FRAGILE</text></g>`);
  // Snake
  const snake = P.chibi(280, 980, 1.85, {top: '#3a4a58', bot: '#3a4a58', boots: '#1a1a20', skin: '#f2c49a', eye: '#3a6ad8', sleeve: '#3a4a58', glove: '#1a1a20', brow: '#3a2a1a',
    hairFront: `<path d="M-74 -250 C-90 -330 90 -330 74 -250 C40 -290 -40 -290 -74 -250Z" ${o('#5a3a22', 7)}/>` + P.spikes(0, -290, 30, 4, 50, 200, 340, '#5a3a22', 5),
    torso: `<rect x="-56" y="-186" width="112" height="16" fill="#1a1a20"/><path d="M-56 -170 L-40 -70 M56 -170 L40 -70" stroke="#5a6a78" stroke-width="6"/><rect x="-40" y="-130" width="20" height="30" rx="4" fill="#2a2a30" stroke="${INK}" stroke-width="3"/><rect x="20" y="-130" width="20" height="30" rx="4" fill="#2a2a30" stroke="${INK}" stroke-width="3"/>`,
    extra: `<path d="M-72 -262 C-30 -286 30 -286 72 -262" fill="none" stroke="#2a58d8" stroke-width="14" stroke-linecap="round"/><path d="M72 -262 L118 -244 L100 -266" fill="none" stroke="#2a58d8" stroke-width="9" stroke-linecap="round"/><path d="M-54 -186 C-40 -176 40 -176 54 -186" fill="none" stroke="#2a2a30" stroke-width="10"/>`});
  k.add(`<ellipse cx="280" cy="990" rx="150" ry="16" fill="#000" opacity=".35"/>`, snake);
  k.add(`<g transform="translate(400 780)"><path d="M0 -90 V-20 M0 20 V30" stroke="#e8232a" stroke-width="22" stroke-linecap="round"/><circle cx="0" cy="48" r="12" fill="#e8232a"/></g>`);
  k.add(`<g fill="#fff">${sn}</g>`);
  k.finish();
};

module.exports = S;
