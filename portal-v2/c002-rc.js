(()=>{
  // Portal loader V5.6.10 + DELIVERY01.8 commercial freeze + Preview V2.1C + Library V4.1E.x.
  // Arranca V5 sólo después de la base estable para evitar carreras en auth, biblioteca y activación.
  if(window.__pcPortalV21BLoader)return;
  window.__pcPortalV21BLoader=true;

  let stableReady=false;

  const ensureContinueShelf=()=>{
    if(document.getElementById('pc-continue-shelf-v41e1-css'))return;
    const css=document.createElement('link');
    css.id='pc-continue-shelf-v41e1-css';
    css.rel='stylesheet';
    css.href='portal-continue-shelf-v41e1.css?v=20260922-5';
    document.head.appendChild(css);
  };

  const ensureV56=()=>{
    if(!stableReady)return;
    if(!document.getElementById('pc-v5-bootstrap-v56-js')){
      const js=document.createElement('script');
      js.id='pc-v5-bootstrap-v56-js';
      js.src='portal-v5-bootstrap-v56.js?v=20261001-delivery018-1';
      js.defer=true;
      document.head.appendChild(js);
      return;
    }
    if(typeof window.pcV56RequestApply==='function')window.pcV56RequestApply('loader');
  };

  const ensureQuickAccess=()=>{
    if(document.getElementById('pc-quick-access-v41e3-js')){
      if(typeof window.pcFillQuickAccessV41E3==='function')window.pcFillQuickAccessV41E3();
      ensureV56();
      return;
    }
    const js=document.createElement('script');
    js.id='pc-quick-access-v41e3-js';
    js.src='portal-quick-access-v41e3.js?v=20260922-3';
    js.defer=true;
    js.addEventListener('load',ensureV56,{once:true});
    document.head.appendChild(js);
  };

  const ensureReconcile=()=>{
    if(document.getElementById('pc-library-reconcile-v41e2-js')){
      if(typeof window.pcReconcileLibraryV41E2==='function')window.pcReconcileLibraryV41E2();
      ensureQuickAccess();
      return;
    }
    const js=document.createElement('script');
    js.id='pc-library-reconcile-v41e2-js';
    js.src='portal-library-reconcile-v41e2.js?v=20260922-4';
    js.defer=true;
    js.addEventListener('load',ensureQuickAccess,{once:true});
    document.head.appendChild(js);
  };

  const ensureV21C=()=>{
    if(!window.__pcPreviewRealV21B)return false;
    if(!document.getElementById('pc-preview-real-v21c-css')){
      const css=document.createElement('link');
      css.id='pc-preview-real-v21c-css';
      css.rel='stylesheet';
      css.href='portal-preview-real-v21c.css?v=20260922-2';
      document.head.appendChild(css);
    }
    if(!document.getElementById('pc-preview-real-v21c-overrides')){
      const style=document.createElement('style');
      style.id='pc-preview-real-v21c-overrides';
      style.textContent='.pcV21cCounter{left:12px!important;right:auto!important;top:12px!important;bottom:auto!important}@media(max-width:620px){.pcV21cCounter{left:10px!important;top:10px!important;right:auto!important;bottom:auto!important}}';
      document.head.appendChild(style);
    }
    if(!document.getElementById('pc-preview-real-v21c-js')){
      const js=document.createElement('script');
      js.id='pc-preview-real-v21c-js';
      js.src='portal-preview-real-v21c.js?v=20260922-2';
      js.defer=true;
      js.addEventListener('load',ensureV56,{once:true});
      document.head.appendChild(js);
    }
    ensureV56();
    return true;
  };

  const ensureV21B=()=>{
    if(!window.PC_REAL_PREVIEWS_V2)return false;
    if(!document.getElementById('pc-preview-real-v21b-css')){
      const css=document.createElement('link');
      css.id='pc-preview-real-v21b-css';
      css.rel='stylesheet';
      css.href='portal-preview-real-v21b.css?v=20260922-5';
      document.head.appendChild(css);
    }
    if(!document.getElementById('pc-preview-real-v21b-js')){
      const js=document.createElement('script');
      js.id='pc-preview-real-v21b-js';
      js.src='portal-preview-real-v21b.js?v=20260922-5';
      js.defer=true;
      js.addEventListener('load',()=>{ensureReconcile();ensureQuickAccess();ensureV21C();ensureV56()},{once:true});
      document.head.appendChild(js);
    }else{
      ensureReconcile();
      ensureQuickAccess();
      ensureV56();
      if(!ensureV21C()){
        let tries=0;
        const t=setInterval(()=>{
          tries++;
          ensureV56();
          if(ensureV21C()||tries>30)clearInterval(t);
        },100);
      }
    }
    return true;
  };

  ensureContinueShelf();
  ensureReconcile();
  ensureQuickAccess();

  const stable=document.createElement('script');
  stable.id='pc-portal-stable-before-v21b';
  stable.src='backups/c002-rc.before-preview-real-v21b-20260922.js?v=20260929-closure61';
  stable.onload=()=>{
    stableReady=true;
    ensureContinueShelf();
    ensureReconcile();
    ensureQuickAccess();
    ensureV56();
    if(ensureV21B())return;
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      ensureReconcile();
      ensureQuickAccess();
      ensureV21C();
      ensureV56();
      if(ensureV21B()||tries>40)clearInterval(timer);
    },100);
  };
  stable.onerror=()=>console.error('No se pudo cargar el snapshot estable del Portal.');
  document.head.appendChild(stable);
})();

