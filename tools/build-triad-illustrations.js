#!/usr/bin/env node
// Compone le illustrazioni delle carte: prende le immagini scaricate in tools/triad-raw/ (vedi fetch-triad-art-wiki.js), ritaglia il personaggio, lo mette su uno sfondo
// con la luce del genere della carta e salva triad-img/<id>.webp (750×1050, 5:7). Scrive anche triad-img/CREDITI.md (da dove viene ogni immagine).
// Uso: node tools/build-triad-illustrations.js [id ...] [--sheet foglio.png]      (senza id: tutte quelle scaricate). Poi: node tools/build-triad-assets.js
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), RAW = path.join(__dirname, 'triad-raw'), OUT = path.join(ROOT, 'triad-img');
const idx = JSON.parse(fs.readFileSync(path.join(RAW, 'index.json'), 'utf8'));
const CARDS = require(path.join(ROOT, 'triad-cards.js')).concat(require(path.join(ROOT, 'triad-exp.js')).cards), META = {}; CARDS.forEach(c=> META[c[0]] = {name: c[1], g: c[7], e: c[6]});
const GHUE = {plat: 8, rpg: 265, act: 352, fps: 205, fight: 22, horror: 285, strat: 140, race: 48, puzzle: 172, arcade: 322, sport: 100, mobile: 190, online: 218, indie: 152, stealth: 232, sandbox: 34};
const args = process.argv.slice(2), si = args.indexOf('--sheet'), sheet = si >= 0 ? args.splice(si, 2)[1] : null;
const ids = (args.length ? args : Object.keys(idx)).filter(id=> idx[id] && idx[id].some(Boolean));

