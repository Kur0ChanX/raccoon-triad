// Guscio minimo del gioco autonomo: prepara ciò che nella Tier List arrivava da extras*.js (colori dei tier, link d'invito).
// Le chiavi in localStorage restano jrpg_triad* (lo stesso dominio kur0chanx.github.io le condivide con la Tier List: la collezione si porta dietro).
(function(){
  window.XUI = window.XUI || {TIER_COL: {'S+': '#f5b82e', 'S': '#a855f7', 'A': '#3b82f6', 'B': '#10b981', 'C': '#eab308', 'D': '#f97316', 'E': '#ef4444', 'F': '#8b8b8b'}};
  // link d'invito (#tt=room:CODICE o #tt=friend:CODICE;s=<server>): li legge triad.js da sessionStorage
  const m = location.hash.match(/#tt=([^&]+)/);
  if(m){
    try{ sessionStorage.setItem('rt_tt_invite', decodeURIComponent(m[1])); }catch(e){}
    try{ history.replaceState(null, '', location.pathname + location.search); }catch(e){}
  }
})();