(()=>{
  if(window.__pcFamilia30PromoPatch)return;
  window.__pcFamilia30PromoPatch=true;
  const originalActivate=window.activatePurchase;
  if(typeof originalActivate!=='function')return;

  window.activatePurchase=async function(){
    const input=document.getElementById('purchaseCode');
    const raw=String(input?.value||'').trim();
    const normalized=raw.toUpperCase().replace(/[^A-Z0-9-]/g,'');
    if(normalized!=='FAMILIA30')return originalActivate.apply(this,arguments);

    const b=document.getElementById('activateBtn');
    b.disabled=true;
    msg('activateMsg','Activando tu invitación de 30 días…');
    try{
      const {data,error}=await sb.rpc('redeem_pc_promo',{
        p_code:normalized,
        p_device_id:deviceId(),
        p_device_label:deviceLabel()
      });
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'No se pudo activar la invitación.');
      msg('activateMsg',data.already_redeemed?'✅ Esta invitación ya estaba activada en tu cuenta.':'✅ Invitación activada. Tenés 30 días de acceso gratuito a la Biblioteca PasaloChevere.','good');
      input.value='';
      await loadMyGames();
    }catch(e){
      msg('activateMsg',e?.message||String(e),'bad');
    }finally{
      b.disabled=false;
    }
  };
})();

(()=>{
  if(document.getElementById('pc-tarot-intro-route-js'))return;
  const js=document.createElement('script');
  js.id='pc-tarot-intro-route-js';
  js.src='tarot-intro-route.js?v=20260923-1';
  js.defer=true;
  document.head.appendChild(js);
})();

