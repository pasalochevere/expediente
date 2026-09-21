(()=>{
  const originalGameHref=window.gameHref;
  if(typeof originalGameHref==='function'&&!window.__c002P24RoutePatched){
    window.__c002P24RoutePatched=true;
    window.gameHref=function(l){
      if(String(l?.product_code||'').toUpperCase()==='EXP-002'){
        return '../caso002/?access='+encodeURIComponent(l.activation_code||'')+'&build=20260921-p24fix2';
      }
      return originalGameHref(l);
    };
  }

  const base=document.createElement('script');
  base.src='c002-rc-base.js?v=241';
  base.onload=()=>{
    const patch=()=>{
      const chip=document.querySelector('.catChip[data-category="creative"] .catCount');
      if(chip)chip.textContent='1 producto';

      const cards=[...document.querySelectorAll('#drawer-creative .card')];
      const card=cards.find(c=>(c.querySelector('h3')?.textContent||'').toUpperCase().includes('PAPER SQUISHY FACTORY'));
      if(card){
        card.classList.remove('emptyCard');
        const status=card.querySelector('.status');
        if(status){status.classList.add('live');status.textContent='● DISPONIBLE'}
        const accent=card.querySelector('.accent');
        if(accent)accent.textContent='50 DISEÑOS · 5 COLECCIONES · CREATOR PLUS';
        const p=card.querySelector('p');
        if(p)p.textContent='Creá, personalizá e imprimí Paper Squishies. Incluye 50 diseños en 5 colecciones, editor Creator Plus y 10 nuevos diseños por mes durante 12 meses.';
      }
    };

    const originalOpenPreview=window.openPreview;
    if(typeof originalOpenPreview==='function'&&!window.__psqP24PreviewPatched){
      window.__psqP24PreviewPatched=true;
      window.openPreview=function(productCode){
        const out=originalOpenPreview(productCode);
        if(productCode==='PSQ-FACTORY')setTimeout(()=>{
          const sub=document.getElementById('previewSubtitle');
          const summary=document.getElementById('previewSummary');
          const list=document.getElementById('previewList');
          const screenSub=document.getElementById('previewScreenSub');
          if(sub)sub.textContent='50 DISEÑOS · 5 COLECCIONES · CREATOR PLUS';
          if(summary)summary.textContent='Elegí entre 50 diseños, personalizalos en Creator Plus y prepará frente, dorso y versiones para imprimir.';
          if(list)list.innerHTML='<div>50 diseños incluidos en 5 colecciones.</div><div>Sweet Squishies, Food Squad, Animal Cuties, Cosmic Friends y Magic Objects.</div><div>10 diseños nuevos por mes durante 12 meses.</div>';
          if(screenSub)screenSub.textContent='50 DISEÑOS · 5 COLECCIONES · CREATOR PLUS';
        },0);
        return out;
      };
    }

    patch();
    setTimeout(patch,250);
    setTimeout(patch,900);
  };
  base.onerror=()=>console.error('No se pudo cargar el módulo comercial base del Portal.');
  document.head.appendChild(base);
})();