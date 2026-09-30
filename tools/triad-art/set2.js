// Seconda serie: i JRPG di livello 10.
const {o, INK, shadow, r1} = require('./kit.js');
const P = require('./parts.js');
const S = {};

S['final-fantasy-vii'] = k=>{
  k.sky(['#1a0a22', '#5a1a3a', '#c8452a', '#ffb060']); k.glow(560, 560, 380, '#ff9a3a', .7); k.stars(30, 0, 250, '#fdd');
  // Midgar: piatto con torri e riflettore verde dei reattori
  k.skyline(700, '#160c1c', {hmin: 120, hvar: 260, wmin: 30, wvar: 44, windows: '#ffb84a'});
  k.add(`<ellipse cx="560" cy="470" rx="220" ry="36" fill="#2a1a30" stroke="${INK}" stroke-width="5"/><rect x="540" y="470" width="40" height="230" fill="#1e1226"/>`);
  k.glow(560, 470, 240, '#4dff9a', .55); k.glow(560, 470, 90, '#dfffe8', .9);
  k.dots(24, 100, 300, 700, 700, '#7dffb0', 1.5, 3.5, .8);
  // Buster Sword
  k.add(`<rect y="905" width="750" height="145" fill="#120a18"/>`);
  k.add(`<g transform="translate(505 730) rotate(-8)"><path d="M-46 -540 H46 V-60 L0 -10 L-46 -60Z" ${o('#c9d4e4', 7)}/><path d="M-46 -540 H-14 V-60 L-46 -60Z" fill="#fff" opacity=".65"/><path d="M0 -530 V-30" stroke="#8090a8" stroke-width="5"/><rect x="-60" y="-44" width="120" height="24" ${o('#5a3a2a', 6)}/><rect x="-14" y="-24" width="28" height="120" ${o('#3a2418', 6)}/><circle cx="-24" cy="-300" r="14" fill="#2a1a30" stroke="${INK}" stroke-width="5"/><circle cx="18" cy="-360" r="10" fill="#2a1a30" stroke="${INK}" stroke-width="5"/></g>`);
  // Cloud
  const hairBack = P.spikes(0, -270, 60, 6, 110, 170, 355, '#f5d94a', 7);
  const hairFront = `<path d="M-72 -250 C-84 -330 80 -350 72 -250 C50 -280 20 -260 0 -290 C-20 -258 -50 -282 -72 -250Z" ${o('#f5d94a', 7)}/>` + P.spikes(0, -290, 20, 5, 90, 200, 340, '#f5d94a', 6);
  k.add(`<ellipse cx="360" cy="912" rx="150" ry="16" fill="#000" opacity=".5"/>`, P.chibi(360, 900, 1.75, {top: '#1f2a4a', bot: '#2a2a3a', boots: '#3a2a20', skin: '#f8c9a0', eye: '#38f0c8', glove: '#3a2a20', sleeve: '#1f2a4a', hairBack, hairFront,
    torso: `<path d="M-60 -186 H-20 L-10 -70 H-58Z" fill="#2c3868" stroke="${INK}" stroke-width="4"/><path d="M-70 -196 C-70 -226 -20 -226 -10 -196Z" ${o('#8a8fa0', 6)}/><circle cx="-40" cy="-204" r="8" fill="#ffd23b" stroke="${INK}" stroke-width="3"/><rect x="-58" y="-104" width="116" height="16" ${o('#5a3a2a', 5)}/>`}));
  k.finish();
};

