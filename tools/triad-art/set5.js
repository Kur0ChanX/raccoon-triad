// Quinta serie: Pokémon, horror e indie.
const {o, INK, shadow, r1, mulberry} = require('./kit.js');
const P = require('./parts.js');
const S = {};

const charizard = (x, y, s)=> P.g(x, y, s, `
  <path d="M-70 -80 C-160 -70 -220 -100 -240 -170" fill="none" stroke="${INK}" stroke-width="52" stroke-linecap="round"/><path d="M-70 -80 C-160 -70 -220 -100 -240 -170" fill="none" stroke="#f08a2a" stroke-width="40" stroke-linecap="round"/>
  <g transform="translate(-240 -170) scale(.5)">${P.flame(null, 0, 0, 1, '#ff7a1a', '#ffc040', '#fff0a0')}</g>
  <path d="M-60 -270 L-250 -440 L-215 -330 L-290 -320 L-200 -240 L-140 -170 L-60 -180Z" ${o('#3aa0a8', 7)}/><path d="M-60 -270 L-250 -440 L-215 -330" fill="none" stroke="#f08a2a" stroke-width="14" stroke-linecap="round"/>
  <path d="M60 -270 L250 -440 L215 -330 L290 -320 L200 -240 L140 -170 L60 -180Z" ${o('#3aa0a8', 7)}/><path d="M60 -270 L250 -440 L215 -330" fill="none" stroke="#f08a2a" stroke-width="14" stroke-linecap="round"/>
  <ellipse cx="-52" cy="-14" rx="48" ry="22" ${o('#f08a2a', 6)}/><ellipse cx="52" cy="-14" rx="48" ry="22" ${o('#f08a2a', 6)}/><g fill="#fff" stroke="${INK}" stroke-width="3"><path d="M-84 -12 l6 16 l8 -14Z M-64 -8 l6 16 l8 -14Z M44 -8 l6 16 l8 -14Z M64 -12 l6 16 l8 -14Z"/></g>
  <ellipse cx="0" cy="-150" rx="104" ry="126" ${o('#f08a2a', 8)}/><ellipse cx="0" cy="-138" rx="66" ry="98" ${o('#f7dc9a', 6)}/><g stroke="#e0b25a" stroke-width="5" fill="none"><path d="M-56 -190 H56 M-62 -150 H62 M-60 -110 H60 M-50 -70 H50"/></g>
  <ellipse cx="-96" cy="-170" rx="30" ry="44" transform="rotate(20 -96 -170)" ${o('#f08a2a', 6)}/><ellipse cx="96" cy="-170" rx="30" ry="44" transform="rotate(-20 96 -170)" ${o('#f08a2a', 6)}/>
  <path d="M-30 -270 C-60 -330 -30 -376 0 -376 C30 -376 60 -330 30 -270Z" ${o('#f08a2a', 7)}/>
  <ellipse cx="0" cy="-330" rx="70" ry="60" ${o('#f08a2a', 8)}/><ellipse cx="0" cy="-306" rx="48" ry="34" ${o('#f7a04a', 6)}/><ellipse cx="-16" cy="-314" rx="5" ry="7" fill="${INK}"/><ellipse cx="16" cy="-314" rx="5" ry="7" fill="${INK}"/>
  <path d="M-20 -290 C-6 -282 6 -282 20 -290" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
  <path d="M-52 -352 L-76 -376" stroke="${INK}" stroke-width="14"/>
  <path d="M-44 -376 C-90 -390 -120 -370 -140 -330 C-100 -350 -70 -350 -40 -340Z" ${o('#f7dc9a', 6)}/><path d="M44 -376 C90 -390 120 -370 140 -330 C100 -350 70 -350 40 -340Z" ${o('#f7dc9a', 6)}/>
  <ellipse cx="-34" cy="-344" rx="15" ry="20" ${o('#fff', 5)}/><ellipse cx="34" cy="-344" rx="15" ry="20" ${o('#fff', 5)}/><ellipse cx="-32" cy="-342" rx="8" ry="13" fill="#2a8ac8"/><ellipse cx="32" cy="-342" rx="8" ry="13" fill="#2a8ac8"/><circle cx="-30" cy="-347" r="3" fill="#fff"/><circle cx="34" cy="-347" r="3" fill="#fff"/>
  <path d="M-52 -370 L-16 -352 M52 -370 L16 -352" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`);
