(()=>{
  if(window.__pcQuickAccessV41E3)return;
  window.__pcQuickAccessV41E3=true;

  const norm=(v)=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();

  function codeForCard(card){
    if(!card)return '';
    if(card.dataset.productCode)return card.dataset.productCode;
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
    if(type==='quimera'||text.includes('QUIMERA'))return 'QUIMERA';
    if(type==='math'||text.includes('MATEMATICA'))return 'TK-MAT-79';
    return text.slice(0,80);
  }

  function titleFor(card){
    return card?.dataset?.pcCommercialTitle ||
      card?.querySelector('.pcSmartHead h3')?.textContent?.trim() ||
      card?.querySelector('h3')?.textContent?.trim() ||
      'Experiencia';
  }

  function activeCards(){
    return [...document.querySelectorAll('#myGamesGrid .pcSmartCard.smartStateActive')]
      .filter(card=>card.isConnected && !card.classList.contains('pcFilterHidden'));
  }

  function ensureSection(cards){
    const myGames=document.getElementById('myGames');
    if(!myGames||!cards.length)return null;
    let section=myGames.querySelector('.pcContinueSection');
    if(!section){
      section=document.createElement('section');
      section.className='pcContinueSection';
      const summary=myGames.querySelector('.pcV4LibrarySummary');
      if(summary)summary.insertAdjacentElement('beforebegin',section);
      else{
        const grid=document.getElementById('myGamesGrid');
        if(grid)grid.insertAdjacentElement('beforebegin',section);
        else myGames.appendChild(section);
      }
    }
    if(!section.querySelector('.pcContinueHead')){
      section.innerHTML='<div class="pcContinueHead"><div><small>ACCESO RÁPIDO</small><h3>Seguí jugando</h3></div><span>Recientes y accesos activos</span></div><div class="pcContinueRail"></div>';
    }else{
      const aside=section.querySelector('.pcContinueHead > span');
      if(aside)aside.textContent='Recientes y accesos activos';
    }
    if(!section.querySelector('.pcContinueRail')){
      const rail=document.createElement('div');rail.className='pcContinueRail';section.appendChild(rail);
    }
    return section;
  }

  function makeTile(card,code,label){
    const tile=document.createElement('button');
    tile.type='button';
    tile.className='pcContinueTile';
    tile.dataset.product=code;
    tile.dataset.quickFallback='1';

    const cover=card.querySelector(':scope > .pcV4Cover');
    if(cover){
      const clone=cover.cloneNode(true);
      clone.querySelector('.pcSmartStatusSlot')?.remove();
      tile.appendChild(clone);
    }

    const meta=document.createElement('div');
    meta.className='pcContinueTileMeta';
    const strong=document.createElement('strong');
    strong.textContent=titleFor(card);
    const span=document.createElement('span');
    span.textContent=label;
    meta.append(strong,span);
    tile.appendChild(meta);

    tile.addEventListener('click',()=>{
      const primary=card.querySelector('.pcSmartMainActions > .btn:first-child');
      if(primary)primary.click();
      else card.scrollIntoView({behavior:'smooth',block:'center'});
    });
    return tile;
  }

  function fillQuickAccess(){
    const cards=activeCards();
    if(!cards.length)return;
    const section=ensureSection(cards);if(!section)return;
    const rail=section.querySelector('.pcContinueRail');if(!rail)return;

    // Mantener primero los accesos recientes reales creados por V4.1E.
    const existing=[...rail.querySelectorAll('.pcContinueTile')];
    const used=new Set(existing.map(t=>t.dataset.product).filter(Boolean));

    // Si el render anterior dejó más de 3, recortamos sólo los fallback de esta capa.
    while(rail.querySelectorAll('.pcContinueTile').length>3){
      const fallback=[...rail.querySelectorAll('.pcContinueTile[data-quick-fallback="1"]')].pop();
      if(!fallback)break;
      fallback.remove();
    }

    for(const card of cards){
      if(rail.querySelectorAll('.pcContinueTile').length>=3)break;
      const code=codeForCard(card);if(!code||used.has(code))continue;
      rail.appendChild(makeTile(card,code,'Activo'));
      used.add(code);
    }

    // El bloque es acceso rápido: hasta 3 experiencias, nunca una sola por falta de historial.
    const count=rail.querySelectorAll('.pcContinueTile').length;
    section.dataset.quickCount=String(count);
    const aside=section.querySelector('.pcContinueHead > span');
    if(aside)aside.textContent=count===1?'Acceso activo':`${count} accesos a mano`;

    if(typeof window.pcReconcileLibraryV41E2==='function')window.pcReconcileLibraryV41E2();
  }

  let queued=false;
  function schedule(){
    if(queued)return;queued=true;
    requestAnimationFrame(()=>{queued=false;fillQuickAccess()});
  }

  const observer=new MutationObserver(schedule);
  observer.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.pcFillQuickAccessV41E3=schedule;

  schedule();
  setTimeout(schedule,350);
  setTimeout(schedule,1000);
  setTimeout(schedule,2200);
})();
