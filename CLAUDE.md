# Raccoon Triad

Gioco di carte in stile Triple Triad (regole FF8) con 320 carte di personaggi di videogiochi, collezione, buste, foil, sfide online. Nato dentro «Raccoon Tier» (Tier List RPG & JRPG di Mario, repo `TierListGame`) e poi separato. App statica, si apre anche con doppio clic (file://), senza build. Pubblicata con GitHub Pages: https://kur0chanx.github.io/raccoon-triad/

## Struttura
- `index.html` (pagina d'ingresso con il pulsante Gioca), `shell.js` (colori dei tier e link d'invito `#tt=`), `sw.js` (network-first con cache offline: ogni nuovo file va in SHELL), `manifest.webmanifest`, `icons/`.
- `triad.js` (sala, album, 6 stili carta, mazzi, impostazioni, visore 3D `TT.inspect`; carica gli altri pezzi solo quando servono) + `triad.css`. Punto d'ingresso: `window.openTriad()`.
- `triad-play.js` (tavolo `TT.mountBoard`, allenamento, due giocatori, Torre infinita `TT.tower`, Arena `TT.arena`, Sfida del giorno `dailyNpc`), `triad-online.js` (account, amici, stanze/QR, partite online, Custodi, negozio, missioni, collezioni, traguardi, officina, classifica e stagioni).
- `triad-core.js`: motore delle regole (UMD, identico su telefono e server). Regole: Basic, Elemental, Same, Same-Wall, Plus, Combo, Sudden Death, `special` (caselle 'boost' +2 / 'trap' −2), `cap` (limite dei livelli del mazzo, controllato dal server in `takeCards`). Prove: `node tools/test-triad-core.js`.
- Carte: `triad-cards.js` (200 base, generato da `tools/build-triad-cards.js` con i nomi in `tools/triad-cards-src.js`: i lati dipendono solo dal nome e NON devono cambiare), `triad-exp.js` (120 di espansione da `tools/triad-exp-src.js`, ognuna con `level` di sblocco), `triad-chars.js` (personaggio e scena per carta, da `tools/triad-chars-src.js` con `tools/build-triad-assets.js`, che genera anche `triad-imgs.js` e `tools/triad-prompts.md`), `triad-art.js` (immagini da Steam → Libretro → Wikipedia, `tools/build-triad-art.js`, rifatto ogni lunedì dal workflow `immagini-carte.yml`).
- Illustrazioni artistiche: `triad-img/<id>.webp` (5:7, 750×1050) e `<id>-full.webp` per la Full Art; vedi `triad-img/README.md` e `tools/triad-prompts.md`. Dopo aver aggiunto immagini esegui `node tools/build-triad-assets.js`.
- Varianti delle carte: `foil` numerico 0-5 (Normale, Holo, Reverse Holo, Full Art, Oro, Segreta), SOLO estetiche (stessi numeri).
- Server: `tools/triad-server/` (Cloudflare Worker + Durable Object SQLite: `worker.js`, `economy.js` con monete/XP/buste/missioni/collezioni/traguardi/polvere/stagioni; README con i passi). Prove: `wrangler dev --local --var START_COINS:5000 --var TURN_MS:2500 --var REG_MAX:100 --var SUPPLY_SCALE:0.3` e poi `node tools/triad-server/test.js`. Workflow `triad-server.yml` pubblica su Cloudflare (segreti `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`) e scrive `triad-config.js` (`window.TRIAD_SERVER`).
- Stagioni mensili nel server (`seasonTick`, tabelle `season`/`season_top`, `/api/season`).

## Chiavi in localStorage
`jrpg_triad_prefs` (stile/tavolo/suoni), `jrpg_triad2` (collezione dell'allenamento), `jrpg_triad_tower`, `jrpg_triad_arena`, `jrpg_triad_daily`, `jrpg_triad_acct` (TOKEN dell'account online: segreto, mai nel codice né nei commit), `jrpg_triad_server`, `jrpg_triad_photos`. Il nome `jrpg_` resta per compatibilità: il dominio `kur0chanx.github.io` è lo stesso della Tier List, quindi la collezione già fatta si ritrova qui.

## Regole di lavoro
- Ad OGNI versione cambia `<meta name="build">` in `index.html` e la cache `CACHE` in `sw.js`.
- Ogni nuovo file JS va in `index.html` (o caricato da `triad.js`), `sw.js` (SHELL) e `.github/workflows/pages.yml`.
- Non leggere file enormi per intero: Grep con `-o`/`head_limit` o script Node.
- Non modificare o rimuovere funzioni esistenti se non richiesto. Non toccare i lati delle carte base.
- Le illustrazioni dei personaggi sono opere altrui: non inserire immagini con diritti senza permesso.
- Il flusso di pubblicazione: commit, push, PR, squash merge, controllo del `<meta name="build">` online, poi `git checkout -B <branch> origin/main`.
