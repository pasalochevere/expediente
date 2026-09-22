/* VÍNCORES · CINEMA ENGINE V1 · P1.9.0 */
(()=>{
  const SEEN='vincores_cinema_seen_v1';
  const SCENES=[
    {ms:4100,html:()=>sceneText('INTRIGA','Hay vínculos que se ven.','Y otros que recién aparecen cuando les damos un lugar para ser observados.')},
    {ms:4300,html:()=>scenePhoto('https://d2ol7oe51mr4n9.cloudfront.net/user_3HsxoUqhL2jq6HZbpDZ6JgCwUeq/148155a3-5a0f-4e09-afa2-c2de5169109f.jpg','ORIGEN','Todo empezó con un campo, figuras y una pregunta.','Personas','Roles','Emociones','Distancias')},
    {ms:3900,html:()=>scenePhoto('https://d2ol7oe51mr4n9.cloudfront.net/user_3HsxoUqhL2jq6HZbpDZ6JgCwUeq/fe16c979-4a55-4395-af31-787cd0dfc077.jpg','EL MISMO LENGUAJE','Cada pieza representa algo que elegís mirar.','Figuras','Conceptos','Vínculos','Etapas')},
    {ms:5000,html:()=>sceneDigital()},
    {ms:4700,html:()=>sceneMovement()},
    {ms:4700,html:()=>sceneGuide()},
    {ms:4300,html:()=>sceneJournal()},
    {ms:999999,html:()=>sceneFinal()}
  ];
  let root=null,index=0,timer=null,startAt=0,remaining=0,paused=false,playing=false;
  const q=s=>document.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function shell(){
    root=document.createElement('div');root.className='vcCinema';root.id='vcCinema';root.setAttribute('aria-hidden','true');
    root.innerHTML=`<div class="vcCTop"><div class="vcCBrand">VÍNCORES DIGITAL · CINEMA ENGINE V1</div><button class="vcCSkip" type="button">Omitir intro</button></div><div id="vcCStage"></div><div class="vcCBottom"><button class="vcCPause" type="button">Pausar</button><div class="vcCProgress"><i></i></div><div class="vcCDots"></div></div>`;
    document.body.appendChild(root);
    root.querySelector('.vcCSkip').onclick=()=>close(true);
    root.querySelector('.vcCPause').onclick=togglePause;
    root.addEventListener('click',e=>{if(e.target.closest('[data-vc-enter]')){enterField();return}if(e.target.closest('[data-vc-presentation]')){showPresentation();return}});
    document.addEventListener('keydown',e=>{if(!playing)return;if(e.key==='Escape')close(true);if(e.key===' '&&!['INPUT','TEXTAREA','SELECT','BUTTON'].includes(document.activeElement?.tagName)){e.preventDefault();togglePause()}if(e.key==='ArrowRight')next();if(e.key==='ArrowLeft')prev()});
  }
  function common(inner,cls=''){return `<section class="vcCScene ${cls}">${inner}<div class="vcCAura"></div><div class="vcCGrain"></div></section>`}
  function sceneText(kicker,title,sub){return common(`<div class="vcCDigital"></div><div class="vcCContent center"><div class="vcCKicker">${esc(kicker)}</div><h2 class="vcCTitle">${esc(title)}</h2><p class="vcCSub">${esc(sub)}</p></div>`,'center')}
  function scenePhoto(src,kicker,title,...words){return common(`<div class="vcCBackdrop" style="background-image:url('${src}')"></div><div class="vcCContent"><div class="vcCKicker">${esc(kicker)}</div><h2 class="vcCTitle">${esc(title)}</h2><div class="vcCWords">${words.map(w=>`<span>${esc(w)}</span>`).join('')}</div></div>`)}
  function boardHTML(moved=false){return `<div class="vcCBoardWrap"><div class="vcCBoard${moved?' moved':''}"><span class="vcCLink l1"></span><span class="vcCLink l2"></span><span class="vcCLink l3"></span><div class="vcCPiece cyl p1"><em>↑</em><b>YO</b></div><div class="vcCPiece pri p2"><em>↑</em><b>PAREJA</b></div><div class="vcCPiece cyl p3"><em>↑</em><b>RECURSO</b></div><div class="vcCPiece pri p4"><em>↑</em><b>TRABAJO</b></div></div></div>`}
  function sceneDigital(){return common(`<div class="vcCDigital"></div><div class="vcCContent center"><div class="vcCKicker">DESCUBRIMIENTO</div><h2 class="vcCTitle">Ahora ese mismo lenguaje<br><strong>también vive en digital.</strong></h2><p class="vcCSub">Un campo interactivo donde podés crear, ubicar, orientar y relacionar los elementos que elegís representar.</p>${boardHTML(false)}</div>`,'center')}
  function sceneMovement(){return common(`<div class="vcCDigital"></div><div class="vcCContent center"><div class="vcCKicker">EXPLORÁ</div><h2 class="vcCTitle">Mové una pieza.<br><strong>Y mirá qué cambia.</strong></h2><p class="vcCSub">Probá otra distancia, otra orientación o una nueva relación sin perder el estado anterior.</p>${boardHTML(true)}</div>`,'center')}
  function sceneGuide(){return common(`<div class="vcCDigital"></div><div class="vcCContent center"><div class="vcCKicker">PRÁCTICA GUIADA</div><h2 class="vcCTitle">Una pregunta por vez.</h2><div class="vcCGuided"><div class="vcCGuidePanel"><small>OBSERVACIÓN SUGERIDA</small><div class="vcCGuideQ">¿Qué te llama primero la atención de cómo quedaron ubicadas estas figuras?</div><div class="vcCChoices"><span>Distancias</span><span>Orientaciones</span><span>Espacio entre ambas</span></div></div><div class="vcCJournal"><small>EL SISTEMA ACOMPAÑA EL RITMO</small><div class="vcCTimeline"><div><time>AHORA</time><p>Observá antes de mover.</p></div><div><time>DESPUÉS</time><p>Probá un solo cambio.</p></div><div><time>LUEGO</time><p>Registrá qué notaste.</p></div></div></div></div></div>`,'center')}
  function sceneJournal(){return common(`<div class="vcCDigital"></div><div class="vcCContent center"><div class="vcCKicker">BITÁCORA + HISTORIA</div><h2 class="vcCTitle">No te quedes sólo con<br><strong>la última imagen.</strong></h2><p class="vcCSub">Guardá etapas, anotá observaciones y recuperá escenas para seguir trabajando cuando quieras.</p><div class="vcCGuided"><div class="vcCJournal"><small>HISTORIA DE LA SESIÓN</small><div class="vcCTimeline"><div><time>10:32</time><p>Comenzaste la práctica · Papá y mamá</p></div><div><time>10:38</time><p>Guardaste “Primera disposición”</p></div><div><time>10:45</time><p>Moviste YO y comparaste posiciones</p></div><div><time>10:51</time><p>Nota guardada en Bitácora</p></div></div></div><div class="vcCGuidePanel"><small>RESUMEN</small><div class="vcCGuideQ">Tu campo también puede contar cómo fue cambiando.</div><div class="vcCChoices"><span>Etapas</span><span>Notas</span><span>Comparación</span><span>PNG</span></div></div></div></div>`,'center')}
  function sceneFinal(){return common(`<div class="vcCDigital"></div><div class="vcCContent center"><div class="vcCKicker">PERSONAS · VÍNCULOS · HISTORIAS · MÁS POSIBILIDADES</div><div class="vcCLogo">VÍNCORES<small>DIGITAL · CAMPO INTERACTIVO</small></div><p class="vcCSub">Explorá vínculos, roles, emociones y movimientos desde un campo visual que acompaña sin interpretar por vos.</p><div class="vcCFinalActions"><button class="vcCEnter" data-vc-enter type="button">Entrar al campo</button><button class="vcCPresentation" data-vc-presentation type="button">Ver presentación completa</button></div><div class="vcCDisclaimer">Herramienta visual de exploración y representación. No realiza diagnósticos ni reemplaza atención profesional.</div></div>`,'center')}
  function render(){
    const stage=root.querySelector('#vcCStage');
    stage.innerHTML=SCENES[index].html();
    const scene=stage.firstElementChild;requestAnimationFrame(()=>scene.classList.add('active'));
    const dots=root.querySelector('.vcCDots');dots.innerHTML=SCENES.map((_,i)=>`<i class="${i===index?'on':''}"></i>`).join('');
    const progress=root.querySelector('.vcCProgress>i');progress.style.transition='none';progress.style.width='0%';
    if(index===SCENES.length-1){root.querySelector('.vcCPause').style.visibility='hidden';progress.style.width='100%';return}
    root.querySelector('.vcCPause').style.visibility='visible';remaining=SCENES[index].ms;paused=false;root.querySelector('.vcCPause').textContent='Pausar';startTimer(progress,remaining);
  }
  function startTimer(progress,ms){clearTimeout(timer);startAt=performance.now();remaining=ms;requestAnimationFrame(()=>{progress.style.transition=`width ${ms}ms linear`;progress.style.width='100%'});timer=setTimeout(()=>next(),ms)}
  function next(){if(!playing)return;clearTimeout(timer);if(index<SCENES.length-1){index++;render()}else close(true)}
  function prev(){if(!playing)return;clearTimeout(timer);index=Math.max(0,index-1);render()}
  function togglePause(){if(index===SCENES.length-1)return;const progress=root.querySelector('.vcCProgress>i');if(!paused){paused=true;clearTimeout(timer);remaining=Math.max(250,remaining-(performance.now()-startAt));const pct=parseFloat(getComputedStyle(progress).width)/parseFloat(getComputedStyle(progress.parentElement).width)*100;progress.style.transition='none';progress.style.width=pct+'%';root.querySelector('.vcCPause').textContent='Continuar'}else{paused=false;root.querySelector('.vcCPause').textContent='Pausar';startTimer(progress,remaining)}}
  function play(force=false){
    if(!root)shell();if(playing)return;
    playing=true;index=0;root.classList.add('on');root.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden';
    if(force)localStorage.removeItem(SEEN);render();
  }
  function close(markSeen=true){if(!root)return;clearTimeout(timer);playing=false;if(markSeen)localStorage.setItem(SEEN,'1');root.classList.remove('on');root.setAttribute('aria-hidden','true');document.documentElement.style.overflow='';}
  function enterField(){close(true);const b=document.getElementById('enterBtn');if(b)b.click()}
  function showPresentation(){close(true);const intro=document.getElementById('intro'),app=document.getElementById('app'),emo=document.getElementById('emotions');intro?.classList.remove('hidden');app?.classList.add('hidden');emo?.classList.add('hidden');window.scrollTo({top:0,behavior:'smooth'})}
  function accessReady(){
    const params=new URLSearchParams(location.search);const force=params.get('cinema')==='1';
    if(force||!localStorage.getItem(SEEN))setTimeout(()=>play(force),250);
  }
  function wire(){
    if(!root)shell();
    const gate=document.getElementById('accessGate');
    if(gate){const obs=new MutationObserver(()=>{if(gate.classList.contains('hidden')){obs.disconnect();accessReady()}});obs.observe(gate,{attributes:true,attributeFilter:['class']});if(gate.classList.contains('hidden'))accessReady()}
    const introBtn=document.getElementById('introBtn');if(introBtn)introBtn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();play(true)},true);
    window.VincoresCinema={play,close,next,prev};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();