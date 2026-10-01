(()=>{
  if(window.__pcDeliveryContextV601)return;
  window.__pcDeliveryContextV601=true;

  const STORAGE_KEY='pc_delivery_context_v1';
  const ALLOWED_LANGS=new Set(['es','en']);
  const ROUTES={
    'etsy|EXP-001':{
      route:'etsy-exp001',
      channel:'etsy',
      channelLabel:'Etsy',
      product:'EXP-001',
      productTitle:'EXPEDIENTES · Caso 001 — La Última Reunión'
    }
  };

  const cleanChannel=v=>String(v||'').trim().toLowerCase().replace(/[^a-z0-9_-]/g,'').slice(0,32);
  const cleanProduct=v=>String(v||'').trim().toUpperCase().replace(/[^A-Z0-9_-]/g,'').slice(0,48);
  const cleanLang=v=>{const x=String(v||'').trim().toLowerCase();return ALLOWED_LANGS.has(x)?x:'es'};

  function currentUrl(){try{return new URL(location.href)}catch{return new URL('https://pasalochevere.github.io/expediente/portal-v2/')}}
  function canonicalUrl(ctx){
    const u=currentUrl();
    u.hash='';
    ['channel','product','lang'].forEach(k=>u.searchParams.delete(k));
    if(ctx.channel)u.searchParams.set('channel',ctx.channel);
    if(ctx.product)u.searchParams.set('product',ctx.product);
    if(ctx.lang)u.searchParams.set('lang',ctx.lang);
    return u.toString();
  }

  const url=currentUrl();
  const rawChannel=url.searchParams.get('channel')||'';
  const rawProduct=url.searchParams.get('product')||'';
  const rawLang=url.searchParams.get('lang')||'';
  const channel=cleanChannel(rawChannel);
  const product=cleanProduct(rawProduct);
  const lang=cleanLang(rawLang||'es');
  const requested=!!(rawChannel||rawProduct);
  const routeKey=`${channel}|${product}`;
  const route=ROUTES[routeKey]||null;
  const deliveryMode=!!route;

  const ctx=Object.freeze({
    version:'DELIVERY01.2',
    requested,
    deliveryMode,
    supported:deliveryMode,
    channel,
    product,
    lang,
    route:route?.route||'',
    channelLabel:route?.channelLabel||channel,
    productTitle:route?.productTitle||product,
    canonicalUrl:'',
    unsupportedReason:requested&&!deliveryMode?'unsupported-route':''
  });
  const withUrl=Object.freeze({...ctx,canonicalUrl:canonicalUrl(ctx)});
  window.PC_DELIVERY_CONTEXT=withUrl;

  function applyDomFlags(){
    const roots=[document.documentElement,document.body].filter(Boolean);
    roots.forEach(root=>{
      root.dataset.pcDeliveryMode=withUrl.deliveryMode?'1':'0';
      root.dataset.pcDeliveryChannel=withUrl.channel||'';
      root.dataset.pcDeliveryProduct=withUrl.product||'';
      root.dataset.pcDeliveryLang=withUrl.lang||'es';
      root.dataset.pcDeliveryRoute=withUrl.route||'';
      root.classList.toggle('pcDeliveryMode',withUrl.deliveryMode);
      if(withUrl.deliveryMode){
        root.classList.add('pcDeliveryModeActive');
        if(withUrl.channel)root.classList.add('pcDeliveryChannel-'+withUrl.channel.replace(/[^a-z0-9_-]/g,''));
        if(withUrl.product)root.classList.add('pcDeliveryProduct-'+withUrl.product.replace(/[^A-Z0-9_-]/g,''));
      }
    });
  }

  if(document.body)applyDomFlags();
  else document.addEventListener('DOMContentLoaded',applyDomFlags,{once:true});

  if(withUrl.deliveryMode){
    try{
      sessionStorage.setItem(STORAGE_KEY,JSON.stringify({
        version:withUrl.version,
        channel:withUrl.channel,
        product:withUrl.product,
        lang:withUrl.lang,
        route:withUrl.route,
        canonicalUrl:withUrl.canonicalUrl,
        savedAt:Date.now()
      }));
    }catch{}
  }

  window.pcDeliveryContext=()=>withUrl;
  window.pcDeliveryIsActive=()=>withUrl.deliveryMode;
  window.pcDeliveryCanonicalUrl=()=>withUrl.canonicalUrl;
  window.pcDeliveryBuildUrl=(overrides={})=>{
    const next={...withUrl,...overrides};
    next.channel=cleanChannel(next.channel);
    next.product=cleanProduct(next.product);
    next.lang=cleanLang(next.lang);
    return canonicalUrl(next);
  };
  window.pcDeliveryExit=()=>{
    const u=currentUrl();
    ['channel','product','lang'].forEach(k=>u.searchParams.delete(k));
    try{sessionStorage.removeItem(STORAGE_KEY)}catch{}
    location.replace(u.pathname+(u.search||'')+(u.hash||''));
  };
  window.pcDeliveryStoredContext=()=>{
    try{return JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'null')}catch{return null}
  };

  window.dispatchEvent(new CustomEvent('pc:delivery-context',{detail:withUrl}));
})();