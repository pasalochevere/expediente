(()=>{
  if(window.__pcDeliverySuccessV017)return;
  window.__pcDeliverySuccessV017=true;

  const ROOT_ID='pcDeliverySuccessV017';
  const STORAGE_KEY='pc_delivery_context_v1';
  const PRODUCT='EXP-001';
  const ROUTE='etsy-exp001';
  let currentLicense=null;
  let entering=false;

  const COPY={
    es:{
      eyebrow:'ACTIVACIÓN COMPLETA',title:'TU EXPEDIENTE ESTÁ LISTO',brand:'EXPEDIENTES',caseTitle:'CASO 001 · LA ÚLTIMA REUNIÓN',
      lead:'Tu compra quedó asociada a tu correo. Desde ahora podés entrar al expediente o volver cuando quieras desde Mis juegos.',
      status:'ESTADO',active:'ACTIVO',validity:'VIGENCIA',devices:'DISPOSITIVOS',expires:'VENCE',personal:'CÓDIGO PERSONAL',
      enter:'ENTRAR AL EXPEDIENTE',library:'VER MI BIBLIOTECA',copy:'COPIAR CÓDIGO',copied:'CÓDIGO COPIADO',
      checking:'Verificando tu licencia…',deviceChecking:'Verificando este dispositivo…',safe:'El acceso continúa protegido por tu licencia y el límite de dispositivos.',
      noRoute:'El acceso seguro todavía se está preparando. Reintentá en unos segundos.',months12:'12 meses',fromActivation:'desde la activación',used:'usados'
    },
    en:{
      eyebrow:'ACTIVATION COMPLETE',title:'YOUR CASE FILE IS READY',brand:'EXPEDIENTES',caseTitle:'CASE 001 · THE LAST MEETING',
      lead:'Your purchase is now linked to your email. You can open the case now or come back later from My games.',
      status:'STATUS',active:'ACTIVE',validity:'VALIDITY',devices:'DEVICES',expires:'EXPIRES',personal:'PERSONAL ACCESS CODE',
      enter:'OPEN THE CASE FILE',library:'VIEW MY LIBRARY',copy:'COPY CODE',copied:'CODE COPIED',
      checking:'Checking your license…',deviceChecking:'Checking this device…',safe:'Access remains protected by your license and device limit.',
      noRoute:'Secure access is still loading. Try again in a few seconds.',months12:'12 months',fromActivation:'from activation',used:'used'
    }
  };

  function ctx(){return typeof window.pcDeliveryContext==='function'?window.pcDeliveryContext():window.PC_DELIVERY_CONTEXT||null}
  function active(){const c=ctx();return !!c?.deliveryMode&&c.route===ROUTE&&c.product===PRODUCT}
  function lang(){return ctx()?.lang==='en'?'en':'es'}
  function t(){return COPY[lang()]}
  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]))}
  function dateLabel(v){if(!v)return '—';try{return new Intl.DateTimeFormat(lang()==='en'?'en-US':'es-AR',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(v))}catch{return '—'}}
  function validityLabel(lic){const h=Number(lic?.duration_hours||0);if(h===8760)return t().months12;if(h>0&&h%24===0)return Math.round(h/24)+' '+(lang()==='en'?'days':'días');if(h>0)return h+' h';return '—'}
  function deviceLabel(lic){const limit=Number(lic?.device_limit||0),used=Number(lic?.devices_used||0);if(!limit)return '—';return used+' / '+limit+' '+t().used}

  function root(){return document.getElementById(ROOT_ID)}
  function setStatus(text,type=''){const el=root()?.querySelector('[data-pcd17-status]');if(!el)return;el.textContent=text||'';el.dataset.type=type||''}

  function markup(lic={}){
    const c=t();
    const code=esc(lic.activation_code||'—');
    return `<div class="pcD17Backdrop"></div><main class="pcD17Page" role="dialog" aria-modal="true" aria-labelledby="pcD17Title">
      <header class="pcD17Top"><div class="pcD17Brand">PASALOCHEVERE <span>· ${c.brand}</span></div><div class="pcD17Badge">ETSY · EXP-001</div></header>
      <section class="pcD17Card">
        <div class="pcD17Check" aria-hidden="true">✓</div>
        <div class="pcD17Eyebrow">${c.eyebrow}</div>
        <h1 id="pcD17Title">${c.title}</h1>
        <h2>${c.caseTitle}</h2>
        <p class="pcD17Lead">${c.lead}</p>
        <div class="pcD17Stats">
          <article><span>${c.status}</span><b class="good">${c.active}</b></article>
          <article><span>${c.validity}</span><b>${esc(validityLabel(lic))}</b><small>${c.fromActivation}</small></article>
          <article><span>${c.devices}</span><b>${esc(deviceLabel(lic))}</b></article>
          <article><span>${c.expires}</span><b>${esc(dateLabel(lic.expires_at))}</b></article>
        </div>
        <div class="pcD17Code"><div><span>${c.personal}</span><code>${code}</code></div><button type="button" data-pcd17-copy ${lic.activation_code?'':'disabled'}>${c.copy}</button></div>
        <div class="pcD17Actions"><button type="button" class="pcD17Primary" data-pcd17-enter>${c.enter}</button><button type="button" class="pcD17Secondary" data-pcd17-library>${c.library}</button></div>
        <div class="pcD17Status" data-pcd17-status>${c.checking}</div>
        <div class="pcD17Safe">${c.safe}</div>
      </section>
    </main>`;
  }

  function ensureRoot(lic){
    let el=root();
    if(!el){el=document.createElement('div');el.id=ROOT_ID;el.className='pcD17Root';document.body.appendChild(el)}
    el.innerHTML=markup(lic||{});
    el.querySelector('[data-pcd17-enter]')?.addEventListener('click',enterCase);
    el.querySelector('[data-pcd17-library]')?.addEventListener('click',openLibrary);
    el.querySelector('[data-pcd17-copy]')?.addEventListener('click',copyCode);
    return el;
  }

  function suppressDelivery(){
    window.__pcDeliveryHandoffComplete=true;
    try{window.pcDeliveryHide?.()}catch{}
    const gate=document.getElementById('pcAccessGateV50');if(gate)gate.classList.add('hidden');
    document.body.classList.remove('pcV50GateOpen','pcDeliveryModeActive');
    document.documentElement.classList.remove('pcDeliveryModeActive');
    document.body.classList.add('pcD17Open');
  }

  async function waitGlobal(name,max=45){for(let i=0;i<max;i++){if(typeof window[name]==='function')return window[name];await new Promise(r=>setTimeout(r,80))}return null}

  async function refreshLicense(seed={}){
    let license={...seed,product_code:seed.product_code||PRODUCT};
    const call=await waitGlobal('callAccess',25);
    if(!call)return license;
    try{
      const d=await call({action:'me'});
      const list=(d?.licenses||[]).filter(x=>String(x.product_code||'').toUpperCase()===PRODUCT);
      const match=list.find(x=>seed.activation_code&&x.activation_code===seed.activation_code)||list.find(x=>x.status==='active')||list[0];
      if(match)license={...license,...match};
    }catch(e){console.warn('DELIVERY01.7 refresh license',e)}
    return license;
  }

  async function show(seed={}){
    if(!active())return false;
    suppressDelivery();
    currentLicense={...seed,product_code:seed.product_code||PRODUCT};
    ensureRoot(currentLicense);
    setStatus(t().checking);
    currentLicense=await refreshLicense(currentLicense);
    ensureRoot(currentLicense);
    setStatus('');
    try{if(typeof window.loadMyGames==='function')await window.loadMyGames()}catch{}
    return true;
  }

  function cleanDeliveryContext(){
    try{sessionStorage.removeItem(STORAGE_KEY)}catch{}
    try{
      const u=new URL(location.href);
      ['channel','product','lang','activate','activar','delivery_return'].forEach(k=>u.searchParams.delete(k));
      history.replaceState({},document.title,u.pathname+(u.search||'')+(u.hash||''));
    }catch{}
  }

  function hide(){root()?.remove();document.body.classList.remove('pcD17Open')}

  async function copyCode(e){
    const code=currentLicense?.activation_code;if(!code)return;
    try{await navigator.clipboard.writeText(code);const b=e?.currentTarget;if(b){const old=b.textContent;b.textContent=t().copied;setTimeout(()=>{if(b.isConnected)b.textContent=old},1200)}}catch{}
  }

  async function enterCase(){
    if(entering)return;
    entering=true;
    const btn=root()?.querySelector('[data-pcd17-enter]');if(btn)btn.disabled=true;
    setStatus(t().deviceChecking);
    try{
      currentLicense=await refreshLicense(currentLicense||{});
      if(!currentLicense?.activation_code)throw new Error(t().noRoute);
      const call=await waitGlobal('callAccess');
      const hrefFn=await waitGlobal('gameHref');
      const deviceFn=await waitGlobal('deviceId');
      const labelFn=await waitGlobal('deviceLabel');
      if(!call||!hrefFn||!deviceFn||!labelFn)throw new Error(t().noRoute);
      const href=hrefFn(currentLicense);
      if(!href||href==='#')throw new Error(t().noRoute);
      await call({action:'register_device',activation_code:currentLicense.activation_code,device_id:deviceFn(),device_label:labelFn()});
      location.href=href;
    }catch(e){setStatus(String(e?.message||e||t().noRoute),'bad');entering=false;if(btn)btn.disabled=false}
  }

  async function openLibrary(){
    window.__pcDeliveryHandoffComplete=true;
    cleanDeliveryContext();
    hide();
    try{window.pcDeliveryHide?.()}catch{}
    try{if(typeof window.loadMyGames==='function')await window.loadMyGames()}catch{}
    if(typeof window.pcV5SetView==='function'){window.pcV5SetView('library');window.scrollTo({top:0,behavior:'instant'});return}
    document.body.dataset.pcV5View='library';
    window.scrollTo({top:0,behavior:'instant'});
  }

  function apply(){if(window.__pcDeliveryHandoffComplete&&root())return true;return false}

  window.pcApplyDeliverySuccessV017=apply;
  window.pcDeliverySuccessV017Show=show;
  window.pcDeliverySuccessV017Hide=hide;
  window.pcDeliverySuccessV017Audit=()=>({active:active(),handoff:!!window.__pcDeliveryHandoffComplete,visible:!!root(),license:currentLicense?{product_code:currentLicense.product_code,status:currentLicense.status||'',duration_hours:Number(currentLicense.duration_hours||0),device_limit:Number(currentLicense.device_limit||0),devices_used:Number(currentLicense.devices_used||0),expires_at:currentLicense.expires_at||null,has_activation_code:!!currentLicense.activation_code}:null});

  window.addEventListener('pc:delivery-activation-success',e=>{show(e.detail||{}).catch(err=>console.error('DELIVERY01.7 success',err))});
})();