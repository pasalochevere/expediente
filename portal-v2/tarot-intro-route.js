(()=>{
  if(window.__pcTarotIntroRouteBoot)return;
  window.__pcTarotIntroRouteBoot=true;
  const install=()=>{
    if(typeof window.gameHref!=='function')return false;
    if(window.gameHref.__pcTarotIntroRoute)return true;
    const previous=window.gameHref;
    const wrapped=function(l){
      const product=String(l?.product_code||'').toUpperCase();
      if(product==='TAROT-78'||product.startsWith('TAROT-')){
        const access=encodeURIComponent(l?.activation_code||'');
        return '../mesa-tarot/intro.html?access='+access+'&build=20260923-tarot-intro-v1';
      }
      return previous(l);
    };
    wrapped.__pcTarotIntroRoute=true;
    window.gameHref=wrapped;
    return true;
  };
  if(install())return;
  let tries=0;
  const timer=setInterval(()=>{tries++;if(install()||tries>120)clearInterval(timer)},100);
})();

(()=>{
  if(window.__pcMonsterFactoryPortalV1)return;
  window.__pcMonsterFactoryPortalV1=true;

  const monsterCard=`<article class="card" data-cat="creative" id="pc-monster-factory-card-v1" data-product-code="MON-001"><span class="status live">● NUEVO</span><h3>FÁBRICA DE MONSTRUOS</h3><div class="accent">CREADOR OFFLINE · 100 MONSTRUOS · ADN · IMPRIMIBLES</div><p>Combiná cuerpo, textura, color, ojos, boca, brazos, movimiento y accesorios. Guardá ADN, armá tu Monstruoteca e imprimí cartas, certificados y recortables.</p><div class="actions"><a class="btn primary" href="../fabrica-monstruos/">VER PRODUCTO</a><button class="btn" onclick="scrollToActivation()">ACTIVAR / CONSULTAR</button></div></article>`;
  const newsCard=`<article class="newsCard" id="pc-monster-factory-news-v1" onclick="openCategory('creative')" style="cursor:pointer"><span class="newsTag new">NUEVO</span><b>FÁBRICA DE MONSTRUOS 1.0</b><p>100 criaturas oficiales, creador offline, ADN reconstruible, cartas, stickers, posters e imprimibles.</p></article>`;

  function patchMonsterFactoryFunctions(){
    const cat=window.licenseCategory;
    if(typeof cat==='function'&&!cat.__monsterFactoryPatched){
      const base=cat;
      const wrapped=function(l){
        const code=String(l?.product_code||'').toUpperCase(),name=String(l?.product_name||'').toUpperCase();
        if(code==='MON-001'||name.includes('FÁBRICA DE MONSTRUOS')||name.includes('FABRICA DE MONSTRUOS'))return {key:'creative',label:'✂ CREATIVOS & DIDÁCTICOS'};
        return base(l);
      };
      wrapped.__monsterFactoryPatched=true;
      window.licenseCategory=wrapped;
    }
    const href=window.gameHref;
    if(typeof href==='function'&&!href.__monsterFactoryPatched){
      const baseHref=href;
      const wrappedHref=function(l){
        if(String(l?.product_code||'').toUpperCase()==='MON-001')return '../fabrica-monstruos/';
        return baseHref(l);
      };
      wrappedHref.__monsterFactoryPatched=true;
      window.gameHref=wrappedHref;
    }
  }

  function injectMonsterFactory(){
    patchMonsterFactoryFunctions();
    const chip=document.querySelector('.catChip.creative .catCount');
    if(chip)chip.textContent='1 título';
    const grid=document.querySelector('#drawer-creative .drawerGrid');
    if(grid){
      const placeholder=grid.querySelector('.emptyCard');
      if(placeholder)placeholder.remove();
      if(!document.getElementById('pc-monster-factory-card-v1'))grid.insertAdjacentHTML('beforeend',monsterCard);
    }
    const carousel=document.querySelector('.newsCarousel');
    if(carousel&&!document.getElementById('pc-monster-factory-news-v1'))carousel.insertAdjacentHTML('afterbegin',newsCard);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',injectMonsterFactory,{once:true});
  else injectMonsterFactory();
  [250,700,1500,3000,6000].forEach(ms=>setTimeout(injectMonsterFactory,ms));
})();