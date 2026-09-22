(()=>{
  // Visual Polish V3 + Premium Library V4 + Smart Cards V4.1A + Product Mapping V4.1B + Cover System V4.1C + Payment/Trust V4.1D + Library Experience V4.1E + Preview Real V2.
  // Capas no destructivas sobre Portal V2: no alteran auth, licencias ni backend.
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

  const ensurePreviewRealV2=()=>{
    if(!document.getElementById('pc-preview-real-v2-css')){
      const css=document.createElement('link');
      css.id='pc-preview-real-v2-css';
      css.rel='stylesheet';
      css.href='portal-preview-real-v2.css?v=20260922-1';
      document.head.appendChild(css);
    }
    if(!document.getElementById('pc-preview-real-v2-js')){
      const js=document.createElement('script');
      js.id='pc-preview-real-v2-js';
      js.src='portal-preview-real-v2.js?v=20260922-1';
      js.defer=true;
      document.head.appendChild(js);
    }else if(typeof window.pcApplyPreviewRealV2==='function'){
      window.pcApplyPreviewRealV2();
    }
  };

  const ensureLibraryExperienceV41E=()=>{
    if(!document.getElementById('pc-library-experience-v41e-css')){
      const css=document.createElement('link');
      css.id='pc-library-experience-v41e-css';
      css.rel='stylesheet';
      css.href='portal-library-experience-v41e.css?v=20260922-1';
      document.head.appendChild(css);
    }

    let js=document.getElementById('pc-library-experience-v41e-js');
    if(!js){
      js=document.createElement('script');
      js.id='pc-library-experience-v41e-js';
      js.src='portal-library-experience-v41e.js?v=20260922-1';
      js.defer=true;
      js.addEventListener('load',ensurePreviewRealV2,{once:true});
      document.head.appendChild(js);
    }else if(window.__pcLibraryExperienceV41E){
      if(typeof window.pcApplyLibraryExperience==='function')window.pcApplyLibraryExperience();
      ensurePreviewRealV2();
    }else{
      js.addEventListener('load',ensurePreviewRealV2,{once:true});
    }

    setTimeout(ensurePreviewRealV2,1200);
  };

  const ensurePaymentTrustV41D=()=>{
    if(!document.getElementById('pc-payment-trust-v41d-css')){
      const css=document.createElement('link');
      css.id='pc-payment-trust-v41d-css';
      css.rel='stylesheet';
      css.href='portal-payment-trust-v41d.css?v=20260922-1';
      document.head.appendChild(css);
    }

    let js=document.getElementById('pc-payment-trust-v41d-js');
    if(!js){
      js=document.createElement('script');
      js.id='pc-payment-trust-v41d-js';
      js.src='portal-payment-trust-v41d.js?v=20260922-1';
      js.defer=true;
      js.addEventListener('load',ensureLibraryExperienceV41E,{once:true});
      document.head.appendChild(js);
    }else if(window.__pcPaymentTrustV41D){
      if(typeof window.pcApplyPaymentTrust==='function')window.pcApplyPaymentTrust();
      ensureLibraryExperienceV41E();
    }else{
      js.addEventListener('load',ensureLibraryExperienceV41E,{once:true});
    }

    setTimeout(ensureLibraryExperienceV41E,1100);
  };

  const ensureCoverSystemV41C=()=>{
    if(!document.getElementById('pc-cover-system-v41c-css')){
      const css=document.createElement('link');
      css.id='pc-cover-system-v41c-css';
      css.rel='stylesheet';
      css.href='portal-cover-system-v41c.css?v=20260922-1';
      document.head.appendChild(css);
    }

    let js=document.getElementById('pc-cover-system-v41c-js');
    if(!js){
      js=document.createElement('script');
      js.id='pc-cover-system-v41c-js';
      js.src='portal-cover-system-v41c.js?v=20260922-1';
      js.defer=true;
      js.addEventListener('load',ensurePaymentTrustV41D,{once:true});
      document.head.appendChild(js);
    }else if(window.__pcCoverSystemV41C){
      if(typeof window.pcApplyProductCovers==='function')window.pcApplyProductCovers();
      ensurePaymentTrustV41D();
    }else{
      js.addEventListener('load',ensurePaymentTrustV41D,{once:true});
    }

    setTimeout(ensurePaymentTrustV41D,1100);
  };

  const ensureProductMappingV41B=()=>{
    if(!document.getElementById('pc-product-mapping-v41b-css')){
      const css=document.createElement('link');
      css.id='pc-product-mapping-v41b-css';
      css.rel='stylesheet';
      css.href='portal-product-mapping-v41b.css?v=20260922-1';
      document.head.appendChild(css);
    }

    let js=document.getElementById('pc-product-mapping-v41b-js');
    if(!js){
      js=document.createElement('script');
      js.id='pc-product-mapping-v41b-js';
      js.src='portal-product-mapping-v41b.js?v=20260922-2';
      js.defer=true;
      js.addEventListener('load',ensureCoverSystemV41C,{once:true});
      document.head.appendChild(js);
    }else if(window.__pcProductMappingV41B){
      if(typeof window.pcMapLibraryProducts==='function')window.pcMapLibraryProducts();
      ensureCoverSystemV41C();
    }else{
      js.addEventListener('load',ensureCoverSystemV41C,{once:true});
    }

    setTimeout(ensureCoverSystemV41C,1000);
  };

  const ensureSmartCardsV41A=()=>{
    if(!document.getElementById('pc-smartcards-v41a-css')){
      const css=document.createElement('link');
      css.id='pc-smartcards-v41a-css';
      css.rel='stylesheet';
      css.href='portal-smartcards-v41a.css?v=20260922-1';
      document.head.appendChild(css);
    }

    let js=document.getElementById('pc-smartcards-v41a-js');
    if(!js){
      js=document.createElement('script');
      js.id='pc-smartcards-v41a-js';
      js.src='portal-smartcards-v41a.js?v=20260922-1';
      js.defer=true;
      js.addEventListener('load',ensureProductMappingV41B,{once:true});
      document.head.appendChild(js);
    }else if(window.__pcSmartCardsV41A){
      ensureProductMappingV41B();
    }else{
      js.addEventListener('load',ensureProductMappingV41B,{once:true});
    }

    setTimeout(ensureProductMappingV41B,900);
  };

  const ensurePremiumV4=()=>{
    if(!document.getElementById('pc-premium-v4-css')){
      const css=document.createElement('link');
      css.id='pc-premium-v4-css';
      css.rel='stylesheet';
      css.href='portal-premium-v4.css?v=20260922-1';
      document.head.appendChild(css);
    }

    let js=document.getElementById('pc-premium-v4-js');
    if(!js){
      js=document.createElement('script');
      js.id='pc-premium-v4-js';
      js.src='portal-premium-v4.js?v=20260922-1';
      js.defer=true;
      js.addEventListener('load',ensureSmartCardsV41A,{once:true});
      document.head.appendChild(js);
    }else if(window.__pcPremiumV4){
      ensureSmartCardsV41A();
    }else{
      js.addEventListener('load',ensureSmartCardsV41A,{once:true});
    }

    // Fallback seguro ante caché/carga diferida.
    setTimeout(ensureSmartCardsV41A,1200);
  };

  const base=document.createElement('script');
  base.src='c002-rc-base.js?v=241';
  base.onload=()=>{
    const ensureMercadoPago=()=>{
      const account=document.getElementById('accountBox');
      if(account&&!account.querySelector('.mpTrust')&&!account.querySelector('.pcAccountPaymentTrust')){
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
        // V4.1D: no exponer descargas en el catálogo. Las descargas aparecen sólo dentro de Mi biblioteca con licencia activa.
        card.querySelectorAll('.psqDownloadAction,a[href*="paper-squishy/downloads.html"]').forEach(el=>el.remove());
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
          if(list)list.innerHTML='<div>50 diseños incluidos en 5 colecciones.</div><div>Sweet Squishies, Food Squad, Animal Cuties, Cosmic Friends y Magic Objects.</div><div>PDF Maestro descargable con licencia activa: 157 páginas A4 con frente, dorso y coloring.</div><div>10 diseños nuevos por mes durante 12 meses.</div>';
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