S['final-fantasy-iv'] = k=>{
  k.sky(['#05061c', '#141a4a', '#2a2a78']); k.stars(90, 0, 700, '#fff');
  // luna enorme
  k.glow(400, 330, 440, '#b8d0ff', .5);
  k.add(`<circle cx="400" cy="330" r="240" fill="${k.rg([[0, '#f6f8ff'], [.7, '#d8e0f8'], [1, '#a8b6e0']], .4, .35, .75)}"/><g fill="#8898c8" opacity=".5"><circle cx="330" cy="260" r="34"/><circle cx="470" cy="380" r="46"/><circle cx="360" cy="420" r="24"/><circle cx="480" cy="250" r="20"/></g>`);
  k.hills(760, 90, ['#1a1e50', '#0b0d2c'], {f: .006, sharp: true});
  k.add(`<rect y="800" width="750" height="250" fill="#0a0c26"/>`);
  // cavaliere oscuro (ombra) dietro
  k.add(`<g transform="translate(560 830) scale(1.3)" fill="#0b0b1a" stroke="#5a3aa0" stroke-width="4"><path d="M-50 0 L-60 -200 C-60 -250 60 -250 60 -200 L50 0Z"/><path d="M-50 -250 L-90 -330 L-30 -280 L0 -340 L30 -280 L90 -330 L50 -250Z"/><path d="M-60 -200 L-140 -160 L-60 -110Z"/></g><ellipse cx="540" cy="580" rx="10" ry="18" fill="#e33"/><ellipse cx="580" cy="580" rx="10" ry="18" fill="#e33"/>`);
  // Cecil paladino
  const cape = `<path d="M-70 -196 C-150 -120 -160 -20 -130 0 L130 0 C160 -20 150 -120 70 -196Z" ${o('#2a3fb8', 7)}/>`;
  const hairFront = `<path d="M-72 -250 C-84 -330 84 -330 72 -250 C50 -276 20 -262 0 -284 C-20 -262 -50 -276 -72 -250Z" ${o('#f4f4fa', 7)}/>`;
  k.add(`<g transform="translate(320 920)"><path d="M0 0" />${''}</g>`);
  k.add(P.chibi(330, 930, 1.8, {top: '#e8edf8', bot: '#c8d0e4', boots: '#7a86b0', skin: '#f6d2b0', eye: '#2a58d8', glove: '#d8c060', sleeve: '#e8edf8', brow: '#c8ccd8', back: cape, hairFront,
    torso: `<path d="M-56 -186 C-30 -160 30 -160 56 -186 L56 -156 C30 -132 -30 -132 -56 -156Z" ${o('#f2d060', 6)}/><path d="M0 -150 V-70" stroke="#2a3fb8" stroke-width="10"/><circle cx="0" cy="-130" r="12" ${o('#ffd23b', 4)}/>`,
    extra: `<path d="M-30 -298 L0 -330 L30 -298Z" ${o('#ffd23b', 5)}/>`}));
  k.add(`<g transform="translate(470 700) rotate(24)"><rect x="-10" y="-330" width="20" height="300" rx="4" ${o('#eaf0ff', 6)}/><path d="M0 -320 V-40" stroke="#8ec0ff" stroke-width="4"/><rect x="-44" y="-30" width="88" height="16" rx="6" ${o('#f2d060', 6)}/><rect x="-7" y="-14" width="14" height="50" ${o('#7a4a22', 5)}/></g>`);
  k.glow(560, 300, 240, '#9ab8ff', .25);
  k.finish();
};

