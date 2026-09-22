(()=>{
  if(window.__pcCoverSystemV41C)return;
  window.__pcCoverSystemV41C=true;

  const norm=(v)=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();

  const COVERS={
    doble:{
      mode:'art',theme:'doble',a:'#5e1734',b:'#160b13',position:'50% 50%'
    },
    america:{
      mode:'image',theme:'america',src:'../torre-america/assets/cinema-hd/hero.webp',a:'#153b57',b:'#081019',position:'50% 48%'
    },
    math:{
      mode:'brand',theme:'math',logo:'../torre-kids-matematica/assets/torre-kids-logo.svg',mascot:'../torre-kids-matematica/assets/mascota-bloqui.svg',a:'#0a617a',b:'#0b2636',position:'50% 50%'
    },
    party:{
      mode:'art',theme:'party',a:'#80351f',b:'#1a0d10',position:'50% 50%'
    },
    exp001:{
      mode:'image',theme:'exp001',src:'../caso001/assets/escenas/estudio.jpg',a:'#5b4524',b:'#0d0c0b',position:'50% 55%'
    },
    exp002:{
      mode:'image',theme:'exp002',src:'../caso002/assets/visual/bin/room-317-v244.jpg',a:'#5c3a1e',b:'#0b0908',position:'50% 52%'
    },
    tarot:{
      mode:'art',theme:'tarot',a:'#432458',b:'#0d0914',position:'50% 50%'
    },
    vincores:{
      mode:'art',theme:'vincores',a:'#214e43',b:'#0b1513',position:'50% 50%'
    },
    squishy:{
      mode:'art',theme:'squishy',a:'#8d4268',b:'#24101a',position:'50% 50%'
    },
    quimera:{
      mode:'art',theme:'quimera',a:'#4d4126',b:'#08090a',position:'50% 50%'
    }
  };

  const resolveKey=(card)=>{
    const type=String(card.dataset.pcV4Type||'').toLowerCase();
    if(type==='doble')return 'doble';
    if(type==='america')return 'america';
    if(type==='math')return 'math';
    if(type==='party')return 'party';
    if(type==='exp001')return 'exp001';
    if(type==='exp002')return 'exp002';
    if(type==='tarot')return 'tarot';
    if(type==='vincores')return 'vincores';
    if(type==='squishy')return 'squishy';

    const title=norm(card.dataset.pcCommercialTitle||card.querySelector('.pcSmartHead h3')?.textContent||card.querySelector('h3')?.textContent);
    const accent=norm(card.querySelector('.accent')?.textContent);
    if(title.includes('DOBLE INTENCION'))return 'doble';
    if(title.includes('TORRE DE AMERICA'))return 'america';
    if(title.includes('MATEMATICA')||title.includes('CHEVERE KIDS'))return 'math';
    if(title.includes('VERDAD O RETO')||title.includes('MEGA PACK'))return 'party';
    if(title.includes('ULTIMA REUNION')||title.includes('CASO 001')||accent.includes('CASO 001'))return 'exp001';
    if(title.includes('HOTEL ORFEO')||title.includes('CASO 002')||title.includes('HABITACION 317')||accent.includes('CASO 002'))return 'exp002';
    if(title.includes('TAROT'))return 'tarot';
    if(title.includes('VINCORES'))return 'vincores';
    if(title.includes('SQUISHY'))return 'squishy';
    if(title.includes('QUIMERA'))return 'quimera';
    return '';
  };

  const artMarkup=(key)=>{
    if(key==='doble')return '<div class="pcCoverArt pcArtDoble"><i></i><i></i><i></i><span>CHISPA</span><span>FUEGO</span><span>DOMINIO</span></div>';
    if(key==='party')return '<div class="pcCoverArt pcArtParty"><i></i><i></i><i></i><i></i><i></i><b>?</b><b>!</b></div>';
    if(key==='tarot')return '<div class="pcCoverArt pcArtTarot"><div class="pcTarotCard c1">✦</div><div class="pcTarotCard c2">☾</div><div class="pcTarotCard c3">✧</div><i></i><i></i><i></i></div>';
    if(key==='vincores')return '<div class="pcCoverArt pcArtVincores"><span></span><span></span><span></span><span></span><i></i><i></i><i></i></div>';
    if(key==='squishy')return '<div class="pcCoverArt pcArtSquishy"><span>♡</span><span>✦</span><span>☺</span><span>★</span><i></i><i></i></div>';
    if(key==='quimera')return '<div class="pcCoverArt pcArtQuimera"><span></span><span></span><span></span><b>Q</b></div>';
    if(key==='math')return '<div class="pcCoverArt pcArtMath"><span>+</span><span>×</span><span>÷</span><span>=</span><i></i><i></i></div>';
    if(key==='america')return '<div class="pcCoverArt pcArtAmerica"><span></span><i></i><i></i></div>';
    if(key==='exp001'||key==='exp002')return '<div class="pcCoverArt pcArtCase"><span></span><i></i><i></i></div>';
    return '';
  };

  function ensureCover(card,key,def){
    let cover=card.querySelector(':scope > .pcV4Cover');
    if(cover)return cover;
    cover=document.createElement('div');
    cover.className='pcV4Cover';
    const title=card.dataset.pcCommercialTitle||card.querySelector('h3')?.textContent||'PasaloChevere';
    cover.innerHTML='<div class="pcV4CoverMeta"><span class="pcV4CoverKicker">PASALOCHEVERE</span><span class="pcV4CoverName"></span></div>';
    cover.querySelector('.pcV4CoverName').textContent=title;
    card.insertAdjacentElement('afterbegin',cover);
    return cover;
  }

  function addBackgroundImage(media,cover,def){
    const img=document.createElement('img');
    img.className='pcCoverPhoto';
    img.alt='';
    img.setAttribute('aria-hidden','true');
    img.decoding='async';
    img.loading='lazy';
    img.style.objectPosition=def.position||'50% 50%';
    img.addEventListener('load',()=>cover.classList.add('pcCoverMediaReady'),{once:true});
    img.addEventListener('error',()=>{
      cover.classList.add('pcCoverMediaFailed');
      img.remove();
    },{once:true});
    img.src=def.src;
    media.appendChild(img);
  }

  function addBrandAssets(media,cover,def){
    const mascot=document.createElement('img');
    mascot.className='pcCoverMascot';
    mascot.alt='';
    mascot.setAttribute('aria-hidden','true');
    mascot.decoding='async';
    mascot.src=def.mascot;
    mascot.addEventListener('load',()=>cover.classList.add('pcCoverMediaReady'),{once:true});
    mascot.addEventListener('error',()=>mascot.remove(),{once:true});
    media.appendChild(mascot);

    const logo=document.createElement('img');
    logo.className='pcCoverBrandLogo';
    logo.alt='';
    logo.setAttribute('aria-hidden','true');
    logo.decoding='async';
    logo.src=def.logo;
    logo.addEventListener('error',()=>logo.remove(),{once:true});
    media.appendChild(logo);
  }

  function applyCover(card){
    if(!card||card.classList.contains('emptyCard'))return;
    const key=resolveKey(card);
    if(!key||!COVERS[key])return;
    if(card.dataset.pcCover41c==='1'&&card.dataset.pcCoverKey===key)return;

    const def=COVERS[key];
    const cover=ensureCover(card,key,def);
    card.dataset.pcCover41c='1';
    card.dataset.pcCoverKey=key;
    cover.dataset.pcCoverKey=key;
    cover.classList.add('pcRealCover','pcCoverTheme-'+def.theme);
    cover.classList.remove('hasImage','pcCoverMediaReady','pcCoverMediaFailed');
    cover.style.removeProperty('background-image');
    cover.style.setProperty('--cover-a',def.a);
    cover.style.setProperty('--cover-b',def.b);

    cover.querySelectorAll(':scope > .pcCoverMedia,:scope > .pcCoverArt').forEach(el=>el.remove());

    const artHolder=document.createElement('div');
    artHolder.innerHTML=artMarkup(key);
    const art=artHolder.firstElementChild;
    if(art)cover.insertBefore(art,cover.firstChild);

    if(def.mode==='image'){
      const media=document.createElement('div');
      media.className='pcCoverMedia';
      addBackgroundImage(media,cover,def);
      cover.insertBefore(media,cover.firstChild);
    }else if(def.mode==='brand'){
      const media=document.createElement('div');
      media.className='pcCoverMedia pcCoverBrandMedia';
      addBrandAssets(media,cover,def);
      cover.insertBefore(media,cover.firstChild);
    }

    const meta=cover.querySelector('.pcV4CoverMeta');
    if(meta)meta.classList.add('pcCoverMetaReal');
    const icon=cover.querySelector('.pcV4CoverIcon');
    if(icon)icon.classList.add('pcCoverIconReal');
  }

  function applyAll(){
    document.querySelectorAll('.card:not(.emptyCard)').forEach(card=>{
      if(card.querySelector(':scope > .pcV4Cover')||card.closest('#myGamesGrid'))applyCover(card);
    });
  }

  function watch(){
    const roots=[document.getElementById('myGamesGrid'),document.querySelector('.categoryHub')?.parentElement].filter(Boolean);
    roots.forEach(root=>{
      if(root.dataset.pcCoverObserved==='1')return;
      root.dataset.pcCoverObserved='1';
      let queued=false;
      const observer=new MutationObserver(()=>{
        if(queued)return;
        queued=true;
        requestAnimationFrame(()=>{queued=false;applyAll()});
      });
      observer.observe(root,{childList:true,subtree:true});
    });
  }

  function boot(){watch();applyAll()}
  window.pcApplyProductCovers=boot;
  window.PC_COVER_REGISTRY_V41C=Object.freeze({...COVERS});

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  setTimeout(boot,350);
  setTimeout(boot,1000);
  setTimeout(boot,2200);
})();