#!/usr/bin/env node
// Genera triad-cards.js (200 carte base) e triad-exp.js (espansioni) con lati bilanciati.
//
// Come si decidono i numeri (vedi tools/BILANCIAMENTO.md):
//  1. Bilancio di potenza per livello: la somma dei 4 lati cresce di livello in livello senza sovrapporsi (SUM),
//     con un tetto al lato più alto (MAXS) e un minimo (MINS): nessuna carta bassa ha numeri da carta alta.
//  2. Profili: a parità di somma una carta può essere Equilibrata, d'Angolo (due lati vicini forti), a Punta (un lato altissimo)
//     o a Croce (due lati opposti forti). In ogni livello i profili sono dosati e i lati forti ruotano su tutte le direzioni.
//  3. Simulazione (--balance): migliaia di partite IA contro IA tra mazzi dello stesso livello, con tutte le combinazioni di regole.
//     Le carte che vincono troppo o troppo poco vengono corrette di un punto alla volta finché tutte stanno nella fascia giusta.
//  I valori trovati si fissano in tools/triad-balance.json: rilanciare lo script non li cambia (si possono rinominare le carte).
//
// Uso: node tools/build-triad-cards.js                 genera (le carte nuove ricevono valori di partenza)
//      node tools/build-triad-cards.js --balance [N]   simula e corregge (N partite per livello e per giro, predefinito 3000)
//      node tools/build-triad-cards.js --report        solo il rapporto (equilibrio, vantaggio del primo, salto tra livelli)
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = require('./triad-cards-src.js');
const LOCK = path.join(__dirname, 'triad-balance.json'), LEGACY = path.join(__dirname, 'triad-legacy.json');
const slug = n=> String(n).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function hash(s){ let h = 2166136261; for(const c of s){ h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed){ let a = seed >>> 0; return ()=>{ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// ---------------------------------------------------------------- regole dei numeri
const SUM = {1: [12, 13], 2: [14, 15], 3: [16, 17], 4: [18, 18], 5: [19, 20], 6: [21, 21], 7: [22, 23], 8: [24, 24], 9: [25, 26], 10: [27, 28]};
const MAXS = {1: 5, 2: 6, 3: 6, 4: 7, 5: 7, 6: 8, 7: 8, 8: 9, 9: 10, 10: 10};
const MINS = {1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2};
const ACE = {9: .5, 10: 1};                                            // quota di carte con una A (10): metà al livello 9, tutte al 10
const MIX = ['bil', 'bil', 'bil', 'bil', 'bil', 'ang', 'ang', 'ang', 'ang', 'ang', 'ang', 'ang', 'pic', 'pic', 'pic', 'pic', 'cro', 'cro', 'cro', 'cro'];   // 20 carte: 5 equilibrate, 7 d'angolo, 4 a punta, 4 a croce
const PROF_N = {bil: 'Equilibrata', ang: 'Angolo', pic: 'Punta', cro: 'Croce'};
// genere -> [elemento, probabilità] (solo per le espansioni, che non hanno l'elemento scritto a mano)
const GEN = {plat: ['vento', .5], rpg: ['sacro', .55], act: ['fuoco', .45], fps: ['tuono', .5], fight: ['fuoco', .45], horror: ['veleno', .6], strat: ['terra', .5], race: ['vento', .45], puzzle: ['acqua', .45], arcade: [null, 0], sport: [null, 0], mobile: ['acqua', .3], online: ['tuono', .4], indie: ['ghiaccio', .45], stealth: ['ghiaccio', .55], sandbox: ['terra', .5]};

const okSides = (v, L)=>{
  const s = v[0] + v[1] + v[2] + v[3], aces = v.filter(x=> x === 10).length;
  if(s < SUM[L][0] || s > SUM[L][1]) return false;
  if(v.some(x=> x < MINS[L])) return false;
  if(aces > 1) return false;
  const cap = MAXS[L] === 10 ? 9 : MAXS[L];
  return v.every(x=> x === 10 ? MAXS[L] === 10 : x <= cap);
};
// profilo e orientamento di una carta: [tipo, direzione]
function profile(v){
  const L = Math.max(...v) - Math.min(...v), o = [0, 1, 2, 3].sort((a, b)=> v[b] - v[a] || a - b), [a, b, c] = o.map(i=> v[i]);
  if(L <= 2 || (L <= 3 && v.every(x=> x >= 4))) return ['bil', 0];
  if(a - b >= 2 && a - b >= b - c) return ['pic', o[0]];
  const adj = (o[0] + 1) % 4 === o[1] || (o[1] + 1) % 4 === o[0];
  if(b - c >= 2) return adj ? ['ang', (o[0] + 1) % 4 === o[1] ? o[0] : o[1]] : ['cro', o[0] % 2];
  return ['bil', 0];
}
function makeSides(id, L, want, dir, ace){
  const R = rng(hash(id + '#' + L)), S = SUM[L];
  if(ace && want === 'bil'){ want = ['ang', 'cro', 'pic'][hash(id) % 3]; dir = want === 'cro' ? hash(id) % 2 : hash(id) % 4; }   // con una A non si può essere equilibrati
  for(let tries = 0; tries < 20000; tries++){
    const s = S[0] + Math.floor(R() * (S[1] - S[0] + 1)), v = [0, 0, 0, 0].map(()=> MINS[L]);
    let left = s - v.reduce((a, b)=> a + b, 0);
    if(ace){ const k = want === 'cro' ? dir + 2 * Math.floor(R() * 2) : want === 'bil' ? Math.floor(R() * 4) : dir; v[k % 4] = 10; left -= 10 - MINS[L]; }
    const w = [0, 1, 2, 3].map(i=> .3 + R() * 1.4);
    if(want === 'ang'){ w[dir] *= 3; w[(dir + 1) % 4] *= 3; }
    if(want === 'pic') w[dir] *= 6;
    if(want === 'cro'){ w[dir] *= 3; w[dir + 2] *= 3; }
    const cap = MAXS[L] === 10 ? 9 : MAXS[L];
    let guard = 0;
    while(left > 0 && guard++ < 200){
      const op = v.map((x, i)=> x >= (x === 10 ? 10 : cap) ? 0 : w[i]), tot = op.reduce((a, b)=> a + b, 0); if(!tot) break;
      let x = R() * tot, k = 0; while(x > op[k]){ x -= op[k]; k++; } v[k]++; left--;
    }
    if(left || !okSides(v, L)) continue;
    const [p, d] = profile(v);
    if(p === want && (want === 'bil' || d === dir)) return v;
  }
  throw new Error('non riesco a fare i lati di ' + id);
}

// ---------------------------------------------------------------- carte
const seen = new Set();
const base = [];
for(let L = 1; L <= 10; L++){
  (SRC[L] || []).forEach(([chr, game, year, plat, genre, el, scene, oid])=>{
    const id = oid || slug(chr); if(seen.has(id)) throw new Error('id doppio ' + id); seen.add(id);
    if(!GEN[genre]) throw new Error('genere sconosciuto ' + genre + ' (' + chr + ')');
    base.push({id, chr, game, year, plat, L, genre, el: el || null, scene: scene || ''});
  });
}
const EXP = require('./triad-exp-src.js'), CH = require('./triad-chars-src.js'), exp = [];
EXP.forEach(e=>{ for(let L = 1; L <= 10; L++) (e.cards[L] || []).forEach(([game, year, plat, genre])=>{
  const id = slug(game); if(seen.has(id)) throw new Error('id doppio ' + id); seen.add(id);
  const ch = CH[game]; if(!ch) throw new Error('manca il personaggio di ' + game);
  const R = rng(hash(id)), G = GEN[genre]; if(!G) throw new Error('genere sconosciuto ' + genre);
  exp.push({id, chr: ch[0], game, year, plat, L, genre, el: G[0] && R() < G[1] ? G[0] : null, scene: ch[1], set: e.id});
}); });
const ALL = base.concat(exp);

// valori fissati + valori di partenza per le carte nuove (profili dosati per livello e per gruppo: base o espansione)
let lock = {}; try{ lock = JSON.parse(fs.readFileSync(LOCK, 'utf8')).cards || {}; }catch(e){}
const groups = {};
ALL.forEach(c=>{ const g = (c.set || 'base') + ':' + c.L; (groups[g] = groups[g] || []).push(c); });
Object.values(groups).forEach(list=>{
  const L = list[0].L, n = list.length, R = rng(hash(list[0].set || 'base') ^ L);
  const mix = n === 20 ? MIX.slice() : Array.from({length: n}, (_, i)=> ['ang', 'bil', 'pic', 'cro', 'ang'][i % 5]);
  for(let i = mix.length - 1; i > 0; i--){ const j = Math.floor(R() * (i + 1)); [mix[i], mix[j]] = [mix[j], mix[i]]; }
  const dirs = {bil: 0, ang: Math.floor(R() * 4), pic: Math.floor(R() * 4), cro: Math.floor(R() * 2)};
  const aces = Math.round(n * (ACE[L] || 0)), aceIdx = new Set(list.map((c, i)=> i).sort((a, b)=> hash(list[a].id) - hash(list[b].id)).slice(0, aces));
  list.forEach((c, i)=>{
    const want = mix[i], dir = want === 'cro' ? (dirs.cro++ % 2) : want === 'bil' ? 0 : (dirs[want]++ % 4);
    c.v = lock[c.id] && okSides(lock[c.id], L) ? lock[c.id].slice() : makeSides(c.id, L, want, dir, aceIdx.has(i));
  });
});

// ---------------------------------------------------------------- simulazione
const Core = require(path.join(ROOT, 'triad-core.js'));
const PRESETS = [{}, {same: true}, {plus: true}, {elemental: true}, {same: true, plus: true, combo: true}, {elemental: true, same: true, plus: true, combo: true}, {same: true, sameWall: true, combo: true}, {special: true, elemental: true}];
function game(hA, hB, R, rules, ai){
  let st = Core.newGame({rules, seed: Math.floor(R() * 4294967296), first: R() < .5 ? 0 : 1, hands: [hA, hB]});
  const first = st.first; let guard = 0;
  while(!st.over && guard++ < 40){ const m = Core.ai(st, ai || 3, R); st = Core.play(st, m, {noSudden: true}).state; }
  const s = Core.score(st);
  return {r: s[0] > s[1] ? 1 : s[0] < s[1] ? 0 : .5, first};
}
const card = c=> ({id: c.id, v: c.v, e: c.el});
const hand = (pool, R)=>{ const p = pool.slice(); for(let i = p.length - 1; i > 0; i--){ const j = Math.floor(R() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } return p.slice(0, 5); };
function simLevel(list, N, seed){
  const R = rng(seed), stat = {}; list.forEach(c=> stat[c.id] = [0, 0]);
  let firstW = 0, firstN = 0;
  for(let g = 0; g < N; g++){
    const a = hand(list, R), b = hand(list, R), rules = PRESETS[g % PRESETS.length];
    const {r, first} = game(a.map(card), b.map(card), R, rules);
    a.forEach(c=>{ stat[c.id][0] += r; stat[c.id][1]++; }); b.forEach(c=>{ stat[c.id][0] += 1 - r; stat[c.id][1]++; });
    if(r !== .5){ firstN++; if((r === 1) === (first === 0)) firstW++; }
  }
  const wr = {}; for(const k in stat) wr[k] = stat[k][1] ? stat[k][0] / stat[k][1] : .5;
  return {wr, first: firstN ? firstW / firstN : .5};
}
// correzione di un punto: troppo forte -> tolgo dal lato più alto (o lo sposto sul più basso), troppo debole -> il contrario
function nudge(c, up){
  const L = c.L, v = c.v.slice(), s = v.reduce((a, b)=> a + b, 0), hi = v.indexOf(Math.max(...v.filter(x=> x !== 10).concat([0]))), lo = v.indexOf(Math.min(...v));
  const tries = up ? [()=>{ v[lo]++; }, ()=>{ v[hi]++; }] : [()=>{ v[hi]--; }, ()=>{ v[hi]--; v[lo]++; }];
  if(!up && s <= SUM[L][0]) tries.shift();
  if(up && s >= SUM[L][1]) tries.splice(0, 2, ()=>{ v[lo]++; v[hi]--; });
  for(const t of tries){ const w = v.slice(); t(); if(okSides(v, L) && v.join() !== c.v.join()){ c.v = v.slice(); return true; } v.splice(0, 4, ...w); }
  return false;
}
const LO = .44, HI = .56;
function report(N){
  const out = {levels: {}, cross: {}};
  for(let L = 1; L <= 10; L++){
    const list = base.filter(c=> c.L === L), {wr, first} = simLevel(list, N, 7000 + L), vals = Object.values(wr);
    out.levels[L] = {min: Math.min(...vals), max: Math.max(...vals), first, out: list.filter(c=> wr[c.id] < LO || wr[c.id] > HI).map(c=> c.id + ' ' + (wr[c.id] * 100).toFixed(0) + '%')};
    console.log(`L${L}: vittorie per carta ${(out.levels[L].min * 100).toFixed(0)}–${(out.levels[L].max * 100).toFixed(0)}% · chi inizia vince il ${(first * 100).toFixed(0)}%${out.levels[L].out.length ? ' · fuori fascia: ' + out.levels[L].out.join(', ') : ''}`);
  }
  // salto tra livelli: un mazzo di livello L+1 contro uno di livello L
  for(let L = 1; L < 10; L++){
    const A = base.filter(c=> c.L === L + 1), B = base.filter(c=> c.L === L), R = rng(9000 + L); let w = 0;
    const M = Math.max(200, N / 6 | 0);
    for(let g = 0; g < M; g++) w += game(hand(A, R).map(card), hand(B, R).map(card), R, PRESETS[g % PRESETS.length]).r;
    out.cross[L] = w / M; console.log(`  livello ${L + 1} contro livello ${L}: vince il ${(w / M * 100).toFixed(0)}%`);
  }
  return out;
}

const args = process.argv.slice(2);
let rep = null;
if(args.includes('--balance')){
  const N = +args[args.indexOf('--balance') + 1] || 3000;
  const sets = [['base', base]].concat(EXP.map(e=> [e.id, exp.filter(c=> c.set === e.id)]));
  for(const [name, cards] of sets){
    for(let L = 1; L <= 10; L++){
      const list = cards.filter(c=> c.L === L); if(!list.length) continue;
      // le espansioni (3 carte per livello) si misurano mescolate alle base dello stesso livello
      const pool = name === 'base' ? list : list.concat(base.filter(c=> c.L === L));
      for(let round = 0; round < 8; round++){
        const {wr} = simLevel(pool, name === 'base' ? N : Math.round(N * .6), hash(name) + L * 131 + round);
        let moved = 0;
        list.forEach(c=>{ if(wr[c.id] > HI){ if(nudge(c, false)) moved++; } else if(wr[c.id] < LO){ if(nudge(c, true)) moved++; } });
        process.stdout.write(`${name} L${L} giro ${round + 1}: corrette ${moved}\n`);
        if(!moved) break;
      }
    }
  }
}
if(args.includes('--balance') || args.includes('--report')) rep = report(+args[args.indexOf('--report') + 1] || 2000);

// ---------------------------------------------------------------- scrittura
const lockOut = {}; ALL.forEach(c=> lockOut[c.id] = c.v);
let oldRep = null; try{ oldRep = JSON.parse(fs.readFileSync(LOCK, 'utf8')).report || null; }catch(e){}
fs.writeFileSync(LOCK, JSON.stringify({nota: 'Lati fissati dal bilanciamento (tools/build-triad-cards.js). Cambiali solo con --balance.', report: rep || oldRep, cards: lockOut}, null, 0).replace(/\],"/g, '],\n"'));
// carte tolte dal set base -> carta nuova dello stesso livello (per le collezioni già fatte)
let legacy = {}; try{ legacy = JSON.parse(fs.readFileSync(LEGACY, 'utf8')); }catch(e){
  try{
    const old = require(path.join(ROOT, 'triad-cards.js'));
    old.forEach(o=>{ if(seen.has(o[0])) return; const same = base.filter(c=> c.L === o[4]); legacy[o[0]] = same[hash(o[0]) % same.length].id; });
  }catch(e2){}
}
fs.writeFileSync(LEGACY, JSON.stringify(legacy, null, 0));
const row = c=> [c.id, c.game, c.year, c.plat, c.L, c.v, c.el, c.genre];
const header = `// Triple Triad di Frugu: le 200 carte base (generato da tools/build-triad-cards.js, non modificare a mano).
// [id, gioco, anno, piattaforma, livello 1-10, [alto, destra, basso, sinistra] (10 = A), elemento o null, genere]. Il personaggio è in triad-chars.js.
// TRIAD_CARDS.legacy: carte tolte -> carta che le sostituisce nelle collezioni già fatte.
`;
fs.writeFileSync(path.join(ROOT, 'triad-cards.js'), header + `(function(root){\n  var TRIAD_CARDS = ${JSON.stringify(base.map(row))};\n  TRIAD_CARDS.legacy = ${JSON.stringify(legacy)};\n  if(typeof module === 'object' && module.exports) module.exports = TRIAD_CARDS; else root.TRIAD_CARDS = TRIAD_CARDS;\n})(typeof self !== 'undefined' ? self : this);\n`);
const expBody = `(function(root){\n  var TRIAD_EXP = ${JSON.stringify({sets: EXP.map(e=> ({id: e.id, name: e.name, emoji: e.emoji, desc: e.desc, level: e.level})), cards: exp.map(c=> row(c).concat([c.set]))})};\n  if(typeof module === 'object' && module.exports) module.exports = TRIAD_EXP; else root.TRIAD_EXP = TRIAD_EXP;\n})(typeof self !== 'undefined' ? self : this);\n`;
fs.writeFileSync(path.join(ROOT, 'triad-exp.js'), '// Triple Triad: le carte delle espansioni (generato da tools/build-triad-cards.js, non modificare a mano). Come triad-cards.js con l\'id dell\'espansione in fondo.\n' + expBody);
// personaggi e scene: li legge tools/build-triad-assets.js
fs.writeFileSync(path.join(__dirname, 'triad-chars-gen.json'), JSON.stringify(Object.fromEntries(ALL.map(c=> [c.id, [c.chr, c.scene]]))));

// riepilogo
const prof = {}; base.forEach(c=>{ const p = profile(c.v)[0]; prof[p] = (prof[p] || 0) + 1; });
const pos = [0, 0, 0, 0]; base.forEach(c=> c.v.forEach((x, i)=> pos[i] += x));
console.log('carte base:', base.length, '· espansioni:', exp.length);
console.log('somme:', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(L=>{ const s = base.filter(c=> c.L === L).map(c=> c.v.reduce((a, b)=> a + b, 0)); return 'L' + L + ' ' + Math.min(...s) + '-' + Math.max(...s); }).join(' · '));
console.log('profili:', Object.entries(prof).map(([k, n])=> PROF_N[k] + ' ' + n).join(' · '), '· forza per lato (alto/destra/basso/sinistra):', pos.join('/'));
const els = {}; base.forEach(c=> els[c.el || 'nessuno'] = (els[c.el || 'nessuno'] || 0) + 1); console.log('elementi:', JSON.stringify(els));
module.exports = {profile};
