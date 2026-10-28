(()=>{'use strict';
const PREFIX='PSQ_BM20_20261028';if(window[PREFIX])return;
const BASE='./butter-mania/',SUPA='https://fzbndgfnqxcacsvlitui.supabase.co',KEY='sb_publishable_bJ91vnQUWHfFqWRO99fFkQ_dh0icDxo';
const $=(selector,root=document)=>root.querySelector(selector);
let manifest=null, previews={}, sb=null, current=0,side='front',mode='color',verified=false;
const status=s=>{const e=$('#bm20-msg');if(e)e.textContent=s};
const escape=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function readStoredZip(buffer){
 const dv=new DataView(buffer), bytes=new Uint8Array(buffer),td=new TextDecoder(),map={};let pos=0;
 while(pos+30<=bytes.length&&dv.getUint32(pos,true)===0x04034b50){
  const flags=dv.getUint16(pos+6,true),method=dv.getUint16(pos+8,true),size=dv.getUint32(pos+18,true),nl=dv.getUint16(pos+26,true),el=dv.getUint16(pos+28,true);
  if((flags&8)||method!==0)throw Error('Formato de miniaturas no compatible');
  const name=td.decode(bytes.subarray(pos+30,pos+30+nl)),start=pos+30+nl+el;
  if(start+size>bytes.length)throw Error('Archivo de miniaturas incompleto');
  if(name.endsWith('.webp'))map[name.split('/').pop()]=URL.createObjectURL(new Blob([bytes.slice(start,start+size)],{type:'image/webp'}));
  pos=start+size;
 }
 return map;
}
async function init(){
 try{
  const [m,z]=await Promise.all([fetch(BASE+'manifest.json',{cache:'no-store'}),fetch(BASE+'previews.zip')]);
  if(!m.ok||!z.ok)throw Error('Falta el manifiesto o las miniaturas');
  manifest=await m.json();previews=readStoredZip(await z.arrayBuffer());
  if(manifest.collection_id!=='butter_mania'||manifest.characters?.length!==20||Object.keys(previews).length!==80)throw Error('Colección incompleta');
  render();attach();window[PREFIX]={open,manifest,ready:true};
 }catch(e){console.error('[BM20] Integración no disponible:',e);window[PREFIX]={ready:false,error:String(e)}}
}
function style(){const css=document.createElement('style');css.textContent=`
#bm20-btn{font:900 13px/1.2 system-ui,sans-serif!important;color:#382328!important;background:linear-gradient(120deg,#ffe0aa,#ffb9d5)!important;border:2px solid #55313b!important;border-radius:16px!important;padding:13px 17px!important;box-shadow:0 7px 25px #2c081633!important;cursor:pointer!important}
#bm20-btn.bm20-floating{position:fixed!important;z-index:990!important;right:18px!important;bottom:18px!important}
#bm20-root{display:none;position:fixed;inset:0;overflow:auto;z-index:99990;background:#fff8ef;color:#382a26;font:14px/1.5 system-ui,sans-serif}#bm20-root.open{display:block}
#bm20-root *{box-sizing:border-box}#bm20-root button{font:inherit;cursor:pointer}#bm20-root .bm-head{position:sticky;top:0;z-index:3;background:#fff3e6;border-bottom:1px solid #ead6cf;padding:14px clamp(14px,4vw,50px);display:flex;align-items:center;justify-content:space-between;gap:16px}
#bm20-root .bm-kicker{font-weight:900;font-size:11px;letter-spacing:.1em;color:#cd4784}#bm20-root h2{font-size:clamp(24px,4vw,39px);letter-spacing:-.04em;line-height:1.05;margin:4px 0}
#bm20-root .bm-close,#bm20-root .bm-action,#bm20-root .bm-tab{padding:10px 14px;border:2px solid #4b3036;border-radius:13px;background:white;font-weight:900}
#bm20-root .bm-wrap{max-width:1240px;margin:auto;padding:18px 18px 60px}
#bm20-root .bm-lead{max-width:75ch;color:#755f58;margin:0 0 16px}
#bm20-root .bm-controls{display:flex;gap:9px;flex-wrap:wrap;margin:12px 0 17px}
#bm20-root .bm-tab.active{background:#ffe0aa}#bm20-root .bm-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
#bm20-root .bm-card{min-width:0;text-align:left;background:white;border:1px solid #efddd3;border-radius:19px;padding:10px;box-shadow:0 8px 25px #5123170d}
#bm20-root .bm-card.active{border:2px solid #e95198;padding:9px}#bm20-root .bm-card img{width:100%;aspect-ratio:1;object-fit:contain;background:white;border-radius:13px}
#bm20-root .bm-card strong{display:block;font-size:12px;line-height:1.2;margin-top:5px}#bm20-root .bm-card small{color:#967b70}
#bm20-root .bm-focus{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,1fr);gap:15px;background:white;border:1px solid #efddd3;border-radius:22px;padding:14px;margin:14px 0 18px}
#bm20-root .bm-focus img{width:100%;max-height:320px;object-fit:contain;border:1px solid #f1e3da;border-radius:14px}#bm20-root .bm-focus .bm-info{padding:10px}#bm20-root .bm-download{display:flex;gap:9px;flex-wrap:wrap;margin:12px 0}#bm20-root .bm-action{background:#ffe2ae}
#bm20-root .bm-note{font-size:12px;color:#786259;margin-top:12px}#bm20-root .bm-state{font-weight:900;color:#7b4d61}
@media(max-width:850px){#bm20-root .bm-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:590px){#bm20-root .bm-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#bm20-root .bm-focus{grid-template-columns:1fr}#bm20-root .bm-head{padding:12px}#bm20-root .bm-wrap{padding:12px}}
`;document.head.appendChild(css)}
function url(ch,si=side,mo=mode){return previews[`BM${String(ch).padStart(2,'0')}_${si}_${mo}.webp`]||''}
function render(){style();const root=document.createElement('section');root.id='bm20-root';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','Butter Mania - colección de squishies');
 root.innerHTML=`<header class="bm-head"><div><span class="bm-kicker">PASALOCHÉVERE · PAPER SQUISHY FACTORY · COLECCIÓN ADICIONAL</span><h2>🧈 Butter Mania <small style="font-size:.45em">20 modelos</small></h2></div><button class="bm-close" id="bm20-close">Cerrar ×</button></header><div class="bm-wrap"><p class="bm-lead">Mantequitas, quesitos y cremitas kawaii. Cada personaje incluye frente y dorso espejados. Imprimibles A4 horizontal: una pareja por hoja, a color o para colorear. Las versiones existentes de la fábrica se conservan.</p><div class="bm-controls"><button class="bm-tab active" data-mode="color">🌈 Color</button><button class="bm-tab" data-mode="bn">✏️ Para colorear</button><button class="bm-tab active" data-side="front">Frente</button><button class="bm-tab" data-side="back">Dorso</button></div><div class="bm-focus"><img id="bm20-big" alt=""><div class="bm-info"><span class="bm-kicker">VISTA DE REFERENCIA · NO A ESCALA PARA IMPRESIÓN</span><h2 id="bm20-name"></h2><p id="bm20-size"></p><p>Los PDFs conservan las líneas CUT y la escala. No imprimás estas miniaturas.</p><div class="bm-download"><button class="bm-action" id="bm20-dl-color" disabled>⬇ 20 A4 · Color</button><button class="bm-action" id="bm20-dl-bn" disabled>⬇ 20 A4 · B/N</button></div><p class="bm-state" id="bm20-msg">Comprobando disponibilidad de las descargas…</p><p class="bm-note">Descargas reservadas para licencias PSQ-FACTORY activas. Las seis colecciones originales y Creator Plus siguen intactos.</p></div></div><div class="bm-grid" id="bm20-grid"></div></div>`;
 document.body.append(root);$('#bm20-close',root).onclick=close;
 root.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;change();});root.querySelectorAll('[data-side]').forEach(b=>b.onclick=()=>{side=b.dataset.side;change();});
 $('#bm20-dl-color',root).onclick=()=>download('color');$('#bm20-dl-bn',root).onclick=()=>download('bn');
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('open'))close()});change();
}
function change(){const root=$('#bm20-root');if(!root)return;
 root.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));root.querySelectorAll('[data-side]').forEach(b=>b.classList.toggle('active',b.dataset.side===side));
 const ch=manifest.characters[current];$('#bm20-big').src=url(current+1);$('#bm20-big').alt=ch.name+' · '+side+' · '+mode;
 $('#bm20-name').textContent=ch.code+' · '+ch.name;$('#bm20-size').textContent='CUT: '+ch.cut_mm.join(' × ')+' mm · Medida máxima según silueta';
 const grid=$('#bm20-grid');grid.replaceChildren();manifest.characters.forEach((entry,i)=>{const b=document.createElement('button');b.className='bm-card'+(i===current?' active':'');b.innerHTML=`<img alt=""><strong>${escape(entry.code)} · ${escape(entry.name)}</strong><small>Frente / dorso</small>`;b.querySelector('img').src=url(i+1);b.querySelector('img').alt=entry.name;b.onclick=()=>{current=i;change();$('#bm20-big').scrollIntoView({block:'nearest',behavior:'smooth'})};grid.append(b)})}
