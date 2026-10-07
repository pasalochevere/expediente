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
  if(window.__pcMonsterFactoryPortalV2)return;
  window.__pcMonsterFactoryPortalV2=true;

  const PRODUCT='MON-001';
  const PRODUCT_URL='https://pasalochevere.github.io/expediente/fabrica-monstruos/';
  const PORTAL_URL='https://pasalochevere.github.io/expediente/portal-v2/';
  const monsterCard=`<article class="card" data-cat="creative" id="pc-monster-factory-card-v2" data-product-code="MON-001"><span class="status live">● NUEVO</span><h3>FÁBRICA DE MONSTRUOS</h3><div class="accent">CREADOR OFFLINE · 100 MONSTRUOS · ADN · IMPRIMIBLES</div><p>Combiná cuerpo, textura, color, ojos, boca, brazos, movimiento y accesorios. Guardá ADN, armá tu Monstruoteca e imprimí cartas, certificados y recortables.</p><div class="note" style="margin-top:8px"><b>MON-001</b> · ventas online todavía desactivadas</div><div class="actions"><a class="btn primary" href="${PRODUCT_URL}">VER PRODUCTO</a><a class="btn" href="${PORTAL_URL}?product=MON-001&category=creative#accountBox">ACTIVAR / INGRESAR</a></div></article>`;
  const newsCard=`<article class="newsCard" id="pc-monster-factory-news-v2" onclick="openCategory('creative')" style="cursor:pointer"><span class="newsTag new">NUEVO</span><b>FÁBRICA DE MONSTRUOS 1.0</b><p>100 criaturas oficiales, creador offline, ADN reconstruible, cartas, stickers, posters e imprimibles.</p></article>`;

  function normalizeMonsterLicense(l){
    if(String(l?.product_code||'').toUpperCase()!==PRODUCT)return l;
    const access=encodeURIComponent(l?.activation_code||'');
    return {...l,product_name:'FÁBRICA DE MONSTRUOS 1.0',game_url:PRODUCT_URL+(access?'?access='+access:'')};
  }

  function patchMonsterFactoryFunctions(){
    const cat=window.licenseCategory;
    if(typeof cat==='function'&&!cat.__monsterFactoryPatchedV2){
      const base=cat;
      const wrapped=function(l){
        const code=String(l?.product_code||'').toUpperCase(),name=String(l?.product_name||'').toUpperCase();
        if(code===PRODUCT||name.includes('FÁBRICA DE MONSTRUOS')||name.includes('FABRICA DE MONSTRUOS'))return {key:'creative',label:'✂ CREATIVOS & DIDÁCTICOS'};
        return base(l);
      };
      wrapped.__monsterFactoryPatchedV2=true;
      window.licenseCategory=wrapped;
    }

    const href=window.gameHref;
    if(typeof href==='function'&&!href.__monsterFactoryPatchedV2){
      const baseHref=href;
      const wrappedHref=function(l){
        if(String(l?.product_code||'').toUpperCase()===PRODUCT){
          const access=encodeURIComponent(l?.activation_code||'');
          return PRODUCT_URL+(access?'?access='+access:'');
        }
        return baseHref(l);
      };
      wrappedHref.__monsterFactoryPatchedV2=true;
      window.gameHref=wrappedHref;
    }

    const render=window.renderLicenses;
    if(typeof render==='function'&&!render.__monsterFactoryPatchedV2){
      const baseRender=render;
      const wrappedRender=function(list){
        return baseRender((list||[]).map(normalizeMonsterLicense));
      };
      wrappedRender.__monsterFactoryPatchedV2=true;
      window.renderLicenses=wrappedRender;
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
      const old=document.getElementById('pc-monster-factory-card-v1');
      if(old)old.remove();
      if(!document.getElementById('pc-monster-factory-card-v2'))grid.insertAdjacentHTML('beforeend',monsterCard);
    }
    const carousel=document.querySelector('.newsCarousel');
    const oldNews=document.getElementById('pc-monster-factory-news-v1');
    if(oldNews)oldNews.remove();
    if(carousel&&!document.getElementById('pc-monster-factory-news-v2'))carousel.insertAdjacentHTML('afterbegin',newsCard);
  }

  function handleDeepLink(){
    const q=new URLSearchParams(location.search);
    const wantsMonster=String(q.get('product')||'').toUpperCase()===PRODUCT||String(q.get('category')||'').toLowerCase()==='creative';
    if(!wantsMonster)return;
    injectMonsterFactory();
    if(typeof window.openCategory==='function')window.openCategory('creative');
    setTimeout(()=>{
      const hash=location.hash&&document.querySelector(location.hash);
      const target=hash||document.getElementById('pc-monster-factory-card-v2')||document.getElementById('drawer-creative');
      if(target)target.scrollIntoView({behavior:'smooth',block:'center'});
    },500);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{injectMonsterFactory();handleDeepLink()},{once:true});
  else{injectMonsterFactory();handleDeepLink()}
  [250,700,1500,3000,6000].forEach(ms=>setTimeout(()=>{injectMonsterFactory();if(ms===700)handleDeepLink()},ms));
})();