S['chrono-trigger'] = k=>{
  k.sky(['#0a1a4a', '#1a4a98', '#4ab0e8']); k.stars(50, 0, 500, '#cdf');
  // portale del tempo (spirale)
  k.glow(375, 450, 420, '#7dd0ff', .8);
  let sp = ''; for(let i = 0; i < 9; i++){ sp += `<ellipse cx="375" cy="450" rx="${60 + i * 34}" ry="${60 + i * 34}" fill="none" stroke="${i % 2 ? '#ffffff' : '#5ab8ff'}" stroke-width="${18 - i}" opacity="${.9 - i * .07}" transform="rotate(${i * 22} 375 450)" stroke-dasharray="${120 + i * 30} ${60 + i * 12}"/>`; }
  k.add(sp, `<circle cx="375" cy="450" r="62" fill="#fff" opacity=".95" filter="${k.blur(6)}"/>`);
  k.rays(375, 450, '#fff', 12, .12);
  k.add(`<rect y="860" width="750" height="190" fill="#16305a"/><path d="M0 860 C200 840 550 880 750 850 V900 H0Z" fill="#245a98"/>`);
  // Lucca, Crono, Marle
  const lucca = P.chibi(170, 960, 1.15, {top: '#2f8a5a', bot: '#3a4a7a', boots: '#7a3a2a', skin: '#f6cfa8', eye: '#6a3ab8', hairBack: `<path d="M-72 -240 C-90 -180 -70 -140 -50 -150 L-50 -240Z" ${o('#8a3ab8', 6)}/>`,
    hairFront: `<path d="M-74 -240 C-84 -312 84 -312 74 -240 C50 -262 -50 -262 -74 -240Z" ${o('#e8452a', 6)}/><path d="M-74 -250 C-70 -300 70 -300 74 -250 L60 -272 C20 -284 -20 -284 -60 -272Z" ${o('#d8232a', 6)}/>`,
    extra: `<circle cx="-22" cy="-226" r="20" fill="none" stroke="${INK}" stroke-width="6"/><circle cx="26" cy="-226" r="20" fill="none" stroke="${INK}" stroke-width="6"/><path d="M-2 -226 H6" stroke="${INK}" stroke-width="5"/>`});
  const marle = P.chibi(580, 960, 1.15, {top: '#f2a83a', bot: '#f2f0e6', boots: '#a8602a', skin: '#f8cfae', eye: '#2a8ad8', flip: true,
    hairBack: `<path d="M-40 -280 C-120 -300 -150 -230 -110 -160 C-112 -210 -84 -244 -50 -250Z" ${o('#f5d94a', 6)}/><circle cx="-74" cy="-268" r="14" ${o('#d8232a', 4)}/>`,
    hairFront: `<path d="M-72 -246 C-84 -318 82 -318 72 -246 C50 -276 20 -262 0 -282 C-20 -262 -50 -276 -72 -246Z" ${o('#f5d94a', 7)}/>`});
  k.add(marle, lucca);
  // Crono al centro con la katana
  k.add(`<g transform="translate(300 780) rotate(-38)"><rect x="-6" y="-300" width="12" height="270" rx="4" ${o('#eaf0ff', 5)}/><rect x="-30" y="-30" width="60" height="10" rx="4" ${o('#d8b23a', 4)}/><rect x="-6" y="-20" width="12" height="46" ${o('#5a2a18', 5)}/></g>`);
  const hb = P.spikes(0, -252, 66, 7, 120, 170, 350, '#e8322a', 7);
  const hf = `<path d="M-76 -248 C-88 -330 88 -330 76 -248 C46 -282 20 -258 0 -290 C-20 -258 -46 -282 -76 -248Z" ${o('#e8322a', 7)}/>` + P.spikes(0, -282, 24, 4, 80, 205, 335, '#e8322a', 6);
  k.add(`<ellipse cx="375" cy="965" rx="150" ry="18" fill="#000" opacity=".35"/>`, P.chibi(375, 960, 1.65, {top: '#f0ece0', bot: '#2a5ad0', boots: '#e8322a', skin: '#f8cfae', eye: '#2a2a2a', sleeve: '#f0ece0', glove: '#f8cfae', hairBack: hb, hairFront: hf,
    torso: `<path d="M-56 -186 L0 -110 L56 -186 L56 -150 L0 -70Z" ${o('#2a5ad0', 5)}/><path d="M-56 -190 C-30 -216 30 -216 56 -190" fill="none" stroke="#e8322a" stroke-width="16" stroke-linecap="round"/>`,
    extra: `<path d="M-64 -258 C-30 -274 30 -274 64 -258" fill="none" stroke="#e8322a" stroke-width="12" stroke-linecap="round"/>`}));
  k.finish();
};

