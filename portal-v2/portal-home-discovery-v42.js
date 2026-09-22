(()=>{
  if(window.__pcHomeDiscoveryV42)return;
  window.__pcHomeDiscoveryV42=true;

  const RECENTS_KEY='pc_v41e_recent_products';
  const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  const svg=(name)=>{
    const p={
      play:'<path d="m9 7 8 5-8 5V7Z"/>',
      library:'<rect x="4" y="4" width="6" height="16" rx="1"/><rect x="11" y="6" width="5" height="14" rx="1"/><path d="m17 7 3-1 2 13-4 1"/>',
      explore:'<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z"/>',
      heart:'<path d="M20 5.5a5 5 0 0 0-7 0L12 6.6l-1-1.1a5 5 0 0 0-7 7L12 20l8-7.5a5 5 0 0 0 0-7Z"/>',
      kids:'<path d="M4 8h8M8 4v8M15 6h5M15 17h5M17.5 14.5v5M4 16l7 4M11 16l-7 4"/>',
      mystery:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
      wellbeing:'<path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="8"/>',
      creative:'<circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="m8.5 8.5 11 7.5M8.5 15.5 19.5 8"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${p[name]||p.explore}</svg>`;
  };

  const DISCOVERY=[
    {code:'DI-TRILOGIA',family:'adult',label:'PAREJA',title:'Doble Intención',sub:'Chispa · Fuego · Dominio',icon:'heart',a:'#57253d',b:'#150e15'},
    {code:'TORRE-AMERICA',family:'family',label:'FÚTBOL',title:'Torre de América',sub:'Trivia · desafíos · partido',icon:'kids',a:'#173f59',b:'#0c151d',image:'../torre-america/assets/cinema-hd/hero.webp'},
    {code:'TORRE-MEGA',family:'family',label:'FAMILIA · FIESTA',title:'Verdad o Reto +800',sub:'4 modos · más de 800 consignas',icon:'kids',a:'#6a391c',b:'#190f0d'},
    {code:'EXP-001',family:'mystery',label:'MISTERIO · CASO 001',title:'La Última Reunión',sub:'Investigación multijugador',icon:'mystery',a:'#4c4026',b:'#12110d',image:'../caso001/assets/escenas/estudio.jpg'},
    {code:'EXP-002',family:'mystery',label:'MISTERIO · CASO 002',title:'Hotel Orfeo · 317',sub:'3 jugadores · roles privados',icon:'mystery',a:'#4b351e',b:'#120e0b',image:'../caso002/assets/visual/bin/room-317-v244.jpg'},
    {code:'TAROT-GUIDE',family:'wellbeing',label:'BIENESTAR · TAROT',title:'Guía Interactiva de Tarot',sub:'78 cartas · tiradas · práctica',icon:'wellbeing',a:'#463056',b:'#151019'},
    {code:'VINC-001',family:'wellbeing',label:'BIENESTAR · VÍNCULOS',title:'Víncores',sub:'Campo de vínculos interactivo',icon:'wellbeing',a:'#25473d',b:'#0f1714'},
    {code:'PSQ-FACTORY',family:'creative',label:'CREATIVOS · FACTORY',title:'Paper Squishy Factory',sub:'Creator Plus · biblioteca creativa',icon:'creative',a:'#6c3753',b:'#1a1017'},
    {code:'TK-MAT-79-DIG',family:'family',label:'KIDS · APRENDIZAJE',title:'Chévere Kids · Matemática',sub:'7–9 años · aprender jugando',icon:'kids',a:'#0f526b',b:'#0d1921'}
  ];

  const FAMILY_META={
    adult:{label:'Pareja',icon:'heart'},
    family:{label:'Kids & Familia',icon:'kids'},
    mystery:{label:'Misterio',icon:'mystery'},
    wellbeing:{label:'Bienestar',icon:'wellbeing'},
    creative:{label:'Creativos',icon:'creative'}
  };

  function safeRecents(){
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

  function cardTitle(card){return card?.dataset.pcCommercialTitle||card?.querySelector('.pcSmartHead h3')?.textContent||card?.querySelector('h3')?.textContent||'Experiencia'}
  function cardSubtitle(card){return card?.querySelector('.pcMappedSubtitle')?.textContent||card?.querySelector('.pcSmartKicker')?.textContent||''}
  function cardFamily(card){return card?.dataset.cat||'other'}
  function isActive(card){return card?.classList.contains('smartStateActive')||norm(card?.querySelector('.status')?.textContent).includes('ACTIVO')}
  function isPending(card){return card?.classList.contains('smartStatePending')||norm(card?.querySelector('.status')?.textContent).includes('PENDIENTE')}
  function equivalent(code){return code.startsWith('TK-MAT')?'TK-MAT':code}

  function openLibrary(filter='all'){
    const lib=document.getElementById('myGames');if(!lib)return;
    lib.scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(()=>{
      const chip=lib.querySelector(`.pcFilterChip[data-filter="${filter}"]`)||lib.querySelector('.pcFilterChip[data-filter="all"]');
      chip?.click();
    },220);
  }

  function openExplore(family){
    const hub=document.querySelector('.categoryHub');
    if(typeof window.openCategory==='function'&&family)window.openCategory(family);
    hub?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function openCard(card){
    const primary=card?.querySelector('.pcSmartMainActions>.btn:first-child');
    if(primary)primary.click();else card?.scrollIntoView({behavior:'smooth',block:'center'});
  }

  function discoveryAvailable(item){
    const p=window.PC_REAL_PREVIEWS_V2;
    return !p||!!p[item.code]||(item.code==='TK-MAT-79-DIG'&&!!p['TK-MAT-79-DIG']);
  }

  function chooseDiscovery(cards){
    const owned=new Set(cards.map(c=>equivalent(codeForCard(c))).filter(Boolean));
    const ownedFamilies=new Set(cards.map(cardFamily));
    const recentFamilies=new Set();
    const byCode=new Map(cards.map(c=>[equivalent(codeForCard(c)),c]).filter(x=>x[0]));
    safeRecents().slice(0,3).forEach(r=>{const c=byCode.get(equivalent(r.code||''));if(c)recentFamilies.add(cardFamily(c))});
    return DISCOVERY
      .filter(d=>!owned.has(equivalent(d.code))&&discoveryAvailable(d))
      .map((d,i)=>({...d,score:(ownedFamilies.has(d.family)?0:5)+(recentFamilies.has(d.family)?0:2)+(d.image?1:0)-i*.02}))
      .sort((a,b)=>b.score-a.score)
      .slice(0,3);
  }

  function makeDiscoveryCard(item){
    const card=document.createElement('article');card.className='pcV42DiscoverCard';card.dataset.family=item.family;
    const media=document.createElement('div');media.className='pcV42DiscoverMedia';media.style.setProperty('--a',item.a);media.style.setProperty('--b',item.b);
    if(item.image){media.classList.add('hasImage');media.style.backgroundImage=`url("${item.image}")`}
    media.innerHTML=`<span class="pcV42DiscoverIcon">${svg(item.icon)}</span><span class="pcV42DiscoverFamily">${esc(item.label)}</span>`;
    card.innerHTML=`<div class="pcV42DiscoverBody"><h3>${esc(item.title)}</h3><p>${esc(item.sub)}</p><button type="button" class="pcV42TextButton">Ver experiencia <span>→</span></button></div>`;
    card.prepend(media);
    card.querySelector('button').addEventListener('click',()=>{
      if(typeof window.openPreview==='function')window.openPreview(item.code);else openExplore(item.family);
    });
    return card;
  }

  function renderCover(target,card){
    target.innerHTML='';
    const cover=card?.querySelector(':scope > .pcV4Cover');
    if(cover){
      const clone=cover.cloneNode(true);clone.classList.add('pcV42CoverClone');clone.querySelector('.pcSmartStatusSlot')?.remove();target.appendChild(clone);return;
    }
    const fallback=document.createElement('div');fallback.className='pcV42CoverFallback';fallback.textContent=cardTitle(card);target.appendChild(fallback);
  }

  function renderHome(){
    const account=document.getElementById('accountBox');
    const myGames=document.getElementById('myGames');
    const grid=document.getElementById('myGamesGrid');
    const logged=account&&!account.classList.contains('hidden');
    const legacy=[...document.querySelectorAll('.hero')].find(el=>!el.classList.contains('pcV42Home'));
    let home=document.querySelector('.pcV42Home');

    if(!logged||!myGames||myGames.classList.contains('hidden')||!grid){
      home?.remove();legacy?.classList.remove('pcV42LegacyHidden');return;
    }

    const cards=[...grid.querySelectorAll('.pcSmartCard')];
    if(!cards.length)return;
    const active=cards.filter(isActive),pending=cards.filter(isPending);
    const byCode=new Map(active.map(c=>[equivalent(codeForCard(c)),c]).filter(x=>x[0]));
    const recents=safeRecents().filter(x=>byCode.has(equivalent(x.code||'')));
    const heroCard=(recents.length?byCode.get(equivalent(recents[0].code)):active[0])||pending[0]||cards[0];
    const heroCode=codeForCard(heroCard);
    const total=cards.length;
    const families=new Set(cards.map(cardFamily).filter(Boolean)).size;
    const fresh=cards.filter(c=>!!c.dataset.pcFresh).length;
    const signature=[total,active.length,pending.length,families,fresh,heroCode,recents.map(r=>r.code).join(','),cards.map(c=>codeForCard(c)).join('|')].join('::');

    if(!home){
      home=document.createElement('section');home.className='hero pcV42Home';home.setAttribute('aria-label','Inicio personalizado PasaloChevere');
      if(legacy)legacy.insertAdjacentElement('beforebegin',home);else document.querySelector('.pcV4Nav')?.insertAdjacentElement('afterend',home);
    }
    legacy?.classList.add('pcV42LegacyHidden');
    if(home.dataset.sig===signature)return;
    home.dataset.sig=signature;

    home.innerHTML=`
      <div class="pcV42HeroGrid">
        <article class="pcV42Feature">
          <div class="pcV42FeatureMedia"></div>
          <div class="pcV42FeatureOverlay">
            <div class="pcV42FeatureKicker">${recents.length?'RETOMÁ DONDE QUEDASTE':'LISTO PARA JUGAR'}</div>
            <h1>${esc(cardTitle(heroCard))}</h1>
            <p>${esc(cardSubtitle(heroCard))}</p>
            <div class="pcV42FeatureActions"><button type="button" class="pcV42Primary">${svg('play')}<span>${isActive(heroCard)?'Continuar':'Ver acceso'}</span></button><button type="button" class="pcV42Ghost">${svg('library')}<span>Mi biblioteca</span></button></div>
          </div>
        </article>
        <aside class="pcV42Today">
          <div class="pcV42Eyebrow">TU PORTAL PASALOCHEVERE</div>
          <h2>Tu biblioteca está lista.</h2>
          <p>Volvé a jugar, descubrí algo distinto o entrá directo a una de tus familias.</p>
          <div class="pcV42Stats"><div><b>${active.length}</b><span>activos</span></div><div><b>${families}</b><span>familias</span></div><div><b>${fresh}</b><span>${fresh===1?'novedad':'novedades'}</span></div></div>
          <button type="button" class="pcV42ExploreAll">${svg('explore')}<span>Explorar experiencias</span></button>
        </aside>
      </div>
      <div class="pcV42SectionHead"><div><small>ACCESO DIRECTO</small><h2>Elegí qué hacer ahora</h2></div><button type="button" class="pcV42Link" data-action="library">Ver biblioteca completa →</button></div>
      <div class="pcV42QuickRow"></div>
      <div class="pcV42DiscoveryBlock">
        <div class="pcV42SectionHead"><div><small>DISCOVERY ENGINE</small><h2>Para descubrir</h2><p>Experiencias que todavía no están en tu biblioteca.</p></div><button type="button" class="pcV42Link" data-action="explore">Explorar todo →</button></div>
        <div class="pcV42DiscoverGrid"></div>
      </div>
      <div class="pcV42FamilyBlock">
        <div class="pcV42SectionHead"><div><small>TU MAPA DE EXPERIENCIAS</small><h2>Entrá por familia</h2></div></div>
        <div class="pcV42FamilyGrid"></div>
      </div>`;

    renderCover(home.querySelector('.pcV42FeatureMedia'),heroCard);
    home.querySelector('.pcV42Primary').addEventListener('click',()=>openCard(heroCard));
    home.querySelector('.pcV42Ghost').addEventListener('click',()=>openLibrary('all'));
    home.querySelector('.pcV42ExploreAll').addEventListener('click',()=>openExplore());
    home.querySelector('[data-action="library"]').addEventListener('click',()=>openLibrary('all'));
    home.querySelector('[data-action="explore"]').addEventListener('click',()=>openExplore());

    const quick=home.querySelector('.pcV42QuickRow');
    const ordered=[];
    recents.forEach(r=>{const c=byCode.get(equivalent(r.code||''));if(c&&!ordered.includes(c))ordered.push(c)});
    active.forEach(c=>{if(!ordered.includes(c))ordered.push(c)});
    pending.forEach(c=>{if(!ordered.includes(c))ordered.push(c)});
    ordered.slice(0,4).forEach((card,i)=>{
      const b=document.createElement('button');b.type='button';b.className='pcV42QuickCard';
      b.innerHTML=`<span class="pcV42QuickNo">0${i+1}</span><span class="pcV42QuickText"><b>${esc(cardTitle(card))}</b><small>${esc(cardSubtitle(card)||'Experiencia PasaloChevere')}</small></span><span class="pcV42QuickArrow">→</span>`;
      b.addEventListener('click',()=>openCard(card));quick.appendChild(b);
    });

    const discover=home.querySelector('.pcV42DiscoverGrid');
    const picks=chooseDiscovery(cards);
    if(picks.length)picks.forEach(p=>discover.appendChild(makeDiscoveryCard(p)));
    else discover.innerHTML='<div class="pcV42DiscoveryEmpty">Tu biblioteca ya incluye todas las experiencias con preview disponible. Las próximas novedades aparecerán acá.</div>';

    const familyGrid=home.querySelector('.pcV42FamilyGrid');
    Object.entries(FAMILY_META).forEach(([key,meta])=>{
      const count=cards.filter(c=>cardFamily(c)===key).length;
      const b=document.createElement('button');b.type='button';b.className='pcV42FamilyCard'+(count?' hasAccess':'');
      b.innerHTML=`<span class="pcV42FamilyIcon">${svg(meta.icon)}</span><span><b>${esc(meta.label)}</b><small>${count?`${count} ${count===1?'acceso':'accesos'} en tu biblioteca`:'Explorar esta familia'}</small></span><i>${count||'+'}</i>`;
      b.addEventListener('click',()=>count?openLibrary(key):openExplore(key));familyGrid.appendChild(b);
    });
  }

  let scheduled=false;
  const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;renderHome()})};
  const observer=new MutationObserver(schedule);
  observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-pc-fresh']});
  window.addEventListener('storage',e=>{if(e.key===RECENTS_KEY)schedule()});
  window.addEventListener('pageshow',schedule);
  window.pcApplyHomeV42=renderHome;
  schedule();setTimeout(schedule,300);setTimeout(schedule,900);setTimeout(schedule,1800);setTimeout(schedule,3200);
})();