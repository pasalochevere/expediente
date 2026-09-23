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
