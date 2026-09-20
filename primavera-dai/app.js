(()=>{
'use strict';
function init(){
 const $=id=>document.getElementById(id);
 const screens=[...document.querySelectorAll('.screen')];
 const A={pop:$('pop'),cumbia:$('cumbia'),comp:$('comp')};
 const names={pop:'NO SUPE · POP',cumbia:'NO SUPE · CUMBIA',comp:'COMPAÑEROS DE VERDAD'};
 let current=null,code='',planted=false,pending=[];
 const music=$('music'),pp=$('pp'),ml=$('ml'),stop=$('stop');
 const show=id=>{screens.forEach(s=>s.classList.toggle('on',s.id===id)); window.scrollTo({top:0,left:0,behavior:'auto'});};
 const pauseCurrent=()=>{if(current&&A[current]){A[current].pause(); if(pp)pp.textContent='▶'; if(ml)ml.textContent=names[current]+' · PAUSA';}};
 const stopAll=()=>{Object.values(A).forEach(a=>{if(!a)return; a.pause(); try{a.currentTime=0}catch(e){}});current=null;if(pp)pp.textContent='▶';if(ml)ml.textContent='MÚSICA PARADA';};
 async function play(k,restart=false){
   const a=A[k]; if(!a)return false;
   Object.entries(A).forEach(([x,other])=>{if(x!==k&&other)other.pause();});
   if(restart){try{a.currentTime=0}catch(e){}}
   a.volume=.52; current=k;
   if(music)music.style.display='flex'; if(ml)ml.textContent=names[k]; if(pp)pp.textContent='⏸';
   try{await a.play();return true}catch(err){if(pp)pp.textContent='▶';if(ml)ml.textContent=names[k]+' · TOCÁ ▶';return false;}
 }
 const start=$('start'); if(start)start.addEventListener('click',async()=>{await play('pop');show('s2');});
 if(pp)pp.addEventListener('click',async()=>{if(!current){await play('pop');return;} const a=A[current]; if(a.paused)await play(current); else pauseCurrent();});
 if(stop)stop.addEventListener('click',stopAll);
 document.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.next==='s3')pauseCurrent();show(b.dataset.next);}));
 const unlock=$('unlock'); if(unlock)unlock.addEventListener('click',()=>{pauseCurrent();show('s4');});
 const backCass=$('backCass'); if(backCass)backCass.addEventListener('click',()=>show('s3'));
 const upd=()=>['d1','d2','d3','d4'].forEach((x,i)=>{const el=$(x);if(el)el.textContent=code[i]||'_';});
 const keys=$('keys'),msg=$('msg');
 function check(){
   if(code==='0105'){
     if(msg)msg.textContent='ACCESS GRANTED ♥';
     const cass=$('cass'),lock=$('lock'),cassNext=$('cassNext');
     if(cass)cass.classList.add('unlocked'); if(lock)lock.textContent='UNLOCKED ♥'; if(unlock)unlock.style.display='none'; if(cassNext)cassNext.style.display='inline-block';
     setTimeout(async()=>{show('s3');await play('comp',true);},450);
   }else{
     if(msg)msg.textContent='NO ES ESA FECHA…';
     setTimeout(()=>{code='';upd();if(msg)msg.textContent='';},750);
   }
 }
 if(keys)[1,2,3,4,5,6,7,8,9,'C',0,'↵'].forEach(k=>{const b=document.createElement('button');b.type='button';b.textContent=k;b.addEventListener('click',()=>{if(k==='C'){code='';upd();if(msg)msg.textContent='';return;}if(k==='↵'){check();return;}if(code.length<4){code+=String(k);upd();}if(code.length===4)setTimeout(check,150);});keys.appendChild(b);});
 const cassNext=$('cassNext'); if(cassNext)cassNext.addEventListener('click',async()=>{if(A.comp){A.comp.pause();try{A.comp.currentTime=0}catch(e){}}show('s5');await play('cumbia',true);});
 const toFlower=$('toFlower'); if(toFlower)toFlower.addEventListener('click',()=>{pauseCurrent();show('s8');});
 const grow=$('grow'),flower=$('flower'),toFinal=$('toFinal');
 if(grow)grow.addEventListener('click',()=>{if(planted)return;planted=true;if(flower)flower.classList.add('go');grow.disabled=true;grow.textContent='🌸 FLORECIENDO…';setTimeout(()=>{grow.style.display='none';if(toFinal)toFinal.style.display='inline-block';},3300);});
 if(toFinal)toFinal.addEventListener('click',()=>{stopAll();show('s9');});
 const backFinal=$('backFinal');if(backFinal)backFinal.addEventListener('click',()=>show('s8'));
 const modal=$('modal');
 const home=$('home');if(home)home.addEventListener('click',()=>{stopAll();code='';upd();if(msg)msg.textContent='';const cass=$('cass'),lock=$('lock');if(cass)cass.classList.remove('unlocked');if(lock)lock.textContent='LOCKED 🔒';if(unlock)unlock.style.display='inline-block';if(cassNext)cassNext.style.display='none';planted=false;if(flower)flower.classList.remove('go');if(grow){grow.style.display='inline-block';grow.disabled=false;grow.textContent='🌱 ¡HAGÁMOSLA FLORECER!';}if(toFinal)toFinal.style.display='none';if(modal)modal.classList.remove('open');show('s1');});
 const openChest=$('openChest'),close=$('close'),modalStop=$('modalStop');
 if(openChest)openChest.addEventListener('click',()=>{if(modal)modal.classList.add('open');});
 if(close)close.addEventListener('click',()=>{if(modal)modal.classList.remove('open');stopAll();});
 if(modal)modal.addEventListener('click',e=>{if(e.target===modal){modal.classList.remove('open');stopAll();}});
 document.querySelectorAll('.track').forEach(b=>b.addEventListener('click',()=>play(b.dataset.track,true)));
 if(modalStop)modalStop.addEventListener('click',stopAll);
 let db=null; const gallery=$('gallery'),mdate=$('mdate'),mfile=$('mfile'),up=$('up'),save=$('save'),clear=$('clear'),pendingBox=$('pending');
 const pretty=d=>{if(!d)return'SIN FECHA';const p=d.split('-');return p.length===3?`${p[2]}·${p[1]}·${p[0]}`:d;};
 const icon=f=>f&&f.type&&f.type.startsWith('image/')?'🖼':f&&f.type&&f.type.startsWith('audio/')?'🎵':f&&f.type&&f.type.startsWith('video/')?'🎬':'📦';
 if(mdate&&!mdate.value){const n=new Date(),local=new Date(n.getTime()-n.getTimezoneOffset()*60000).toISOString().slice(0,10);mdate.value=local;}
 function render(){if(!db||!gallery)return;const t=db.transaction('mem','readonly').objectStore('mem').getAll();t.onsuccess=()=>{const arr=(t.result||[]).sort((a,b)=>(b.date||'').localeCompare(a.date||''));gallery.innerHTML=arr.length?'':'<div class="pending">Todavía no hay recuerdos guardados.</div>';arr.forEach(m=>{const row=document.createElement('div');row.className='memory';const th=document.createElement('div');th.className='thumb';if(m.type&&m.type.startsWith('image/')&&m.blob){const im=document.createElement('img');im.src=URL.createObjectURL(m.blob);th.appendChild(im);}else th.textContent=icon(m);const info=document.createElement('div');const dt=document.createElement('div');dt.className='mdate';dt.textContent=pretty(m.date);const nm=document.createElement('span');nm.className='mname';nm.textContent=m.name||'archivo';info.append(dt,nm);const del=document.createElement('button');del.type='button';del.className='del';del.textContent='×';del.addEventListener('click',()=>{const q=db.transaction('mem','readwrite').objectStore('mem').delete(m.id);q.onsuccess=render;});row.append(th,info,del);gallery.appendChild(row);});};}
 try{if('indexedDB'in window){const req=indexedDB.open('primavera-dai',1);req.onupgradeneeded=e=>{const d=e.target.result;if(!d.objectStoreNames.contains('mem'))d.createObjectStore('mem',{keyPath:'id'});};req.onsuccess=e=>{db=e.target.result;render();};req.onerror=()=>{if(pendingBox)pendingBox.textContent='El buzón no está disponible en este navegador.';};}}catch(e){}
 if(up&&mfile)up.addEventListener('click',()=>mfile.click());
 if(mfile)mfile.addEventListener('change',e=>{pending=[...(e.target.files||[])];if(pendingBox)pendingBox.innerHTML=pending.length?pending.map(f=>`${icon(f)} ${f.name}`).join('<br>'):'Todavía no seleccionaste archivos.';if(save)save.disabled=!pending.length;});
 if(save)save.addEventListener('click',()=>{if(!db||!pending.length)return;const st=db.transaction('mem','readwrite'),store=st.objectStore('mem'),date=mdate?mdate.value:'';pending.forEach(f=>store.put({id:(crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random()),date,name:f.name,type:f.type||'application/octet-stream',blob:f}));st.oncomplete=()=>{pending=[];if(mfile)mfile.value='';if(pendingBox)pendingBox.textContent='Todavía no seleccionaste archivos.';save.disabled=true;render();};});
 if(clear)clear.addEventListener('click',()=>{if(!db)return;if(confirm('¿Borrar todos los recuerdos del buzón? Las canciones y el poema no se tocan.')){const st=db.transaction('mem','readwrite'),r=st.objectStore('mem').clear();r.onsuccess=render;}});
 Object.entries(A).forEach(([k,a])=>{if(!a)return;a.addEventListener('error',()=>{if(music)music.style.display='flex';if(ml)ml.textContent=names[k]+' · ERROR DE AUDIO';});});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
