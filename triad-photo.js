// ---- Raccoon Triad: immagini personali delle carte e rilievo dei foil ----
// Cerca nel browser → copia l'immagine → torna nel gioco: la incollo da sola e la ritaglio in 5:7 puntando sul soggetto (volti, dettagli).
// Le immagini stanno in IndexedDB (raccoon_triad/photos) a 750×1050: in localStorage ne entrerebbero poche.
// Rilievo: da ogni immagine ricavo tre maschere (lati illuminati, lati in ombra, contorni) che i foil usano per luci e arcobaleno in rilievo.
(function(){
  'use strict';
  const TT = window.TT; if(!TT || TT.photo) return;
  const {$, $$, esc, LS} = TT;
  const W = 750, H = 1050, RW = 200, RH = 280;

  // ---------------------------------------------------------------- archivio (IndexedDB)
  let dbp = null;
  const db = ()=> dbp || (dbp = new Promise((res, rej)=>{
    try{ const r = indexedDB.open('raccoon_triad', 1); r.onupgradeneeded = ()=> r.result.createObjectStore('photos'); r.onsuccess = ()=> res(r.result); r.onerror = ()=> rej(r.error); }catch(e){ rej(e); }
  }));
  const store = (mode, fn)=> db().then(d=> new Promise((res, rej)=>{ const t = d.transaction('photos', mode), r = fn(t.objectStore('photos')); t.oncomplete = ()=> res(r && r.result); t.onerror = ()=> rej(t.error); t.onabort = ()=> rej(t.error); }));
  const PH = {};                                                       // cid → {url (objectURL), rel {a, b, e}}
  const REL = new Map();                                               // src → rel (anche per le immagini non mie), o promessa in corso

  async function load(){
    try{
      const all = await new Promise((res, rej)=> db().then(d=>{ const out = {}, c = d.transaction('photos').objectStore('photos').openCursor(); c.onsuccess = ()=>{ const k = c.result; if(!k) return res(out); out[k.key] = k.value; k.continue(); }; c.onerror = ()=> rej(c.error); }, rej));
      for(const cid in all){ const v = all[cid]; if(v && v.img){ PH[cid] = {url: URL.createObjectURL(v.img), rel: v.rel || null}; if(v.rel) REL.set(PH[cid].url, v.rel); } }
      // le vecchie foto in localStorage (300×420) passano qui, così liberano spazio
      const old = LS.get('jrpg_triad_photos', null);
      if(old && typeof old === 'object' && Object.keys(old).length){
        for(const cid in old){ if(PH[cid]) continue; try{ const im = await imgOf(old[cid]), cv = canvasOf(im, 'fill'); await save(cid, cv); }catch(e){} }
        LS.set('jrpg_triad_photos', {});
      }
    }catch(e){}
  }
  async function save(cid, cv){
    let blob = await new Promise(r=> cv.toBlob(r, 'image/webp', .88));
    if(!blob || blob.type !== 'image/webp') blob = await new Promise(r=> cv.toBlob(r, 'image/jpeg', .9));   // Safari non salva in webp
    const rel = reliefOf(cv);
    await store('readwrite', s=> s.put({img: blob, rel, t: Date.now()}, cid));
    if(PH[cid]) try{ URL.revokeObjectURL(PH[cid].url); }catch(e){}
    PH[cid] = {url: URL.createObjectURL(blob), rel}; REL.set(PH[cid].url, rel);
  }
  async function remove(cid){
    await store('readwrite', s=> s.delete(cid));
    if(PH[cid]) try{ URL.revokeObjectURL(PH[cid].url); }catch(e){}
    delete PH[cid];
  }
  const urls = ()=>{ const o = {}; for(const k in PH) o[k] = PH[k].url; return o; };

  // ---------------------------------------------------------------- immagini
  const imgOf = (src, cors)=> new Promise((res, rej)=>{ const im = new Image(); if(cors) im.crossOrigin = 'anonymous'; im.onload = ()=> res(im); im.onerror = ()=> rej(new Error('img')); im.src = src; });
  const blobImg = async b=>{ const u = URL.createObjectURL(b); try{ return await imgOf(u); }finally{ setTimeout(()=> URL.revokeObjectURL(u), 4000); } };
  const proxy = (u, w)=> 'https://wsrv.nl/?url=' + encodeURIComponent(u) + '&w=' + (w || 1600) + '&we&output=png';
  async function urlImg(u){
    if(/^data:image\//.test(u)) return imgOf(u);
    try{ return await imgOf(u, true); }catch(e){}
    return imgOf(proxy(u), true);                                      // la maggior parte dei siti non permette di leggere le immagini: passo dal proxy
  }

  // punto d'interesse: dove l'immagine ha più dettagli, colori e pelle; i volti (se il browser li riconosce) vincono
  function energy(im){
    const k = 96 / Math.max(im.width, im.height), w = Math.max(8, Math.round(im.width * k)), h = Math.max(8, Math.round(im.height * k));
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const cx = cv.getContext('2d', {willReadFrequently: true}); cx.drawImage(im, 0, 0, w, h);
    const d = cx.getImageData(0, 0, w, h).data, L = new Float32Array(w * h), E = new Float32Array(w * h);
    for(let i = 0; i < w * h; i++){ const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2]; L[i] = .3 * r + .59 * g + .11 * b; }
    for(let y = 1; y < h - 1; y++) for(let x = 1; x < w - 1; x++){
      const i = y * w + x, gx = L[i + 1] - L[i - 1], gy = L[i + w] - L[i - w], r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2];
      const mx = Math.max(r, g, b), sat = mx ? (mx - Math.min(r, g, b)) / mx : 0, skin = r > 95 && g > 40 && b > 20 && r > g && r > b && r - g > 15 && mx - Math.min(r, g, b) > 15;
      E[i] = Math.sqrt(gx * gx + gy * gy) / 255 + sat * .35 + (skin ? .6 : 0);
    }
    return {E, w, h};
  }
  async function faceBox(im){
    try{ if(!('FaceDetector' in window)) return null; const f = await new window.FaceDetector({fastMode: true, maxDetectedFaces: 3}).detect(im); if(!f || !f.length) return null; const b = f.sort((a, c)=> c.boundingBox.width * c.boundingBox.height - a.boundingBox.width * a.boundingBox.height)[0].boundingBox; return {x: b.x + b.width / 2, y: b.y + b.height / 2}; }catch(e){ return null; }
  }
  // ritaglio migliore 5:7 a tutta carta: {s, ox, oy} in pixel della carta finale
  async function autoCrop(im){
    const s = Math.max(W / im.width, H / im.height), dw = im.width * s, dh = im.height * s, fx = W - dw, fy = H - dh;    // fx, fy ≤ 0: quanto posso spostare
    const face = await faceBox(im);
    if(face){ const ox = Math.min(0, Math.max(fx, W / 2 - face.x * s)), oy = Math.min(0, Math.max(fy, H * .36 - face.y * s)); return {s, ox, oy}; }
    const {E, w, h} = energy(im), k = w / im.width;
    const win = (x0, y0)=>{ let t = 0; const x1 = Math.min(w, x0 + Math.round(W / s * k)), y1 = Math.min(h, y0 + Math.round(H / s * k)); for(let y = y0; y < y1; y++) for(let x = x0; x < x1; x++) t += E[y * w + x]; return t; };
    let best = {sc: -1, ox: fx / 2, oy: fy / 2};
    const steps = 24;
    for(let i = 0; i <= steps; i++){
      const ox = fx * i / steps, oy = fy * i / steps;
      if(fx < -1){ const sc = win(Math.round(-ox / s * k), 0) * (1 - .15 * Math.abs(i / steps - .5)); if(sc > best.sc) best = {sc, ox, oy: 0}; }
      else if(fy < -1){ const sc = win(0, Math.round(-oy / s * k)) * (1 - .25 * (i / steps)); if(sc > best.sc) best = {sc, ox: 0, oy}; }   // i soggetti stanno di solito in alto
    }
    return {s, ox: best.ox, oy: best.oy};
  }
  // disegno la carta finale; mode 'fill' (a tutta carta) o 'whole' (immagine intera su sfondo sfocato)
  function canvasOf(im, mode, c){
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; drawTo(cv, im, mode, c); return cv;
  }
  function drawTo(cv, im, mode, c){
    const cx = cv.getContext('2d'); cx.imageSmoothingQuality = 'high';
    if(!c){ const s = mode === 'whole' ? Math.min(W / im.width, H / im.height) : Math.max(W / im.width, H / im.height); c = {s, ox: (W - im.width * s) / 2, oy: (H - im.height * s) / 2}; }
    cx.fillStyle = '#101024'; cx.fillRect(0, 0, W, H);
    if(mode === 'whole'){
      const t = document.createElement('canvas'); t.width = 15; t.height = 21; const tx = t.getContext('2d'), bs = Math.max(15 / im.width, 21 / im.height);
      tx.drawImage(im, (15 - im.width * bs) / 2, (21 - im.height * bs) / 2, im.width * bs, im.height * bs);
      cx.drawImage(t, -20, -28, W + 40, H + 56); cx.fillStyle = 'rgba(0,0,0,.28)'; cx.fillRect(0, 0, W, H);
    }
    cx.drawImage(im, c.ox, c.oy, im.width * c.s, im.height * c.s);
  }

  // ---------------------------------------------------------------- rilievo
  function reliefOf(src){
    const cv = document.createElement('canvas'); cv.width = RW; cv.height = RH; const cx = cv.getContext('2d', {willReadFrequently: true});
    const sw = src.naturalWidth || src.width, sh = src.naturalHeight || src.height, s = Math.max(RW / sw, RH / sh);
    cx.drawImage(src, (RW - sw * s) / 2, (RH - sh * s) * .2, sw * s, sh * s);                 // come object-position: center 20%
    const d = cx.getImageData(0, 0, RW, RH).data, n = RW * RH, L = new Float32Array(n), B = new Float32Array(n);
    for(let i = 0; i < n; i++) L[i] = (.3 * d[i * 4] + .59 * d[i * 4 + 1] + .11 * d[i * 4 + 2]) / 255;
    for(let y = 1; y < RH - 1; y++) for(let x = 1; x < RW - 1; x++){ const i = y * RW + x; B[i] = (L[i] * 4 + L[i - 1] + L[i + 1] + L[i - RW] + L[i + RW]) / 8; }
    const A = new Float32Array(n), Bm = new Float32Array(n), Em = new Float32Array(n);
    for(let y = 2; y < RH - 2; y++) for(let x = 2; x < RW - 2; x++){
      const i = y * RW + x;
      const gx = (B[i - RW + 1] + 2 * B[i + 1] + B[i + RW + 1]) - (B[i - RW - 1] + 2 * B[i - 1] + B[i + RW - 1]);
      const gy = (B[i + RW - 1] + 2 * B[i + RW] + B[i + RW + 1]) - (B[i - RW - 1] + 2 * B[i - RW] + B[i - RW + 1]);
      const dd = gx + gy;                                                // superficie che guarda in alto a sinistra (dd < 0) o in basso a destra (dd > 0)
      A[i] = Math.max(0, -dd); Bm[i] = Math.max(0, dd); Em[i] = Math.sqrt(gx * gx + gy * gy) + Math.max(0, L[i] - .72) * 1.2;   // contorni + zone chiare
    }
    const p98 = arr=>{ const t = Array.from(arr).filter(v=> v > .002).sort((a, b)=> a - b); return t.length ? t[Math.floor(t.length * .98)] || 1 : 1; };
    const out = (arr, g)=>{
      const m = p98(arr), im = cx.createImageData(RW, RH), o = im.data;
      for(let i = 0; i < n; i++){ o[i * 4] = o[i * 4 + 1] = o[i * 4 + 2] = 255; o[i * 4 + 3] = Math.round(255 * Math.pow(Math.min(1, arr[i] / m), g)); }
      cx.putImageData(im, 0, 0); return cv.toDataURL('image/png');
    };
    return {a: out(A, .8), b: out(Bm, .8), e: out(Em, .9)};
  }
  const relHtml = r=> `<i class="ttc-rl" style="--ra:url('${r.a}');--rb:url('${r.b}');--re:url('${r.e}')"><b class="a1"></b><b class="b1"></b><b class="b2"></b><b class="a2"></b><b class="e"></b></i>`;
  // rilievo già pronto per questa immagine (sincrono, per cardHtml)
  const relFor = src=>{ const r = REL.get(src); return r && !r.then ? r : null; };
  // chiamata dall'onload delle immagini dei foil: calcolo il rilievo (una volta per immagine) e lo aggiungo alla carta
  let busy = 0; const q = [];
  function relOn(img){
    const card = img.closest('.ttc'); if(!card || !card.dataset.fo || $('.ttc-rl', card)) return;
    const src = img.getAttribute('src');
    const put = r=>{ if(r && img.isConnected && !$('.ttc-rl', card)) img.insertAdjacentHTML('afterend', relHtml(r)); };
    const r = REL.get(src);
    if(r !== undefined){ if(r && r.then) r.then(put); else put(r); return; }                // 0 = già provato, non leggibile
    const p = new Promise(res=> q.push({src, orig: img.dataset.orig, res})); REL.set(src, p); p.then(v=>{ REL.set(src, v || 0); put(v); });
    pump();
  }
  async function pump(){
    if(busy >= 2 || !q.length) return; busy++;
    const j = q.shift();
    try{
      let im;
      if(/^(blob:|data:)/.test(j.src) || (/^triad-img\//.test(j.src) && location.protocol !== 'file:')) im = await imgOf(j.src);
      else if(location.protocol !== 'file:' || /^https?:/.test(j.orig || j.src)) im = await imgOf(proxy(j.orig || j.src, 400), true);
      j.res(im ? reliefOf(im) : null);
    }catch(e){ j.res(null); }
    busy--; setTimeout(pump, 30);
  }

  // ---------------------------------------------------------------- editor: cerca, incolla, ritaglia
  const searchUrl = (q)=> 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(q);
  function queries(cid){
    const c = TT.CARD[cid], ch = TT.chr(cid), game = c.name, same = TT.slug(ch) === TT.slug(game);
    return [['🔎 Personaggio', same ? game + ' artwork' : ch + ' ' + game + ' official art'], ['🎮 Copertina', game + ' ' + (c.plat || '') + ' cover art'], ['🖼️ Sfondo', (same ? game : ch + ' ' + game) + ' wallpaper']];
  }
  async function fromClipboard(){
    if(!navigator.clipboard || !navigator.clipboard.read) throw new Error('nocb');
    const items = await navigator.clipboard.read();
    for(const it of items){ const t = it.types.find(x=> /^image\//.test(x)); if(t) return blobImg(await it.getType(t)); }
    for(const it of items){
      if(it.types.includes('text/html')){ const h = await (await it.getType('text/html')).text(), m = h.match(/<img[^>]+src=["']([^"']+)/i); if(m) return urlImg(m[1].replace(/&amp;/g, '&')); }
      if(it.types.includes('text/plain')){ const t = (await (await it.getType('text/plain')).text()).trim(); if(/^(https?:|data:image)/.test(t)) return urlImg(t); }
    }
    throw new Error('empty');
  }
  async function fromPaste(e){
    const dt = e.clipboardData; if(!dt) return null;
    for(const it of dt.items){ if(it.kind === 'file' && /^image\//.test(it.type)){ const f = it.getAsFile(); if(f) return blobImg(f); } }
    const h = dt.getData('text/html'), m = h && h.match(/<img[^>]+src=["']([^"']+)/i); if(m) return urlImg(m[1].replace(/&amp;/g, '&'));
    const t = (dt.getData('text/plain') || '').trim(); if(/^(https?:|data:image)/.test(t)) return urlImg(t);
    return null;
  }

  // o: {done(saved), queue: {i, n, next, skip}}
  function edit(cid, o){
    o = o || {}; const c = TT.CARD[cid] || o.card; if(!c) return;           // o.card/o.title/o.queries/o.saveTo: stesso editor per immagini che non sono carte (dorso)
    const qs = o.queries || queries(cid), sq = o.queue;
    const m = TT.modal(`
      <h3 style="margin-top:0">${esc(o.title || 'Immagine di ' + TT.chr(cid))}${sq ? ` <small class="mut">${sq.i + 1} di ${sq.n}</small>` : ''}</h3>
      ${o.card ? '' : `<p class="mut" style="margin:0 0 8px">${esc(c.name)} · ${esc(c.year)} · ${esc(c.plat)}</p>`}
      <div class="ph-steps"><b>1</b> Cerca &nbsp; <b>2</b> Tieni premuto sull'immagine → <i>Copia</i> &nbsp; <b>3</b> Torna qui: la metto io</div>
      <div class="tt2-row c" style="flex-wrap:wrap;gap:6px">${qs.map((x, i)=> `<button class="tt2-btn sm" data-q="${i}">${x[0]}</button>`).join('')}</div>
      <div class="tt2-row c" style="margin-top:6px;gap:6px"><button class="tt2-btn pri" data-paste>📋 Incolla</button><button class="tt2-btn sm" data-file>📁 Dal telefono</button><button class="tt2-btn sm" data-url>🔗 Indirizzo</button></div>
      <div class="ph-ed" hidden>
        <div class="ph-wrap"><canvas class="ph-cv" width="${W}" height="${H}"></canvas><div class="ph-hint">Trascina per spostare · pizzica o rotella per lo zoom</div></div>
        <div class="tt2-row c" style="gap:6px;margin-top:8px"><button class="tt2-btn sm" data-auto>✨ Automatico</button><button class="tt2-btn sm" data-mode>Immagine intera</button><input type="range" class="ph-z" min="1" max="3" step=".01" value="1" style="flex:1;min-width:90px"></div>
      </div>
      <p class="mut ph-msg" style="text-align:center;min-height:1.2em;margin:8px 0 0"></p>
      <div class="tt2-row c" style="margin-top:8px;gap:6px">${PH[cid] ? '<button class="tt2-btn sm" data-del>🗑️ Togli la mia</button>' : ''}${sq ? '<button class="tt2-btn sm" data-skip>Salta</button><button class="tt2-btn sm" data-stop>Basta</button>' : '<button class="tt2-btn sm" data-mclose>Annulla</button>'}<button class="tt2-btn pri" data-save disabled>${sq ? 'Salva e avanti' : 'Metti sulla carta'}</button></div>
      <input type="file" accept="image/*" class="ph-file" style="display:none">`, {sticky: true});
    const cv = $('.ph-cv', m), msg = t=>{ $('.ph-msg', m).textContent = t || ''; }, ed = $('.ph-ed', m), zr = $('.ph-z', m);
    let im = null, mode = 'fill', cr = null, base = 1, waiting = false;
    const minS = ()=> mode === 'whole' ? Math.min(W / im.width, H / im.height) : Math.max(W / im.width, H / im.height);
    const clamp = ()=>{
      const dw = im.width * cr.s, dh = im.height * cr.s;
      if(mode === 'fill'){ cr.ox = Math.min(0, Math.max(W - dw, cr.ox)); cr.oy = Math.min(0, Math.max(H - dh, cr.oy)); }
      else { cr.ox = dw <= W ? Math.min(W - dw, Math.max(0, cr.ox)) : Math.min(0, Math.max(W - dw, cr.ox)); cr.oy = dh <= H ? Math.min(H - dh, Math.max(0, cr.oy)) : Math.min(0, Math.max(H - dh, cr.oy)); }
    };
    const draw = ()=>{ clamp(); drawTo(cv, im, mode, cr); };
    const zoomTo = (s, px, py)=>{ s = Math.max(base, Math.min(base * 3, s)); px = px == null ? W / 2 : px; py = py == null ? H / 2 : py; cr.ox = px - (px - cr.ox) * s / cr.s; cr.oy = py - (py - cr.oy) * s / cr.s; cr.s = s; zr.value = (s / base).toFixed(2); draw(); };
    async function auto(){
      if(mode === 'fill') cr = await autoCrop(im); else { const s = minS(); cr = {s, ox: (W - im.width * s) / 2, oy: (H - im.height * s) / 2}; }
      base = minS(); zr.value = 1; draw();
    }
    async function use(p){
      msg('Carico l\'immagine…');
      try{ im = await p; }catch(e){ msg(e && e.message === 'nocb' ? 'Il browser non mi lascia leggere gli appunti: tocca 📋 Incolla oppure tieni premuto qui e scegli Incolla.' : 'Negli appunti non trovo un\'immagine: copiala e riprova.'); return false; }
      if(!im) return false;
      waiting = false; ed.hidden = false;
      mode = im.width / im.height > 1.25 && (Math.max(W / im.width, H / im.height) * im.width) / W > 2.4 ? 'whole' : 'fill';   // foto molto larghe: meglio intere su sfondo sfocato
      $('[data-mode]', m).textContent = mode === 'fill' ? 'Immagine intera' : 'A tutta carta';
      await auto(); $('[data-save]', m).disabled = false;
      msg(im.width < 450 ? '⚠️ Immagine piccola (' + im.width + '×' + im.height + '): sulla carta sarà sgranata. Meglio cercarne una più grande.' : 'Sistemala come vuoi, poi salva.');
      return true;
    }
    // al ritorno dal browser provo a leggere gli appunti da solo
    const onBack = ()=>{ if(document.visibilityState === 'visible' && waiting && m.isConnected) setTimeout(()=>{ if(waiting) use(fromClipboard()).then(ok=>{ if(!ok) $('[data-paste]', m).classList.add('ph-pulse'); }); }, 350); };
    const onPaste = e=>{ if(!m.isConnected) return; const p = fromPaste(e); e.preventDefault(); use(p); };
    document.addEventListener('visibilitychange', onBack); window.addEventListener('focus', onBack); document.addEventListener('paste', onPaste);
    const off = ()=>{ document.removeEventListener('visibilitychange', onBack); window.removeEventListener('focus', onBack); document.removeEventListener('paste', onPaste); };
    const finish = saved=>{ off(); m.remove(); o.done && o.done(saved); };

    $$('[data-q]', m).forEach(b=> b.addEventListener('click', ()=>{ waiting = true; msg('Copia l\'immagine e torna qui.'); window.open(searchUrl(qs[+b.dataset.q][1]), '_blank', 'noopener'); }));
    $('[data-paste]', m).addEventListener('click', ()=>{ $('[data-paste]', m).classList.remove('ph-pulse'); use(fromClipboard()); });
    $('[data-file]', m).addEventListener('click', ()=> $('.ph-file', m).click());
    $('.ph-file', m).addEventListener('change', e=>{ const f = e.target.files && e.target.files[0]; if(f) use(blobImg(f)); });
    $('[data-url]', m).addEventListener('click', ()=>{ const u = prompt('Incolla l\'indirizzo dell\'immagine'); if(u && /^https?:/.test(u.trim())) use(urlImg(u.trim())); });
    $('[data-auto]', m).addEventListener('click', ()=> im && auto());
    $('[data-mode]', m).addEventListener('click', e=>{ if(!im) return; mode = mode === 'fill' ? 'whole' : 'fill'; e.target.textContent = mode === 'fill' ? 'Immagine intera' : 'A tutta carta'; auto(); });
    zr.addEventListener('input', ()=> im && zoomTo(base * +zr.value));
    // trascina e pizzica
    const pts = new Map(); let last = null;
    const pos = e=>{ const r = cv.getBoundingClientRect(); return {x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height}; };
    cv.addEventListener('pointerdown', e=>{ if(!im) return; cv.setPointerCapture(e.pointerId); pts.set(e.pointerId, pos(e)); last = null; });
    cv.addEventListener('pointermove', e=>{
      if(!im || !pts.has(e.pointerId)) return; const p = pos(e), prev = pts.get(e.pointerId); pts.set(e.pointerId, p);
      if(pts.size === 1){ cr.ox += p.x - prev.x; cr.oy += p.y - prev.y; draw(); }
      else if(pts.size === 2){ const [a, b] = [...pts.values()], dd = Math.hypot(a.x - b.x, a.y - b.y); if(last) zoomTo(cr.s * dd / last, (a.x + b.x) / 2, (a.y + b.y) / 2); last = dd; }
    });
    const up = e=>{ pts.delete(e.pointerId); last = null; };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    cv.addEventListener('wheel', e=>{ if(!im) return; e.preventDefault(); const p = pos(e); zoomTo(cr.s * (e.deltaY < 0 ? 1.08 : 1 / 1.08), p.x, p.y); }, {passive: false});

    $('[data-save]', m).addEventListener('click', async ()=>{
      if(!im) return; const b = $('[data-save]', m); b.disabled = true; msg('Salvo…');
      try{ if(o.saveTo){ await o.saveTo(cv); finish(true); return; } await save(cid, cv); TT.P.art[cid] = 'f'; TT.saveP(); TT.snd && TT.snd('coin'); TT.toast('Immagine messa sulla carta'); refresh(cid); finish(true); }
      catch(e){ b.disabled = false; msg('Non riesco a salvare (spazio pieno?)'); }
    });
    const dl = $('[data-del]', m); if(dl) dl.addEventListener('click', async ()=>{ await remove(cid); if(TT.P.art[cid] === 'f') delete TT.P.art[cid]; TT.saveP(); refresh(cid); finish(false); });
    const sk = $('[data-skip]', m); if(sk) sk.addEventListener('click', ()=> finish(null));
    const sp = $('[data-stop]', m); if(sp) sp.addEventListener('click', ()=>{ off(); m.remove(); sq.stop && sq.stop(); });
    $$('[data-mclose]', m).forEach(b=> b.addEventListener('click', off));
    if(o.file) use(blobImg(o.file));
  }
  // ridisegno le carte già sullo schermo con la nuova immagine
  function refresh(cid){ $$('.ttc[data-cid="' + cid + '"]').forEach(el=>{ if(el.closest('.tt2-modal')) return; const o = {foil: +el.dataset.fo || 0, style: el.dataset.st}; if(el.dataset.o != null) o.owner = +el.dataset.o; const t = document.createElement('div'); t.innerHTML = TT.cardHtml(cid, o); const n = t.firstChild; if(!n) return; n.className = el.className; el.replaceWith(n); }); }

  // ---------------------------------------------------------------- in serie: una carta dopo l'altra
  function series(only){
    const ids = TT.LIST.map(c=> c.id).filter(id=> !PH[id] && (only !== 'none' || !(window.TRIAD_IMGS || []).includes(id))).sort((a, b)=> TT.CARD[b].lv - TT.CARD[a].lv);
    if(!ids.length) return TT.toast('Non ci sono carte da fare');
    let i = 0, stop = false, done = 0;
    const next = ()=>{
      if(stop || i >= ids.length){ TT.toast(done + ' immagini messe'); return; }
      const cid = ids[i];
      edit(cid, {queue: {i, n: ids.length, stop: ()=>{ stop = true; TT.toast(done + ' immagini messe'); }}, done: saved=>{ if(saved) done++; i++; next(); }});
    };
    next();
  }
  // esporta / importa (per passare le immagini a un altro telefono o pubblicarle nel gioco)
  // tutte le immagini come {cid: dataURL} (anche per il salvataggio completo dei progressi)
  async function dataAll(){
    const out = {};
    const all = await new Promise((res, rej)=> db().then(d=>{ const o2 = {}, c = d.transaction('photos').objectStore('photos').openCursor(); c.onsuccess = ()=>{ const k = c.result; if(!k) return res(o2); o2[k.key] = k.value; k.continue(); }; c.onerror = ()=> rej(c.error); }, rej));
    for(const cid in all) out[cid] = await new Promise(r=>{ const fr = new FileReader(); fr.onload = ()=> r(fr.result); fr.readAsDataURL(all[cid].img); });
    return out;
  }
  async function putAll(photos){
    let n = 0;
    for(const cid in (photos || {})){ if(!TT.CARD[cid]) continue; try{ const im = await imgOf(photos[cid]); await save(cid, canvasOf(im, 'fill')); TT.P.art[cid] = 'f'; n++; }catch(e){} }
    TT.saveP(); return n;
  }
  async function exportAll(){
    const out = {v: 1, app: 'raccoon-triad', photos: await dataAll()};
    const n = Object.keys(out.photos).length; if(!n) return TT.toast('Non hai ancora immagini tue');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], {type: 'application/json'})); a.download = 'raccoon-triad-immagini.json'; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    TT.toast(n + ' immagini esportate');
  }
  function importAll(){
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'application/json,.json';
    inp.onchange = async ()=>{
      const f = inp.files && inp.files[0]; if(!f) return;
      try{
        const j = JSON.parse(await f.text()), n = await putAll(j.photos);
        TT.toast(n + ' immagini importate');
      }catch(e){ TT.toast('File non valido'); }
    };
    inp.click();
  }

  TT.photo = {load, urls, edit, series, exportAll, importAll, dataAll, putAll, remove, count: ()=> Object.keys(PH).length, relOn, relFor, relHtml};
})();
