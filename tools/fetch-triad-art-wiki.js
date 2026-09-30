#!/usr/bin/env node
// Cerca sulle wiki (tools/triad-wiki-src.js) le illustrazioni ufficiali dei personaggi e le scarica in tools/triad-raw/ (cartella NON pubblicata).
// Per ogni carta scrive tools/triad-raw/<id>-<n>.<ext> e tools/triad-raw/index.json (sorgente e pagina di ogni immagine, per i crediti).
// Uso: node tools/fetch-triad-art-wiki.js [id ...] [--redo]      Poi: node tools/build-triad-illustrations.js
const fs = require('fs'), path = require('path');
const {WIKIS, SRC} = require('./triad-wiki-src.js');
const RAW = path.join(__dirname, 'triad-raw'); fs.mkdirSync(RAW, {recursive: true});
const IDX = path.join(RAW, 'index.json'), index = fs.existsSync(IDX) ? JSON.parse(fs.readFileSync(IDX, 'utf8')) : {};
const args = process.argv.slice(2), redo = args.includes('--redo'), ids = args.filter(a=> !a.startsWith('--'));
const UA = {'user-agent': 'RaccoonTriad/1.0 (progetto privato tra amici; carte Triple Triad)'};
const sleep = ms=> new Promise(r=> setTimeout(r, ms));
const norm = s=> String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '');
async function api(wiki, params){
  const u = WIKIS[wiki] + '?' + new URLSearchParams(Object.assign({format: 'json', formatversion: '2', origin: '*'}, params));
  for(let i = 0; i < 3; i++){ try{ const r = await fetch(u, {headers: UA}); if(r.ok) return await r.json(); }catch(e){} await sleep(800 * (i + 1)); }
  return null;
}
// pagina giusta: titolo esatto se esiste, altrimenti il primo risultato di ricerca
async function findPage(wiki, q){
  let d = await api(wiki, {action: 'query', titles: q, redirects: '1', prop: 'info'});
  let p = d && d.query && d.query.pages && d.query.pages[0];
  if(p && !p.missing) return p.title;
  d = await api(wiki, {action: 'query', list: 'search', srsearch: q, srlimit: '5', srnamespace: '0'});
  const hit = d && d.query && d.query.search && d.query.search.find(s=> norm(s.title).includes(norm(q).slice(0, 6))) || (d && d.query && d.query.search && d.query.search[0]);
  return hit ? hit.title : null;
}
// ricerca tra i file della wiki (spazio dei nomi File): utile quando la pagina del personaggio ha un'immagine poco adatta
async function searchFiles(wiki, q){
  const d = await api(wiki, {action: 'query', generator: 'search', gsrsearch: q, gsrnamespace: '6', gsrlimit: '20', prop: 'imageinfo', iiprop: 'url|size|mime'});
  return ((d && d.query && d.query.pages) || []).map(p=>{ const ii = p.imageinfo && p.imageinfo[0]; return ii && /\.(png|jpe?g|webp)$/i.test(p.title) ? {file: p.title, url: ii.url, w: ii.width, h: ii.height} : null; }).filter(Boolean);
}
// candidati: immagine principale della pagina + tutti i file della pagina, ordinati per «somiglianza a un render ufficiale»
async function candidates(wiki, title, opt){
  const out = [];
  if(opt && opt.file){                                                          // file scelto a mano: si prende direttamente
    const f = await api(wiki, {action: 'query', titles: opt.file, prop: 'imageinfo', iiprop: 'url|size|mime'}), ii = f && f.query && f.query.pages && f.query.pages[0].imageinfo && f.query.pages[0].imageinfo[0];
    return ii ? [{file: opt.file, url: ii.url, w: ii.width, h: ii.height}] : [];
  }
  const a = await api(wiki, {action: 'query', titles: title, prop: 'pageimages', piprop: 'original|name'});
  const pg = a && a.query && a.query.pages && a.query.pages[0];
  if(pg && pg.original) out.push({file: 'File:' + pg.pageimage, url: pg.original.source, w: pg.original.width, h: pg.original.height, main: true});
  const b = await api(wiki, {action: 'query', titles: title, prop: 'images', imlimit: '80'});
  const files = ((b && b.query && b.query.pages && b.query.pages[0].images) || []).map(i=> i.title).filter(t=> /\.(png|jpe?g|webp)$/i.test(t));
  for(let i = 0; i < files.length; i += 30){
    const c = await api(wiki, {action: 'query', titles: files.slice(i, i + 30).join('|'), prop: 'imageinfo', iiprop: 'url|size|mime'});
    ((c && c.query && c.query.pages) || []).forEach(p=>{ const ii = p.imageinfo && p.imageinfo[0]; if(ii && !out.some(o=> o.file === p.title)) out.push({file: p.title, url: ii.url, w: ii.width, h: ii.height}); });
  }
  if(opt && opt.q) (await searchFiles(wiki, opt.q)).forEach(c=>{ if(!out.some(o=> o.file === c.file)) out.push(Object.assign(c, {main: true})); });
  const re = opt && opt.re;
  const score = c=>{
    const n = c.file, ar = c.h / c.w; let s = 0;
    if(opt && opt.file) return n === opt.file ? 999 : -999;
    if(/render|artwork|official|promo|key ?art|concept|cg|portrait|\bart\b/i.test(n)) s += 4;
    if(/\.png$/i.test(n)) s += 1;
    if(c.main) s += 2;
    if(c.h >= 900) s += 2; else if(c.h >= 600) s += 1; else s -= 3;
    if(ar >= .9 && ar <= 2.3) s += 2; else if(ar < .6) s -= 3;
    if(/icon|logo|sprite|screenshot|map|flag|banner|\bbox\b|cover|infobox|symbol|signature|render.*head|face|button|gallery|pixel|8-?bit|16-?bit|amiibo|figure|toy|cosplay|fan|comic|manga|anime|movie|film|netflix/i.test(n)) s -= 4;
    if(re) s += re.test(n) ? 6 : -1;
    return s;
  };
  return out.filter(c=> c.w >= 300 && c.h >= 300).sort((x, y)=> score(y) - score(x)).slice(0, 3);
}
(async()=>{
  const todo = ids.length ? ids : Object.keys(SRC);
  for(const id of todo){
    if(!SRC[id]){ console.log('senza fonte:', id); continue; }
    if(index[id] && !redo && index[id].length === SRC[id].length && index[id].every(x=> x && fs.existsSync(path.join(RAW, x.saved)))){ console.log('già fatto', id); continue; }
    const res = [];
    for(let n = 0; n < SRC[id].length; n++){
      const [wiki, q, opt] = SRC[id][n];
      if(wiki === 'steam'){                                                     // copertina verticale ufficiale di Steam (q = appid)
        const url = 'https://cdn.cloudflare.steamstatic.com/steam/apps/' + q + '/library_600x900.jpg', r = await fetch(url, {headers: UA});
        if(!r.ok){ console.log('  Steam senza copertina:', id, q); res.push(null); continue; }
        const saved = id + '-' + n + '.jpg'; fs.writeFileSync(path.join(RAW, saved), Buffer.from(await r.arrayBuffer()));
        res.push({wiki: 'steam', title: String(q), file: 'library_600x900.jpg', url, w: 600, h: 900, saved, alt: []}); console.log('  ok', id, '← Steam', q); continue;
      }
      const title = opt && opt.q ? (await findPage(wiki, q) || q) : await findPage(wiki, q); if(!title){ console.log('  pagina non trovata:', id, wiki, q); res.push(null); continue; }
      const cands = await candidates(wiki, title, opt); if(!cands.length){ console.log('  nessuna immagine:', id, wiki, title); res.push(null); continue; }
      const best = cands[0], ext = (best.url.match(/\.(png|jpe?g|webp)/i) || [, 'png'])[1].toLowerCase().replace('jpeg', 'jpg');
      const r = await fetch(best.url, {headers: UA}); if(!r.ok){ console.log('  download fallito', best.url); res.push(null); continue; }
      const buf = Buffer.from(await r.arrayBuffer()), saved = id + '-' + n + '.' + ext; fs.writeFileSync(path.join(RAW, saved), buf);
      res.push({wiki, title, file: best.file, url: best.url, w: best.w, h: best.h, saved, cut: !!(opt && opt.cut), alt: cands.slice(1).map(c=> c.file)});
      console.log('  ok', id, '←', wiki + ':', title, '/', best.file, best.w + 'x' + best.h);
      await sleep(400);
    }
    index[id] = res; fs.writeFileSync(IDX, JSON.stringify(index, null, 1));
  }
})();
