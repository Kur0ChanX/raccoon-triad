#!/usr/bin/env node
// Foglio di controllo: mostra le immagini scaricate in tools/triad-raw/ con il nome del file, per verificare che siano quelle giuste.
// Uso: node tools/review-triad-raw.js out.png [id ...]
const fs = require('fs'), path = require('path');
const RAW = path.join(__dirname, 'triad-raw'), idx = JSON.parse(fs.readFileSync(path.join(RAW, 'index.json'), 'utf8'));
const out = process.argv[2], ids = process.argv.slice(3).length ? process.argv.slice(3) : Object.keys(idx);
const items = []; ids.forEach(id=> (idx[id] || []).forEach(x=> x && items.push({id, x})));
const cols = 8, cw = 190, ch = 250;
const html = `<body style="margin:0;background:#222;font:11px system-ui;color:#fff;display:grid;grid-template-columns:repeat(${cols},${cw}px)">${items.map(({id, x})=> { const f = path.join(RAW, x.saved), ext = path.extname(f).slice(1).replace('jpg', 'jpeg'); return `<div style="width:${cw}px;height:${ch}px;overflow:hidden;position:relative;background:repeating-conic-gradient(#555 0 25%,#777 0 50%) 0 0/16px 16px"><img style="width:100%;height:${ch - 44}px;object-fit:contain" src="data:image/${ext};base64,${fs.readFileSync(f).toString('base64')}"><div style="position:absolute;bottom:0;left:0;right:0;height:44px;background:#000c;padding:2px 4px;box-sizing:border-box;overflow:hidden"><b>${id}</b><br>${x.file.replace('File:', '').slice(0, 40)}<br>${x.w}x${x.h}</div></div>`; }).join('')}</body>`;
(async()=>{
  let pw; try{ pw = require('playwright'); }catch(e){ pw = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright'); }
  const br = await pw.chromium.launch({executablePath: process.env.PW_CHROMIUM || undefined}).catch(()=> pw.chromium.launch());
  const pg = await br.newPage({viewport: {width: cols * cw, height: 600}}); await pg.setContent(html); await pg.waitForTimeout(1000);
  await pg.screenshot({path: out, fullPage: true}); await br.close(); console.log('ok', items.length);
})();
