/* Torre de América V2.0 — QA P0.4 · Diagnóstico de solo lectura.
 * Se activa con ?qa=1 DESPUÉS de validar la licencia.
 * No muestra códigos de acceso ni datos personales, no cambia el juego.
*/
(function(){
 "use strict";
 if(new URLSearchParams(location.search).get("qa")!=="1")return;
 const ids=["home","settings","how","format","mode","players","difficulty","summary","turn","blocks","digitalblock","challenge","answer","result","dice","penalty","power","shootout","scores","gameover"];
 const buttons=["resumeBtn","formatOpts","modeOpts","playersList","diffOpts","blockGrid","challengeHud","questionText","answerText","diceBtn","powerOptions","shootReady","shootActions","scoreBox","winnerName"];
 const $=id=>document.getElementById(id);
 const results=[];
 function check(name,success,details="",severity="error"){
   results.push({name,ok:!!success,details:String(details||""),severity});
 }
 function auditData(){
   const content=typeof DB!=="undefined"?DB?.content:null;
   const penalties=typeof DB!=="undefined"?DB?.penalties:null;
   check("Biblioteca de 162 consignas",Array.isArray(content)&&content.length===162,content?.length??"sin datos");
   check("Biblioteca de 60 penales",Array.isArray(penalties)&&penalties.length===60,penalties?.length??"sin datos");
   if(!Array.isArray(content)||!Array.isArray(penalties))return;
   const all=[...content,...penalties],unique=new Set(all.map(x=>x.id));
   check("Identificadores únicos",unique.size===all.length,all.length+" elementos / "+unique.size+" identificadores");
   for(const difficulty of ["FACIL","MEDIO","LEYENDA"]){
     const group=content.filter(x=>x.difficulty===difficulty);
     const blockNumbers=new Set(group.map(x=>x.block));
     const expected=Array.from({length:54},(_,i)=>i+1);
     check("54 bloques "+difficulty,group.length===54&&expected.every(x=>blockNumbers.has(x)),group.length+" consignas; "+blockNumbers.size+" bloques");
     check("20 penales "+difficulty,penalties.filter(x=>x.difficulty===difficulty).length===20);
   }
   const invalid=content.filter(x=>!x.question||!x.answer||!Number.isInteger(x.timer)||x.timer<0||!x.category);
   check("Consignas completas",invalid.length===0,invalid.length+" problemas");
   const mismatch=content.filter(x=>{
     const match=x.question.match(/(\d{1,3})\s*segundos?/i);
     return !!match&&Number(match[1])!==x.timer;
   });
   check("Tiempos de texto coherentes",mismatch.length===0,mismatch.map(x=>x.id).slice(0,6).join(", ")||"sin diferencias");
   const editorial=window.TA_EDITORIAL_QA;
   check("Revisión editorial aplicada",editorial?.curated===37&&editorial?.creative===23,
     editorial?editorial.curated+" reescritas + "+editorial.creative+" creativas":"No disponible", "warning");
 }
 function auditUI(){
   check("20 pantallas en el DOM",ids.every(id=>!!$(id)),ids.filter(id=>!$(id)).join(", ")||"completas");
   check("Controles esenciales",buttons.every(id=>!!$(id)),buttons.filter(id=>!$(id)).join(", ")||"completos");
   check("Acceso validado",!!$("licenseGate")?.classList.contains("hidden")&&$("app")?.style.display!=="none",
     "Sin mostrar datos de licencia");
   check("Iconografía SVG local",window.TA_ICON_QA?.iconsLocal===true,
     window.TA_ICON_QA?.glyphs+" íconos"||"No disponible","warning");
   check("Efectos premium cargados",!!window.TA_MOTION_QA?.version,
     window.TA_MOTION_QA?.version||"No disponible","warning");
   check("Protecciones P0.4 activas",window.TA_QA_P04_GUARDS?.guards?.length===3,
     window.TA_QA_P04_GUARDS?.guards?.join(", ")||"No disponibles","warning");
   const warnings=window.TA_PREVIEW_LOAD_WARNINGS||[];
   check("Recursos complementarios cargados",warnings.length===0,
     warnings.map(x=>x.path).slice(0,4).join("; ")||"sin fallos", "warning");
   const active=document.querySelector(".screen.active");
   check("Una pantalla activa",document.querySelectorAll(".screen.active").length===1,
     active?.id||"ninguna");
   const vw=document.documentElement.clientWidth;
   const overflow=document.documentElement.scrollWidth-vw;
   check("Sin desbordamiento horizontal",overflow<=3,Math.max(0,overflow)+"px extra · ancho "+vw+"px","warning");
   const tiny=active?Array.from(active.querySelectorAll("button")).filter(x=>{
     const st=getComputedStyle(x);
     if(st.display==="none"||st.visibility==="hidden")return false;
     const b=x.getBoundingClientRect();
     return b.width>0&&b.height>0&&(b.width<42||b.height<42);
   }):[];
   check("Botones visibles de 42px o más",tiny.length===0,tiny.length+" botones pequeños", "warning");
   const systemReduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   check("Respeta movimiento reducido",
     !systemReduced||document.body.classList.contains("ta-r4-no-motion"),
     systemReduced?"Movimiento reducido activado":"Preferencia no activa","warning");
 }
 function runAudit(){
   results.length=0;
   auditData();auditUI();
   const passed=results.filter(x=>x.ok).length;
   const failed=results.filter(x=>!x.ok&&x.severity==="error").length;
   const warning=results.filter(x=>!x.ok&&x.severity==="warning").length;
   const data={title:"Torre de América QA P0.4",timestamp:new Date().toISOString(),
     viewport:document.documentElement.clientWidth+"×"+document.documentElement.clientHeight,
     summary:{passed,failed,warning,total:results.length},
     checks:results.map(({name,ok,details,severity})=>({name,ok,details,severity}))};
   window.TA_QA_P04_REPORT=data;
   return data;
 }
 function mount(){
   if($("taQaP04Launch"))return;
   const trigger=document.createElement("button");
   trigger.id="taQaP04Launch";
   trigger.type="button";trigger.textContent="QA V2.0";
   trigger.setAttribute("aria-label","Abrir diagnóstico técnico de Torre de América");
   trigger.style.cssText="position:fixed;bottom:calc(14px + env(safe-area-inset-bottom));right:14px;z-index:9997;background:#f3d18a;color:#142019;border:1px solid #ffe5ac;border-radius:12px;padding:12px 15px;font:800 13px system-ui;box-shadow:0 12px 30px #0008;cursor:pointer";
   const panel=document.createElement("section");
   panel.setAttribute("role","dialog");panel.setAttribute("aria-label","Auditoría visual y funcional");
   panel.style.cssText="display:none;position:fixed;inset:8% 3% 6%;z-index:9998;max-width:670px;max-height:85dvh;margin:auto;padding:20px;overflow:auto;background:#0b1916;color:#eef7ee;border:1px solid #ddbd7b;border-radius:18px;font:14px/1.5 system-ui;box-shadow:0 25px 70px #000d";
   const row=document.createElement("div");
   row.style.cssText="display:flex;align-items:center;justify-content:space-between;gap:10px";
   const h=document.createElement("h2");h.textContent="QA · Torre de América V2.0";
   h.style.cssText="font-size:20px;margin:0";
   const close=document.createElement("button");
   close.type="button";close.textContent="Cerrar";close.style.cssText="padding:9px 12px;color:#fff;background:#224332;border:1px solid #6c9979;border-radius:9px;cursor:pointer";
   const note=document.createElement("p");
   note.textContent="Diagnóstico de la pantalla actual y la biblioteca. No reemplaza pruebas completas de partida ni inspección visual manual.";
   note.style.cssText="color:#bdcfc5;font-size:12px";
   const status=document.createElement("div");
   const resultsEl=document.createElement("div");
   resultsEl.style.cssText="display:grid;gap:7px";
   const copy=document.createElement("button");
   copy.type="button";copy.textContent="Copiar diagnóstico";
   copy.style.cssText="margin-top:15px;padding:12px 15px;background:#edc66b;border:0;border-radius:11px;color:#152118;font-weight:800;cursor:pointer";
   function fill(){
     const report=runAudit();
     status.textContent=report.summary.passed+" correctos · "+report.summary.failed+" errores · "+report.summary.warning+" advertencias";
     status.style.cssText="padding:12px;margin:11px 0 16px;background:#17392d;border-radius:9px;font-weight:800";
     resultsEl.replaceChildren();
     for(const x of report.checks){
       const el=document.createElement("div");
       el.style.cssText="padding:9px 12px;border:1px solid #28443b;border-radius:10px;background:#102621";
       const label=document.createElement("strong");label.textContent=(x.ok?"✓ ":"! ")+x.name;
       label.style.color=x.ok?"#b6ecc5":x.severity==="error"?"#ffb2b6":"#f3d68b";
       const d=document.createElement("div");d.textContent=x.details;d.style.cssText="font-size:12px;color:#b8cbbf;overflow-wrap:anywhere";
       el.append(label,d);resultsEl.append(el);
     }
   }
   trigger.addEventListener("click",()=>{fill();panel.style.display="block";trigger.style.display="none";close.focus()});
   close.addEventListener("click",()=>{panel.style.display="none";trigger.style.display="block";trigger.focus()});
   copy.addEventListener("click",async()=>{
     const content=JSON.stringify(window.TA_QA_P04_REPORT,null,2);
     try{await navigator.clipboard.writeText(content);copy.textContent="Copiado"}
     catch(e){copy.textContent="No se pudo copiar · revisá permisos"}
   });
   row.append(h,close);panel.append(row,note,status,resultsEl,copy);
   document.body.append(trigger,panel);
 }
 function init(){
   const app=$("app");
   if(!app)return;
   const show=()=>{
     if(app.style.display==="block"&&$("licenseGate")?.classList.contains("hidden")){mount();return true}
     return false;
   };
   if(show())return;
   const observer=new MutationObserver(()=>{if(show())observer.disconnect()});
   observer.observe(app,{attributes:true,attributeFilter:["style"]});
   const gate=$("licenseGate");
   if(gate)observer.observe(gate,{attributes:true,attributeFilter:["class"]});
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
 else init();
})();