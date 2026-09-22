function wireP18Backup(){
 const exp=q('sceneLibraryExport'),imp=q('sceneLibraryImport');
 if(exp)exp.onclick=()=>{
  let scenes=[];try{scenes=JSON.parse(localStorage.getItem('vincores_scene_library_v1')||'[]')}catch{}
  const payload={type:'VINCORES_BACKUP',version:2,exportedAt:new Date().toISOString(),scenes,p18Sessions:readStore()};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='vincores-respaldo-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1200)
 };
 if(imp)imp.onchange=async e=>{
  const f=e.target.files?.[0];if(!f)return;
  try{
   const p=JSON.parse(await f.text());if(p?.type!=='VINCORES_BACKUP'||!Array.isArray(p.scenes))throw new Error('Archivo de respaldo no válido.');
   if(!confirm('¿Importar '+p.scenes.length+' escenas? Se combinarán con las actuales.'))return;
   let lib=[];try{lib=JSON.parse(localStorage.getItem('vincores_scene_library_v1')||'[]')}catch{}
   const ids=new Set(lib.map(x=>x.id)),map={};
   for(const raw of p.scenes){const x=JSON.parse(JSON.stringify(raw)),old=x.id||('legacy-'+Math.random());if(!x.id||ids.has(x.id))x.id='sc-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);ids.add(x.id);map[old]=x.id;lib.push(x)}
   localStorage.setItem('vincores_scene_library_v1',JSON.stringify(lib));
   if(p.p18Sessions&&typeof p.p18Sessions==='object'){
    const sessions=readStore();for(const [old,val] of Object.entries(p.p18Sessions)){const key=map[old]||old;if(!sessions[key])sessions[key]=val}localStorage.setItem(STORE,JSON.stringify(sessions))
   }
   showToast?.('Respaldo importado');q('sceneLibraryOverlay')?.classList.remove('open');setTimeout(()=>q('loadBtn')?.click(),120)
  }catch(err){alert(err.message||'No pude importar el respaldo.')}finally{e.target.value=''}
 }
}
