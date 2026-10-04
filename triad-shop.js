// ---- Raccoon Triad: Scrigno del giorno e Bottega dell'allenamento (senza internet). Caricato da triad.js solo quando serve. ----
// Monete in S.coins (jrpg_triad2), scrigno in S.chest = {last, streak}, garanzia delle buste in S.pity = {tipo: buste senza carta forte}.
// Buste e probabilità sono le stesse del server online (tools/triad-server/economy.js: PACKS), solo con le carte del set base.
(function(){
  'use strict';
  const TT = window.TT; if(!TT || TT.shop) return;
  const {$, $$, esc, cardHtml} = TT;
  const W_BASE = [34, 26, 18, 10, 6, 3.5, 1.5, .7, .25, .05];
  const PACKS = {
    base: {name: 'Busta Base', emoji: '📦', cost: 60, n: 3, w: W_BASE, guar: 3, pity: 10},
    rara: {name: 'Busta Rara', emoji: '💎', cost: 200, n: 3, w: [0, 0, 0, 12, 30, 28, 18, 8, 3.5, .5], guar: 5, pity: 8},
    epica: {name: 'Busta Epica', emoji: '🔮', cost: 520, n: 3, w: [0, 0, 0, 0, 0, 32, 34, 22, 10, 2], guar: 7, pity: 6},
    leg: {name: 'Busta Leggendaria', emoji: '👑', cost: 1300, n: 2, w: [0, 0, 0, 0, 0, 0, 0, 52, 38, 10], guar: 9, pity: 4}
  };
  // scrigno: 7 giorni di fila, poi si ricomincia. Saltare un giorno riporta al primo.
  const CHEST = [{c: 25}, {c: 30}, {c: 35}, {c: 40}, {c: 50}, {c: 60}, {c: 80, pack: 'rara'}];
  const yesterday = ()=>{ const d = new Date(Date.now() - 864e5); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
  const rollW = w=>{ const tot = w.reduce((x, y)=> x + y, 0), r = Math.random() * tot; let a = 0; for(let i = 0; i < w.length; i++){ a += w[i]; if(r < a) return i + 1; } return w.length; };
  function chestState(){
    const S = TT.save(), ch = S.chest || {}, today = TT.dayKey(), done = ch.last === today;
    const streak = done ? ch.streak : (ch.last === yesterday() ? (ch.streak || 0) + 1 : 1);   // giorno che si apre (o aperto) oggi
    return {done, streak, idx: (streak - 1) % 7};
  }
  function openPack(type){
    const def = PACKS[type], S = TT.save(); S.pity = S.pity || {};
    S.pity[type] = (S.pity[type] || 0) + 1;
    const lv = Array.from({length: def.n}, ()=> rollW(def.w)), boost = Math.min(10, def.guar + 3);
    lv[def.n - 1] = Math.max(lv[def.n - 1], def.guar);
    if(S.pity[type] >= def.pity) lv[def.n - 1] = Math.max(lv[def.n - 1], boost);
    if(Math.max(...lv) >= boost) S.pity[type] = 0;
    const out = lv.sort((a, b)=> a - b).map(L=>{
      const pool = TT.BASE.filter(c=> c.lv === L), c = pool[Math.floor(Math.random() * pool.length)], isNew = !(S.owned[c.id] > 0);
      S.owned[c.id] = (S.owned[c.id] || 0) + 1; return {cid: c.id, isNew};
    });
    TT.saveS(); return out;
  }
  // apertura: le carte si girano una alla volta
  function reveal(title, cards, done){
    const m = TT.modal(`<div style="text-align:center"><h3 style="margin-top:0">${esc(title)}</h3><div class="sh-cards">${cards.map((c, i)=> `<div class="sh-c" data-i="${i}"><div class="sh-back"></div><div class="sh-face">${cardHtml(c.cid, {})}<small class="${c.isNew ? 'sh-new' : 'mut'}">${c.isNew ? '✨ NUOVA!' : 'Doppione'}</small></div></div>`).join('')}</div><p class="mut" id="shHint">Tocca le carte per girarle</p><button class="tt2-btn pri" data-mclose hidden id="shOk">Fantastico!</button></div>`, {center: true, sticky: true, onClose: done});
    let left = cards.length;
    const flip = el=>{ if(el.classList.contains('on')) return; el.classList.add('on'); const c = cards[+el.dataset.i]; TT.snd(TT.CARD[c.cid].lv >= 7 ? 'combo' : 'flip'); if(TT.CARD[c.cid].lv >= 8) TT.vib(60); if(--left === 0){ $('#shOk', m).hidden = false; $('#shHint', m).hidden = true; } };
    $$('.sh-c', m).forEach(el=> el.addEventListener('click', ()=> flip(el)));
    $('#shHint', m).addEventListener('click', ()=> $$('.sh-c', m).forEach(flip));
  }
  TT.shop = function(){
    const S = TT.save(), coins = S.coins || 0, ch = chestState();
    TT.screen('Scrigno e Bottega', `
      <div class="sh-coins">🪙 <b>${coins}</b> monete</div>
      <div class="tt2-box"><b>🎁 Scrigno del giorno</b> <small class="mut">(torna ogni giorno: più giorni di fila, premio più grande)</small>
        <div class="sh-days">${CHEST.map((d, i)=> `<div class="${i < ch.idx || (i === ch.idx && ch.done) ? 'got' : i === ch.idx ? 'now' : ''}"><small>Giorno ${i + 1}</small><b>${d.pack ? '💎' : '🪙'}</b><small>${d.c}${d.pack ? ' + busta' : ''}</small></div>`).join('')}</div>
        <button class="tt2-btn ${ch.done ? '' : 'gold'} w" id="shChest" ${ch.done ? 'disabled' : ''}>${ch.done ? '✔ Già aperto oggi · torna domani' : '🎁 Apri lo scrigno (giorno ' + (ch.idx + 1) + ')'}</button>
      </div>
      <h3>🛒 Buste</h3>
      <div class="tt2-list">${Object.keys(PACKS).map(k=>{ const p = PACKS[k], pt = (S.pity || {})[k] || 0; return `<button class="tt2-item" data-p="${k}" ${coins < p.cost ? 'style="opacity:.55"' : ''}><div class="av">${p.emoji}</div><div class="tx"><b>${p.name}</b><small>${p.n} carte · l'ultima almeno di livello ${p.guar} · garanzia livello ${Math.min(10, p.guar + 3)}${p.guar + 3 < 10 ? '+' : ''} fra ${Math.max(1, p.pity - pt)} buste</small></div><div class="rt">🪙 ${p.cost}</div></button>`; }).join('')}</div>
      <div class="tt2-box mut" style="font-size:.8rem"><b>Come si guadagnano le monete</b><br>Allenamento: vittoria 9-21 🪙 (di più contro gli avversari forti), pareggio 3, sconfitta 2 · Sfida del giorno +40 · Torre: 4 per piano · Arena: 15 per vittoria · Torneo: 20 per partita vinta, 100 alla coppa. Dopo 12 partite nello stesso giorno le monete delle partite valgono la metà.</div>`);
    $('#shChest').addEventListener('click', ()=>{
      const c = chestState(); if(c.done) return; const d = CHEST[c.idx];
      S.chest = {last: TT.dayKey(), streak: c.streak}; TT.earn(d.c);
      TT.snd('coin');
      if(d.pack){ const cards = openPack(d.pack); reveal('Scrigno del 7° giorno: ' + PACKS[d.pack].name + '!', cards, ()=> TT.replaceTop(TT.shop)); }
      else { TT.toast('🪙 +' + d.c + ' monete · ' + (c.streak > 1 ? c.streak + ' giorni di fila!' : 'torna domani per un premio più grande')); TT.replaceTop(TT.shop); }
    });
    $$('[data-p]').forEach(b=> b.addEventListener('click', async ()=>{
      const k = b.dataset.p, p = PACKS[k];
      if((S.coins || 0) < p.cost){ TT.toast('Servono ' + p.cost + ' 🪙: ne hai ' + (S.coins || 0)); return; }
      if(!await TT.ask(`Compro la ${p.name} per ${p.cost} 🪙?`, 'Compra', 'No')) return;
      S.coins -= p.cost; TT.saveS(); TT.snd('coin');
      reveal(p.name, openPack(k), ()=> TT.replaceTop(TT.shop));
    }));
  };
  TT.shopPacks = PACKS;
})();
