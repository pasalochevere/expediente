(()=>{
  if(window.__pcLibraryExperienceV41E)return;
  window.__pcLibraryExperienceV41E=true;

  const norm=(v)=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
  const RECENTS_KEY='pc_v41e_recent_products';
  const FRESH_KEY='pc_v41e_fresh_state';
  const BASELINE_KEY='pc_v41e_fresh_baseline';

  /* Versiones visuales/comerciales. Cuando una experiencia cambie de versión,
     basta con actualizar su valor para que aparezca ACTUALIZADO hasta que el usuario la abra. */
  const RELEASES={
    'DI-TRILOGIA':'2026.09.22-a',
    'TK-MAT-79-PHY':'2026.09.22-a',
    'TK-MAT-79-DIG':'2026.09.22-a',
    'TORRE-MEGA':'2026.09.22-a',
    'TORRE-AMERICA':'2026.09.22-a',
    'EXP-001':'2026.09.22-a',
    'EXP-002':'2026.09.22-a',
    'VINC-001':'2026.09.22-a',
    'TAROT-GUIDE':'2026.09.22-a',
    'PSQ-FACTORY':'2026.09.22-a',
    'QUIMERA':'2026.09.22-a'
  };
  window.PC_RELEASES_V41E=Object.freeze({...RELEASES});

  const PREVIEW_META={
    'DI-TRILOGIA':{
      kicker:'PAREJA · EXPERIENCIA',headline:'Tres intensidades. Una misma conversación que cambia de clima.',
      tags:['Chispa','Fuego','Dominio'],format:'Digital + imprimible',use:'Juego guiado',focus:'Conexión y desafío',
      a:'#5f1835',b:'#130a11',symbol:'♥',
      samples:['Elegí la intensidad de la partida','Consignas una por una, sin saturar','Material completo después de activar']
    },
    'TK-MAT-79-PHY':{
      kicker:'KIDS · APRENDIZAJE',headline:'La torre física se convierte en una experiencia de matemática.',
      tags:['7–9 años','Torre + digital','Desafíos'],format:'Físico + digital',use:'Partidas breves',focus:'Cálculo y lógica',
      a:'#0b6279',b:'#092434',symbol:'★',image:'../torre-kids-matematica/assets/mascota-bloqui.svg',imageOpacity:.30,
      samples:['Número de pieza → desafío','Progresión por niveles','Feedback visual y ritmo de juego']
    },
    'TK-MAT-79-DIG':{
      kicker:'KIDS · APRENDIZAJE',headline:'Práctica de matemática preparada para jugar directamente en pantalla.',
      tags:['7–9 años','Solo digital','Repetible'],format:'100% digital',use:'Celular o tablet',focus:'Cálculo y lógica',
      a:'#0b6279',b:'#092434',symbol:'★',image:'../torre-kids-matematica/assets/mascota-bloqui.svg',imageOpacity:.30,
      samples:['Elegí nivel','Resolvé el desafío','Volvé a jugar con nuevas consignas']
    },
    'TORRE-MEGA':{
      kicker:'FAMILIA · FIESTA',headline:'Una biblioteca grande de consignas para distintos grupos y momentos.',
      tags:['Kids','General','Fiesta','Sin Filtro'],format:'Digital + torre',use:'4 modos',focus:'Retos y preguntas',
      a:'#7b351e',b:'#160c0e',symbol:'✦',
      samples:['Elegí una versión','Sacá una consigna al azar','Jugá con torre o solo digital']
    },
    'EXP-001':{
      kicker:'EXPEDIENTES · CASO 001',headline:'Entrá a la investigación sin revelar la solución.',
      tags:['Misterio','Evidencias','Multijugador'],format:'Investigación digital',use:'Roles y pistas',focus:'Deducción',
      a:'#594523',b:'#0c0b09',symbol:'⌕',image:'../caso001/assets/escenas/estudio.jpg',imageOpacity:.72,position:'50% 52%',
      samples:['Abrí el expediente','Revisá evidencias','Conectá pistas con tu equipo'],spoiler:true
    },
    'EXP-002':{
      kicker:'EXPEDIENTES · CASO 002',headline:'Hotel Orfeo. Habitación 317. Una investigación que cambia según la partida.',
      tags:['3 jugadores','Roles privados','Caminos variables'],format:'Investigación digital',use:'Multijugador',focus:'Misterio inmersivo',
      a:'#56361d',b:'#090807',symbol:'317',image:'../caso002/assets/visual/bin/room-317-v244.jpg',imageOpacity:.76,position:'50% 50%',
      samples:['Ingresá al Hotel Orfeo','Seguí pistas privadas','Construí una hipótesis con el grupo'],spoiler:true
    },
    'VINC-001':{
      kicker:'BIENESTAR · VÍNCULOS',headline:'Un espacio visual para representar personas, posiciones, escenas y emociones.',
      tags:['Interactivo','Escenas','Bitácora'],format:'Herramienta digital',use:'Exploración guiada',focus:'Vínculos',
      a:'#214c42',b:'#091411',symbol:'∞',
      samples:['Ubicá personas','Agregá emociones y vínculos','Guardá la escena para revisarla']
    },
    'PSQ-FACTORY':{
      kicker:'CREATIVOS · FACTORY',headline:'Elegí un diseño, personalizalo y preparalo para imprimir.',
      tags:['50 diseños','5 colecciones','Creator Plus'],format:'Factory digital',use:'Editor + biblioteca',focus:'Crear e imprimir',
      a:'#864060',b:'#210e18',symbol:'✂',
      samples:['Elegí un personaje','Personalizá detalles','Imprimibles habilitados con licencia activa']
    }
  };

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
    if(type==='math'||text.includes('MATEMATICA')){
      if(text.includes('FISICO'))return 'TK-MAT-79-PHY';
      return 'TK-MAT-79-DIG';
    }
    return '';
  }

  function safeJSON(key,fallback){
    try{return JSON.parse(localStorage.getItem(key)||'')||fallback}catch{return fallback}
  }
  function saveJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}

  function cardTitle(card){return card?.dataset?.pcCommercialTitle||card?.querySelector('.pcSmartHead h3')?.textContent?.trim()||card?.querySelector('h3')?.textContent?.trim()||'Experiencia'}

  /* ---------------- FILTERS ---------------- */
  let activeFilter='all';
  let searchTerm='';

  function matchesFilter(card){
    if(!card)return false;
    const text=norm(card.textContent);
    if(searchTerm&&!text.includes(norm(searchTerm)))return false;
    if(activeFilter==='all')return true;
    if(activeFilter==='active')return card.classList.contains('smartStateActive');
    if(activeFilter==='pending')return card.classList.contains('smartStatePending');
    if(activeFilter==='fresh')return !!card.dataset.pcFresh;
    if(activeFilter==='adult')return card.dataset.cat==='adult';
    if(activeFilter==='family')return card.dataset.cat==='family';
    if(activeFilter==='mystery')return card.dataset.cat==='mystery';
    if(activeFilter==='wellbeing')return card.dataset.cat==='wellbeing';
    if(activeFilter==='creative')return card.dataset.cat==='creative';
    return true;
  }

  function applyFilters(){
    const grid=document.getElementById('myGamesGrid');
    if(!grid)return;
    let visible=0;
    grid.querySelectorAll('.pcSmartCard').forEach(card=>{
      const show=matchesFilter(card);
      card.classList.toggle('pcFilterHidden',!show);
      if(show)visible++;
    });
    grid.querySelectorAll('.libraryGroup').forEach(group=>{
      const any=[...group.querySelectorAll('.pcSmartCard')].some(c=>!c.classList.contains('pcFilterHidden'));
      group.classList.toggle('pcFilterHidden',!any);
    });
    const empty=document.querySelector('.pcFilterEmpty');
    if(empty)empty.classList.toggle('visible',visible===0);
    document.querySelectorAll('.pcFilterChip').forEach(btn=>btn.classList.toggle('active',btn.dataset.filter===activeFilter));
  }

  function ensureFilters(){
    const myGames=document.getElementById('myGames');
    const grid=document.getElementById('myGamesGrid');
    if(!myGames||!grid||myGames.classList.contains('hidden'))return;
    if(myGames.querySelector('.pcLibraryTools')){applyFilters();return}

    const tools=document.createElement('div');
    tools.className='pcLibraryTools';
    tools.innerHTML=`<div class="pcFilterRail" aria-label="Filtros de biblioteca">
      <button class="pcFilterChip active" type="button" data-filter="all">Todos</button>
      <button class="pcFilterChip" type="button" data-filter="active">Activos</button>
      <button class="pcFilterChip" type="button" data-filter="pending">Por activar</button>
      <button class="pcFilterChip" type="button" data-filter="fresh">Nuevos / actualizados</button>
      <button class="pcFilterChip" type="button" data-filter="mystery">Misterio</button>
      <button class="pcFilterChip" type="button" data-filter="family">Kids</button>
      <button class="pcFilterChip" type="button" data-filter="adult">Pareja</button>
      <button class="pcFilterChip" type="button" data-filter="wellbeing">Bienestar</button>
      <button class="pcFilterChip" type="button" data-filter="creative">Creativos</button>
    </div><label class="pcLibrarySearch"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg><input type="search" autocomplete="off" placeholder="Buscar en mi biblioteca" aria-label="Buscar en mi biblioteca"></label>`;
    const empty=document.createElement('div');
    empty.className='pcFilterEmpty';
    empty.textContent='No encontramos accesos con este filtro. Probá otra categoría o borrá la búsqueda.';

    const summary=myGames.querySelector('.pcV4LibrarySummary');
    if(summary)summary.insertAdjacentElement('afterend',tools);
    else grid.insertAdjacentElement('beforebegin',tools);
    tools.insertAdjacentElement('afterend',empty);

    tools.querySelectorAll('.pcFilterChip').forEach(btn=>btn.addEventListener('click',()=>{activeFilter=btn.dataset.filter||'all';applyFilters()}));
    const input=tools.querySelector('input');
    input.addEventListener('input',()=>{searchTerm=input.value||'';applyFilters()});
    applyFilters();
  }

  /* ---------------- NEW / UPDATED ---------------- */
  function updateFreshness(){
    const cards=[...document.querySelectorAll('#myGamesGrid .pcSmartCard')];
    if(!cards.length)return;
    const state=safeJSON(FRESH_KEY,{});
    const baseline=localStorage.getItem(BASELINE_KEY)==='1';
    let changed=false;

    cards.forEach(card=>{
      const code=codeForCard(card);if(!code)return;
      const version=RELEASES[code]||'1';
      let rec=state[code];
      if(!rec){
        rec={version,firstSeen:Date.now(),isNew:baseline};
        state[code]=rec;changed=true;
      }
      let kind='';
      if(rec.isNew)kind='new';
      else if(rec.version!==version)kind='updated';
      card.dataset.pcFresh=kind;
      let badge=card.querySelector(':scope > .pcFreshBadge');
      if(kind){
        if(!badge){badge=document.createElement('span');badge.className='pcFreshBadge';card.appendChild(badge)}
        badge.dataset.kind=kind;
        badge.textContent=kind==='new'?'NUEVO':'ACTUALIZADO';
      }else if(badge)badge.remove();
    });

    if(!baseline){localStorage.setItem(BASELINE_KEY,'1');changed=true}
    if(changed)saveJSON(FRESH_KEY,state);
    const freshChip=document.querySelector('.pcFilterChip[data-filter="fresh"]');
    if(freshChip)freshChip.hidden=!cards.some(c=>!!c.dataset.pcFresh);
  }

  function acknowledgeCard(card){
    const code=codeForCard(card);if(!code)return;
    const state=safeJSON(FRESH_KEY,{});
    const rec=state[code]||{};
    rec.version=RELEASES[code]||rec.version||'1';
    rec.isNew=false;rec.lastSeen=Date.now();
    state[code]=rec;saveJSON(FRESH_KEY,state);
    card.dataset.pcFresh='';
    card.querySelector(':scope > .pcFreshBadge')?.remove();
  }

  /* ---------------- CONTINUE PLAYING ---------------- */
  function recordRecent(card){
    const code=codeForCard(card);if(!code)return;
    let recents=safeJSON(RECENTS_KEY,[]).filter(x=>x&&x.code!==code);
    recents.unshift({code,at:Date.now()});
    recents=recents.slice(0,8);saveJSON(RECENTS_KEY,recents);
    acknowledgeCard(card);
  }

  function relativeDate(ts){
    const diff=Date.now()-Number(ts||0);
    if(diff<86400000)return 'Hoy';
    if(diff<172800000)return 'Ayer';
    try{return new Date(ts).toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit'})}catch{return ''}
  }

  function renderContinue(){
    const myGames=document.getElementById('myGames');
    const grid=document.getElementById('myGamesGrid');
    if(!myGames||!grid||myGames.classList.contains('hidden'))return;
    const activeCards=[...grid.querySelectorAll('.pcSmartCard.smartStateActive')];
    const byCode=new Map(activeCards.map(c=>[codeForCard(c),c]).filter(x=>x[0]));
    const items=safeJSON(RECENTS_KEY,[]).filter(x=>byCode.has(x.code)).slice(0,3);
    let section=myGames.querySelector('.pcContinueSection');
    if(!items.length){section?.remove();return}
    if(!section){
      section=document.createElement('section');section.className='pcContinueSection';
      const summary=myGames.querySelector('.pcV4LibrarySummary');
      if(summary)summary.insertAdjacentElement('beforebegin',section);else myGames.querySelector('.catalog-title')?.insertAdjacentElement('afterend',section);
    }
    const sig=items.map(x=>x.code+':'+x.at).join('|');
    if(section.dataset.sig===sig)return;
    section.dataset.sig=sig;
    section.innerHTML='<div class="pcContinueHead"><div><small>ACCESO RÁPIDO</small><h3>Seguí jugando</h3></div><span>Tus experiencias abiertas recientemente</span></div><div class="pcContinueRail"></div>';
    const rail=section.querySelector('.pcContinueRail');
    items.forEach(item=>{
      const card=byCode.get(item.code);if(!card)return;
      const tile=document.createElement('button');tile.type='button';tile.className='pcContinueTile';tile.dataset.product=item.code;
      const cover=card.querySelector(':scope > .pcV4Cover');
      if(cover){const clone=cover.cloneNode(true);clone.querySelector('.pcSmartStatusSlot')?.remove();tile.appendChild(clone)}
      const meta=document.createElement('div');meta.className='pcContinueTileMeta';meta.innerHTML='<strong>'+escapeHtml(cardTitle(card))+'</strong><span>'+relativeDate(item.at)+'</span>';tile.appendChild(meta);
      tile.addEventListener('click',()=>{
        recordRecent(card);renderContinue();
        const primary=card.querySelector('.pcSmartMainActions>.btn:first-child');
        if(primary)primary.click();else card.scrollIntoView({behavior:'smooth',block:'center'});
      });
      rail.appendChild(tile);
    });
  }

  function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

  function installRecentTracking(){
    if(document.documentElement.dataset.pcRecentTracking==='1')return;
    document.documentElement.dataset.pcRecentTracking='1';
    document.addEventListener('click',e=>{
      const primary=e.target.closest?.('#myGamesGrid .pcSmartMainActions>.btn:first-child');
      if(!primary)return;
      const card=primary.closest('.pcSmartCard');if(!card)return;
      if(card.classList.contains('smartStateActive')&&/(ABRIR|JUGAR|CONTINUAR)/.test(norm(primary.textContent))){recordRecent(card);setTimeout(renderContinue,80)}
      else acknowledgeCard(card);
    },true);
    document.addEventListener('click',e=>{
      const details=e.target.closest?.('#myGamesGrid .pcSmartDetailsBtn');
      if(details){const card=details.closest('.pcSmartCard');if(card)acknowledgeCard(card)}
    },true);
  }

  /* ---------------- PREVIEWS ---------------- */
  let originalOpenPreview=null;

  function ensurePreviewHero(dialog,code,meta){
    let hero=dialog.querySelector('.pcPreviewHero');
    if(!hero){
      hero=document.createElement('section');hero.className='pcPreviewHero';
      const body=dialog.querySelector('.previewBody');
      if(body)body.insertAdjacentElement('beforebegin',hero);else dialog.appendChild(hero);
    }
    hero.style.setProperty('--pv-a',meta.a||'#33252e');
    hero.style.setProperty('--pv-b',meta.b||'#0e0d10');
    hero.style.setProperty('--pv-position',meta.position||'center');
    if(meta.image){hero.style.setProperty('--pv-image','url("'+meta.image+'")');hero.style.setProperty('--pv-image-opacity',String(meta.imageOpacity??.62))}
    else{hero.style.setProperty('--pv-image','none');hero.style.setProperty('--pv-image-opacity','0')}
    const p=window.PREVIEWS?.[code]||null;
    const title=document.getElementById('previewTitle')?.textContent||p?.title||'Vista previa';
    hero.innerHTML='<div class="pcPreviewHeroCopy"><small>'+escapeHtml(meta.kicker||'VISTA PREVIA')+'</small><h3>'+escapeHtml(title)+'</h3><p>'+escapeHtml(meta.headline||'Conocé la experiencia antes de comprar.')+'</p><div class="pcPreviewTags">'+(meta.tags||[]).map(x=>'<span>'+escapeHtml(x)+'</span>').join('')+'</div></div><div class="pcPreviewHeroArt"><div class="pcPreviewHeroSymbol">'+escapeHtml(meta.symbol||'✦')+'</div></div>';
  }

  function enrichPreview(code){
    const modal=document.getElementById('previewModal');
    const dialog=modal?.querySelector('.previewDialog');
    const meta=PREVIEW_META[code];
    if(!dialog||!meta)return;
    dialog.classList.add('pcPreviewV41E');
    dialog.dataset.previewProduct=code;
    ensurePreviewHero(dialog,code,meta);

    const summary=document.getElementById('previewSummary');
    if(summary&&!summary.previousElementSibling?.classList?.contains('pcPreviewSectionLabel'))summary.insertAdjacentHTML('beforebegin','<span class="pcPreviewSectionLabel">QUÉ ES</span>');
    let metaBox=dialog.querySelector('.pcPreviewMeta');
    if(!metaBox){metaBox=document.createElement('div');metaBox.className='pcPreviewMeta';summary?.insertAdjacentElement('afterend',metaBox)}
    metaBox.innerHTML='<div><b>Formato</b><span>'+escapeHtml(meta.format)+'</span></div><div><b>Experiencia</b><span>'+escapeHtml(meta.use)+'</span></div><div><b>Enfoque</b><span>'+escapeHtml(meta.focus)+'</span></div>';

    const list=document.getElementById('previewList');
    if(list&&!list.previousElementSibling?.classList?.contains('pcPreviewSectionLabel'))list.insertAdjacentHTML('beforebegin','<span class="pcPreviewSectionLabel">QUÉ INCLUYE</span>');

    const screen=dialog.querySelector('.previewScreen');
    if(screen){
      if(meta.image)screen.style.setProperty('--pv-screen-image','url("'+meta.image+'")');
      else screen.style.setProperty('--pv-screen-image','linear-gradient(145deg,'+(meta.a||'#2b2026')+','+(meta.b||'#111114')+')');
      const top=screen.querySelector('.previewScreenTop');
      if(top)top.innerHTML='<span>PASALOCHEVERE · VISTA PREVIA</span><span>'+(meta.spoiler?'SIN SPOILERS':'MUESTRA DE EXPERIENCIA')+'</span>';
      const samples=document.getElementById('previewSamples');
      if(samples)samples.innerHTML=(meta.samples||[]).map(x=>'<div class="previewSample">'+escapeHtml(x)+'</div>').join('');
    }

    let foot=dialog.querySelector('.pcPreviewFootnote');
    if(!foot){foot=document.createElement('div');foot.className='pcPreviewFootnote';const footer=dialog.querySelector('.previewFooter');if(footer)footer.insertAdjacentElement('beforebegin',foot);else dialog.appendChild(foot)}
    foot.textContent=meta.spoiler?'Vista previa cuidada: muestra el tono y la mecánica sin revelar la resolución del caso. El contenido completo se habilita con tu acceso.':'Esta vista previa muestra el concepto y la forma de uso. El contenido completo y los materiales incluidos se habilitan después de comprar y activar el acceso.';
  }

  function installPreviewUpgrade(){
    if(window.__pcPreviewUpgradeV41E)return;
    if(typeof window.openPreview!=='function')return;
    originalOpenPreview=window.openPreview;
    window.__pcPreviewUpgradeV41E=true;
    window.openPreview=function(productCode){
      const out=originalOpenPreview.apply(this,arguments);
      setTimeout(()=>enrichPreview(productCode),0);
      setTimeout(()=>enrichPreview(productCode),120);
      return out;
    };
  }

  function polishPreviewButtons(){
    document.querySelectorAll('.categoryDrawer .previewAction .btn').forEach(btn=>{
      if(norm(btn.textContent).includes('PREVIEW'))btn.textContent='VER VISTA PREVIA';
      btn.setAttribute('aria-label','Ver vista previa del producto');
    });
  }

  function applyAll(){
    updateFreshness();
    ensureFilters();
    renderContinue();
    installRecentTracking();
    installPreviewUpgrade();
    polishPreviewButtons();
    applyFilters();
  }

  function watch(){
    const grid=document.getElementById('myGamesGrid');
    if(grid&&grid.dataset.pcExperienceObserved!=='1'){
      grid.dataset.pcExperienceObserved='1';
      let queued=false;
      new MutationObserver(()=>{
        if(queued)return;queued=true;
        requestAnimationFrame(()=>{queued=false;applyAll()});
      }).observe(grid,{childList:true,subtree:true});
    }
    const drawers=document.querySelector('.categoryDrawers');
    if(drawers&&drawers.dataset.pcPreviewObserved!=='1'){
      drawers.dataset.pcPreviewObserved='1';
      let queued=false;
      new MutationObserver(()=>{
        if(queued)return;queued=true;
        requestAnimationFrame(()=>{queued=false;polishPreviewButtons()});
      }).observe(drawers,{childList:true,subtree:true});
    }
  }

  function boot(){watch();applyAll()}
  window.pcApplyLibraryExperience=boot;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  setTimeout(boot,350);setTimeout(boot,1000);setTimeout(boot,2200);
})();