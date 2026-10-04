// ---- Raccoon Triad: editor delle carte (numeri, elemento, nome, gioco), studio del bilanciamento e dorso delle carte. Caricato da triad.js (TT.openEdit) solo quando serve. ----
// Le modifiche stanno in localStorage 'jrpg_triad_edit' = {cid: {v, e, n, gm}} (solo i campi diversi dall'ufficiale) e valgono subito sul telefono.
// «Esporta» le salva in un file: per renderle ufficiali per tutti si mettono in tools/ (triad-balance.json, triad-cards-src.js, triad-chars-src.js).
(function(){
  'use strict';
  const TT = window.TT; if(!TT || TT.edit) return;
  const {$, $$, esc, V, LS} = TT, Core = window.TriadCore;
  const EK = 'jrpg_triad_edit', BK = 'jrpg_triad_back';
  // regole dei numeri per livello: le stesse di tools/build-triad-cards.js (vedi tools/BILANCIAMENTO.md)
  const SUM = {1: [12, 13], 2: [14, 15], 3: [15, 15], 4: [17, 18], 5: [18, 19], 6: [20, 21], 7: [21, 22], 8: [23, 24], 9: [24, 24], 10: [26, 27]};
  const MAXS = {1: 5, 2: 5, 3: 6, 4: 6, 5: 7, 6: 7, 7: 8, 8: 8, 9: 10, 10: 10};
  const MINS = {1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2};
  const SIDES = ['Alto', 'Destra', 'Basso', 'Sinistra'];
  const PRESETS = [{}, {same: true}, {plus: true}, {elemental: true}, {same: true, plus: true, combo: true}, {elemental: true, same: true, plus: true, combo: true}, {same: true, sameWall: true, combo: true}, {special: true, elemental: true}];
  const LO = .44, HI = .56;
  const sumV = v=> v[0] + v[1] + v[2] + v[3];
  const edits = ()=> LS.get(EK, {}) || {};
  const origName = cid=>{ const e = (window.TRIAD_CHARS || {})[cid]; return e ? e[0] : TT.ORIG[cid].gm; };
  const nameOf = cid=> TT.chr(cid);
  const ask = (t, y, n)=> TT.ask ? TT.ask(t, y, n) : Promise.resolve(confirm(t));
  function rng(seed){ let a = seed >>> 0; return ()=>{ a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  // ---------------------------------------------------------------- valutazione a colpo d'occhio
  // controllo delle regole del livello: [{w: 'high'|'low', t}]
  function ruleCheck(v, lv){
    const out = [], s = sumV(v), mx = Math.max(...v), mn = Math.min(...v), aces = v.filter(x=> x >= 10).length;
    if(s > SUM[lv][1]) out.push({w: 'high', t: `Somma ${s}: al livello ${lv} va da ${SUM[lv][0]} a ${SUM[lv][1]}. È troppo alta.`});
    if(s < SUM[lv][0]) out.push({w: 'low', t: `Somma ${s}: al livello ${lv} va da ${SUM[lv][0]} a ${SUM[lv][1]}. È troppo bassa.`});
    if(mx > MAXS[lv]) out.push({w: 'high', t: `Lato più alto ${V(mx)}: al livello ${lv} il massimo è ${V(MAXS[lv])}.`});
    if(mn < MINS[lv]) out.push({w: 'low', t: `Lato più basso ${mn}: al livello ${lv} il minimo è ${MINS[lv]}.`});
    if(aces > 1) out.push({w: 'high', t: 'Ha più di una A: al massimo una per carta.'});
    if(lv === 10 && !aces) out.push({w: 'low', t: 'Al livello 10 tutte le carte hanno una A.'});
    return out;
  }
  // forma dei numeri (come i profili del bilanciamento)
  function profile(v){
    const mx = Math.max(...v), mn = Math.min(...v);
    if(mx - mn <= 2) return ['Equilibrata', 'numeri simili su tutti i lati: difficile da girare, ma non gira molto'];
    const adj = [0, 1, 2, 3].map(i=> v[i] + v[(i + 1) % 4]), best = Math.max(...adj), bi = adj.indexOf(best);
    if(best - Math.min(...adj) >= 5 && best - adj[(bi + 2) % 4] >= 5) return ['Angolo', 'due lati vicini forti: fortissima in un angolo del tavolo'];
    if(Math.abs((v[0] + v[2]) - (v[1] + v[3])) >= 5) return ['Croce', 'due lati opposti forti: va bene al centro del bordo'];
    return ['Punta', 'un lato molto forte e gli altri deboli: buona per Uguale e Più'];
  }
  // forza da 0 a 100: per ogni lato quante volte batte (o perde) contro il lato che ha di fronte nelle carte di confronto, più il suo angolo migliore
  function force(v, pool){
    if(!pool.length) return 50;
    const side = [0, 1, 2, 3].map(i=>{ const j = (i + 2) % 4; let d = 0; pool.forEach(o=>{ const x = o.v[j]; if(v[i] > x) d++; else if(v[i] < x) d--; }); return d / pool.length; });
    const avg = side.reduce((a, b)=> a + b, 0) / 4, corner = Math.max(...[0, 1, 2, 3].map(i=> (side[i] + side[(i + 1) % 4]) / 2));
    return Math.max(0, Math.min(100, Math.round(50 + 30 * avg + 20 * corner)));
  }
  const levelPool = (lv, not)=> TT.LIST.filter(c=> c.lv === lv && c.id !== not);
  // posizione nel livello: 1 = la più forte
  function levelRank(cid, v){
    const c = TT.CARD[cid], all = TT.LIST.filter(x=> x.lv === c.lv), mine = force(v, levelPool(c.lv, cid));
    const others = all.filter(x=> x.id !== cid).map(x=> force(x.v, levelPool(c.lv, x.id)));
    const vals = others.concat([mine]), mean = vals.reduce((a, b)=> a + b, 0) / vals.length, sd = Math.sqrt(vals.reduce((a, b)=> a + (b - mean) * (b - mean), 0) / vals.length) || 1;
    return {f: mine, pos: 1 + others.filter(x=> x > mine).length, n: all.length, min: Math.min(...vals), max: Math.max(...vals), z: (mine - mean) / sd};
  }
  // rispetto alla collezione dell'allenamento: quante delle tue carte batte (forza contro tutte le tue carte)
  function vsMine(cid, v){
    const S = TT.save(), ids = Object.keys(S.owned).filter(k=> S.owned[k] > 0 && TT.CARD[k] && k !== cid);
    if(ids.length < 3) return null;
    const pool = ids.map(k=> TT.CARD[k]), mine = force(v, pool), fs = ids.map(k=> force(TT.CARD[k].v, pool.filter(o=> o.id !== k)));
    return {f: mine, beats: fs.filter(x=> x < mine).length, n: ids.length};
  }

  // ---------------------------------------------------------------- studio in partita (come tools/build-triad-cards.js --balance)
  // la carta gioca con 4 compagne a caso del suo livello contro 5 carte a caso dello stesso livello: un'IA contro l'altra, 8 combinazioni di regole.
  // Una carta nella media vince il 50%; la fascia giusta è 44-56%. Se la carta è modificata, ogni partita si gioca anche con la versione ufficiale (stesse carte e stesso seme).
  function game(hA, hB, rules, seed, first, ai){
    const R = rng(seed ^ 0x9e3779b9);
    let st = Core.newGame({rules: Core.normRules(rules), seed, first, hands: [hA, hB]}), guard = 0;
    while(!st.over && guard++ < 40){ const m = Core.ai(st, ai, R); st = Core.play(st, m, {noSudden: true}).state; }
    const s = Core.score(st); return s[0] > s[1] ? 1 : s[0] < s[1] ? 0 : .5;
  }
  const cobj = c=> ({id: c.id, v: c.v.slice(), e: c.e || null});
  function shuffle(a, R){ a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  let studyTok = 0;
  function study(cid, me, onProg){
    const tok = ++studyTok, c = TT.CARD[cid], pool = levelPool(c.lv, cid).map(cobj), O = TT.ORIG[cid];
    const orig = {id: cid, v: O.v.slice(), e: O.e || null}, changed = me.v.join() !== O.v.join() || (me.e || null) !== (O.e || null);
    const N = changed ? 400 : 600, R = rng(Date.now() & 0xffffffff);
    let g = 0, w = 0, wo = 0;
    return new Promise(res=>{
      const step = ()=>{
        if(tok !== studyTok) return res(null);
        const t = performance.now();
        while(g < N && performance.now() - t < 45){
          const sh = shuffle(pool, R), a = sh.slice(0, 4), b = sh.slice(4, 9), rules = PRESETS[g % PRESETS.length], seed = Math.floor(R() * 4294967296), first = g % 2;
          w += game([me].concat(a), b, rules, seed, first, 3);
          if(changed) wo += game([orig].concat(a), b, rules, seed, first, 3);
          g++;
        }
        onProg && onProg(g / N, w / g);
        if(g < N) setTimeout(step, 0); else res({wr: w / N, wo: changed ? wo / N : null, n: N});
      };
      setTimeout(step, 30);
    });
  }
  function verdict(wr, n){
    const mg = n ? .49 / Math.sqrt(n) : 0;                      // metà del margine d'errore: appena fuori dalla fascia per caso conta ancora come equilibrata
    if(wr >= LO - mg && wr <= HI + mg) return ['ok', '🟢 Equilibrata', 'È nella fascia giusta (44-56%): forte quanto le altre del suo livello.'];
    if(wr >= .62) return ['bad', '🔴 Rotta: troppo forte', 'Vince molto più delle altre del suo livello. Togli 1 o 2 punti dal lato più alto.'];
    if(wr > HI) return ['mid', '🟠 Un po\' forte', 'Togli un punto dal lato più alto, oppure spostalo sul lato più basso.'];
    if(wr >= LO) return ['ok', '🟢 Equilibrata', 'È nella fascia giusta (44-56%): forte quanto le altre del suo livello.'];
    if(wr > .38) return ['mid', '🟠 Un po\' debole', 'Aggiungi un punto al lato più basso.'];
    return ['bad', '🔴 Troppo debole', 'Perde molto più delle altre del suo livello: alza il lato più basso o quello più alto.'];
  }
  // studio di un intero livello: tutte le carte del livello in mazzi a caso, IA veloce
  function studyLevel(lv, onProg){
    const tok = ++studyTok, pool = TT.LIST.filter(c=> c.lv === lv).map(cobj), R = rng(Date.now() & 0xffffffff), N = 1600, stat = {};
    pool.forEach(c=> stat[c.id] = [0, 0]);
    let g = 0;
    return new Promise(res=>{
      const step = ()=>{
        if(tok !== studyTok) return res(null);
        const t = performance.now();
        while(g < N && performance.now() - t < 45){
          const sh = shuffle(pool, R), a = sh.slice(0, 5), b = sh.slice(5, 10), r = game(a, b, PRESETS[g % PRESETS.length], Math.floor(R() * 4294967296), g % 2, 2);
          a.forEach(c=>{ stat[c.id][0] += r; stat[c.id][1]++; }); b.forEach(c=>{ stat[c.id][0] += 1 - r; stat[c.id][1]++; });
          g++;
        }
        onProg && onProg(g / N);
        if(g < N) setTimeout(step, 0); else res(Object.keys(stat).map(id=> ({id, wr: stat[id][1] ? stat[id][0] / stat[id][1] : .5, n: stat[id][1]})).sort((x, y)=> y.wr - x.wr));
      };
      setTimeout(step, 30);
    });
  }

  // ---------------------------------------------------------------- salvataggio delle modifiche
  function store(cid, d){
    const all = edits(), O = TT.ORIG[cid], out = {};
    if(d.v.join() !== O.v.join()) out.v = d.v.slice();
    if((d.e || null) !== (O.e || null)) out.e = d.e || '';
    if(d.n && d.n !== origName(cid)) out.n = d.n;
    if(d.gm && d.gm !== O.gm) out.gm = d.gm;
    if(Object.keys(out).length) all[cid] = out; else delete all[cid];
    LS.set(EK, all); apply(cid);
    return !!all[cid];
  }
  // rimette sulla carta in memoria i valori salvati (o gli ufficiali)
  function apply(cid){
    const c = TT.CARD[cid], O = TT.ORIG[cid], d = edits()[cid] || {};
    c.v = (d.v || O.v).slice(); c.e = 'e' in d ? (d.e || null) : O.e; c.name = d.gm || O.gm;
    TT.EDN = TT.EDN || {}; if(d.n) TT.EDN[cid] = d.n; else delete TT.EDN[cid];
  }
  function refreshCards(cid){
    $$('.ttc[data-cid="' + cid + '"]').forEach(el=>{
      if(el.closest('.tt2-modal')) return; const o = {foil: +el.dataset.fo || 0, style: el.dataset.st}; if(el.dataset.o != null) o.owner = +el.dataset.o;
      const t = document.createElement('div'); t.innerHTML = TT.cardHtml(cid, o); const n = t.firstElementChild; if(n){ n.className = el.className; el.replaceWith(n); }
    });
  }

  // ---------------------------------------------------------------- editor di una carta
  function card(cid, after){
    const c = TT.CARD[cid]; if(!c) return;
    const O = TT.ORIG[cid], d = {v: c.v.slice(), e: c.e || null, n: nameOf(cid), gm: c.name};
    let res = null, running = false;
    const m = TT.modal('<div class="ed-body"></div>', {sticky: true});
    const body = $('.ed-body', m);
    const preview = ()=>{                                        // la carta in memoria prende per un attimo i valori della bozza, poi torna com'era
      const keep = {v: c.v, e: c.e, name: c.name, n: (TT.EDN || {})[cid]};
      c.v = d.v.slice(); c.e = d.e; c.name = d.gm; TT.EDN = TT.EDN || {}; TT.EDN[cid] = d.n;
      const h = TT.cardHtml(cid, {});
      c.v = keep.v; c.e = keep.e; c.name = keep.name; if(keep.n) TT.EDN[cid] = keep.n; else delete TT.EDN[cid];
      return h;
    };
    const evalHtml = ()=>{
      const rc = ruleCheck(d.v, c.lv), pr = profile(d.v), lr = levelRank(cid, d.v), vm = vsMine(cid, d.v);
      const tag = lr.z > 1.8 ? '<b class="ed-bad">molto sopra le altre del livello</b>' : lr.z < -1.8 ? '<b class="ed-bad">molto sotto le altre del livello</b>' : lr.z > 1 ? '<b class="ed-mid">tra le più forti del livello</b>' : lr.z < -1 ? '<b class="ed-mid">tra le più deboli del livello</b>' : '<b class="ed-ok">nella media del livello</b>';
      return `<div class="tt2-box ed-eval">
        <b>📏 Regole del livello ${c.lv}</b>
        ${rc.length ? rc.map(x=> `<div class="ed-bad">⚠️ ${esc(x.t)}</div>`).join('') : `<div class="ed-ok">✔ Rispetta le regole (somma ${SUM[c.lv][0]}${SUM[c.lv][1] !== SUM[c.lv][0] ? '-' + SUM[c.lv][1] : ''}, lato più alto ${V(MAXS[c.lv])}, più basso ${MINS[c.lv]})</div>`}
        <div class="mut" style="margin-top:6px">Somma ${sumV(d.v)} · forma <b>${pr[0]}</b>: ${pr[1]}</div>
        <div style="margin-top:8px"><b>💪 Forza ${lr.f}/100</b> · ${lr.pos}ª su ${lr.n} carte del livello ${c.lv} (vanno da ${lr.min} a ${lr.max}) · ${tag}</div>
        ${vm ? `<div class="mut" style="margin-top:4px">Contro la tua collezione: più forte di ${vm.beats} delle tue ${vm.n} carte.</div>` : ''}
        <div class="ed-res">${res ? resHtml() : '<span class="mut">Per un giudizio sicuro fai lo studio in partita: la carta gioca centinaia di partite contro carte del suo livello.</span>'}</div>
        <button class="tt2-btn w" data-study style="margin-top:8px">${running ? '⏹️ Ferma lo studio' : '🔬 Studio in partita (10-30 secondi)'}</button>
      </div>`;
    };
    const resHtml = ()=>{
      const vd = verdict(res.wr, res.n);
      return `<div class="ed-${vd[0]}" style="font-size:1.05rem;margin-top:6px"><b>${vd[1]}</b> · vince il ${Math.round(res.wr * 100)}%</div><div class="mut">${vd[2]}${res.wo != null ? ` Con i numeri ufficiali vinceva il ${Math.round(res.wo * 100)}%.` : ''} (${res.n} partite, margine ±${Math.round(98 / Math.sqrt(res.n))}%)</div>`;
    };
    const draw = ()=>{
      body.innerHTML = `
        <h3 style="margin-top:0">✏️ Modifica carta</h3>
        <div class="ed-top"><div class="ed-card">${preview()}</div>
          <div class="ed-sides">${SIDES.map((s, i)=> `<div class="ed-side"><span>${s}</span><button class="tt2-btn sm" data-dn="${i}" ${d.v[i] <= 1 ? 'disabled' : ''}>−</button><b>${V(d.v[i])}</b><button class="tt2-btn sm" data-up="${i}" ${d.v[i] >= 10 ? 'disabled' : ''}>＋</button></div>`).join('')}
            <div class="mut" style="font-size:.75rem">Livello ${c.lv} (${TT.RARN[TT.rarKey(c.lv)]})${d.v.join() !== O.v.join() ? ` · ufficiale: ${O.v.map(V).join(' ')}` : ''}</div></div></div>
        <label class="ed-lbl">Nome del personaggio<input class="ed-in" data-n value="${esc(d.n)}" maxlength="40"></label>
        <label class="ed-lbl">Gioco<input class="ed-in" data-gm value="${esc(d.gm)}" maxlength="60"></label>
        <div class="ed-lbl">Potere (elemento)</div>
        <div class="tt2-strip" style="flex-wrap:wrap">${[[null, 'Nessuno', '⭕']].concat(Object.keys(TT.ELEM).map(k=> [k, TT.ELEM[k][0], TT.ELEM[k][1]])).map(x=> `<button class="tt2-chip${(d.e || null) === x[0] ? ' on' : ''}" data-e="${x[0] || ''}">${x[2]} ${x[1]}</button>`).join('')}</div>
        <div class="ed-evalw">${evalHtml()}</div>
        <p class="mut" style="font-size:.75rem">Le modifiche valgono subito sul tuo telefono (allenamento, Torre, Arena, Torneo, due giocatori). Per renderle ufficiali per tutti usa «📤 Esporta» in Bilanciamento e mandami il file.</p>
        <div class="tt2-row c" style="gap:6px"><button class="tt2-btn sm" data-img>🖼️ Cambia immagine</button><button class="tt2-btn sm" data-bal>📊 Bilanciamento</button>${edits()[cid] ? '<button class="tt2-btn sm" data-reset>↩️ Torna all\'ufficiale</button>' : ''}</div>
        <div class="tt2-row c" style="margin-top:8px"><button class="tt2-btn" data-cancel>Annulla</button><button class="tt2-btn pri" data-save>💾 Salva</button></div>`;
      wire();
    };
    const redrawEval = ()=>{ $('.ed-evalw', body).innerHTML = evalHtml(); wireStudy(); };
    const redrawCard = ()=>{ $('.ed-card', body).innerHTML = preview(); };
    const wireStudy = ()=>{
      $('[data-study]', body).addEventListener('click', async ()=>{
        TT.snd('click');
        if(running){ studyTok++; running = false; redrawEval(); return; }
        running = true; res = null; redrawEval();
        const out = await study(cid, {id: cid, v: d.v.slice(), e: d.e}, (p, wr)=>{ const r = $('.ed-res', body); if(r) r.innerHTML = `<div class="ed-bar"><i style="width:${Math.round(p * 100)}%"></i></div><span class="mut">Partite giocate: ${Math.round(p * 100)}% · per ora vince il ${Math.round(wr * 100)}%</span>`; });
        if(!m.isConnected) return;
        running = false; if(out){ res = out; TT.snd(verdict(out.wr, out.n)[0] === 'ok' ? 'coin' : 'click'); } redrawEval();
      });
    };
    const changed = ()=>{ res = null; if(running){ studyTok++; running = false; } redrawCard(); redrawEval(); };
    const wire = ()=>{
      $$('[data-up]', body).forEach(b=> b.addEventListener('click', ()=>{ const i = +b.dataset.up; d.v[i] = Math.min(10, d.v[i] + 1); TT.snd('click'); draw(); changed(); }));
      $$('[data-dn]', body).forEach(b=> b.addEventListener('click', ()=>{ const i = +b.dataset.dn; d.v[i] = Math.max(1, d.v[i] - 1); TT.snd('click'); draw(); changed(); }));
      $$('[data-e]', body).forEach(b=> b.addEventListener('click', ()=>{ d.e = b.dataset.e || null; TT.snd('click'); $$('[data-e]', body).forEach(x=> x.classList.toggle('on', x === b)); changed(); }));
      $('[data-n]', body).addEventListener('input', e=>{ d.n = e.target.value.trim() || origName(cid); redrawCard(); });
      $('[data-gm]', body).addEventListener('input', e=>{ d.gm = e.target.value.trim() || O.gm; redrawCard(); });
      wireStudy();
      $('[data-img]', body).addEventListener('click', ()=>{ if(TT.photo) TT.photo.edit(cid, {done: ()=> redrawCard()}); else TT.toast('Le immagini non sono disponibili'); });
      $('[data-bal]', body).addEventListener('click', async ()=>{ if(!await leave()) return; TT.go(balance); });
      const rs = $('[data-reset]', body); if(rs) rs.addEventListener('click', async ()=>{
        if(!await ask('Rimetto numeri, potere e nome ufficiali di questa carta?', 'Sì, rimetti', 'No')) return;
        const all = edits(); delete all[cid]; LS.set(EK, all); apply(cid); refreshCards(cid); TT.toast('Carta tornata ufficiale'); close();
      });
      $('[data-cancel]', body).addEventListener('click', ()=>{ studyTok++; close(); });
      $('[data-save]', body).addEventListener('click', async ()=>{
        const rc = ruleCheck(d.v, c.lv);
        if(rc.length && !await ask('Questa carta non rispetta le regole del suo livello:\n• ' + rc.map(x=> x.t).join('\n• ') + '\nLa salvo lo stesso?', 'Salva lo stesso', 'Correggo')) return;
        studyTok++; store(cid, d); refreshCards(cid); TT.snd('coin'); TT.toast('Carta salvata'); close();
      });
    };
    // esco senza salvare? se ci sono cambiamenti chiedo
    const dirty = ()=> d.v.join() !== c.v.join() || (d.e || null) !== (c.e || null) || d.n !== nameOf(cid) || d.gm !== c.name;
    const leave = async ()=>{ if(dirty() && !await ask('Ci sono modifiche non salvate. Le butto via?', 'Butta via', 'Resta')) return false; studyTok++; m.remove(); return true; };
    const close = ()=>{ m.remove(); after && after(); };
    draw();
  }

  // ---------------------------------------------------------------- bilanciamento di tutto il set
  function balance(){
    const all = edits(), ids = Object.keys(all).filter(k=> TT.CARD[k]);
    const lvs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(lv=>{
      const cs = TT.LIST.filter(c=> c.lv === lv), fs = cs.map(c=> ({c, f: force(c.v, levelPool(lv, c.id))}));
      const mean = fs.reduce((a, x)=> a + x.f, 0) / (fs.length || 1), sd = Math.sqrt(fs.reduce((a, x)=> a + (x.f - mean) * (x.f - mean), 0) / (fs.length || 1)) || 1;
      return {lv, n: cs.length, avg: cs.reduce((a, c)=> a + sumV(c.v), 0) / (cs.length || 1), bad: cs.filter(c=> ruleCheck(c.v, lv).length), ed: cs.filter(c=> all[c.id]).length, out: fs.filter(x=> Math.abs(x.f - mean) / sd > 1.8).map(x=> ({c: x.c, hi: x.f > mean, f: x.f}))};
    });
    const sideT = [0, 1, 2, 3].map(i=> TT.LIST.reduce((a, c)=> a + c.v[i], 0)), sideM = sideT.reduce((a, b)=> a + b, 0) / 4;
    const elC = {}; TT.LIST.forEach(c=>{ const k = c.e || ''; elC[k] = (elC[k] || 0) + 1; });
    const bad = lvs.reduce((a, l)=> a.concat(l.bad), []), outs = lvs.reduce((a, l)=> a.concat(l.out), []);
    const row = (c, extra)=> `<button class="tt2-item" data-c="${c.id}"><div class="tx"><b>${esc(nameOf(c.id))}</b><small>Livello ${c.lv} · ${c.v.map(V).join(' ')} · somma ${sumV(c.v)}${c.e ? ' · ' + TT.ELEM[c.e][1] : ''}</small>${extra ? `<small style="display:block">${extra}</small>` : ''}</div><div class="rt">✏️</div></button>`;
    TT.screen('Bilanciamento', `
      <p class="mut" style="text-align:center">Lo stato di tutte le ${TT.LIST.length} carte, con le tue modifiche. Tocca una carta per modificarla.</p>
      <div class="tt2-box"><b>Per livello</b>
        <div class="ed-tab"><span>Liv.</span><span>Carte</span><span>Somma media</span><span>Fuori regola</span><span>Modificate</span>${lvs.map(l=> `<span>${l.lv}</span><span>${l.n}</span><span>${l.avg.toFixed(1)} <small class="mut">(${SUM[l.lv][0]}${SUM[l.lv][1] !== SUM[l.lv][0] ? '-' + SUM[l.lv][1] : ''})</small></span><span class="${l.bad.length ? 'ed-bad' : 'ed-ok'}">${l.bad.length || '✔'}</span><span>${l.ed || '-'}</span>`).join('')}</div>
      </div>
      <div class="tt2-box"><b>Lati</b> <small class="mut">(somma di tutti i numeri per direzione: devono essere simili)</small>
        <div class="tt2-row" style="gap:12px;margin-top:6px">${SIDES.map((s, i)=>{ const p = (sideT[i] / sideM - 1) * 100; return `<span>${s}: <b class="${Math.abs(p) > 4 ? 'ed-mid' : 'ed-ok'}">${sideT[i]}</b> <small class="mut">(${p >= 0 ? '+' : ''}${p.toFixed(1)}%)</small></span>`; }).join('')}</div>
        <div class="tt2-row" style="gap:10px;margin-top:6px">${Object.keys(elC).sort().map(k=> `<span>${k ? TT.ELEM[k][1] + ' ' + TT.ELEM[k][0] : '⭕ Nessuno'}: <b>${elC[k]}</b></span>`).join('')}</div>
      </div>
      <div class="tt2-box"><b>🔬 Studio di un livello</b> <small class="mut">(tutte le carte del livello giocano tra loro: la fascia giusta è 44-56%)</small>
        <div class="tt2-strip" style="flex-wrap:wrap;margin-top:6px">${lvs.map(l=> `<button class="tt2-chip" data-lv="${l.lv}">Livello ${l.lv}</button>`).join('')}</div>
        <div id="edLv"></div>
      </div>
      ${bad.length ? `<h3>⚠️ Fuori dalle regole del livello (${bad.length})</h3><div class="tt2-list">${bad.map(c=> row(c, ruleCheck(c.v, c.lv).map(x=> esc(x.t)).join(' '))).join('')}</div>` : ''}
      ${outs.length ? `<h3>👀 Da guardare (${outs.length})</h3><p class="mut">Molto più forti o più deboli delle altre del loro livello, a colpo d'occhio. Lo studio in partita dà il giudizio sicuro.</p><div class="tt2-list">${outs.map(o=> row(o.c, o.hi ? '⬆️ forza ' + o.f + ': più forte delle altre' : '⬇️ forza ' + o.f + ': più debole delle altre')).join('')}</div>` : ''}
      <h3>✏️ Le tue modifiche (${ids.length})</h3>
      ${ids.length ? `<div class="tt2-list">${ids.map(k=>{ const d = all[k], O = TT.ORIG[k], ch = []; if(d.v) ch.push('numeri ' + O.v.map(V).join(' ') + ' → ' + d.v.map(V).join(' ')); if('e' in d) ch.push('potere ' + (O.e ? TT.ELEM[O.e][0] : 'nessuno') + ' → ' + (d.e ? TT.ELEM[d.e][0] : 'nessuno')); if(d.n) ch.push('nome ' + origName(k) + ' → ' + d.n); if(d.gm) ch.push('gioco ' + O.gm + ' → ' + d.gm); return row(TT.CARD[k], esc(ch.join(' · '))); }).join('')}</div>` : '<p class="mut">Nessuna carta modificata. Apri una carta dall\'album e tocca «✏️ Modifica carta».</p>'}
      <div class="tt2-row c" style="margin-top:10px;gap:6px"><button class="tt2-btn pri" id="edExp" ${ids.length ? '' : 'disabled'}>📤 Esporta</button><button class="tt2-btn" id="edImp">📥 Importa</button>${ids.length ? '<button class="tt2-btn" id="edClr">↩️ Togli tutte</button>' : ''}</div>
      <input type="file" accept="application/json,.json" id="edFile" style="display:none">`);
    $$('[data-c]').forEach(b=> b.addEventListener('click', ()=>{ TT.snd('click'); card(b.dataset.c, ()=> TT.replaceTop ? TT.replaceTop(balance) : balance()); }));
    $$('[data-lv]').forEach(b=> b.addEventListener('click', async ()=>{
      TT.snd('click'); $$('[data-lv]').forEach(x=> x.classList.toggle('on', x === b));
      const box = $('#edLv'), lv = +b.dataset.lv;
      box.innerHTML = '<div class="ed-bar" style="margin-top:8px"><i style="width:0"></i></div><span class="mut">Studio del livello ' + lv + '…</span>';
      const out = await studyLevel(lv, p=>{ const i = $('#edLv .ed-bar i'); if(i) i.style.width = Math.round(p * 100) + '%'; });
      if(!out || !box.isConnected) return;
      const off = out.filter(x=> x.wr > HI || x.wr < LO).length;
      box.innerHTML = `<p class="${off ? 'ed-mid' : 'ed-ok'}" style="margin:8px 0 4px">${off ? off + ' carte fuori dalla fascia 44-56%' : '✔ Tutte le carte nella fascia giusta'} <small class="mut">(margine ±${Math.round(98 / Math.sqrt(out[0].n))}%)</small></p><div class="tt2-list">${out.map(x=>{ const c = TT.CARD[x.id], cl = x.wr > HI || x.wr < LO ? (x.wr >= .62 || x.wr <= .38 ? 'ed-bad' : 'ed-mid') : 'ed-ok'; return `<button class="tt2-item" data-c="${x.id}"><div class="tx"><b>${esc(nameOf(x.id))}</b><small>${c.v.map(V).join(' ')}${all[x.id] ? ' · ✏️ modificata' : ''}</small></div><div class="rt ${cl}">${Math.round(x.wr * 100)}%</div></button>`; }).join('')}</div>`;
      $$('#edLv [data-c]').forEach(e=> e.addEventListener('click', ()=>{ TT.snd('click'); card(e.dataset.c, ()=> TT.replaceTop ? TT.replaceTop(balance) : balance()); }));
    }));
    const ex = $('#edExp'); if(ex) ex.addEventListener('click', ()=> exportEdits());
    $('#edImp').addEventListener('click', ()=> $('#edFile').click());
    $('#edFile').addEventListener('change', e=>{ const f = e.target.files && e.target.files[0]; if(f) importEdits(f); });
    const cl = $('#edClr'); if(cl) cl.addEventListener('click', async ()=>{
      if(!await ask('Rimetto tutte le carte come quelle ufficiali?', 'Sì, tutte', 'No')) return;
      const k = Object.keys(edits()); LS.set(EK, {}); k.forEach(id=>{ if(TT.CARD[id]) apply(id); }); TT.toast('Tutte le carte sono tornate ufficiali'); TT.replaceTop ? TT.replaceTop(balance) : balance();
    });
  }
  function exportEdits(){
    const all = edits(), out = {app: 'raccoon-triad', kind: 'card-edits', build: (document.querySelector('meta[name="build"]') || {}).content || '', date: new Date().toISOString(), cards: {}};
    Object.keys(all).forEach(k=>{ if(!TT.CARD[k]) return; const O = TT.ORIG[k]; out.cards[k] = Object.assign({lv: TT.CARD[k].lv, ufficiale: {v: O.v, e: O.e || '', n: origName(k), gm: O.gm}}, all[k]); });
    const txt = JSON.stringify(out, null, 1);
    try{ const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], {type: 'application/json'})); a.download = 'carte-modificate-' + out.date.slice(0, 10) + '.json'; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 2000); }catch(e){}
    try{ navigator.clipboard && navigator.clipboard.writeText(txt).catch(()=>{}); }catch(e){}
    TT.toast('File salvato (e copiato negli appunti)', 3500);
  }
  function importEdits(f){
    const rd = new FileReader();
    rd.onload = ()=>{
      try{
        const j = JSON.parse(rd.result), src = j.cards || j, all = edits(); let n = 0;
        Object.keys(src).forEach(k=>{
          if(!TT.CARD[k]) return; const d = src[k], o = {};
          if(Array.isArray(d.v) && d.v.length === 4 && d.v.every(x=> Number.isInteger(x) && x >= 1 && x <= 10)) o.v = d.v.slice();
          if('e' in d && (d.e === '' || d.e === null || TT.ELEM[d.e])) o.e = d.e || '';
          if(typeof d.n === 'string' && d.n.trim()) o.n = d.n.trim().slice(0, 40);
          if(typeof d.gm === 'string' && d.gm.trim()) o.gm = d.gm.trim().slice(0, 60);
          if(Object.keys(o).length){ all[k] = o; n++; }
        });
        LS.set(EK, all); Object.keys(all).forEach(k=> apply(k));
        TT.toast(n ? 'Importate ' + n + ' carte' : 'Nel file non trovo carte modificate'); TT.replaceTop ? TT.replaceTop(balance) : balance();
      }catch(e){ TT.toast('Questo file non è valido'); }
    };
    rd.readAsText(f);
  }

  // ---------------------------------------------------------------- dorso delle carte: uno di quelli del gioco o una tua immagine (solo sul telefono)
  function back(){
    const C = window.TRIAD_COSM, items = C ? C.ITEMS.filter(i=> i.kind === 'b') : [], P = TT.P; P.cosm = P.cosm || {};
    const cur = P.cosm.b || 'b_classic', img = LS.get(BK, null);
    const m = TT.modal(`<h3 style="margin-top:0">🂠 Retro delle carte</h3><p class="mut" style="margin-top:0">Lo vedi sulle carte coperte dell'avversario.</p>
      <div class="ed-bks">${items.map(it=> `<button class="${cur === it.id ? 'on' : ''}" data-bk-id="${it.id}"><div class="ed-bk" data-bk="${it.id}"></div><small>${esc(it.name)}</small></button>`).join('')}
        ${img ? `<button class="${cur === 'custom' ? 'on' : ''}" data-bk-id="custom"><div class="ed-bk" style="--bk:center/cover no-repeat url('${img}');--bki:''"></div><small>La mia immagine</small></button>` : ''}</div>
      <div class="tt2-row c" style="margin-top:10px;gap:6px"><button class="tt2-btn" data-own>🖼️ ${img ? 'Cambia la mia immagine' : 'Metti una mia immagine'}</button>${img ? '<button class="tt2-btn sm" data-del>🗑️ Togli la mia</button>' : ''}<button class="tt2-btn pri" data-mclose>Fatto</button></div>`, {center: true});
    const set = id=>{ if(id && id !== 'b_classic') P.cosm.b = id; else delete P.cosm.b; TT.saveP(); TT.applyBack(P.cosm); };
    $$('[data-bk-id]', m).forEach(b=> b.addEventListener('click', ()=>{ TT.snd('click'); set(b.dataset.bkId); $$('[data-bk-id]', m).forEach(x=> x.classList.toggle('on', x === b)); }));
    $('[data-own]', m).addEventListener('click', ()=>{
      if(!TT.photo){ TT.toast('Le immagini non sono disponibili'); return; }
      TT.photo.edit('__back', {card: {name: '', year: '', plat: ''}, title: 'Retro delle carte', queries: [['🔎 Retro di carte', 'card back design art'], ['🌌 Sfondo', 'fantasy art wallpaper vertical'], ['🦝 Procione', 'raccoon art wallpaper']],
        saveTo: async cv=>{
          const t = document.createElement('canvas'); t.width = 300; t.height = 420; t.getContext('2d').drawImage(cv, 0, 0, 300, 420);
          const url = t.toDataURL('image/jpeg', .82); LS.set(BK, url);
          if(LS.get(BK, null) !== url) throw new Error('spazio');
          set('custom'); TT.toast('Retro messo'); m.remove(); back();
        }});
    });
    const dl = $('[data-del]', m); if(dl) dl.addEventListener('click', ()=>{ LS.set(BK, null); if(P.cosm.b === 'custom') set(null); m.remove(); back(); });
  }

  TT.edit = {card, balance, back, study, force, ruleCheck, store, apply};
})();