const blastoise = (x, y, s)=> P.g(x, y, s, `
  <ellipse cx="0" cy="-150" rx="140" ry="112" ${o('#b8834a', 8)}/><ellipse cx="0" cy="-150" rx="140" ry="112" fill="none" stroke="#f2d9a0" stroke-width="16" opacity=".8"/>
  <g transform="translate(-100 -260) rotate(-38)"><rect x="-24" y="-150" width="48" height="160" rx="10" ${o('#c8ccd8', 7)}/><rect x="-30" y="-170" width="60" height="36" rx="8" ${o('#8a90a0', 7)}/><ellipse cx="0" cy="-170" rx="20" ry="10" fill="#1a1a24"/></g>
  <g transform="translate(100 -260) rotate(38)"><rect x="-24" y="-150" width="48" height="160" rx="10" ${o('#c8ccd8', 7)}/><rect x="-30" y="-170" width="60" height="36" rx="8" ${o('#8a90a0', 7)}/><ellipse cx="0" cy="-170" rx="20" ry="10" fill="#1a1a24"/></g>
  <ellipse cx="-56" cy="-14" rx="46" ry="22" ${o('#3f7ad0', 6)}/><ellipse cx="56" cy="-14" rx="46" ry="22" ${o('#3f7ad0', 6)}/><g fill="#fff" stroke="${INK}" stroke-width="3"><path d="M-88 -10 l6 14 l8 -12Z M-68 -6 l6 14 l8 -12Z M50 -6 l6 14 l8 -12Z M70 -10 l6 14 l8 -12Z"/></g>
  <ellipse cx="0" cy="-150" rx="96" ry="110" ${o('#4a8ae0', 8)}/><ellipse cx="0" cy="-136" rx="62" ry="86" ${o('#f2e2b0', 6)}/>
  <ellipse cx="-98" cy="-160" rx="28" ry="42" ${o('#4a8ae0', 6)}/><ellipse cx="98" cy="-160" rx="28" ry="42" ${o('#4a8ae0', 6)}/>
  <ellipse cx="0" cy="-292" rx="72" ry="60" ${o('#4a8ae0', 8)}/><path d="M-70 -300 C-90 -320 -96 -290 -80 -276Z M70 -300 C90 -320 96 -290 80 -276Z" ${o('#4a8ae0', 6)}/>
  <ellipse cx="-28" cy="-300" rx="12" ry="16" ${o('#fff', 5)}/><ellipse cx="28" cy="-300" rx="12" ry="16" ${o('#fff', 5)}/><ellipse cx="-26" cy="-298" rx="6" ry="10" fill="${INK}"/><ellipse cx="30" cy="-298" rx="6" ry="10" fill="${INK}"/>
  <path d="M-48 -322 L-14 -306 M48 -322 L14 -306" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M-22 -268 C-6 -258 6 -258 22 -268" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`);
const venusaur = (x, y, s)=> P.g(x, y, s, `
  <g transform="translate(20 -240)">${[0, 1, 2, 3, 4, 5, 6, 7].map(i=> `<ellipse cx="0" cy="-70" rx="30" ry="66" transform="rotate(${i * 45})" ${o('#f0648e', 6)}/>`).join('')}<circle r="34" ${o('#ffd23b', 6)}/><circle cx="-8" cy="-8" r="10" fill="#fff" opacity=".5"/></g>
  <path d="M-110 -180 C-190 -230 -210 -160 -170 -120Z M130 -190 C200 -240 210 -170 170 -130Z" ${o('#2f8a4a', 6)}/>
  <ellipse cx="-90" cy="-26" rx="44" ry="26" ${o('#3a9a8a', 6)}/><ellipse cx="90" cy="-26" rx="44" ry="26" ${o('#3a9a8a', 6)}/>
  <ellipse cx="0" cy="-110" rx="150" ry="84" ${o('#4ab0a0', 8)}/><g fill="#2a7a70" opacity=".7"><circle cx="-60" cy="-140" r="12"/><circle cx="20" cy="-150" r="9"/><circle cx="80" cy="-124" r="13"/><circle cx="-10" cy="-90" r="10"/></g>
  <ellipse cx="-60" cy="-30" rx="36" ry="22" ${o('#4ab0a0', 6)}/><ellipse cx="60" cy="-30" rx="36" ry="22" ${o('#4ab0a0', 6)}/>
  <ellipse cx="-96" cy="-172" rx="76" ry="62" ${o('#4ab0a0', 8)}/><path d="M-150 -214 L-170 -270 L-124 -224Z M-70 -226 L-60 -284 L-40 -214Z" ${o('#4ab0a0', 6)}/>
  <ellipse cx="-120" cy="-176" rx="12" ry="16" ${o('#fff', 5)}/><ellipse cx="-72" cy="-176" rx="12" ry="16" ${o('#fff', 5)}/><ellipse cx="-118" cy="-174" rx="6" ry="10" fill="#d8232a"/><ellipse cx="-70" cy="-174" rx="6" ry="10" fill="#d8232a"/>
  <path d="M-138 -198 L-108 -184 M-54 -198 L-84 -184" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M-116 -140 C-100 -130 -86 -130 -70 -140" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`);

