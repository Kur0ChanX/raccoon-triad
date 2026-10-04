// Triple Triad di Frugu — tornei tra amici online (eliminazione diretta, da 3 a 8 giocatori).
// Chi crea il torneo sceglie nome, regole e limite di punti; gli amici entrano con il codice e scelgono il loro mazzo (5 carte, verificate ma non bloccate).
// Le partite sono amichevoli (nessuna carta in palio): si gioca per il trofeo e per le monete. Metodi aggiunti alla classe Hub in worker.js.
export function makeTourn(D){
  const {CARD, Core, fail, hex, rcode, rint} = D, M = {};
  const MAX_OPEN = 3, TTL_OPEN = 7 * 864e5;
  const pow2 = n=> n <= 2 ? 2 : n <= 4 ? 4 : 8;
  M.tournMigrate = function(){
    this.run(`CREATE TABLE IF NOT EXISTS tourn(id TEXT PRIMARY KEY, code TEXT UNIQUE, host TEXT, name TEXT, size INTEGER, rules TEXT, status TEXT, data TEXT, created INTEGER, updated INTEGER)`);
    this.run(`CREATE TABLE IF NOT EXISTS tourn_p(tid TEXT, acc TEXT, PRIMARY KEY(tid, acc))`);
    this.run(`CREATE INDEX IF NOT EXISTS tourn_p_acc ON tourn_p(acc)`);
  };
  // mazzo del torneo: 5 carte diverse del giocatore, dentro il limite di punti. Si salvano gli id delle carte (il mazzo resta valido anche se poi le scambia)
  M.tournHand = function(acc, uids, cap){
    if(!Array.isArray(uids) || uids.length !== 5 || new Set(uids).size !== 5) fail(400, 'Scegli esattamente 5 carte', 'cards');
    const cids = uids.map(u=>{ if(typeof u !== 'string' || !/^u[0-9a-f]{14}$/.test(u)) fail(400, 'Carte non valide', 'cards'); const r = this.row('SELECT cid FROM cards WHERE uid=? AND owner=?', u, acc); if(!r || !CARD[r.cid]) fail(403, 'Una carta non è tua', 'cards'); return r.cid; });
    if(cap > 0 && cids.reduce((t, c)=> t + CARD[c].lv, 0) > cap) fail(400, 'Il mazzo supera il limite di punti (' + cap + ') del torneo', 'cap');
    return cids;
  };
  M.tournGet = function(id){ const t = this.row('SELECT * FROM tourn WHERE id=?', id); if(!t) fail(404, 'Torneo non trovato', 'nf'); t.data = JSON.parse(t.data); t.rules = JSON.parse(t.rules); return t; };
  M.tournSave = function(t){ this.run('UPDATE tourn SET status=?, data=?, updated=? WHERE id=?', t.status, JSON.stringify(t.data), Date.now(), t.id); };
  M.tournView = function(t, me){
    const d = t.data, nick = id=>{ const p = d.players.find(x=> x.id === id); return p ? p.nick : null; };
    const my = d.players.find(p=> p.id === me);
    let next = null;                                                 // la mia partita da giocare adesso
    if(t.status === 'run') (d.rounds[d.round] || []).forEach(m=>{ if(m.w == null && m.m && (m.a === me || m.b === me)) next = m.m; });
    return {id: t.id, code: t.status === 'open' ? t.code : null, name: t.name, host: t.host, hostNick: nick(t.host), size: t.size, rules: t.rules, status: t.status, created: t.created,
      players: d.players.map(p=> ({id: p.id, nick: p.nick, me: p.id === me})), joined: !!my, myHand: my ? my.hand : null, next,
      round: d.round, rounds: d.rounds.map(r=> r.map(m=> ({a: m.a, b: m.b, an: nick(m.a), bn: nick(m.b), w: m.w, m: m.m, sc: m.sc || null}))), champion: d.champion || null, championNick: nick(d.champion)};
  };
  M.tournPush = function(t){ const v = this.tournGet(t.id); v.data.players.forEach(p=> this.push(p.id, {t: 'tourn', tourn: this.tournView(v, p.id)})); };
  M.tournCreate = function(a, body){
    this.hit('tc:' + a.id, 10, 3600000);
    const open = this.row("SELECT COUNT(*) n FROM tourn WHERE host=? AND status IN ('open','run')", a.id).n; if(open >= MAX_OPEN) fail(429, 'Hai già ' + MAX_OPEN + ' tornei aperti: finiscine uno', 'many');
    const rules = this.cleanRules(Object.assign({}, body.rules || {}, {trade: 'one'})), size = [4, 8].includes(body.size | 0) ? body.size | 0 : 8;
    const name = String(body.name || '').replace(/[<>]/g, '').trim().slice(0, 30) || 'Torneo di ' + a.nick;
    const hand = this.tournHand(a.id, body.cards, rules.cap), id = 't' + hex(6); let code; do{ code = rcode(5); }while(this.row('SELECT 1 FROM tourn WHERE code=?', code));
    const now = Date.now(), data = {players: [{id: a.id, nick: a.nick, hand}], rounds: [], round: 0, champion: null};
    this.run('INSERT INTO tourn(id,code,host,name,size,rules,status,data,created,updated) VALUES(?,?,?,?,?,?,?,?,?,?)', id, code, a.id, name, size, JSON.stringify(rules), 'open', JSON.stringify(data), now, now);
    this.run('INSERT INTO tourn_p(tid,acc) VALUES(?,?)', id, a.id);
    return {tourn: this.tournView(this.tournGet(id), a.id)};
  };
  M.tournJoin = function(a, body){
    const code = String(body.code || '').toUpperCase().replace(/[^A-Z0-9]/g, ''), r = this.row("SELECT id FROM tourn WHERE code=? AND status='open'", code);
    if(!r) fail(404, 'Torneo non trovato o già iniziato', 'nf');
    const t = this.tournGet(r.id);
    if(t.data.players.some(p=> p.id === a.id)) fail(400, 'Sei già in questo torneo', 'already');
    if(t.data.players.length >= t.size) fail(409, 'Il torneo è pieno', 'full');
    const hand = this.tournHand(a.id, body.cards, t.rules.cap);
    t.data.players.push({id: a.id, nick: a.nick, hand}); this.tournSave(t); this.run('INSERT OR IGNORE INTO tourn_p(tid,acc) VALUES(?,?)', t.id, a.id);
    this.news(t.host, 'tourn_join', {tid: t.id, name: t.name, nick: a.nick});
    this.tournPush(t);
    return {tourn: this.tournView(this.tournGet(t.id), a.id)};
  };
  M.tournLeave = function(a, id){
    const t = this.tournGet(id); if(t.status !== 'open') fail(409, 'Il torneo è già iniziato', 'started');
    if(t.host === a.id){                                             // chi l'ha creato lo annulla per tutti
      t.status = 'cancel'; this.tournSave(t);
      t.data.players.filter(p=> p.id !== a.id).forEach(p=> this.news(p.id, 'tourn_cancel', {tid: t.id, name: t.name}));
      this.tournPush(t); return {ok: true, cancelled: true};
    }
    t.data.players = t.data.players.filter(p=> p.id !== a.id); this.tournSave(t); this.run('DELETE FROM tourn_p WHERE tid=? AND acc=?', t.id, a.id);
    this.tournPush(t); return {ok: true};
  };
  M.tournStart = function(a, id){
    const t = this.tournGet(id); if(t.host !== a.id) fail(403, 'Solo chi ha creato il torneo può farlo iniziare', 'forbidden');
    if(t.status !== 'open') fail(409, 'Il torneo è già iniziato', 'started');
    const n = t.data.players.length; if(n < 3) fail(400, 'Servono almeno 3 giocatori', 'few');
    const ids = t.data.players.map(p=> p.id);
    for(let i = ids.length - 1; i > 0; i--){ const j = rint(i + 1); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    const S = pow2(n), slots = Array(S).fill(null);
    // i «riposi» (passaggio diretto al turno dopo) vanno uno per partita, mai due vuoti insieme
    for(let k = 0; k < n; k++){ const half = k < S / 2 ? 0 : 1, j = half === 0 ? 2 * k : 2 * (k - S / 2) + 1; slots[j] = ids[k]; }
    const rounds = [], R = Math.log2(S);
    for(let r = 0; r < R; r++) rounds.push(Array.from({length: S >> (r + 1)}, (_, j)=> r === 0 ? {a: slots[2 * j], b: slots[2 * j + 1], w: null, m: null} : {a: null, b: null, w: null, m: null}));
    t.data.rounds = rounds; t.data.round = 0; t.status = 'run'; t.code = null;
    this.run('UPDATE tourn SET code=NULL WHERE id=?', t.id);
    this.tournSave(t); this.tournRound(t.id);
    return {tourn: this.tournView(this.tournGet(t.id), a.id)};
  };
  // crea le partite del turno corrente; i riposi avanzano da soli; se il turno è finito passa al successivo
  M.tournRound = function(id){
    const t = this.tournGet(id); if(t.status !== 'run') return;
    const d = t.data, ms = d.rounds[d.round], hand = pid=> d.players.find(p=> p.id === pid).hand.map(c=> ({id: c, v: CARD[c].v, e: CARD[c].e}));
    ms.forEach(m=>{
      if(m.w != null || m.m) return;
      if(m.a && !m.b){ m.w = m.a; return; } if(m.b && !m.a){ m.w = m.b; return; }
      if(!m.a && !m.b){ m.w = null; m.bye = true; return; }
      const mid = 'm' + hex(6), flip = rint(2), p0 = flip ? m.b : m.a, p1 = flip ? m.a : m.b;
      m.m = mid; this.tournSave(t);
      this.newMatch(mid, p0, p1, 'tourn', 0, t.rules, [[], []], [hand(p0), hand(p1)]);
    });
    if(ms.every(m=> m.w != null || m.bye)){
      if(d.round === d.rounds.length - 1){ this.tournEnd(t, ms[0].w); return; }
      ms.forEach((m, j)=>{ const nx = d.rounds[d.round + 1][j >> 1]; if(j % 2 === 0) nx.a = m.w; else nx.b = m.w; });
      d.round++; this.tournSave(t); this.tournRound(id); return;
    }
    this.tournSave(t); this.tournPush(t);
  };
  // chiamata da finish() quando finisce una partita di torneo; in caso di pareggio si rigioca
  M.tournOnMatch = function(m, st){
    const r = this.rows("SELECT id FROM tourn WHERE status='run' AND data LIKE ?", '%' + m.id + '%')[0]; if(!r) return;
    const t = this.tournGet(r.id), ms = t.data.rounds[t.data.round], x = ms && ms.find(y=> y.m === m.id); if(!x) return;
    const w = st.result.winner;
    if(w == null){ x.m = null; this.tournSave(t); this.tournRound(t.id); return; }
    const sc = st.result.score; x.w = w === 0 ? m.p0 : m.p1; x.sc = Math.max(sc[0], sc[1]) + '-' + Math.min(sc[0], sc[1]);
    this.tournSave(t); this.tournRound(t.id);
  };
  M.tournEnd = function(t, champ){
    t.data.champion = champ; t.status = 'done'; this.tournSave(t);
    const fin = t.data.rounds[t.data.rounds.length - 1][0], second = fin.a === champ ? fin.b : fin.a, many = t.data.players.length;
    const prize = 60 + 15 * many;
    if(champ){ this.award(champ, {coins: prize, xp: 80 + 10 * many, noEvent: true}); this.track && this.track(champ, 'win', 1); this.checkAch(champ); }
    if(second) this.award(second, {coins: Math.round(prize / 3), xp: 40, noEvent: true});
    const nick = (t.data.players.find(p=> p.id === champ) || {}).nick || '?';
    t.data.players.forEach(p=> this.news(p.id, 'tourn_end', {tid: t.id, name: t.name, champion: nick, me: p.id === champ, coins: p.id === champ ? prize : p.id === second ? Math.round(prize / 3) : 0}));
    this.tournPush(t);
  };
  M.tournList = function(a){
    const now = Date.now();
    // i tornei mai iniziati scadono dopo una settimana
    this.rows("SELECT id FROM tourn WHERE status='open' AND created<?", now - TTL_OPEN).forEach(r=>{ const t = this.tournGet(r.id); t.status = 'cancel'; this.tournSave(t); });
    const ids = this.rows('SELECT tid FROM tourn_p WHERE acc=?', a.id).map(r=> r.tid);
    const list = ids.map(id=> this.tournGet(id)).filter(t=> t.status !== 'cancel' && (t.status !== 'done' || now - t.updated < 14 * 864e5)).sort((x, y)=> y.updated - x.updated).slice(0, 20);
    return {tourns: list.map(t=> this.tournView(t, a.id))};
  };
  M.tournOne = function(a, id){ const t = this.tournGet(id); if(!t.data.players.some(p=> p.id === a.id) && t.status !== 'open') fail(403, 'Non sei in questo torneo', 'forbidden'); return {tourn: this.tournView(t, a.id)}; };
  return M;
}
