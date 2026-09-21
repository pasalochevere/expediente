
(async()=>{
 const gate=document.getElementById('licenseGate'),state=document.getElementById('licenseState'),app=document.getElementById('app');
 const SUPABASE_URL='https://fzbndgfnqxcacsvlitui.supabase.co',SUPABASE_KEY='sb_publishable_bJ91vnQUWHfFqWRO99fFkQ_dh0icDxo';
 const ACCESS_KEY='pc_fut_america_access',VALID_KEY='pc_fut_america_valid_until',DEVICE_KEY='pc_device_id';
 const allowedProducts=new Set(['FUT-AMERICA','FUT-AMERICA-PHY','FUT-AMERICA-DIG']);
 const deviceId=()=>{let v=localStorage.getItem(DEVICE_KEY);if(!v){v=crypto.randomUUID?crypto.randomUUID():'dev_'+Date.now()+'_'+Math.random().toString(36).slice(2);localStorage.setItem(DEVICE_KEY,v)}return v};
 const deviceLabel=()=>[navigator.platform||'',navigator.userAgent.includes('Mobile')?'Mobile':'Browser'].filter(Boolean).join(' · ').slice(0,150);
 const openGame=(note)=>{state.textContent=note||'✅ Acceso validado.';setTimeout(()=>{gate.classList.add('hidden');app.style.display='block';window.scrollTo(0,0)},180)};
 const storedCode=(localStorage.getItem(ACCESS_KEY)||'').trim().toUpperCase();
 const qs=new URLSearchParams(location.search);const incoming=(qs.get('access')||'').trim().toUpperCase();
 let code=incoming||storedCode;if(incoming)localStorage.setItem(ACCESS_KEY,incoming);
 const offlineValid=()=>{const until=Date.parse(localStorage.getItem(VALID_KEY)||'');return !!code&&Number.isFinite(until)&&until>Date.now()};
 if(!navigator.onLine){if(offlineValid())openGame('📡 Modo offline · acceso validado previamente en este dispositivo.');else state.textContent='⚠️ Necesitás conectarte una vez para validar este dispositivo.';return}
 if(typeof supabase==='undefined'){state.textContent='⚠️ No pude cargar el validador de acceso. Revisá tu conexión e intentá nuevamente.';return}
 try{
   const sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,detectSessionInUrl:true,autoRefreshToken:true}});
   const {data:{session}}=await sb.auth.getSession();if(!session?.user?.email)throw new Error('Ingresá a tu Biblioteca PasaloChévere para validar tu cuenta.');
   if(!code){
     state.textContent='Buscando Torre de América en tu biblioteca…';
     const {data:me,error:meError}=await sb.functions.invoke('pasalochevere-access',{body:{action:'me'}});
     if(meError)throw meError;
     const owned=(me?.licenses||[]).find(l=>allowedProducts.has(String(l.product_code||'').toUpperCase())&&String(l.status||'').toLowerCase()==='active'&&l.activation_code);
     if(!owned)throw new Error('No encontré un acceso activo a Torre de América en esta cuenta.');
     code=String(owned.activation_code).trim().toUpperCase();
     localStorage.setItem(ACCESS_KEY,code);
     if(owned.expires_at)localStorage.setItem(VALID_KEY,owned.expires_at);
   }
   const {data,error}=await sb.functions.invoke('pasalochevere-access',{body:{action:'register_device',activation_code:code,device_id:deviceId(),device_label:deviceLabel()}});
   if(error)throw error;if(!data?.ok)throw new Error(data?.error||'No se pudo validar el acceso.');
   const lic=data.license||{};if(!allowedProducts.has(String(lic.product_code||'').toUpperCase()))throw new Error('Este código no corresponde a Torre de América.');
   if(lic.expires_at)localStorage.setItem(VALID_KEY,lic.expires_at);
   localStorage.setItem(ACCESS_KEY,code);
   if(incoming)history.replaceState({},'',location.pathname);
   openGame('✅ Acceso validado · '+(lic.product_name||'Torre de América'));
 }catch(e){state.textContent='⚠️ '+(e?.message||'Acceso no válido.')+' Volvé a tu biblioteca e iniciá sesión si hace falta.'}
})();
