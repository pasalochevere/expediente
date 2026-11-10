/* PSQ80-R1. Butter Mania add-on for isolated preview, never alters frozen core.
   Loads exact 180 WebP assets from the already published 12 native ZIPs. */
(()=>{'use strict';
if(window.PSQ80_EXTENSION)return;
const VERSION='PSQ80-R1',COLLECTION='butter_mania',BASE='./butter-mania/';
const KEYS=['hero','front_print','back_print','coloring','coloring_back','editor_asset','character_card','tutorial','mockup'];
const DIMS={hero:[900,900],front_print:[600,848],back_print:[600,848],coloring:[600,848],coloring_back:[600,848],editor_asset:[540,540],character_card:[1055,1491],tutorial:[1055,1491],mockup:[900,900]};
const state=window.PSQ80_EXTENSION={version:VERSION,mode:'ISOLATED_PREVIEW',ready:false,characters:0,collections:0,assets:0,errors:[],urls:[]};
function note(message,isError=false){
 console[isError?'error':'info']('[PSQ80]',message);
 const badge=document.getElementById('psq80-notice');
 if(badge){badge.textContent=message;badge.style.color=isError?'#bc264a':'#216b51'}
}
async function libraryReady(){
 for(let i=0;i<120;i++){
  const l=window.PS_LIBRARY;
  if(l&&Array.isArray(l.characters)&&l.characters.length>=60&&window.PSQ_V27?.active)return l;
  await new Promise(r=>setTimeout(r,250));
 }
 throw Error('La fábrica estable de 60 no terminó de cargar. No se realizaron cambios.');
}
async function loadJSZip(){
 if(window.JSZip)return window.JSZip;
 return new Promise((resolve,reject)=>{
  const s=document.createElement('script');
  s.src='https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
  s.onload=()=>window.JSZip?resolve(window.JSZip):reject(Error('JSZip no disponible'));
  s.onerror=()=>reject(Error('No se pudo cargar JSZip'));
  document.head.appendChild(s);
 });
}
async function loadZipAssets(JSZip){
 const files=new Map();
 // Bounded concurrency avoids overwhelming browsers on mobile.
 for(let start=1;start<=12;start+=3){
  const batch=await Promise.all([start,start+1,start+2].filter(n=>n<=12).map(async n=>{
   const file=BASE+'native-'+String(n).padStart(2,'0')+'.zip';
   const r=await fetch(file,{cache:'force-cache'});
   if(!r.ok)throw Error('Falta paquete de Butter Mania: '+file+' (HTTP '+r.status+')');
   return JSZip.loadAsync(await r.arrayBuffer());
  }));
  for(const archive of batch){
   for(const [name,entry] of Object.entries(archive.files)){
    if(entry.dir||!name.toLowerCase().endsWith('.webp'))continue;
    const key=name.split('/').pop();
    if(files.has(key))throw Error('Imagen duplicada '+key);
    files.set(key,entry);
   }
  }
 }
 if(files.size!==180)throw Error('Se esperaban 180 vistas y se recuperaron '+files.size);
 return files;
}
function asset(url,key){
 const [width,height]=DIMS[key];
 return {path:url,width,height,mode:key==='editor_asset'?'RGBA':'RGB',transparent:key==='editor_asset'};
}
async function attach(){
 const LIB=await libraryReady();
 if(LIB.characters.some(ch=>ch.collection_id===COLLECTION)){
  note('Butter Mania ya aparece en esta sesión; se conserva el catálogo sin duplicados.');
  state.ready=true;return;
 }
 note('Recuperando 180 vistas originales de Butter Mania…');
 const [manifest,JSZip]=await Promise.all([
  fetch(BASE+'manifest.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('No se pudo abrir manifiesto Butter');return r.json()}),
  loadJSZip()
 ]);
 if(!Array.isArray(manifest.characters)||manifest.characters.length!==20)throw Error('Manifiesto Butter incompleto');
 const entries=await loadZipAssets(JSZip);
 const built=[];
 for(let i=0;i<manifest.characters.length;i++){
  const c=manifest.characters[i],assets={};
  for(const key of KEYS){
   const name=c.code+'_'+key+'.webp',entry=entries.get(name);
   if(!entry)throw Error('Vista faltante '+name);
   const blob=new Blob([await entry.async('uint8array')],{type:'image/webp'});
   const url=URL.createObjectURL(blob);state.urls.push(url);
   assets[key]=asset(url,key);
  }
  const id='butter_mania_'+c.slug;
  built.push({id,code:c.code,slug:c.slug,name:c.name,collection_id:COLLECTION,collection:'Butter Mania',
   order:i+1,category:'paper squishy',tags:['butter mania','kawaii','manteca','quesito','crema'],
   difficulty:'fácil',suggested_size:'12 cm',status:'preview',featured:i<4,editor_ready:true,
   cut_mm:c.cut_mm,assets,source_mode:'butter_mania_native_r5_preview',
   missing:[],actions:['view','print_front','print_back','color','color_back','tutorial','favorite','use_in_editor']});
 }
 const collection={id:COLLECTION,name:'Butter Mania',order:7,status:'preview',character_count:20,
  theme:'mantecas, quesitos y cremitas kawaii',preview:built[0].assets.hero.path,route:'#/collection/butter_mania'};
 LIB.collections.push(collection); LIB.characters.push(...built);
 LIB.collections.sort((a,b)=>(a.order||0)-(b.order||0));
 LIB.catalog_totals={...(LIB.catalog_totals||{}),collections:7,characters:80,views_per_character:9};
 LIB.stats={...(LIB.stats||{}),collections:7,characters:80,assets_expected:720,assets_present:720};
 const thumbs=window.PS_THUMBS||(window.PS_THUMBS={});
 const editors=window.PS_EDITOR_ASSETS||(window.PS_EDITOR_ASSETS={});
 for(const c of built){thumbs[c.id]=c.assets.hero.path;editors[c.id]=c.assets.editor_asset.path;}
 state.ready=true;state.characters=LIB.characters.length;state.collections=LIB.collections.length;state.assets=state.urls.length;
 note('80 personajes cargados (60 originales + 20 Butter). Prueba aislada; impresión comercial pendiente.');
 try{
  if(document.getElementById('home')?.classList.contains('active')&&typeof renderHome==='function')renderHome();
  if(document.getElementById('library')?.classList.contains('active')&&typeof renderCollections==='function')renderCollections();
  if(document.getElementById('collection')?.classList.contains('active')&&typeof renderCharacters==='function')renderCharacters();
 }catch(err){state.errors.push(String(err));console.warn('[PSQ80] Error de refresco, biblioteca disponible',err)}
 // Source previews have been watermarked as 'VISTA PREVIA' in print-sheet images.
 // Prevent a misleading one-character print from this staging preview.
 document.addEventListener('click',e=>{
  if(!document.getElementById('viewerPrint')?.contains(e.target))return;
  const current=typeof activeCharacter==='string'?activeCharacter:window.activeCharacter;
  const c=LIB.characters.find(ch=>ch.id===current);
  if(c?.collection_id===COLLECTION){
   e.preventDefault();e.stopImmediatePropagation();
   alert('Las vistas individuales de Butter Mania son previsualizaciones. Para imprimir usá los PDFs completos de 80 personajes certificados por separado.');
  }
 },true);
}
attach().catch(err=>{state.errors.push(String(err));note('No se integró Butter Mania: '+String(err.message||err),true);});
})();
