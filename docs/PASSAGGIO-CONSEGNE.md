# Passaggio di consegne — Raccoon Triad

Aggiornato il 3/10/2026, build **t9** (https://kur0chanx.github.io/raccoon-triad/).

## Utente
Mario, italiano, non programmatore. Vuole un gioco «live service» che duri anni: progressione lunga e gratificante, ogni giorno un motivo per giocare e vincere qualcosa, sfide tra amici. Le carte devono essere personaggi che riconosce anche chi non è appassionato (mai oggetti, mai giochi di nicchia o cult). Ha dato il permesso di modificare tutti i dati.

## Fatto in questa sessione
- **t5 · Immagini delle carte** (`triad-photo.js`, nuovo): pulsante «Cambia immagine» nel dettaglio della carta. Cerca su Google (personaggio, copertina, sfondo), legge gli appunti al ritorno, ritaglia in 5:7 puntando su volti e dettagli, permette zoom e spostamento. Le immagini (750×1050) stanno in IndexedDB `raccoon_triad/photos`. Nelle Impostazioni: modalità in serie, Esporta/Importa (JSON). Foil con rilievo: maschere ricavate dall'immagine (`.ttc-rl`). In gioco il blu/rosso è solo sulla cornice; cornice metallica nuova (fondo di `triad.css`).
- **t6 · Set base rifatto e bilanciato:** 200 personaggi in `tools/triad-cards-src.js`; numeri da `tools/build-triad-cards.js` (regole per livello, profili, simulazione IA contro IA), fissati in `tools/triad-balance.json`. Metodo e risultati in `tools/BILANCIAMENTO.md`. Collezioni vecchie migrate con `TRIAD_CARDS.legacy` (da `tools/triad-legacy.json`, applicato in `loadSave` di `triad.js`). Torre: «Prima mossa» → «Ultima parola» (chi chiude vince più spesso).

- **t8 · Editor delle carte** (`triad-edit.js`, nuovo): modifica numeri/potere/nome/gioco con giudizio di bilanciamento e studio in partita; pagina Bilanciamento; retro delle carte (dorsi o immagine propria). Mario deciderà le modifiche e le esporterà: quando manda il file, renderle ufficiali in `tools/` (vedi CLAUDE.md) e rifare `node tools/build-triad-cards.js` (senza `--balance`, per non toccare le sue scelte).
- **t9 · Salvataggio e partita guidata:** «💾 Salva i progressi» / «📂 Carica i progressi» in Tavolo e suoni (`backupSave/backupLoad` in `triad.js`: tutte le chiavi `jrpg_triad*` tranne il token + immagini via `TT.photo.dataAll/putAll`; promemoria dopo 10 partite se non salvi da 14 giorni). Partita guidata `TT.tutorial` (`triad-play.js`): proposta alla prima apertura, 5 mosse guidate con carte scelte al momento dai numeri veri, poi gioco libero contro IA 1, regalo di una carta di livello 3 (`P.tutDone`).

## Prossimi passi (ordine concordato)
1. **Espansioni da rifare** (`tools/triad-exp-src.js`, 120 carte): sono ancora a giochi, con molti titoli di nicchia (Tapper, Mappy, Night Trap, Splatterhouse, Lost Odyssey, l'intero set «Indie & Cult»…). Rifarle a personaggi riconoscibili, con temi nuovi, poi `node tools/build-triad-cards.js --balance 3000`. Attenzione ai doppioni con il set base (es. Luigi è nel base al livello 8 ed è anche in `luigi-s-mansion` dell'espansione horror).
2. ~~Primo avversario troppo forte~~ **fatto in t7** (`triad-play.js`): ogni avversario ha carattere (`d`), regola insegnata (`teach`, lezioni in `LESSON`, mostrate la prima volta e rivedibili col pulsante 📖; viste in `S.lessons` di `jrpg_triad2`) e scarto di livello (`adj`). `npcDeck(n, mine)` punta alla somma dei livelli del mazzo del giocatore + `adj`, dentro `n.lv`. Sfida del giorno in fondo, sbloccata dopo 3 avversari diversi battuti.
3. **Campagna a regioni con stelle** (strada C concordata: campagna + modalità infinite). Ogni regione introduce una regola, ha un limite di livello del mazzo (`cap` esiste già nel motore) e una versione Eroica.
4. **Server online:** mancano i segreti `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` nel repository (lo deve fare Mario). Poi: missioni giornaliere, scrigno con serie, leghe con limite di livello, pass stagionale, eventi.
5. Principio fisso: le espansioni non aggiungono potenza (stesse regole dei numeri), solo varietà. Crescita senza fine via collezione, foil, padronanza delle carte, livello dell'account, formati a rotazione.

## Note tecniche
- Lato «alto» un po' più debole nel set (915 contro circa 1000 degli altri): da correggere alla prossima aggiunta di carte.
- 59 carte senza immagine automatica (usano l'Emblema): Mario mette le immagini da solo con «Cambia immagine». Le sue immagini restano sul suo telefono; per pubblicarle le esporta e si mettono in `triad-img/`.
- I file dati enormi (`triad-cards/exp/chars/imgs/art.js`) non si leggono con Read: usare script Node.
