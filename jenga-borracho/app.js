const D=window.JB_DATA;
const L={tranqui:0,sube:1,maximo:2};
const M={tranqui:['TRANQUI','g','#688d6c'],sube:['SUBE','o','#da8932'],maximo:['AL MÁXIMO','r','#bf5940']};
const K='pc.jb07.game',A='pc.jb07.age';
let G=null,S='home',O=null,P='tranqui',P_MODE='torre',IMG_SET='',IMG_TOWER='';
let wheelBusy=false;
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
function shuffle(xs){const a=[...xs];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function sh(){return shuffle([...Array(42)].map((_,i)=>i))}
function save(){G&&localStorage.setItem(K,JSON.stringify(G))}
function load(){try{return JSON.parse(localStorage.getItem(K))}catch{return null}}
const MODES=['tranqui','sube','maximo'];
function upgradeGame(g){
  if(!g||g.mode!=='ruleta'||g.modeDecks)return g;
  const used={tranqui:new Set(),sube:new Set(),maximo:new Set()};
  (g.h||[]).forEach(e=>{if(used[e.l]&&e.slot>0&&e.slot<=42)used[e.l].add(e.slot-1)});
  const slot=g.deck&&g.deck[g.i];
  if(g.rev&&Number.isInteger(slot)&&used[g.l])g.current={l:g.l,slot:slot+1};
  if(g.current&&used[g.current.l])used[g.current.l].add(g.current.slot-1);
  g.modeDecks={};g.modePos={};
  MODES.forEach(l=>{g.modeDecks[l]=shuffle([...Array(42)].map((_,i)=>i).filter(i=>!used[l].has(i)));g.modePos[l]=0});
  g.total=g.i+MODES.reduce((s,l)=>s+g.modeDecks[l].length,0)+(g.current?1:0);
  g.wheelAngle=Number(g.wheelAngle)||0;
  return g;
}
function resume(){G=upgradeGame(load());if(!G)return;P_MODE=['ruleta','individual'].includes(G.mode)?G.mode:'torre';wheelBusy=false;S=G.i>=total()?'done':'game';save();R();if(G.timer&&G.timer.status==='run')tick()}
function newg(l,mode='torre'){
  const g={l,mode,deck:sh(),i:0,rev:false,h:[],rules:[],timer:null,wheelAngle:0,t:Date.now(),total:mode==='ruleta'?126:42};
  if(mode==='ruleta'){g.modeDecks={tranqui:sh(),sube:sh(),maximo:sh()};g.modePos={tranqui:0,sube:0,maximo:0};g.current=null}
  return g;
}
function total(){return Number(G&&G.total)||42}
function card(){
  let l=G.l,s=G.deck[G.i];
  if(G.mode==='ruleta'){if(!G.current)return null;l=G.current.l;s=G.current.slot-1}
  const d=D[s];if(!d)return null;
  return{slot:s+1,text:d[L[l]],cat:d[3],tmp:!!d[4],l};
}
function chooseMode(){
  const active=MODES.filter(l=>G.modePos[l]<G.modeDecks[l].length);
  if(!active.length)return null;
  const min=Math.min(...active.map(l=>G.modePos[l]));
  let options=active.filter(l=>G.modePos[l]<=min+1);
  const h=G.h||[],prev=h[h.length-1],older=h[h.length-2];
  if(prev&&older&&prev.l===older.l&&options.length>1)options=options.filter(l=>l!==prev.l);
  const weights=options.map(l=>Math.max(1,G.modeDecks[l].length-G.modePos[l]));
  let choice=Math.random()*weights.reduce((x,y)=>x+y,0);
  for(let i=0;i<options.length;i++){choice-=weights[i];if(choice<0)return options[i]}
  return options.at(-1);
}
function start(l,mode=P_MODE){P_MODE=mode;wheelBusy=false;G=newg(l,mode);save();S='game';R()}
function next(skip=0){
  const c=card();if(!c)return;
  G.h.push({...c,l:c.l,skip});
  if(c.tmp&&!skip){
    const tr=c.slot===35&&c.l==='maximo'?2:(c.slot===35||c.slot===36?1:null);
    G.rules.push({text:c.text,slot:c.slot,tr});
    if(G.rules.length>2)G.rules.shift();
  }
  G.i++;G.rev=false;G.timer=null;wheelBusy=false;
  if(G.mode==='ruleta')G.current=null;
  if(G.i>=total())S='done';save();R();
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
  let x=load();if(x&&x.mode==='ruleta')x=upgradeGame(x);let lm=x&&M[x.l]?M[x.l]:M.tranqui;const max=x&&x.total||42;const label=x?.mode==='ruleta'?'RULETA COMPLETA':x?.mode==='individual'?'RULETA INDIVIDUAL · '+lm[0]:lm[0];
  return`<section class="hero">
    <div class="hero-head">${logo()}<div><span class="over">PASALOCHEVERE · +18</span><b class="microtitle">FÍSICO + DIGITAL</b></div></div>
    <div class="hero-copy"><h1>TORRE YENGA<br><em>BORRACHO</em></h1><p>3 intensidades. 126 retos digitales.<br>Elegí cómo querés jugar.</p></div>
    <div class="product-stage"><span class="product-note">TORRE + BOLSO + CHUPITOS</span>${productSet()}</div><div class="mode-separator"><span>✦ TRES FORMAS DE JUGAR</span><i></i></div>
    ${x&&x.i<max?`
      <div class="resume-card">
        <div><small>PARTIDA EN CURSO</small><strong>${label}</strong></div>
        <span class="badge" style="--c:${lm[2]}">${x.i+1} / ${max}</span>
      </div>
      <button class="btn resume-btn" onclick="resume()"><span>VOLVER A LA MESA</span><b>CONTINUAR · ${x.i+1}/${max}</b></button>
      <button class="btn s mode-btn mode-tower" onclick="P_MODE='torre';S='levels';R()"><span class="mode-ico">▦</span><span class="mode-copy"><b>NUEVA PARTIDA · TORRE</b><small>Sacá un bloque y descubrí la consigna</small></span><span class="mode-arrow">›</span></button><button class="btn s mode-btn mode-individual" onclick="P_MODE='individual';S='levels';R()"><span class="mode-ico">◉</span><span class="mode-copy"><b>RULETA INDIVIDUAL</b><small>Elegí una intensidad · 42 retos</small></span><span class="mode-arrow">›</span></button><button class="btn o mode-btn mode-wheel" onclick="P_MODE='ruleta';S='pre';R()"><span class="mode-ico">◉</span><span class="mode-copy"><b>RULETA COMPLETA</b><small>Las tres intensidades · 126 retos</small></span><span class="mode-arrow">›</span></button>`
      :`<button class="btn mode-btn mode-tower" onclick="P_MODE='torre';S='levels';R()"><span class="mode-ico">▦</span><span class="mode-copy"><b>JUGAR CON LA TORRE</b><small>El clásico juego bloque por bloque</small></span><span class="mode-arrow">›</span></button><button class="btn s mode-btn mode-individual" onclick="P_MODE='individual';S='levels';R()"><span class="mode-ico">◉</span><span class="mode-copy"><b>RULETA INDIVIDUAL</b><small>Elegí una intensidad · 42 retos</small></span><span class="mode-arrow">›</span></button><button class="btn o mode-btn mode-wheel" onclick="P_MODE='ruleta';S='pre';R()"><span class="mode-ico">◉</span><span class="mode-copy"><b>RULETA COMPLETA</b><small>Las tres intensidades · 126 retos</small></span><span class="mode-arrow">›</span></button>`}
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
    <span class="over">ELEGÍ TU INTENSIDAD · ${P_MODE==='individual'?'RULETA INDIVIDUAL':'TORRE'}</span><h1>¿CÓMO VIENE<br>LA NOCHE?</h1>
    <div class="levels">${list.map((x,i)=>`<article class="lvl" style="--c:${M[x[0]][2]}"><span class="level-number">${String(i+1).padStart(2,'0')}</span>
      <span class="badge" style="--c:${M[x[0]][2]}">${M[x[0]][0]}</span>
      <h3>${x[1]}</h3>
      <p>${x[2]}</p>
      <div class="level-foot"><small>${x[3]}</small><small>42 CONSIGNAS</small></div>
      <button class="btn ${M[x[0]][1]}" onclick="P='${x[0]}';S='pre';R()">ELEGIR →</button>
    </article>`).join('')}</div>`
}
function pre(){
  let m=M[P];
  if(P_MODE==='ruleta')return `<div class="top"><button class="back" onclick="S='home';R()">‹</button>${logo()}</div>
  <section class="roulette-intro"><span class="over">RULETA · TRES INTENSIDADES</span>
  <h1>UNA RUEDA.<br><em>TRES MODOS.</em></h1><p>La suerte elige la intensidad. Vos descubrís el reto.</p>
  <div class="intensity-preview"><span class="intensity tranqui">TRANQUI</span><span class="intensity sube">SUBE</span><span class="intensity maximo">AL MÁXIMO</span></div>
  <div class="care"><b>GIRÁ</b><p>Elegimos uno de los tres modos.</p><b>DESCUBRÍ</b><p>Se revela una consigna de ese modo, sin números.</p><b>SEGUÍ JUGANDO</b><p>Los retos no se repiten hasta agotar cada banco.</p></div>
  <small>Podés pasar cualquier reto. Se puede jugar sin alcohol.</small>
  <button class="btn o" onclick="start('tranqui','ruleta')">ENTRAR A LA RULETA →</button></section>`;
  if(P_MODE==='individual')return `<div class="top"><button class="back" onclick="S='levels';R()">‹</button>${logo()}</div>
  <section class="individual-intro"><span class="over">RULETA INDIVIDUAL · ${m[0]}</span>
  <h1>UN MODO.<br><em>42 RETOS.</em></h1><p>Elegiste ${m[0]}. Girá la ruleta de 42 casilleros y descubrí sus consignas sin repeticiones.</p>
  <div class="intensity-preview"><span class="intensity ${P}">${m[0]}</span></div>
  <div class="care"><b>1 · GIRÁ</b><p>La ruleta selecciona un casillero.</p>
  <b>2 · DESCUBRÍ</b><p>Leé el desafío del modo elegido.</p>
  <b>3 · SEGUÍ</b><p>Resolvelo o pasalo y volvé a girar.</p></div>
  <small>Podés pasar retos y jugar sin alcohol.</small>
  <button class="btn ${m[1]}" onclick="start(P,'individual')">EMPEZAR RULETA →</button></section>`;
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
  return`<small class="challenge-tag" style="--c:${m[2]}">${G.mode!=='torre'?m[0]:'MINIJUEGO · #42'}</small>${G.mode!=='torre'?`<p class="txt timer-challenge">${card().text}</p>`:'<h2 style="font-size:42px">SIN DECIR<br>SÍ NI NO</h2>'}<div class="timer-ring" style="--c:${m[2]}"><b style="font-size:64px">${rem}</b><small>segundos</small></div><div class="actions">${!G.timer?`<button class="btn ${m[1]}" onclick="startTimer()">INICIAR</button>`:done?`<button class="btn ${m[1]}" onclick="next()">TERMINADO</button>`:''}<button class="link" onclick="next(1)">Pasar consigna</button></div>`
}

function wheelSVG(){
  const names=['TRANQUI','SUBE','AL MÁXIMO'],colors=['#527d67','#c2853f','#a9534b'],paths=[],labels=[];
  for(let i=0;i<3;i++){
    const center=(-90+120*i)*Math.PI/180,a0=center-Math.PI/3,a1=center+Math.PI/3;
    const p=(a,r)=>(200+r*Math.cos(a)).toFixed(2)+' '+(200+r*Math.sin(a)).toFixed(2);
    paths.push('<path d="M200 200 L'+p(a0,182)+' A182 182 0 0 1 '+p(a1,182)+' Z" fill="'+colors[i]+'" stroke="#f4d29c" stroke-width="3"/>');
    const x=(200+111*Math.cos(center)).toFixed(2),y=(200+111*Math.sin(center)).toFixed(2);
    labels.push('<text x="'+x+'" y="'+y+'" text-anchor="middle" dominant-baseline="central" font-size="'+(i===2?19:22)+'" fill="#fff6e5" font-weight="900" letter-spacing=".5" paint-order="stroke" stroke="#281b1633" stroke-width="2">'+(i===2?'<tspan x="'+x+'" dy="-10">AL</tspan><tspan x="'+x+'" dy="23">MÁXIMO</tspan>':names[i])+'</text>');
  }
  return '<svg viewBox="0 0 400 400" role="img" aria-label="Ruleta Tranqui, Sube y Al Máximo"><circle cx="200" cy="200" r="194" fill="#f5e3c5" stroke="#ad8049" stroke-width="8"/>'+paths.join('')+labels.join('')+'<circle cx="200" cy="200" r="183" fill="none" stroke="#f9dfb1" stroke-width="4"/></svg>';
}
function wheelHTML(){
  return `<div class="wheel-wrap"><span class="over">RULETA · 3 INTENSIDADES</span><h2>¿QUÉ MODO<br>TE TOCA?</h2>
  <div class="wheel-stage"><span class="wheel-pointer" aria-hidden="true">▼</span>
  <div class="wheel-disc" id="wheel-disc" style="transform:rotate(${Number(G.wheelAngle)||0}deg)">${wheelSVG()}</div>
  <button class="wheel-hub" id="wheel-spin" aria-label="Girar ruleta" onclick="spinWheel()"><b>GIRAR</b><small>✦</small></button></div>
  <p class="wheel-hint">Tocá el centro para descubrir el reto</p></div>`;
}

function individualWheelSVG(){
  const colors=['#d9a34f','#bf5940','#688d6c','#e5af71','#926949','#99aa90'],step=360/42,sectors=[],labels=[];
  const point=(a,r)=>(200+r*Math.cos(a)).toFixed(2)+' '+(200+r*Math.sin(a)).toFixed(2);
  for(let i=0;i<42;i++){
    const a=(-90+i*step)*Math.PI/180;
    sectors.push('<path d="M200 200 L'+point(a-step*Math.PI/360,185)+' A185 185 0 0 1 '+point(a+step*Math.PI/360,185)+' Z" fill="'+colors[i%6]+'" stroke="#fff2df" stroke-width="1.1"/>');
    labels.push('<text x="'+(200+159*Math.cos(a)).toFixed(2)+'" y="'+(200+159*Math.sin(a)).toFixed(2)+'" font-size="12" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="central">'+String(i+1).padStart(2,'0')+'</text>');
  }
  return '<svg viewBox="0 0 400 400" role="img" aria-label="Ruleta individual con 42 casilleros numerados"><circle cx="200" cy="200" r="192" fill="#fff2dc" stroke="#b58e52" stroke-width="7"/>'+sectors.join('')+labels.join('')+'</svg>';
}
function individualWheelHTML(){
  return `<div class="wheel-wrap wheel-wrap-individual">
    <span class="over">RULETA INDIVIDUAL · ${M[G.l][0]}</span><h2>¡GIRÁ LA RULETA!</h2>
    <div class="wheel-stage"><span class="wheel-pointer" aria-hidden="true">▼</span>
      <div class="wheel-disc" id="wheel-disc" style="transform:rotate(${Number(G.wheelAngle)||0}deg)">${individualWheelSVG()}</div>
      <div class="wheel-hub wheel-hub-static"><b>42</b><small>RETOS</small></div>
    </div><p class="wheel-hint">42 desafíos de ${M[G.l][0]}, sin repetir.</p>
    <div class="actions"><button class="btn ${M[G.l][1]}" id="wheel-spin" onclick="spinWheel()">GIRAR RULETA ↗</button></div>
  </div>`;
}

function spinWheel(){
  if(wheelBusy||!G||!['ruleta','individual'].includes(G.mode)||G.rev)return;
  const disc=q('#wheel-disc'),btn=q('#wheel-spin');
  if(!disc||!btn)return;
  if(G.mode==='ruleta'&&!G.current){
    const l=chooseMode();if(!l)return;
    const slot=G.modeDecks[l][G.modePos[l]++];
    G.current={l,slot:slot+1};G.l=l;
  }
  const c=card();if(!c)return;
  wheelBusy=true;btn.disabled=true;
  const center=btn.querySelector('b');
  if(center)center.textContent='···';else btn.textContent='GIRANDO…';
  const current=Number(G.wheelAngle)||0;
  const target=G.mode==='ruleta'
    ?(360-MODES.indexOf(c.l)*120)%360
    :(360-(c.slot-1)*360/42)%360;
  const from=((current%360)+360)%360;
  const angle=current+360*5+(target-from+360)%360;
  const session=G,turn=G.i;
  G.wheelAngle=angle;save();
  requestAnimationFrame(()=>{if(G===session&&S==='game')disc.style.transform='rotate('+angle+'deg)'});
  const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  setTimeout(()=>{wheelBusy=false;if(G!==session||S!=='game'||G.i!==turn)return;G.rev=true;save();R()},reduced?120:3400);
}

function game(){
  let c=card(),m=c?M[c.l]:M[G.l],n=G.i+1,body;
  if(!G.rev&&G.mode==='ruleta')body=wheelHTML();
  else if(!G.rev&&G.mode==='individual')body=individualWheelHTML();
  else if(!G.rev)body=`${towerImage()}<span class="over">TURNO ${n}</span><h1>SACÁ<br>UN BLOQUE</h1><p>Cuando estén listos, revelá la consigna.</p><button class="btn ${m[1]}" onclick="G.rev=true;save();R()">MOSTRAR CONSIGNA</button>`;
  else if(c.slot===42)body=timerHTML();
  else body=`<small class="challenge-tag" style="--c:${m[2]}">${G.mode==='ruleta'?m[0]:c.cat+' · #'+String(c.slot).padStart(2,'0')}</small><p class="txt">${c.text}</p><div class="actions"><button class="btn ${m[1]}" onclick="next()">${c.tmp?'ACTIVAR Y SEGUIR':'SIGUIENTE RETO →'}</button><button class="link" onclick="next(1)">Pasar reto</button></div>`;
  return`<div class="top">${logo()}<button class="menu" aria-label="Menú de la partida" onclick="O='menu';R()">•••</button></div><div class="game-meta"><span class="badge" style="--c:${m[2]}">${G.mode==='ruleta'?(G.rev?m[0]:'3 MODOS'):m[0]}</span><b>${n} / ${total()}</b></div><div class="bar" style="--c:${m[2]}"><i style="width:${G.i/total()*100}%"></i></div>${G.rules.length?`<button class="rulechip" onclick="O='rules';R()">REGLAS ACTIVAS · ${G.rules.length}</button>`:''}<section class="card ${G.rev?'is-revealed':'is-pick'} ${G.mode!=='torre'?'is-wheel':'is-tower'}">${body}</section>${overlay()}${extra()}`
}
function overlay(){
  if(!O)return'';
  if(O==='rules')return`<div class="sheet"><div><h2>REGLAS ACTIVAS</h2>${G.rules.map((r,i)=>`<div class="rule"><b>#${r.slot}</b><p>${r.text}</p>${r.tr!=null?`<p><b>Activaciones restantes: ${r.tr}</b></p><button class="btn s" onclick="useRule(${i})">USAR</button>`:`<button class="link" onclick="useRule(${i})">Finalizar</button>`}</div>`).join('')||'<p>No hay reglas activas.</p>'}<button class="btn s" onclick="O=null;R()">CERRAR</button></div></div>`;
  if(O==='menu')return`<div class="sheet"><div><h2>PARTIDA</h2>${G.mode==='torre'?`<button class="btn s" onclick="O='level';R()">Cambiar intensidad</button>`:''}<button class="btn s" onclick="O='hist';R()">Cartas anteriores</button><button class="btn s" onclick="O='rules';R()">Reglas activas</button><button class="link" onclick="O=null;S='care';R()">Consumo responsable</button><button class="link" onclick="localStorage.removeItem(K);G=null;O=null;S='home';R()">Salir</button><button class="btn" onclick="O=null;R()">CERRAR</button></div></div>`;
  return''
}
function extra(){
  if(O==='level')return`<div class="sheet"><div><h2>CAMBIAR INTENSIDAD</h2>${Object.keys(M).map(l=>`<button class="btn ${M[l][1]}" onclick="G.l='${l}';save();O=null;R()">${M[l][0]}</button>`).join('')}<button class="btn s" onclick="O=null;R()">CANCELAR</button></div></div>`;
  if(O==='hist')return`<div class="sheet"><div class="hist"><h2>HISTORIAL</h2>${G.h.slice().reverse().map(e=>`<article><b>#${e.slot} · ${M[e.l][0]}${e.skip?' · PASADA':''}</b><p>${e.text}</p></article>`).join('')||'<p>Sin cartas anteriores.</p>'}<button class="btn s" onclick="O=null;R()">CERRAR</button></div></div>`;
  return''
}
function done(){
  return`<section class="done">${logo()}<span class="over">${total()} / ${total()}</span><h1>${G.mode!=='torre'?'LA RULETA<br>SE DETUVO.':'LA TORRE<br>SIGUE EN PIE.'}</h1><h2>¿USTEDES?</h2><p>Tomá agua. La revancha puede esperar.</p><button class="btn ${M[G.l][1]}" onclick="start(G.l,G.mode||'torre')">VOLVER A MEZCLAR</button><button class="btn s" onclick="localStorage.removeItem(K);G=null;S='home';R()">VOLVER AL INICIO</button></section>`
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