/* MP07A — INTRO MODO PREVIA · 9 segundos, salteable y sin audio.
   Se ejecuta únicamente después de la autorización del license-gate. */
(function(){
  'use strict';
  const SEEN='pc_mp_intro_v07a_seen';
  let root=null,timers=[],priorFocus=null;
  const tower=Array.from({length:14},(_,i)=>
    '<div class="mp-intro-tower-row" aria-hidden="true">'+
      Array.from({length:3},()=>'<span class="mp-intro-block"></span>').join('')+
    '</div>').join('');
  function seen(){
    try{return sessionStorage.getItem(SEEN)==='1'}catch{return false}
  }
  function remember(){
    try{sessionStorage.setItem(SEEN,'1')}catch{}
  }
  function clearTimers(){timers.forEach(clearTimeout);timers=[]}
  function onKey(event){
    if(!root)return;
    if(event.key==='Escape'){event.preventDefault();close();return}
    if(event.key==='Tab'){
      const elements=[...root.querySelectorAll('button:not([disabled])')].filter(el=>el.getClientRects().length>0);
      if(!elements.length)return;
      const first=elements[0],last=elements[elements.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    }
  }
  function close(){
    if(!root)return;
    clearTimers();
    const old=root;root=null;
    document.removeEventListener('keydown',onKey,true);
    old.classList.add('is-exiting');
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if(reduced)old.remove();
    else setTimeout(()=>old.remove(),320);
    const target=priorFocus?.isConnected?priorFocus:document.querySelector('#app button');
    if(target&&typeof target.focus==='function')target.focus({preventScroll:true});
  }
  function show(opts={}){
    if(root)close();
    if(!opts.force&&seen())return false;
    const app=document.getElementById('app');
    if(!app)return false;
    priorFocus=document.activeElement;
    remember();
    root=document.createElement('section');
    root.id='mpIntro';
    root.className='mp-intro';
    root.setAttribute('role','dialog');
    root.setAttribute('aria-modal','true');
    root.setAttribute('aria-label','Presentación de MODO PREVIA');
    root.dataset.step='0';
    root.innerHTML=[
      '<button type="button" class="mp-intro-skip" id="mpIntroSkip">SALTAR INTRO ↗</button>',
      '<div class="mp-intro-inner">',
        '<div class="mp-intro-kicker">PASALOCHEVERE PRESENTA · +18</div>',
        '<div class="mp-intro-logo" aria-label="MODO PREVIA"><span class="mi-mode">MODO</span><strong class="mi-previa">PREVIA</strong><i class="mi-spark" aria-hidden="true">✦</i></div>',
        '<div class="mp-intro-line"><b>UNA TORRE</b><b>2 RULETAS</b><b>126 DESAFÍOS</b></div>',
        '<div class="mp-intro-stage" aria-label="Torre de 14 pisos de madera natural y dos ruletas digitales">',
          '<div class="mp-intro-tower" aria-hidden="true">'+tower+'</div>',
          '<div class="mp-intro-phone" aria-hidden="true">',
            '<div class="mp-intro-phone-label">RULETA COMPLETA</div>',
            '<div class="mp-intro-wheel"></div>',
            '<div class="mp-intro-phone-label">3 INTENSIDADES</div>',
          '</div>',
          '<div class="mp-intro-wheel-individual" aria-hidden="true"></div>',
        '</div>',
        '<div class="mp-intro-modes" aria-label="Tres intensidades"><span>TRANQUI</span><span>SUBE</span><span>AL MÁXIMO</span></div>',
        '<div class="mp-intro-bottom">',
          '<strong>¿ESTÁN LISTOS PARA ACTIVAR LA PREVIA?</strong>',
          '<button class="mp-intro-enter" type="button" id="mpIntroEnter">¡A JUGAR! →</button>',
        '</div>',
      '</div>'
    ].join('');
    document.body.appendChild(root);
    root.querySelector('#mpIntroSkip').addEventListener('click',close);
    root.querySelector('#mpIntroEnter').addEventListener('click',close);
    document.addEventListener('keydown',onKey,true);
    root.querySelector('#mpIntroSkip').focus({preventScroll:true});
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if(reduced){root.dataset.step='3';return true}
    timers.push(setTimeout(()=>{if(root)root.dataset.step='1'},1500));
    timers.push(setTimeout(()=>{if(root)root.dataset.step='2'},3100));
    timers.push(setTimeout(()=>{if(root)root.dataset.step='3'},5000));
    timers.push(setTimeout(()=>{if(root)close()},9300));
    return true;
  }
  window.MPIntro={show,close};
  show();
})();