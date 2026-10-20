/* MP06B · LICENSE GATE
   El banco privado se entrega desde Supabase solo tras validar usuario, licencia y dispositivo.
   Nunca colocar consignas ni claves secretas en este repositorio público. */
(function(){
  'use strict';
  const PORTAL='https://pasalochevere.github.io/expediente/portal-v2/';
  const SUPABASE_URL='https://fzbndgfnqxcacsvlitui.supabase.co';
  const ANON='sb_publishable_bJ91vnQUWHfFqWRO99fFkQ_dh0icDxo';
  const STORE='pc_mp01_access';
  const DEV='pc_device_id';
  const app=document.getElementById('app');
  let loading=false,ready=false,client=null,renewTimer=null;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function accessCode(){
    const qs=new URLSearchParams(location.search);
    const incoming=(qs.get('access')||'').trim().toUpperCase();
    if(incoming){
      try{sessionStorage.setItem(STORE,incoming)}catch{}
      const clean=new URL(location.href);clean.searchParams.delete('access');
      history.replaceState(null,'',clean.pathname+clean.search+clean.hash);
      return incoming;
    }
    try{return (sessionStorage.getItem(STORE)||'').trim().toUpperCase()}catch{return ''}
  }
  function deviceId(){
    let id='';
    try{id=localStorage.getItem(DEV)||''}catch{}
    if(!id){
      id=typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():'mpdev-'+Date.now()+'-'+Math.random().toString(36).slice(2);
      try{localStorage.setItem(DEV,id)}catch{}
    }
    return id;
  }
  function show(title,text,opts={}){
    app.innerHTML=`<section class="mp-auth-screen">
      <div class="mp-auth-brand"><span>MODO</span><strong>PREVIA</strong></div>
      <span class="mp-auth-tag">+18 · TORRE + 2 RULETAS · 126 DESAFÍOS</span>
      <div class="mp-auth-status" role="status">
        <h1>${esc(title)}</h1><p id="mp-auth-detail">${esc(text)}</p>
        <div class="mp-auth-actions">
          <a class="mp-auth-go" href="${PORTAL}">IR AL PORTAL →</a>
          ${opts.retry?'<button type="button" id="mp-auth-retry">REINTENTAR</button>':''}
        </div>
        <small>Activá tu código desde el portal e ingresá en <b>Mis juegos → Jugar</b>.</small>
      </div>
    </section>`;
    if(opts.retry)document.getElementById('mp-auth-retry')?.addEventListener('click',boot);
  }
  const loadScript=url=>new Promise((resolve,reject)=>{
    const el=document.createElement('script');el.src=url;el.async=false;
    el.onload=()=>resolve();el.onerror=()=>reject(new Error('No se pudo cargar el motor de juego.'));
    document.head.appendChild(el);
  });
  async function validate(){
    if(typeof supabase==='undefined')throw new Error('No se pudo conectar con el inicio de sesión. Revisá tu conexión.');
    client ||= supabase.createClient(SUPABASE_URL,ANON,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
    const {data:{session},error}=await client.auth.getSession();
    if(error||!session?.user?.email||session.user.is_anonymous)throw new Error('Necesitás iniciar sesión y verificar tu correo en el Portal.');
    const code=accessCode();
    if(!code)throw new Error('Abrí MODO PREVIA desde Mis juegos, después de activar tu compra.');
    if(!/^[A-Z0-9-]{6,72}$/.test(code))throw new Error('El código de acceso no tiene un formato válido.');
    const device_id=deviceId();
    const device_label=[navigator.platform||'',navigator.userAgent.includes('Mobile')?'Mobile':'Browser'].filter(Boolean).join(' · ').slice(0,150);
    const check=await client.functions.invoke('pasalochevere-access',{body:{
      action:'register_device',activation_code:code,device_id,device_label
    }});
    if(check.error){
      let info=check.error.message||'No se pudo registrar este dispositivo.';
      try{const parsed=await check.error.context?.json();if(parsed?.error)info=parsed.error}catch{}
      throw new Error(info);
    }
    if(!check.data?.ok)throw new Error(check.data?.error||'Licencia no autorizada.');
    if(!['MP-001','TBR-001','JB-BORRACHO'].includes(check.data?.license?.product_code))
      throw new Error('Esta licencia no corresponde a MODO PREVIA.');
    const result=await client.functions.invoke('modo-previa-content',{body:{activation_code:code,device_id}});
    if(result.error){
      let info=result.error.message||'El contenido todavía no está disponible.';
      try{const parsed=await result.error.context?.json();if(parsed?.error)info=parsed.error}catch{}
      throw new Error(info);
    }
    const payload=result.data;
    if(!payload?.ok||!Array.isArray(payload.rows)||payload.rows.length!==42||
      !payload.rows.every(row=>Array.isArray(row)&&row.length===5&&row.slice(0,3).every(x=>typeof x==='string'&&x.length>0)))
      throw new Error(payload?.error||'Los desafíos no se pudieron validar.');
    return payload.rows;
  }
  async function boot(){
    if(loading||ready)return;loading=true;
    show('VERIFICANDO TU LICENCIA…','Conectando con tu cuenta y comprobando los dispositivos.');
    try{
      const rows=await validate();
      window.JB_DATA=rows;
      await loadScript('app.js?v=mp07a');
      await loadScript('manuals.js?v=mp06b2');
      ready=true;
      // Intro independiente: si falla la animación, el juego igual queda disponible.
      try{await loadScript('intro.js?v=mp07a')}catch(introErr){
        console.warn('La intro no pudo cargarse, pero el juego continúa.',introErr);
      }
      // Revalida la licencia durante partidas largas; la sesión/estado se comprueban también al ingresar.
      renewTimer=setInterval(async()=>{
        if(!ready)return;
        try{await validate()}catch{
          ready=false;
          window.JB_DATA=undefined;
          clearInterval(renewTimer);
          show('ACCESO INTERRUMPIDO','La sesión o licencia ya no se pudo validar. Volvé a ingresar desde Mis juegos.',{retry:true});
        }
      },10*60*1000);
    }catch(err){
      window.JB_DATA=undefined;
      show('ACTIVÁ MODO PREVIA',err?.message||'No pudimos validar tu acceso.',{retry:true});
    }finally{loading=false}
  }
  if(!accessCode())show('TU PREVIA EMPIEZA EN EL PORTAL','Iniciá sesión, activá tu código y elegí JUGAR desde Mis juegos.',{retry:true});
  else boot();
})();