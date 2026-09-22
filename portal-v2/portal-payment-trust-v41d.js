(()=>{
  if(window.__pcPaymentTrustV41D)return;
  window.__pcPaymentTrustV41D=true;

  const norm=(v)=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
  const PRODUCT_NAMES={
    'DI-TRILOGIA':'Doble Intención',
    'TK-MAT-79-PHY':'Chévere Kids · Matemática',
    'TK-MAT-79-DIG':'Chévere Kids · Matemática',
    'TORRE-MEGA':'Verdad o Reto +800',
    'EXP-001':'La Última Reunión',
    'EXP-002':'Hotel Orfeo · 317',
    'VINC-001':'Víncores',
    'PSQ-FACTORY':'Paper Squishy Factory'
  };

  const formatPrice=(v)=>{
    const n=Number(v||0);
    return n>0?new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n):'';
  };

  function productCodeForCard(card){
    if(card?.dataset?.productCode)return card.dataset.productCode;
    const type=String(card?.dataset?.pcV4Type||'').toLowerCase();
    const text=norm(card?.dataset?.pcTechnicalTitle||card?.dataset?.pcCommercialTitle||card?.textContent||'');
    if(type==='squishy'||text.includes('PAPER SQUISHY'))return 'PSQ-FACTORY';
    if(type==='exp001'||text.includes('CASO 001')||text.includes('ULTIMA REUNION'))return 'EXP-001';
    if(type==='exp002'||text.includes('CASO 002')||text.includes('HOTEL ORFEO')||text.includes('317'))return 'EXP-002';
    if(type==='doble'||text.includes('DOBLE INTENCION'))return 'DI-TRILOGIA';
    if(type==='party'||text.includes('VERDAD O RETO')||text.includes('MEGA PACK'))return 'TORRE-MEGA';
    if(type==='vincores'||text.includes('VINCORES'))return 'VINC-001';
    if(type==='math'||text.includes('MATEMATICA')){
      if(text.includes('FISICO'))return 'TK-MAT-79-PHY';
      return 'TK-MAT-79-DIG';
    }
    return '';
  }

  function productData(code){
    try{
      if(typeof publicCatalog!=='undefined'&&publicCatalog?.[code])return publicCatalog[code];
    }catch{}
    return null;
  }

  /* Seguridad visual: nunca ofrecer descargas de PSQ desde catálogo público. */
  function removePublicDownloadLinks(){
    document.querySelectorAll('.categoryDrawer .psqDownloadAction,.categoryDrawer a[href*="paper-squishy/downloads.html"]').forEach(el=>el.remove());
    document.querySelectorAll('.categoryDrawer .card[data-product-code="PSQ-FACTORY"]').forEach(card=>{
      if(card.querySelector('.pcIncludedWithLicense'))return;
      const price=card.querySelector('.productPrice');
      const note=document.createElement('div');
      note.className='pcIncludedWithLicense';
      note.innerHTML='<span class="pcLockGlyph" aria-hidden="true">⌁</span><span><strong>Imprimibles incluidos con licencia activa</strong><small>La descarga se habilita desde Mi biblioteca después de activar la compra.</small></span>';
      if(price)price.insertAdjacentElement('afterend',note);else card.appendChild(note);
    });
  }

  function ensureTrustStrip(card){
    if(!card||card.querySelector('.pcPayTrustMini'))return;
    const code=productCodeForCard(card);
    if(!code)return;
    const prod=productData(code);
    const strip=document.createElement('div');
    strip.className='pcPayTrustMini';
    const online=!!(prod?.sales_enabled&&Number(prod.price_ars)>0);
    strip.innerHTML=online
      ? '<span class="pcMpDot" aria-hidden="true"></span><span><strong>Pago online con Mercado Pago</strong><small>La compra queda vinculada a tu correo verificado.</small></span>'
      : '<span class="pcKeyDot" aria-hidden="true"></span><span><strong>Activación vinculada a tu cuenta</strong><small>Si ya compraste, ingresá tu código de compra para habilitar el acceso.</small></span>';
    const actions=card.querySelector('.actions');
    if(actions)actions.insertAdjacentElement('beforebegin',strip);else card.appendChild(strip);
  }

  function polishCatalogActions(){
    document.querySelectorAll('.categoryDrawer .card').forEach(card=>{
      if(card.classList.contains('emptyCard'))return;
      const code=productCodeForCard(card);
      if(!code)return;
      const actions=card.querySelector('.actions');
      if(actions){
        [...actions.querySelectorAll('button,a')].forEach(el=>{
          const t=norm(el.textContent);
          if(t==='ACTIVAR COMPRA')el.textContent='YA COMPRÉ · ACTIVAR';
        });
      }
      ensureTrustStrip(card);
    });
  }

  /* Descargas PSQ: sólo dentro de una Smart Card ACTIVA. La página de descargas vuelve a validar sesión + licencia. */
  function installOwnedPsqDownload(){
    document.querySelectorAll('#myGamesGrid .pcSmartCard').forEach(card=>{
      const code=productCodeForCard(card);
      const existing=card.querySelector('.pcOwnedDownload');
      const active=card.classList.contains('smartStateActive');
      if(code!=='PSQ-FACTORY'||!active){if(existing)existing.remove();return}
      if(existing)return;
      const details=card.querySelector('.pcSmartDetailsContent');
      if(!details)return;
      let secondary=details.querySelector('.pcSmartSecondaryActions');
      if(!secondary){secondary=document.createElement('div');secondary.className='pcSmartSecondaryActions';details.appendChild(secondary)}
      const link=document.createElement('a');
      link.className='btn pcOwnedDownload';
      link.href='../paper-squishy/downloads.html';
      link.innerHTML='<span aria-hidden="true">↓</span> DESCARGAR IMPRIMIBLES';
      link.setAttribute('aria-label','Descargar imprimibles de Paper Squishy Factory');
      secondary.appendChild(link);
    });
  }

  function ensureCheckoutModal(){
    let modal=document.getElementById('pcCheckoutTrustModal');
    if(modal)return modal;
    modal=document.createElement('div');
    modal.id='pcCheckoutTrustModal';
    modal.className='pcCheckoutTrustModal hidden';
    modal.setAttribute('role','dialog');
    modal.setAttribute('aria-modal','true');
    modal.setAttribute('aria-labelledby','pcCheckoutTitle');
    modal.innerHTML=`<div class="pcCheckoutTrustDialog">
      <button class="pcCheckoutClose" type="button" aria-label="Cerrar">×</button>
      <div class="pcCheckoutEyebrow">COMPRA ONLINE</div>
      <h2 id="pcCheckoutTitle">Continuar con Mercado Pago</h2>
      <div class="pcCheckoutProduct"><span id="pcCheckoutProductName">Producto</span><strong id="pcCheckoutPrice"></strong></div>
      <div class="pcCheckoutEmail" id="pcCheckoutEmail"></div>
      <div class="pcCheckoutFacts">
        <div><i>1</i><span><b>Cuenta verificada</b><small>La compra se inicia desde el correo con el que ingresaste al Portal.</small></span></div>
        <div><i>2</i><span><b>Pago en Mercado Pago</b><small>Al continuar vas al checkout de Mercado Pago para completar la operación.</small></span></div>
        <div><i>3</i><span><b>Acceso después de la aprobación</b><small>Cuando el pago quede aprobado, el producto aparecerá en Mi biblioteca para activarlo.</small></span></div>
      </div>
      <div class="pcCheckoutActions"><button class="btn" type="button" data-action="cancel">VOLVER</button><button class="btn primary" type="button" data-action="continue">CONTINUAR A MERCADO PAGO</button></div>
      <div class="pcCheckoutFine">PasaloChevere no solicita datos de tarjeta dentro de este Portal.</div>
    </div>`;
    document.body.appendChild(modal);
    const close=()=>modal.classList.add('hidden');
    modal.querySelector('.pcCheckoutClose').onclick=close;
    modal.querySelector('[data-action="cancel"]').onclick=close;
    modal.addEventListener('click',e=>{if(e.target===modal)close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.classList.contains('hidden'))close()});
    return modal;
  }

  let originalBuyNow=null;
  function installCheckoutGate(){
    if(window.__pcCheckoutGateV41D)return;
    if(typeof window.buyNow!=='function')return;
    originalBuyNow=window.buyNow;
    window.__pcCheckoutGateV41D=true;
    window.buyNow=async function(productCode){
      let session=null;
      try{session=(await sb.auth.getSession())?.data?.session||null}catch{}
      if(!session?.user?.email||session.user.is_anonymous)return originalBuyNow(productCode);

      const prod=productData(productCode);
      const modal=ensureCheckoutModal();
      modal.querySelector('#pcCheckoutProductName').textContent=PRODUCT_NAMES[productCode]||prod?.product_name||productCode;
      modal.querySelector('#pcCheckoutPrice').textContent=formatPrice(prod?.price_ars)||'Precio informado en el checkout';
      modal.querySelector('#pcCheckoutEmail').innerHTML='<span>Compra asociada a</span><strong>'+escapeHtmlSafe(session.user.email)+'</strong>';
      modal.classList.remove('hidden');
      const go=modal.querySelector('[data-action="continue"]');
      go.onclick=()=>{modal.classList.add('hidden');originalBuyNow(productCode)};
    };
  }

  function escapeHtmlSafe(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

  function paymentState(){
    const title=norm(document.getElementById('paymentTitle')?.textContent);
    const text=norm(document.getElementById('paymentText')?.textContent);
    if(title.includes('CONFIRMADO'))return {key:'approved',label:'PAGO CONFIRMADO',steps:['Pago aprobado','Compra vinculada a tu cuenta','Producto disponible en Mi biblioteca']};
    if(title.includes('RECIBIDO')||text.includes('CONFIRMANDO'))return {key:'checking',label:'VERIFICANDO PAGO',steps:['Pago enviado','Esperando confirmación de Mercado Pago','El acceso aparecerá automáticamente']};
    if(title.includes('PENDIENTE'))return {key:'pending',label:'PAGO PENDIENTE',steps:['Operación iniciada','Mercado Pago todavía la está procesando','No necesitás volver a pagar']};
    if(title.includes('NO COMPLETADO'))return {key:'failed',label:'PAGO NO COMPLETADO',steps:['No se acreditó la compra','Podés volver a intentar','También podés contactar soporte']};
    return null;
  }

  function enhancePaymentNotice(){
    const box=document.getElementById('paymentNotice');
    if(!box||box.classList.contains('hidden'))return;
    const state=paymentState();
    if(!state)return;
    box.dataset.pcPaymentState=state.key;
    let badge=box.querySelector('.pcPaymentStateBadge');
    if(!badge){badge=document.createElement('div');badge.className='pcPaymentStateBadge';box.querySelector('.eyebrow')?.insertAdjacentElement('afterend',badge)}
    badge.textContent=state.label;
    let steps=box.querySelector('.pcPaymentSteps');
    if(!steps){steps=document.createElement('div');steps.className='pcPaymentSteps';box.appendChild(steps)}
    steps.innerHTML=state.steps.map((x,i)=>'<div><i>'+(i+1)+'</i><span>'+escapeHtmlSafe(x)+'</span></div>').join('');
  }

  function enhanceAccountTrust(){
    const account=document.getElementById('accountBox');
    if(!account||account.querySelector('.pcAccountPaymentTrust'))return;
    const panel=document.createElement('div');
    panel.className='pcAccountPaymentTrust';
    panel.innerHTML='<div class="pcAccountPayBrand"><span class="pcMpMark">MP</span><span><strong>Mercado Pago integrado</strong><small>Compra online vinculada a tu cuenta PasaloChevere.</small></span></div><div class="pcAccountPaySteps"><span>1 · Comprás</span><span>2 · Se acredita</span><span>3 · Aparece en Mi biblioteca</span></div>';
    const old=account.querySelector('.mpTrust');
    if(old)old.replaceWith(panel);else account.appendChild(panel);
  }

  function applyAll(){
    removePublicDownloadLinks();
    polishCatalogActions();
    installOwnedPsqDownload();
    enhancePaymentNotice();
    enhanceAccountTrust();
    installCheckoutGate();
  }

  function watch(){
    if(document.documentElement.dataset.pcPayObserved==='1')return;
    document.documentElement.dataset.pcPayObserved='1';
    let queued=false;
    const observer=new MutationObserver(()=>{
      if(queued)return;
      queued=true;
      requestAnimationFrame(()=>{queued=false;applyAll()});
    });
    observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }

  function boot(){watch();applyAll()}
  window.pcApplyPaymentTrust=boot;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  setTimeout(boot,350);setTimeout(boot,1100);setTimeout(boot,2400);
})();