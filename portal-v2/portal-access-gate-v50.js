(()=>{
  if(window.__pcAccessGateV50)return;
  window.__pcAccessGateV50=true;

  const CSS_ID='pc-access-gate-v50-css';
  const GATE_ID='pcAccessGateV50';
  const PENDING_KEY='pc_v57_pending_action';
  let evaluating=false;
  let portalEntered=false;
  let lastResolvedState='';
  let authTimer=null;
  let authSubscribed=false;
  let knownEmail='';
  let nativeBuyNow=null;
  let nativeScrollToActivation=null;

  function authClient(){
    try{if(typeof sb!=='undefined'&&sb?.auth)return sb}catch{}
    try{if(window.sb?.auth)return window.sb}catch{}
    return null;
  }

  function ensureCss(){
    if(document.getElementById(CSS_ID))return;
    const link=document.createElement('link');link.id=CSS_ID;link.rel='stylesheet';link.href='portal-access-gate-v50.css?v=20260928-1';document.head.appendChild(link);
  }

  function gateHtml(){return `
    <div class="pcV50Shell">
      <div class="pcV50Brand"><span class="pcV50BrandMark">PASA<br>LO</span><span>PasaloChevere</span></div>
      <section class="pcV50Card">
        <div class="pcV50Step active" data-step="loading">
          <div class="pcV50Loader"><div><div class="pcV50Spinner"></div><div class="pcV50Eyebrow">PASALOCHEVERE</div><p class="pcV50Lead" id="pcV50LoadingText">Preparando tu acceso…</p><button class="pcV50Button" id="pcV50RetryBtn" type="button" style="display:none;margin-top:14px">REINTENTAR</button></div></div>
        </div>
        <div class="pcV50Step" data-step="email">
          <div class="pcV50Eyebrow" id="pcV50EmailEyebrow">MIS JUEGOS</div>
          <h1 id="pcV50EmailTitle">Entrá a tu biblioteca.</h1>
          <p class="pcV50Lead" id="pcV50EmailLead">Validá tu correo para entrar a tus juegos y experiencias PasaloChevere.</p>
          <div class="pcV50Form"><input class="pcV50Input" id="pcV50Email" type="email" autocomplete="email" placeholder="tu@email.com"><button class="pcV50Button" id="pcV50EmailBtn" type="button">ENVIAR ENLACE DE ACCESO</button></div>
          <div class="pcV50Message" id="pcV50EmailMsg">No necesitás crear una contraseña.</div>
          <div class="pcV50Micro" id="pcV50EmailMicro">Tu biblioteca queda asociada a este correo.</div>
          <div class="pcV50Footer"><button type="button" id="pcV50ContinueBrowsing">Seguir explorando</button></div>
        </div>
        <div class="pcV50Step" data-step="code">
          <div class="pcV50Eyebrow">CORREO VALIDADO</div>
          <h2>Activá tu compra.</h2>
          <p class="pcV50Lead">Ingresá el código recibido con tu compra, producto físico o invitación.</p>
          <div class="pcV50Verified"><i></i><span id="pcV50VerifiedEmail"></span></div>
          <div class="pcV50Form"><input class="pcV50Input" id="pcV50Code" autocomplete="off" placeholder="Código de compra"><button class="pcV50Button" id="pcV50CodeBtn" type="button">ACTIVAR Y ENTRAR</button></div>
          <div class="pcV50Message" id="pcV50CodeMsg">La vigencia empieza solamente cuando activás.</div>
          <div class="pcV50Footer"><button type="button" id="pcV50OtherEmail">Usar otro correo</button><button type="button" id="pcV50CancelCode">Seguir explorando</button></div>
        </div>
      </section>
    </div>`}

  function ensureGate(){
    let gate=document.getElementById(GATE_ID);if(gate)return gate;
    gate=document.createElement('div');gate.id=GATE_ID;gate.className='pcV50Gate hidden';gate.setAttribute('role','dialog');gate.setAttribute('aria-modal','true');gate.setAttribute('aria-label','Acceso a PasaloChevere');gate.innerHTML=gateHtml();document.body.appendChild(gate);
    gate.querySelector('#pcV50EmailBtn').addEventListener('click',sendEmail);
    gate.querySelector('#pcV50Email').addEventListener('keydown',e=>{if(e.key==='Enter')sendEmail()});
    gate.querySelector('#pcV50CodeBtn').addEventListener('click',activateCode);
    gate.querySelector('#pcV50Code').addEventListener('keydown',e=>{if(e.key==='Enter')activateCode()});
    gate.querySelector('#pcV50RetryBtn').addEventListener('click',()=>{setRetryVisible(false);scheduleEvaluate(true,40)});
    gate.querySelector('#pcV50OtherEmail').addEventListener('click',async()=>{clearPending();try{await authClient()?.auth?.signOut()}catch{};knownEmail='';hideGate();setTimeout(()=>requireEmail('activate'),80)});
    gate.querySelector('#pcV50ContinueBrowsing').addEventListener('click',()=>{clearPending();hideGate()});
    gate.querySelector('#pcV50CancelCode').addEventListener('click',()=>{clearPending();hideGate()});
    return gate;
  }

  function hideGate(){
    const gate=ensureGate();gate.classList.add('hidden');document.body.classList.remove('pcV50GateOpen');
    if(portalEntered)document.body.classList.add('pcV50PortalReady');
  }

  function showStep(name){
    const gate=ensureGate();gate.classList.remove('hidden');document.body.classList.add('pcV50GateOpen');
    gate.querySelectorAll('.pcV50Step').forEach(x=>x.classList.toggle('active',x.dataset.step===name));
    if(name==='email'||name==='code')setTimeout(()=>gate.querySelector(name==='email'?'#pcV50Email':'#pcV50Code')?.focus(),40);
  }

  function setLoading(text){const el=document.getElementById('pcV50LoadingText');if(el)el.textContent=text||'Preparando tu acceso…'}
  function setRetryVisible(show){const b=document.getElementById('pcV50RetryBtn');if(b)b.style.display=show?'inline-flex':'none'}
  function setMsg(id,text,type=''){const el=document.getElementById(id);if(!el)return;el.textContent=text;el.className='pcV50Message'+(type?' '+type:'')}

  function writePending(action){
    try{localStorage.setItem(PENDING_KEY,JSON.stringify({...action,at:Date.now()}))}catch{}
  }
  function readPending(){
    try{
      const value=JSON.parse(localStorage.getItem(PENDING_KEY)||'null');
      if(!value||!value.type)return null;
      if(value.at&&Date.now()-Number(value.at)>1000*60*60*24){clearPending();return null}
      return value;
    }catch{return null}
  }
  function clearPending(){try{localStorage.removeItem(PENDING_KEY)}catch{}}

  function setEmailContext(context='library',productCode=''){
    const eyebrow=document.getElementById('pcV50EmailEyebrow');
    const title=document.getElementById('pcV50EmailTitle');
    const lead=document.getElementById('pcV50EmailLead');
    const btn=document.getElementById('pcV50EmailBtn');
    const micro=document.getElementById('pcV50EmailMicro');
    if(context==='purchase'){
      if(eyebrow)eyebrow.textContent='COMPRA SEGURA';
      if(title)title.textContent='¿Dónde querés recibir tu acceso?';
      if(lead)lead.textContent='Validá tu correo para continuar a Mercado Pago. La compra queda asociada automáticamente a tu biblioteca.';
      if(btn)btn.textContent='ENVIAR ENLACE Y CONTINUAR';
      if(micro)micro.textContent=productCode?'Producto seleccionado: '+productCode+'. No necesitás crear una contraseña.':'No necesitás crear una contraseña.';
    }else if(context==='activate'){
      if(eyebrow)eyebrow.textContent='ACTIVAR COMPRA';
      if(title)title.textContent='Primero validemos tu correo.';
      if(lead)lead.textContent='Después vas a ingresar el código que recibiste con tu compra, producto físico o invitación.';
      if(btn)btn.textContent='ENVIAR ENLACE Y CONTINUAR';
      if(micro)micro.textContent='El acceso quedará asociado a este correo.';
    }else if(context==='account'){
      if(eyebrow)eyebrow.textContent='MI CUENTA';
      if(title)title.textContent='Entrá a tu cuenta.';
      if(lead)lead.textContent='Validá tu correo para gestionar accesos, códigos y dispositivos.';
      if(btn)btn.textContent='ENVIAR ENLACE DE ACCESO';
      if(micro)micro.textContent='No necesitás crear una contraseña.';
    }else{
      if(eyebrow)eyebrow.textContent='MIS JUEGOS';
      if(title)title.textContent='Entrá a tu biblioteca.';
      if(lead)lead.textContent='Validá tu correo para ver tus juegos y continuar donde los dejaste.';
      if(btn)btn.textContent='ENVIAR ENLACE DE ACCESO';
      if(micro)micro.textContent='Tu biblioteca queda asociada a este correo.';
    }
    setMsg('pcV50EmailMsg','No necesitás crear una contraseña.');
  }

  function cleanAuthUrl(){
    try{
      const url=new URL(location.href);let changed=false;
      ['code','token_hash','type','access_token','refresh_token','expires_in','expires_at','provider_token','provider_refresh_token'].forEach(k=>{if(url.searchParams.has(k)){url.searchParams.delete(k);changed=true}});
      if(url.hash&&/(access_token|refresh_token|token_hash|type=|error=|error_description=)/i.test(url.hash)){url.hash='';changed=true}
      if(changed)history.replaceState({},document.title,url.pathname+(url.search?url.search:'')+(url.hash||''));
    }catch{}
  }

  function enterPortal(view=''){
    const first=!portalEntered;
    portalEntered=true;setRetryVisible(false);cleanAuthUrl();hideGate();
    document.body.classList.remove('pcV50GateOpen');document.body.classList.add('pcV50PortalReady');
    if(view)document.body.dataset.pcV5View=view;
    if(first){
      if(typeof window.pcApplyHomeV42==='function')window.pcApplyHomeV42();
      if(typeof window.pcApplyHomeV421==='function')window.pcApplyHomeV421();
      if(typeof window.pcApplyCleanHomeV51==='function')window.pcApplyCleanHomeV51();
      if(typeof window.pcApplyCategoryExperienceV52==='function')window.pcApplyCategoryExperienceV52();
      setTimeout(()=>window.scrollTo({top:0,behavior:'instant'}),0);
    }else if(typeof window.pcV56RequestApply==='function')window.pcV56RequestApply('public-enter');
  }

  function callbackPresent(){
    try{
      const u=new URL(location.href);
      return u.searchParams.has('code')||u.searchParams.has('token_hash')||/(access_token=|refresh_token=|token_hash=|error=)/i.test(u.hash||'');
    }catch{return false}
  }

  function activationRequested(){
    try{const u=new URL(location.href);return ['1','true','si','sí'].includes(String(u.searchParams.get('activar')||u.searchParams.get('activate')||'').toLowerCase())}catch{return false}
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
      if(code&&client.auth.exchangeCodeForSession){setLoading('Validando tu enlace…');const {error}=await client.auth.exchangeCodeForSession(code);if(error)throw error}
      else if(tokenHash&&client.auth.verifyOtp){setLoading('Validando tu enlace…');const {error}=await client.auth.verifyOtp({token_hash:tokenHash,type});if(error)throw error}
      else if(accessToken&&refreshToken&&client.auth.setSession){setLoading('Validando tu enlace…');const {error}=await client.auth.setSession({access_token:accessToken,refresh_token:refreshToken});if(error)throw error}
      return (await client.auth.getSession())?.data?.session||null;
    }catch(e){console.warn('PasaloChevere auth callback',e);return null}
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

  function setViewWhenReady(view){
    let tries=0;
    const t=setInterval(()=>{
      tries++;
      if(typeof window.pcV5SetView==='function'){clearInterval(t);window.pcV5SetView(view);return}
      if(tries>40){clearInterval(t);document.body.dataset.pcV5View=view}
    },100);
  }

  function openAccountWhenReady(){
    let tries=0;
    const t=setInterval(()=>{
      tries++;
      if(typeof window.pcOpenAccountV53==='function'){clearInterval(t);window.pcOpenAccountV53();return}
      if(tries>40){clearInterval(t);setViewWhenReady('home')}
    },100);
  }

  async function continuePending(){
    const pending=readPending();
    if(!pending){
      if(activationRequested()){setTimeout(()=>openCodeGate(),180);return}
      try{if(new URL(location.href).searchParams.get('payment')==='success')setTimeout(()=>setViewWhenReady('library'),500)}catch{}
      return;
    }
    if(pending.type==='activate'){clearPending();setTimeout(()=>openCodeGate(),180);return}
    if(pending.type==='library'){clearPending();setTimeout(()=>setViewWhenReady('library'),260);return}
    if(pending.type==='account'){clearPending();setTimeout(()=>openAccountWhenReady(),260);return}
    if(pending.type==='purchase'&&pending.productCode){
      clearPending();
      let tries=0;
      const t=setInterval(()=>{
        tries++;
        const fn=nativeBuyNow||window.__pcNativeBuyNowV50;
        if(typeof fn==='function'){clearInterval(t);fn(pending.productCode);return}
        if(tries>30)clearInterval(t);
      },120);
    }
  }

  async function evaluate(force=false){
    if(evaluating)return;
    evaluating=true;
    try{
      ensureCss();ensureGate();setRetryVisible(false);
      const hadCallback=callbackPresent();
      if(hadCallback){showStep('loading');setLoading('Validando tu enlace…')}
      let session=null;
      if(hadCallback)session=await consumeAuthCallback();
      if(!session)session=await getSession();
      const logged=!!session?.user?.email&&!session.user.is_anonymous;
      knownEmail=logged?String(session.user.email).toLowerCase():'';
      lastResolvedState=logged?'user:'+knownEmail:'guest';
      enterPortal();
      if(hadCallback&&!logged){
        setEmailContext(readPending()?.type||'library',readPending()?.productCode||'');
        showStep('email');
        setMsg('pcV50EmailMsg','El enlace no pudo completar la sesión. Pedí uno nuevo y abrilo en este mismo navegador.','bad');
        return;
      }
      if(logged)continuePending();
      else if(activationRequested())setTimeout(()=>requireEmail('activate'),180);
    }finally{evaluating=false}
  }

  function scheduleEvaluate(force=false,delay=120){clearTimeout(authTimer);authTimer=setTimeout(()=>evaluate(force),delay)}

  function subscribeAuth(){
    if(authSubscribed)return;
    const client=authClient();if(!client?.auth?.onAuthStateChange)return;
    authSubscribed=true;
    client.auth.onAuthStateChange((event,session)=>{
      if(event==='TOKEN_REFRESHED')return;
      if(event==='SIGNED_OUT'){knownEmail='';lastResolvedState='guest';clearPending();hideGate();setViewWhenReady('home');return}
      if(event==='SIGNED_IN'||event==='INITIAL_SESSION'||event==='USER_UPDATED'){
        knownEmail=String(session?.user?.email||'').toLowerCase();
        if(knownEmail){enterPortal();continuePending()}
      }
    });
  }

  async function requireEmail(context='library',productCode=''){
    const session=await getSession();
    const logged=!!session?.user?.email&&!session.user.is_anonymous;
    knownEmail=logged?String(session.user.email).toLowerCase():knownEmail;
    if(logged){
      if(context==='activate'){openCodeGate();return true}
      if(context==='library'){setViewWhenReady('library');return true}
      if(context==='account'){openAccountWhenReady();return true}
      if(context==='purchase'&&productCode){const fn=nativeBuyNow||window.__pcNativeBuyNowV50;if(typeof fn==='function')return fn(productCode);return true}
      return true;
    }
    writePending({type:context,productCode:productCode||''});
    setEmailContext(context,productCode);
    showStep('email');
    return false;
  }

  function openCodeGate(){
    const mail=document.getElementById('pcV50VerifiedEmail');if(mail)mail.textContent=knownEmail||'Correo verificado';
    showStep('code');
  }

  async function sendEmail(){
    const input=document.getElementById('pcV50Email'),btn=document.getElementById('pcV50EmailBtn');
    const value=String(input?.value||'').trim().toLowerCase();if(!value){setMsg('pcV50EmailMsg','Ingresá tu correo.','bad');return}
    if(typeof window.sendMagicLink!=='function'){setMsg('pcV50EmailMsg','El acceso todavía se está cargando. Probá nuevamente en unos segundos.','bad');return}
    const legacy=document.getElementById('email');if(legacy)legacy.value=value;
    btn.disabled=true;setMsg('pcV50EmailMsg','Enviando enlace…');
    try{
      await window.sendMagicLink();
      const legacyMsg=document.getElementById('authMsg');
      const failed=legacyMsg?.classList.contains('bad');
      setMsg('pcV50EmailMsg',legacyMsg?.textContent||'Revisá tu correo para continuar.',failed?'bad':'good');
      if(failed){btn.disabled=false;return}
      let left=60;const base=btn.textContent.includes('CONTINUAR')?'ENVIAR ENLACE Y CONTINUAR':'ENVIAR ENLACE DE ACCESO';btn.textContent=`REENVIAR EN ${left}s`;
      const timer=setInterval(()=>{left--;if(left<=0){clearInterval(timer);btn.disabled=false;btn.textContent=base}else btn.textContent=`REENVIAR EN ${left}s`},1000);
    }catch(e){btn.disabled=false;setMsg('pcV50EmailMsg',e?.message||'No se pudo enviar el enlace.','bad')}
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
      if(licenses.length){clearPending();setMsg('pcV50CodeMsg','✅ Acceso activado. Abriendo Mis juegos…','good');input.value='';setTimeout(()=>{hideGate();setViewWhenReady('library')},450)}
      else{setMsg('pcV50CodeMsg',legacyMsg?.textContent||'El código fue procesado. Si no aparece tu acceso, probá nuevamente.','bad');btn.disabled=false}
    }catch(e){setMsg('pcV50CodeMsg',e?.message||'No se pudo activar el acceso.','bad');btn.disabled=false}
  }

  function wrapLegacyActions(){
    if(!nativeBuyNow&&typeof window.buyNow==='function'){
      nativeBuyNow=window.buyNow;window.__pcNativeBuyNowV50=nativeBuyNow;
      window.buyNow=async function(productCode){
        const session=await getSession();
        const logged=!!session?.user?.email&&!session.user.is_anonymous;
        if(!logged){writePending({type:'purchase',productCode:String(productCode||'')});setEmailContext('purchase',String(productCode||''));showStep('email');return}
        knownEmail=String(session.user.email||'').toLowerCase();
        return nativeBuyNow(productCode);
      };
    }
    if(!nativeScrollToActivation&&typeof window.scrollToActivation==='function'){
      nativeScrollToActivation=window.scrollToActivation;
      window.scrollToActivation=function(){requireEmail('activate')};
    }
  }

  window.pcV50RequireEmail=requireEmail;
  window.pcV50OpenLibrary=()=>requireEmail('library');
  window.pcV50OpenAccount=()=>requireEmail('account');
  window.pcV50OpenActivation=()=>requireEmail('activate');
  window.pcV50HasSession=()=>!!knownEmail;
  window.pcV50KnownEmail=()=>knownEmail;

  ensureCss();ensureGate();hideGate();
  (async()=>{
    await waitForClient();subscribeAuth();
    let tries=0;const t=setInterval(()=>{tries++;wrapLegacyActions();if((nativeBuyNow&&nativeScrollToActivation)||tries>30)clearInterval(t)},100);
    await evaluate(true);
  })();
})();