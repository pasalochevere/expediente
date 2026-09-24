(()=>{
  if(window.__pcAccountCenterV53)return;
  window.__pcAccountCenterV53=true;

  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const norm=s=>String(s||'').toUpperCase().trim();
  let loading=false;
  let lastSig='';

  function authClient(){try{return typeof sb!=='undefined'?sb:null}catch{return null}}
  function accessFn(){try{return typeof callAccess==='function'?callAccess:null}catch{return null}}

  function canonicalKey(l){
    const c=String(l?.product_code||'');
    if(c.startsWith('TK-MAT'))return 'TK-MAT';
    return c||String(l?.product_name||'');
  }
  function score(l){
    const active=l?.status==='active'&&l?.expires_at&&new Date(l.expires_at).getTime()>Date.now();
    const pending=!!l?.can_activate;
    return (active?30:pending?20:10)+(l?.expires_at?Math.floor(new Date(l.expires_at).getTime()/1e10):0);
  }
  function cleanLicenses(list){
    const map=new Map();
    (list||[]).filter(l=>String(l?.product_code||'')!=='TOWER-JAM').forEach(l=>{
      const key=canonicalKey(l);
      const prev=map.get(key);
      if(!prev||score(l)>score(prev))map.set(key,l);
    });
    return [...map.values()];
  }
  function state(l){
    const active=l?.status==='active'&&l?.expires_at&&new Date(l.expires_at).getTime()>Date.now();
    if(active)return 'active';
    if(l?.can_activate)return 'pending';
    return 'expired';
  }
  function statusLabel(l){const s=state(l);return s==='active'?'ACTIVO':s==='pending'?'POR ACTIVAR':norm(l?.status)==='REVOKED'?'ANULADO':'VENCIDO'}
  function dateLabel(l){return l?.expires_at?new Date(l.expires_at).toLocaleDateString('es-AR'):'Empieza al activar'}
  function durationLabel(l){const h=Number(l?.duration_hours||8760);return h===8760?'12 meses':h===24?'1 día':h%24===0?`${h/24} días`:`${h} horas`}

  function ensureNav(){
    let buttons=[...document.querySelectorAll('[data-v4-nav="account"]')];
    if(!buttons.length){
      const host=document.querySelector('.pcV4NavLinks');
      if(host){
        const b=document.createElement('button');b.type='button';b.dataset.v4Nav='account';b.textContent='Mi cuenta';host.appendChild(b);buttons=[b];
      }
    }
    buttons.forEach(b=>{b.removeAttribute('aria-hidden');b.hidden=false;b.style.removeProperty('display')});
  }

  function ensureSection(){
    let sec=document.querySelector('.pcV53Account');
    if(sec)return sec;
    sec=document.createElement('section');sec.className='pcV53Account';sec.setAttribute('aria-label','Mi cuenta');
    const hub=document.querySelector('.categoryHub');
    const games=document.getElementById('myGames');
    if(hub)hub.insertAdjacentElement('afterend',sec);else if(games)games.insertAdjacentElement('afterend',sec);else document.querySelector('.wrap')?.appendChild(sec);
    sec.innerHTML='<div class="pcV53Head"><div><small>CUENTA</small><h1>Mi cuenta</h1></div><button class="pcV53Back" type="button">← Inicio</button></div><div class="pcV53Panel"><p>Cargando tu cuenta…</p></div>';
    sec.querySelector('.pcV53Back')?.addEventListener('click',()=>goHome());
    return sec;
  }

  function setNavActive(){
    document.querySelectorAll('[data-v4-nav]').forEach(b=>b.classList.toggle('active',b.dataset.v4Nav==='account'));
  }
  function openAccount(){
    if(!document.body.classList.contains('pcV50PortalReady'))return;
    document.body.dataset.pcV5View='account';
    ensureNav();ensureSection();setNavActive();
    load(true);
    requestAnimationFrame(()=>ensureSection().scrollIntoView({behavior:'smooth',block:'start'}));
  }
  function goHome(){
    if(typeof window.pcV5SetView==='function')window.pcV5SetView('home');
    else document.body.dataset.pcV5View='home';
  }

  async function copyText(text,btn){
    try{await navigator.clipboard.writeText(text);const old=btn.textContent;btn.textContent='COPIADO';setTimeout(()=>btn.textContent=old,1100)}catch{prompt('Copiá tu código:',text)}
  }

  async function activatePending(code,btn,msgEl){
    let fn=null;try{fn=typeof activateOwned==='function'?activateOwned:null}catch{}
    if(!fn){msgEl.textContent='La activación todavía no está disponible.';msgEl.className='pcV53Msg bad';return}
    btn.disabled=true;msgEl.textContent='Activando acceso…';msgEl.className='pcV53Msg';
    try{await fn(code);try{if(typeof loadMyGames==='function')await loadMyGames()}catch{};setTimeout(()=>load(true),250)}catch(e){msgEl.textContent=e?.message||'No se pudo activar.';msgEl.className='pcV53Msg bad';btn.disabled=false}
  }

  async function activateCode(input,btn,msgEl){
    const value=String(input.value||'').trim();
    if(!value){msgEl.textContent='Ingresá el código recibido con tu compra o invitación.';msgEl.className='pcV53Msg bad';return}
    let fn=null;try{fn=typeof activatePurchase==='function'?activatePurchase:null}catch{}
    if(!fn){msgEl.textContent='La activación todavía se está cargando.';msgEl.className='pcV53Msg bad';return}
    const legacy=document.getElementById('purchaseCode');if(legacy)legacy.value=value;
    btn.disabled=true;msgEl.textContent='Activando…';msgEl.className='pcV53Msg';
    try{
      await fn();
      const legacyMsg=document.getElementById('activateMsg');
      const bad=legacyMsg?.classList.contains('bad');
      msgEl.textContent=legacyMsg?.textContent||(bad?'No se pudo activar.':'Acceso procesado.');
      msgEl.className='pcV53Msg '+(bad?'bad':'good');
      if(!bad){input.value='';try{if(typeof loadMyGames==='function')await loadMyGames()}catch{};setTimeout(()=>load(true),300)}
    }catch(e){msgEl.textContent=e?.message||'No se pudo activar.';msgEl.className='pcV53Msg bad'}
    finally{btn.disabled=false}
  }

  async function signOut(btn){
    btn.disabled=true;btn.textContent='CERRANDO…';
    try{const client=authClient();if(client?.auth?.signOut)await client.auth.signOut()}catch{}
    location.replace(location.pathname);
  }

  function bind(sec,licenses){
    sec.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>copyText(b.dataset.copy,b)));
    sec.querySelectorAll('[data-devices]').forEach(b=>b.addEventListener('click',()=>{try{if(typeof openDevices==='function')openDevices(b.dataset.devices,b.dataset.name||'Acceso')}catch{}}));
    sec.querySelectorAll('[data-activate-owned]').forEach(b=>b.addEventListener('click',()=>activatePending(b.dataset.activateOwned,b,sec.querySelector('#pcV53AccessMsg'))));
    const input=sec.querySelector('#pcV53Code'),ab=sec.querySelector('#pcV53ActivateBtn'),msg=sec.querySelector('#pcV53ActivateMsg');
    ab?.addEventListener('click',()=>activateCode(input,ab,msg));input?.addEventListener('keydown',e=>{if(e.key==='Enter')activateCode(input,ab,msg)});
    sec.querySelector('#pcV53Logout')?.addEventListener('click',e=>signOut(e.currentTarget));
    sec.querySelector('.pcV53Back')?.addEventListener('click',goHome);
  }

  function render(sec,email,licenses){
    const active=licenses.filter(l=>state(l)==='active').length;
    const pending=licenses.filter(l=>state(l)==='pending').length;
    const other=licenses.length-active-pending;
    const items=licenses.length?licenses.map(l=>{
      const st=state(l),code=String(l.activation_code||''),name=String(l.product_name||l.product_code||'Experiencia PasaloChevere');
      const actions=[];
      if(code)actions.push(`<button class="pcV53Mini" type="button" data-copy="${esc(code)}">COPIAR CÓDIGO</button>`);
      if(st==='active'&&code)actions.push(`<button class="pcV53Mini" type="button" data-devices="${esc(code)}" data-name="${esc(name)}">DISPOSITIVOS</button>`);
      if(st==='pending'&&l.product_code)actions.push(`<button class="pcV53Mini" type="button" data-activate-owned="${esc(l.product_code)}">ACTIVAR AHORA</button>`);
      return `<article class="pcV53Access"><div><h3>${esc(name)}</h3><div class="pcV53AccessMeta"><span class="pcV53Pill ${st}">${statusLabel(l)}</span><span>${st==='pending'?'Vigencia: '+durationLabel(l):'Hasta: '+dateLabel(l)}</span></div>${code?`<div class="pcV53Code">${esc(code)}</div>`:''}</div><div class="pcV53AccessActions">${actions.join('')}</div></article>`;
    }).join(''):'<div class="pcV53Empty">Todavía no hay accesos asociados a esta cuenta.</div>';

    sec.innerHTML=`
      <div class="pcV53Head"><div><small>CUENTA</small><h1>Mi cuenta</h1></div><button class="pcV53Back" type="button">← Inicio</button></div>
      <div class="pcV53Grid">
        <div>
          <section class="pcV53Panel pcV53Identity">
            <div><h2>Cuenta verificada</h2><p>Este correo identifica tu biblioteca PasaloChevere.</p></div>
            <div class="pcV53Email"><small>CORREO</small><b>${esc(email||'Sesión verificada')}</b></div>
            <div class="pcV53Stats"><div class="pcV53Stat"><b>${active}</b><span>activos</span></div><div class="pcV53Stat"><b>${pending}</b><span>por activar</span></div><div class="pcV53Stat"><b>${licenses.length}</b><span>accesos</span></div></div>
            <div class="pcV53Activate"><h2>Activar un código</h2><p>Usalo sólo cuando tengas una compra o invitación nueva.</p><div class="pcV53ActivateForm"><input id="pcV53Code" class="pcV53Input" autocomplete="off" placeholder="Código de compra o invitación"><button id="pcV53ActivateBtn" class="pcV53Btn primary" type="button">ACTIVAR</button></div><div id="pcV53ActivateMsg" class="pcV53Msg"></div></div>
            <div class="pcV53Session"><span>Para cambiar de usuario o volver a probar el ingreso por correo.</span><button id="pcV53Logout" class="pcV53Btn danger" type="button">CERRAR SESIÓN</button></div>
          </section>
        </div>
        <section class="pcV53Panel"><h2>Accesos y dispositivos</h2><p>Vigencias, códigos personales y gestión de dispositivos en un solo lugar.</p><div id="pcV53AccessMsg" class="pcV53Msg"></div><div class="pcV53AccessList">${items}</div></section>
      </div>`;
    bind(sec,licenses);
  }

  async function load(force=false){
    if(loading)return;
    const sec=ensureSection(),client=authClient(),call=accessFn();
    if(!client?.auth?.getSession||!call)return;
    loading=true;
    try{
      const session=(await client.auth.getSession())?.data?.session;
      const email=String(session?.user?.email||'');
      const data=await call({action:'me'});
      const licenses=cleanLicenses(data?.licenses||[]);
      const sig=email+'|'+licenses.map(l=>[canonicalKey(l),l.status,l.can_activate,l.expires_at,l.activation_code].join(':')).join('|');
      if(force||sig!==lastSig){lastSig=sig;render(sec,email,licenses)}
    }catch(e){sec.innerHTML=`<div class="pcV53Head"><div><small>CUENTA</small><h1>Mi cuenta</h1></div><button class="pcV53Back" type="button">← Inicio</button></div><div class="pcV53Panel"><h2>No pude cargar tu cuenta</h2><p>${esc(e?.message||'Probá nuevamente.')}</p></div>`;sec.querySelector('.pcV53Back')?.addEventListener('click',goHome)}
    finally{loading=false}
  }

  function apply(){
    if(!document.body.classList.contains('pcV50PortalReady'))return;
    ensureNav();ensureSection();
    if(document.body.dataset.pcV5View==='account'){setNavActive();load(false)}
  }

  document.addEventListener('click',e=>{
    const nav=e.target.closest('[data-v4-nav="account"]');if(!nav)return;
    if(!document.body.classList.contains('pcV50PortalReady'))return;
    e.preventDefault();e.stopImmediatePropagation();openAccount();
  },true);

  window.pcOpenAccountV53=openAccount;
  window.pcApplyAccountCenterV53=apply;

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-pc-v5-view']});
  window.addEventListener('pageshow',schedule);
  schedule();setTimeout(schedule,500);setTimeout(schedule,1400);setTimeout(schedule,2600);
})();