function attach(){const btn=document.createElement('button');btn.id='bm20-btn';btn.type='button';btn.textContent='🧈 Butter Mania · 20 diseños';btn.onclick=open;
 const anchor=$('#headerCreateBtn')||$('#blankStartBtn');if(anchor?.parentNode){anchor.insertAdjacentElement('afterend',btn)}else{btn.classList.add('bm20-floating');document.body.append(btn)}
}
function open(){const root=$('#bm20-root');if(!root)return;root.classList.add('open');document.documentElement.style.overflow='hidden';verify();}
function close(){const root=$('#bm20-root');if(root)root.classList.remove('open');document.documentElement.style.overflow='';}
async function client(){if(sb)return sb;let api=window.supabase;if(!api?.createClient){await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=resolve;s.onerror=()=>reject(Error('No se pudo cargar autenticación'));document.head.append(s)});api=window.supabase}return sb=api.createClient(SUPA,KEY,{auth:{persistSession:true,detectSessionInUrl:false,autoRefreshToken:true}})}
async function verify(){verified=false;for(const id of ['color','bn']){$('#bm20-dl-'+id).disabled=true}status('Comprobando sesión, licencia y archivos…');try{
 const c=await client(),{data:{session}}=await c.auth.getSession();if(!session){status('Iniciá sesión en el Portal para descargar. Podés ver las miniaturas.');return}
 const {data:d,error:e}=await c.functions.invoke('pasalochevere-access',{body:{action:'me'}});if(e||!d?.ok)throw Error('No se pudo verificar licencia');
 const lis=(d.licenses||[]).filter(x=>x.product_code==='PSQ-FACTORY');if(!lis.some(x=>x.status==='active'&&(!x.expires_at||new Date(x.expires_at)>new Date()))){status('Necesitás una licencia PSQ-FACTORY activa para descargar.');return}
 const {data:items,error:err}=await c.storage.from('paper-squishy-downloads').list('P2.5/BM20',{limit:30});if(err)throw err;
 const names=(items||[]).map(x=>x.name);const avail=Object.entries(manifest.resources).filter(([k,v])=>names.includes(v.download_name));
 for(const [k,v] of avail)$('#bm20-dl-'+k).disabled=false;verified=avail.length>0;
 status(avail.length===2?'✓ Dos PDFs disponibles con licencia.':`Colección en preparación: ${avail.length}/2 PDFs cargados en el almacenamiento privado.`);
 }catch(e){status('No pude validar las descargas: '+String(e.message||e))}}
async function download(which){if(!verified){status('La descarga todavía no está habilitada.');return}
 const file=manifest.resources[which];try{const c=await client();status('Descargando '+file.download_name+'…');const {data,error}=await c.storage.from('paper-squishy-downloads').download(file.path);if(error)throw error;const uri=URL.createObjectURL(data),a=document.createElement('a');a.href=uri;a.download=file.download_name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(uri),18000);status('✓ Descarga iniciada: '+file.download_name)}catch(e){status('No se pudo descargar: '+String(e.message||e))}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();