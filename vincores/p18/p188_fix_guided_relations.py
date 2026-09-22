from pathlib import Path

js_path=Path('vincores/p18/p188.js')
css_path=Path('vincores/p18/p188.css')
idx_path=Path('vincores/index.html')
js=js_path.read_text(encoding='utf-8')
css=css_path.read_text(encoding='utf-8')
idx=idx_path.read_text(encoding='utf-8')

# Keep a source-level backup before this hotfix.
bak=Path('vincores/backups/P1.8.8_before_guided_loop_relation_fix_p188.js')
if not bak.exists():
    bak.write_text(js,encoding='utf-8')

js=js.replace("let C={caseId:'libre',startedAt:0,observed:[],activeTopic:null,lastEventId:null};",
              "let C={caseId:'libre',startedAt:0,observed:[],activeTopic:null,lastEventId:null,ackEventId:null};")
js=js.replace("C=d?{...C,...d}:{caseId:'libre',startedAt:Date.now(),observed:[],activeTopic:null,lastEventId:null};",
              "C=d?{...C,...d}:{caseId:'libre',startedAt:Date.now(),observed:[],activeTopic:null,lastEventId:null,ackEventId:null};")

old_open="""function openCasePicker(caseId){
 buildOverlays();const body=q('p188CaseBody');
 if(!caseId){body.innerHTML=`<div class=\"p188-kicker\">NUEVA PRÁCTICA GUIADA</div><h2>Elegí un tema</h2><p>La guía cambia según el tema, pero siempre describe lo visible sin interpretar el significado.</p><div class=\"p188-case-grid\">${Object.entries(CASES).map(([id,c])=>`<button data-p188-case=\"${id}\"><b>${c.icon} ${c.title}</b><span>${esc(c.intro)}</span></button>`).join('')}</div>`;qa('[data-p188-case]',body).forEach(b=>b.onclick=()=>openCasePicker(b.dataset.p188Case))}
 else{const c=CASES[caseId];body.innerHTML=`<div class=\"p188-kicker\">${c.icon} PRÁCTICA GUIADA</div><h2>${esc(c.title)}</h2><p>${esc(c.intro)}</p><div class=\"p188-observe-preview\"><b>Qué vamos a observar</b>${c.topics.map(t=>`<span>${esc(t)}</span>`).join('')}</div><div class=\"p188-start-actions\"><button class=\"btn primary\" data-p188-start=\"keep\">Comenzar con sugerencias</button><button class=\"btn\" data-p188-start=\"clear\">Empezar con campo vacío</button></div><button class=\"p188-back\" data-p188-back>← Elegir otro tema</button>`;qa('[data-p188-start]',body).forEach(b=>b.onclick=()=>startCase(caseId,b.dataset.p188Start==='clear'));q('p188CaseBody').querySelector('[data-p188-back]').onclick=()=>openCasePicker()}
 q('p188CaseOverlay').classList.add('open')
}
"""
new_open="""function openCasePicker(caseId){
 buildOverlays();const body=q('p188CaseBody');
 if(!caseId){
  body.innerHTML=`<div class=\"p188-kicker\">NUEVA PRÁCTICA GUIADA</div><h2>Elegí un tema</h2><p>La guía cambia según el tema, pero siempre describe lo visible sin interpretar el significado.</p><div class=\"p188-case-grid\">${Object.entries(CASES).map(([id,c])=>`<button data-p188-case=\"${id}\"><b>${c.icon} ${c.title}</b><span>${esc(c.intro)}</span></button>`).join('')}</div>`;
  qa('[data-p188-case]',body).forEach(b=>b.onclick=()=>openCasePicker(b.dataset.p188Case));
 }else{
  const c=CASES[caseId],hasField=fieldNodes().length>0;
  body.innerHTML=`<div class=\"p188-kicker\">${c.icon} PRÁCTICA GUIADA</div><h2>${esc(c.title)}</h2><p>${esc(c.intro)}</p><div class=\"p188-observe-preview\"><b>Qué vamos a observar</b>${c.topics.map(t=>`<span>${esc(t)}</span>`).join('')}</div><div class=\"p188-pick-title\">Elegí qué querés sumar al campo</div><div class=\"p188-pick-grid\">${c.suggested.map((it,i)=>`<label class=\"p188-pick\"><input type=\"checkbox\" data-p188-pick=\"${i}\" checked><span><b>${esc(it[1])}</b><small>${it[0]==='figure'?'Figura':'Concepto'}</small></span></label>`).join('')}</div><div class=\"p188-start-actions\"><button class=\"btn primary\" data-p188-start=\"selected\">Crear campo y empezar</button><button class=\"btn\" data-p188-start=\"empty\">Empezar vacío</button>${hasField?'<button class=\"btn\" data-p188-start=\"keep\">Mantener campo actual</button>':''}</div><button class=\"p188-back\" data-p188-back>← Elegir otro tema</button>`;
  qa('[data-p188-start]',body).forEach(b=>b.onclick=()=>{const mode=b.dataset.p188Start;const picks=qa('[data-p188-pick]:checked',body).map(x=>+x.dataset.p188Pick);startCase(caseId,mode,picks)});
  body.querySelector('[data-p188-back]').onclick=()=>openCasePicker();
 }
 q('p188CaseOverlay').classList.add('open')
}
"""
if old_open not in js: raise SystemExit('openCasePicker pattern not found')
js=js.replace(old_open,new_open)

