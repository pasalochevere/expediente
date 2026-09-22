(()=>{
  if(window.__pcProductMappingV41B)return;
  window.__pcProductMappingV41B=true;

  const norm=(v)=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();

  const PRODUCTS={
    doble:{title:'Doble Intención',subtitle:'Chispa · Fuego · Dominio',family:'PAREJA · TRILOGÍA',cover:'Doble Intención',description:'Conexión, humor e intensidad en tres niveles para elegir el clima de cada partida.',accent:'#b56a86'},
    america:{title:'Torre de América',subtitle:'Fútbol · Trivia · Desafíos',family:'FÚTBOL · JUEGO DIGITAL',cover:'Torre de América',description:'Preguntas, retos y momentos de partido en una experiencia futbolera lista para jugar.',accent:'#74b6d5'},
    mathPhysical:{title:'Chévere Kids · Matemática',subtitle:'Torre física + digital · 7–9 años',family:'KIDS · APRENDIZAJE',cover:'Matemática 7–9',description:'Desafíos progresivos que combinan juego físico, cálculo, lógica y resolución de problemas.',accent:'#69c4db'},
    mathDigital:{title:'Chévere Kids · Matemática',subtitle:'Solo digital · 7–9 años',family:'KIDS · APRENDIZAJE',cover:'Matemática 7–9',description:'Partidas cortas y repetibles para practicar matemática directamente desde celular o tablet.',accent:'#69c4db'},
    math:{title:'Chévere Kids · Matemática',subtitle:'Aprender jugando · 7–9 años',family:'KIDS · APRENDIZAJE',cover:'Matemática 7–9',description:'Cálculo, lógica y desafíos progresivos presentados como juego.',accent:'#69c4db'},
    party:{title:'Verdad o Reto +800',subtitle:'Kids · General · Fiesta · Sin Filtro',family:'FAMILIA · FIESTA',cover:'Verdad o Reto +800',description:'Una gran biblioteca de consignas para jugar con torre física o en modo completamente digital.',accent:'#d8a35f'},
    exp001:{title:'La Última Reunión',subtitle:'Expedientes · Caso 001',family:'MISTERIO · INVESTIGACIÓN',cover:'La Última Reunión',description:'Una investigación narrativa con evidencias, pistas, decisiones y trabajo en equipo.',accent:'#d4b26a'},
    exp002:{title:'Hotel Orfeo · 317',subtitle:'Expedientes · Caso 002',family:'MISTERIO · INVESTIGACIÓN',cover:'Hotel Orfeo · 317',description:'Una experiencia inmersiva para tres jugadores con roles privados, pistas y caminos variables.',accent:'#d4b26a'},
    tarot:{title:'Guía Interactiva de Tarot',subtitle:'Tiradas · práctica · lectura guiada',family:'BIENESTAR · TAROT',cover:'Guía Interactiva de Tarot',description:'Explorá cartas y tiradas con práctica guiada y herramientas para desarrollar tu lectura.',accent:'#b995d1'},
    vincores:{title:'Víncores',subtitle:'Campo de vínculos interactivo',family:'BIENESTAR · VÍNCULOS',cover:'Víncores Digital',description:'Representá vínculos, posiciones, escenas y emociones dentro de un espacio interactivo.',accent:'#76b5a2'},
    squishy:{title:'Paper Squishy Factory',subtitle:'Creator Plus · 50 diseños actuales',family:'CREATIVOS · FACTORY',cover:'Paper Squishy Factory',description:'Elegí, personalizá e imprimí tus Paper Squishies desde una fábrica creativa en expansión.',accent:'#d98eb2'},
    quimera:{title:'Quimera',subtitle:'Investigación · Escape room procedural',family:'MISTERIO · EXPERIENCIA',cover:'Quimera',description:'Una investigación rejugable con salas, pistas y recorridos que cambian entre partidas.',accent:'#c7a568'}
  };

  window.PC_PRODUCT_MAP_V41B=Object.freeze({...PRODUCTS});

  function technicalTitle(card){
    if(card.dataset.pcTechnicalTitle)return card.dataset.pcTechnicalTitle;
    const h3=card.querySelector('.pcSmartHead h3')||card.querySelector('h3');
    const value=(h3?.textContent||'').trim();
    if(value)card.dataset.pcTechnicalTitle=value;
    return value;
  }

  function resolveProduct(card){
    const type=String(card.dataset.pcV4Type||'').toLowerCase();
    const raw=norm(technicalTitle(card));
    if(type==='doble'||raw.includes('DOBLE INTENCION'))return PRODUCTS.doble;
    if(type==='america'||raw.includes('TORRE DE AMERICA'))return PRODUCTS.america;
    if(type==='party'||raw.includes('MEGA PACK')||raw.includes('VERDAD O RETO'))return PRODUCTS.party;
    if(type==='exp001'||raw.includes('CASO 001')||raw.includes('ULTIMA REUNION'))return PRODUCTS.exp001;
    if(type==='exp002'||raw.includes('CASO 002')||raw.includes('HOTEL ORFEO')||raw.includes('HABITACION 317'))return PRODUCTS.exp002;
    if(type==='tarot'||raw.includes('MESA TAROT')||raw.includes('GUIA INTERACTIVA DE TAROT'))return PRODUCTS.tarot;
    if(type==='vincores'||raw.includes('VINCORES'))return PRODUCTS.vincores;
    if(type==='squishy'||raw.includes('PAPER SQUISHY'))return PRODUCTS.squishy;
    if(raw.includes('QUIMERA'))return PRODUCTS.quimera;
    if(type==='math'||raw.includes('CHEVERE KIDS')&&raw.includes('MATEMATICA')){
      if(raw.includes('FISICO')||raw.includes('TORRE'))return PRODUCTS.mathPhysical;
      if(raw.includes('SOLO DIGITAL')||raw.includes('DIGITAL'))return PRODUCTS.mathDigital;
      return PRODUCTS.math;
    }
    return null;
  }

  function setText(el,value){
    if(el&&el.textContent!==value)el.textContent=value;
  }

  function ensureSubtitle(head,map){
    let subtitle=head.querySelector('.pcMappedSubtitle');
    if(!subtitle){
      subtitle=document.createElement('div');
      subtitle.className='pcMappedSubtitle';
      const title=head.querySelector('h3');
      if(title)title.insertAdjacentElement('afterend',subtitle);else head.appendChild(subtitle);
    }
    setText(subtitle,map.subtitle);
  }

  function mapCover(card,map){
    const cover=card.querySelector(':scope > .pcV4Cover');
    if(!cover)return;
    setText(cover.querySelector('.pcV4CoverKicker'),map.family);
    setText(cover.querySelector('.pcV4CoverName'),map.cover||map.title);
  }

  function labelActions(card,map){
    const primary=card.querySelector('.pcSmartMainActions .btn.primary,.pcSmartMainActions a.btn:first-child,.pcSmartMainActions button.btn:first-child');
    if(primary){
      const action=norm(primary.textContent).includes('ACTIVAR')?'Activar':norm(primary.textContent).includes('RENOVAR')?'Renovar':'Abrir';
      primary.setAttribute('aria-label',action+' '+map.title);
      primary.title=action+' '+map.title;
    }
    const details=card.querySelector('.pcSmartDetailsBtn');
    if(details)details.setAttribute('aria-label','Ver detalles de '+map.title);
  }

  function applyMapping(card){
    if(!card||!card.classList.contains('pcSmartCard')||card.dataset.pcMapped41b==='1')return;
    const head=card.querySelector('.pcSmartHead');
    const title=head?.querySelector('h3');
    if(!head||!title)return;

    const original=technicalTitle(card);
    const map=resolveProduct(card);
    if(!map)return;

    card.dataset.pcMapped41b='1';
    card.dataset.pcCommercialTitle=map.title;
    card.style.setProperty('--pc-map-accent',map.accent||'#d3a548');

    setText(head.querySelector('.pcSmartKicker'),map.family);
    setText(title,map.title);
    title.setAttribute('title',original&&original!==map.title?'Nombre registrado: '+original:map.title);
    ensureSubtitle(head,map);
    setText(head.querySelector('.pcSmartHint'),map.description);
    mapCover(card,map);
    labelActions(card,map);
  }

  function applyAll(){
    document.querySelectorAll('#myGamesGrid .pcSmartCard').forEach(applyMapping);
  }

  function watch(){
    const grid=document.getElementById('myGamesGrid');
    if(!grid||grid.dataset.pcMappingObserved==='1')return;
    grid.dataset.pcMappingObserved='1';
    let queued=false;
    const observer=new MutationObserver(()=>{
      if(queued)return;
      queued=true;
      requestAnimationFrame(()=>{queued=false;applyAll()});
    });
    observer.observe(grid,{childList:true,subtree:true});
  }

  function boot(){watch();applyAll();}
  window.pcMapLibraryProducts=boot;

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  setTimeout(boot,300);
  setTimeout(boot,900);
  setTimeout(boot,1800);
})();