S['pokemon-rosso-e-blu'] = k=>{
  k.sky(['#3a8ae8', '#7ac4f8', '#d8f0ff']); k.glow(375, 400, 420, '#fff', .9); k.rays(375, 400, '#fff', 20, .16);
  k.add(`<circle cx="375" cy="420" r="330" fill="none" stroke="#fff" stroke-width="20" opacity=".35"/><path d="M45 420 H705" stroke="#fff" stroke-width="20" opacity=".35"/><circle cx="375" cy="420" r="70" fill="none" stroke="#fff" stroke-width="20" opacity=".35"/>`);
  k.cloud(110, 200, 1.3, '#fff', .9); k.cloud(650, 260, 1.1, '#fff', .9);
  k.hills(800, 70, ['#5ac060', '#2f8a40'], {f: .007}); k.add(`<rect y="870" width="750" height="180" fill="#2f8a40"/>`);
  k.dots(40, 0, 100, 750, 800, '#fff', 2, 5, .6);
  k.add(`<ellipse cx="150" cy="1004" rx="140" ry="16" fill="#000" opacity=".3"/><ellipse cx="600" cy="1004" rx="150" ry="16" fill="#000" opacity=".3"/><ellipse cx="375" cy="908" rx="170" ry="18" fill="#000" opacity=".3"/>`);
  k.add(charizard(375, 900, 1.2), blastoise(150, 1000, 1.05), venusaur(600, 1000, 1.05));
  k.finish({grain: .22});
};

S['resident-evil'] = k=>{
  k.sky(['#0a0604', '#2a1208', '#5a2a10']); k.glow(375, 400, 380, '#ffb050', .35);
  // salone della villa: scala, porte, lampadario
  k.add(`<rect x="0" y="0" width="750" height="800" fill="${k.lg([[0, '#1a0c06'], [1, '#3a1c0c']])}"/><g stroke="#000" stroke-width="3" opacity=".5">${Array.from({length: 12}, (_, i)=> `<path d="M${i * 66} 0 V800"/>`).join('')}</g>`);
  k.add(`<g transform="translate(375 460)"><path d="M-260 340 L-260 -20 L-120 -20 L-120 340Z M260 340 L260 -20 L120 -20 L120 340Z" fill="#20100a" stroke="#000" stroke-width="5"/><path d="M-120 340 L-120 200 L0 200 L0 100 L120 100 L120 340Z" fill="#3a1c0c" stroke="#000" stroke-width="5"/><path d="M-260 20 C-260 -120 -120 -120 -120 20" fill="none" stroke="#8a5a2a" stroke-width="10"/><path d="M260 20 C260 -120 120 -120 120 20" fill="none" stroke="#8a5a2a" stroke-width="10"/><path d="M-100 100 V-20 C-100 -120 100 -120 100 -20 V100Z" fill="#100604" stroke="#8a5a2a" stroke-width="8"/></g>`);
  k.add(`<g transform="translate(375 120)"><path d="M0 -120 V0" stroke="#8a5a2a" stroke-width="6"/><path d="M-120 60 C-120 10 120 10 120 60 L90 80 H-90Z" ${o('#8a5a2a', 6)}/>${[-100, -50, 0, 50, 100].map(x=> `<g transform="translate(${x} 20)"><rect x="-4" y="-30" width="8" height="40" fill="#e8d8b0"/>${''}<path d="M0 -60 C-14 -44 -6 -34 0 -30 C6 -34 14 -44 0 -60Z" fill="#ffd070"/></g>`).join('')}</g>`);
  k.glow(375, 130, 260, '#ffd070', .45);
  // zombie in cima alle scale
  k.add(`<g transform="translate(375 560)"><path d="M-30 100 L-34 -20 C-34 -70 34 -70 34 -20 L30 100Z" fill="#0a0806"/><circle cx="0" cy="-90" r="28" fill="#0a0806"/><path d="M-30 -30 L-90 20 M30 -30 L90 20" stroke="#0a0806" stroke-width="16" stroke-linecap="round"/><ellipse cx="-10" cy="-94" rx="5" ry="3" fill="#ff3a2a"/><ellipse cx="10" cy="-94" rx="5" ry="3" fill="#ff3a2a"/></g>`);
  k.add(`<rect y="800" width="750" height="250" fill="${k.lg([[0, '#3a1810'], [1, '#100806']])}"/>`);
  k.add(`<g fill="#7a0a0a" opacity=".85"><path d="M120 860 C140 840 170 850 160 880 C190 890 170 930 140 920 C110 930 90 890 120 860Z"/><path d="M600 900 C620 880 660 890 650 930 C680 940 650 980 620 970 C590 980 570 930 600 900Z"/></g>`);
  const jill = P.chibi(230, 990, 1.6, {top: '#5aa8e0', bot: '#3a4a7a', boots: '#3a2a20', skin: '#f6cfa8', eye: '#5a3a1a', sleeve: '#5aa8e0', glove: '#2a2a30', arms: 'fwd',
    hairBack: `<path d="M-70 -250 C-90 -180 -70 -140 -52 -152 L-52 -244Z M70 -250 C90 -180 70 -140 52 -152 L52 -244Z" ${o('#5a3a22', 6)}/>`,
    hairFront: `<path d="M-72 -246 C-84 -318 84 -318 72 -246 C40 -276 -40 -276 -72 -246Z" ${o('#6a4426', 7)}/><path d="M-66 -286 C-30 -330 60 -320 70 -270 C40 -290 -30 -290 -66 -286Z" ${o('#5aa8e0', 6)}/>`,
    torso: `<path d="M-56 -186 L-56 -130 H56 V-186" fill="#f6cfa8" stroke="${INK}" stroke-width="4" opacity="0"/>`,
    extra: `<g transform="translate(150 -160)"><rect x="0" y="-16" width="70" height="26" rx="6" ${o('#2a2a30', 5)}/><rect x="50" y="-10" width="46" height="14" fill="#444" stroke="${INK}" stroke-width="4"/></g>`});
  const chris = P.chibi(530, 990, 1.6, {top: '#4a6a3a', bot: '#3a4a3a', boots: '#2a2a20', skin: '#f2c49a', eye: '#3a2a1a', sleeve: '#4a6a3a', glove: '#2a2a30', arms: 'fwd', flip: true,
    hairFront: `<path d="M-72 -246 C-84 -310 84 -310 72 -246 C40 -272 -40 -272 -72 -246Z" ${o('#3a2418', 7)}/>`,
    torso: `<path d="M-56 -186 L-30 -66 H30 L56 -186" fill="#3a5a2a" stroke="${INK}" stroke-width="5"/><rect x="-46" y="-150" width="30" height="34" rx="4" fill="#2a3a20" stroke="${INK}" stroke-width="3"/><rect x="16" y="-150" width="30" height="34" rx="4" fill="#2a3a20" stroke="${INK}" stroke-width="3"/>`,
    extra: `<g transform="translate(150 -160)"><rect x="0" y="-16" width="70" height="26" rx="6" ${o('#2a2a30', 5)}/><rect x="50" y="-10" width="46" height="14" fill="#444" stroke="${INK}" stroke-width="4"/></g>`});
  k.add(`<ellipse cx="230" cy="996" rx="140" ry="14" fill="#000" opacity=".5"/><ellipse cx="530" cy="996" rx="140" ry="14" fill="#000" opacity=".5"/>`, jill, chris);
  k.finish();
};

