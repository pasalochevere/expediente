(()=>{
  if(window.__pcPremiumV4)return;
  window.__pcPremiumV4=true;

  const icon=(name)=>{
    const paths={
      home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
      library:'<path d="M4 4h6v16H4z"/><path d="M10 6h5v14h-5"/><path d="m15 7 4-1 2 13-6 1"/>',
      explore:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z"/>',
      user:'<circle cx="12" cy="8" r="3.2"/><path d="M5.5 21c.7-4 3-6 6.5-6s5.8 2 6.5 6"/>',
      heart:'<path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/>',
      math:'<path d="M4 8h8M8 4v8M14 6h6M15 17h5M17.5 14.5v5M4 16l7 4M11 16l-7 4"/>',
      trophy:'<path d="M8 4h8v4c0 4-1.8 6-4 6s-4-2-4-6V4Z"/><path d="M8 6H4v2c0 2 1.5 3.5 4.2 3.5M16 6h4v2c0 2-1.5 3.5-4.2 3.5M12 14v4M8 21h8M9 18h6"/>',
      search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/><path d="M8 10h5M10.5 7.5v5"/>',
      cards:'<rect x="5" y="3" width="11" height="16" rx="2"/><path d="m9 7 3-2 3 2-3 2-3-2ZM9 15l3-2 3 2-3 2-3-2Z"/><path d="M16 7h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9"/>',
      links:'<path d="M9.5 14.5 8 16a4 4 0 0 1-5.7-5.7l3-3A4 4 0 0 1 11 7"/><path d="m14.5 9.5 1.5-1.5a4 4 0 1 1 5.7 5.7l-3 3A4 4 0 0 1 13 17"/><path d="m8.5 15.5 7-7"/>',
      scissors:'<circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="m8.5 8.5 11 7.5M8.5 15.5 19.5 8"/>',
      party:'<path d="m4 20 5-14 9 9-14 5Z"/><path d="m10 7 2-3M15 10l4-1M16 14l3 3"/>',
      box:'<path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(paths[name]||paths.box)+'</svg>';
  };

  const norm=(v)=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();

  function identifyCard(card){
    const title=norm(card.querySelector('h3')?.textContent);
    const accent=norm(card.querySelector('.accent')?.textContent);
    const cat=card.dataset.cat||'generic';

    if(title.includes('DOBLE INTENCION'))return {key:'doble',kicker:'PAREJA · TRILOGÍA',name:'Doble Intención',icon:'heart',a:'#4a2034',b:'#160f16'};
    if(title.includes('TORRE DE AMERICA'))return {key:'america',kicker:'FÚTBOL · TRIVIA',name:'Torre de América',icon:'trophy',a:'#1d4660',b:'#111a22',image:'../torre-america/assets/cinema-hd/hero.webp'};
    if(title.includes('CHEVERE KIDS')&&title.includes('MATEMATICA'))return {key:'math',kicker:'KIDS · APRENDIZAJE',name:'Matemática 7–9',icon:'math',a:'#12526a',b:'#101a22'};
    if(title.includes('MEGA PACK')||title.includes('VERDAD O RETO'))return {key:'party',kicker:'FAMILIA · FIESTA',name:'Verdad o Reto +800',icon:'party',a:'#70411b',b:'#1c1410'};
    if(title.includes('EXPEDIENTES')&&accent.includes('002'))return {key:'exp002',kicker:'MISTERIO · CASO 002',name:'Hotel Orfeo · 317',icon:'search',a:'#5b4823',b:'#15130f',image:'../caso002/assets/visual/bin/room-317-v244.jpg'};
    if(title.includes('EXPEDIENTES')&&accent.includes('001'))return {key:'exp001',kicker:'MISTERIO · CASO 001',name:'La Última Reunión',icon:'search',a:'#4d4025',b:'#14120e',image:'../caso001/assets/escenas/estudio.jpg'};
    if(title.includes('EXPEDIENTES'))return {key:'exp',kicker:'MISTERIO · EXPEDIENTES',name:'Investigación',icon:'search',a:'#4d4025',b:'#14120e'};
    if(title.includes('MESA TAROT')||title.includes('TAROT'))return {key:'tarot',kicker:'BIENESTAR · TAROT',name:'Guía Interactiva',icon:'cards',a:'#4a315c',b:'#17111d'};
    if(title.includes('VINCORES'))return {key:'vincores',kicker:'BIENESTAR · VÍNCULOS',name:'Víncores Digital',icon:'links',a:'#274b41',b:'#101916'};
    if(title.includes('PAPER SQUISHY'))return {key:'squishy',kicker:'CREATIVOS · FACTORY',name:'Paper Squishy',icon:'scissors',a:'#713a57',b:'#1e1118'};
    if(cat==='adult')return {key:'adult',kicker:'PAREJA & ADULTOS',name:'Experiencia',icon:'heart',a:'#4b2134',b:'#160f16'};
    if(cat==='family')return {key:'family',kicker:'FAMILIA & KIDS',name:'Jugar y aprender',icon:'trophy',a:'#155069',b:'#101a21'};
    if(cat==='mystery')return {key:'mystery',kicker:'MISTERIO & GRUPO',name:'Investigación',icon:'search',a:'#594723',b:'#15130f'};
    if(cat==='wellbeing')return {key:'wellbeing',kicker:'BIENESTAR & VÍNCULOS',name:'Exploración',icon:'links',a:'#2d4d3b',b:'#111914'};
    if(cat==='creative')return {key:'creative',kicker:'CREATIVOS & DIDÁCTICOS',name:'Crear y descubrir',icon:'scissors',a:'#70401f',b:'#1a120d'};
    return {key:'generic',kicker:'PASALOCHEVERE',name:'Experiencia digital',icon:'box',a:'#3b3137',b:'#121114'};
  }

  function decorateCard(card){
    if(!card||card.classList.contains('emptyCard')||card.querySelector('.pcV4Cover'))return;
    const info=identifyCard(card);
    const cover=document.createElement('div');
    cover.className='pcV4Cover';
    cover.style.setProperty('--cover-a',info.a);
    cover.style.setProperty('--cover-b',info.b);
    if(info.image){
      cover.classList.add('hasImage');
      cover.style.backgroundImage='url("'+info.image+'")';
    }
    cover.innerHTML='<div class="pcV4CoverMeta"><span class="pcV4CoverKicker">'+info.kicker+'</span><span class="pcV4CoverName">'+info.name+'</span></div><span class="pcV4CoverIcon">'+icon(info.icon)+'</span>';
    card.insertBefore(cover,card.firstChild);
    card.dataset.pcV4Type=info.key;
    card.classList.add('pcV4Enhanced');
  }

  function decorateCards(){
    document.querySelectorAll('.card').forEach(decorateCard);
  }

  function scrollToTarget(name){
    let target=null;
    if(name==='home')target=document.querySelector('.hero')||document.querySelector('.top');
    if(name==='explore')target=document.querySelector('.categoryHub')||document.querySelector('.newsWrap');
    if(name==='library'){
      const lib=document.getElementById('myGames');
      target=lib&&!lib.classList.contains('hidden')?lib:(document.getElementById('loginBox')||document.getElementById('accountBox'));
    }
    if(name==='account'){
      const account=document.getElementById('accountBox');
      target=account&&!account.classList.contains('hidden')?account:document.getElementById('loginBox');
    }
    if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
    setActiveNav(name);
  }

  function setActiveNav(name){
    document.querySelectorAll('[data-v4-nav]').forEach(btn=>btn.classList.toggle('active',btn.dataset.v4Nav===name));
  }

  function ensureTopNav(){
    if(document.querySelector('.pcV4Nav'))return;
    const top=document.querySelector('.top');
    if(!top)return;
    const nav=document.createElement('nav');
    nav.className='pcV4Nav';
    nav.setAttribute('aria-label','Navegación principal del portal');
    nav.innerHTML='<div class="pcV4NavBrand"><span class="pcV4NavBrandDot"></span>Biblioteca digital</div><div class="pcV4NavLinks"><button type="button" data-v4-nav="home">Inicio</button><button type="button" data-v4-nav="library">Mi biblioteca</button><button type="button" data-v4-nav="explore">Explorar</button><button type="button" data-v4-nav="account">Mi cuenta</button></div>';
    top.insertAdjacentElement('afterend',nav);
    nav.querySelectorAll('[data-v4-nav]').forEach(btn=>btn.addEventListener('click',()=>scrollToTarget(btn.dataset.v4Nav)));
    setActiveNav('home');
  }

  function ensureBottomNav(){
    if(document.querySelector('.pcV4BottomNav'))return;
    const nav=document.createElement('nav');
    nav.className='pcV4BottomNav';
    nav.setAttribute('aria-label','Navegación móvil del portal');
    nav.innerHTML='\
      <button type="button" data-v4-nav="home">'+icon('home')+'<span>Inicio</span></button>\
      <button type="button" data-v4-nav="library">'+icon('library')+'<span>Biblioteca</span></button>\
      <button type="button" data-v4-nav="explore">'+icon('explore')+'<span>Explorar</span></button>\
      <button type="button" data-v4-nav="account">'+icon('user')+'<span>Cuenta</span></button>';
    document.body.appendChild(nav);
    nav.querySelectorAll('[data-v4-nav]').forEach(btn=>btn.addEventListener('click',()=>scrollToTarget(btn.dataset.v4Nav)));
    setActiveNav('home');
  }

  function ensurePaymentTrust(){
    if(document.querySelector('.pcV4PayTrust'))return;
    const login=document.getElementById('loginBox');
    const account=document.getElementById('accountBox');
    const anchor=login||account;
    if(!anchor)return;
    const trust=document.createElement('section');
    trust.className='pcV4PayTrust';
    trust.setAttribute('aria-label','Pagos online con Mercado Pago');
    trust.innerHTML='<div class="pcV4PayLeft"><img src="https://cdn.simpleicons.org/mercadopago/00B1EA" alt="Mercado Pago" loading="lazy" onerror="this.style.display=\'none\'"><div class="pcV4PayCopy"><strong>Pagos online con Mercado Pago</strong><span>Compra protegida y activación vinculada a tu acceso cuando el producto admite compra online.</span></div></div><span class="pcV4PayBadge">INTEGRACIÓN ACTIVA</span>';
    anchor.insertAdjacentElement('afterend',trust);
  }

  function ensureLibrarySummary(){
    const myGames=document.getElementById('myGames');
    const grid=document.getElementById('myGamesGrid');
    if(!myGames||!grid||myGames.classList.contains('hidden'))return;
    const cards=[...grid.querySelectorAll('.card')];
    if(!cards.length)return;
    let summary=myGames.querySelector('.pcV4LibrarySummary');
    const active=cards.filter(c=>norm(c.querySelector('.status')?.textContent).includes('ACTIVO')).length;
    const categories=new Set(cards.map(c=>c.dataset.cat).filter(Boolean)).size;
    const total=cards.length;
    if(!summary){
      summary=document.createElement('div');
      summary.className='pcV4LibrarySummary';
      const title=myGames.querySelector('.catalog-title');
      if(title)title.insertAdjacentElement('afterend',summary);else myGames.insertBefore(summary,myGames.firstChild);
    }
    summary.innerHTML='<div class="pcV4SummaryMain"><div class="pcV4SummaryText"><small>TU BIBLIOTECA PERSONAL</small><strong>'+total+' '+(total===1?'experiencia':'experiencias')+' en un solo lugar</strong><span>Abrí tus juegos, revisá vigencia, códigos y dispositivos sin salir del portal.</span></div><div class="pcV4SummaryOrb">'+total+'</div></div><div class="pcV4SummaryStats"><div class="pcV4SummaryStat"><b>'+active+'</b><span>accesos activos ahora</span></div><div class="pcV4SummaryStat"><b>'+categories+'</b><span>familias en tu biblioteca</span></div></div>';
  }

  function markSections(){
    const hero=document.querySelector('.hero');if(hero&&!hero.id)hero.id='inicio';
    const hub=document.querySelector('.categoryHub');if(hub&&!hub.id)hub.id='explorar';
    const lib=document.getElementById('myGames');if(lib)lib.dataset.v4Section='library';
    const account=document.getElementById('accountBox');if(account)account.dataset.v4Section='account';
  }

  function updateNavByScroll(){
    const y=window.scrollY+160;
    const points=[
      ['home',document.querySelector('.hero')],
      ['explore',document.querySelector('.categoryHub')],
      ['library',document.getElementById('myGames')],
      ['account',document.getElementById('accountBox')]
    ].filter(([,el])=>el&&!el.classList.contains('hidden'));
    let current='home';
    points.forEach(([name,el])=>{if(el.offsetTop<=y)current=name});
    setActiveNav(current);
  }

  let scheduled=false;
  function enhance(){
    scheduled=false;
    markSections();
    ensureTopNav();
    ensureBottomNav();
    ensurePaymentTrust();
    decorateCards();
    ensureLibrarySummary();
  }
  function scheduleEnhance(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(enhance);
  }

  const observer=new MutationObserver(scheduleEnhance);
  observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  window.addEventListener('scroll',()=>requestAnimationFrame(updateNavByScroll),{passive:true});

  enhance();
  setTimeout(enhance,250);
  setTimeout(enhance,900);
  setTimeout(enhance,1800);
})();