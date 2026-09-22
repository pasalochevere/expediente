/* VÍNCORES P1.8.8 · GUIADO POR CASO + OBSERVACIÓN ASISTIDA + CARAS V3 */
(()=>{
'use strict';
if(window.__VINCORES_P188__) return;
window.__VINCORES_P188__=true;
const q=id=>document.getElementById(id);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const STORE='vincores_p188_case_v1';
const ONBOARD='vincores_p188_onboarded_v1';
const CASES={
 pareja:{title:'Amor y pareja',icon:'♥',intro:'Representá sólo lo necesario para mirar el vínculo que querés explorar.',topics:['Distancias','Orientaciones','Espacio entre figuras'],opening:'¿Qué querés observar de esta relación hoy?',suggested:[['figure','YO','cylinder',72],['figure','PAREJA','prism',72],['symbol','AMOR']]},
 familia:{title:'Familia',icon:'⌂',intro:'Elegí sólo las personas, roles o elementos necesarios para representar el tema.',topics:['Distribución','Distancias','Agrupaciones'],opening:'Mirá el conjunto sin mover nada todavía. ¿Qué distribución llama primero tu atención?',suggested:[['figure','YO','cylinder',58],['figure','MAMÁ','cylinder',72],['figure','PAPÁ','prism',72],['symbol','FAMILIA']]},
 padres:{title:'Papá y mamá',icon:'◇',intro:'Representá los elementos que necesites y observá primero la disposición completa.',topics:['Distribución','Distancias','Orientaciones'],opening:'Mirá las posiciones de YO, PAPÁ y MAMÁ sin moverlas. ¿Qué distribución te llama primero la atención?',suggested:[['figure','YO','cylinder',58],['figure','PAPÁ','prism',72],['figure','MAMÁ','cylinder',72]]},
 trabajo:{title:'Dinero y trabajo',icon:'▣',intro:'Representá el tema con los elementos que para vos sean importantes.',topics:['Posiciones','Distancias','Recursos'],opening:'¿Qué elemento llama primero tu atención al mirar el campo completo?',suggested:[['figure','YO','cylinder',72],['symbol','TRABAJO'],['symbol','DINERO'],['symbol','RECURSO']]},
 libre:{title:'Tema libre',icon:'✦',intro:'Empezá por el primer elemento imprescindible para representar lo que querés explorar.',topics:['Posiciones','Distancias','Campo completo'],opening:'¿Qué querés explorar y cuál sería el primer elemento imprescindible para representarlo?',suggested:[['figure','YO','cylinder',72],['symbol','CONCEPTO']]}
};
let C={caseId:'libre',startedAt:0,observed:[],activeTopic:null,lastEventId:null,ackEventId:null};
function sceneKey(){return window.vincoresCurrentSceneId||'unsaved'}
function readAll(){try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch{return{}}}
function saveCase(){const all=readAll();all[sceneKey()]={...C,updatedAt:Date.now()};localStorage.setItem(STORE,JSON.stringify(all))}
function loadCaseState(){const all=readAll(),d=all[sceneKey()];C=d?{...C,...d}:{caseId:'libre',startedAt:Date.now(),observed:[],activeTopic:null,lastEventId:null,ackEventId:null};if(window.VincoresP188)window.VincoresP188.state=C;renderCaseGuide()}
function caseMeta(){return CASES[C.caseId]||CASES.libre}
function normalizeFaceMeta(m){
 if(!m)return m;
 const hairMap={bun:'tied',curly:'medium'}; const eyeMap={open:'neutral'}; const mouthMap={open:'neutral'};
 m.hair=hairMap[m.hair]||m.hair||'none'; m.eyes=eyeMap[m.eyes]||m.eyes||'neutral'; m.mouth=mouthMap[m.mouth]||m.mouth||'neutral'; m.brows=m.brows||'soft';
 return m
}
function v3FaceHTML(m){
 normalizeFaceMeta(m);
 const hair=esc(m.hair),eyes=esc(m.eyes),mouth=esc(m.mouth),brows=esc(m.brows),hc=esc(m.hairColor||'#654632');
 return `<div class="p188-hair ${hair}" style="--p188-hair:${hc}"></div><div class="p188-brows ${brows}"><i></i><i></i></div><div class="p188-eyes ${eyes}"><i></i><i></i></div><div class="p188-mouth ${mouth}"></div>`
}
try{faceHTML=v3FaceHTML}catch{}
function replaceSelect(id,items){const el=q(id);if(!el)return;const current=el.value;el.innerHTML=items.map(([v,l])=>`<option value="${v}">${l}</option>`).join('');if(items.some(x=>x[0]===current))el.value=current}
function setupFaceControls(){
 replaceSelect('hair',[['none','Sin pelo'],['short','Corto'],['medium','Medio'],['long','Largo'],['tied','Recogido']]);
 replaceSelect('eyes',[['neutral','Neutros'],['soft','Suaves'],['closed','Cerrados'],['side-left','Mirada izquierda'],['side-right','Mirada derecha'],['none','Sin ojos']]);
 replaceSelect('mouth',[['neutral','Neutra'],['soft','Suave'],['smile','Sonrisa leve'],['none','Sin boca']]);
 const mode=q('mode');if(mode&&q('p188FacePreset')==null){const prop=document.createElement('div');prop.className='prop';prop.id='p188FacePreset';prop.innerHTML='<label>Rostro</label><select id="p188Face"><option value="neutral">Neutro</option><option value="soft">Suave</option><option value="closed">Cerrado</option><option value="lateral">Lateral</option><option value="none">Sin rostro</option></select>';mode.closest('.prop')?.after(prop);q('p188Face').onchange=e=>applyFacePreset(e.target.value)}
 const mouth=q('mouth');if(mouth&&q('p188Brows')==null){const row=mouth.closest('.row');const prop=document.createElement('div');prop.className='prop';prop.innerHTML='<label>Cejas</label><select id="p188Brows"><option value="none">Sin cejas</option><option value="soft" selected>Suaves</option><option value="raised">Elevadas</option><option value="straight">Rectas</option></select>';row?.after(prop);q('p188Brows').onchange=e=>{if(typeof selected==='undefined'||!selected)return;normalizeFaceMeta(selected._meta);selected._meta.brows=e.target.value;selected._meta.mode='character';if(q('mode'))q('mode').value='character';renderFigure(selected);commitHistory?.()}}
}
function facePresetFor(m){normalizeFaceMeta(m);if(m.eyes==='none'&&m.mouth==='none'&&m.brows==='none')return'none';if(m.eyes==='closed')return'closed';if(m.eyes==='side-left'||m.eyes==='side-right')return'lateral';if(m.eyes==='soft'&&m.mouth==='soft')return'soft';return'neutral'}
function applyFacePreset(v){if(typeof selected==='undefined'||!selected)return;const m=selected._meta;normalizeFaceMeta(m);const map={neutral:{eyes:'neutral',mouth:'neutral',brows:'soft'},soft:{eyes:'soft',mouth:'soft',brows:'soft'},closed:{eyes:'closed',mouth:'neutral',brows:'soft'},lateral:{eyes:'side-right',mouth:'neutral',brows:'soft'},none:{eyes:'none',mouth:'none',brows:'none'}};Object.assign(m,map[v]||map.neutral,{mode:'character'});if(q('mode'))q('mode').value='character';if(q('eyes'))q('eyes').value=m.eyes;if(q('mouth'))q('mouth').value=m.mouth;if(q('p188Brows'))q('p188Brows').value=m.brows;renderFigure(selected);commitHistory?.()}
try{
 const baseSelect=selectNode;selectNode=function(n){if(n?._meta?.kind==='figure')normalizeFaceMeta(n._meta);const out=baseSelect(n);if(n?._meta?.kind==='figure'){if(q('hair'))q('hair').value=n._meta.hair;if(q('eyes'))q('eyes').value=n._meta.eyes;if(q('mouth'))q('mouth').value=n._meta.mouth;if(q('p188Brows'))q('p188Brows').value=n._meta.brows||'soft';if(q('p188Face'))q('p188Face').value=facePresetFor(n._meta)}return out}
}catch{}
function buildOverlays(){
 if(!q('p188CaseOverlay'))document.body.insertAdjacentHTML('beforeend',`<div class="p188-overlay" id="p188CaseOverlay"><div class="p188-sheet"><button class="p188-x" id="p188CaseClose">×</button><div id="p188CaseBody"></div></div></div>`);
 if(!q('p188StartOverlay'))document.body.insertAdjacentHTML('beforeend',`<div class="p188-overlay" id="p188StartOverlay"><div class="p188-sheet p188-start"><div class="p188-kicker">PRIMERA PRÁCTICA</div><h2>¿Cómo querés empezar?</h2><p>Podés elegir un tema para recibir observaciones contextuales o entrar directamente con el campo libre.</p><div class="p188-start-actions"><button class="btn primary" id="p188ChooseGuided">Elegir un tema guiado</button><button class="btn" id="p188StartFree">Empezar con campo libre</button></div></div></div>`);
 q('p188CaseClose').onclick=()=>closeCaseOverlay();q('p188CaseOverlay').onclick=e=>{if(e.target===q('p188CaseOverlay'))closeCaseOverlay()};
 q('p188ChooseGuided').onclick=()=>{q('p188StartOverlay').classList.remove('open');openCasePicker()};
 q('p188StartFree').onclick=()=>{localStorage.setItem(ONBOARD,'1');C={caseId:'libre',startedAt:Date.now(),observed:[],activeTopic:null,lastEventId:null};if(window.VincoresP188)window.VincoresP188.state=C;saveCase();q('p188StartOverlay').classList.remove('open');renderCaseGuide()};
}
function openCasePicker(caseId){
 buildOverlays();const body=q('p188CaseBody');
 if(!caseId){
  body.innerHTML=`<div class="p188-kicker">NUEVA PRÁCTICA GUIADA</div><h2>Elegí un tema</h2><p>La guía cambia según el tema, pero siempre describe lo visible sin interpretar el significado.</p><div class="p188-case-grid">${Object.entries(CASES).map(([id,c])=>`<button data-p188-case="${id}"><b>${c.icon} ${c.title}</b><span>${esc(c.intro)}</span></button>`).join('')}</div>`;
  qa('[data-p188-case]',body).forEach(b=>b.onclick=()=>openCasePicker(b.dataset.p188Case));
 }else{
  const c=CASES[caseId],hasField=fieldNodes().length>0;
  body.innerHTML=`<div class="p188-kicker">${c.icon} PRÁCTICA GUIADA</div><h2>${esc(c.title)}</h2><p>${esc(c.intro)}</p><div class="p188-observe-preview"><b>Qué vamos a observar</b>${c.topics.map(t=>`<span>${esc(t)}</span>`).join('')}</div><div class="p188-pick-title">Elegí qué querés sumar al campo</div><div class="p188-pick-grid">${c.suggested.map((it,i)=>`<label class="p188-pick"><input type="checkbox" data-p188-pick="${i}" checked><span><b>${esc(it[1])}</b><small>${it[0]==='figure'?'Figura':'Concepto'}</small></span></label>`).join('')}</div><div class="p188-start-actions"><button class="btn primary" data-p188-start="selected">Crear campo y empezar</button><button class="btn" data-p188-start="empty">Empezar vacío</button>${hasField?'<button class="btn" data-p188-start="keep">Mantener campo actual</button>':''}</div><button class="p188-back" data-p188-back>← Elegir otro tema</button>`;
  qa('[data-p188-start]',body).forEach(b=>b.onclick=()=>{const mode=b.dataset.p188Start;const picks=qa('[data-p188-pick]:checked',body).map(x=>+x.dataset.p188Pick);startCase(caseId,mode,picks)});
  body.querySelector('[data-p188-back]').onclick=()=>openCasePicker();
 }
 q('p188CaseOverlay').classList.add('open')
}
function closeCaseOverlay(){q('p188CaseOverlay')?.classList.remove('open')}
function resetFacilitatorForCase(){
 const api=window.VincoresP18,P=api?.state;if(!P)return;
 P.mode='personal';P.started=true;P.phase=1;P.focus=caseMeta().title;P.currentSuggestion=null;P.lastSuggestionAt=0;P.asked=[];P.topicHistory=[];P.dismissed=[];
 api.track?.('session_started',{label:`Práctica guiada · ${caseMeta().title}`});api.track?.('focus_defined',{label:caseMeta().title});
}
function finishFacilitatorCaseStart(){
 const api=window.VincoresP18,P=api?.state;if(!P)return;
 P.phase=fieldNodes().filter(x=>x.kind==='figure').length>=2?2:1;P.currentSuggestion=null;P.lastSuggestionAt=0;api.suggest?.();
}
function startCase(id,mode='selected',indices=[]){
 if((mode==='selected'||mode==='empty')&&typeof clearBoard==='function')clearBoard(true);
 C={caseId:id,startedAt:Date.now(),observed:[],activeTopic:null,lastEventId:null,ackEventId:null};if(window.VincoresP188)window.VincoresP188.state=C;saveCase();localStorage.setItem(ONBOARD,'1');resetFacilitatorForCase();closeCaseOverlay();
 if(mode==='selected'){
  const picks=indices.length?indices:caseMeta().suggested.map((_,i)=>i);picks.forEach(i=>addSuggested(i,{quiet:true}));
 }
 finishFacilitatorCaseStart();renderCaseGuide();openGuideContext(true);setTimeout(()=>{renderCaseGuide();notifyGuide();scheduleRelationRender()},80);showToast?.(`${caseMeta().title} · guía activada`)
}
try{const oldLoadCase=loadCase;loadCase=function(type){if(CASES[type]){if(C.caseId===type&&C.startedAt&&fieldNodes().length){openGuideContext(true);showToast?.(`${caseMeta().title} · caso activo`);return}return openCasePicker(type)}return oldLoadCase(type)}}catch{}
function fieldNodes(){return qa('.node',q('board')).map(n=>({n,label:n._meta?.label||'',kind:n._meta?.kind||'',x:parseFloat(n.style.left)||0,y:parseFloat(n.style.top)||0}))}
function addSuggested(i,opts={}){const c=caseMeta(),it=c.suggested[i];if(!it)return;const [,label,shape='cylinder',height=58]=it;const existing=fieldNodes().find(x=>x.label.toUpperCase()===label.toUpperCase());if(existing){if(existing.kind==='figure')selectNode?.(existing.n);showToast?.(`${label} ya está en el campo`);return}
 const count=fieldNodes().length,x=34+(count%3)*16,y=40+Math.floor(count/3)*18;
 if(it[0]==='figure'){const n=makeFigure(shape,height,x,y,label);commitHistory?.();selectNode?.(n)}else{makeSymbol(label,x,y);commitHistory?.()}
 if(!opts.quiet)setTimeout(()=>{renderCaseGuide();notifyGuide()},160)
}
function latestRelevantEvent(){const P=window.VincoresP18?.state;if(!P?.events)return null;for(let i=P.events.length-1;i>=0;i--){const e=P.events[i];if(e.timestamp>=(C.startedAt||0)&&['node_added','node_moved','node_rotated','concept_added','relation_added','undo','stage_loaded'].includes(e.type))return e}return null}
function acknowledgeLatest(){const e=latestRelevantEvent();if(e)C.ackEventId=e.id}
function markObserved(topic){if(!topic)return;acknowledgeLatest();if(!C.observed.includes(topic))C.observed.push(topic);C.activeTopic=topic;saveCase();renderCaseGuide()}
function topicQuestion(topic){const c=caseMeta();const map={
 'Distancias':'Sin mover nada, mirá las distancias entre los elementos. ¿Hay alguna que te llame especialmente la atención?',
 'Orientaciones':'Observá hacia dónde está orientada cada figura. ¿Hay alguna dirección que quieras mirar con más atención?',
 'Espacio entre figuras':'Esta vez mirá el espacio que queda entre las figuras. ¿Qué te llama la atención de ese espacio?',
 'Distribución':'Mirá la distribución completa del campo. ¿Qué parte del conjunto llama primero tu atención?',
 'Agrupaciones':'¿Hay figuras que hayan quedado más próximas entre sí formando un grupo visible?',
 'Posiciones':'Observá las posiciones sin cambiarlas. ¿Qué elemento llama primero tu atención?',
 'Recursos':'Si decidís representar un recurso, observá dónde lo ubicás respecto del resto. ¿Qué te llama la atención?',
 'Campo completo':'Alejá la mirada de cada elemento individual y observá el campo completo. ¿Qué aparece primero en tu atención?',
 'Vínculos':'Mirá sólo los vínculos que decidiste representar. ¿Qué cambia al observarlos dentro del conjunto?',
 'Conceptos':'Observá los conceptos presentes y su posición. ¿Hay alguno que quieras mirar en relación con una figura?'
 };return map[topic]||c.opening}
function caseQuestion(){
 const c=caseMeta(),latest=latestRelevantEvent(),e=latest&&latest.id!==C.ackEventId?latest:null,nodes=fieldNodes(),figs=nodes.filter(x=>x.kind==='figure'),syms=nodes.filter(x=>x.kind==='symbol');
 if(e?.type==='concept_added'){
  const lab=e.payload?.label||'este concepto';
  if(C.caseId==='pareja'&&String(lab).toUpperCase()==='AMOR')return 'Incorporaste AMOR al campo. ¿Qué te llama la atención de dónde decidiste ubicarlo?';
  return `Incorporaste ${lab}. ¿Qué te llama la atención de su posición respecto del resto del campo?`
 }
 if(e?.type==='node_moved'){
  const lab=e.payload?.label||'este elemento';
  if(C.caseId==='pareja'&&String(lab).toUpperCase()==='AMOR')return 'Moviste AMOR. Mirá el campo completo antes de hacer otro cambio. ¿Qué te llama la atención de esta nueva posición respecto de las dos figuras?';
  if(C.caseId==='pareja')return `Moviste ${lab}. ¿Qué diferencia notás ahora en su distancia u orientación respecto del otro elemento de la relación?`;
  if(C.caseId==='familia')return `Moviste ${lab}. ¿Qué cambia ahora en la distribución del conjunto?`;
  if(C.caseId==='padres')return `Moviste ${lab}. ¿Qué cambia en la distribución entre YO, PAPÁ y MAMÁ?`;
  if(C.caseId==='trabajo')return `Moviste ${lab}. ¿Qué cambia en su posición relativa respecto de los otros elementos del campo?`;
  return `Moviste ${lab}. ¿Qué cambió visualmente en el campo después de este movimiento?`
 }
 if(e?.type==='node_rotated')return `Cambiaste la orientación de ${e.payload?.label||'una figura'}. ¿Qué cambia al mirarla ahora en esta dirección?`;
 if(e?.type==='relation_added')return `Agregaste un vínculo representado como ${e.payload?.label||'vínculo'}. ¿Qué querés observar de esa conexión dentro del campo?`;
 if(e?.type==='undo')return 'Volviste a una posición anterior. ¿Qué diferencia notaste entre ambas posibilidades?';
 if(C.activeTopic)return topicQuestion(C.activeTopic);
 if(!nodes.length)return `Elegí abajo qué elementos querés sumar para empezar la práctica de ${c.title}.`;
 if(C.caseId==='padres'&&figs.length<3)return 'Podés sumar YO, PAPÁ y MAMÁ —o sólo los elementos que necesites— y después observar la disposición completa.';
 if(C.caseId==='pareja'&&figs.length<2)return 'Sumá las figuras o conceptos que necesites para representar la relación y después mirá cómo quedan ubicados.';
 if(C.caseId==='pareja'&&figs.length>=2)return 'Mirá las dos figuras sin moverlas todavía. ¿Qué es lo primero que llama tu atención de cómo quedaron ubicadas?';
 if(C.caseId==='padres'&&figs.length>=3)return 'Mirá las tres posiciones sin moverlas. ¿Qué distribución te llama primero la atención?';
 if(C.caseId==='familia'&&figs.length>=3)return 'Mirá el conjunto completo. ¿Hay alguna distribución o agrupación que destaque visualmente?';
 if(C.caseId==='trabajo'&&nodes.length>=2)return 'Mirá las posiciones relativas de los elementos. ¿Qué distancia o ubicación te resulta más relevante observar?';
 return c.opening
}
function renderCaseGuide(){
 const panel=document.querySelector('.p18-guide-panel');if(!panel)return;let box=q('p188CaseGuide');if(!box){box=document.createElement('section');box.id='p188CaseGuide';box.className='p188-case-guide';panel.prepend(box)}
 const c=caseMeta();const observed=new Set(C.observed||[]),question=caseQuestion();
 box.innerHTML=`<div class="p188-case-head"><div><span>${c.icon}</span><div><small>CASO ACTIVO</small><b>${esc(c.title)}</b></div></div><button data-p188-change>Cambiar</button></div><div class="p188-observe-title">QUÉ OBSERVAMOS</div><div class="p188-topics">${c.topics.map(t=>`<button class="${C.activeTopic===t?'active':''}" data-p188-topic="${esc(t)}"><span>${observed.has(t)?'✓':'○'}</span>${esc(t)}</button>`).join('')}</div><div class="p188-question"><small>OBSERVACIÓN SUGERIDA</small><strong>${esc(question)}</strong></div><div class="p188-q-actions"><button data-p188-do="observe">Seguir observando</button><button data-p188-do="compare">Comparar con antes</button><button data-p188-do="other">Mirar otra cosa</button></div><div class="p188-suggested"><small>ELEMENTOS SUGERIDOS · OPCIONAL</small><div>${c.suggested.map((it,i)=>`<button data-p188-add="${i}">＋ ${esc(it[1])}</button>`).join('')}</div></div>`;
 box.querySelector('[data-p188-change]').onclick=()=>openCasePicker();qa('[data-p188-topic]',box).forEach(b=>b.onclick=()=>markObserved(b.dataset.p188Topic));qa('[data-p188-add]',box).forEach(b=>b.onclick=()=>addSuggested(+b.dataset.p188Add));
 qa('[data-p188-do]',box).forEach(b=>b.onclick=()=>{const act=b.dataset.p188Do;if(act==='observe'){C.activeTopic=C.activeTopic||c.topics.find(t=>!observed.has(t))||c.topics[0];markObserved(C.activeTopic)}else if(act==='compare'){acknowledgeLatest();saveCase();window.VincoresP18?.track?.('case_compare',{label:c.title});showToast?.('Compará el campo actual con la posición anterior o una etapa guardada');renderCaseGuide()}else{acknowledgeLatest();C.activeTopic=null;saveCase();renderCaseGuide()}})
}
let relationResizeRAF=0;
function syncRelationViewport(){const b=q('board'),svg=q('linkLayer');if(!b||!svg)return;const w=Math.max(1,Math.round(b.clientWidth)),h=Math.max(1,Math.round(b.clientHeight));svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('width',String(w));svg.setAttribute('height',String(h));svg.setAttribute('preserveAspectRatio','none')}
function scheduleRelationRender(){cancelAnimationFrame(relationResizeRAF);relationResizeRAF=requestAnimationFrame(()=>{syncRelationViewport();try{renderRelations?.()}catch{}})}
function installRelationResizeFix(){
 syncRelationViewport();
 try{const previous=renderRelations;renderRelations=function(){syncRelationViewport();const out=previous.apply(this,arguments);syncRelationViewport();return out}}catch{}
 if('ResizeObserver'in window){const ro=new ResizeObserver(()=>scheduleRelationRender());q('board')&&ro.observe(q('board'));document.querySelector('.stageWrap')&&ro.observe(document.querySelector('.stageWrap'));window.__vincoresRelationResizeObserver=ro}
 window.addEventListener('resize',scheduleRelationRender);document.addEventListener('transitionend',e=>{if(e.target?.closest?.('.app,.stageWrap,.left,.right'))scheduleRelationRender()});
}
function openGuideContext(forceDesktop=false){const guideBtn=document.querySelector('[data-rtab="guide"]');if(innerWidth>980||forceDesktop&&innerWidth>980){guideBtn?.click()}else{const mb=document.querySelector('[data-mobile="guide"]');mb?.classList.add('p188-attention');showToast?.('Nueva observación disponible en Guía')}}
function notifyGuide(){openGuideContext(false)}
function wireGuideAttention(){document.querySelector('[data-mobile="guide"]')?.addEventListener('click',e=>e.currentTarget.classList.remove('p188-attention'));document.querySelector('[data-rtab="guide"]')?.addEventListener('click',()=>document.querySelector('[data-mobile="guide"]')?.classList.remove('p188-attention'))}
function firstRun(){const enter=q('enterBtn');if(!enter)return;enter.addEventListener('click',()=>setTimeout(()=>{if(!localStorage.getItem(ONBOARD)){buildOverlays();q('p188StartOverlay').classList.add('open')}},650))}
function watchEvents(){let last='';setInterval(()=>{const key=sceneKey();if(watchEvents.key!==key){watchEvents.key=key;loadCaseState()}const e=latestRelevantEvent();if(e&&e.id!==last){last=e.id;C.lastEventId=e.id;saveCase();renderCaseGuide();if(e.type!=='node_added')notifyGuide()}},450)}
function init(){setupFaceControls();buildOverlays();installRelationResizeFix();loadCaseState();renderCaseGuide();wireGuideAttention();firstRun();watchEvents();qa('.node',q('board')).filter(n=>n._meta?.kind==='figure').forEach(n=>{normalizeFaceMeta(n._meta);renderFigure?.(n)});window.VincoresP188={state:C,cases:CASES,openCasePicker,startCase,renderCaseGuide,faceHTML:v3FaceHTML}}
setTimeout(init,0);
})();
