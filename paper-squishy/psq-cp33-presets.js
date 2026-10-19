(()=>{
'use strict';
if(window.PSQ_CP33?.active)return;
const LIB=window.PS_LIBRARY;
if(!LIB||!Array.isArray(LIB.characters)||!Array.isArray(LIB.collections)){console.warn('[CP3.3] Catálogo no disponible');return;}
const chars=LIB.characters.filter(c=>c&&c.id&&c.assets?.editor_asset?.path);
const collections=LIB.collections.filter(c=>chars.some(x=>x.collection_id===c.id)).sort((a,b)=>(a.order||0)-(b.order||0));
const q=(s,root=document)=>root.querySelector(s);
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let col='all',term='',selected=chars[0]?.id||'';
const style=document.createElement('style');
style.id='cp33-style';
style.textContent=[
'#cp33Trigger{position:fixed;z-index:8990;right:16px;bottom:18px;border:2px solid #30241f;border-radius:999px;background:#ffd665;color:#30241f;box-shadow:0 9px 28px #30241f38;padding:12px 18px;font:900 13px system-ui;cursor:pointer}',
'#cp33Mask{position:fixed;inset:0;z-index:8995;background:#1b1418b8;display:none;align-items:center;justify-content:center;padding:14px;font-family:system-ui,Arial,sans-serif;color:#34251f}',
'#cp33Mask.on{display:flex}#cp33Panel{width:min(1260px,100%);max-height:min(92vh,900px);display:flex;flex-direction:column;overflow:hidden;border-radius:25px;background:#fffaf3;box-shadow:0 28px 90px #0005}',
'.cp33-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:17px 24px;border-bottom:1px solid #eddccf}',
'.cp33-head h2{font-size:clamp(18px,2.6vw,27px);line-height:1.1;margin:3px 0 0}.cp33-label{font:900 10px system-ui;letter-spacing:.12em;color:#a65542}',
'.cp33-close{border:1px solid #d4c4b7;background:#fff;border-radius:12px;padding:9px 14px;font-weight:800;cursor:pointer}',
'.cp33-body{padding:16px 22px 22px;overflow:auto}.cp33-toolbar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:12px}',
'.cp33-toolbar input{flex:1;min-width:150px;padding:11px 13px;font-size:14px;border:1px solid #d9c7b8;border-radius:12px;background:#fff}',
'.cp33-colls{display:flex;gap:6px;overflow-x:auto;padding:2px 0 12px}.cp33-colls button{flex-shrink:0;border:1px solid #d7c1b1;background:#fff;border-radius:999px;padding:8px 12px;cursor:pointer;font:800 12px system-ui}',
'.cp33-colls button.active{background:#30241f;color:white;border-color:#30241f}',
'.cp33-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,310px);gap:20px}.cp33-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(138px,1fr));gap:10px;align-content:start}',
'.cp33-card{display:flex;flex-direction:column;align-items:center;gap:6px;min-height:182px;padding:10px;border:2px solid #f0e3d6;border-radius:17px;background:#fff;cursor:pointer;text-align:center;color:#34251f}',
'.cp33-card.active{border-color:#fd947a;background:#fff5ec}.cp33-card img{width:100%;height:120px;object-fit:contain;border-radius:9px}.cp33-card b{font-size:12px;line-height:1.2}.cp33-card small{font-size:10px;color:#886d5e}',
'.cp33-preview{align-self:start;position:sticky;top:0;border:1px solid #edddcb;background:#fff;border-radius:20px;padding:16px;text-align:center}.cp33-preview img{display:block;object-fit:contain;max-width:100%;height:260px;margin:0 auto 9px}.cp33-preview h3{margin:7px 0 4px;font-size:21px}',
'.cp33-preview small{display:block;color:#856f60;margin-bottom:12px}.cp33-action{display:block;width:100%;border:2px solid #30241f;background:#ffd665;color:#30241f;padding:12px 8px;border-radius:12px;cursor:pointer;font:900 12px system-ui}',
'.cp33-secondary{display:block;width:100%;margin-top:8px;border:1px solid #d8c7b9;background:#fff;color:#34251f;padding:10px 8px;border-radius:11px;cursor:pointer;font:800 12px system-ui}',
'.cp33-foot{border-top:1px solid #edddcb;padding:10px 22px;font-size:11px;color:#7e6b5f}.cp33-empty{padding:24px;font-size:13px;color:#785f50}.cp33-result{font-size:11px;color:#876c59}',
'@media(max-width:760px){.cp33-head{padding:12px 15px}.cp33-body{padding:12px}.cp33-layout{grid-template-columns:1fr}.cp33-preview{position:static;order:-1}.cp33-preview img{height:150px}.cp33-cards{grid-template-columns:repeat(2,minmax(0,1fr))}.cp33-card img{height:100px}#cp33Trigger{bottom:10px;right:10px;font-size:11px;padding:11px}}',
'@media print{#cp33Mask,#cp33Trigger{display:none!important}}'
].join('');
document.head.appendChild(style);
const trigger=document.createElement('button');
trigger.id='cp33Trigger';trigger.type='button';trigger.textContent='✦ Creator Plus · PRESETS';document.body.appendChild(trigger);
const mask=document.createElement('div');mask.id='cp33Mask';
mask.innerHTML='<div id="cp33Panel" role="dialog" aria-modal="true" aria-label="Presets Creator Plus"><div class="cp33-head"><div><div class="cp33-label">CP3.3 · PRUEBA PRIVADA</div><h2>Presets con personajes reales</h2></div><button class="cp33-close" id="cp33Close" type="button">Cerrar ×</button></div><div class="cp33-body"><div class="cp33-toolbar"><input id="cp33Search" type="search" placeholder="Buscar personaje..." aria-label="Buscar personaje"><span class="cp33-result" id="cp33Count"></span></div><div class="cp33-colls" id="cp33Colls"></div><div class="cp33-layout"><div class="cp33-cards" id="cp33Cards"></div><aside class="cp33-preview" id="cp33Preview"></aside></div></div><div class="cp33-foot">Prueba aislada · no se modifican las ilustraciones originales · carga el asset del personaje en el editor.</div></div>';
document.body.appendChild(mask);
function currentChoices(){return chars.filter(c=>(col==='all'||c.collection_id===col)&&(!term||(c.name+' '+c.slug+' '+c.collection_id).toLowerCase().includes(term)))}
function draw(){
 const available=currentChoices();if(!available.some(c=>c.id===selected)&&available.length)selected=available[0].id;
 q('#cp33Count').textContent=available.length+' de '+chars.length+' personajes';
 q('#cp33Colls').innerHTML=[{id:'all',name:'Todas'},...collections].map(c=>'<button type="button" data-col="'+safe(c.id)+'" class="'+(col===c.id?'active':'')+'">'+safe(c.name)+'</button>').join('');
 q('#cp33Cards').innerHTML=available.length?available.map(c=>'<button type="button" class="cp33-card '+(c.id===selected?'active':'')+'" data-character="'+safe(c.id)+'"><img loading="lazy" src="'+safe(c.assets?.hero?.path||c.assets.editor_asset.path)+'" alt=""><b>'+safe(c.name)+'</b><small>'+safe(collections.find(x=>x.id===c.collection_id)?.name||c.collection||'')+'</small></button>').join(''):'<div class="cp33-empty">No hay personajes para esa búsqueda.</div>';
 const c=available.find(c=>c.id===selected);
 q('#cp33Preview').innerHTML=c?'<img src="'+safe(c.assets.editor_asset.path)+'" alt="Asset editable de '+safe(c.name)+'"><h3>'+safe(c.name)+'</h3><small>'+safe(collections.find(x=>x.id===c.collection_id)?.name||c.collection||'')+' · Archivo de editor</small><button class="cp33-action" data-use="'+safe(c.id)+'">USAR ESTE PRESET EN CREATOR PLUS →</button><button class="cp33-secondary" data-gallery="'+safe(c.id)+'">Ver las 9 vistas del personaje</button>':'<p>Seleccioná un personaje para continuar.</p>';
}
function close(){mask.classList.remove('on')}
function open(){draw();mask.classList.add('on')}
function useCharacter(id){
 const c=chars.find(x=>x.id===id),src=c?.assets?.editor_asset?.path;
 if(!src){alert('Este personaje no tiene imagen de editor disponible.');return}
 try{
  if(typeof show!=='function'||typeof loadBase!=='function')throw new Error('No encontré el editor original de la fábrica.');
  if(typeof editor!=='undefined'&&editor&&typeof editor==='object')editor.baseSrc=src;
  show('editor');loadBase(src);
  window.PSQ_CP33.lastTest={id:c.id,asset:src,opened:true,at:new Date().toISOString()};
  close();
 }catch(e){console.error('[CP3.3] Error al abrir preset',e);alert('No pude abrir el preset en Creator Plus: '+(e.message||e));}
}
trigger.addEventListener('click',open);
q('#cp33Close').addEventListener('click',close);
mask.addEventListener('click',e=>{if(e.target===mask)close();const b=e.target.closest('button');if(!b)return;
 if(b.dataset.col!==undefined){col=b.dataset.col;draw()}
 if(b.dataset.character){selected=b.dataset.character;draw()}
 if(b.dataset.use)useCharacter(b.dataset.use);
 if(b.dataset.gallery){close();if(window.PSQ_V28?.open)window.PSQ_V28.open(b.dataset.gallery,5);else alert('Galería no disponible.')}
});
q('#cp33Search').addEventListener('input',e=>{term=String(e.target.value||'').trim().toLowerCase();draw()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mask.classList.contains('on'))close()});
window.PSQ_CP33={active:true,version:'3.3-staging',characters:chars.length,collections:collections.length,lastTest:null,open,close};
console.info('[CP3.3] Presets reales montados',window.PSQ_CP33);
})();