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
controls.append(btn,reload);status.append(head,detail,controls);
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