(()=>{
  // Visual Polish V3 + Premium Library V4: capas no destructivas sobre Portal V2.
  if(!document.getElementById('pc-visual-polish-v3')){
    const visual=document.createElement('link');
    visual.id='pc-visual-polish-v3';
    visual.rel='stylesheet';
    visual.href='portal-polish-v3.css?v=20260921-1';
    document.head.appendChild(visual);
  }

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

  const ensurePremiumV4=()=>{
    if(!document.getElementById('pc-premium-v4-css')){
      const css=document.createElement('link');
      css.id='pc-premium-v4-css';
      css.rel='stylesheet';
      css.href='portal-premium-v4.css?v=20260922-1';
      document.head.appendChild(css);
    }
    if(!document.getElementById('pc-premium-v4-js')){
      const js=document.createElement('script');
      js.id='pc-premium-v4-js';
      js.src='portal-premium-v4.js?v=20260922-1';
      js.defer=true;
      document.head.appendChild(js);
    }
  };

  const base=document.createElement('script');
  base.src='c002-rc-base.js?v=241';
  base.onload=()=>{
    const ensureMercadoPago=()=>{
      const account=document.getElementById('accountBox');
      if(account&&!account.querySelector('.mpTrust')){
        const trust=document.createElement('div');
        trust.className='mpTrust';
        trust.setAttribute('aria-label','Integración de pagos con Mercado Pago');
        trust.innerHTML='<img src="https://cdn.simpleicons.org/mercadopago/00B1EA" alt="Mercado Pago" loading="lazy" onerror="this.style.display=\'none\'"><span class="mpTrustText"><strong>Mercado Pago</strong><small>Integración de pagos online · activación vinculada a tu compra.</small></span>';
        const msg=document.getElementById('activateMsg');
        if(msg)msg.insertAdjacentElement('afterend',trust);else account.appendChild(trust);
      }
    };

    const patch=()=>{
      ensureMercadoPago();

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
        if(!card.querySelector('.psqDownloadAction')){
          const d=document.createElement('div');d.className='previewAction psqDownloadAction';
          d.innerHTML='<a class="btn" href="../paper-squishy/downloads.html">⬇ DESCARGAR IMPRIMIBLES</a>';
          const actions=card.querySelector('.actions');
          if(actions)card.insertBefore(d,actions);else card.appendChild(d);
        }
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
          if(list)list.innerHTML='<div>50 diseños incluidos en 5 colecciones.</div><div>Sweet Squishies, Food Squad, Animal Cuties, Cosmic Friends y Magic Objects.</div><div>PDF Maestro descargable: 157 páginas A4 con frente, dorso y coloring.</div><div>10 diseños nuevos por mes durante 12 meses.</div>';
          if(screenSub)screenSub.textContent='50 DISEÑOS · 5 COLECCIONES · CREATOR PLUS';
        },0);
        return out;
      };
    }

    patch();
    ensurePremiumV4();
    setTimeout(patch,250);
    setTimeout(patch,900);
    setTimeout(patch,1800);
  };
  base.onerror=()=>console.error('No se pudo cargar el módulo comercial base del Portal.');
  document.head.appendChild(base);
})();