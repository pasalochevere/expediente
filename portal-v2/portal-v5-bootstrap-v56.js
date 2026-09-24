(()=>{
  if(window.__pcV56Bootstrap)return;
  window.__pcV56Bootstrap=true;
  window.__pcV56CentralScheduler=true;

  const VERSION='20260924-1';
  const callbacks=new Map();
  const state={started:performance.now(),loadedAt:0,lastReason:'boot',runs:0,errors:[]};
  let raf=0;

  function register(name,fn){
    if(typeof fn!=='function')return;
    callbacks.set(name,fn);
    requestApply('register:'+name);
  }

  function applyAll(){
    raf=0;
    state.runs++;
    [...callbacks.entries()]
      .sort(([a],[b])=>String(a).localeCompare(String(b)))
      .forEach(([name,fn])=>{
        try{fn()}catch(e){
          console.warn('Portal V5.6 apply',name,e);
          state.errors.push({name,message:String(e?.message||e),at:Date.now()});
          if(state.errors.length>12)state.errors.shift();
        }
      });
  }

  function requestApply(reason='runtime'){
    state.lastReason=reason;
    if(raf)return;
    raf=requestAnimationFrame(applyAll);
  }

  window.pcV56Register=register;
  window.pcV56RequestApply=requestApply;

  function ensureCss(id,href){
    if(document.getElementById(id))return;
    const css=document.createElement('link');
    css.id=id;css.rel='stylesheet';css.href=href;
    document.head.appendChild(css);
  }

  function ensureScript(id,src){
    return new Promise((resolve,reject)=>{
      const existing=document.getElementById(id);
      if(existing){
        if(existing.dataset.pcV56Loaded==='1'||existing.readyState==='complete'){resolve(existing);return}
        existing.addEventListener('load',()=>resolve(existing),{once:true});
        existing.addEventListener('error',()=>reject(new Error('No se pudo cargar '+src)),{once:true});
        setTimeout(()=>resolve(existing),1200);
        return;
      }
      const js=document.createElement('script');
      js.id=id;js.src=src;js.async=false;
      js.addEventListener('load',()=>{js.dataset.pcV56Loaded='1';resolve(js)},{once:true});
      js.addEventListener('error',()=>reject(new Error('No se pudo cargar '+src)),{once:true});
      document.head.appendChild(js);
    });
  }

  function preloadCss(){
    ensureCss('pc-access-gate-v50-css','portal-access-gate-v50.css?v='+VERSION);
    ensureCss('pc-clean-home-v51-css','portal-clean-home-v51.css?v='+VERSION);
    ensureCss('pc-category-experience-v52-css','portal-category-experience-v52.css?v='+VERSION);
    ensureCss('pc-account-center-v53-css','portal-account-center-v53.css?v='+VERSION);
    ensureCss('pc-nav-mobile-v54-css','portal-nav-mobile-v54.css?v='+VERSION);
    ensureCss('pc-legacy-cleanup-v55-css','portal-legacy-cleanup-v55.css?v='+VERSION);
    ensureCss('pc-visual-qa-v56-css','portal-visual-qa-v56.css?v='+VERSION);
  }

  function installScheduler(){
    const observer=new MutationObserver(()=>requestApply('mutation'));
    observer.observe(document.body,{
      childList:true,
      subtree:true,
      attributes:true,
      attributeFilter:['class','id','data-pc-v5-view','data-pc-fresh','aria-hidden']
    });
    window.addEventListener('pageshow',()=>requestApply('pageshow'));
    window.addEventListener('resize',()=>requestApply('resize'),{passive:true});
    window.addEventListener('storage',e=>{
      if(!e.key||e.key==='pc_v41e_recent_products')requestApply('storage');
    });
    document.addEventListener('visibilitychange',()=>{
      if(document.visibilityState==='visible')requestApply('visible');
    });
  }

  function registerExisting(){
    register('51-home',window.pcApplyCleanHomeV51);
    register('52-categories',window.pcApplyCategoryExperienceV52);
    register('53-account',window.pcApplyAccountCenterV53);
    register('54-nav',window.pcApplyNavMobileV54);
    register('55-cleanup',window.pcApplyLegacyCleanupV55);
  }

  async function boot(){
    preloadCss();
    try{
      await ensureScript('pc-access-gate-v50-js','portal-access-gate-v50.js?v='+VERSION);
      await ensureScript('pc-clean-home-v51-js','portal-clean-home-v51.js?v='+VERSION);
      register('51-home',window.pcApplyCleanHomeV51);
      await ensureScript('pc-category-experience-v52-js','portal-category-experience-v52.js?v='+VERSION);
      register('52-categories',window.pcApplyCategoryExperienceV52);
      await ensureScript('pc-account-center-v53-js','portal-account-center-v53.js?v='+VERSION);
      register('53-account',window.pcApplyAccountCenterV53);
      await ensureScript('pc-nav-mobile-v54-js','portal-nav-mobile-v54.js?v='+VERSION);
      register('54-nav',window.pcApplyNavMobileV54);
      await ensureScript('pc-legacy-cleanup-v55-js','portal-legacy-cleanup-v55.js?v='+VERSION);
      register('55-cleanup',window.pcApplyLegacyCleanupV55);
      registerExisting();
      state.loadedAt=performance.now();
      document.body.classList.add('pcV56Ready');
      document.body.dataset.pcBootstrap='v56';
      requestApply('boot-complete');
    }catch(e){
      console.error('Portal V5.6 bootstrap',e);
      state.errors.push({name:'bootstrap',message:String(e?.message||e),at:Date.now()});
      document.body.classList.add('pcV56BootError');
    }
  }

  window.pcPortalV56Audit=()=>({
    version:'5.6',
    centralScheduler:!!window.__pcV56CentralScheduler,
    ready:document.body.classList.contains('pcV56Ready'),
    bootstrap:document.body.dataset.pcBootstrap||'',
    view:document.body.dataset.pcV5View||'',
    registered:[...callbacks.keys()],
    applyRuns:state.runs,
    lastReason:state.lastReason,
    bootMs:state.loadedAt?Math.round(state.loadedAt-state.started):null,
    errors:[...state.errors],
    dom:{
      homes:document.querySelectorAll('.pcV51Home').length,
      legacyHomes:document.querySelectorAll('.pcV42Home').length,
      inicio:document.querySelectorAll('#inicio').length,
      topNav:document.querySelectorAll('.pcV4Nav').length,
      bottomNav:document.querySelectorAll('.pcV4BottomNav').length,
      categoryModals:document.querySelectorAll('.pcV52Modal').length,
      accountSections:document.querySelectorAll('.pcV53Account').length
    },
    modules:{
      gate:!!window.__pcAccessGateV50,
      home:!!window.__pcCleanHomeV51,
      categories:!!window.__pcCategoryExperienceV52,
      account:!!window.__pcAccountCenterV53,
      nav:!!window.__pcNavMobileV54,
      cleanup:!!window.__pcLegacyCleanupV55
    }
  });

  installScheduler();
  boot();
})();
