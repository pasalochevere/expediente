/* CHÉVERE KIDS · CINEMA ENGINE V3 · P0.8.4.2 */
(()=>{
  const DUR=[1800,2100,2200,2500,2300,2200,2000];
  let timers=[],scene=0,started=false,root=null;
  const clearTimers=()=>{timers.forEach(clearTimeout);timers=[]};
  const q=s=>root?.querySelector(s);
  function particles(){
    return Array.from({length:32},(_,i)=>`<i class="ck3-particle" style="left:${(i*37)%97}%;top:${55+(i*23)%42}%;--dur:${4+(i%5)*.7}s;--delay:${-(i%9)*.46}s;--dx:${-55+(i*17)%110}px"></i>`).join('');
  }
  function towerRows(){
    const rows=[[51,27,46],[48,44,39],[18,13,11],[15,24,54],[22,31,16],[32,39,10],[36,45,12]];
    const colors=['#ef5650','#2fc27d','#3c9cff','#ffc83d','#e84ea2','#303030'];
    return rows.map((r,i)=>`<div class="ck3-tower-row" style="--d:${.06+i*.13}s">${r.map((n,j)=>`<div class="ck3-block" style="--c:${colors[(i+j)%colors.length]}">${String(n).padStart(2,'0')}</div>`).join('')}</div>`).join('');
  }
  function markup(){return `
    <div class="ck3-stage" data-scene="1">
      <div class="ck3-sky"></div><div class="ck3-hills"></div><div class="ck3-clouds"></div><div class="ck3-particles">${particles()}</div><div class="ck3-vignette"></div><div class="ck3-grain"></div>
      <div class="ck3-topbar"><div class="ck3-brand-mini">CHÉVERE KIDS · CINEMA ENGINE V3</div><button class="ck3-skip" type="button" data-skip>SALTAR INTRO</button></div>
      <div class="ck3-progress">${Array.from({length:7},(_,i)=>`<i class="ck3-dot${i===0?' on':''}"></i>`).join('')}</div>
      <div class="ck3-scenes">
        <section class="ck3-scene ck3-scene-1 active" data-n="1"><div class="ck3-scene-inner"><div class="ck3-kicker">TODO EMPIEZA CON UNA PREGUNTA</div><div class="ck3-question">?</div><h2>¿Y si aprender<br><span>fuera una aventura?</span></h2></div></section>
        <section class="ck3-scene ck3-scene-2" data-n="2"><div class="ck3-symbol-field"><span class="ck3-symbol s1">1</span><span class="ck3-symbol s2">2</span><span class="ck3-symbol s3">÷</span><span class="ck3-symbol s4">×</span><span class="ck3-symbol s5">+</span></div><div class="ck3-scene-inner"><div class="ck3-kicker">LOS NÚMEROS COBRAN VIDA</div><h2>Explorá. Pensá.<br>Descubrí.</h2><p>Cada desafío abre una nueva puerta.</p></div></section>
        <section class="ck3-scene ck3-scene-3" data-n="3"><div class="ck3-scene-inner"><div class="ck3-mascot-wrap"><img class="ck3-mascot" src="assets/mascota-bloqui.svg" alt="Mascota Chévere Kids"><div class="ck3-speech">¡Vamos! Hay una misión esperándonos ✨</div></div></div></section>
        <section class="ck3-scene ck3-scene-4" data-n="4"><div class="ck3-scene-inner"><div class="ck3-kicker">CONSTRUÍ TU CAMINO</div><h2>Un bloque.<br>Un desafío.</h2><div class="ck3-tower-stage"><div class="ck3-ring"></div><div class="ck3-tower">${towerRows()}</div></div></div></section>
        <section class="ck3-scene ck3-scene-5" data-n="5"><div class="ck3-scene-inner"><div class="ck3-kicker">6 FORMAS DE ENTRENAR LA MENTE</div><h2 class="ck3-bigline">Cada color<br><span>es una aventura.</span></h2><div class="ck3-categories"><div class="ck3-cat"><i>➕</i><b>Cálculo</b></div><div class="ck3-cat"><i>✖️</i><b>Multiplicación</b></div><div class="ck3-cat"><i>🧩</i><b>Lógica</b></div><div class="ck3-cat"><i>💡</i><b>Problemas</b></div><div class="ck3-cat"><i>⚡</i><b>Velocidad</b></div><div class="ck3-cat"><i>⭐</i><b>Súper desafío</b></div></div></div></section>
        <section class="ck3-scene ck3-scene-6" data-n="6"><div class="ck3-path"></div><div class="ck3-scene-inner"><div class="ck3-kicker">PEQUEÑOS PASOS · GRANDES LOGROS</div><h2 class="ck3-bigline">Pequeños desafíos.<br><span>Grandes mentes.</span><small>MATEMÁTICA PARA LA VIDA</small></h2></div></section>
        <section class="ck3-scene ck3-scene-7" data-n="7"><div class="ck3-scene-inner"><img class="ck3-logo-reveal" src="assets/torre-kids-logo.svg" alt="Chévere Kids Matemática"><div class="ck3-final-card"><div class="ck3-kicker">JUGANDO Y APRENDIENDO · 7–9 AÑOS</div><p>Elegí tu forma de jugar y empezá la aventura.</p><div class="ck3-actions"><button class="ck3-btn primary" type="button" data-enter>▶ JUGAR AHORA</button><button class="ck3-btn secondary" type="button" data-rules>📖 CÓMO SE JUEGA</button></div></div></div></section>
      </div>
      <div class="ck3-caption">Escena <span data-caption>1</span> de 7</div>
      <div class="ck3-start"><div class="ck3-start-card"><img class="ck3-start-logo" src="assets/torre-kids-logo.svg" alt="Chévere Kids Matemática"><h2>La aventura está por comenzar.</h2><p>Activá el sonido y viví la intro completa.</p><button class="ck3-touch" type="button" data-start>✨ TOCÁ PARA COMENZAR</button></div></div>
    </div>`}
  function setScene(n){
    scene=n;const stage=q('.ck3-stage');if(!stage)return;stage.dataset.scene=String(n);
    root.querySelectorAll('.ck3-scene').forEach(x=>x.classList.toggle('active',Number(x.dataset.n)===n));
    root.querySelectorAll('.ck3-dot').forEach((x,i)=>x.classList.toggle('on',i===n-1));
    const cap=q('[data-caption]');if(cap)cap.textContent=String(n);
    if(window.playSfx && n===4) try{window.playSfx('super')}catch(e){}
    if(window.playSfx && n===7) try{window.playSfx('mission')}catch(e){}
  }
  function introTone(f,at,d=.3,v=.035,type='sine'){
    try{const ctx=window.ensureAudio?.();if(!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=f;const t=ctx.currentTime+at;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);if(window.A?.sfxBus)g.connect(window.A.sfxBus);else g.connect(ctx.destination);o.start(t);o.stop(t+d+.03)}catch(e){}
  }
  function score(){
    try{window.ensureAudio?.();window.stopMusic?.()}catch(e){}
    [0,2.0,4.2,6.4,8.8,11.1,13.5,15.2].forEach((t,i)=>{const chord=[[261.6,329.6,392],[293.7,370,440],[329.6,392,493.9],[349.2,440,523.3]][i%4];chord.forEach((f,j)=>introTone(f,t+j*.035,.55,.018,'triangle'));if(i>1)introTone(659+t*5,t+.18,.28,.02,'sine')});
  }
  function schedule(){
    clearTimers();let acc=0;DUR.forEach((d,i)=>{if(i>0)timers.push(setTimeout(()=>setScene(i+1),acc));acc+=d});
  }
  function start(){
    if(started)return;started=true;q('.ck3-start')?.classList.add('gone');
    try{window.ensureAudio?.();score()}catch(e){}
    setScene(1);schedule();
  }
  function close(enter=false){
    clearTimers();started=false;if(!root)return;root.classList.add('hidden');document.body.classList.remove('ck3-open');
    try{if(window.A?.music)window.startMusic?.()}catch(e){}
    if(enter&&typeof window.showPlayStyle==='function')setTimeout(()=>window.showPlayStyle(),120);
  }
  function render(){
    root=document.getElementById('cinemaIntro');if(!root)return false;root.className='cinema-intro ck3 hidden';root.innerHTML=markup();
    q('[data-start]')?.addEventListener('click',start);q('[data-skip]')?.addEventListener('click',()=>close(false));q('[data-enter]')?.addEventListener('click',()=>close(true));q('[data-rules]')?.addEventListener('click',()=>{close(false);window.showRules?.()});return true;
  }
  window.showCinema=function(){
    if(!root&&!render())return;clearTimers();started=false;setScene(1);q('.ck3-start')?.classList.remove('gone');root.classList.remove('hidden');document.body.classList.add('ck3-open');
  };
  window.closeCinema=close;
  window.launchCinema=function(){try{sessionStorage.removeItem('tk_cinema_seen')}catch(e){};window.showCinema();};
  window.startCinemaV3=start;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
})();
