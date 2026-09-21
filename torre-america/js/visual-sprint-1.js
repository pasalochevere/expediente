/* TORRE DE AMÉRICA · P1.9.8C · VISUAL SPRINT 1
   Intro CINEMA ENGINE V1 + Home + Selector de Formato */
const CINEMA_INTRO_KEY='pc_torre_america_cinema_v1_seen';
let cinemaTimers=[];
let cinemaRunning=false;
let cinemaAutoOffered=false;

function cinemaClearTimers(){cinemaTimers.forEach(clearTimeout);cinemaTimers=[]}
function heroTowerRows(count=18,cls='hero'){let out='';for(let r=0;r<count;r++){out+=`<div class="${cls}-tower-row">${[0,1,2].map(()=>`<span class="${cls}-block"></span>`).join('')}</div>`}return out}
function cinemaTowerRows(){let out='';for(let r=0;r<18;r++){out+=`<div class="cinema-row">${[0,1,2].map((_,i)=>`<span class="cinema-block ${(r===8&&i===1)?'featured':''}"></span>`).join('')}</div>`}return out}
function formatMiniTowerRows(){let out='';for(let r=0;r<14;r++)out+=`<div class="format-mini-row">${[0,1,2].map(()=>'<span class="format-mini-block"></span>').join('')}</div>`;return out}

function ensureCinemaMarkup(){
 if(document.getElementById('cinemaIntro'))return;
 const el=document.createElement('div');
 el.id='cinemaIntro';el.className='cinema-intro';el.dataset.scene='1';
 el.innerHTML=`
  <div class="cinema-stage">
   <div class="cinema-lights"></div><div class="cinema-pitch"></div><div class="cinema-fog"></div>
   <div class="cinema-tower-wrap"><div class="cinema-tower">${cinemaTowerRows()}</div></div>
   <div class="cinema-copy"><div class="cinema-kicker" id="cinemaKicker"></div><div class="cinema-line" id="cinemaLine"></div><div class="cinema-sub" id="cinemaSub"></div></div>
   <div class="cinema-flashes" id="cinemaFlashes"></div>
  </div>
  <div class="cinema-card" id="cinemaCard">
    <div class="cinema-kicker">PASALOCHEVÉRE · CINEMA ENGINE V1</div>
    <h2>UNA NOCHE<br>DE COPA</h2>
    <p>Subí el volumen si querés vivir la presentación completa. La intro dura menos de un minuto y siempre podés saltearla.</p>
    <div class="cinema-start-actions"><button class="cinema-btn primary" onclick="startCinemaIntro()">▶ VIVIR LA INTRO</button><button class="cinema-btn" onclick="skipCinemaIntro()">ENTRAR DIRECTO AL JUEGO</button></div>
  </div>
  <button class="cinema-skip" id="cinemaSkip" onclick="skipCinemaIntro()" style="display:none">SALTAR INTRO</button>
  <div class="cinema-progress"><span id="cinemaProgress"></span></div>`;
 document.body.appendChild(el);
}

const cinemaScenes=[
 {ms:3600,k:'',line:'NO TODAS LAS COPAS<br>SE JUEGAN IGUAL.',sub:'',fx:'power'},
 {ms:3600,k:'NOCHE DE COPA',line:'EN AMÉRICA,<br>LA HISTORIA PESA.',sub:'PASIÓN · RIVALIDAD · MEMORIA',fx:null},
 {ms:4300,k:'BLOQUE 27',line:'CADA BLOQUE PUEDE<br>CAMBIAR LA PARTIDA.',sub:'UNA DECISIÓN. UNA PREGUNTA. UN RIESGO.',fx:'dice'},
 {ms:5000,k:'DESCUBRÍ LA JUGADA',line:'HISTORIA.<br>RIESGO. GLORIA.',sub:'TRIVIA · DUELO · PENALES · ROJA · FINAL',fx:'red',flash:['TRIVIA','DUELO','PENALES','ROJA','FINAL']},
 {ms:7200,k:'DOS FORMAS DE JUGAR',line:'FÍSICA. DIGITAL.<br>CLÁSICO. LEYENDA.',sub:'TORRE REAL · SOLO DIGITAL · EQUIPOS · PODERES',fx:'goal',flash:['TORRE FÍSICA','SOLO DIGITAL','EL 10','LA COPA','PENALES']},
 {ms:2800,k:'',line:'',sub:'',fx:null,silent:true},
 {ms:4600,k:'222 DESAFÍOS',line:'LA COPA SE JUEGA<br>BLOQUE POR BLOQUE.',sub:'FÍSICO + DIGITAL · INDIVIDUAL + EQUIPOS',fx:'win'},
 {ms:3500,k:'TORRES DEL FÚTBOL',line:'TORRE DE<br>AMÉRICA',sub:'PASALOCHEVÉRE · NOCHE DE COPA',fx:null},
 {ms:2800,k:'EL PARTIDO EMPIEZA AHORA',line:'ELEGÍ CÓMO<br>QUERÉS JUGAR.',sub:'TORRE FÍSICA · SOLO DIGITAL',fx:'whistle'}
];

