// Dove cercare le illustrazioni dei personaggi: per ogni carta una o più «parti» [wiki, ricerca]. Più parti = più personaggi sulla stessa carta.
// Le wiki sono tutte MediaWiki: si interrogano con la stessa API (nessuna chiave). Se una carta non ha voce qui, non si tocca.
// Opzioni per parte: cut = togli lo sfondo uniforme anche se scuro, file = titolo esatto del file (per scegliere a mano l'immagine), re = espressione che il nome del file deve rispettare.
const F = n=> 'https://' + n + '.fandom.com/api.php';
const WIKIS = {
  mario: F('mario'), mariowiki: 'https://www.mariowiki.com/api.php', zelda: F('zelda'), sonic: F('sonic'), ff: F('finalfantasy'), dq: F('dragonquest'), chrono: F('chrono'),
  sf: F('streetfighter'), pacman: F('pacman'), doom: F('doom'), minecraft: F('minecraft'), gta: F('gta'), hl: F('half-life'), mgs: F('metalgear'), witcher: F('witcher'),
  ds: F('darksouls'), elden: F('eldenring'), rdr: F('reddead'), mm: F('megaman'), re: F('residentevil'), sh: F('silenthill'), alien: F('avp'), smb: F('supermeatboy'),
  braid: F('braid'), isaac: F('bindingofisaac'), es: F('elderscrolls'), tetris: F('tetris'), bulba: 'https://bulbapedia.bulbagarden.net/w/api.php', uesp: 'https://en.uesp.net/w/api.php',
  commons: 'https://commons.wikimedia.org/w/api.php'
};
const SRC = {
  'super-mario-bros': [['mariowiki', 'Mario']],
  'super-mario-64': [['mariowiki', 'Mario', {re: /64/i}]],
  'super-mario-kart': [['mariowiki', 'Mario', {q: 'Mario Kart artwork Mario', re: /kart/i}], ['mariowiki', 'Luigi', {q: 'Mario Kart artwork Luigi', re: /kart/i}]],
  'the-legend-of-zelda-ocarina-of-time': [['zelda', 'Link', {q: 'OoT Link Artwork', re: /OoT/}]],
  'the-legend-of-zelda-breath-of-the-wild': [['zelda', 'Link', {re: /breath|BotW/i}]],
  'tetris': [['steam', 1003590]],
  'pokemon-rosso-e-blu': [['bulba', 'Charizard (Pokémon)'], ['bulba', 'Blastoise (Pokémon)'], ['bulba', 'Venusaur (Pokémon)']],
  'final-fantasy-vii': [['ff', 'Cloud Strife', {re: /FFVII|VII/}]],
  'final-fantasy-iv': [['ff', 'Cecil Harvey']],
  'street-fighter-ii': [['sf', 'Ryu'], ['sf', 'Ken Masters']],
  'pac-man': [['pacman', 'Pac-Man']],
  'doom': [['doom', 'Doomguy', {q: 'Doom Slayer render artwork'}]],
  'minecraft': [['minecraft', 'Steve'], ['minecraft', 'Creeper']],
  'grand-theft-auto-v': [['steam', 271590]],
  'half-life-2': [['steam', 220]],
  'chrono-trigger': [['chrono', 'Crono'], ['chrono', 'Marle'], ['chrono', 'Lucca']],
  'chrono-cross': [['chrono', 'Serge', {file: 'File:CC Serge Artwork Remaster.png'}], ['chrono', 'Kid', {file: 'File:CC Kid Artwork Remaster.png'}]],
  'metal-gear-solid': [['mgs', 'Solid Snake', {file: 'File:Mgsart2.png'}]],
  'the-elder-scrolls-v-skyrim': [['steam', 489830]],
  'the-witcher-3-wild-hunt': [['witcher', 'Geralt of Rivia', {re: /witcher ?3|W3|TW3/i}]],
  'dark-souls': [['ds', 'Black Knight', {file: 'File:Dark Souls Black Knight Official Art HD.jpg'}]],
  'elden-ring': [['elden', 'Tarnished']],
  'red-dead-redemption-2': [['rdr', 'Arthur Morgan']],
  'dragon-quest-iii': [['dq', 'Hero (Dragon Quest III)']],
  'sonic-the-hedgehog-2': [['sonic', 'Sonic the Hedgehog', {file: 'File:Sonic 2 Japanese artwork Sonic and Tails.png'}]],
  'mega-man-x': [['mm', 'X', {file: 'File:X standard armor.jpg'}]],
  'resident-evil': [['re', 'Jill Valentine', {cut: true}], ['re', 'Chris Redfield', {cut: true}]],
  'silent-hill': [['sh', 'Harry Mason', {file: 'File:Harry cheryl.PNG'}]],
  'alien-isolation': [['steam', 214490]],
  'super-meat-boy': [['smb', 'Meat Boy'], ['smb', 'Bandage Girl']],
  'braid': [['steam', 26800]],
  'the-binding-of-isaac': [['isaac', 'Isaac']]
};
module.exports = {WIKIS, SRC};