S['silent-hill'] = k=>{
  k.sky(['#3a3a3a', '#6a6a68', '#a8a8a0', '#c8c8c0']); 
  for(let i = 0; i < 12; i++) k.add(`<ellipse cx="${(i * 130) % 800 - 20}" cy="${300 + (i % 5) * 110}" rx="220" ry="70" fill="#d8d8d0" opacity="${.15 + (i % 3) * .06}" filter="${k.blur(18)}"/>`);
  k.skyline(720, '#5a5a58', {hmin: 100, hvar: 160, wmin: 50, wvar: 70, gap: 8}); 
  for(let i = 0; i < 5; i++) k.add(`<ellipse cx="${(i * 200 + 60) % 800}" cy="${640 + (i % 2) * 40}" rx="260" ry="80" fill="#c8c8c0" opacity=".42" filter="${k.blur(20)}"/>`);
  k.add(`<rect y="800" width="750" height="250" fill="${k.lg([[0, '#4a4a48'], [1, '#141412']])}"/>`);
  // strada e recinzione arrugginita
  k.add(`<path d="M300 800 L450 800 L820 1050 L-70 1050Z" fill="#2a2a28"/><path d="M375 810 V1050" stroke="#a8a060" stroke-width="6" stroke-dasharray="40 40"/>`);
  k.add(`<g stroke="#5a3a20" stroke-width="7" fill="none">${Array.from({length: 14}, (_, i)=> `<path d="M${-10 + i * 58} 830 V920"/>`).join('')}<path d="M0 850 H750 M0 900 H750"/></g>`);
  // lampione
  k.add(`<g transform="translate(600 900)"><rect x="-8" y="-480" width="16" height="480" fill="#1a1a18"/><path d="M-8 -480 C-8 -520 -70 -520 -80 -490" fill="none" stroke="#1a1a18" stroke-width="12"/><ellipse cx="-82" cy="-482" rx="26" ry="12" fill="#ffe6a0"/></g>`);
  k.glow(518, 418, 220, '#ffe6a0', .55);
  // bambina in lontananza
  k.add(`<g transform="translate(320 790) scale(.7)"><path d="M-30 0 L-24 -100 H24 L30 0Z" fill="#a83a3a"/><circle cx="0" cy="-130" r="28" fill="#e8c8a8"/><path d="M-30 -140 C-40 -190 40 -190 30 -140Z" fill="#3a2418"/></g>`);
  // Harry con la torcia
  k.add(`<path d="M420 700 L840 560 L840 760Z" fill="#fff6c8" opacity=".22"/>`);
  const harry = P.chibi(260, 1000, 1.85, {top: '#8a5a32', bot: '#3a4a7a', boots: '#2a2a2a', skin: '#f2c49a', eye: '#3a2a1a', sleeve: '#8a5a32', glove: '#f2c49a', arms: 'fwd',
    hairFront: `<path d="M-72 -246 C-84 -312 84 -312 72 -246 C40 -276 -40 -276 -72 -246Z" ${o('#4a3020', 7)}/>`,
    extra: `<path d="M-46 -206 C-30 -186 30 -186 46 -206 C36 -172 -36 -172 -46 -206Z" ${o('#4a3020', 5)}/><g transform="translate(150 -180)"><rect x="0" y="-16" width="60" height="26" rx="6" ${o('#2a2a2a', 5)}/><rect x="52" y="-22" width="28" height="38" rx="6" ${o('#ffe6a0', 5)}/></g>`,
    torso: `<path d="M-56 -186 L-56 -66 M56 -186 L56 -66" stroke="${INK}" stroke-width="4"/><path d="M-30 -180 L0 -100 L30 -180" fill="#e8e0d0" stroke="${INK}" stroke-width="4"/>`});
  k.add(`<ellipse cx="260" cy="1006" rx="150" ry="14" fill="#000" opacity=".5"/>`, harry);
  k.dots(80, 0, 0, 750, 1050, '#fff', 1, 2.5, .35);
  k.finish({grain: .4});
};

