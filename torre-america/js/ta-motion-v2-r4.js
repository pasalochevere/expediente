/* TA-UI V2.0-P0.3R4 — Microinteracciones premium de presentación.
   Solo preview. NO intercepta go(), click, temporizadores, poderes ni puntuación.
   Sin vibración, sin cámara móvil, sin redes ni temporizadores que bloqueen.
*/
(function(){
  "use strict";
  const VERSION="TA-UI-V2-P0.3R4";
  const doc=document;
  const particleSpecs=[
    [12,41,-46,-84,-95,0,780,0],[27,34,-24,-99,130,42,890,1],
    [44,24,-11,-75,-74,50,730,2],[59,34,24,-110,104,90,880,0],
    [78,36,56,-90,-120,115,820,1],[88,46,28,-67,145,50,770,2],
    [18,59,-57,-48,76,130,890,2],[39,63,-29,-73,-106,170,830,0],
    [64,58,36,-61,136,145,750,1],[81,69,39,-78,-88,195,910,2],
    [47,75,15,-55,55,210,780,0],[32,81,-17,-48,155,230,840,1],
    [56,17,8,-70,-92,80,910,2],[69,81,20,-56,92,150,850,0]
  ];
  const colors=["#f4d38e","#a5e1b6","#f8f0cb"];
  const reduced=window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null;
  function applyPrefs(){
    doc.body.classList.toggle("ta-r4-no-motion",!!reduced?.matches);
    if(window.TA_MOTION_QA)window.TA_MOTION_QA.enabled=!reduced?.matches&&!doc.body.classList.contains("fx-off");
  }
  function makeParticles(screenId,anchorSelector,count){
    const screen=doc.getElementById(screenId);
    const anchor=screen?.querySelector(anchorSelector);
    if(!anchor||anchor.querySelector(".ta-r4-particles"))return false;
    const wrapper=doc.createElement("span");
    wrapper.className="ta-r4-particles";
    wrapper.setAttribute("aria-hidden","true");
    for(const [x,y,dx,dy,rot,delay,duration,colorIndex] of particleSpecs.slice(0,count)){
      const p=doc.createElement("i");
      p.className="ta-r4-particle";
      p.style.setProperty("--ta-x",x+"%");
      p.style.setProperty("--ta-y",y+"%");
      p.style.setProperty("--ta-dx",dx+"px");
      p.style.setProperty("--ta-dy",dy+"px");
      p.style.setProperty("--ta-rot",rot+"deg");
      p.style.setProperty("--ta-delay",delay+"ms");
      p.style.setProperty("--ta-duration",duration+"ms");
      p.style.setProperty("--ta-c",colors[colorIndex]||colors[0]);
      wrapper.appendChild(p);
    }
    anchor.appendChild(wrapper);
    return true;
  }
  function watchTimer(id){
    const timer=doc.getElementById(id);
    if(!timer)return;
    const refresh=()=>{
      const seconds=Number.parseInt(timer.textContent||"",10);
      const low=Number.isFinite(seconds)&&seconds>=0&&seconds<=3;
      timer.classList.toggle("ta-r4-low",low);
    };
    refresh();
    new MutationObserver(refresh).observe(timer,{childList:true,characterData:true,subtree:true});
  }
  function observeScore(){
    const a=doc.getElementById("shootKicksA");
    const b=doc.getElementById("shootKicksB");
    if(!a||!b)return;
    let previous=null;
    let timeout=0;
    const check=()=>{
      let sh=null;
      try{sh=(typeof S!=="undefined")?S.shootout:null;}catch(_e){}
      if(!sh){
        previous=null;return;
      }
      const total=(Array.isArray(sh.kicksA)?sh.kicksA.length:0)+(Array.isArray(sh.kicksB)?sh.kicksB.length:0);
      if(previous===null){previous=total;return;}
      if(total<=previous){previous=total;return;}
      previous=total;
      if(doc.body.classList.contains("fx-off")||reduced?.matches)return;
      const last=sh.side==="A"?a:b;
      last.classList.remove("ta-r4-new-kick");
      void last.offsetWidth;
      last.classList.add("ta-r4-new-kick");
      window.clearTimeout(timeout);
      timeout=window.setTimeout(()=>last.classList.remove("ta-r4-new-kick"),400);
    };
    const observer=new MutationObserver(check);
    observer.observe(a,{childList:true,subtree:true,characterData:true});
    observer.observe(b,{childList:true,subtree:true,characterData:true});
    check();
  }
  function init(){
    if(doc.body.dataset.taMotionR4==="1")return;
    if(!doc.getElementById("app"))return;
    doc.body.dataset.taMotionR4="1";
    doc.body.classList.add("ta-motion-r4");
    doc.body.classList.add("ta-r4-particles-ready");
    const confettiGoal=makeParticles("result",":scope > .card",12);
    const confettiFinal=makeParticles("gameover",":scope > .hero-stage",14);
    watchTimer("penTimer");
    watchTimer("shootTimer");
    observeScore();
    window.TA_MOTION_QA={
      version:VERSION,
      enabled:true,
      goalParticles:confettiGoal?12:0,
      finalParticles:confettiFinal?14:0,
      interactiveDelays:0,
      usesVibration:false,
      movesViewport:false
    };
    applyPrefs();
    if(reduced){
      if(typeof reduced.addEventListener==="function")reduced.addEventListener("change",applyPrefs);
      else if(typeof reduced.addListener==="function")reduced.addListener(applyPrefs);
    }
    // El interruptor de animaciones ya existente controla fx-off; se lo respeta por CSS.
  }
  if(doc.readyState==="loading")doc.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();