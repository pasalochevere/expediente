(()=>{
  if(window.__pcDeliveryAuthV014)return;
  window.__pcDeliveryAuthV014=true;

  let nativeSend=null;
  let wrapped=false;

  function ctx(){return typeof window.pcDeliveryContext==='function'?window.pcDeliveryContext():window.PC_DELIVERY_CONTEXT||null}
  function active(){return !!ctx()?.deliveryMode}
  function authClient(){
    try{if(typeof sb!=='undefined'&&sb?.auth)return sb}catch{}
    try{if(window.sb?.auth)return window.sb}catch{}
    return null;
  }
  function legacyMsg(text,type=''){
    const el=document.getElementById('authMsg');
    if(!el)return;
    el.textContent=text||'';
    el.className='msg'+(type?' '+type:'');
  }
  function deliveryRedirect(){
    const c=ctx();
    if(!c?.deliveryMode)return '';
    if(typeof window.pcDeliveryMagicLinkUrl==='function')return window.pcDeliveryMagicLinkUrl();
    if(c.magicLinkUrl)return c.magicLinkUrl;
    try{
      const u=new URL(location.origin+location.pathname);
      u.searchParams.set('channel',c.channel||'');
      u.searchParams.set('product',c.product||'');
      u.searchParams.set('lang',c.lang||'es');
      u.searchParams.set('activate','1');
      u.searchParams.set('delivery_return','1');
      return u.toString();
    }catch{return ''}
  }

  async function sendContextualMagicLink(){
    const email=String(document.getElementById('email')?.value||document.getElementById('pcV50Email')?.value||'').trim().toLowerCase();
    if(!email){legacyMsg('Ingresá tu correo.','bad');return}
    const client=authClient();
    if(!client?.auth?.signInWithOtp)throw new Error('El acceso todavía se está cargando. Probá nuevamente en unos segundos.');
    const redirect=deliveryRedirect();
    if(!redirect)throw new Error('No se pudo preparar el retorno seguro al Portal de Activación.');

    legacyMsg('Procesando solicitud de acceso…');
    const {error}=await client.auth.signInWithOtp({
      email,
      options:{emailRedirectTo:redirect,shouldCreateUser:true}
    });
    if(error){legacyMsg(String(error.message||error),'bad');throw error}
    legacyMsg('✅ Enlace enviado. Abrilo en este mismo navegador para volver directamente a la activación de tu compra.','good');
    window.dispatchEvent(new CustomEvent('pc:delivery-magiclink-sent',{detail:{route:ctx()?.route||'',product:ctx()?.product||'',lang:ctx()?.lang||'es'}}));
  }

  function install(){
    if(wrapped)return true;
    if(typeof window.sendMagicLink!=='function')return false;
    nativeSend=window.sendMagicLink;
    window.__pcNativeSendMagicLinkV014=nativeSend;
    window.sendMagicLink=async function(){
      if(!active())return nativeSend.apply(this,arguments);
      return sendContextualMagicLink();
    };
    wrapped=true;
    return true;
  }

  window.pcDeliveryAuthV014Audit=()=>({
    active:active(),
    wrapped,
    redirect:active()?deliveryRedirect():'',
    callback:!!ctx()?.callback,
    restoredFromStorage:!!ctx()?.restoredFromStorage
  });

  if(!install()){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(install()||tries>50)clearInterval(timer);
    },80);
  }
})();