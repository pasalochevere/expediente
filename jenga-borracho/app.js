const D=window.JB_DATA;
const L={tranqui:0,sube:1,maximo:2};
const M={tranqui:['TRANQUI','g','#688d6c'],sube:['SUBE','o','#da8932'],maximo:['AL MÁXIMO','r','#bf5940']};
const K='pc.jb07.game',A='pc.jb07.age';
let G=null,S='home',O=null,P='tranqui',IMG_SET='',IMG_TOWER='';
const q=s=>document.querySelector(s);

async function loadAssets(){
  try{
    const [set64,tower64]=await Promise.all([
      fetch('product-set.b64').then(r=>r.ok?r.text():Promise.reject()),
      fetch('product-tower.b64').then(r=>r.ok?r.text():Promise.reject())
    ]);
    IMG_SET='data:image/webp;base64,'+set64.trim();
    IMG_TOWER='data:image/webp;base64,'+tower64.trim();
    R();
  }catch{}
}
function logo(){return'<div class="logo"><b>PASALO</b><b>CHEVERE</b><i>★</i></div>'}
function sh(){let a=[...Array(42)].map((_,i)=>i);for(let i=41;i;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function save(){G&&localStorage.setItem(K,JSON.stringify(G))}
function load(){try{return JSON.parse(localStorage.getItem(K))}catch{return null}}
function resume(){G=load();S='game';R();if(G&&G.timer&&G.timer.status==='run')tick()}
function newg(l){return{l,deck:sh(),i:0,rev:false,h:[],rules:[],timer:null,t:Date.now()}}
function card(){let s=G.deck[G.i],d=D[s];return{slot:s+1,text:d[L[G.l]],cat:d[3],tmp:!!d[4]}}
function start(l){G=newg(l);save();S='game';R()}
function next(skip=0){
  let c=card();
  G.h.push({...c,l:G.l,skip});
  if(c.tmp&&!skip){
    let tr=c.slot===35&&G.l==='maximo'?2:(c.slot===35||c.slot===36?1:null);
    G.rules.push({text:c.text,slot:c.slot,tr});
    if(G.rules.length>2)G.rules.shift();
  }
  G.i++;G.rev=false;G.timer=null;
  if(G.i>=42)S='done';
  save();R();
}
function age(){
  return`<section class="done">${logo()}<span class="over">CONTENIDO +18</span><h1>TORRE YENGA<br><em>BORRACHO</em></h1><p>Incluye consignas relacionadas con bebidas. Podés jugar sin alcohol y pasar cualquier consigna.</p><button class="btn" onclick="localStorage.setItem(A,'1');R()">SOY MAYOR DE 18</button><small>Si vas a conducir: alcohol cero.</small></section>`
}
function productSet(){
  if(IMG_SET)return`<img src="${IMG_SET}" alt="Torre Yenga Borracho con bolso y chupitos">`;
  return`<div class="asset-loader"><span></span><span></span><span></span><small>Preparando la torre…</small></div>`;
}
function towerImage(){
  if(IMG_TOWER)return`<img class="turn-image" src="${IMG_TOWER}" alt="Torre de madera">`;
  return`<div class="mini-tower">${Array(10).fill('<i></i>').join('')}</div>`;
}
function home(){
  let x=load(),lm=x&&M[x.l]?M[x.l]:M.tranqui;
  return`<section class="hero">
    <div class="hero-head">${logo()}<div><span class="over">PASALOCHEVERE · +18</span><b class="microtitle">FÍSICO + DIGITAL</b></div></div>
    <div class="hero-copy"><h1>TORRE YENGA<br><em>BORRACHO</em></h1><p>42 consignas. 3 intensidades.<br>Una noche distinta cada vez.</p></div>
    <div class="product-stage"><span class="product-note">TORRE + BOLSO + CHUPITOS</span>${productSet()}</div>
    ${x&&x.i<42?`
      <div class="resume-card">
        <div><small>PARTIDA EN CURSO</small><strong>${lm[0]}</strong></div>
        <span class="badge" style="--c:${lm[2]}">${x.i+1} / 42</span>
      </div>
      <button class="btn resume-btn" onclick="resume()"><span>VOLVER A LA MESA</span><b>CONTINUAR · ${x.i+1}/42</b></button>
      <button class="btn s" onclick="S='levels';R()">NUEVA PARTIDA</button>`
      :`<button class="btn" onclick="S='levels';R()">JUGAR</button>`}
    <div class="home-links"><button class="link" onclick="S='how';R()">Cómo jugar</button><button class="link" onclick="S='care';R()">Consumo responsable</button></div>
  </section>`
}
function levels(){
  const list=[
    ['tranqui','PARA ARRANCAR','Sorbos suaves y decisiones rápidas.','Ritmo liviano para empezar.'],
    ['sube','YA ENTRARON EN CLIMA','Más interacción, reglas y elecciones.','Más movimiento en la mesa.'],
    ['maximo','LA MESA YA ESTÁ ENCENDIDA','Más intensidad, cadenas y mini-prendas.','El nivel más intenso.']
  ];
  return`<div class="top"><button class="back" onclick="S='home';R()">‹</button>${logo()}</div>
    <span class="over">ELEGÍ TU INTENSIDAD</span><h1>¿CÓMO VIENE<br>LA NOCHE?</h1>
    <div class="levels">${list.map(x=>`<article class="lvl" style="--c:${M[x[0]][2]}">
      <span class="badge" style="--c:${M[x[0]][2]}">${M[x[0]][0]}</span>
      <h3>${x[1]}</h3>
      <p>${x[2]}</p>
      <div class="level-foot"><small>${x[3]}</small><small>42 CONSIGNAS</small></div>
      <button class="btn ${M[x[0]][1]}" onclick="P='${x[0]}';S='pre';R()">ELEGIR →</button>
    </article>`).join('')}</div>`
}
function pre(){
  let m=M[P];
  return`<div class="top"><button class="back" onclick="S='levels';R()">‹</button>${logo()}</div><span class="over">ANTES DE EMPEZAR · ${m[0]}</span><h1>TRES PASOS.<br>Y A JUGAR.</h1><div class="care"><b>1 · SACÁ</b><p>Retirá un bloque de la torre.</p><b>2 · LEÉ</b><p>Mostrá la consigna del celular.</p><b>3 · CUMPLÍ</b><p>Hacé la consigna, apilá y seguí.</p></div><p>Un sorbo siempre es pequeño. Cualquiera puede pasar y también podés jugar sin alcohol.</p><button class="btn ${m[1]}" onclick="start(P)">EMPEZAR PARTIDA</button>`
}
function how(){
  return`<div class="top"><button class="back" onclick="S='home';R()">‹</button>${logo()}</div><span class="over">CÓMO JUGAR</span><h1>TRES PASOS.<br>Y A JUGAR.</h1><div class="care"><b>1 · SACÁ</b><p>Retirá un bloque.</p><b>2 · LEÉ</b><p>Mostrá la consigna.</p><b>3 · CUMPLÍ</b><p>Hacé la consigna, apilá y seguí.</p></div><p>Un sorbo siempre es pequeño. Cualquiera puede pasar.</p><button class="btn" onclick="S='home';R()">VOLVER</button>`
}
function care(){
  return`<div class="top"><button class="back" onclick="S='home';R()">‹</button>${logo()}</div><span class="over">+18</span><h1>DIVERTIRSE TAMBIÉN<br>ES CUIDARSE.</h1><div class="care"><p>✓ Un sorbo siempre es pequeño.<br>✓ Nadie está obligado a beber.<br>✓ Se puede jugar sin alcohol.<br>✓ Se puede pasar cualquier consigna.<br>✓ Si vas a conducir: alcohol cero.<br>✓ Alterná con agua.</p></div><button class="btn" onclick="S='home';R()">VOLVER</button>`
}
function useRule(i){
  let r=G.rules[i];
  if(r.tr==null)G.rules.splice(i,1);
  else{r.tr--;if(r.tr<=0)G.rules.splice(i,1)}
  save();R();
}
function startTimer(){
  let sec=G.l==='tranqui'?15:G.l==='sube'?20:30,now=Date.now();
  G.timer={end:now+sec*1000,status:'run'};save();R();tick();
}
function tick(){
  if(!G||!G.timer||G.timer.status!=='run')return;
  if(Date.now()>=G.timer.end){G.timer.status='done';save();R();return}
  R();setTimeout(tick,250);
}
function timerHTML(){
  let sec=G.l==='tranqui'?15:G.l==='sube'?20:30,
      rem=G.timer?Math.max(0,Math.ceil((G.timer.end-Date.now())/1000)):sec,
      done=G.timer&&(G.timer.status==='done'||rem<=0),m=M[G.l];
  return`<small>MINIJUEGO · #42</small><h2 style="font-size:42px">SIN DECIR<br>SÍ NI NO</h2><div class="timer-ring" style="--c:${m[2]}"><b style="font-size:64px">${rem}</b><small>segundos</small></div><div class="actions">${!G.timer?`<button class="btn ${m[1]}" onclick="startTimer()">INICIAR</button>`:done?`<button class="btn ${m[1]}" onclick="next()">TERMINADO</button>`:''}<button class="link" onclick="next(1)">Pasar consigna</button></div>`
}
function game(){
  let c=card(),m=M[G.l],n=G.i+1,body;
  if(!G.rev)body=`${towerImage()}<span class="over">TURNO ${n}</span><h1>SACÁ<br>UN BLOQUE</h1><p>Cuando estén listos, revelá la consigna.</p><button class="btn ${m[1]}" onclick="G.rev=true;save();R()">MOSTRAR CONSIGNA</button>`;
  else if(c.slot===42)body=timerHTML();
  else body=`<small>${c.cat} · #${String(c.slot).padStart(2,'0')}</small><p class="txt">${c.text}</p><div class="actions"><button class="btn ${m[1]}" onclick="next()">${c.tmp?'ACTIVAR Y SEGUIR':'SIGUIENTE →'}</button><button class="link" onclick="next(1)">Pasar consigna</button></div>`;
  return`<div class="top">${logo()}<button class="menu" onclick="O='menu';R()">•••</button></div><div class="game-meta"><span class="badge" style="--c:${m[2]}">${m[0]}</span><b>${n} / 42</b></div><div class="bar" style="--c:${m[2]}"><i style="width:${G.i/42*100}%"></i></div>${G.rules.length?`<button class="rulechip" onclick="O='rules';R()">REGLAS ACTIVAS · ${G.rules.length}</button>`:''}<section class="card">${body}</section>${overlay()}${extra()}`
}
function overlay(){
  if(!O)return'';
  if(O==='rules')return`<div class="sheet"><div><h2>REGLAS ACTIVAS</h2>${G.rules.map((r,i)=>`<div class="rule"><b>#${r.slot}</b><p>${r.text}</p>${r.tr!=null?`<p><b>Activaciones restantes: ${r.tr}</b></p><button class="btn s" onclick="useRule(${i})">USAR</button>`:`<button class="link" onclick="useRule(${i})">Finalizar</button>`}</div>`).join('')||'<p>No hay reglas activas.</p>'}<button class="btn s" onclick="O=null;R()">CERRAR</button></div></div>`;
  if(O==='menu')return`<div class="sheet"><div><h2>PARTIDA</h2><button class="btn s" onclick="O='level';R()">Cambiar intensidad</button><button class="btn s" onclick="O='hist';R()">Cartas anteriores</button><button class="btn s" onclick="O='rules';R()">Reglas activas</button><button class="link" onclick="O=null;S='care';R()">Consumo responsable</button><button class="link" onclick="localStorage.removeItem(K);G=null;O=null;S='home';R()">Salir</button><button class="btn" onclick="O=null;R()">CERRAR</button></div></div>`;
  return''
}
function extra(){
  if(O==='level')return`<div class="sheet"><div><h2>CAMBIAR INTENSIDAD</h2>${Object.keys(M).map(l=>`<button class="btn ${M[l][1]}" onclick="G.l='${l}';save();O=null;R()">${M[l][0]}</button>`).join('')}<button class="btn s" onclick="O=null;R()">CANCELAR</button></div></div>`;
  if(O==='hist')return`<div class="sheet"><div class="hist"><h2>HISTORIAL</h2>${G.h.slice().reverse().map(e=>`<article><b>#${e.slot} · ${M[e.l][0]}${e.skip?' · PASADA':''}</b><p>${e.text}</p></article>`).join('')||'<p>Sin cartas anteriores.</p>'}<button class="btn s" onclick="O=null;R()">CERRAR</button></div></div>`;
  return''
}
function done(){
  return`<section class="done">${logo()}<span class="over">42 / 42</span><h1>LA TORRE<br>SIGUE EN PIE.</h1><h2>¿USTEDES?</h2><p>Tomá agua. La revancha puede esperar.</p><button class="btn ${M[G.l][1]}" onclick="start(G.l)">VOLVER A MEZCLAR</button><button class="btn s" onclick="localStorage.removeItem(K);G=null;S='home';R()">VOLVER AL INICIO</button></section>`
}
function R(){
  let a=q('#app');
  if(!localStorage.getItem(A))a.innerHTML=age();
  else if(S==='home')a.innerHTML=home();
  else if(S==='levels')a.innerHTML=levels();
  else if(S==='pre')a.innerHTML=pre();
  else if(S==='how')a.innerHTML=how();
  else if(S==='care')a.innerHTML=care();
  else if(S==='game')a.innerHTML=game();
  else a.innerHTML=done();
}
R();
loadAssets();
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));