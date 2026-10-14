(()=>{
'use strict';
const LIB=window.PS_LIBRARY;
if(!LIB||!Array.isArray(LIB.characters))return;
const ch=LIB.characters.find(c=>String(c?.slug||'').toLowerCase()==='cuppy'||String(c?.name||'').toLowerCase()==='cuppy');
if(!ch?.assets)return;

const load=(src)=>new Promise((resolve,reject)=>{
 const img=new Image();
 img.crossOrigin='anonymous';
 img.decoding='async';
 img.onload=()=>resolve(img);
 img.onerror=()=>reject(new Error('No cargó '+src));
 img.src=src+(src.includes('?')?'&':'?')+'psq=2941';
});

const detectMain=(img,lineMode=false)=>{
 const sw=260,sh=Math.max(1,Math.round(sw*(img.naturalHeight||1491)/(img.naturalWidth||1055)));
 const c=document.createElement('canvas');c.width=sw;c.height=sh;
 const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,sw,sh);
 const px=ctx.getImageData(0,0,sw,sh).data;
 const mask=new Uint8Array(sw*sh);
 const x0=Math.floor(sw*.08),x1=Math.ceil(sw*.92),y0=Math.floor(sh*.16),y1=Math.ceil(sh*.86);
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
  const p=(y*sw+x)*4,r=px[p],g=px[p+1],b=px[p+2];
  const mx=Math.max(r,g,b),mn=Math.min(r,g,b),sat=mx?((mx-mn)*255/mx):0,gray=(r+g+b)/3;
  const hit=lineMode?(gray<185):((sat>30&&mx>45)||gray<125);
  if(hit)mask[y*sw+x]=1;
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
  const cx=sumX/area,cy=sumY/area,dist=Math.pow((cx-sw/2)/sw,2)+Math.pow((cy-sh/2)/sh,2),score=area*(1-.6*Math.min(dist,1));
  if(!best||score>best.score)best={score,minX,minY,maxX,maxY};
 }
 if(!best)return null;
 const sx=(img.naturalWidth||1055)/sw,sy=(img.naturalHeight||1491)/sh;
 return {x:best.minX*sx,y:best.minY*sy,w:(best.maxX-best.minX+1)*sx,h:(best.maxY-best.minY+1)*sy};
};

const expand=(b,w,h,{px=.08,pt=.08,pb=.08}={})=>{
 const dx=b.w*px,dt=b.h*pt,db=b.h*pb;
 const x=Math.max(0,b.x-dx),y=Math.max(0,b.y-dt);
 return {x,y,w:Math.min(w-x,b.w+2*dx),h:Math.min(h-y,b.h+dt+db)};
};

const refresh=(key)=>{
 try{
  if(typeof activeCharacter!=='undefined'&&typeof getChar==='function'&&typeof renderViewer==='function'){
   const active=getChar(activeCharacter);
   if(active&&active.id===ch.id&&typeof viewerKey!=='undefined'&&viewerKey===key)renderViewer();
  }
 }catch(e){console.warn('[PSQ Cuppy 2.9.4] refresh',e)}
};

const exactMatch=async(frontKey,backKey,lineMode=false)=>{
 const frontAsset=ch.assets?.[frontKey],backAsset=ch.assets?.[backKey];
 if(!frontAsset?.path||!backAsset?.path)return;
 const originalBack=backAsset.path;
 try{
  const [front,back]=await Promise.all([load(frontAsset.path),load(originalBack)]);
  const fw=front.naturalWidth||1055,fh=front.naturalHeight||1491,bw=back.naturalWidth||1055,bh=back.naturalHeight||1491;
  let f=detectMain(front,lineMode),b=detectMain(back,lineMode);
  if(!f||!b)throw new Error('No pude detectar geometría principal');
  f=expand(f,fw,fh,lineMode?{px:.08,pt:.05,pb:.08}:{px:.08,pt:.08,pb:.08});
  b=expand(b,bw,bh,{px:.08,pt:.08,pb:.08});
  const target={x:f.x/fw*bw,y:f.y/fh*bh,w:f.w/fw*bw,h:f.h/fh*bh};

  const canvas=document.createElement('canvas');canvas.width=bw;canvas.height=bh;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,bw,bh);ctx.drawImage(back,0,0,bw,bh);
  const buffer=document.createElement('canvas');buffer.width=Math.max(1,Math.round(b.w));buffer.height=Math.max(1,Math.round(b.h));
  buffer.getContext('2d').drawImage(back,b.x,b.y,b.w,b.h,0,0,buffer.width,buffer.height);
  const pad=4;ctx.fillStyle='#fff';ctx.fillRect(Math.max(0,b.x-pad),Math.max(0,b.y-pad),Math.min(bw,b.w+pad*2),Math.min(bh,b.h+pad*2));
  ctx.drawImage(buffer,target.x,target.y,target.w,target.h);
  canvas.toBlob(blob=>{
   if(!blob)return;
   const url=URL.createObjectURL(blob);
   ch.assets[backKey]={...(ch.assets[backKey]||{}),path:url,width:bw,height:bh,mode:'RGB',transparent:false};
   ch.source_mode='psq_v2.9.4_cuppy_exact_geometry';
   window.PSQ_CUPPY_V294=window.PSQ_CUPPY_V294||{active:true,character:'Cuppy',patched:{}};
   window.PSQ_CUPPY_V294.patched[backKey]={source:originalBack,corrected:url,source_bbox:b,target_bbox:target};
   refresh(backKey);
   console.info('[PSQ Cuppy 2.9.4] '+backKey+' exact geometry match',window.PSQ_CUPPY_V294.patched[backKey]);
  },'image/webp',.97);
 }catch(e){console.warn('[PSQ Cuppy 2.9.4] '+backKey+' patch falló',e)}
};

exactMatch('front_print','back_print',false);
exactMatch('coloring','coloring_back',true);
})();