S['chrono-cross'] = k=>{
  k.sky(['#ff8a5a', '#ffc46a', '#ffe9a8', '#7ad8e8']); k.glow(375, 520, 400, '#fff2c0', .9); k.rays(375, 520, '#fff', 14, .18);
  k.add(`<rect y="520" width="750" height="180" fill="${k.lg([[0, '#8ae0ee'], [1, '#1a8ab8']])}"/>`);
  for(let i = 0; i < 9; i++) k.add(`<path d="M${(i * 97) % 750 - 30} ${560 + i * 16} q30 -14 60 0 q30 14 60 0" fill="none" stroke="#fff" stroke-width="4" opacity=".6"/>`);
  k.add(`<path d="M0 700 C120 660 250 690 375 700 C520 712 650 670 750 690 V1050 H0Z" fill="#f3d69a" stroke="${INK}" stroke-width="0"/><path d="M0 800 C200 770 500 830 750 790 V1050 H0Z" fill="#e6c380"/>`);
  const palm = (x, y, s, fl)=> `<g transform="translate(${x} ${y}) scale(${fl ? -s : s} ${s})"><path d="M0 0 C-30 -120 20 -230 60 -330" fill="none" stroke="${INK}" stroke-width="32" stroke-linecap="round"/><path d="M0 0 C-30 -120 20 -230 60 -330" fill="none" stroke="#a5713a" stroke-width="22" stroke-linecap="round"/>${[-160, -110, -60, -15, 25].map(a=> { const r = a * Math.PI / 180; return `<path d="M60 -330 C${60 + Math.cos(r) * 70} ${-330 + Math.sin(r) * 60 - 40} ${60 + Math.cos(r) * 140} ${-330 + Math.sin(r) * 120} ${60 + Math.cos(r) * 190} ${-330 + Math.sin(r) * 180 + 50}" fill="none" stroke="${INK}" stroke-width="28" stroke-linecap="round"/><path d="M60 -330 C${60 + Math.cos(r) * 70} ${-330 + Math.sin(r) * 60 - 40} ${60 + Math.cos(r) * 140} ${-330 + Math.sin(r) * 120} ${60 + Math.cos(r) * 190} ${-330 + Math.sin(r) * 180 + 50}" fill="none" stroke="#2fb04a" stroke-width="18" stroke-linecap="round"/>`; }).join('')}</g>`;
  k.add(palm(80, 760, 1.15), palm(690, 730, 1));
  // Serge e Kid
  const kid = P.chibi(520, 930, 1.55, {top: '#d8232a', bot: '#3a2a4a', boots: '#c85a2a', skin: '#f8cfae', eye: '#2a8ad8', flip: true,
    hairBack: `<path d="M-40 -284 C-130 -300 -166 -230 -120 -140 C-124 -206 -90 -244 -50 -252Z" ${o('#f0d040', 6)}/>`,
    hairFront: `<path d="M-72 -246 C-84 -318 82 -318 72 -246 C50 -276 20 -262 0 -282 C-20 -262 -50 -276 -72 -246Z" ${o('#f0d040', 7)}/><path d="M-70 -262 C-30 -290 30 -290 70 -262" fill="none" stroke="#d8232a" stroke-width="14" stroke-linecap="round"/>`});
  const serge = P.chibi(250, 930, 1.55, {top: '#f4f0e0', bot: '#2a5ad0', boots: '#3a2a20', skin: '#f6cfa8', eye: '#2a2a2a',
    hairBack: P.spikes(0, -252, 62, 6, 90, 165, 360, '#2a58d8', 7),
    hairFront: `<path d="M-74 -244 C-86 -322 86 -322 74 -244 C50 -278 20 -256 0 -284 C-20 -256 -50 -278 -74 -244Z" ${o('#2a58d8', 7)}/><path d="M-72 -264 C-30 -294 30 -294 72 -264" fill="none" stroke="#e8e8f0" stroke-width="12" stroke-linecap="round"/>`,
    torso: `<path d="M-56 -186 L0 -100 L56 -186" fill="none" stroke="#2a5ad0" stroke-width="10"/>`});
  k.add(`<ellipse cx="250" cy="936" rx="120" ry="14" fill="#000" opacity=".3"/><ellipse cx="520" cy="936" rx="120" ry="14" fill="#000" opacity=".3"/>`, serge, kid);
  k.add(`<g transform="translate(375 600)"><circle r="40" ${o('#5ad8ff', 6)} opacity=".9"/><path d="M-20 -6 C-8 -30 20 -20 20 0 C20 20 -6 30 -16 14" fill="none" stroke="#fff" stroke-width="7"/></g>`);
  k.finish({grain: .25});
};

