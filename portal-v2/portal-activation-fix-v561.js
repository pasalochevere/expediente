(()=>{
  // Portal V5.6.1 · Activation reliability hotfix + direct portal routes.
  if(window.__pcActivationFixV561)return;
  window.__pcActivationFixV561=true;

  const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
  let busy=false;
  let routeHandled=false;

  function codeFromInline(el){
    const raw=String(el?.getAttribute?.('onclick')||'');
    const m=raw.match(/activateOwned\(\s*(['"])(.*?)\1\s*\)/i);
    return m?.[2]||'';
  }

  function codeFromCard(card){
    if(!card)return '';
    const primary=card.querySelector('.pcSmartMainActions>.btn:first-child,.pcSmartMainActions>button:first-child,.actions .btn.primary,.actions .btn');
    const exact=codeFromInline(primary);
    if(exact)return exact;
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
    if(type==='runas'||text.includes('ESCUELA DE RUNAS')||text.includes('ELDER FUTHARK'))return 'RUNAS-24';
    if(type==='math'||text.includes('MATEMATICA'))return 'TK-MAT-79-DIG';
    return '';
  }

  function pendingCardForHome(){
    const title=norm(document.querySelector('.pcV51Continue h2')?.textContent);
    const pending=[...document.querySelectorAll('#myGamesGrid .pcSmartCard.smartStatePending')];
    return pending.find(c=>norm(c.dataset.pcCommercialTitle||c.querySelector('.pcSmartHead h3')?.textContent||c.querySelector('h3')?.textContent)===title)||pending[0]||null;
  }

  async function directActivate(code){
    if(typeof window.callAccess!=='function'){
      if(typeof window.activateOwned==='function')return window.activateOwned(code);
      throw new Error('El servicio de activación todavía no está listo.');
    }
    const body={action:'activate_owned',product_code:code};
    if(typeof window.deviceId==='function')body.device_id=window.deviceId();
    if(typeof window.deviceLabel==='function')body.device_label=window.deviceLabel();
    const d=await window.callAccess(body);
    if(typeof window.loadMyGames==='function')await window.loadMyGames();
    const access=d?.license?.activation_code;
    alert(access?'✅ Acceso activado. Tu código personal es '+access:'✅ Acceso activado.');
    return d;
  }

  async function safeActivate(code,button){
    code=String(code||'').trim();
    if(!code||busy)return;
    busy=true;
    const oldText=button?.textContent||'';
    if(button){button.disabled=true;button.textContent='ACTIVANDO…';}
    try{
      await directActivate(code);
      if(typeof window.pcV56RequestApply==='function')window.pcV56RequestApply('activation-complete');
      setTimeout(()=>{
        try{if(typeof window.pcApplyCleanHomeV51==='function')window.pcApplyCleanHomeV51()}catch{}
        try{if(typeof window.pcApplyAccountCenterV53==='function')window.pcApplyAccountCenterV53()}catch{}
      },120);
    }catch(e){
      console.error('Portal activation V5.6.1',e);
      alert(e?.message||'No pude activar esta compra.');
    }finally{
      busy=false;
      if(button&&document.contains(button)){button.disabled=false;button.textContent=oldText||'ACTIVAR';}
    }
  }

  function requestedView(){
    try{
      const raw=String(new URL(location.href).searchParams.get('view')||'').toLowerCase().trim();
      return ['home','library','explore','account'].includes(raw)?raw:'';
    }catch{return ''}
  }

  function clearViewParam(){
    try{
      const u=new URL(location.href);
      if(!u.searchParams.has('view'))return;
      u.searchParams.delete('view');
      history.replaceState({},document.title,u.pathname+(u.search?u.search:'')+(u.hash||''));
    }catch{}
  }

  function handlePortalRoute(){
    const view=requestedView();
    if(!view||routeHandled)return true;
    if(!document.body.classList.contains('pcV50PortalReady'))return false;

    if(view==='library'){
      if(typeof window.pcV50OpenLibrary!=='function')return false;
      routeHandled=true;clearViewParam();window.pcV50OpenLibrary();return true;
    }
    if(view==='account'){
      if(typeof window.pcV50OpenAccount!=='function')return false;
      routeHandled=true;clearViewParam();window.pcV50OpenAccount();return true;
    }
    if(typeof window.pcV5SetView!=='function')return false;
    routeHandled=true;clearViewParam();window.pcV5SetView(view);return true;
  }

  function externalPurchaseCode(){
    try{
      const u=new URL(location.href);
      const fromUrl=String(u.searchParams.get('access_code')||'').trim();
      if(fromUrl)return fromUrl;
      return String(localStorage.getItem('pc_access01_purchase_code')||'').trim();
    }catch{return ''}
  }

  function prefillPurchaseCode(){
    const input=document.getElementById('pcV50Code');
    if(!input)return false;
    const code=externalPurchaseCode();
    if(code&&!input.value)input.value=code;
    return true;
  }

  document.addEventListener('click',e=>{
    const libBtn=e.target.closest?.('#myGamesGrid .pcSmartCard.smartStatePending .pcSmartMainActions>.btn:first-child,#myGamesGrid .pcSmartCard.smartStatePending .actions .btn.primary');
    if(libBtn&&norm(libBtn.textContent).includes('ACTIVAR')){
      const card=libBtn.closest('.pcSmartCard');
      const code=codeFromCard(card);
      if(code){e.preventDefault();e.stopImmediatePropagation();safeActivate(code,libBtn);return;}
    }

    const homeBtn=e.target.closest?.('.pcV51Home .pcV51Primary');
    if(homeBtn&&norm(homeBtn.textContent).includes('ACTIVAR')){
      const card=pendingCardForHome();
      const code=codeFromCard(card);
      if(code){e.preventDefault();e.stopImmediatePropagation();safeActivate(code,homeBtn);return;}
    }

    const accountBtn=e.target.closest?.('.pcV53Account [data-activate-owned]');
    if(accountBtn){
      const code=String(accountBtn.dataset.activateOwned||'').trim();
      if(code){e.preventDefault();e.stopImmediatePropagation();safeActivate(code,accountBtn);}
    }
  },true);

  window.pcActivateOwnedSafeV561=safeActivate;
  window.pcActivationCodeForCardV561=codeFromCard;

  let routeTries=0;
  const routeTimer=setInterval(()=>{
    routeTries++;
    const routed=handlePortalRoute();
    prefillPurchaseCode();
    if((routed&&prefillPurchaseCode())||routeTries>70)clearInterval(routeTimer);
  },100);
  window.addEventListener('pageshow',()=>{setTimeout(()=>{handlePortalRoute();prefillPurchaseCode()},0)});
})();