(()=>{
'use strict';
const DB_NAME='primavera-dai';
const STORE='mem';
const CERVELAR_FILES=new Set([
  'WhatsApp Image 2026-10-03 at 13.27.47 (1).jpeg',
  'WhatsApp Image 2026-10-03 at 13.27.47.jpeg',
  'WhatsApp Image 2026-10-03 at 13.27.48.jpeg'
]);
let db=null;
let busy=false;
let lastPendingNames=[];
let lastPendingDate='';
let lastPendingOuting='';
const $=id=>document.getElementById(id);
const pretty=d=>{if(!d)return'SIN FECHA';const p=d.split('-');return p.length===3?`${p[2]}·${p[1]}·${p[0]}`:d;};
const icon=m=>m&&m.type&&m.type.startsWith('image/')?'🖼':m&&m.type&&m.type.startsWith('audio/')?'🎵':m&&m.type&&m.type.startsWith('video/')?'🎬':'📦';
function openDb(){return new Promise((resolve,reject)=>{try{const r=indexedDB.open(DB_NAME,1);r.onsuccess=e=>resolve(e.target.result);r.onerror=reject;}catch(e){reject(e);}});}
function getAll(){return new Promise(resolve=>{if(!db)return resolve([]);const r=db.transaction(STORE,'readonly').objectStore(STORE).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>resolve([]);});}
function putAll(items){return new Promise(resolve=>{if(!db||!items.length)return resolve();const tx=db.transaction(STORE,'readwrite'),s=tx.objectStore(STORE);items.forEach(x=>s.put(x));tx.oncomplete=resolve;tx.onerror=resolve;});}
function del(id){return new Promise(resolve=>{if(!db)return resolve();const r=db.transaction(STORE,'readwrite').objectStore(STORE).delete(id);r.onsuccess=resolve;r.onerror=resolve;});}
function ensureOutingInput(){const mail=document.querySelector('.mail');const date=$('mdate');if(!mail||!date||$('outingName'))return;const wrap=document.createElement('label');wrap.className='outing-name-wrap';wrap.innerHTML='<span>NOMBRE DE LA SALIDA</span><input id="outingName" type="text" maxlength="48" placeholder="Ej.: CERVELAR">';mail.insertBefore(wrap,date.parentElement||date);}
async function migrateCervelar(){const arr=await getAll();const hits=arr.filter(m=>m.date==='2026-10-03'&&CERVELAR_FILES.has(m.name));if(hits.length!==3)return;let changed=false;hits.forEach(m=>{if(m.date!=='2026-10-02'||m.outing!=='CERVELAR'){m.date='2026-10-02';m.outing='CERVELAR';changed=true;}});if(changed)await putAll(hits);}
async function stampLatestSave(){if(!lastPendingNames.length)return;const arr=await getAll();const title=(lastPendingOuting||'SALIDA').trim()||'SALIDA';const matches=arr.filter(m=>lastPendingNames.includes(m.name)&&m.date===lastPendingDate&&(!m.outing||m.outing==='SALIDA'));if(matches.length){matches.forEach(m=>m.outing=title.toUpperCase());await putAll(matches);}lastPendingNames=[];}
async function editGroup(items){const currentTitle=(items[0].outing||'SALIDA').toUpperCase();const currentDate=items[0].date||'';const title=prompt('Nombre de la salida:',currentTitle);if(title===null)return;const date=prompt('Fecha (AAAA-MM-DD):',currentDate);if(date===null)return;items.forEach(m=>{m.outing=(title.trim()||'SALIDA').toUpperCase();m.date=date.trim()||currentDate;});await putAll(items);renderGrouped();}
async function renderGrouped(){if(busy||!db)return;busy=true;try{const gallery=$('gallery');if(!gallery)return;const arr=(await getAll()).sort((a,b)=>(b.date||'').localeCompare(a.date||''));gallery.innerHTML='';if(!arr.length){gallery.innerHTML='<div class="pending">Todavía no hay recuerdos guardados.</div>';return;}const groups=new Map();arr.forEach(m=>{const outing=(m.outing||'SALIDA').trim().toUpperCase();const key=`${m.date||''}__${outing}`;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(m);});for(const items of groups.values()){
 const folder=document.createElement('section');folder.className='outing-folder';
 const head=document.createElement('div');head.className='outing-head';
 const copy=document.createElement('div');const outing=(items[0].outing||'SALIDA').toUpperCase();copy.innerHTML=`<div class="outing-kicker">📁 SALIDA</div><div class="outing-title">${outing}</div><div class="outing-meta">${pretty(items[0].date)} · ${items.length} foto${items.length===1?'':'s'}</div>`;
 const edit=document.createElement('button');edit.type='button';edit.className='outing-edit';edit.textContent='✎ EDITAR SALIDA';edit.addEventListener('click',()=>editGroup(items));head.append(copy,edit);folder.appendChild(head);
 const grid=document.createElement('div');grid.className='outing-grid';
 items.forEach(m=>{const row=document.createElement('div');row.className='memory';const th=document.createElement('div');th.className='thumb';if(m.type&&m.type.startsWith('image/')&&m.blob){const im=document.createElement('img');im.src=URL.createObjectURL(m.blob);im.alt=m.name||'foto';th.appendChild(im);}else th.textContent=icon(m);const info=document.createElement('div');const nm=document.createElement('span');nm.className='mname';nm.textContent=m.name||'archivo';info.appendChild(nm);const x=document.createElement('button');x.type='button';x.className='del';x.textContent='×';x.title='Borrar esta foto';x.addEventListener('click',async()=>{await del(m.id);renderGrouped();});row.append(th,info,x);grid.appendChild(row);});folder.appendChild(grid);gallery.appendChild(folder);
 }
}finally{busy=false;}}
function wireSaveCapture(){const save=$('save'),file=$('mfile'),date=$('mdate');if(!save||!file)return;save.addEventListener('click',()=>{lastPendingNames=[...(file.files||[])].map(f=>f.name);lastPendingDate=date?date.value:'';lastPendingOuting=$('outingName')?$('outingName').value:'';setTimeout(async()=>{await stampLatestSave();renderGrouped();},220);},true);}
function watchGallery(){const g=$('gallery');if(!g)return;const mo=new MutationObserver(()=>{if(busy)return;if(g.querySelector('.outing-folder'))return;setTimeout(renderGrouped,40);});mo.observe(g,{childList:true});}
async function init(){if(!('indexedDB'in window))return;ensureOutingInput();wireSaveCapture();watchGallery();db=await openDb();await migrateCervelar();renderGrouped();const clear=$('clear');if(clear)clear.addEventListener('click',()=>setTimeout(renderGrouped,160));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0),{once:true});else setTimeout(init,0);
})();