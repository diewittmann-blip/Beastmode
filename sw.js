/* Beastmode Service Worker: legt die App beim ersten Öffnen offline ab.
   Bei jeder neuen Version die Zahl hinter beastmode- erhöhen. */
const CACHE='beastmode-1';
const FILES=['./','./index.html','./manifest.webmanifest','./icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png',
'./fonts/barlow-latin-400-normal.woff2','./fonts/barlow-latin-500-normal.woff2','./fonts/barlow-latin-600-normal.woff2','./fonts/barlow-condensed-latin-600-normal.woff2','./fonts/barlow-condensed-latin-700-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{
    if(res&&res.ok&&new URL(e.request.url).origin===location.origin){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}
    return res;
  }).catch(()=>e.request.mode==='navigate'?caches.match('./index.html'):undefined)));
});
