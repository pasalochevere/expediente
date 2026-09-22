(()=>{
  if(window.__pcPreviewRealV21C)return;
  window.__pcPreviewRealV21C=true;

  const norm=(v)=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
  let lastTrigger=null;
  let activeCode='';
  let wrapped=false;

  const kidsProgress=()=>`<div class="pcV21KidsProgress"><img src="../torre-kids-matematica/assets/mascota-bloqui.svg" alt="Bloqui"><div><small>RITMO DE PARTIDA · INTERFAZ DE MUESTRA</small><h4>Resolver. Avanzar. Volver a intentar.</h4><div class="pcV21KidsProgressGrid"><div><b>01 · ELEGÍ</b><span>Categoría o nivel según la partida.</span></div><div><b>02 · RESOLVÉ</b><span>Un desafío por vez, sin saturar la pantalla.</span></div><div><b>03 · PROGRESÁ</b><span>Feedback visual y nuevas rondas para repetir.</span></div></div></div></div>`;

  function patchProducts(){
    const p=window.PC_REAL_PREVIEWS_V2;if(!p)return false;
    ['TK-MAT-79-PHY','TK-MAT-79-DIG'].forEach(code=>{
      if(p[code]&&!p[code].__v21c){
        p[code].slides=[p[code].slides[0],p[code].slides[1],{kind:'ui',label:'Ritmo y progreso',note:'Interfaz de muestra: flujo visual sin revelar ejercicios.',render:kidsProgress}];
        p[code].__v21c=true;
      }
    });
    if(p['EXP-001']&&!p['EXP-001'].__v21c){
      p['EXP-001'].summary='Explorá espacios reales del caso y construí una hipótesis con tu equipo. La preview evita evidencias críticas y resolución.';
      p['EXP-001'].slides.forEach(s=>{if(s.kind==='image')s.note='Escena real del expediente · sin spoilers.'});
      p['EXP-001'].__v21c=true;
    }
    if(p['EXP-002']&&!p['EXP-002'].__v21c){
      p['EXP-002'].summary='Hotel Orfeo, Habitación 317 y roles privados. La preview muestra atmósfera y estructura sin revelar respuestas.';
      p['EXP-002'].slides.forEach(s=>{if(s.kind==='image')s.note='Imagen real del caso · sin spoilers.'});
      p['EXP-002'].__v21c=true;
    }
    if(p['TORRE-AMERICA']&&!p['TORRE-AMERICA'].__v21c){
      p['TORRE-AMERICA'].summary='Una experiencia futbolera con apertura cinematográfica, trivia, desafíos y momentos de partido.';
      p['TORRE-AMERICA'].__v21c=true;
    }
    return true;
  }

  function codeForCard(card){
    if(!card)return '';
    const direct=card.dataset.productCode||'';
    if(direct)return direct;
    const type=String(card.dataset.pcV4Type||'').toLowerCase();
    const text=norm(card.dataset.pcTechnicalTitle||card.dataset.pcCommercialTitle||card.textContent||'');
    if(type==='doble'||text.includes('DOBLE INTENCION'))return 'DI-TRILOGIA';
    if(type==='america'||text.includes('TORRE DE AMERICA'))return 'TORRE-AMERICA';
    if(type==='party'||text.includes('VERDAD O RETO')||text.includes('MEGA PACK'))return 'TORRE-MEGA';
    if(type==='exp001'||text.includes('CASO 001')||text.includes('ULTIMA REUNION'))return 'EXP-001';
    if(type==='exp002'||text.includes('CASO 002')||text.includes('HOTEL ORFEO')||text.includes('317'))return 'EXP-002';
    if(type==='vincores'||text.includes('VINCORES'))return 'VINC-001';
    if(type==='tarot'||text.includes('TAROT'))return 'TAROT-GUIDE';
    if(type==='squishy'||text.includes('PAPER SQUISHY'))return 'PSQ-FACTORY';
    if(type==='math'||text.includes('MATEMATICA')){
      const sub=norm(card.querySelector('.pcMappedSubtitle')?.textContent||'');
      return sub.includes('TORRE FISICA')?'TK-MAT-79-PHY':'TK-MAT-79-DIG';
    }
    return '';
  }

  function cardMatches(card,code){
    const c=codeForCard(card);
    if(c===code)return true;
    if(code.startsWith('TK-MAT')&&c.startsWith('TK-MAT'))return true;
    return false;
  }

  function ownedCard(code){
    const cards=[...document.querySelectorAll('#myGamesGrid .pcSmartCard')].filter(c=>cardMatches(c,code));
    return cards.find(c=>c.classList.contains('smartStateActive'))||cards.find(c=>c.classList.contains('smartStatePending'))||cards[0]||null;
  }

  function closeModal(){
    const modal=document.getElementById('pcRealPreviewModal');
    const close=modal?.querySelector('.pcRv2Close');
    if(close)close.click();
  }

  function setContextualCta(code){
    const modal=document.getElementById('pcRealPreviewModal');if(!modal)return;
    const footer=modal.querySelector('.pcRv2Footer');
    const cta=modal.querySelector('#pcRv2Cta');
    const price=modal.querySelector('#pcRv2Price');
    const priceSmall=modal.querySelector('.pcRv2Price small');
    if(!cta||!footer)return;
    footer.classList.remove('pcV21cOwned','pcV21cPending');
    const card=ownedCard(code);if(!card)return;
    const primary=card.querySelector('.pcSmartMainActions>.btn:first-child');
    if(card.classList.contains('smartStateActive')&&primary){
      footer.classList.add('pcV21cOwned');
      cta.textContent='ABRIR DESDE MI BIBLIOTECA';
      if(priceSmall)priceSmall.textContent='YA ESTÁ EN TU BIBLIOTECA';
      if(price)price.textContent='Acceso activo';
      cta.onclick=()=>{closeModal();setTimeout(()=>primary.click(),70)};
    }else if(card.classList.contains('smartStatePending')&&primary){
      footer.classList.add('pcV21cPending');
      cta.textContent='ACTIVAR MI ACCESO';
      if(priceSmall)priceSmall.textContent='ACCESO PENDIENTE';
      if(price)price.textContent='Listo para activar';
      cta.onclick=()=>{closeModal();setTimeout(()=>primary.click(),70)};
    }
  }

  function prioritizeImages(modal){
    modal.querySelectorAll('.pcRv2Slide[data-kind="image"] img').forEach(img=>{
      const active=img.closest('.pcRv2Slide')?.classList.contains('active');
      img.decoding='async';
      img.loading=active?'eager':'lazy';
      try{img.fetchPriority=active?'high':'low'}catch{}
    });
  }

  function updateProgress(modal){
    const slides=[...modal.querySelectorAll('.pcRv2Slide')];
    const active=Math.max(0,slides.findIndex(s=>s.classList.contains('active')));
    const counter=modal.querySelector('.pcV21cCounterText');if(counter)counter.textContent=`${active+1} / ${slides.length}`;
    modal.querySelectorAll('.pcV21cDot').forEach((d,i)=>d.classList.toggle('active',i===active));
    prioritizeImages(modal);
  }

  function decorateThumbs(modal){
    modal.querySelectorAll('.pcRv2Thumb').forEach((thumb,i)=>{
      if(!thumb.querySelector('.pcV21cThumbNo')){
        const n=document.createElement('i');n.className='pcV21cThumbNo';n.textContent=String(i+1).padStart(2,'0');thumb.appendChild(n);
      }
    });
  }

  function ensureProgress(modal){
    const wrap=modal.querySelector('.pcRv2StageWrap');if(!wrap)return;
    let counter=wrap.querySelector('.pcV21cCounter');
    if(!counter){
      counter=document.createElement('div');counter.className='pcV21cCounter';
      const dots=document.createElement('div');dots.className='pcV21cDots';
      modal.querySelectorAll('.pcRv2Slide').forEach((_,i)=>{
        const b=document.createElement('button');b.type='button';b.className='pcV21cDot';b.setAttribute('aria-label',`Ir a vista ${i+1}`);b.onclick=()=>modal.querySelector(`.pcRv2Thumb[data-index="${i}"]`)?.click();dots.appendChild(b);
      });
      counter.innerHTML='<span class="pcV21cCounterText"></span>';counter.appendChild(dots);wrap.appendChild(counter);
    }
    const gallery=modal.querySelector('.pcRv2Gallery');
    if(gallery&&!gallery.querySelector('.pcV21cSwipeHint')){
      const hint=document.createElement('div');hint.className='pcV21cSwipeHint';hint.textContent='Deslizá para ver más';gallery.appendChild(hint);
    }
    updateProgress(modal);
  }

  function installSwipe(modal){
    const wrap=modal.querySelector('.pcRv2StageWrap');if(!wrap||wrap.dataset.pcSwipe21c==='1')return;
    wrap.dataset.pcSwipe21c='1';wrap.style.touchAction='pan-y';
    let sx=0,sy=0;
    wrap.addEventListener('touchstart',e=>{const t=e.touches?.[0];if(!t)return;sx=t.clientX;sy=t.clientY},{passive:true});
    wrap.addEventListener('touchend',e=>{const t=e.changedTouches?.[0];if(!t)return;const dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)<48||Math.abs(dx)<=Math.abs(dy)*1.15)return;const dir=dx<0?1:-1;modal.querySelector(`.pcRv2Nav button[data-dir="${dir}"]`)?.click()},{passive:true});
  }

  function installFocusTrap(modal){
    if(modal.dataset.pcFocus21c==='1')return;modal.dataset.pcFocus21c='1';
    modal.addEventListener('keydown',e=>{
      if(e.key!=='Tab'||modal.classList.contains('hidden'))return;
      const focusable=[...modal.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el=>!el.disabled&&el.offsetParent!==null);
      if(!focusable.length)return;
      const first=focusable[0],last=focusable[focusable.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    });
    const obs=new MutationObserver(()=>{
      if(modal.classList.contains('hidden')&&lastTrigger?.focus){setTimeout(()=>{try{lastTrigger.focus({preventScroll:true})}catch{}},0)}
    });
    obs.observe(modal,{attributes:true,attributeFilter:['class']});
  }

  function enhanceModal(code){
    const modal=document.getElementById('pcRealPreviewModal');if(!modal||modal.classList.contains('hidden'))return;
    modal.dataset.pcProduct=code;
    decorateThumbs(modal);ensureProgress(modal);installSwipe(modal);installFocusTrap(modal);setContextualCta(code);prioritizeImages(modal);
    if(modal.dataset.pcWatch21c!=='1'){
      modal.dataset.pcWatch21c='1';let queued=false;
      const obs=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;updateProgress(modal)})});
      obs.observe(modal.querySelector('#pcRv2Stage')||modal,{attributes:true,subtree:true,attributeFilter:['class']});
      modal.addEventListener('click',e=>{if(e.target.closest('.pcRv2Thumb,.pcRv2Nav,.pcV21cDot'))setTimeout(()=>updateProgress(modal),0)});
    }
  }

  function installWrapper(){
    if(wrapped||typeof window.openPreview!=='function')return false;
    const previous=window.openPreview;wrapped=true;
    window.openPreview=function(code){
      activeCode=code||'';lastTrigger=document.activeElement;
      const result=previous.apply(this,arguments);
      setTimeout(()=>enhanceModal(activeCode),0);
      setTimeout(()=>enhanceModal(activeCode),80);
      return result;
    };
    return true;
  }

  function boot(){
    const patched=patchProducts();
    const installed=installWrapper();
    return patched&&installed;
  }

  if(!boot()){
    let tries=0;const timer=setInterval(()=>{tries++;if(boot()||tries>50)clearInterval(timer)},100);
  }
})();
