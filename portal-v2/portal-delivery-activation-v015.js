(()=>{
  if(window.__pcDeliveryActivationV015)return;
  window.__pcDeliveryActivationV015=true;

  const ROUTE='etsy-exp001';
  let nativeActivate=null;
  let wrapped=false;
  let lastResult=null;

  function ctx(){return typeof window.pcDeliveryContext==='function'?window.pcDeliveryContext():window.PC_DELIVERY_CONTEXT||null}
  function active(){const c=ctx();return !!c?.deliveryMode&&c.route===ROUTE&&c.product==='EXP-001'}
  function legacyMsg(text,type=''){
    const el=document.getElementById('activateMsg');
    if(!el)return;
    el.textContent=text||'';
    el.className='msg'+(type?' '+type:'');
  }
  function safeText(el,text){if(el)el.textContent=text}

  function patchGateCopy(){
    if(!active())return false;
    const gate=document.getElementById('pcAccessGateV50');
    const step=gate?.querySelector('.pcV50Step[data-step="code"]');
    if(!step)return false;

    const eyebrow=step.querySelector('.pcV50Eyebrow');
    const title=step.querySelector('h2');
    const lead=step.querySelector('.pcV50Lead');
    const input=step.querySelector('#pcV50Code');
    const button=step.querySelector('#pcV50CodeBtn');
    const msg=step.querySelector('#pcV50CodeMsg');

    safeText(eyebrow,'PASO 2 · ACTIVÁ TU COMPRA');
    safeText(title,'Ingresá tu código de compra.');
    safeText(lead,'Pegá el código individual que recibiste con la entrega de Etsy. Este código se usa para activar Caso 001 en tu cuenta.');
    if(input)input.placeholder='Código de compra';
    safeText(button,'ACTIVAR CASO 001');
    if(msg&&!msg.classList.contains('bad')&&!msg.classList.contains('good'))safeText(msg,'La vigencia comienza al activar. Después vas a recibir tu código personal de acceso.');

    if(!step.querySelector('.pcD15CodeExplain')){
      const info=document.createElement('div');
      info.className='pcD15CodeExplain';
      info.innerHTML='<div><b>CÓDIGO DE COMPRA</b><span>Activa esta compra una sola vez.</span></div><i></i><div><b>CÓDIGO PERSONAL / LICENCIA</b><span>Se genera o queda asociado después de activar y es tu acceso al expediente.</span></div>';
      const footer=step.querySelector('.pcV50Footer');
      if(footer)step.insertBefore(info,footer);else step.appendChild(info);
    }
    step.dataset.pcDelivery015='1';
    return true;
  }

  async function contextualActivate(){
    const c=ctx();
    const input=document.getElementById('purchaseCode');
    const raw=String(input?.value||'').trim();
    if(!raw){legacyMsg('Ingresá el código de compra que recibiste con tu pedido de Etsy.','bad');return}
    if(typeof window.callAccess!=='function')throw new Error('La activación todavía se está cargando. Probá nuevamente en unos segundos.');

    const legacyBtn=document.getElementById('activateBtn');
    if(legacyBtn)legacyBtn.disabled=true;
    legacyMsg('Validando el código de compra y activando Caso 001…');

    try{
      const d=await window.callAccess({
        action:'activate',
        purchase_code:raw,
        expected_product_code:c?.product||'EXP-001',
        device_id:typeof window.deviceId==='function'?window.deviceId():undefined,
        device_label:typeof window.deviceLabel==='function'?window.deviceLabel():undefined
      });
      if(!d?.license)throw new Error('El código fue procesado pero no devolvió una licencia válida de Caso 001.');
      if(String(d.license.product_code||'').toUpperCase()!=='EXP-001')throw new Error('Este código no corresponde a EXPEDIENTES · Caso 001.');

      lastResult={
        product_code:d.license.product_code,
        activation_code:d.license.activation_code||'',
        activated_at:d.license.activated_at||null,
        expires_at:d.license.expires_at||null,
        duration_hours:Number(d.license.duration_hours||0),
        device_limit:Number(d.license.device_limit||0)
      };
      legacyMsg('✅ Compra activada. Tu código personal es '+(d.license.activation_code||'el asignado a tu licencia')+'.','good');
      if(input)input.value='';
      try{if(typeof window.loadMyGames==='function')await window.loadMyGames()}catch{}
      window.dispatchEvent(new CustomEvent('pc:delivery-activation-success',{detail:{...lastResult}}));
      return d;
    }catch(e){
      const text=String(e?.message||e||'No se pudo activar Caso 001.');
      legacyMsg(text,'bad');
      window.dispatchEvent(new CustomEvent('pc:delivery-activation-error',{detail:{product:'EXP-001',message:text}}));
      throw e;
    }finally{
      if(legacyBtn)legacyBtn.disabled=false;
    }
  }

  function install(){
    if(wrapped)return true;
    if(typeof window.activatePurchase!=='function')return false;
    nativeActivate=window.activatePurchase;
    window.__pcNativeActivatePurchaseV015=nativeActivate;
    window.activatePurchase=async function(){
      if(!active())return nativeActivate.apply(this,arguments);
      return contextualActivate();
    };
    wrapped=true;
    return true;
  }

  function apply(){
    if(!active())return false;
    install();
    return patchGateCopy();
  }

  window.pcApplyDeliveryActivationV015=apply;
  window.pcDeliveryActivationV015Audit=()=>({
    active:active(),
    wrapped,
    product:ctx()?.product||'',
    route:ctx()?.route||'',
    gatePatched:document.querySelector('.pcV50Step[data-step="code"]')?.dataset.pcDelivery015==='1',
    lastResult:lastResult?{...lastResult}:null
  });

  if(!install()){
    let tries=0;
    const t=setInterval(()=>{tries++;if(install()||tries>60)clearInterval(t)},80);
  }
  let tries=0;
  const gateTimer=setInterval(()=>{tries++;if(apply()||tries>80)clearInterval(gateTimer)},80);
  const obs=new MutationObserver(()=>{if(active())patchGateCopy()});
  try{obs.observe(document.documentElement,{subtree:true,childList:true})}catch{}
})();