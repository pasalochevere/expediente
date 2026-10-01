(()=>{
  if(window.__pcDeliveryExp001V013)return;
  window.__pcDeliveryExp001V013=true;

  const ROUTE='etsy-exp001';
  const IMG='../caso001/assets/escenas/sala-estar.jpg';
  const WA='https://wa.me/5491153774769?text=Hola%20PasaloChevere%2C%20necesito%20ayuda%20para%20activar%20EXPEDIENTES%20Caso%20001%20comprado%20en%20Etsy.';

  const COPY={
    es:{
      channel:'COMPRA DE ETSY',
      overline:'EXPEDIENTES · CASO 001',
      title:'La Última Reunión',
      subtitle:'Activá tu compra y entrá al expediente.',
      lead:'Usá el mismo correo con el que querés conservar tu biblioteca PasaloChevere. No necesitás contraseña.',
      cta:'ACTIVAR MI COMPRA DE ETSY',
      library:'YA TENGO ACCESO · IR A MIS JUEGOS',
      general:'Ir al Portal general',
      proof1:'12 MESES',proof1b:'desde la activación',
      proof2:'2 DISPOSITIVOS',proof2b:'por licencia',
      proof3:'ACCESO PERSONAL',proof3b:'asociado a tu correo',
      step1:'1 · VERIFICÁ TU CORREO',step1b:'Te enviamos un enlace mágico. Abrilo en este mismo navegador.',
      step2:'2 · INGRESÁ TU CÓDIGO',step2b:'Usá el código de compra que recibiste con la entrega de Etsy.',
      step3:'3 · ABRÍ EL EXPEDIENTE',step3b:'Después de activar, Caso 001 queda disponible en Mis juegos.',
      codeTitle:'¿Dónde está mi código?',
      codeText:'Es el código de compra entregado junto con tu compra de Etsy. No es el código personal que se genera después de activar.',
      secure:'La activación usa el Portal de Activación PasaloChevere existente: correo verificado → código de compra → licencia → dispositivo. No se crea una cuenta paralela.',
      support:'¿Necesitás ayuda?',supportBtn:'WHATSAPP SOPORTE',
      status:'Tu compra todavía no se modifica hasta que ingreses el código y confirmes la activación.'
    },
    en:{
      channel:'ETSY PURCHASE',
      overline:'EXPEDIENTES · CASE 001',
      title:'The Last Meeting',
      subtitle:'Activate your purchase and open the case file.',
      lead:'Use the email you want to keep linked to your PasaloChevere library. No password is required.',
      cta:'ACTIVATE MY ETSY PURCHASE',
      library:'I ALREADY HAVE ACCESS · MY GAMES',
      general:'Go to general Portal',
      proof1:'12 MONTHS',proof1b:'from activation',
      proof2:'2 DEVICES',proof2b:'per license',
      proof3:'PERSONAL ACCESS',proof3b:'linked to your email',
      step1:'1 · VERIFY YOUR EMAIL',step1b:'We send you a magic link. Open it in this same browser.',
      step2:'2 · ENTER YOUR CODE',step2b:'Use the purchase code delivered with your Etsy order.',
      step3:'3 · OPEN THE CASE',step3b:'After activation, Case 001 appears in My games.',
      codeTitle:'Where is my code?',
      codeText:'It is the purchase code delivered with your Etsy purchase. It is not the personal access code generated after activation.',
      secure:'Activation uses the existing PasaloChevere Activation Portal: verified email → purchase code → license → device. No parallel account is created.',
      support:'Need help?',supportBtn:'WHATSAPP SUPPORT',
      status:'Your purchase is not modified until you enter the code and confirm activation.'
    }
  };

  function ctx(){return typeof window.pcDeliveryContext==='function'?window.pcDeliveryContext():window.PC_DELIVERY_CONTEXT||null}
  function active(){const c=ctx();return !!c?.deliveryMode&&c.route===ROUTE}
  function lang(){return ctx()?.lang==='en'?'en':'es'}
  function t(){return COPY[lang()]}
  function shell(){return document.getElementById('pcDeliveryShell')}

  function markup(){
    const c=t();
    return `<main class="pcD13Page" aria-labelledby="pcD13Title">
      <header class="pcD13Top">
        <div class="pcD13Brand"><span>PasaloChevere</span><small>EXPEDIENTES</small></div>
        <div class="pcD13TopRight">
          <div class="pcD13Lang" role="group" aria-label="Idioma / Language">
            <button type="button" data-pcd13-lang="es" class="${lang()==='es'?'active':''}">ES</button><i></i><button type="button" data-pcd13-lang="en" class="${lang()==='en'?'active':''}">EN</button>
          </div>
          <div class="pcD13Channel">${c.channel}</div>
        </div>
      </header>

      <section class="pcD13Hero">
        <div class="pcD13Visual" aria-hidden="true">
          <img src="${IMG}" alt="">
          <div class="pcD13VisualShade"></div>
          <div class="pcD13Stamp">ETSY<br>DELIVERY</div>
          <div class="pcD13CaseNo">EXP-001</div>
        </div>
        <div class="pcD13Copy">
          <div class="pcD13Eyebrow">${c.overline}</div>
          <h1 id="pcD13Title">${c.title}</h1>
          <h2>${c.subtitle}</h2>
          <p class="pcD13Lead">${c.lead}</p>

          <div class="pcD13Proofs">
            <div><b>${c.proof1}</b><span>${c.proof1b}</span></div>
            <div><b>${c.proof2}</b><span>${c.proof2b}</span></div>
            <div><b>${c.proof3}</b><span>${c.proof3b}</span></div>
          </div>

          <div class="pcD13Actions">
            <button class="pcD13Primary" id="pcD13Activate" type="button">${c.cta}</button>
            <button class="pcD13Library" id="pcD13Library" type="button">${c.library}</button>
          </div>
          <div class="pcD13Status" id="pcDeliveryStatus">${c.status}</div>
        </div>
      </section>

      <section class="pcD13Steps" aria-label="Activation flow">
        <article><span>01</span><div><b>${c.step1}</b><p>${c.step1b}</p></div></article>
        <article><span>02</span><div><b>${c.step2}</b><p>${c.step2b}</p></div></article>
        <article><span>03</span><div><b>${c.step3}</b><p>${c.step3b}</p></div></article>
      </section>

      <section class="pcD13InfoGrid">
        <article class="pcD13Info"><div class="pcD13InfoIcon">#</div><div><b>${c.codeTitle}</b><p>${c.codeText}</p></div></article>
        <article class="pcD13Info secure"><div class="pcD13InfoIcon">✓</div><div><b>Portal PasaloChevere</b><p>${c.secure}</p></div></article>
      </section>

      <footer class="pcD13Footer">
        <div><b>${c.support}</b><a href="${WA}" target="_blank" rel="noopener">${c.supportBtn}</a></div>
        <button type="button" id="pcD13General">${c.general}</button>
      </footer>
    </main>`;
  }

  function changeLang(next){
    if(next!== 'es' && next!=='en')return;
    if(typeof window.pcDeliveryBuildUrl==='function')location.href=window.pcDeliveryBuildUrl({lang:next});
  }

  async function openLibrary(){
    if(typeof window.pcDeliveryHide==='function')window.pcDeliveryHide();
    if(typeof window.pcV50OpenLibrary==='function'){await window.pcV50OpenLibrary();return}
    location.href=location.pathname;
  }

  function bind(root){
    root.querySelector('#pcD13Activate')?.addEventListener('click',()=>window.pcDeliveryBeginActivation?.());
    root.querySelector('#pcD13Library')?.addEventListener('click',openLibrary);
    root.querySelector('#pcD13General')?.addEventListener('click',()=>window.pcDeliveryExit?.());
    root.querySelectorAll('[data-pcd13-lang]').forEach(b=>b.addEventListener('click',()=>changeLang(b.dataset.pcd13Lang)));
  }

  function apply(){
    if(!active())return false;
    const root=shell();
    if(!root)return false;
    document.documentElement.lang=lang();
    if(root.dataset.delivery013==='1')return true;
    root.innerHTML=markup();
    root.dataset.delivery013='1';
    root.dataset.deliveryRoute=ROUTE;
    root.classList.add('pcDeliveryExp001V013');
    bind(root);
    return true;
  }

  window.pcApplyDeliveryExp001V013=apply;
  window.pcDeliveryExp001V013Active=active;

  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(apply()||tries>50)clearInterval(timer);
  },80);
})();