S['dragon-quest-iii'] = k=>{
  k.sky(['#1a0a12', '#4a1226', '#a02a2a', '#ff7a3a']); k.glow(560, 300, 400, '#ff9a4a', .7); k.rays(560, 300, '#ffb070', 16, .12);
  k.add(`<g fill="#ffcf60" opacity=".7">${Array.from({length: 30}, (_, i)=> `<circle cx="${(i * 191) % 750}" cy="${(i * 97) % 700}" r="${1 + (i % 3)}"/>`).join('')}</g>`);
  k.hills(700, 90, ['#3a0a12', '#1a0508'], {f: .007, sharp: true});
  k.add(`<rect y="780" width="750" height="270" fill="#1a0508"/>`);
  // Zoma: sagoma gigantesca con corna
  k.add(`<g transform="translate(560 640)"><path d="M-160 0 C-170 -200 -100 -340 0 -360 C100 -340 170 -200 160 0Z" fill="#2a0e1e" stroke="#7a2a5a" stroke-width="5"/><path d="M-100 -330 C-150 -440 -120 -520 -60 -560 C-70 -480 -50 -420 -30 -360Z" fill="#2a0e1e" stroke="#7a2a5a" stroke-width="5"/><path d="M100 -330 C150 -440 120 -520 60 -560 C70 -480 50 -420 30 -360Z" fill="#2a0e1e" stroke="#7a2a5a" stroke-width="5"/><ellipse cx="-36" cy="-250" rx="18" ry="10" fill="#ff3a3a"/><ellipse cx="36" cy="-250" rx="18" ry="10" fill="#ff3a3a"/><path d="M-160 -80 C-260 -120 -300 -200 -280 -280 C-240 -200 -200 -160 -150 -150Z" fill="#2a0e1e" stroke="#7a2a5a" stroke-width="5"/></g>`);
  k.glow(560, 390, 120, '#ff3a3a', .35);
  // eroe con elmo alato
  const hairFront = `<path d="M-72 -246 C-84 -300 84 -300 72 -246 C46 -270 -46 -270 -72 -246Z" ${o('#4a2a18', 7)}/>`;
  const helm = `<path d="M-78 -250 C-90 -350 90 -350 78 -250 C40 -268 -40 -268 -78 -250Z" ${o('#6a7ab8', 7)}/><rect x="-80" y="-266" width="160" height="16" rx="6" ${o('#ffd23b', 5)}/><path d="M-72 -300 C-150 -330 -190 -300 -200 -250 C-160 -278 -120 -282 -76 -276Z" ${o('#fff', 6)}/><path d="M72 -300 C150 -330 190 -300 200 -250 C160 -278 120 -282 76 -276Z" ${o('#fff', 6)}/>`;
  const cape = `<path d="M-64 -190 C-140 -110 -150 -30 -120 0 L120 0 C150 -30 140 -110 64 -190Z" ${o('#2a3fb8', 7)}/>`;
  k.add(`<ellipse cx="290" cy="936" rx="140" ry="16" fill="#000" opacity=".4"/>`, P.chibi(290, 930, 1.75, {top: '#3a8ad8', bot: '#eee4c8', boots: '#7a4a22', skin: '#f8c9a0', eye: '#2a2a2a', back: cape, hairFront, extra: helm, sleeve: '#3a8ad8', glove: '#ffd23b',
    torso: `<path d="M-56 -186 C-30 -168 30 -168 56 -186 L56 -150 C30 -132 -30 -132 -56 -150Z" ${o('#ffd23b', 5)}/><path d="M0 -140 V-72" stroke="#ffd23b" stroke-width="9"/>`}));
  k.add(`<g transform="translate(150 800) rotate(-30)"><path d="M-40 -60 C-40 -140 40 -140 40 -60 C40 0 0 40 0 40 C0 40 -40 0 -40 -60Z" ${o('#d8232a', 6)}/><path d="M0 -120 V30 M-34 -70 H34" stroke="#ffd23b" stroke-width="7"/></g>`);
  k.add(`<g transform="translate(470 800) rotate(26)"><rect x="-10" y="-320" width="20" height="290" rx="4" ${o('#e4ecf8', 6)}/><path d="M0 -310 V-40" stroke="#fff" stroke-width="4"/><rect x="-46" y="-30" width="92" height="16" rx="6" ${o('#ffd23b', 6)}/><rect x="-7" y="-14" width="14" height="50" ${o('#6a3a18', 5)}/></g>`);
  k.finish();
};

module.exports = S;