// ---- codice eseguito nel browser: disegna una carta partendo dalle immagini (data URL) e dalla tinta
function compose(parts, hue){
  const W = 750, H = 1050;
  const load = src=> new Promise((res, rej)=>{ const i = new Image(); i.onload = ()=> res(i); i.onerror = rej; i.src = src; });
  const cv = (w, h)=>{ const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  // analisi: trasparenza, sfondo uniforme (da togliere) o scena intera (da usare come sfondo)
  function analyse(img, force){
    const k = Math.min(1, 1400 / Math.max(img.width, img.height)), w = Math.round(img.width * k), h = Math.round(img.height * k), c = cv(w, h), x = c.getContext('2d', {willReadFrequently: true}); x.drawImage(img, 0, 0, w, h);
    let d = x.getImageData(0, 0, w, h), a = d.data, transp = 0, n = 0;
    for(let i = 3; i < a.length; i += 4 * 7){ n++; if(a[i] < 200) transp++; }
    if(transp / n > .06) return {c, kind: 'cut', w, h};
    // bordo uniforme?
    const px = (X, Y)=>{ const o = (Y * w + X) * 4; return [a[o], a[o + 1], a[o + 2]]; }, edge = [];
    for(let t = 0; t < w; t += 3){ edge.push(px(t, 0), px(t, h - 1)); } for(let t = 0; t < h; t += 3){ edge.push(px(0, t), px(w - 1, t)); }
    const m = [0, 1, 2].map(j=> edge.reduce((s, e)=> s + e[j], 0) / edge.length), sd = Math.sqrt([0, 1, 2].reduce((s, j)=> s + edge.reduce((q, e)=> q + (e[j] - m[j]) ** 2, 0) / edge.length, 0) / 3);
    if(!force && (sd > 22 || Math.min(m[0], m[1], m[2]) < 205)) return {c, kind: 'scene', w, h};          // solo gli sfondi chiari e uniformi si tolgono (quelli scuri fanno parte dell'illustrazione)
    // flood fill dal bordo: tutto ciò che assomiglia allo sfondo diventa trasparente
    const seen = new Uint8Array(w * h), q = [], tol = 42, near = o=> Math.abs(a[o] - m[0]) + Math.abs(a[o + 1] - m[1]) + Math.abs(a[o + 2] - m[2]) < tol * 3 / 1.5;
    const push = (X, Y)=>{ if(X < 0 || Y < 0 || X >= w || Y >= h) return; const p = Y * w + X; if(seen[p]) return; if(!near(p * 4)) return; seen[p] = 1; q.push(p); };
    for(let t = 0; t < w; t++){ push(t, 0); push(t, h - 1); } for(let t = 0; t < h; t++){ push(0, t); push(w - 1, t); }
    while(q.length){ const p = q.pop(), X = p % w, Y = (p / w) | 0; push(X + 1, Y); push(X - 1, Y); push(X, Y + 1); push(X, Y - 1); }
    let cleared = 0; for(let p = 0; p < w * h; p++) if(seen[p]){ a[p * 4 + 3] = 0; cleared++; }
    if(cleared / (w * h) < .08 || cleared / (w * h) > .8) return {c, kind: 'scene', w, h};          // troppo poco o troppo: non era uno sfondo uniforme, è una scena
    x.putImageData(d, 0, 0); return {c, kind: 'cut', w, h};
  }
  function bbox(c){ const x = c.getContext('2d', {willReadFrequently: true}), d = x.getImageData(0, 0, c.width, c.height).data; let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0; for(let y = 0; y < c.height; y++) for(let X = 0; X < c.width; X++) if(d[(y * c.width + X) * 4 + 3] > 24){ if(X < x0) x0 = X; if(X > x1) x1 = X; if(y < y0) y0 = y; if(y > y1) y1 = y; } return {x: x0, y: y0, w: Math.max(1, x1 - x0 + 1), h: Math.max(1, y1 - y0 + 1)}; }
  return (async()=>{
    const imgs = []; for(const p of parts){ if(p) imgs.push(analyse(await load(p.src), p.cut)); }
    const out = cv(W, H), g = out.getContext('2d');
    const scene = imgs.find(i=> i.kind === 'scene'), cuts = imgs.filter(i=> i.kind === 'cut');
    if(scene && !cuts.length){                                   // illustrazione a tutta carta: ritaglio centrale 5:7, un po' più zoomata
      const ar = W / H, sw = Math.min(scene.w, scene.h * ar), sh = sw / ar; g.drawImage(scene.c, (scene.w - sw) / 2, Math.max(0, (scene.h - sh) * .25), sw, sh, 0, 0, W, H);
    } else {
      // sfondo: gradiente tinta + bagliore + raggi
      const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, `hsl(${hue} 55% 14%)`); bg.addColorStop(.55, `hsl(${hue} 60% 30%)`); bg.addColorStop(1, `hsl(${(hue + 25) % 360} 50% 12%)`); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      g.save(); g.translate(W / 2, H * .55); for(let i = 0; i < 16; i++){ g.rotate(Math.PI * 2 / 16); g.fillStyle = `hsla(${hue} 90% 80% / ${i % 2 ? .05 : .1})`; g.beginPath(); g.moveTo(0, 0); g.lineTo(-90, -1200); g.lineTo(90, -1200); g.closePath(); g.fill(); } g.restore();
      const gl = g.createRadialGradient(W / 2, H * .5, 20, W / 2, H * .5, 520); gl.addColorStop(0, `hsla(${(hue + 20) % 360} 100% 75% / .75)`); gl.addColorStop(1, `hsla(${hue} 100% 60% / 0)`); g.fillStyle = gl; g.fillRect(0, 0, W, H);
      g.fillStyle = `hsla(${hue} 30% 8% / .55)`; g.beginPath(); g.ellipse(W / 2, H - 70, 330, 40, 0, 0, 7); g.fill();
      const n = cuts.length, boxes = cuts.map(i=> Object.assign({i}, bbox(i.c)));
      // ordine: il più alto/grande al centro
      boxes.sort((a, b)=> (b.h / b.w) - (a.h / a.w)); const order = n === 1 ? [0] : n === 2 ? [0, 1] : [1, 0, 2].map(k=> k), placed = [];
      const xs = n === 1 ? [.5] : n === 2 ? [.3, .7] : [.2, .5, .8], hs = n === 1 ? [.9] : n === 2 ? [.8, .8] : [.66, .84, .66];
      let arranged = boxes.slice(); if(n === 3) arranged = [boxes[1], boxes[0], boxes[2]];
      arranged.forEach((b, k)=>{
        let dh = H * hs[k], dw = dh * b.w / b.h; const maxW = W * (n === 1 ? .98 : n === 2 ? .7 : .56); if(dw > maxW){ dw = maxW; dh = dw * b.h / b.w; }
        const dx = W * xs[k] - dw / 2, dy = H - 40 - dh; placed.push({b, dx, dy, dw, dh});
      });
      const drawOne = p=>{
        const {b, dx, dy, dw, dh} = p, sil = cv(Math.ceil(dw + 60), Math.ceil(dh + 60)), s = sil.getContext('2d');
        s.drawImage(b.i.c, b.x, b.y, b.w, b.h, 30, 30, dw, dh); s.globalCompositeOperation = 'source-in'; s.fillStyle = '#fff'; s.fillRect(0, 0, sil.width, sil.height);
        g.save(); g.filter = 'blur(12px)'; g.globalAlpha = .55; g.drawImage(sil, dx - 30, dy - 30); g.restore();
        g.save(); g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 24; g.shadowOffsetY = 8; g.drawImage(b.i.c, b.x, b.y, b.w, b.h, dx, dy, dw, dh); g.restore();
      };
      placed.slice().sort((a, b)=> (a.dh - b.dh)).forEach(drawOne);
    }
    // ombre per numeri (in alto a sinistra) e nome (in basso) e vignetta
    let s = g.createLinearGradient(0, 0, 0, 300); s.addColorStop(0, 'rgba(0,0,0,.5)'); s.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = s; g.fillRect(0, 0, W, 300);
    s = g.createLinearGradient(0, H - 260, 0, H); s.addColorStop(0, 'rgba(0,0,0,0)'); s.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = s; g.fillRect(0, H - 260, W, 260);
    s = g.createRadialGradient(W / 2, H / 2, 380, W / 2, H / 2, 800); s.addColorStop(0, 'rgba(0,0,0,0)'); s.addColorStop(1, 'rgba(0,0,0,.45)'); g.fillStyle = s; g.fillRect(0, 0, W, H);
    return {webp: out.toDataURL('image/webp', .9).split(',')[1], png: out.toDataURL('image/png').split(',')[1], kinds: imgs.map(i=> i.kind)};
  })();
}

