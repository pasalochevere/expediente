/* TORRE DE AMÉRICA · WALLPAPER CINEMA HD V2 */
const WC_INTRO_KEY='pc_torre_america_wallpaper_hd_v2_seen';
const WC_ASSET_BASE='./assets/cinema/hd/';
const WC_SCENES={
1:{bg:'01-night-hd.svg',tone:'',k:'',line:'NO TODAS LAS COPAS<br>SE JUEGAN IGUAL.',sub:''},
2:{bg:'01-night-hd.svg',tone:'',k:'NOCHE DE COPA',line:'',sub:''},
3:{bg:'02-america-hd.svg',tone:'gold',k:'',line:'EN AMÉRICA,<br>LA HISTORIA PESA.',sub:'PASIÓN · RIVALIDAD · MEMORIA'},
4:{bg:'03-blocks-hd.svg',tone:'',k:'',line:'CADA BLOQUE PUEDE<br>CAMBIAR LA PARTIDA.',sub:''},
5:{bg:'03-blocks-hd.svg',tone:'',k:'',line:'',sub:''},
6:{bg:'05-penalty-hd.svg',tone:'',k:'',line:'',sub:''},
7:{bg:'03-blocks-hd.svg',tone:'',k:'',line:'',sub:''},
8:{bg:'01-night-hd.svg',tone:'silent',k:'',line:'',sub:''},
9:{bg:'09-hero-hd.svg',tone:'gold',k:'',line:'',sub:''},
10:{bg:'11-home-hd.svg',tone:'',k:'EL PARTIDO EMPIEZA AHORA',line:'ELEGÍ CÓMO<br>QUERÉS JUGAR.',sub:'TORRE FÍSICA · SOLO DIGITAL'}
};
const WC_PRELOAD=[...new Set(Object.values(WC_SCENES).map(x=>x.bg).concat(['07-final-hd.svg']))];
let wcActiveBg=0,wcCtx=null,wcAmb=null,wcAmbGain=null,wcLow=null,wcPreloaded=false;
const _c11Ensure=ensureCinemaMarkup;
function wcPreload(){if(wcPreloaded)return;wcPreloaded=true;WC_PRELOAD.forEach(f=>{const i=new Image();i.decoding='async';i.src=WC_ASSET_BASE+f})}
function wcEnsure(){_c11Ensure();wcPreload();const world=document.querySelector('#cinemaIntro .c11-world');if(!world||world.querySelector('.wc-bg'))return;world.insertAdjacentHTML('afterbegin',`<div class="wc-bg wc-bg-a"></div><div class="wc-bg wc-bg-b"></div><div class="wc-vignette"></div><div class="wc-grain"></div><div class="wc-tone" id="wcTone"></div><div class="wc-event" id="wcEvent"></div>`)}
ensureCinemaMarkup=wcEnsure;
function wcSetBg(file,tone=''){wcEnsure();const a=document.querySelector('.wc-bg-a'),b=document.querySelector('.wc-bg-b');const next=wcActiveBg?a:b,prev=wcActiveBg?b:a;next.style.backgroundImage=`url('${WC_ASSET_BASE}${file}')`;next.classList.add('active');prev.classList.remove('active');wcActiveBg=wcActiveBg?0:1;const t=document.getElementById('wcTone');if(t)t.className='wc-tone '+(tone||'')}
function wcAudioOn(){try{if(typeof S!=='undefined'&&(S.audio===false||S.audioEnabled===false))return false}catch(e){}return true}
function wcAudioStart(){if(!wcAudioOn())return;try{wcCtx=new (window.AudioContext||window.webkitAudioContext)();const len=wcCtx.sampleRate*4,buf=wcCtx.createBuffer(1,len,wcCtx.sampleRate),d=buf.getChannelData(0);let v=0;for(let i=0;i<len;i++){v=(v*.992)+(Math.random()*2-1)*.008;d[i]=v}wcAmb=wcCtx.createBufferSource();wcAmb.buffer=buf;wcAmb.loop=true;const lp=wcCtx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=360;wcAmbGain=wcCtx.createGain();wcAmbGain.gain.value=.017;wcAmb.connect(lp).connect(wcAmbGain).connect(wcCtx.destination);wcAmb.start()}catch(e){wcCtx=null}}
function wcAudioStop(){try{wcAmb?.stop();wcLow?.stop();wcCtx?.close()}catch(e){}wcAmb=wcLow=wcCtx=wcAmbGain=null}
function wcThump(str=.045,dur=.24){if(!wcCtx)return;const o=wcCtx.createOscillator(),g=wcCtx.createGain();o.type='sine';o.frequency.setValueAtTime(62,wcCtx.currentTime);o.frequency.exponentialRampToValueAtTime(36,wcCtx.currentTime+dur);g.gain.setValueAtTime(str,wcCtx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,wcCtx.currentTime+dur);o.connect(g).connect(wcCtx.destination);o.start();o.stop(wcCtx.currentTime+dur)}
function wcWood(){if(!wcCtx)return;wcThump(.03,.12);const n=wcCtx.createBufferSource(),b=wcCtx.createBuffer(1,wcCtx.sampleRate*.075,wcCtx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);n.buffer=b;const f=wcCtx.createBiquadFilter(),g=wcCtx.createGain();f.type='bandpass';f.frequency.value=720;f.Q.value=.9;g.gain.value=.022;n.connect(f).connect(g).connect(wcCtx.destination);n.start()}
function wcWhistle(){/* deliberately silent: avoids synthetic CPU-like FX */}
function wcSilence(on){if(!wcAmbGain||!wcCtx)return;wcAmbGain.gain.cancelScheduledValues(wcCtx.currentTime);wcAmbGain.gain.linearRampToValueAtTime(on ? .002 : .017,wcCtx.currentTime+.25)}
function wcEvent(html){const box=document.getElementById('wcEvent');if(!box)return;box.innerHTML=`<div class="wc-event-card">${html}</div>`;requestAnimationFrame(()=>box.firstElementChild?.classList.add('on'))}
function wcEventOff(){const box=document.getElementById('wcEvent');if(box)box.innerHTML=''}
cinemaSetScene=function(i){wcEnsure();const intro=document.getElementById('cinemaIntro'),sc=cinemaScenes[i];if(!intro||!sc)return;intro.dataset.scene=String(sc.scene);const w=WC_SCENES[sc.scene]||WC_SCENES[1];wcSetBg(w.bg,w.tone);document.getElementById('c11Kicker').innerHTML=w.k||'';document.getElementById('c11Line').innerHTML=w.line||'';document.getElementById('c11Sub').innerHTML=w.sub||'';document.getElementById('c11Flash').innerHTML='';wcEventOff();wcSilence(sc.scene===8);if(sc.scene===1)wcThump(.035,.28);if(sc.scene===4)wcWood();if(sc.scene===6)cinemaMontage();if(sc.scene===7)cinemaEscalation();if(sc.scene===9){wcThump(.05,.35);wcSilence(false)}if(sc.scene===10){cinemaTimers.push(setTimeout(()=>finishCinemaIntro(),sc.ms-250))}const elapsed=cinemaScenes.slice(0,i).reduce((a,x)=>a+x.ms,0),total=cinemaScenes.reduce((a,x)=>a+x.ms,0);const p=document.getElementById('cinemaProgress');if(p)p.style.width=`${Math.round((elapsed/total)*100)}%`}
cinemaMontage=function(){const seq=[
{ms:0,bg:'03-blocks-hd.svg',tone:'',html:'<small>TRIVIA</small><strong>HISTORIA</strong><p>Una pregunta puede cambiar la noche.</p>',cue:'wood'},
{ms:850,bg:'01-night-hd.svg',tone:'red',html:'<div class="wc-red-card"></div><strong>ROJA</strong><p>Elegí un rival.</p>',cue:'thump'},
{ms:1700,bg:'01-night-hd.svg',tone:'blue',html:'<div class="wc-monitor"></div><strong>VAR</strong><p>Revisando la jugada.</p>',cue:'wood'},
{ms:2550,bg:'05-penalty-hd.svg',tone:'',html:'<small>DESDE LOS DOCE PASOS</small><strong>PENALES</strong><p>5 segundos. Una respuesta.</p>',cue:'thump'},
{ms:3500,bg:'03-blocks-hd.svg',tone:'',html:'<div class="wc-die"></div><strong>DADO</strong><p>Todo puede cambiar.</p>',cue:'wood'},
{ms:4450,bg:'07-final-hd.svg',tone:'gold',html:'<small>GRAN FINAL</small><strong>2 — 2</strong><p>Todo en juego.</p>',cue:'thump'}
];seq.forEach(x=>cinemaTimers.push(setTimeout(()=>{wcSetBg(x.bg,x.tone);wcEvent(x.html);x.cue==='wood'?wcWood():wcThump(.035,.2)},x.ms)))}
cinemaEscalation=function(){const flash=document.getElementById('c11Flash');if(!flash)return;const seq=[['FÍSICA','03-blocks-hd.svg',''],['DIGITAL','11-home-hd.svg','blue'],['PENALES','05-penalty-hd.svg',''],['LEYENDA','02-america-hd.svg','gold']];seq.forEach((x,i)=>cinemaTimers.push(setTimeout(()=>{wcSetBg(x[1],x[2]);flash.innerHTML=`<strong>${x[0]}</strong>`;flash.classList.remove('pulse');void flash.offsetWidth;flash.classList.add('pulse');i===2?wcThump(.04,.23):wcWood()},420+i*1050)))}
startCinemaIntro=function(){wcEnsure();cinemaClearTimers();wcAudioStop();wcAudioStart();cinemaRunning=true;const intro=document.getElementById('cinemaIntro');intro.classList.add('show','playing');intro.dataset.scene='1';const start=document.getElementById('c11Start');if(start)start.classList.add('hidden');document.getElementById('cinemaSkip').style.display='block';let acc=0;cinemaScenes.forEach((sc,i)=>{cinemaTimers.push(setTimeout(()=>cinemaSetScene(i),acc));acc+=sc.ms});cinemaTimers.push(setTimeout(()=>finishCinemaIntro(),acc+80))}
const _wcOldFinish=finishCinemaIntro;finishCinemaIntro=function(){localStorage.setItem(WC_INTRO_KEY,'1');wcAudioStop();_wcOldFinish()}
const _wcOldSkip=skipCinemaIntro;skipCinemaIntro=function(){localStorage.setItem(WC_INTRO_KEY,'1');wcAudioStop();_wcOldSkip()}
showCinemaIntro=function(replay=true){wcEnsure();cinemaClearTimers();const intro=document.getElementById('cinemaIntro');intro.classList.add('show');intro.classList.remove('playing','c11-exit');intro.dataset.scene='0';const start=document.getElementById('c11Start');if(start)start.classList.toggle('hidden',replay);document.getElementById('cinemaSkip').style.display=replay?'block':'none';document.getElementById('cinemaProgress').style.width='0';if(replay)startCinemaIntro()}
maybeOfferCinema=function(){if(cinemaAutoOffered)return;const app=document.getElementById('app');if(!app||getComputedStyle(app).display==='none')return;cinemaAutoOffered=true;upgradeHome();upgradeFormatScreen();wcEnsure();if(!localStorage.getItem(WC_INTRO_KEY))showCinemaIntro(false)}
window.showCinemaIntro=showCinemaIntro;window.startCinemaIntro=startCinemaIntro;window.skipCinemaIntro=skipCinemaIntro;
