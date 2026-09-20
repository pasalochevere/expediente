(()=>{
  const $ = id => document.getElementById(id);
  const screens = [...document.querySelectorAll('.screen')];
  const A = { pop:$('pop'), cumbia:$('cumbia'), comp:$('comp') };
  const names = { pop:'NO SUPE · POP', cumbia:'NO SUPE · CUMBIA', comp:'COMPAÑEROS DE VERDAD' };
  let current=null, code='', planted=false, pending=[], db=null;

  function show(id){
    screens.forEach(s=>s.classList.toggle('on',s.id===id));
    window.scrollTo({top:0,behavior:'auto'});
  }

  function musicStatus(text, icon='▶'){
    const bar=$('music'), label=$('ml'), btn=$('pp');
    if(bar) bar.style.display='flex';
    if(label) label.textContent=text;
    if(btn) btn.textContent=icon;
  }

  function stopAll(reset=true){
    Object.values(A).forEach(a=>{
      if(!a) return;
      try{ a.pause(); if(reset) a.currentTime=0; }catch(e){}
    });
    current=null;
    musicStatus('MÚSICA PARADA','▶');
  }

  function play(k,restart=false){
    const a=A[k];
    if(!a) return Promise.resolve(false);
    Object.entries(A).forEach(([x,other])=>{ if(x!==k && other) other.pause(); });
    try{ if(restart) a.currentTime=0; }catch(e){}
    a.volume=.52;
    current=k;
    musicStatus(names[k]+' · CARGANDO','⏳');
    let p;
    try{ p=a.play(); }catch(e){ musicStatus(names[k]+' · TOCÁ ▶','▶'); return Promise.resolve(false); }
    if(!p || typeof p.then!=='function'){ musicStatus(names[k],'⏸'); return Promise.resolve(true); }
    return p.then(()=>{ musicStatus(names[k],'⏸'); return true; }).catch(()=>{ musicStatus(names[k]+' · TOCÁ ▶','▶'); return false; });
  }

  const hero=$('heroPhoto');
  if(hero){
    hero.addEventListener('error',()=>{ hero.alt='Foto de Dai y Gas'; });
  }

  const start=$('start');
  if(start) start.addEventListener('click',()=>{
    show('s2');
    play('pop',false);
  });

  const pp=$('pp');
  if(pp) pp.addEventListener('click',()=>{
    if(!current) return void play('pop',false);
    const a=A[current];
    if(!a) return;
    if(a.paused) play(current,false);
    else { a.pause(); musicStatus(names[current]+' · PAUSA','▶'); }
  });
  const stop=$('stop'); if(stop) stop.addEventListener('click',()=>stopAll(true));

  document.querySelectorAll('[data-next]').forEach(b=>{
    b.addEventListener('click',()=>{
      const next=b.dataset.next;
      if(next==='s3' && current && A[current]){ A[current].pause(); musicStatus(names[current]+' · PAUSA','▶'); }
      show(next);
    });
  });

  const unlock=$('unlock'); if(unlock) unlock.addEventListener('click',()=>{
    if(current && A[current]) A[current].pause();
    show('s4');
  });
  const backCass=$('backCass'); if(backCass) backCass.addEventListener('click',()=>show('s3'));

  function upd(){ ['d1','d2','d3','d4'].forEach((x,i)=>{ const e=$(x); if(e) e.textContent=code[i]||'_'; }); }
  const keys=$('keys');
  if(keys){
    [1,2,3,4,5,6,7,8,9,'C',0,'↵'].forEach(k=>{
      const b=document.createElement('button'); b.textContent=k;
      b.addEventListener('click',()=>{
        if(k==='C'){ code=''; upd(); if($('msg')) $('msg').textContent=''; return; }
        if(k==='↵'){ check(); return; }
        if(code.length<4){ code+=String(k); upd(); }
        if(code.length===4) setTimeout(check,120);
      });
      keys.appendChild(b);
    });
  }

  function check(){
    const msg=$('msg');
    if(code==='0105'){
      if(msg) msg.textContent='ACCESS GRANTED ♥';
      const cass=$('cass'), lock=$('lock'), un=$('unlock'), next=$('cassNext');
      if(cass) cass.classList.add('unlocked');
      if(lock) lock.textContent='UNLOCKED ♥';
      if(un) un.style.display='none';
      if(next) next.style.display='inline-block';
      show('s3');
      play('comp',true);
    }else{
      if(msg) msg.textContent='NO ES ESA FECHA…';
      setTimeout(()=>{ code=''; upd(); if(msg) msg.textContent=''; },700);
    }
  }

  const cassNext=$('cassNext'); if(cassNext) cassNext.addEventListener('click',()=>{
    if(A.comp){ A.comp.pause(); try{A.comp.currentTime=0}catch(e){} }
    show('s5');
    play('cumbia',true);
  });

  const toFlower=$('toFlower'); if(toFlower) toFlower.addEventListener('click',()=>{
    if(A.cumbia) A.cumbia.pause();
    musicStatus('NO SUPE · CUMBIA · PAUSA','▶');
    show('s8');
  });

  const grow=$('grow'); if(grow) grow.addEventListener('click',()=>{
    if(planted) return; planted=true;
    const flower=$('flower'); if(flower) flower.classList.add('go');
    grow.disabled=true; grow.textContent='🌸 FLORECIENDO…';
    setTimeout(()=>{ grow.style.display='none'; const tf=$('toFinal'); if(tf) tf.style.display='inline-block'; },3300);
  });

  const toFinal=$('toFinal'); if(toFinal) toFinal.addEventListener('click',()=>{ stopAll(true); show('s9'); });
  const backFinal=$('backFinal'); if(backFinal) backFinal.addEventListener('click',()=>show('s8'));
  const home=$('home'); if(home) home.addEventListener('click',()=>{
    stopAll(true); code=''; upd(); if($('msg')) $('msg').textContent='';
    const cass=$('cass'); if(cass) cass.classList.remove('unlocked');
    if($('lock')) $('lock').textContent='LOCKED 🔒';
    if($('unlock')) $('unlock').style.display='inline-block';
    if($('cassNext')) $('cassNext').style.display='none';
    planted=false; if($('flower')) $('flower').classList.remove('go');
    if(grow){ grow.style.display='inline-block'; grow.disabled=false; grow.textContent='🌱 ¡HAGÁMOSLA FLORECER!'; }
    if(toFinal) toFinal.style.display='none';
    if($('modal')) $('modal').classList.remove('open');
    show('s1');
  });

  const modal=$('modal');
  const openChest=$('openChest'); if(openChest&&modal) openChest.addEventListener('click',()=>modal.classList.add('open'));
  const close=$('close'); if(close&&modal) close.addEventListener('click',()=>{modal.classList.remove('open');stopAll(true)});
  if(modal) modal.addEventListener('click',e=>{if(e.target===modal){modal.classList.remove('open');stopAll(true)}});
  document.querySelectorAll('.track').forEach(b=>b.addEventListener('click',()=>play(b.dataset.track,true)));
  const modalStop=$('modalStop'); if(modalStop) modalStop.addEventListener('click',()=>stopAll(true));

  const DB='primavera-dai', STORE='mem';
  try{
    const req=indexedDB.open(DB,1);
    req.onupgradeneeded=e=>{ if(!e.target.result.objectStoreNames.contains(STORE)) e.target.result.createObjectStore(STORE,{keyPath:'id'}); };
    req.onsuccess=e=>{ db=e.target.result; render(); };
  }catch(e){}
  const tx=(mode='readonly')=>db.transaction(STORE,mode).objectStore(STORE);
  const pretty=d=>{if(!d)return'SIN FECHA';const p=d.split('-');return p.length===3?`${p[2]}·${p[1]}·${p[0]}`:d};
  const icon=f=>f.type&&f.type.startsWith('image/')?'🖼':f.type&&f.type.startsWith('audio/')?'🎵':f.type&&f.type.startsWith('video/')?'🎬':'📦';
  const mdate=$('mdate'); if(mdate){const d=new Date();mdate.value=new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)}
  const up=$('up'), mfile=$('mfile'), save=$('save'), pendingBox=$('pending'), clear=$('clear'), gallery=$('gallery');
  if(up&&mfile) up.addEventListener('click',()=>mfile.click());
  if(mfile) mfile.addEventListener('change',e=>{pending=[...(e.target.files||[])];if(pendingBox)pendingBox.innerHTML=pending.length?pending.map(f=>`${icon(f)} ${f.name}`).join('<br>'):'Todavía no seleccionaste archivos.';if(save)save.disabled=!pending.length});
  if(save) save.addEventListener('click',()=>{
    if(!db||!pending.length)return;
    const st=tx('readwrite'),date=mdate?mdate.value:'';
    pending.forEach(f=>st.put({id:(crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random()),date,name:f.name,type:f.type||'application/octet-stream',blob:f}));
    st.transaction.oncomplete=()=>{pending=[];if(mfile)mfile.value='';if(pendingBox)pendingBox.textContent='Todavía no seleccionaste archivos.';save.disabled=true;render()};
  });
  if(clear) clear.addEventListener('click',()=>{if(db&&confirm('¿Borrar todos los recuerdos del buzón? Las canciones y el poema no se tocan.')){const r=tx('readwrite').clear();r.onsuccess=render}});
  function render(){
    if(!db||!gallery)return; const r=tx().getAll();
    r.onsuccess=()=>{const arr=r.result.sort((a,b)=>(b.date||'').localeCompare(a.date||''));gallery.innerHTML=arr.length?'':'<div class="pending">Todavía no hay recuerdos guardados.</div>';arr.forEach(m=>{const row=document.createElement('div');row.className='memory';const th=document.createElement('div');th.className='thumb';if(m.type&&m.type.startsWith('image/')){const im=document.createElement('img');im.src=URL.createObjectURL(m.blob);th.appendChild(im)}else th.textContent=icon(m);const info=document.createElement('div');info.innerHTML=`<div class="mdate">${pretty(m.date)}</div><span class="mname">${m.name}</span>`;const del=document.createElement('button');del.className='del';del.textContent='×';del.addEventListener('click',()=>{const q=tx('readwrite').delete(m.id);q.onsuccess=render});row.append(th,info,del);gallery.appendChild(row)})};
  }
})();