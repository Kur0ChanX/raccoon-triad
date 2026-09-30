// Personaggi e oggetti riusati in più carte (Mario, Link, Sonic…). Coordinate: origine ai piedi, y negativa verso l'alto, scala s.
const {o, INK, shadow} = require('./kit.js');
const g = (x, y, s, body, flip)=> `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${body}</g>`;

// ---- Mario (e Luigi con altri colori). pose: 'jump' | 'stand' | 'run'
function mario(x, y, s, opt){
  opt = opt || {}; const cap = opt.cap || '#e52521', shirt = opt.shirt || '#e52521', ov = opt.ov || '#2a55d6', skin = '#f8c18f', pose = opt.pose || 'jump', letter = opt.letter || 'M';
  const M = letter === 'L' ? 'M-9 -319 V-289 H8' : 'M-16 -289 V-319 L-6 -304 L4 -319 V-289';
  const limb = (d, w, c)=> `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 10}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  const shoe = (cx, cy, rot)=> `<ellipse cx="${cx}" cy="${cy}" rx="40" ry="23" ${o('#5a2d0c', 6)} transform="rotate(${rot} ${cx} ${cy})"/>`;
  const glove = (cx, cy)=> `<circle cx="${cx}" cy="${cy}" r="29" ${o('#fff', 6)}/>`;
  const leg = pose === 'jump' ? limb('M-20 -72 L-66 -34', 30, ov) + limb('M26 -72 L66 -44', 30, ov) + shoe(-84, -16, -20) + shoe(86, -32, -32)
    : limb('M-24 -66 V-16', 30, ov) + limb('M26 -66 V-16', 30, ov) + shoe(-32, -8, 0) + shoe(42, -8, 0);
  const armUp = pose === 'jump' || opt.fist;
  const arms = armUp ? limb('M-54 -170 C-96 -190 -112 -226 -108 -252', 28, shirt) + glove(-108, -268) + limb('M54 -168 C90 -158 108 -140 112 -122', 28, shirt) + glove(114, -110)
    : limb('M-54 -170 C-82 -140 -86 -112 -80 -88', 28, shirt) + glove(-78, -72) + limb('M54 -170 C82 -140 86 -112 80 -88', 28, shirt) + glove(78, -72);
  return g(x, y, s, `${leg}
    <path d="M-62 -178 C-70 -120 -60 -70 -30 -58 L40 -58 C64 -70 70 -120 62 -178 C30 -200 -30 -200 -62 -178Z" ${o(ov, 6)}/>
    <path d="M-62 -178 C-30 -200 30 -200 62 -178 L62 -150 C30 -166 -30 -166 -62 -150Z" ${o(shirt, 6)}/>
    <path d="M-40 -186 L-28 -130 M40 -186 L28 -130" stroke="${INK}" stroke-width="6" fill="none"/>
    <circle cx="-28" cy="-128" r="11" ${o('#ffd93b', 5)}/><circle cx="28" cy="-128" r="11" ${o('#ffd93b', 5)}/>
    ${arms}
    <ellipse cx="0" cy="-236" rx="80" ry="72" ${o(skin, 7)}/>
    <path d="M-84 -246 C-104 -226 -92 -186 -66 -190 L-62 -236Z" ${o('#5a2d0c', 6)}/>
    <circle cx="-74" cy="-222" r="16" ${o(skin, 6)}/>
    <path d="M-86 -252 C-86 -336 88 -340 90 -250 C60 -262 -30 -266 -86 -252Z" ${o(cap, 7)}/>
    <path d="M-10 -262 C50 -288 118 -272 128 -244 C96 -230 30 -236 -10 -250Z" ${o(cap, 7)}/>
    <circle cx="-4" cy="-302" r="26" ${o('#fff', 5)}/><path d="${M}" transform="translate(${letter === 'L' ? 0 : 0} 0)" fill="none" stroke="${cap}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="66" cy="-212" r="25" ${o('#f2a870', 6)}/>
    <ellipse cx="32" cy="-242" rx="13" ry="21" ${o('#fff', 5)}/><ellipse cx="36" cy="-238" rx="6" ry="13" fill="#2a3fa0"/><ellipse cx="37" cy="-241" rx="3" ry="6" fill="${INK}"/>
    <path d="M14 -268 C26 -276 44 -274 52 -264" fill="none" stroke="#4a2412" stroke-width="9" stroke-linecap="round"/>
    <path d="M6 -192 C30 -212 82 -206 98 -190 C84 -160 42 -166 8 -178 C-22 -162 -58 -172 -64 -188 C-44 -204 -12 -204 6 -192Z" ${o('#4a2412', 6)}/>
    <path d="M12 -160 C30 -152 52 -156 62 -166" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`, opt.flip);
}
// ---- Goomba
function goomba(x, y, s, flat){
  return g(x, y, s, flat ? `<ellipse cx="0" cy="-20" rx="86" ry="22" ${o('#a8611f', 6)}/><ellipse cx="-60" cy="-8" rx="26" ry="12" ${o('#3b1d0a', 5)}/><ellipse cx="60" cy="-8" rx="26" ry="12" ${o('#3b1d0a', 5)}/>` : `
    <ellipse cx="-40" cy="-14" rx="38" ry="20" ${o('#3b1d0a', 6)}/><ellipse cx="46" cy="-14" rx="38" ry="20" ${o('#3b1d0a', 6)}/>
    <path d="M-40 -60 C-40 -50 40 -50 40 -60 L44 -120 L-44 -120Z" ${o('#f4d9a8', 6)}/>
    <path d="M-100 -110 C-100 -200 100 -200 100 -110 C100 -80 60 -66 0 -66 C-60 -66 -100 -80 -100 -110Z" ${o('#b56a22', 7)}/>
    <path d="M-60 -160 C-40 -150 -14 -140 -8 -128 M60 -160 C40 -150 14 -140 8 -128" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <ellipse cx="-30" cy="-128" rx="16" ry="22" ${o('#fff', 5)}/><ellipse cx="30" cy="-128" rx="16" ry="22" ${o('#fff', 5)}/><circle cx="-24" cy="-124" r="7" fill="${INK}"/><circle cx="24" cy="-124" r="7" fill="${INK}"/>
    <path d="M-24 -86 C-6 -96 6 -96 24 -86" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="-14" y="-90" width="10" height="12" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="4" y="-90" width="10" height="12" fill="#fff" stroke="${INK}" stroke-width="3"/>`);
}
module.exports = {g, mario, goomba};
const limb = (d, w, c)=> `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 10}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const star5 = (cx, cy, R, r, rot)=>{ let d = ''; for(let i = 0; i < 10; i++){ const a = (rot || -Math.PI / 2) + i * Math.PI / 5, rr = i % 2 ? r : R; d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1); } return d + 'Z'; };
const tri = (x, y, w, fill)=> `<path d="M${x} ${y - w * .87} L${x + w / 2} ${y} L${x - w / 2} ${y}Z" ${o(fill, 5)}/>`;
const triforce = (cx, cy, w, fill)=> tri(cx, cy, w, fill) + tri(cx - w / 2, cy + w * .87, w, fill) + tri(cx + w / 2, cy + w * .87, w, fill);

