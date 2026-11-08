/* Torre de América V2 P0.5R3 — Instalación QA con worker de scope /v2/.
 * Se activa exclusivamente al ingresar con ?pwa=1.
 * La instalación no implica licencia activa ni acceso offline al juego.
 */
(function(){
"use strict";
const qs=new URLSearchParams(location.search);
if(qs.get("pwa")!=="1")return;
if(!location.pathname.includes("/torre-america/v2/"))return;
window.TA_PWA_QA={version:"P0.5R3",install:"pending",offlineGameplay:false};
const supported=("serviceWorker" in navigator);
let promptEvent=null,registration=null;
const status=document.createElement("aside");
status.id="taPwaQA";
status.setAttribute("aria-label","Diagnóstico de instalación V2");
status.style.cssText="position:fixed;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:9999;width:min(350px,calc(100vw - 24px));background:#103024;color:#f5f0db;border:1px solid #e4c279;border-radius:15px;padding:13px 15px;font:13px/1.5 system-ui;box-shadow:0 12px 38px #0009";
const head=document.createElement("div");head.textContent="PWA V2 · INSTALACIÓN DE PRUEBA";head.style.cssText="font-weight:900;color:#f5d58d;margin-bottom:5px";
const detail=document.createElement("div");
detail.style.cssText="color:#d4e5d5;font-size:12px";
const controls=document.createElement("div");controls.style.cssText="display:flex;gap:9px;margin-top:10px";
const btn=document.createElement("button");btn.type="button";btn.textContent="Instalar V2 QA";
btn.style.cssText="font:800 13px system-ui;border:0;border-radius:10px;background:#eed083;color:#14221c;padding:10px 13px;cursor:pointer";
btn.disabled=true;
const reload=document.createElement("button");reload.type="button";reload.textContent="Revisar";
reload.style.cssText="font:800 13px system-ui;border:1px solid #7fa58d;border-radius:10px;background:#214535;color:#edf5e9;padding:10px 13px;cursor:pointer";
const diagnostic=document.createElement("button");diagnostic.type="button";diagnostic.textContent="Comprobar convivencia";
diagnostic.style.cssText="font:800 12px system-ui;border:1px solid #8fb39b;border-radius:10px;background:#244e37;color:#f0f6e9;padding:10px 12px;cursor:pointer";
const feedback=document.createElement("div");feedback.style.cssText="font-size:12px;color:#dcead7;margin-top:9px;white-space:pre-wrap";
const copy=document.createElement("button");copy.type="button";copy.textContent="Copiar informe QA";
copy.style.cssText="display:none;font:800 12px system-ui;border:1px solid #8fb39b;border-radius:9px;background:#183729;color:#eff7e9;padding:9px 12px;margin-top:8px;cursor:pointer";
controls.append(btn,reload);status.append(head,detail,controls,diagnostic,feedback,copy);
async function runCoexistenceQA(){
 const prefix="/torre-america/";
 const regs=supported?await navigator.serviceWorker.getRegistrations():[];
 const own=regs.filter(r=>r.scope.includes(prefix));
 const v1=own.find(r=>r.scope.endsWith(prefix));
 const v2=own.find(r=>r.scope.endsWith(prefix+"v2/"));
 const controller=navigator.serviceWorker?.controller?.scriptURL||"";
 const cacheNames=(typeof caches==="undefined")?[]:await caches.keys();
 const oldCaches=cacheNames.filter(k=>k.startsWith("torre-america-v1-"));
 const newCaches=cacheNames.filter(k=>k.startsWith("ta-v2-qa-"));
 const manifest=document.querySelector('link[rel="manifest"]')?.href||"";
 const report={
  version:"P0.5R4",origin:location.origin,scopeExpected:location.origin+prefix+"v2/",
  v1Registered:!!v1,v2Registered:!!v2,
  v2WorkerActive:!!v2?.active,
  v2ControllingPage:controller.includes(prefix+"v2/sw.js"),
  manifestV2:manifest.includes(prefix+"v2/manifest.webmanifest"),
  v1CachePresent:oldCaches.length>0,
  v2CachePresent:newCaches.length>0,
  v1CacheGlobalDeletionRisk:!!v1,
  offlineGameplayEnabled:false,
  requiresRealDeviceValidation:true
 };
 window.TA_PWA_QA.report=report;
 feedback.textContent=(report.v2ControllingPage?"✓ V2 controla esta página":"! V2 todavía no controla esta página")+
 "\n"+(report.v2CachePresent?"✓ Caché V2 presente":"! Caché V2 ausente")+
 "\n"+(report.v1Registered?"Aviso: V1 también está registrada; probar actualización de caché.":"V1 no registrada en este navegador.");
 copy.style.display="inline-block";
 return report;
}
diagnostic.addEventListener("click",()=>runCoexistenceQA().catch(err=>{
 feedback.textContent="No se pudo completar el diagnóstico: "+String(err?.message||err);
}));
copy.addEventListener("click",async()=>{
 const text=JSON.stringify(window.TA_PWA_QA.report||{},null,2);
 try{await navigator.clipboard.writeText(text);copy.textContent="Informe copiado"}
 catch(e){feedback.textContent+="\nNo se pudo copiar; revisá los permisos del navegador."}
});
document.body.appendChild(status);
function refresh(){
 const ctrl=navigator.serviceWorker?.controller;
 const path=ctrl?.scriptURL||"";
 const isolated=path.includes("/torre-america/v2/sw.js");
 window.TA_PWA_QA.controller=isolated?"V2":path?"OTRO":"NINGUNO";
 detail.textContent=isolated?"Control de V2 activo. Sin conexión: pantalla segura, el juego requiere licencia online.":
  registration?"Worker V2 registrado. Si la página sigue bajo V1, recargala con internet para activar el nuevo control.":
  "Verificando worker V2…";
 btn.disabled=!promptEvent;
 window.TA_PWA_QA.install=promptEvent?"installable":"manual-or-pending";
 window.TA_PWA_QA.registrationScope=registration?.scope||null;
}
window.addEventListener("beforeinstallprompt",event=>{
 event.preventDefault();promptEvent=event;refresh();
});
window.addEventListener("appinstalled",()=>{
 promptEvent=null;detail.textContent="Instalación de V2 completada. La edición sigue en QA.";
 window.TA_PWA_QA.install="installed";btn.disabled=true;
});
btn.addEventListener("click",async()=>{
 if(!promptEvent)return;
 const event=promptEvent;promptEvent=null;btn.disabled=true;
 try{await event.prompt();await event.userChoice}
 catch(e){detail.textContent="No se pudo abrir el instalador: "+String(e?.message||e)}
 refresh();
});
reload.addEventListener("click",refresh);
if(supported&&/^https?:$/.test(location.protocol)){
 const sw=new URL("sw.js",location.href).href;
 const scope=new URL("./",location.href).href;
 navigator.serviceWorker.register(sw,{scope}).then(reg=>{
  registration=reg;window.TA_PWA_QA.registered=true;refresh();
 }).catch(e=>{
  window.TA_PWA_QA.registered=false;
  detail.textContent="No se pudo registrar el worker V2: "+String(e?.message||e);
 });
 navigator.serviceWorker.addEventListener("controllerchange",refresh);
}else{
 detail.textContent="El navegador no permite Service Workers. Usá HTTPS y un navegador compatible.";
 window.TA_PWA_QA.registered=false;
}
refresh();
})();