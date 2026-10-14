(()=>{
'use strict';
const LIB=window.PS_LIBRARY;
if(!LIB||!Array.isArray(LIB.characters))return;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const ch=LIB.characters.find(c=>norm(c?.slug)==='heladin'||norm(c?.name)==='heladin');
if(!ch?.assets?.coloring?.path||!ch?.assets?.coloring_back?.path)return;

const load=(src)=>new Promise((resolve,reject)=>{
 const img=new Image();
 img.crossOrigin='anonymous';
 img.decoding='async';
 img.onload=()=>resolve(img);
 img.onerror=()=>reject(new Error('No cargó '+src));
 img.src=src+(src.includes('?')?'&':'?')+'psq=2961';
});

const detectMain=(img)=>{
 const sw=280,sh=Math.max(1,Math.round(sw*(img.naturalHeight||1491)/(img.naturalWidth||1055)));
 const c=document.createElement('canvas');c.width=sw;c.height=sh;
 const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,sw,sh);
 const px=ctx.getImageData(0,0,sw,sh).data;
 const mask=new Uint8Array(sw*sh);
 const x0=Math.floor(sw*.07),x1=Math.ceil(sw*.93),y0=Math.floor(sh*.18),y1=Math.ceil(sh*.90);
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
  const p=(y*sw+x)*4,gray=(px[p]+px[p+1]+px[p+2])/3;
  if(gray<210)mask[y*sw+x]=1;
 }
 const seen=new Uint8Array(mask.length);let best=null;
 const dirs=[-1,1,-sw,sw,-sw-1,-sw+1,sw-1,sw+1];
 for(let i=0;i<mask.length;i++){
  if(!mask[i]||seen[i])continue;
  const stack=[i];seen[i]=1;let area=0,minX=sw,minY=sh,maxX=0,maxY=0,sumX=0,sumY=0;
  while(stack.length){
   const q=stack.pop(),qy=Math.floor(q/sw),qx=q-qy*sw;area++;sumX+=qx;sumY+=qy;
   if(qx<minX)minX=qx;if(qx>maxX)maxX=qx;if(qy<minY)minY=qy;if(qy>maxY)maxY=qy;
   for(const d of dirs){const n=q+d;if(n<0||n>=mask.length||seen[n]||!mask[n])continue;const ny=Math.floor(n/sw),nx=n-ny*sw;if(Math.abs(nx-qx)>1||Math.abs(ny-qy)>1)continue;seen[n]=1;stack.push(n)}
  }
  if(area<20)continue;
  const cx=sumX/area,cy=sumY/area,dist=Math.pow((cx-sw/2)/sw,2)+Math.pow((cy-sh/2)/sh,2),score=area*(1-.55*Math.min(dist,1));
  if(!best||score>best.score)best={score,minX,minY,maxX,maxY};
 }
 if(!best)return null;
 const sx=(img.naturalWidth||1055)/sw,sy=(img.naturalHeight||1491)/sh;
 return {x:best.minX*sx,y:best.minY*sy,w:(best.maxX-best.minX+1)*sx,h:(best.maxY-best.minY+1)*sy};
};

const expand=(b,w,h)=>{
 const dx=b.w*.075,dt=b.h*.075,db=b.h*.10;
 const x=Math.max(0,b.x-dx),y=Math.max(0,b.y-dt);
 return {x,y,w:Math.min(w-x,b.w+2*dx),h:Math.min(h-y,b.h+dt+db)};
};

const refresh=()=>{
 try{
  if(typeof activeCharacter!=='undefined'&&typeof getChar==='function'&&typeof renderViewer==='function'){
   const active=getChar(activeCharacter);
   if(active&&active.id===ch.id&&typeof viewerKey!=='undefined'&&viewerKey==='coloring')renderViewer();
  }
 }catch(e){console.warn('[PSQ Heladin 2.9.6] refresh',e)}
};

(async()=>{
 const frontAsset=ch.assets.coloring,backAsset=ch.assets.coloring_back;
 const originalFront=frontAsset.path;
 try{
  const [front,back]=await Promise.all([load(originalFront),load(backAsset.path)]);
  const fw=front.naturalWidth||1055,fh=front.naturalHeight||1491,bw=back.naturalWidth||1055,bh=back.naturalHeight||1491;
  let f=detectMain(front),b=detectMain(back);
  if(!f||!b)throw new Error('No pude detectar geometría principal');
  f=expand(f,fw,fh);b=expand(b,bw,bh);
  // Heladín aprobado: el dorso es la autoridad de tamaño. Reducir/reposicionar SOLO el frente para colorear.
  const target={x:b.x/bw*fw,y:b.y/bh*fh,w:b.w/bw*fw,h:b.h/bh*fh};
  const canvas=document.createElement('canvas');canvas.width=fw;canvas.height=fh;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,fw,fh);ctx.drawImage(front,0,0,fw,fh);
  const buffer=document.createElement('canvas');buffer.width=Math.max(1,Math.round(f.w));buffer.height=Math.max(1,Math.round(f.h));
  buffer.getContext('2d').drawImage(front,f.x,f.y,f.w,f.h,0,0,buffer.width,buffer.height);
  const pad=5;ctx.fillStyle='#fff';ctx.fillRect(Math.max(0,f.x-pad),Math.max(0,f.y-pad),Math.min(fw,f.w+pad*2),Math.min(fh,f.h+pad*2));
  ctx.drawImage(buffer,target.x,target.y,target.w,target.h);
  canvas.toBlob(blob=>{
   if(!blob)return;
   const url=URL.createObjectURL(blob);
   ch.assets.coloring={...(ch.assets.coloring||{}),path:url,width:fw,height:fh,mode:'RGB',transparent:false};
   ch.source_mode='psq_v2.9.6_heladin_coloring_front_sizefix';
   window.PSQ_HELADIN_V296={active:true,character:ch.name||'Heladín',view:'coloring',source:originalFront,corrected:url,source_bbox:f,target_bbox:target};
   refresh();
   console.info('[PSQ Heladin 2.9.6] coloring front corregido',window.PSQ_HELADIN_V296);
  },'image/webp',.97);
 }catch(e){console.warn('[PSQ Heladin 2.9.6] patch falló',e)}
})();
})();