// ---- Link. opt: tunic (verde), sword, shield, back (di spalle)
function link(x, y, s, opt){
  opt = opt || {}; const tun = opt.tunic || '#3f9b3a', hair = '#e8c34a', skin = '#f8c9a0';
  const sword = opt.sword === false ? '' : `<g transform="translate(112 -150) rotate(28)"><rect x="-9" y="-250" width="18" height="230" rx="4" ${o('#dfe8f4', 5)}/><path d="M0 -240 V-40" stroke="#fff" stroke-width="4" opacity=".8"/><rect x="-38" y="-24" width="76" height="14" rx="6" ${o('#2b58c8', 5)}/><rect x="-6" y="-10" width="12" height="42" ${o('#4a2a10', 5)}/><circle cx="0" cy="36" r="9" ${o('#ffd23b', 4)}/></g>`;
  const shield = opt.shield === false ? '' : `<g transform="translate(-104 -122) rotate(-10)"><path d="M-44 -62 C-14 -80 14 -80 44 -62 C44 0 20 46 0 66 C-20 46 -44 0 -44 -62Z" ${o('#2c4fbd', 6)}/><path d="M0 -68 V56" stroke="#e8edf8" stroke-width="7"/><path d="M-30 -30 H30" stroke="#e8edf8" stroke-width="7"/><path d="M0 -50 L14 -8 L0 -16 L-14 -8Z" fill="#ffd23b" stroke="${INK}" stroke-width="3"/></g>`;
  return g(x, y, s, `
    ${limb('M-22 -70 V-18', 30, '#f4f1e6')}${limb('M26 -70 V-18', 30, '#f4f1e6')}
    <path d="M-62 -44 H-4 V-14 C-4 4 -60 4 -66 -12Z" ${o('#7a4a22', 6)}/><path d="M6 -44 H62 C70 -12 8 4 6 -14Z" ${o('#7a4a22', 6)}/>
    ${limb('M-54 -170 C-84 -150 -92 -120 -92 -100', 26, tun)}${sword}
    <path d="M-58 -186 C-70 -130 -78 -94 -64 -66 L64 -66 C78 -94 70 -130 58 -186 C30 -204 -30 -204 -58 -186Z" ${o(tun, 6)}/>
    <path d="M-66 -118 H66 V-96 H-66Z" ${o('#6b3f1a', 5)}/><rect x="-14" y="-122" width="28" height="30" rx="4" ${o('#ffd23b', 5)}/>
    ${limb('M54 -170 C86 -156 100 -138 108 -116', 26, tun)}<circle cx="108" cy="-108" r="20" ${o(skin, 5)}/>
    ${shield}
    <path d="M-64 -230 C-140 -226 -170 -180 -150 -140 C-120 -178 -92 -190 -62 -196Z" ${o('#e8c34a', 5)} opacity="0"/>
    <path d="M-74 -232 C-100 -222 -112 -196 -100 -170 L-70 -190Z" ${o(hair, 5)}/>
    <path d="M-76 -226 L-124 -240 L-88 -206Z" ${o(skin, 5)}/>
    <ellipse cx="0" cy="-232" rx="74" ry="66" ${o(skin, 7)}/>
    <path d="M-70 -238 C-76 -296 60 -304 74 -242 C50 -250 40 -272 10 -262 C-20 -254 -46 -262 -70 -238Z" ${o(hair, 6)}/>
    <path d="M-84 -250 C-70 -338 70 -344 82 -262 C40 -276 -20 -280 -84 -250Z" ${o(tun, 7)}/>
    <path d="M-84 -252 C-150 -262 -196 -230 -206 -170 C-176 -206 -130 -212 -84 -228Z" ${o(tun, 7)}/><circle cx="-208" cy="-166" r="13" ${o('#fff', 5)}/>
    <path d="M-86 -252 C-40 -280 40 -282 84 -260" fill="none" stroke="#2a6a2a" stroke-width="7" opacity=".7"/>
    <ellipse cx="-22" cy="-222" rx="12" ry="19" ${o('#fff', 4)}/><ellipse cx="26" cy="-222" rx="12" ry="19" ${o('#fff', 4)}/><ellipse cx="-20" cy="-220" rx="7" ry="13" fill="#2a58d8"/><ellipse cx="28" cy="-220" rx="7" ry="13" fill="#2a58d8"/><circle cx="-18" cy="-224" r="3" fill="#fff"/><circle cx="30" cy="-224" r="3" fill="#fff"/>
    <path d="M-42 -246 L-8 -240 M12 -240 L46 -246" stroke="#b58a26" stroke-width="7" stroke-linecap="round"/>
    <path d="M-8 -190 C0 -184 10 -184 18 -190" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`, opt.flip);
}

