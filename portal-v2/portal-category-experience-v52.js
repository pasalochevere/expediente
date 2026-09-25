(()=>{
  if(window.__pcCategoryExperienceV52)return;
  window.__pcCategoryExperienceV52=true;

  const META={
    adult:{eyebrow:'PAREJA & ADULTOS',title:'Conexión, humor e intensidad',sub:'Experiencias para compartir de a dos y elegir el clima de cada partida.'},
    family:{eyebrow:'FAMILIA & KIDS',title:'Jugar, aprender y compartir',sub:'Propuestas para chicos, familia, aprendizaje y momentos de juego.'},
    mystery:{eyebrow:'MISTERIO & GRUPO',title:'Casos, pistas y decisiones',sub:'Investigaciones y experiencias para resolver en equipo.'},
    wellbeing:{eyebrow:'BIENESTAR & VÍNCULOS',title:'Explorar, practicar y descubrir',sub:'Herramientas interactivas para vínculos, reflexión y práctica guiada.'},
    creative:{eyebrow:'CREATIVOS & DIDÁCTICOS',title:'Crear, construir y probar',sub:'Experiencias creativas, imprimibles y formatos para hacer con las manos.'}
  };

  let modal=null,host=null,activeDrawer=null,placeholder=null,lastFocus=null,currentCategory='';
  const originalOpen=typeof window.openCategory==='function'?window.openCategory:null;
  const originalClose=typeof window.closeCategories==='function'?window.closeCategories:null;

  function ensureModal(){
    if(modal)return modal;
    modal=document.createElement('div');
    modal.className='pcV52Modal hidden';
    modal.id='pcV52CategoryModal';
    modal.setAttribute('aria-hidden','true');
    modal.innerHTML=`
      <div class="pcV52Backdrop" data-v52-close></div>
      <section class="pcV52Dialog" role="dialog" aria-modal="true" aria-labelledby="pcV52Title" tabindex="-1">
        <header class="pcV52Head">
          <div class="pcV52HeadCopy">
            <div class="pcV52Eyebrow" id="pcV52Eyebrow">EXPLORAR</div>
            <h2 id="pcV52Title">Experiencias PasaloChevere</h2>
            <p id="pcV52Sub">Elegí una experiencia.</p>
            <div class="pcV52HeadMeta"><span class="pcV52Count" id="pcV52Count"></span></div>
          </div>
          <button class="pcV52Close" type="button" aria-label="Cerrar categoría" data-v52-close>×</button>
        </header>
        <div class="pcV52Body"><div class="pcV52Host"></div></div>
      </section>`;
    document.body.appendChild(modal);
    host=modal.querySelector('.pcV52Host');
    modal.addEventListener('click',e=>{if(e.target.closest('[data-v52-close]'))closeCategory()});
    return modal;
  }

  function updateExploreCopy(){
    const hub=document.querySelector('.categoryHub');
    if(!hub)return;
    const title=hub.querySelector('.categoryHubTitle h2');
    const helper=hub.querySelector('.categoryHubTitle span');
    if(title)title.textContent='Elegí una categoría';
    if(helper)helper.textContent='Entrá sólo a lo que te interesa. Cada familia se abre en su propio espacio.';
  }

  function refreshCounts(){
    document.querySelectorAll('.catChip[data-category]').forEach(chip=>{
      const cat=chip.dataset.category;
      const drawer=document.getElementById('drawer-'+cat);
      if(!drawer)return;
      const real=[...drawer.querySelectorAll('.drawerGrid>.card')].filter(c=>!c.classList.contains('emptyCard'));
      const count=real.length;
      const countEl=chip.querySelector('.catCount');
      if(countEl)countEl.textContent=count===0?'próximamente':count===1?'1 experiencia':`${count} experiencias`;
    });
  }

  function productCount(drawer){
    return [...drawer.querySelectorAll('.drawerGrid>.card')].filter(c=>!c.classList.contains('emptyCard')).length;
  }

  function fillHeader(category,drawer){
    const meta=META[category]||{eyebrow:'EXPLORAR',title:'Experiencias PasaloChevere',sub:'Elegí una experiencia.'};
    modal.querySelector('#pcV52Eyebrow').textContent=meta.eyebrow;
    modal.querySelector('#pcV52Title').textContent=meta.title;
    modal.querySelector('#pcV52Sub').textContent=meta.sub;
    const count=productCount(drawer);
    modal.querySelector('#pcV52Count').textContent=count===0?'PRÓXIMAMENTE':count===1?'1 EXPERIENCIA':`${count} EXPERIENCIAS`;
  }

  function clearActiveChip(){document.querySelectorAll('.catChip.active').forEach(c=>c.classList.remove('active'))}

  function mountDrawer(drawer){
    const parent=drawer.parentNode;
    placeholder=document.createComment('pc-v52-drawer-placeholder');
    parent.insertBefore(placeholder,drawer);
    host.replaceChildren();
    host.appendChild(drawer);
    drawer.classList.add('active','pcV52Mounted');
  }

  function restoreDrawer(){
    if(!activeDrawer)return;
    activeDrawer.classList.remove('pcV52Mounted','active');
    if(placeholder?.parentNode){placeholder.parentNode.insertBefore(activeDrawer,placeholder);placeholder.remove()}
    activeDrawer=null;placeholder=null;host?.replaceChildren();
  }

  function openCategory(category){
    if(!document.body.classList.contains('pcV51Ready')){
      if(originalOpen)return originalOpen(category);
      return;
    }
    const drawer=document.getElementById('drawer-'+category);
    if(!drawer)return;
    ensureModal();
    if(activeDrawer)restoreDrawer();
    lastFocus=document.activeElement;
    currentCategory=category;
    activeDrawer=drawer;
    mountDrawer(drawer);
    fillHeader(category,drawer);
    clearActiveChip();
    document.querySelector(`.catChip[data-category="${category}"]`)?.classList.add('active');
    document.body.classList.add('pcV52CategoryOpen');
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden','false');
    requestAnimationFrame(()=>modal.querySelector('.pcV52Dialog')?.focus());
  }

  function closeCategory(restoreFocus=true){
    if(!modal||modal.classList.contains('hidden')){
      if(originalClose)return originalClose();
      return;
    }
    restoreDrawer();
    currentCategory='';
    clearActiveChip();
    document.body.classList.remove('pcV52CategoryOpen');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden','true');
    if(restoreFocus&&lastFocus&&document.contains(lastFocus))requestAnimationFrame(()=>lastFocus.focus());
  }

  function previewOpen(){
    const preview=document.getElementById('pcRealPreviewModal');
    return !!preview&&!preview.classList.contains('hidden');
  }

  function trapFocus(e){
    if(!modal||modal.classList.contains('hidden'))return;
    if(previewOpen())return;
    if(e.key==='Escape'){e.preventDefault();closeCategory();return}
    if(e.key!=='Tab')return;
    const focusables=[...modal.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>el.offsetParent!==null);
    if(!focusables.length)return;
    const first=focusables[0],last=focusables[focusables.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }

  function prepare(){
    if(!document.body.classList.contains('pcV51Ready'))return;
    ensureModal();
    document.body.classList.add('pcV52Ready');
    updateExploreCopy();
    refreshCounts();
    document.querySelectorAll('.categoryDrawer.active').forEach(d=>{if(!d.classList.contains('pcV52Mounted'))d.classList.remove('active')});
  }

  window.pcOpenCategoryV52=openCategory;
  window.pcCloseCategoryV52=closeCategory;
  window.openCategory=function(category){return openCategory(category)};
  window.closeCategories=function(){return closeCategory()};

  document.addEventListener('keydown',trapFocus,true);
  document.addEventListener('click',e=>{
    if(!document.body.classList.contains('pcV52Ready'))return;
    const chip=e.target.closest('.catChip[data-category]');
    if(!chip)return;
    e.preventDefault();e.stopImmediatePropagation();
    openCategory(chip.dataset.category);
  },true);

  window.addEventListener('popstate',()=>{if(modal&&!modal.classList.contains('hidden'))closeCategory(false)});
  window.pcApplyCategoryExperienceV52=prepare;

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;prepare()})};
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-pc-v5-view']});
  schedule();setTimeout(schedule,350);setTimeout(schedule,900);setTimeout(schedule,1800);setTimeout(schedule,3200);
})();
