/* MP06B · No precachear consignas. Cache seguro y navegación siempre network-first. */
const CACHE='pasalochevere-yenga-borracho-mp07a2-party-intro';
const CORE=['./','./index.html','./license-gate.js','./intro.js','./intro.css','./app.js','./manuals.js','./manifest.webmanifest','./icon.svg','./modo-previa-party-pop.svg','./product-set.b64','./product-tower.b64','./manual-juego.b64','./guia-webapp.b64'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('pasalochevere-yenga-borracho-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.endsWith('/jenga-borracho/data.js')){
    event.respondWith(Promise.resolve(new Response('Consignas disponibles solo con licencia.',{status:410,headers:{'Content-Type':'text/plain','Cache-Control':'no-store'}})));
    return;
  }
  if(event.request.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/license-gate.js')){
    event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(res=>{
    if(res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}
    return res;
  })));
});