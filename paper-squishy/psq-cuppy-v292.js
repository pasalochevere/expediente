(()=>{
'use strict';
const LIB=window.PS_LIBRARY;
if(!LIB||!Array.isArray(LIB.characters))return;
const ch=LIB.characters.find(c=>String(c?.slug||'').toLowerCase()==='cuppy'||String(c?.name||'').toLowerCase()==='cuppy');
if(!ch?.assets)return;

const patches={
 back_print:{
  // Medido contra el FRENTE oficial mostrado en fábrica.
  src:{x:.12706,y:.17112,w:.74588,h:.60784},
  dst:{x:.12706,y:.13846,w:.73412,h:.64786}
 },
 coloring_back:{
  // Medido contra COLORING FRENTE oficial mostrado en fábrica.
  src:{x:.12706,y:.16604,w:.74588,h:.64340},
  dst:{x:.06824,y:.12821,w:.85882,h:.75214}
 }
};

const refresh=(key)=>{
 try{
  if(typeof activeCharacter!=='undefined'&&typeof getChar==='function'&&typeof renderViewer==='function'){
   const active=getChar(activeCharacter);
   if(active&&active.id===ch.id&&typeof viewerKey!=='undefined'&&viewerKey===key)renderViewer();
  }
 }catch(e){console.warn('[PSQ Cuppy 2.9.2] refresh',e)}
};

const patch=(key,cfg)=>{
 const asset=ch.assets?.[key];
 if(!asset?.path)return;
 const original=asset.path;
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
   const s=cfg.src,d=cfg.dst;
   // Copia limpia del área a transformar antes de borrar el original.
   const buffer=document.createElement('canvas');
   buffer.width=Math.max(1,Math.round(s.w*w));
   buffer.height=Math.max(1,Math.round(s.h*h));
   const bctx=buffer.getContext('2d');
   bctx.drawImage(img,s.x*w,s.y*h,s.w*w,s.h*h,0,0,buffer.width,buffer.height);
   // Borrar únicamente el bloque original del imprimible; cabecera y pie quedan intactos.
   const padX=.012*w,padY=.012*h;
   ctx.fillStyle='#fff';
   ctx.fillRect(Math.max(0,s.x*w-padX),Math.max(0,s.y*h-padY),Math.min(w,s.w*w+2*padX),Math.min(h,s.h*h+2*padY));
   // Reinsertar con la geometría del frente correspondiente.
   ctx.drawImage(buffer,d.x*w,d.y*h,d.w*w,d.h*h);
   canvas.toBlob(blob=>{
    if(!blob)return;
    const url=URL.createObjectURL(blob);
    ch.assets[key]={...(ch.assets[key]||{}),path:url,width:w,height:h,mode:'RGB',transparent:false};
    ch.source_mode='psq_v2.9.2_cuppy_sizefix';
    window.PSQ_CUPPY_V292=window.PSQ_CUPPY_V292||{active:true,character:'Cuppy',patched:{}};
    window.PSQ_CUPPY_V292.patched[key]={source:original,corrected:url};
    refresh(key);
    console.info('[PSQ Cuppy 2.9.2] '+key+' corregido');
   },'image/webp',.96);
  }catch(e){console.warn('[PSQ Cuppy 2.9.2] '+key+' patch falló',e)}
 };
 img.onerror=()=>console.warn('[PSQ Cuppy 2.9.2] no cargó '+key);
 img.src=original+(original.includes('?')?'&':'?')+'psq=292';
};

patch('back_print',patches.back_print);
patch('coloring_back',patches.coloring_back);
})();
