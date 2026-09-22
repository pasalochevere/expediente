(()=>{
  // Portal loader V4.2.1 + Preview V2.1C + Library V4.1E.x.
  // Preserva V3→V4→V4.1A-E→Preview Real V2/V2.1B/V2.1C y agrega Home personalizada + Discovery + tuning visual sin tocar backend.
  if(window.__pcPortalV21BLoader)return;
  window.__pcPortalV21BLoader=true;

  const ensureContinueShelf=()=>{
    if(document.getElementById('pc-continue-shelf-v41e1-css'))return;
    const css=document.createElement('link');
    css.id='pc-continue-shelf-v41e1-css';
    css.rel='stylesheet';
    css.href='portal-continue-shelf-v41e1.css?v=20260922-5';
    document.head.appendChild(css);
  };

  const ensureV421=()=>{
    if(!document.getElementById('pc-home-tuning-v421-css')){
      const css=document.createElement('link');
      css.id='pc-home-tuning-v421-css';
      css.rel='stylesheet';
      css.href='portal-home-tuning-v421.css?v=20260922-1';
      document.head.appendChild(css);
    }
    if(!document.getElementById('pc-home-tuning-v421-js')){
      const js=document.createElement('script');
      js.id='pc-home-tuning-v421-js';
      js.src='portal-home-tuning-v421.js?v=20260922-1';
      js.defer=true;
      document.head.appendChild(js);
    }else if(typeof window.pcApplyHomeV421==='function'){
      window.pcApplyHomeV421();
    }
  };

  const ensureV42=()=>{
    if(!document.getElementById('pc-home-discovery-v42-css')){
      const css=document.createElement('link');
      css.id='pc-home-discovery-v42-css';
      css.rel='stylesheet';
      css.href='portal-home-discovery-v42.css?v=20260922-2';
      document.head.appendChild(css);
    }
    if(!document.getElementById('pc-home-discovery-v42-js')){
      const js=document.createElement('script');
      js.id='pc-home-discovery-v42-js';
      js.src='portal-home-discovery-v42.js?v=20260922-2';
      js.defer=true;
      js.addEventListener('load',ensureV421,{once:true});
      document.head.appendChild(js);
    }else if(typeof window.pcApplyHomeV42==='function'){
      window.pcApplyHomeV42();
    }
    if(!document.getElementById('pc-home-discovery-v42-bridge-js')){
      const bridge=document.createElement('script');
      bridge.id='pc-home-discovery-v42-bridge-js';
      bridge.src='portal-home-discovery-v42-bridge.js?v=20260922-1';
      bridge.defer=true;
      bridge.addEventListener('load',ensureV421,{once:true});
      document.head.appendChild(bridge);
    }
    ensureV421();
  };

  const ensureQuickAccess=()=>{
    if(document.getElementById('pc-quick-access-v41e3-js')){
      if(typeof window.pcFillQuickAccessV41E3==='function')window.pcFillQuickAccessV41E3();
      ensureV42();
      return;
    }
    const js=document.createElement('script');
    js.id='pc-quick-access-v41e3-js';
    js.src='portal-quick-access-v41e3.js?v=20260922-3';
    js.defer=true;
    js.addEventListener('load',ensureV42,{once:true});
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
      js.addEventListener('load',ensureV42,{once:true});
      document.head.appendChild(js);
    }
    ensureV42();
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
      js.addEventListener('load',()=>{ensureReconcile();ensureQuickAccess();ensureV21C();ensureV42();ensureV421()},{once:true});
      document.head.appendChild(js);
    }else{
      ensureReconcile();
      ensureQuickAccess();
      ensureV42();
      ensureV421();
      if(!ensureV21C()){
        let tries=0;const t=setInterval(()=>{tries++;ensureV42();ensureV421();if(ensureV21C()||tries>30)clearInterval(t)},100);
      }
    }
    return true;
  };

  ensureContinueShelf();
  ensureReconcile();
  ensureQuickAccess();
  ensureV42();
  ensureV421();

  const stable=document.createElement('script');
  stable.id='pc-portal-stable-before-v21b';
  stable.src='backups/c002-rc.before-preview-real-v21b-20260922.js?v=20260922-5';
  stable.onload=()=>{
    ensureContinueShelf();
    ensureReconcile();
    ensureQuickAccess();
    ensureV42();
    ensureV421();
    if(ensureV21B())return;
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      ensureReconcile();
      ensureQuickAccess();
      ensureV21C();
      ensureV42();
      ensureV421();
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