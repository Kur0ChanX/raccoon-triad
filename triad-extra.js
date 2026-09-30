// ---- Raccoon Triad: cosmetici (dorsi, cornici, titoli), replay delle partite e Torneo. Caricato da triad.js solo quando serve (TT.openExtra). ----
(function(){
  'use strict';
  const TT = window.TT; if(!TT || TT.extraLoaded) return; TT.extraLoaded = true;
  const {P, LS, $, $$, esc, sleep, cardHtml} = TT;
  const Core = window.TriadCore, COSM = window.TRIAD_COSM || {ITEMS: [], get: ()=> null, have: ()=> false, prog: ()=> 0, KINDS: {}, DEFAULT: {}};
  const AK = 'jrpg_triad_acct', SVK = 'jrpg_triad_server', TN_KEY = 'jrpg_triad_tourn', RP_KEY = 'jrpg_triad_replays', TW_KEY = 'jrpg_triad_tower';
  const pickOf = a=> a[Math.floor(Math.random() * a.length)];
  const hasAcct = ()=> !!(LS.get(AK, null) && (LS.get(SVK, '') || window.TRIAD_SERVER));
  TT.extra = {};

  // =====================================================================================================
  // RECORD LOCALI (Torre e Tornei si giocano solo sul telefono) e collegamento con l'account online
  // =====================================================================================================
  const tnLoad = ()=> Object.assign({wins: 0, runs: 0, cups: {}, run: null}, LS.get(TN_KEY, {}) || {});
  const tnSave = T=> LS.set(TN_KEY, T);
  function localStats(){
    const S = TT.save(), st = S.stats || {}, ids = TT.ownedIds(), tw = LS.get(TW_KEY, {}) || {}, tn = tnLoad();
    return {wins: st.w || 0, streak: st.best || 0, games: (st.w || 0) + (st.l || 0) + (st.d || 0), uniq: ids.length,
      legend: ids.some(id=> TT.CARD[id].lv >= 9) ? 1 : 0, mythic: ids.some(id=> TT.CARD[id].lv === 10) ? 1 : 0, tower: tw.best || 0, tourn: tn.wins || 0};
  }
  const LOCAL_STATS = ['wins', 'streak', 'games', 'uniq', 'legend', 'mythic', 'tower', 'tourn'];
  // comunica al server i record della Torre e dei Tornei: servono solo a sbloccare cosmetici (niente monete né carte)
  TT.cosmReport = async function(){
    if(!hasAcct()) return null;
    try{ await TT.loadJS('triad-online.js'); const l = localStats(); return await TT.api('POST', '/api/cosmetics/report', {tower: l.tower, tourn: l.tourn}, {quiet: true}); }catch(e){ return null; }
  };

  // =====================================================================================================
  // COSMETICI
  // =====================================================================================================
  async function cosmPage(tab){
    tab = tab || TT.extra.cosmTab || 'b';
    let online = hasAcct(), data = null, note = '';
    TT.loading('Carico i cosmetici…');
    if(online){
      try{ await TT.loadJS('triad-online.js'); await TT.cosmReport(); data = await TT.api('GET', '/api/cosmetics'); }
      catch(e){ online = false; note = 'Il server non risponde: vedi i cosmetici di questo telefono.'; }
    }
    const local = ()=>{ const st = localStats(); return COSM.ITEMS.map(it=> Object.assign({}, it, {owned: it.free || COSM.have(it, st), prog: COSM.prog(it, st), onlineOnly: !!it.price || (it.stat && LOCAL_STATS.indexOf(it.stat) < 0)})); };
    const items = ()=> online ? data.items.map(it=> Object.assign({}, COSM.get(it.id) || {}, it)) : local();
    const eq = ()=> online ? data.equipped : (P.cosm = P.cosm || {});
    const draw = ()=>{
      TT.extra.cosmTab = tab;
      const e = eq(), all = items(), cur = k=> e[k] || COSM.DEFAULT[k] || null, ttl = COSM.get(e.t);
      const mine = k=> all.find(i=> i.id === cur(k));
      const list = all.filter(i=> i.kind === tab);
      const tile = it=>{
        const on = cur(tab) === it.id, pv = tab === 'b' ? `<div class="bk-prev" data-bk="${it.id}"></div>` : tab === 'f' ? `<div class="av${it.id === 'f_base' ? '' : ' fr-' + it.id}">🦝</div>` : `<span class="tt">${esc(it.name)}</span>`;
        const how = it.owned ? '' : (it.price && !it.stat ? '🪙 ' + it.price : it.stat ? (it.onlineOnly ? '🌐 ' : '🔒 ') + it.how + (it.target > 1 ? ` (${it.prog}/${it.target})` : '') : it.how);
        return `<button class="cs-item${on ? ' on' : ''}${it.owned ? '' : ' lock'}" data-c="${it.id}">${on ? '<span class="ck">✔️</span>' : ''}<div class="pv">${pv}</div><b>${tab === 't' ? '' : esc(it.name)}</b>${it.owned ? '' : `<small>${esc(how)}</small>`}</button>`;
      };
      const none = tab === 't' ? `<button class="cs-item${!e.t ? ' on' : ''}" data-c="" ><div class="pv"><span class="tt" style="opacity:.6">Nessun titolo</span></div>${!e.t ? '<span class="ck">✔️</span>' : ''}</button>` : '';
      TT.screen('Cosmetici', `
        <div class="cs-mode">${online ? '🌐 Account online · li vedono anche gli altri giocatori' : '📱 Solo su questo telefono' + (note ? ' · ' + esc(note) : '') + '<br>Con un account online li vedono anche gli amici e se ne sbloccano di più.'}</div>
        ${online ? `<div class="tt2-cur"><span class="c">🪙 ${data.coins}</span></div>` : ''}
        <div class="cs-look"><div class="bk-prev" data-bk="${cur('b')}"></div><div class="av${TT.csFrame(e)}">🦝</div><div><b>Tu</b><div class="mut">${ttl ? esc(ttl.name) : 'Nessun titolo'}</div></div></div>
        <div class="cs-tabs">${['b', 'f', 't'].map(k=> `<button class="tt2-btn sm${tab === k ? ' pri' : ''}" data-t="${k}">${COSM.KINDS[k]}</button>`).join('')}</div>
        <div class="cs-grid">${none}${list.map(tile).join('')}</div>`);
      $$('[data-t]').forEach(b=> b.addEventListener('click', ()=>{ tab = b.dataset.t; TT.snd('click'); draw(); }));
      $$('[data-c]').forEach(b=> b.addEventListener('click', ()=> pick(b.dataset.c)));
    };
    const equip = async (k, id)=>{
      try{
        if(online){ data = await TT.api('POST', '/api/cosmetics/equip', {[k]: id}); TT.applyBack(data.equipped); }
        else { P.cosm = P.cosm || {}; if(id) P.cosm[k] = id; else delete P.cosm[k]; TT.saveP(); TT.applyBack(P.cosm); }
        TT.snd('coin'); draw();
      }catch(e){ TT.toast(e && e.message || 'Non riesco a metterlo'); }
    };
    const pick = async id=>{
      if(!id){ return equip('t', null); }
      const it = items().find(i=> i.id === id); if(!it) return;
      if(it.owned){ const same = (eq()[it.kind] || COSM.DEFAULT[it.kind] || null) === it.id; return equip(it.kind, same || it.id === COSM.DEFAULT[it.kind] ? null : it.id); }
      if(online && it.price && !it.stat){
        if(await TT.ask(`Comprare «${esc(it.name)}» per 🪙 ${it.price}?<br><small>Hai ${data.coins} monete.</small>`, 'Compra', 'No')){
          try{ data = await TT.api('POST', '/api/cosmetics/buy', {id}); TT.snd('coin'); await equip(it.kind, id); }catch(e){ TT.toast(e && e.message || 'Acquisto non riuscito'); }
        }
        return;
      }
      TT.modal(`<div style="text-align:center"><h3 style="margin-top:0">${esc(it.name)}</h3><p>${esc(it.how)}</p>${it.stat && it.target > 1 ? `<p class="mut">Ci sei a ${it.prog} su ${it.target}</p>` : ''}${!online && it.onlineOnly ? '<p class="mut">Si ottiene con l\'account online.</p>' : ''}<button class="tt2-btn pri" data-mclose>Ok</button></div>`, {center: true});
    };
    draw();
  }
  TT.extra.cosm = cosmPage;

  // =====================================================================================================
  // REPLAY
  // =====================================================================================================
  const KIND_EM = {npc: '🤖', hot: '👥', cup: '🏆', tower: '🗼', online: '🌐'};
  const fmtDate = t=>{ try{ return new Date(t).toLocaleDateString('it-IT', {day: 'numeric', month: 'short'}) + ' ' + new Date(t).toLocaleTimeString('it-IT', {hour: '2-digit', minute: '2-digit'}); }catch(e){ return ''; } };
  const entryFromView = v=>{
    const st = v.state, hands0 = st.stake.map(h=> h.map(id=> TT.cobj(id)));
    return {id: v.id, t: 0, kind: 'online', title: v.boss ? 'Custode ' + v.players[1].nick : (v.mode === 'ranked' ? 'Sfida vera' : 'Amichevole'), you: v.you, foil: v.foil || null,
      names: v.players.map(p=> ({nick: p.nick, av: p.boss ? '👑' : (TT.avOf ? TT.avOf(p.id) : '🙂'), cs: p.cs || null})), rec: Core.recOf(st, hands0), win: st.result ? st.result.winner : null, sc: st.result ? st.result.score : null};
  };
  TT.extra.entryFromView = entryFromView;
  async function replayPage(){
    const local = LS.get(RP_KEY, []) || [];
    let online = [];
    const draw = ()=>{
      const row = (e, i, src)=> `<button class="tt2-item rp-row" data-${src}="${i}"><div class="av">${KIND_EM[e.kind] || '🎞️'}</div><div class="tx"><b>${esc(e.title || 'Partita')}</b><small>${esc(e.names.map(n=> n.nick).join(' vs '))}${e.t ? ' · ' + fmtDate(e.t) : ''}</small></div><div class="rs">${e.sc ? e.sc[0] + '–' + e.sc[1] : ''}</div></button>`;
      TT.screen('Replay', `<p class="mut" style="text-align:center">Rivedi le tue ultime partite mossa per mossa. Si conservano le ultime 12 giocate sul telefono e le ultime 20 online.</p>
        <h3>Su questo telefono</h3><div class="tt2-list">${local.length ? local.map((e, i)=> row(e, i, 'l')).join('') : '<p class="mut">Ancora nessuna partita: gioca contro l\'IA, nella Torre o al Torneo.</p>'}</div>
        ${hasAcct() ? `<h3>Online</h3><div class="tt2-list" id="rpOn">${online.length ? online.map((e, i)=> row(e, i, 'o')).join('') : '<p class="mut">Carico…</p>'}</div>` : ''}`);
      $$('[data-l]').forEach(b=> b.addEventListener('click', ()=>{ TT.snd('click'); replayView(local[+b.dataset.l], {back: ()=> TT.go(replayPage)}); }));
      $$('[data-o]').forEach(b=> b.addEventListener('click', async ()=>{
        TT.snd('click'); const m = online[+b.dataset.o];
        try{ const r = await TT.api('GET', '/api/match/' + m.id); if(!r.match.state.over) return TT.toast('La partita non è ancora finita'); replayView(entryFromView(r.match), {back: ()=> TT.go(replayPage)}); }catch(e){ TT.toast(e && e.message || 'Non riesco ad aprirla'); }
      }));
    };
    draw();
    if(hasAcct()){
      try{
        await TT.loadJS('triad-online.js');
        const r = await TT.api('GET', '/api/matches', null, {quiet: true});
        online = r.matches.filter(m=> m.status === 'done' || m.status === 'picking').map(m=> ({id: m.id, kind: 'online', title: m.boss ? 'Custode ' + m.players[1].nick : (m.mode === 'ranked' ? 'Sfida vera' : 'Amichevole'), t: m.created, names: m.players.map(p=> ({nick: p.nick})), sc: m.score}));
        if(TT.root() && $('#rpOn')) draw();
      }catch(e){ const el = $('#rpOn'); if(el) el.innerHTML = '<p class="mut">Non riesco a leggere le partite online.</p>'; }
    }
  }
  TT.extra.replay = replayPage;

  // il visore: rigioca la registrazione con lo stesso tavolo, avanti e indietro. entry = {title, names, rec, foil, you, win, sc}; o = {back}
  function replayView(entry, o){
    o = o || {};
    const rp = Core.replay(entry.rec); if(!rp.ok){ TT.toast('Questo replay non è valido'); return o.back && o.back(); }
    const F = rp.frames, N = F.length - 1, you = entry.you || 0, R = TT.ensureRoot();
    let i = 0, playing = false, busy = false, tok = 0, spd = 1, board = null;
    const foil = u=> (entry.foil && entry.foil[Math.floor(u / 5)] && entry.foil[Math.floor(u / 5)][u % 5]) | 0;
    board = TT.mountBoard({state: F[0].state, me: you, names: entry.names.map((n, k)=> Object.assign({sub: k === 0 ? 'Blu' : 'Rosso'}, n)), title: '🎞️ ' + (entry.title || 'Replay'), hidden: ()=> false, foil, canPlay: ()=> false, extraH: 78,
      quit: ()=>{ tok++; playing = false; board.destroy(); (o.back || TT.back)(); }});
    const bar = document.createElement('div'); bar.className = 'tt2-rp-wrap';
    bar.innerHTML = `<div class="tt2-rp"><button class="tt2-ib" data-r="first" aria-label="Inizio">⏮</button><button class="tt2-ib" data-r="prev" aria-label="Mossa indietro">◀</button><button class="tt2-ib" data-r="play" aria-label="Avvia">▶</button><button class="tt2-ib" data-r="next" aria-label="Mossa avanti">▶︎|</button><button class="tt2-ib" data-r="last" aria-label="Fine">⏭</button><span class="n" id="rpN"></span><button class="tt2-ib" data-r="spd" aria-label="Velocità" style="width:auto;padding:0 8px;font-size:.75rem">1×</button></div><div class="tt2-rp"><input type="range" id="rpS" min="0" max="${N}" value="0" aria-label="Mossa"></div>`;
    $('#ttPlay', R).appendChild(bar);
    const upd = ()=>{
      $('#rpN', R).textContent = i >= N ? 'Fine' : 'Mossa ' + i + '/' + N; $('#rpS', R).value = i;
      $('[data-r="play"]', R).textContent = playing ? '⏸' : '▶';
      $('[data-r="first"]', R).disabled = $('[data-r="prev"]', R).disabled = i === 0; $('[data-r="next"]', R).disabled = $('[data-r="last"]', R).disabled = i >= N;
      const t = $('#ttInfo', R); if(t && i >= N){ const w = entry.win != null ? entry.win : (F[N].state.result || {}).winner, sc = entry.sc || (F[N].state.result || {}).score || [0, 0]; t.textContent = (w == null ? 'Pareggio' : 'Vince ' + ((entry.names[w] || {}).nick || '?')) + ' · ' + sc[0] + ' a ' + sc[1]; }
    };
    const goTo = async (k, anim)=>{
      while(busy) await sleep(25);
      k = Math.max(0, Math.min(N, k)); if(k === i) return; busy = true;
      try{ if(anim && k === i + 1) await board.apply(F[k].state, F[k].events); else board.setState(F[k].state); }catch(e){}
      i = k; busy = false; upd();
    };
    const pause = ()=>{ tok++; playing = false; upd(); };
    const start = async ()=>{
      if(playing) return; if(i >= N) await goTo(0);
      playing = true; const my = ++tok; upd();
      while(playing && my === tok && i < N){ await goTo(i + 1, true); if(my !== tok) return; await sleep(P.fast ? 100 : 550 / spd); }
      if(my === tok){ playing = false; upd(); }
    };
    $$('[data-r]', R).forEach(b=> b.addEventListener('click', ()=>{
      const a = b.dataset.r; TT.snd('click');
      if(a === 'play'){ if(playing) pause(); else start(); return; }
      if(a === 'spd'){ spd = spd === 1 ? 2 : spd === 2 ? 4 : 1; b.textContent = spd + '×'; return; }
      pause(); goTo(a === 'first' ? 0 : a === 'last' ? N : a === 'prev' ? i - 1 : i + 1, a === 'next');
    }));
    $('#rpS', R).addEventListener('input', e=>{ pause(); goTo(+e.target.value); });
    upd(); setTimeout(start, 500);
  }
  TT.extra.replayView = replayView;

  // =====================================================================================================
  // TORNEO (offline): 8 partecipanti, quarti-semifinali-finale a eliminazione diretta. Tre coppe da sbloccare una dopo l'altra.
  // Il mazzo (5 carte) è lo stesso per tutto il torneo e nessuna carta è in palio: ti giochi solo i premi e il trofeo.
  // =====================================================================================================
  const CUPS = [
    {id: 'bronzo', n: 'Coppa di Bronzo', em: '🥉', ai: [1, 2, 3], lv: [1, 5], cap: 20, from: 0, need: null, rules: [{}, {elemental: true}, {same: true}, {elemental: true, same: true}]},
    {id: 'argento', n: 'Coppa d\'Argento', em: '🥈', ai: [2, 3, 4], lv: [3, 7], cap: 30, from: 2, need: 'bronzo', rules: [{elemental: true, same: true, plus: true}, {same: true, plus: true, combo: true}, {elemental: true, same: true, sameWall: true, combo: true}]},
    {id: 'oro', n: 'Coppa d\'Oro', em: '🥇', ai: [3, 4, 5], lv: [5, 10], cap: 0, from: 4, need: 'argento', rules: [{elemental: true, same: true, sameWall: true, plus: true, combo: true}, {special: true, elemental: true, same: true, plus: true, combo: true}]}
  ];
  const ROUNDS = ['Quarti di finale', 'Semifinale', 'Finale'];
  const cupOf = id=> CUPS.find(c=> c.id === id);
  const localItems = ()=>{ const S = TT.save(), out = []; Object.keys(S.owned).forEach(cid=>{ if(TT.CARD[cid]) for(let i = 0; i < S.owned[cid]; i++) out.push({key: cid + '#' + i, cid}); }); return out; };
  // il mazzo dell'avversario diventa più forte a ogni turno
  function tnDeck(cup, round){
    const lo = cup.lv[0], hi = cup.lv[1], avg = lo + (hi - lo) * (round + .4) / 2.4, deck = []; let guard = 0;
    while(deck.length < 5 && guard++ < 120){ const lv = Math.max(1, Math.min(10, Math.round(avg + (Math.random() * 2.2 - 1.1)))), c = pickOf(TT.BASE.filter(x=> x.lv === lv)); if(c && !deck.includes(c.id)) deck.push(c.id); }
    return deck;
  }
  const simWin = (a, b)=> Math.random() < Math.max(.15, Math.min(.85, .5 + .13 * (a.ai - b.ai) + (Math.random() * .2 - .1)));
  function tnStart(cup, deck){
    const pool = TT.NPC.slice(cup.from, cup.from + 8).sort(()=> Math.random() - .5).slice(0, 7);
    const parts = [{n: 'Tu', face: '🦝', ai: 0, me: true, r: ''}].concat(pool.map(n=> ({n: n.n, face: n.face, ai: n.ai, r: n.r})));
    const order = parts.map((_, i)=> i).sort(()=> Math.random() - .5), rounds = [[], [], []];
    for(let j = 0; j < 4; j++) rounds[0].push({a: order[2 * j], b: order[2 * j + 1], w: null});
    rounds[1] = [{a: null, b: null, w: null}, {a: null, b: null, w: null}]; rounds[2] = [{a: null, b: null, w: null}];
    return {cup: cup.id, rules: pickOf(cup.rules), deck, parts, rounds, round: 0, won: 0, t: Date.now()};
  }
  const myMatch = run=> { const ms = run.rounds[run.round]; return ms.findIndex(m=> m.a === 0 || m.b === 0); };
  // chiude il turno: gioco io o simulo gli altri; ritorna true se il torneo continua
  function tnAdvance(run, iWon){
    const ms = run.rounds[run.round], mi = myMatch(run);
    ms.forEach((m, j)=>{ m.w = j === mi ? (iWon ? 0 : (m.a === 0 ? m.b : m.a)) : (simWin(run.parts[m.a], run.parts[m.b]) ? m.a : m.b); });
    if(run.round < 2) ms.forEach((m, j)=>{ const nx = run.rounds[run.round + 1][Math.floor(j / 2)]; if(j % 2 === 0) nx.a = m.w; else nx.b = m.w; });
    if(iWon){ run.won++; if(run.round < 2){ run.round++; return true; } }
    return false;
  }
  function tnCards(cup, won){
    const n = [1, 1, 2, 3][won], out = [], lo = cup.lv[0], hi = cup.lv[1];
    for(let k = 0; k < n; k++){ const lv = Math.max(1, Math.min(10, Math.round(lo + (hi - lo) * won / 3 + (k === 0 && won === 3 ? 1 : 0) + (Math.random() * 2 - 1)))), c = pickOf(TT.BASE.filter(x=> x.lv === lv)); if(c) out.push(c.id); }
    return out;
  }
  function tnBracket(run){
    const P0 = run.parts, mi = myMatch(run), slot = (i, m)=> i == null ? '<div class="tn-p"><span class="mut">…</span></div>' : `<div class="tn-p${i === 0 ? ' me' : ''}${m.w != null ? (m.w === i ? ' w' : ' l') : ''}">${P0[i].face} ${esc(P0[i].n)}</div>`;
    return `<div class="tn-br">${[0, 1, 2].map(r=> `<div><div class="tn-h">${['Quarti', 'Semi', 'Finale'][r]}</div><div class="tn-col">${run.rounds[r].map((m, j)=> `<div class="tn-m${r === run.round && j === mi ? ' cur' : ''}">${slot(m.a, m)}${slot(m.b, m)}</div>`).join('')}</div></div>`).join('')}</div>`;
  }
  function tournPage(){
    const T = tnLoad();
    if(T.run){ return tournHub(); }
    const chips = CUPS.map(c=> (T.cups[c.id] ? `<span class="tt2-chip">${c.em} ×${T.cups[c.id]}</span>` : '')).join('');
    TT.screen('Torneo', `<div class="tt2-tower-hd"><div style="font-size:2.6rem">🏆</div><div class="fl">${T.wins}</div><div class="mut">tornei vinti · ${T.runs} giocati</div>${chips ? `<div class="tt2-row c" style="margin-top:6px">${chips}</div>` : ''}</div>
      <p>Scegli una coppa, poi <b>5 carte</b>: le userai per <b>tutto il torneo</b>. Otto sfidanti, tre turni a eliminazione diretta (quarti, semifinale, finale). Non rischi nessuna carta e ne vinci di nuove: più vai avanti, più sono forti. Chi vince il torneo si prende il <b>trofeo</b>, con titoli e cosmetici in regalo.</p>
      <div class="tn-cup">${CUPS.map(c=>{ const lock = c.need && !T.cups[c.need]; return `<button class="tt2-item${lock ? ' lock' : ''}" data-cup="${c.id}"><div class="av">${c.em}</div><div class="tx"><b>${c.n}</b><small>${lock ? '🔒 Vinci la ' + cupOf(c.need).n : 'IA ' + c.ai[0] + '–' + c.ai[2] + ' · carte fino al livello ' + c.lv[1] + (c.cap ? ' · mazzo max ' + c.cap + ' punti' : ' · mazzo libero')}</small></div></button>`; }).join('')}</div>`);
    $$('[data-cup]').forEach(b=> b.addEventListener('click', ()=>{
      const cup = cupOf(b.dataset.cup); if(cup.need && !T.cups[cup.need]) return TT.toast('Prima vinci la ' + cupOf(cup.need).n);
      TT.snd('click'); TT.refill();
      TT.pickDeck({title: cup.n + ': le tue 5 carte', sub: 'Le userai per tutto il torneo.', items: localItems(), cap: cup.cap || 0, ok: 'Iscriviti', back: tournPage, onDone: keys=>{
        const T2 = tnLoad(); T2.run = tnStart(cup, keys.map(k=> k.split('#')[0])); T2.runs++; tnSave(T2); tournHub();
      }});
    }));
  }
  TT.extra.tourn = tournPage;
  function tournHub(){
    const T = tnLoad(), run = T.run; if(!run) return tournPage();
    const cup = cupOf(run.cup), mi = myMatch(run), m = run.rounds[run.round][mi], opp = run.parts[m.a === 0 ? m.b : m.a], ai = cup.ai[run.round];
    TT.screen(cup.n, `${tnBracket(run)}
      <div class="tt2-box"><b>${ROUNDS[run.round]}</b><div class="mut" style="margin:4px 0">${opp.face} ${esc(opp.n)}${opp.r ? ' · ' + esc(opp.r) : ''} · IA ${TT.NPC ? ['', 'Principiante', 'Normale', 'Esperto', 'Maestro', 'Campione'][ai] : ai}</div><div class="tt2-row">${TT.ruleChips(Object.assign({sudden: true}, run.rules), '')}</div></div>
      <h3>La tua squadra</h3><div class="tn-deck">${run.deck.map(id=> `<div class="cw">${cardHtml(id, {})}</div>`).join('')}</div>
      <button class="tt2-btn pri w" id="tnGo" style="margin-top:12px">⚔️ ${ROUNDS[run.round]}: gioca</button>
      ${run.last ? '<div class="tt2-row c" style="margin-top:8px"><button class="tt2-btn sm" id="tnRp">🎞️ Rivedi l\'ultima partita</button></div>' : ''}
      <div class="tt2-row c" style="margin-top:8px"><button class="tt2-btn sm red" id="tnQuit">Abbandona il torneo</button></div>`);
    $('#tnGo').addEventListener('click', ()=> tnFight(run, opp, ai, cup));
    const rp = $('#tnRp'); if(rp) rp.addEventListener('click', ()=>{ const e = (LS.get(RP_KEY, []) || []).find(x=> x.id === run.last); if(e) replayView(e, {back: tournHub}); else TT.toast('Replay non più disponibile'); });
    $('#tnQuit').addEventListener('click', async ()=>{ if(await TT.ask('Abbandonare il torneo? Perdi i premi non ancora ritirati.', 'Abbandona', 'Continua')){ const T2 = tnLoad(); T2.run = null; tnSave(T2); TT.replaceTop(tournPage); } });
  }
  function tnFight(run, opp, ai, cup){
    TT.startLocal({title: '🏆 ' + ROUNDS[run.round], names: [{nick: 'Tu', av: '🦝', sub: 'Blu'}, {nick: opp.n, av: opp.face, sub: opp.r || 'Torneo'}], hands: [run.deck.slice(), tnDeck(cup, run.round)], rules: Object.assign({sudden: true, trade: 'one'}, run.rules), ai,
      onEnd: (won, draw, sc, rid)=>{
        if(draw){ TT.toast('Pareggio: si rigioca!'); return tnFight(run, opp, ai, cup); }
        const T = tnLoad(), r = T.run; if(!r) return;
        if(rid) r.last = rid;
        const go = tnAdvance(r, won);
        if(go){ tnSave(T); TT.snd('win'); return tournHub(); }
        tnEnd(T, r, won);
      }});
  }
  function tnEnd(T, run, champion){
    const cup = cupOf(run.cup), S = TT.save(), rw = tnCards(cup, run.won);
    rw.forEach(id=>{ S.owned[id] = (S.owned[id] || 0) + 1; }); TT.saveS();
    if(champion){ T.wins++; T.cups[cup.id] = (T.cups[cup.id] || 0) + 1; }
    T.run = null; tnSave(T);
    const place = champion ? 'CAMPIONE!' : run.won === 2 ? 'Finalista' : run.won === 1 ? 'Semifinalista' : 'Eliminato ai quarti';
    TT.screen(cup.n, `${tnBracket(Object.assign({}, run, {round: Math.min(2, run.round)}))}
      <div class="tt2-tower-hd"><div style="font-size:2.8rem">${champion ? '🏆' : cup.em}</div><div class="fl" style="font-size:1.6rem">${place}</div><div class="mut">${champion ? 'Hai vinto la ' + cup.n + '! Trofei: ' + T.wins : run.won + (run.won === 1 ? ' turno superato' : ' turni superati')}</div></div>
      <h3>Premi</h3><div class="tt2-grid s">${rw.map(id=> `<div class="cw">${cardHtml(id, {})}</div>`).join('')}</div>
      ${champion ? '<p class="mut" style="text-align:center">🎭 Guarda i Cosmetici: il trofeo sblocca nuovi titoli, dorsi e cornici.</p>' : ''}
      <div class="tt2-row c" style="margin-top:12px"><button class="tt2-btn pri" id="tnAgain">Nuovo torneo</button>${run.last ? '<button class="tt2-btn" id="tnRp">🎞️ Ultima partita</button>' : ''}</div>`, {backFn: ()=> TT.close()});
    if(champion){ TT.snd('win'); TT.cosmReport(); } else TT.snd('lose');
    $('#tnAgain').addEventListener('click', ()=> TT.replaceTop(tournPage));
    const rp = $('#tnRp'); if(rp) rp.addEventListener('click', ()=>{ const e = (LS.get(RP_KEY, []) || []).find(x=> x.id === run.last); if(e) replayView(e, {back: ()=> TT.go(tournPage)}); });
  }
})();
