(()=>{
  if(window.__pcNavMobileV54)return;
  window.__pcNavMobileV54=true;

  const META={
    home:{long:'Inicio',short:'Inicio',title:'Inicio'},
    library:{long:'Mi biblioteca',short:'Biblioteca',title:'Mi biblioteca'},
    explore:{long:'Explorar',short:'Explorar',title:'Explorar'},
    account:{long:'Mi cuenta',short:'Cuenta',title:'Mi cuenta'}
  };
  const PATHS={
    home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
    library:'<path d="M4 4h6v16H4z"/><path d="M10 6h5v14h-5"/><path d="m15 7 4-1 2 13-6 1"/>',
    explore:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z"/>',
    account:'<circle cx="12" cy="8" r="3.2"/><path d="M5.5 21c.7-4 3-6 6.5-6s5.8 2 6.5 6"/>'
  };

  function view(){
    const v=document.body?.dataset?.pcV5View||'home';
    return META[v]?v:'home';
  }

  function icon(key){return `<span class="pcV54Icon" aria-hidden="true"><svg viewBox="0 0 24 24">${PATHS[key]||PATHS.home}</svg></span>`}

  function decorate(btn){
    const key=btn?.dataset?.v4Nav;if(!META[key])return;
    btn.removeAttribute('aria-hidden');btn.hidden=false;btn.style.removeProperty('display');
    btn.setAttribute('aria-label',META[key].title);
    if(btn.dataset.pcV54Decorated==='1')return;
    btn.dataset.pcV54Decorated='1';
    btn.innerHTML=`${icon(key)}<span class="pcV54LabelLong">${META[key].long}</span><span class="pcV54LabelShort">${META[key].short}</span>`;
  }

  function ensureAccountButtons(){
    const topHost=document.querySelector('.pcV4NavLinks');
    if(topHost&&!topHost.querySelector('[data-v4-nav="account"]')){
      const b=document.createElement('button');b.type='button';b.dataset.v4Nav='account';topHost.appendChild(b);
    }
    const bottom=document.querySelector('.pcV4BottomNav');
    if(bottom&&!bottom.querySelector('[data-v4-nav="account"]')){
      const b=document.createElement('button');b.type='button';b.dataset.v4Nav='account';bottom.appendChild(b);
    }
  }

  function normalizeBrand(){
    const brand=document.querySelector('.pcV4NavBrand');if(!brand)return;
    if(brand.dataset.pcV54Brand==='1')return;
    brand.dataset.pcV54Brand='1';
    brand.innerHTML='<span class="pcV4NavBrandDot"></span><span>PasaloChevere · Portal</span>';
  }

  function syncActive(){
    if(!document.body.classList.contains('pcV50PortalReady'))return;
    ensureAccountButtons();normalizeBrand();
    const current=view();
    document.querySelectorAll('[data-v4-nav]').forEach(btn=>{
      decorate(btn);
      const active=btn.dataset.v4Nav===current;
      if(btn.classList.contains('active')!==active)btn.classList.toggle('active',active);
      if(active)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current');
    });
  }

  function apply(){
    syncActive();
    document.body.classList.toggle('pcV54NavReady',document.body.classList.contains('pcV50PortalReady'));
  }

  let raf=0;
  function schedule(){
    if(raf)return;
    raf=requestAnimationFrame(()=>{raf=0;apply()});
  }

  document.addEventListener('click',e=>{
    const nav=e.target.closest('[data-v4-nav]');
    if(!nav||!document.body.classList.contains('pcV50PortalReady'))return;
    setTimeout(syncActive,0);setTimeout(syncActive,120);
  },true);

  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('pageshow',schedule);

  new MutationObserver(schedule).observe(document.body,{
    childList:true,subtree:true,attributes:true,
    attributeFilter:['data-pc-v5-view','aria-hidden','class']
  });

  window.pcApplyNavMobileV54=apply;
  schedule();setTimeout(schedule,250);setTimeout(schedule,800);setTimeout(schedule,1700);setTimeout(schedule,3000);
})();
