(()=>{
  // Portal loader V2.1B + Continue Shelf V4.1E.1.
  // Preserva la cadena V3→V4→V4.1A-E→Preview Real V2 y agrega capas visuales no destructivas.
  if(window.__pcPortalV21BLoader)return;
  window.__pcPortalV21BLoader=true;

  const ensureContinueShelf=()=>{
    if(document.getElementById('pc-continue-shelf-v41e1-css'))return;
    const css=document.createElement('link');
    css.id='pc-continue-shelf-v41e1-css';
    css.rel='stylesheet';
    css.href='portal-continue-shelf-v41e1.css?v=20260922-1';
    document.head.appendChild(css);
  };

  const ensureV21B=()=>{
    if(!window.PC_REAL_PREVIEWS_V2)return false;
    if(!document.getElementById('pc-preview-real-v21b-css')){
      const css=document.createElement('link');
      css.id='pc-preview-real-v21b-css';
      css.rel='stylesheet';
      css.href='portal-preview-real-v21b.css?v=20260922-1';
      document.head.appendChild(css);
    }
    if(!document.getElementById('pc-preview-real-v21b-js')){
      const js=document.createElement('script');
      js.id='pc-preview-real-v21b-js';
      js.src='portal-preview-real-v21b.js?v=20260922-1';
      js.defer=true;
      document.head.appendChild(js);
    }
    return true;
  };

  ensureContinueShelf();

  const stable=document.createElement('script');
  stable.id='pc-portal-stable-before-v21b';
  stable.src='backups/c002-rc.before-preview-real-v21b-20260922.js?v=20260922-1';
  stable.onload=()=>{
    ensureContinueShelf();
    if(ensureV21B())return;
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(ensureV21B()||tries>40)clearInterval(timer);
    },100);
  };
  stable.onerror=()=>console.error('No se pudo cargar el snapshot estable del Portal.');
  document.head.appendChild(stable);
})();