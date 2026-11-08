/* BM20-F9 · Preparación nativa. No publicar en factory.html sin QA. */
(()=>{'use strict';
const BASE='https://fzbndgfnqxcacsvlitui.supabase.co/storage/v1/object/public/paper-squishy-assets/v2.9/butter_mania/';
const CATALOG_URL='./butter-mania/butter_mania_catalog_staging.json';
async function install(){
 const lib=window.PS_LIBRARY;if(!lib||!Array.isArray(lib.collections)||!Array.isArray(lib.characters))throw Error('Falta biblioteca original');
 if(lib.collections.some(x=>x.id==='butter_mania'))return {status:'already_installed'};
 const res=await fetch(CATALOG_URL,{cache:'no-store'});if(!res.ok)throw Error('Catálogo no disponible '+res.status);
 const json=await res.json();if(json.id!=='butter_mania'||json.characters?.length!==20)throw Error('Catálogo incompleto');
 const checks=['bm01/hero.webp','bm03/editor_asset.webp','bm20/coloring_back.webp'];
 for(const path of checks){const r=await fetch(BASE+path,{method:'HEAD',cache:'no-store'});if(!r.ok)throw Error('Recurso no publicado '+path+' ('+r.status+')')}
 const nextCollections=[...lib.collections,{id:json.id,name:json.name,order:json.order,status:'staging',character_count:20,theme:json.theme,preview:json.preview,route:json.route}].sort((a,b)=>(a.order||0)-(b.order||0));
 const origLen=lib.characters.length;for(const ch of json.characters){if(lib.characters.some(x=>x.id===ch.id))throw Error('ID duplicado '+ch.id)}
 lib.collections.splice(0,lib.collections.length,...nextCollections);lib.characters.push(...json.characters);
 lib.catalog_totals={...(lib.catalog_totals||{}),collections:lib.collections.length,characters:lib.characters.length,views_per_character:9};
 const thumbs=window.PS_THUMBS||(window.PS_THUMBS={});const editors=window.PS_EDITOR_ASSETS||(window.PS_EDITOR_ASSETS={});
 for(const ch of json.characters){thumbs[ch.id]=ch.assets.hero.path;editors[ch.id]=ch.assets.editor_asset.path;}
 window.PSQ_BM20_INTEGRATION={ready:true,baseCharacters:origLen,totalCharacters:lib.characters.length,release:'BM20-F9-STAGING',editorEnabled:false};
 try{if(typeof window.renderCollections==='function')window.renderCollections()}catch(error){console.warn('BM20 renderCollections',error)}
 document.dispatchEvent(new CustomEvent('psq:catalogupdated',{detail:{id:'butter_mania',count:20}}));
 return window.PSQ_BM20_INTEGRATION;
}
// No auto-run by default: staging QA or developer calls PSQ_BM20_INSTALL() after stable catalogue.
window.PSQ_BM20_INSTALL=install;
})();
