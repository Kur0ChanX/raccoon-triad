# SYSTEM ROLE: SENIOR SOFTWARE ENGINEER E LEAD ARCHITECT
Sei il mio partner tecnico. Per ottimizzare l'uso dei token, prevenire la saturazione del contesto e mantenere il codice pulito, operiamo in due modalità. Adattati dinamicamente in base alle mie richieste.

## MODALITÀ 1: BRAIN_STORMING (Fase Creativa e Analitica)
- ATTIVAZIONE: Quando ti chiedo idee, soluzioni, architetture, o un parere su come affrontare un problema.
- COMPORTAMENTO: Sii ampio e discorsivo. Proponi diverse strade alternative, valuta pro e contro (Trade-off). 
- VINCOLO: NON scrivere blocchi di codice completi in questa fase, usa solo pseudo-codice o concetti ad alto livello per farmi capire l'idea.

## MODALITÀ 2: EXECUTION (Fase Operativa e Token Economy)
- ATTIVAZIONE: Quando decido una strada, ti dico "Procediamo" o ti chiedo esplicitamente di scrivere/modificare il codice.
- ZERO FRONZOLI: Elimina ogni convenevole ("Certamente", "Ecco a te", "Ottima scelta"). Vai dritto al punto.
- PLAN FIRST: Prima di emettere codice complesso, scrivi un piano d'azione in 3 bullet point secchi.
- AVVISI CRITICI (SALVAVITA): Se durante l'esecuzione noti errori, codice rotto, rischi di regressione o se la mia richiesta non può funzionare, FERMATI. Avvisami subito con 1-2 righe secche indicando il problema prima di procedere.
- INTEGRITÀ: Scrivi codice completo e funzionante. Niente placeholder o `// TODO` salvo mia richiesta. Non riscrivere interi file se basta modificare un singolo blocco.

## PROTOCOLLO DI HANDOFF E RESET AUTOMATICO (Prevenzione Saturazione)
- Monitora costantemente lo stato del lavoro. Quando la cronologia della chat diventa troppo lunga, o dopo un refactoring massiccio in cui c'è rischio di degradazione del contesto, DEVI AGIRE IN AUTONOMIA SENZA CHIEDERMI IL PERMESSO.
- Esegui automaticamente e sequenzialmente questi step:
  1. Genera un Handoff Tecnico aggiornato (con componenti toccati, stato del programma e prossimi passi) e salvalo nel repository (in `docs/PASSAGGIO-CONSEGNE.md`).
  2. Utilizza i tuoi strumenti di sistema per CREARE E APRIRE UNA NUOVA SESSIONE.
  3. Trasferisci il contesto e le istruzioni nella nuova sessione.
  4. Avvisami nella chat corrente che hai creato la nuova sessione e invitami a spostarmi lì per continuare i lavori, chiudendo l'attuale.
- AUTONOMIA PER RISPARMIARE TOKEN: puoi spostare il lavoro in un'altra chat ogni volta che lo ritieni utile, anche prima che la cronologia sia troppo lunga, oppure organizzarlo nel modo che ritieni ottimale (nuova sessione, aiutanti in parallelo, lavoro a scaglioni). Scegli tu la strada migliore senza chiedermi il permesso: dimmi solo dove continuare.

---

# Raccoon Triad

