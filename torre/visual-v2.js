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

  const normalize=s=>(s||'')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/\s+/g,' ')
    .trim()
    .toUpperCase();

  function visible(el){
    if(!el) return false;
    const r=el.getBoundingClientRect();
    return r.width>=55 && r.height>=55 && r.bottom>=0 && r.right>=0;
  }

  function smallestTextMatch(pattern){
    const nodes=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6,[class*="title"],[class*="name"],[class*="label"],button,a,span,p,div,article,section')]
      .filter(el=>visible(el) && pattern.test(normalize(el.textContent)));
    nodes.sort((a,b)=>normalize(a.textContent).length-normalize(b.textContent).length);
    return nodes[0]||null;
  }

  function findCard(start){
    if(!start) return null;
    let el=start;
    for(let i=0;i<7 && el && el!==document.body;i++,el=el.parentElement){
      const r=el.getBoundingClientRect();
      const cls=normalize(el.className);
      if(r.width>=220 && r.height>=120 && r.height<=1000 && /CARD|TILE|ITEM|OPTION|VERSION|EDITION|MODE|BOX|PANEL/.test(cls)) return el;
    }
    el=start;
    for(let i=0;i<6 && el && el!==document.body;i++,el=el.parentElement){
      const r=el.getBoundingClientRect();
      if(r.width>=220 && r.height>=120 && r.height<=800) return el;
    }
    return null;
  }

  function findExistingVisual(root){
    if(!root) return null;

    const imgs=[...root.querySelectorAll('img')]
      .filter(img=>visible(img))
      .map(img=>({el:img,rect:img.getBoundingClientRect()}))
      .filter(x=>x.rect.width>=55 && x.rect.height>=70)
      .sort((a,b)=>(b.rect.width*b.rect.height)-(a.rect.width*a.rect.height));
    if(imgs.length) return {type:'img',el:imgs[0].el};

    const boxes=[root,...root.querySelectorAll('div,figure,section,header')]
      .filter(el=>visible(el))
      .map(el=>({el,rect:el.getBoundingClientRect(),bg:getComputedStyle(el).backgroundImage}))
      .filter(x=>x.bg && x.bg!=='none' && x.bg.includes('url(') && x.rect.width>=55 && x.rect.height>=70 && x.rect.height<=800)
      .sort((a,b)=>(b.rect.width*b.rect.height)-(a.rect.width*a.rect.height));
    if(boxes.length) return {type:'bg',el:boxes[0].el};

    return null;
  }

  function applyImage(root,url,mode,isHero=false){
    if(!root) return false;
    const visual=findExistingVisual(root);
    if(!visual) return false; // IMPORTANTE: no insertamos nada nuevo.

    const el=visual.el;
    if(el.dataset.pcv3Mode===mode) return true;

    if(visual.type==='img'){
      el.src=url;
      el.removeAttribute('srcset');
      el.classList.add('pcv3-photo',`pcv3-mode-${mode}`);
      if(isHero) el.classList.add('pcv3-hero');
    }else{
      el.style.backgroundImage=`url("${url}")`;
      el.classList.add('pcv3-bg',`pcv3-mode-${mode}`);
      if(isHero) el.classList.add('pcv3-hero');
    }
    el.dataset.pcv3Mode=mode;
    return true;
  }

  function upgrade(pattern,url,mode,isHero=false){
    const label=smallestTextMatch(pattern);
    const card=findCard(label);
    if(card) applyImage(card,url,mode,isHero);
  }

  function run(){
    document.body?.classList.add('pcv3-ready');
    upgrade(/VERDAD O RETO/,IMAGES.hero,'familia',true);
    upgrade(/FAMILIA|KIDS|NINOS?/,IMAGES.familia,'familia');
    upgrade(/AMIGOS|GENERAL/,IMAGES.amigos,'amigos');
    upgrade(/PREVIA|TRAGOS?|BRINDIS/,IMAGES.previa,'previa');
    upgrade(/ADULTOS|SIN FILTRO|18\+/,IMAGES.adultos,'adultos');
    upgrade(/CLASICO CON TORRE/,IMAGES.clasico,'clasico');
  }

  let timer;
  const schedule=()=>{
    clearTimeout(timer);
    timer=setTimeout(()=>requestAnimationFrame(run),100);
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();

  const observer=new MutationObserver(mutations=>{
    if(mutations.some(m=>[...m.addedNodes].some(n=>n.nodeType===1))) schedule();
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});

  window.addEventListener('orientationchange',schedule,{passive:true});
})();
