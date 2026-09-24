(()=>{
  if(window.__pcAccessGateV50)return;
  window.__pcAccessGateV50=true;

  const CSS_ID='pc-access-gate-v50-css';
  const GATE_ID='pcAccessGateV50';
  let evaluating=false;
  let portalEntered=false;
  let lastResolvedState='';
  let authTimer=null;
  let authSubscribed=false;

  function authClient(){
    try{if(typeof sb!=='undefined'&&sb?.auth)return sb}catch{}
    try{if(window.sb?.auth)return window.sb}catch{}
    return null;
  }

  function ensureCss(){
    if(document.getElementById(CSS_ID))return;
    const link=document.createElement('link');link.id=CSS_ID;link.rel='stylesheet';link.href='portal-access-gate-v50.css?v=20260923-1';document.head.appendChild(link);
  }

  function gateHtml(){return `
    <div class="pcV50Shell">
      <div class="pcV50Brand"><span class="pcV50BrandMark">PASA<br>LO</span><span>PasaloChevere</span></div>
      <section class="pcV50Card">
        <div class="pcV50Step active" data-step="loading">
          <div class="pcV50Loader"><div><div class="pcV50Spinner"></div><div class="pcV50Eyebrow">BIBLIOTECA DIGITAL</div><p class="pcV50Lead" id="pcV50LoadingText">Preparando tu acceso…</p></div></div>
        </div>
        <div class="pcV50Step" data-step="email">
          <div class="pcV50Eyebrow">ACCESO PERSONAL</div>
          <h1>Entrá a tu biblioteca.</h1>
          <p class="pcV50Lead">Validá tu correo para entrar a tus juegos y experiencias PasaloChevere.</p>
          <div class="pcV50Form"><input class="pcV50Input" id="pcV50Email" type="email" autocomplete="email" placeholder="tu@email.com"><button class="pcV50Button" id="pcV50EmailBtn" type="button">ENVIAR ENLACE DE ACCESO</button></div>
          <div class="pcV50Message" id="pcV50EmailMsg">No necesitás crear una contraseña.</div>
          <div class="pcV50Micro">El enlace vuelve a este portal y mantiene tu biblioteca asociada al mismo correo.</div>
        </div>
        <div class="pcV50Step" data-step="code">
          <div class="pcV50Eyebrow">CORREO VALIDADO</div>
          <h2>Activá tu acceso.</h2>
          <p class="pcV50Lead">Ingresá el código recibido con tu compra o invitación. Después entrás directo al portal.</p>
          <div class="pcV50Verified"><i></i><span id="pcV50VerifiedEmail"></span></div>
          <div class="pcV50Form"><input class="pcV50Input" id="pcV50Code" autocomplete="off" placeholder="Código de compra"><button class="pcV50Button" id="pcV50CodeBtn" type="button">ACTIVAR Y ENTRAR</button></div>
          <div class="pcV50Message" id="pcV50CodeMsg">La vigencia empieza solamente cuando activás.</div>
          <div class="pcV50Footer"><button type="button" id="pcV50OtherEmail">Usar otro correo</button></div>
        </div>
      </section>
    </div>`}

  function ensureGate(){
    let gate=document.getElementById(GATE_ID);if(gate)return gate;
    gate=document.createElement('div');gate.id=GATE_ID;gate.className='pcV50Gate';gate.setAttribute('role','dialog');gate.setAttribute('aria-modal','true');gate.setAttribute('aria-label','Acceso a PasaloChevere');gate.innerHTML=gateHtml();document.body.appendChild(gate);
    gate.querySelector('#pcV50EmailBtn').addEventListener('click',sendEmail);
    gate.querySelector('#pcV50Email').addEventListener('keydown',e=>{if(e.key==='Enter')sendEmail()});
    gate.querySelector('#pcV50CodeBtn').addEventListener('click',activateCode);
    gate.querySelector('#pcV50Code').addEventListener('keydown',e=>{if(e.key==='Enter')activateCode()});
    gate.querySelector('#pcV50OtherEmail').addEventListener('click',async()=>{try{await authClient()?.auth?.signOut()}catch{} location.replace(location.pathname)});
    return gate;
  }

  function activeStep(){return ensureGate().querySelector('.pcV50Step.active')?.dataset.step||''}
  function showStep(name){
    if(portalEntered)return;
    const gate=ensureGate();gate.classList.remove('hidden');document.body.classList.add('pcV50GateOpen');document.body.classList.remove('pcV50PortalReady');
    gate.querySelectorAll('.pcV50Step').forEach(x=>x.classList.toggle('active',x.dataset.step===name));
    if(name==='email'||name==='code')setTimeout(()=>gate.querySelector(name==='email'?'#pcV50Email':'#pcV50Code')?.focus(),40);
  }
  function setLoading(text){const el=document.getElementById('pcV50LoadingText');if(el)el.textContent=text||'Preparando tu acceso…'}

  function cleanAuthUrl(){
    try{
      const url=new URL(location.href);let changed=false;
      ['code','token_hash','type','access_token','refresh_token','expires_in','expires_at','provider_token','provider_refresh_token'].forEach(k=>{if(url.searchParams.has(k)){url.searchParams.delete(k);changed=true}});
      if(url.hash&&/(access_token|refresh_token|token_hash|type=|error=|error_description=)/i.test(url.hash)){url.hash='';changed=true}
      if(changed)history.replaceState({},document.title,url.pathname+(url.search?url.search:'')+(url.hash||''));
    }catch{}
  }

  function enterPortal(){
    if(portalEntered)return;
    portalEntered=true;cleanAuthUrl();
    const gate=ensureGate();gate.classList.add('hidden');document.body.classList.remove('pcV50GateOpen');document.body.classList.add('pcV50PortalReady');
    if(typeof window.pcApplyHomeV42==='function')window.pcApplyHomeV42();
    if(typeof window.pcApplyHomeV421==='function')window.pcApplyHomeV421();
    if(typeof window.pcApplyCleanHomeV51==='function')window.pcApplyCleanHomeV51();
    if(typeof window.pcApplyCategoryExperienceV52==='function')window.pcApplyCategoryExperienceV52();
    setTimeout(()=>window.scrollTo({top:0,behavior:'instant'}),0);
  }

  function setMsg(id,text,type=''){const el=document.getElementById(id);if(!el)return;el.textContent=text;el.className='pcV50Message'+(type?' '+type:'')}
  function callbackPresent(){
    try{
      const u=new URL(location.href);
      return u.searchParams.has('code')||u.searchParams.has('token_hash')||/(access_token=|refresh_token=|token_hash=|error=)/i.test(u.hash||'');
    }catch{return false}
  }

  async function waitForClient(max=50){
    for(let i=0;i<max;i++){const c=authClient();if(c)return c;await new Promise(r=>setTimeout(r,80))}
    return null;
  }

  async function consumeAuthCallback(){
    const client=await waitForClient();if(!client)return null;
    try{
      const u=new URL(location.href);
      const code=u.searchParams.get('code');
      const tokenHash=u.searchParams.get('token_hash');
      const type=u.searchParams.get('type')||'magiclink';
      const hash=new URLSearchParams((u.hash||'').replace(/^#/,''));
      const accessToken=hash.get('access_token')||u.searchParams.get('access_token');
      const refreshToken=hash.get('refresh_token')||u.searchParams.get('refresh_token');

      if(code&&client.auth.exchangeCodeForSession){
        setLoading('Validando tu enlace…');
        const {error}=await client.auth.exchangeCodeForSession(code);if(error)throw error;
      }else if(tokenHash&&client.auth.verifyOtp){
        setLoading('Validando tu enlace…');
        const {error}=await client.auth.verifyOtp({token_hash:tokenHash,type});if(error)throw error;
      }else if(accessToken&&refreshToken&&client.auth.setSession){
        setLoading('Validando tu enlace…');
        const {error}=await client.auth.setSession({access_token:accessToken,refresh_token:refreshToken});if(error)throw error;
      }
      return (await client.auth.getSession())?.data?.session||null;
    }catch(e){
      console.warn('PasaloChevere auth callback',e);
      return null;
    }
  }

  async function getSession(){
    const client=await waitForClient();if(!client)return null;
    try{return (await client.auth.getSession())?.data?.session||null}catch{return null}
  }

  async function getLicenses(){
    for(let i=0;i<30&&typeof window.callAccess!=='function';i++)await new Promise(r=>setTimeout(r,80));
    if(typeof window.callAccess!=='function')return null;
    try{const d=await window.callAccess({action:'me'});return (d?.licenses||[]).filter(l=>String(l.product_code||'')!=='TOWER-JAM')}catch(e){console.warn('PasaloChevere licenses',e);return null}
  }

  async function evaluate(force=false){
    if(portalEntered||evaluating)return;
    evaluating=true;
    try{
      ensureCss();ensureGate();showStep('loading');
      let session=null;
      if(callbackPresent())session=await consumeAuthCallback();
      if(!session)session=await getSession();

      const logged=!!session?.user?.email&&!session.user.is_anonymous;
      const email=String(session?.user?.email||'').toLowerCase();
      const stateKey=logged?'user:'+email:'guest';

      if(!logged){
        lastResolvedState='guest';
        showStep('email');
        if(callbackPresent())setMsg('pcV50EmailMsg','El enlace no pudo completar la sesión. Pedí un enlace nuevo y abrilo en este mismo navegador.','bad');
        return;
      }

      cleanAuthUrl();
      const licenses=await getLicenses();
      if(Array.isArray(licenses)&&licenses.length>0){lastResolvedState=stateKey+':licensed';enterPortal();return}

      lastResolvedState=stateKey+':code';
      const mail=document.getElementById('pcV50VerifiedEmail');if(mail)mail.textContent=email;
      showStep('code');
    }finally{evaluating=false}
  }

  function scheduleEvaluate(force=false,delay=120){clearTimeout(authTimer);authTimer=setTimeout(()=>evaluate(force),delay)}

  function subscribeAuth(){
    if(authSubscribed)return;
    const client=authClient();if(!client?.auth?.onAuthStateChange)return;
    authSubscribed=true;
    client.auth.onAuthStateChange((event)=>{
      if(event==='TOKEN_REFRESHED')return;
      if(event==='SIGNED_OUT'){portalEntered=false;lastResolvedState='';scheduleEvaluate(true,80);return}
      if(event==='SIGNED_IN'||event==='INITIAL_SESSION'||event==='USER_UPDATED')scheduleEvaluate(true,120);
    });
  }

  async function sendEmail(){
    const input=document.getElementById('pcV50Email'),btn=document.getElementById('pcV50EmailBtn');
    const value=String(input?.value||'').trim().toLowerCase();if(!value){setMsg('pcV50EmailMsg','Ingresá tu correo.','bad');return}
    if(typeof window.sendMagicLink!=='function'){setMsg('pcV50EmailMsg','El acceso todavía se está cargando. Probá nuevamente en unos segundos.','bad');return}
    const legacy=document.getElementById('email');if(legacy)legacy.value=value;
    btn.disabled=true;setMsg('pcV50EmailMsg','Enviando enlace de acceso…');
    try{
      await window.sendMagicLink();
      const legacyMsg=document.getElementById('authMsg');
      setMsg('pcV50EmailMsg',legacyMsg?.textContent||'Revisá tu correo para continuar.',legacyMsg?.classList.contains('bad')?'bad':'good');
      let left=60;btn.textContent=`REENVIAR EN ${left}s`;
      const timer=setInterval(()=>{left--;if(left<=0){clearInterval(timer);btn.disabled=false;btn.textContent='REENVIAR ENLACE'}else btn.textContent=`REENVIAR EN ${left}s`},1000);
    }catch(e){btn.disabled=false;btn.textContent='ENVIAR ENLACE DE ACCESO';setMsg('pcV50EmailMsg',e?.message||'No se pudo enviar el enlace.','bad')}
  }

  async function activateCode(){
    const input=document.getElementById('pcV50Code'),btn=document.getElementById('pcV50CodeBtn');
    const value=String(input?.value||'').trim();if(!value){setMsg('pcV50CodeMsg','Ingresá el código recibido con tu compra o invitación.','bad');return}
    if(typeof window.activatePurchase!=='function'){setMsg('pcV50CodeMsg','La activación todavía se está cargando. Probá nuevamente en unos segundos.','bad');return}
    const legacy=document.getElementById('purchaseCode');if(legacy)legacy.value=value;
    btn.disabled=true;setMsg('pcV50CodeMsg','Activando tu acceso…');
    try{
      await window.activatePurchase();
      const legacyMsg=document.getElementById('activateMsg');
      if(legacyMsg?.classList.contains('bad')){setMsg('pcV50CodeMsg',legacyMsg.textContent||'No se pudo activar el código.','bad');btn.disabled=false;return}
      let licenses=[];
      for(let i=0;i<12;i++){await new Promise(r=>setTimeout(r,i?350:120));const got=await getLicenses();if(Array.isArray(got)){licenses=got;if(got.length)break}}
      if(licenses.length){lastResolvedState='';setMsg('pcV50CodeMsg','✅ Acceso activado. Entrando a tu biblioteca…','good');input.value='';setTimeout(enterPortal,350)}
      else{setMsg('pcV50CodeMsg',legacyMsg?.textContent||'El código fue procesado. Si no aparece tu acceso, probá nuevamente.','bad');btn.disabled=false}
    }catch(e){setMsg('pcV50CodeMsg',e?.message||'No se pudo activar el acceso.','bad');btn.disabled=false}
  }

  ensureCss();ensureGate();document.body.classList.add('pcV50GateOpen');showStep('loading');
  (async()=>{await waitForClient();subscribeAuth();await evaluate(true)})();
})();
