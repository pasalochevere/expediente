(()=>{
  if(window.__pcDeliverySupportV016)return;
  window.__pcDeliverySupportV016=true;

  const ROUTE='etsy-exp001';
  const OFFICIAL={
    email:'pasalochevere@gmail.com',
    whatsappNumber:'5491153774769'
  };
  let applyRaf=0;

  const COPY={
    es:{
      pageTitle:'NECESITO AYUDA',
      pageLead:'Si tenés un problema con el código o con tu acceso, elegí el canal que te resulte más cómodo.',
      gateTitle:'¿TODAVÍA NO RECIBISTE TU CÓDIGO?',
      gateLead:'Tu código de compra es individual. Si todavía no lo recibiste, contactanos indicando tu número de pedido de Etsy.',
      etsy:'AYUDA CON MI COMPRA DE ETSY',
      whatsapp:'WHATSAPP',
      email:'EMAIL',
      etsyHelpTitle:'Desde Etsy',
      etsyHelp:'Abrí Compras y reseñas → elegí este pedido → Contactar con la tienda.',
      note:'No compartas tu código personal en espacios públicos.',
      waText:'Hola PasaloChevere.\n\nCompré Expedientes · Caso 001 en Etsy y necesito ayuda con mi acceso.\n\nNúmero de pedido Etsy:\nCorreo utilizado en la compra:',
      mailSubject:'Acceso Etsy · Expedientes Caso 001',
      mailBody:'Hola.\n\nCompré Expedientes · Caso 001 en Etsy.\n\nNúmero de pedido:\nCorreo utilizado en la compra:\n\nNecesito ayuda con:'
    },
    en:{
      pageTitle:'I NEED HELP',
      pageLead:'If you have a problem with your code or access, choose the support channel that works best for you.',
      gateTitle:'HAVEN’T RECEIVED YOUR CODE YET?',
      gateLead:'Your purchase code is individual. If you have not received it yet, contact us and include your Etsy order number.',
      etsy:'HELP WITH MY ETSY PURCHASE',
      whatsapp:'WHATSAPP',
      email:'EMAIL',
      etsyHelpTitle:'From Etsy',
      etsyHelp:'Open Purchases and reviews → choose this order → Contact the shop.',
      note:'Do not share your personal access code in public spaces.',
      waText:'Hello PasaloChevere.\n\nI bought Expedientes · Case 001 on Etsy and I need help with my access.\n\nEtsy order number:\nEmail used for the purchase:',
      mailSubject:'Etsy access · Expedientes Case 001',
      mailBody:'Hello.\n\nI bought Expedientes · Case 001 on Etsy.\n\nOrder number:\nEmail used for the purchase:\n\nI need help with:'
    }
  };

  function ctx(){return typeof window.pcDeliveryContext==='function'?window.pcDeliveryContext():window.PC_DELIVERY_CONTEXT||null}
  function active(){const c=ctx();return !!c?.deliveryMode&&c.route===ROUTE&&String(c.channel||'').toLowerCase()==='etsy'}
  function lang(){return ctx()?.lang==='en'?'en':'es'}
  function t(){return COPY[lang()]}
  function whatsappUrl(){return 'https://wa.me/'+OFFICIAL.whatsappNumber+'?text='+encodeURIComponent(t().waText)}
  function emailUrl(){return 'mailto:'+OFFICIAL.email+'?subject='+encodeURIComponent(t().mailSubject)+'&body='+encodeURIComponent(t().mailBody)}
  function setText(el,text){if(el&&el.textContent!==text)el.textContent=text}
  function setHref(el,href){if(el&&el.getAttribute('href')!==href)el.setAttribute('href',href)}

  function markup(place){
    const c=t();
    const gate=place==='gate';
    return `<section class="pcD16Support ${gate?'pcD16SupportGate':'pcD16SupportPage'}" data-pcd16-place="${place}" aria-label="${c.pageTitle}">
      <div class="pcD16Head"><span>${gate?'SOS':'?'}</span><div><b>${gate?c.gateTitle:c.pageTitle}</b><p>${gate?c.gateLead:c.pageLead}</p></div></div>
      <div class="pcD16Actions">
        <button type="button" class="pcD16Btn pcD16EtsyBtn" data-pcd16-etsy aria-expanded="false">${c.etsy}</button>
        <a class="pcD16Btn" data-pcd16-whatsapp href="${whatsappUrl()}" target="_blank" rel="noopener">${c.whatsapp}</a>
        <a class="pcD16Btn" data-pcd16-email href="${emailUrl()}">${c.email}</a>
      </div>
      <div class="pcD16EtsyHelp" data-pcd16-help hidden><b>${c.etsyHelpTitle}</b><p>${c.etsyHelp}</p></div>
      <div class="pcD16Note">${c.note}</div>
    </section>`;
  }

  function bind(root){
    if(!root||root.dataset.pcd16Bound==='1')return;
    root.dataset.pcd16Bound='1';
    root.addEventListener('click',e=>{
      const btn=e.target.closest('[data-pcd16-etsy]');
      if(!btn||!root.contains(btn))return;
      const help=root.querySelector('[data-pcd16-help]');
      if(!help)return;
      const open=help.hasAttribute('hidden');
      if(open)help.removeAttribute('hidden');else help.setAttribute('hidden','');
      btn.setAttribute('aria-expanded',open?'true':'false');
    });
  }

  function syncLinks(root){
    if(!root)return;
    const c=t();
    const wa=root.querySelector('[data-pcd16-whatsapp]');if(wa){setHref(wa,whatsappUrl());setText(wa,c.whatsapp)}
    const em=root.querySelector('[data-pcd16-email]');if(em){setHref(em,emailUrl());setText(em,c.email)}
  }

  function applyPage(){
    const page=document.querySelector('.pcD13Page');
    const footer=page?.querySelector('.pcD13Footer');
    if(!page||!footer)return false;
    let block=page.querySelector('.pcD16SupportPage');
    if(!block){
      const holder=document.createElement('div');holder.innerHTML=markup('page');block=holder.firstElementChild;footer.parentNode.insertBefore(block,footer);bind(block);
    }
    syncLinks(block);
    if(!page.classList.contains('pcD16SupportReady'))page.classList.add('pcD16SupportReady');
    return true;
  }

  function applyGate(){
    const step=document.querySelector('#pcAccessGateV50 .pcV50Step[data-step="code"]');
    if(!step)return false;
    let block=step.querySelector('.pcD16SupportGate');
    if(!block){
      const holder=document.createElement('div');holder.innerHTML=markup('gate');block=holder.firstElementChild;
      const footer=step.querySelector('.pcV50Footer');
      if(footer)step.insertBefore(block,footer);else step.appendChild(block);
      bind(block);
    }
    syncLinks(block);
    if(step.dataset.pcDelivery016!=='1')step.dataset.pcDelivery016='1';
    return true;
  }

  function apply(){
    if(!active())return false;
    const page=applyPage();
    const gate=applyGate();
    return page||gate;
  }

  function requestApply(){
    if(!active()||applyRaf)return;
    applyRaf=requestAnimationFrame(()=>{applyRaf=0;apply()});
  }

  window.pcApplyDeliverySupportV016=apply;
  window.pcDeliverySupportV016Audit=()=>({
    active:active(),route:ctx()?.route||'',channel:ctx()?.channel||'',lang:lang(),
    official:{email:OFFICIAL.email,whatsappLast4:OFFICIAL.whatsappNumber.slice(-4)},
    pageBlocks:document.querySelectorAll('.pcD16SupportPage').length,
    gateBlocks:document.querySelectorAll('.pcD16SupportGate').length
  });

  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    const ready=apply()&&!!document.querySelector('.pcD16SupportGate');
    if(ready||tries>90)clearInterval(timer);
  },90);
  const obs=new MutationObserver(requestApply);
  try{obs.observe(document.documentElement,{subtree:true,childList:true})}catch{}
  window.addEventListener('pc:delivery-context',()=>setTimeout(requestApply,0));
})();