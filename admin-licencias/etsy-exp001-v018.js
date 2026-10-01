(()=>{
  if(window.__pcAdminEtsyExp001V018)return;
  window.__pcAdminEtsyExp001V018=true;

  const CANONICAL='https://pasalochevere.github.io/expediente/portal-v2/?channel=etsy&product=EXP-001&lang=es';
  const QR='../portal-v2/assets/delivery/etsy-exp001-qr.svg';
  const nativeBuyerText=typeof window.buyerText==='function'?window.buyerText:null;
  const nativeSyncChannel=typeof window.syncChannel==='function'?window.syncChannel:null;

  const el=id=>document.getElementById(id);
  function isTarget(lic={}){
    const product=String(lic.product_code||el('product')?.value||'').toUpperCase();
    const source=String(lic.source||'').toLowerCase();
    const channel=String(lic.channel_name||'').toLowerCase();
    const order=String(lic.order_ref||'').toUpperCase();
    const selected=String(el('channel')?.value||'').toUpperCase();
    return product==='EXP-001'&&(source==='etsy'||channel==='etsy'||order.startsWith('ETSY:')||selected==='ETSY');
  }
  function duration(lic){
    if(typeof window.durationText==='function')return window.durationText(lic);
    const h=Number(lic?.duration_hours||0);return h===8760?'12 meses':h===24?'1 día':h&&h%24===0?`${h/24} días`:'vigencia configurada';
  }
  function etsyBuyerText(lic){
    const name=lic.product_name||'EXPEDIENTES · Caso 001 · La Última Reunión';
    const dur=duration(lic);
    return `Hola, gracias por tu compra de ${name} en Etsy.

Tu CÓDIGO DE COMPRA es:
${lic.license_key}

Abrí tu entrega digital de Caso 001 desde este enlace:
${CANONICAL}

1) Tocá “ACTIVAR MI COMPRA DE ETSY”.
2) Verificá el correo que querés asociar a tu biblioteca PasaloChevere.
3) Abrí el enlace mágico que vas a recibir por email.
4) Ingresá este código de compra.
5) Cuando aparezca “TU EXPEDIENTE ESTÁ LISTO”, podés entrar al caso o volver después desde Mis juegos.

Vigencia: ${dur} desde la activación · hasta 2 dispositivos.

Importante: este código de compra se usa para activar. Después de la activación el Portal te muestra tu código personal/licencia.

Si necesitás ayuda, usá los botones de soporte dentro de la entrega digital.`;
  }
  window.buyerText=function(lic){return isTarget(lic)?etsyBuyerText(lic):(nativeBuyerText?nativeBuyerText(lic):'')};

  function syncEtsy(){
    try{nativeSyncChannel?.()}catch{}
    const ch=String(el('channel')?.value||'').toUpperCase();
    const product=String(el('product')?.value||'').toUpperCase();
    if(ch!=='ETSY')return;
    const emailField=el('emailField'),buyerEmail=el('buyerEmail'),label=el('saleLabel'),ref=el('saleRef'),hint=el('channelHint');
    emailField?.classList.add('hidden');
    if(buyerEmail)buyerEmail.value='';
    if(label)label.textContent='Número / referencia de pedido Etsy *';
    if(ref){ref.placeholder='Ej. ETSY-ORDER-001';ref.inputMode='text';ref.maxLength=80}
    if(hint){
      hint.className='msg warn';
      hint.innerHTML=product==='EXP-001'
        ?'<b>Etsy · Caso 001:</b> no pidas email. Generá el código y enviá el mensaje sugerido. El link/QR oficial abre directamente la entrega de EXP-001 y el comprador verifica su propio correo.'
        :'<b>Etsy:</b> no pidas email. El comprador debe verificar su propio correo al activar el acceso.';
    }
  }
  window.syncChannel=syncEtsy;
  if(el('channel'))el('channel').onchange=syncEtsy;
  el('product')?.addEventListener('change',syncEtsy);

  function ensureCommercialBox(){
    const card=el('resultCard');
    if(!card||card.classList.contains('hidden'))return;
    let lic=null;try{if(typeof current!=='undefined')lic=current}catch{}
    if(!lic||!isTarget(lic)){el('pcEtsyFreezeV018')?.remove();return}
    let box=el('pcEtsyFreezeV018');
    if(box)return;
    box=document.createElement('div');box.id='pcEtsyFreezeV018';box.className='msg good';
    box.innerHTML='<b>DELIVERY01.8 · ETSY EXP-001 CONGELADO</b><br>URL/QR oficial: <span class="mono"></span><div class="actions"><button class="btn" type="button" data-copy-link>Copiar link Etsy</button><a class="btn ghost" data-open-qr target="_blank" rel="noopener">Abrir QR oficial</a></div>';
    box.querySelector('.mono').textContent=CANONICAL;
    box.querySelector('[data-open-qr]').href=QR;
    box.querySelector('[data-copy-link]').addEventListener('click',async e=>{
      try{await navigator.clipboard.writeText(CANONICAL)}catch{prompt('Copiá el link:',CANONICAL)}
      const b=e.currentTarget,old=b.textContent;b.textContent='Link copiado';setTimeout(()=>{if(b.isConnected)b.textContent=old},1000);
    });
    card.appendChild(box);
  }

  const result=el('resultCard');
  if(result){
    new MutationObserver(()=>requestAnimationFrame(ensureCommercialBox)).observe(result,{attributes:true,attributeFilter:['class']});
  }
  syncEtsy();
  requestAnimationFrame(ensureCommercialBox);

  window.pcAdminEtsyExp001V018Audit=()=>({
    active:true,canonicalUrl:CANONICAL,qrAsset:QR,
    selectedChannel:el('channel')?.value||'',selectedProduct:el('product')?.value||'',
    resultFrozen:!!el('pcEtsyFreezeV018')
  });
})();