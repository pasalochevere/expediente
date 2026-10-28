(()=>{'use strict';
const VERSION='BM20-NATIVE-STAGING-R3';
if(window.PSQ_BM_NATIVE?.ready)return;
const CONFIG={base:'./butter-mania/',downloadBase:'P2.5/BM20/',supabaseUrl:'https://fzbndgfnqxcacsvlitui.supabase.co',pubKey:'sb_publishable_bJ91vnQUWHfFqWRO99fFkQ_dh0icDxo'};
const KEYS=['hero','front_print','back_print','coloring','coloring_back','editor_asset','character_card','tutorial','mockup'];
const META={hero:[900,900],front_print:[1055,1491],back_print:[1055,1491],coloring:[1055,1491],coloring_back:[1055,1491],editor_asset:[900,900],character_card:[1055,1491],tutorial:[1055,1491],mockup:[900,900]};
let busy=false,manifest=null,urls={},lastError=null;
function unzip(buffer){
 const dv=new DataView(buffer),bytes=new Uint8Array(buffer),td=new TextDecoder();const ret={};let pos=0;
 while(pos+30<=bytes.length&&dv.getUint32(pos,true)===0x04034b50){
  const flags=dv.getUint16(pos+6,true),method=dv.getUint16(pos+8,true),size=dv.getUint32(pos+18,true),nl=dv.getUint16(pos+26,true),el=dv.getUint16(pos+28,true);
  if(flags&8||method!==0)throw Error('El archivo de recursos no está en formato ZIP compatible');
  const name=td.decode(bytes.subarray(pos+30,pos+30+nl)),start=pos+30+nl+el;
  if(start+size>bytes.length)throw Error('Recurso incompleto: '+name);
  if(name.endsWith('.webp'))ret[name.split('/').pop()]=URL.createObjectURL(new Blob([bytes.slice(start,start+size)],{type:'image/webp'}));
  pos=start+size;
 }
 return ret;
}
function waitLibrary(){return new Promise((resolve,reject)=>{let count=0;const id=setInterval(()=>{
 const lib=window.PS_LIBRARY;
 if(lib&&Array.isArray(lib.collections)&&Array.isArray(lib.characters)&&lib.characters.length>=60){clearInterval(id);resolve(lib)}
 else if(++count>140){clearInterval(id);reject(Error('La biblioteca original no terminó de cargar'))}
},180)})}
function asset(code,key){const path=urls[code+'_'+key+'.webp'];if(!path)throw Error('Falta asset '+code+'_'+key);const [width,height]=META[key];return {path,width,height,mode:key==='editor_asset'?'RGBA':'RGB',transparent:key==='editor_asset',preview_only:true}}
function updateLabels(){
 const proof=document.querySelector('.hero-proof');if(proof){const spans=proof.querySelectorAll('span'),nums=proof.querySelectorAll('b');
  for(let i=0;i<spans.length;i++){const t=spans[i].textContent.toLowerCase();if(t.includes('personaj')||t.includes('diseñ')||t.includes('design'))nums[i]&&(nums[i].textContent='80');if(t.includes('coleccion')||t.includes('collection'))nums[i]&&(nums[i].textContent='7')}
 }
}
function install(lib){
 if(!lib.collections.some(x=>x.id==='butter_mania'))lib.collections.push({id:'butter_mania',name:'Butter Mania',order:7,status:'preview',character_count:20,theme:'mantequitas, quesitos y cremitas kawaii',preview:urls['BM01_hero.webp'],route:'#/collection/butter_mania'});
 for(let i=0;i<manifest.characters.length;i++){
  const ch=manifest.characters[i],id='butter_mania_'+ch.slug;if(lib.characters.some(x=>x.id===id))continue;
  const assets={};for(const key of KEYS)assets[key]=asset(ch.code,key);
  lib.characters.push({id,code:ch.code,slug:ch.slug,name:ch.name,collection_id:'butter_mania',collection:'Butter Mania',order:i+1,category:'butter_mania',tags:['manteca','quesito','cremita','kawaii','imprimible'],difficulty:'fácil',suggested_size:'12 cm (CUT máximo)',status:'preview',featured:i<3,editor_ready:true,assets,source_mode:'butter_mania_native_preview_R1',missing:[],actions:['view','print_front','print_back','color','color_back','tutorial','favorite','use_in_editor']});
 }
 lib.collections.sort((a,b)=>(a.order||0)-(b.order||0));lib.catalog_totals={...(lib.catalog_totals||{}),collections:7,characters:80,views_per_character:9};lib.stats={...(lib.stats||{}),collections:7,characters:80,assets_expected:720,assets_present:720};
 const thumbs=window.PS_THUMBS||(window.PS_THUMBS={}),editors=window.PS_EDITOR_ASSETS||(window.PS_EDITOR_ASSETS={});
 for(const c of lib.characters.filter(x=>x.collection_id==='butter_mania')){thumbs[c.id]=c.assets.hero.path;editors[c.id]=c.assets.editor_asset.path}
 try{if(typeof collectionDesc==='function'){const old=collectionDesc;collectionDesc=id=>id==='butter_mania'?'20 squishies de mantequitas, quesitos y cremitas kawaii, con frente, dorso, colorear y Creator Plus.':old(id)}}catch(e){console.warn('[BM20] Descripción nativa',e)}
 try{if(typeof renderHome==='function')renderHome();if(typeof renderCollections==='function')renderCollections();if(typeof renderCharacters==='function'&&document.getElementById('collection')?.classList.contains('active'))renderCharacters()}catch(e){console.warn('[BM20] Refresh de colecciones',e)}
 updateLabels();
 addPrinterEntry();
 window.PSQ_BM_NATIVE={ready:true,release:VERSION,characters:20,views:9,libCount:lib.characters.length,collectionCount:lib.collections.length,getStatus:()=>({ready:true,characters:20,assets:Object.keys(urls).length})};
 console.info('[BM20 NATIVE]',VERSION,'colecciones',lib.collections.length,'personajes',lib.characters.length);
}
function addPrinterEntry(){
 if(document.getElementById('bm20-print-info'))return;
 const sheet=document.createElement('div');sheet.id='bm20-print-info';sheet.style.cssText='display:none;position:fixed;left:12px;bottom:12px;z-index:950;max-width:270px;border:1px solid #ebd1c7;background:#fffbf6;color:#382a26;border-radius:18px;padding:12px;box-shadow:0 8px 32px #3e211d25;font:12px system-ui';
 sheet.innerHTML='<b>🧈 Butter Mania · A4 apaisado</b><p style="margin:6px 0">Para conservar el tamaño, usá el PDF completo de frente + dorso, disponible con licencia. Las 9 vistas del visor son previsualizaciones.</p><a href="./downloads.html" style="color:#a13e5c;font-weight:800">Mis descargas</a>';
 document.body.append(sheet);
 const toggle=()=>{const col=document.getElementById('collection');const show=!!col?.classList.contains('active') && /butter\s*mania/i.test((col.querySelector('.page-head')||col).textContent||'');sheet.style.display=show?'block':'none'};
 const mo=new MutationObserver(toggle);mo.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});toggle();
}
async function init(){if(busy)return;busy=true;window.PSQ_BM_NATIVE={ready:false,loading:true};try{
 window.PSQ_BM_NATIVE={ready:false,loading:true,phase:'Biblioteca original'};
 const lib=await waitLibrary();const parts=Array.from({length:12},(_,i)=>'native-'+String(i+1).padStart(2,'0')+'.zip');
 window.PSQ_BM_NATIVE.phase='Catálogo';
 const mr=await fetch(CONFIG.base+'manifest.json',{cache:'no-store'});
 if(!mr.ok)throw Error('Catálogo HTTP '+mr.status);
 manifest=await mr.json();urls={};
 for(let i=0;i<parts.length;i+=3){
  window.PSQ_BM_NATIVE.phase='Recursos '+Math.min(i+3,parts.length)+' / '+parts.length;
  const group=parts.slice(i,i+3),responses=await Promise.all(group.map(n=>fetch(CONFIG.base+n,{cache:'no-store'})));
  for(let j=0;j<responses.length;j++){
   if(!responses[j].ok)throw Error('Recurso '+group[j]+' HTTP '+responses[j].status);
   Object.assign(urls,unzip(await responses[j].arrayBuffer()));
  }
 }
 if(manifest.collection_id!=='butter_mania'||manifest.characters?.length!==20)throw Error('Manifiesto incompleto');
 for(const ch of manifest.characters)for(const key of KEYS)if(!urls[ch.code+'_'+key+'.webp'])throw Error('Falta vista '+ch.code+' '+key);
 if(Object.keys(urls).length!==180)throw Error('Se esperaban 180 vistas, se recibieron '+Object.keys(urls).length);
 install(lib);
 }catch(e){lastError=String(e.message||e);console.error('[BM20 NATIVE]',e);window.PSQ_BM_NATIVE={ready:false,error:lastError}}finally{busy=false}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
