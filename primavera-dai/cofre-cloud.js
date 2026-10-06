(()=>{
'use strict';
const API='https://awuzunqfsbqyjsxlkdsb.supabase.co/functions/v1/cofre-api';
const SPACE='fcc9beca-9f9f-41cd-98e7-ab84645f5f65';
const KEY_STORAGE='primavera-dai-cloud-key-v1';
const MIGRATION_PREFIX='primavera-dai-cloud-uploaded-';

const $=id=>document.getElementById(id);
const esc=s=>(s??'').toString().replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pretty=d=>{if(!d)return'SIN FECHA';const p=String(d).split('-');return p.length===3?`${p[2]}·${p[1]}·${p[0]}`:d;};
const iconFor=t=>t&&t.startsWith('image/')?'🖼':t&&t.startsWith('video/')?'🎬':t==='application/pdf'?'📄':'📦';

function readKey(){
  try{return localStorage.getItem(KEY_STORAGE)||''}catch(e){return''}
}
function saveKey(v){try{localStorage.setItem(KEY_STORAGE,v)}catch(e){}}
function consumeHash(){
  try{
    const h=new URLSearchParams(location.hash.replace(/^#/,''));
    const k=h.get('k');
    if(k){saveKey(k);history.replaceState(null,'',location.pathname+location.search);return k;}
  }catch(e){}
  return readKey();
}
function headers(key,json=false){
  const h={'x-cofre-space':SPACE,'x-cofre-key':key};
  if(json)h['Content-Type']='application/json';
  return h;
}
async function api(key,opts={}){
  const r=await fetch(API,{...opts,headers:{...(opts.headers||{}),...headers(key,!!opts.json)}});
  const data=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(data.error||`Error ${r.status}`);
  return data;
}
function status(text,kind='ok'){
  const el=$('cloudStatus'); if(!el)return;
  el.textContent=text; el.dataset.kind=kind;
}
function addCloudShell(){
  const mail=document.querySelector('.mail'); if(!mail)return null;
  const bar=document.createElement('div');
  bar.className='cloudBar';
  bar.innerHTML='<div><b>☁ COFRE COMPARTIDO</b><span id="cloudStatus">Conectando…</span></div><button id="shareCofre" type="button">🔗 COMPARTIR</button>';
  mail.insertBefore(bar,mail.firstChild);
  const oldGallery=$('gallery');
  if(oldGallery) oldGallery.style.display='none';
  const cloudGallery=document.createElement('div');
  cloudGallery.id='cloudGallery';
  if(oldGallery) oldGallery.insertAdjacentElement('afterend',cloudGallery); else mail.appendChild(cloudGallery);
  return cloudGallery;
}
function accessPanel(onConnect){
  const g=$('cloudGallery'); if(!g)return;
  g.innerHTML='<div class="cloudAccess"><b>🔐 ACCESO AL COFRE</b><p>Ingresá el código compartido una sola vez en este dispositivo.</p><input id="cloudKeyInput" type="password" autocomplete="off" placeholder="Código del cofre"><button id="cloudConnect" type="button">ENTRAR AL COFRE</button><span id="cloudAccessMsg"></span></div>';
  $('cloudConnect')?.addEventListener('click',()=>onConnect(($('cloudKeyInput')?.value||'').trim()));
}
function groupItems(items){
  const map=new Map();
  for(const m of items){
    const trip=(m.trip||'SALIDA').trim()||'SALIDA';
    const date=m.event_date||'';
    const key=`${trip}|${date}`;
    if(!map.has(key))map.set(key,{trip,date,items:[]});
    map.get(key).items.push(m);
  }
  return [...map.values()];
}
async function renderCloud(key){
  const g=$('cloudGallery'); if(!g)return;
  status('Sincronizando…','busy');
  const data=await api(key,{method:'GET'});
  const groups=groupItems(data.items||[]);
  g.innerHTML='';
  if(!groups.length){
    g.innerHTML='<div class="cloudEmpty">Todavía no hay recuerdos en la nube.</div>';
    status('Sincronizado · 0 recuerdos');
    return;
  }
  groups.forEach(group=>{
    const section=document.createElement('section'); section.className='cloudFolder';
    const head=document.createElement('div'); head.className='cloudFolderHead';
    head.innerHTML=`<button class="cloudFolderToggle" type="button"><span class="folderIcon">📁</span><span><strong>${esc(group.trip)}</strong><small>${pretty(group.date)} · ${group.items.length} archivo${group.items.length===1?'':'s'}</small></span><i>ABRIR</i></button><button class="cloudEdit" type="button">✎</button>`;
    const body=document.createElement('div'); body.className='cloudFolderBody'; body.hidden=true;
    group.items.forEach(item=>{
      const row=document.createElement('div'); row.className='cloudMemory';
      const media=document.createElement('a'); media.className='cloudThumb'; media.href=item.url||'#'; media.target='_blank'; media.rel='noopener';
      if(item.mime_type?.startsWith('image/')&&item.url){const img=document.createElement('img');img.src=item.url;img.alt=item.file_name||'recuerdo';media.appendChild(img);}else media.textContent=iconFor(item.mime_type);
      const info=document.createElement('div'); info.className='cloudInfo'; info.innerHTML=`<span>${pretty(item.event_date)}</span><b title="${esc(item.file_name)}">${esc(item.file_name)}</b>`;
      const del=document.createElement('button'); del.className='cloudDelete'; del.type='button'; del.textContent='×'; del.title='Borrar recuerdo';
      del.addEventListener('click',async e=>{e.stopPropagation();if(!confirm('¿Borrar este recuerdo de la nube?'))return;del.disabled=true;try{await api(key,{method:'DELETE',url:'',headers:{},});await fetch(`${API}?id=${encodeURIComponent(item.id)}`,{method:'DELETE',headers:headers(key)}).then(async r=>{if(!r.ok){const d=await r.json().catch(()=>({}));throw new Error(d.error||'No pude borrar')}});await renderCloud(key);}catch(err){alert(err.message);del.disabled=false;}});
      row.append(media,info,del); body.appendChild(row);
    });
    const toggle=head.querySelector('.cloudFolderToggle');
    toggle.addEventListener('click',()=>{const open=body.hidden;body.hidden=!open;head.querySelector('.folderIcon').textContent=open?'📂':'📁';head.querySelector('i').textContent=open?'CERRAR':'ABRIR';section.classList.toggle('open',open);});
    head.querySelector('.cloudEdit').addEventListener('click',async e=>{e.stopPropagation();const nextTrip=prompt('Nombre de la salida:',group.trip);if(nextTrip===null)return;const nextDate=prompt('Fecha (AAAA-MM-DD):',group.date||'');if(nextDate===null)return;try{await api(key,{method:'PATCH',json:true,body:JSON.stringify({action:'update_group',from_trip:group.trip,from_date:group.date,to_trip:nextTrip.trim()||'SALIDA',to_date:nextDate.trim()})});await renderCloud(key);}catch(err){alert(err.message);}});
    section.append(head,body); g.appendChild(section);
  });
  status(`Sincronizado · ${data.items.length} recuerdo${data.items.length===1?'':'s'}`);
}
async function uploadFile(key,file,trip,date){
  const form=new FormData(); form.append('file',file,file.name); form.append('trip',trip||'SALIDA'); form.append('event_date',date||'');
  const r=await fetch(API,{method:'POST',headers:headers(key),body:form});
  const data=await r.json().catch(()=>({})); if(!r.ok)throw new Error(data.error||'No pude subir el archivo'); return data;
}
function openLocalDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open('primavera-dai',1);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);req.onupgradeneeded=()=>{};});}
async function migrateLocal(key){
  try{
    const db=await openLocalDB(); if(!db.objectStoreNames.contains('mem'))return;
    const items=await new Promise((resolve,reject)=>{const tx=db.transaction('mem','readonly');const q=tx.objectStore('mem').getAll();q.onsuccess=()=>resolve(q.result||[]);q.onerror=()=>reject(q.error);});
    if(!items.length)return;
    status('Subiendo recuerdos locales…','busy');
    for(const item of items){
      const marker=MIGRATION_PREFIX+item.id;
      try{if(localStorage.getItem(marker)==='1')continue}catch(e){}
      if(!item.blob)continue;
      let trip=item.trip||'SALIDA'; let date=item.date||'';
      if(!item.trip && item.date==='2026-10-03'){trip='CERVELAR';date='2026-10-02';}
      const file=item.blob instanceof File?item.blob:new File([item.blob],item.name||'recuerdo.jpg',{type:item.type||item.blob.type||'application/octet-stream'});
      await uploadFile(key,file,trip,date);
      try{localStorage.setItem(marker,'1')}catch(e){}
    }
  }catch(e){console.warn('Migración local pendiente',e);}
}
function wireUpload(key){
  const input=$('mfile'), oldSave=$('save'), oldClear=$('clear');
  if(!input||!oldSave)return;
  const save=oldSave.cloneNode(true); oldSave.replaceWith(save); save.id='save'; save.disabled=!input.files?.length;
  input.addEventListener('change',()=>{save.disabled=!input.files?.length;});
  save.addEventListener('click',async()=>{
    const files=[...(input.files||[])]; if(!files.length)return;
    const trip=($('mtitle')?.value||'SALIDA').trim()||'SALIDA'; const date=$('mdate')?.value||'';
    save.disabled=true; status(`Subiendo ${files.length} archivo${files.length===1?'':'s'}…`,'busy');
    try{for(const f of files)await uploadFile(key,f,trip,date);input.value='';if($('pending'))$('pending').textContent='Todavía no seleccionaste archivos.';await renderCloud(key);}catch(err){alert(err.message);save.disabled=false;}
  });
  if(oldClear){const clear=oldClear.cloneNode(true);oldClear.replaceWith(clear);clear.id='clear';clear.addEventListener('click',async()=>{if(!confirm('¿Borrar TODOS los recuerdos compartidos del Cofre?'))return;try{await api(key,{method:'POST',json:true,body:JSON.stringify({action:'clear'})});await renderCloud(key);}catch(err){alert(err.message);}});}
}
async function boot(){
  addCloudShell();
  let key=consumeHash();
  const connect=async candidate=>{if(!candidate)return;try{status('Validando acceso…','busy');await api(candidate,{method:'GET'});saveKey(candidate);key=candidate;await startCloud(key);}catch(err){const msg=$('cloudAccessMsg');if(msg)msg.textContent=err.message;status('Sin conexión','err');}};
  async function startCloud(k){wireUpload(k);await migrateLocal(k);await renderCloud(k);$('shareCofre')?.addEventListener('click',async()=>{const link=`${location.origin}${location.pathname}#k=${encodeURIComponent(k)}`;try{await navigator.clipboard.writeText(link);status('Link de acceso copiado');}catch(e){prompt('Copiá este link para compartir:',link);}});}
  if(!key){status('Falta código','err');accessPanel(connect);return;}
  try{await startCloud(key);}catch(err){try{localStorage.removeItem(KEY_STORAGE)}catch(e){};status('Código inválido','err');accessPanel(connect);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();