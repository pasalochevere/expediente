(()=>{'use strict';
const VERSION='BM20-NATIVE-STAGING-R4';
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
  lib.characters.push({id,code:ch.code,slug:ch.slug,name:ch.name,collection_id:'butter_mania',collection:'Butter Mania',order:i+1,category:'butter_mania',tags:['manteca','quesito','cremita','kawaii','imprimible'],difficulty:'fácil',suggested_size:'12 cm (CUT máximo)',status:'preview',featured:i<3,editor_ready:false,assets,source_mode:'butter_mania_native_preview_R4',missing:[],actions:['view','print_front','print_back','color','color_back','tutorial','favorite']});
 }
 lib.collections.sort((a,b)=>(a.order||0)-(b.order||0));lib.catalog_totals={...(lib.catalog_totals||{}),collections:7,characters:80,views_per_character:9};lib.stats={...(lib.stats||{}),collections:7,characters:80,assets_expected:720,assets_present:720};
 const thumbs=window.PS_THUMBS||(window.PS_THUMBS={}),editors=window.PS_EDITOR_ASSETS||(window.PS_EDITOR_ASSETS={});
 for(const c of lib.characters.filter(x=>x.collection_id==='butter_mania')){thumbs[c.id]=c.assets.hero.path;editors[c.id]=c.assets.editor_asset.path}
 try{if(typeof collectionDesc==='function'){const old=collectionDesc;collectionDesc=id=>id==='butter_mania'?'20 squishies de mantequitas, quesitos y cremitas kawaii, con frente, dorso, colorear y Creator Plus.':old(id)}}catch(e){console.warn('[BM20] Descripción nativa',e)}
 try{if(typeof renderHome==='function')renderHome();if(typeof renderCollections==='function')renderCollections();if(typeof renderCharacters==='function'&&document.getElementById('collection')?.classList.contains('active'))renderCharacters()}catch(e){console.warn('[BM20] Refresh de colecciones',e)}
 updateLabels();
 addPrinterEntry();
 mountNativeCollection(lib);
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

// R4: mostrar Butter Mania dentro de la pantalla de colecciones existente.
function mountNativeCollection(lib){
 if(document.getElementById('bm20-native-collection'))return;
 const css=document.createElement('style');css.id='bm20-r4-style';
 css.textContent=`
 #bm20-native-collection{display:none;position:fixed;inset:0;z-index:9997;overflow:auto;background:#fff9ef;color:#34251f;font:15px/1.5 system-ui,sans-serif}
 #bm20-native-collection.is-open{display:block}
 #bm20-native-collection *{box-sizing:border-box}
 .bm20-nav{position:sticky;top:0;background:#fff9efee;border-bottom:1px solid #ebdfd1;z-index:2;display:flex;align-items:center;justify-content:space-between;padding:14px max(18px,calc((100vw - 1150px)/2));gap:12px}
 .bm20-back{border:2px solid #382a25;border-radius:13px;background:#fff;padding:9px 15px;font:800 14px system-ui;cursor:pointer}
 .bm20-main{max-width:1170px;margin:auto;padding:22px 18px 60px}.bm20-eyebrow{font-size:11px;font-weight:900;letter-spacing:.15em;color:#d7596d}.bm20-heading{margin:6px 0 5px;font-size:clamp(30px,5vw,52px);line-height:1.03;font-weight:950;letter-spacing:-.035em}
 .bm20-intro{color:#796958;max-width:690px;margin:0 0 22px}.bm20-cards{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}
 .bm20-person{background:#fff;border:2px solid #ece0d3;border-radius:20px;padding:11px;box-shadow:0 7px 18px #3d26100b;text-align:left;cursor:pointer;font:inherit;min-width:0}
 .bm20-person:hover,.bm20-person:focus-visible{border-color:#eb829a;transform:translateY(-2px)}
 .bm20-person img{display:block;width:100%;aspect-ratio:1/1;object-fit:contain;border-radius:13px;background:#fff7eb}
 .bm20-person strong{display:block;margin:9px 0 4px;font-size:13px;line-height:1.2}.bm20-person small{font-size:11px;color:#866d61}
 .bm20-foot{margin-top:23px;font-size:12px;color:#7a655d}.bm20-coll-promo{margin:0 0 16px;background:#fff1db;border:1px solid #efdec9;border-radius:17px;padding:11px 15px;max-width:770px}
 @media(max-width:950px){.bm20-cards{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(max-width:680px){.bm20-cards{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.bm20-main{padding:13px}.bm20-nav{padding:10px}.bm20-person{padding:8px}}
 `;document.head.append(css);
 const root=document.createElement('section');root.id='bm20-native-collection';root.setAttribute('aria-label','Butter Mania · colección de 20 personajes');
 root.innerHTML='<nav class="bm20-nav"><b>🧈 PAPER SQUISHY FACTORY · BUTTER MANIA</b><button type="button" class="bm20-back" id="bm20-native-back">← Volver a colecciones</button></nav><main class="bm20-main"><div class="bm20-eyebrow">COLECCIÓN 07 · 20 PERSONAJES</div><h1 class="bm20-heading">Butter Mania</h1><p class="bm20-intro">Mantequitas, quesitos y cremitas kawaii. Elegí un personaje para ver sus nueve vistas, frente, dorso y materiales de armado.</p><div class="bm20-coll-promo">✂️ Las miniaturas son para explorar. Los imprimibles originales de 12 cm son A4 apaisados, con frente y dorso en la misma hoja, en color y para colorear.</div><div class="bm20-cards" id="bm20-native-cards"></div><p class="bm20-foot">Vista de prueba · Creator Plus y descargas privadas pendientes de validación funcional.</p></main>';
 document.body.append(root);
 const close=()=>{root.classList.remove('is-open');document.documentElement.style.overflow='';};
 const open=()=>{root.classList.add('is-open');document.documentElement.style.overflow='hidden';root.scrollTop=0;};
 document.getElementById('bm20-native-back').onclick=close;
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('is-open')&&!document.getElementById('psqV28')?.classList.contains('on'))close()});
 const cards=document.getElementById('bm20-native-cards');
 for(const ch of lib.characters.filter(x=>x.collection_id==='butter_mania')){
  const card=document.createElement('button');card.type='button';card.className='bm20-person';
  const img=document.createElement('img');img.src=ch.assets.hero.path;img.alt=ch.name;img.loading='lazy';
  const strong=document.createElement('strong');strong.textContent=ch.name;
  const small=document.createElement('small');small.textContent='9 vistas · Frente y dorso';
  card.append(img,strong,small);
  card.onclick=()=>{
   const v=window.PSQ_V28;
   if(v&&typeof v.open==='function'){try{v.open(ch.id,0);return}catch(e){console.warn('[BM20 R4] Visor nativo:',e)}}
   // Compatibilidad con visores originales; mantener la colección visible si no existen.
   if(typeof openViewer==='function'){try{openViewer(ch.id,'hero');return}catch(e){console.warn('[BM20 R4] Visor original:',e)}}
   const info=document.getElementById('bm20-native-error');
   if(info)info.textContent='El visor original todavía no está disponible para '+ch.name+'.';
  };
  cards.append(card);
 }
 const error=document.createElement('p');error.id='bm20-native-error';error.setAttribute('role','status');error.style.color='#b13b58';cards.after(error);
 const addCard=(section)=>{
  if(!section||section.querySelector('[data-bm20-tile="yes"]'))return;
  const old=[...section.querySelectorAll('button')].find(b=>/sweet squishies/i.test(b.textContent||'') && /entrar a la colecci[oó]n/i.test(b.textContent||''));
  if(!old)return;
  const tile=old.cloneNode(true);tile.dataset.bm20Tile='yes';
  tile.querySelectorAll('img').forEach((img,i)=>{img.src=urls[['BM01_hero.webp','BM09_hero.webp','BM15_hero.webp'][i%3]];img.alt=['Mantequita clásica','Manteca vainilla','Mozzarella con albahaca'][i%3]});
  const walker=document.createTreeWalker(tile,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){let n=walker.currentNode;
   n.textContent=n.textContent.replace(/Sweet Squishies/g,'Butter Mania').replace(/10 PERSONAJES/g,'20 PERSONAJES').replace(/Dulces, pasteles y personajes tiernos para coleccionar y remixar\./g,'Mantequitas, quesitos y cremitas kawaii para crear y coleccionar.');
  }
  for(const a of Array.from(tile.attributes))if(a.name.startsWith('data-')&&a.name!=='data-bm20-tile')tile.removeAttribute(a.name);
  tile.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();open()},true);
  old.parentNode.append(tile);
 };
 let scheduled=false;const sync=()=>{if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;addCard(document.getElementById('library'));addCard(document.getElementById('home'))},120)};
 sync();const observer=new MutationObserver(sync);observer.observe(document.body,{childList:true,subtree:true});
 window.PSQ_BM_NATIVE_OPEN=open;
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
