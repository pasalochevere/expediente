/* CHÉVERE KIDS · P0.8.6 · QA KIDS + UX POLISH V1 */
(()=>{
 const VERSION='1.0.0';
 let decorateQueued=false;
 const $=(s,r=document)=>r.querySelector(s);
 const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
 function answerState(){try{return (typeof S!=='undefined'&&S&&S._answerState)||null}catch(e){return null}}
 function queueDecorate(){if(decorateQueued)return;decorateQueued=true;requestAnimationFrame(()=>{decorateQueued=false;decorate()})}
 function confetti(card){
   if(!card||card.querySelector('.qa-confetti'))return;
   const box=document.createElement('div');box.className='qa-confetti';
   const cols=['#ff665d','#ffd34d','#2bb673','#2d87e8','#e84ea2'];
   for(let i=0;i<18;i++){
     const p=document.createElement('i');p.style.setProperty('--x',((i*37)%96+2)+'%');p.style.setProperty('--c',cols[i%cols.length]);p.style.setProperty('--r',(-30+(i*23)%70)+'deg');p.style.setProperty('--d',((i%7)*.045)+'s');p.style.setProperty('--dx',(-60+(i*31)%120)+'px');box.appendChild(p);
   }
   card.appendChild(box);
 }
 function answerProgress(card,st){
   if(!card||!st)return;
   const badge=card.querySelector('.answer-active-badge');
   if(badge)badge.textContent='✍️ PRIMERO RESPONDEMOS';
   let steps=card.querySelector('.qa-answer-steps');
   if(!steps){
     steps=document.createElement('div');steps.className='qa-answer-steps';
     const head=card.querySelector('.answer-active-head');if(head)head.insertAdjacentElement('afterend',steps);else card.prepend(steps);
   }
   const inputHas=String(st.value||'').trim().length>0;
   steps.innerHTML='<div class="qa-answer-step done">🧠 <span>PENSÁ</span></div><div class="qa-answer-step '+(inputHas?'done':'on')+'">✍️ <span>RESPONDÉ</span></div><div class="qa-answer-step '+(inputHas?'on':'')+'">✓ <span>COMPROBÁ</span></div>';
   let a=card.querySelector('.qa-attempts');
   if(!a){a=document.createElement('div');a.className='qa-attempts';const display=card.querySelector('.answer-display-wrap');if(display)display.insertAdjacentElement('afterend',a)}
   const used=Math.min(3,Number(st.attempts||0));
   const current=Math.min(2,used);
   const label=st.solution?'Solución abierta · sin puntaje':used===0?'Tenés 3 intentos antes de ver la solución':used===1?'Te quedan 2 intentos':used===2?'Te queda 1 intento antes de ver la solución':'Podés ver la solución o seguir intentando';
   a.innerHTML='<span>'+label+'</span><span class="qa-attempt-dots">'+[0,1,2].map(i=>'<i class="qa-attempt-dot '+(i<used?'used':(!st.solution&&i===current?'current':'') )+'"></i>').join('')+'</span>';
   if(st.solution)lockSolution(card);
 }
 function lockSolution(card){
   if(!card)return;card.classList.add('solution-locked');
   $$('.answer-display,.answer-clear,.answer-key,.answer-check',card).forEach(el=>{el.disabled=true;el.setAttribute('aria-disabled','true')});
   let note=card.querySelector('.qa-solution-lock');
   if(!note){note=document.createElement('div');note.className='qa-solution-lock';note.textContent='👀 Ya viste la solución. Este desafío no suma estrellas; podés hacer el mini reto para recuperar una.';const sol=card.querySelector('.answer-solution-box');if(sol)sol.insertAdjacentElement('beforebegin',note)}
 }
 function enhanceFeedback(){
   const bad=$('.answer-feedback.show.bad');if(bad){bad.setAttribute('role','alert');bad.setAttribute('aria-live','assertive')}
   const good=$('.result-good');if(good){good.setAttribute('role','status');good.setAttribute('aria-live','polite');confetti(good)}
 }
 function enhanceSupervised(){
   const c=$('.supervised-card');if(!c)return;
   const h=c.querySelector('h3');if(h&&/voz alta/i.test(h.textContent))h.textContent='🗣️ Primero hacelo · después validamos';
   const stamp=c.parentElement?.querySelector('.anti-cheat-stamp');if(stamp)stamp.textContent='✓ La referencia aparece después de responder';
 }
 function enhanceTouchTargets(){
   $$('.btn,.choice,.level,.piece,.color,.answer-key,.floating-tool').forEach(el=>{if(!el.hasAttribute('aria-label')&&el.classList.contains('answer-key'))el.setAttribute('aria-label','Número '+el.textContent.trim())});
 }
 function enhanceScreen(){
   const screen=$('#screen');if(!screen)return;screen.setAttribute('aria-live','polite');screen.setAttribute('aria-atomic','false');
   const ch=$('.challenge-card>.challenge',screen);if(ch){ch.setAttribute('tabindex','-1');ch.setAttribute('aria-label','Desafío: '+ch.textContent.trim())}
 }
 function decorate(){
   document.body.classList.add('kids-qa-v1');
   const st=answerState(),card=$('.answer-active-card');if(card&&st)answerProgress(card,st);
   const badge=$('.answer-active-badge');if(badge)badge.textContent='✍️ PRIMERO RESPONDEMOS';
   $$('.anti-cheat-stamp').forEach(x=>{if(/anti|primero respond/i.test(x.textContent))x.textContent='✓ Primero respondés · después comprobamos'});
   enhanceFeedback();enhanceSupervised();enhanceTouchTargets();enhanceScreen();orientationClass();
 }
 function orientationClass(){document.body.classList.toggle('qa-phone-landscape',innerHeight<540&&innerWidth>innerHeight)}
 function safeFeedback(msg){const f=$('#answerFeedback');if(f){f.textContent=msg;f.className='answer-feedback show bad';f.setAttribute('role','alert')}}
 function patchAnswerEngine(){
   if(typeof window.submitActiveAnswer==='function'&&!window.submitActiveAnswer.__qaWrapped){
     const orig=window.submitActiveAnswer;
     const wrapped=function(){const st=answerState();if(st?.solution){safeFeedback('Ya viste la solución. Para sumar una estrella, hacé el mini reto.');queueDecorate();return}const r=orig.apply(this,arguments);queueDecorate();return r};wrapped.__qaWrapped=true;window.submitActiveAnswer=wrapped;
   }
   ['showActiveHint','showActiveSolution','activeAnswerDigit','activeAnswerBackspace','finishSupervisedAnswer'].forEach(name=>{
     const fn=window[name];if(typeof fn!=='function'||fn.__qaWrapped)return;
     const wrap=function(){const r=fn.apply(this,arguments);queueDecorate();return r};wrap.__qaWrapped=true;window[name]=wrap;
   });
   if(typeof window.showChallenge==='function'&&!window.showChallenge.__qaWrapped){const fn=window.showChallenge;const wrap=function(){const r=fn.apply(this,arguments);queueDecorate();return r};wrap.__qaWrapped=true;window.showChallenge=wrap;window.answer=wrap}
 }
 function observe(){
   const target=$('#screen')||document.body;
   new MutationObserver(()=>queueDecorate()).observe(target,{childList:true,subtree:true,attributes:false});
 }
 function init(){document.body.classList.add('kids-qa-v1');patchAnswerEngine();observe();decorate();addEventListener('resize',orientationClass,{passive:true});addEventListener('orientationchange',()=>setTimeout(orientationClass,120),{passive:true});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 window.CHEVERE_KIDS_QA={version:VERSION,decorate};
})();
