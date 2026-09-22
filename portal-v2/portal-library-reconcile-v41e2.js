(()=>{
  if(window.__pcLibraryReconcileV41E2)return;
  window.__pcLibraryReconcileV41E2=true;

  const norm=(v)=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();

  function mathCards(){
    return [...document.querySelectorAll('#myGamesGrid .pcSmartCard')].filter(card=>{
      const title=norm(card.dataset.pcCommercialTitle||card.querySelector('.pcSmartHead h3')?.textContent||card.textContent);
      return title.includes('CHEVERE KIDS')&&title.includes('MATEMATICA');
    });
  }

  function reconcileKids(){
    const cards=mathCards();
    if(cards.length<3)return false;

    // El acceso canónico actual es el genérico “Aprender jugando”.
    // Sólo colapsamos cuando conviven los 3 registros que se detectaron en QA:
    // canónico + Físico/Digital + Solo Digital. De esta forma no ocultamos
    // a otros compradores que legítimamente tengan una variante específica.
    const canonical=cards.find(card=>{
      const sub=norm(card.querySelector('.pcMappedSubtitle')?.textContent);
      const tech=norm(card.dataset.pcTechnicalTitle);
      return sub.includes('APRENDER JUGANDO') || (!sub.includes('TORRE FISICA')&&!sub.includes('SOLO DIGITAL')&&!tech.includes('FISICO')&&!tech.includes('SOLO DIGITAL'));
    });
    if(!canonical)return false;

    const variants=cards.filter(card=>card!==canonical).filter(card=>{
      const sub=norm(card.querySelector('.pcMappedSubtitle')?.textContent);
      const tech=norm(card.dataset.pcTechnicalTitle);
      return sub.includes('TORRE FISICA')||sub.includes('SOLO DIGITAL')||tech.includes('FISICO + DIGITAL')||tech.includes('SOLO DIGITAL');
    });
    if(variants.length<2)return false;

    variants.forEach(card=>card.remove());
    canonical.dataset.pcCanonicalKids='1';

    // Si un grupo quedó vacío, se elimina su contenedor visual.
    document.querySelectorAll('#myGamesGrid .libraryGroup').forEach(group=>{
      if(!group.querySelector('.pcSmartCard'))group.remove();
    });

    if(typeof window.pcApplyLibraryExperience==='function')setTimeout(()=>window.pcApplyLibraryExperience(),0);
    return true;
  }

  function compactContinue(){
    const section=document.querySelector('#myGames .pcContinueSection');
    if(!section)return false;
    const tiles=[...section.querySelectorAll('.pcContinueTile')];
    if(!tiles.length)return false;

    const mobile=window.matchMedia('(max-width:620px)').matches;
    const width=tiles.length===1?470:tiles.length===2?910:1320;

    section.style.setProperty('display','block','important');
    section.style.setProperty('width',mobile?'100%':`min(100%, ${width}px)`,'important');
    section.style.setProperty('max-width','100%','important');
    section.style.setProperty('min-height','0','important');
    section.style.setProperty('padding','0','important');
    section.style.setProperty('margin','4px 0 26px','important');
    section.style.setProperty('border','0','important');
    section.style.setProperty('border-radius','0','important');
    section.style.setProperty('background','transparent','important');
    section.style.setProperty('box-shadow','none','important');

    const head=section.querySelector('.pcContinueHead');
    if(head){
      head.style.setProperty('margin','0 0 11px','important');
      head.style.setProperty('padding','0','important');
      const aside=head.querySelector(':scope > span');
      if(aside)aside.style.setProperty('display',tiles.length===1?'none':'block','important');
    }

    const rail=section.querySelector('.pcContinueRail');
    if(rail){
      rail.style.setProperty('display','flex','important');
      rail.style.setProperty('width','auto','important');
      rail.style.setProperty('grid-template-columns','none','important');
      rail.style.setProperty('justify-content','flex-start','important');
      rail.style.setProperty('gap','12px','important');
    }

    tiles.forEach(tile=>{
      if(mobile){
        tile.style.setProperty('flex','0 0 88%','important');
        tile.style.setProperty('width','88%','important');
      }else{
        tile.style.setProperty('flex','0 0 430px','important');
        tile.style.setProperty('width','430px','important');
      }
      tile.style.setProperty('max-width','100%','important');
      tile.style.setProperty('height','142px','important');
      tile.style.setProperty('min-height','142px','important');
    });
    return true;
  }

  let queued=false;
  function apply(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      reconcileKids();
      compactContinue();
    });
  }

  const observer=new MutationObserver(apply);
  observer.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('resize',apply,{passive:true});

  window.pcReconcileLibraryV41E2=apply;
  apply();
  setTimeout(apply,300);
  setTimeout(apply,900);
  setTimeout(apply,1800);
})();
