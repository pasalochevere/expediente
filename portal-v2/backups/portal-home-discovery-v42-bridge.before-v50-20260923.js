(()=>{
  if(window.__pcHomeDiscoveryV42Bridge)return;
  window.__pcHomeDiscoveryV42Bridge=true;
  const style=document.createElement('style');
  style.id='pc-home-discovery-v42-bridge-style';
  style.textContent='.pcV42Feature h1{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif!important}.pcV42Home{scroll-margin-top:82px}';
  document.head.appendChild(style);
  const sync=()=>{
    const home=document.querySelector('.pcV42Home');
    const legacy=[...document.querySelectorAll('.hero')].find(el=>!el.classList.contains('pcV42Home'));
    if(home){
      home.id='inicio';
      if(legacy?.id==='inicio')legacy.removeAttribute('id');
    }else if(legacy&&!legacy.id){
      legacy.id='inicio';
    }
  };
  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;sync()})};
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','id']});
  sync();setTimeout(sync,300);setTimeout(sync,1200);
})();