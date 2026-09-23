(()=>{
  'use strict';

  const IMAGES={
    hero:'https://d2ol7oe51mr4n9.cloudfront.net/user_3HsxoUqhL2jq6HZbpDZ6JgCwUeq/133f2d53-0a2e-4ee5-ac91-1fa6b74b60b1.png',
    familia:'https://d2ol7oe51mr4n9.cloudfront.net/user_3HsxoUqhL2jq6HZbpDZ6JgCwUeq/133f2d53-0a2e-4ee5-ac91-1fa6b74b60b1.png',
    amigos:'https://d2ol7oe51mr4n9.cloudfront.net/user_3HsxoUqhL2jq6HZbpDZ6JgCwUeq/d26da14d-d428-4b9a-9cb0-8aef5b93d757.png',
    previa:'https://d2ol7oe51mr4n9.cloudfront.net/user_3HsxoUqhL2jq6HZbpDZ6JgCwUeq/bcb46ec5-29ce-4c73-976e-fa05a6d5a023.png',
    adultos:'https://d2ol7oe51mr4n9.cloudfront.net/user_3HsxoUqhL2jq6HZbpDZ6JgCwUeq/1081a9f9-6568-40c2-869a-2e4250e8c569.png',
    clasico:'https://d2ol7oe51mr4n9.cloudfront.net/user_3HsxoUqhL2jq6HZbpDZ6JgCwUeq/1081a9f9-6568-40c2-869a-2e4250e8c569.png'
  };

  const N=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toUpperCase();

  function candidates(label){
    const wanted=N(label);
    return [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,[class*="title"],[class*="name"],[class*="label"],button,a,article,section,div')]
      .filter(el=>!el.closest('.pcv2-cover') && N(el.textContent).includes(wanted));
  }

  function bestLabelElement(label){
    const all=candidates(label);
    if(!all.length) return null;
    all.sort((a,b)=>{
      const ta=N(a.textContent).length,tb=N(b.textContent).length;
      return ta-tb;
    });
    return all[0];
  }

  function usableBox(el,minH=110,maxH=850){
    if(!el) return false;
    const r=el.getBoundingClientRect();
    return r.width>=Math.min(240,window.innerWidth*.62) && r.height>=minH && r.height<=maxH;
  }

  function nearestCard(el){
    if(!el) return null;
    let cur=el;
    for(let i=0;i<7 && cur && cur!==document.body;i++,cur=cur.parentElement){
      const cls=N(cur.className);
      if((/CARD|TILE|ITEM|OPTION|VERSION|EDITION|MODE/.test(cls)) && usableBox(cur,100,850)) return cur;
    }
    cur=el;
    for(let i=0;i<7 && cur && cur!==document.body;i++,cur=cur.parentElement){
      if(usableBox(cur,120,760)) return cur;
    }
    return el.parentElement;
  }

  function imageLikeWithin(root){
    if(!root) return null;
    const imgs=[...root.querySelectorAll('img,picture img')].filter(img=>{
      const r=img.getBoundingClientRect();
      return r.width>180 && r.height>90;
    }).sort((a,b)=>{
      const A=a.getBoundingClientRect(),B=b.getBoundingClientRect();
      return (B.width*B.height)-(A.width*A.height);
    });
    if(imgs[0]) return {type:'img',el:imgs[0]};

    const boxes=[root,...root.querySelectorAll('div,section,header,figure')].filter(el=>{
      const r=el.getBoundingClientRect();
      if(r.width<180||r.height<90||r.height>650) return false;
      return getComputedStyle(el).backgroundImage!=='none';
    }).sort((a,b)=>{
      const A=a.getBoundingClientRect(),B=b.getBoundingClientRect();
      return (B.width*B.height)-(A.width*A.height);
    });
    if(boxes[0]) return {type:'bg',el:boxes[0]};
    return null;
  }

  function replaceVisual(root,url,mode,isHero=false){
    if(!root || root.dataset.pcv2Visual==='1') return false;
    const media=imageLikeWithin(root);
    if(media){
      if(media.type==='img'){
        media.el.src=url;
        media.el.removeAttribute('srcset');
        media.el.classList.add('pcv2-photo',`pcv2-mode-${mode}`);
        if(isHero) media.el.classList.add('pcv2-hero-photo');
      }else{
        media.el.style.backgroundImage=`url("${url}")`;
        media.el.classList.add('pcv2-bg',`pcv2-mode-${mode}`);
        if(isHero) media.el.classList.add('pcv2-hero-bg');
      }
      root.classList.add('pcv2-upgraded-card');
      root.dataset.pcv2Visual='1';
      return true;
    }
    return false;
  }

  function addCover(root,url,mode,label){
    if(!root || root.querySelector(':scope > .pcv2-cover') || root.dataset.pcv2Cover==='1') return;
    const cover=document.createElement('div');
    cover.className=`pcv2-cover pcv2-mode-${mode}`;
    cover.style.backgroundImage=`url("${url}")`;
    cover.setAttribute('aria-hidden','true');
    const badge=document.createElement('span');
    badge.className='pcv2-cover-badge';
    badge.textContent=label;
    cover.appendChild(badge);
    root.insertBefore(cover,root.firstChild);
    root.classList.add('pcv2-upgraded-card');
    root.dataset.pcv2Cover='1';
  }

  function upgradeHero(){
    const el=bestLabelElement('VERDAD O RETO');
    if(!el) return;
    let root=nearestCard(el);
    // Si la tarjeta textual no contiene la imagen grande, ampliamos uno o dos niveles con prudencia.
    if(root && !imageLikeWithin(root)){
      let p=root.parentElement;
      for(let i=0;i<2 && p && p!==document.body;i++,p=p.parentElement){
        if(usableBox(p,220,900) && imageLikeWithin(p)){ root=p; break; }
      }
    }
    if(root) replaceVisual(root,IMAGES.hero,'familia',true);
  }

  const MODES=[
    {label:'FAMILIA',key:'familia',display:'Familia'},
    {label:'AMIGOS',key:'amigos',display:'Amigos'},
    {label:'PREVIA',key:'previa',display:'Previa'},
    {label:'ADULTOS',key:'adultos',display:'Adultos'}
  ];

  function upgradeModes(){
    MODES.forEach(m=>{
      const el=bestLabelElement(m.label);
      const root=nearestCard(el);
      if(!root) return;
      if(!replaceVisual(root,IMAGES[m.key],m.key,false)) addCover(root,IMAGES[m.key],m.key,m.display);
    });
  }

  function upgradeClassic(){
    const el=bestLabelElement('CLASICO CON TORRE') || bestLabelElement('CLASICO');
    const root=nearestCard(el);
    if(!root) return;
    if(!replaceVisual(root,IMAGES.clasico,'clasico',false)) addCover(root,IMAGES.clasico,'clasico','Clásico con Torre');
  }

  let timer=0;
  function apply(){
    clearTimeout(timer);
    timer=setTimeout(()=>{
      document.body.classList.add('pcv2-ready');
      upgradeHero();
      upgradeModes();
      upgradeClassic();
    },80);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();

  // Algunas vistas del portal se renderizan después; reaplicamos sin duplicar elementos.
  const mo=new MutationObserver(muts=>{
    if(muts.some(m=>[...m.addedNodes].some(n=>n.nodeType===1 && !n.classList?.contains('pcv2-cover')))) apply();
  });
  mo.observe(document.documentElement,{childList:true,subtree:true});

  window.addEventListener('orientationchange',apply,{passive:true});
})();
