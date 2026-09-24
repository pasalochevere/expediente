/* CHÉVERE KIDS · P0.8.7 · REWARDS ENGINE V1 */
(()=>{
 const VERSION='1.0.0';
 const milestones=[
   {n:4,icon:'🌟',title:'¡Primer logro!',text:'Ya juntaron 4 estrellas. Cada desafío suma aprendizaje.'},
   {n:8,icon:'🧠',title:'¡Mente en marcha!',text:'8 estrellas y muchas ideas nuevas.'},
   {n:12,icon:'🚀',title:'¡Gran avance!',text:'12 estrellas. Están resolviendo cada vez mejor.'},
   {n:16,icon:'🏅',title:'¡Equipo brillante!',text:'16 estrellas. Tremenda partida.'},
   {n:20,icon:'🏆',title:'¡Misión Chévere!',text:'20 estrellas. Llegaron a una meta enorme.'}
 ];
 const shown=new Set();
 let lastTotal=0,lastBurstKey='';
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
 function safeTotal(){try{return typeof totalStars==='function'?Number(totalStars()||0):0}catch(e){return 0}}
 function levelName(){try{return S.level===3?'Maestro':S.level===2?'Aventurero':'Explorador'}catch(e){return 'Explorador'}}
 function levelClass(){try{return 'level-'+(S.level||1)}catch(e){return 'level-1'}}
 function ensureHud(){
   const screen=$('#screen');if(!screen||screen.classList.contains('hidden'))return;
   if($('.final-hero',screen)||$('.license-card',screen))return;
   let hud=$('.reward-hud',screen);
   if(!hud){hud=document.createElement('div');hud.className='reward-hud';const head=$('.game-head',screen);(head||screen).insertAdjacentElement(head?'afterend':'afterbegin',hud)}
   const total=safeTotal();let completed=0;try{completed=Number(S.completed||0)}catch(e){}
   hud.innerHTML='<span class="reward-hud-pill">⭐ <strong>'+total+'</strong> estrellas</span><span class="reward-hud-pill">🧩 <strong>'+completed+'</strong> desafíos</span><span class="reward-hud-pill '+levelClass()+'">🎯 '+levelName()+'</span>';
   ensureTrack(screen,total);
 }
 function ensureTrack(screen,total){
   if($('.mission-progress',screen)){const old=$('.reward-track',screen);if(old)old.remove();return}
   let track=$('.reward-track',screen);
   if(!track){track=document.createElement('div');track.className='reward-track';const hud=$('.reward-hud',screen);if(hud)hud.insertAdjacentElement('afterend',track)}
   if(!track)return;
   const next=milestones.find(m=>m.n>total);const target=next?next.n:20;const prev=[0,4,8,12,16,20].filter(n=>n<=total).pop()||0;
   const span=Math.max(1,target-prev),pct=next?Math.max(0,Math.min(100,((total-prev)/span)*100)):100;
   track.innerHTML='<div class="reward-track-head"><b>CAMINO DE ESTRELLAS</b><span>'+total+(next?' / '+target:' · meta lograda')+'</span></div><div class="reward-track-line"><div class="reward-track-fill" style="width:'+pct+'%"></div></div><div class="reward-next">'+(next?'Próxima celebración al llegar a '+next.n+' ⭐':'¡Llegaron a una gran meta!')+'</div>';
 }
 function rewardBurst(){
   const good=$('.result-good');if(!good)return;
   good.classList.add('reward-polished');
   const total=safeTotal();let player='';try{player=S.players?.[S.p]||''}catch(e){}
   const key=total+'|'+player+'|'+(good.textContent||'').slice(0,40);if(key===lastBurstKey)return;lastBurstKey=key;
   const starsEl=$('.stars',good);const earned=(starsEl?.textContent.match(/⭐/g)||[]).length||1;
   if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
   const wrap=document.createElement('div');wrap.className='reward-burst';wrap.setAttribute('aria-hidden','true');
   const card=document.createElement('div');card.className='reward-burst-card';
   card.innerHTML='<div class="reward-big-star">⭐</div><h2>¡Muy bien!</h2><p>'+escapeHTML(player||'Seguí así')+'</p><div class="reward-earned">+'+earned+' estrella'+(earned===1?'':'s')+' · total '+total+'</div>';
   const pts=[[0,-125],[82,-90],[125,-20],[105,72],[42,115],[-45,116],[-108,68],[-126,-18],[-80,-92]];
   pts.forEach((p,i)=>{const s=document.createElement('i');s.className='reward-spark';s.style.setProperty('--dx',p[0]+'px');s.style.setProperty('--dy',p[1]+'px');s.style.setProperty('--r',(i*53)+'deg');s.style.setProperty('--d',(i*.035)+'s');s.style.setProperty('--c',['#ffd34d','#ff665d','#2bb673','#2d87e8','#e84ea2'][i%5]);card.appendChild(s)});
   wrap.appendChild(card);document.body.appendChild(wrap);setTimeout(()=>wrap.remove(),1900);
 }
 function milestoneToast(total){
   milestones.forEach(m=>{if(total>=m.n&&lastTotal<m.n&&!shown.has(m.n)){shown.add(m.n);const t=document.createElement('div');t.className='reward-milestone';t.setAttribute('role','status');t.setAttribute('aria-live','polite');t.innerHTML='<div class="reward-milestone-icon">'+m.icon+'</div><div><b>'+m.title+'</b><span>'+m.text+'</span></div>';document.body.appendChild(t);setTimeout(()=>t.remove(),3300)}});
   lastTotal=Math.max(lastTotal,total);
 }
 function medalFor(total){if(total>=20)return ['🏆','Misión Chévere','Una partida enorme: llegaron a 20 estrellas o más.'];if(total>=16)return ['🏅','Equipo brillante','Muchos desafíos resueltos y mucho para celebrar.'];if(total>=12)return ['🚀','Gran avance','Cada desafío fue sumando ideas y confianza.'];if(total>=8)return ['🧠','Mente en marcha','Una muy buena sesión de práctica jugando.'];if(total>=4)return ['🌟','Primer logro','Una partida corta también puede dejar grandes aprendizajes.'];return ['✨','Buen comienzo','Lo importante fue animarse a pensar, probar y seguir.']}
 function finalRewards(){
   const final=$('.final-hero');if(!final||$('.final-reward-panel',final))return;
   final.classList.add('reward-final-polished');const total=safeTotal(),medal=medalFor(total);let practiced=[];try{practiced=Object.entries(S.practiced||{}).filter(([,n])=>n>0).map(([c])=>c)}catch(e){}
   const panel=document.createElement('div');panel.className='final-reward-panel';
   const labels={rojo:'Cálculo',verde:'Multiplicación',azul:'Lógica',amarillo:'Problemas',fucsia:'Velocidad',negro:'Súper'};
   const em={rojo:'🔴',verde:'🟢',azul:'🔵',amarillo:'🟡',fucsia:'🩷',negro:'⚫'};
   panel.innerHTML='<div class="final-reward-medal">'+medal[0]+'</div><h3>'+medal[1]+'</h3><p>'+medal[2]+'</p>'+(practiced.length?'<div class="final-reward-cats">'+practiced.map(c=>'<span class="final-reward-cat">'+(em[c]||'⭐')+' '+(labels[c]||c)+'</span>').join('')+'</div>':'');
   final.appendChild(panel);
 }
 function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
 function polishTurn(){const score=$('.score');if(score)score.setAttribute('aria-label','Puntaje actual: '+score.textContent.trim())}
 function decorate(){
   document.body.classList.add('kids-rewards-v1');ensureHud();polishTurn();rewardBurst();finalRewards();milestoneToast(safeTotal());
 }
 function wrapReset(name){const fn=window[name];if(typeof fn!=='function'||fn.__rwWrapped)return;const w=function(){shown.clear();lastTotal=0;lastBurstKey='';const r=fn.apply(this,arguments);setTimeout(decorate,0);return r};w.__rwWrapped=true;window[name]=w}
 function init(){
   try{lastTotal=safeTotal()}catch(e){}
   ['start','rematch','changeLevelFromFinal','adultRestart'].forEach(wrapReset);
   const screen=$('#screen')||document.body;new MutationObserver(()=>requestAnimationFrame(decorate)).observe(screen,{childList:true,subtree:true});
   decorate();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 window.CHEVERE_KIDS_REWARDS={version:VERSION,decorate};
})();
