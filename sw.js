// Service worker: network-first con cache offline (GitHub Pages tiene i file in cache 10 min).
const CACHE = 'raccoon-triad-v2';
const SHELL = ['./', 'index.html', 'shell.js', 'qrcode.min.js', 'manifest.webmanifest', 'triad.js', 'triad.css', 'triad-core.js', 'triad-cards.js', 'triad-exp.js', 'triad-chars.js', 'triad-imgs.js', 'triad-art.js', 'triad-play.js', 'triad-online.js', 'triad-cosm.js', 'triad-extra.js', 'triad-config.js', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e=>{ self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c=> Promise.all(SHELL.map(u=> c.add(new Request(u, {cache: 'reload'})).catch(()=>{}))))); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(ks=> Promise.all(ks.filter(k=> k !== CACHE).map(k=> caches.delete(k)))).then(()=> self.clients.claim())); });
self.addEventListener('fetch', e=>{
  const r = e.request; if(r.method !== 'GET' || !r.url.startsWith(self.location.origin)) return;
  e.respondWith(fetch(r, {cache: 'no-cache'}).then(res=>{ const cp = res.clone(); caches.open(CACHE).then(c=> c.put(r, cp)).catch(()=>{}); return res; }).catch(()=> caches.match(r, {ignoreSearch: true})));
});