S['alien-isolation'] = k=>{
  k.sky(['#04080a', '#0a1a1a', '#14302c']); 
  // corridoio in prospettiva
  const vx = 375, vy = 470;
  k.add(`<path d="M0 0 L${vx - 90} ${vy - 90} L${vx - 90} ${vy + 100} L0 1050Z" fill="${k.lg([[0, '#0a1414'], [1, '#1a3a36']], [0, 0, 1, 0])}"/><path d="M750 0 L${vx + 90} ${vy - 90} L${vx + 90} ${vy + 100} L750 1050Z" fill="${k.lg([[0, '#1a3a36'], [1, '#0a1414']], [0, 0, 1, 0])}"/><path d="M0 0 L750 0 L${vx + 90} ${vy - 90} L${vx - 90} ${vy - 90}Z" fill="#081010"/><path d="M0 1050 L750 1050 L${vx + 90} ${vy + 100} L${vx - 90} ${vy + 100}Z" fill="#0c1c1a"/><rect x="${vx - 90}" y="${vy - 90}" width="180" height="190" fill="#020606"/>`);
  for(let i = 1; i < 6; i++){ const t = i / 6; k.add(`<path d="M${vx - 90 - t * 300} ${vy - 90 - t * 380} V${vy + 100 + t * 380}" stroke="#2a5a52" stroke-width="${2 + t * 6}" opacity=".6"/><path d="M${vx + 90 + t * 300} ${vy - 90 - t * 380} V${vy + 100 + t * 380}" stroke="#2a5a52" stroke-width="${2 + t * 6}" opacity=".6"/>`); }
  // tubi e luci
  k.add(`<path d="M0 120 L${vx - 90} ${vy - 40}" stroke="#3a6a62" stroke-width="18" opacity=".8"/><path d="M750 160 L${vx + 90} ${vy - 30}" stroke="#3a6a62" stroke-width="18" opacity=".8"/><path d="M0 240 L${vx - 90} ${vy}" stroke="#2a4a44" stroke-width="12"/><path d="M750 260 L${vx + 90} ${vy}" stroke="#2a4a44" stroke-width="12"/>`);
  k.glow(375, 60, 200, '#ff5a2a', .55); k.glow(200, 300, 90, '#ff8a3a', .5); k.glow(560, 300, 90, '#ff8a3a', .5);
  k.add(`<circle cx="375" cy="50" r="18" fill="#ff8a4a"/>`);
  // xenomorfo
  k.add(`<g transform="translate(430 700) scale(1.35)"><path d="M-60 40 C-70 -60 -60 -200 -20 -250 C40 -290 130 -250 170 -150 C120 -180 60 -180 40 -110 C30 -60 40 -10 60 40Z" fill="#0a1618" stroke="#7ad8c8" stroke-width="4"/><path d="M-60 40 C-70 -60 -60 -200 -20 -250" fill="none" stroke="#9af0dc" stroke-width="5" opacity=".9"/><path d="M-30 -230 C20 -270 100 -240 150 -170" fill="none" stroke="#5aa89a" stroke-width="3" opacity=".5"/>
    <path d="M-40 -60 C-30 -30 -10 -20 0 -10 C20 0 40 0 60 -10" fill="none" stroke="#5aa89a" stroke-width="3" opacity=".6"/>
    <path d="M-20 -30 L-6 6 L8 -26 L22 8 L36 -22 L50 6" fill="none" stroke="#e8f0e8" stroke-width="5" stroke-linejoin="round"/><path d="M-10 4 L-4 30 L2 6 M26 6 L30 34 L36 8" fill="#e8f0e8" stroke="#e8f0e8" stroke-width="2"/></g>`);
  k.add(`<g transform="translate(560 800)" fill="#050808" stroke="#2a5a52" stroke-width="3" opacity=".9"><path d="M0 200 C-30 100 -20 0 10 -60 C30 -100 90 -90 100 -40 C60 -50 40 -10 40 40 C40 90 50 150 40 200Z"/></g>`);
  // Amanda con il rilevatore
  const amanda = P.chibi(230, 1010, 1.75, {top: '#8a4a2a', bot: '#3a3a44', boots: '#2a2a2a', skin: '#e8b892', eye: '#3a2a1a', sleeve: '#8a4a2a', glove: '#2a2a2a', arms: 'fwd',
    hairBack: `<path d="M-60 -290 C-140 -300 -170 -230 -140 -150 C-140 -200 -100 -240 -56 -250Z" ${o('#3a2418', 6)}/>`,
    hairFront: `<path d="M-72 -246 C-84 -320 82 -320 72 -246 C46 -278 -46 -278 -72 -246Z" ${o('#3a2418', 7)}/>`,
    extra: `<g transform="translate(150 -180)"><rect x="0" y="-30" width="70" height="60" rx="8" ${o('#2a3a3a', 6)}/><rect x="8" y="-22" width="54" height="34" rx="4" fill="#0a3a2a" stroke="${INK}" stroke-width="3"/><circle cx="34" cy="-4" r="12" fill="none" stroke="#5aff9a" stroke-width="3"/><circle cx="34" cy="-4" r="4" fill="#5aff9a"/><path d="M34 -4 L50 -16" stroke="#5aff9a" stroke-width="3"/></g>`});
  k.glow(378, 838, 180, '#5aff9a', .35);
  k.add(`<ellipse cx="230" cy="1016" rx="140" ry="14" fill="#000" opacity=".5"/>`, amanda);
  k.finish({grain: .4});
};

