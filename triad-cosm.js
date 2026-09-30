// Cosmetici del Raccoon Triad: dorsi delle carte, cornici dell'avatar e titoli. Solo estetica, nessun vantaggio in partita.
// Modulo UMD: lo usano sia il telefono (window.TRIAD_COSM) sia il server (tools/triad-server), quindi il catalogo è uno solo.
// Ogni oggetto si ottiene in uno di questi modi: subito (gratis), raggiungendo un traguardo (stat >= target) o comprandolo con le monete (price, solo online).
// Le statistiche sono quelle dei Traguardi del server (wins, streak, games, uniq, legend, mythic, boss, steals, elo, lvl, packs, foil, gold, secret, variants, sets)
// più due che si giocano solo sul telefono: tower (piano più alto della Torre) e tourn (Tornei vinti). Offline si calcolano dai dati locali.
(function(root, factory){
  var m = factory();
  if(typeof module === 'object' && module.exports) module.exports = m; else root.TRIAD_COSM = m;
})(typeof self !== 'undefined' ? self : this, function(){
  'use strict';
  var KINDS = {b: 'Dorsi', f: 'Cornici', t: 'Titoli'};
  // [tipo, id, nome, come si ottiene, stat, target, prezzo]
  var RAW = [
    ['b', 'b_classic', 'Classico', 'Sempre tuo'],
    ['b', 'b_procione', 'Procione', 'Sempre tuo'],
    ['b', 'b_notte', 'Notte stellata', 'Raggiungi il livello 5', 'lvl', 5],
    ['b', 'b_brace', 'Brace', 'Vinci 10 partite', 'wins', 10],
    ['b', 'b_foresta', 'Foresta', 'Possiedi 25 carte diverse', 'uniq', 25],
    ['b', 'b_onda', 'Onda', 'Gioca 50 partite', 'games', 50],
    ['b', 'b_holo', 'Ologramma', 'Ottieni una carta foil', 'foil', 1],
    ['b', 'b_reale', 'Reale', 'Comprato con 600 monete', null, 0, 600],
    ['b', 'b_vuoto', 'Vuoto', 'Raggiungi 1400 ELO', 'elo', 1400],
    ['b', 'b_torre', 'Torre', 'Sali al piano 10 della Torre infinita', 'tower', 10],
    ['b', 'b_oro', 'Oro zecchino', 'Ottieni una carta Oro', 'gold', 1],
    ['b', 'b_corona', 'Corona', 'Vinci un Torneo', 'tourn', 1],
    ['f', 'f_base', 'Semplice', 'Sempre tua'],
    ['f', 'f_bronzo', 'Bronzo', 'Vinci 5 partite', 'wins', 5],
    ['f', 'f_argento', 'Argento', 'Vinci 25 partite', 'wins', 25],
    ['f', 'f_oro', 'Oro', 'Vinci 100 partite', 'wins', 100],
    ['f', 'f_neon', 'Neon', 'Raggiungi il livello 10', 'lvl', 10],
    ['f', 'f_fiamma', 'Fiamma', 'Vinci 5 partite di fila', 'streak', 5],
    ['f', 'f_ghiaccio', 'Ghiaccio', 'Batti 3 Custodi', 'boss', 3],
    ['f', 'f_rosa', 'Rosa', 'Comprata con 300 monete', null, 0, 300],
    ['f', 'f_arcobaleno', 'Arcobaleno', 'Ottieni 5 carte foil', 'foil', 5],
    ['f', 'f_torre', 'Torre', 'Sali al piano 20 della Torre infinita', 'tower', 20],
    ['f', 'f_alloro', 'Alloro', 'Vinci 3 Tornei', 'tourn', 3],
    ['f', 'f_regale', 'Regale', 'Raggiungi 1600 ELO', 'elo', 1600],
    ['t', 't_recluta', 'Recluta', 'Sempre tuo'],
    ['t', 't_ladro', 'Ladro di carte', 'Ruba una carta a un amico', 'steals', 1],
    ['t', 't_collezionista', 'Collezionista', 'Possiedi 50 carte diverse', 'uniq', 50],
    ['t', 't_curatore', 'Curatore del Museo', 'Possiedi 100 carte diverse', 'uniq', 100],
    ['t', 't_inarrestabile', 'Inarrestabile', 'Vinci 10 partite di fila', 'streak', 10],
    ['t', 't_domatore', 'Domatore di Custodi', 'Batti 5 Custodi', 'boss', 5],
    ['t', 't_re', 'Re dei Giochi', 'Batti tutti i 10 Custodi', 'boss', 10],
    ['t', 't_leggende', 'Cacciatore di leggende', 'Possiedi una carta di livello 9 o 10', 'legend', 1],
    ['t', 't_set', 'Maestro dei set', 'Completa 3 collezioni', 'sets', 3],
    ['t', 't_buste', 'Apri-buste', 'Apri 50 buste', 'packs', 50],
    ['t', 't_veterano', 'Veterano', 'Raggiungi il livello 25', 'lvl', 25],
    ['t', 't_maestro', 'Maestro Triad', 'Raggiungi 1600 ELO', 'elo', 1600],
    ['t', 't_scalatore', 'Scalatore della Torre', 'Sali al piano 15 della Torre infinita', 'tower', 15],
    ['t', 't_campione', 'Campione del Torneo', 'Vinci un Torneo', 'tourn', 1],
    ['t', 't_leggenda', 'Leggenda del Torneo', 'Vinci 5 Tornei', 'tourn', 5],
    ['t', 't_amico', 'Amico di Frugu', 'Comprato con 500 monete', null, 0, 500]
  ];
  var ITEMS = RAW.map(function(a){ return {kind: a[0], id: a[1], name: a[2], how: a[3], stat: a[4] || null, target: a[5] || 0, price: a[6] || 0, free: !a[4] && !a[6]}; });
  var BY = {}; ITEMS.forEach(function(it){ BY[it.id] = it; });
  function get(id){ return BY[id] || null; }
  // l'oggetto è già tuo con queste statistiche? (quelli a pagamento no: servono i dati dell'account)
  function have(it, stats){ if(!it) return false; if(it.free) return true; if(it.stat) return ((stats && stats[it.stat]) || 0) >= it.target; return false; }
  function prog(it, stats){ return it.stat ? Math.min(it.target, (stats && stats[it.stat]) || 0) : 0; }
  return {KINDS: KINDS, ITEMS: ITEMS, get: get, have: have, prog: prog, DEFAULT: {b: 'b_classic', f: 'f_base', t: null}};
});
