(()=>{'use strict';
/* CP3.4B1-R8: isolated pilot, deliberately OFF by default.
   This is a staging feature flag, NOT an authentication mechanism.
   Never release before uploading/reviewing assets and full E2E QA. */
const FLAG='cp34b1-r8-cuppy';
const host=String(location.hostname||'').toLowerCase();
const allowedPreviewHosts=[]; // populate only after verified protected Vercel deployment\nconst isSafeHost=host==='localhost'||host==='127.0.0.1'||allowedPreviewHosts.includes(host);
const enabled=isSafeHost && new URLSearchParams(location.search).get(FLAG)==='preview';
if(!enabled){window.PSQ_CUPPY_R8={active:false,reason:'feature-flag-off'};return;}
const lib=window.PS_LIBRARY, ch=lib?.characters?.find(c=>c.slug==='cuppy');
if(!ch){window.PSQ_CUPPY_R8={active:false,reason:'cuppy-not-loaded'};return;}
const paths={original:{front:'./cp34b1-r8-assets/cuppy_original_front.png',back:'./cp34b1-r8-assets/cuppy_original_back.png'},
lavanda:{front:'./cp34b1-r8-assets/cuppy_lavanda_front.png',back:'./cp34b1-r8-assets/cuppy_lavanda_back.png'},
menta:{front:'./cp34b1-r8-assets/cuppy_menta_front.png',back:'./cp34b1-r8-assets/cuppy_menta_back.png'}};
let state={preset:'original',side:'front',ready:false},inflight=0;
const style=document.createElement('style');
style.textContent='#cpR8{position:fixed;inset:0;z-index:999999;background:#fff8f2;color:#39271e;overflow:auto;font-family:system-ui;display:none}#cpR8.open{display:block}#cpR8 *{box-sizing:border-box}#cpR8 .wrap{max-width:850px;margin:auto;padding:20px}#cpR8 .bar{display:flex;flex-wrap:wrap;gap:9px;margin:12px 0}#cpR8 button{padding:12px;border-radius:12px;border:1px solid #d9b4a6;background:white;color:inherit;font-weight:750}#cpR8 button[aria-pressed=true]{background:#ffdeaa}#cpR8 img{display:block;width:100%;max-height:63vh;object-fit:contain;background:white;border:1px solid #ead7cd;border-radius:16px}#cpR8 .warn{background:#fff0ce;border-radius:12px;padding:12px}';
document.head.appendChild(style);
const el=document.createElement('section');el.id='cpR8';el.innerHTML='<div class="wrap"><h2>Creator Plus · Cuppy R8 (STAGING)</h2><p class="warn">PRUEBA INTERNA · no aprobado para impresión comercial. Requiere sesión/licencia y QA real.</p><div class="bar"><button data-r8-preset="original">Original</button><button data-r8-preset="lavanda">Lavanda</button><button data-r8-preset="menta">Menta</button></div><div class="bar"><button data-r8-side="front">Frente</button><button data-r8-side="back">Dorso</button></div><img id="cpR8Image" alt="Vista previa Cuppy"><p id="cpR8Status" aria-live="polite"></p><div class="bar"><button id="cpR8Pair">Comprobar par frente/dorso</button><button id="cpR8Close">Volver sin cambios</button></div></div>';
document.body.append(el);
const status=(s)=>el.querySelector('#cpR8Status').textContent=s;
const load=(url)=>new Promise((resolve,reject)=>{if(!url)return reject(Error('Falta archivo'));const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('No disponible: '+url));im.src=url;});
function refreshButtons(){el.querySelectorAll('[data-r8-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.r8Preset===state.preset)));el.querySelectorAll('[data-r8-side]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.r8Side===state.side)));}
async function preview(){const seq=++inflight;state.ready=false;refreshButtons();status('Validando arte…');try{const im=await load(paths[state.preset][state.side]);if(seq!==inflight)return;el.querySelector('#cpR8Image').src=im.src;state.ready=true;status('Vista lista para evaluación. No se modificó el catálogo ni el archivo original.');}catch(e){if(seq!==inflight)return;el.querySelector('#cpR8Image').removeAttribute('src');status(String(e.message||e)+' · Variante bloqueada.');}}
el.querySelectorAll('[data-r8-preset]').forEach(b=>b.onclick=()=>{state.preset=b.dataset.r8Preset;preview()});
el.querySelectorAll('[data-r8-side]').forEach(b=>b.onclick=()=>{state.side=b.dataset.r8Side;preview()});
el.querySelector('#cpR8Pair').onclick=async()=>{status('Comprobando el par…');try{const [f,b]=await Promise.all([load(paths[state.preset].front),load(paths[state.preset].back)]);status('Par disponible: '+f.naturalWidth+'×'+f.naturalHeight+' / '+b.naturalWidth+'×'+b.naturalHeight+'. Impresión no liberada.');}catch(e){status('Par bloqueado: '+e.message)}};
el.querySelector('#cpR8Close').onclick=()=>{el.classList.remove('open');document.documentElement.style.overflow=''};
function open(){el.classList.add('open');document.documentElement.style.overflow='hidden';preview();}
window.PSQ_CUPPY_R8={active:false,release:'R8-staging',reason:'awaiting-server-license'};
async function verifyServerLicense(){
 const factory=window.supabase?.createClient;
 if(typeof factory!=='function')throw Error('Supabase Auth no disponible en preview');
 const client=factory('https://fzbndgfnqxcacsvlitui.supabase.co','sb_publishable_bJ91vnQUWHfFqWRO99fFkQ_dh0icDxo',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 const {data:userResult,error:authError}=await client.auth.getUser();
 if(authError||!userResult?.user)throw Error('Sesión autenticada no disponible');
 const {data,error}=await client.functions.invoke('pasalochevere-access',{body:{action:'me'}});
 if(error||!data?.ok)throw Error('Acceso a licencias rechazado');
 const approved=(data.licenses||[]).some(l=>l.product_code==='PSQ-FACTORY'&&l.status==='active'&&(!l.expires_at||Date.parse(l.expires_at)>Date.now()));
 if(!approved)throw Error('La licencia PSQ-FACTORY no está activa');
 return true;
}
verifyServerLicense().then(()=>{
 window.PSQ_CUPPY_R8={active:true,release:'R8-staging',open,close:()=>el.querySelector('#cpR8Close').click(),assetPaths:paths,licenseVerified:true};
 const btn=document.createElement('button');btn.textContent='🧁 Cuppy · colores (prueba R8)';btn.style.cssText='position:fixed;bottom:18px;right:18px;z-index:9000;background:#ffdeaa;border:2px solid #8c5a4b;border-radius:14px;padding:11px;font-weight:800';btn.onclick=open;document.body.append(btn);
}).catch(err=>{window.PSQ_CUPPY_R8={active:false,release:'R8-staging',reason:'server-license-not-verified'};console.warn('[Cuppy R8] Acceso de prueba bloqueado:',String(err?.message||err));});
})();