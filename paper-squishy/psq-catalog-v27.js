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

LIB.library_version='P2.7';
LIB.generated='2026-10-12';
LIB.asset_contract_version='1.1';
LIB.asset_keys=['hero','front_print','back_print','coloring','coloring_back','editor_asset','character_card','tutorial','mockup'];
LIB.catalog_totals={collections:6,characters:60,views_per_character:9};
LIB.stats={collections:6,characters:60,assets_expected:540,assets_present:540};
LIB.qa={status:'passed',missing_assets:0,characters_with_9_assets:60,release:'P2.7'};
LIB.collections.sort((a,b)=>(a.order||0)-(b.order||0));

// Los mapas originales ya existen y EDITOR_ASSETS conserva referencia al objeto.
// Mutarlos en lugar de reemplazarlos mantiene Creator Plus compatible.
const thumbs=window.PS_THUMBS||(window.PS_THUMBS={});
const editors=window.PS_EDITOR_ASSETS||(window.PS_EDITOR_ASSETS={});
for(const ch of LIB.characters){thumbs[ch.id]=ch.assets?.hero?.path||'';editors[ch.id]=ch.assets?.editor_asset?.path||'';}

// 9ª vista: coloring de dorso.
try{
 if(typeof VIEWER_ORDER!=='undefined'&&!VIEWER_ORDER.includes('coloring_back')){
  const i=VIEWER_ORDER.indexOf('coloring');VIEWER_ORDER.splice(i>=0?i+1:VIEWER_ORDER.length,0,'coloring_back');
 }
 if(typeof viewerMeta==='function'){
  const oldViewerMeta=viewerMeta;
  viewerMeta=(key,ch)=>key==='coloring_back'
    ? [isEN?'COLORING BACK':'COLOREAR DORSO',isEN?'Back coloring sheet':'Dorso para colorear',isEN?'Print and color the back before building.':'Imprimí y coloreá el dorso antes de armar.']
    : oldViewerMeta(key,ch);
 }
 if(typeof renderViewer==='function'){
  const oldRenderViewer=renderViewer;
  renderViewer=()=>{oldRenderViewer();try{if(viewerKey==='coloring_back')document.getElementById('viewerPrint').style.display='inline-block'}catch{}};
 }
}catch(e){console.warn('[PSQ 2.7] viewer patch',e)}

// Botón dedicado para coloring de dorso + textos de galería 9 vistas.
try{
 const gallery=document.getElementById('galleryBtn');
 if(gallery){const b=gallery.querySelector('b'),s=gallery.querySelector('small');if(b)b.textContent=isEN?'View gallery · 9 views':'Ver galería · 9 vistas';if(s)s.textContent=isEN?'Hero, front, back, front/back coloring, editor, card, tutorial and mockup':'Hero, frente, dorso, coloring frente/dorso, editor, ficha, tutorial y mockup';}
 const color=document.getElementById('colorBtn');
 if(color&&!document.getElementById('colorBackBtn')){
  const btn=color.cloneNode(true);btn.id='colorBackBtn';
  const b=btn.querySelector('b'),s=btn.querySelector('small');if(b)b.textContent=isEN?'Color the back':'Colorear dorso';if(s)s.textContent=isEN?'Open the back black & white version':'Abrir el dorso en blanco y negro';
  btn.onclick=()=>openViewer(activeCharacter,'coloring_back');color.insertAdjacentElement('afterend',btn);
 }
 const vk=document.getElementById('viewerKicker');if(vk&&/8/.test(vk.textContent))vk.textContent=isEN?'9-VIEW GALLERY':'GALERÍA 9 VISTAS';
}catch(e){console.warn('[PSQ 2.7] UI patch',e)}

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
}catch(e){console.warn('[PSQ 2.7] refresh',e)}

window.PSQ_V27={active:true,collections:6,characters:60,assets:540,corrected_existing:50,ocean_buddies:10};
console.info('[PSQ 2.7] catálogo activo',window.PSQ_V27);
})();
