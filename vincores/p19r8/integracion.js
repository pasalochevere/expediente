/* VÍNCORES P1.9R8 — capa de mejoras. No modifica autenticación ni almacenamiento existente. */
(function(){
 'use strict';
 if(window.__VINCORES_P19R8_INTEGRATION__)return;
 const app=document.getElementById('app'),board=document.getElementById('board'),stage=document.querySelector('.stageWrap');
 if(!app||!board||!stage)return;
 window.__VINCORES_P19R8_INTEGRATION__=true;
 const $=id=>document.getElementById(id);
 const original=typeof EMOTIONS!=='undefined'?EMOTIONS.slice():[];
 const added=[
 ['ALEGRÍA','Bienestar'],['CALMA','Bienestar'],['SERENIDAD','Bienestar'],['GRATITUD','Bienestar'],['ESPERANZA','Bienestar'],['ENTUSIASMO','Bienestar'],['ALIVIO','Bienestar'],['ORGULLO','Bienestar'],['SATISFACCIÓN','Bienestar'],['TERNURA','Bienestar'],['CONFIANZA','Bienestar'],['MOTIVACIÓN','Bienestar'],
 ['TRISTEZA','Desafío'],['MIEDO','Desafío'],['ENOJO','Desafío'],['FRUSTRACIÓN','Desafío'],['ANGUSTIA','Desafío'],['CULPA','Desafío'],['VERGÜENZA','Desafío'],['SOLEDAD','Desafío'],['ANSIEDAD','Desafío'],['DESCONFIANZA','Desafío'],['INSEGURIDAD','Desafío'],['RESENTIMIENTO','Desafío'],['DESILUSIÓN','Desafío'],['CELOS','Desafío'],
 ['AFECTO','Vínculos'],['CARIÑO','Vínculos'],['ADMIRACIÓN','Vínculos'],['EMPATÍA','Vínculos'],['CERCANÍA','Vínculos'],['ADMIRACIÓN MUTUA','Vínculos'],['NOSTALGIA','Vínculos'],['COMPASIÓN','Vínculos'],
 ['SORPRESA','Cambios'],['INCERTIDUMBRE','Cambios'],['CURIOSIDAD','Cambios'],['ASOMBRO','Cambios'],['EXPECTATIVA','Cambios'],['CONFUSIÓN EMOCIONAL','Cambios'],['VALENTÍA','Cambios'],['ACEPTACIÓN','Cambios']
 ];
 const KEY='vincores_p19r8_library_preferences_v1';
 function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
 const prefs=load();prefs.custom=Array.isArray(prefs.custom)?prefs.custom:[];prefs.favs=Array.isArray(prefs.favs)?prefs.favs:[];prefs.recent=Array.isArray(prefs.recent)?prefs.recent:[];
 function save(){try{localStorage.setItem(KEY,JSON.stringify(prefs))}catch(e){}}
 let tab='all',search='',questionIndex=0,current='welcome',helpVisible=false,guideHidden=false;
 const prompts={
 welcome:[['Representá primero lo importante para tu pregunta.','Sumá una figura o elegí una práctica para comenzar.'],['¿Qué querés observar de esta distribución?','La guía es opcional: podés mover libremente todas las piezas.']],
 selected:[['¿Qué lugar ocupa esta figura en el campo?','Arrastrala para moverla. Hacé doble clic o doble toque para editar su apariencia.'],['¿Hacia dónde está orientada esta figura?','La orientación puede cambiarse desde Personalizar.']],
 move:[['¿Qué cambia al verla en esta nueva posición?','Si querés conservar el momento anterior, guardá una etapa.'],['¿Qué distancia llama ahora tu atención?','Podés deshacer un movimiento o ensayar otro pequeño cambio.']],
 add:[['¿Qué aporta la nueva figura a la escena?','Podés asignarle un rol y moverla para observar distintas posiciones.'],['¿Cómo se relaciona con las demás figuras?','Usá Vincular para representar una relación elegida por vos.']],
 emotion:[['¿Qué querés representar con esta emoción o concepto?','Las emociones se agregan como piezas visuales, sin interpretaciones automáticas.'],['¿Dónde ubicarías este elemento?','Podés moverlo como cualquier pieza y guardar una etapa.']],
 link:[['Observá el vínculo que acabás de representar.','La línea es un recurso gráfico; no describe por sí misma una relación real.'],['¿Qué te llama la atención de esas dos figuras?','Podés modificar o quitar el vínculo desde las herramientas.']],
 stage:[['Guardaste un momento de la escena.','Podés continuar explorando sin perder esta etapa.'],['¿Qué te gustaría probar ahora?','Mové una sola pieza para que sea más fácil observar el cambio.']]
 };
 const guide=document.createElement('div');guide.className='vcr8-guideHolder';
 guide.innerHTML='<section id="vcr8Guide" aria-label="Guía interactiva sobre el campo"><div class="vcr8-guideText"><small>VÍNCORES · GUÍA SOBRE LA CONSTELACIÓN</small><b id="vcr8Question"></b><p id="vcr8Suggestion"></p></div><div class="vcr8-guideActions"><button type="button" id="vcr8Other" class="vcr8-btn">Otra idea</button><button type="button" id="vcr8How" class="vcr8-btn">¿Cómo lo hago?</button><button type="button" id="vcr8GuideToggle" class="vcr8-btn">Ocultar</button></div></section><div id="vcr8Help" hidden></div>';
 const frame=stage.querySelector('.boardFrame');if(frame)stage.insertBefore(guide,frame);
 function showGuide(){const ps=prompts[current]||prompts.welcome;const p=ps[questionIndex%ps.length];$('vcr8Question').textContent=p[0];$('vcr8Suggestion').textContent=p[1];$('vcr8Help').textContent=p[1]}
 function guideEvent(kind){current=kind;questionIndex=0;showGuide()}
 $('vcr8Other').onclick=function(){questionIndex++;showGuide()};
 $('vcr8How').onclick=function(){helpVisible=!helpVisible;$('vcr8Help').hidden=!helpVisible;showGuide()};
 $('vcr8GuideToggle').onclick=function(){const g=$('vcr8Guide');g.hidden=true;guideHidden=true;if($('vcr8Reopen'))return;const b=document.createElement('button');b.className='vcr8-btn';b.id='vcr8Reopen';b.textContent='✦ Mostrar guía';guide.prepend(b);b.onclick=function(){g.hidden=false;guideHidden=false;b.remove()};};
 showGuide();
 // Herramientas de zoom originales P1.8: conservar sus métodos y añadir un acceso de 100 %.
 const fit=$('p18Fit');
 if(fit){fit.textContent='Ver todo';fit.title='Encuadrar el contenido';fit.style.width='auto';const reset=document.createElement('button');reset.className='p18-mini';reset.textContent='100%';reset.title='Restablecer vista al 100%';reset.onclick=function(){const p=window.VincoresP18?.state;if(p&&$('p18ZoomOut')){p.zoom=1.1;p.panX=0;p.panY=0;$('p18ZoomOut').click()}};fit.after(reset)}
 // Acceso visible desde campo y campo completo. Usa makeSymbol, commitHistory y saveCurrent originales.
 const fieldbar=document.querySelector('.p18-fieldbar .p18-group');
 if(fieldbar){const libBtn=document.createElement('button');libBtn.type='button';libBtn.className='p18-mini';libBtn.textContent='✦ Emociones';libBtn.title='Emociones y conceptos';libBtn.style.width='auto';libBtn.onclick=openLibrary;fieldbar.append(libBtn)}
 const overlay=document.createElement('div');overlay.id='vcr8Library';overlay.hidden=true;
 overlay.innerHTML='<div class="vcr8-libSheet" role="dialog" aria-modal="true" aria-labelledby="vcr8LibTitle"><div class="vcr8-libHead"><div><small style="color:#27776c;font-weight:900;letter-spacing:.1em">VÍNCORES · BIBLIOTECA ORIGINAL AMPLIADA</small><h2 id="vcr8LibTitle">Emociones y conceptos</h2><p>Elegí los elementos que querés agregar al campo. Podés incorporar varios seguidos.</p></div><button type="button" id="vcr8LibClose" class="vcr8-btn">Cerrar ×</button></div><input id="vcr8Search" class="vcr8-libSearch" type="search" placeholder="Buscar emoción o concepto…" aria-label="Buscar en la biblioteca"><div class="vcr8-libTabs" id="vcr8Tabs"></div><div class="vcr8-list" id="vcr8Items"></div><form id="vcr8CustomForm" class="vcr8-addCustom"><input id="vcr8CustomName" maxlength="36" placeholder="Crear una emoción propia" aria-label="Nombre de la emoción"><select id="vcr8CustomGroup"><option>Personal</option><option>Bienestar</option><option>Desafío</option><option>Vínculos</option><option>Cambios</option></select><button type="submit" class="vcr8-btn primary">＋ Agregar emoción</button></form><p id="vcr8LibStatus" class="vcr8-libStatus">La biblioteca original se conserva. Tus emociones propias quedan en este navegador.</p></div>';
 document.body.append(overlay);
 const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
 const categories=[['all','Todo'],['original','Conceptos originales'],['emotion','Emociones'],['custom','Mis emociones'],['favorites','Favoritos'],['recent','Recientes']];
 function allItems(){return original.map(s=>({name:s,type:'original'})).concat(added.map(a=>({name:a[0],type:'emotion',group:a[1]})),prefs.custom.map(a=>({name:a.name,type:'custom',group:a.group})))}
 function filtered(){let all=allItems();if(tab==='original'||tab==='emotion'||tab==='custom')all=all.filter(x=>x.type===tab);else if(tab==='favorites')all=all.filter(x=>prefs.favs.includes(x.name));else if(tab==='recent')all=all.filter(x=>prefs.recent.includes(x.name)).sort((a,b)=>prefs.recent.indexOf(a.name)-prefs.recent.indexOf(b.name));if(search)all=all.filter(x=>norm(x.name).includes(norm(search)));return all}
 function renderLibrary(){const t=$('vcr8Tabs');t.replaceChildren();categories.forEach(([key,title])=>{const b=document.createElement('button');b.textContent=title;b.setAttribute('aria-pressed',String(tab===key));b.onclick=()=>{tab=key;renderLibrary()};t.append(b)});const root=$('vcr8Items');root.replaceChildren();const list=filtered();list.forEach(item=>{const row=document.createElement('div');row.className='vcr8-item'+(item.type!=='original'?' emotion':'');const addBtn=document.createElement('button');addBtn.className='vcr8-insert';addBtn.textContent=(item.type==='original'?'✧ ':'♥ ')+item.name;addBtn.title='Agregar '+item.name;addBtn.onclick=()=>insert(item);const star=document.createElement('button');star.className='vcr8-star';star.textContent=prefs.favs.includes(item.name)?'★':'☆';star.setAttribute('aria-label','Favorito '+item.name);star.setAttribute('aria-pressed',String(prefs.favs.includes(item.name)));star.onclick=()=>{prefs.favs=prefs.favs.includes(item.name)?prefs.favs.filter(x=>x!==item.name):prefs.favs.concat(item.name);save();renderLibrary()};row.append(addBtn,star);root.append(row)});if(!list.length){const empty=document.createElement('p');empty.textContent='No hay resultados. Probá otra palabra o agregá una emoción propia.';root.append(empty)}}
 function insert(item){const x=43+Math.random()*14,y=43+Math.random()*14;const meta=item.type==='original'?{}:{emotionGroup:item.type==='custom'?'custom':'emotion',emotionColor:item.type==='custom'?'#79b6a9':'#d098a4',vincoresEmotion:true};if(typeof makeSymbol==='function'){makeSymbol(item.name,x,y,{silent:false,meta});if(typeof commitHistory==='function')commitHistory();prefs.recent=[item.name].concat(prefs.recent.filter(x=>x!==item.name)).slice(0,15);save();$('vcr8LibStatus').textContent='Agregaste '+item.name+' al campo. Podés seguir eligiendo.';guideEvent('emotion');renderLibrary()}}
 function openLibrary(){const full=document.fullscreenElement;const go=()=>{overlay.hidden=false;tab='all';search='';$('vcr8Search').value='';renderLibrary();$('vcr8Search').focus()};if(full&&document.exitFullscreen)document.exitFullscreen().then(go).catch(go);else go()}
 function closeLibrary(){overlay.hidden=true}
 $('vcr8LibClose').onclick=closeLibrary;overlay.addEventListener('click',e=>{if(e.target===overlay)closeLibrary()});$('vcr8Search').oninput=e=>{search=e.target.value;renderLibrary()};
 $('vcr8CustomForm').onsubmit=e=>{e.preventDefault();const name=$('vcr8CustomName').value.trim().toLocaleUpperCase('es-AR');if(!name)return;const names=new Set(allItems().map(i=>norm(i.name)));if(names.has(norm(name))){$('vcr8LibStatus').textContent='Esta emoción o concepto ya está en la biblioteca.';return}prefs.custom.push({name,group:$('vcr8CustomGroup').value});save();$('vcr8CustomName').value='';tab='custom';search='';$('vcr8Search').value='';renderLibrary();insert({name,type:'custom'});};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)closeLibrary()});
 // Una acción selecciona; el arrastre sigue siendo nativo. La edición requiere doble clic.
 let lastTap={id:null,time:0};const pointerStart=new Map();
 function openEditor(){const edit=document.querySelector('.p18-tab[data-rtab="piece"]');if(document.fullscreenElement&&document.exitFullscreen){document.exitFullscreen().then(()=>edit?.click()).catch(()=>edit?.click())}else edit?.click()}
 board.addEventListener('dblclick',e=>{if(e.target.closest('.node')?._meta?.kind==='figure')openEditor()});
 board.addEventListener('pointerup',e=>{const n=e.target.closest('.node');if(!n)return;const start=pointerStart.get(e.pointerId);pointerStart.delete(e.pointerId);const moved=!!start&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>5;if(n._meta?.kind==='figure'&&!moved){const id=n._meta.id;if(e.pointerType==='touch'&&lastTap.id===id&&Date.now()-lastTap.time<370){openEditor();lastTap={id:null,time:0}}else lastTap={id,time:Date.now()}}else if(moved)lastTap={id:null,time:0};setTimeout(()=>guideEvent(moved?'move':'selected'),40)});
 board.addEventListener('pointercancel',e=>{pointerStart.delete(e.pointerId)});
 board.addEventListener('pointerdown',e=>{if(e.target.closest('.node'))pointerStart.set(e.pointerId,{x:e.clientX,y:e.clientY});if(e.target.closest('.node')&&typeof linkMode!=='undefined'&&linkMode)guideEvent('link')});
 stage.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;if(t.id==='saveStageBtn'||t.id==='p18Snapshot')guideEvent('stage')});
 document.querySelector('.left')?.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;if(t.matches('.sizes button,.caseBtn'))setTimeout(()=>guideEvent('add'),50);if(t.classList.contains('linkBtn'))setTimeout(()=>guideEvent('link'),50)});
 const ob=new MutationObserver(records=>{if(records.some(r=>Array.from(r.addedNodes).some(n=>n.nodeType===1&&n.classList?.contains('node'))))guideEvent('add')});
 ob.observe(board,{childList:true});
})();
