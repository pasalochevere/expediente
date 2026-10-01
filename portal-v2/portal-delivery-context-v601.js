(()=>{
  if(window.__pcDeliveryContextV601)return;
  window.__pcDeliveryContextV601=true;

  const STORAGE_KEY='pc_delivery_context_v1';
  const MAX_AGE_MS=1000*60*60*24;
  const FREEZE=window.PC_DELIVERY_FREEZE_V018||null;
  const CANONICAL_BASE=FREEZE?.baseUrl||'https://pasalochevere.github.io/expediente/portal-v2/';
  const ALLOWED_LANGS=new Set(FREEZE?.supportedLangs||['es','en']);
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
  const cleanLang=v=>{const x=String(v||'').trim().toLowerCase();return ALLOWED_LANGS.has(x)?x:(FREEZE?.defaultLang||'es')};

  function currentUrl(){try{return new URL(location.href)}catch{return new URL(CANONICAL_BASE)}}
  function callbackPresent(u=currentUrl()){
    try{return u.searchParams.has('code')||u.searchParams.has('token_hash')||/(access_token=|refresh_token=|token_hash=|error=)/i.test(u.hash||'')}catch{return false}
  }
  function readStored(){
    try{
      const v=JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'null');
      if(!v||!v.savedAt||Date.now()-Number(v.savedAt)>MAX_AGE_MS)return null;
      const channel=cleanChannel(v.channel),product=cleanProduct(v.product),lang=cleanLang(v.lang);
      if(!ROUTES[`${channel}|${product}`])return null;
      return {...v,channel,product,lang};
    }catch{return null}
  }
  function routeUrl(ctx,extra={}){
    const u=new URL(CANONICAL_BASE);
    u.search='';u.hash='';
    if(ctx.channel)u.searchParams.set('channel',cleanChannel(ctx.channel));
    if(ctx.product)u.searchParams.set('product',cleanProduct(ctx.product));
    if(ctx.lang)u.searchParams.set('lang',cleanLang(ctx.lang));
    Object.entries(extra||{}).forEach(([k,v])=>{
      if(v===undefined||v===null||v==='')return;
      u.searchParams.set(k,String(v));
    });
    return u.toString();
  }

  const url=currentUrl();
  let rawChannel=url.searchParams.get('channel')||'';
  let rawProduct=url.searchParams.get('product')||'';
  let rawLang=url.searchParams.get('lang')||'';
  let restoredFromStorage=false;

  if(callbackPresent(url)&&!rawChannel&&!rawProduct){
    const stored=readStored();
    if(stored){
      rawChannel=stored.channel;rawProduct=stored.product;rawLang=stored.lang;
      url.searchParams.set('channel',stored.channel);
      url.searchParams.set('product',stored.product);
      url.searchParams.set('lang',stored.lang);
      url.searchParams.set('delivery_return','1');
      try{history.replaceState({},document.title,url.pathname+url.search+(url.hash||''));restoredFromStorage=true}catch{}
    }
  }

  const channel=cleanChannel(rawChannel);
  const product=cleanProduct(rawProduct);
  const lang=cleanLang(rawLang||FREEZE?.defaultLang||'es');
  const requested=!!(rawChannel||rawProduct);
  const routeKey=`${channel}|${product}`;
  const route=ROUTES[routeKey]||null;
  const deliveryMode=!!route;

  const ctx=Object.freeze({
    version:'DELIVERY01.8',
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
    magicLinkUrl:'',
    callback:callbackPresent(url),
    restoredFromStorage,
    frozen:!!FREEZE,
    commercialDurationHours:deliveryMode?Number(FREEZE?.commercialDurationHours||8760):null,
    deviceLimit:deliveryMode?Number(FREEZE?.deviceLimit||2):null,
    unsupportedReason:requested&&!deliveryMode?'unsupported-route':''
  });
  const canonical=routeUrl(ctx);
  const magic=deliveryMode?routeUrl(ctx,{activate:'1',delivery_return:'1'}):canonical;
  const withUrl=Object.freeze({...ctx,canonicalUrl:canonical,magicLinkUrl:magic});
  window.PC_DELIVERY_CONTEXT=withUrl;

  function applyDomFlags(){
    const roots=[document.documentElement,document.body].filter(Boolean);
    roots.forEach(root=>{
      root.dataset.pcDeliveryMode=withUrl.deliveryMode?'1':'0';
      root.dataset.pcDeliveryChannel=withUrl.channel||'';
      root.dataset.pcDeliveryProduct=withUrl.product||'';
      root.dataset.pcDeliveryLang=withUrl.lang||'es';
      root.dataset.pcDeliveryRoute=withUrl.route||'';
      root.dataset.pcDeliveryReturn=withUrl.callback||url.searchParams.get('delivery_return')==='1'?'1':'0';
      root.dataset.pcDeliveryFreeze=withUrl.frozen?'DELIVERY01.8':'';
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
        magicLinkUrl:withUrl.magicLinkUrl,
        savedAt:Date.now()
      }));
    }catch{}
  }

  window.pcDeliveryContext=()=>withUrl;
  window.pcDeliveryIsActive=()=>withUrl.deliveryMode;
  window.pcDeliveryCanonicalUrl=()=>withUrl.canonicalUrl;
  window.pcDeliveryMagicLinkUrl=()=>withUrl.magicLinkUrl;
  window.pcDeliveryBuildUrl=(overrides={})=>{
    const next={...withUrl,...overrides};
    next.channel=cleanChannel(next.channel);
    next.product=cleanProduct(next.product);
    next.lang=cleanLang(next.lang);
    return routeUrl(next);
  };
  window.pcDeliveryExit=()=>{
    const u=currentUrl();
    ['channel','product','lang','activate','activar','delivery_return'].forEach(k=>u.searchParams.delete(k));
    try{sessionStorage.removeItem(STORAGE_KEY)}catch{}
    location.replace(u.pathname+(u.search||'')+(u.hash||''));
  };
  window.pcDeliveryStoredContext=readStored;

  window.dispatchEvent(new CustomEvent('pc:delivery-context',{detail:withUrl}));
})();