function cinemaFlash(words,sceneMs){
 const box=document.getElementById('cinemaFlashes');if(!box||!words?.length)return;box.innerHTML='';
 const gap=Math.max(600,Math.floor((sceneMs-900)/words.length));
 words.forEach((w,i)=>{const t=setTimeout(()=>{box.innerHTML=`<div class="cinema-flash-word on">${w}</div>`},350+i*gap);cinemaTimers.push(t)});
}
function cinemaSetScene(i){
 const intro=document.getElementById('cinemaIntro'),sc=cinemaScenes[i];if(!intro||!sc)return;
 intro.dataset.scene=String(i+1);intro.classList.toggle('silent-scene',!!sc.silent);
 document.getElementById('cinemaKicker').innerHTML=sc.k||'';document.getElementById('cinemaLine').innerHTML=sc.line||'';document.getElementById('cinemaSub').innerHTML=sc.sub||'';
 const flash=document.getElementById('cinemaFlashes');if(flash)flash.innerHTML='';
 if(sc.fx&&typeof playFx==='function')try{playFx(sc.fx,true)}catch(e){}
 if(sc.flash)cinemaFlash(sc.flash,sc.ms);
 const elapsed=cinemaScenes.slice(0,i).reduce((a,x)=>a+x.ms,0),total=cinemaScenes.reduce((a,x)=>a+x.ms,0);
 const progress=document.getElementById('cinemaProgress');if(progress)progress.style.width=`${Math.round((elapsed/total)*100)}%`;
}
function startCinemaIntro(){
 ensureCinemaMarkup();cinemaClearTimers();cinemaRunning=true;
 const intro=document.getElementById('cinemaIntro');intro.classList.add('show','playing');document.getElementById('cinemaSkip').style.display='block';
 try{if(typeof getAudioCtx==='function')getAudioCtx()}catch(e){}
 let acc=0;cinemaScenes.forEach((sc,i)=>{const t=setTimeout(()=>cinemaSetScene(i),acc);cinemaTimers.push(t);acc+=sc.ms});
 cinemaTimers.push(setTimeout(()=>finishCinemaIntro(),acc));
}
function finishCinemaIntro(){
 cinemaClearTimers();cinemaRunning=false;localStorage.setItem(CINEMA_INTRO_KEY,'1');
 const p=document.getElementById('cinemaProgress');if(p)p.style.width='100%';
 const intro=document.getElementById('cinemaIntro');if(intro){setTimeout(()=>{intro.classList.remove('show','playing','silent-scene');intro.dataset.scene='1';document.getElementById('cinemaSkip').style.display='none'},300)}
}
function skipCinemaIntro(){
 cinemaClearTimers();cinemaRunning=false;localStorage.setItem(CINEMA_INTRO_KEY,'1');
 const intro=document.getElementById('cinemaIntro');if(intro){intro.classList.remove('show','playing','silent-scene');intro.dataset.scene='1'}
}
function showCinemaIntro(replay=true){
 ensureCinemaMarkup();cinemaClearTimers();
 const intro=document.getElementById('cinemaIntro');intro.classList.add('show');intro.classList.remove('playing','silent-scene');intro.dataset.scene='1';
 document.getElementById('cinemaSkip').style.display='none';document.getElementById('cinemaProgress').style.width='0';
 if(replay)startCinemaIntro();
}
window.showCinemaIntro=showCinemaIntro;window.startCinemaIntro=startCinemaIntro;window.skipCinemaIntro=skipCinemaIntro;

