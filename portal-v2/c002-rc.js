(()=>{
  // Portal loader V2.1C + Continue Shelf V4.1E.1 + Library Reconcile V4.1E.2 + Quick Access V4.1E.3.
  // Preserva V3→V4→V4.1A-E→Preview Real V2/V2.1B y agrega UX/móvil V2.1C sin tocar backend.
  if(window.__pcPortalV21BLoader)return;
  window.__pcPortalV21BLoader=true;

  const ensureContinueShelf=()=>{
    if(document.getElementById('pc-continue-shelf-v41e1-css'))return;
    const css=document.createElement('link');
    css.id='pc-continue-shelf-v41e1-css';
    css.rel='stylesheet';
    css.href='portal-continue-shelf-v41e1.css?v=20260922-4';
    document.head.appendChild(css);
  };

  const ensureQuickAccess=()=>{
    if(document.getElementById('pc-quick-access-v41e3-js')){
      if(typeof window.pcFillQuickAccessV41E3==='function')window.pcFillQuickAccessV41E3();
      return;
    }
    const js=document.createElement('script');
    js.id='pc-quick-access-v41e3-js';
    js.src='portal-quick-access-v41e3.js?v=20260922-2';
    js.defer=true;
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
    js.src='portal-library-reconcile-v41e2.js?v=20260922-3';
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
      css.href='portal-preview-real-v21c.css?v=20260922-1';
      document.head.appendChild(css);
    }
    if(!document.getElementById('pc-preview-real-v21c-js')){
      const js=document.createElement('script');
      js.id='pc-preview-real-v21c-js';
      js.src='portal-preview-real-v21c.js?v=20260922-1';
      js.defer=true;
      document.head.appendChild(js);
    }
    return true;
  };

  const ensureV21B=()=>{
    if(!window.PC_REAL_PREVIEWS_V2)return false;
    if(!document.getElementById('pc-preview-real-v21b-css')){
      const css=document.createElement('link');
      css.id='pc-preview-real-v21b-css';
      css.rel='stylesheet';
      css.href='portal-preview-real-v21b.css?v=20260922-4';
      document.head.appendChild(css);
    }
    if(!document.getElementById('pc-preview-real-v21b-js')){
      const js=document.createElement('script');
      js.id='pc-preview-real-v21b-js';
      js.src='portal-preview-real-v21b.js?v=20260922-4';
      js.defer=true;
      js.addEventListener('load',()=>{ensureReconcile();ensureQuickAccess();ensureV21C()},{once:true});
      document.head.appendChild(js);
    }else{
      ensureReconcile();
      ensureQuickAccess();
      if(!ensureV21C()){
        let tries=0;const t=setInterval(()=>{tries++;if(ensureV21C()||tries>30)clearInterval(t)},100);
      }
    }
    return true;
  };

  ensureContinueShelf();
  ensureReconcile();
  ensureQuickAccess();

  const stable=document.createElement('script');
  stable.id='pc-portal-stable-before-v21b';
  stable.src='backups/c002-rc.before-preview-real-v21b-20260922.js?v=20260922-4';
  stable.onload=()=>{
    ensureContinueShelf();
    ensureReconcile();
    ensureQuickAccess();
    if(ensureV21B())return;
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      ensureReconcile();
      ensureQuickAccess();
      ensureV21C();
      if(ensureV21B()||tries>40)clearInterval(timer);
    },100);
  };
  stable.onerror=()=>console.error('No se pudo cargar el snapshot estable del Portal.');
  document.head.appendChild(stable);
})();