// ---- Sonic
function sonic(x, y, s, opt){
  opt = opt || {}; const B = '#1f5cff', skin = '#f6d3a4';
  return g(x, y, s, `
    ${limb('M-24 -70 L-30 -30', 30, B)}${limb('M26 -70 L44 -34', 30, B)}
    <path d="M-72 -30 C-80 -60 -20 -70 6 -50 C10 -22 -10 -6 -46 -8Z" ${o('#e5202b', 6)}/><path d="M-30 -56 L-36 -30" stroke="#fff" stroke-width="12" stroke-linecap="round"/><rect x="-46" y="-48" width="16" height="20" ${o('#ffd23b', 4)} transform="rotate(-8 -38 -38)"/>
    <path d="M10 -50 C24 -70 80 -60 84 -34 C80 -10 40 -6 20 -18Z" ${o('#e5202b', 6)}/><path d="M36 -54 L44 -30" stroke="#fff" stroke-width="12" stroke-linecap="round"/><rect x="34" y="-48" width="16" height="20" ${o('#ffd23b', 4)}/>
    <ellipse cx="0" cy="-118" rx="58" ry="66" ${o(B, 7)}/><ellipse cx="14" cy="-104" rx="34" ry="46" ${o(skin, 5)}/>
    ${limb('M-48 -136 C-84 -122 -96 -100 -94 -80', 22, B)}<circle cx="-92" cy="-72" r="24" ${o('#fff', 5)}/>
    ${limb('M46 -134 C86 -138 104 -160 100 -190', 22, B)}<circle cx="98" cy="-202" r="24" ${o('#fff', 5)}/>
    <path d="M-60 -300 C-170 -330 -230 -290 -250 -260 C-190 -270 -150 -262 -100 -246 C-180 -220 -220 -190 -236 -150 C-170 -180 -110 -196 -66 -206Z" ${o(B, 7)}/>
    <path d="M-40 -220 C-140 -196 -196 -150 -206 -100 C-150 -128 -100 -150 -50 -166Z" ${o(B, 7)}/>
    <circle cx="0" cy="-262" r="92" ${o(B, 8)}/>
    <path d="M-10 -340 C-14 -390 20 -430 52 -440 C56 -400 44 -370 34 -344Z" ${o(B, 7)}/><path d="M40 -338 C56 -380 96 -404 126 -404 C116 -368 92 -348 76 -330Z" ${o(B, 7)}/>
    <ellipse cx="34" cy="-236" rx="50" ry="44" ${o(skin, 5)}/>
    <ellipse cx="4" cy="-282" rx="30" ry="40" ${o('#fff', 5)}/><ellipse cx="52" cy="-282" rx="30" ry="40" ${o('#fff', 5)}/>
    <ellipse cx="12" cy="-278" rx="15" ry="26" fill="#1c8f3a"/><ellipse cx="60" cy="-278" rx="15" ry="26" fill="#1c8f3a"/><ellipse cx="14" cy="-278" rx="8" ry="15" fill="${INK}"/><ellipse cx="62" cy="-278" rx="8" ry="15" fill="${INK}"/><circle cx="16" cy="-290" r="5" fill="#fff"/><circle cx="64" cy="-290" r="5" fill="#fff"/>
    <ellipse cx="66" cy="-244" rx="14" ry="10" fill="${INK}"/><path d="M20 -212 C40 -196 66 -204 76 -220" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`, opt.flip);
}
function tails(x, y, s, opt){
  opt = opt || {}; const O = '#ff9a1a', W = '#fff';
  return g(x, y, s, `
    <path d="M-30 -70 C-120 -60 -170 -120 -150 -180 C-110 -150 -70 -150 -40 -110Z" ${o(O, 6)}/><path d="M-30 -60 C-130 -20 -190 -70 -200 -130 C-150 -100 -90 -100 -40 -88Z" ${o(O, 6)}/><circle cx="-152" cy="-176" r="14" fill="${W}" stroke="${INK}" stroke-width="4"/><circle cx="-200" cy="-128" r="14" fill="${W}" stroke="${INK}" stroke-width="4"/>
    ${limb('M-16 -60 L-20 -22', 24, O)}${limb('M22 -60 L30 -22', 24, O)}
    <ellipse cx="-24" cy="-14" rx="34" ry="18" ${o('#e5202b', 5)}/><ellipse cx="42" cy="-14" rx="34" ry="18" ${o('#e5202b', 5)}/>
    <ellipse cx="0" cy="-104" rx="48" ry="52" ${o(O, 6)}/><ellipse cx="6" cy="-96" rx="28" ry="36" ${o(W, 4)}/>
    <circle cx="0" cy="-200" r="72" ${o(O, 7)}/><path d="M-50 -250 L-40 -320 L-6 -262Z" ${o(O, 6)}/><path d="M40 -254 L58 -322 L74 -250Z" ${o(O, 6)}/>
    <path d="M-8 -180 C10 -160 60 -160 76 -186 C70 -220 20 -230 -8 -190Z" ${o(W, 5)}/>
    <ellipse cx="4" cy="-216" rx="20" ry="28" ${o(W, 5)}/><ellipse cx="46" cy="-216" rx="20" ry="28" ${o(W, 5)}/><ellipse cx="10" cy="-212" rx="11" ry="19" fill="#2a8ad8"/><ellipse cx="50" cy="-212" rx="11" ry="19" fill="#2a8ad8"/><ellipse cx="12" cy="-210" rx="6" ry="11" fill="${INK}"/><ellipse cx="52" cy="-210" rx="6" ry="11" fill="${INK}"/>
    <ellipse cx="70" cy="-184" rx="10" ry="8" fill="${INK}"/>`, opt.flip);
}
Object.assign(module.exports, {limb, star5, tri, triforce, link, sonic, tails});


