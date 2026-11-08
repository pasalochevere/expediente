/* TORRE DE AMÉRICA V2 RC: copia controlada de access.js con verificación de formatos. No altera V1. */
(async()=>{
 const gate=document.getElementById('licenseGate'),state=document.getElementById('licenseState'),app=document.getElementById('app');
 const SUPABASE_URL='https://fzbndgfnqxcacsvlitui.supabase.co',SUPABASE_KEY='sb_publishable_bJ91vnQUWHfFqWRO99fFkQ_dh0icDxo';
 const ACCESS_KEY='pc_fut_america_access_v2_rc',VALID_KEY='pc_fut_america_valid_until_v2_rc',DEVICE_KEY='pc_device_id';
 const allowedProducts=new Set(['FUT-AMERICA','FUT-AMERICA-PHY','FUT-AMERICA-DIG']);
 const SKU_KEY='pc_fut_america_selected_sku_v2_rc';
 const deviceId=()=>{let v=localStorage.getItem(DEVICE_KEY);if(!v){v=crypto.randomUUID?crypto.randomUUID():'dev_'+Date.now()+'_'+Math.random().toString(36).slice(2);localStorage.setItem(DEVICE_KEY,v)}return v};
 const deviceLabel=()=>[navigator.platform||'',navigator.userAgent.includes('Mobile')?'Mobile':'Browser'].filter(Boolean).join(' · ').slice(0,150);
 const openGame=(note)=>{state.textContent='Verificando contenido del juego…';Promise.resolve(window.torreAmericaDataReady||false).then(ready=>{if(!ready){state.textContent='⚠️ No se pudo cargar el contenido del juego. Revisá tu conexión y recargá la página.';return}state.textContent=note||'✅ Acceso validado.';setTimeout(()=>{gate.classList.add('hidden');app.style.display='block';window.scrollTo(0,0)},180)}).catch(()=>{state.textContent='⚠️ No se pudo iniciar el juego. Volvé a cargar la página.'})};
 const storedCode=(localStorage.getItem(ACCESS_KEY)||'').trim().toUpperCase();
 const qs=new URLSearchParams(location.search);
 const requestedSku=(qs.get('sku')||'').trim().toUpperCase();
 if(requestedSku&&!allowedProducts.has(requestedSku)){
   state.textContent='⚠️ Esta edición de Torre de América no existe.';return;
 }
 const selectedSku=requestedSku||(localStorage.getItem(SKU_KEY)||'').trim().toUpperCase();
 // El enlace de Biblioteca lleva solo el SKU, nunca el código personal.
 // Al elegir una edición en Biblioteca refrescamos el permiso desde la cuenta.
 let code=requestedSku?'':storedCode;
 if(requestedSku){
   localStorage.setItem(SKU_KEY,requestedSku);
   localStorage.removeItem(ACCESS_KEY);
 }
 // Evitar que una URL manual con código privado quede guardada en el historial.
 if(qs.has('access')){
   const safe=new URLSearchParams(location.search);
   safe.delete('access');
   history.replaceState({},'',location.pathname+(safe.toString()?'?'+safe.toString():''));
 }
 if(!navigator.onLine){state.textContent='⚠️ La candidata V2 necesita conexión para comprobar los permisos de esta edición. No se habilitó aún el modo sin conexión.';return}
 if(typeof supabase==='undefined'){state.textContent='⚠️ No pude cargar el validador de acceso. Revisá tu conexión e intentá nuevamente.';return}
 try{
   const sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,detectSessionInUrl:true,autoRefreshToken:true}});
   const {data:{session}}=await sb.auth.getSession();if(!session?.user?.email)throw new Error('Ingresá a tu Biblioteca PasaloChévere para validar tu cuenta.');
   if(!code){
     state.textContent='Buscando Torre de América en tu biblioteca…';
     const {data:me,error:meError}=await sb.functions.invoke('pasalochevere-access',{body:{action:'me'}});
     if(meError)throw meError;
     const owned=(me?.licenses||[]).find(l=>allowedProducts.has(String(l.product_code||'').toUpperCase())&&(!selectedSku||String(l.product_code||'').toUpperCase()===selectedSku)&&String(l.status||'').toLowerCase()==='active'&&l.activation_code&&Date.parse(l.expires_at||'')>Date.now());
     if(!owned)throw new Error('No encontré un acceso activo a Torre de América en esta cuenta.');
     code=String(owned.activation_code).trim().toUpperCase();
     localStorage.setItem(ACCESS_KEY,code);
     if(owned.expires_at)localStorage.setItem(VALID_KEY,owned.expires_at);
   }
   const {data,error}=await sb.functions.invoke('pasalochevere-access',{body:{action:'register_device',activation_code:code,device_id:deviceId(),device_label:deviceLabel()}});
   if(error)throw error;if(!data?.ok)throw new Error(data?.error||'No se pudo validar el acceso.');
   const lic=data.license||{};if(!allowedProducts.has(String(lic.product_code||'').toUpperCase()))throw new Error('Este código no corresponde a Torre de América.');
   if(selectedSku&&String(lic.product_code||'').toUpperCase()!==selectedSku)throw new Error('La licencia no pertenece a la edición solicitada.');
   // Doble control: el validador original verifica propiedad y registra el dispositivo;
   // este servicio aislado certifica qué formatos habilita exactamente el producto.
   const {data:entitlement,error:entitlementError}=await sb.functions.invoke('torre-america-entitlement-rc',{
     body:{activation_code:code,device_id:deviceId()}
   });
   if(entitlementError||!entitlement?.ok)throw new Error(
     entitlement?.error||'No se pudieron verificar los permisos de tu edición V2. Reintentá con conexión.'
   );
   if(String(entitlement.product_code||'').toUpperCase()!==String(lic.product_code||'').toUpperCase()){
     throw new Error('La edición registrada no coincide con la licencia.');
   }
   if(typeof window.TA_RC_SET_FORMATS!=='function'){
     throw new Error('No pudo iniciarse el control de formatos de V2.');
   }
   window.TA_RC_SET_FORMATS(entitlement.formats,entitlement.product_code);
   if(!window.TA_RC_FORMATS?.serverVerified)throw new Error('No se pudo completar el control de edición.');
   if(lic.expires_at)localStorage.setItem(VALID_KEY,lic.expires_at);
   localStorage.setItem(ACCESS_KEY,code);
   localStorage.setItem(SKU_KEY,String(entitlement.product_code||'').toUpperCase());
   const commercialName=entitlement.product_code==='FUT-AMERICA-DIG'?'Torre de América · Solo Digital':
     entitlement.product_code==='FUT-AMERICA-PHY'?'Torre de América · Torre Física + Digital':
     'Torre de América · Licencia clásica';
   openGame('✅ Acceso validado · '+commercialName);
 }catch(e){state.textContent='⚠️ '+(e?.message||'Acceso no válido.')+' Volvé a tu biblioteca e iniciá sesión si hace falta.'}
})();