(()=>{
  if(window.__pcDeliveryShellV601)return;
  window.__pcDeliveryShellV601=true;

  const SHELL_ID='pcDeliveryShell';
  let busy=false;

  function ctx(){return typeof window.pcDeliveryContext==='function'?window.pcDeliveryContext():window.PC_DELIVERY_CONTEXT||null}
  function active(){return !!ctx()?.deliveryMode}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function status(text,type=''){const el=document.getElementById('pcDeliveryStatus');if(!el)return;el.textContent=text||'';el.className='pcDeliveryStatus'+(type?' '+type:'')}

  function shellHtml(c){
    const channel=esc(c?.channelLabel||c?.channel||'Canal');
    const product=esc(c?.productTitle||c?.product||'Tu producto');
    return `
      <main class="pcDeliveryPage" aria-labelledby="pcDeliveryTitle">
        <div class="pcDeliveryTop">
          <div class="pcDeliveryBrand">PasaloChevere · Delivery</div>
          <div class="pcDeliveryChannel">${channel}</div>
        </div>
        <section class="pcDeliveryCard">
          <div class="pcDeliveryEyebrow">ENTREGA DIGITAL · ${esc(c?.product||'')}</div>
          <h1 class="pcDeliveryTitle" id="pcDeliveryTitle">${product}</h1>
          <p class="pcDeliveryLead">Estás entrando desde una compra ya realizada. Este modo evita el catálogo y te guía solamente por verificación, activación y acceso.</p>
          <div class="pcDeliverySteps" aria-label="Pasos de activación">
            <div class="pcDeliveryStep"><b>01 · CORREO</b><span>Verificá el correo que vas a usar para tu biblioteca.</span></div>
            <div class="pcDeliveryStep"><b>02 · CÓDIGO</b><span>Ingresá el código de compra recibido por el canal de venta.</span></div>
            <div class="pcDeliveryStep"><b>03 · ACCESO</b><span>Una vez activo, entrás al producto desde tu acceso personal.</span></div>
          </div>
          <div class="pcDeliveryActions">
            <button class="pcDeliveryPrimary" id="pcDeliveryContinue" type="button">CONTINUAR CON MI ACCESO</button>
            <button class="pcDeliverySecondary" id="pcDeliveryGeneral" type="button">Ir al Portal general</button>
          </div>
          <div class="pcDeliveryStatus" id="pcDeliveryStatus">Usaremos el mismo sistema de cuenta, licencias y dispositivos del Portal PasaloChevere.</div>
          <div class="pcDeliveryFoot">Delivery Mode no crea una cuenta ni una licencia paralela. Sólo cambia la forma de entrada al Portal.</div>
        </section>
      </main>`;
  }

  function ensureShell(){
    if(!active())return null;
    let shell=document.getElementById(SHELL_ID);
    if(shell)return shell;
    shell=document.createElement('div');
    shell.id=SHELL_ID;
    shell.className='pcDeliveryShell';
    shell.dataset.deliveryRoute=ctx()?.route||'';
    shell.innerHTML=shellHtml(ctx());
    document.body.appendChild(shell);
    shell.querySelector('#pcDeliveryContinue')?.addEventListener('click',beginActivation);
    shell.querySelector('#pcDeliveryGeneral')?.addEventListener('click',()=>{
      if(typeof window.pcDeliveryExit==='function')window.pcDeliveryExit();
      else location.href=location.pathname;
    });
    return shell;
  }

  function show(){
    if(!active())return false;
    ensureShell();
    document.documentElement.classList.add('pcDeliveryModeActive');
    document.body.classList.add('pcDeliveryModeActive');
    return true;
  }

  function hide(){
    document.getElementById(SHELL_ID)?.classList.add('hidden');
    document.body.classList.remove('pcDeliveryModeActive');
    document.documentElement.classList.remove('pcDeliveryModeActive');
  }

  async function waitForGate(max=50){
    for(let i=0;i<max;i++){
      if(typeof window.pcV50RequireEmail==='function')return window.pcV50RequireEmail;
      await new Promise(r=>setTimeout(r,80));
    }
    return null;
  }

  async function beginActivation(){
    if(busy)return;
    busy=true;
    const btn=document.getElementById('pcDeliveryContinue');
    if(btn){btn.disabled=true;btn.textContent='PREPARANDO…'}
    status('Preparando tu verificación…');
    try{
      const gate=await waitForGate();
      if(!gate)throw new Error('El acceso todavía se está cargando. Reintentá en unos segundos.');
      await gate('activate',ctx()?.product||'');
      status('Continuá en la ventana de acceso.');
    }catch(e){
      status(e?.message||'No pude abrir el acceso. Reintentá.','bad');
    }finally{
      busy=false;
      if(btn){btn.disabled=false;btn.textContent='CONTINUAR CON MI ACCESO'}
    }
  }

  function apply(){
    if(!active()){
      document.getElementById(SHELL_ID)?.remove();
      document.body?.classList.remove('pcDeliveryModeActive');
      document.documentElement.classList.remove('pcDeliveryModeActive');
      return false;
    }
    return show();
  }

  window.pcApplyDeliveryV601=apply;
  window.pcDeliveryShow=show;
  window.pcDeliveryHide=hide;
  window.pcDeliveryBeginActivation=beginActivation;

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();