(async()=>{
  let pw; try{ pw = require('playwright'); }catch(e){ pw = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright'); }
  const br = await pw.chromium.launch({executablePath: process.env.PW_CHROMIUM || undefined}).catch(()=> pw.chromium.launch());
  const pg = await br.newPage({viewport: {width: 750, height: 1050}}); await pg.setContent('<body></body>');
  fs.mkdirSync(OUT, {recursive: true}); const shots = [];
  for(const id of ids){
    const parts = idx[id].map(x=> x ? {src: 'data:image/' + path.extname(x.saved).slice(1).replace('jpg', 'jpeg') + ';base64,' + fs.readFileSync(path.join(RAW, x.saved)).toString('base64'), cut: !!x.cut} : null);
    const m = META[id] || {}, hue = GHUE[m.g] != null ? GHUE[m.g] : 250;
    const r = await pg.evaluate(`(${compose.toString()})(${JSON.stringify(parts)}, ${hue})`);
    fs.writeFileSync(path.join(OUT, id + '.webp'), Buffer.from(r.webp, 'base64')); shots.push({id, png: Buffer.from(r.png, 'base64')}); console.log('ok', id, r.kinds.join('+'));
  }
  // crediti
  let cr = '# Crediti delle illustrazioni\n\nImmagini ufficiali dei giochi prese dalle wiki dei fan e da Steam, usate per un gioco privato tra amici. I diritti sono dei rispettivi autori e case produttrici.\n\n';
  Object.keys(idx).sort().forEach(id=> idx[id].forEach(x=>{ if(x) cr += `- \`${id}\` ← ${x.wiki === 'steam' ? 'Steam app ' + x.title : x.wiki + ': ' + x.title + ' (' + x.file + ')'} — ${x.url}\n`; }));
  fs.writeFileSync(path.join(OUT, 'CREDITI.md'), cr);
  if(sheet){
    const cols = Math.min(shots.length, 8), cw = 200, ch = 280, rows = Math.ceil(shots.length / cols);
    await pg.setViewportSize({width: cols * cw, height: rows * ch});
    await pg.setContent(`<body style="margin:0;background:#111;display:grid;grid-template-columns:repeat(${cols},${cw}px)">${shots.map(s=> `<img width="${cw}" height="${ch}" src="data:image/png;base64,${s.png.toString('base64')}">`).join('')}</body>`);
    await pg.waitForTimeout(500); await pg.screenshot({path: sheet, fullPage: true}); console.log('foglio', sheet);
  }
  await br.close();
})();