(()=>{
  if(window.__pcRunasPortalV1)return;
  window.__pcRunasPortalV1=true;

  const runasCard=`<article class="card" data-cat="wellbeing" id="pc-runas-card-v1"><span class="status live">● DISPONIBLE</span><h3>ESCUELA DE RUNAS</h3><div class="accent">GUÍA INTERACTIVA · 24 RUNAS · 114 LECCIONES</div><p>Aprendé Elder Futhark con Biblioteca 24, ruta visual, tiradas, entrenador, simulador, Mi Lectura y Diario Rúnico.</p><div class="note" style="margin-top:8px"><b>$ 24.999</b> · acceso 12 meses · hasta 2 dispositivos</div><div class="actions"><button class="btn primary" onclick="buyNow('RUNAS-24')">COMPRAR AHORA</button><button class="btn" onclick="scrollToActivation()">ACTIVAR ACCESO</button></div></article>`;
  const newsCard=`<article class="newsCard" id="pc-runas-news-v1" onclick="openCategory('wellbeing')" style="cursor:pointer"><span class="newsTag new">NUEVO</span><b>ESCUELA DE RUNAS</b><p>24 runas, 114 lecciones, Biblioteca 24, tiradas, práctica, lectura propia y Diario Rúnico.</p></article>`;

  function injectRunas(){
    const count=document.querySelector('.catChip.wellbeing .catCount');
    if(count)count.textContent='3 herramientas';
    const grid=document.querySelector('#drawer-wellbeing .drawerGrid');
    if(grid&&!document.getElementById('pc-runas-card-v1'))grid.insertAdjacentHTML('beforeend',runasCard);
    const carousel=document.querySelector('.newsCarousel');
    if(carousel&&!document.getElementById('pc-runas-news-v1'))carousel.insertAdjacentHTML('afterbegin',newsCard);
  }

  const oldCategory=window.licenseCategory;
  if(typeof oldCategory==='function'){
    window.licenseCategory=function(l){
      const code=String(l?.product_code||'').toUpperCase(),name=String(l?.product_name||'').toUpperCase();
      if(code==='RUNAS-24'||name.includes('ESCUELA DE RUNAS'))return {key:'wellbeing',label:'✦ BIENESTAR & VÍNCULOS'};
      return oldCategory(l);
    };
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',injectRunas,{once:true});
  else injectRunas();
  setTimeout(injectRunas,300);
})();

(()=>{
  if(window.__pcQuimeraPortalV1)return;
  window.__pcQuimeraPortalV1=true;

  const quimeraCard=`<article class="card" data-cat="mystery" id="pc-quimera-card-v1"><span class="status live">● NUEVO</span><h3>PROJECT QUIMERA</h3><div class="accent">EL ARCHIVO NEGRO · ESCAPE DIGITAL PREMIUM</div><p>Explorá HELIX-9, resolvé puzzles, reconstruí una investigación procedural y enfrentá decisiones con finales variables. NORMAL/HARD, seeds, inventario, hallazgos y audio atmosférico.</p><div class="note" style="margin-top:8px"><b>$ 24.999</b> · acceso 12 meses · hasta 2 dispositivos</div><div class="actions"><button class="btn primary" onclick="scrollToActivation()">ACTIVAR ACCESO</button></div></article>`;
  const newsCard=`<article class="newsCard" id="pc-quimera-news-v1" onclick="openCategory('mystery')" style="cursor:pointer"><span class="newsTag new">NUEVO</span><b>PROJECT QUIMERA · EL ARCHIVO NEGRO</b><p>Escape digital premium: HELIX-9, rutas procedurales, puzzles, modos NORMAL/HARD y finales variables.</p></article>`;

  function patchQuimeraFunctions(){
    const cat=window.licenseCategory;
    if(typeof cat==='function'&&!cat.__qmrPatched){
      const base=cat;
      const wrapped=function(l){
        const code=String(l?.product_code||'').toUpperCase(),name=String(l?.product_name||'').toUpperCase();
        if(code==='QMR-001'||name.includes('PROJECT QUIMERA')||name.includes('EL ARCHIVO NEGRO'))return {key:'mystery',label:'⌕ MISTERIO & GRUPO'};
        return base(l);
      };
      wrapped.__qmrPatched=true;
      window.licenseCategory=wrapped;
    }
    const href=window.gameHref;
    if(typeof href==='function'&&!href.__qmrPatched){
      const baseHref=href;
      const wrappedHref=function(l){
        if(String(l?.product_code||'').toUpperCase()==='QMR-001'&&l?.activation_code)return '../quimera/?access='+encodeURIComponent(l.activation_code);
        return baseHref(l);
      };
      wrappedHref.__qmrPatched=true;
      window.gameHref=wrappedHref;
    }
  }

  function injectQuimera(){
    patchQuimeraFunctions();
    const count=document.querySelector('.catChip.mystery .catCount');
    if(count)count.textContent='3 títulos';
    const grid=document.querySelector('#drawer-mystery .drawerGrid');
    if(grid&&!document.getElementById('pc-quimera-card-v1'))grid.insertAdjacentHTML('beforeend',quimeraCard);
    const carousel=document.querySelector('.newsCarousel');
    if(carousel&&!document.getElementById('pc-quimera-news-v1'))carousel.insertAdjacentHTML('afterbegin',newsCard);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',injectQuimera,{once:true});
  else injectQuimera();
  [250,700,1500,3000,6000].forEach(ms=>setTimeout(injectQuimera,ms));
})();