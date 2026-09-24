(()=>{
  if(window.__pcCleanHomeV51)return;
  window.__pcCleanHomeV51=true;

  const RECENTS_KEY='pc_v41e_recent_products';
  const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  const icons={
    library:'<rect x="4" y="4" width="6" height="16" rx="1"/><rect x="11" y="6" width="5" height="14" rx="1"/><path d="m17 7 3-1 2 13-4 1"/>',
    explore:'<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z"/>'
  };
  const svg=name=>`<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]||icons.explore}</svg>`;

  function recents(){
    try{const v=JSON.parse(localStorage.getItem(RECENTS_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return []}
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

  function equivalent(code){return String(code||'').startsWith('TK-MAT')?'TK-MAT':String(code||'')}
  function isActive(card){return card?.classList.contains('smartStateActive')||norm(card?.querySelector('.status')?.textContent).includes('ACTIVO')}
  function isPending(card){return card?.classList.contains('smartStatePending')||norm(card?.querySelector('.status')?.textContent).includes('PENDIENTE')}
  function titleOf(card){return (card?.dataset.pcCommercialTitle||card?.querySelector('.pcSmartHead h3')?.textContent||card?.querySelector('h3')?.textContent||'Experiencia PasaloChevere').trim()}
  function subtitleOf(card){return (card?.querySelector('.pcMappedSubtitle')?.textContent||card?.querySelector('.pcSmartKicker')?.textContent||'').trim()}
  function allCards(){return [...document.querySelectorAll('#myGamesGrid .pcSmartCard')]}

  function chooseHero(cards){
    const active=cards.filter(isActive);
    const pending=cards.filter(isPending);
    const byCode=new Map(active.map(c=>[equivalent(codeForCard(c)),c]).filter(x=>x[0]));
    for(const r of recents()){
      const c=byCode.get(equivalent(r?.code));
      if(c)return {card:c,recent:true};
    }
    if(active.length)return {card:active[0],recent:false};
    if(pending.length)return {card:pending[0],recent:false};
    return {card:cards[0]||null,recent:false};
  }

  function renderCover(target,card){
    target.innerHTML='';
    const cover=card?.querySelector(':scope > .pcV4Cover');
    if(cover){
      const clone=cover.cloneNode(true);target.appendChild(clone);return;
    }
    const fallback=document.createElement('div');fallback.className='pcV51Fallback';fallback.textContent=titleOf(card);target.appendChild(fallback);
  }

  function primaryAction(card){
    return card?.querySelector('.pcSmartMainActions>.btn:first-child,.pcSmartMainActions>a:first-child,.pcSmartMainActions>button:first-child,.actions .btn.primary,.actions .btn');
  }
  function openCard(card){
    const action=primaryAction(card);
    if(action){action.click();return}
    card?.scrollIntoView({behavior:'smooth',block:'center'});
  }

  function setNavActive(view){
    const name=view==='home'?'home':view==='library'?'library':'explore';
    document.querySelectorAll('[data-v4-nav]').forEach(btn=>btn.classList.toggle('active',btn.dataset.v4Nav===name));
  }

  function setView(view,scroll=true){
    if(!['home','library','explore'].includes(view))view='home';
    document.body.dataset.pcV5View=view;
    setNavActive(view);
    if(!scroll)return;
    const target=view==='home'?document.querySelector('.pcV51Home'):view==='library'?document.getElementById('myGames'):document.querySelector('.categoryHub');
    requestAnimationFrame(()=>target?.scrollIntoView({behavior:'smooth',block:'start'}));
  }

  function ensureViewBar(section,kind){
    if(!section||section.querySelector(`.pcV51ViewBar[data-view="${kind}"]`))return;
    const bar=document.createElement('div');bar.className='pcV51ViewBar';bar.dataset.view=kind;
    bar.innerHTML=`<div><small>${kind==='library'?'MI ESPACIO':'EXPLORAR'}</small><h2>${kind==='library'?'Mi biblioteca':'Experiencias PasaloChevere'}</h2></div><button class="pcV51Back" type="button">← Inicio</button>`;
    bar.querySelector('button').addEventListener('click',()=>setView('home'));
    section.insertBefore(bar,section.firstChild);
  }

  function ensureHome(cards){
    let home=document.querySelector('.pcV51Home');
    if(!home){
      home=document.createElement('section');home.className='pcV51Home';home.setAttribute('aria-label','Inicio PasaloChevere');
      const nav=document.querySelector('.pcV4Nav');
      const anchor=document.querySelector('.pcV42Home')||document.querySelector('.hero');
      if(anchor)anchor.insertAdjacentElement('beforebegin',home);else if(nav)nav.insertAdjacentElement('afterend',home);else document.querySelector('.wrap')?.prepend(home);
    }

    const choice=chooseHero(cards),card=choice.card;if(!card)return home;
    const signature=[codeForCard(card),cards.length,cards.filter(isActive).length,cards.filter(isPending).length,recents().map(x=>x.code).join('|')].join('::');
    if(home.dataset.sig===signature)return home;
    home.dataset.sig=signature;

    const activeCount=cards.filter(isActive).length;
    const pending=isPending(card);
    home.innerHTML=`
      <div class="pcV51Intro"><div><small>TU PORTAL PASALOCHEVERE</small><h1>Elegí. Entrá. Jugá.</h1></div><p>La portada muestra sólo lo importante. Tus juegos, el catálogo y la gestión quedan separados.</p></div>
      <div class="pcV51Grid">
        <article class="pcV51Continue">
          <div class="pcV51Cover"></div>
          <div class="pcV51ContinueBody">
            <div class="pcV51Kicker">${pending?'TU PRÓXIMO ACCESO':choice.recent?'CONTINUAR':'LISTO PARA JUGAR'}</div>
            <h2>${esc(titleOf(card))}</h2>
            <p>${esc(subtitleOf(card)||'Experiencia PasaloChevere')}</p>
            <div class="pcV51ContinueActions"><button type="button" class="pcV51Primary">${pending?'ACTIVAR ACCESO':'ABRIR JUEGO'}</button></div>
          </div>
        </article>
        <div class="pcV51Side">
          <button type="button" class="pcV51Action" data-go="library"><span class="pcV51ActionIcon">${svg('library')}</span><span class="pcV51ActionCopy"><small>TUS JUEGOS</small><b>Mi biblioteca</b><span>${activeCount} ${activeCount===1?'acceso activo':'accesos activos'}${cards.length-activeCount>0?` · ${cards.length-activeCount} por revisar`:''}</span></span><span class="pcV51ActionArrow">→</span></button>
          <button type="button" class="pcV51Action" data-go="explore"><span class="pcV51ActionIcon">${svg('explore')}</span><span class="pcV51ActionCopy"><small>CATÁLOGO</small><b>Explorar</b><span>Descubrí experiencias que todavía no están en tu biblioteca.</span></span><span class="pcV51ActionArrow">→</span></button>
        </div>
      </div>`;

    renderCover(home.querySelector('.pcV51Cover'),card);
    home.querySelector('.pcV51Primary')?.addEventListener('click',()=>openCard(card));
    home.querySelector('[data-go="library"]')?.addEventListener('click',()=>setView('library'));
    home.querySelector('[data-go="explore"]')?.addEventListener('click',()=>setView('explore'));
    return home;
  }

  function cleanNav(){
    document.querySelectorAll('[data-v4-nav="account"]').forEach(el=>el.setAttribute('aria-hidden','true'));
  }

  function apply(){
    if(!document.body.classList.contains('pcV50PortalReady'))return;
    const myGames=document.getElementById('myGames'),hub=document.querySelector('.categoryHub');
    const cards=allCards();if(!myGames||!hub||!cards.length)return;
    document.body.classList.add('pcV51Ready');
    if(!document.body.dataset.pcV5View)document.body.dataset.pcV5View='home';
    ensureHome(cards);
    ensureViewBar(myGames,'library');
    ensureViewBar(hub,'explore');
    cleanNav();
    setNavActive(document.body.dataset.pcV5View);
  }

  document.addEventListener('click',e=>{
    if(!document.body.classList.contains('pcV51Ready'))return;
    const nav=e.target.closest('[data-v4-nav]');if(!nav)return;
    const key=nav.dataset.v4Nav;
    if(!['home','library','explore'].includes(key))return;
    e.preventDefault();e.stopImmediatePropagation();
    setView(key);
  },true);

  window.pcV5SetView=setView;
  window.pcApplyCleanHomeV51=apply;

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-pc-fresh']});
  window.addEventListener('pageshow',schedule);
  window.addEventListener('storage',e=>{if(e.key===RECENTS_KEY)schedule()});
  schedule();setTimeout(schedule,350);setTimeout(schedule,900);setTimeout(schedule,1800);setTimeout(schedule,3200);
})();