function upgradeHome(){
 const home=document.getElementById('home'),stage=home?.querySelector('.hero-stage');if(!home||!stage||home.classList.contains('visual-v2'))return;
 home.classList.add('visual-v2');
 stage.innerHTML=`
   <div class="hero-stadium-lights"></div><div class="hero-smoke"></div>
   <div class="hero-premium-copy">
     <div class="hero-premium-top"><span class="brand">PASALOCHEVÉRE · TORRES DEL FÚTBOL</span><span class="visual-release">FÍSICO + DIGITAL</span></div>
     <div class="hero-premium-eyebrow">UNA NOCHE DE COPA</div>
     <div class="hero-premium-title">TORRE DE<span>AMÉRICA</span></div>
     <p class="hero-claim">La Copa se juega <b>bloque por bloque.</b></p>
     <div class="hero-meta"><span>222 desafíos</span><span>3 dificultades</span><span>individual + equipos</span></div>
   </div>
   <div class="hero-tower-zone"><div class="hero-tower-glow"></div><div class="hero-tower">${heroTowerRows(18,'hero')}</div></div>
   <div class="hero-format-hint"><span>🧱 TORRE FÍSICA</span><span>📱 SOLO DIGITAL</span></div>`;
 const actions=home.querySelector('.footer-actions');if(actions){
   const buttons=[...actions.querySelectorAll('button')];if(buttons[0])buttons[0].innerHTML='⚽ &nbsp;ENTRAR A LA CANCHA';
   const how=buttons.find(b=>(b.textContent||'').includes('CÓMO'));if(how)how.textContent='CÓMO SE JUEGA';
   const settings=buttons.find(b=>(b.textContent||'').includes('AUDIO'));if(settings)settings.textContent='⚙ AJUSTES';
   if(!actions.querySelector('.btn-cinema')){const b=document.createElement('button');b.className='btn btn-secondary btn-cinema';b.innerHTML='▶ VER INTRO';b.onclick=()=>showCinemaIntro(true);actions.insertBefore(b,how||actions.children[1]||null)}
 }
 const mini=home.querySelector(':scope > .mini.center');if(mini)mini.textContent='Para los que saben. Y para los que dicen que saben.';
}

function selectVisualFormat(id){S.playFormat=id;if(typeof playFx==='function')try{playFx('power')}catch(e){};renderFormats()}
window.selectVisualFormat=selectVisualFormat;
function visualFormatArt(id){
 if(id==='FISICA')return `<div class="format-art"><div class="format-mini-tower">${formatMiniTowerRows()}</div></div>`;
 return `<div class="format-art"><div class="phone-art"><div class="phone-screen"><div class="phone-block">27</div></div></div></div>`;
}
function visualRenderFormats(){
 const root=document.getElementById('formatOpts');if(!root)return;
 root.innerHTML=formats.map(x=>`<div class="visual-format-card ${x[0]==='DIGITAL'?'digital':''} ${S.playFormat===x[0]?'selected':''}" onclick="selectVisualFormat('${x[0]}')">
   <div class="visual-format-bg"></div>${visualFormatArt(x[0])}<div class="visual-format-check">✓</div>
   <div class="visual-format-content"><span class="visual-format-ribbon">${x[4]}</span><h3>${x[2]}</h3><p>${x[3]}</p><div class="visual-format-cta">ELEGIR ESTE FORMATO →</div></div>
  </div>`).join('');
 const next=document.querySelector('#format .footer-actions .btn-primary');if(next)next.textContent=S.playFormat==='FISICA'?'CONTINUAR CON TORRE FÍSICA':'CONTINUAR SOLO DIGITAL';
}
try{renderFormats=visualRenderFormats}catch(e){}

function upgradeFormatScreen(){
 const format=document.getElementById('format');if(!format)return;format.classList.add('visual-v2');
 const h=format.querySelector('.section-head h2');if(h)h.textContent='¿CÓMO QUERÉS JUGAR?';
 const sub=format.querySelector('.section-head .subtitle');if(sub)sub.textContent='Una misma Copa. Dos experiencias distintas.';
 visualRenderFormats();
}

function maybeOfferCinema(){
 if(cinemaAutoOffered)return;const app=document.getElementById('app');if(!app||getComputedStyle(app).display==='none')return;
 cinemaAutoOffered=true;upgradeHome();upgradeFormatScreen();ensureCinemaMarkup();
 if(!localStorage.getItem(CINEMA_INTRO_KEY))showCinemaIntro(false);
}
function initVisualSprint1(){
 upgradeHome();upgradeFormatScreen();ensureCinemaMarkup();
 const app=document.getElementById('app');if(app){new MutationObserver(()=>maybeOfferCinema()).observe(app,{attributes:true,attributeFilter:['style','class']});setTimeout(maybeOfferCinema,250)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initVisualSprint1);else initVisualSprint1();