// ---- personaggio generico «chibi»: si personalizza con capelli, colori e accessori (svg già disegnati con la stessa origine)
function chibi(x, y, s, c){
  c = c || {}; const skin = c.skin || '#f8c9a0', top = c.top || '#556', bot = c.bot || '#334', boots = c.boots || '#2a2a33', up = c.arms === 'up', eye = c.eye || '#2a58d8';
  const fwd = c.arms === 'fwd';
  const arms = fwd ? limb('M-54 -172 C-20 -190 40 -190 96 -176', 26, c.sleeve || top) + `<circle cx="108" cy="-174" r="23" ${o(c.glove || skin, 5)}/>` + limb('M54 -160 C80 -150 110 -150 140 -156', 26, c.sleeve || top) + `<circle cx="152" cy="-156" r="23" ${o(c.glove || skin, 5)}/>`
    : up ? limb('M-54 -170 C-88 -186 -104 -220 -100 -246', 26, c.sleeve || top) + `<circle cx="-100" cy="-256" r="21" ${o(c.glove || skin, 5)}/>` + limb('M54 -170 C88 -186 104 -220 100 -246', 26, c.sleeve || top) + `<circle cx="100" cy="-256" r="21" ${o(c.glove || skin, 5)}/>`
    : limb('M-54 -170 C-82 -146 -86 -116 -80 -92', 26, c.sleeve || top) + `<circle cx="-78" cy="-80" r="21" ${o(c.glove || skin, 5)}/>` + limb('M54 -170 C82 -146 86 -116 80 -92', 26, c.sleeve || top) + `<circle cx="78" cy="-80" r="21" ${o(c.glove || skin, 5)}/>`;
  return g(x, y, s, `${c.back || ''}
    ${limb('M-22 -70 V-18', 30, bot)}${limb('M24 -70 V-18', 30, bot)}<ellipse cx="-24" cy="-10" rx="34" ry="17" ${o(boots, 5)}/><ellipse cx="30" cy="-10" rx="34" ry="17" ${o(boots, 5)}/>
    <path d="M-56 -186 C-66 -130 -68 -96 -58 -66 L58 -66 C68 -96 66 -130 56 -186 C28 -204 -28 -204 -56 -186Z" ${o(top, 6)}/>
    ${c.torso || ''}${arms}
    ${c.hairBack || ''}
    <ellipse cx="0" cy="-236" rx="66" ry="70" ${o(skin, 7)}/>
    <ellipse cx="-22" cy="-226" rx="12" ry="18" ${o('#fff', 4)}/><ellipse cx="24" cy="-226" rx="12" ry="18" ${o('#fff', 4)}/><ellipse cx="-20" cy="-224" rx="7" ry="13" fill="${eye}"/><ellipse cx="26" cy="-224" rx="7" ry="13" fill="${eye}"/><circle cx="-18" cy="-228" r="3" fill="#fff"/><circle cx="28" cy="-228" r="3" fill="#fff"/>
    <path d="M-40 -250 L-8 -244 M10 -244 L42 -250" stroke="${c.brow || '#3a2a1a'}" stroke-width="6" stroke-linecap="round"/>
    <path d="M-10 -192 C0 -186 10 -186 20 -192" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
    ${c.hairFront || ''}${c.extra || ''}`, c.flip);
}
// ciuffi a punta (per capelli spigolosi): centro, raggio base, n punte, lunghezza, angolo iniziale/finale in gradi
function spikes(cx, cy, r, n, len, a0, a1, fill, sw){
  let d = ''; for(let i = 0; i < n; i++){ const a = (a0 + (a1 - a0) * i / (n - 1)) * Math.PI / 180, w = (a1 - a0) / (n - 1) * .5 * Math.PI / 180, L = len * (.75 + .5 * ((i * 7) % 3) / 2);
    const bx1 = cx + Math.cos(a - w) * r, by1 = cy + Math.sin(a - w) * r, bx2 = cx + Math.cos(a + w) * r, by2 = cy + Math.sin(a + w) * r, tx = cx + Math.cos(a + .04) * (r + L), ty = cy + Math.sin(a + .04) * (r + L);
    d += `M${bx1.toFixed(1)} ${by1.toFixed(1)} L${tx.toFixed(1)} ${ty.toFixed(1)} L${bx2.toFixed(1)} ${by2.toFixed(1)}Z`; }
  return `<path d="${d}" ${o(fill, sw || 6)}/>`;
}
Object.assign(module.exports, {chibi, spikes});

