(()=>{
  if(window.__pcHomeDiscoveryV42Bridge)return;
  window.__pcHomeDiscoveryV42Bridge=true;

  const style=document.createElement('style');
  style.id='pc-home-discovery-v42-bridge-style';
  style.textContent='.pcV51Home{scroll-margin-top:82px}';
  document.head.appendChild(style);

  const sync=()=>{
    const clean=document.querySelector('.pcV51Home');
    const legacy=[...document.querySelectorAll('.hero')].find(el=>!el.classList.contains('pcV51Home'));
    if(clean){
      document.querySelectorAll('#inicio').forEach(el=>{if(el!==clean)el.removeAttribute('id')});
      clean.id='inicio';
    }else if(legacy&&!legacy.id){
      legacy.id='inicio';
    }
  };

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;sync()})};
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','id']});
  sync();setTimeout(sync,300);setTimeout(sync,1200);

  const ensureV55=()=>{
    if(!document.getElementById('pc-legacy-cleanup-v55-css')){
      const css=document.createElement('link');
      css.id='pc-legacy-cleanup-v55-css';
      css.rel='stylesheet';
      css.href='portal-legacy-cleanup-v55.css?v=20260924-1';
      document.head.appendChild(css);
    }
    if(!document.getElementById('pc-legacy-cleanup-v55-js')){
      const js=document.createElement('script');
      js.id='pc-legacy-cleanup-v55-js';
      js.src='portal-legacy-cleanup-v55.js?v=20260924-1';
      js.defer=true;
      document.head.appendChild(js);
    }else if(typeof window.pcApplyLegacyCleanupV55==='function'){
      window.pcApplyLegacyCleanupV55();
    }
  };

  const ensureV54=()=>{
    if(!document.getElementById('pc-nav-mobile-v54-css')){
      const css=document.createElement('link');
      css.id='pc-nav-mobile-v54-css';
      css.rel='stylesheet';
      css.href='portal-nav-mobile-v54.css?v=20260924-2';
      document.head.appendChild(css);
    }
    if(!document.getElementById('pc-nav-mobile-v54-js')){
      const js=document.createElement('script');
      js.id='pc-nav-mobile-v54-js';
      js.src='portal-nav-mobile-v54.js?v=20260924-1';
      js.defer=true;
      js.addEventListener('load',ensureV55,{once:true});
      document.head.appendChild(js);
    }else if(typeof window.pcApplyNavMobileV54==='function'){
      window.pcApplyNavMobileV54();
      ensureV55();
    }else ensureV55();
  };

  const ensureV53=()=>{
    if(!document.getElementById('pc-account-center-v53-css')){
      const css=document.createElement('link');
      css.id='pc-account-center-v53-css';
      css.rel='stylesheet';
      css.href='portal-account-center-v53.css?v=20260923-1';
      document.head.appendChild(css);
    }
    if(!document.getElementById('pc-account-center-v53-js')){
      const js=document.createElement('script');
      js.id='pc-account-center-v53-js';
      js.src='portal-account-center-v53.js?v=20260923-1';
      js.defer=true;
      js.addEventListener('load',()=>{ensureV54();ensureV55()},{once:true});
      document.head.appendChild(js);
    }else if(typeof window.pcApplyAccountCenterV53==='function'){
      window.pcApplyAccountCenterV53();
      ensureV54();
      ensureV55();
    }else{
      ensureV54();
      ensureV55();
    }
  };

  const ensureV52=()=>{
    if(!document.getElementById('pc-category-experience-v52-css')){
      const css=document.createElement('link');
      css.id='pc-category-experience-v52-css';
      css.rel='stylesheet';
      css.href='portal-category-experience-v52.css?v=20260923-1';
      document.head.appendChild(css);
    }
    if(!document.getElementById('pc-category-experience-v52-js')){
      const js=document.createElement('script');
      js.id='pc-category-experience-v52-js';
      js.src='portal-category-experience-v52.js?v=20260923-1';
      js.defer=true;
      js.addEventListener('load',()=>{ensureV53();ensureV54();ensureV55()},{once:true});
      document.head.appendChild(js);
    }else if(typeof window.pcApplyCategoryExperienceV52==='function'){
      window.pcApplyCategoryExperienceV52();
      ensureV53();
      ensureV54();
      ensureV55();
    }else{
      ensureV53();
      ensureV54();
      ensureV55();
    }
  };

  const ensureV51=()=>{
    if(!document.getElementById('pc-clean-home-v51-css')){
      const css=document.createElement('link');
      css.id='pc-clean-home-v51-css';
      css.rel='stylesheet';
      css.href='portal-clean-home-v51.css?v=20260923-1';
      document.head.appendChild(css);
    }
    if(!document.getElementById('pc-clean-home-v51-js')){
      const js=document.createElement('script');
      js.id='pc-clean-home-v51-js';
      js.src='portal-clean-home-v51.js?v=20260923-1';
      js.defer=true;
      js.addEventListener('load',()=>{ensureV52();ensureV53();ensureV54();ensureV55()},{once:true});
      document.head.appendChild(js);
    }else if(typeof window.pcApplyCleanHomeV51==='function'){
      window.pcApplyCleanHomeV51();
      ensureV52();
      ensureV53();
      ensureV54();
      ensureV55();
    }else{
      ensureV52();
      ensureV53();
      ensureV54();
      ensureV55();
    }
  };

  /* PORTAL V5.0.2 · ACCESS GATE AUTH CLIENT + CALLBACK FIX */
  if(!document.getElementById('pc-access-gate-v50-js')){
    const gate=document.createElement('script');
    gate.id='pc-access-gate-v50-js';
    gate.src='portal-access-gate-v50.js?v=20260923-4';
    gate.defer=true;
    gate.addEventListener('load',()=>{ensureV51();ensureV53();ensureV54();ensureV55()},{once:true});
    document.head.appendChild(gate);
  }else{
    ensureV51();
    ensureV53();
    ensureV54();
    ensureV55();
  }

  ensureV51();
  ensureV52();
  ensureV53();
  ensureV54();
  ensureV55();
})();