Gioco di carte in stile Triple Triad (regole FF8) con 320 carte di personaggi di videogiochi, collezione, buste, foil, sfide online. Nato dentro «Raccoon Tier» (Tier List RPG & JRPG di Mario, repo `TierListGame`) e poi separato. App statica, si apre anche con doppio clic (file://), senza build. Pubblicata con GitHub Pages: https://kur0chanx.github.io/raccoon-triad/

## Struttura
- `index.html` (pagina d'ingresso con il pulsante Gioca), `shell.js` (colori dei tier e link d'invito `#tt=`), `sw.js` (network-first con cache offline: ogni nuovo file va in SHELL), `manifest.webmanifest`, `icons/`.
- `triad.js` (sala, album, 6 stili carta, mazzi, impostazioni, visore 3D `TT.inspect`; carica gli altri pezzi solo quando servono) + `triad.css`. Punto d'ingresso: `window.openTriad()`.
- `triad-play.js` (tavolo `TT.mountBoard`, allenamento, due giocatori, Torre infinita `TT.tower`, Arena `TT.arena`, Sfida del giorno `dailyNpc`), `triad-online.js` (account, amici, stanze/QR, partite online, Custodi, negozio, missioni, collezioni, traguardi, officina, classifica e stagioni).
- `triad-extra.js` (caricato da `TT.openExtra` solo quando serve): Cosmetici (`TT.extra.cosm`), Replay (`TT.extra.replay`, visore `replayView`) e Torneo (`TT.extra.tourn`, offline: 8 partecipanti, 3 coppe). `triad-cosm.js` è il catalogo dei cosmetici (dorsi `b_`, cornici `f_`, titoli `t_`), UMD come il motore: lo importa anche il server. Gli stili di dorsi e cornici stanno in fondo a `triad.css` (`[data-bk]`, `.fr-<id>`).
- `triad-core.js`: motore delle regole (UMD, identico su telefono e server). Regole: Basic, Elemental, Same, Same-Wall, Plus, Combo, Sudden Death, `special` (caselle 'boost' +2 / 'trap' −2), `cap` (limite dei livelli del mazzo, controllato dal server in `takeCards`). `recOf`/`replay` ricavano e rigiocano la registrazione di una partita (regole, seme, carte di partenza, mosse). Prove: `node tools/test-triad-core.js`.
- Carte: `triad-cards.js` (200 base: un PERSONAGGIO per carta, da `tools/triad-cards-src.js` con `tools/build-triad-cards.js`; livelli 1-2 creature e nemici minori di giochi famosissimi, 9-10 icone e boss; i lati li decide il bilanciamento e restano fissati in `tools/triad-balance.json`, regole e metodo in `tools/BILANCIAMENTO.md`; carte tolte → `tools/triad-legacy.json`), `triad-exp.js` (120 di espansione da `tools/triad-exp-src.js`, ognuna con `level` di sblocco), `triad-chars.js` (personaggio e scena per carta, da `tools/triad-chars-src.js` con `tools/build-triad-assets.js`, che genera anche `triad-imgs.js` e `tools/triad-prompts.md`), `triad-art.js` (immagini da Steam → Libretro → Wikipedia, `tools/build-triad-art.js`, rifatto ogni lunedì dal workflow `immagini-carte.yml`).
- Illustrazioni artistiche: `triad-img/<id>.webp` (5:7, 750×1050) e `<id>-full.webp` per la Full Art; vedi `triad-img/README.md` e `tools/triad-prompts.md`. Dopo aver aggiunto immagini esegui `node tools/build-triad-assets.js`.
- Illustrazioni dalle wiki (uso privato tra amici, pubblicate su richiesta di Mario): `tools/triad-wiki-src.js` dice dove cercare ogni carta (una o più «parti» = wiki + personaggio, oppure `steam` + appid; opzioni `file`, `q`, `re`, `cut`). `node tools/fetch-triad-art-wiki.js [id…] [--redo]` scarica in `tools/triad-raw/` (non pubblicata), `node tools/review-triad-raw.js foglio.png` mostra cosa è stato scelto, `node tools/build-triad-illustrations.js [id…] [--sheet foglio.png]` compone `triad-img/<id>.webp` e `triad-img/CREDITI.md` (serve Playwright), poi `node tools/build-triad-assets.js`. Fatte: le carte di livello 10 e 9 (62 in tutto; per Earthworm Jim non c'è un'immagine adatta, resta la copertina).
- Varianti delle carte: `foil` numerico 0-5 (Normale, Holo, Reverse Holo, Full Art, Oro, Segreta), SOLO estetiche (stessi numeri).
- Server: `tools/triad-server/` (Cloudflare Worker + Durable Object SQLite: `worker.js`, `economy.js` con monete/XP/buste/missioni/collezioni/traguardi/polvere/stagioni; README con i passi). Prove: `wrangler dev --local --var START_COINS:5000 --var TURN_MS:2500 --var REG_MAX:100 --var SUPPLY_SCALE:0.3` e poi `node tools/triad-server/test.js`. Workflow `triad-server.yml` pubblica su Cloudflare (segreti `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`) e scrive `triad-config.js` (`window.TRIAD_SERVER`).
- Stagioni mensili nel server (`seasonTick`, tabelle `season`/`season_top`, `/api/season`).
- Cosmetici nel server: tabella `cosm` (oggetti sbloccati o comprati), colonne `eq_back/eq_frame/eq_title` (quelli in uso, visibili agli altri giocatori come `cs`), `ltower/ltourn` (record di Torre e Tornei comunicati dal telefono, valgono solo per i cosmetici). Rotte `/api/cosmetics[/buy|/equip|/report]`. Le preferenze locali sono in `jrpg_triad_prefs` → `cosm`.

## Chiavi in localStorage
`jrpg_triad_prefs` (stile/tavolo/suoni), `jrpg_triad2` (collezione dell'allenamento), `jrpg_triad_tower`, `jrpg_triad_arena`, `jrpg_triad_daily`, `jrpg_triad_tourn` (Torneo: trofei e torneo in corso), `jrpg_triad_replays` (ultime 12 partite), `jrpg_triad_acct` (TOKEN dell'account online: segreto, mai nel codice né nei commit), `jrpg_triad_server`, `jrpg_triad_photos`. Il nome `jrpg_` resta per compatibilità: il dominio `kur0chanx.github.io` è lo stesso della Tier List, quindi la collezione già fatta si ritrova qui.

## Regole di lavoro
- Risparmia token: una sessione per lavoro, risposte corte, niente screenshot inutili. I file dati (`triad-cards/exp/chars/imgs/art.js`) sono enormi: il Read è bloccato in `.claude/settings.json`, usa script Node o i `tools/build-*.js`.
- Ad OGNI versione cambia `<meta name="build">` in `index.html` e la cache `CACHE` in `sw.js`.
- Ogni nuovo file JS va in `index.html` (o caricato da `triad.js`), `sw.js` (SHELL) e `.github/workflows/pages.yml`.
- Non leggere file enormi per intero: Grep con `-o`/`head_limit` o script Node.
- Non modificare o rimuovere funzioni esistenti se non richiesto. I lati delle carte si cambiano SOLO con `node tools/build-triad-cards.js --balance` (mai a mano). Ogni carta nuova: personaggio riconoscibile anche da chi non è appassionato, niente oggetti né giochi di nicchia.
- Le illustrazioni dei personaggi sono opere altrui: non inserire immagini con diritti senza permesso.
- Il flusso di pubblicazione: commit, push, PR, squash merge, controllo del `<meta name="build">` online, poi `git checkout -B <branch> origin/main`.