old_start="""function startCase(id,clear){
 if(clear&&typeof clearBoard==='function')clearBoard(true);
 C={caseId:id,startedAt:Date.now(),observed:[],activeTopic:null,lastEventId:null};if(window.VincoresP188)window.VincoresP188.state=C;saveCase();localStorage.setItem(ONBOARD,'1');closeCaseOverlay();renderCaseGuide();openGuideContext(true);showToast?.(`${caseMeta().title} · guía activada`)
}
try{const oldLoadCase=loadCase;loadCase=function(type){if(CASES[type])return openCasePicker(type);return oldLoadCase(type)}}catch{}
"""
new_start="""function resetFacilitatorForCase(){
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
"""
if old_start not in js: raise SystemExit('startCase pattern not found')
js=js.replace(old_start,new_start)

js=js.replace("function addSuggested(i){const c=caseMeta(),it=c.suggested[i];",
              "function addSuggested(i,opts={}){const c=caseMeta(),it=c.suggested[i];")
js=js.replace(" setTimeout(()=>{renderCaseGuide();notifyGuide()},160)\n}",
              " if(!opts.quiet)setTimeout(()=>{renderCaseGuide();notifyGuide()},160)\n}",1)

old_mark="""function markObserved(topic){if(!topic)return;if(!C.observed.includes(topic))C.observed.push(topic);C.activeTopic=topic;saveCase();renderCaseGuide()}
"""
new_mark="""function acknowledgeLatest(){const e=latestRelevantEvent();if(e)C.ackEventId=e.id}
function markObserved(topic){if(!topic)return;acknowledgeLatest();if(!C.observed.includes(topic))C.observed.push(topic);C.activeTopic=topic;saveCase();renderCaseGuide()}
"""
if old_mark not in js: raise SystemExit('markObserved pattern not found')
js=js.replace(old_mark,new_mark)

old_qhead="""function caseQuestion(){
 const c=caseMeta(),e=latestRelevantEvent(),nodes=fieldNodes(),figs=nodes.filter(x=>x.kind==='figure'),syms=nodes.filter(x=>x.kind==='symbol');
 if(C.activeTopic)return topicQuestion(C.activeTopic);
 if(e?.type==='concept_added'){
"""
new_qhead="""function caseQuestion(){
 const c=caseMeta(),latest=latestRelevantEvent(),e=latest&&latest.id!==C.ackEventId?latest:null,nodes=fieldNodes(),figs=nodes.filter(x=>x.kind==='figure'),syms=nodes.filter(x=>x.kind==='symbol');
 if(e?.type==='concept_added'){
"""
if old_qhead not in js: raise SystemExit('caseQuestion head pattern not found')
js=js.replace(old_qhead,new_qhead)

needle=""" if(e?.type==='undo')return 'Volviste a una posición anterior. ¿Qué diferencia notaste entre ambas posibilidades?';
 if(C.caseId==='pareja'&&figs.length>=2)return 'Mirá las dos figuras sin moverlas todavía. ¿Qué es lo primero que llama tu atención de cómo quedaron ubicadas?';
"""
replace=""" if(e?.type==='undo')return 'Volviste a una posición anterior. ¿Qué diferencia notaste entre ambas posibilidades?';
 if(C.activeTopic)return topicQuestion(C.activeTopic);
 if(!nodes.length)return `Elegí abajo qué elementos querés sumar para empezar la práctica de ${c.title}.`;
 if(C.caseId==='padres'&&figs.length<3)return 'Podés sumar YO, PAPÁ y MAMÁ —o sólo los elementos que necesites— y después observar la disposición completa.';
 if(C.caseId==='pareja'&&figs.length<2)return 'Sumá las figuras o conceptos que necesites para representar la relación y después mirá cómo quedan ubicados.';
 if(C.caseId==='pareja'&&figs.length>=2)return 'Mirá las dos figuras sin moverlas todavía. ¿Qué es lo primero que llama tu atención de cómo quedaron ubicadas?';
"""
if needle not in js: raise SystemExit('caseQuestion body pattern not found')
js=js.replace(needle,replace)

