(()=>{
'use strict';
if(window.PSQ_CP33_FIX2)return;
const lookup=()=>window.PS_LIBRARY?.characters||[];
const byId=id=>lookup().find(c=>c.id===id);
const $=s=>document.querySelector(s);
const style=document.createElement('style');
style.textContent=[
'#cp33EditBackdrop{position:fixed;inset:0;z-index:9500;display:none;background:rgba(29,17,25,.84);padding:14px;overflow:auto;font-family:system-ui,Arial,sans-serif;color:#34251f}',
'#cp33EditBackdrop.on{display:grid;place-items:center}',
'#cp33EditPanel{width:min(1080px,100%);background:#fffaf3;border-radius:24px;overflow:hidden;box-shadow:0 24px 70px #0005}',
'.cp33e-head{padding:14px 20px;border-bottom:1px solid #eadacb;display:flex;justify-content:space-between;align-items:center;gap:12px}',
'.cp33e-head b{font-size:20px}.cp33e-head small{display:block;color:#926e61;font-size:11px;font-weight:800}',
'.cp33e-grid{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:20px;padding:20px}',
'.cp33e-canvas{background:repeating-conic-gradient(#f6f0ec 0 25%,#fff 0 50%) 50%/20px 20px;border-radius:18px;border:1px solid #ecddcd;padding:12px;display:grid;place-items:center;min-width:0}',
'#cp33EditCanvas{display:block;width:min(100%,520px);height:auto;aspect-ratio:1/1;object-fit:contain;touch-action:none;cursor:grab}',
'.cp33e-controls{display:flex;flex-direction:column;gap:10px}.cp33e-controls label{display:block;font-size:12px;font-weight:800}',
'.cp33e-controls input:not([type=color]){display:block;width:100%;padding:8px 10px;border:1px solid #dccbc0;border-radius:10px;background:white;box-sizing:border-box}',
'.cp33e-controls input[type=range]{padding:0;border:0}.cp33e-controls input[type=color]{display:block;width:60px;height:38px;border:0;background:transparent}',
'.cp33e-btn{border:1px solid #392820;border-radius:12px;padding:11px;cursor:pointer;font-size:12px;font-weight:900;background:white;color:#34251f}',
'.cp33e-btn.main{background:#ffd65f}.cp33e-note{font-size:11px;line-height:1.5;color:#78645a}',
'@media(max-width:680px){.cp33e-grid{grid-template-columns:1fr;padding:12px}.cp33e-head b{font-size:16px}.cp33e-controls{gap:8px}}'
].join('');
document.head.appendChild(style);
const overlay=document.createElement('div');
overlay.id='cp33EditBackdrop';overlay.innerHTML='<div id="cp33EditPanel" role="dialog" aria-modal="true" aria-label="Editar preset"><div class="cp33e-head"><div><small>CP3.3R2 · EDITOR DE PRESETS · PRUEBA</small><b id="cp33EditTitle">Personaje</b></div><button type="button" class="cp33e-btn" id="cp33EditClose">Volver a presets ×</button></div><div class="cp33e-grid"><div class="cp33e-canvas"><canvas id="cp33EditCanvas" width="1000" height="1000"></canvas></div><div class="cp33e-controls"><label>Texto personalizado<input id="cp33EditText" maxlength="35" placeholder="Escribí tu texto..."></label><label>Tamaño del personaje<input id="cp33EditScale" type="range" min="35" max="160" value="90"></label><label>Girar personaje<input id="cp33EditAngle" type="range" min="-45" max="45" value="0"></label><label>Tamaño del texto<input id="cp33EditFont" type="range" min="20" max="95" value="56"></label><label>Color del texto<input id="cp33EditColor" type="color" value="#512f45"></label><button type="button" id="cp33EditDownload" class="cp33e-btn main">DESCARGAR DISEÑO PNG</button><button type="button" id="cp33EditReset" class="cp33e-btn">Restablecer</button><div class="cp33e-note" id="cp33EditStatus">Probá mover el personaje arrastrándolo. Esta es una prueba de personalización, no el generador final de frente/dorso A4.</div></div></div></div>';
document.body.appendChild(overlay);
const canvas=$('#cp33EditCanvas'),ctx=canvas.getContext('2d');
let ch=null,img=null,scale=90,angle=0,txt='',font=56,color='#512f45',cx=500,cy=450,drag=null,imageReady=false;
function status(s){$('#cp33EditStatus').textContent=s}
function draw(){
 ctx.clearRect(0,0,1000,1000);
 if(img&&imageReady){
  const factor=Math.min(800/img.naturalWidth,800/img.naturalHeight)*scale/100;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(angle*Math.PI/180);ctx.drawImage(img,-img.naturalWidth*factor/2,-img.naturalHeight*factor/2,img.naturalWidth*factor,img.naturalHeight*factor);ctx.restore();
 }
 if(txt.trim()){
  ctx.save();ctx.font='900 '+font+'px system-ui,Arial,sans-serif';ctx.textAlign='center';ctx.lineJoin='round';ctx.strokeStyle='#fff';ctx.lineWidth=10;ctx.strokeText(txt,500,936,870);ctx.fillStyle=color;ctx.fillText(txt,500,936,870);ctx.restore();
 }
}
function close(){overlay.classList.remove('on');if($('#cp33Mask'))$('#cp33Mask').classList.add('on')}
function reset(){scale=90;angle=0;cx=500;cy=450;txt='';font=56;color='#512f45';$('#cp33EditScale').value=90;$('#cp33EditAngle').value=0;$('#cp33EditText').value='';$('#cp33EditFont').value=56;$('#cp33EditColor').value=color;draw()}
function open(chosen){
 ch=chosen;img=null;imageReady=false;reset();overlay.classList.add('on');$('#cp33Mask')?.classList.remove('on');$('#cp33EditTitle').textContent=ch.name;
 status('Cargando imagen original del personaje…');
 const next=new Image();next.crossOrigin='anonymous';next.decoding='async';
 next.onload=()=>{img=next;imageReady=true;draw();status('Imagen cargada. Personalizá el personaje o arrastralo. Podés descargar PNG para evaluar el preset.')};
 next.onerror=()=>{status('No se pudo cargar la imagen editable. Volvé a seleccionar el personaje.');console.warn('[CP3.3R2] Falló asset',ch.assets?.editor_asset?.path)};
 next.src=ch.assets.editor_asset.path;
 window.PSQ_CP33_FIX2.lastOpened={id:ch.id,name:ch.name,asset:ch.assets.editor_asset.path};
}
function attemptNative(chosen){
 try{
  // El editor nativo solo se invoca si ambas funciones están realmente expuestas.
  if(typeof window.show==='function'&&typeof window.loadBase==='function'){
   window.show('editor');window.loadBase(chosen.assets.editor_asset.path);
   $('#cp33Mask')?.classList.remove('on');
   window.PSQ_CP33_FIX2.lastMode='native';
   return true;
  }
 }catch(err){console.warn('[CP3.3R2] native API falló, se usa editor de prueba',err)}
 return false;
}
function start(chosen){
 if(!chosen?.assets?.editor_asset?.path)return;
 if(attemptNative(chosen))return;
 window.PSQ_CP33_FIX2.lastMode='test-editor';
 open(chosen);
}
document.addEventListener('click',e=>{
 const b=e.target.closest?.('button[data-use]');
 if(!b||!b.closest('#cp33Mask'))return;
 const chosen=byId(b.dataset.use);
 if(!chosen)return;
 // Freno en captura: evita ejecutar el antiguo controlador que mostraba el error.
 e.preventDefault();e.stopImmediatePropagation();
 start(chosen);
},true);
$('#cp33EditClose').onclick=close;
$('#cp33EditReset').onclick=reset;
$('#cp33EditText').oninput=e=>{txt=e.target.value;draw()};
$('#cp33EditScale').oninput=e=>{scale=+e.target.value;draw()};
$('#cp33EditAngle').oninput=e=>{angle=+e.target.value;draw()};
$('#cp33EditFont').oninput=e=>{font=+e.target.value;draw()};
$('#cp33EditColor').oninput=e=>{color=e.target.value;draw()};
$('#cp33EditDownload').onclick=()=>{
 if(!imageReady)return status('Esperá a que cargue el personaje antes de exportar.');
 try{const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='pasalochevere-'+(ch?.slug||'preset')+'-cp33.png';document.body.appendChild(a);a.click();a.remove();status('Se preparó la descarga PNG. Este es un diseño de prueba, no el kit imprimible.')}
 catch(err){console.error('[CP3.3R2] No se pudo exportar PNG',err);status('Error al exportar PNG. Revisar acceso CORS de la imagen original.')}
};
canvas.addEventListener('pointerdown',e=>{if(!imageReady)return;const r=canvas.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,cx,cy,width:r.width,height:r.height};canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!drag)return;cx=drag.cx+((e.clientX-drag.x)/drag.width)*1000;cy=drag.cy+((e.clientY-drag.y)/drag.height)*1000;draw()});
for(const n of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(n,()=>{drag=null});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('on'))close()});
window.PSQ_CP33_FIX2={active:true,version:'3.3R2',lastMode:null,lastOpened:null,start};
console.info('[CP3.3R2] El botón de presets queda conectado a un editor verificable en lugar de lanzar error.');
})();