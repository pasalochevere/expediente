(()=>{
'use strict';
const LIB=window.PS_LIBRARY;
if(!LIB||!Array.isArray(LIB.characters))return;
const ch=LIB.characters.find(c=>String(c?.slug||'').toLowerCase()==='donita'||String(c?.name||'').toLowerCase()==='donita');
if(!ch?.assets?.coloring_back?.path)return;
const original=ch.assets.coloring_back.path;
const img=new Image();
img.crossOrigin='anonymous';
img.decoding='async';
img.onload=()=>{
 try{
  const w=img.naturalWidth||1055,h=img.naturalHeight||1491;
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);
  ctx.drawImage(img,0,0,w,h);
  // Donita: conservar cabecera/pie y rehacer únicamente el área central del dorso.
  // Medidas normalizadas desde el frente aprobado: el contorno del dorso queda al mismo tamaño visual/físico.
  const sx=.1201*w, sy=.2097*h, sw=.7575*w, sh=.6326*h;
  const dx=.0647*w, dy=.1574*h, dw=.8730*w, dh=.7621*h;
  ctx.fillStyle='#fff';ctx.fillRect(.035*w,.145*h,.93*w,.79*h);
  ctx.drawImage(img,sx,sy,sw,sh,dx,dy,dw,dh);
  canvas.toBlob(blob=>{
   if(!blob)return;
   const url=URL.createObjectURL(blob);
   ch.assets.coloring_back={...(ch.assets.coloring_back||{}),path:url,width:w,height:h,mode:'RGB',transparent:false};
   ch.source_mode='psq_v2.9.1_donita_coloring_back_sizefix';
   window.PSQ_DONITA_V291={active:true,character:'Donita',view:'coloring_back',source:original,corrected:url};
   try{
    if(typeof activeCharacter!=='undefined'&&typeof getChar==='function'&&typeof renderViewer==='function'){
     const active=getChar(activeCharacter);
     if(active&&active.id===ch.id&&typeof viewerKey!=='undefined'&&viewerKey==='coloring_back')renderViewer();
    }
   }catch(e){console.warn('[PSQ Donita 2.9.1] refresh',e)}
   console.info('[PSQ Donita 2.9.1] coloring_back corregido');
  },'image/webp',.96);
 }catch(e){console.warn('[PSQ Donita 2.9.1] patch falló',e)}
};
img.onerror=()=>console.warn('[PSQ Donita 2.9.1] no cargó el dorso original');
img.src=original+(original.includes('?')?'&':'?')+'psq=291';
})();
