(()=>{
  if(window.PC_DELIVERY_FREEZE_V018)return;
  const baseUrl='https://pasalochevere.github.io/expediente/portal-v2/';
  const canonicalUrl=baseUrl+'?channel=etsy&product=EXP-001&lang=es';
  const qrAsset='assets/delivery/etsy-exp001-qr.svg';
  window.PC_DELIVERY_FREEZE_V018=Object.freeze({
    version:'DELIVERY01.8',
    frozenAt:'2026-10-01',
    baseUrl,
    channel:'etsy',
    channelCode:'ETSY',
    product:'EXP-001',
    route:'etsy-exp001',
    defaultLang:'es',
    supportedLangs:Object.freeze(['es','en']),
    canonicalUrl,
    qrAsset,
    commercialDurationHours:8760,
    commercialDurationLabel:'12 meses',
    deviceLimit:2,
    qrContainsPII:false,
    flow:Object.freeze(['delivery','email','magic-link','purchase-code','activation','personal-code','device','success','intro','game']),
    manuallyValidated:Object.freeze({
      contextualEntry:true,
      magicLinkReturn:true,
      purchaseCodeActivation:true,
      successHandoff:true,
      protectedGameEntry:true,
      languageEsToEn:true
    })
  });
})();