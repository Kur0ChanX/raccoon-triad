#!/usr/bin/env node
// Disegna le illustrazioni delle carte (tools/triad-art/*.js, grafica vettoriale originale) e le salva in triad-img/<id>.webp (750×1050).
// Uso: node tools/build-triad-illustrations.js [id ...] [--sheet file.png]   (senza id: tutte quelle disegnate). Poi: node tools/build-triad-assets.js
const fs = require('fs'), path = require('path');
const {Kit} = require('./triad-art/kit.js');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'triad-img');
const DRAW = {};
fs.readdirSync(path.join(__dirname, 'triad-art')).filter(f=> /^set.*\.js$/.test(f)).forEach(f=> Object.assign(DRAW, require('./triad-art/' + f)));
const args = process.argv.slice(2), si = args.indexOf('--sheet'), sheet = si >= 0 ? args.splice(si, 2)[1] : null;
const ids = args.length ? args : Object.keys(DRAW);
const svgOf = id=>{ const k = new Kit(id); DRAW[id](k); return k.out(); };
(async()=>{
  let pw; try{ pw = require('playwright'); }catch(e){ pw = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright'); }
  const br = await pw.chromium.launch({executablePath: process.env.PW_CHROMIUM || undefined}).catch(()=> pw.chromium.launch());
  const pg = await br.newPage({viewport: {width: 750, height: 1050}});
  fs.mkdirSync(OUT, {recursive: true}); const shots = [];
  for(const id of ids){
    if(!DRAW[id]){ console.log('manca il disegno di', id); continue; }
    await pg.setContent(`<body style="margin:0;background:#000">${svgOf(id)}</body>`);
    const png = await pg.screenshot({type: 'png', clip: {x: 0, y: 0, width: 750, height: 1050}});
    const b64 = await pg.evaluate(async src=>{ const im = new Image(); await new Promise(r=>{ im.onload = r; im.src = src; }); const c = document.createElement('canvas'); c.width = 750; c.height = 1050; c.getContext('2d').drawImage(im, 0, 0); return c.toDataURL('image/webp', .88).split(',')[1]; }, 'data:image/png;base64,' + png.toString('base64'));
    fs.writeFileSync(path.join(OUT, id + '.webp'), Buffer.from(b64, 'base64')); shots.push({id, png}); console.log('ok', id);
  }
  if(sheet){                                                             // foglio di anteprima con tutte le carte (per controllare lo stile)
    const cols = Math.min(shots.length, 6), cw = 250, ch = 350, rows = Math.ceil(shots.length / cols);
    await pg.setViewportSize({width: cols * cw, height: rows * ch});
    await pg.setContent(`<body style="margin:0;background:#111;display:grid;grid-template-columns:repeat(${cols},${cw}px)">${shots.map(s=> `<img width="${cw}" height="${ch}" src="data:image/png;base64,${s.png.toString('base64')}">`).join('')}</body>`);
    await pg.screenshot({path: sheet, fullPage: true}); console.log('foglio', sheet);
  }
  await br.close();
})();
