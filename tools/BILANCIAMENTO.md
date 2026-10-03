# Bilanciamento delle carte

Come sono decisi i numeri delle carte del Raccoon Triad, e come rifarlo quando si aggiungono carte.
Il metodo è quello dei giochi di carte collezionabili (bilancio di potenza per livello, profili, simulazione e correzione delle carte fuori fascia), adattato alle regole del Triple Triad.

## 1. Cosa rende forte una carta nel Triple Triad
- **Il lato più alto conta più della somma.** Un 8 batte quasi tutto quello che ha davanti; due lati da 4 non battono niente. Misurato: un punto in più sul tetto del lato vale circa un punto di somma.
- **Gli angoli.** Una carta in un angolo mostra solo 2 lati vicini: chi ha due lati vicini forti (profilo «Angolo») è fortissimo in apertura, ma gli altri due lati sono deboli.
- **Uguale e Più** premiano i numeri che si ripetono e le somme facili da pareggiare: le carte «a Punta» e «a Croce» hanno combinazioni diverse da quelle «Equilibrate».
- **Chi chiude vince più spesso.** Chi muove per secondo gioca l'ultima carta, che non si può più girare: nelle simulazioni chi inizia vince solo il 32-48% delle partite decise. Per questo chi inizia si sceglie a caso, e il potenziamento della Torre è «Ultima parola» (apre il rivale), non «Prima mossa».

## 2. Regole fisse dei numeri (tools/build-triad-cards.js)
| Livello | Somma dei 4 lati | Lato più alto | Lato più basso |
|---|---|---|---|
| 1 | 12-13 | 5 | 1 |
| 2 | 14-15 | 5 | 1 |
| 3 | 15 | 6 | 1 |
| 4 | 17-18 | 6 | 2 |
| 5 | 18-19 | 7 | 2 |
| 6 | 20-21 | 7 | 2 |
| 7 | 21-22 | 8 | 2 |
| 8 | 23-24 | 8 | 2 |
| 9 | 24 | A (metà delle carte) o 9 | 2 |
| 10 | 26-27 | A (tutte) | 2 |

- Il tetto del lato sale ogni due livelli; nei livelli dove sale, la somma sale di 1 invece di 2. Così **ogni livello vale lo stesso salto**.
- Al massimo una A per carta.
- **Profili per livello (20 carte):** 5 Equilibrate, 7 d'Angolo, 4 a Punta, 4 a Croce. I lati forti ruotano su tutte e quattro le direzioni: in tutto il set alto, destra, basso e sinistra hanno circa la stessa forza.
- Gli elementi sono scelti a mano sul personaggio (Charmander fuoco, Squirtle acqua…); circa 6 carte su 10 ne hanno uno.

## 3. Simulazione e correzione
`node tools/build-triad-cards.js --balance 3000` fa giocare l'IA (livello 3) contro sé stessa: per ogni livello 3000 partite tra mazzi casuali di quel livello, alternando 8 combinazioni di regole (nessuna, Uguale, Più, Elementale, Uguale+Più+Combo, tutte, Uguale-muro, caselle speciali).
- Ogni carta ha la sua percentuale di vittorie. La fascia giusta è **44-56%**.
- Una carta troppo forte perde un punto sul lato più alto (o lo sposta sul più basso); una troppo debole fa il contrario. Si rigioca finché tutte stanno nella fascia (al massimo 8 giri).
- Le carte delle espansioni si misurano mescolate alle carte base dello stesso livello.
- I valori finali si fissano in `tools/triad-balance.json`: rilanciare lo script non li cambia, quindi si possono correggere nomi, giochi e scene senza toccare i numeri.

## 4. Risultati attuali
RISULTATI

## 5. Aggiungere carte (espansioni future)
1. Aggiungi i personaggi in `tools/triad-exp-src.js` (o in `tools/triad-cards-src.js` per il set base) con il livello giusto: **personaggi riconoscibili anche da chi non è appassionato**; ai livelli bassi creature e nemici minori, ai livelli alti eroi e cattivi famosi.
2. `node tools/build-triad-cards.js --balance 3000`: le carte nuove ricevono valori di partenza secondo le regole sopra e vengono corrette; le vecchie restano uguali.
3. `node tools/build-triad-assets.js`, poi le immagini (`node tools/build-triad-art.js --only id1,id2` o dal gioco con «Cambia immagine»).
4. Le espansioni **non aggiungono potenza**: stessi livelli 1-10, stesse regole dei numeri. La novità sono i personaggi, le combinazioni e le regole del momento, non carte più forti.

Solo se cambiano le regole dei numeri (tabella sopra): `--fresh --balance` rifà tutti i lati da zero.
