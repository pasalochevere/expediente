/* TA-UI V2.0-P0.3R3 · ICONOGRAFÍA DEPORTIVA PREMIUM
 * SVG inline local, sin fuentes ni CDN, sin cambios al motor, intro o licencias.
 * Regeneración visual ante renderizados de turnos, HUD, retos y penales.
 */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const GLYPHS={
 play:'<path d="m8 5 11 7-11 7V5Z" fill="currentColor" stroke="none"/>',
 arrowLeft:'<path d="m14.5 5-7 7 7 7"/><path d="M8 12h13"/>',
 arrowRight:'<path d="m9.5 5 7 7-7 7"/><path d="M16 12H3"/>',
 home:'<path d="m3 11 9-7 9 7v9H3v-9Z"/><path d="M9 20v-6h6v6"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 book:'<path d="M12 6C9.8 4.5 6.5 4.2 3 5v14c3.6-.9 6.8-.7 9 1 2.2-1.7 5.4-1.9 9-1V5c-3.5-.8-6.8-.5-9 1Z"/><path d="M12 6v14"/>',
 settings:'<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="#112a21"/><circle cx="16" cy="12" r="2" fill="#112a21"/><circle cx="8" cy="18" r="2" fill="#112a21"/>',
 sound:'<path d="M4 9h4l5-4v14l-5-4H4V9Z"/><path d="M16 9c1.6 1.4 1.6 4.6 0 6M18.5 6c3.3 3.3 3.3 8.7 0 12"/>',
 vibrate:'<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M10.5 17.5h3M3 8v8M21 8v8"/>',
 sparkles:'<path d="m12 2 2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2Z"/><path d="m19 18 .8 1.8 1.8.8-1.8.8-.8 1.6-.8-1.6-1.8-.8 1.8-.8L19 18Z"/>',
 refresh:'<path d="M20 8a8.6 8.6 0 0 0-14-2.5L3 9"/><path d="M3 4v5h5"/><path d="M4 16a8.6 8.6 0 0 0 14 2.5l3-3.5"/><path d="M21 20v-5h-5"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5"/><path d="M4 17v4h16v-4"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c.4-4.4 3.4-6.5 8-6.5s7.6 2.1 8 6.5"/>',
 userPlus:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-4 3-6 6.5-6s6 2 6.5 6M18 8v8M14 12h8"/>',
 users:'<circle cx="8" cy="8" r="3"/><circle cx="16.5" cy="9" r="2.7"/><path d="M2.4 20c.4-4.3 2.2-6.2 5.6-6.2s5.3 1.9 5.6 6.2M14.5 14c4.3-.2 6.3 2.3 6.7 6"/>',
 trophy:'<path d="M7 3h10v8a5 5 0 0 1-10 0V3Z"/><path d="M7 5H3v2a5 5 0 0 0 4.5 4.9M17 5h4v2a5 5 0 0 1-4.5 4.9M12 16v4M8 21h8"/>',
 medal:'<circle cx="12" cy="15.5" r="5"/><path d="m7 3 5 8 5-8M7 3h4l2 4 2-4h3"/><path d="m12 12 .8 2 2.2.1-1.8 1.4.7 2.1-1.9-1.3-1.9 1.3.7-2.1-1.8-1.4 2.2-.1.8-2Z"/>',
 star:'<path d="m12 2 3.1 6.5 7.1 1-5.1 5 .9 7-6-3.3-6 3.3.9-7-5.1-5 7.1-1L12 2Z"/>',
 shield:'<path d="m12 2 8 4v6c0 5.3-3.4 8.3-8 10-4.6-1.7-8-4.7-8-10V6l8-4Z"/><path d="m9 12 2.2 2.1 4-4.3"/>',
 heart:'<path d="M20.7 8.2c0 4.2-8.7 10.7-8.7 10.7S3.3 12.4 3.3 8.2a4.7 4.7 0 0 1 8.7-2.4 4.7 4.7 0 0 1 8.7 2.4Z"/>',
 check:'<path d="m4.5 12.5 5 5L20 6.5"/>',
 checkCircle:'<circle cx="12" cy="12" r="9"/><path d="m7.5 12 3 3 6-6"/>',
 cross:'<path d="M5 5 19 19M19 5 5 19"/>',
 warning:'<path d="M12 3 22 21H2L12 3Z"/><path d="M12 9v5M12 18h.01"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>',
 history:'<path d="M4 7A9 9 0 1 1 3 13"/><path d="M4 2v5h5M12 7v5l3.5 2"/>',
 duel:'<path d="m4 4 16 16M20 4 4 20"/><path d="m3 7 4-4M17 21l4-4M17 3l4 4M3 17l4 4"/>',
 lightning:'<path d="m13.8 2-9 11h6.8L10.2 22l9-12h-6.8L13.8 2Z"/>',
 flame:'<path d="M13 2c.9 4-2.4 5.5-1.5 9.4-2-1.1-2.9-2.6-2.4-5.3C5.8 9.9 5.5 13 6.1 16a6.3 6.3 0 0 0 12.3.1c.7-3.8-1-6.2-2.6-8-1 3.3-2.7 3.3-2.8 4.2C12 10.1 15.1 6.7 13 2Z"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.8"/><path d="m16 16 5 5"/>',
 trivia:'<path d="M9.1 8.2c.3-1.4 1.5-2.5 3.1-2.5 1.8 0 3.1 1 3.1 2.5 0 2-3.1 2.1-3.1 5"/><circle cx="12.2" cy="17.6" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="10" stroke-opacity=".45"/>',
 ball:'<circle cx="12" cy="12" r="9.4"/><path d="m12 7-4.3 3 1.7 5h5.2l1.7-5L12 7Z"/><path d="M12 7V2.7M7.7 10 3.2 8.4M9.4 15l-3.2 4M14.6 15l3.2 4M16.3 10l4.5-1.6"/>',
 tower:'<rect x="4" y="3" width="16" height="5" rx="1"/><rect x="4" y="10" width="16" height="5" rx="1"/><rect x="4" y="17" width="16" height="5" rx="1"/><path d="M10 3v5M14 10v5M10 17v5"/>',
 smartphone:'<rect x="6" y="2.5" width="12" height="19" rx="2.4"/><path d="M10 5h4M11 18.7h2"/><circle cx="12" cy="12" r="2.3"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6.5v6l4 2.5"/>',
 stadium:'<path d="M2 11c2.5-3.2 6-4.7 10-4.7S19.5 7.8 22 11v7H2v-7Z"/><path d="M4 11c3.3 2.7 12.7 2.7 16 0M8 7.2V4.5M16 7.2V4.5M2 18h20M7 18v-4M17 18v-4"/>',
 whistle:'<circle cx="14.5" cy="12.5" r="5"/><circle cx="14.5" cy="12.5" r="1.5"/><path d="M10 11H3V8h7M10 15H3v3h7M17 8.3 20.5 6l1.5 2.2-3.2 3"/>',
 jersey:'<path d="m8 4 4 2 4-2 4 3 2 4-4 2-2-2v10H8V11l-2 2-4-2 2-4 4-3Z"/><path d="M9.5 7.5c1.5 2 3.5 2 5 0"/>',
 ten:'<path d="m8 4 4 2 4-2 4 3 2 4-4 2-2-2v10H8V11l-2 2-4-2 2-4 4-3Z"/><path d="M9 12h2v5m3-5v5m0-5h2v5h-2" stroke-width="1.4"/>',
 redCard:'<rect x="6" y="2.5" width="12" height="19" rx="1.2"/><path d="M9 6h6M9 9h6"/>',
 megaphone:'<path d="M3 10h5L20 5v14L8 14H3v-4Z"/><path d="m7 14 2 7h4l-2.7-6.2M21 8l1 1M21 16l1-1"/>',
 fast:'<path d="m3 8 6 4-6 4V8Zm9 0 6 4-6 4V8ZM19 6v12"/>',
 goal:'<path d="M3 21V5h18v16M3 9h18M7 5v16M12 5v16M17 5v16M3 13h18M3 17h18"/><circle cx="12" cy="17" r="3" fill="#17392c"/>',
 glove:'<path d="M6 19c-1-1.8-3-4.7-3-6.5 0-1.8 2-2.3 3-1l1 1V5.8c0-1.8 2.6-1.8 2.6 0v5-7c0-1.7 2.5-1.8 2.5 0v6.2-5c0-1.7 2.4-1.7 2.4 0v5-3.2c0-1.7 2.5-1.7 2.5 0v7.2c0 3.2-1.3 5.4-3.3 7H8Z"/>',
 dice:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="16.5" cy="7.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="7.5" cy="16.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="16.5" cy="16.5" r="1.2" fill="currentColor" stroke="none"/>',
 monitor:'<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 22h8m-4-4v4M7 9h10M7 13h7"/>',
 scoreboard:'<rect x="2.5" y="4" width="19" height="16" rx="2"/><path d="M12 4v16M5.5 9h4M14.5 9h4M7.5 13v3M16.5 13v3"/>',
 crown:'<path d="m2 7 5 5 5-8 5 8 5-5-2 13H4L2 7Z"/><path d="M5 17h14"/>',
 rotate:'<path d="M20 10a8 8 0 1 0-1 6"/><path d="M20 4v6h-6"/>',
 shuffle:'<path d="M3 7h4c4 0 6 10 10 10h4M18 14l3 3-3 3M3 17h4c2 0 3-1 4.5-3M18 4l3 3-3 3M14 9c1-1 2-2 3-2h4"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 0 1 5.2 0c0 1.6-2.7 2.1-2.7 4.1M12 17h.01"/>'
};
const CONFIG={
 category:{TRIVIA:"trivia",HISTORIA:"history",DUELO:"duel",LOCURA:"flame",DESAFIO:"target",QUIEN_SOY:"search"},
 event:{CAPITAN:"star",HINCHADA:"megaphone",CONTRAATAQUE:"fast",EL_10:"ten",LA_COPA:"trophy",ROJA:"redCard",PENALES:"goal",FINAL:"trophy",DADO:"dice",REMONTADA:"refresh",VAR:"monitor",REPLAY:"refresh"}
};
const PREFIX=/^(?:[\p{Extended_Pictographic}\uFE0F\u200D\u20E3\u2600-\u27BF\u{1F1E6}-\u{1F1FF}]\s*)+/u;
function stripEmoji(text){return String(text||"").replace(PREFIX,"").trim();}
function icon(name,cls=""){
 const el=document.createElementNS(NS,"svg");
 el.setAttribute("viewBox","0 0 24 24");
 el.setAttribute("fill","none");
 el.setAttribute("stroke","currentColor");
 el.setAttribute("stroke-width","2");
 el.setAttribute("stroke-linecap","round");
 el.setAttribute("stroke-linejoin","round");
 el.setAttribute("aria-hidden","true");
 el.setAttribute("focusable","false");
 el.setAttribute("class","ta-icon ta-icon-"+name+(cls?" "+cls:""));
 el.innerHTML=GLYPHS[name]||GLYPHS.ball;
 return el;
}
function standalone(node,name){
 if(!node||node.querySelector(":scope > .ta-icon"))return;
 const text=stripEmoji(node.textContent);
 node.replaceChildren(icon(name,"ta-icon-emblem"));
 node.classList.add("ta-svg-host");
 if(text)node.setAttribute("aria-label",text);
}
function nameForAction(btn){
 const act=btn.getAttribute("onclick")||"";
 const t=stripEmoji(btn.textContent).toUpperCase();
 const match=(str)=>act.includes(str);
 if(match("diceResult('GOL')"))return "goal";
 if(match("diceResult('ATAJADA')"))return "glove";
 if(match("diceResult('VAR')"))return "monitor";
 if(match("diceResult('REPLAY')"))return "refresh";
 if(match("diceResult('FALTA')"))return "redCard";
 if(match("diceResult('PENAL')"))return "ball";
 if(match("resolve(true)")||match("finishPenalty(true)")||match("finishShootoutKick(true)"))return "checkCircle";
 if(match("resolve(false)")||match("finishPenalty(false)")||match("finishShootoutKick(false)"))return "glove";
 if(match("goHome")||match("go('home')"))return "home";
 if(match("afterResult")||match("enterCurrentContent")||match("continueToChallenge")||match("go('mode')")||match("go('players')")||match("go('difficulty')")||match("go('summary')"))return "arrowRight";
 if(match("showScores")||match("go('scores')"))return "scoreboard";
 if(match("showDice")||match("randomDice"))return "dice";
 if(match("startTimer"))return "clock";
 if(match("showPenaltyAnswer")||match("showShootoutAnswer")||match("revealAnswer"))return "book";
 if(match("startPenalty")||match("startShootoutKick")||match("openPenalty"))return "ball";
 if(match("drawDigitalBlock")||match("go('digitalblock')"))return "smartphone";
 if(match("go('blocks')"))return "tower";
 if(match("towerFell")||match("forfeitPenalty")||match("endGameByScore"))return "warning";
 if(match("rematch")||match("newGame")||match("playRepeated")||match("resumeGame"))return "refresh";
 if(match("installApp"))return "download";
 if(match("toggleSetting"))return "settings";
 if(match("playFx"))return "sound";
 if(match("startGame")||match("go('format')"))return "play";
 if(match("go('how')"))return "book";
 if(match("go('settings')"))return "settings";
 if(match("go("))return "arrowLeft";
 if(match("addPlayer"))return "userPlus";
 if(match("removePlayer"))return "cross";
 if(match("savePlayers"))return "arrowRight";
 if(match("randomDice"))return "dice";
 if(match("chooseRedTarget")||match("applyRed"))return "redCard";
 if(match("setCaptainHelper"))return "star";
 if(match("setContraTarget"))return "fast";
 if(match("setEl10Responder"))return "ten";
 if(match("activateHinchada"))return "megaphone";
 if(match("finish"))return "checkCircle";
 if(t.includes("VER INTRO"))return "play";
 if(t.includes("AJUSTES")||t.includes("AUDIO"))return "settings";
 if(t.includes("CONTINUAR")||t.includes("SIGUIENTE"))return "arrowRight";
 if(t.includes("GOL")||t.includes("ACERTÓ"))return "checkCircle";
 if(t.includes("FALLÓ")||t.includes("ATAJADA"))return "glove";
 if(t.includes("REPLAY")||t.includes("REPET"))return "refresh";
 if(t.includes("PENAL"))return "goal";
 if(t.includes("VOLVER")||t.includes("ATRÁS"))return "arrowLeft";
 if(t.includes("JUGAR"))return "play";
 if(t.includes("ELIMINAR")||t.includes("QUITAR"))return "cross";
 if(t.includes("TORRE"))return "tower";
 if(t.includes("MARCADOR"))return "scoreboard";
 if(t.includes("DADO"))return "dice";
 if(t.includes("RESPUESTA"))return "book";
 if(t.includes("ELEGIR"))return "check";
 if(t.includes("VARIANTE"))return "shuffle";
 return "arrowRight";
}
function decorateButton(btn){
 if(!btn||btn.querySelector(":scope > .ta-icon"))return;
 const name=nameForAction(btn);
 const label=stripEmoji(btn.textContent);
 if(!label)return;
 btn.classList.add("ta-icon-button");
 // Conservar nodos hijos, oyentes y atributos inline de botones dinámicos.
 for(const n of Array.from(btn.childNodes)){
  if(n.nodeType===3)n.textContent=n.textContent.replace(PREFIX,"");
 }
 btn.prepend(icon(name,"ta-icon-button-art"));
 if(!btn.getAttribute("aria-label")&&label.length<100)btn.setAttribute("aria-label",label);
}
function navButton(btn){
 if(!btn||btn.querySelector(":scope > .ta-icon"))return;
 const act=btn.getAttribute("onclick")||"";
 const raw=btn.textContent.trim();
 let name=act.includes("goHome")||act.includes("go('home')")?"home":
  act.includes("afterResult")?"arrowRight":
  act.includes("showScores")?"menu":
  raw==="×"?"cross":
  raw==="→"?"arrowRight":"arrowLeft";
 btn.setAttribute("aria-label",name==="home"?"Ir al inicio":name==="menu"?"Ver marcador":name==="cross"?"Cerrar":name==="arrowRight"?"Continuar":"Volver");
 btn.replaceChildren(icon(name,"ta-icon-nav"));
 btn.classList.add("ta-nav-svg");
}
function optionIcon(elem){
 if(!elem||elem.querySelector(".ta-icon"))return;
 const opt=elem.closest(".option");if(!opt)return;
 const name=opt.querySelector("strong")?.textContent?.trim().toLowerCase()||"";
 const iconName=name.includes("equip")?"users":name.includes("elimin")?"heart":
  name.includes("final")?"lightning":name.includes("clásico")?"tower":
  name.includes("puntos")?"scoreboard":
  name.includes("fácil")?"ball":name.includes("medio")?"shield":
  name.includes("leyenda")?"crown":name.includes("mixto")?"shuffle":"ball";
 standalone(elem,iconName);
}
function leadingLabel(el,name){
 if(!el||el.querySelector(":scope > .ta-icon"))return;
 const label=stripEmoji(el.textContent);
 el.replaceChildren(icon(name,"ta-icon-label"),document.createTextNode(" "+label));
 el.classList.add("ta-labeled-icon");
}
function categoryName(text){
 const t=stripEmoji(text).toUpperCase();
 if(t.includes("QUIEN_SOY")||t.includes("QUIÉN SOY")||t.includes("QUIEN SOY"))return "QUIEN_SOY";
 return Object.keys(CONFIG.category).find(k=>t.includes(k))||"TRIVIA";
}
function decorateCategory(id){
 const elem=document.getElementById(id);
 if(!elem||!elem.textContent.trim())return;
 const category=categoryName(elem.textContent);
 if(!elem.querySelector(":scope > .ta-icon")){
  leadingLabel(elem,CONFIG.category[category]||"trivia");
 }
 elem.dataset.taCategory=category;
}
function decorateEvent(){
 const elem=document.getElementById("eventBox");
 if(!elem||elem.classList.contains("hidden")||!elem.textContent.trim())return;
 const text=stripEmoji(elem.textContent).toUpperCase();
 const evt=Object.keys(CONFIG.event).find(k=>text.includes(k.replace("_"," ")))||"CAPITAN";
 leadingLabel(elem,CONFIG.event[evt]||"star");
 elem.dataset.taEvent=evt;
}
function decorateHud(){
 for(const hud of ["hud","challengeHud"]){
  const elem=document.getElementById(hud);if(!elem)continue;
  Array.from(elem.querySelectorAll(".pill")).forEach((pill,index)=>{
   if(pill.querySelector(":scope > .ta-icon"))return;
   const text=pill.textContent;
   let name=index===0?"user":index===1?(text.includes("DIGITAL")?"smartphone":"tower"):
     index===2?"medal":text.includes("❤️")?"heart":text.includes("👥")?"users":
     text.includes("🟥")?"redCard":text.includes("🛡")?"shield":text.includes("🏆")?"trophy":"star";
   leadingLabel(pill,name);
  });
 }
}
function decoratePower(){
 const elem=document.getElementById("powerIcon");
 if(!elem||elem.querySelector(":scope > .ta-icon"))return;
 const title=(document.getElementById("powerTitle")?.textContent||"").toUpperCase();
 const match=Object.keys(CONFIG.event).find(k=>title.includes(k.replace("_"," ")));
 const name=match?CONFIG.event[match]:title.includes("10")?"ten":title.includes("ESCUDO")?"shield":
  title.includes("REPET")?"refresh":"star";
 standalone(elem,name);
}
function decorateTurn(){
 const elem=document.getElementById("turnIcon");
 if(!elem||elem.querySelector(":scope > .ta-icon"))return;
 const text=elem.textContent;
 standalone(elem,text.includes("🟥")?"redCard":text.includes("📱")?"smartphone":"tower");
}
function decorateResult(){
 const elem=document.getElementById("resultIcon");
 if(!elem||elem.querySelector(":scope > .ta-icon"))return;
 const title=(document.getElementById("resultTitle")?.textContent||"").toUpperCase();
 standalone(elem,title.includes("ATAJADA")||title.includes("FALL")?"glove":"goal");
}
function decorateSettings(){
 ["Audio","Vibration","Animations"].forEach((id,i)=>{
  const row=document.getElementById("sw"+id)?.closest(".setting-row");
  if(!row)return;
  standalone(row.querySelector(".setting-icon"),["sound","vibrate","sparkles"][i]);
 });
}
function decorateMarks(id){
 const el=document.getElementById(id);
 if(!el||el.querySelector(":scope > .ta-icon"))return;
 const source=el.textContent.trim();
 if(source==="—"||!source)return;
 const tokens=source.split(/\s+/).filter(Boolean);
 if(!tokens.length||tokens.some(t=>t!=="⚽"&&t!=="🧤"))return;
 const glyphs=tokens.map(t=>icon(t==="⚽"?"ball":"glove","ta-icon-kick"));
 el.replaceChildren(...glyphs);
 el.classList.add("ta-shoot-marks");
 const scored=tokens.filter(x=>x==="⚽").length;
 el.setAttribute("aria-label",scored+" goles y "+(tokens.length-scored)+" atajadas");
}
function decorateInlineTokens(el){
 if(!el)return;
 const RE=/(🏆|🛡️|🟥|❤️|⚽|🧤)/gu;
 for(const node of Array.from(el.childNodes)){
  if(node.nodeType!==3||!RE.test(node.textContent||""))continue;
  RE.lastIndex=0;
  const pieces=String(node.textContent).split(RE);
  const frag=document.createDocumentFragment();
  for(const p of pieces){
   if(!p)continue;
   const name=p==="🏆"?"trophy":p==="🛡️"?"shield":
     p==="🟥"?"redCard":p==="❤️"?"heart":p==="⚽"?"ball":p==="🧤"?"glove":null;
   if(name)frag.appendChild(icon(name,"ta-icon-inline"));
   else frag.appendChild(document.createTextNode(p));
  }
  node.replaceWith(frag);
 }
}
function decorateScoreChips(){
 const elem=document.getElementById("scoreBox");
 if(!elem)return;
 for(const node of elem.querySelectorAll(".score-name,.score-value")){
  decorateInlineTokens(node);
 }
}
function decorateEditorialLabels(){
 for(const el of document.querySelectorAll("#home .hero-format-hint span")){
  if(!el.querySelector(":scope > .ta-icon"))leadingLabel(el,el.textContent.includes("DIGITAL")?"smartphone":"tower");
 }
 for(const el of document.querySelectorAll("#how .help-dual h3")){
  if(!el.querySelector(":scope > .ta-icon"))leadingLabel(el,el.textContent.includes("Digital")?"smartphone":"tower");
 }
 const brand=document.getElementById("shootBrand");
 if(brand&&brand.textContent.trim()&&!brand.querySelector(":scope > .ta-icon")){
  const title=stripEmoji(brand.textContent).toUpperCase();
  leadingLabel(brand,title.includes("FINAL")?"trophy":title.includes("DESEMPATE")?"scoreboard":"ball");
 }
 decorateInlineTokens(document.getElementById("turnInstruction"));
}
function decorateFormatRibbon(){
 for(const node of document.querySelectorAll("#formatOpts .visual-format-ribbon")){
  if(node.querySelector(".ta-icon"))continue;
  const card=node.closest(".visual-format-card");
  node.prepend(icon(card?.classList.contains("digital")?"smartphone":"tower","ta-icon-ribbon"));
 }
}
function decoratePowerOptionBadges(){
 for(const node of document.querySelectorAll("#powerOptions button > span:last-child")){
  if(node.querySelector(".ta-icon"))continue;
  const val=node.textContent.trim();
  if(!val||val.length>8||!/[⚽🏆🛡🟥]/u.test(val))continue;
  const parts=[...val.matchAll(/⚽|🏆|🛡️?|🟥/gu)].map(m=>m[0]);
  if(!parts.length)continue;
  node.replaceChildren(...parts.map(x=>icon(x.includes("⚽")?"ball":x.includes("🏆")?"trophy":x.includes("🟥")?"redCard":"shield","ta-icon-power-badge")));
 }
}
function decorate(){
 const app=document.getElementById("app");if(!app)return;
 app.querySelectorAll(".screen .topbar .navbtn").forEach(navButton);
 app.querySelectorAll(
  ".screen .footer-actions button, #turnActions button, #dice .dice-grid button,"+
  " #settings .audio-test button, #powerOptions button, #penalty .card > button,"+
  " #penalty #penContent button, #shootout .card button, #players .players-list button"
 ).forEach(decorateButton);
 document.querySelectorAll("#modeOpts .option-icon,#diffOpts .option-icon").forEach(optionIcon);
 decorateCategory("catLabel");
 decorateCategory("digitalBlockMeta");
 decorateCategory("answerMeta");
 decorateEvent();
 decorateHud();
 decorateTurn();
 decorateResult();
 decoratePower();
 decorateSettings();
 decorateMarks("shootKicksA");decorateMarks("shootKicksB");
 decorateScoreChips();
 decorateFormatRibbon();
 decoratePowerOptionBadges();
 decorateEditorialLabels();
 standalone(document.querySelector("#gameover .cup-mark"),"trophy");
}
function init(){
 if(document.body.dataset.taIconsR3==="1")return;
 if(!document.getElementById("app"))return;
 document.body.dataset.taIconsR3="1";
 document.body.classList.add("ta-icon-v2-r3");
 decorate();
 let scheduled=false;
 const observer=new MutationObserver(()=>{
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(()=>{scheduled=false;decorate();});
 });
 observer.observe(document.getElementById("app"),{subtree:true,childList:true,characterData:true});
 window.TA_ICON_QA={version:"TA-UI-P0.3R3",glyphs:Object.keys(GLYPHS).length,iconsLocal:true};
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();