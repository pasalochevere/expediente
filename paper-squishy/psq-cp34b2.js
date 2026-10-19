(()=>{'use strict';
if(window.PSQ_CP34B2)return;
const release='3.4B2';
const $=s=>document.querySelector(s);
const state={ch:null,side:'front',preset:'original',loaded:{},seq:0,url:''};
const labels={original:'Original',coral:'Crema Coral',cielo:'Crema Cielo'};
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const findHeladin=()=>window.PS_LIBRARY?.characters?.find(c=>norm(c.name||c.slug).includes('heladin'));
const source=(ch,side)=>side==='front'?(ch?.assets?.editor_asset?.path||ch?.assets?.front_print?.path):(ch?.assets?.back_print?.path||ch?.assets?.coloring_back?.path);
function tint(im,preset){
 const w=im.naturalWidth||im.width,h=im.naturalHeight||im.height;
 const el=document.createElement('canvas');el.width=w;el.height=h;
 const cx=el.getContext('2d',{willReadFrequently:true});cx.drawImage(im,0,0,w,h);
 if(preset==='original')return el;
 const data=cx.getImageData(0,0,w,h),v=data.data;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
 const at=4*(y*w+x),r=v[at],g=v[at+1],b=v[at+2],alpha=v[at+3],yn=y/h;
 if(alpha<100||yn<.17||yn>.70)continue;
 const mx=Math.max(r,g,b),mn=Math.min(r,g,b),diff=mx-mn;
 if(mx<110||mx>250&&mn>240||diff<35||r<105||g<70||b<75)continue;
 if(r>g*1.3&&r>b*1.2&&yn<.38)continue;
 if(r>g*1.18&&g>b*.8&&b<165&&yn>.58)continue;
 let hue=mx===r?((g-b)/diff+6)%6:mx===g?(b-r)/diff+2:(r-g)/diff+4;hue*=60;
 if((hue<14||hue>345)&&yn<.38)continue;
 let dest=preset==='coral'?(hue<35?7:hue<90?28:hue<170?11:hue<260?12:hue<300?273:337):(hue<35?334:hue<90?187:hue<165?172:hue<260?210:hue<300?244:212);
 const L=Math.max(.50,Math.min(.83,(mx+mn)/510)),S=.67,C=(1-Math.abs(2*L-1))*S,H=dest/60,X=C*(1-Math.abs(H%2-1)),M=L-C/2;
 const q=H<1?[C,X,0]:H<2?[X,C,0]:H<3?[0,C,X]:H<4?[0,X,C]:H<5?[X,0,C]:[C,0,X],a=.77;
 v[at]=Math.round(r*(1-a)+(q[0]+M)*255*a);
 v[at+1]=Math.round(g*(1-a)+(q[1]+M)*255*a);
 v[at+2]=Math.round(b*(1-a)+(q[2]+M)*255*a);
 }
 cx.putImageData(data,0,0);return el;
}
function note(msg,error=false){const el=$('#psqCPStatus');if(el){el.textContent=msg;el.style.color=error?'#a33235':'#6e584c'}}
function buttons(){
 document.querySelectorAll('#psqCPRoot [data-preset]').forEach(b=>{const on=b.dataset.preset===state.preset;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
 document.querySelectorAll('#psqCPRoot [data-side]').forEach(b=>{const on=b.dataset.side===state.side;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
}
async function preview(){
 const id=++state.seq;buttons();state.url='';
 const path=source(state.ch,state.side);
 if(!path){note('Esta cara no tiene imagen de catálogo disponible.',true);return}
 note('Cargando '+(state.side==='front'?'frente':'dorso')+'…');
 try{
 let image=state.loaded[state.side];
 if(!image){image=await new Promise((resolve,reject)=>{const i=new Image();i.crossOrigin='anonymous';i.onload=()=>resolve(i);i.onerror=()=>reject(new Error('No se pudo cargar el personaje'));i.src=path});state.loaded[state.side]=image}
 if(id!==state.seq)return;
 const out=tint(image,state.preset),url=out.toDataURL('image/png');
 if(id!==state.seq)return;
 state.url=url;$('#psqCPImage').src=url;
 note(labels[state.preset]+' · '+(state.side==='front'?'frente':'dorso')+' listo. Los masters A4 siguen intactos.');
 }catch(e){if(id!==state.seq)return;$('#psqCPImage').src=path;note('No se pudo aplicar este preset: '+String(e.message||e),true)}
}
function open(){
 const ch=findHeladin();if(!ch){alert('Heladín no figura en la biblioteca cargada.');return}
 state.ch=ch;state.side='front';state.preset='original';state.loaded={};$('#psqCPRoot').classList.add('open');document.documentElement.style.overflow='hidden';preview();
}
function close(){$('#psqCPRoot').classList.remove('open');document.documentElement.style.overflow=''}
function save(){
 if(!state.url){note('Esperá que se termine de generar la imagen.',true);return}
 const a=document.createElement('a');a.href=state.url;a.download='heladin-'+state.preset+'-'+state.side+'-creator-plus.png';document.body.append(a);a.click();a.remove();
}
function editor(){
 if(!state.url){note('Primero prepará el preset.',true);return}
 const url=state.url;close();
 const start=$('#headerCreateBtn')||$('#blankStartBtn');if(start)start.click();
 setTimeout(()=>{try{if(typeof window.loadBase==='function'){window.loadBase(url);if(window.editor&&typeof window.editor==='object')window.editor.baseSrc=url}else alert('Abrí Crear en Creator Plus para continuar.')}catch(e){console.warn('CP3.4B2 editor bridge',e)}},240);
}
function setup(){
 if(!document.body||$('#psqCPRoot'))return;
 const style=document.createElement('style');style.textContent=[
 '#psqCPRoot{display:none;position:fixed;inset:0;z-index:99999;background:#fff8ef;color:#34251f;font-family:system-ui,Arial,sans-serif;overflow:auto}',
 '#psqCPRoot.open{display:block}#psqCPRoot *{box-sizing:border-box}',
 '#psqCPRoot .head{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:15px 3vw;background:#fff5e9;border-bottom:1px solid #eadccc;position:sticky;top:0;z-index:3}',
 '#psqCPRoot .brand{font-weight:950}#psqCPRoot .brand small{display:block;font-size:10px;letter-spacing:.08em;color:#966e5f}',
 '#psqCPRoot .layout{max-width:1100px;margin:auto;padding:16px;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr);gap:16px}',
 '#psqCPRoot .card{border-radius:22px;border:1px solid #e9daca;background:#fff;padding:17px;box-shadow:0 12px 32px #32241a0b}',
 '#psqCPRoot h1{font-size:clamp(24px,3vw,35px);margin:3px 0 7px}#psqCPRoot h2{font-size:16px;margin:0 0 10px}',
 '#psqCPRoot p{font-size:13px;line-height:1.5;color:#795f51}#psqCPRoot .stage{height:min(65vh,600px);min-height:300px;border:1px solid #eddddc;border-radius:16px;background:linear-gradient(145deg,#fff5f2,#eef9ff);display:grid;place-items:center}',
 '#psqCPRoot .stage img{max-width:95%;max-height:95%;object-fit:contain}#psqCPRoot .controls{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px}',
 '#psqCPRoot button{font:inherit;border:1px solid #e3c4aa;border-radius:12px;background:#fff8ef;padding:10px 12px;font-weight:800;cursor:pointer;color:#34251f}',
 '#psqCPRoot button.active{background:#ffdb87;border-color:#d5a341}#psqCPRoot button.main{background:#39271e;color:white}#psqCPRoot .hint{border-radius:13px;padding:12px;background:#fff0dc;color:#82654e;font-size:12px}',
 '@media(max-width:740px){#psqCPRoot .layout{grid-template-columns:1fr;padding:10px}#psqCPRoot .stage{height:42vh;min-height:240px}#psqCPRoot .card{padding:12px}}'
 ].join('\n');document.head.append(style);
 const panel=document.createElement('div');panel.id='psqCPRoot';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');
 panel.innerHTML='<div class="head"><div class="brand">pasalochevere <small>CREATOR PLUS · CP3.4B2 · HELADÍN</small></div><button id="psqCPClose">← Volver a la fábrica</button></div>'+
 '<div class="layout"><section class="card"><h1>Heladín · Creator Plus</h1><p>Tres presets sobre la ilustración del catálogo. Compará frente y dorso.</p><div class="stage"><img id="psqCPImage" alt="Vista del preset de Heladín"></div><p id="psqCPStatus" aria-live="polite">Preparando imagen…</p></section>'+
 '<section class="card"><h2>01 · Elegí un preset</h2><div class="controls"><button data-preset="original">🌈 Original</button><button data-preset="coral">🪸 Crema Coral</button><button data-preset="cielo">🩵 Crema Cielo</button></div>'+
 '<h2>02 · Frente o dorso</h2><div class="controls"><button data-side="front">Frente</button><button data-side="back">Dorso</button></div>'+
 '<h2>03 · Exportá o editá</h2><div class="controls"><button class="main" id="psqCPSave">↓ Descargar PNG</button><button id="psqCPEdit">Seguir editando →</button></div>'+
 '<div class="hint">Los masters imprimibles y las láminas A4 no se modifican. Verificá ambas caras antes de imprimir.</div></section></div>';
 document.body.append(panel);
 $('#psqCPClose').onclick=close;$('#psqCPSave').onclick=save;$('#psqCPEdit').onclick=editor;
 panel.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{state.preset=b.dataset.preset;preview()});
 panel.querySelectorAll('[data-side]').forEach(b=>b.onclick=()=>{state.side=b.dataset.side;preview()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('open'))close()});
 const entry=document.createElement('button');entry.type='button';entry.id='psqCPEntry';entry.textContent='🎨 Heladín · 3 presets';
 entry.style.cssText='border:1px solid #d9ae61;border-radius:12px;background:#ffdb91;color:#34251f;padding:9px 12px;margin:4px;font-weight:900;cursor:pointer';
 entry.onclick=open;
 const ref=$('#headerCreateBtn')||$('#blankStartBtn');
 if(ref?.parentNode)ref.parentNode.insertBefore(entry,ref.nextSibling);
 else{entry.style.cssText+=';position:fixed;right:12px;bottom:12px;z-index:99';document.body.append(entry)}
 const done=$('#editorDone');if(done?.parentNode){const second=entry.cloneNode(true);second.removeAttribute('id');second.onclick=open;done.parentNode.insertBefore(second,done)}
 window.PSQ_CP34B2={release,open,close,getState:()=>({side:state.side,preset:state.preset,ready:!!state.url})};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();