S['super-meat-boy'] = k=>{
  k.sky(['#1a0a0a', '#5a1414', '#a82a1a', '#ff7a2a']); k.glow(375, 500, 440, '#ff9a4a', .6);
  k.skyline(760, '#2a0a0a', {hmin: 100, hvar: 260, wmin: 60, wvar: 60}); 
  k.add(`<g fill="#3a0e0e" stroke="#0a0202" stroke-width="4"><rect x="60" y="280" width="34" height="500"/><rect x="620" y="200" width="40" height="600"/><path d="M60 280 L94 250 L94 280Z"/></g>`);
  k.add(`<rect y="820" width="750" height="230" fill="#1a0606"/><path d="M0 820 H750" stroke="#5a1a1a" stroke-width="8"/>`);
  // seghe circolari
  const saw = (x, y, r, rot)=>{ let d = ''; const n = 16; for(let i = 0; i < n; i++){ const a = i / n * 6.283, a2 = (i + .5) / n * 6.283; d += `${i ? 'L' : 'M'}${r1(Math.cos(a) * r)} ${r1(Math.sin(a) * r)} L${r1(Math.cos(a2) * r * 1.18)} ${r1(Math.sin(a2) * r * 1.18)} `; } return `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="${d}Z" ${o('#c8ccd0', 6)}/><circle r="${r * .78}" fill="${k.rg([[0, '#f4f6f8'], [1, '#98a0a8']])}" stroke="${INK}" stroke-width="4"/><circle r="${r * .18}" fill="#333" stroke="${INK}" stroke-width="4"/><g stroke="#8a929a" stroke-width="4">${[0, 1, 2, 3].map(i=> `<path d="M0 0 L${Math.cos(i * 1.57) * r * .7} ${Math.sin(i * 1.57) * r * .7}"/>`).join('')}</g></g>`; };
  k.add(saw(110, 650, 90, 10), saw(650, 500, 110, 30), saw(380, 380, 70, 0), saw(160, 260, 60, 20));
  k.add(`<g fill="#b01020" opacity=".9"><circle cx="90" cy="640" r="20"/><circle cx="650" cy="480" r="18"/><path d="M0 830 C40 780 60 900 90 860 C130 820 160 900 200 850 L200 900 H0Z"/><circle cx="500" cy="880" r="10"/><circle cx="530" cy="900" r="6"/></g>`);
  // Meat Boy & Bandage Girl
  const cube = (x, y, s, col, dark, face)=> `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-90" y="-180" width="180" height="180" rx="18" ${o(col, 9)}/><path d="M-90 -110 C-40 -90 -20 -140 40 -120 C70 -110 80 -130 90 -120 V-40 H-90Z" fill="${dark}" opacity=".35"/>${face}</g>`;
  const mbFace = `<ellipse cx="-34" cy="-110" rx="22" ry="30" fill="#fff" stroke="${INK}" stroke-width="5"/><ellipse cx="34" cy="-110" rx="22" ry="30" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-28" cy="-106" r="10" fill="${INK}"/><circle cx="40" cy="-106" r="10" fill="${INK}"/><path d="M-40 -60 C-10 -30 20 -30 40 -60" fill="#5a0a0a" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-30 -60 H30" stroke="#fff" stroke-width="10"/>`;
  const bgFace = `<ellipse cx="-34" cy="-104" rx="18" ry="24" fill="#fff" stroke="${INK}" stroke-width="5"/><ellipse cx="34" cy="-104" rx="18" ry="24" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-30" cy="-102" r="8" fill="${INK}"/><circle cx="38" cy="-102" r="8" fill="${INK}"/><path d="M-22 -60 C-6 -46 6 -46 22 -60" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-60 -170 L-30 -140 M60 -170 L30 -140" stroke="#f0f0f0" stroke-width="16" stroke-linecap="round" opacity="0"/><path d="M-90 -168 L-50 -180 L-60 -140Z M90 -168 L50 -180 L60 -140Z" ${o('#f0648e', 5)}/><path d="M-20 -178 L20 -178 L14 -150 L-14 -150Z" ${o('#f0648e', 5)}/><path d="M-30 -20 L30 -80 M30 -20 L-30 -80" stroke="#fff" stroke-width="10" opacity=".8"/>`;
  k.add(`<ellipse cx="220" cy="1010" rx="170" ry="16" fill="#000" opacity=".5"/><ellipse cx="540" cy="1010" rx="140" ry="14" fill="#000" opacity=".5"/>`, cube(220, 1000, 1.6, '#d8232a', '#7a0a10', mbFace), cube(540, 1000, 1.25, '#f6a8c4', '#c0507a', bgFace));
  k.dots(40, 0, 100, 750, 800, '#ffb040', 1.5, 3.5, .6);
  k.finish();
};

