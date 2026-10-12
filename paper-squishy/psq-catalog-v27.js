(()=>{
'use strict';
const B='https://fzbndgfnqxcacsvlitui.supabase.co/storage/v1/object/public/paper-squishy-assets/v2.7';
const LIB=window.PS_LIBRARY;
if(!LIB||!Array.isArray(LIB.characters)||!Array.isArray(LIB.collections))return;
const path=(collection,slug,key)=>`${B}/${collection}/${slug}/${key}.webp`;
const asset=(collection,slug,key,w,h,transparent=false)=>({path:path(collection,slug,key),width:w,height:h,mode:transparent?'RGBA':'RGB',transparent});

// PSQ 2.7: rebind all 50 approved characters to corrected printable masters.
for(const ch of LIB.characters){
 if(!ch?.collection_id||!ch?.slug)continue;
 ch.assets=ch.assets||{};
 ch.assets.front_print=asset(ch.collection_id,ch.slug,'front_print',1055,1491);
 ch.assets.back_print=asset(ch.collection_id,ch.slug,'back_print',1055,1491);
 ch.assets.coloring=asset(ch.collection_id,ch.slug,'coloring',1055,1491);
 ch.assets.coloring_back=asset(ch.collection_id,ch.slug,'coloring_back',1055,1491);
 ch.source_mode='app_v2.7_corrected_printables';
}

const ocean=[
 ['SQ051','ollie','Ollie Pulpo'],
 ['SQ052','bibi','Bibi Ballena'],
 ['SQ053','timo','Timo Tiburón'],
 ['SQ054','mimi','Mimi Medusa'],
 ['SQ055','tuki','Tuki Tortuga'],
 ['SQ056','cora','Cora Caballito'],
 ['SQ057','pufi','Pufi Pez Globo'],
 ['SQ058','nori','Nori Narval'],
 ['SQ059','lumi','Lumi Estrella de Mar'],
 ['SQ060','kiko','Kiko Cangrejo']
];
if(!LIB.collections.some(c=>c.id==='ocean_buddies')){
 LIB.collections.push({id:'ocean_buddies',name:'Ocean Buddies',order:6,status:'approved',character_count:10,theme:'mundo marino kawaii',preview:path('ocean_buddies','ollie','hero'),route:'#/collection/ocean_buddies'});
}
for(let i=0;i<ocean.length;i++){
 const [code,slug,name]=ocean[i],id=`ocean_buddies_${slug}`;
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
 LIB.characters.push({id,code,slug,name,collection_id:'ocean_buddies',collection:'Ocean Buddies',order:i+1,category:'mundo marino',tags:['océano','mar','kawaii','paper squishy'],difficulty:'fácil',suggested_size:'10-14 cm',status:'approved',featured:[0,1,4,7].includes(i),editor_ready:true,assets,source_mode:'app_v2.7_ocean_buddies',missing:[],actions:['view','print_front','print_back','color','tutorial','favorite','use_in_editor']});
}
LIB.library_version='P2.7';
LIB.asset_contract_version='1.1';
LIB.asset_keys=['hero','front_print','back_print','coloring','coloring_back','editor_asset','character_card','tutorial','mockup'];
LIB.catalog_totals={collections:6,characters:60,views_per_character:9};
LIB.collections.sort((a,b)=>(a.order||0)-(b.order||0));
window.PS_THUMBS=Object.fromEntries((LIB.characters||[]).map(ch=>[ch.id,ch.assets?.hero?.path||'']));
window.PS_EDITOR_ASSETS=Object.fromEntries((LIB.characters||[]).map(ch=>[ch.id,ch.assets?.editor_asset?.path||'']));
})();
