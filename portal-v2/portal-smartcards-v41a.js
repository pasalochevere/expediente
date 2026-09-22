(()=>{
  if(window.__pcSmartCardsV41A)return;
  window.__pcSmartCardsV41A=true;

  let cardSeq=0;
  const norm=(v)=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  const chevron='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 9 5 5 5-5"/></svg>';

  const categoryLabel=(card)=>{
    const cover=card.querySelector(':scope > .pcV4Cover');
    const kicker=cover?.querySelector('.pcV4CoverKicker')?.textContent?.trim();
    if(kicker)return kicker;
    const map={adult:'PAREJA & ADULTOS',family:'FAMILIA & KIDS',mystery:'MISTERIO & GRUPO',wellbeing:'BIENESTAR & VÍNCULOS',creative:'CREATIVOS & DIDÁCTICOS'};
    return map[card.dataset.cat]||'PASALOCHEVERE';
  };

  const stateFor=(statusText)=>{
    const t=norm(statusText);
    if(t.includes('ACTIVO'))return 'Active';
    if(t.includes('VENC')||t.includes('EXPIR'))return 'Expired';
    if(t.includes('PEND')||t.includes('ACTIVAR'))return 'Pending';
    return 'Neutral';
  };

  const preferredPrimary=(actions)=>{
    if(!actions)return null;
    const candidates=[...actions.children].filter(el=>el.classList?.contains('btn'));
    if(!candidates.length)return null;
    return candidates.find(el=>el.classList.contains('primary')) ||
      candidates.find(el=>/(JUGAR|ABRIR|ACTIVAR|RENOVAR|CONTINUAR)/.test(norm(el.textContent))) ||
      candidates[0];
  };

  const polishPrimaryLabel=(el)=>{
    if(!el)return;
    const t=norm(el.textContent);
    if(t==='JUGAR')el.textContent='ABRIR';
    else if(t.startsWith('JUGAR '))el.textContent=el.textContent.replace(/JUGAR/i,'ABRIR');
  };

  function toggleDetails(card,force){
    if(!card)return;
    const btn=card.querySelector('.pcSmartDetailsBtn');
    const panel=card.querySelector('.pcSmartDetails');
    if(!btn||!panel)return;
    const open=typeof force==='boolean'?force:!card.classList.contains('smartDetailsOpen');
    card.classList.toggle('smartDetailsOpen',open);
    btn.setAttribute('aria-expanded',open?'true':'false');
    btn.querySelector('.pcSmartDetailsText').textContent=open?'OCULTAR':'DETALLES';
  }

  function attachStatus(card,cover,status){
    if(!status)return;
    let slot=card.querySelector(':scope > .pcSmartStatusSlot');
    if(!slot){
      slot=document.createElement('div');
      slot.className='pcSmartStatusSlot';
      if(cover)cover.insertAdjacentElement('afterbegin',slot);
      else card.insertAdjacentElement('afterbegin',slot);
    }
    slot.appendChild(status);
    const state=stateFor(status.textContent);
    card.classList.remove('smartStateActive','smartStatePending','smartStateExpired','smartStateNeutral');
    card.classList.add('smartState'+state);
  }

  function enhanceCard(card){
    if(!card||card.dataset.pcSmart41==='1'||card.classList.contains('emptyCard'))return;
    if(!card.closest('#myGamesGrid'))return;

    const cover=card.querySelector(':scope > .pcV4Cover');
    const status=card.querySelector(':scope > .status')||card.querySelector('.status');
    const title=card.querySelector(':scope > h3')||card.querySelector('h3');
    const accent=card.querySelector(':scope > .accent')||card.querySelector('.accent');
    const info=card.querySelector(':scope > p')||card.querySelector('p');
    const actions=card.querySelector(':scope > .actions')||card.querySelector('.actions');
    if(!title||!actions)return;

    card.dataset.pcSmart41='1';
    card.classList.add('pcSmartCard');
    const id='pc-smart-details-'+(++cardSeq);

    const body=document.createElement('div');
    body.className='pcSmartBody';

    const head=document.createElement('div');
    head.className='pcSmartHead';
    const kicker=document.createElement('span');
    kicker.className='pcSmartKicker';
    kicker.textContent=categoryLabel(card);
    head.appendChild(kicker);
    head.appendChild(title);

    const hint=document.createElement('div');
    hint.className='pcSmartHint';
    const statusTxt=norm(status?.textContent);
    hint.textContent=statusTxt.includes('ACTIVO')?'Listo para abrir desde tu biblioteca.':statusTxt.includes('PEND')?'Tu acceso está listo para activarse.':'Acceso y datos de tu producto.';
    head.appendChild(hint);
    body.appendChild(head);

    const main=document.createElement('div');
    main.className='pcSmartMainActions';
    const primary=preferredPrimary(actions);
    if(primary){
      polishPrimaryLabel(primary);
      main.appendChild(primary);
    }

    const detailBtn=document.createElement('button');
    detailBtn.type='button';
    detailBtn.className='btn pcSmartDetailsBtn';
    detailBtn.setAttribute('aria-expanded','false');
    detailBtn.setAttribute('aria-controls',id);
    detailBtn.innerHTML='<span class="pcSmartDetailsText">DETALLES</span>'+chevron;
    detailBtn.addEventListener('click',()=>toggleDetails(card));
    main.appendChild(detailBtn);
    body.appendChild(main);

    const details=document.createElement('div');
    details.className='pcSmartDetails';
    details.id=id;
    const inner=document.createElement('div');
    inner.className='pcSmartDetailsInner';
    const content=document.createElement('div');
    content.className='pcSmartDetailsContent';
    const label=document.createElement('span');
    label.className='pcSmartDetailsLabel';
    label.textContent='DATOS DEL ACCESO';
    content.appendChild(label);

    if(accent)content.appendChild(accent);
    if(info)content.appendChild(info);

    const remaining=[...actions.children];
    if(remaining.length){
      const secondary=document.createElement('div');
      secondary.className='pcSmartSecondaryActions';
      remaining.forEach(el=>secondary.appendChild(el));
      content.appendChild(secondary);
    }
    actions.remove();

    inner.appendChild(content);
    details.appendChild(inner);
    body.appendChild(details);

    const insertionPoint=cover?cover.nextSibling:card.firstChild;
    if(insertionPoint)card.insertBefore(body,insertionPoint);else card.appendChild(body);
    attachStatus(card,cover,status);
  }

  function enhanceAll(){
    document.querySelectorAll('#myGamesGrid .card').forEach(enhanceCard);
  }

  function watchLibrary(){
    const grid=document.getElementById('myGamesGrid');
    if(!grid||grid.dataset.pcSmartObserved==='1')return;
    grid.dataset.pcSmartObserved='1';
    let queued=false;
    const observer=new MutationObserver(()=>{
      if(queued)return;
      queued=true;
      requestAnimationFrame(()=>{queued=false;enhanceAll()});
    });
    observer.observe(grid,{childList:true,subtree:true});
  }

  function boot(){
    watchLibrary();
    enhanceAll();
  }

  window.pcToggleSmartDetails=(cardOrEl,force)=>{
    const card=cardOrEl?.classList?.contains('pcSmartCard')?cardOrEl:cardOrEl?.closest?.('.pcSmartCard');
    toggleDetails(card,force);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  setTimeout(boot,250);
  setTimeout(boot,750);
  setTimeout(boot,1600);
})();