S['braid'] = k=>{
  k.sky(['#2a3a78', '#7a5aa0', '#e8907a', '#ffd9a0']); k.glow(560, 560, 420, '#ffe0a0', .8);
  // ingranaggi dorati
  const gear = (x, y, r, n, rot, col)=>{ let d = ''; for(let i = 0; i < n; i++){ const a = i / n * 6.283 + rot, w = 6.283 / n * .28; [[a - w, r], [a - w * .6, r * 1.16], [a + w * .6, r * 1.16], [a + w, r]].forEach(([b, rr], j)=> { d += `${i || j ? 'L' : 'M'}${r1(Math.cos(b) * rr)} ${r1(Math.sin(b) * rr)} `; }); } return `<g transform="translate(${x} ${y})"><path d="${d}Z" fill="${col}" stroke="${INK}" stroke-width="6" opacity=".92"/><circle r="${r * .55}" fill="none" stroke="${INK}" stroke-width="6"/><circle r="${r * .18}" fill="${INK}"/></g>`; };
  k.add(gear(160, 220, 120, 14, 0, '#c8964a'), gear(360, 130, 80, 10, .2, '#a87a3a'), gear(600, 250, 140, 16, .1, '#d8a85a'), gear(690, 90, 60, 8, .4, '#a87a3a'));
  // orologio grande
  k.add(`<g transform="translate(375 400)"><circle r="150" fill="#f4e8d0" stroke="${INK}" stroke-width="8" opacity=".95"/>${Array.from({length: 12}, (_, i)=> `<path d="M${Math.cos(i / 12 * 6.283) * 120} ${Math.sin(i / 12 * 6.283) * 120} L${Math.cos(i / 12 * 6.283) * 138} ${Math.sin(i / 12 * 6.283) * 138}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`).join('')}<path d="M0 0 L-60 -60" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M0 0 L30 -110" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><circle r="10" fill="#c8232a" stroke="${INK}" stroke-width="4"/></g>`);
  k.hills(760, 90, ['#4a8a4a', '#2a5a3a'], {f: .006, op: .95}); k.hills(830, 60, ['#3a7a3a', '#1a4a2a'], {f: .01});
  k.add(`<rect y="880" width="750" height="170" fill="#1a4a2a"/>`);
  k.add(`<g transform="translate(600 830)"><rect x="-60" y="-200" width="120" height="200" ${o('#8a6a4a', 6)}/><path d="M-70 -200 L0 -290 L70 -200Z" ${o('#c8232a', 6)}/><path d="M-20 0 V-70 C-20 -100 20 -100 20 -70 V0Z" fill="#221"/></g>`);
  // scia temporale di Tim
  const tim = (x, op)=> `<g opacity="${op}">${P.chibi(x, 990, 1.75, {top: '#1a2a4a', bot: '#1a2a4a', boots: '#3a2a20', skin: '#f2c49a', eye: '#3a2a1a', sleeve: '#1a2a4a', glove: '#f2c49a', brow: '#5a3a22',
    hairFront: `<path d="M-74 -244 C-84 -316 84 -316 74 -244 C40 -270 -40 -270 -74 -244Z" ${o('#8a5a32', 7)}/>`,
    torso: `<path d="M-30 -190 L0 -120 L30 -190 L0 -160Z" fill="#f4f4f0" stroke="${INK}" stroke-width="4"/><path d="M0 -170 L-14 -100 L0 -80 L14 -100Z" ${o('#d8232a', 5)}/>`})}</g>`;
  k.add(tim(90, .18), tim(170, .3), tim(250, .5), `<ellipse cx="330" cy="996" rx="140" ry="14" fill="#000" opacity=".4"/>`, tim(340, 1));
  k.dots(50, 0, 100, 750, 800, '#ffe9a0', 2, 4, .6);
  k.finish({grain: .3});
};

S['the-binding-of-isaac'] = k=>{
  k.sky(['#1a0a08', '#3a1610', '#5a2a1a']); k.glow(375, 520, 400, '#c8502a', .35);
  // mattoni della cantina
  let br = ''; for(let r = 0; r < 12; r++) for(let c = -1; c < 9; c++) br += `<rect x="${c * 96 + (r % 2) * 48}" y="${r * 62}" width="92" height="58" rx="4" fill="${(r + c) % 3 ? '#4a2216' : '#3a1a10'}" stroke="#1a0a06" stroke-width="4"/>`;
  k.add(`<g opacity=".85">${br}</g>`, `<rect width="750" height="1050" fill="${k.rg([[0, '#000', 0], [1, '#000', .75]], .5, .5, .7)}"/>`);
  k.add(`<rect y="860" width="750" height="190" fill="#1a0a06"/>`);
  // mostri
  const gaper = (x, y, s)=> `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-90" rx="70" ry="80" ${o('#e07a6a', 7)}/><ellipse cx="-28" cy="-100" rx="16" ry="24" fill="#2a0a0a"/><ellipse cx="28" cy="-100" rx="16" ry="24" fill="#2a0a0a"/><path d="M-30 -60 C-10 -40 10 -40 30 -60 C10 -20 -10 -20 -30 -60Z" fill="#2a0a0a"/><path d="M-70 -90 C-100 -150 -40 -170 0 -160" fill="none" stroke="#a83a2a" stroke-width="8"/><rect x="-40" y="-20" width="80" height="60" rx="16" ${o('#e07a6a', 6)}/></g>`;
  const fly = (x, y, s)=> `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="-34" cy="-34" rx="30" ry="18" transform="rotate(-30 -34 -34)" fill="#fff" opacity=".6" stroke="${INK}" stroke-width="3"/><ellipse cx="34" cy="-34" rx="30" ry="18" transform="rotate(30 34 -34)" fill="#fff" opacity=".6" stroke="${INK}" stroke-width="3"/><circle r="30" ${o('#2a2a30', 6)}/><circle cx="-10" cy="-6" r="7" fill="#d8232a"/><circle cx="10" cy="-6" r="7" fill="#d8232a"/></g>`;
  k.add(gaper(130, 900, 1.5), gaper(640, 920, 1.3), fly(560, 300, 1.2), fly(180, 380, 1), fly(660, 560, .9));
  // Isaac che piange
  const tear = (x, y, s)=> `<path d="M${x} ${y} C${x - 14 * s} ${y + 22 * s} ${x - 14 * s} ${y + 42 * s} ${x} ${y + 44 * s} C${x + 14 * s} ${y + 42 * s} ${x + 14 * s} ${y + 22 * s} ${x} ${y}Z" fill="#7ac8ff" stroke="${INK}" stroke-width="4"/>`;
  k.add(`<ellipse cx="380" cy="960" rx="200" ry="20" fill="#000" opacity=".5"/>`);
  k.add(`<g transform="translate(380 950)">
    <ellipse cx="-50" cy="-10" rx="44" ry="20" ${o('#f0d0c0', 6)}/><ellipse cx="50" cy="-10" rx="44" ry="20" ${o('#f0d0c0', 6)}/>
    <path d="M-70 -30 C-90 -130 -60 -210 0 -210 C60 -210 90 -130 70 -30Z" ${o('#f4dccc', 8)}/><path d="M-100 -150 C-140 -130 -150 -90 -130 -70" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M-100 -150 C-140 -130 -150 -90 -130 -70" fill="none" stroke="#f4dccc" stroke-width="20" stroke-linecap="round"/><path d="M100 -150 C140 -130 150 -90 130 -70" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M100 -150 C140 -130 150 -90 130 -70" fill="none" stroke="#f4dccc" stroke-width="20" stroke-linecap="round"/>
    <circle cx="0" cy="-360" r="170" ${o('#f4dccc', 9)}/>
    <path d="M-100 -350 C-84 -334 -50 -334 -36 -350 M36 -350 C50 -334 84 -334 100 -350" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
    <path d="M-80 -370 L-120 -395 M80 -370 L120 -395" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="0" cy="-270" rx="38" ry="46" fill="#5a0a0a" stroke="${INK}" stroke-width="8"/><path d="M-22 -286 C-12 -270 12 -270 22 -286" fill="#e07a6a" opacity=".8"/>
    <g>${tear(-70, -336, 1.6)}${tear(-92, -290, 1.4)}${tear(-110, -240, 1.2)}${tear(70, -336, 1.6)}${tear(92, -290, 1.4)}${tear(110, -240, 1.2)}${tear(-130, -180, 1)}${tear(130, -180, 1)}</g></g>`);
  k.dots(30, 0, 100, 750, 800, '#7ac8ff', 3, 6, .5);
  k.finish();
};

module.exports = S;
