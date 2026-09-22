(()=>{
  if(window.__pcHomeTuningV421)return;
  window.__pcHomeTuningV421=true;

  const RECENTS_KEY='pc_v41e_recent_products';
  const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();

  function recents(){
    try{const v=JSON.parse(localStorage.getItem(RECENTS_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return []}
  }

  function relative(ts){
    const n=Number(ts||0);if(!n)return '';
    const d=Math.max(0,Date.now()-n),h=Math.floor(d/3600000),days=Math.floor(d/86400000);
    if(h<1)return 'Hace un momento';
    if(h<24)return `Hace ${h} h`;
    if(days===1)return 'Ayer';
    if(days<7)return `Hace ${days} días`;
    return 'Reciente';
  }

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
    if(type==='tarot'||text.includes('TAROT'))return 'TAROT-GUIDE';
    if(type==='vincores'||text.includes('VINCORES'))return 'VINC-001';
    if(type==='squishy'||text.includes('PAPER SQUISHY'))return 'PSQ-FACTORY';
    if(type==='quimera'||text.includes('QUIMERA'))return 'QUIMERA';
    if(type==='math'||text.includes('MATEMATICA'))return 'TK-MAT-79-DIG';
    return '';
  }

  function titleOf(card){return (card?.dataset.pcCommercialTitle||card?.querySelector('.pcSmartHead h3')?.textContent||card?.querySelector('h3')?.textContent||'').trim()}
  function stateOf(card){
    if(!card)return 'unknown';
    if(card.classList.contains('smartStatePending'))return 'pending';
    if(card.classList.contains('smartStateActive'))return 'active';
    const s=norm(card.querySelector('.status')?.textContent);
    if(s.includes('PENDIENTE'))return 'pending';
    if(s.includes('ACTIVO'))return 'active';
    return 'other';
  }

  function equivalent(code){return String(code||'').startsWith('TK-MAT')?'TK-MAT':String(code||'')}

  function cards(){return [...document.querySelectorAll('#myGamesGrid .pcSmartCard')].filter(c=>c.offsetParent!==null||!c.classList.contains('pcFilterHidden'))}

  function cardForTitle(title,list){
    const t=norm(title);
    return list.find(c=>norm(titleOf(c))===t)||list.find(c=>norm(titleOf(c)).includes(t)||t.includes(norm(titleOf(c))))||null;
  }

  function cardForCode(code,list){
    const eq=equivalent(code);
    return list.find(c=>equivalent(codeForCard(c))===eq)||null;
  }

  function tuneHero(home,list){
    const feature=home.querySelector('.pcV42Feature');if(!feature)return;
    const title=feature.querySelector('h1')?.textContent||'';
    const card=cardForTitle(title,list);
    const code=codeForCard(card);
    if(code)home.dataset.pcHeroCode=code;

    let meta=feature.querySelector('.pcV421HeroMeta');
    if(!meta){
      meta=document.createElement('div');meta.className='pcV421HeroMeta';
      const kicker=feature.querySelector('.pcV42FeatureKicker');
      kicker?.insertAdjacentElement('beforebegin',meta);
    }

    const status=stateOf(card);
    const recent=recents().find(r=>equivalent(r.code)===equivalent(code));
    const fresh=!!card?.dataset.pcFresh;
    let label=status==='pending'?'POR ACTIVAR':'ACTIVO';
    let detail=fresh?'NUEVO / ACTUALIZADO':recent?relative(recent.at):'LISTO PARA JUGAR';
    meta.innerHTML=`<span class="pcV421State ${status==='pending'?'pending':'active'}">${label}</span><span class="pcV421Recency">${detail}</span>`;
  }

  function tuneToday(home,list){
    const panel=home.querySelector('.pcV42Today');if(!panel)return;
    const active=list.filter(c=>stateOf(c)==='active').length;
    const pending=list.filter(c=>stateOf(c)==='pending').length;
    const fresh=list.filter(c=>!!c.dataset.pcFresh).length;
    const recentCount=recents().filter(r=>cardForCode(r.code,list)).length;
    const h2=panel.querySelector('h2'),p=panel.querySelector(':scope>p');
    if(fresh>0){
      if(h2)h2.textContent=fresh===1?'Tenés una novedad en tu biblioteca.':`Tenés ${fresh} novedades en tu biblioteca.`;
      if(p)p.textContent='Revisá lo nuevo o retomá cualquiera de tus experiencias activas.';
    }else if(pending>0){
      if(h2)h2.textContent=pending===1?'Tenés un acceso listo para activar.':`Tenés ${pending} accesos listos para activar.`;
      if(p)p.textContent='Podés activarlos cuando quieras; la vigencia empieza al hacerlo.';
    }else if(recentCount>0){
      if(h2)h2.textContent='Volvé a tus experiencias.';
      if(p)p.textContent='Tus accesos recientes y toda tu biblioteca están a un toque.';
    }else{
      if(h2)h2.textContent='Tu biblioteca está lista.';
      if(p)p.textContent='Elegí una experiencia activa o explorá algo que todavía no tenés.';
    }

    const stats=[...panel.querySelectorAll('.pcV42Stats>div')];
    if(stats[2]){
      const b=stats[2].querySelector('b'),s=stats[2].querySelector('span');
      if(pending>0){if(b)b.textContent=String(pending);if(s)s.textContent=pending===1?'por activar':'por activar'}
      else if(fresh>0){if(b)b.textContent=String(fresh);if(s)s.textContent=fresh===1?'novedad':'novedades'}
      else{if(b)b.textContent=String(list.length);if(s)s.textContent=list.length===1?'experiencia':'experiencias'}
    }
  }

  function tuneQuick(home,list){
    const recentCodes=new Set(recents().slice(0,8).map(r=>equivalent(r.code)));
    home.querySelectorAll('.pcV42QuickCard').forEach(btn=>{
      const title=btn.querySelector('.pcV42QuickText b')?.textContent||'';
      const card=cardForTitle(title,list);
      const badge=btn.querySelector('.pcV42QuickNo');if(!badge)return;
      const code=equivalent(codeForCard(card)),state=stateOf(card);
      badge.classList.remove('recent','active','pending');
      if(recentCodes.has(code)){badge.textContent='RECIENTE';badge.classList.add('recent')}
      else if(state==='pending'){badge.textContent='ACTIVAR';badge.classList.add('pending')}
      else{badge.textContent='ACTIVO';badge.classList.add('active')}
    });
  }

  function tuneDiscovery(home){
    home.querySelectorAll('.pcV42DiscoverCard').forEach(card=>{
      const body=card.querySelector('.pcV42DiscoverBody');
      if(body&&!body.querySelector('.pcV421DiscoverFlag')){
        const flag=document.createElement('span');flag.className='pcV421DiscoverFlag';flag.textContent='NO ESTÁ EN TU BIBLIOTECA';
        body.insertBefore(flag,body.firstChild);
      }
      const btn=card.querySelector('.pcV42TextButton');if(btn){btn.innerHTML='Ver preview <span>→</span>';btn.setAttribute('aria-label','Ver preview de '+(card.querySelector('h3')?.textContent||'esta experiencia'))}
    });
  }

  function tuneSectionCopy(home){
    const heads=[...home.querySelectorAll('.pcV42SectionHead')];
    heads.forEach(head=>{
      const small=norm(head.querySelector('small')?.textContent);
      if(small==='ACCESO DIRECTO'){
        const h=head.querySelector('h2');if(h)h.textContent='Tus accesos principales';
      }
      if(small==='DISCOVERY ENGINE'){
        const h=head.querySelector('h2'),p=head.querySelector('p');
        if(h)h.textContent='Para descubrir';
        if(p)p.textContent='Experiencias con preview que todavía no forman parte de tu biblioteca.';
      }
    });
  }

  function tune(){
    const home=document.querySelector('.pcV42Home');if(!home)return;
    const list=cards();if(!list.length)return;
    home.classList.add('pcV421Tuned');
    tuneHero(home,list);
    tuneToday(home,list);
    tuneQuick(home,list);
    tuneDiscovery(home);
    tuneSectionCopy(home);
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;tune()})};
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-pc-fresh','data-sig']});
  window.addEventListener('pageshow',schedule);
  window.addEventListener('storage',e=>{if(e.key===RECENTS_KEY)schedule()});
  window.pcApplyHomeV421=tune;
  schedule();setTimeout(schedule,250);setTimeout(schedule,900);setTimeout(schedule,1800);setTimeout(schedule,3200);
})();