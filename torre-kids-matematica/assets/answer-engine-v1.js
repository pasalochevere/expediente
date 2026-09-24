/* CHÉVERE KIDS · ANSWER ENGINE V1 · P0.8.5 */
(()=>{
 const ENGINE='1.0.0';
 const speedLike=/\b(en\s+\d+\s+segundos|dec[ií]|cont[aá]|tabla|todos juegan|tira|tir[aá]|dado|otro jugador|nombr[aá]|super reto)\b/i;
 const variableLike=/^(depende|cualquier|ej\.?[: ]|ejemplo)/i;
 function answerMode(x){
   const a=String(x?.answer||'').trim(),p=String(x?.prompt||'');
   if(variableLike.test(a)||speedLike.test(p)) return 'supervised';
   if(/^[-+]?\d+(?:[.,]\d+)?$/.test(a)) return 'number';
   const nums=a.match(/\d+/g)||[];
   if(nums.length>1 && /consecutiv|cu[aá]les son|n[uú]meros/i.test(p)) return 'numberset';
   return 'supervised';
 }
 function keyFor(){const x=S.challenge||{};return [S.piece,x.color,x.level,x.prompt].join('|')}
 function ensureState(){
   const k=keyFor();
   if(!S._answerState||S._answerState.key!==k)S._answerState={key:k,attempts:0,hint:false,solution:false,value:''};
   return S._answerState;
 }
 function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
 function baseShell(inner,side=''){
   const x=S.challenge;
   return missionProgressHTML()+'<div class="challenge-shell"><div class="challenge-card"><div class="challenge-meta"><span class="piece-badge">🧱 Pieza '+String(S.piece).padStart(2,'0')+'</span><span class="category-badge '+x.color+'">'+categoryIcon(x.color,'pictogram')+x.category+'</span></div><div class="note">Nivel '+S.level+(S.style==='digital'?' · Solo Digital':' · Con Torre')+'</div><div class="challenge">'+x.prompt+'</div>'+inner+'</div><aside class="challenge-side feedback-pop">'+(side||('<div class="speech">'+phrase('challenge')+'</div>'+kidMascot('mascot mini mascot-bob')+'<b>¡Pensalo antes de comprobar!</b>'))+'</aside></div>';
 }
 function directInputHTML(mode,st){
   const placeholder=mode==='number'?'Escribí tu resultado':'Ej. 9, 10, 11';
   const keypad=mode==='number'?'<div class="answer-keypad">'+[1,2,3,4,5,6,7,8,9].map(n=>'<button class="answer-key" type="button" onclick="activeAnswerDigit(\''+n+'\')">'+n+'</button>').join('')+'<button class="answer-key zero" type="button" onclick="activeAnswerDigit(\'0\')">0</button></div>':'';
   const inputmode=mode==='number'?'numeric':'text';
   const type=mode==='number'?'text':'text';
   return '<div class="answer-active-card"><div class="answer-active-head"><div class="answer-active-title">✍️ TU RESPUESTA</div><div class="answer-active-badge">🔒 ANTI-TRAMPA ACTIVO</div></div><div class="answer-display-wrap"><input id="activeAnswerInput" class="answer-display" type="'+type+'" inputmode="'+inputmode+'" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="'+placeholder+'" value="'+esc(st.value||'')+'"><button class="answer-clear" type="button" onclick="activeAnswerBackspace()">⌫</button></div>'+keypad+'<button class="btn full answer-check" type="button" onclick="submitActiveAnswer()">✓ COMPROBAR</button><div id="answerFeedback" class="answer-feedback"></div>'+(st.hint?'<div class="answer-hint-box"><b>🔎 PISTA</b>'+esc(S.challenge.hint)+'</div>':'')+(st.solution?'<div class="answer-solution-box"><b>La solución es</b><div class="answer">'+esc(S.challenge.answer)+'</div><p class="note">No suma estrellas, pero podés hacer un mini reto para recuperar una.</p><div class="choice-grid"><button class="btn" type="button" onclick="recover()">⚡ MINI RETO</button><button class="btn light" type="button" onclick="next()">SEGUIR</button></div></div>':'')+'<div class="answer-help-row"><button id="hintBtnActive" class="btn light '+(st.attempts>=2&&!st.hint?'':'hidden-help')+'" type="button" onclick="showActiveHint()">🔎 NECESITO UNA PISTA</button><button id="solutionBtnActive" class="btn light '+(st.attempts>=3&&!st.solution?'':'hidden-help')+'" type="button" onclick="showActiveSolution()">👀 VER SOLUCIÓN</button><button class="btn alt-challenge" type="button" onclick="otherChallenge()">🔄 OTRO DESAFÍO</button></div><div class="anti-cheat-stamp">✓ Primero respondés · después comprobamos</div></div>';
 }
 function supervisedHTML(){
   return '<div class="supervised-card"><h3>🗣️ Desafío para hacer en voz alta</h3><p>En este tipo de desafío no hay un único número para escribir. Hacelo primero y recién después pedí la validación.</p><div class="supervised-note">👨‍👩‍👧 Un adulto, docente o compañero valida el resultado. La respuesta de referencia queda oculta hasta que indiquen que ya terminaron.</div><button class="btn full" type="button" onclick="finishSupervisedAnswer()">✅ YA TERMINÉ · VALIDAR</button><button class="btn light full" style="margin-top:9px" type="button" onclick="otherChallenge()">🔄 OTRO DESAFÍO</button></div><div class="anti-cheat-stamp">🔒 La referencia no se muestra antes de responder</div>';
 }
 function renderChallenge(){
   const x=S.challenge;if(!x)return;
   const st=ensureState(),mode=answerMode(x);
   if(!st._opened){st._opened=true;if(x.color==='negro')try{playSfx('super')}catch(e){}}
   view(baseShell(mode==='supervised'?supervisedHTML():directInputHTML(mode,st)));
   if(mode!=='supervised'){
     setTimeout(()=>{const i=document.getElementById('activeAnswerInput');if(i){i.addEventListener('input',()=>{const s=ensureState();s.value=i.value;if(mode==='number')i.value=i.value.replace(/[^0-9.,-]/g,'').slice(0,10)});i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();window.submitActiveAnswer()}});if(innerWidth>700)i.focus();}},0);
   }
 }
 function normalizeNum(s){return Number(String(s).trim().replace(',','.'))}
 function checkAnswer(value,mode,x){
   if(mode==='number'){const a=normalizeNum(value),b=normalizeNum(x.answer);return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-9}
   if(mode==='numberset'){
     const got=(String(value).match(/-?\d+(?:[.,]\d+)?/g)||[]).map(normalizeNum).filter(Number.isFinite).sort((a,b)=>a-b);
     const exp=(String(x.answer).match(/-?\d+(?:[.,]\d+)?/g)||[]).map(normalizeNum).filter(Number.isFinite).sort((a,b)=>a-b);
     return got.length===exp.length&&got.every((n,i)=>Math.abs(n-exp[i])<1e-9)
   }
   return false;
 }
 function earnedPoints(){return S.hinted?1:(S.color==='negro'?3:2)}
 function showCorrect(value){
   recordPractice();playSfx('success');const pts=earnedPoints();S.scores[S.p]+=pts;
   const sum=totalStars();if(String(S.mode||'').includes('mision')&&sum>=S.mission)return missionWin();
   view(missionProgressHTML()+'<div class="challenge-shell"><div class="challenge-card result-good feedback-pop"><div class="anti-cheat-stamp">✓ RESPUESTA COMPROBADA</div><h1 style="font-size:clamp(2.3rem,7vw,3.5rem);margin:12px 0">'+phrase('good')+'</h1><div class="result-input-value">'+esc(value)+'</div><div class="stars star-burst">'+'⭐'.repeat(pts)+'</div><p>Ganaste '+pts+' estrella'+(pts===1?'':'s')+'.</p>'+(S.style==='tower'?'<div class="card" style="box-shadow:none"><b>🧱 Ahora colocá la pieza arriba de la torre.</b></div>':'')+'<button class="btn full" onclick="next()">SIGUIENTE TURNO</button></div><aside class="challenge-side feedback-pop"><div class="speech">'+phrase('good')+'</div>'+kidMascot('mascot mini mascot-bob')+'<b>¡Respuesta comprobada! 💛</b></aside></div>');
 }
 window.activeAnswerDigit=function(d){const st=ensureState(),i=document.getElementById('activeAnswerInput');st.value=String(st.value||'')+d;if(i){i.value=st.value;i.focus()}};
 window.activeAnswerBackspace=function(){const st=ensureState(),i=document.getElementById('activeAnswerInput');st.value=String(st.value||'').slice(0,-1);if(i){i.value=st.value;i.focus()}};
 window.submitActiveAnswer=function(){
   const x=S.challenge,st=ensureState(),mode=answerMode(x),i=document.getElementById('activeAnswerInput');if(i)st.value=i.value;
   if(!String(st.value||'').trim()){const f=document.getElementById('answerFeedback');if(f){f.textContent='Escribí una respuesta antes de comprobar.';f.className='answer-feedback show bad'};return}
   if(checkAnswer(st.value,mode,x))return showCorrect(st.value);
   st.attempts++;playSfx('close');const f=document.getElementById('answerFeedback');if(f){f.textContent=st.attempts===1?'Casi. Revisalo y probá otra vez.':st.attempts===2?'Todavía no. Ahora podés pedir una pista.':'Probemos de otra manera. Ya podés ver una pista o la solución.';f.className='answer-feedback show bad'};
   st.value='';if(i)i.value='';
   const hb=document.getElementById('hintBtnActive'),sb=document.getElementById('solutionBtnActive');if(st.attempts>=2&&hb)hb.classList.remove('hidden-help');if(st.attempts>=3&&sb)sb.classList.remove('hidden-help');
 };
 window.showActiveHint=function(){const st=ensureState();st.hint=true;S.hinted=true;playSfx('hint');renderChallenge()};
 window.showActiveSolution=function(){const st=ensureState();if(st.attempts<3)return;st.solution=true;renderChallenge()};
 window.finishSupervisedAnswer=function(){
   const x=S.challenge;
   view(baseShell('<div class="supervised-card"><h3>👨‍👩‍👧 VALIDACIÓN</h3><p class="note">Respuesta / referencia:</p><div class="answer">'+esc(x.answer)+'</div><h3>¿Lo logró?</h3><div class="choice-grid"><button class="btn" onclick="ok()">✅ SÍ</button><button class="btn light" onclick="no()">TODAVÍA NO</button></div></div>',''+kidMascot('mascot mini')+'<div class="speech">¡Ahora sí, validamos!</div>'));
 };
 window.showChallenge=renderChallenge;
 window.answer=function(){renderChallenge()};
 window.hint=function(){window.showActiveHint()};
 window.CHEVERE_ANSWER_ENGINE={version:ENGINE,mode:answerMode};
})();