old_actions=""" qa('[data-p188-do]',box).forEach(b=>b.onclick=()=>{const act=b.dataset.p188Do;if(act==='observe'){C.activeTopic=C.activeTopic||c.topics.find(t=>!observed.has(t))||c.topics[0];markObserved(C.activeTopic)}else if(act==='compare'){window.VincoresP18?.track?.('case_compare',{label:c.title});showToast?.('Compará el campo actual con la posición anterior o una etapa guardada')}else{C.activeTopic=null;saveCase();renderCaseGuide()}})
}
"""
new_actions=""" qa('[data-p188-do]',box).forEach(b=>b.onclick=()=>{const act=b.dataset.p188Do;if(act==='observe'){C.activeTopic=C.activeTopic||c.topics.find(t=>!observed.has(t))||c.topics[0];markObserved(C.activeTopic)}else if(act==='compare'){acknowledgeLatest();saveCase();window.VincoresP18?.track?.('case_compare',{label:c.title});showToast?.('Compará el campo actual con la posición anterior o una etapa guardada');renderCaseGuide()}else{acknowledgeLatest();C.activeTopic=null;saveCase();renderCaseGuide()}})
}
"""
if old_actions not in js: raise SystemExit('actions pattern not found')
js=js.replace(old_actions,new_actions)

# Install a real SVG viewport sync so relationship curves stay attached after panel/field resizing.
insert_before="""function openGuideContext(forceDesktop=false){"""
resize_fix="""let relationResizeRAF=0;
function syncRelationViewport(){const b=q('board'),svg=q('linkLayer');if(!b||!svg)return;const w=Math.max(1,Math.round(b.clientWidth)),h=Math.max(1,Math.round(b.clientHeight));svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('width',String(w));svg.setAttribute('height',String(h));svg.setAttribute('preserveAspectRatio','none')}
function scheduleRelationRender(){cancelAnimationFrame(relationResizeRAF);relationResizeRAF=requestAnimationFrame(()=>{syncRelationViewport();try{renderRelations?.()}catch{}})}
function installRelationResizeFix(){
 syncRelationViewport();
 try{const previous=renderRelations;renderRelations=function(){syncRelationViewport();const out=previous.apply(this,arguments);syncRelationViewport();return out}}catch{}
 if('ResizeObserver'in window){const ro=new ResizeObserver(()=>scheduleRelationRender());q('board')&&ro.observe(q('board'));document.querySelector('.stageWrap')&&ro.observe(document.querySelector('.stageWrap'));window.__vincoresRelationResizeObserver=ro}
 window.addEventListener('resize',scheduleRelationRender);document.addEventListener('transitionend',e=>{if(e.target?.closest?.('.app,.stageWrap,.left,.right'))scheduleRelationRender()});
}
"""
if insert_before not in js: raise SystemExit('insert point not found')
js=js.replace(insert_before,resize_fix+insert_before,1)

js=js.replace("function init(){setupFaceControls();buildOverlays();loadCaseState();renderCaseGuide();wireGuideAttention();firstRun();watchEvents();",
              "function init(){setupFaceControls();buildOverlays();installRelationResizeFix();loadCaseState();renderCaseGuide();wireGuideAttention();firstRun();watchEvents();")

# CSS for the explicit element picker.
css_add="""
.p188-pick-title{margin-top:16px;font-size:.78rem;font-weight:900;color:#665d54;letter-spacing:.03em}.p188-pick-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:9px 0 14px}.p188-pick{display:flex;align-items:center;gap:9px;border:1px solid #ddd3c7;border-radius:13px;padding:10px 12px;background:#fff;cursor:pointer}.p188-pick:has(input:checked){border-color:#78b2a9;background:#eef8f6;box-shadow:inset 0 0 0 1px rgba(47,143,131,.08)}.p188-pick input{accent-color:#2f8f83;width:17px;height:17px}.p188-pick span{display:grid;gap:1px}.p188-pick b{font-size:.78rem}.p188-pick small{font-size:.66rem;color:#8a8178;font-weight:700}@media(max-width:700px){.p188-pick-grid{grid-template-columns:1fr 1fr}.p188-start-actions{display:grid!important;grid-template-columns:1fr}.p188-start-actions .btn{width:100%}}
"""
if '.p188-pick-grid' not in css: css += css_add

idx=idx.replace('<h4>Casos básicos</h4>','<h4>Prácticas guiadas</h4>')
idx=idx.replace('Agregá figuras desde la izquierda o cargá un caso básico.<br>Después movelas libremente dentro del campo.','Agregá figuras desde la izquierda o elegí una práctica guiada.<br>Después movelas libremente dentro del campo.')
idx=idx.replace('p188.css?v=1882','p188.css?v=1883').replace('p188.js?v=1882','p188.js?v=1883')

js_path.write_text(js,encoding='utf-8')
css_path.write_text(css,encoding='utf-8')
idx_path.write_text(idx,encoding='utf-8')
print('patched',len(js),len(css),len(idx))
