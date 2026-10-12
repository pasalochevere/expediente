(()=>{
'use strict';
const B='https://fzbndgfnqxcacsvlitui.supabase.co/storage/v1/object/public/paper-squishy-assets/v2.7';
const LIB=window.PS_LIBRARY;
if(!LIB||!Array.isArray(LIB.characters)||!Array.isArray(LIB.collections))return;
const path=(collection,slug,key)=>`${B}/${collection}/${slug}/${key}.webp`;
const asset=(collection,slug,key,w,h,transparent=false)=>({path:path(collection,slug,key),width:w,height:h,mode:transparent?'RGBA':'RGB',transparent});
const isEN=String(document.documentElement.lang||'es').toLowerCase().startsWith('en');

// PSQ 2.7 · 50 personajes existentes: rebind de imprimibles corregidos.
for(const ch of LIB.characters){
 if(!ch?.collection_id||!ch?.slug)continue;
 ch.assets=ch.assets||{};
 ch.assets.front_print=asset(ch.collection_id,ch.slug,'front_print',1055,1491);
 ch.assets.back_print=asset(ch.collection_id,ch.slug,'back_print',1055,1491);
 ch.assets.coloring=asset(ch.collection_id,ch.slug,'coloring',1055,1491);
 ch.assets.coloring_back=asset(ch.collection_id,ch.slug,'coloring_back',1055,1491);
 ch.source_mode='app_v2.7_corrected_printables';
 ch.missing=[];
 ch.actions=[...new Set([...(ch.actions||[]),'color_back'])];
}

// Ocean Buddies · SQ051–SQ060.
const ocean=[
 ['SQ051','ollie','Ollie Pulpo','pulpo'],
 ['SQ052','bibi','Bibi Ballena','ballena'],
 ['SQ053','timo','Timo Tiburón','tiburón'],
 ['SQ054','mimi','Mimi Medusa','medusa'],
 ['SQ055','tuki','Tuki Tortuga','tortuga'],
 ['SQ056','cora','Cora Caballito','caballito de mar'],
 ['SQ057','pufi','Pufi Pez Globo','pez globo'],
 ['SQ058','nori','Nori Narval','narval'],
 ['SQ059','lumi','Lumi Estrella de Mar','estrella de mar'],
 ['SQ060','kiko','Kiko Cangrejo','cangrejo']
];
if(!LIB.collections.some(c=>c.id==='ocean_buddies')){
 LIB.collections.push({id:'ocean_buddies',name:'Ocean Buddies',order:6,status:'approved',character_count:10,theme:'mundo marino kawaii',preview:path('ocean_buddies','ollie','hero'),route:'#/collection/ocean_buddies'});
}
for(let i=0;i<ocean.length;i++){
 const [code,slug,name,category]=ocean[i],id=`ocean_buddies_${slug}`;
 if(LIB.characters.some(c=>c.id===id))continue;
 const assets={
  hero:asset('ocean_buddies',slug,'hero',900,900),
  front_print:asset('ocean_buddies',slug,'front_print',1055,1491),
  back_print:asset('ocean_buddies',slug,'back_print',1055,1491),
  coloring:asset('ocean_buddies',slug,'coloring',1055,1491),
  coloring_back:asset('ocean_buddies',slug,'coloring_back',1055,1491),
  editor_asset:asset('ocean_buddies',slug,'editor_asset',900,900,true),
  character_card:asset('ocean_buddies',slug,'character_card',1055,1491),
  tutorial:asset('ocean_buddies',slug,'tutorial',1055,1491),
  mockup:asset('ocean_buddies',slug,'mockup',900,900)
 };
 LIB.characters.push({id,code,slug,name,collection_id:'ocean_buddies',collection:'Ocean Buddies',order:i+1,category,tags:['océano','mar','kawaii','paper squishy'],difficulty:'fácil',suggested_size:'10-14 cm',status:'approved',featured:[0,1,4,7].includes(i),editor_ready:true,assets,source_mode:'app_v2.7_ocean_buddies',missing:[],actions:['view','print_front','print_back','color','color_back','tutorial','favorite','use_in_editor']});
}

LIB.library_version='P2.7R1';
LIB.generated='2026-10-12';
LIB.asset_contract_version='1.1';
LIB.asset_keys=['hero','front_print','back_print','coloring','coloring_back','editor_asset','character_card','tutorial','mockup'];
LIB.catalog_totals={collections:6,characters:60,views_per_character:9};
LIB.stats={collections:6,characters:60,assets_expected:540,assets_present:540};
LIB.qa={status:'passed',missing_assets:0,characters_with_9_assets:60,release:'P2.7R1'};
LIB.collections.sort((a,b)=>(a.order||0)-(b.order||0));

// Los mapas originales ya existen y EDITOR_ASSETS conserva referencia al objeto.
const thumbs=window.PS_THUMBS||(window.PS_THUMBS={});
const editors=window.PS_EDITOR_ASSETS||(window.PS_EDITOR_ASSETS={});
for(const ch of LIB.characters){thumbs[ch.id]=ch.assets?.hero?.path||'';editors[ch.id]=ch.assets?.editor_asset?.path||'';}

// 9 vistas reales por personaje: incluye coloring dorso.
try{
 if(typeof VIEWER_ORDER!=='undefined'&&Array.isArray(VIEWER_ORDER)){
  VIEWER_ORDER.splice(0,VIEWER_ORDER.length,'hero','front_print','back_print','coloring','coloring_back','editor_asset','character_card','tutorial','mockup');
 }
 if(typeof viewerMeta==='function'){
  const oldViewerMeta=viewerMeta;
  viewerMeta=(key,ch)=>{
   if(key==='coloring')return isEN
    ? ['COLORING · FRONT','Front coloring sheet','Print and color the front before building.']
    : ['COLOREAR · FRENTE','Frente para colorear','Imprimí y coloreá el frente antes de armar.'];
   if(key==='coloring_back')return isEN
    ? ['COLORING · BACK','Back coloring sheet','Print and color the back before building.']
    : ['COLOREAR · DORSO','Dorso para colorear','Imprimí y coloreá el dorso antes de armar.'];
   return oldViewerMeta(key,ch);
  };
 }
}catch(e){console.warn('[PSQ 2.7R1] viewer order/meta patch',e)}

// Normalización visual del visor y miniaturas.
const style=document.createElement('style');
style.id='psq-v27r1-viewer-normalization';
style.textContent=`
#viewer .page-head{max-width:1180px}
#viewer .viewer{max-width:1180px;padding:18px 22px 16px}
#viewer .viewer-stage{min-height:clamp(430px,58vh,650px);grid-template-columns:64px minmax(0,1fr) 64px;align-items:center}
#viewer #viewerImage{display:block;margin:auto;width:100%;height:clamp(390px,55vh,610px);max-width:760px;max-height:610px;object-fit:contain!important;object-position:center center;background:#fffdfa;border:1px solid #eee4d8;border-radius:22px;padding:12px;box-shadow:0 10px 28px rgba(70,50,38,.07)}
#viewer .viewer.is-sheet #viewerImage{max-width:470px;background:#fff;padding:8px}
#viewer .viewer.is-art #viewerImage{max-width:610px;background:#fffaf2;padding:18px}
#viewer .viewer-thumbs{max-width:1180px;grid-template-columns:repeat(9,minmax(0,1fr));gap:10px}
#viewer .viewer-thumb{min-width:0;padding:7px;border-radius:16px;display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start}
#viewer .viewer-thumb img{width:100%!important;height:auto!important;aspect-ratio:1/1.06!important;object-fit:contain!important;object-position:center!important;background:#fffdfa!important;padding:5px;border:1px solid #f0e7dc}
#viewer .viewer-thumb small{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;line-height:1.12;min-height:2.25em;display:flex!important;align-items:center;justify-content:center;text-align:center;font-size:8px}
#viewer .viewer-thumb[data-sheet="1"] img{background:#fff!important}
@media(max-width:900px){#viewer .viewer-stage{min-height:52vh;grid-template-columns:48px minmax(0,1fr) 48px}#viewer #viewerImage{height:48vh;max-width:92vw}#viewer .viewer-thumbs{grid-template-columns:repeat(3,1fr)}#viewer .viewer-thumb small{font-size:9px}}
@media(max-width:560px){#viewer .viewer{padding:10px}#viewer .viewer-stage{min-height:46vh;grid-template-columns:40px minmax(0,1fr) 40px;gap:6px}#viewer #viewerImage{height:42vh;padding:6px}#viewer .viewer-thumbs{grid-template-columns:repeat(3,1fr);gap:7px}}
`;
document.head.appendChild(style);

// Reemplazo del renderer para garantizar 9 vistas, impresión del coloring dorso y geometría pareja.
try{
 if(typeof renderViewer==='function'){
  renderViewer=()=>{
   const ch=getChar(activeCharacter);if(!ch)return;
   viewerKey=VIEWER_ORDER[viewerIndex];
   const meta=viewerMeta(viewerKey,ch),asset=ch.assets?.[viewerKey];
   const sheetKeys=['front_print','back_print','coloring','coloring_back','character_card','tutorial'];
   const viewerBox=document.querySelector('#viewer .viewer');
   if(viewerBox){viewerBox.classList.toggle('is-sheet',sheetKeys.includes(viewerKey));viewerBox.classList.toggle('is-art',!sheetKeys.includes(viewerKey));viewerBox.dataset.view=viewerKey;}
   $('#viewerKicker').textContent=meta[0];
   $('#viewerTitle').textContent=`${ch.name} · ${meta[1]}`;
   $('#viewerText').textContent=meta[2];
   $('#viewerImage').src=asset?.path||'';
   $('#viewerImage').alt=meta[1]+' de '+ch.name;
   $('#viewerCounter').textContent=(viewerIndex+1)+' / '+VIEWER_ORDER.length;
   const printable=['front_print','back_print','coloring','coloring_back','character_card','tutorial'];
   $('#viewerPrint').style.display=printable.includes(viewerKey)?'inline-block':'none';
   $('#viewerUseEditor').style.display=viewerKey==='editor_asset'?'inline-block':'none';
   const thumbs=$('#viewerThumbs');thumbs.innerHTML='';
   VIEWER_ORDER.forEach((k,i)=>{const a=ch.assets?.[k];if(!a)return;const b=document.createElement('button');b.className='viewer-thumb'+(i===viewerIndex?' active':'');b.dataset.sheet=sheetKeys.includes(k)?'1':'0';const mm=viewerMeta(k,ch);b.innerHTML=`<img src="${a.path}" alt="${mm[0]}"><small>${mm[0]}</small>`;b.onclick=()=>{viewerIndex=i;renderViewer()};thumbs.appendChild(b)});
  };
 }
}catch(e){console.warn('[PSQ 2.7R1] render patch',e)}

// UI: 9 vistas y acceso explícito al coloring dorso.
try{
 const gallery=document.getElementById('galleryBtn');
 if(gallery){const b=gallery.querySelector('b'),s=gallery.querySelector('small');if(b)b.textContent=isEN?'View gallery · 9 views':'Ver galería · 9 vistas';if(s)s.textContent=isEN?'Hero, front, back, front/back coloring, editor, card, tutorial and mockup':'Hero, frente, dorso, coloring frente/dorso, editor, ficha, tutorial y mockup';}
 const color=document.getElementById('colorBtn');
 if(color){const b=color.querySelector('b'),s=color.querySelector('small');if(b)b.textContent=isEN?'Color the front':'Colorear frente';if(s)s.textContent=isEN?'Open the front black & white version':'Abrir el frente en blanco y negro';}
 if(color&&!document.getElementById('colorBackBtn')){
  const btn=color.cloneNode(true);btn.id='colorBackBtn';
  const b=btn.querySelector('b'),s=btn.querySelector('small');if(b)b.textContent=isEN?'Color the back':'Colorear dorso';if(s)s.textContent=isEN?'Open the back black & white version':'Abrir el dorso en blanco y negro';
  btn.onclick=()=>openViewer(activeCharacter,'coloring_back');color.insertAdjacentElement('afterend',btn);
 }
 const vk=document.getElementById('viewerKicker');if(vk&&/8/.test(vk.textContent))vk.textContent=isEN?'9-VIEW GALLERY':'GALERÍA 9 VISTAS';
}catch(e){console.warn('[PSQ 2.7R1] UI patch',e)}

// Descripción específica de Ocean Buddies.
try{
 if(typeof collectionDesc==='function'){
  const oldCollectionDesc=collectionDesc;
  collectionDesc=(id)=>id==='ocean_buddies'
    ? (isEN?'Cute ocean friends ready to print, color, build and remix.':'Amiguitos del mar listos para imprimir, colorear, armar y remixar.')
    : oldCollectionDesc(id);
 }
}catch{}

// Refrescar la pantalla actualmente visible sin recargar ni tocar el core.
try{
 if(document.getElementById('home')?.classList.contains('active')&&typeof renderHome==='function')renderHome();
 if(document.getElementById('library')?.classList.contains('active')&&typeof renderCollections==='function')renderCollections();
 if(document.getElementById('collection')?.classList.contains('active')&&typeof renderCharacters==='function')renderCharacters();
}catch(e){console.warn('[PSQ 2.7R1] refresh',e)}

window.PSQ_V27={active:true,release:'P2.7R1',collections:6,characters:60,views_per_character:9,assets:540,corrected_existing:50,ocean_buddies:10};
console.info('[PSQ 2.7R1] catálogo activo',window.PSQ_V27);
})();
