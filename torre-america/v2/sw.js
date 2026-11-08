/* Torre de América V2 · SW de pruebas, scope EXCLUSIVO /torre-america/v2/
 * Aísla el caché y nunca elimina ni modifica cachés de V1.
 * Navegación offline: solo pantalla explicativa, NUNCA abre juego sin validar.
 */
const PREFIX="ta-v2-qa-";
const CACHE=PREFIX+"20261108-p05r3";
const ROOT=new URL("./",self.location.href).href;
const SHELL=[
 new URL("./",ROOT).href,
 new URL("index.html",ROOT).href,
 new URL("offline.html",ROOT).href,
 new URL("manifest.webmanifest",ROOT).href
];
self.addEventListener("install",event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.addAll(SHELL);
  await self.skipWaiting();
 })());
});
self.addEventListener("activate",event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  // Solo se limpian versiones de este worker; jamás cachés ajenos ni los de V1.
  await Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)));
  await self.clients.claim();
 })());
});
self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET")return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;
 const inScope=url.href.startsWith(ROOT);
 const isNavigation=req.mode==="navigate";
 if(isNavigation&&!inScope)return;
 if(isNavigation){
  event.respondWith((async()=>{
   // Nunca guardar tokens de acceso ni respuestas autenticadas bajo URL con query.
   try{
    const fresh=await fetch(req);
    if(fresh.ok&&url.search===""){
      const cache=await caches.open(CACHE);
      await cache.put(new URL("index.html",ROOT).href,fresh.clone());
    }
    return fresh;
   }catch(_error){
    const cache=await caches.open(CACHE);
    return (await cache.match(new URL("offline.html",ROOT).href))||
     new Response("Conectate para validar Torre de América V2.",{status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}});
   }
  })());
  return;
 }
 // Todo recurso estático es network-first. No guardar servicios externos.
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{
   const fresh=await fetch(req);
   if(fresh.ok&&fresh.type!=="opaque"&&!url.searchParams.has("access")){
    try{await cache.put(req,fresh.clone())}catch(_e){}
   }
   return fresh;
  }catch(_e){
   return (await cache.match(req))||Response.error();
  }
 })());
});