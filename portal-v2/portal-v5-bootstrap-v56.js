(()=>{
  if(window.__pcV56Bootstrap)return;
  window.__pcV56Bootstrap=true;

  const VERSION='20261009-preview64-1';
  const state={started:performance.now(),loadedAt:0,lastReason:'boot',runs:0,errors:[]};
  let raf=0;

  function moduleApplies(){
    return [
      ['51-home',window.pcApplyCleanHomeV51],
      ['52-categories',window.pcApplyCategoryExperienceV52],
      ['57-coming',window.pcApplyComingSoonV57],
      ['64-previews',window.pcApplyMissingCategoryPreviewV64],
      ['53-account',window.pcApplyAccountCenterV53],
      ['54-nav',window.pcApplyNavMobileV54],
      ['55-cleanup',window.pcApplyLegacyCleanupV55],
      ['delivery-012',window.pcApplyDeliveryV601],
      ['delivery-013-exp001',window.pcApplyDeliveryExp001V013],
      ['delivery-015-activation',window.pcApplyDeliveryActivationV015],
      ['delivery-016-support',window.pcApplyDeliverySupportV016],
      ['delivery-017-success',window.pcApplyDeliverySuccessV017]
    ].filter(([,fn])=>typeof fn==='function');
  }

  function applyAll(){
    raf=0;state.runs++;
    moduleApplies().forEach(([name,fn])=>{
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
  window.pcV56RequestApply=requestApply;

  function ensureCss(id,href){if(document.getElementById(id))return;const css=document.createElement('link');css.id=id;css.rel='stylesheet';css.href=href;document.head.appendChild(css)}
  function ensureScript(id,src){
    return new Promise((resolve,reject)=>{
      const existing=document.getElementById(id);
      if(existing){
        if(existing.dataset.pcV56Loaded==='1'||existing.readyState==='complete'){resolve(existing);return}
        let settled=false;
        const done=()=>{if(settled)return;settled=true;resolve(existing)};
        existing.addEventListener('load',done,{once:true});
        existing.addEventListener('error',()=>{if(settled)return;settled=true;reject(new Error('No se pudo cargar '+src))},{once:true});
        setTimeout(done,900);return;
      }
      const js=document.createElement('script');js.id=id;js.src=src;js.async=false;
      js.addEventListener('load',()=>{js.dataset.pcV56Loaded='1';resolve(js)},{once:true});
      js.addEventListener('error',()=>reject(new Error('No se pudo cargar '+src)),{once:true});
      document.head.appendChild(js);
    });
  }

  function preloadCss(){
    ensureCss('pc-delivery-v601-css','portal-delivery-v601.css?v='+VERSION);
    ensureCss('pc-delivery-exp001-v013-css','portal-delivery-exp001-v013.css?v='+VERSION);
    ensureCss('pc-delivery-exp001-gate-v013-css','portal-delivery-exp001-gate-v013.css?v='+VERSION);
    ensureCss('pc-delivery-activation-v015-css','portal-delivery-activation-v015.css?v='+VERSION);
    ensureCss('pc-delivery-support-v016-css','portal-delivery-support-v016.css?v='+VERSION);
    ensureCss('pc-delivery-success-v017-css','portal-delivery-success-v017.css?v='+VERSION);
    ensureCss('pc-preview-premium-v60-css','portal-preview-premium-v60.css?v='+VERSION);
    ensureCss('pc-preview-premium-v59-css','portal-preview-premium-v59.css?v='+VERSION);
    ensureCss('pc-preview-premium-v58-css','portal-preview-premium-v58.css?v='+VERSION);
    ensureCss('pc-access-gate-v50-css','portal-access-gate-v50.css?v='+VERSION);
    ensureCss('pc-clean-home-v51-css','portal-clean-home-v51.css?v='+VERSION);
    ensureCss('pc-storefront-public-v57-css','portal-storefront-public-v57.css?v='+VERSION);
    ensureCss('pc-category-experience-v52-css','portal-category-experience-v52.css?v='+VERSION);
    ensureCss('pc-coming-soon-hd-fix-v571-css','portal-coming-soon-hd-fix-v571.css?v='+VERSION);
    ensureCss('pc-account-center-v53-css','portal-account-center-v53.css?v='+VERSION);
    ensureCss('pc-nav-mobile-v54-css','portal-nav-mobile-v54.css?v='+VERSION);
    ensureCss('pc-legacy-cleanup-v55-css','portal-legacy-cleanup-v55.css?v='+VERSION);
    ensureCss('pc-visual-qa-v56-css','portal-visual-qa-v56.css?v='+VERSION);
    ensureCss('pc-preview-closure-v61-css','portal-preview-closure-v61.css?v='+VERSION);
  }

  async function boot(){
    preloadCss();
    try{
      await ensureScript('pc-delivery-freeze-v018-js','portal-delivery-freeze-v018.js?v='+VERSION);
      await ensureScript('pc-delivery-context-v601-js','portal-delivery-context-v601.js?v='+VERSION);
      await ensureScript('pc-access-gate-v50-js','portal-access-gate-v50.js?v='+VERSION);
      await ensureScript('pc-delivery-auth-v014-js','portal-delivery-auth-v014.js?v='+VERSION);
      await ensureScript('pc-clean-home-v51-js','portal-clean-home-v51.js?v='+VERSION);
      await ensureScript('pc-activation-fix-v561-js','portal-activation-fix-v561.js?v='+VERSION);
      await ensureScript('pc-delivery-activation-v015-js','portal-delivery-activation-v015.js?v='+VERSION);
      await ensureScript('pc-delivery-success-v017-js','portal-delivery-success-v017.js?v='+VERSION);
      await ensureScript('pc-category-experience-v52-js','portal-category-experience-v52.js?v='+VERSION);
      await ensureScript('pc-coming-soon-v57-js','portal-coming-soon-v57.js?v='+VERSION);
      await ensureScript('pc-account-center-v53-js','portal-account-center-v53.js?v='+VERSION);
      await ensureScript('pc-nav-mobile-v54-js','portal-nav-mobile-v54.js?v='+VERSION);
      await ensureScript('pc-legacy-cleanup-v55-js','portal-legacy-cleanup-v55.js?v='+VERSION);
      await ensureScript('pc-preview-premium-v58-js','portal-preview-premium-v58.js?v='+VERSION);
      await ensureScript('pc-preview-premium-v59-js','portal-preview-premium-v59.js?v='+VERSION);
      await ensureScript('pc-preview-premium-v60-js','portal-preview-premium-v60.js?v='+VERSION);
      await ensureScript('pc-preview-closure-v61-js','portal-preview-closure-v61.js?v='+VERSION);
      await ensureScript('pc-preview-missing-v64-js','portal-preview-missing-v64.js?v='+VERSION);
      await ensureScript('pc-delivery-v601-js','portal-delivery-v601.js?v='+VERSION);
      await ensureScript('pc-delivery-exp001-v013-js','portal-delivery-exp001-v013.js?v='+VERSION);
      await ensureScript('pc-delivery-support-v016-js','portal-delivery-support-v016.js?v='+VERSION);
      state.loadedAt=performance.now();
      document.body.classList.add('pcV56Ready');
      document.body.dataset.pcBootstrap='v56.11-preview64';
      requestApply('boot-complete');
    }catch(e){
      console.error('Portal V5.6 bootstrap',e);
      state.errors.push({name:'bootstrap',message:String(e?.message||e),at:Date.now()});
      document.body.classList.add('pcV56BootError');
    }
  }

  window.pcPortalV56Audit=()=>({
    version:'5.6.11-preview64',
    ready:document.body.classList.contains('pcV56Ready'),
    bootstrap:document.body.dataset.pcBootstrap||'',
    view:document.body.dataset.pcV5View||'',
    applyRuns:state.runs,lastReason:state.lastReason,bootMs:state.loadedAt?Math.round(state.loadedAt-state.started):null,errors:[...state.errors],activationFix:!!window.__pcActivationFixV561,
    deliveryFreeze:window.PC_DELIVERY_FREEZE_V018||null,
    delivery:typeof window.pcDeliveryContext==='function'?window.pcDeliveryContext():window.PC_DELIVERY_CONTEXT||null,
    deliveryAuth:typeof window.pcDeliveryAuthV014Audit==='function'?window.pcDeliveryAuthV014Audit():null,
    deliveryActivation:typeof window.pcDeliveryActivationV015Audit==='function'?window.pcDeliveryActivationV015Audit():null,
    deliverySupport:typeof window.pcDeliverySupportV016Audit==='function'?window.pcDeliverySupportV016Audit():null,
    deliverySuccess:typeof window.pcDeliverySuccessV017Audit==='function'?window.pcDeliverySuccessV017Audit():null,
    preview64:typeof window.pcV64PreviewAudit==='function'?window.pcV64PreviewAudit():null,
    dom:{homes:document.querySelectorAll('.pcV51Home').length,legacyHomes:document.querySelectorAll('.pcV42Home').length,inicio:document.querySelectorAll('#inicio').length,topNav:document.querySelectorAll('.pcV4Nav').length,bottomNav:document.querySelectorAll('.pcV4BottomNav').length,categoryModals:document.querySelectorAll('.pcV52Modal').length,accountSections:document.querySelectorAll('.pcV53Account').length,comingSoon:document.querySelectorAll('.pcComingCard').length,deliveryShells:document.querySelectorAll('.pcDeliveryShell').length,deliveryExp001:document.querySelectorAll('.pcDeliveryExp001V013').length,deliveryCodeGuides:document.querySelectorAll('.pcD15CodeExplain').length,deliverySupportPage:document.querySelectorAll('.pcD16SupportPage').length,deliverySupportGate:document.querySelectorAll('.pcD16SupportGate').length,deliverySuccess:document.querySelectorAll('#pcDeliverySuccessV017').length},
    modules:{gate:!!window.__pcAccessGateV50,home:!!window.__pcCleanHomeV51,categories:!!window.__pcCategoryExperienceV52,coming:!!window.__pcComingSoonV57,preview64:!!window.__pcMissingCategoryPreviewV64,account:!!window.__pcAccountCenterV53,nav:!!window.__pcNavMobileV54,cleanup:!!window.__pcLegacyCleanupV55,deliveryFreeze:!!window.PC_DELIVERY_FREEZE_V018,deliveryContext:!!window.__pcDeliveryContextV601,deliveryAuth:!!window.__pcDeliveryAuthV014,deliveryActivation:!!window.__pcDeliveryActivationV015,deliverySupport:!!window.__pcDeliverySupportV016,deliverySuccess:!!window.__pcDeliverySuccessV017,deliveryShell:!!window.__pcDeliveryShellV601,deliveryExp001:!!window.__pcDeliveryExp001V013}
  });

  boot();
})();