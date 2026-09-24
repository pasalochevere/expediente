(()=>{
  if(window.__pcLegacyCleanupV55)return;
  window.__pcLegacyCleanupV55=true;

  const LEGACY_ASSETS=[
    'pc-home-discovery-v42-css',
    'pc-home-discovery-v42-js',
    'pc-home-tuning-v421-css',
    'pc-home-tuning-v421-js'
  ];

  function disableLegacyAssets(){
    LEGACY_ASSETS.forEach(id=>{
      const el=document.getElementById(id);
      if(!el)return;
      if(el.dataset.pcV55Retired!=='1')el.dataset.pcV55Retired='1';
      if(el.tagName==='LINK'&&!el.disabled)el.disabled=true;
    });
  }

  function removeLegacyHome(){
    document.querySelectorAll('.pcV42Home').forEach(el=>el.remove());
    document.querySelectorAll('.pcV42Feature,.pcV42DiscoveryBlock').forEach(el=>{
      if(!el.closest('.pcV51Home'))el.remove();
    });
  }

  function normalizeInicio(){
    const clean=document.querySelector('.pcV51Home');
    if(!clean)return;
    document.querySelectorAll('#inicio').forEach(el=>{if(el!==clean)el.removeAttribute('id')});
    if(clean.id!=='inicio')clean.id='inicio';
  }

  function audit(){
    const legacyAssets=LEGACY_ASSETS.filter(id=>!!document.getElementById(id));
    return {
      version:'5.5',
      ready:document.body.classList.contains('pcV55Ready'),
      view:document.body.dataset.pcV5View||'',
      legacyAssets,
      legacyHomeCount:document.querySelectorAll('.pcV42Home').length,
      topNavCount:document.querySelectorAll('.pcV4Nav').length,
      bottomNavCount:document.querySelectorAll('.pcV4BottomNav').length,
      inicioCount:document.querySelectorAll('#inicio').length,
      v5:{
        gate:!!window.__pcAccessGateV50,
        home:!!window.__pcCleanHomeV51,
        categories:!!window.__pcCategoryExperienceV52,
        account:!!window.__pcAccountCenterV53,
        nav:!!window.__pcNavMobileV54
      }
    };
  }

  function apply(){
    if(!document.body.classList.contains('pcV51Ready'))return;
    disableLegacyAssets();
    removeLegacyHome();
    normalizeInicio();
    if(!document.body.classList.contains('pcV55Ready'))document.body.classList.add('pcV55Ready');
    if(document.body.dataset.pcLegacyRuntime!=='v55-clean')document.body.dataset.pcLegacyRuntime='v55-clean';
  }

  window.pcApplyLegacyCleanupV55=apply;
  window.pcPortalV55Audit=audit;

  let queued=false;
  const schedule=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;apply()});
  };

  new MutationObserver(schedule).observe(document.body,{
    childList:true,
    subtree:true,
    attributes:true,
    attributeFilter:['class','id','data-pc-v5-view']
  });
  window.addEventListener('pageshow',schedule);
  schedule();setTimeout(schedule,350);setTimeout(schedule,1000);setTimeout(schedule,2400);
})();
