(function(){
  'use strict';
  const A=window.C002_VISUAL_ASSETS||{};
  const D=window.CASE002_DATA;
  if(!D){console.warn('[C002 VISUAL] CASE002_DATA unavailable');return;}

  const put=(arr)=>{(arr||[]).forEach(x=>{if(x&&x.id&&A[x.id]) x.image=A[x.id];});};
  put(D.characters); put(D.locations); put(D.objects);
  if(D.special_location && A.room_317) D.special_location.image=A.room_317;

  const patchDom=()=>{
    const hero=document.querySelector('.hero-main > img');
    if(hero&&A.hero_hotel){hero.src=A.hero_hotel;hero.alt='Hotel Orfeo bajo la tormenta';}
    const door=document.querySelector('.door-card img');
    if(door&&A.door_317){door.src=A.door_317;door.alt='Puerta 317 del Hotel Orfeo';}
    document.querySelectorAll('.card img,.evidence-card img').forEach(img=>{img.loading='lazy';img.decoding='async';});
    document.documentElement.dataset.c002VisualRestored='v1';
  };

  const oldRenderCinema=window.renderCinema;
  const cinemaAssets=['hero_hotel','hero_hotel','L01','L02','O06','O03','L05','L06','door_317','hero_hotel'];
  if(typeof oldRenderCinema==='function'){
    window.renderCinema=function(){
      const r=oldRenderCinema.apply(this,arguments);
      try{
        const counter=document.getElementById('cinemaCounter');
        const idx=Math.max(0,(parseInt(counter?.textContent||'1',10)||1)-1);
        const key=cinemaAssets[idx]||'hero_hotel';
        const bg=document.getElementById('cinemaBg');
        if(bg&&A[key]) bg.src=A[key];
      }catch(e){console.warn('[C002 VISUAL] cinema patch',e);}
      return r;
    };
  }

  const repaint=()=>{
    patchDom();
    if(document.readyState!=='loading' && typeof window.renderBase==='function'){
      try{window.renderBase();patchDom();}catch(_){ }
    }
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',repaint,{once:true});
  else repaint();

  window.C002_VISUAL_RESTORATION={version:'P2.2R.4-v1',assets:Object.keys(A).length};
})();