// ---- cavallo di profilo (verso destra). col = colore del manto
function horse(x, y, s, col, opt){
  opt = opt || {}; const dk = opt.dark || '#1a1010', st = opt.stroke || INK;
  const leg = (d)=> `<path d="${d}" fill="none" stroke="${st}" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>`;
  return g(x, y, s, `
    ${leg('M-96 -130 L-112 -60 L-100 -8')}${leg('M104 -130 L124 -60 L112 -8')}
    <path d="M-124 -170 C-200 -150 -230 -90 -214 -20 C-200 -80 -170 -120 -122 -130Z" ${o(dk, 6)}/>
    ${leg('M-60 -120 L-64 -60 L-52 -8')}${leg('M66 -120 L72 -60 L84 -8')}
    <path d="M-130 -160 C-140 -232 60 -244 130 -184 C160 -158 154 -112 124 -102 C60 -84 -80 -84 -130 -130Z" ${o(col, 7)}/>
    <path d="M100 -196 C130 -260 160 -300 196 -330 L236 -300 C210 -270 190 -230 170 -150Z" ${o(col, 7)}/>
    <path d="M100 -196 C130 -260 160 -300 196 -330 C190 -300 168 -250 140 -180Z" ${o(dk, 5)}/>
    <ellipse cx="226" cy="-296" rx="58" ry="27" transform="rotate(38 226 -296)" ${o(col, 7)}/>
    <path d="M196 -330 L188 -368 L214 -338Z" ${o(col, 5)}/>
    <circle cx="222" cy="-306" r="7" fill="${INK}"/><ellipse cx="268" cy="-270" rx="6" ry="9" fill="${INK}" opacity=".6"/>
    ${opt.saddle === false ? '' : `<path d="M-60 -226 C-30 -240 40 -240 70 -226 L60 -170 L-50 -170Z" ${o('#5a3a22', 6)}/>`}`, opt.flip);
}
// ---- fiamma (falò, torce): centro alla base
function flame(k, cx, cy, s, c1, c2, c3){
  return `<g transform="translate(${cx} ${cy}) scale(${s})"><path d="M0 0 C-60 -20 -70 -100 -30 -160 C-30 -110 -10 -100 0 -110 C-20 -190 30 -230 20 -300 C80 -240 90 -120 50 -40 C40 -10 20 0 0 0Z" fill="${c1}" stroke="${INK}" stroke-width="5"/><path d="M0 -10 C-30 -30 -30 -80 -6 -120 C-6 -90 6 -80 12 -90 C6 -140 26 -170 26 -200 C56 -150 52 -80 30 -40 C24 -20 10 -10 0 -10Z" fill="${c2}"/><path d="M4 -14 C-10 -30 -10 -60 6 -80 C14 -50 26 -50 20 -30 C16 -20 10 -14 4 -14Z" fill="${c3}"/></g>`;
}
Object.assign(module.exports, {horse, flame});
